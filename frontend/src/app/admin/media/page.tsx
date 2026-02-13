'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  FiImage, FiUpload, FiCopy, FiTrash2, 
  FiFilter, FiCheck, FiFileText, FiExternalLink, FiRefreshCw
} from 'react-icons/fi';
import { journalsApi, volumesApi, articlesApi } from '@/lib/api';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function MediaPage() {
  const queryClient = useQueryClient();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedJournal, setSelectedJournal] = useState('');
  const [selectedVolume, setSelectedVolume] = useState('');
  const [selectedArticle, setSelectedArticle] = useState('');
  
  const [replacing, setReplacing] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadLabel, setUploadLabel] = useState('');
  const [uploadCaption, setUploadCaption] = useState('');

  // 1. Fetch Subjects
  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: journalsApi.subjects,
  });

  // 2. Fetch Journals
  const { data: journals } = useQuery({
    queryKey: ['admin-journals', selectedSubject],
    queryFn: () => journalsApi.adminList({ subjects__slug: selectedSubject || undefined }),
  });

  // 3. Fetch Volumes
  const { data: volumes } = useQuery({
    queryKey: ['admin-volumes', selectedJournal],
    queryFn: () => volumesApi.adminList({ journal: selectedJournal }),
    enabled: !!selectedJournal,
  });

  // 4. Fetch Articles
  const { data: articles } = useQuery({
    queryKey: ['admin-articles', selectedVolume],
    queryFn: () => articlesApi.adminList({ volume: selectedVolume }),
    enabled: !!selectedVolume,
  });

  // 5. Fetch Figures for selected article (Restored for persistence)
  const { data: figures, isLoading: figuresLoading } = useQuery({
    queryKey: ['article-figures', selectedArticle],
    queryFn: () => articlesApi.listFigures(parseInt(selectedArticle)),
    enabled: !!selectedArticle,
  });

  const subjectsList = subjects?.results || subjects || [];
  const journalsList = journals?.results || journals || [];
  const volumesList = volumes?.results || volumes || [];
  const articlesList = articles?.results || articles || [];
  const figuresList = figures || [];

  const handleCopyUrl = (url: string) => {
    // Get absolute URL if relative
    const absoluteUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(absoluteUrl);
    toast.success('URL copied to clipboard!');
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticle || !uploadFile) {
      toast.error('Please select an article and a file');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', uploadFile);
      formData.append('label', uploadLabel);
      formData.append('caption', uploadCaption);

      await articlesApi.uploadFigure(parseInt(selectedArticle), formData);
      toast.success('Figure uploaded successfully!');
      
      // Reset form
      setUploadFile(null);
      setUploadLabel('');
      setUploadCaption('');
      
      // Refresh list
      queryClient.invalidateQueries({ queryKey: ['article-figures', selectedArticle] });
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to upload figure');
    } finally {
      setUploading(false);
    }
  };

  const handleReplace = async (figureId: number, file: File) => {
    setReplacing(figureId);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      await articlesApi.updateFigure(parseInt(selectedArticle), figureId, formData);
      toast.success('Image replaced and URL synced!');
      queryClient.invalidateQueries({ queryKey: ['article-figures', selectedArticle] });
    } catch (error) {
      toast.error('Failed to replace image');
    } finally {
      setReplacing(null);
    }
  };

  const handleDelete = async (figureId: number) => {
    if (!window.confirm('Are you sure you want to delete this figure?')) return;

    try {
      await articlesApi.deleteFigure(parseInt(selectedArticle), figureId);
      toast.success('Figure deleted');
      queryClient.invalidateQueries({ queryKey: ['article-figures', selectedArticle] });
    } catch (error) {
      toast.error('Failed to delete figure');
    }
  };

  return (
    <div className="min-h-screen bg-ivory p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-academic-navy rounded-xl flex items-center justify-center text-white shadow-lg">
            <FiImage className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-black text-gray-900">Media Library</h1>
            <p className="text-gray-500 text-sm">Upload and manage figures for your articles</p>
          </div>
        </div>

        {/* Cascading Selectors */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-50">
            <FiFilter className="text-academic-blue" />
            <h2 className="font-bold text-gray-900">Filter by Article</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Subject */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">1. Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  setSelectedJournal('');
                  setSelectedVolume('');
                  setSelectedArticle('');
                }}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-academic-blue/20 focus:border-academic-blue transition-all"
              >
                <option value="">All Subjects</option>
                {subjectsList.map((s: any) => (
                  <option key={s.id} value={s.slug}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Journal */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">2. Journal</label>
              <select
                value={selectedJournal}
                onChange={(e) => {
                  setSelectedJournal(e.target.value);
                  setSelectedVolume('');
                  setSelectedArticle('');
                }}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-academic-blue/20 focus:border-academic-blue transition-all disabled:opacity-50"
              >
                <option value="">Select Journal</option>
                {journalsList.map((j: any) => (
                  <option key={j.id} value={j.id}>{j.title}</option>
                ))}
              </select>
            </div>

            {/* Volume */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">3. Volume</label>
              <select
                value={selectedVolume}
                onChange={(e) => {
                  setSelectedVolume(e.target.value);
                  setSelectedArticle('');
                }}
                disabled={!selectedJournal}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-academic-blue/20 focus:border-academic-blue transition-all disabled:opacity-50"
              >
                <option value="">Select Volume</option>
                {volumesList.map((v: any) => (
                  <option key={v.id} value={v.id}>Vol. {v.volume_number} ({v.year})</option>
                ))}
              </select>
            </div>

            {/* Article */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">4. Article</label>
              <select
                value={selectedArticle}
                onChange={(e) => setSelectedArticle(e.target.value)}
                disabled={!selectedVolume}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-academic-blue/20 focus:border-academic-blue transition-all disabled:opacity-50"
              >
                <option value="">Select Article</option>
                {articlesList.map((a: any) => (
                  <option key={a.id} value={a.id}>{a.title.length > 60 ? a.title.substring(0, 60) + '...' : a.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {selectedArticle ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden sticky top-8">
                <div className="p-5 bg-gray-50 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900 flex items-center gap-2">
                    <FiUpload className="text-green-600" />
                    Upload New Figure
                  </h2>
                </div>
                <form onSubmit={handleUpload} className="p-6 space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">File *</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                        className="hidden"
                        id="figure-upload"
                      />
                      <label
                        htmlFor="figure-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl hover:border-academic-blue hover:bg-academic-blue/5 cursor-pointer transition-all overflow-hidden"
                      >
                        {uploadFile ? (
                          <div className="text-center p-4">
                            <FiCheck className="w-8 h-8 text-green-500 mx-auto mb-2" />
                            <p className="text-xs font-bold text-gray-900 truncate max-w-full px-2">
                              {uploadFile.name}
                            </p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <FiImage className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-xs font-bold text-gray-500">Click to choose image</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Label (e.g. Figure 1)</label>
                    <input
                      type="text"
                      value={uploadLabel}
                      onChange={(e) => setUploadLabel(e.target.value)}
                      placeholder="Figure 1"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-academic-blue/20 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Caption</label>
                    <textarea
                      value={uploadCaption}
                      onChange={(e) => setUploadCaption(e.target.value)}
                      placeholder="Brief description of the figure..."
                      rows={3}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-academic-blue/20 transition-all text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={uploading || !uploadFile}
                    className="w-full py-3 bg-academic-navy text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-academic-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {uploading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <FiUpload />
                        Upload Figure
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Figures List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden min-h-[600px]">
                <div className="p-5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-bold text-gray-900 flex items-center gap-2">
                    <FiImage className="text-academic-navy" />
                    Article Figures
                  </h2>
                  <span className="bg-academic-navy text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    {figuresList.length} Total
                  </span>
                </div>

                {figuresLoading ? (
                  <div className="flex flex-col items-center justify-center py-24">
                    <div className="animate-spin w-10 h-10 border-4 border-academic-navy border-t-transparent rounded-full mb-4"></div>
                    <p className="text-gray-400 font-medium">Loading figures...</p>
                  </div>
                ) : figuresList.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
                    {figuresList.map((fig: any) => (
                      <div key={fig.id} className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden group">
                        {/* Image Preview */}
                        <div className="relative aspect-video bg-gray-200 flex items-center justify-center overflow-hidden">
                        {fig.image_url ? (
                          <Image
                            src={fig.image_url}
                            alt={fig.label}
                            fill
                            className="object-contain transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <FiImage className="w-8 h-8 text-gray-300" />
                          </div>
                        )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <label className="p-2.5 bg-white text-academic-blue rounded-full hover:bg-blue-50 cursor-pointer transition-colors" title="Replace Image">
                              {replacing === fig.id ? (
                                <FiRefreshCw className="w-5 h-5 animate-spin" />
                              ) : (
                                <FiUpload className="w-5 h-5" />
                              )}
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleReplace(fig.id, file);
                                }}
                              />
                            </label>
                            <button
                              onClick={() => handleCopyUrl(fig.image_url)}
                              className="p-2.5 bg-white text-gray-900 rounded-full hover:bg-academic-gold transition-colors"
                              title="Copy Image URL"
                            >
                              <FiCopy className="w-5 h-5" />
                            </button>
                            <a
                              href={fig.image_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2.5 bg-white text-gray-900 rounded-full hover:bg-academic-blue hover:text-white transition-colors"
                              title="Open Original"
                            >
                              <FiExternalLink className="w-5 h-5" />
                            </a>
                            <button
                              onClick={() => handleDelete(fig.id)}
                              className="p-2.5 bg-white text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-colors"
                              title="Delete"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Figure Details */}
                        <div className="p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-bold text-gray-900 leading-tight">{fig.label}</h4>
                              <p className="text-[10px] text-gray-400 font-medium">{fig.original_filename}</p>
                            </div>
                          </div>
                          
                          {/* Copy URL Input */}
                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block">Figure URL (for XML)</label>
                            <div className="flex gap-1">
                              <input
                                type="text"
                                readOnly
                                value={fig.image_url}
                                className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-mono text-gray-600"
                              />
                              <button
                                onClick={() => handleCopyUrl(fig.image_url)}
                                className="p-2 bg-academic-navy text-white rounded-lg hover:bg-academic-blue transition-colors"
                              >
                                <FiCopy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-32 text-center px-6">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <FiImage className="w-10 h-10 text-gray-200" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">No Figures Found</h3>
                    <p className="text-gray-500 text-sm max-w-xs mx-auto">
                      Start by selecting an article and uploading its figures using the form on the left.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-dashed border-gray-300 p-24 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiFileText className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-xl font-serif font-black text-gray-900 mb-2">Select an Article to Manage Media</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              Choose a subject, journal, volume, and article from the filters above to view and upload its figures.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

