import React, { useState } from 'react';
import {
  X,
  Plus,
  Wrench,
  Camera,
  CheckCircle2,
  DollarSign,
  Shield,
  Tag,
  UploadCloud,
  Sparkles,
  Info,
} from 'lucide-react';
import type { ToolCategory, ToolCondition } from '../types.ts';
import { TOOL_IMAGE_PRESETS } from '../data/presets.ts';

interface AddToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTool: (toolData: {
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
  }) => void;
}

const CATEGORIES: Exclude<ToolCategory, 'All'>[] = [
  'Gardening & Yard',
  'Power Tools',
  'Home Improvement',
  'Cleaning & Steam',
  'Kitchen Appliances',
  'Automotive',
  'Ladders & Access',
  'Woodworking',
];

const CONDITIONS: ToolCondition[] = [
  'Like New',
  'Good Condition',
  'Fair / Workhorse',
];

export const AddToolModal: React.FC<AddToolModalProps> = ({
  isOpen,
  onClose,
  onAddTool,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState<Exclude<ToolCategory, 'All'>>('Power Tools');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState<ToolCondition>('Like New');
  const [imageUrl, setImageUrl] = useState(TOOL_IMAGE_PRESETS[1].url);
  const [maintenanceFeePerDay, setMaintenanceFeePerDay] = useState<number>(3);
  const [depositAmount, setDepositAmount] = useState<number>(30);
  const [maxDays, setMaxDays] = useState<number>(4);
  const [instructions, setInstructions] = useState('');
  const [pickupNote, setPickupNote] = useState('');
  const [showPresetPicker, setShowPresetPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onAddTool({
        title: title.trim(),
        brand: brand.trim() || 'Generic',
        model: model.trim(),
        category,
        description: description.trim(),
        condition,
        imageUrl: imageUrl.trim() || TOOL_IMAGE_PRESETS[0].url,
        maintenanceFeePerDay: Number(maintenanceFeePerDay) || 0,
        depositAmount: Number(depositAmount) || 20,
        maxDays: Number(maxDays) || 5,
        instructions: instructions.trim() || 'Please clean after use and return safely.',
        pickupNote: pickupNote.trim() || 'Available for pickup after confirmed request.',
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/45 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        id="add-tool-modal-content"
        className="w-full max-w-2xl bg-[#fcfbf9] border border-[#ded7c8] rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8 max-h-[90vh] flex flex-col text-left"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e8e2d7] flex items-center justify-between bg-[#f4efe6] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#c86d51] text-white flex items-center justify-center">
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-bold text-[#24211d] text-base leading-tight">
                List a Tool or Appliance in JiranAid
              </h3>
              <p className="text-xs text-[#67635c]">
                Empower your neighborhood library and earn maintenance savings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#67635c] hover:text-[#24211d] hover:bg-[#eae3d5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5">
          {/* Tool Basics */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8c867b]">
              Equipment Details
            </label>

            <div>
              <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
                Item Title *
              </label>
              <input
                id="input-tool-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., DeWalt 20V Max Cordless Circular Saw"
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#ded7c8] bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#c86d51]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
                  Brand / Manufacturer
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g., DeWalt, Kärcher, Bosch"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#ded7c8] bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#c86d51]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
                  Model / Spec (Optional)
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g., DCS391B 6-1/2 Inch"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#ded7c8] bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#c86d51]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
                Category *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`p-2 rounded-lg text-xs font-medium border text-left truncate transition-colors ${
                      category === cat
                        ? 'border-[#c86d51] bg-[#fbeee9] text-[#b0553b] font-bold'
                        : 'border-[#ded7c8] bg-[#faf8f5] text-[#67635c] hover:bg-[#ede7db]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
                Description & What Is Included *
              </label>
              <textarea
                required
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe condition, what accessories or batteries are provided, and ideal uses..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#ded7c8] bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#c86d51]"
              />
            </div>
          </div>

          {/* Condition & Photos */}
          <div className="space-y-3 pt-3 border-t border-[#e8e2d7]">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8c867b]">
              Condition & Photo
            </label>

            <div>
              <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
                Condition Rating
              </label>
              <div className="grid grid-cols-3 gap-2">
                {CONDITIONS.map((cond) => (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => setCondition(cond)}
                    className={`py-2 px-3 rounded-lg text-xs border transition-colors text-center ${
                      condition === cond
                        ? 'border-[#5f7d66] bg-[#eef4f0] text-[#496350] font-bold'
                        : 'border-[#ded7c8] bg-[#faf8f5] text-[#67635c] hover:bg-[#ede7db]'
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#4e4a43]">
                  Tool Photo
                </label>
                <button
                  type="button"
                  onClick={() => setShowPresetPicker(!showPresetPicker)}
                  className="text-xs text-[#c86d51] hover:underline font-semibold"
                >
                  {showPresetPicker ? 'Hide Sample Photos' : 'Choose from High-Res Presets'}
                </button>
              </div>

              {/* Photo Preview & URL input */}
              <div className="flex items-center gap-3">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-16 h-16 rounded-lg object-cover border border-[#ded7c8] bg-[#f1ede4] shrink-0"
                />
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://image-url..."
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-[#ded7c8] bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#c86d51]"
                />
              </div>

              {showPresetPicker && (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
                  {TOOL_IMAGE_PRESETS.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setImageUrl(preset.url);
                        if (!title) setTitle(preset.title);
                        if (!brand) setBrand(preset.brand);
                      }}
                      className={`p-1.5 rounded-lg border cursor-pointer transition-all ${
                        imageUrl === preset.url
                          ? 'border-[#c86d51] bg-[#fbeee9]'
                          : 'border-[#ded7c8] bg-[#faf8f5] hover:border-[#c86d51]'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.title}
                        className="w-full h-12 object-cover rounded mb-1"
                      />
                      <span className="text-[10px] text-[#4e4a43] block truncate font-medium">
                        {preset.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Maintenance Fee & Deposit System Settings */}
          <div className="space-y-3 pt-3 border-t border-[#e8e2d7]">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8c867b]">
              Maintenance Fee & Deposit Settings
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
                  Daily Fee (RM)
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-xs text-[#8c867b]">RM</span>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={maintenanceFeePerDay}
                    onChange={(e) => setMaintenanceFeePerDay(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#ded7c8] bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#c86d51]"
                  />
                </div>
                <span className="text-[10px] text-[#8c867b]">Enter 0 for free community share</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
                  Security Deposit (RM)
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-xs text-[#8c867b]">RM</span>
                  <input
                    type="number"
                    min="10"
                    max="200"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#ded7c8] bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#c86d51]"
                  />
                </div>
                <span className="text-[10px] text-[#8c867b]">100% refunded upon safe return</span>
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
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#ded7c8] bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#c86d51]"
                />
                <span className="text-[10px] text-[#8c867b]">Per borrowing period</span>
              </div>
            </div>
          </div>

          {/* Instructions & Pickup Notes */}
          <div className="space-y-3 pt-3 border-t border-[#e8e2d7]">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8c867b]">
              Guidelines for Borrower
            </label>

            <div>
              <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
                Usage / Safety Instructions
              </label>
              <input
                type="text"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g., Use heavy duty extension cord; always wear safety goggles provided."
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#ded7c8] bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#c86d51]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4e4a43] mb-1">
                Pickup & Return Instructions
              </label>
              <input
                type="text"
                value={pickupNote}
                onChange={(e) => setPickupNote(e.target.value)}
                placeholder="e.g., Available weekdays after 5:30 PM. Porch pickup available with door code."
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#ded7c8] bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#c86d51]"
              />
            </div>
          </div>

          {/* Form Footer */}
          <div className="pt-4 border-t border-[#e8e2d7] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-[#67635c] hover:text-[#24211d] hover:bg-[#eae3d5] transition-colors"
            >
              Cancel
            </button>
            <button
              id="submit-create-tool-btn"
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg bg-[#c86d51] hover:bg-[#b0553b] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-60"
            >
              {isSubmitting ? (
                'Listing Tool...'
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Publish Tool to Neighborhood Pool
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
