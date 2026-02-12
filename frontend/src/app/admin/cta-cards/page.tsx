'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiImage, FiUpload } from 'react-icons/fi';
import Image from 'next/image';
import { ctaCardsApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface CTACard {
  id: number;
  image_url: string;
  link_url: string;
  is_active: boolean;
  display_order: number;
}

export default function AdminCTACardsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    link_url: '',
    is_active: true,
    display_order: 0,
    image_file: null as File | null,
  });
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  const { data: cardsData, isLoading } = useQuery({
    queryKey: ['admin-cta-cards'],
    queryFn: () => ctaCardsApi.adminList(),
  });

  const cards: CTACard[] = Array.isArray(cardsData) ? cardsData : (cardsData?.results || []);

  const createMutation = useMutation({
    mutationFn: (data: FormData) => ctaCardsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cta-cards'] });
      toast.success('CTA card created successfully');
      resetForm();
      setShowForm(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to create CTA card');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => ctaCardsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cta-cards'] });
      toast.success('CTA card updated successfully');
      resetForm();
      setShowForm(false);
      setEditingId(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to update CTA card');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => ctaCardsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cta-cards'] });
      toast.success('CTA card deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to delete CTA card');
    },
  });

  const resetForm = () => {
    setFormData({
      link_url: '',
      is_active: true,
      display_order: 0,
      image_file: null,
    });
    setCurrentImageUrl(null);
  };

  const handleEdit = (card: CTACard) => {
    setFormData({
      link_url: card.link_url,
      is_active: card.is_active,
      display_order: card.display_order,
      image_file: null,
    });
    setCurrentImageUrl(card.image_url);
    setEditingId(card.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this CTA card?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('link_url', formData.link_url);
    data.append('is_active', String(formData.is_active));
    data.append('display_order', String(formData.display_order));
    if (formData.image_file) {
      data.append('image', formData.image_file);
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-academic-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manage CTA Cards</h1>
        {!showForm && (
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-academic-navy text-white rounded-lg hover:bg-academic-blue transition-colors"
          >
            <FiPlus className="w-5 h-5" />
            Add New Card
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">{editingId ? 'Edit CTA Card' : 'Create New CTA Card'}</h2>
            <button onClick={() => { setShowForm(false); resetForm(); setEditingId(null); }} className="text-gray-400 hover:text-gray-600">
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="image_file" className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              <input
                type="file"
                id="image_file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, image_file: e.target.files?.[0] || null })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-transparent"
                required={!editingId}
              />
              {editingId && currentImageUrl && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-1">Current image:</p>
                  <div className="relative w-32 h-24">
                    <Image src={currentImageUrl} alt="Current CTA Card" fill className="rounded-lg object-contain" />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="link_url" className="block text-sm font-medium text-gray-700 mb-1">
                Link URL
              </label>
              <input
                type="url"
                id="link_url"
                value={formData.link_url}
                onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-transparent"
                required
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="display_order" className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  id="display_order"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-transparent"
                />
              </div>

              <div className="flex items-center pt-6">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-academic-blue rounded focus:ring-academic-blue"
                />
                <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2 bg-academic-navy text-white font-bold rounded-lg hover:bg-academic-blue transition-colors disabled:opacity-50"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                <FiSave className="w-5 h-5" />
                {editingId ? 'Update Card' : 'Create Card'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                  setEditingId(null);
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col group">
            <div className="relative aspect-[4/3] bg-gray-50">
              <Image
                src={card.image_url}
                alt="CTA Card"
                fill
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(card)}
                  className="p-2 bg-white/90 backdrop-blur-sm text-academic-blue rounded-full shadow-lg hover:bg-white"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(card.id)}
                  className="p-2 bg-white/90 backdrop-blur-sm text-red-500 rounded-full shadow-lg hover:bg-white"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
              {!card.is_active && (
                <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="px-3 py-1 bg-white text-gray-900 text-xs font-bold rounded-full uppercase tracking-wider">Inactive</span>
                </div>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Link URL</p>
                <p className="text-sm text-gray-600 truncate font-mono bg-gray-50 p-2 rounded">{card.link_url}</p>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Order: {card.display_order}</span>
                <span className={`font-bold ${card.is_active ? 'text-green-500' : 'text-gray-400'}`}>
                  {card.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {cards.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <FiImage className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No CTA cards found. Click "Add New Card" to get started.</p>
        </div>
      )}
    </div>
  );
}


