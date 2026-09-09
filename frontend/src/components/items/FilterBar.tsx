import React from 'react';
import { SlidersHorizontal, ArrowUpDown, X, Sparkles, Tag } from 'lucide-react';
import type { ToolCategory } from '../../types';

export const CATEGORIES: ToolCategory[] = [
  'All',
  'Gardening & Yard',
  'Power Tools',
  'Home Improvement',
  'Cleaning & Steam',
  'Kitchen Appliances',
  'Automotive',
  'Ladders & Access',
  'Woodworking',
];

interface FilterBarProps {
  selectedCategory: ToolCategory;
  onSelectCategory: (cat: ToolCategory) => void;
  statusFilter: string;
  onSelectStatus: (status: string) => void;
  sortBy: string;
  onSelectSort: (sort: string) => void;
  maxFeeFilter: string;
  onSelectMaxFee: (maxFee: string) => void;
  totalCount?: number;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  statusFilter,
  onSelectStatus,
  sortBy,
  onSelectSort,
  maxFeeFilter,
  onSelectMaxFee,
  totalCount,
  onResetFilters,
}) => {
  const hasActiveFilters =
    selectedCategory !== 'All' ||
    statusFilter !== 'all' ||
    sortBy !== 'distance' ||
    maxFeeFilter !== 'all';

  return (
    <div className="space-y-4 mb-6">
      {/* Category Pills (Horizontal Scrolling) */}
      <div className="relative">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all duration-150 border-2 border-black shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#ff90e8] text-black font-black shadow-[1px_1px_0px_#000] translate-x-0.5 translate-y-0.5'
                    : 'bg-white text-black font-bold shadow-[2px_2px_0px_#000] hover:bg-[#ffc900] hover:shadow-[3.5px_3.5px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Controls: Status, Sort, Max Fee, and Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t-2 border-black">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Select */}
          <div className="flex items-center gap-1.5 text-xs text-black">
            <span className="hidden sm:inline font-bold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => onSelectStatus(e.target.value)}
              className="px-3 py-1.5 rounded-xl border-2 border-black bg-white text-xs font-bold text-black shadow-[2px_2px_0px_#000] focus:shadow-[3.5px_3.5px_0px_#000] focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available Now</option>
              <option value="borrowed">On Loan</option>
            </select>
          </div>

          {/* Max Fee Filter */}
          <div className="flex items-center gap-1.5 text-xs text-black">
            <span className="hidden sm:inline font-bold">Daily Fee:</span>
            <select
              value={maxFeeFilter}
              onChange={(e) => onSelectMaxFee(e.target.value)}
              className="px-3 py-1.5 rounded-xl border-2 border-black bg-white text-xs font-bold text-black shadow-[2px_2px_0px_#000] focus:shadow-[3.5px_3.5px_0px_#000] focus:outline-none cursor-pointer"
            >
              <option value="all">Any Price</option>
              <option value="0">Free Only</option>
              <option value="15">Under RM15</option>
              <option value="30">Under RM30</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 text-xs text-black">
            <ArrowUpDown className="w-3.5 h-3.5 text-black stroke-[2.5]" />
            <select
              value={sortBy}
              onChange={(e) => onSelectSort(e.target.value)}
              className="px-3 py-1.5 rounded-xl border-2 border-black bg-white text-xs font-bold text-black shadow-[2px_2px_0px_#000] focus:shadow-[3.5px_3.5px_0px_#000] focus:outline-none cursor-pointer"
            >
              <option value="distance">Nearest First</option>
              <option value="fee-low">Lowest Daily Fee</option>
              <option value="rating">Top Rated Owners</option>
              <option value="newest">Recently Listed</option>
            </select>
          </div>
        </div>

        {/* Count & Reset Active Filters Button */}
        <div className="flex items-center gap-3">
          {typeof totalCount === 'number' && (
            <span className="text-xs font-black text-black px-2.5 py-1 rounded-lg border border-black bg-[#faf9f6] shadow-[1px_1px_0px_#000]">
              {totalCount} {totalCount === 1 ? 'tool' : 'tools'} listed
            </span>
          )}

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black bg-white text-black border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-[#ff90e8] hover:shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
