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
  async login(credentials: { email: string; password?: string }) {
    try {
      const response = await api.post("/users/login", credentials);

      // Unwraps response whether raw Axios or interceptor-modified
      const data = response?.data !== undefined ? response.data : response;

      const token = data?.token || data?.data?.token;
      const user = data?.user || data?.data?.user;

      // Save tokens and user details using consistent keys
      if (token) {
        localStorage.setItem("jiranaid_token", token);
        localStorage.setItem("token", token);
      }
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("jiranaid_userId", String(user.id));
      }

      // Always return a valid object containing data and explicit success status
      return {
        success: true,
        user,
        token,
        ...data,
      };
    } catch (error: any) {
      console.error("Error in authService.login:", error);

      // Catch backend errors (400, 401) and return an object instead of returning undefined
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Invalid email or password.",
      };
    }
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

  // async logout(): Promise<void> {
  //   try {
  //     await api.post("/users/logout");
  //   } finally {
  //     localStorage.removeItem("jiranaid_token");
  //     localStorage.removeItem("jiranaid_userId");
  //   }
  // },

  async getNeighborhoods(): Promise<{
    success: boolean;
    neighborhoods: Neighborhood[];
  }> {
    return await api.get("/neighborhoods");
  },
};

export default authService;
