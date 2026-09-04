import React from "react";
import { Package, Wrench, Plus, Star, User, LogIn, Layers } from "lucide-react";
import type { User as UserType } from "../types.ts";

interface BottomNavProps {
  currentUser: UserType | null;
  activeTab: "catalog" | "requests" | "feedback" | "lender";
  pendingRequestsCount: number;
  unreadMessagesCount?: number;
  onSelectTab: (tab: "catalog" | "requests" | "feedback" | "lender") => void;
  onOpenAddModal: () => void;
  onOpenProfileModal: () => void;
  onOpenAuthModal: () => void;
  onOpenNeighborhoodModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentUser,
  activeTab,
  pendingRequestsCount,
  unreadMessagesCount,
  onSelectTab,
  onOpenAddModal,
  onOpenProfileModal,
  onOpenAuthModal,
  onOpenNeighborhoodModal,
}) => {
  return (
    <nav
      id="mobile-bottom-navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#fcfbf9]/98 backdrop-blur-md border-t border-[#ded7c8] px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Catalog */}
        <button
          onClick={() => onSelectTab("catalog")}
          className={`min-h-11 min-w-11 flex flex-col items-center justify-center gap-0.5 rounded-xl transition-colors ${
            activeTab === "catalog"
              ? "text-[#c86d51] font-bold"
              : "text-[#67635c] hover:text-[#24211d]"
          }`}
          aria-label="Browse Tool Catalog"
        >
          <Package className="w-5 h-5 stroke-2" />
          <span className="text-[10px]">Catalog</span>
        </button>

        {/* Lender Hub */}
        <button
          onClick={() => onSelectTab("lender")}
          className={`relative min-h-11 min-w-11 flex flex-col items-center justify-center gap-0.5 rounded-xl transition-colors ${
            activeTab === "lender"
              ? "text-[#c86d51] font-bold"
              : "text-[#67635c] hover:text-[#24211d]"
          }`}
          aria-label="Lender Dashboard"
        >
          <Layers className="w-5 h-5 stroke-2" />
          <span className="text-[10px]">Lender</span>
          {pendingRequestsCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#c86d51] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs animate-pulse">
              {pendingRequestsCount}
            </span>
          )}
        </button>

        {/* Center Floating Action: Add/Share Tool */}
        <button
          onClick={onOpenAddModal}
          className="min-h-11 min-w-11 flex flex-col items-center justify-center -mt-5 focus:outline-none"
          title="Share or List a Tool"
          aria-label="Share or List a Tool"
        >
          <div className="w-12 h-12 rounded-full bg-[#c86d51] text-white flex items-center justify-center shadow-md hover:bg-[#b0553b] active:scale-95 transition-transform">
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-bold text-[#c86d51] mt-0.5">
            Share
          </span>
        </button>

        {/* Borrowing */}
        <button
          onClick={() => onSelectTab("requests")}
          className={`relative min-h-11 min-w-11 flex flex-col items-center justify-center gap-0.5 rounded-xl transition-colors ${
            activeTab === "requests"
              ? "text-[#c86d51] font-bold"
              : "text-[#67635c] hover:text-[#24211d]"
          }`}
          aria-label="My Borrowing Requests"
        >
          <Wrench className="w-5 h-5 stroke-2" />
          <span className="text-[10px]">Borrowing</span>
        </button>

        {/* Item/Service Feedback */}
        <button
          onClick={() => onSelectTab("feedback")}
          className={`relative min-h-11 min-w-11 flex flex-col items-center justify-center gap-0.5 rounded-xl transition-colors ${
            activeTab === "feedback"
              ? "text-[#c86d51] font-bold"
              : "text-[#67635c] hover:text-[#24211d]"
          }`}
          aria-label="Item and Service Feedback"
        >
          <Star className="w-5 h-5 stroke-2 text-amber-500 fill-amber-400" />
          <span className="text-[10px]">Feedback</span>
        </button>

        {/* Profile or Sign In */}
        {currentUser ? (
          <button
            onClick={onOpenProfileModal}
            className="min-h-11 min-w-11 flex flex-col items-center justify-center gap-0.5 rounded-xl text-[#67635c] hover:text-[#24211d] transition-colors"
            aria-label="Open User Profile"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-5 h-5 rounded-full object-cover border border-[#ded7c8]"
            />
            <span className="text-[10px] font-medium truncate max-w-12">
              {currentUser?.name ? currentUser.name.split(" ")[0] : "Profile"}
            </span>
          </button>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="min-h-11 min-w-11 flex flex-col items-center justify-center gap-0.5 rounded-xl text-[#c86d51] font-bold transition-colors"
            aria-label="Sign in"
          >
            <LogIn className="w-5 h-5 stroke-2" />
            <span className="text-[10px]">Sign In</span>
          </button>
        )}
      </div>
    </nav>
  );
};
