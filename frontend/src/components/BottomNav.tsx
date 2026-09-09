import React from "react";
import { Package, Wrench, Plus, Star, LogIn, Layers } from "lucide-react";
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
  onSelectTab,
  onOpenAddModal,
  onOpenProfileModal,
  onOpenAuthModal,
}) => {
  return (
    <nav
      id="mobile-bottom-navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#faf9f6] border-t-2 border-black px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Catalog */}
        <button
          onClick={() => onSelectTab("catalog")}
          className={`min-h-11 min-w-11 px-2 py-1 flex flex-col items-center justify-center gap-0.5 rounded-xl transition-all ${
            activeTab === "catalog"
              ? "bg-[#ffc900] text-black font-black border-2 border-black shadow-[2px_2px_0px_#000]"
              : "text-neutral-700 hover:text-black font-bold"
          }`}
          aria-label="Browse Tool Catalog"
        >
          <Package className="w-5 h-5 stroke-[2.5]" />
          <span className="text-[10px]">Catalog</span>
        </button>

        {/* Lender Hub */}
        <button
          onClick={() => onSelectTab("lender")}
          className={`relative min-h-11 min-w-11 px-2 py-1 flex flex-col items-center justify-center gap-0.5 rounded-xl transition-all ${
            activeTab === "lender"
              ? "bg-[#ffc900] text-black font-black border-2 border-black shadow-[2px_2px_0px_#000]"
              : "text-neutral-700 hover:text-black font-bold"
          }`}
          aria-label="Lender Dashboard"
        >
          <Layers className="w-5 h-5 stroke-[2.5]" />
          <span className="text-[10px]">Lender</span>
          {pendingRequestsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ff90e8] text-black border border-black text-[9px] font-mono font-black rounded-full flex items-center justify-center shadow-[1px_1px_0px_#000] animate-pulse">
              {pendingRequestsCount}
            </span>
          )}
        </button>

        {/* Center Floating Action: Add/Share Tool */}
        <button
          onClick={onOpenAddModal}
          className="min-h-11 min-w-11 flex flex-col items-center justify-center -mt-5 focus:outline-none cursor-pointer"
          title="Share or List a Tool"
          aria-label="Share or List a Tool"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#ff90e8] text-black border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all">
            <Plus className="w-6 h-6 stroke-[3]" />
          </div>
          <span className="text-[10px] font-black text-black mt-1">
            Share
          </span>
        </button>

        {/* Borrowing */}
        <button
          onClick={() => onSelectTab("requests")}
          className={`relative min-h-11 min-w-11 px-2 py-1 flex flex-col items-center justify-center gap-0.5 rounded-xl transition-all ${
            activeTab === "requests"
              ? "bg-[#ffc900] text-black font-black border-2 border-black shadow-[2px_2px_0px_#000]"
              : "text-neutral-700 hover:text-black font-bold"
          }`}
          aria-label="My Borrowing Requests"
        >
          <Wrench className="w-5 h-5 stroke-[2.5]" />
          <span className="text-[10px]">Borrowing</span>
        </button>

        {/* Item/Service Feedback */}
        <button
          onClick={() => onSelectTab("feedback")}
          className={`relative min-h-11 min-w-11 px-2 py-1 flex flex-col items-center justify-center gap-0.5 rounded-xl transition-all ${
            activeTab === "feedback"
              ? "bg-[#ffc900] text-black font-black border-2 border-black shadow-[2px_2px_0px_#000]"
              : "text-neutral-700 hover:text-black font-bold"
          }`}
          aria-label="Item and Service Feedback"
        >
          <Star className="w-5 h-5 stroke-[2.5] text-black fill-[#ffc900]" />
          <span className="text-[10px]">Feedback</span>
        </button>

        {/* Profile or Sign In */}
        {currentUser ? (
          <button
            onClick={onOpenProfileModal}
            className="min-h-11 min-w-11 flex flex-col items-center justify-center gap-0.5 rounded-xl text-neutral-700 hover:text-black transition-colors cursor-pointer"
            aria-label="Open User Profile"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-6 h-6 rounded-lg object-cover border-2 border-black shadow-[1px_1px_0px_#000]"
            />
            <span className="text-[10px] font-bold truncate max-w-12 text-black">
              {currentUser?.name ? currentUser.name.split(" ")[0] : "Profile"}
            </span>
          </button>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="min-h-11 px-2.5 py-1 rounded-xl bg-[#ffc900] border-2 border-black shadow-[2px_2px_0px_#000] flex flex-col items-center justify-center gap-0.5 text-black font-black transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
            aria-label="Sign in"
          >
            <LogIn className="w-4 h-4 stroke-[2.5]" />
            <span className="text-[10px]">Sign In</span>
          </button>
        )}
      </div>
    </nav>
  );
};
