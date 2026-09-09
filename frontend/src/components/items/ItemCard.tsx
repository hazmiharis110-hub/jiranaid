import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Eye,
  Heart,
  ArrowRight,
} from 'lucide-react';
import type { ToolItem } from '../../types';

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

  const isAvailable = (tool.status ?? 'available') === 'available';
  const displayImage = tool.image_url || tool.imageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80';
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
      className="group bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-[7px_7px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden text-left relative"
    >
      {/* Clickable Card Link */}
      <Link to={`/items/${tool.id}`} className="flex-1 flex flex-col">
        {/* Image Container with Zoom */}
        <div className="relative aspect-4/3 w-full bg-[#faf9f6] border-b-2 border-black overflow-hidden select-none">
          <img
            src={displayImage}
            alt={tool.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80';
            }}
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

          {/* Floating Hover Badge */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200">
            <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-200 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-black text-white text-xs font-black border-2 border-black shadow-[2px_2px_0px_#ff90e8]">
              <Eye className="w-3.5 h-3.5 text-[#ff90e8]" />
              <span>View Details</span>
            </div>
          </div>

          {/* Save / Favorite Button */}
          <button
            onClick={handleToggleSave}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-xl bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] hover:bg-[#ff90e8] hover:shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            title={isSaved ? 'Remove from saved' : 'Save equipment'}
            aria-label="Save equipment"
          >
            <Heart
              className={`w-4 h-4 transition-colors stroke-[2.5] ${
                isSaved ? 'fill-[#ff90e8] text-black' : 'text-black'
              }`}
            />
          </button>

          {/* Bottom Status Tag */}
          <div className="absolute bottom-2.5 right-2.5 pointer-events-none">
            <span
              className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] ${
                isAvailable
                  ? 'bg-[#bbf7d0] text-black'
                  : 'bg-[#ffd33d] text-black'
              }`}
            >
              {isAvailable ? 'Available' : 'On Loan'}
            </span>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Category Tag */}
            <div className="mb-2">
              <span className="inline-block font-mono font-black uppercase tracking-wider text-[10px] text-black bg-[#ff90e8] px-2 py-0.5 rounded-md border-2 border-black shadow-[1.5px_1.5px_0px_#000]">
                {tool.category}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-black text-base sm:text-lg text-black group-hover:text-[#ff6b4a] transition-colors line-clamp-1">
              {tool.title}
            </h3>
            {tool.brand ? (
              <p className="text-xs text-[#555] font-bold line-clamp-1 mt-1">
                {tool.brand} {tool.model ? `• ${tool.model}` : ''}
              </p>
            ) : (
              <p className="text-xs text-[#666] font-medium line-clamp-1 mt-1">
                {tool.description}
              </p>
            )}
          </div>

          {/* Owner Info & Rating */}
          <div className="pt-3 mt-3 border-t-2 border-black flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={
                  tool.ownerAvatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                }
                alt={tool.ownerName || 'Neighbor'}
                className="w-6 h-6 rounded-lg object-cover border-2 border-black"
              />
              <span className="truncate max-w-[100px] font-bold text-black">
                {tool.ownerName || 'Neighbor'}
              </span>
            </div>
            <div className="flex items-center gap-1 font-black text-xs text-black bg-[#faf9f6] px-2 py-0.5 rounded-md border border-black shadow-[1px_1px_0px_#000] shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>★ {typeof tool.ownerRating === 'number' ? tool.ownerRating.toFixed(1) : '5.0'}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Pricing & Borrow Action Footer */}
      <div className="px-4 py-3 bg-[#faf9f6] border-t-2 border-black flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-base sm:text-lg font-black font-mono text-black">
              {dailyPrice === 0 ? 'Free' : `RM${dailyPrice}`}
            </span>
            {dailyPrice > 0 && (
              <span className="text-[11px] font-bold text-[#555]">/day</span>
            )}
          </div>
          <span className="text-[10px] font-mono text-[#555] font-bold block">
            RM{depositAmount} deposit (refunded)
          </span>
        </div>

        <button
          onClick={handleBorrowClick}
          disabled={!isAvailable}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all duration-150 flex items-center gap-1.5 border-2 ${
            isAvailable
              ? 'bg-[#ffc900] text-black border-black shadow-[2.5px_2.5px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:bg-black hover:text-white cursor-pointer'
              : 'bg-[#e5e5e5] text-[#888] border-[#aaa] cursor-not-allowed'
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
