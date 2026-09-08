import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Trash2 } from 'lucide-react';
import { ItemForm, type ItemFormData } from '../components/items/ItemForm';
import { itemService } from '../services/itemService';
import { useItemStore } from '../store/useItemStore';
import { useAuthStore } from '../store/useAuthStore';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import type { ToolItem } from '../types';

export const EditItemPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateTool, deleteTool } = useItemStore();
  const { currentUser } = useAuthStore();

  const [tool, setTool] = useState<ToolItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    itemService
      .getItemById(id)
      .then((res) => {
        setTool(res.tool);
        setIsLoading(false);
      })
      .catch((err) => {
        setErrorMsg(err.message || 'Tool not found');
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner message="Loading tool information..." fullPage />;
  }

  if (errorMsg || !tool) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-[#24211d]">Tool Not Found</h2>
        <p className="text-sm text-[#67635c]">Cannot load tool for editing.</p>
        <Link
          to="/items"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#24211d] text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  const handleSubmit = async (formData: ItemFormData) => {
    setIsSubmitting(true);
    try {
      await updateTool(tool.id, formData);
      navigate(`/items/${tool.id}`);
    } catch (err: any) {
      setIsSubmitting(false);
      throw err;
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to remove "${tool.title}" from the catalog?`)) {
      try {
        await deleteTool(tool.id);
        navigate('/items');
      } catch (err: any) {
        alert(err.message || 'Failed to delete tool');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#ede7db]">
        <div className="space-y-1">
          <Link
            to={`/items/${tool.id}`}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#67635c] hover:text-[#24211d] transition-colors mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Item Details</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-[#24211d]">
            Edit Tool Listing
          </h1>
          <p className="text-xs sm:text-sm text-[#67635c]">
            Update photos, description, condition, or daily maintenance pricing for {tool.title}.
          </p>
        </div>
      </div>

      <ItemForm
        initialData={{
          title: tool.title,
          brand: tool.brand,
          model: tool.model || '',
          category: tool.category,
          description: tool.description,
          condition: tool.condition,
          imageUrl: tool.imageUrl,
          maintenanceFeePerDay: tool.maintenanceFeePerDay,
          depositAmount: tool.depositAmount,
          maxDays: tool.maxDays,
          instructions: tool.instructions || '',
          pickupNote: tool.pickupNote || '',
        }}
        onSubmit={handleSubmit}
        submitButtonText="Save Changes"
        isSubmitting={isSubmitting}
        onCancel={() => navigate(`/items/${tool.id}`)}
        onDelete={handleDelete}
        isEditMode
      />
    </div>
  );
};

export default EditItemPage;
