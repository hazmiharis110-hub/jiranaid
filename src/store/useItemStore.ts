// src/store/useItemStore.ts
import { create } from "zustand";
import itemService, {
  ItemFilters,
  CreateItemPayload,
} from "../services/itemService";
import type { ToolItem, Review } from "../types";

interface ItemState {
  tools: ToolItem[];
  selectedTool: ToolItem | null;
  reviews: Review[];
  stats: any;
  loading: boolean;
  error: string | null;

  // Actions
  fetchTools: (filters?: ItemFilters) => Promise<void>;
  fetchToolById: (id: string) => Promise<void>;
  fetchStats: () => Promise<void>;
  createTool: (payload: CreateItemPayload) => Promise<boolean>;
  updateTool: (
    id: string,
    payload: Partial<CreateItemPayload>,
  ) => Promise<boolean>;
  deleteTool: (id: string) => Promise<boolean>;
}

export const useItemStore = create<ItemState>((set) => ({
  tools: [],
  selectedTool: null,
  reviews: [],
  stats: null,
  loading: false,
  error: null,

  fetchTools: async (filters?: ItemFilters) => {
    set({ loading: true, error: null });
    try {
      const response = await itemService.getItems(filters);
      set({ tools: response.tools || [], loading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch tools", loading: false });
    }
  },

  fetchToolById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await itemService.getItemById(id);
      set({
        selectedTool: response.tool,
        reviews: response.reviews || [],
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch tool details",
        loading: false,
      });
    }
  },

  fetchStats: async () => {
    try {
      const response = await itemService.getStats();
      set({ stats: response });
    } catch (error: any) {
      console.error("Failed to fetch stats", error);
    }
  },

  createTool: async (payload: CreateItemPayload) => {
    set({ loading: true, error: null });
    try {
      await itemService.createItem(payload);
      set({ loading: false });
      return true;
    } catch (error: any) {
      set({ error: error.message || "Failed to create tool", loading: false });
      return false;
    }
  },

  updateTool: async (id: string, payload: Partial<CreateItemPayload>) => {
    set({ loading: true, error: null });
    try {
      await itemService.updateItem(id, payload);
      set({ loading: false });
      return true;
    } catch (error: any) {
      set({ error: error.message || "Failed to update tool", loading: false });
      return false;
    }
  },

  deleteTool: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await itemService.deleteItem(id);
      set((state) => ({
        tools: state.tools.filter((t) => t.id !== id),
        loading: false,
      }));
      return true;
    } catch (error: any) {
      set({ error: error.message || "Failed to delete tool", loading: false });
      return false;
    }
  },
}));
