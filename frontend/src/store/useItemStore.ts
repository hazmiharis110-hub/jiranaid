import { create } from "zustand";
import type { Item, ToolCategory } from "../types";
import itemService, {
  type CreateItemPayload,
  type ItemFilters,
} from "../services/itemService";

interface ItemState {
  allTools: Item[];
  tools: Item[];
  selectedTool: Item | null;
  reviews: unknown[];
  stats: unknown | null;
  searchQuery: string;
  selectedCategory: ToolCategory | "all";
  statusFilter: string;
  sortBy: string;
  maxFeeFilter: string;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchAllTools: () => Promise<void>;
  fetchTools: (overrideFilters?: ItemFilters) => Promise<void>;
  fetchToolById: (id: string) => Promise<void>;
  setSearchQuery: (search: string) => void;
  setSelectedCategory: (category: ToolCategory | "all") => void;
  setStatusFilter: (status: string) => void;
  setSortBy: (sort: string) => void;
  setMaxFeeFilter: (maxFee: string) => void;
  resetFilters: () => void;
  createTool: (payload: CreateItemPayload) => Promise<Item>;
  updateTool: (
    id: number | string,
    payload: Partial<CreateItemPayload>,
  ) => Promise<Item>;
  deleteTool: (id: number | string) => Promise<boolean>;
  fetchStats: () => Promise<void>;
}

export const useItemStore = create<ItemState>((set) => ({
  allTools: [],
  tools: [],
  selectedTool: null,
  reviews: [],
  stats: null,
  searchQuery: "",
  selectedCategory: "all",
  statusFilter: "all",
  sortBy: "newest",
  maxFeeFilter: "",
  isLoading: false,
  error: null,

  fetchAllTools: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await itemService.getItems();
      set({ allTools: response.tools || [], isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch tools",
        isLoading: false,
      });
    }
  },

  fetchTools: async (filters?: ItemFilters) => {
    set({ isLoading: true, error: null });
    try {
      const response = await itemService.getItems(filters);
      set({ tools: response.tools || [], isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch tools",
        isLoading: false,
      });
    }
  },

  fetchToolById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await itemService.getItemById(id);
      set({
        selectedTool: response.tool,
        reviews: response.reviews || [],
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch tool details",
        isLoading: false,
      });
    }
  },

  setSearchQuery: (search: string) => set({ searchQuery: search }),
  setSelectedCategory: (category: ToolCategory | "all") =>
    set({ selectedCategory: category }),
  setStatusFilter: (status: string) => set({ statusFilter: status }),
  setSortBy: (sort: string) => set({ sortBy: sort }),
  setMaxFeeFilter: (maxFee: string) => set({ maxFeeFilter: maxFee }),
  resetFilters: () =>
    set({
      searchQuery: "",
      selectedCategory: "all",
      statusFilter: "all",
      sortBy: "newest",
      maxFeeFilter: "",
    }),

  fetchStats: async () => {
    try {
      const response = await itemService.getStats();
      set({ stats: response });
    } catch (error: any) {
      console.error("Failed to fetch stats", error);
    }
  },

  createTool: async (payload: CreateItemPayload) => {
    set({ isLoading: true, error: null });
    try {
      const res: any = await itemService.createItem(payload);
      const createdItem: Item = res?.tool || res;
      set((state) => ({
        allTools: [createdItem, ...state.allTools],
        tools: [createdItem, ...state.tools],
        isLoading: false,
      }));
      return createdItem;
    } catch (error: any) {
      set({
        error: error.message || "Failed to create tool",
        isLoading: false,
      });
      throw error;
    }
  },

  updateTool: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      const res = await itemService.updateItem(String(id), payload);
      set((state) => ({
        allTools: state.allTools.map((tool) =>
          String(tool.id) === String(id) ? res.tool : tool,
        ),
        tools: state.tools.map((tool) =>
          String(tool.id) === String(id) ? res.tool : tool,
        ),
        isLoading: false,
      }));
      return res.tool;
    } catch (error: any) {
      set({
        error: error.message || "Failed to update tool",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteTool: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await itemService.deleteItem(String(id));
      set((state) => ({
        allTools: state.allTools.filter(
          (tool) => String(tool.id) !== String(id),
        ),
        tools: state.tools.filter((tool) => String(tool.id) !== String(id)),
        isLoading: false,
      }));
      return true;
    } catch (error: any) {
      set({
        error: error.message || "Failed to delete tool",
        isLoading: false,
      });
      return false;
    }
  },
}));
