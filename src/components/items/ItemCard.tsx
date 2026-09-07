import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  MapPin,
  Calendar,
  Clock,
  Eye,
  Heart,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import type { ToolItem } from '../../types';
import { Badge } from '../common/Badge';

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

  const isAvailable = tool.status === 'available';

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
      whileHover={{ y: -6 }}
      className="group bg-[#fcfbf9] rounded-2xl border border-[#ded7c8] hover:border-[#c86d51]/70 hover:shadow-xl hover:shadow-[#24211d]/6 transition-all duration-300 flex flex-col overflow-hidden text-left relative"
    >
      {/* Clickable Card Link */}
      <Link to={`/items/${tool.id}`} className="flex-1 flex flex-col">
        {/* Image Container with Zoom */}
        <div className="relative aspect-4/3 w-full bg-[#f1ede4] overflow-hidden select-none">
          <img
            src={tool.imageUrl}
            alt={tool.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            loading="lazy"
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Floating Hover Badge */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="translate-y-3 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#24211d]/90 text-[#faf8f5] text-xs font-bold shadow-lg backdrop-blur-xs">
              <Eye className="w-3.5 h-3.5 text-[#c86d51]" />
              <span>View Details</span>
            </div>
          </div>

          {/* Distance Indicator Pill */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#24211d]/80 text-[#faf8f5] text-[11px] font-semibold backdrop-blur-xs shadow-xs">
            <MapPin className="w-3 h-3 text-[#c86d51]" />
            <span>{tool.distanceKm < 1 ? `${Math.round(tool.distanceKm * 1000)}m` : `${tool.distanceKm.toFixed(1)}km`} away</span>
          </div>

          {/* Save / Favorite Button */}
          <button
            onClick={handleToggleSave}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#4e4a43] flex items-center justify-center shadow-xs transition-transform active:scale-90"
            title={isSaved ? 'Remove from saved' : 'Save equipment'}
            aria-label="Save equipment"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isSaved ? 'fill-[#c86d51] text-[#c86d51]' : 'text-[#4e4a43]'
              }`}
            />
          </button>

          {/* Bottom Status & Condition Tag */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/95 text-[#24211d] shadow-2xs backdrop-blur-xs">
              {tool.condition}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs backdrop-blur-xs ${
                isAvailable
                  ? 'bg-[#5f7d66] text-white'
                  : 'bg-amber-600 text-white'
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
            <div className="flex items-center justify-between text-xs text-[#67635c] mb-1.5">
              <span className="font-semibold uppercase tracking-wider text-[10px] text-[#c86d51]">
                {tool.category}
              </span>
              <span className="text-[11px] font-medium text-[#8a857b]">
                Max {tool.maxDays} days
              </span>
            </div>

            {/* Title & Brand */}
            <h3 className="font-bold text-sm sm:text-base text-[#24211d] group-hover:text-[#c86d51] transition-colors line-clamp-1">
              {tool.title}
            </h3>
            <p className="text-xs text-[#67635c] line-clamp-1 mt-0.5">
              {tool.brand} {tool.model ? `• ${tool.model}` : ''}
            </p>
          </div>

          {/* Owner Info & Rating */}
          <div className="pt-3 mt-3 border-t border-[#ede7db] flex items-center justify-between text-xs text-[#67635c]">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={tool.ownerAvatar}
                alt={tool.ownerName}
                className="w-5 h-5 rounded-full object-cover border border-[#ded7c8]"
              />
              <span className="truncate max-w-[90px] font-medium text-[#4e4a43]">
                {tool.ownerName}
              </span>
            </div>
            <div className="flex items-center gap-1 font-semibold text-[#5f7d66] shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>★ {tool.ownerRating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Pricing & Borrow Action Footer */}
      <div className="px-4 py-3 bg-[#f7f4ee] border-t border-[#ede7db] flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-base sm:text-lg font-black text-[#24211d]">
              {tool.maintenanceFeePerDay === 0 ? 'Free' : `RM${tool.maintenanceFeePerDay}`}
            </span>
            {tool.maintenanceFeePerDay > 0 && (
              <span className="text-[11px] font-medium text-[#67635c]">/day</span>
            )}
          </div>
          <span className="text-[10px] text-[#8a857b] block">
            RM{tool.depositAmount} deposit (refunded)
          </span>
        </div>

        <button
          onClick={handleBorrowClick}
          disabled={!isAvailable}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1 shadow-2xs ${
            isAvailable
              ? 'bg-[#24211d] hover:bg-[#c86d51] text-[#faf8f5] hover:shadow-xs'
              : 'bg-[#ded7c8] text-[#8a857b] cursor-not-allowed'
          }`}
        >
          <span>Borrow</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
};

export default ItemCard;
