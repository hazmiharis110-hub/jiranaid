import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ShieldCheck,
  Calendar,
  Clock,
  AlertCircle,
  Tag,
  Eye,
  Heart,
  Sparkles,
} from "lucide-react";
import type { ToolItem } from "../types.ts";

interface ToolCardProps {
  tool: ToolItem;
  onSelect: (tool: ToolItem) => void;
  onRequestBorrow: (tool: ToolItem) => void;
  index?: number;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  onSelect,
  onRequestBorrow,
  index = 0,
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const isAvailable = tool.status === "available";
  const isBorrowed = tool.status === "borrowed";
  const isMaintenance = tool.status === "maintenance";

  const handleToggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
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
      {/* Image Container with Zoom & Dynamic Badges */}
      <div
        className="relative aspect-4/3 w-full bg-[#f1ede4] overflow-hidden cursor-pointer select-none"
        onClick={() => onSelect(tool)}
      >
        <img
          src={tool.imageUrl}
          alt={tool.title}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          loading="lazy"
        />

        {/* Dynamic Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Interactive Quick View floating pill on Hover */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="translate-y-3 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#24211d]/90 text-[#faf8f5] text-xs font-bold shadow-lg backdrop-blur-xs">
            <Eye className="w-3.5 h-3.5 text-[#c86d51]" />
            Quick View
          </div>
        </div>

        {/* Top Badges Row */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Status Badge with dynamic live pulse */}
          <div className="flex items-center gap-1.5">
            {isAvailable && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#eef4f0]/95 text-[#496350] border border-[#5f7d66]/40 backdrop-blur-xs shadow-xs transition-transform duration-200 group-hover:scale-105">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5f7d66] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5f7d66]"></span>
                </span>
                Available
              </span>
            )}
            {isBorrowed && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#fbeee9]/95 text-[#b0553b] border border-[#c86d51]/40 backdrop-blur-xs shadow-xs">
                <Clock className="w-3 h-3 text-[#c86d51] group-hover:rotate-45 transition-transform duration-300" />
                Borrowed
              </span>
            )}
            {isMaintenance && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#eae6dc]/95 text-[#67635c] border border-[#ded7c8] backdrop-blur-xs shadow-xs">
                <AlertCircle className="w-3 h-3" />
                Maintenance
              </span>
            )}
          </div>

          {/* Interactive Favorite / Wishlist Button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.8 }}
            onClick={handleToggleSave}
            title={isSaved ? "Remove from saved" : "Save tool to wishlist"}
            className="pointer-events-auto w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#24211d] shadow-sm backdrop-blur-xs flex items-center justify-center border border-white/40 transition-colors"
          >
            <Heart
              className={`w-4 h-4 transition-all duration-200 ${
                isSaved
                  ? "fill-red-500 text-red-500 scale-110"
                  : "text-[#67635c] hover:text-red-500"
              }`}
            />
          </motion.button>
        </div>

        {/* Bottom Metadata Badges */}
        <div className="absolute bottom-3 right-3 flex items-center pointer-events-none">
          {/* Category Chip */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#faf8f5]/95 text-[#4e4a43] border border-[#ded7c8] backdrop-blur-xs shadow-xs group-hover:border-[#c86d51]/40 transition-colors">
            <Tag className="w-2.5 h-2.5 text-[#5f7d66]" />
            {tool.category}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand */}
          <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
            <span className="font-bold text-[#8c867b] uppercase tracking-wider text-[10px]">
              {tool.brand}
            </span>
          </div>

          {/* Title */}
          <h4
            onClick={() => onSelect(tool)}
            className="text-sm sm:text-base font-bold text-[#24211d] hover:text-[#c86d51] cursor-pointer line-clamp-1 leading-snug transition-colors mb-1.5"
          >
            {tool.title}
          </h4>

          {/* Description snippet */}
          <p className="text-xs text-[#67635c] line-clamp-2 leading-relaxed mb-4">
            {tool.description}
          </p>

          {/* Owner details with smooth hover tint */}
          <div className="flex items-center justify-between pt-3 border-t border-[#f1ede4] mb-4 group/owner hover:bg-[#f7f4ee]/60 rounded-xl px-2 -mx-2 py-1 transition-colors">
            <div className="flex items-center gap-2">
              <img
                src={tool.ownerAvatar}
                alt={tool.ownerName}
                className="w-6 h-6 rounded-full object-cover border border-[#ded7c8] group-hover/owner:border-[#5f7d66] transition-colors"
              />
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-[#24211d] max-w-27.5 truncate">
                    {tool.ownerName}
                  </span>
                  <ShieldCheck className="w-3 h-3 text-[#5f7d66]" />
                </div>
              </div>
            </div>
            <div className="text-[11px] font-bold text-[#5f7d66] bg-[#eef4f0] px-1.5 py-0.5 rounded-md border border-[#5f7d66]/20">
              ★ {(tool.ownerRating ?? 5.0).toFixed(1)}
            </div>
          </div>
        </div>

        {/* Pricing Breakdown & Action Buttons */}
        <div className="pt-3 border-t border-[#f1ede4]">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-base sm:text-lg font-extrabold text-[#24211d] tracking-tight">
                {tool.maintenanceFeePerDay === 0
                  ? "Free"
                  : `RM ${tool.maintenanceFeePerDay}`}
              </span>
              <span className="text-[11px] text-[#67635c]">
                {tool.maintenanceFeePerDay === 0 ? " to borrow" : " / day"}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[#67635c]">
                Deposit:{" "}
                <strong className="text-[#24211d] font-semibold">
                  RM {tool.depositAmount}
                </strong>
              </span>
              <span className="text-[9px] text-[#5f7d66] font-semibold flex items-center justify-end gap-0.5">
                <Sparkles className="w-2.5 h-2.5" /> 100% Refundable
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <motion.button
              type="button"
              id={`tool-view-btn-${tool.id}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelect(tool)}
              className="w-full py-2 px-3 rounded-xl border border-[#ded7c8] bg-[#faf8f5] hover:bg-[#ede7db] hover:border-[#c86d51]/40 text-xs font-semibold text-[#4e4a43] hover:text-[#24211d] transition-all duration-150 flex items-center justify-center gap-1 shadow-2xs"
            >
              <Eye className="w-3 h-3 text-[#67635c]" />
              <span>Details</span>
            </motion.button>
            <motion.button
              type="button"
              id={`tool-borrow-btn-${tool.id}`}
              whileHover={{ scale: isMaintenance ? 1 : 1.02 }}
              whileTap={{ scale: isMaintenance ? 1 : 0.96 }}
              onClick={() => {
                if (isAvailable) {
                  onRequestBorrow(tool);
                } else {
                  onSelect(tool);
                }
              }}
              disabled={isMaintenance}
              className={`group/btn w-full py-2 px-3 rounded-xl text-xs font-bold transition-all duration-150 flex items-center justify-center gap-1 shadow-xs ${
                isAvailable
                  ? "bg-[#c86d51] hover:bg-[#b0553b] text-white hover:shadow-md"
                  : isBorrowed
                    ? "bg-[#5f7d66] hover:bg-[#496350] text-white"
                    : "bg-[#ded7c8] text-[#8c867b] cursor-not-allowed"
              }`}
            >
              <Calendar className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:-translate-y-0.5" />
              <span>
                {isAvailable
                  ? "Borrow"
                  : isBorrowed
                    ? "Reserve"
                    : "Unavailable"}
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
