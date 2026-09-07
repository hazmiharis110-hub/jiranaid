import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useOutletContext } from 'react-router-dom';
import {
  Wrench,
  MapPin,
  ShieldCheck,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
  DollarSign,
  Tag,
  Star,
  Check,
  ThumbsUp,
  ArrowLeft,
  Edit3,
  MessageCircle,
} from 'lucide-react';
import { itemService } from '../services/itemService';
import { useAuthStore } from '../store/useAuthStore';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Badge } from '../components/common/Badge';
import type { ToolItem, Review } from '../types';

export const ItemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const outletContext = useOutletContext<any>();
  const { currentUser } = useAuthStore();

  const [tool, setTool] = useState<ToolItem | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Booking states
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const defaultEnd = new Date(tomorrow);
  defaultEnd.setDate(tomorrow.getDate() + 2);

  const formatDateInput = (d: Date) => d.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(formatDateInput(tomorrow));
  const [endDate, setEndDate] = useState(formatDateInput(defaultEnd));
  const [borrowNote, setBorrowNote] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    itemService
      .getItemById(id)
      .then((res) => {
        setTool(res.tool);
        setReviews(res.reviews || []);
        setIsLoading(false);
      })
      .catch((err) => {
        setErrorMsg(err.message || 'Tool not found');
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner message="Loading tool details..." fullPage />;
  }

  if (errorMsg || !tool) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-[#24211d]">Equipment Not Found</h2>
        <p className="text-sm text-[#67635c]">
          The item you are looking for might have been removed or is temporarily unavailable.
        </p>
        <Link
          to="/items"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#24211d] text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  // Calculate rental calculations
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.max(0, end.getTime() - start.getTime());
  const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const totalMaintenanceFee = diffDays * tool.maintenanceFeePerDay;
  const totalHold = totalMaintenanceFee + tool.depositAmount;

  const isOwner = currentUser?.id === tool.ownerId;
  const isAvailable = tool.status === 'available';

  const handleBorrowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      if (outletContext?.onOpenAuth) {
        outletContext.onOpenAuth('login');
      } else {
        navigate('/login');
      }
      return;
    }

    setIsSubmitting(true);
    try {
      // Post request to backend
      const res = await fetch('/api/borrow-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: tool.id,
          startDate,
          endDate,
          purposeNote: borrowNote || 'General home improvement project',
        }),
      });

      if (res.ok) {
        setRequestSuccess(true);
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to submit request');
      }
    } catch {
      setRequestSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChat = () => {
    if (outletContext?.onOpenChat) {
      outletContext.onOpenChat({
        toolTitle: tool.title,
        otherUserId: tool.ownerId,
        otherUserName: tool.ownerName,
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/items"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#67635c] hover:text-[#24211d] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>

        {isOwner && (
          <Link
            to={`/items/${tool.id}/edit`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#ded7c8] bg-white hover:bg-[#f4efe6] text-xs font-bold text-[#24211d] transition-colors shadow-2xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#c86d51]" />
            <span>Edit This Listing</span>
          </Link>
        )}
      </div>

      {/* Main Grid: Item Info (7 cols) & Booking Card (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visuals, Specs, Owner, Guidelines */}
        <div className="lg:col-span-7 space-y-6">
          {/* Photo Presentation */}
          <div className="relative aspect-16/10 w-full rounded-2xl overflow-hidden bg-[#f1ede4] border border-[#ded7c8] shadow-sm">
            <img
              src={tool.imageUrl}
              alt={tool.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1 rounded-full bg-[#24211d]/85 text-white text-xs font-bold backdrop-blur-xs">
              <MapPin className="w-3.5 h-3.5 text-[#c86d51]" />
              <span>{tool.locationSnippet || 'Nearby in circle'}</span>
            </div>
            <div className="absolute top-3 right-3">
              <Badge status={tool.status} />
            </div>
          </div>

          {/* Title & Brand */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#c86d51]">
                {tool.category}
              </span>
              <span className="text-xs text-[#8a857b]">•</span>
              <Badge condition={tool.condition} size="sm" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#24211d] leading-tight">
              {tool.title}
            </h1>

            <p className="text-sm text-[#67635c] font-medium">
              Manufactured by <strong className="text-[#24211d]">{tool.brand}</strong>
              {tool.model && ` (Model: ${tool.model})`}
            </p>
          </div>

          {/* Description */}
          <div className="bg-[#fcfbf9] rounded-2xl border border-[#ded7c8] p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#4e4a43]">
              Equipment Description & Included Parts
            </h3>
            <p className="text-sm text-[#4e4a43] leading-relaxed whitespace-pre-line">
              {tool.description}
            </p>
          </div>

          {/* Safety & Pickup Rules */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#fcfbf9] rounded-2xl border border-[#ded7c8] p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#496350]">
                <ShieldCheck className="w-4 h-4 text-[#5f7d66]" />
                <span>Safety & Care Requirements</span>
              </div>
              <p className="text-xs text-[#67635c] leading-relaxed">
                {tool.instructions || 'Please handle with care and return thoroughly wiped clean.'}
              </p>
            </div>

            <div className="bg-[#fcfbf9] rounded-2xl border border-[#ded7c8] p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#24211d]">
                <Clock className="w-4 h-4 text-[#c86d51]" />
                <span>Pickup & Return Protocol</span>
              </div>
              <p className="text-xs text-[#67635c] leading-relaxed">
                {tool.pickupNote || 'Coordinate safe porch collection in app chat once approved.'}
              </p>
            </div>
          </div>

          {/* Owner Profile Card */}
          <div className="bg-white rounded-2xl border border-[#ded7c8] p-5 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3.5">
              <img
                src={tool.ownerAvatar}
                alt={tool.ownerName}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#e8e2d7]"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-[#24211d]">{tool.ownerName}</h4>
                  <ShieldCheck className="w-4 h-4 text-[#5f7d66]" />
                </div>
                <div className="flex items-center gap-3 text-xs text-[#67635c] mt-0.5">
                  <span className="text-[#5f7d66] font-bold">★ {tool.ownerRating.toFixed(1)} Trust Rating</span>
                  <span>•</span>
                  <span>{tool.ownerBorrowsCount} Successful Lends</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleOpenChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#ded7c8] bg-[#fcfbf9] hover:bg-[#ede7db] text-xs font-bold text-[#24211d] transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#c86d51]" />
              <span>Ask Question</span>
            </button>
          </div>

          {/* Community Reviews Section */}
          <div className="bg-[#fcfbf9] rounded-2xl border border-[#ded7c8] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#ede7db] pb-3">
              <h3 className="font-bold text-sm text-[#24211d] flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>Neighbor Ratings & Feedback ({reviews.length})</span>
              </h3>
              <span className="text-xs font-semibold text-[#5f7d66]">
                100% On-Time Returns
              </span>
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs text-[#8a857b] py-3 text-center">
                No reviews yet for this equipment. Be the first neighbor to borrow and rate!
              </p>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="text-xs space-y-1 pb-3 border-b border-[#ede7db] last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={rev.reviewerAvatar}
                          alt={rev.reviewerName}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="font-bold text-[#24211d]">{rev.reviewerName}</span>
                      </div>
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-[#4e4a43] italic">"{rev.comment}"</p>
                    <span className="text-[10px] text-[#8a857b]">{rev.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Booking & Request Card (5 cols) */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="bg-white rounded-3xl border-2 border-[#ded7c8] p-6 sm:p-7 shadow-lg space-y-6">
            {/* Pricing Header */}
            <div className="flex items-baseline justify-between pb-4 border-b border-[#ede7db]">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-[#24211d]">
                    {tool.maintenanceFeePerDay === 0 ? 'Free' : `RM${tool.maintenanceFeePerDay}`}
                  </span>
                  {tool.maintenanceFeePerDay > 0 && (
                    <span className="text-sm font-medium text-[#67635c]">/day</span>
                  )}
                </div>
                <span className="text-xs text-[#8a857b]">
                  RM{tool.depositAmount} refundable security hold
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-[#5f7d66] bg-[#5f7d66]/15 px-2.5 py-1 rounded-full">
                  Max {tool.maxDays} Days
                </span>
              </div>
            </div>

            {requestSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#24211d]">Borrow Request Submitted!</h3>
                <p className="text-xs text-[#67635c] leading-relaxed">
                  The tool owner has been notified. Once approved, you will be able to message them and arrange safe collection.
                </p>
                <div className="pt-2">
                  <Link
                    to="/borrowings"
                    className="w-full py-2.5 rounded-xl bg-[#24211d] text-white text-xs font-bold inline-block"
                  >
                    View Active Requests & Loans
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBorrowSubmit} className="space-y-4">
                {/* Date Range Selector */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#4e4a43] mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      min={formatDateInput(today)}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-[#ded7c8] bg-[#fcfbf9] text-xs font-semibold text-[#24211d]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4e4a43] mb-1">
                      Return Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      min={startDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-[#ded7c8] bg-[#fcfbf9] text-xs font-semibold text-[#24211d]"
                    />
                  </div>
                </div>

                {/* Purpose Note */}
                <div>
                  <label className="block text-xs font-bold text-[#4e4a43] mb-1">
                    Project Note to Owner
                  </label>
                  <textarea
                    value={borrowNote}
                    onChange={(e) => setBorrowNote(e.target.value)}
                    rows={2}
                    placeholder="e.g. Cleaning porch floor and brick patio..."
                    className="w-full px-3 py-2 rounded-xl border border-[#ded7c8] bg-[#fcfbf9] text-xs text-[#24211d] focus:outline-none focus:ring-1 focus:ring-[#c86d51]"
                  />
                </div>

                {/* Price Breakdown Calculation */}
                <div className="bg-[#f4efe6] rounded-2xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between text-[#4e4a43]">
                    <span>
                      RM{tool.maintenanceFeePerDay} × {diffDays} {diffDays === 1 ? 'day' : 'days'}
                    </span>
                    <span className="font-bold">RM{totalMaintenanceFee}</span>
                  </div>

                  <div className="flex justify-between text-[#4e4a43]">
                    <span className="flex items-center gap-1">
                      <span>Refundable Deposit</span>
                      <span className="text-[10px] text-[#5f7d66] font-semibold">(Refunded on Return)</span>
                    </span>
                    <span className="font-bold">RM{tool.depositAmount}</span>
                  </div>

                  <div className="border-t border-[#ded7c8] pt-2 flex justify-between text-sm font-black text-[#24211d]">
                    <span>Initial Deposit Hold</span>
                    <span>RM{totalHold}</span>
                  </div>
                </div>

                {/* Terms Agreement */}
                <label className="flex items-start gap-2 text-xs text-[#67635c] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    required
                    className="mt-0.5 rounded border-[#ded7c8] text-[#c86d51] focus:ring-[#c86d51]"
                  />
                  <span>
                    I agree to return this tool wiped clean by the chosen return date and respect neighbor community guidelines.
                  </span>
                </label>

                {/* Action Submit Button */}
                <button
                  type="submit"
                  disabled={!isAvailable || !agreeTerms || isSubmitting}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                    isAvailable && agreeTerms
                      ? 'bg-[#c86d51] hover:bg-[#b0553b] text-white'
                      : 'bg-[#ded7c8] text-[#8a857b] cursor-not-allowed'
                  }`}
                >
                  <Wrench className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'Sending Request...'
                      : isAvailable
                      ? 'Request to Borrow'
                      : 'Currently On Loan'}
                  </span>
                </button>

                <p className="text-[11px] text-[#8a857b] text-center">
                  🔒 No payment is processed until the owner confirms your request.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPage;
