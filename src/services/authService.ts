// src/services/authService.ts
import api from "./api";
import type { User, Neighborhood } from "../types";

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  neighborhood_id?: number | string;
  neighborhoodId?: number | string;
  postcode?: string;
}

export const authService = {
  async login(credentials: {
    email?: string;
    userId?: number | string;
  }): Promise<{ success: boolean; user: User }> {
    const { data } = await api.post("/auth/login", credentials);
    if (data.user) {
      localStorage.setItem("jiranaid_userId", String(data.user.id));
    }
    return response;
  },

  async register(
    payload: RegisterPayload,
  ): Promise<{ success: boolean; user: User }> {
    const { data } = await api.post("/auth/register", payload);
    if (data.user) {
      localStorage.setItem("jiranaid_userId", String(data.user.id));
    }
    return response;
  },

  async getCurrentUser(): Promise<{ success: boolean; user: User | null }> {
    return await api.get("/users/me");
  },

  async switchUser(
    userId: number | string,
  ): Promise<{ success: boolean; user: User }> {
    const { data } = await api.post("/auth/switch-user", { userId });
    return data;
  },

  async verifyLocation(payload: {
    neighborhoodId: number | string;
    postcode: string;
    method?: string;
  }): Promise<{ success: boolean; user: User }> {
    const { data } = await api.post("/auth/verify-location", payload);
    return data;
  },

  async logout(): Promise<void> {
    try {
      await api.post("/users/logout");
    } finally {
      localStorage.removeItem("jiranaid_token");
      localStorage.removeItem("jiranaid_userId");
    }
  },

  async getNeighborhoods(): Promise<{
    success: boolean;
    neighborhoods: Neighborhood[];
  }> {
    return await api.get("/neighborhoods");
  },
};

export default authService;
