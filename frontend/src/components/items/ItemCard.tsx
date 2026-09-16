import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ShieldCheck, Eye, Heart, ArrowRight } from "lucide-react";
import type { ToolItem } from "../../types";

interface ItemCardProps {
  tool: ToolItem;
  index?: number;
  onQuickBorrow?: (tool: ToolItem) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  tool,
  index = 0,
  onQuickBorrow,
}) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  const isAvailable = (tool.status ?? "available") === "available";
  const displayImage =
    tool.image_url ||
    tool.imageUrl ||
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80";
  const dailyPrice = tool.price ?? tool.maintenanceFeePerDay ?? 0;
  const depositAmount = tool.deposit ?? tool.depositAmount ?? 0;

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  const handleBorrowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickBorrow) {
      onQuickBorrow(tool);
    } else {
      navigate(`/items/${tool.id}?action=borrow`);
    }
  };

  return (
    <motion.div
      id={`tool-card-${tool.id}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.28, delay: Math.min(index * 0.04, 0.3) }}
      whileHover={{ y: -4 }}
      className="group bg-white rounded-2xl border-2 border-[#14181f] shadow-[4px_4px_0px_#14181f,0_10px_24px_-4px_rgba(254,205,14,0.25)] hover:shadow-[6px_6px_0px_#14181f,0_16px_32px_-4px_rgba(254,205,14,0.45)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden text-left relative"
    >
      {/* Clickable Card Link */}
      <Link to={`/items/${tool.id}`} className="flex-1 flex flex-col">
        {/* Image Container with Zoom */}
        <div className="relative aspect-4/3 w-full bg-[#fdfae8] border-b-2 border-[#14181f] overflow-hidden select-none">
          <img
            src={displayImage}
            alt={tool.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80";
            }}
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

          {/* Floating Hover Badge */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200">
            <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-200 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-black text-white text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000]">
              <Eye className="w-3.5 h-3.5 text-[#fecd0e]" />
              <span>View Details</span>
            </div>
          </div>

          {/* Save / Favorite Button */}
          <button
            onClick={handleToggleSave}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-xl bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] hover:bg-[#fee26d] hover:shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            title={isSaved ? "Remove from saved" : "Save equipment"}
            aria-label="Save equipment"
          >
            <Heart
              className={`w-4 h-4 transition-colors stroke-[2.5] ${
                isSaved ? "fill-[#fecd0e] text-black" : "text-black"
              }`}
            />
          </button>

          {/* Bottom Status Tag */}
          <div className="absolute top-2.5 left-2.5">
            <span
              className={`jn-sticker-alt text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border-2 border-[#132219] shadow-[2px_2px_0px_#132219] ${
                isAvailable
<<<<<<< HEAD
                  ? "bg-[#86efac] text-black"
                  : "bg-[#fee26d] text-black"
=======
                  ? 'bg-[#dcfce7] text-[#166534]'
                  : 'bg-[#fef3c7] text-[#92400e]'
>>>>>>> 6fdadb60fc77808061e877b8b975b50daef47bc4
              }`}
            >
              {isAvailable ? "Available" : "On Loan"}
            </span>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Category Tag */}
            <div className="mb-2">
              <span className="inline-block jn-sticker font-mono font-black uppercase tracking-wider text-[10px] text-[#92400e] bg-[#fef3c7] px-2 py-0.5 rounded-md border-2 border-[#132219] shadow-[1.5px_1.5px_0px_#132219]">
                {tool.category}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-black text-base sm:text-lg text-[#132219] group-hover:underline transition-colors line-clamp-1">
              {tool.title}
            </h3>
            {tool.brand ? (
              <p className="text-xs text-[#555] font-bold line-clamp-1 mt-1">
                {tool.brand} {tool.model ? `• ${tool.model}` : ""}
              </p>
            ) : (
              <p className="text-xs text-[#666] font-medium line-clamp-1 mt-1">
                {tool.description}
              </p>
            )}
          </div>

          {/* Owner Info & Rating */}
          <div className="pt-3 mt-3 border-t-2 border-[#132219] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={
                  tool.ownerAvatar ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                }
<<<<<<< HEAD
                alt={tool.ownerName || "Neighbor"}
                className="w-6 h-6 rounded-lg object-cover border-2 border-black"
              />
              <span className="truncate max-w-25 font-bold text-black">
                {tool.ownerName || "Neighbor"}
              </span>
            </div>
            <div className="flex items-center gap-1 font-black text-xs text-black bg-[#fdfae8] px-2 py-0.5 rounded-md border border-black shadow-[1px_1px_0px_#000] shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>
                ★{" "}
                {typeof tool.ownerRating === "number"
                  ? tool.ownerRating.toFixed(1)
                  : "5.0"}
              </span>
=======
                alt={tool.ownerName || 'Neighbor'}
                className="w-6 h-6 rounded-lg object-cover border-2 border-[#132219]"
              />
              <span className="truncate max-w-[100px] font-bold text-[#132219]">
                {tool.ownerName || 'Neighbor'}
              </span>
            </div>
            <div className="flex items-center gap-1 font-black text-xs text-[#132219] bg-[#fef3c7] px-2 py-0.5 rounded-md border border-[#132219] shadow-[1px_1px_0px_#132219] shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5] text-[#166534]" />
              <span>★ {typeof tool.ownerRating === 'number' ? tool.ownerRating.toFixed(1) : '5.0'}</span>
>>>>>>> 6fdadb60fc77808061e877b8b975b50daef47bc4
            </div>
          </div>
        </div>
      </Link>

      {/* Pricing & Borrow Action Footer */}
      <div className="px-4 py-3 bg-[#fbf9f5] border-t-2 border-[#132219] flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-1">
<<<<<<< HEAD
            <span className="text-base sm:text-lg font-black font-mono text-black">
              {dailyPrice === 0 ? "Free" : `RM${dailyPrice}`}
=======
            <span className="text-base sm:text-lg font-black font-mono text-[#166534]">
              {dailyPrice === 0 ? 'Free' : `RM${dailyPrice}`}
>>>>>>> 6fdadb60fc77808061e877b8b975b50daef47bc4
            </span>
            {dailyPrice > 0 && (
              <span className="text-[11px] font-bold text-[#555]">/day</span>
            )}
          </div>
          <span className="text-[10px] font-mono text-[#666] font-bold block">
            RM{depositAmount} deposit (refunded)
          </span>
        </div>

        <button
          onClick={handleBorrowClick}
          disabled={!isAvailable}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all duration-150 flex items-center gap-1.5 border-2 ${
            isAvailable
<<<<<<< HEAD
              ? "bg-[#fecd0e] text-black border-black shadow-[2.5px_2.5px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:bg-black hover:text-white cursor-pointer"
              : "bg-[#e5e5e5] text-[#888] border-[#aaa] cursor-not-allowed"
=======
              ? 'bg-[#166534] text-white border-[#132219] shadow-[2.5px_2.5px_0px_#f59e0b] hover:shadow-[4px_4px_0px_#f59e0b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:bg-[#14532d] cursor-pointer'
              : 'bg-[#e5e5e5] text-[#888] border-[#aaa] cursor-not-allowed'
>>>>>>> 6fdadb60fc77808061e877b8b975b50daef47bc4
          }`}
        >
          <span>Borrow</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>
    </motion.div>
  );
};

export default ItemCard;
