import React, { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Package, Plus } from "lucide-react";
import { useItemStore } from "../store/useItemStore";
import { ItemCard } from "../components/items/ItemCard";
import { SearchBar } from "../components/items/SearchBar";
import { FilterBar } from "../components/items/FilterBar";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { EmptyState } from "../components/common/EmptyState";
import type { ToolCategory } from "../types";

export const ItemListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    tools,
    isLoading,
    fetchTools,
    setSearchQuery,
    setSelectedCategory,
    setStatusFilter,
    setSortBy,
    setMaxFeeFilter,
    resetFilters,
  } = useItemStore();

  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  // Ensure tools is always an array
  const safeTools = Array.isArray(tools)
    ? tools.filter((t: any) => t && (t.id !== undefined || t._id !== undefined))
    : [];

  // Synchronize URL parameters with Store and fetch items when URL parameters change
  useEffect(() => {
    const urlCategory = (searchParams.get("category") as ToolCategory) || "All";
    const urlSearch = searchParams.get("search") || "";
    const urlStatus = searchParams.get("status") || "all";
    const urlSort = searchParams.get("sort") || "newest";
    const urlMaxFee = searchParams.get("maxFee") || "";

    // Sync Store state with URL values
    setSelectedCategory(urlCategory);
    setSearchQuery(urlSearch);
    setStatusFilter(urlStatus);
    setSortBy(urlSort);
    setMaxFeeFilter(urlMaxFee);

    // Fetch items with current URL parameters
    fetchTools({
      category: urlCategory,
      search: urlSearch,
      status: urlStatus,
      sort: urlSort,
      maxFee: urlMaxFee,
    });
  }, [searchParams]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    const newParams = new URLSearchParams(searchParams);
    if (val) {
      newParams.set("search", val);
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams, { replace: true });
  };

  const handleCategorySelect = (cat: ToolCategory | "All") => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat && cat !== "All") {
      newParams.set("category", cat);
    } else {
      newParams.delete("category");
    }
    setSearchParams(newParams, { replace: true });
  };

  const handleStatusSelect = (status: string) => {
    setStatusFilter(status);
    const newParams = new URLSearchParams(searchParams);
    if (status && status !== "all") {
      newParams.set("status", status);
    } else {
      newParams.delete("status");
    }
    setSearchParams(newParams, { replace: true });
  };

  const handleSortSelect = (sort: string) => {
    setSortBy(sort);
    const newParams = new URLSearchParams(searchParams);
    if (sort && sort !== "newest") {
      newParams.set("sort", sort);
    } else {
      newParams.delete("sort");
    }
    setSearchParams(newParams, { replace: true });
  };

  const handleMaxFeeSelect = (fee: string) => {
    setMaxFeeFilter(fee);
    const newParams = new URLSearchParams(searchParams);
    if (fee && fee !== "all") {
      newParams.set("maxFee", fee);
    } else {
      newParams.delete("maxFee");
    }
    setSearchParams(newParams, { replace: true });
  };

  const handleReset = () => {
    resetFilters();
    setSearchParams({}, { replace: true });
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
            <span className="hidden sm:inline-flex px-3 py-1 rounded-xl bg-[#fee26d] border-2 border-black text-xs font-black text-black shadow-[2px_2px_0px_#000]">
              {currentUser?.neighborhoodName ||
                currentUser?.neighborhood ||
                "Local Circle"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#444] font-bold mt-1">
            Borrow verified power machinery, garden gear, and household tools
            from nearby neighbors.
          </p>
        </div>

        <Link
          to="/items/create"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#fecd0e] text-black border-2 border-black text-xs sm:text-sm font-black shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all self-start sm:self-auto shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-3" />
          <span>List a Tool</span>
        </Link>
      </div>

      {/* Search Input Bar */}
      <div className="max-w-2xl">
        <SearchBar
          value={searchParams.get("search") || ""}
          onChange={handleSearchChange}
          placeholder="Search tools by keyword (e.g. pressure washer, drill, lawnmower)..."
        />
      </div>

      {/* Filter Bar */}
      <FilterBar
        selectedCategory={
          (searchParams.get("category") as ToolCategory) || "All"
        }
        onSelectCategory={handleCategorySelect}
        statusFilter={searchParams.get("status") || "all"}
        onSelectStatus={handleStatusSelect}
        sortBy={searchParams.get("sort") || "newest"}
        onSelectSort={handleSortSelect}
        maxFeeFilter={searchParams.get("maxFee") || "all"}
        onSelectMaxFee={handleMaxFeeSelect}
        totalCount={safeTools.length}
        onResetFilters={handleReset}
      />

      {/* Content Area */}
      {isLoading ? (
        <LoadingSpinner
          message="Searching neighborhood tool library..."
          fullPage
        />
      ) : safeTools.length === 0 ? (
        <EmptyState
          icon={<Package className="w-8 h-8 text-black" />}
          title="No equipment found"
          description="We couldn't find any tools matching your search criteria. Try adjusting your search query, clearing filters, or list the tool yourself!"
          actionText="Clear All Filters"
          onAction={handleReset}
          secondaryActionText="+ List This Tool"
          onSecondaryAction={() => (window.location.href = "/items/create")}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {safeTools.map((tool: any, idx: number) => (
            <ItemCard
              key={tool.id || tool._id || idx}
              tool={tool}
              index={idx}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemListingPage;
