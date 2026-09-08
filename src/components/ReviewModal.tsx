import React, { useState } from 'react';
import { X, Star, ShieldCheck, HeartHandshake } from 'lucide-react';
import type { BorrowRequest } from '../types.ts';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: BorrowRequest | null;
  onSubmitReview: (reviewData: {
    toolId: string | number;
    targetUserId: string | number;
    rating: number;
    careRating: number;
    punctualityRating: number;
    comment: string;
  }) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  request,
  onSubmitReview,
}) => {
  if (!isOpen || !request) return null;

  const [rating, setRating] = useState<number>(5);
  const [careRating, setCareRating] = useState<number>(5);
  const [punctualityRating, setPunctualityRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitReview({
        toolId: request.toolId ?? request.item_id ?? 1,
        targetUserId: request.ownerId ?? request.user_id ?? 1,
        rating,
        careRating,
        punctualityRating,
        comment:
          comment.trim() ||
          'Equipment was in great condition, smooth pickup and friendly neighborhood interaction!',
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const renderStarPicker = (val: number, setVal: (n: number) => void) => {
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
                star <= val ? 'fill-amber-400 text-amber-500' : 'text-[#ded7c8]'
              }`}
            />
          </button>
        ))}
        <span className="text-xs font-bold text-[#24211d] ml-1.5">{val} / 5</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/45 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        id="review-modal-content"
        className="w-full max-w-md bg-[#fcfbf9] border border-[#ded7c8] rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6 flex flex-col text-left"
      >
        <div className="px-6 py-4 border-b border-[#e8e2d7] flex items-center justify-between bg-[#f4efe6]">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-[#5f7d66]" />
            <h3 className="font-bold text-[#24211d] text-base">Community Trust Review</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#67635c] hover:text-[#24211d] hover:bg-[#eae3d5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 rounded-xl bg-[#faf8f5] border border-[#ded7c8] text-xs">
            <span className="text-[#67635c] block">Reviewing borrowing experience for:</span>
            <strong className="text-sm text-[#24211d] block mt-0.5">{request.toolTitle}</strong>
            <span className="text-[11px] text-[#5f7d66] font-semibold mt-1 block">
              Owner: {request.ownerName}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
              Overall Neighbor Experience
            </label>
            {renderStarPicker(rating, setRating)}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
              Item Condition & Care
            </label>
            {renderStarPicker(careRating, setCareRating)}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
              Punctuality & Communication
            </label>
            {renderStarPicker(punctualityRating, setPunctualityRating)}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
              Written Community Feedback
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How did the tool perform? Was the handover easy? Help future neighbors borrow with confidence."
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#ded7c8] bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#c86d51]"
            />
          </div>

          <div className="pt-3 border-t border-[#e8e2d7] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-[#67635c] hover:bg-[#eae3d5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-[#5f7d66] hover:bg-[#496350] text-white text-xs font-bold shadow-xs transition-colors"
            >
              {isSubmitting ? 'Posting...' : 'Submit Trust Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
