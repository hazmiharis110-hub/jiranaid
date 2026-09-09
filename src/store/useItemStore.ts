import { create } from "zustand";
import type { Item, ToolCategory } from "../types";
import itemService, {
  type CreateItemPayload,
  type ItemFilters,
} from "../services/itemService";

interface ItemState {
  allTools: Item[];
  tools: Item[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchAllTools: () => Promise<void>;
  fetchTools: (overrideFilters?: ItemFilters) => Promise<void>;
  setSearchQuery: (search: string) => void;
  setSelectedCategory: (category: ToolCategory) => void;
  setStatusFilter: (status: string) => void;
  setSortBy: (sort: string) => void;
  setMaxFeeFilter: (maxFee: string) => void;
  resetFilters: () => void;
  createTool: (payload: CreateItemPayload) => Promise<Item>;
  updateTool: (
    id: number | string,
    payload: Partial<CreateItemPayload>,
  ) => Promise<Item>;
  deleteTool: (id: number | string) => Promise<void>;
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
      const res = await itemService.updateItem(id, payload);
      set((state) => ({
        allTools: state.allTools.map((t) =>
          String(t.id) === String(id) ? res.tool : t,
        ),
        tools: state.tools.map((t) =>
          String(t.id) === String(id) ? res.tool : t,
        ),
        isLoading: false,
      }));
      return res.tool;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  deleteTool: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await itemService.deleteItem(id);
      set((state) => ({
        allTools: state.allTools.filter((t) => String(t.id) !== String(id)),
        tools: state.tools.filter((t) => String(t.id) !== String(id)),
        isLoading: false,
      }));
      return true;
    } catch (error: any) {
      set({ error: error.message || "Failed to delete tool", loading: false });
      return false;
    }
  },
}));
