'use client';

import { useState, useEffect, useRef } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiImage, FiSave, FiX, FiUpload, FiLink } from 'react-icons/fi';
import Image from 'next/image';
import { indexingApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface IndexingEntry {
  id: number;
  title: string;
  logo_url?: string;
  url: string;
  display_order: number;
}

interface IndexingManagerProps {
  journalId: number;
}

export default function IndexingManager({ journalId }: IndexingManagerProps) {
  const [entries, setEntries] = useState<IndexingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEntry, setEditingEntry] = useState<Partial<IndexingEntry> | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get unique titles from existing entries for suggestions
  const existingTitles = Array.from(new Set(entries.map(e => e.title))).sort();

  useEffect(() => {
    fetchEntries();
  }, [journalId]);

  const fetchEntries = async () => {
    try {
      const data = await indexingApi.list(journalId);
      setEntries(data.results || data || []);
    } catch (error) {
      toast.error('Failed to fetch indexing entries');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!editingEntry || !editingEntry.title) {
      toast.error('Title is required');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('journal', String(journalId));
    formData.append('title', editingEntry.title || '');
    formData.append('url', editingEntry.url || '');
    formData.append('display_order', String(editingEntry.display_order || 0));

    if (imageFile) {
      formData.append('logo', imageFile);
    }

    try {
      if (editingEntry.id) {
        await indexingApi.update(editingEntry.id, formData);
        toast.success('Entry updated');
      } else {
        await indexingApi.create(formData);
        toast.success('Entry added');
      }
      setEditingEntry(null);
      setImageFile(null);
      setImagePreview(null);
      await fetchEntries();
    } catch (error: any) {
      console.error('Save error:', error.response?.data);
      toast.error('Failed to save entry');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this indexing entry?')) return;
    try {
      await indexingApi.delete(id);
      toast.success('Entry deleted');
      fetchEntries();
    } catch (error) {
      toast.error('Failed to delete entry');
    }
  };

  if (loading && entries.length === 0) return <div className="p-4 text-center">Loading indexing entries...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Journal Indexing</h2>
        {!editingEntry && (
          <button
            onClick={() => setEditingEntry({
              title: '',
              url: '',
              display_order: 0
            })}
            className="inline-flex items-center gap-2 px-4 py-2 bg-academic-navy text-white rounded-lg hover:bg-academic-blue"
          >
            <FiPlus /> Add Indexing Service
          </button>
        )}
      </div>

      {editingEntry && (
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">{editingEntry.id ? 'Edit Entry' : 'Add New Entry'}</h3>
            <button type="button" onClick={() => { setEditingEntry(null); setImagePreview(null); setImageFile(null); }} className="text-gray-500 hover:text-gray-700">
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title (e.g. Scopus, PubMed)</label>
                <div className="relative">
                  <input
                    type="text"
                    list="titles-list"
                    required
                    value={editingEntry.title}
                    onChange={(e) => setEditingEntry({ ...editingEntry, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-academic-blue"
                    placeholder="Select or type title..."
                  />
                  <datalist id="titles-list">
                    {existingTitles.map((t) => (
                      <option key={t} value={t} />
                    ))}
                    {!existingTitles.includes('Scopus') && <option value="Scopus" />}
                    {!existingTitles.includes('Web of Science') && <option value="Web of Science" />}
                    {!existingTitles.includes('PubMed') && <option value="PubMed" />}
                    {!existingTitles.includes('DOAJ') && <option value="DOAJ" />}
                    {!existingTitles.includes('Google Scholar') && <option value="Google Scholar" />}
                  </datalist>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">URL</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <FiLink className="w-4 h-4" />
                  </span>
                  <input
                    type="url"
                    value={editingEntry.url}
                    onChange={(e) => setEditingEntry({ ...editingEntry, url: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-academic-blue"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200 bg-white">
                    {(imagePreview || editingEntry.logo_url) ? (
                      <Image
                        src={imagePreview || editingEntry.logo_url!}
                        alt="Logo Preview"
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FiImage className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageSelect}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-white"
                    >
                      <FiUpload /> {editingEntry.id ? 'Change' : 'Upload'}
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Display Order</label>
                <input
                  type="number"
                  value={editingEntry.display_order}
                  onChange={(e) => setEditingEntry({ ...editingEntry, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-academic-blue"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700"
            >
              <FiSave /> {editingEntry.id ? 'Update Entry' : 'Save Entry'}
            </button>
            <button
              type="button"
              onClick={() => { setEditingEntry(null); setImagePreview(null); setImageFile(null); }}
              className="px-6 py-2 border rounded-lg hover:bg-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.map((entry) => (
          <div key={entry.id} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4 shadow-sm group">
            <div className="relative w-12 h-12 rounded overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50">
              {entry.logo_url ? (
                <Image src={entry.logo_url} alt={entry.title} fill className="object-contain" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                  <FiImage className="w-5 h-5" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 truncate">{entry.title}</p>
              {entry.url && (
                <a href={entry.url} target="_blank" rel="noopener noreferrer" className="text-xs text-academic-blue hover:underline flex items-center gap-1">
                  <FiLink className="w-3 h-3" /> Visit Link
                </a>
              )}
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => setEditingEntry(entry)}
                className="p-2 text-gray-400 hover:text-academic-blue transition-colors"
              >
                <FiEdit2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(entry.id)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {entries.length === 0 && !editingEntry && (
          <div className="col-span-full text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            No indexing services added yet.
          </div>
        )}
      </div>
    </div>
  );
}

