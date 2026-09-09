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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        id="review-modal-content"
        className="w-full max-w-md bg-white border-3 border-black rounded-3xl shadow-[8px_8px_0px_#000] overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6 flex flex-col text-left"
      >
        <div className="px-6 py-5 border-b-2 border-black flex items-center justify-between bg-[#faf9f6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ff90e8] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
              <HeartHandshake className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-black text-black text-base sm:text-lg leading-tight tracking-tight">
                Community Trust Review
              </h3>
              <p className="text-xs text-neutral-600 font-bold">
                Rate condition & neighbor punctuality
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="jn-btn p-2 rounded-xl border-2 border-black bg-white hover:bg-[#ffc900] text-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-4 rounded-2xl bg-[#faf9f6] border-2 border-black text-xs shadow-[2.5px_2.5px_0px_#000]">
            <span className="text-neutral-600 font-bold block">Reviewing borrowing experience for:</span>
            <strong className="text-base font-black text-black block mt-0.5">{request.toolTitle}</strong>
            <span className="text-xs text-emerald-800 font-bold mt-1 block">
              Owner: {request.ownerName}
            </span>
          </div>

          <div>
            <label className="block text-xs font-mono font-black text-black uppercase mb-1">
              Overall Neighbor Experience
            </label>
            {renderStarPicker(rating, setRating)}
          </div>

          <div>
            <label className="block text-xs font-mono font-black text-black uppercase mb-1">
              Item Condition & Care
            </label>
            {renderStarPicker(careRating, setCareRating)}
          </div>

          <div>
            <label className="block text-xs font-mono font-black text-black uppercase mb-1">
              Punctuality & Communication
            </label>
            {renderStarPicker(punctualityRating, setPunctualityRating)}
          </div>

          <div>
            <label className="block text-xs font-mono font-black text-black uppercase mb-1">
              Written Community Feedback
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How did the tool perform? Was the handover easy? Help future neighbors borrow with confidence."
              className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border-2 border-black bg-white text-black shadow-[2px_2px_0px_#000] focus:ring-0 focus:outline-none focus:bg-[#fffdf0]"
            />
          </div>

          <div className="pt-3 border-t-2 border-black flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="jn-btn px-4 py-2.5 rounded-xl border-2 border-black bg-white text-xs font-black text-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:bg-neutral-100 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="jn-btn px-5 py-2.5 rounded-xl border-2 border-black bg-[#ffc900] hover:bg-[#ffbe00] text-black text-xs font-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              {isSubmitting ? 'Posting...' : 'Submit Trust Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
