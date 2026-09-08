// src/services/authService.ts
import api from "./api";
import type { User, Neighborhood } from "../types";

export interface RegisterPayload {
  name: string;
  email: string;
  phone?: string;
  neighborhoodId: string;
  postcode: string;
}

export const authService = {
  async login(credentials: {
    email?: string;
    userId?: string;
  }): Promise<{ success: boolean; user: User }> {
    const response: any = await api.post("/users/login", credentials);
    if (response?.user) {
      localStorage.setItem("jiranaid_userId", response.user.id);
    }
    return response;
  },

  async register(
    payload: RegisterPayload,
  ): Promise<{ success: boolean; user: User }> {
    const response: any = await api.post("/users/register", payload);
    if (response?.user) {
      localStorage.setItem("jiranaid_userId", response.user.id);
    }
    return response;
  },

  async getCurrentUser(): Promise<{ success: boolean; user: User | null }> {
    return await api.get("/users/me");
  },

  async switchUser(userId: string): Promise<{ success: boolean; user: User }> {
    return await api.post("/users/switch-user", { userId });
  },

  async verifyLocation(payload: {
    neighborhoodId: string;
    postcode: string;
    method?: string;
  }): Promise<{ success: boolean; user: User }> {
    return await api.post("/users/verify-location", payload);
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
