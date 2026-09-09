import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Wrench,
  ShieldCheck,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  PackageCheck,
  DollarSign,
  Layers,
  Sparkles,
  Sliders,
  Trash2,
  Edit3,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileText,
  HelpCircle,
  Lock,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";
import type { User, ToolItem, BorrowRequest } from "../types.ts";

interface LenderDashboardProps {
  currentUser: User | null;
  tools: ToolItem[];
  borrowRequests: BorrowRequest[];
  onOpenAddModal: () => void;
  onUpdateStatus: (
    requestId: string | number,
    status: string,
    action?: string,
  ) => Promise<void>;
  onToolUpdated: () => void;
  onSelectToolDetail: (tool: ToolItem) => void;
  onOpenAuthModal: (text?: string) => void;
}

export const LenderDashboard: React.FC<LenderDashboardProps> = ({
  currentUser,
  tools,
  borrowRequests,
  onOpenAddModal,
  onUpdateStatus,
  onToolUpdated,
  onSelectToolDetail,
  onOpenAuthModal,
}) => {
  // Navigation within Lender Hub
  const [activeSubTab, setActiveSubTab] = useState<
    "queue" | "inventory" | "ledger" | "safety"
  >("queue");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<ToolItem | null>(null);
  const [editDailyFee, setEditDailyFee] = useState<number>(0);
  const [editDeposit, setEditDeposit] = useState<number>(0);
  const [editPickupNote, setEditPickupNote] = useState<string>("");
  const [isUpdatingTool, setIsUpdatingTool] = useState(false);

  // Return Inspection Confirmation Modal
  const [inspectingRequest, setInspectingRequest] =
    useState<BorrowRequest | null>(null);
  const [inspectionPassed, setInspectionPassed] = useState(true);
  const [inspectionNotes, setInspectionNotes] = useState("");
  const [isProcessingReturn, setIsProcessingReturn] = useState(false);

  // Decline Request Modal
  const [decliningRequest, setDecliningRequest] =
    useState<BorrowRequest | null>(null);
  const [declineReason, setDeclineReason] = useState("");

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-[#fcfbf9] border border-[#ded7c8] rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#f4efe6] text-[#c86d51] flex items-center justify-center mx-auto mb-4 shadow-xs">
            <Wrench className="w-8 h-8 stroke-2" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#24211d] tracking-tight">
            Lender Management Hub
          </h2>
          <p className="text-sm text-[#67635c] max-w-md mx-auto mt-2 mb-6">
            Sign in with your verified neighborhood account to review incoming
            borrow requests, manage equipment inventory, and track maintenance
            earnings.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              onOpenAuthModal(
                "Sign in to access your lender dashboard and manage your equipment pool.",
              )
            }
            className="px-6 py-3 rounded-xl bg-[#c86d51] hover:bg-[#b0553b] text-white text-sm font-bold shadow-sm transition-all"
          >
            Sign In as Neighbor / Lender
          </motion.button>
        </div>
      </div>
    );
  }

  // Filter tools owned strictly by current lender
  const myTools = tools.filter((t) => t.ownerId === currentUser.id);

  // Filter borrow requests for tools owned by current lender
  const myLenderRequests = borrowRequests.filter(
    (r) => r.ownerId === currentUser.id,
  );

  // Sub-queues for lender
  const pendingRequests = myLenderRequests.filter(
    (r) => r.status === "pending",
  );
  const approvedAwaitingPickup = myLenderRequests.filter(
    (r) => r.status === "approved",
  );
  const activeLoans = myLenderRequests.filter((r) => r.status === "active");
  const completedLoans = myLenderRequests.filter(
    (r) => r.status === "returned",
  );

  // Financial calculations strictly for this lender
  const totalFeesEarned =
    completedLoans.reduce((sum, r) => sum + (r.maintenanceFee || 0), 0) +
    activeLoans.reduce((sum, r) => sum + (r.maintenanceFee || 0), 0);

  const activeEscrowHeld =
    activeLoans.reduce((sum, r) => sum + (r.depositFee || 0), 0) +
    approvedAwaitingPickup.reduce((sum, r) => sum + (r.depositFee || 0), 0);

  // Toggle Maintenance Mode on a tool
  const handleToggleMaintenance = async (tool: ToolItem) => {
    try {
      const nextStatus =
        tool.status === "maintenance" ? "available" : "maintenance";
      const res = await fetch(`/api/tools/${tool.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        onToolUpdated();
      }
    } catch (err) {
      console.error("Failed to toggle tool maintenance status:", err);
    }
  };

  // Open Edit Tool Modal
  const handleOpenEditTool = (tool: ToolItem) => {
    setEditingTool(tool);
    setEditDailyFee(tool.price ?? tool.maintenanceFeePerDay ?? 0);
    setEditDeposit(tool.deposit ?? tool.depositAmount ?? 0);
    setEditPickupNote(tool.pickupNote || "");
    setIsEditModalOpen(true);
  };

  // Save Tool Updates
  const handleSaveToolEdits = async () => {
    if (!editingTool) return;
    setIsUpdatingTool(true);
    try {
      const res = await fetch(`/api/tools/${editingTool.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maintenanceFeePerDay: editDailyFee,
          depositAmount: editDeposit,
          pickupNote: editPickupNote,
        }),
      });
      if (res.ok) {
        onToolUpdated();
        setIsEditModalOpen(false);
      }
    } catch (err) {
      console.error("Failed to update tool listing:", err);
    } finally {
      setIsUpdatingTool(false);
    }
  };

  // Delete Tool
  const handleDeleteTool = async (toolId: string | number, title: string) => {
    if (
      !window.confirm(
        `Are you sure you want to remove "${title}" from your lending catalog?`,
      )
    ) {
      return;
    }
    try {
      const res = await fetch(`/api/tools/${toolId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        onToolUpdated();
      }
    } catch (err) {
      console.error("Failed to delete tool:", err);
    }
  };

  // Return Inspection Confirmation
  const handleConfirmReturnInspection = async () => {
    if (!inspectingRequest) return;
    setIsProcessingReturn(true);
    try {
      await onUpdateStatus(inspectingRequest.id, "returned", "return");
      setInspectingRequest(null);
      setInspectionNotes("");
      setInspectionPassed(true);
    } catch (err) {
      console.error("Failed to complete return inspection:", err);
    } finally {
      setIsProcessingReturn(false);
    }
  };

  // Handle decline with note
  const handleConfirmDecline = async () => {
    if (!decliningRequest) return;
    try {
      await onUpdateStatus(decliningRequest.id, "rejected", "reject");
      setDecliningRequest(null);
      setDeclineReason("");
    } catch (err) {
      console.error("Failed to decline request:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 text-left">
      {/* Lender Executive Banner */}
      <div className="bg-[#f4efe6] border border-[#ded7c8] rounded-3xl p-5 sm:p-7 relative overflow-hidden shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Lender Info */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-white shadow-sm"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#5f7d66] text-white flex items-center justify-center border-2 border-white shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#24211d] tracking-tight">
                  {currentUser.name}&apos;s Lender Hub
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#c86d51]/15 text-[#b0553b] border border-[#c86d51]/30">
                  Verified Equipment Lender
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#67635c] mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>
                  Pool:{" "}
                  <strong>
                    {currentUser.neighborhoodName} ({currentUser.postcode})
                  </strong>
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="text-[#5f7d66] font-semibold">
                  ★ {(currentUser.trustScore ?? 5.0).toFixed(1)} Lender Trust
                </span>
                <span className="hidden sm:inline">•</span>
                <span>
                  {currentUser.onTimeReturnRate || 100}% Handover Accuracy
                </span>
              </p>
            </div>
          </div>

          {/* Quick Action Button for Lender */}
          <div className="flex items-center gap-3 shrink-0">
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#c86d51] hover:bg-[#b0553b] text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>List New Equipment</span>
            </motion.button>
          </div>
        </div>

        {/* Lender Trust & Escrow Guarantee Banner */}
        <div className="mt-5 pt-4 border-t border-[#ded7c8] flex flex-wrap items-center justify-between gap-3 text-xs text-[#67635c]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#5f7d66] animate-ping" />
            <span className="font-semibold text-[#24211d]">
              Community Auto-Escrow Protection Active:
            </span>
            <span>
              Security deposits are locked by the system until you inspect and
              clear returns.
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#5f7d66] font-bold bg-[#eef4f0] px-2.5 py-1 rounded-lg border border-[#5f7d66]/20">
            <Lock className="w-3 h-3" />
            Zero Platform Commission • 100% Retained Maintenance
          </div>
        </div>
      </div>

      {/* Lender KPI Metric Cards (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Total Earnings */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-4 sm:p-5 rounded-2xl bg-[#fcfbf9] border border-[#ded7c8] hover:border-[#c86d51]/40 shadow-2xs transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-[#8c867b] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Maintenance Earned
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#fbeee9] text-[#c86d51] flex items-center justify-center">
              <DollarSign className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-[#24211d] tracking-tight">
              RM {totalFeesEarned.toLocaleString()}
            </div>
            <span className="text-[11px] text-[#5f7d66] font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> From{" "}
              {completedLoans.length + activeLoans.length} neighborhood loans
            </span>
          </div>
        </motion.div>

        {/* Metric 2: Escrow Deposits Held */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-4 sm:p-5 rounded-2xl bg-[#fcfbf9] border border-[#ded7c8] hover:border-[#5f7d66]/40 shadow-2xs transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-[#8c867b] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Guarded Escrow
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#eef4f0] text-[#5f7d66] flex items-center justify-center">
              <Lock className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-[#5f7d66] tracking-tight">
              RM {activeEscrowHeld.toLocaleString()}
            </div>
            <span className="text-[11px] text-[#67635c] font-medium block mt-1">
              Securing {activeLoans.length + approvedAwaitingPickup.length}{" "}
              active items
            </span>
          </div>
        </motion.div>

        {/* Metric 3: Active Loans Out */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-4 sm:p-5 rounded-2xl bg-[#fcfbf9] border border-[#ded7c8] hover:border-[#24211d]/40 shadow-2xs transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-[#8c867b] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Currently on Loan
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#f4efe6] text-[#24211d] flex items-center justify-center">
              <Wrench className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-[#24211d] tracking-tight">
              {activeLoans.length}{" "}
              <span className="text-xs font-semibold text-[#8c867b]">
                / {myTools.length} tools
              </span>
            </div>
            <span className="text-[11px] text-[#67635c] font-medium block mt-1">
              {approvedAwaitingPickup.length} approved awaiting pickup
            </span>
          </div>
        </motion.div>

        {/* Metric 4: Pending Action Requests */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-4 sm:p-5 rounded-2xl bg-[#fcfbf9] border border-[#ded7c8] hover:border-[#c86d51]/50 shadow-2xs transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-[#8c867b] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Action Queue
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#c86d51]/10 text-[#c86d51] flex items-center justify-center">
              <Clock className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-[#c86d51] tracking-tight">
              {pendingRequests.length} Pending
            </div>
            <span className="text-[11px] text-[#b0553b] font-semibold block mt-1">
              {pendingRequests.length > 0
                ? "Requires your approval"
                : "All clear right now"}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Lender Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#ded7c8] pb-1 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab("queue")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === "queue"
              ? "bg-[#24211d] text-[#faf8f5] shadow-sm"
              : "text-[#67635c] hover:text-[#24211d] hover:bg-[#ede7db]"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Borrow Requests & Active Loans</span>
          {pendingRequests.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#c86d51] text-white text-[10px] font-extrabold animate-pulse">
              {pendingRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab("inventory")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === "inventory"
              ? "bg-[#24211d] text-[#faf8f5] shadow-sm"
              : "text-[#67635c] hover:text-[#24211d] hover:bg-[#ede7db]"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>My Listed Equipment ({myTools.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("ledger")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === "ledger"
              ? "bg-[#24211d] text-[#faf8f5] shadow-sm"
              : "text-[#67635c] hover:text-[#24211d] hover:bg-[#ede7db]"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Earnings & Escrow Ledger</span>
        </button>

        <button
          onClick={() => setActiveSubTab("safety")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === "safety"
              ? "bg-[#24211d] text-[#faf8f5] shadow-sm"
              : "text-[#67635c] hover:text-[#24211d] hover:bg-[#ede7db]"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Lender Handover & Safety Protocol</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* SUB-TAB 1: QUEUE & ACTIVE WORKFLOWS */}
      {/* ========================================================= */}
      {activeSubTab === "queue" && (
        <div className="space-y-6">
          {/* Section A: Pending Borrow Requests (Action Required) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#24211d] flex items-center gap-2">
                  <span>Incoming Neighbor Requests</span>
                  {pendingRequests.length > 0 && (
                    <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-[#fbeee9] text-[#b0553b] border border-[#c86d51]/30">
                      Action Needed
                    </span>
                  )}
                </h2>
                <p className="text-xs text-[#67635c]">
                  Review and approve loan requests from verified residents in
                  your geofenced neighborhood.
                </p>
              </div>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="p-8 rounded-2xl border border-dashed border-[#ded7c8] bg-[#fcfbf9] text-center">
                <div className="w-10 h-10 rounded-xl bg-[#f4efe6] text-[#8c867b] flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-5 h-5 text-[#5f7d66]" />
                </div>
                <h3 className="text-sm font-bold text-[#24211d]">
                  No pending requests
                </h3>
                <p className="text-xs text-[#67635c] max-w-sm mx-auto mt-1">
                  You are all caught up! When neighbors in{" "}
                  {currentUser.neighborhoodName} request your tools, they will
                  appear here for approval.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingRequests.map((req) => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-[#fcfbf9] border-2 border-[#c86d51]/30 hover:border-[#c86d51] shadow-sm flex flex-col justify-between space-y-4 transition-all"
                  >
                    <div>
                      {/* Borrower Info & Tool Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={req.borrowerAvatar}
                            alt={req.borrowerName}
                            className="w-11 h-11 rounded-full object-cover border border-[#ded7c8]"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-bold text-[#24211d]">
                                {req.borrowerName}
                              </span>
                              <ShieldCheck className="w-3.5 h-3.5 text-[#5f7d66]" />
                            </div>
                            <span className="text-xs text-[#67635c]">
                              Neighbor • ★ {(req.borrowerTrust ?? 5.0).toFixed(1)} Trust
                            </span>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#fbeee9] text-[#b0553b] border border-[#c86d51]/30">
                          Pending Approval
                        </span>
                      </div>

                      {/* Tool & Request Summary */}
                      <div className="p-3 rounded-xl bg-[#f4efe6] border border-[#ded7c8] flex items-center gap-3 mb-3">
                        <img
                          src={req.toolImage}
                          alt={req.toolTitle}
                          className="w-12 h-12 rounded-lg object-cover border border-[#ded7c8] shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-[#24211d] truncate">
                            {req.toolTitle}
                          </h4>
                          <span className="text-[11px] text-[#67635c] block">
                            {req.toolCategory}
                          </span>
                          <span className="text-[11px] font-semibold text-[#c86d51] flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3" />
                            {req.startDate} to {req.endDate} ({req.daysCount}{" "}
                            days)
                          </span>
                        </div>
                      </div>

                      {/* Borrower Note / Purpose */}
                      {req.purposeNote && (
                        <div className="p-2.5 rounded-lg bg-[#faf8f5] border border-[#ded7c8] text-xs text-[#4e4a43] italic mb-3">
                          &ldquo;{req.purposeNote}&rdquo;
                        </div>
                      )}

                      {/* Financials for Lender */}
                      <div className="flex items-center justify-between text-xs py-2 border-t border-b border-[#f1ede4]">
                        <span className="text-[#67635c]">
                          Maintenance Earnings:{" "}
                          <strong className="text-[#24211d] font-extrabold">
                            {req.maintenanceFee === 0
                              ? "Free (Community)"
                              : `RM ${req.maintenanceFee}`}
                          </strong>
                        </span>
                        <span className="text-[#5f7d66] font-semibold flex items-center gap-1">
                          <Lock className="w-3 h-3" /> RM {req.depositFee}{" "}
                          Deposit Held
                        </span>
                      </div>
                    </div>

                    {/* Decision Actions */}
                    <div className="flex items-center justify-between gap-2 pt-2">
                      <div className="text-xs text-[#67635c] flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#5f7d66]" />
                        <span>Verified Neighbor</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => setDecliningRequest(req)}
                          className="py-2 px-3 rounded-xl border border-[#ded7c8] hover:bg-[#fbeee9] hover:text-[#b0553b] text-xs font-semibold text-[#67635c] transition-colors"
                        >
                          Decline
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() =>
                            onUpdateStatus(req.id, "approved", "approve")
                          }
                          className="py-2 px-4 rounded-xl bg-[#5f7d66] hover:bg-[#496350] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve Loan</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Section B: Ready for Handover / Collection */}
          {approvedAwaitingPickup.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-[#ded7c8]">
              <div>
                <h2 className="text-base font-bold text-[#24211d] flex items-center gap-2">
                  <span>Approved & Awaiting Pickup / Handover</span>
                  <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-[#f4efe6] text-[#24211d]">
                    {approvedAwaitingPickup.length}
                  </span>
                </h2>
                <p className="text-xs text-[#67635c]">
                  Neighbor has paid deposit into escrow. Coordinate with
                  neighbor, then confirm pickup once you hand over the tool.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {approvedAwaitingPickup.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 rounded-2xl bg-[#fcfbf9] border border-[#ded7c8] hover:border-[#c86d51]/50 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={req.borrowerAvatar}
                            alt={req.borrowerName}
                            className="w-9 h-9 rounded-full object-cover border border-[#ded7c8]"
                          />
                          <div>
                            <span className="text-xs font-bold text-[#24211d] block">
                              {req.borrowerName}
                            </span>
                            <span className="text-[11px] text-[#67635c]">
                              {req.daysCount} days reservation
                            </span>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#eef4f0] text-[#496350] border border-[#5f7d66]/30">
                          Approved • Ready
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-[#faf8f5] border border-[#ded7c8] flex items-center gap-3 mb-3">
                        <img
                          src={req.toolImage}
                          alt={req.toolTitle}
                          className="w-10 h-10 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#24211d] truncate">
                            {req.toolTitle}
                          </h4>
                          <span className="text-[11px] text-[#5f7d66] font-semibold">
                            Scheduled: {req.startDate} to {req.endDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#f1ede4]">
                      <div className="text-xs text-[#67635c] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#c86d51]" />
                        <span>Awaiting Pickup</span>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() =>
                          onUpdateStatus(req.id, "active", "pickup")
                        }
                        className="py-1.5 px-3.5 rounded-xl bg-[#c86d51] hover:bg-[#b0553b] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
                        title="Click when you hand over the tool to the neighbor"
                      >
                        <PackageCheck className="w-3.5 h-3.5" />
                        <span>Confirm Handover / Pickup</span>
                      </motion.button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section C: Tools Currently Out on Loan (Active) */}
          <div className="space-y-3 pt-4 border-t border-[#ded7c8]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#24211d] flex items-center gap-2">
                  <span>Tools Currently Out with Neighbors</span>
                  <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-[#f4efe6] text-[#24211d]">
                    {activeLoans.length} active
                  </span>
                </h2>
                <p className="text-xs text-[#67635c]">
                  Items currently in neighbors&apos; possession. When the
                  neighbor returns your tool, inspect it and complete the
                  return.
                </p>
              </div>
            </div>

            {activeLoans.length === 0 ? (
              <div className="p-6 rounded-2xl border border-[#ded7c8] bg-[#fcfbf9] text-center text-xs text-[#67635c]">
                No tools are currently out on loan. All your available equipment
                is resting in your garage.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeLoans.map((req) => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-[#fcfbf9] border border-[#5f7d66]/50 shadow-2xs flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={req.borrowerAvatar}
                            alt={req.borrowerName}
                            className="w-10 h-10 rounded-full object-cover border border-[#ded7c8]"
                          />
                          <div>
                            <span className="text-xs font-bold text-[#24211d] block">
                              {req.borrowerName}
                            </span>
                            <span className="text-[11px] text-[#5f7d66] font-semibold">
                              ★ {(req.borrowerTrust ?? 5.0).toFixed(1)} Trust
                            </span>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#5f7d66] text-white shadow-xs">
                          Active Loan
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-[#f4efe6] border border-[#ded7c8] flex items-center gap-3 mb-3">
                        <img
                          src={req.toolImage}
                          alt={req.toolTitle}
                          className="w-11 h-11 rounded-lg object-cover border border-[#ded7c8] shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#24211d] truncate">
                            {req.toolTitle}
                          </h4>
                          <span className="text-[11px] text-[#8c867b] block">
                            {req.toolCategory}
                          </span>
                          <span className="text-[11px] font-bold text-[#24211d] flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-[#c86d51]" /> Due
                            Date: {req.endDate}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs py-1 text-[#67635c]">
                        <span>Maintenance Fee: RM {req.maintenanceFee}</span>
                        <span className="text-[#5f7d66] font-semibold flex items-center gap-1">
                          <Lock className="w-3 h-3" /> RM {req.depositFee} in
                          Escrow
                        </span>
                      </div>
                    </div>

                    {/* Actions: Chat & Return Verification */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#f1ede4]">
                      <div className="text-xs text-[#67635c] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#5f7d66]" />
                        <span>Active On-Loan Period</span>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setInspectingRequest(req)}
                        className="py-2 px-4 rounded-xl bg-[#5f7d66] hover:bg-[#496350] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Inspect & Confirm Return</span>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 2: INVENTORY & LISTINGS MANAGEMENT */}
      {/* ========================================================= */}
      {activeSubTab === "inventory" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#24211d]">
                My Registered Tool Inventory
              </h2>
              <p className="text-xs text-[#67635c]">
                Toggle maintenance mode, adjust daily fees or deposits, and
                track how many times your tools have been borrowed.
              </p>
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#c86d51] hover:bg-[#b0553b] text-white text-xs font-bold shadow-xs self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Another Tool</span>
            </motion.button>
          </div>

          {myTools.length === 0 ? (
            <div className="p-12 rounded-3xl border border-dashed border-[#ded7c8] bg-[#fcfbf9] text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#f4efe6] text-[#c86d51] flex items-center justify-center mx-auto mb-3">
                <Wrench className="w-6 h-6 stroke-2" />
              </div>
              <h3 className="text-sm font-bold text-[#24211d]">
                You haven&apos;t listed any tools yet
              </h3>
              <p className="text-xs text-[#67635c] max-w-sm mx-auto mt-1 mb-4">
                Share your ladder, pressure washer, drill, or lawn mower with
                verified neighbors in your neighborhood.
              </p>
              <button
                onClick={onOpenAddModal}
                className="px-4 py-2 rounded-xl bg-[#c86d51] text-white text-xs font-bold shadow-xs hover:bg-[#b0553b]"
              >
                List Your First Tool
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myTools.map((tool) => {
                const isAvailable = tool.status === "available";
                const isBorrowed = tool.status === "borrowed";
                const isMaintenance = tool.status === "maintenance";

                return (
                  <motion.div
                    key={tool.id}
                    layout
                    className="bg-[#fcfbf9] border border-[#ded7c8] hover:border-[#c86d51]/50 rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-all shadow-2xs"
                  >
                    <div>
                      {/* Image & Status Header */}
                      <div className="relative aspect-video rounded-xl bg-[#f1ede4] overflow-hidden mb-3">
                        <img
                          src={tool.imageUrl}
                          alt={tool.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          {isAvailable && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#eef4f0] text-[#496350] border border-[#5f7d66]/40 shadow-xs">
                              Available
                            </span>
                          )}
                          {isBorrowed && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#fbeee9] text-[#b0553b] border border-[#c86d51]/40 shadow-xs">
                              Out on Loan
                            </span>
                          )}
                          {isMaintenance && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#eae6dc] text-[#67635c] border border-[#ded7c8] shadow-xs">
                              In Maintenance
                            </span>
                          )}
                        </div>

                        <div className="absolute top-2 right-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/70 text-white backdrop-blur-xs">
                            {tool.condition}
                          </span>
                        </div>
                      </div>

                      {/* Tool Title & Specs */}
                      <div>
                        <span className="text-[10px] font-bold text-[#8c867b] uppercase tracking-wider">
                          {tool.brand} {tool.model && `• ${tool.model}`}
                        </span>
                        <h3 className="text-sm font-bold text-[#24211d] line-clamp-1">
                          {tool.title}
                        </h3>
                        <p className="text-xs text-[#67635c] line-clamp-2 mt-1">
                          {tool.description}
                        </p>
                      </div>

                      {/* Pricing & Deposit */}
                      <div className="mt-3 pt-2.5 border-t border-[#f1ede4] flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[#8c867b]">Daily Fee: </span>
                          <strong className="text-[#24211d]">
                            {tool.maintenanceFeePerDay === 0
                              ? "Free"
                              : `RM ${tool.maintenanceFeePerDay}/day`}
                          </strong>
                        </div>
                        <div>
                          <span className="text-[#8c867b]">Deposit: </span>
                          <strong className="text-[#5f7d66]">
                            RM {tool.depositAmount}
                          </strong>
                        </div>
                      </div>

                      {/* Pickup note snippet */}
                      {tool.pickupNote && (
                        <div className="mt-2 text-[11px] text-[#67635c] truncate bg-[#faf8f5] px-2 py-1 rounded-md border border-[#ded7c8]">
                          📍 {tool.pickupNote}
                        </div>
                      )}
                    </div>

                    {/* Operational Actions */}
                    <div className="pt-2 border-t border-[#f1ede4] flex items-center justify-between gap-1.5">
                      <button
                        onClick={() => handleToggleMaintenance(tool)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1 ${
                          isMaintenance
                            ? "bg-[#eef4f0] text-[#496350] border-[#5f7d66]/40 hover:bg-[#d8e7dc]"
                            : "bg-[#faf8f5] text-[#67635c] border-[#ded7c8] hover:bg-[#ede7db]"
                        }`}
                        title="Mark in/out of maintenance"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>
                          {isMaintenance ? "Set Available" : "Maintenance"}
                        </span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditTool(tool)}
                          className="p-1.5 rounded-xl border border-[#ded7c8] bg-[#faf8f5] hover:bg-[#ede7db] text-[#4e4a43] transition-colors"
                          title="Edit pricing and pickup note"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteTool(tool.id, tool.title)}
                          className="p-1.5 rounded-xl border border-[#ded7c8] bg-[#faf8f5] hover:bg-[#fbeee9] hover:text-[#b0553b] text-[#67635c] transition-colors"
                          title="Remove tool from catalog"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onSelectToolDetail(tool)}
                          className="p-1.5 rounded-xl border border-[#ded7c8] bg-[#faf8f5] hover:bg-[#ede7db] text-[#4e4a43] transition-colors"
                          title="View public preview"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 3: EARNINGS & ESCROW LEDGER */}
      {/* ========================================================= */}
      {activeSubTab === "ledger" && (
        <div className="space-y-6">
          <div className="bg-[#fcfbf9] border border-[#ded7c8] rounded-3xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#24211d]">
                  Lender Settlement & Payouts
                </h2>
                <p className="text-xs text-[#67635c]">
                  Maintenance fees are credited to you for tool upkeep,
                  replacement blades, and servicing.
                </p>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-[#eef4f0] border border-[#5f7d66]/30 text-xs text-[#496350]">
                <ShieldCheck className="w-4 h-4 text-[#5f7d66] shrink-0" />
                <span>
                  Payout Method:{" "}
                  <strong>DuitNow QR / Instant Bank Verified</strong>
                </span>
              </div>
            </div>

            {/* Financial Ledger Table */}
            <div className="mt-4 border border-[#ded7c8] rounded-2xl overflow-hidden bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f4efe6] text-[#4e4a43] border-b border-[#ded7c8] font-bold">
                    <tr>
                      <th className="p-3">Loan Reference</th>
                      <th className="p-3">Borrower</th>
                      <th className="p-3">Dates & Duration</th>
                      <th className="p-3">Maintenance Fee</th>
                      <th className="p-3">Escrow Deposit Status</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1ede4]">
                    {myLenderRequests.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="p-6 text-center text-[#8c867b]"
                        >
                          No loan transactions recorded yet.
                        </td>
                      </tr>
                    ) : (
                      myLenderRequests.map((req) => (
                        <tr
                          key={req.id}
                          className="hover:bg-[#faf8f5] transition-colors"
                        >
                          <td className="p-3">
                            <span className="font-bold text-[#24211d] block">
                              {req.toolTitle}
                            </span>
                            <span className="text-[10px] text-[#8c867b]">
                              ID: {req.id}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <img
                                src={req.borrowerAvatar}
                                alt={req.borrowerName}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                              <span className="font-semibold text-[#24211d]">
                                {req.borrowerName}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 text-[#67635c]">
                            {req.startDate} to {req.endDate} ({req.daysCount}d)
                          </td>
                          <td className="p-3 font-bold text-[#24211d]">
                            {req.maintenanceFee === 0
                              ? "Free"
                              : `+ RM ${req.maintenanceFee}`}
                          </td>
                          <td className="p-3">
                            {req.status === "returned" ? (
                              <span className="inline-flex items-center gap-1 text-[11px] text-[#5f7d66] font-semibold">
                                <Check className="w-3 h-3" /> RM{" "}
                                {req.depositFee} Refunded to Neighbor
                              </span>
                            ) : req.status === "active" ||
                              req.status === "approved" ? (
                              <span className="inline-flex items-center gap-1 text-[11px] text-[#c86d51] font-bold">
                                <Lock className="w-3 h-3" /> RM {req.depositFee}{" "}
                                Locked in Escrow
                              </span>
                            ) : (
                              <span className="text-[#8c867b]">None</span>
                            )}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold capitalize ${
                                req.status === "returned"
                                  ? "bg-[#eef4f0] text-[#496350]"
                                  : req.status === "active"
                                    ? "bg-[#5f7d66] text-white"
                                    : req.status === "approved"
                                      ? "bg-[#f4efe6] text-[#24211d]"
                                      : "bg-[#faf8f5] text-[#67635c]"
                              }`}
                            >
                              {req.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 4: LENDER HANDOVER & SAFETY PROTOCOL */}
      {/* ========================================================= */}
      {activeSubTab === "safety" && (
        <div className="space-y-4">
          <div className="bg-[#fcfbf9] border border-[#ded7c8] rounded-3xl p-6 space-y-5">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#24211d]">
                Lender Handover & Safety Protocol
              </h2>
              <p className="text-xs text-[#67635c]">
                Follow these standard community guidelines to protect your tools
                and ensure safe neighborly handovers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Step 1: Pre-Loan Handover Checklist */}
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#ded7c8] space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#24211d]">
                  <div className="w-6 h-6 rounded-lg bg-[#5f7d66] text-white flex items-center justify-center text-xs">
                    1
                  </div>
                  <span>Pre-Loan Handover Checklist</span>
                </div>
                <ul className="text-xs text-[#4e4a43] space-y-2 list-disc pl-5">
                  <li>
                    <strong>Test Power & Trigger:</strong> Plug in or insert
                    battery to demonstrate working condition in front of
                    neighbor.
                  </li>
                  <li>
                    <strong>Inspect Blade & Guards:</strong> Ensure protective
                    safety guards are firmly clamped and safety switches
                    disengage properly.
                  </li>
                  <li>
                    <strong>Provide Safety Gear:</strong> If including safety
                    glasses or earplugs, remind neighbor to wear them during
                    operation.
                  </li>
                  <li>
                    <strong>Agree on Return Time:</strong> Clarify porch
                    drop-off or hand-to-hand return hour before the due date.
                  </li>
                </ul>
              </div>

              {/* Step 2: Post-Return Inspection Checklist */}
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#ded7c8] space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#24211d]">
                  <div className="w-6 h-6 rounded-lg bg-[#c86d51] text-white flex items-center justify-center text-xs">
                    2
                  </div>
                  <span>Post-Return Inspection Checklist</span>
                </div>
                <ul className="text-xs text-[#4e4a43] space-y-2 list-disc pl-5">
                  <li>
                    <strong>Check Cleanliness:</strong> Equipment should be
                    returned wiped clean of excess sawdust, wet grass, or cement
                    dust.
                  </li>
                  <li>
                    <strong>Verify Accessories:</strong> Check for chargers,
                    chuck keys, extension hoses, and drill bit cases.
                  </li>
                  <li>
                    <strong>Report Damage Protocol:</strong> In the rare event
                    of severe damage due to misuse, contact JiranAid escrow
                    mediation before clearing deposit refund.
                  </li>
                  <li>
                    <strong>Confirm Return in App:</strong> Click &ldquo;Inspect
                    & Confirm Return&rdquo; to auto-release the deposit back to
                    your neighbor.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: RETURN & INSPECTION CONFIRMATION */}
      {/* ========================================================= */}
      <AnimatePresence>
        {inspectingRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#fcfbf9] border border-[#ded7c8] rounded-3xl p-6 shadow-xl space-y-4 text-left"
            >
              <div className="flex items-center justify-between border-b border-[#ded7c8] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#eef4f0] text-[#5f7d66] flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-[#24211d]">
                    Inspect Equipment & Release Deposit
                  </h3>
                </div>
                <button
                  onClick={() => setInspectingRequest(null)}
                  className="p-1 rounded-lg text-[#8c867b] hover:text-[#24211d] hover:bg-[#ede7db]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f4efe6] border border-[#ded7c8] flex items-center gap-3">
                <img
                  src={inspectingRequest.toolImage}
                  alt={inspectingRequest.toolTitle}
                  className="w-12 h-12 rounded-lg object-cover border border-[#ded7c8] shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#24211d] truncate">
                    {inspectingRequest.toolTitle}
                  </h4>
                  <span className="text-[11px] text-[#67635c] block">
                    Returned by {inspectingRequest.borrowerName} • RM{" "}
                    {inspectingRequest.depositFee} Deposit in Escrow
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-[#24211d] block">
                  Equipment Return Inspection:
                </label>

                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-[#ded7c8] bg-white cursor-pointer hover:bg-[#faf8f5]">
                    <input
                      type="radio"
                      name="inspectionResult"
                      checked={inspectionPassed}
                      onChange={() => setInspectionPassed(true)}
                      className="accent-[#5f7d66]"
                    />
                    <div className="text-xs">
                      <strong className="text-[#24211d] block">
                        Tool Returned in Good Condition
                      </strong>
                      <span className="text-[#67635c]">
                        No abnormal damage, clean, all parts accounted for. Safe
                        to release RM {inspectingRequest.depositFee} deposit
                        back to neighbor.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-[#ded7c8] bg-white cursor-pointer hover:bg-[#faf8f5]">
                    <input
                      type="radio"
                      name="inspectionResult"
                      checked={!inspectionPassed}
                      onChange={() => setInspectionPassed(false)}
                      className="accent-[#c86d51]"
                    />
                    <div className="text-xs">
                      <strong className="text-[#b0553b] block">
                        Minor Wear or Needs Cleaning (Acceptable)
                      </strong>
                      <span className="text-[#67635c]">
                        Tool is functional with normal signs of use. Deposit
                        will still be refunded in full.
                      </span>
                    </div>
                  </label>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#67635c] block mb-1">
                    Optional Handover Notes / Feedback for Neighbor:
                  </label>
                  <textarea
                    value={inspectionNotes}
                    onChange={(e) => setInspectionNotes(e.target.value)}
                    rows={2}
                    placeholder="E.g. Thanks for returning it clean and on time!"
                    className="w-full p-2.5 rounded-xl border border-[#ded7c8] bg-white text-xs focus:outline-none focus:ring-1 focus:ring-[#5f7d66]"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-[#ded7c8] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInspectingRequest(null)}
                  className="px-4 py-2 rounded-xl border border-[#ded7c8] text-xs font-semibold text-[#67635c] hover:bg-[#ede7db]"
                >
                  Cancel
                </button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={isProcessingReturn}
                  onClick={handleConfirmReturnInspection}
                  className="px-4 py-2 rounded-xl bg-[#5f7d66] hover:bg-[#496350] text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirm Return & Release Deposit</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL: EDIT TOOL PRICING & PICKUP NOTE */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isEditModalOpen && editingTool && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#fcfbf9] border border-[#ded7c8] rounded-3xl p-6 shadow-xl space-y-4 text-left"
            >
              <div className="flex items-center justify-between border-b border-[#ded7c8] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#fbeee9] text-[#c86d51] flex items-center justify-center">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-[#24211d]">
                    Edit Equipment Settings
                  </h3>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1 rounded-lg text-[#8c867b] hover:text-[#24211d] hover:bg-[#ede7db]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#24211d] truncate">
                  {editingTool.title}
                </h4>
                <span className="text-[11px] text-[#8c867b]">
                  {editingTool.category}
                </span>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#24211d] block mb-1">
                      Daily Fee (RM):
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={editDailyFee}
                      onChange={(e) => setEditDailyFee(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-[#ded7c8] bg-white text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#c86d51]"
                    />
                    <span className="text-[10px] text-[#8c867b] mt-0.5 block">
                      0 = Free sharing
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#24211d] block mb-1">
                      Security Deposit (RM):
                    </label>
                    <input
                      type="number"
                      min={5}
                      value={editDeposit}
                      onChange={(e) => setEditDeposit(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-[#ded7c8] bg-white text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#5f7d66]"
                    />
                    <span className="text-[10px] text-[#8c867b] mt-0.5 block">
                      Held in escrow
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#24211d] block mb-1">
                    Pickup & Handover Note:
                  </label>
                  <input
                    type="text"
                    value={editPickupNote}
                    onChange={(e) => setEditPickupNote(e.target.value)}
                    placeholder="E.g. Pick up at front gate after 9 AM"
                    className="w-full p-2.5 rounded-xl border border-[#ded7c8] bg-white text-xs focus:outline-none focus:ring-1 focus:ring-[#c86d51]"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-[#ded7c8] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#ded7c8] text-xs font-semibold text-[#67635c] hover:bg-[#ede7db]"
                >
                  Cancel
                </button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={isUpdatingTool}
                  onClick={handleSaveToolEdits}
                  className="px-4 py-2 rounded-xl bg-[#c86d51] hover:bg-[#b0553b] text-white text-xs font-bold shadow-xs"
                >
                  Save Changes
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL: DECLINE REQUEST WITH NOTE */}
      {/* ========================================================= */}
      <AnimatePresence>
        {decliningRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#fcfbf9] border border-[#ded7c8] rounded-3xl p-6 shadow-xl space-y-4 text-left"
            >
              <div className="flex items-center justify-between border-b border-[#ded7c8] pb-3">
                <h3 className="text-base font-bold text-[#24211d]">
                  Decline Borrow Request
                </h3>
                <button
                  onClick={() => setDecliningRequest(null)}
                  className="p-1 rounded-lg text-[#8c867b] hover:text-[#24211d] hover:bg-[#ede7db]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-[#67635c]">
                Decline request from{" "}
                <strong>{decliningRequest.borrowerName}</strong> for &ldquo;
                {decliningRequest.toolTitle}&rdquo;. Their payment deposit will
                be immediately released.
              </p>

              <div>
                <label className="text-xs font-bold text-[#24211d] block mb-1">
                  Reason for Declining (Optional):
                </label>
                <textarea
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  rows={2}
                  placeholder="E.g. Tool is currently scheduled for personal project this weekend."
                  className="w-full p-2.5 rounded-xl border border-[#ded7c8] bg-white text-xs focus:outline-none focus:ring-1 focus:ring-[#c86d51]"
                />
              </div>

              <div className="pt-2 border-t border-[#ded7c8] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDecliningRequest(null)}
                  className="px-4 py-2 rounded-xl border border-[#ded7c8] text-xs font-semibold text-[#67635c] hover:bg-[#ede7db]"
                >
                  Cancel
                </button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleConfirmDecline}
                  className="px-4 py-2 rounded-xl bg-[#c86d51] hover:bg-[#b0553b] text-white text-xs font-bold shadow-xs"
                >
                  Confirm Decline
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
