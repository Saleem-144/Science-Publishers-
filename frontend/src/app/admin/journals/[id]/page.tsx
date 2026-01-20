'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowLeft, FiSave, FiUpload, FiX, FiImage } from 'react-icons/fi';
import { journalsApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function EditJournalPage() {
  const router = useRouter();
  const params = useParams();
  const journalId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [existingCoverImage, setExistingCoverImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    short_title: '',
    slug: '',
    description: '',
    short_description: '',
    issn_print: '',
    issn_online: '',
    publisher: 'Aethra Science Publishers',
    editor_in_chief: '',
    frequency: 'Monthly',
    is_active: true,
    is_featured: false,
  });

  useEffect(() => {
  const fetchJournal = async () => {
    try {
        const journal = await journalsApi.get(journalId);
      setFormData({
        title: journal.title || '',
          short_title: journal.short_title || '',
        slug: journal.slug || '',
        description: journal.description || '',
          short_description: journal.short_description || '',
        issn_print: journal.issn_print || '',
        issn_online: journal.issn_online || '',
          publisher: journal.publisher || 'Aethra Science Publishers',
        editor_in_chief: journal.editor_in_chief || '',
          frequency: journal.frequency || 'Monthly',
        is_active: journal.is_active ?? true,
        is_featured: journal.is_featured ?? false,
      });
        if (journal.cover_image) {
          setExistingCoverImage(journal.cover_image);
        }
    } catch (error) {
        toast.error('Failed to fetch journal');
      router.push('/admin/journals');
    } finally {
        setFetching(false);
      }
    };

    fetchJournal();
  }, [journalId, router]);

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setCoverImage(null);
    setCoverImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (coverImage) {
        // Use FormData for file upload
        const submitData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          submitData.append(key, String(value));
        });
        submitData.append('cover_image', coverImage);
        await journalsApi.updateWithImage(parseInt(journalId), submitData);
      } else {
        await journalsApi.update(parseInt(journalId), formData);
      }
      toast.success('Journal updated successfully!');
      router.push('/admin/journals');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to update journal');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-academic-navy border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const displayImage = coverImagePreview || existingCoverImage;

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href="/admin/journals"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-academic-navy"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Journals
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Journal</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* Cover Image */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Cover Image</h2>
          
          <div className="space-y-4">
            {displayImage ? (
              <div className="relative">
                <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200">
                  <Image
                    src={displayImage}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                  />
                </div>
          <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
                  <FiX className="w-4 h-4" />
          </button>
                {coverImage && (
                  <p className="text-sm text-green-600 mt-2">
                    New image selected: {coverImage.name}
                  </p>
                )}
          </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-academic-blue hover:bg-academic-blue/5 transition-colors"
              >
                <FiImage className="w-12 h-12 text-gray-400 mb-3" />
                <p className="text-gray-600 font-medium">Click to upload cover image</p>
                <p className="text-sm text-gray-400 mt-1">PNG, JPG up to 5MB</p>
        </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="hidden"
            />

        <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
              <FiUpload className="w-4 h-4" />
              {displayImage ? 'Change Image' : 'Choose File'}
        </button>
      </div>
        </div>

        {/* Journal Details */}
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Journal Details</h2>

          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Journal Title *
              </label>
              <input
                type="text"
              required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
              />
            </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short Title
              </label>
              <input
                type="text"
                value={formData.short_title}
                onChange={(e) => setFormData({ ...formData, short_title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
              />
            </div>
            </div>

          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
              rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue resize-none"
              />
            </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Short Description
            </label>
            <textarea
              rows={2}
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ISSN (Print)
              </label>
              <input
                type="text"
                value={formData.issn_print}
                onChange={(e) => setFormData({ ...formData, issn_print: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ISSN (Online)
              </label>
              <input
                type="text"
                value={formData.issn_online}
                onChange={(e) => setFormData({ ...formData, issn_online: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
              />
            </div>
            </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Editor-in-Chief
              </label>
              <input
                type="text"
                value={formData.editor_in_chief}
                onChange={(e) => setFormData({ ...formData, editor_in_chief: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frequency
              </label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
              >
                <option value="Weekly">Weekly</option>
                <option value="Biweekly">Biweekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Bimonthly">Bimonthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Annually">Annually</option>
              </select>
            </div>
            </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-academic-blue border-gray-300 rounded focus:ring-academic-blue"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-4 h-4 text-academic-blue border-gray-300 rounded focus:ring-academic-blue"
                />
              <span className="text-sm text-gray-700">Featured</span>
              </label>
            </div>
          </div>

        <div className="flex items-center gap-4">
            <button
              type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-academic-navy text-white font-semibold rounded-lg hover:bg-academic-blue transition-colors disabled:opacity-50"
            >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <FiSave className="w-5 h-5" />
                Save Changes
              </>
            )}
            </button>
          <Link
            href="/admin/journals"
            className="px-6 py-3 text-gray-600 font-semibold hover:text-gray-900"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
