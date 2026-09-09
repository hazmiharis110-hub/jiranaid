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
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border shrink-0 ${
                  isSelected
                    ? 'bg-[#24211d] text-[#faf8f5] border-[#24211d] shadow-xs scale-102'
                    : 'bg-white text-[#4e4a43] border-[#ded7c8] hover:border-[#c86d51]/50 hover:bg-[#fcfbf9]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Controls: Status, Sort, Max Fee, and Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[#ede7db]">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Select */}
          <div className="flex items-center gap-1.5 text-xs text-[#67635c]">
            <span className="hidden sm:inline font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => onSelectStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-[#ded7c8] bg-white text-xs font-semibold text-[#24211d] focus:outline-none focus:ring-1 focus:ring-[#c86d51]"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available Now</option>
              <option value="borrowed">On Loan</option>
            </select>
          </div>

          {/* Max Fee Filter */}
          <div className="flex items-center gap-1.5 text-xs text-[#67635c]">
            <span className="hidden sm:inline font-medium">Daily Fee:</span>
            <select
              value={maxFeeFilter}
              onChange={(e) => onSelectMaxFee(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-[#ded7c8] bg-white text-xs font-semibold text-[#24211d] focus:outline-none focus:ring-1 focus:ring-[#c86d51]"
            >
              <option value="all">Any Price</option>
              <option value="0">Free Only</option>
              <option value="15">Under RM15</option>
              <option value="30">Under RM30</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 text-xs text-[#67635c]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#8a857b]" />
            <select
              value={sortBy}
              onChange={(e) => onSelectSort(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-[#ded7c8] bg-white text-xs font-semibold text-[#24211d] focus:outline-none focus:ring-1 focus:ring-[#c86d51]"
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
            <span className="text-xs font-medium text-[#67635c]">
              {totalCount} {totalCount === 1 ? 'tool' : 'tools'} listed
            </span>
          )}

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-[#c86d51] hover:bg-[#c86d51]/10 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
