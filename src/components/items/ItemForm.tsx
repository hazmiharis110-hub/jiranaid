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
        className="lg:col-span-7 bg-white rounded-3xl border-3 border-black p-6 sm:p-8 space-y-6 shadow-[6px_6px_0px_#000]"
      >
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-100 border-2 border-black text-xs font-black text-black flex items-center gap-2 shadow-[2px_2px_0px_#000]">
            <AlertCircle className="w-4 h-4 shrink-0 stroke-[2.5]" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Preset Selector */}
        {!isEditMode && (
          <div className="space-y-2.5">
            <label className="text-xs font-mono font-black uppercase tracking-wider text-black flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#ff90e8] stroke-[2.5]" />
              <span>Quick Start from Household Presets</span>
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {TOOL_IMAGE_PRESETS.slice(0, 6).map((p) => (
                <button
                  type="button"
                  key={p.title}
                  onClick={() => handleApplyPreset(p)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 border-black text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    title === p.title
                      ? 'bg-[#ffc900] text-black shadow-[3px_3px_0px_#000]'
                      : 'bg-white text-black hover:bg-[#faf9f6] shadow-[2px_2px_0px_#000]'
                  }`}
                >
                  <img
                    src={p.url}
                    alt={p.title}
                    className="w-5 h-5 rounded-md object-cover border border-black"
                  />
                  <span>{p.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-black text-black border-b-2 border-black pb-2 flex items-center gap-2">
            <Tag className="w-4 h-4 text-black stroke-[2.5]" />
            <span>1. Tool Details</span>
          </h4>

          <div>
            <label className="block text-xs font-mono font-black text-black uppercase mb-1">
              Title / Equipment Name *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Kärcher K3 High Pressure Water Jet"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black bg-white text-sm font-bold text-black shadow-[2px_2px_0px_#000] focus:ring-0 focus:outline-none focus:bg-[#fffdf0]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-black text-black uppercase mb-1">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Exclude<ToolCategory, 'All'>)}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black bg-white text-sm font-bold text-black shadow-[2px_2px_0px_#000] focus:ring-0 focus:outline-none focus:bg-[#fffdf0]"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono font-black text-black uppercase mb-1 flex items-center justify-between">
              <span>Description *</span>
              <span className="text-[11px] text-neutral-600 font-bold lowercase">Details, accessories, condition</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe what is included, its operating condition, and any useful tips for neighbors..."
              required
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black bg-white text-sm font-bold text-black shadow-[2px_2px_0px_#000] focus:ring-0 focus:outline-none focus:bg-[#fffdf0]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-black text-black uppercase mb-1">
              Photo URL (image_url) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-black">
                <ImageIcon className="w-4 h-4 stroke-[2.5]" />
              </span>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border-2 border-black bg-white text-sm font-bold text-black shadow-[2px_2px_0px_#000] focus:ring-0 focus:outline-none focus:bg-[#fffdf0]"
              />
            </div>
            <p className="text-[11px] font-bold text-neutral-600 mt-1">
              Paste a photo URL or choose from one of the quick presets above.
            </p>
          </div>
        </div>

        {/* Pricing & Deposit */}
        <div className="space-y-4">
          <h4 className="text-sm font-black text-black border-b-2 border-black pb-2 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-black stroke-[2.5]" />
            <span>2. Daily Fee & Security Deposit</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-black text-black uppercase mb-1">
                Daily Price (RM) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-xs font-black text-black font-mono">
                  RM
                </span>
                <input
                  type="number"
                  min="0"
                  max="500"
                  step="0.5"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  className="w-full pl-11 pr-3 py-2.5 rounded-xl border-2 border-black bg-white text-sm font-black font-mono text-black shadow-[2px_2px_0px_#000] focus:ring-0 focus:outline-none focus:bg-[#fffdf0]"
                />
              </div>
              <p className="text-[10px] font-bold text-neutral-600 mt-1">Daily maintenance fee (Set 0 for free loan)</p>
            </div>

            <div>
              <label className="block text-xs font-mono font-black text-black uppercase mb-1">
                Refundable Deposit (RM) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-xs font-black text-black font-mono">
                  RM
                </span>
                <input
                  type="number"
                  min="0"
                  max="2000"
                  step="1"
                  value={deposit}
                  onChange={(e) => setDeposit(parseFloat(e.target.value) || 0)}
                  className="w-full pl-11 pr-3 py-2.5 rounded-xl border-2 border-black bg-white text-sm font-black font-mono text-black shadow-[2px_2px_0px_#000] focus:ring-0 focus:outline-none focus:bg-[#fffdf0]"
                />
              </div>
              <p className="text-[10px] font-bold text-neutral-600 mt-1">Refunded automatically upon safe return</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t-2 border-black flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="jn-btn px-7 py-3 rounded-xl bg-[#ffc900] hover:bg-[#ffbe00] text-black font-black text-sm border-2 border-black shadow-[3.5px_3.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Saving...' : submitButtonText}
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="jn-btn px-5 py-3 rounded-xl border-2 border-black bg-white text-sm font-black text-black hover:bg-[#faf9f6] shadow-[2.5px_2.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>

          {isEditMode && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="jn-btn px-5 py-3 rounded-xl border-2 border-black bg-red-100 hover:bg-red-200 text-red-800 font-black text-xs shadow-[2.5px_2.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              Delete Listing
            </button>
          )}
        </div>
      </form>

      {/* Live Preview Card (5 cols) */}
      <div className="lg:col-span-5 sticky top-24 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-black uppercase tracking-wider text-black flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#ff90e8] stroke-[2.5]" />
            <span>Live Card Preview</span>
          </h3>
          <span className="text-[11px] font-bold text-neutral-600">Updates as you type</span>
        </div>

        {/* Rendered Preview Card */}
        <div className="bg-white rounded-3xl border-3 border-black shadow-[6px_6px_0px_#000] overflow-hidden text-left">
          <div className="relative aspect-4/3 w-full bg-neutral-100 overflow-hidden border-b-2 border-black">
            <img
              src={imageUrl}
              alt={title || 'Preview'}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = TOOL_IMAGE_PRESETS[0].url;
              }}
            />
            <div className="absolute top-3 right-3">
              <span className="text-xs font-mono font-black px-2.5 py-1 rounded-lg bg-[#bbf7d0] text-black border-2 border-black shadow-[1.5px_1.5px_0px_#000]">
                Available
              </span>
            </div>
          </div>

          <div className="p-5 space-y-2">
            <span className="inline-block bg-[#ff90e8] text-black border border-black font-mono font-black uppercase text-[10px] px-2 py-0.5 rounded-md shadow-[1px_1px_0px_#000]">
              {category}
            </span>
            <h3 className="font-black text-lg text-black line-clamp-1">
              {title || 'Your Equipment Title'}
            </h3>
            <p className="text-xs text-neutral-700 font-medium line-clamp-3 leading-relaxed">
              {description || 'Provide a helpful description so neighbors know what is included and how to use it safely.'}
            </p>
          </div>

          <div className="px-5 py-4 bg-[#faf9f6] border-t-2 border-black flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black font-mono text-black">
                  {price === 0 ? 'Free' : `RM${price}`}
                </span>
                {price > 0 && (
                  <span className="text-xs font-bold text-neutral-600 font-mono">/day</span>
                )}
              </div>
              <span className="text-[11px] font-bold text-neutral-600 block">
                RM{deposit} deposit (refunded)
              </span>
            </div>

            <span className="text-xs font-mono font-black text-black bg-[#bbf7d0] border-2 border-black px-2.5 py-1 rounded-lg shadow-[2px_2px_0px_#000]">
              Verified Escrow
            </span>
          </div>
        </div>

        {/* Listing Advice Card */}
        <div className="p-4 rounded-2xl bg-[#fffdf0] border-2 border-black text-xs font-medium text-black space-y-1.5 shadow-[3px_3px_0px_#000]">
          <div className="flex items-center gap-1.5 font-black text-black">
            <Info className="w-4 h-4 stroke-[2.5]" />
            <span className="uppercase font-mono">Neighborhood Sharing Safe</span>
          </div>
          <p className="text-neutral-700">
            This listing is shared securely within your neighborhood geofence with automatic security deposit holds.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ItemForm;
