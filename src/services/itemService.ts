import api from './api';
import type { ToolItem, ToolCategory, Review } from '../types';

export interface ItemFilters {
  category?: ToolCategory;
  search?: string;
  status?: string;
  maxFee?: string | number;
  neighborhoodId?: string;
  sort?: string;
}

export interface ItemListResponse {
  success: boolean;
  total: number;
  tools: ToolItem[];
}

export interface ItemDetailResponse {
  success: boolean;
  tool: ToolItem;
  reviews: Review[];
}

export interface CreateItemPayload {
  title: string;
  brand: string;
  model?: string;
  category: Exclude<ToolCategory, 'All'>;
  description: string;
  condition: ToolItem['condition'];
  imageUrl: string;
  maintenanceFeePerDay: number;
  depositAmount: number;
  maxDays: number;
  instructions: string;
  pickupNote: string;
}

export const itemService = {
  async getItems(filters: ItemFilters = {}): Promise<ItemListResponse> {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'All') {
      params.append('category', filters.category);
    }
    if (filters.search) {
      params.append('search', filters.search);
    }
    if (filters.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    if (filters.maxFee && filters.maxFee !== 'all') {
      params.append('maxFee', String(filters.maxFee));
    }
    if (filters.neighborhoodId && filters.neighborhoodId !== 'all') {
      params.append('neighborhoodId', filters.neighborhoodId);
    }
    if (filters.sort) {
      params.append('sort', filters.sort);
    }

    const { data } = await api.get<ItemListResponse>(`/items?${params.toString()}`);
    return data;
  },

  async getItemById(id: string): Promise<ItemDetailResponse> {
    const { data } = await api.get<ItemDetailResponse>(`/items/${id}`);
    return data;
  },

  async createItem(payload: CreateItemPayload): Promise<{ success: boolean; tool: ToolItem; message?: string }> {
    const { data } = await api.post('/items', payload);
    return data;
  },

  async updateItem(id: string, payload: Partial<CreateItemPayload>): Promise<{ success: boolean; tool: ToolItem }> {
    const { data } = await api.put(`/items/${id}`, payload);
    return data;
  },

  async deleteItem(id: string): Promise<{ success: boolean; message?: string }> {
    const { data } = await api.delete(`/items/${id}`);
    return data;
  },

  async getStats() {
    const { data } = await api.get('/stats');
    return data;
  },
};

export default itemService;
