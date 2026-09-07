import React, { useState } from 'react';
import {
  Wrench,
  Camera,
  CheckCircle2,
  DollarSign,
  Shield,
  Tag,
  UploadCloud,
  Sparkles,
  Info,
  MapPin,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import type { ToolCategory, ToolCondition, ToolItem } from '../../types';
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

export const CONDITIONS: ToolCondition[] = [
  'Like New',
  'Good Condition',
  'Fair / Workhorse',
];

export interface ItemFormData {
  title: string;
  brand: string;
  model: string;
  category: Exclude<ToolCategory, 'All'>;
  description: string;
  condition: ToolCondition;
  imageUrl: string;
  maintenanceFeePerDay: number;
  depositAmount: number;
  maxDays: number;
  instructions: string;
  pickupNote: string;
}

interface ItemFormProps {
  initialData?: Partial<ItemFormData>;
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
  const [brand, setBrand] = useState(initialData?.brand || '');
  const [model, setModel] = useState(initialData?.model || '');
  const [category, setCategory] = useState<Exclude<ToolCategory, 'All'>>(
    initialData?.category || 'Power Tools'
  );
  const [description, setDescription] = useState(initialData?.description || '');
  const [condition, setCondition] = useState<ToolCondition>(
    initialData?.condition || 'Good Condition'
  );
  const [imageUrl, setImageUrl] = useState(
    initialData?.imageUrl || TOOL_IMAGE_PRESETS[0].url
  );
  const [maintenanceFeePerDay, setMaintenanceFeePerDay] = useState<number>(
    typeof initialData?.maintenanceFeePerDay === 'number' ? initialData.maintenanceFeePerDay : 5
  );
  const [depositAmount, setDepositAmount] = useState<number>(
    typeof initialData?.depositAmount === 'number' ? initialData.depositAmount : 50
  );
  const [maxDays, setMaxDays] = useState<number>(
    typeof initialData?.maxDays === 'number' ? initialData.maxDays : 3
  );
  const [instructions, setInstructions] = useState(
    initialData?.instructions || 'Please clean thoroughly and recharge battery before returning.'
  );
  const [pickupNote, setPickupNote] = useState(
    initialData?.pickupNote || 'Flexible pickup on weekday evenings or weekend mornings.'
  );

  const [errorMsg, setErrorMsg] = useState('');

  const handleApplyPreset = (preset: (typeof TOOL_IMAGE_PRESETS)[0]) => {
    setTitle(preset.title);
    setCategory(preset.category as Exclude<ToolCategory, 'All'>);
    setBrand(preset.brand);
    setImageUrl(preset.url);
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
      setErrorMsg('Please provide or select a photo.');
      return;
    }

    try {
      await onSubmit({
        title: title.trim(),
        brand: brand.trim() || 'Standard',
        model: model.trim(),
        category,
        description: description.trim(),
        condition,
        imageUrl: imageUrl.trim(),
        maintenanceFeePerDay: Number(maintenanceFeePerDay) || 0,
        depositAmount: Number(depositAmount) || 0,
        maxDays: Number(maxDays) || 3,
        instructions: instructions.trim(),
        pickupNote: pickupNote.trim(),
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save tool. Please try again.');
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
              Tool Name / Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Kärcher K2 Compact High Pressure Washer"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#ded7c8] bg-white text-sm text-[#24211d] focus:outline-none focus:ring-2 focus:ring-[#c86d51]/20 focus:border-[#c86d51]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
                Condition *
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ToolCondition)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ded7c8] bg-white text-sm text-[#24211d] focus:outline-none focus:ring-2 focus:ring-[#c86d51]/20 focus:border-[#c86d51]"
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
                Brand / Manufacturer
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g., Bosch, Makita, Kärcher"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ded7c8] bg-white text-sm text-[#24211d] focus:outline-none focus:ring-2 focus:ring-[#c86d51]/20 focus:border-[#c86d51]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
                Model / Specs
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g., 18V Brushless, 110 Bar"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ded7c8] bg-white text-sm text-[#24211d] focus:outline-none focus:ring-2 focus:ring-[#c86d51]/20 focus:border-[#c86d51]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
              Description & What's Included *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe accessories (battery, charger, extra nozzle), current working condition, and recommended use..."
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#ded7c8] bg-white text-sm text-[#24211d] focus:outline-none focus:ring-2 focus:ring-[#c86d51]/20 focus:border-[#c86d51]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
              Photo URL *
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#ded7c8] bg-white text-sm text-[#24211d] focus:outline-none focus:ring-2 focus:ring-[#c86d51]/20 focus:border-[#c86d51]"
            />
          </div>
        </div>

        {/* Pricing, Deposit & Loan Duration */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-[#24211d] border-b border-[#ede7db] pb-2 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#5f7d66]" />
            <span>2. Sharing Terms & Security Deposit</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
                Daily Fee (RM)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-[#8a857b]">
                  RM
                </span>
                <input
                  type="number"
                  min="0"
                  max="150"
                  value={maintenanceFeePerDay}
                  onChange={(e) => setMaintenanceFeePerDay(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#ded7c8] bg-white text-sm font-bold text-[#24211d] focus:outline-none focus:ring-2 focus:ring-[#c86d51]/20 focus:border-[#c86d51]"
                />
              </div>
              <p className="text-[10px] text-[#8a857b] mt-1">Set 0 for free community loan</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
                Refundable Deposit (RM)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-[#8a857b]">
                  RM
                </span>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#ded7c8] bg-white text-sm font-bold text-[#24211d] focus:outline-none focus:ring-2 focus:ring-[#c86d51]/20 focus:border-[#c86d51]"
                />
              </div>
              <p className="text-[10px] text-[#8a857b] mt-1">Released upon safe return</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
                Max Days Allowed
              </label>
              <input
                type="number"
                min="1"
                max="14"
                value={maxDays}
                onChange={(e) => setMaxDays(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-[#ded7c8] bg-white text-sm font-bold text-[#24211d] focus:outline-none focus:ring-2 focus:ring-[#c86d51]/20 focus:border-[#c86d51]"
              />
              <p className="text-[10px] text-[#8a857b] mt-1">Standard is 3-5 days</p>
            </div>
          </div>
        </div>

        {/* Safety & Pickup Guidelines */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-[#24211d] border-b border-[#ede7db] pb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#496350]" />
            <span>3. Safety & Pickup Guidelines</span>
          </h4>

          <div>
            <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
              Safety / Care Instructions
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Wear eye protection; do not expose motor to heavy rain"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#ded7c8] bg-white text-sm text-[#24211d] focus:outline-none focus:ring-2 focus:ring-[#c86d51]/20 focus:border-[#c86d51]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
              Pickup & Return Note
            </label>
            <input
              type="text"
              value={pickupNote}
              onChange={(e) => setPickupNote(e.target.value)}
              placeholder="e.g. Porch pickup available anytime after 6 PM"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#ded7c8] bg-white text-sm text-[#24211d] focus:outline-none focus:ring-2 focus:ring-[#c86d51]/20 focus:border-[#c86d51]"
            />
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
                // fallback if broken image
                (e.target as HTMLImageElement).src = TOOL_IMAGE_PRESETS[0].url;
              }}
            />
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#24211d]/80 text-[#faf8f5] text-[11px] font-semibold backdrop-blur-xs">
              <MapPin className="w-3 h-3 text-[#c86d51]" />
              <span>300m away</span>
            </div>
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/95 text-[#24211d]">
                {condition}
              </span>
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
              {title || 'Your Tool Title Here'}
            </h3>
            <p className="text-xs text-[#67635c] line-clamp-1 mt-0.5">
              {brand || 'Brand'} {model ? `• ${model}` : ''}
            </p>
            <p className="text-xs text-[#8a857b] line-clamp-2 mt-2 leading-relaxed">
              {description || 'Your description will show here for neighbors to understand its condition and included parts.'}
            </p>
          </div>

          <div className="px-4 py-3 bg-[#f7f4ee] border-t border-[#ede7db] flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-[#24211d]">
                  {maintenanceFeePerDay === 0 ? 'Free' : `RM${maintenanceFeePerDay}`}
                </span>
                {maintenanceFeePerDay > 0 && (
                  <span className="text-[11px] font-medium text-[#67635c]">/day</span>
                )}
              </div>
              <span className="text-[10px] text-[#8a857b] block">
                RM{depositAmount} deposit (refunded)
              </span>
            </div>

            <span className="text-[11px] font-bold text-[#5f7d66]">
              Max {maxDays} days
            </span>
          </div>
        </div>

        {/* Listing Advice Card */}
        <div className="p-4 rounded-xl bg-[#f4efe6] border border-[#ded7c8] text-xs text-[#67635c] space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-[#24211d]">
            <Info className="w-3.5 h-3.5 text-[#5f7d66]" />
            <span>Community Lending Tip</span>
          </div>
          <p>
            Tools with clear photos and reasonable deposits receive 4x more borrowing requests. Your items are only shared with verified neighbors in your geofenced area.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ItemForm;
