import React, { useState } from "react";
import {
  X,
  MapPin,
  ShieldCheck,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Info,
  DollarSign,
  Tag,
  Star,
  Check,
  ThumbsUp,
} from "lucide-react";
import type { ToolItem, Review, User } from "../types.ts";

interface ToolDetailModalProps {
  tool: ToolItem | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onSubmitBorrow: (
    tool: ToolItem,
    startDate: string,
    endDate: string,
    note?: string,
  ) => void;
  onOpenAuthModal?: (intendedAction?: string) => void;
  reviews: Review[];
}

export const ToolDetailModal: React.FC<ToolDetailModalProps> = ({
  tool,
  isOpen,
  onClose,
  currentUser,
  onSubmitBorrow,
  onOpenAuthModal,
  reviews,
}) => {
  if (!isOpen || !tool) return null;

  // Set default dates: tomorrow to +3 days
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const defaultEnd = new Date(tomorrow);
  defaultEnd.setDate(tomorrow.getDate() + 2);

  const formatDateInput = (d: Date) => d.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState<string>(formatDateInput(tomorrow));
  const [endDate, setEndDate] = useState<string>(formatDateInput(defaultEnd));
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Calculate days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  const daysCount = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const dailyFee = tool.price ?? tool.maintenanceFeePerDay ?? 0;
  const deposit = tool.deposit ?? tool.depositAmount ?? 0;
  const totalMaintenanceFee = dailyFee * daysCount;
  const totalPayable = totalMaintenanceFee + deposit;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) return;

    if (!currentUser) {
      if (onOpenAuthModal) {
        onOpenAuthModal(
          `Please log in to submit a borrow request for "${tool.title}".`,
        );
      }
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitBorrow(tool, startDate, endDate);
      setIsSubmitting(false);
      setSuccessMessage("Borrow request sent to owner!");
      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 1200);
    }, 500);
  };

  const isAvailable = tool.status === "available";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        id="tool-detail-modal"
        className="w-full sm:max-w-3xl bg-[#fcfbf9] border-t sm:border border-[#ded7c8] rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 max-h-[92vh] flex flex-col text-left"
      >
        {/* Top Sticky Bar */}
        <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-b border-[#e8e2d7] flex items-center justify-between bg-[#f4efe6] shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#eef4f0] text-[#496350] border border-[#5f7d66]/30 shrink-0">
              {tool.category}
            </span>
            <span className="text-xs text-[#67635c] shrink-0">•</span>
            <span className="text-xs text-[#67635c] font-medium truncate">
              {tool.locationSnippet}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 min-h-11 min-w-11 flex items-center justify-center rounded-xl text-[#67635c] hover:text-[#24211d] hover:bg-[#eae3d5] transition-colors"
            aria-label="Close details modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Main Hero Details */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Image */}
            <div className="md:col-span-6 space-y-3">
              <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-[#f1ede4] border border-[#ded7c8]">
                <img
                  src={tool.imageUrl}
                  alt={tool.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold shadow-xs ${
                      isAvailable
                        ? "bg-[#eef4f0] text-[#496350] border border-[#5f7d66]/40"
                        : "bg-[#fbeee9] text-[#b0553b] border border-[#c86d51]/40"
                    }`}
                  >
                    {isAvailable ? "Available Now" : "Currently Borrowed"}
                  </span>
                </div>
              </div>
            </div>

            {/* Title, Brand, Description */}
            <div className="md:col-span-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#8c867b] mb-1">
                  {tool.brand} {tool.model ? `· ${tool.model}` : ""}
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#24211d] leading-tight mb-2">
                  {tool.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#4e4a43] leading-relaxed mb-4">
                  {tool.description}
                </p>

                {/* Owner Mini Card */}
                <div className="p-3.5 rounded-xl border border-[#ded7c8] bg-[#f4efe6] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={tool.ownerAvatar}
                        alt={tool.ownerName}
                        className="w-9 h-9 rounded-full object-cover border border-[#ded7c8]"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#24211d]">
                            {tool.ownerName}
                          </span>
                          <ShieldCheck className="w-3.5 h-3.5 text-[#5f7d66]" />
                        </div>
                        <span className="text-[11px] text-[#67635c] block">
                          Verified Neighbor · {tool.ownerBorrowsCount} items
                          shared
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-[#5f7d66]">
                        ★ {(tool.ownerRating ?? 5.0).toFixed(1)} Trust
                      </div>
                      <span className="text-[10px] text-[#8c867b]">
                        100% on-time
                      </span>
                    </div>
                  </div>

                  <div className="w-full py-2 px-3 rounded-xl bg-[#5f7d66]/10 border border-[#5f7d66]/20 text-xs font-semibold text-[#496350] flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#5f7d66]" />
                    <span>Verified Resident • Secure Escrow Protection</span>
                  </div>
                </div>
              </div>

              {/* Pricing banner */}
              <div className="p-3.5 rounded-xl bg-[#fbeee9] border border-[#c86d51]/30">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-[#b0553b] font-semibold block">
                      Daily Maintenance Fee
                    </span>
                    <span className="text-xl font-extrabold text-[#24211d]">
                      {tool.maintenanceFeePerDay === 0
                        ? "Free"
                        : `RM ${tool.maintenanceFeePerDay}`}
                    </span>
                    <span className="text-xs text-[#67635c]"> / day</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#67635c] block">
                      Security Deposit (Refundable)
                    </span>
                    <span className="text-lg font-bold text-[#24211d]">
                      RM {tool.depositAmount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Usage & Pickup Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-[#ded7c8] bg-[#faf8f5] space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#24211d]">
                <Info className="w-4 h-4 text-[#5f7d66]" />
                Tool Usage & Safety Guidelines
              </div>
              <p className="text-xs text-[#67635c] leading-relaxed">
                {tool.instructions ||
                  "Please clean thoroughly before returning. Wear recommended eye protection."}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#ded7c8] bg-[#faf8f5] space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#24211d]">
                <MapPin className="w-4 h-4 text-[#c86d51]" />
                Pickup & Dropoff Note
              </div>
              <p className="text-xs text-[#67635c] leading-relaxed">
                {tool.pickupNote ||
                  "Coordinate pickup time through in-app neighbor chat."}
              </p>
            </div>
          </div>

          {/* Booking Calendar & Request Section */}
          <div className="border border-[#ded7c8] rounded-2xl p-5 bg-[#fcfbf9] space-y-4">
            <div className="flex items-center justify-between border-b border-[#e8e2d7] pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#c86d51]" />
                <h3 className="text-sm font-bold text-[#24211d]">
                  Select Borrowing Dates & Booking Details
                </h3>
              </div>
              <span className="text-xs text-[#5f7d66] font-semibold">
                {daysCount} {daysCount === 1 ? "day" : "days"} duration
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    min={formatDateInput(today)}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#ded7c8] bg-[#faf8f5] focus:ring-1 focus:ring-[#c86d51] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#ded7c8] bg-[#faf8f5] focus:ring-1 focus:ring-[#c86d51] focus:outline-none"
                  />
                </div>
              </div>

              {/* Maintenance Fee & Deposit System: Micro-transaction handling */}
              <div className="p-3.5 rounded-xl bg-[#f4efe6] border border-[#ded7c8] space-y-2 text-xs">
                <div className="flex justify-between text-[#67635c]">
                  <span>
                    Maintenance Fee ({daysCount} days @ RM{" "}
                    {tool.maintenanceFeePerDay}/day):
                  </span>
                  <span className="font-semibold text-[#24211d]">
                    RM {totalMaintenanceFee}
                  </span>
                </div>
                <div className="flex justify-between text-[#67635c]">
                  <span>Refundable Security Deposit:</span>
                  <span className="font-semibold text-[#24211d]">
                    RM {tool.depositAmount}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#ded7c8] flex justify-between text-sm font-bold text-[#24211d]">
                  <span>Total Hold / Payable at Pickup:</span>
                  <span className="text-[#c86d51]">RM {totalPayable}</span>
                </div>
                <p className="text-[10px] text-[#5f7d66] pt-1">
                  • Deposit is automatically released in full when owner
                  verifies item return.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded text-[#c86d51] focus:ring-[#c86d51] border-[#ded7c8]"
                />
                <label
                  htmlFor="agreeTerms"
                  className="text-xs text-[#67635c] cursor-pointer"
                >
                  I agree to handle this equipment with care and return it clean
                  by {endDate}.
                </label>
              </div>

              {successMessage && (
                <div className="p-3 rounded-lg bg-[#eef4f0] text-[#496350] text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5f7d66]" />
                  {successMessage}
                </div>
              )}

              <button
                id="submit-borrow-request-btn"
                type="submit"
                disabled={!isAvailable || !agreeTerms || isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-[#c86d51] hover:bg-[#b0553b] text-white text-sm font-bold shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>Sending Borrow Request...</>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    Request to Borrow ({daysCount}{" "}
                    {daysCount === 1 ? "Day" : "Days"} · RM {totalPayable})
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Community Reviews List */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8c867b]">
              Item & Service Feedback ({reviews.length})
            </h4>
            {reviews.length === 0 ? (
              <p className="text-xs text-[#8c867b] italic">
                No feedback entries yet. Be the first to borrow and review!
              </p>
            ) : (
              <div className="space-y-2.5">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3 rounded-xl border border-[#ded7c8] bg-[#faf8f5] text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={rev.reviewerAvatar}
                          alt={rev.reviewerName}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="font-semibold text-[#24211d]">
                          {rev.reviewerName}
                        </span>
                        {rev.feedbackType && (
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              rev.feedbackType === "item"
                                ? "bg-[#5f7d66]/15 text-[#496350]"
                                : rev.feedbackType === "service"
                                  ? "bg-[#c86d51]/15 text-[#b0553b]"
                                  : "bg-[#8c867b]/15 text-[#4e4a43]"
                            }`}
                          >
                            {rev.feedbackType === "item"
                              ? "Item Condition"
                              : rev.feedbackType === "service"
                                ? "Lender Service"
                                : "Overall"}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-amber-600 font-bold text-[11px]">
                        ★ {rev.rating} / 5
                      </div>
                    </div>
                    <p className="text-[#67635c] text-xs leading-relaxed">
                      {rev.comment}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-[#8c867b] pt-1 border-t border-[#f1ede4]">
                      <span>{rev.date}</span>
                      {rev.wouldRecommend && (
                        <span className="text-[#5f7d66] font-semibold flex items-center gap-1">
                          ✓ Recommends to neighbors
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
