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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b-2 border-black">
        <div className="space-y-2">
          <Link
            to={`/items/${tool.id}`}
            className="jn-btn inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#ffc900] text-black text-xs sm:text-sm font-black border-2 border-black shadow-[2.5px_2.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all mb-1"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Back to Item Details</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
            Edit Tool Listing
          </h1>
          <p className="text-xs sm:text-sm font-bold text-neutral-600">
            Update photos, description, condition, or daily maintenance pricing for {tool.title}.
          </p>
        </div>
      </div>

      <ItemForm
        initialData={{
          title: tool.title,
          category: tool.category as any,
          description: tool.description || '',
          price: tool.price ?? tool.maintenanceFeePerDay ?? 0,
          deposit: tool.deposit ?? tool.depositAmount ?? 0,
          image_url: tool.image_url || tool.imageUrl || '',
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
