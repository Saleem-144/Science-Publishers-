'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { FiArrowLeft, FiSave, FiCheck } from 'react-icons/fi';
import { journalsApi, volumesApi, issuesApi, articlesApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function NewArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Cascading selections
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedJournal, setSelectedJournal] = useState('');
  const [selectedVolume, setSelectedVolume] = useState('');
  const [hasIssue, setHasIssue] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState('');

  // Article form data
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    abstract: '',
    keywords: '',
    doi: '',
    status: 'draft',
  });

  // Fetch subjects
  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: journalsApi.subjects,
  });

  // Fetch journals filtered by subject
  const { data: journals } = useQuery({
    queryKey: ['journals-by-subject', selectedSubject],
    queryFn: () => journalsApi.list({ subject: selectedSubject || undefined }),
    enabled: !!selectedSubject,
  });

  // Fetch volumes for selected journal
  const { data: volumes } = useQuery({
    queryKey: ['volumes-by-journal', selectedJournal],
    queryFn: () => volumesApi.listByJournal(selectedJournal),
    enabled: !!selectedJournal,
  });

  // Fetch issues for selected volume
  const { data: issues } = useQuery({
    queryKey: ['issues-by-volume', selectedVolume],
    queryFn: () => issuesApi.listByVolume(parseInt(selectedVolume)),
    enabled: !!selectedVolume && hasIssue,
  });

  const subjectsList = subjects?.results || subjects || [];
  const journalsList = journals?.results || journals || [];
  const volumesList = volumes?.results || volumes || [];
  const issuesList = issues?.results || issues || [];

  // Filter journals by selected subject
  const filteredJournals = selectedSubject
    ? journalsList.filter((j: any) => 
        j.subjects?.some((s: any) => s.slug === selectedSubject)
      )
    : journalsList;

  // Reset cascading selections when parent changes
  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
    setSelectedJournal('');
    setSelectedVolume('');
    setSelectedIssue('');
  };

  const handleJournalChange = (value: string) => {
    setSelectedJournal(value);
    setSelectedVolume('');
    setSelectedIssue('');
  };

  const handleVolumeChange = (value: string) => {
    setSelectedVolume(value);
    setSelectedIssue('');
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedVolume) {
      toast.error('Please select subject, journal, and volume');
      return;
    }

    if (hasIssue && !selectedIssue) {
      toast.error('Please select an issue or uncheck "Related to Issue"');
      return;
    }

    setLoading(true);

    try {
      const articleData = {
        ...formData,
        issue: hasIssue ? parseInt(selectedIssue) : null,
        volume: !hasIssue ? parseInt(selectedVolume) : null, // If no issue, attach to volume directly
      };

      await articlesApi.create(articleData);
      toast.success('Article created successfully!');
      router.push('/admin/articles');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to create article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href="/admin/articles"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-academic-navy"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Articles
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Article</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        {/* Step 1: Select Location */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Step 1: Select Where to Publish
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
              >
                <option value="">-- Select Subject --</option>
                {subjectsList.map((subject: any) => (
                  <option key={subject.id} value={subject.slug}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Journal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Journal *
              </label>
              <select
                value={selectedJournal}
                onChange={(e) => handleJournalChange(e.target.value)}
                disabled={!selectedSubject}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue disabled:bg-gray-100"
              >
                <option value="">-- Select Journal --</option>
                {filteredJournals.map((journal: any) => (
                  <option key={journal.id} value={journal.slug}>
                    {journal.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Volume */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Volume *
              </label>
              <select
                value={selectedVolume}
                onChange={(e) => handleVolumeChange(e.target.value)}
                disabled={!selectedJournal}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue disabled:bg-gray-100"
              >
                <option value="">-- Select Volume --</option>
                {volumesList.map((volume: any) => (
                  <option key={volume.id} value={volume.id}>
                    Volume {volume.number} ({volume.year})
                  </option>
                ))}
              </select>
            </div>

            {/* Issue Checkbox & Dropdown */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <input
                  type="checkbox"
                  id="hasIssue"
                  checked={hasIssue}
                  onChange={(e) => {
                    setHasIssue(e.target.checked);
                    if (!e.target.checked) setSelectedIssue('');
                  }}
                  disabled={!selectedVolume}
                  className="w-4 h-4 text-academic-blue border-gray-300 rounded focus:ring-academic-blue"
                />
                <label htmlFor="hasIssue" className="text-sm font-medium text-gray-700">
                  Related to Issue?
                </label>
              </div>
              {hasIssue && (
                <select
                  value={selectedIssue}
                  onChange={(e) => setSelectedIssue(e.target.value)}
                  disabled={!selectedVolume}
                  required={hasIssue}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue disabled:bg-gray-100"
                >
                  <option value="">-- Select Issue --</option>
                  {issuesList.map((issue: any) => (
                    <option key={issue.id} value={issue.id}>
                      Issue {issue.number} {issue.title ? `- ${issue.title}` : ''}
                    </option>
                  ))}
                </select>
              )}
              {hasIssue && issuesList.length === 0 && selectedVolume && (
                <p className="text-sm text-orange-600 mt-1">
                  No issues found. <Link href="/admin/issues" className="underline">Create an issue first</Link>
                </p>
              )}
            </div>
          </div>

          {/* Selection Summary */}
          {selectedVolume && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <FiCheck className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Publishing to: {filteredJournals.find((j: any) => j.slug === selectedJournal)?.title} → 
                  Volume {volumesList.find((v: any) => v.id === parseInt(selectedVolume))?.number}
                  {hasIssue && selectedIssue && ` → Issue ${issuesList.find((i: any) => i.id === parseInt(selectedIssue))?.number}`}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Article Details */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Step 2: Article Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Article Title *
              </label>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
                placeholder="Enter article title"
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
                placeholder="article-slug"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DOI
              </label>
              <input
                type="text"
                value={formData.doi}
                onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
                placeholder="10.1234/example.2024.001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Abstract
              </label>
              <textarea
                rows={6}
                value={formData.abstract}
                onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue resize-none"
                placeholder="Enter article abstract..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Keywords
              </label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
                placeholder="Comma-separated keywords"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
              >
                <option value="draft">Draft</option>
                <option value="review">Under Review</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading || !selectedVolume}
            className="inline-flex items-center gap-2 px-6 py-3 bg-academic-navy text-white font-semibold rounded-lg hover:bg-academic-blue transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Creating...
              </>
            ) : (
              <>
                <FiSave className="w-5 h-5" />
                Create Article
              </>
            )}
          </button>
          <Link
            href="/admin/articles"
            className="px-6 py-3 text-gray-600 font-semibold hover:text-gray-900"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
