import { create } from 'zustand';
import type { Item, ToolCategory } from '../types';
import itemService, { type CreateItemPayload, type ItemFilters } from '../services/itemService';

interface ItemState {
  allTools: Item[];
  tools: Item[];
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
  fetchAllTools: () => Promise<void>;
  fetchTools: (overrideFilters?: ItemFilters) => Promise<void>;
  setSearchQuery: (search: string) => void;
  setSelectedCategory: (category: ToolCategory) => void;
  setStatusFilter: (status: string) => void;
  setSortBy: (sort: string) => void;
  setMaxFeeFilter: (maxFee: string) => void;
  resetFilters: () => void;
  createTool: (payload: CreateItemPayload) => Promise<Item>;
  updateTool: (id: number | string, payload: Partial<CreateItemPayload>) => Promise<Item>;
  deleteTool: (id: number | string) => Promise<void>;
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
  allTools: [],
  tools: [],
  isLoading: false,
  error: null,
  filters: defaultFilters,
  stats: null,

  fetchAllTools: async () => {
    try {
      const res = await itemService.getItems({});
      set((state) => ({
        allTools: res.tools || [],
        tools:
          state.filters.category === 'All' && !state.filters.search && state.tools.length === 0
            ? res.tools || []
            : state.tools,
      }));
    } catch (err: any) {
      console.error('Failed to fetch all tools:', err);
    }
  },

  fetchTools: async (overrideFilters) => {
    const filters = overrideFilters || get().filters;
    set({ isLoading: true, error: null });
    try {
      const res = await itemService.getItems(filters);
      set((state) => ({
        tools: res.tools || [],
        isLoading: false,
        allTools:
          state.allTools.length === 0 && (!filters.category || filters.category === 'All')
            ? res.tools || []
            : state.allTools,
      }));
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
        allTools: [res.tool, ...state.allTools],
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
        allTools: state.allTools.map((t) => (String(t.id) === String(id) ? res.tool : t)),
        tools: state.tools.map((t) => (String(t.id) === String(id) ? res.tool : t)),
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
        allTools: state.allTools.filter((t) => String(t.id) !== String(id)),
        tools: state.tools.filter((t) => String(t.id) !== String(id)),
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
