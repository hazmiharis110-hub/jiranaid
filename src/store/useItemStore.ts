import { create } from 'zustand';
import type { ToolItem, ToolCategory } from '../types';
import itemService, { type CreateItemPayload, type ItemFilters } from '../services/itemService';

interface ItemState {
  tools: ToolItem[];
  isLoading: boolean;
  error: string | null;
  filters: ItemFilters;
  stats: {
    totalTools: number;
    availableTools: number;
    activeBorrows: number;
    totalNeighbors: number;
    totalSavingsEstimate: number;
    landfillWasteDivertedKg: number;
  } | null;

  // Actions
  fetchTools: (overrideFilters?: ItemFilters) => Promise<void>;
  setSearchQuery: (search: string) => void;
  setSelectedCategory: (category: ToolCategory) => void;
  setStatusFilter: (status: string) => void;
  setSortBy: (sort: string) => void;
  setMaxFeeFilter: (maxFee: string) => void;
  resetFilters: () => void;
  createTool: (payload: CreateItemPayload) => Promise<ToolItem>;
  updateTool: (id: string, payload: Partial<CreateItemPayload>) => Promise<ToolItem>;
  deleteTool: (id: string) => Promise<void>;
  fetchStats: () => Promise<void>;
}

const defaultFilters: ItemFilters = {
  category: 'All',
  search: '',
  status: 'all',
  sort: 'distance',
  maxFee: 'all',
  neighborhoodId: 'all',
};

export const useItemStore = create<ItemState>((set, get) => ({
  tools: [],
  isLoading: false,
  error: null,
  filters: defaultFilters,
  stats: null,

  fetchTools: async (overrideFilters) => {
    const filters = overrideFilters || get().filters;
    set({ isLoading: true, error: null });
    try {
      const res = await itemService.getItems(filters);
      set({ tools: res.tools || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  setSearchQuery: (search) => {
    const newFilters = { ...get().filters, search };
    set({ filters: newFilters });
    get().fetchTools(newFilters);
  },

  setSelectedCategory: (category) => {
    const newFilters = { ...get().filters, category };
    set({ filters: newFilters });
    get().fetchTools(newFilters);
  },

  setStatusFilter: (status) => {
    const newFilters = { ...get().filters, status };
    set({ filters: newFilters });
    get().fetchTools(newFilters);
  },

  setSortBy: (sort) => {
    const newFilters = { ...get().filters, sort };
    set({ filters: newFilters });
    get().fetchTools(newFilters);
  },

  setMaxFeeFilter: (maxFee) => {
    const newFilters = { ...get().filters, maxFee };
    set({ filters: newFilters });
    get().fetchTools(newFilters);
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
    get().fetchTools(defaultFilters);
  },

  createTool: async (payload) => {
    set({ isLoading: true });
    try {
      const res = await itemService.createItem(payload);
      set((state) => ({
        tools: [res.tool, ...state.tools],
        isLoading: false,
      }));
      return res.tool;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  updateTool: async (id, payload) => {
    set({ isLoading: true });
    try {
      const res = await itemService.updateItem(id, payload);
      set((state) => ({
        tools: state.tools.map((t) => (t.id === id ? res.tool : t)),
        isLoading: false,
      }));
      return res.tool;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  deleteTool: async (id) => {
    set({ isLoading: true });
    try {
      await itemService.deleteItem(id);
      set((state) => ({
        tools: state.tools.filter((t) => t.id !== id),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  fetchStats: async () => {
    try {
      const res = await itemService.getStats();
      if (res.stats) {
        set({ stats: res.stats });
      }
    } catch {
      // quiet fallback
    }
  },
}));

export default useItemStore;
