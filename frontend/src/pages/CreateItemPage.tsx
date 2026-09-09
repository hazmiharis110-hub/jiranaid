import React, { useState } from 'react';
import { useNavigate, Link, useOutletContext } from 'react-router-dom';
import { ArrowLeft, Sparkles, Plus, AlertCircle, Wrench, ShieldCheck } from 'lucide-react';
import { ItemForm, type ItemFormData } from '../components/items/ItemForm';
import { useItemStore } from '../store/useItemStore';
import { useAuthStore } from '../store/useAuthStore';

export const CreateItemPage: React.FC = () => {
  const navigate = useNavigate();
  const outletContext = useOutletContext<any>();
  const { createTool } = useItemStore();
  const { currentUser, currentNeighborhood } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: ItemFormData) => {
    if (!currentUser) {
      if (outletContext?.onOpenAuth) {
        outletContext.onOpenAuth('login');
      } else {
        navigate('/login');
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const newTool = await createTool({
        ...formData,
      });
      if (newTool && newTool.id) {
        navigate(`/items/${newTool.id}`);
      } else {
        navigate('/items');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      throw err;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b-2 border-black">
        <div className="space-y-2">
          <Link
            to="/items"
            className="jn-btn inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#ffc900] text-black text-xs sm:text-sm font-black border-2 border-black shadow-[2.5px_2.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all mb-1"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Back to Catalog</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
              List Equipment for Neighbors
            </h1>
            <span className="hidden sm:inline-flex px-3 py-1 rounded-lg bg-[#bbf7d0] text-black border-2 border-black text-xs font-mono font-black shadow-[1.5px_1.5px_0px_#000]">
              {currentNeighborhood?.name || 'Local Circle'}
            </span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-neutral-600">
            Share household gear that sits idle in your storeroom. Earn community trust and small maintenance fees.
          </p>
        </div>
      </div>

      {!currentUser && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#fffdf0] border-2 border-black text-black flex items-center justify-between gap-4 shadow-[3.5px_3.5px_0px_#000]">
          <div className="flex items-center gap-3 text-xs sm:text-sm font-bold">
            <AlertCircle className="w-5 h-5 text-black stroke-[2.5] shrink-0" />
            <span>You need to be signed in as a verified resident to publish tool listings.</span>
          </div>
          <button
            onClick={() => {
              if (outletContext?.onOpenAuth) outletContext.onOpenAuth('login');
              else navigate('/login');
            }}
            className="jn-btn px-4 py-2 rounded-xl bg-[#ffc900] hover:bg-[#ffbe00] text-black text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000] shrink-0 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
          >
            Sign In Now
          </button>
        </div>
      )}

      {/* Item Form Component */}
      <ItemForm
        onSubmit={handleSubmit}
        submitButtonText="Publish to Neighborhood Library"
        isSubmitting={isSubmitting}
        onCancel={() => navigate('/items')}
      />
    </div>
  );
};

export default CreateItemPage;
