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
    const { data } = await api.post("/users/login", credentials);
    if (data.user) {
      localStorage.setItem("jiranaid_userId", String(data.user.id));
    }
    return data;
  },

  async register(userData: any) {
    const response = await api.post("/users/register", userData);

    const user = response.data?.user || response.data?.data?.user;
    const token = response.data?.token || response.data?.data?.token;

    return { user, token };
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
