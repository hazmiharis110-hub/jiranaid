// src/store/useAuthStore.ts
import { create } from "zustand";
import type { User, Neighborhood } from "../types";
import authService, { type RegisterPayload } from "../services/authService";

interface AuthState {
  currentUser: User | null;
  neighborhoods: Neighborhood[];
  currentNeighborhood: Neighborhood | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchInitialData: () => Promise<void>;
  login: (credentials: {
    email?: string;
    userId?: number | string;
    password?: string;
  }) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
  switchUser: (userId: number | string) => Promise<void>;
  setCurrentNeighborhood: (neighborhood: Neighborhood) => void;
  verifyLocation: (
    neighborhoodId: number | string,
    postcode: string,
    method?: string,
  ) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  neighborhoods: [],
  currentNeighborhood: null,
  isLoading: false,
  error: null,

  fetchInitialData: async () => {
    set({ isLoading: true, error: null });
    try {
      // 1. Immediately hydrate from localStorage if available (prevents UI flicker)
      const savedUserStr = localStorage.getItem("user");
      let cachedUser: User | null = null;
      if (savedUserStr) {
        try {
          cachedUser = JSON.parse(savedUserStr);
        } catch {}
      }

      if (cachedUser && !get().currentUser) {
        set({ currentUser: cachedUser });
      }

      // 2. Fetch fresh user & neighborhoods from backend API
      const [neighRes, meRes] = await Promise.all([
        authService.getNeighborhoods(),
        authService.getCurrentUser(),
      ]);

      const neighborhoods = neighRes.neighborhoods || neighRes || [];
      const currentUser = meRes.user || cachedUser || null;

      let currentNeighborhood: Neighborhood | null = null;
      if (currentUser) {
        const targetNeighId =
          currentUser.neighborhood_id ?? (currentUser as any).neighborhoodId;
        if (targetNeighId) {
          currentNeighborhood =
            neighborhoods.find(
              (n) =>
                n.id === targetNeighId ||
                String(n.id) === String(targetNeighId),
            ) || null;
        }
      }
      if (!currentNeighborhood && neighborhoods.length > 0) {
        currentNeighborhood = neighborhoods[0];
      }

      // Keep localStorage in sync with latest user data
      if (currentUser) {
        localStorage.setItem("user", JSON.stringify(currentUser));
        localStorage.setItem("jiranaid_userId", String(currentUser.id));
      }

      set({
        neighborhoods,
        currentUser,
        currentNeighborhood,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authService.login(credentials);
      if (!res || res.success === false || (!res.user && !res.token)) {
        throw new Error(res?.message || "Invalid email or password");
      }
      const user = res.user;
      const { neighborhoods } = get();
      const targetNeighId =
        user?.neighborhood_id ?? (user as any)?.neighborhoodId;
      const currentNeighborhood =
        neighborhoods.find(
          (n) =>
            n.id === targetNeighId || String(n.id) === String(targetNeighId),
        ) || get().currentNeighborhood;

      set({ currentUser: user, currentNeighborhood, isLoading: false });
      return user;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authService.register(payload);
      const user = res.user;
      const { neighborhoods } = get();
      const targetNeighId =
        user.neighborhood_id ?? (user as any).neighborhoodId;
      const currentNeighborhood =
        neighborhoods.find(
          (n) =>
            n.id === targetNeighId || String(n.id) === String(targetNeighId),
        ) || get().currentNeighborhood;

      set({ currentUser: user, currentNeighborhood, isLoading: false });
      return user;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } finally {
      set({ currentUser: null });
    }
  },

  switchUser: async (userId: number | string) => {
    set({ isLoading: true });
    try {
      const res = await authService.switchUser(userId);
      const { neighborhoods } = get();
      const targetNeighId =
        res.user.neighborhood_id ?? (res.user as any).neighborhoodId;
      const currentNeighborhood =
        neighborhoods.find(
          (n) =>
            n.id === targetNeighId || String(n.id) === String(targetNeighId),
        ) || get().currentNeighborhood;
      set({ currentUser: res.user, currentNeighborhood, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  setCurrentNeighborhood: (neighborhood) => {
    set({ currentNeighborhood: neighborhood });
  },

  verifyLocation: async (neighborhoodId, postcode, method = "postcode") => {
    set({ isLoading: true });
    try {
      const res = await authService.verifyLocation({
        neighborhoodId,
        postcode,
        method,
      });
      const { neighborhoods } = get();
      const currentNeighborhood =
        neighborhoods.find(
          (n) =>
            n.id === neighborhoodId || String(n.id) === String(neighborhoodId),
        ) || get().currentNeighborhood;
      set({ currentUser: res.user, currentNeighborhood, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },
}));

export default useAuthStore;
