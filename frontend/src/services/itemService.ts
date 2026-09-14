// src/services/itemService.ts
import api from "./api";
import type { Item, ToolCategory, Review, Booking } from "../types";

export interface ItemFilters {
  category?: ToolCategory;
  search?: string;
  status?: string;
  maxFee?: string | number;
  neighborhoodId?: number | string;
  sort?: string;
}

export interface ItemListResponse {
  success: boolean;
  total: number;
  tools: Item[];
}

export interface ItemDetailResponse {
  success: boolean;
  tool: Item;
  reviews: Review[];
}

export interface CreateItemPayload {
  title: string;
  description: string;
  price: number;
  deposit: number;
  category: string;
  image_url: string;
}

export interface CreateBookingPayload {
  item_id: number;
  user_id?: number;
  start_date: string;
  end_date: string;
  total_price: number;
}

export const itemService = {
  async getItems(filters: ItemFilters = {}): Promise<any> {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== "All") {
      params.append("category", filters.category);
    }
    if (filters.search) {
      params.append("search", filters.search);
    }
    if (filters.status && filters.status !== "all") {
      params.append("status", filters.status);
    }
    if (filters.maxFee && filters.maxFee !== "all") {
      params.append("maxFee", String(filters.maxFee));
    }
    if (filters.neighborhoodId && filters.neighborhoodId !== "all") {
      params.append("neighborhoodId", String(filters.neighborhoodId));
    }
    if (filters.sort) {
      params.append("sort", filters.sort);
    }

    const queryStr = params.toString();
    const url = queryStr ? `/items?${queryStr}` : "/items";
    const res: any = await api.get(url);

    // Unwrap Axios response if interceptor doesn't unwrap automatically
    return res?.data !== undefined ? res.data : res;
  },

  // Alias getTools to getItems to prevent undefined function crashes in Zustand store
  async getTools(filters: ItemFilters = {}): Promise<any> {
    return this.getItems(filters);
  },

  async getItemById(id: number | string): Promise<any> {
    const res: any = await api.get(`/items/${id}`);
    const data = res?.data !== undefined ? res.data : res;
    return data?.tool || data;
  },

  async createItem(
    payload: CreateItemPayload,
  ): Promise<{ success: boolean; tool: Item; message?: string }> {
    const res: any = await api.post("/items", payload);
    return res?.data !== undefined ? res.data : res;
  },

  async updateItem(
    id: number | string,
    payload: Partial<CreateItemPayload>,
  ): Promise<{ success: boolean; tool: Item }> {
    const res: any = await api.put(`/items/${id}`, payload);
    return res?.data !== undefined ? res.data : res;
  },

  async deleteItem(
    id: number | string,
  ): Promise<{ success: boolean; message?: string }> {
    const res: any = await api.delete(`/items/${id}`);
    return res?.data !== undefined ? res.data : res;
  },

  async createBooking(
    payload: CreateBookingPayload,
  ): Promise<{ success: boolean; booking?: Booking; message?: string }> {
    try {
      const res: any = await api.post("/bookings", payload);
      const data = res?.data !== undefined ? res.data : res;
      return { success: true, ...data };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Item is already booked for the selected date range";
      throw new Error(errorMessage);
    }
  },

  async getStats() {
    const res: any = await api.get("/stats");
    return res?.data !== undefined ? res.data : res;
  },

  async getBorrowRequests(): Promise<any> {
    return await api.get("/borrow-requests");
  },

  async updateBorrowRequestStatus(
    requestId: string | number,
    status: string,
    action?: string,
  ): Promise<any> {
    return await api.patch(`/borrow-requests/${requestId}/status`, {
      status,
      action,
    });
  },
};

export default itemService;
