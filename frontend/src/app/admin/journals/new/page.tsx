'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { FiArrowLeft, FiSave, FiUpload, FiX, FiImage, FiFileText } from 'react-icons/fi';
import { journalsApi } from '@/lib/api';
import toast from 'react-hot-toast';
import RichTextEditor from '@/components/admin/RichTextEditor';

export default function NewJournalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [flyerFile, setFlyerFile] = useState<File | null>(null);
  const [editorImage, setEditorImage] = useState<File | null>(null);
  const [editorImagePreview, setEditorImagePreview] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const flyerInputRef = useRef<HTMLInputElement>(null);
  const editorImageInputRef = useRef<HTMLInputElement>(null);
  
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
    aims_and_scope: '',
    indexing: '',
    open_thematic_issue: '',
    submission_url: '',
  });

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
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

  const handleFlyerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size should be less than 10MB');
        return;
      }
      setFlyerFile(file);
    }
  };

  const handleEditorImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error('Image size should be less than 2MB');
        return;
      }
      setEditorImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditorImagePreview(reader.result as string);
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

  // Fetch subjects
  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: journalsApi.subjects,
  });

  const subjectsList = subjects?.results || subjects || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSubject) {
      toast.error('Please select a subject');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, String(value));
      });
      
      submitData.append('subjects', selectedSubject);
      
      if (coverImage) {
        submitData.append('cover_image', coverImage);
      }
      if (flyerFile) {
        submitData.append('flyer_pdf', flyerFile);
      }
      if (editorImage) {
        submitData.append('editor_in_chief_image', editorImage);
      }

      await journalsApi.createWithImage(submitData);
      toast.success('Journal created successfully!');
      router.push('/admin/journals');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to create journal');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

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

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Journal</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* Step 1: Select Subject */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Step 1: Select Subject</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue"
            >
              <option value="">-- Select Subject --</option>
              {subjectsList.map((subject: any) => (
                <option key={subject.id} value={subject.id}>{subject.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Step 2: Cover Image */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Step 2: Journal Cover Image</h2>
          <div className="space-y-4">
            {coverImagePreview ? (
              <div className="relative">
                <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200">
                  <Image src={coverImagePreview} alt="Cover preview" fill className="object-cover" />
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-academic-blue hover:bg-academic-blue/5"
              >
                <FiImage className="w-12 h-12 text-gray-400 mb-3" />
                <p className="text-gray-600 font-medium">Click to upload cover image</p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        {/* Step 3: Journal Content */}
        <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Step 3: Journal Content</h2>
          <RichTextEditor
            label="About Journal"
            value={formData.description}
            onChange={(content) => setFormData({ ...formData, description: content })}
            placeholder="Full journal description..."
          />
          <RichTextEditor
            label="Aims and Scope"
            value={formData.aims_and_scope}
            onChange={(content) => setFormData({ ...formData, aims_and_scope: content })}
            placeholder="Describe the aims and scope..."
          />
          <RichTextEditor
            label="Indexing"
            value={formData.indexing}
            onChange={(content) => setFormData({ ...formData, indexing: content })}
            placeholder="Detail the indexing services..."
          />
          <RichTextEditor
            label="Open Thematic Issue"
            value={formData.open_thematic_issue}
            onChange={(content) => setFormData({ ...formData, open_thematic_issue: content })}
            placeholder="Information about thematic issues..."
          />
        </div>

        {/* Step 4: Actions & Files */}
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Step 4: Actions & Files</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Submission URL</label>
            <input
              type="url"
              value={formData.submission_url}
              onChange={(e) => setFormData({ ...formData, submission_url: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Journal Flyer (PDF)</label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                ref={flyerInputRef}
                onChange={handleFlyerSelect}
                accept="application/pdf"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => flyerInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <FiFileText className="w-4 h-4" />
                Upload PDF
              </button>
              {flyerFile && (
                <span className="text-sm text-blue-500 font-medium">{flyerFile.name}</span>
              )}
            </div>
          </div>
        </div>

        {/* Step 5: Meta Information */}
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Step 5: Meta Information</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Journal Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => {
                setFormData({ 
                  ...formData, 
                  title: e.target.value,
                  slug: generateSlug(e.target.value)
                });
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug *</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue"
              >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Annually">Annually</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Editor-in-Chief</label>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={formData.editor_in_chief}
                onChange={(e) => setFormData({ ...formData, editor_in_chief: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue"
                placeholder="Enter name..."
              />
              <div className="relative group">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 bg-white">
                  {editorImagePreview ? (
                    <Image src={editorImagePreview} alt="Editor Preview" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <FiImage className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => editorImageInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 rounded-full transition-opacity"
                >
                  <FiUpload className="w-4 h-4" />
                </button>
                <input
                  type="file"
                  ref={editorImageInputRef}
                  onChange={handleEditorImageSelect}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-academic-blue rounded"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-4 h-4 text-academic-blue rounded"
              />
              <span className="text-sm text-gray-700">Featured</span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-academic-navy text-white font-semibold rounded-lg hover:bg-academic-blue disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Journal'}
          </button>
          <Link href="/admin/journals" className="px-6 py-3 text-gray-600 font-semibold">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
