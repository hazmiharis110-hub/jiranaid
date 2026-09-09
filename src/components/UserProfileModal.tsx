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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        id="user-profile-modal-content"
        className="w-full sm:max-w-lg bg-[#faf9f6] border-t-3 sm:border-3 border-black rounded-t-3xl sm:rounded-3xl shadow-[8px_8px_0px_#000] overflow-hidden animate-in fade-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 max-h-[92vh] flex flex-col text-left"
      >
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b-2 border-black flex items-center justify-between bg-[#ffc900] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center border border-black shadow-[1px_1px_0px_#000]">
              <ShieldCheck className="w-5 h-5 text-[#bbf7d0] stroke-[2.5]" />
            </div>
            <h3 className="font-black text-black text-base sm:text-lg leading-tight">
              Neighborhood Trust & Profile
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl border-2 border-black bg-white hover:bg-[#ff90e8] text-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            aria-label="Close profile modal"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Profile Card Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {/* User Hero & Quick Logout */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border-2 border-black shadow-[4px_4px_0px_#000]">
            <div className="flex items-center gap-3.5">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-black shadow-[2px_2px_0px_#000] shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-base sm:text-lg font-black text-black">
                    {currentUser.name}
                  </h4>
                  <ShieldCheck className="w-4 h-4 text-black stroke-[2.5] shrink-0" />
                </div>
                <p className="text-xs font-mono font-medium text-neutral-600 truncate max-w-45 sm:max-w-none">
                  {currentUser.email}
                </p>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-[11px] font-black px-2.5 py-0.5 rounded-lg bg-[#ffc900] text-black border border-black inline-flex items-center gap-1 shadow-[1px_1px_0px_#000]">
                    <MapPin className="w-3 h-3 stroke-[2.5]" />
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
              className="px-4 py-2 rounded-xl border-2 border-black bg-[#ff90e8] hover:bg-black hover:text-white text-black text-xs font-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            >
              <LogOut className="w-4 h-4 stroke-[2.5]" />
              <span>Log Out</span>
            </button>
          </div>

          {/* Trust Score & Verification Metrics */}
          <div className="grid grid-cols-3 gap-2 p-3.5 rounded-2xl bg-white border-2 border-black shadow-[3px_3px_0px_#000] text-center">
            <div>
              <div className="text-xl font-black font-mono text-black">
                ★ {(currentUser.trustScore ?? 5.0).toFixed(1)}
              </div>
              <div className="text-[10px] font-black uppercase tracking-wider text-neutral-600">
                Trust Score
              </div>
            </div>
            <div className="border-x-2 border-black">
              <div className="text-xl font-black font-mono text-black">
                {currentUser.onTimeReturnRate ?? 100}%
              </div>
              <div className="text-[10px] font-black uppercase tracking-wider text-neutral-600">
                On-Time
              </div>
            </div>
            <div>
              <div className="text-xl font-black font-mono text-black">
                {(currentUser.totalBorrows ?? 0) + (currentUser.totalLends ?? 0)}
              </div>
              <div className="text-[10px] font-black uppercase tracking-wider text-neutral-600">
                Shared
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-black">
              Community Trust Badges
            </label>
            <div className="flex flex-wrap gap-2">
              {(currentUser.badges || []).map((badge, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-xl bg-[#bbf7d0] text-black border-2 border-black shadow-[2px_2px_0px_#000]"
                >
                  <Award className="w-3.5 h-3.5 stroke-[2.5]" />
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Verification & Circle Membership Details */}
          <div className="pt-3 border-t-2 border-black space-y-2.5">
            <label className="block text-xs font-black uppercase tracking-wider text-black">
              Resident Verification & Security
            </label>
            <div className="p-4 rounded-2xl border-2 border-black bg-white shadow-[3px_3px_0px_#000] space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-700 flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-black stroke-[2.5]" />
                  Residential Postcode
                </span>
                <span className="font-mono font-black text-black">
                  {currentUser.postcode} • {currentUser.neighborhoodName}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-700 flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-black stroke-[2.5]" />
                  Community Status
                </span>
                <span className="font-black text-black bg-[#bbf7d0] px-2 py-0.5 rounded-md border border-black text-[11px]">
                  Verified Neighbor
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-700 flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-black stroke-[2.5]" />
                  Deposit Protection
                </span>
                <span className="font-bold text-black">
                  Auto-Escrow Refund
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t-2 border-black bg-[#faf9f6] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onOpenNeighborhoodModal}
            className="text-xs text-black hover:text-neutral-700 font-bold underline underline-offset-2 flex items-center gap-1 cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 stroke-[2.5]" />
            Update Neighborhood Postcode
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-black border-2 border-black shadow-[2px_2px_0px_#ff90e8] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;

