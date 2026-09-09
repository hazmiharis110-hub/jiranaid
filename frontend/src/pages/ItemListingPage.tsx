import React, { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Package, Sparkles, Plus, AlertCircle, Wrench } from "lucide-react";
import { useItemStore } from "../store/useItemStore";
import { useAuthStore } from "../store/useAuthStore";
import { ItemCard } from "../components/items/ItemCard";
import { SearchBar } from "../components/items/SearchBar";
import { FilterBar } from "../components/items/FilterBar";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { EmptyState } from "../components/common/EmptyState";
import type { ToolCategory } from "../types";

export const ItemListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const itemStore = useItemStore();
  const {
    tools,
    fetchTools,
    setSearchQuery,
    setSelectedCategory,
    setStatusFilter,
    setSortBy,
    setMaxFeeFilter,
    resetFilters,
  } = itemStore as any;
  const filters = (itemStore as any).filters ?? {
    search: (itemStore as any).searchQuery ?? "",
    category: (itemStore as any).selectedCategory ?? "All",
    status: (itemStore as any).statusFilter ?? "all",
    sort: (itemStore as any).sortBy ?? "distance",
    maxFee: (itemStore as any).maxFeeFilter ?? "all",
  };
  const isLoading =
    "isLoading" in itemStore ? (itemStore as any).isLoading : false;

  const { currentNeighborhood } = useAuthStore();

  // Synchronize filters whenever URL search parameters change
  useEffect(() => {
    const urlCategory = (searchParams.get("category") as ToolCategory) || "All";
    const urlSearch = searchParams.get("search") || "";
    const urlStatus = searchParams.get("status") || "all";
    const urlSort = searchParams.get("sort") || "distance";

    const mergedFilters = {
      ...filters,
      category: urlCategory,
      search: urlSearch,
      status: urlStatus,
      sort: urlSort,
    };

    fetchTools(mergedFilters);
  }, [searchParams]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val) {
      searchParams.set("search", val);
    } else {
      searchParams.delete("search");
    }
    setSearchParams(searchParams, { replace: true });
  };

  const handleCategorySelect = (cat: ToolCategory) => {
    setSelectedCategory(cat);
    if (cat !== "All") {
      searchParams.set("category", cat);
    } else {
      searchParams.delete("category");
    }
    setSearchParams(searchParams, { replace: true });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b-2 border-black">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tight">
              Neighborhood Tool Library
            </h1>
            <span className="hidden sm:inline-flex px-3 py-1 rounded-xl bg-[#ffc900] border-2 border-black text-xs font-black text-black shadow-[2px_2px_0px_#000]">
              {currentNeighborhood?.name || "Local Circle"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#444] font-bold mt-1">
            Borrow verified power machinery, garden gear, and household tools from nearby neighbors.
          </p>
        </div>

        <Link
          to="/items/create"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ffc900] text-black border-2 border-black text-xs sm:text-sm font-black shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all self-start sm:self-auto shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>List a Tool</span>
        </Link>
      </div>

      {/* Search Input Bar */}
      <div className="max-w-2xl">
        <SearchBar
          value={filters.search || ""}
          onChange={handleSearchChange}
          placeholder="Search tools by keyword (e.g. pressure washer, drill, lawnmower)..."
        />
      </div>

      {/* Filter Bar (Categories, Status, Sorting, Reset) */}
      <FilterBar
        selectedCategory={filters.category || "All"}
        onSelectCategory={handleCategorySelect}
        statusFilter={filters.status || "all"}
        onSelectStatus={setStatusFilter}
        sortBy={filters.sort || "distance"}
        onSelectSort={setSortBy}
        maxFeeFilter={String(filters.maxFee || "all")}
        onSelectMaxFee={setMaxFeeFilter}
        totalCount={tools.length}
        onResetFilters={() => {
          resetFilters();
          setSearchParams({}, { replace: true });
        }}
      />

      {/* Content Area */}
      {isLoading ? (
        <LoadingSpinner
          message="Searching neighborhood tool library..."
          fullPage
        />
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
          onSecondaryAction={() => (window.location.href = "/items/create")}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tools.map((tool: any, idx: number) => (
            <ItemCard key={tool.id} tool={tool} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemListingPage;
