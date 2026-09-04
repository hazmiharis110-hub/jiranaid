import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Star,
  ShieldCheck,
  ThumbsUp,
  MessageSquare,
  Search,
  SlidersHorizontal,
  Plus,
  CheckCircle2,
  Wrench,
  HeartHandshake,
  Sparkles,
  ArrowRight,
  Clock,
  X,
  PackageCheck,
} from "lucide-react";
import type { Review, ToolItem, User, BorrowRequest } from "../types.ts";

interface FeedbackViewProps {
  currentUser: User | null;
  reviews: Review[];
  tools: ToolItem[];
  borrowRequests: BorrowRequest[];
  onOpenAuthModal?: () => void;
  onSubmitFeedback: (feedbackData: {
    toolId?: string;
    toolTitle?: string;
    toolCategory?: string;
    toolImage?: string;
    targetUserId?: string;
    targetUserName?: string;
    rating: number;
    careRating: number;
    punctualityRating: number;
    feedbackType: "item" | "service" | "general";
    comment: string;
    wouldRecommend: boolean;
  }) => Promise<void>;
  onSelectToolDetail?: (tool: ToolItem) => void;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({
  currentUser,
  reviews,
  tools,
  borrowRequests,
  onOpenAuthModal,
  onSubmitFeedback,
  onSelectToolDetail,
}) => {
  const [filterType, setFilterType] = useState<
    "all" | "item" | "service" | "5star"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});
  const [votedMap, setVotedMap] = useState<Record<string, boolean>>({});

  // New feedback form states
  const [selectedToolId, setSelectedToolId] = useState<string>("");
  const [feedbackType, setFeedbackType] = useState<
    "item" | "service" | "general"
  >("item");
  const [rating, setRating] = useState<number>(5);
  const [careRating, setCareRating] = useState<number>(5);
  const [punctualityRating, setPunctualityRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [wouldRecommend, setWouldRecommend] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Calculate statistics
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(
          1,
        )
      : "5.0";
  const avgCare =
    totalReviews > 0
      ? (
          reviews.reduce((acc, r) => acc + r.careRating, 0) / totalReviews
        ).toFixed(1)
      : "5.0";
  const avgPunctuality =
    totalReviews > 0
      ? (
          reviews.reduce((acc, r) => acc + r.punctualityRating, 0) /
          totalReviews
        ).toFixed(1)
      : "5.0";
  const recommendCount = reviews.filter(
    (r) => r.wouldRecommend !== false,
  ).length;
  const recommendPercent =
    totalReviews > 0 ? Math.round((recommendCount / totalReviews) * 100) : 100;

  // Filtered reviews
  const filteredReviews = reviews.filter((r) => {
    // Type filter
    if (filterType === "item" && r.feedbackType === "service") return false;
    if (filterType === "service" && r.feedbackType === "item") return false;
    if (filterType === "5star" && r.rating < 5) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = r.toolTitle?.toLowerCase().includes(q);
      const matchReviewer = r.reviewerName?.toLowerCase().includes(q);
      const matchComment = r.comment?.toLowerCase().includes(q);
      const matchTarget = r.targetUserName?.toLowerCase().includes(q);
      if (!matchTitle && !matchReviewer && !matchComment && !matchTarget) {
        return false;
      }
    }
    return true;
  });

  // Check if current user has returned requests that could be reviewed
  const userReturnedRequests = currentUser
    ? borrowRequests.filter(
        (req) =>
          req.borrowerId === currentUser.id &&
          req.status === "returned" &&
          !reviews.some(
            (rev) =>
              rev.toolId === req.toolId && rev.reviewerId === currentUser.id,
          ),
      )
    : [];

  const handleHelpfulClick = async (reviewId: string) => {
    if (votedMap[reviewId]) return;
    setVotedMap((prev) => ({ ...prev, [reviewId]: true }));
    setHelpfulVotes((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] ?? 0) + 1,
    }));
    try {
      await fetch(`/api/reviews/${reviewId}/helpful`, { method: "POST" });
    } catch {
      // Ignored for optimistic UI
    }
  };

  const handleOpenNewFeedbackModal = (preselectedToolId?: string) => {
    if (!currentUser && onOpenAuthModal) {
      onOpenAuthModal();
      return;
    }
    if (preselectedToolId) {
      setSelectedToolId(preselectedToolId);
    } else if (tools.length > 0 && !selectedToolId) {
      setSelectedToolId(tools[0].id);
    }
    setIsSubmitModalOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    const chosenTool = tools.find((t) => t.id === selectedToolId);

    try {
      await onSubmitFeedback({
        toolId: chosenTool?.id,
        toolTitle: chosenTool?.title || "Community Equipment",
        toolCategory: chosenTool?.category || "General Equipment",
        toolImage: chosenTool?.imageUrl,
        targetUserId: chosenTool?.ownerId,
        targetUserName: chosenTool?.ownerName,
        rating,
        careRating,
        punctualityRating,
        feedbackType,
        comment: comment.trim(),
        wouldRecommend,
      });
      setIsSubmitModalOpen(false);
      setComment("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarInput = (val: number, setVal: (n: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setVal(star)}
            className="p-1 text-amber-500 hover:scale-110 transition-transform"
          >
            <Star
              className={`w-5 h-5 ${
                star <= val ? "fill-amber-400 text-amber-500" : "text-[#ded7c8]"
              }`}
            />
          </button>
        ))}
        <span className="text-xs font-bold text-[#24211d] ml-1.5">
          {val} / 5
        </span>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 text-left">
      {/* Top Header & Metrics Dashboard */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#ded7c8] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#e8efe9] text-[#5f7d66] uppercase tracking-wider">
              Taman Melawati Community Integrity
            </span>
            <span className="text-xs text-[#67635c]">
              • Verified Transactions
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#24211d] tracking-tight">
            Item & Service Feedback
          </h1>
          <p className="text-sm text-[#67635c] mt-1 max-w-2xl">
            Real feedback from neighbors on equipment working condition,
            maintenance quality, and lender handover punctuality.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          id="btn-open-feedback-modal"
          onClick={() => handleOpenNewFeedbackModal()}
          className="px-5 py-3 rounded-xl bg-[#c86d51] hover:bg-[#b55e43] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Leave Item/Service Feedback</span>
        </motion.button>
      </div>

      {/* Aggregate Community Trust Scores */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-[#fcfbf9] border border-[#ded7c8] space-y-1">
          <span className="text-[11px] font-semibold uppercase text-[#67635c] block">
            Overall Rating
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#24211d]">
              {avgRating}
            </span>
            <div className="flex text-amber-500">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <span className="text-[11px] text-[#5f7d66] font-medium block">
            Across {totalReviews} community handovers
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#fcfbf9] border border-[#ded7c8] space-y-1">
          <span className="text-[11px] font-semibold uppercase text-[#67635c] block">
            Item Condition
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#24211d]">
              {avgCare}
            </span>
            <span className="text-xs font-semibold text-[#67635c]">/ 5.0</span>
          </div>
          <span className="text-[11px] text-[#5f7d66] font-medium block">
            Cleanliness & blade sharpness verified
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#fcfbf9] border border-[#ded7c8] space-y-1">
          <span className="text-[11px] font-semibold uppercase text-[#67635c] block">
            Handover Service
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#24211d]">
              {avgPunctuality}
            </span>
            <span className="text-xs font-semibold text-[#67635c]">/ 5.0</span>
          </div>
          <span className="text-[11px] text-[#5f7d66] font-medium block">
            Punctual porch & garage pick-up
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#fcfbf9] border border-[#ded7c8] space-y-1">
          <span className="text-[11px] font-semibold uppercase text-[#67635c] block">
            Neighbor Recommendation
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#5f7d66]">
              {recommendPercent}%
            </span>
          </div>
          <span className="text-[11px] text-[#67635c] font-medium block">
            Neighbors recommend borrowing again
          </span>
        </div>
      </div>

      {/* Pending Feedback Banner for logged in user */}
      {userReturnedRequests.length > 0 && (
        <div className="p-5 rounded-2xl bg-[#f4efe6] border border-[#ded7c8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5f7d66] text-white flex items-center justify-center shrink-0 mt-0.5">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#24211d]">
                You recently completed a borrow for "
                {userReturnedRequests[0].toolTitle}"
              </h3>
              <p className="text-xs text-[#67635c] mt-0.5">
                How did the tool perform? How was the handover service from{" "}
                {userReturnedRequests[0].ownerName}? Your feedback keeps our
                neighborhood tool sharing reliable.
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              handleOpenNewFeedbackModal(userReturnedRequests[0].toolId)
            }
            className="px-4 py-2.5 rounded-xl bg-[#24211d] hover:bg-[#38342e] text-white font-bold text-xs shrink-0 self-start sm:self-auto flex items-center gap-1.5 transition-colors"
          >
            <span>Rate Equipment & Service</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: "all", label: "All Feedback", count: reviews.length },
            {
              id: "item",
              label: "Tool Condition & Performance",
              count: reviews.filter((r) => r.feedbackType !== "service").length,
            },
            {
              id: "service",
              label: "Lender Service & Handover",
              count: reviews.filter((r) => r.feedbackType === "service").length,
            },
            {
              id: "5star",
              label: "5-Star Experiences",
              count: reviews.filter((r) => r.rating === 5).length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                filterType === tab.id
                  ? "bg-[#24211d] text-white shadow-xs"
                  : "bg-[#fcfbf9] text-[#67635c] hover:text-[#24211d] border border-[#ded7c8]"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  filterType === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-[#e8e2d7] text-[#67635c]"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative min-w-60">
          <Search className="w-4 h-4 text-[#67635c] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tool, neighbor, feedback..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#ded7c8] bg-[#fcfbf9] text-[#24211d] placeholder-[#99948a] focus:outline-none focus:ring-1 focus:ring-[#c86d51]"
          />
        </div>
      </div>

      {/* Feedback Review Cards Grid */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-[#ded7c8] bg-[#fcfbf9] space-y-3">
          <MessageSquare className="w-10 h-10 text-[#a39c91] mx-auto" />
          <h3 className="font-bold text-base text-[#24211d]">
            No Feedback Found
          </h3>
          <p className="text-xs text-[#67635c] max-w-sm mx-auto">
            Try adjusting your search query or category filter. Be the first to
            share your tool experience!
          </p>
          <button
            onClick={() => handleOpenNewFeedbackModal()}
            className="px-4 py-2 rounded-xl bg-[#c86d51] text-white text-xs font-bold hover:bg-[#b55e43] transition-colors"
          >
            Submit Feedback
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReviews.map((rev) => {
            const currentHelpful =
              (rev.helpfulCount || 0) + (helpfulVotes[rev.id] || 0);
            const isVoted = votedMap[rev.id];

            return (
              <motion.div
                key={rev.id}
                layout
                className="p-5 rounded-2xl bg-[#fcfbf9] border border-[#ded7c8] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#c86d51]/40 transition-colors"
              >
                {/* Header: Reviewer Info + Date */}
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={rev.reviewerAvatar}
                        alt={rev.reviewerName}
                        className="w-9 h-9 rounded-full object-cover border border-[#ded7c8]"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#24211d]">
                            {rev.reviewerName}
                          </span>
                          <ShieldCheck className="w-3.5 h-3.5 text-[#5f7d66]" />
                        </div>
                        <span className="text-[11px] text-[#67635c] block">
                          Verified Neighbor • {rev.date}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rev.feedbackType === "service"
                          ? "bg-[#e8efe9] text-[#5f7d66] border border-[#cbe1ce]"
                          : "bg-[#f4efe6] text-[#c86d51] border border-[#ded7c8]"
                      }`}
                    >
                      {rev.feedbackType === "service"
                        ? "Lender Service"
                        : "Item Performance"}
                    </span>
                  </div>

                  {/* Tool Context Pill */}
                  <div className="mt-3.5 p-2.5 rounded-xl bg-[#faf8f5] border border-[#ded7c8] flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2.5 truncate">
                      {rev.toolImage && (
                        <img
                          src={rev.toolImage}
                          alt={rev.toolTitle}
                          className="w-8 h-8 rounded-lg object-cover shrink-0 border border-[#ded7c8]"
                        />
                      )}
                      <div className="truncate">
                        <span className="font-bold text-[#24211d] truncate block">
                          {rev.toolTitle}
                        </span>
                        {rev.targetUserName && (
                          <span className="text-[10px] text-[#67635c] truncate block">
                            Lender: {rev.targetUserName}
                          </span>
                        )}
                      </div>
                    </div>

                    {rev.toolId && onSelectToolDetail && (
                      <button
                        onClick={() => {
                          const t = tools.find(
                            (tool) => tool.id === rev.toolId,
                          );
                          if (t) onSelectToolDetail(t);
                        }}
                        className="text-[11px] font-bold text-[#c86d51] hover:underline shrink-0"
                      >
                        View Item
                      </button>
                    )}
                  </div>

                  {/* Rating Metrics Breakdown */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    <div className="flex items-center gap-1 bg-[#fff8eb] border border-[#f3e1b9] px-2 py-0.5 rounded-md font-bold text-[#b45309]">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>{rev.rating}.0 Overall</span>
                    </div>

                    <div className="flex items-center gap-1 bg-[#f4efe6] px-2 py-0.5 rounded-md text-[11px] font-medium text-[#4e4a43]">
                      <span>Item Care:</span>
                      <strong className="text-[#24211d]">
                        {rev.careRating}/5
                      </strong>
                    </div>

                    <div className="flex items-center gap-1 bg-[#f4efe6] px-2 py-0.5 rounded-md text-[11px] font-medium text-[#4e4a43]">
                      <span>Service:</span>
                      <strong className="text-[#24211d]">
                        {rev.punctualityRating}/5
                      </strong>
                    </div>

                    {rev.wouldRecommend !== false && (
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-[#5f7d66] ml-auto">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Recommends</span>
                      </div>
                    )}
                  </div>

                  {/* Written Comment */}
                  <p className="mt-3 text-xs text-[#4e4a43] leading-relaxed bg-[#fcfbf9] italic">
                    "{rev.comment}"
                  </p>
                </div>

                {/* Footer: Helpful Vote Action */}
                <div className="pt-2 border-t border-[#e8e2d7] flex items-center justify-between text-xs text-[#67635c]">
                  <span className="text-[11px]">
                    Was this feedback helpful?
                  </span>
                  <button
                    onClick={() => handleHelpfulClick(rev.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                      isVoted
                        ? "bg-[#e8efe9] text-[#5f7d66] font-bold"
                        : "hover:bg-[#eae3d5] text-[#4e4a43]"
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{isVoted ? "Helpful" : "Helpful"}</span>
                    <span className="font-bold">({currentHelpful})</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* New Feedback Submission Modal */}
      <AnimatePresence>
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/45 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#fcfbf9] border border-[#ded7c8] rounded-2xl shadow-xl overflow-hidden my-6 flex flex-col text-left"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-[#e8e2d7] flex items-center justify-between bg-[#f4efe6]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#c86d51] text-white flex items-center justify-center">
                    <Star className="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#24211d] text-base">
                      Submit Item & Service Feedback
                    </h3>
                    <p className="text-[11px] text-[#67635c]">
                      Help fellow neighbors know equipment condition and
                      handover experience.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="p-1.5 rounded-lg text-[#67635c] hover:text-[#24211d] hover:bg-[#eae3d5] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form
                onSubmit={handleSubmitForm}
                className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
              >
                {/* Tool Selection */}
                <div>
                  <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
                    Select Equipment / Tool
                  </label>
                  <select
                    value={selectedToolId}
                    onChange={(e) => setSelectedToolId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#ded7c8] bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#c86d51]"
                  >
                    {tools.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title} (Owner: {t.ownerName})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Feedback Focus Tag */}
                <div>
                  <label className="block text-xs font-semibold text-[#4e4a43] mb-1.5">
                    Feedback Focus
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "item", label: "Item Performance" },
                      { id: "service", label: "Lender Service" },
                      { id: "general", label: "Full Experience" },
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        type="button"
                        onClick={() => setFeedbackType(btn.id as any)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold text-center border transition-all ${
                          feedbackType === btn.id
                            ? "bg-[#24211d] text-white border-[#24211d]"
                            : "bg-[#faf8f5] text-[#67635c] border-[#ded7c8] hover:bg-[#f4efe6]"
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating Criteria */}
                <div className="space-y-3 p-3.5 rounded-xl bg-[#faf8f5] border border-[#ded7c8]">
                  <div>
                    <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
                      1. Overall Tool & Borrowing Experience
                    </label>
                    {renderStarInput(rating, setRating)}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
                      2. Equipment Condition, Cleanliness & Sharpness
                    </label>
                    {renderStarInput(careRating, setCareRating)}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
                      3. Lender Service, Communication & Punctuality
                    </label>
                    {renderStarInput(punctualityRating, setPunctualityRating)}
                  </div>
                </div>

                {/* Would Recommend Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#faf8f5] border border-[#ded7c8]">
                  <div>
                    <span className="text-xs font-bold text-[#24211d] block">
                      Would you recommend this equipment to other neighbors?
                    </span>
                    <span className="text-[11px] text-[#67635c]">
                      Helps neighbors discover dependable tools.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWouldRecommend(!wouldRecommend)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      wouldRecommend
                        ? "bg-[#5f7d66] text-white"
                        : "bg-[#ded7c8] text-[#67635c]"
                    }`}
                  >
                    {wouldRecommend ? "Yes, Recommend" : "Not Recommended"}
                  </button>
                </div>

                {/* Detailed Comment */}
                <div>
                  <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
                    Your Detailed Review & Tips for Neighbors
                  </label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="How well did the tool perform on your project? Was it clean and ready? How was the handover at the lender's home?"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#ded7c8] bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#c86d51]"
                    required
                  />
                </div>

                {/* Modal Footer */}
                <div className="pt-3 border-t border-[#e8e2d7] flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#67635c] hover:bg-[#eae3d5]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !comment.trim()}
                    className="px-5 py-2 rounded-xl bg-[#c86d51] hover:bg-[#b55e43] text-white text-xs font-bold disabled:opacity-50 transition-colors flex items-center gap-1.5"
                  >
                    {isSubmitting ? "Posting..." : "Post Community Feedback"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
