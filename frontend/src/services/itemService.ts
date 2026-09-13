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
  async getItems(filters: ItemFilters = {}): Promise<ItemListResponse> {
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
    return await api.get(url);
  },

  async getItemById(id: number | string): Promise<any> {
    const res: any = await api.get(`/items/${id}`);
    return res?.tool || res?.data || res;
  },

  async createItem(
    payload: CreateItemPayload,
  ): Promise<{ success: boolean; tool: Item; message?: string }> {
    return await api.post("/items", payload);
  },

  async updateItem(
    id: number | string,
    payload: Partial<CreateItemPayload>,
  ): Promise<{ success: boolean; tool: Item }> {
    return await api.put(`/items/${id}`, payload);
  },

  async deleteItem(
    id: number | string,
  ): Promise<{ success: boolean; message?: string }> {
    return await api.delete(`/items/${id}`);
  },

  async createBooking(
    payload: CreateBookingPayload,
  ): Promise<{ success: boolean; booking: Booking; message?: string }> {
    return await api.post("/bookings", payload);
  },

  async getStats() {
    return await api.get("/stats");
  },
};

export default itemService;
