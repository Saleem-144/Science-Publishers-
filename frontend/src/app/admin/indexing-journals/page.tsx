'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { indexingPlatformsApi, journalsApi } from '@/lib/api';
import { 
  FiPlus, FiEdit2, FiTrash2, FiGlobe, 
  FiChevronDown, FiChevronUp, FiLink, FiSave, FiX, FiCheck
} from 'react-icons/fi';
import toast from 'react-hot-toast';

interface Journal {
  id: number;
  title: string;
}

interface IndexingLink {
  id: number;
  platform: number;
  journal: number;
  journal_title: string;
  url: string;
}

interface IndexingPlatform {
  id: number;
  name: string;
  is_active: boolean;
  display_order: number;
  journal_links?: IndexingLink[];
}

export default function IndexingJournalsPage() {
  const queryClient = useQueryClient();
  const [editingPlatform, setEditingPlatform] = useState<IndexingPlatform | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    is_active: true,
    display_order: 0,
    selectedJournals: [] as { id: number, title: string, url: string }[]
  });

  // Queries
  const { data: platforms, isLoading: isLoadingPlatforms } = useQuery({
    queryKey: ['admin-indexing-platforms'],
    queryFn: () => indexingPlatformsApi.list(), // This returns platforms with links
  });

  const { data: journalsData } = useQuery({
    queryKey: ['admin-journals-list'],
    queryFn: () => journalsApi.adminList({ is_active: true }),
  });

  const journals: Journal[] = journalsData?.results || [];

  // Mutations
  const createPlatformMutation = useMutation({
    mutationFn: (data: any) => indexingPlatformsApi.create(data),
    onSuccess: async (newPlatform) => {
      // Create links
      for (const journal of formData.selectedJournals) {
        if (journal.url.trim()) {
          await indexingPlatformsApi.createLink({
            platform: newPlatform.id,
            journal: journal.id,
            url: journal.url
          });
        }
      }
      queryClient.invalidateQueries({ queryKey: ['admin-indexing-platforms'] });
      toast.success('Indexing platform created successfully');
      resetForm();
    }
  });

  const updatePlatformMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: any }) => indexingPlatformsApi.update(id, data),
    onSuccess: async (updatedPlatform) => {
      // Get existing links to update/delete
      const existingLinks = platforms?.find((p: any) => p.id === updatedPlatform.id)?.journal_links || [];
      
      // Update or create links
      for (const journal of formData.selectedJournals) {
        const existing = existingLinks.find((l: any) => l.journal === journal.id);
        if (journal.url.trim()) {
          if (existing) {
            if (existing.url !== journal.url) {
              await indexingPlatformsApi.updateLink(existing.id, { url: journal.url });
            }
          } else {
            await indexingPlatformsApi.createLink({
              platform: updatedPlatform.id,
              journal: journal.id,
              url: journal.url
            });
          }
        }
      }

      // Delete links that were removed
      for (const existing of existingLinks) {
        if (!formData.selectedJournals.find(j => j.id === existing.journal)) {
          await indexingPlatformsApi.deleteLink(existing.id);
        }
      }

      queryClient.invalidateQueries({ queryKey: ['admin-indexing-platforms'] });
      toast.success('Indexing platform updated successfully');
      resetForm();
    }
  });

  const deletePlatformMutation = useMutation({
    mutationFn: (id: number) => indexingPlatformsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-indexing-platforms'] });
      toast.success('Indexing platform deleted');
    }
  });

  const resetForm = () => {
    setEditingPlatform(null);
    setFormData({
      name: '',
      is_active: true,
      display_order: 0,
      selectedJournals: []
    });
    setIsFormOpen(false);
  };

  const handleEdit = (platform: IndexingPlatform) => {
    setEditingPlatform(platform);
    setFormData({
      name: platform.name,
      is_active: platform.is_active,
      display_order: platform.display_order,
      selectedJournals: (platform.journal_links || []).map(link => ({
        id: link.journal,
        title: link.journal_title,
        url: link.url
      }))
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    const platformData = {
      name: formData.name,
      is_active: formData.is_active,
      display_order: formData.display_order
    };

    if (editingPlatform) {
      updatePlatformMutation.mutate({ id: editingPlatform.id, data: platformData });
    } else {
      createPlatformMutation.mutate(platformData);
    }
  };

  const toggleJournal = (journal: Journal) => {
    const isSelected = formData.selectedJournals.find(j => j.id === journal.id);
    if (isSelected) {
      setFormData({
        ...formData,
        selectedJournals: formData.selectedJournals.filter(j => j.id !== journal.id)
      });
    } else {
      setFormData({
        ...formData,
        selectedJournals: [...formData.selectedJournals, { id: journal.id, title: journal.title, url: '' }]
      });
    }
  };

  const updateJournalUrl = (journalId: number, url: string) => {
    setFormData({
      ...formData,
      selectedJournals: formData.selectedJournals.map(j => 
        j.id === journalId ? { ...j, url } : j
      )
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-academic-navy">Indexing Journal Management</h1>
          <p className="text-gray-500">Manage global indexing platforms and their journal links</p>
        </div>
        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-academic-navy text-white px-4 py-2 rounded-lg hover:bg-academic-blue transition-colors"
          >
            <FiPlus /> Add Indexing
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-academic-navy">
              {editingPlatform ? 'Edit Indexing' : 'Add New Indexing'}
            </h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Indexing Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Scopus, Web of Science"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-academic-blue border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active</label>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-md font-semibold text-academic-navy mb-4">Select Journals & Provide URLs</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
                {journals.map((journal) => {
                  const selectedJournal = formData.selectedJournals.find(j => j.id === journal.id);
                  return (
                    <div key={journal.id} className={`p-4 rounded-lg border transition-all ${selectedJournal ? 'border-academic-blue bg-blue-50/50' : 'border-gray-200 bg-gray-50/30'}`}>
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
                          <input
                            type="checkbox"
                            checked={!!selectedJournal}
                            onChange={() => toggleJournal(journal)}
                            className="w-4 h-4 text-academic-blue border-gray-300 rounded"
                          />
                          <span className="text-sm font-medium text-gray-700 truncate">{journal.title}</span>
                        </label>
                        {selectedJournal && (
                          <span className="text-xs text-academic-blue flex items-center gap-1">
                            <FiCheck className="w-3 h-3" /> Selected
                          </span>
                        )}
                      </div>
                      
                      {selectedJournal && (
                        <div className="mt-2 pl-7">
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                              <FiLink className="w-3 h-3" />
                            </div>
                            <input
                              type="url"
                              value={selectedJournal.url}
                              onChange={(e) => updateJournalUrl(journal.id, e.target.value)}
                              placeholder="https://..."
                              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-academic-blue outline-none bg-white"
                              required
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createPlatformMutation.isPending || updatePlatformMutation.isPending}
                className="flex items-center gap-2 bg-academic-navy text-white px-6 py-2 rounded-lg hover:bg-academic-blue transition-colors disabled:opacity-50"
              >
                <FiSave /> {editingPlatform ? 'Update' : 'Create'} Indexing
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoadingPlatforms ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-academic-navy border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {platforms?.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <FiGlobe className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No indexing platforms found. Add your first one above.</p>
            </div>
          ) : (
            platforms?.map((platform: IndexingPlatform) => (
              <div key={platform.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 flex items-center justify-between bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-academic-gold/20 text-academic-navy rounded-lg flex items-center justify-center font-bold">
                      {platform.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-academic-navy">{platform.name}</h3>
                        {!platform.is_active && (
                          <span className="px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-500 rounded-full">Inactive</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">Order: {platform.display_order} • {platform.journal_links?.length || 0} Journals</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(platform)}
                      className="p-2 text-academic-blue hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <FiEdit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this indexing platform?')) {
                          deletePlatformMutation.mutate(platform.id);
                        }
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {platform.journal_links && platform.journal_links.length > 0 && (
                  <div className="p-4 bg-white border-t border-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {platform.journal_links.map((link) => (
                        <div key={link.id} className="flex items-center gap-2 px-3 py-2 bg-ivory rounded-lg text-sm group">
                          <FiLink className="text-gray-400 group-hover:text-academic-blue" />
                          <span className="text-gray-700 truncate font-medium flex-1">{link.journal_title}</span>
                          <a 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[10px] text-academic-blue hover:underline"
                          >
                            Visit Link
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

