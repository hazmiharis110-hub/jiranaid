import React from "react";
import {
  X,
  ShieldCheck,
  Award,
  MapPin,
  CheckCircle2,
  LogOut,
} from "lucide-react";
import type { User } from "../types.ts";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elementName: string]: any;
    }
  }
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onOpenNeighborhoodModal: () => void;
  onLogout: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenNeighborhoodModal,
  onLogout,
}) => {
  if (!isOpen || !currentUser) return null;

  const handleLogoutClick = () => {
    onLogout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        id="user-profile-modal-content"
        className="w-full sm:max-w-lg bg-[#fcfbf9] border-t sm:border border-[#ded7c8] rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 max-h-[92vh] flex flex-col text-left"
      >
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#e8e2d7] flex items-center justify-between bg-[#f4efe6] shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#5f7d66]" />
            <h3 className="font-bold text-[#24211d] text-base leading-tight">
              Neighborhood Trust & Profile
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 min-h-11 min-w-11 flex items-center justify-center rounded-xl text-[#67635c] hover:text-[#24211d] hover:bg-[#eae3d5] transition-colors"
            aria-label="Close profile modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {/* User Hero & Quick Logout */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#f4efe6] border border-[#ded7c8]">
            <div className="flex items-center gap-3.5">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-[#5f7d66]/40 shrink-0"
              />
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-base sm:text-lg font-extrabold text-[#24211d]">
                    {currentUser.name}
                  </h4>
                  <ShieldCheck className="w-4 h-4 text-[#5f7d66] shrink-0" />
                </div>
                <p className="text-xs text-[#67635c] truncate max-w-45 sm:max-w-none">
                  {currentUser.email}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#5f7d66]/15 text-[#496350] inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {currentUser.neighborhoodName} ({currentUser.postcode})
                  </span>
                </div>
              </div>
            </div>

            {/* Prominent Log Out Button */}
            <button
              id="profile-logout-btn"
              type="button"
              onClick={handleLogoutClick}
              className="min-h-11 px-3.5 py-2 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:border-red-300 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shrink-0"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>

          {/* Trust Score & Verification Metrics */}
          <div className="grid grid-cols-3 gap-2 p-3.5 rounded-xl bg-[#f4efe6] border border-[#ded7c8] text-center">
            <div>
              <div className="text-lg font-extrabold text-[#5f7d66]">
                ★ {currentUser.trustScore.toFixed(1)}
              </div>
              <div className="text-[10px] text-[#67635c] font-medium">
                Trust Score
              </div>
            </div>
            <div className="border-x border-[#ded7c8]">
              <div className="text-lg font-extrabold text-[#24211d]">
                {currentUser.onTimeReturnRate}%
              </div>
              <div className="text-[10px] text-[#67635c] font-medium">
                On-Time Returns
              </div>
            </div>
            <div>
              <div className="text-lg font-extrabold text-[#c86d51]">
                {currentUser.totalBorrows + currentUser.totalLends}
              </div>
              <div className="text-[10px] text-[#67635c] font-medium">
                Items Shared
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8c867b]">
              Community Trust Badges
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(currentUser.badges || []).map((badge, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#eef4f0] text-[#496350] border border-[#5f7d66]/30"
                >
                  <Award className="w-3 h-3 text-[#5f7d66]" />
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Verification & Circle Membership Details */}
          <div className="pt-4 border-t border-[#e8e2d7] space-y-2.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8c867b]">
              Resident Verification & Security
            </label>
            <div className="p-3.5 rounded-xl border border-[#ded7c8] bg-[#faf8f5] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#67635c] flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5f7d66]" />
                  Residential Postcode
                </span>
                <span className="font-bold text-[#24211d]">
                  {currentUser.postcode} • {currentUser.neighborhoodName}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#67635c] flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5f7d66]" />
                  Community Status
                </span>
                <span className="font-bold text-[#5f7d66]">
                  Verified Neighbor
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#67635c] flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5f7d66]" />
                  Deposit Protection
                </span>
                <span className="font-medium text-[#24211d]">
                  Auto-Escrow Refund
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#e8e2d7] bg-[#f4efe6] flex items-center justify-between">
          <button
            type="button"
            onClick={onOpenNeighborhoodModal}
            className="text-xs text-[#5f7d66] hover:underline font-semibold flex items-center gap-1"
          >
            <MapPin className="w-3.5 h-3.5" />
            Update Neighborhood Postcode
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#24211d] text-[#faf8f5] text-xs font-semibold hover:bg-black transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
