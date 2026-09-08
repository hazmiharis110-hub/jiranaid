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
  login: (credentials: { email?: string; userId?: string }) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
  switchUser: (userId: string) => Promise<void>;
  setCurrentNeighborhood: (neighborhood: Neighborhood) => void;
  verifyLocation: (
    neighborhoodId: string,
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
      const [neighRes, meRes] = await Promise.all([
        authService.getNeighborhoods(),
        authService.getCurrentUser(),
      ]);

      const neighborhoods = neighRes.neighborhoods || neighRes || [];
      const currentUser = meRes.user || null;

      let currentNeighborhood: Neighborhood | null = null;
      if (currentUser && currentUser.neighborhoodId) {
        currentNeighborhood =
          neighborhoods.find((n) => n.id === currentUser.neighborhoodId) ||
          null;
      }
      if (!currentNeighborhood && neighborhoods.length > 0) {
        currentNeighborhood = neighborhoods[0];
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
      const user = res.user;
      const { neighborhoods } = get();
      const currentNeighborhood =
        neighborhoods.find((n) => n.id === user.neighborhoodId) ||
        get().currentNeighborhood;

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
      const currentNeighborhood =
        neighborhoods.find((n) => n.id === user.neighborhoodId) ||
        get().currentNeighborhood;

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

  switchUser: async (userId: string) => {
    set({ isLoading: true });
    try {
      const res = await authService.switchUser(userId);
      const { neighborhoods } = get();
      const currentNeighborhood =
        neighborhoods.find((n) => n.id === res.user.neighborhoodId) ||
        get().currentNeighborhood;
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
        neighborhoods.find((n) => n.id === neighborhoodId) ||
        get().currentNeighborhood;
      set({ currentUser: res.user, currentNeighborhood, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },
}));

export default useAuthStore;
