import React, { useState } from 'react';
import {
  DollarSign,
  Tag,
  Sparkles,
  Info,
  AlertCircle,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import type { ToolCategory } from '../../types';
import { TOOL_IMAGE_PRESETS } from '../../data/presets';

export const CATEGORIES: Exclude<ToolCategory, 'All'>[] = [
  'Gardening & Yard',
  'Power Tools',
  'Home Improvement',
  'Cleaning & Steam',
  'Kitchen Appliances',
  'Automotive',
  'Ladders & Access',
  'Woodworking',
];

export interface ItemFormData {
  title: string;
  category: Exclude<ToolCategory, 'All'>;
  description: string;
  price: number;
  deposit: number;
  image_url: string;
}

interface ItemFormProps {
  initialData?: Partial<ItemFormData> & {
    imageUrl?: string;
    maintenanceFeePerDay?: number;
    depositAmount?: number;
  };
  onSubmit: (data: ItemFormData) => Promise<void>;
  submitButtonText?: string;
  isSubmitting?: boolean;
  onCancel?: () => void;
  onDelete?: () => void;
  isEditMode?: boolean;
}

export const ItemForm: React.FC<ItemFormProps> = ({
  initialData,
  onSubmit,
  submitButtonText = 'Publish Tool Listing',
  isSubmitting = false,
  onCancel,
  onDelete,
  isEditMode = false,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState<Exclude<ToolCategory, 'All'>>(
    initialData?.category || 'Power Tools'
  );
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState<number>(
    typeof initialData?.price === 'number'
      ? initialData.price
      : typeof initialData?.maintenanceFeePerDay === 'number'
      ? initialData.maintenanceFeePerDay
      : 5
  );
  const [deposit, setDeposit] = useState<number>(
    typeof initialData?.deposit === 'number'
      ? initialData.deposit
      : typeof initialData?.depositAmount === 'number'
      ? initialData.depositAmount
      : 30
  );
  const [imageUrl, setImageUrl] = useState(
    initialData?.image_url || initialData?.imageUrl || TOOL_IMAGE_PRESETS[0].url
  );

  const [errorMsg, setErrorMsg] = useState('');

  const handleApplyPreset = (preset: (typeof TOOL_IMAGE_PRESETS)[0]) => {
    setTitle(preset.title);
    setCategory(preset.category as Exclude<ToolCategory, 'All'>);
    setImageUrl(preset.url);
    if (!description) {
      setDescription(`Well-maintained ${preset.title.toLowerCase()} ready for neighborhood sharing.`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Please enter a descriptive tool name.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please provide a brief description for your neighbors.');
      return;
    }
    if (!imageUrl.trim()) {
      setErrorMsg('Please provide or select a photo URL.');
      return;
    }

    try {
      await onSubmit({
        title: title.trim(),
        category,
        description: description.trim(),
        price: Number(price) >= 0 ? Number(price) : 0,
        deposit: Number(deposit) >= 0 ? Number(deposit) : 0,
        image_url: imageUrl.trim(),
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save tool listing. Please try again.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Form Container (7 cols) */}
      <form
        onSubmit={handleSubmit}
        className="lg:col-span-7 bg-[#fcfbf9] rounded-2xl border border-[#ded7c8] p-6 sm:p-8 space-y-6 shadow-xs"
      >
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Preset Selector */}
        {!isEditMode && (
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#4e4a43] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#c86d51]" />
              <span>Quick Start from Household Presets</span>
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {TOOL_IMAGE_PRESETS.slice(0, 6).map((p) => (
                <button
                  type="button"
                  key={p.title}
                  onClick={() => handleApplyPreset(p)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium shrink-0 transition-all ${
                    title === p.title
                      ? 'bg-[#24211d] text-white border-[#24211d]'
                      : 'bg-white text-[#4e4a43] border-[#ded7c8] hover:border-[#c86d51]'
                  }`}
                >
                  <img
                    src={p.url}
                    alt={p.title}
                    className="w-5 h-5 rounded-md object-cover"
                  />
                  <span>{p.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-[#24211d] border-b border-[#ede7db] pb-2 flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#c86d51]" />
            <span>1. Tool Details</span>
          </h4>

          <div>
            <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
              Title / Equipment Name *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Kärcher K3 High Pressure Water Jet"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#ded7c8] bg-white text-sm text-[#24211d] focus:outline-none focus:ring-2 focus:ring-[#c86d51]/20 focus:border-[#c86d51]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Exclude<ToolCategory, 'All'>)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#ded7c8] bg-white text-sm text-[#24211d] focus:outline-none focus:ring-2 focus:ring-[#c86d51]/20 focus:border-[#c86d51]"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4e4a43] mb-1 flex items-center justify-between">
              <span>Description *</span>
              <span className="text-[11px] text-[#8a857b] font-normal">Details, accessories, condition</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe what is included, its operating condition, and any useful tips for neighbors..."
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#ded7c8] bg-white text-sm text-[#24211d] focus:outline-none focus:ring-2 focus:ring-[#c86d51]/20 focus:border-[#c86d51]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
              Photo URL (image_url) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-[#8a857b]">
                <ImageIcon className="w-4 h-4" />
              </span>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                required
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#ded7c8] bg-white text-sm text-[#24211d] focus:outline-none focus:ring-2 focus:ring-[#c86d51]/20 focus:border-[#c86d51]"
              />
            </div>
            <p className="text-[11px] text-[#8a857b] mt-1">
              Paste a photo URL or choose from one of the quick presets above.
            </p>
          </div>
        </div>

        {/* Pricing & Deposit */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-[#24211d] border-b border-[#ede7db] pb-2 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#5f7d66]" />
            <span>2. Daily Fee & Security Deposit</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
                Daily Price (RM) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-[#8a857b]">
                  RM
                </span>
                <input
                  type="number"
                  min="0"
                  max="500"
                  step="0.5"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#ded7c8] bg-white text-sm font-bold text-[#24211d] focus:outline-none focus:ring-2 focus:ring-[#c86d51]/20 focus:border-[#c86d51]"
                />
              </div>
              <p className="text-[10px] text-[#8a857b] mt-1">Daily maintenance fee (Set 0 for free loan)</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
                Refundable Deposit (RM) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-[#8a857b]">
                  RM
                </span>
                <input
                  type="number"
                  min="0"
                  max="2000"
                  step="1"
                  value={deposit}
                  onChange={(e) => setDeposit(parseFloat(e.target.value) || 0)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#ded7c8] bg-white text-sm font-bold text-[#24211d] focus:outline-none focus:ring-2 focus:ring-[#c86d51]/20 focus:border-[#c86d51]"
                />
              </div>
              <p className="text-[10px] text-[#8a857b] mt-1">Refunded automatically upon safe return</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-[#ede7db] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#c86d51] hover:bg-[#b0553b] text-white font-bold text-sm shadow-xs hover:shadow-md transition-all duration-200 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : submitButtonText}
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 rounded-xl border border-[#ded7c8] bg-white text-sm font-semibold text-[#4e4a43] hover:bg-[#f1ede4] transition-all"
              >
                Cancel
              </button>
            )}
          </div>

          {isEditMode && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs transition-colors"
            >
              Delete Listing
            </button>
          )}
        </div>
      </form>

      {/* Live Preview Card (5 cols) */}
      <div className="lg:col-span-5 sticky top-24 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#67635c] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#c86d51]" />
            <span>Live Card Preview</span>
          </h3>
          <span className="text-[11px] text-[#8a857b]">Updates as you type</span>
        </div>

        {/* Rendered Preview Card */}
        <div className="bg-[#fcfbf9] rounded-2xl border border-[#ded7c8] shadow-md overflow-hidden text-left">
          <div className="relative aspect-4/3 w-full bg-[#f1ede4] overflow-hidden">
            <img
              src={imageUrl}
              alt={title || 'Preview'}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = TOOL_IMAGE_PRESETS[0].url;
              }}
            />
            <div className="absolute bottom-2.5 right-2.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#5f7d66] text-white">
                Available
              </span>
            </div>
          </div>

          <div className="p-4">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-[#c86d51]">
              {category}
            </span>
            <h3 className="font-bold text-base text-[#24211d] mt-1 line-clamp-1">
              {title || 'Your Equipment Title'}
            </h3>
            <p className="text-xs text-[#8a857b] line-clamp-3 mt-2 leading-relaxed">
              {description || 'Provide a helpful description so neighbors know what is included and how to use it safely.'}
            </p>
          </div>

          <div className="px-4 py-3 bg-[#f7f4ee] border-t border-[#ede7db] flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-[#24211d]">
                  {price === 0 ? 'Free' : `RM${price}`}
                </span>
                {price > 0 && (
                  <span className="text-[11px] font-medium text-[#67635c]">/day</span>
                )}
              </div>
              <span className="text-[10px] text-[#8a857b] block">
                RM{deposit} deposit (refunded)
              </span>
            </div>

            <span className="text-xs font-bold text-[#5f7d66] bg-[#5f7d66]/10 px-2.5 py-1 rounded-lg">
              Verified Escrow
            </span>
          </div>
        </div>

        {/* Listing Advice Card */}
        <div className="p-4 rounded-xl bg-[#f4efe6] border border-[#ded7c8] text-xs text-[#67635c] space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-[#24211d]">
            <Info className="w-3.5 h-3.5 text-[#5f7d66]" />
            <span>PostgreSQL Schema Aligned</span>
          </div>
          <p>
            This listing strictly stores <code>title</code>, <code>category</code>, <code>description</code>, <code>price</code>, <code>deposit</code>, and <code>image_url</code> directly linked to your user account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ItemForm;
