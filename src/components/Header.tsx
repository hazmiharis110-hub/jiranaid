import React from "react";
import { motion } from "motion/react";
import {
  Wrench,
  MapPin,
  Star,
  Package,
  Plus,
  ShieldCheck,
  User as UserIcon,
  ChevronDown,
  Layers,
} from "lucide-react";
import type { User, Neighborhood } from "../types.ts";

interface HeaderProps {
  currentUser: User | null;
  currentNeighborhood: Neighborhood | null;
  activeTab: "catalog" | "requests" | "feedback" | "lender";
  pendingRequestsCount: number;
  unreadMessagesCount?: number;
  onSelectTab: (tab: "catalog" | "requests" | "feedback" | "lender") => void;
  onOpenAddModal: () => void;
  onOpenNeighborhoodModal: () => void;
  onOpenProfileModal: () => void;
  onOpenAuthModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  currentNeighborhood,
  activeTab,
  pendingRequestsCount,
  unreadMessagesCount,
  onSelectTab,
  onOpenAddModal,
  onOpenNeighborhoodModal,
  onOpenProfileModal,
  onOpenAuthModal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#e8e2d7] transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-20">
          {/* Brand & Neighborhood Selector */}
          <div className="flex items-center gap-2 sm:gap-6 min-w-0">
            <div
              id="brand-logo"
              className="group flex items-center gap-2.5 cursor-pointer shrink-0"
              onClick={() => onSelectTab("catalog")}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#c86d51] flex items-center justify-center text-white shadow-xs group-hover:scale-105 group-hover:rotate-6 transition-all duration-300">
                <Wrench className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
              </div>
              <div className="hidden min-[380px]:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base sm:text-xl tracking-tight text-[#24211d] group-hover:text-[#c86d51] transition-colors">
                    JiranAid
                  </span>
                  <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#5f7d66]/15 text-[#496350]">
                    Local Library
                  </span>
                </div>
                <p className="text-[11px] text-[#67635c] font-medium hidden sm:block">
                  Share household tools with verified neighbors
                </p>
              </div>
            </div>

            {/* Neighborhood Location Badge & Switcher */}
            <motion.button
              id="neighborhood-selector-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenNeighborhoodModal}
              className="group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-[#ded7c8] bg-[#f4efe6] hover:bg-[#eae3d5] hover:border-[#5f7d66]/50 text-left transition-all min-w-0 shadow-2xs"
              title="Click to verify or switch residential pool"
            >
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-lg bg-[#5f7d66] text-white flex items-center justify-center shrink-0 shadow-xs">
                <MapPin className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
              </div>
              <div className="max-w-25 xs:max-w-[130px] sm:max-w-47.5 truncate">
                <div className="flex items-center gap-1">
                  <span className="text-[11px] sm:text-xs font-bold text-[#24211d] truncate">
                    {currentNeighborhood?.name || "Local Circle"}
                  </span>
                  <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#5f7d66] shrink-0" />
                </div>
                <span className="text-[9px] sm:text-[10px] text-[#67635c] block truncate">
                  {currentUser?.postcode || "53100"} • Verified
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-[#67635c] group-hover:text-[#24211d] transition-colors shrink-0" />
            </motion.button>
          </div>

          {/* Desktop Navigation Links with animated interactions */}
          <div className="hidden md:flex items-center gap-2">
            <motion.button
              id="nav-catalog-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectTab("catalog")}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                activeTab === "catalog"
                  ? "bg-[#24211d] text-[#faf8f5] shadow-sm"
                  : "text-[#4e4a43] hover:text-[#24211d] hover:bg-[#ede7db]"
              }`}
            >
              <Package className="w-4 h-4" />
              Tool Catalog
            </motion.button>

            <motion.button
              id="nav-lender-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectTab("lender")}
              className={`relative px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                activeTab === "lender"
                  ? "bg-[#c86d51] text-white shadow-sm"
                  : "text-[#4e4a43] hover:text-[#24211d] hover:bg-[#ede7db]"
              }`}
            >
              <Layers className="w-4 h-4" />
              Lender Dashboard
              {pendingRequestsCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#24211d] text-white animate-pulse">
                  {pendingRequestsCount}
                </span>
              )}
            </motion.button>

            <motion.button
              id="nav-requests-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectTab("requests")}
              className={`relative px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                activeTab === "requests"
                  ? "bg-[#24211d] text-[#faf8f5] shadow-sm"
                  : "text-[#4e4a43] hover:text-[#24211d] hover:bg-[#ede7db]"
              }`}
            >
              <Wrench className="w-4 h-4" />
              Borrowing
            </motion.button>

            <motion.button
              id="nav-feedback-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectTab("feedback")}
              className={`relative px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                activeTab === "feedback"
                  ? "bg-[#24211d] text-[#faf8f5] shadow-sm"
                  : "text-[#4e4a43] hover:text-[#24211d] hover:bg-[#ede7db]"
              }`}
            >
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              Item & Service Feedback
            </motion.button>
          </div>

          {/* Actions: Add Tool & User Profile / Login */}
          <div className="flex items-center gap-2 shrink-0">
            {currentUser && (
              <motion.button
                id="add-tool-header-btn"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenAddModal}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#c86d51] hover:bg-[#b0553b] text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all duration-200"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>List a Tool</span>
              </motion.button>
            )}

            {currentUser ? (
              /* Logged In: Profile Avatar Button */
              <motion.button
                id="user-profile-header-btn"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={onOpenProfileModal}
                className="flex items-center gap-2 pl-1 pr-2 sm:pr-2.5 py-1 rounded-xl border border-[#ded7c8] bg-[#fcfbf9] hover:bg-[#f2ece2] hover:border-[#c86d51]/40 transition-all shadow-2xs"
                title="View Trust Profile & Account"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-[#e8e2d7]"
                />
                <div className="hidden lg:block text-left">
                  <span className="text-xs font-bold text-[#24211d] block leading-tight truncate max-w-25">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-[#5f7d66] font-semibold">
                    ★ {(currentUser.trustScore ?? 5.0).toFixed(1)} Trust
                  </span>
                </div>
              </motion.button>
            ) : (
              /* Logged Out: Sign In / Join Button */
              <motion.button
                id="header-login-btn"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenAuthModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#24211d] hover:bg-black text-[#faf8f5] text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all duration-200"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
