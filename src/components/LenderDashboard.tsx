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
        <div className="bg-[#faf9f6] border-3 border-black rounded-3xl p-8 sm:p-12 shadow-[8px_8px_0px_#000]">
          <div className="w-16 h-16 rounded-2xl bg-[#ffc900] border-2 border-black text-black flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0px_#000]">
            <Wrench className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Lender Management Hub
          </h2>
          <p className="text-sm font-medium text-black/70 max-w-md mx-auto mt-2 mb-6">
            Sign in with your verified neighborhood account to review incoming
            borrow requests, manage equipment inventory, and track maintenance
            earnings.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              onOpenAuthModal(
                "Sign in to access your lender dashboard and manage your equipment pool.",
              )
            }
            className="jn-btn px-6 py-3 rounded-2xl bg-[#ffc900] hover:bg-[#ffb700] text-black text-sm font-black border-2 border-black shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
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
      <div className="bg-[#ffc900] border-3 border-black rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-[6px_6px_0px_#000]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Lender Info */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border-2 border-black shadow-[2.5px_2.5px_0px_#000]"
              />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-[#bbf7d0] text-black flex items-center justify-center border-2 border-black shadow-[1px_1px_0px_#000]">
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                  {currentUser.name}&apos;s Lender Hub
                </h1>
                <span className="px-3 py-1 rounded-lg text-xs font-mono font-black bg-[#ff90e8] text-black border-2 border-black shadow-[1.5px_1.5px_0px_#000]">
                  Verified Lender
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-neutral-800 mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>
                  Pool:{" "}
                  <strong>
                    {currentUser.neighborhoodName} ({currentUser.postcode})
                  </strong>
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="bg-white border border-black px-2 py-0.5 rounded text-[11px] font-mono font-black">
                  ★ {(currentUser.trustScore ?? 5.0).toFixed(1)} Rating
                </span>
                <span className="hidden sm:inline">•</span>
                <span>
                  {currentUser.onTimeReturnRate || 100}% Accuracy
                </span>
              </p>
            </div>
          </div>

          {/* Quick Action Button for Lender */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenAddModal}
              className="jn-btn inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs sm:text-sm font-black border-2 border-black shadow-[3.5px_3.5px_0px_#ff90e8] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>List New Equipment</span>
            </button>
          </div>
        </div>

        {/* Lender Trust & Escrow Guarantee Banner */}
        <div className="mt-6 pt-4 border-t-2 border-black flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-black animate-pulse" />
            <span className="font-black text-black">
              Community Auto-Escrow Protection Active:
            </span>
            <span>
              Security deposits are locked by the system until you inspect and
              clear returns.
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-black font-mono font-black bg-[#bbf7d0] px-3 py-1 rounded-lg border-2 border-black shadow-[1.5px_1.5px_0px_#000]">
            <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
            Zero Platform Commission • 100% Retained Maintenance
          </div>
        </div>
      </div>

      {/* Lender KPI Metric Cards (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Earnings */}
        <div
          className="p-5 rounded-2xl bg-white border-2 border-black shadow-[4px_4px_0px_#000] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-black uppercase tracking-wider text-black">
              Maintenance Earned
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#ff90e8] border-2 border-black text-black flex items-center justify-center shadow-[1.5px_1.5px_0px_#000]">
              <DollarSign className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-black tracking-tight">
              RM {totalFeesEarned.toLocaleString()}
            </div>
            <span className="text-xs text-emerald-800 font-bold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" /> From{" "}
              {completedLoans.length + activeLoans.length} neighborhood loans
            </span>
          </div>
        </div>

        {/* Metric 2: Escrow Deposits Held */}
        <div
          className="p-5 rounded-2xl bg-white border-2 border-black shadow-[4px_4px_0px_#000] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-black uppercase tracking-wider text-black">
              Guarded Escrow
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#bbf7d0] border-2 border-black text-black flex items-center justify-center shadow-[1.5px_1.5px_0px_#000]">
              <Lock className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-black tracking-tight">
              RM {activeEscrowHeld.toLocaleString()}
            </div>
            <span className="text-xs text-neutral-600 font-bold block mt-1">
              Securing {activeLoans.length + approvedAwaitingPickup.length}{" "}
              active items
            </span>
          </div>
        </div>

        {/* Metric 3: Active Loans Out */}
        <div
          className="p-5 rounded-2xl bg-white border-2 border-black shadow-[4px_4px_0px_#000] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-black uppercase tracking-wider text-black">
              On Loan
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#ffc900] border-2 border-black text-black flex items-center justify-center shadow-[1.5px_1.5px_0px_#000]">
              <Wrench className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-black tracking-tight">
              {activeLoans.length}{" "}
              <span className="text-xs font-bold text-neutral-500 font-sans">
                / {myTools.length} tools
              </span>
            </div>
            <span className="text-xs text-neutral-600 font-bold block mt-1">
              {approvedAwaitingPickup.length} approved awaiting pickup
            </span>
          </div>
        </div>

        {/* Metric 4: Pending Action Requests */}
        <div
          className="p-5 rounded-2xl bg-white border-2 border-black shadow-[4px_4px_0px_#000] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-black uppercase tracking-wider text-black">
              Action Queue
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#ff90e8] border-2 border-black text-black flex items-center justify-center shadow-[1.5px_1.5px_0px_#000]">
              <Clock className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-black tracking-tight">
              {pendingRequests.length} Pending
            </div>
            <span className="text-xs font-bold text-neutral-600 block mt-1">
              {pendingRequests.length > 0
                ? "Requires your approval"
                : "All clear right now"}
            </span>
          </div>
        </div>
      </div>

      {/* Lender Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b-2 border-black pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab("queue")}
          className={`jn-btn px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap border-2 border-black cursor-pointer ${
            activeSubTab === "queue"
              ? "bg-black text-white shadow-[3px_3px_0px_#ff90e8]"
              : "bg-white text-black hover:bg-[#ffc900] shadow-[2px_2px_0px_#000]"
          }`}
        >
          <Clock className="w-4 h-4 stroke-[2.5]" />
          <span>Borrow Requests & Loans</span>
          {pendingRequests.length > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-[#ff90e8] text-black border border-black text-[10px] font-mono font-black animate-pulse">
              {pendingRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab("inventory")}
          className={`jn-btn px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap border-2 border-black cursor-pointer ${
            activeSubTab === "inventory"
              ? "bg-black text-white shadow-[3px_3px_0px_#ff90e8]"
              : "bg-white text-black hover:bg-[#ffc900] shadow-[2px_2px_0px_#000]"
          }`}
        >
          <Layers className="w-4 h-4 stroke-[2.5]" />
          <span>My Listed Equipment ({myTools.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("ledger")}
          className={`jn-btn px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap border-2 border-black cursor-pointer ${
            activeSubTab === "ledger"
              ? "bg-black text-white shadow-[3px_3px_0px_#ff90e8]"
              : "bg-white text-black hover:bg-[#ffc900] shadow-[2px_2px_0px_#000]"
          }`}
        >
          <DollarSign className="w-4 h-4 stroke-[2.5]" />
          <span>Earnings & Escrow Ledger</span>
        </button>

        <button
          onClick={() => setActiveSubTab("safety")}
          className={`jn-btn px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap border-2 border-black cursor-pointer ${
            activeSubTab === "safety"
              ? "bg-black text-white shadow-[3px_3px_0px_#ff90e8]"
              : "bg-white text-black hover:bg-[#ffc900] shadow-[2px_2px_0px_#000]"
          }`}
        >
          <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
          <span>Handover & Safety Protocol</span>
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
                <h2 className="text-lg font-black text-black flex items-center gap-2">
                  <span>Incoming Neighbor Requests</span>
                  {pendingRequests.length > 0 && (
                    <span className="px-2.5 py-0.5 text-[11px] font-mono font-black rounded-lg bg-[#ff90e8] text-black border-2 border-black shadow-[1px_1px_0px_#000]">
                      Action Needed
                    </span>
                  )}
                </h2>
                <p className="text-xs font-medium text-neutral-600">
                  Review and approve loan requests from verified residents in
                  your geofenced neighborhood.
                </p>
              </div>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="p-8 rounded-3xl border-2 border-dashed border-black bg-white text-center shadow-[3px_3px_0px_#000]">
                <div className="w-12 h-12 rounded-2xl bg-[#ffc900] border-2 border-black text-black flex items-center justify-center mx-auto mb-2 shadow-[2px_2px_0px_#000]">
                  <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-sm font-black text-black">
                  No pending requests
                </h3>
                <p className="text-xs font-medium text-neutral-600 max-w-sm mx-auto mt-1">
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
                    className="p-5 rounded-2xl bg-white border-2 border-black shadow-[4px_4px_0px_#000] flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Borrower Info & Tool Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={req.borrowerAvatar}
                            alt={req.borrowerName}
                            className="w-11 h-11 rounded-xl object-cover border-2 border-black shadow-[1.5px_1.5px_0px_#000]"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-black text-black">
                                {req.borrowerName}
                              </span>
                              <ShieldCheck className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                            </div>
                            <span className="text-xs font-bold text-neutral-600">
                              Neighbor • ★ {(req.borrowerTrust ?? 5.0).toFixed(1)} Trust
                            </span>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-black bg-[#ffc900] text-black border-2 border-black shadow-[1.5px_1.5px_0px_#000]">
                          Pending Approval
                        </span>
                      </div>

                      {/* Tool & Request Summary */}
                      <div className="p-3 rounded-xl bg-[#faf9f6] border-2 border-black flex items-center gap-3 mb-3">
                        <img
                          src={req.toolImage}
                          alt={req.toolTitle}
                          className="w-12 h-12 rounded-lg object-cover border-2 border-black shadow-[1px_1px_0px_#000] shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-black text-black truncate">
                            {req.toolTitle}
                          </h4>
                          <span className="text-[11px] font-bold text-neutral-600 block">
                            {req.toolCategory}
                          </span>
                          <span className="text-[11px] font-black text-black flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3 stroke-[2.5]" />
                            {req.startDate} to {req.endDate} ({req.daysCount}{" "}
                            days)
                          </span>
                        </div>
                      </div>

                      {/* Borrower Note / Purpose */}
                      {req.purposeNote && (
                        <div className="p-2.5 rounded-xl bg-[#fff9db] border-2 border-black text-xs font-medium text-black mb-3 shadow-[1px_1px_0px_#000]">
                          &ldquo;{req.purposeNote}&rdquo;
                        </div>
                      )}

                      {/* Financials for Lender */}
                      <div className="flex items-center justify-between text-xs py-2 border-t-2 border-b-2 border-black">
                        <span className="font-bold text-neutral-700">
                          Maintenance:{" "}
                          <strong className="text-black font-black font-mono">
                            {req.maintenanceFee === 0
                              ? "Free (Community)"
                              : `RM ${req.maintenanceFee}`}
                          </strong>
                        </span>
                        <span className="font-black text-black flex items-center gap-1 font-mono">
                          <Lock className="w-3 h-3 stroke-[2.5]" /> RM {req.depositFee}{" "}
                          Escrow
                        </span>
                      </div>
                    </div>

                    {/* Decision Actions */}
                    <div className="flex items-center justify-between gap-2 pt-2">
                      <div className="text-xs font-bold text-neutral-600 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5] text-black" />
                        <span>Verified</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => setDecliningRequest(req)}
                          className="py-2 px-3.5 rounded-xl border-2 border-black bg-white hover:bg-neutral-100 text-xs font-black text-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                        >
                          Decline
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() =>
                            onUpdateStatus(req.id, "approved", "approve")
                          }
                          className="py-2 px-4 rounded-xl bg-[#ffc900] hover:bg-[#ffb700] text-black text-xs font-black border-2 border-black shadow-[2.5px_2.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
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
            <div className="space-y-3 pt-6 border-t-2 border-black">
              <div>
                <h2 className="text-lg font-black text-black flex items-center gap-2">
                  <span>Approved & Awaiting Handover</span>
                  <span className="px-2.5 py-0.5 text-[11px] font-mono font-black rounded-lg bg-[#ffc900] text-black border-2 border-black shadow-[1px_1px_0px_#000]">
                    {approvedAwaitingPickup.length}
                  </span>
                </h2>
                <p className="text-xs font-medium text-neutral-600">
                  Neighbor has paid deposit into escrow. Coordinate with
                  neighbor, then confirm pickup once you hand over the tool.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {approvedAwaitingPickup.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 rounded-2xl bg-white border-2 border-black shadow-[4px_4px_0px_#000] flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={req.borrowerAvatar}
                            alt={req.borrowerName}
                            className="w-10 h-10 rounded-xl object-cover border-2 border-black shadow-[1.5px_1.5px_0px_#000]"
                          />
                          <div>
                            <span className="text-xs font-black text-black block">
                              {req.borrowerName}
                            </span>
                            <span className="text-[11px] font-bold text-neutral-600">
                              {req.daysCount} days reservation
                            </span>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-black bg-[#bbf7d0] text-black border-2 border-black shadow-[1.5px_1.5px_0px_#000]">
                          Approved • Ready
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-[#faf9f6] border-2 border-black flex items-center gap-3 mb-3">
                        <img
                          src={req.toolImage}
                          alt={req.toolTitle}
                          className="w-10 h-10 rounded-lg object-cover border border-black shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-black text-black truncate">
                            {req.toolTitle}
                          </h4>
                          <span className="text-[11px] text-black font-bold">
                            Scheduled: {req.startDate} to {req.endDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t-2 border-black">
                      <div className="text-xs font-bold text-neutral-700 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 stroke-[2.5] text-black" />
                        <span>Awaiting Handover</span>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() =>
                          onUpdateStatus(req.id, "active", "pickup")
                        }
                        className="py-2 px-4 rounded-xl bg-[#ffc900] hover:bg-[#ffb700] text-black text-xs font-black border-2 border-black shadow-[2.5px_2.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Click when you hand over the tool to the neighbor"
                      >
                        <PackageCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Confirm Handover</span>
                      </motion.button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section C: Tools Currently Out on Loan (Active) */}
          <div className="space-y-3 pt-6 border-t-2 border-black">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-black flex items-center gap-2">
                  <span>Tools Currently Out with Neighbors</span>
                  <span className="px-2.5 py-0.5 text-[11px] font-mono font-black rounded-lg bg-[#bbf7d0] text-black border-2 border-black shadow-[1px_1px_0px_#000]">
                    {activeLoans.length} active
                  </span>
                </h2>
                <p className="text-xs font-medium text-neutral-600">
                  Items currently in neighbors&apos; possession. When the
                  neighbor returns your tool, inspect it and complete the
                  return.
                </p>
              </div>
            </div>

            {activeLoans.length === 0 ? (
              <div className="p-6 rounded-2xl border-2 border-black bg-white shadow-[3px_3px_0px_#000] text-center text-xs font-bold text-neutral-600">
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
                    className="p-5 rounded-2xl bg-white border-2 border-black shadow-[4px_4px_0px_#000] flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={req.borrowerAvatar}
                            alt={req.borrowerName}
                            className="w-10 h-10 rounded-xl object-cover border-2 border-black shadow-[1.5px_1.5px_0px_#000]"
                          />
                          <div>
                            <span className="text-xs font-black text-black block">
                              {req.borrowerName}
                            </span>
                            <span className="text-[11px] font-bold text-neutral-600">
                              ★ {(req.borrowerTrust ?? 5.0).toFixed(1)} Trust
                            </span>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-black bg-[#ff90e8] text-black border-2 border-black shadow-[1.5px_1.5px_0px_#000]">
                          Active Loan
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-[#faf9f6] border-2 border-black flex items-center gap-3 mb-3">
                        <img
                          src={req.toolImage}
                          alt={req.toolTitle}
                          className="w-11 h-11 rounded-lg object-cover border border-black shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-black text-black truncate">
                            {req.toolTitle}
                          </h4>
                          <span className="text-[11px] font-bold text-neutral-600 block">
                            {req.toolCategory}
                          </span>
                          <span className="text-[11px] font-black text-black flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 stroke-[2.5]" /> Due
                            Date: {req.endDate}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs py-1.5 font-bold text-neutral-700">
                        <span>Maintenance: RM {req.maintenanceFee}</span>
                        <span className="font-mono font-black text-black flex items-center gap-1">
                          <Lock className="w-3 h-3 stroke-[2.5]" /> RM {req.depositFee} in
                          Escrow
                        </span>
                      </div>
                    </div>

                    {/* Actions: Chat & Return Verification */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t-2 border-black">
                      <div className="text-xs font-bold text-neutral-700 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 stroke-[2.5] text-black" />
                        <span>Active On-Loan</span>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setInspectingRequest(req)}
                        className="py-2 px-4 rounded-xl bg-[#bbf7d0] hover:bg-[#86efac] text-black text-xs font-black border-2 border-black shadow-[2.5px_2.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Inspect & Return</span>
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
              <h2 className="text-lg font-black text-black">
                My Registered Tool Inventory
              </h2>
              <p className="text-xs font-medium text-neutral-600">
                Toggle maintenance mode, adjust daily fees or deposits, and
                track how many times your tools have been borrowed.
              </p>
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-black border-2 border-black shadow-[2.5px_2.5px_0px_#ff90e8] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Another Tool</span>
            </motion.button>
          </div>

          {myTools.length === 0 ? (
            <div className="p-12 rounded-3xl border-2 border-dashed border-black bg-white text-center shadow-[4px_4px_0px_#000]">
              <div className="w-14 h-14 rounded-2xl bg-[#ffc900] border-2 border-black text-black flex items-center justify-center mx-auto mb-3 shadow-[2.5px_2.5px_0px_#000]">
                <Wrench className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h3 className="text-base font-black text-black">
                You haven&apos;t listed any tools yet
              </h3>
              <p className="text-xs font-medium text-neutral-600 max-w-sm mx-auto mt-1 mb-4">
                Share your ladder, pressure washer, drill, or lawn mower with
                verified neighbors in your neighborhood.
              </p>
              <button
                onClick={onOpenAddModal}
                className="px-5 py-2.5 rounded-xl bg-[#ffc900] text-black text-xs font-black border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-[#ffb700] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
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
                    className="bg-white border-2 border-black rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-all shadow-[4px_4px_0px_#000]"
                  >
                    <div>
                      {/* Image & Status Header */}
                      <div className="relative aspect-video rounded-xl bg-[#faf9f6] border-2 border-black overflow-hidden mb-3">
                        <img
                          src={tool.imageUrl}
                          alt={tool.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          {isAvailable && (
                            <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-black bg-[#bbf7d0] text-black border border-black shadow-[1px_1px_0px_#000]">
                              Available
                            </span>
                          )}
                          {isBorrowed && (
                            <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-black bg-[#ffc900] text-black border border-black shadow-[1px_1px_0px_#000]">
                              Out on Loan
                            </span>
                          )}
                          {isMaintenance && (
                            <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-black bg-[#ff90e8] text-black border border-black shadow-[1px_1px_0px_#000]">
                              In Maintenance
                            </span>
                          )}
                        </div>

                        <div className="absolute top-2 right-2">
                          <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-black bg-black text-white border border-black shadow-[1px_1px_0px_#000]">
                            {tool.condition}
                          </span>
                        </div>
                      </div>

                      {/* Tool Title & Specs */}
                      <div>
                        <span className="text-[10px] font-mono font-bold text-neutral-600 uppercase tracking-wider">
                          {tool.brand} {tool.model && `• ${tool.model}`}
                        </span>
                        <h3 className="text-sm font-black text-black line-clamp-1">
                          {tool.title}
                        </h3>
                        <p className="text-xs font-medium text-neutral-600 line-clamp-2 mt-1">
                          {tool.description}
                        </p>
                      </div>

                      {/* Pricing & Deposit */}
                      <div className="mt-3 pt-2.5 border-t-2 border-black flex items-center justify-between text-xs font-bold">
                        <div>
                          <span className="text-neutral-600">Daily Fee: </span>
                          <strong className="text-black font-black font-mono">
                            {tool.maintenanceFeePerDay === 0
                              ? "Free"
                              : `RM ${tool.maintenanceFeePerDay}/day`}
                          </strong>
                        </div>
                        <div>
                          <span className="text-neutral-600">Deposit: </span>
                          <strong className="text-black font-black font-mono">
                            RM {tool.depositAmount}
                          </strong>
                        </div>
                      </div>

                      {/* Pickup note snippet */}
                      {tool.pickupNote && (
                        <div className="mt-2 text-[11px] font-medium text-black truncate bg-[#faf9f6] px-2.5 py-1 rounded-lg border border-black">
                          📍 {tool.pickupNote}
                        </div>
                      )}
                    </div>

                    {/* Operational Actions */}
                    <div className="pt-2.5 border-t-2 border-black flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleToggleMaintenance(tool)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 border-black transition-all flex items-center gap-1.5 shadow-[1.5px_1.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer ${
                          isMaintenance
                            ? "bg-[#bbf7d0] text-black hover:bg-[#86efac]"
                            : "bg-white text-black hover:bg-[#ffc900]"
                        }`}
                        title="Mark in/out of maintenance"
                      >
                        <RefreshCw className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>
                          {isMaintenance ? "Set Available" : "Maintenance"}
                        </span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditTool(tool)}
                          className="p-2 rounded-xl border-2 border-black bg-white hover:bg-[#ffc900] text-black shadow-[1.5px_1.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                          title="Edit pricing and pickup note"
                        >
                          <Edit3 className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>

                        <button
                          onClick={() => handleDeleteTool(tool.id, tool.title)}
                          className="p-2 rounded-xl border-2 border-black bg-white hover:bg-[#ff90e8] text-black shadow-[1.5px_1.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                          title="Remove tool from catalog"
                        >
                          <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>

                        <button
                          onClick={() => onSelectToolDetail(tool)}
                          className="p-2 rounded-xl border-2 border-black bg-white hover:bg-neutral-100 text-black shadow-[1.5px_1.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                          title="View public preview"
                        >
                          <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
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
          <div className="bg-white border-2 border-black rounded-3xl p-6 space-y-4 shadow-[4px_4px_0px_#000]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-black">
                  Lender Settlement & Payouts
                </h2>
                <p className="text-xs font-medium text-neutral-600">
                  Maintenance fees are credited to you for tool upkeep,
                  replacement blades, and servicing.
                </p>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#bbf7d0] border-2 border-black text-xs font-black text-black shadow-[1.5px_1.5px_0px_#000]">
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                <span>
                  Payout: <strong>DuitNow QR / Instant Bank Verified</strong>
                </span>
              </div>
            </div>

            {/* Financial Ledger Table */}
            <div className="mt-4 border-2 border-black rounded-2xl overflow-hidden bg-white shadow-[2px_2px_0px_#000]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#ffc900] text-black border-b-2 border-black font-black uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3">Loan Reference</th>
                      <th className="p-3">Borrower</th>
                      <th className="p-3">Dates & Duration</th>
                      <th className="p-3">Maintenance Fee</th>
                      <th className="p-3">Escrow Deposit Status</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-black/10">
                    {myLenderRequests.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="p-6 text-center text-neutral-500 font-bold"
                        >
                          No loan transactions recorded yet.
                        </td>
                      </tr>
                    ) : (
                      myLenderRequests.map((req) => (
                        <tr
                          key={req.id}
                          className="hover:bg-[#faf9f6] transition-colors"
                        >
                          <td className="p-3">
                            <span className="font-black text-black block">
                              {req.toolTitle}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-neutral-500">
                              ID: {req.id}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <img
                                src={req.borrowerAvatar}
                                alt={req.borrowerName}
                                className="w-6 h-6 rounded-lg object-cover border border-black"
                              />
                              <span className="font-bold text-black">
                                {req.borrowerName}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 text-neutral-700 font-medium">
                            {req.startDate} to {req.endDate} ({req.daysCount}d)
                          </td>
                          <td className="p-3 font-mono font-black text-black">
                            {req.maintenanceFee === 0
                              ? "Free"
                              : `+ RM ${req.maintenanceFee}`}
                          </td>
                          <td className="p-3">
                            {req.status === "returned" ? (
                              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 font-black">
                                <Check className="w-3 h-3 stroke-[3]" /> RM{" "}
                                {req.depositFee} Refunded
                              </span>
                            ) : req.status === "active" ||
                              req.status === "approved" ? (
                              <span className="inline-flex items-center gap-1 text-[11px] text-amber-900 font-black">
                                <Lock className="w-3 h-3 stroke-[2.5]" /> RM {req.depositFee}{" "}
                                in Escrow
                              </span>
                            ) : (
                              <span className="text-neutral-400 font-bold">None</span>
                            )}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-black capitalize border border-black shadow-[1px_1px_0px_#000] ${
                                req.status === "returned"
                                  ? "bg-[#bbf7d0] text-black"
                                  : req.status === "active"
                                    ? "bg-[#ff90e8] text-black"
                                    : req.status === "approved"
                                      ? "bg-[#ffc900] text-black"
                                      : "bg-white text-black"
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
          <div className="bg-white border-2 border-black rounded-3xl p-6 space-y-5 shadow-[4px_4px_0px_#000]">
            <div>
              <h2 className="text-lg font-black text-black">
                Lender Handover & Safety Protocol
              </h2>
              <p className="text-xs font-medium text-neutral-600">
                Follow these standard community guidelines to protect your tools
                and ensure safe neighborly handovers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Step 1: Pre-Loan Handover Checklist */}
              <div className="p-5 rounded-2xl bg-[#faf9f6] border-2 border-black space-y-3 shadow-[2.5px_2.5px_0px_#000]">
                <div className="flex items-center gap-2 text-sm font-black text-black">
                  <div className="w-7 h-7 rounded-lg bg-[#ffc900] text-black border-2 border-black flex items-center justify-center text-xs font-black shadow-[1px_1px_0px_#000]">
                    1
                  </div>
                  <span>Pre-Loan Handover Checklist</span>
                </div>
                <ul className="text-xs text-neutral-800 space-y-2 list-disc pl-5 font-medium leading-relaxed">
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
              <div className="p-5 rounded-2xl bg-[#faf9f6] border-2 border-black space-y-3 shadow-[2.5px_2.5px_0px_#000]">
                <div className="flex items-center gap-2 text-sm font-black text-black">
                  <div className="w-7 h-7 rounded-lg bg-[#ff90e8] text-black border-2 border-black flex items-center justify-center text-xs font-black shadow-[1px_1px_0px_#000]">
                    2
                  </div>
                  <span>Post-Return Inspection Checklist</span>
                </div>
                <ul className="text-xs text-neutral-800 space-y-2 list-disc pl-5 font-medium leading-relaxed">
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
              className="w-full max-w-lg bg-[#faf9f6] border-3 border-black rounded-3xl p-6 shadow-[8px_8px_0px_#000] space-y-4 text-left"
            >
              <div className="flex items-center justify-between border-b-2 border-black pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#bbf7d0] text-black border-2 border-black flex items-center justify-center shadow-[1.5px_1.5px_0px_#000]">
                    <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <h3 className="text-base font-black text-black">
                    Inspect Equipment & Release Deposit
                  </h3>
                </div>
                <button
                  onClick={() => setInspectingRequest(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-black bg-white hover:bg-[#ff90e8] text-black shadow-[1.5px_1.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border-2 border-black flex items-center gap-3 shadow-[2px_2px_0px_#000]">
                <img
                  src={inspectingRequest.toolImage}
                  alt={inspectingRequest.toolTitle}
                  className="w-12 h-12 rounded-lg object-cover border border-black shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-black truncate">
                    {inspectingRequest.toolTitle}
                  </h4>
                  <span className="text-[11px] font-medium text-neutral-600 block">
                    Returned by {inspectingRequest.borrowerName} • RM{" "}
                    {inspectingRequest.depositFee} Deposit in Escrow
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-black block">
                  Equipment Return Inspection:
                </label>

                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 p-3.5 rounded-2xl border-2 border-black bg-white cursor-pointer hover:bg-[#faf9f6] shadow-[2px_2px_0px_#000] transition-all">
                    <input
                      type="radio"
                      name="inspectionResult"
                      checked={inspectionPassed}
                      onChange={() => setInspectionPassed(true)}
                      className="accent-black"
                    />
                    <div className="text-xs">
                      <strong className="text-black font-black block">
                        Tool Returned in Good Condition
                      </strong>
                      <span className="text-neutral-600 font-medium">
                        No abnormal damage, clean, all parts accounted for. Safe
                        to release RM {inspectingRequest.depositFee} deposit
                        back to neighbor.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-3.5 rounded-2xl border-2 border-black bg-white cursor-pointer hover:bg-[#faf9f6] shadow-[2px_2px_0px_#000] transition-all">
                    <input
                      type="radio"
                      name="inspectionResult"
                      checked={!inspectionPassed}
                      onChange={() => setInspectionPassed(false)}
                      className="accent-black"
                    />
                    <div className="text-xs">
                      <strong className="text-black font-black block">
                        Minor Wear or Needs Cleaning (Acceptable)
                      </strong>
                      <span className="text-neutral-600 font-medium">
                        Tool is functional with normal signs of use. Deposit
                        will still be refunded in full.
                      </span>
                    </div>
                  </label>
                </div>

                <div>
                  <label className="text-[11px] font-black text-black block mb-1">
                    Optional Handover Notes / Feedback for Neighbor:
                  </label>
                  <textarea
                    value={inspectionNotes}
                    onChange={(e) => setInspectionNotes(e.target.value)}
                    rows={2}
                    placeholder="E.g. Thanks for returning it clean and on time!"
                    className="w-full p-3 rounded-xl border-2 border-black bg-white text-xs font-medium focus:outline-none focus:shadow-[2px_2px_0px_#000] transition-all"
                  />
                </div>
              </div>

              <div className="pt-2 border-t-2 border-black flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInspectingRequest(null)}
                  className="px-4 py-2 rounded-xl border-2 border-black bg-white hover:bg-neutral-100 text-xs font-black text-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={isProcessingReturn}
                  onClick={handleConfirmReturnInspection}
                  className="px-4 py-2 rounded-xl bg-[#bbf7d0] hover:bg-[#86efac] text-black text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
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
              className="w-full max-w-md bg-[#faf9f6] border-3 border-black rounded-3xl p-6 shadow-[8px_8px_0px_#000] space-y-4 text-left"
            >
              <div className="flex items-center justify-between border-b-2 border-black pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#ffc900] text-black border-2 border-black flex items-center justify-center shadow-[1.5px_1.5px_0px_#000]">
                    <Edit3 className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <h3 className="text-base font-black text-black">
                    Edit Equipment Settings
                  </h3>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-black bg-white hover:bg-[#ff90e8] text-black shadow-[1.5px_1.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              <div>
                <h4 className="text-xs font-black text-black truncate">
                  {editingTool.title}
                </h4>
                <span className="text-[11px] font-bold text-neutral-600">
                  {editingTool.category}
                </span>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-black text-black block mb-1">
                      Daily Fee (RM):
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={editDailyFee}
                      onChange={(e) => setEditDailyFee(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border-2 border-black bg-white text-xs font-mono font-black focus:outline-none focus:shadow-[2px_2px_0px_#000] transition-all"
                    />
                    <span className="text-[10px] font-bold text-neutral-500 mt-0.5 block">
                      0 = Free sharing
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-black text-black block mb-1">
                      Security Deposit (RM):
                    </label>
                    <input
                      type="number"
                      min={5}
                      value={editDeposit}
                      onChange={(e) => setEditDeposit(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border-2 border-black bg-white text-xs font-mono font-black focus:outline-none focus:shadow-[2px_2px_0px_#000] transition-all"
                    />
                    <span className="text-[10px] font-bold text-neutral-500 mt-0.5 block">
                      Held in escrow
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-black block mb-1">
                    Pickup & Handover Note:
                  </label>
                  <input
                    type="text"
                    value={editPickupNote}
                    onChange={(e) => setEditPickupNote(e.target.value)}
                    placeholder="E.g. Pick up at front gate after 9 AM"
                    className="w-full p-2.5 rounded-xl border-2 border-black bg-white text-xs font-medium focus:outline-none focus:shadow-[2px_2px_0px_#000] transition-all"
                  />
                </div>
              </div>

              <div className="pt-2 border-t-2 border-black flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border-2 border-black bg-white hover:bg-neutral-100 text-xs font-black text-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={isUpdatingTool}
                  onClick={handleSaveToolEdits}
                  className="px-5 py-2 rounded-xl bg-[#ffc900] hover:bg-[#ffb700] text-black text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
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
              className="w-full max-w-md bg-[#faf9f6] border-3 border-black rounded-3xl p-6 shadow-[8px_8px_0px_#000] space-y-4 text-left"
            >
              <div className="flex items-center justify-between border-b-2 border-black pb-3">
                <h3 className="text-base font-black text-black">
                  Decline Borrow Request
                </h3>
                <button
                  onClick={() => setDecliningRequest(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-black bg-white hover:bg-[#ff90e8] text-black shadow-[1.5px_1.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              <p className="text-xs font-medium text-neutral-700 leading-relaxed">
                Decline request from{" "}
                <strong className="text-black font-black">{decliningRequest.borrowerName}</strong> for &ldquo;
                {decliningRequest.toolTitle}&rdquo;. Their payment deposit will
                be immediately released.
              </p>

              <div>
                <label className="text-xs font-black text-black block mb-1">
                  Reason for Declining (Optional):
                </label>
                <textarea
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  rows={2}
                  placeholder="E.g. Tool is currently scheduled for personal project this weekend."
                  className="w-full p-2.5 rounded-xl border-2 border-black bg-white text-xs font-medium focus:outline-none focus:shadow-[2px_2px_0px_#000] transition-all"
                />
              </div>

              <div className="pt-2 border-t-2 border-black flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDecliningRequest(null)}
                  className="px-4 py-2 rounded-xl border-2 border-black bg-white hover:bg-neutral-100 text-xs font-black text-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleConfirmDecline}
                  className="px-5 py-2 rounded-xl bg-[#ff90e8] hover:bg-black hover:text-white text-black text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
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
