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
      navigate(`/items/${newTool.id}`);
    } catch (err: any) {
      setIsSubmitting(false);
      throw err;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#ede7db]">
        <div className="space-y-1">
          <Link
            to="/items"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#67635c] hover:text-[#24211d] transition-colors mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Catalog</span>
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#24211d]">
              List Equipment for Neighbors
            </h1>
            <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full bg-[#5f7d66]/15 text-[#496350] text-xs font-bold">
              {currentNeighborhood?.name || 'Local Circle'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#67635c]">
            Share household gear that sits idle in your storeroom. Earn community trust and small maintenance fees.
          </p>
        </div>
      </div>

      {!currentUser && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>You need to be signed in as a verified resident to publish tool listings.</span>
          </div>
          <button
            onClick={() => {
              if (outletContext?.onOpenAuth) outletContext.onOpenAuth('login');
              else navigate('/login');
            }}
            className="px-3.5 py-1.5 rounded-xl bg-amber-800 text-white text-xs font-bold shrink-0 hover:bg-amber-900"
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
