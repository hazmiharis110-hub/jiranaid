import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Package, Sparkles, Plus, AlertCircle, Wrench } from 'lucide-react';
import { useItemStore } from '../store/useItemStore';
import { useAuthStore } from '../store/useAuthStore';
import { ItemCard } from '../components/items/ItemCard';
import { SearchBar } from '../components/items/SearchBar';
import { FilterBar } from '../components/items/FilterBar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import type { ToolCategory } from '../types';

export const ItemListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    tools,
    isLoading,
    filters,
    fetchTools,
    setSearchQuery,
    setSelectedCategory,
    setStatusFilter,
    setSortBy,
    setMaxFeeFilter,
    resetFilters,
  } = useItemStore();

  const { currentNeighborhood } = useAuthStore();

  // Read URL params on initial mount
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    const urlSearch = searchParams.get('search');
    const urlStatus = searchParams.get('status');
    const urlSort = searchParams.get('sort');

    if (urlCategory) setSelectedCategory(urlCategory as ToolCategory);
    if (urlSearch) setSearchQuery(urlSearch);
    if (urlStatus) setStatusFilter(urlStatus);
    if (urlSort) setSortBy(urlSort);

    fetchTools();
  }, []);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val) {
      searchParams.set('search', val);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams, { replace: true });
  };

  const handleCategorySelect = (cat: ToolCategory) => {
    setSelectedCategory(cat);
    if (cat !== 'All') {
      searchParams.set('category', cat);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams, { replace: true });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#ede7db]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#24211d]">
              Neighborhood Tool Library
            </h1>
            <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full bg-[#f4efe6] border border-[#ded7c8] text-xs font-bold text-[#4e4a43]">
              {currentNeighborhood?.name || 'Local Circle'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#67635c] mt-1">
            Browse verified household equipment, garden tools, and power machinery available for borrowing.
          </p>
        </div>

        <Link
          to="/items/create"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#c86d51] hover:bg-[#b0553b] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>List a Tool</span>
        </Link>
      </div>

      {/* Search Input Bar */}
      <div className="max-w-2xl">
        <SearchBar
          value={filters.search || ''}
          onChange={handleSearchChange}
          placeholder="Search tools by keyword (e.g. pressure washer, drill, lawnmower)..."
        />
      </div>

      {/* Filter Bar (Categories, Status, Sorting, Reset) */}
      <FilterBar
        selectedCategory={filters.category || 'All'}
        onSelectCategory={handleCategorySelect}
        statusFilter={filters.status || 'all'}
        onSelectStatus={setStatusFilter}
        sortBy={filters.sort || 'distance'}
        onSelectSort={setSortBy}
        maxFeeFilter={String(filters.maxFee || 'all')}
        onSelectMaxFee={setMaxFeeFilter}
        totalCount={tools.length}
        onResetFilters={() => {
          resetFilters();
          setSearchParams({}, { replace: true });
        }}
      />

      {/* Content Area */}
      {isLoading ? (
        <LoadingSpinner message="Searching neighborhood tool library..." fullPage />
      ) : tools.length === 0 ? (
        <EmptyState
          icon={<Package className="w-8 h-8 text-[#c86d51]" />}
          title="No equipment found"
          description="We couldn't find any tools matching your search criteria. Try adjusting your search query, clearing filters, or list the tool yourself!"
          actionText="Clear All Filters"
          onAction={() => {
            resetFilters();
            setSearchParams({}, { replace: true });
          }}
          secondaryActionText="+ List This Tool"
          onSecondaryAction={() => (window.location.href = '/items/create')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tools.map((tool, idx) => (
            <ItemCard key={tool.id} tool={tool} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemListingPage;
