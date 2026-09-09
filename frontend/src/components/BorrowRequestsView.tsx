import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Wrench,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Star,
  DollarSign,
  ArrowRight,
  PackageCheck,
  RotateCcw,
  Layers,
  PhoneCall,
} from "lucide-react";
import type { BorrowRequest, User } from "../types.ts";

interface BorrowRequestsViewProps {
  requests: BorrowRequest[];
  currentUser: User | null;
  onUpdateStatus: (requestId: string | number, status: string, action: string) => void;
  onOpenReviewModal: (request: BorrowRequest) => void;
  onSwitchToCatalog: () => void;
  onSwitchToLenderDashboard?: () => void;
  onOpenAuthModal?: () => void;
}

export const BorrowRequestsView: React.FC<BorrowRequestsViewProps> = ({
  requests,
  currentUser,
  onUpdateStatus,
  onOpenReviewModal,
  onSwitchToCatalog,
  onSwitchToLenderDashboard,
  onOpenAuthModal,
}) => {
  const [roleTab, setRoleTab] = useState<"borrower" | "lender">("borrower");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="p-8 rounded-3xl border-3 border-black bg-white shadow-[6px_6px_0px_#000] space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#ffc900] border-2 border-black text-black flex items-center justify-center mx-auto mb-2 shadow-[2.5px_2.5px_0px_#000]">
            <Wrench className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h2 className="text-xl font-black text-black">
            Sign in to View Requests
          </h2>
          <p className="text-xs sm:text-sm font-medium text-neutral-600">
            Track your borrowed equipment, active reservations, security deposits,
            and approvals from neighbors.
          </p>
          <button
            onClick={onOpenAuthModal}
            className="jn-btn px-6 py-3 rounded-xl bg-[#ffc900] hover:bg-[#ffb700] text-black text-xs sm:text-sm font-black border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            Sign In as Neighbor
          </button>
        </div>
      </div>
    );
  }

  const myBorrowings = requests.filter((r) => r.borrowerId === currentUser?.id);
  const myLendings = requests.filter((r) => r.ownerId === currentUser?.id);

  const displayedList = (
    roleTab === "borrower" ? myBorrowings : myLendings
  ).filter((r) => filterStatus === "all" || r.status === filterStatus);

  const pendingLenderCount = myLendings.filter(
    (r) => r.status === "pending",
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Borrowing & Request Workflow
          </h1>
          <p className="text-xs sm:text-sm font-bold text-neutral-600 mt-1">
            Manage your community reservations, equipment handovers, and
            security deposit releases
          </p>
        </div>

        {/* Role Switcher Tabs */}
        <div className="flex items-center p-1.5 rounded-2xl bg-[#faf9f6] border-2 border-black shadow-[2px_2px_0px_#000]">
          <button
            id="tab-my-borrowings"
            onClick={() => setRoleTab("borrower")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              roleTab === "borrower"
                ? "bg-[#ffc900] text-black border-2 border-black shadow-[2px_2px_0px_#000]"
                : "text-neutral-700 hover:text-black border-2 border-transparent"
            }`}
          >
            My Borrowings ({myBorrowings.length})
          </button>
          <button
            id="tab-my-lendings"
            onClick={() => setRoleTab("lender")}
            className={`relative px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              roleTab === "lender"
                ? "bg-[#ffc900] text-black border-2 border-black shadow-[2px_2px_0px_#000]"
                : "text-neutral-700 hover:text-black border-2 border-transparent"
            }`}
          >
            Equipment I am Lending ({myLendings.length})
            {pendingLenderCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-md bg-[#ff90e8] text-black border border-black text-[10px] font-mono font-black animate-pulse">
                {pendingLenderCount} new
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Status Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {["all", "pending", "approved", "active", "returned"].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`jn-btn px-3.5 py-2 rounded-xl text-xs font-black capitalize whitespace-nowrap border-2 border-black transition-all cursor-pointer ${
              filterStatus === st
                ? "bg-black text-white shadow-[3px_3px_0px_#ff90e8]"
                : "bg-white text-black hover:bg-[#ffc900] shadow-[2px_2px_0px_#000]"
            }`}
          >
            {st === "all"
              ? "All Requests"
              : st === "active"
                ? "Currently Borrowed"
                : st}
          </button>
        ))}
      </div>

      {/* Lender Hub Callout Banner when in Lending mode */}
      {roleTab === "lender" && onSwitchToLenderDashboard && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#fffdf0] border-2 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-[3.5px_3.5px_0px_#000]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ffc900] border-2 border-black text-black flex items-center justify-center shrink-0 shadow-[1.5px_1.5px_0px_#000]">
              <Layers className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-black text-black text-sm">
                Need Full Equipment Inventory & Financial Ledger?
              </h4>
              <p className="text-neutral-700 font-medium">
                Access maintenance pricing toggles, return inspections, security
                deposit escrow tracking, and safety checklists.
              </p>
            </div>
          </div>
          <button
            onClick={onSwitchToLenderDashboard}
            className="jn-btn px-4 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-black text-xs shrink-0 self-start sm:self-auto flex items-center gap-2 border-2 border-black shadow-[2.5px_2.5px_0px_#ff90e8] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <span>Open Lender Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      )}

      {/* Empty State */}
      {displayedList.length === 0 && (
        <div className="text-center py-16 px-4 rounded-3xl border-3 border-dashed border-black bg-white shadow-[4px_4px_0px_#000]">
          <div className="w-14 h-14 rounded-2xl bg-[#ff90e8] border-2 border-black text-black flex items-center justify-center mx-auto mb-3 shadow-[2px_2px_0px_#000]">
            <Wrench className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h3 className="text-lg font-black text-black">
            No requests found in this tab
          </h3>
          <p className="text-xs sm:text-sm font-bold text-neutral-600 max-w-sm mx-auto mt-1 mb-5">
            {roleTab === "borrower"
              ? "Browse the local neighborhood library and borrow drills, mowers, washers, and more."
              : "You have no incoming borrow requests for your listed tools right now."}
          </p>
          {roleTab === "borrower" && (
            <button
              onClick={onSwitchToCatalog}
              className="jn-btn px-6 py-3 rounded-xl bg-[#ffc900] hover:bg-[#ffbe00] text-black text-xs sm:text-sm font-black border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              Explore Tool Catalog
            </button>
          )}
        </div>
      )}

      {/* Request Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {displayedList.map((req, idx) => {
          const isLender = req.ownerId === currentUser?.id;
          const otherPersonName = isLender ? req.borrowerName : req.ownerName;
          const otherPersonAvatar = isLender
            ? req.borrowerAvatar
            : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80";

          return (
            <div
              key={req.id}
              id={`borrow-request-card-${req.id}`}
              className="bg-white border-3 border-black rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-[5px_5px_0px_#000] transition-all"
            >
              {/* Header: Tool Info & Status */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={req.toolImage}
                      alt={req.toolTitle}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-black bg-neutral-100 shrink-0 shadow-[2px_2px_0px_#000]"
                    />
                    <div>
                      <span className="inline-block bg-[#ff90e8] text-black border border-black font-mono font-black text-[10px] uppercase px-2 py-0.5 rounded-md shadow-[1px_1px_0px_#000]">
                        {req.toolCategory}
                      </span>
                      <h4 className="text-base font-black text-black leading-snug line-clamp-1 mt-1">
                        {req.toolTitle}
                      </h4>
                      <span className="text-xs font-bold text-neutral-600">
                        {isLender ? "Requested by " : "Borrowed from "}
                        <strong className="text-black underline underline-offset-1">
                          {otherPersonName}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div>
                    {req.status === "pending" && (
                      <>
                        <span className="text-xs font-bold text-neutral-600 italic">
                          Awaiting neighbor confirmation
                        </span>

                        <button
                          onClick={() =>
                            onUpdateStatus(req.id, "cancelled", "cancel")
                          }
                          className="jn-btn py-2 px-3.5 rounded-xl border-2 border-black bg-white hover:bg-red-100 text-xs font-black text-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                        >
                          Cancel Request
                        </button>
                      </>
                    )}
      
                    {req.status === "approved" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-black bg-[#bbf7d0] text-black border-2 border-black shadow-[1.5px_1.5px_0px_#000]">
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                        Approved
                      </span>
                    )}
                    {req.status === "active" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-black bg-[#ff90e8] text-black border-2 border-black shadow-[1.5px_1.5px_0px_#000]">
                        <PackageCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                        In Use
                      </span>
                    )}
                    {req.status === "returned" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-black bg-[#bbf7d0] text-black border-2 border-black shadow-[1.5px_1.5px_0px_#000]">
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                        Returned
                      </span>
                    )}
                    {req.status === "rejected" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-black bg-red-200 text-black border-2 border-black shadow-[1.5px_1.5px_0px_#000]">
                        <XCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                        Declined
                      </span>
                    )}
                  </div>
                </div>

                {/* Reservation Dates & Cost Breakdown */}
                <div className="mt-4 p-4 rounded-2xl bg-[#faf9f6] border-2 border-black space-y-2 text-xs shadow-[2.5px_2.5px_0px_#000]">
                  <div className="flex items-center justify-between text-neutral-800 font-bold">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 stroke-[2.5] text-black" />
                      <span className="font-mono">
                        {req.startDate} to {req.endDate}
                      </span>
                    </div>
                    <span className="font-black font-mono text-black">
                      {req.daysCount} days
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t-2 border-neutral-200 text-xs text-neutral-700 font-bold">
                    <span>
                      Fee: RM {req.maintenanceFee} • Deposit: RM{" "}
                      {req.depositFee}
                    </span>
                    <span className="font-black font-mono text-black text-sm">
                      Total: RM {req.totalPaid}
                    </span>
                  </div>

                  {req.purposeNote && (
                    <div className="text-xs text-neutral-600 font-medium italic pt-1">
                      "{req.purposeNote}"
                    </div>
                  )}

                  {req.depositRefunded && (
                    <div className="text-xs font-black text-black bg-[#bbf7d0] p-2 rounded-xl border border-black flex items-center gap-1.5 mt-2">
                      <CheckCircle2 className="w-4 h-4 stroke-[2.5] text-emerald-700" />
                      <span>RM {req.depositFee} Security Deposit released back to borrower!</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t-2 border-black flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-700">
                  <ShieldCheck className="w-4 h-4 stroke-[2.5] text-emerald-700" />
                  <span>Verified Contact: {otherPersonName}</span>
                </div>

                {/* Role specific workflow actions */}
                <div className="flex items-center gap-2">
                  {isLender ? (
                    <>
                      {req.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              onUpdateStatus(req.id, "rejected", "reject")
                            }
                            className="jn-btn py-2 px-3.5 rounded-xl border-2 border-black bg-white hover:bg-neutral-100 text-xs font-black text-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() =>
                              onUpdateStatus(req.id, "approved", "approve")
                            }
                            className="jn-btn py-2 px-4 rounded-xl bg-[#bbf7d0] hover:bg-[#a7f3c0] text-black text-xs font-black border-2 border-black shadow-[2.5px_2.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                            Approve
                          </button>
                        </>
                      )}

                      {req.status === "approved" && (
                        <button
                          onClick={() =>
                            onUpdateStatus(req.id, "active", "pickup")
                          }
                          className="jn-btn py-2 px-4 rounded-xl bg-[#ffc900] hover:bg-[#ffbe00] text-black text-xs font-black border-2 border-black shadow-[2.5px_2.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <PackageCheck className="w-4 h-4 stroke-[2.5]" />
                          Confirm Handover / Pickup
                        </button>
                      )}

                      {req.status === "active" && (
                        <button
                          onClick={() =>
                            onUpdateStatus(req.id, "returned", "return")
                          }
                          className="jn-btn py-2 px-4 rounded-xl bg-[#bbf7d0] hover:bg-[#a7f3c0] text-black text-xs font-black border-2 border-black shadow-[2.5px_2.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center gap-1.5 transition-all cursor-pointer"
                          title="Verify item condition and release deposit back to neighbor"
                        >
                          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                          Confirm Return & Release Deposit
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      {req.status === "returned" && (
                        <button
                          onClick={() => onOpenReviewModal(req)}
                          className="jn-btn py-2 px-3.5 rounded-xl border-2 border-black bg-[#ffc900] hover:bg-[#ffbe00] text-black text-xs font-black flex items-center gap-1.5 shadow-[2.5px_2.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                        >
                          <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                          Rate & Feedback
                        </button>
                      )}
                      {req.status === "pending" && (
                        <span className="text-xs font-bold text-neutral-600 italic">
                          Awaiting neighbor confirmation
                        </span>
                      )}
                      {req.status === "approved" && (
                        <span className="text-xs font-black text-emerald-800 bg-[#bbf7d0] px-2.5 py-1 rounded-lg border border-black">
                          Ready for porch pickup!
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
