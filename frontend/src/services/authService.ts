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
    password?: string;
    userId?: number | string;
  }) {
    try {
      // api.ts already returns response.data
      const res = await api.post("/users/login", credentials);
      const data = res?.data !== undefined ? res.data : res;

      const token = data?.token || data?.accessToken;
      const user = data?.user;

      if (token) {
        localStorage.setItem("jiranaid_token", token);
        localStorage.setItem("token", token);
      }
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("jiranaid_userId", String(user.id));
      }

      return {
        success: true,
        user,
        token,
        ...data,
      };
    } catch (error: any) {
      console.error("Error in authService.login:", error);
      return {
        success: false,
        message: error.message || "Invalid email or password.",
      };
    }
  },

  async register(userData: RegisterPayload) {
    try {
      const res = await api.post("/users/register", userData);
      const data = res?.data !== undefined ? res.data : res;

      const user = data?.user;
      const token = data?.token || data?.accessToken;

      if (token) {
        localStorage.setItem("jiranaid_token", token);
        localStorage.setItem("token", token);
      }
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("jiranaid_userId", String(user.id));
      }

      return {
        success: true,
        user,
        token,
        ...data,
      };
    } catch (error: any) {
      console.error("Error in authService.register:", error);
      return {
        success: false,
        message: error.message || "Registration failed.",
      };
    }
  },

  async getCurrentUser(): Promise<{ success: boolean; user: User | null }> {
    return await api.get("/users/me");
  },

  async switchUser(
    userId: number | string,
  ): Promise<{ success: boolean; user: User }> {
    return await api.post("/auth/switch-user", { userId });
  },

  async verifyLocation(payload: {
    neighborhoodId: number | string;
    postcode: string;
    method?: string;
  }): Promise<{ success: boolean; user: User }> {
    return await api.post("/auth/verify-location", payload);
  },

  async logout(): Promise<void> {
    try {
      await api.post("/users/logout");
    } finally {
      localStorage.removeItem("jiranaid_token");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
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
