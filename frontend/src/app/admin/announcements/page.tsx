'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiPlus, FiEdit2, FiTrash2, FiCalendar, FiImage, FiX, FiUser, FiCheck, FiAlertCircle, FiSearch } from 'react-icons/fi';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Load ReactQuill dynamically (client-side only)
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
});

// Toast notification component
interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: number) => void }) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white min-w-[300px] animate-slide-in ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {toast.type === 'success' ? (
            <FiCheck className="w-5 h-5 flex-shrink-0" />
          ) : (
            <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="flex-1 text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => onRemove(toast.id)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

interface Announcement {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string | null;
  show_on_homepage: boolean;
  is_published: boolean;
  author_name: string;
  created_by: number | null;
  created_by_name: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface FormData {
  title: string;
  excerpt: string;
  content: string;
  author_name: string;
  published_at: string;
  is_published: boolean;
}

const initialFormData: FormData = {
  title: '',
  excerpt: '',
  content: '',
  author_name: '',
  published_at: new Date().toISOString().split('T')[0],
  is_published: true,
};

// Quill editor toolbar configuration
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    ['link'],
    [{ 'align': [] }],
    ['clean']
  ],
};

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'indent',
  'link', 'align'
];

export default function AdminAnnouncementsPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Toast functions
  const showToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Fetch all announcements (admin view)
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-announcements'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8000/api/v1/journals/admin/announcements/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch announcements');
      return response.json();
    },
  });

  const announcements: Announcement[] = data?.results || data || [];

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: FormData & { image?: File }) => {
      const formDataToSend = new FormData();
      formDataToSend.append('title', data.title);
      formDataToSend.append('excerpt', data.excerpt);
      // Clean HTML content - remove empty paragraphs
      const cleanContent = data.content.replace(/<p><br><\/p>/g, '').trim();
      formDataToSend.append('content', cleanContent || '<p>No content</p>');
      formDataToSend.append('author_name', data.author_name);
      formDataToSend.append('published_at', data.published_at);
      formDataToSend.append('is_published', String(data.is_published));
      // Only send image if it's a valid File object
      if (data.image && data.image instanceof File && data.image.size > 0) {
        formDataToSend.append('featured_image', data.image);
      }

      const response = await fetch('http://localhost:8000/api/v1/journals/admin/announcements/create/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: formDataToSend,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Create error:', errorData);
        // Parse validation errors
        const errorMessages = [];
        if (errorData.title) errorMessages.push(`Title: ${errorData.title[0]}`);
        if (errorData.excerpt) errorMessages.push(`Excerpt: ${errorData.excerpt[0]}`);
        if (errorData.content) errorMessages.push(`Content: ${errorData.content[0]}`);
        if (errorData.published_at) errorMessages.push(`Date: ${errorData.published_at[0]}`);
        if (errorData.detail) errorMessages.push(errorData.detail);
        if (errorData.non_field_errors) errorMessages.push(errorData.non_field_errors[0]);
        throw new Error(errorMessages.length > 0 ? errorMessages.join(', ') : 'Failed to create news');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
      queryClient.invalidateQueries({ queryKey: ['homepage-announcements'] });
      showToast('News published successfully!', 'success');
      resetForm();
    },
    onError: (error: Error) => {
      showToast(error.message || 'Failed to publish news', 'error');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData & { image?: File } }) => {
      const formDataToSend = new FormData();
      formDataToSend.append('title', data.title);
      formDataToSend.append('excerpt', data.excerpt);
      // Clean HTML content
      const cleanContent = data.content.replace(/<p><br><\/p>/g, '').trim();
      formDataToSend.append('content', cleanContent || '<p>No content</p>');
      formDataToSend.append('author_name', data.author_name);
      formDataToSend.append('published_at', data.published_at);
      formDataToSend.append('is_published', String(data.is_published));
      // Only send image if it's a valid File object
      if (data.image && data.image instanceof File && data.image.size > 0) {
        formDataToSend.append('featured_image', data.image);
      }

      const response = await fetch(`http://localhost:8000/api/v1/journals/admin/announcements/${id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: formDataToSend,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Update error:', errorData);
        // Parse validation errors
        const errorMessages = [];
        if (errorData.title) errorMessages.push(`Title: ${errorData.title[0]}`);
        if (errorData.excerpt) errorMessages.push(`Excerpt: ${errorData.excerpt[0]}`);
        if (errorData.content) errorMessages.push(`Content: ${errorData.content[0]}`);
        if (errorData.published_at) errorMessages.push(`Date: ${errorData.published_at[0]}`);
        if (errorData.featured_image) errorMessages.push(`Image: ${errorData.featured_image[0]}`);
        if (errorData.detail) errorMessages.push(errorData.detail);
        if (errorData.non_field_errors) errorMessages.push(errorData.non_field_errors[0]);
        throw new Error(errorMessages.length > 0 ? errorMessages.join(', ') : 'Failed to update news');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
      queryClient.invalidateQueries({ queryKey: ['homepage-announcements'] });
      showToast('News updated successfully!', 'success');
      resetForm();
    },
    onError: (error: Error) => {
      showToast(error.message || 'Failed to update news', 'error');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`http://localhost:8000/api/v1/journals/admin/announcements/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      // 204 No Content is a successful delete response
      if (!response.ok && response.status !== 204) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to delete news');
      }
      return id; // Return the deleted ID for reference
    },
    onSuccess: async (deletedId) => {
      // Remove from cache immediately
      queryClient.setQueryData(['admin-announcements'], (old: any) => {
        if (!old) return old;
        // Handle both array and paginated response formats
        if (Array.isArray(old)) {
          return old.filter((item: Announcement) => item.id !== deletedId);
        }
        if (old.results && Array.isArray(old.results)) {
          return {
            ...old,
            results: old.results.filter((item: Announcement) => item.id !== deletedId),
          };
        }
        return old;
      });
      // Invalidate and refetch queries
      await queryClient.invalidateQueries({ queryKey: ['admin-announcements'], refetchType: 'active' });
      await queryClient.invalidateQueries({ queryKey: ['homepage-announcements'], refetchType: 'active' });
      await queryClient.invalidateQueries({ queryKey: ['announcements'], refetchType: 'active' });
      // Explicitly refetch to ensure UI updates
      refetch();
      showToast('News deleted successfully!', 'success');
      setDeleteConfirmId(null);
    },
    onError: (error: Error) => {
      showToast(error.message || 'Failed to delete news', 'error');
      setDeleteConfirmId(null);
    },
  });

  const resetForm = () => {
    setFormData(initialFormData);
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleEdit = (announcement: Announcement) => {
    setFormData({
      title: announcement.title,
      excerpt: announcement.excerpt,
      content: announcement.content,
      author_name: announcement.author_name || '',
      published_at: announcement.published_at?.split('T')[0] || new Date().toISOString().split('T')[0],
      is_published: announcement.is_published,
    });
    setImageFile(null); // Reset image file - user must select new one if they want to change it
    setImagePreview(announcement.featured_image);
    setEditingId(announcement.id);
    setIsFormOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type - only JPG and PNG allowed
      const fileType = file.type.toLowerCase();
      const fileName = file.name.toLowerCase();
      const isValidType = 
        fileType === 'image/jpeg' || 
        fileType === 'image/jpg' || 
        fileType === 'image/png' ||
        fileName.endsWith('.jpg') ||
        fileName.endsWith('.jpeg') ||
        fileName.endsWith('.png');
      
      if (!isValidType) {
        showToast('Only JPG and PNG image formats are allowed.', 'error');
        e.target.value = ''; // Clear the input
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title.trim()) {
      showToast('Please enter a title', 'error');
      return;
    }
    if (!formData.excerpt.trim()) {
      showToast('Please enter an excerpt (short summary)', 'error');
      return;
    }
    // Check if content is empty (Quill sends <p><br></p> for empty)
    const cleanContent = formData.content.replace(/<p><br><\/p>/g, '').replace(/<[^>]*>/g, '').trim();
    if (!cleanContent) {
      showToast('Please enter some content', 'error');
      return;
    }
    
    const submitData = { ...formData, image: imageFile || undefined };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const publishedCount = announcements.filter(a => a.is_published).length;

  // Filter announcements based on search query
  const filteredAnnouncements = searchQuery.trim()
    ? announcements.filter(a => 
        a.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : announcements;

  return (
    <div className="p-6">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">News</h1>
            <p className="text-gray-600 mt-1">
              Manage news articles for your site. 
              <span className="ml-2 text-sm text-academic-blue">
                ({publishedCount} published • Homepage shows 5 latest)
              </span>
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-academic-navy text-white rounded-lg hover:bg-academic-blue transition-colors"
          >
            <FiPlus className="w-5 h-5" />
            Add News
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search news by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-transparent"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? 'Edit News' : 'Add New News'}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-transparent"
                  placeholder="Enter news title"
                  required
                />
              </div>

              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image
                </label>
                <div className="flex items-start gap-4">
                  {imagePreview && (
                    <div className="relative w-40 h-24 rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <FiImage className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {imagePreview ? 'Change Image' : 'Upload Image'}
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,.jpg,.jpeg,.png"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Recommended: 800x400px or larger. Image format should be JPG or PNG only.
                </p>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt (Short Summary) *
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-transparent"
                  placeholder="Brief summary shown on news cards and homepage (2-3 lines)"
                  required
                />
              </div>

              {/* Content - Rich Text Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Content *
                </label>
                <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={(value) => setFormData({ ...formData, content: value })}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Write your news content here... Use the toolbar above to format text, add headings, lists, and links."
                    className="h-64"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Use the toolbar to: select headings (H1-H6), make text <strong>bold</strong>/<em>italic</em>, create lists, add links
                </p>
              </div>

              {/* Publisher/Author Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publisher / Author Name
                </label>
                <input
                  type="text"
                  value={formData.author_name}
                  onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-transparent"
                  placeholder="e.g., Editorial Team, Admin, Dr. John Smith"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This name will appear on the news card as the publisher
                </p>
              </div>

              {/* Publication Date & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publication Date *
                  </label>
                  <input
                    type="date"
                    value={formData.published_at}
                    onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.is_published ? 'published' : 'draft'}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.value === 'published' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-transparent bg-white"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.is_published ? 'Will be visible on the site' : 'Saved but not visible'}
                  </p>
                </div>
              </div>

              {/* Info Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> Your name will be automatically recorded as the uploader.
                  The 5 most recent published news will appear on the homepage.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-6 py-2 bg-academic-navy text-white rounded-lg hover:bg-academic-blue transition-colors disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Saving...'
                    : editingId
                    ? 'Update News'
                    : 'Publish News'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete News</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this news article? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteConfirmId)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Announcements List */}
      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
              <div className="flex gap-4">
                <div className="w-32 h-20 bg-gray-200 rounded-lg" />
                <div className="flex-1">
                  <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : announcements.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FiCalendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No News Yet</h3>
          <p className="text-gray-500 mb-4">Create your first news article to get started.</p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-academic-navy text-white rounded-lg hover:bg-academic-blue transition-colors"
          >
            <FiPlus className="w-5 h-5" />
            Add News
          </button>
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FiSearch className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
          <p className="text-gray-500 mb-4">No news articles match your search query &quot;{searchQuery}&quot;.</p>
          <button
            onClick={() => setSearchQuery('')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-academic-navy text-white rounded-lg hover:bg-academic-blue transition-colors"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAnnouncements.map((announcement, index) => (
            <div
              key={announcement.id}
              className={`bg-white rounded-xl border p-4 hover:shadow-md transition-shadow ${
                index < 5 && announcement.is_published 
                  ? 'border-academic-gold/50 ring-1 ring-academic-gold/20' 
                  : 'border-gray-200'
              }`}
            >
              <div className="flex gap-4">
                {/* Image */}
                <div className="relative w-36 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  {announcement.featured_image ? (
                    <Image
                      src={announcement.featured_image}
                      alt={announcement.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <FiImage className="w-8 h-8" />
                    </div>
                  )}
                  {/* Homepage indicator badge on image */}
                  {index < 5 && announcement.is_published && (
                    <div className="absolute top-1 left-1 px-2 py-0.5 bg-academic-gold text-white text-xs font-medium rounded">
                      Homepage
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate pr-2">
                        {announcement.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                        {announcement.excerpt}
                      </p>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="flex-shrink-0">
                      {announcement.is_published ? (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                          Published
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Meta & Actions */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FiCalendar className="w-3 h-3" />
                        {formatDate(announcement.published_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiUser className="w-3 h-3" />
                        {announcement.created_by_name || announcement.author_name || 'Unknown'}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(announcement)}
                        className="p-2 text-gray-400 hover:text-academic-blue hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(announcement.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Footer */}
      {announcements.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">
            <strong>How it works:</strong> The 5 most recent <span className="text-green-600 font-medium">published</span> news 
            articles automatically appear on the homepage. When you publish new news, it will replace the oldest one on the homepage.
            News with the gold border are currently showing on the homepage.
          </p>
        </div>
      )}
    </div>
  );
}
