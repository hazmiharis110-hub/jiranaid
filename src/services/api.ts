import axios from "axios";

const apiBaseUrl =
  (import.meta as any)?.env?.VITE_API_BASE_URL || "http://localhost:3000/api";

export const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach JWT token if available
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("jiranaid_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error),
);

// Response interceptor for unified error formatting and direct data unpacking
api.interceptors.response.use(
  (response: any) => response.data,
  (error: any) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";
    return Promise.reject(new Error(message));
  },
);

export default api;
