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
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-[#ede7db] text-[#c86d51] flex items-center justify-center mx-auto">
          <Wrench className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-[#24211d]">
          Sign in to View Requests
        </h2>
        <p className="text-xs sm:text-sm text-[#67635c]">
          Track your borrowed equipment, active reservations, security deposits,
          and approvals from neighbors.
        </p>
        <button
          onClick={onOpenAuthModal}
          className="min-h-11 px-6 py-2.5 rounded-xl bg-[#c86d51] hover:bg-[#b0553b] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
        >
          Sign In as Neighbor
        </button>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8e2d7] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#24211d] tracking-tight">
            Borrowing & Request Workflow
          </h1>
          <p className="text-xs sm:text-sm text-[#67635c] mt-1">
            Manage your community reservations, equipment handovers, and
            security deposit releases
          </p>
        </div>

        {/* Role Switcher Tabs with Motion */}
        <div className="flex items-center p-1 rounded-xl bg-[#ede7db] border border-[#ded7c8]">
          <motion.button
            id="tab-my-borrowings"
            whileTap={{ scale: 0.97 }}
            onClick={() => setRoleTab("borrower")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              roleTab === "borrower"
                ? "bg-[#fcfbf9] text-[#24211d] shadow-xs"
                : "text-[#67635c] hover:text-[#24211d]"
            }`}
          >
            My Borrowings ({myBorrowings.length})
          </motion.button>
          <motion.button
            id="tab-my-lendings"
            whileTap={{ scale: 0.97 }}
            onClick={() => setRoleTab("lender")}
            className={`relative px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              roleTab === "lender"
                ? "bg-[#fcfbf9] text-[#24211d] shadow-xs"
                : "text-[#67635c] hover:text-[#24211d]"
            }`}
          >
            Equipment I am Lending ({myLendings.length})
            {pendingLenderCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-[#c86d51] text-white text-[10px] animate-pulse">
                {pendingLenderCount} new
              </span>
            )}
          </motion.button>
        </div>
      </div>

      {/* Status Filter Bar with Motion */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {["all", "pending", "approved", "active", "returned"].map((st) => (
          <motion.button
            key={st}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap border transition-all ${
              filterStatus === st
                ? "border-[#24211d] bg-[#24211d] text-[#faf8f5] shadow-xs font-bold"
                : "border-[#ded7c8] bg-[#fcfbf9] text-[#67635c] hover:bg-[#ede7db] hover:text-[#24211d]"
            }`}
          >
            {st === "all"
              ? "All Requests"
              : st === "active"
                ? "Currently Borrowed"
                : st}
          </motion.button>
        ))}
      </div>

      {/* Lender Hub Callout Banner when in Lending mode */}
      {roleTab === "lender" && onSwitchToLenderDashboard && (
        <div className="p-4 rounded-2xl bg-[#f4efe6] border border-[#ded7c8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#c86d51] text-white flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-[#24211d]">
                Need Full Equipment Inventory & Financial Ledger?
              </h4>
              <p className="text-[#67635c]">
                Access maintenance pricing toggles, return inspections, security
                deposit escrow tracking, and safety checklists.
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onSwitchToLenderDashboard}
            className="px-4 py-2 rounded-xl bg-[#24211d] hover:bg-[#38342e] text-white font-bold shrink-0 self-start sm:self-auto flex items-center gap-1.5 transition-colors"
          >
            <span>Open Lender Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      )}

      {/* Empty State */}
      {displayedList.length === 0 && (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-[#ded7c8] bg-[#fcfbf9]">
          <div className="w-12 h-12 rounded-2xl bg-[#f4efe6] text-[#67635c] flex items-center justify-center mx-auto mb-3">
            <Wrench className="w-6 h-6 stroke-[1.8]" />
          </div>
          <h3 className="text-base font-bold text-[#24211d]">
            No requests found in this tab
          </h3>
          <p className="text-xs text-[#67635c] max-w-sm mx-auto mt-1 mb-4">
            {roleTab === "borrower"
              ? "Browse the local neighborhood library and borrow drills, mowers, washers, and more."
              : "You have no incoming borrow requests for your listed tools right now."}
          </p>
          {roleTab === "borrower" && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onSwitchToCatalog}
              className="px-4 py-2 rounded-xl bg-[#c86d51] hover:bg-[#b0553b] text-white text-xs font-bold transition-all shadow-xs"
            >
              Explore Tool Catalog
            </motion.button>
          )}
        </div>
      )}

      {/* Request Cards Grid with Motion and Stagger */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedList.map((req, idx) => {
          const isLender = req.ownerId === currentUser?.id;
          const otherPersonName = isLender ? req.borrowerName : req.ownerName;
          const otherPersonAvatar = isLender
            ? req.borrowerAvatar
            : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80";
          const otherPersonId = isLender ? req.borrowerId : req.ownerId;

          return (
            <motion.div
              key={req.id}
              id={`borrow-request-card-${req.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
              whileHover={{ y: -3 }}
              className="bg-[#fcfbf9] border border-[#ded7c8] hover:border-[#c86d51]/50 hover:shadow-lg rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all duration-200"
            >
              {/* Header: Tool Info & Status */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={req.toolImage}
                      alt={req.toolTitle}
                      className="w-14 h-14 rounded-xl object-cover border border-[#ded7c8] bg-[#f1ede4] shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#f4efe6] text-[#67635c] border border-[#ded7c8]">
                        {req.toolCategory}
                      </span>
                      <h4 className="text-sm font-bold text-[#24211d] leading-snug line-clamp-1 mt-1">
                        {req.toolTitle}
                      </h4>
                      <span className="text-[11px] text-[#67635c]">
                        {isLender ? "Requested by " : "Borrowed from "}
                        <strong className="text-[#24211d]">
                          {otherPersonName}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div>
                    {req.status === "pending" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#fdf3d8] text-[#916500] border border-[#e6c86e]">
                        <Clock className="w-3 h-3" />
                        Pending Approval
                      </span>
                    )}
                    {req.status === "approved" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#eef4f0] text-[#496350] border border-[#5f7d66]/40">
                        <CheckCircle2 className="w-3 h-3 text-[#5f7d66]" />
                        Approved
                      </span>
                    )}
                    {req.status === "active" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#fbeee9] text-[#b0553b] border border-[#c86d51]/40">
                        <PackageCheck className="w-3 h-3 text-[#c86d51]" />
                        In Use
                      </span>
                    )}
                    {req.status === "returned" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#eef4f0] text-[#496350] border border-[#5f7d66]/40">
                        <CheckCircle2 className="w-3 h-3 text-[#5f7d66]" />
                        Returned & Safe
                      </span>
                    )}
                    {req.status === "rejected" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#fce8e6] text-[#c53929] border border-[#f5b5ad]">
                        <XCircle className="w-3 h-3" />
                        Declined
                      </span>
                    )}
                  </div>
                </div>

                {/* Reservation Dates & Cost Breakdown */}
                <div className="mt-3.5 p-3 rounded-xl bg-[#faf8f5] border border-[#ded7c8] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[#4e4a43]">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#c86d51]" />
                      <span>
                        {req.startDate} to {req.endDate}
                      </span>
                    </div>
                    <span className="font-semibold text-[#24211d]">
                      {req.daysCount} days
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[#ede7db] text-[11px] text-[#67635c]">
                    <span>
                      Fee: RM {req.maintenanceFee} • Deposit: RM{" "}
                      {req.depositFee}
                    </span>
                    <span className="font-bold text-[#24211d]">
                      Total: RM {req.totalPaid}
                    </span>
                  </div>

                  {req.purposeNote && (
                    <div className="text-[11px] text-[#67635c] italic pt-1">
                      "{req.purposeNote}"
                    </div>
                  )}

                  {req.depositRefunded && (
                    <div className="text-[11px] font-semibold text-[#5f7d66] flex items-center gap-1 pt-1">
                      <CheckCircle2 className="w-3 h-3" />
                      RM {req.depositFee} Security Deposit released back to
                      borrower!
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons with Motion */}
              <div className="pt-2 border-t border-[#f1ede4] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-[#67635c]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#5f7d66]" />
                  <span>Verified Contact: {otherPersonName}</span>
                </div>

                {/* Role specific workflow actions */}
                <div className="flex items-center gap-2">
                  {isLender ? (
                    <>
                      {req.status === "pending" && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() =>
                              onUpdateStatus(req.id, "rejected", "reject")
                            }
                            className="py-1.5 px-3 rounded-xl border border-[#ded7c8] hover:bg-[#eae3d5] text-xs font-semibold text-[#67635c] transition-colors"
                          >
                            Decline
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() =>
                              onUpdateStatus(req.id, "approved", "approve")
                            }
                            className="py-1.5 px-3.5 rounded-xl bg-[#5f7d66] hover:bg-[#496350] text-white text-xs font-bold shadow-xs flex items-center gap-1 transition-all"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Approve
                          </motion.button>
                        </>
                      )}

                      {req.status === "approved" && (
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() =>
                            onUpdateStatus(req.id, "active", "pickup")
                          }
                          className="py-1.5 px-3.5 rounded-xl bg-[#c86d51] hover:bg-[#b0553b] text-white text-xs font-bold shadow-xs flex items-center gap-1 transition-all"
                        >
                          <PackageCheck className="w-3.5 h-3.5" />
                          Confirm Handover / Pickup
                        </motion.button>
                      )}

                      {req.status === "active" && (
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() =>
                            onUpdateStatus(req.id, "returned", "return")
                          }
                          className="py-1.5 px-3.5 rounded-xl bg-[#5f7d66] hover:bg-[#496350] text-white text-xs font-bold shadow-xs flex items-center gap-1 transition-all"
                          title="Verify item condition and release deposit back to neighbor"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Confirm Return & Release Deposit
                        </motion.button>
                      )}
                    </>
                  ) : (
                    <>
                      {req.status === "returned" && (
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => onOpenReviewModal(req)}
                          className="py-1.5 px-3 rounded-xl border border-[#c86d51] text-[#c86d51] hover:bg-[#fbeee9] text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          Item & Service Feedback
                        </motion.button>
                      )}
                      {req.status === "pending" && (
                        <span className="text-[11px] text-[#67635c] italic">
                          Awaiting neighbor confirmation
                        </span>
                      )}
                      {req.status === "approved" && (
                        <span className="text-[11px] font-semibold text-[#5f7d66]">
                          Ready for pickup at arranged porch time!
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
