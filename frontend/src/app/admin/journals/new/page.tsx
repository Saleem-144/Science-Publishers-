'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { FiArrowLeft, FiSave, FiUpload, FiX, FiImage, FiFileText, FiCheckCircle, FiPlus, FiShield, FiInfo } from 'react-icons/fi';
import { journalsApi } from '@/lib/api';
import toast from 'react-hot-toast';
import RichTextEditor from '@/components/admin/RichTextEditor';

export default function NewJournalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);
  const [flyerFile, setFlyerFile] = useState<File | null>(null);
  const [editorImage, setEditorImage] = useState<File | null>(null);
  const [editorImagePreview, setEditorImagePreview] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
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
    open_thematic_issue: '',
    submission_url: '',
    login_url: '',
    primary_color: '#1a365d',
    secondary_color: '#2b6cb0',
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

  const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      setBannerImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerImagePreview(reader.result as string);
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

  const handleRemoveBanner = () => {
    setBannerImage(null);
    setBannerImagePreview(null);
    if (bannerInputRef.current) {
      bannerInputRef.current.value = '';
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
      
      // Append all form data except files and read-only fields
      Object.entries(formData).forEach(([key, value]) => {
        // Skip file fields
        if (['cover_image', 'banner_image', 'logo', 'favicon', 'editor_in_chief_image', 'flyer_pdf'].includes(key)) {
          return;
        }
        submitData.append(key, String(value));
      });
      
      submitData.append('subject_ids', selectedSubject); 
      
      if (coverImage) {
        submitData.append('cover_image', coverImage);
      }
      if (bannerImage) {
        submitData.append('banner_image', bannerImage);
      }
      if (flyerFile) {
        submitData.append('flyer_pdf', flyerFile);
      }
      if (editorImage) {
        submitData.append('editor_in_chief_image', editorImage);
      }

      const response = await journalsApi.createWithImage(submitData);
      toast.success('Journal created successfully!');
      
      // Redirect to the edit page so they can add board members and indexing
      if (response && response.id) {
        router.push(`/admin/journals/${response.id}`);
      } else {
      router.push('/admin/journals');
      }
    } catch (error: any) {
      console.error('Journal creation error:', error.response?.data);
      const errors = error.response?.data;
      if (errors && typeof errors === 'object') {
        const firstError = Object.entries(errors)[0];
        if (firstError) {
          const [field, message] = firstError;
          toast.error(`${field}: ${Array.isArray(message) ? message[0] : message}`);
        } else {
          toast.error('Failed to create journal');
        }
      } else {
        toast.error(error.response?.data?.detail || 'Failed to create journal');
      }
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
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Link
          href="/admin/journals"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-academic-navy"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Journals
        </Link>
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2 bg-academic-navy text-white font-bold rounded-lg hover:bg-academic-blue transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? <FiSave className="animate-spin" /> : <FiSave />}
            Create Journal
          </button>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">Create New Journal</h1>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column - Main Content & Rich Text (8/12) */}
        <div className="xl:col-span-8 space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-8">
            <h2 className="text-xl font-bold text-gray-900 border-l-4 border-academic-blue pl-4">Journal Content</h2>
            
            <RichTextEditor
              label="About Journal"
              value={formData.description}
              onChange={(content) => setFormData({ ...formData, description: content })}
              placeholder="Enter the full description or About section..."
            />

            <RichTextEditor
              label="Aims and Scope"
              value={formData.aims_and_scope}
              onChange={(content) => setFormData({ ...formData, aims_and_scope: content })}
              placeholder="Describe the aims and scope of the journal..."
            />

            <RichTextEditor
              label="Open Thematic Issue"
              value={formData.open_thematic_issue}
              onChange={(content) => setFormData({ ...formData, open_thematic_issue: content })}
              placeholder="Information about open thematic issues..."
            />
          </div>

          {/* Placeholder for Editorial Board and Indexing */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 space-y-4">
            <div className="flex items-center gap-3 text-blue-700">
              <FiInfo className="w-6 h-6" />
              <h2 className="text-xl font-bold">Additional Sections</h2>
            </div>
            <p className="text-blue-600">
              The <strong>Editorial Board Members</strong> and <strong>Journal Indexing</strong> sections will be available 
              immediately after you create the journal. 
            </p>
            <p className="text-sm text-blue-500">
              Once you click "Create Journal", you will be redirected to the full management page where you can add members and indexing services.
            </p>
          </div>
        </div>

        {/* Right Column - Media & Meta (4/12) */}
        <div className="xl:col-span-4 space-y-8">
          {/* Subject Selection */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiCheckCircle className="text-academic-blue" /> Primary Category
          </h2>
          <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Select Subject *</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-academic-blue focus:bg-white transition-all font-medium"
            >
                <option value="">-- Choose Subject --</option>
              {subjectsList.map((subject: any) => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
              ))}
            </select>
          </div>
        </div>

          {/* Cover Image */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiImage className="text-academic-blue" /> Cover Image
          </h2>
          
          <div className="space-y-4">
            {coverImagePreview ? (
                <div className="relative group">
                  <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border-2 border-gray-100 shadow-inner">
                  <Image
                    src={coverImagePreview}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-[3/4] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-academic-blue hover:bg-academic-blue/5 transition-all group"
              >
                  <div className="p-4 rounded-full bg-gray-50 group-hover:bg-academic-blue/10 transition-colors mb-3">
                    <FiUpload className="w-8 h-8 text-gray-400 group-hover:text-academic-blue" />
                  </div>
                  <p className="text-gray-600 font-bold">Upload Cover</p>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">PNG, JPG up to 5MB</p>
              </div>
            )}

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
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-semibold hover:bg-white transition-colors"
        >
                <FiUpload /> {coverImagePreview ? 'Change Cover' : 'Choose Cover File'}
        </button>
      </div>
        </div>

          {/* Banner Image */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiImage className="text-academic-gold" /> Hero Banner Image
            </h2>
            
            <div className="space-y-4">
              {bannerImagePreview ? (
                <div className="relative group">
                  <div className="relative h-32 w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                    <Image 
                      src={bannerImagePreview} 
                      alt="Banner Preview" 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveBanner}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => bannerInputRef.current?.click()}
                  className="w-full h-32 flex flex-col items-center justify-center gap-2 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-academic-gold hover:bg-academic-gold/5 transition-all"
                >
                  <FiUpload className="w-8 h-8" />
                  <span className="text-xs font-bold uppercase tracking-widest">Upload Banner</span>
                  <span className="text-[10px]">1920x400 recommended</span>
                </button>
              )}
              <input
                type="file"
                ref={bannerInputRef}
                onChange={handleBannerSelect}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          {/* Meta Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <FiCheckCircle className="text-green-500" /> Meta Information
          </h2>

            <div className="space-y-4">
          <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Journal Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => {
                    const newTitle = e.target.value;
                setFormData({ 
                  ...formData, 
                      title: newTitle,
                      slug: generateSlug(newTitle)
                });
              }}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-academic-blue focus:bg-white transition-all font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Short Title</label>
              <input
                type="text"
                value={formData.short_title}
                onChange={(e) => setFormData({ ...formData, short_title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-academic-blue focus:bg-white transition-all"
              />
            </div>
            <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">URL Slug *</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-academic-blue focus:bg-white transition-all font-mono text-sm"
              />
            </div>
          </div>

          <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Short Description</label>
            <textarea
                  rows={3}
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-academic-blue focus:bg-white transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">ISSN (Print)</label>
              <input
                type="text"
                value={formData.issn_print}
                onChange={(e) => setFormData({ ...formData, issn_print: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-academic-blue focus:bg-white transition-all font-mono"
              />
            </div>
            <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">ISSN (Online)</label>
              <input
                type="text"
                value={formData.issn_online}
                onChange={(e) => setFormData({ ...formData, issn_online: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-academic-blue focus:bg-white transition-all font-mono"
              />
            </div>
          </div>

            <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Editor-in-Chief</label>
                <div className="flex items-center gap-4">
              <input
                type="text"
                value={formData.editor_in_chief}
                onChange={(e) => setFormData({ ...formData, editor_in_chief: e.target.value })}
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-academic-blue focus:bg-white transition-all font-medium"
                    placeholder="Enter name..."
                  />
                  <div className="relative group">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 bg-white">
                      {editorImagePreview ? (
                        <Image
                          src={editorImagePreview}
                          alt="Editor Avatar"
                          fill
                          className="object-cover"
                        />
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

              <div className="grid grid-cols-2 gap-4">
            <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Frequency</label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-academic-blue focus:bg-white transition-all"
              >
                <option value="Monthly">Monthly</option>
                    <option value="Bi-monthly">Bi-monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Annually">Annually</option>
              </select>
            </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Publisher</label>
                  <input
                    type="text"
                    value={formData.publisher}
                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-academic-blue focus:bg-white transition-all"
                  />
                </div>
          </div>

              <div className="flex items-center gap-6 p-2 bg-gray-50 rounded-xl border border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-academic-blue border-gray-300 rounded focus:ring-academic-blue"
              />
                  <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Active</span>
            </label>
                <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-4 h-4 text-academic-blue border-gray-300 rounded focus:ring-academic-blue"
              />
                  <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Featured</span>
            </label>
          </div>
        </div>
          </div>

          {/* Action Buttons & Files */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <FiFileText className="text-academic-gold" /> Submissions & Files
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                  <FiPlus className="w-3 h-3" /> Submission URL
                </label>
                <input
                  type="url"
                  value={formData.submission_url}
                  onChange={(e) => setFormData({ ...formData, submission_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-academic-blue focus:bg-white transition-all font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                  <FiPlus className="w-3 h-3" /> Login URL
                </label>
                <input
                  type="url"
                  value={formData.login_url}
                  onChange={(e) => setFormData({ ...formData, login_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-academic-blue focus:bg-white transition-all font-mono text-sm"
                />
              </div>

              <div className="pt-2 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Journal Flyer (PDF)</label>
                <div className="flex flex-col gap-3 mt-2">
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
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-gray-600 font-bold hover:border-academic-blue hover:bg-academic-blue/5 transition-all"
                  >
                    <FiFileText className="w-5 h-5" />
                    {flyerFile ? 'Change PDF' : 'Upload PDF Flyer'}
                  </button>
                  {flyerFile && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-xl">
                      <div className="flex items-center gap-2">
                        <FiFileText className="text-blue-500 w-5 h-5" />
                        <span className="text-sm font-bold text-blue-700 truncate max-w-[200px]">
                          {flyerFile.name}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Branding Colors */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <FiShield className="text-academic-blue" /> Branding Colors
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Primary Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.primary_color}
                    onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                    className="w-10 h-10 border-0 p-0 rounded-lg overflow-hidden cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.primary_color}
                    onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Secondary Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.secondary_color}
                    onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                    className="w-10 h-10 border-0 p-0 rounded-lg overflow-hidden cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.secondary_color}
                    onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
