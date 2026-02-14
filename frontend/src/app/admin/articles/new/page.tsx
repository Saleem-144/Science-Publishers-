'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { FiArrowLeft, FiSave, FiCheck, FiUpload, FiFile } from 'react-icons/fi';
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
  const [isSpecialIssue, setIsSpecialIssue] = useState(false);

  // Article form data
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    abstract: '',
    keywords: '', // SEO Keywords
    doi: '',
    status: 'draft',
    article_id_code: '',
    license_text: 'CC BY License',
    cite_as: '',
    received_date: '',
    revised_date: '',
    accepted_date: '',
    published_date: '',
  });

  // File states
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    xml_file: null,
    pdf_file: null,
    epub_file: null,
    prc_file: null,
    mobi_file: null,
    ris_file: null,
    bib_file: null,
    endnote_file: null,
  });

  // Fetch subjects
  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: journalsApi.subjects,
  });

  // Fetch journals
  const { data: journals } = useQuery({
    queryKey: ['journals'],
    queryFn: () => journalsApi.list({ page: 1 }),
  });

  // Fetch volumes for selected journal
  const { data: volumes } = useQuery({
    queryKey: ['volumes-by-journal', selectedJournal],
    queryFn: () => volumesApi.listByJournal(selectedJournal),
    enabled: !!selectedJournal && !isSpecialIssue,
  });

  // Fetch issues for selected volume
  const { data: issues } = useQuery({
    queryKey: ['issues-by-volume', selectedVolume],
    queryFn: () => issuesApi.listByVolume(parseInt(selectedVolume)),
    enabled: !!selectedVolume && hasIssue && !isSpecialIssue,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files[0]) {
      setFiles({ ...files, [fieldName]: e.target.files[0] });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedJournal) {
      toast.error('Please select a journal');
      return;
    }

    if (!isSpecialIssue && !selectedVolume) {
      toast.error('Please select a volume or mark as Special Issue');
      return;
    }

    if (!isSpecialIssue && hasIssue && !selectedIssue) {
      toast.error('Please select an issue or uncheck "Related to Issue"');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      
      // Basic info - handle optional title/slug when XML is present
      const finalFormData = { ...formData };
      if (files.xml_file && !finalFormData.title) {
        finalFormData.title = 'Processing Title from XML...';
      }
      if (files.xml_file && !finalFormData.slug) {
        finalFormData.slug = `processing-slug-${Date.now()}`;
      }

      Object.entries(finalFormData).forEach(([key, value]) => {
        data.append(key, value);
      });

      // Relationships
      const journalObj = journalsList.find((j: any) => j.slug === selectedJournal);
      if (journalObj) data.append('journal', journalObj.id.toString());
      
      if (!isSpecialIssue) {
        if (selectedVolume) data.append('volume', selectedVolume);
        if (hasIssue && selectedIssue) data.append('issue', selectedIssue);
      }
      
      data.append('is_special_issue', String(isSpecialIssue));

      // Files
      Object.entries(files).forEach(([key, file]) => {
        if (file) data.append(key, file);
      });

      await articlesApi.createWithFiles(data);
      toast.success('Article created successfully!');
      router.push('/admin/articles');
    } catch (error: any) {
      console.error('Error creating article:', error);
      toast.error(error.response?.data?.detail || 'Failed to create article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Link
          href="/admin/articles"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-academic-navy"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Articles
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Article</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
        {/* Step 1: Select Location */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-academic-navy text-white text-xs flex items-center justify-center rounded-full">1</span>
              Publication Details
          </h2>
          
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {/* Special Issue Checkbox */}
              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <input
                  type="checkbox"
                  id="isSpecialIssue"
                  checked={isSpecialIssue}
                  onChange={(e) => {
                    setIsSpecialIssue(e.target.checked);
                    if (e.target.checked) {
                      setSelectedVolume('');
                      setSelectedIssue('');
                      setHasIssue(false);
                    }
                  }}
                  disabled={!selectedJournal}
                  className="w-4 h-4 text-academic-blue border-gray-300 rounded focus:ring-academic-blue"
                />
                <label htmlFor="isSpecialIssue" className="text-sm font-medium text-blue-900">
                  Is this a Special Issue? (Ticking this will bypass Volume and Issue selection)
                </label>
              </div>

              {!isSpecialIssue && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Volume */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Volume *
              </label>
              <select
                value={selectedVolume}
                onChange={(e) => handleVolumeChange(e.target.value)}
                disabled={!selectedJournal}
                      required={!isSpecialIssue}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue disabled:bg-gray-100"
              >
                <option value="">-- Select Volume --</option>
                {volumesList.map((volume: any) => (
                  <option key={volume.id} value={volume.id}>
                          Volume {volume.volume_number} ({volume.year})
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
                            Issue {issue.issue_number} {issue.title ? `- ${issue.title}` : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
              )}

          {/* Selection Summary */}
              {selectedJournal && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <FiCheck className="w-4 h-4" />
                <span className="text-sm font-medium">
                      Publishing to: {journalsList.find((j: any) => j.slug === selectedJournal)?.title}
                      {isSpecialIssue ? ' (Special Issue)' : (
                        <>
                          {selectedVolume && ` → Volume ${volumesList.find((v: any) => v.id === parseInt(selectedVolume))?.volume_number}`}
                          {hasIssue && selectedIssue && ` → Issue ${issuesList.find((i: any) => i.id === parseInt(selectedIssue))?.issue_number}`}
                        </>
                      )}
                </span>
              </div>
            </div>
          )}
            </div>
        </div>

          {/* Step 2: Article Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-academic-navy text-white text-xs flex items-center justify-center rounded-full">2</span>
              Article Content
          </h2>

          <div className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                  Article Title {files.xml_file ? '(Optional if XML uploaded)' : '*'}
              </label>
              <input
                type="text"
                  required={!files.xml_file}
                value={formData.title}
                onChange={(e) => {
                  setFormData({ 
                    ...formData, 
                    title: e.target.value,
                    slug: generateSlug(e.target.value)
                  });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
                  placeholder={files.xml_file ? "Optional - will be fetched from XML" : "Enter article title"}
              />
                {files.xml_file && (
                  <p className="mt-1 text-xs text-blue-600 font-medium">
                    Auto-fetching from XML enabled.
                  </p>
                )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Slug {files.xml_file ? '(Optional if XML uploaded)' : '*'}
              </label>
              <input
                type="text"
                  required={!files.xml_file}
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
                  placeholder={files.xml_file ? "Optional - will be generated from XML title" : "article-slug"}
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

              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                    Keywords (SEO - Backend)
              </label>
                  <textarea
                    rows={2}
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
                    placeholder="Enter keywords for SEO (JSON format internally)..."
              />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                License / Copyright Text
              </label>
              <textarea
                value={formData.license_text}
                onChange={(e) => setFormData({ ...formData, license_text: e.target.value })}
                rows={3}
                placeholder="Enter license or copyright info. HTML links are supported."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cite As (Custom Text)
              </label>
              <textarea
                value={formData.cite_as}
                onChange={(e) => setFormData({ ...formData, cite_as: e.target.value })}
                rows={3}
                placeholder="Enter custom citation text. If empty, a default will be generated."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
              />
            </div>
          </div>
          </div>

          {/* Step 3: Date Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-academic-navy text-white text-xs flex items-center justify-center rounded-full">3</span>
              Date Information
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Received Date</label>
                  <input
                    type="date"
                    value={formData.received_date}
                    onChange={(e) => setFormData({ ...formData, received_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Revised Date</label>
                  <input
                    type="date"
                    value={formData.revised_date}
                    onChange={(e) => setFormData({ ...formData, revised_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Accepted Date</label>
                  <input
                    type="date"
                    value={formData.accepted_date}
                    onChange={(e) => setFormData({ ...formData, accepted_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Published Date</label>
                  <input
                    type="date"
                    value={formData.published_date}
                    onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* File Uploads */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiUpload className="w-5 h-5 text-academic-blue" />
              File Attachments
            </h2>
            
            <div className="space-y-4">
              {/* XML File */}
              <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-academic-blue transition-colors bg-gray-50/50">
                <label className="block cursor-pointer">
                  <span className="block text-sm font-medium text-gray-700 mb-2">XML File (Source for Parsing)</span>
                  <div className="flex items-center gap-3">
                    <FiFile className={`w-8 h-8 ${files.xml_file ? 'text-green-500' : 'text-gray-400'}`} />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs text-gray-500 truncate">
                        {files.xml_file ? files.xml_file.name : 'Click to upload XML'}
                      </p>
                      <input
                        type="file"
                        accept=".xml"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, 'xml_file')}
                      />
                    </div>
                  </div>
                </label>
              </div>

              {/* PDF File */}
              <div className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
                <label className="block cursor-pointer">
                  <span className="block text-sm font-medium text-gray-700 mb-2">PDF Document</span>
                  <input
                    type="file"
                    accept=".pdf"
                    className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    onChange={(e) => handleFileChange(e, 'pdf_file')}
                  />
                </label>
              </div>

              {/* ePUB File */}
              <div className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
                <label className="block cursor-pointer">
                  <span className="block text-sm font-medium text-gray-700 mb-2">ePUB File</span>
                  <input
                    type="file"
                    accept=".epub"
                    className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    onChange={(e) => handleFileChange(e, 'epub_file')}
                  />
                </label>
              </div>

              {/* PRC File */}
              <div className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
                <label className="block cursor-pointer">
                  <span className="block text-sm font-medium text-gray-700 mb-2">PRC File</span>
                  <input
                    type="file"
                    accept=".prc"
                    className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    onChange={(e) => handleFileChange(e, 'prc_file')}
                  />
                </label>
              </div>

              {/* Mobi File */}
              <div className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
                <label className="block cursor-pointer">
                  <span className="block text-sm font-medium text-gray-700 mb-2">Mobi File</span>
                  <input
                    type="file"
                    accept=".mobi"
                    className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    onChange={(e) => handleFileChange(e, 'mobi_file')}
                  />
                </label>
              </div>

              {/* RIS Citation File */}
              <div className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
                <label className="block cursor-pointer">
                  <span className="block text-sm font-medium text-gray-700 mb-2">RIS Citation (.ris)</span>
                  <input
                    type="file"
                    accept=".ris"
                    className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    onChange={(e) => handleFileChange(e, 'ris_file')}
                  />
                </label>
              </div>

              {/* BibTeX Citation File */}
              <div className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
                <label className="block cursor-pointer">
                  <span className="block text-sm font-medium text-gray-700 mb-2">BibTeX Citation (.bib)</span>
                  <input
                    type="file"
                    accept=".bib"
                    className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    onChange={(e) => handleFileChange(e, 'bib_file')}
                  />
                </label>
              </div>

              {/* EndNote Citation File */}
              <div className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
                <label className="block cursor-pointer">
                  <span className="block text-sm font-medium text-gray-700 mb-2">EndNote Citation (.enw)</span>
                  <input
                    type="file"
                    accept=".enw"
                    className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    onChange={(e) => handleFileChange(e, 'endnote_file')}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Action Card */}
          <div className="bg-academic-navy rounded-xl shadow-lg p-6 text-white sticky top-6">
            <h3 className="font-semibold mb-4">Finalize Article</h3>
            <p className="text-xs text-white mb-6">
              Ensure all required fields marked with (*) are filled correctly. Files can be updated later.
            </p>
            <div className="space-y-3">
          <button
            type="submit"
                disabled={loading || !selectedJournal || (!isSpecialIssue && !selectedVolume)}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-academic-navy font-bold rounded-lg hover:bg-academic-blue hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-academic-navy"
          >
            {loading ? (
              <>
                    <div className="w-5 h-5 border-2 border-academic-navy/30 border-t-academic-navy rounded-full animate-spin"></div>
                    Processing...
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
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
          >
            Cancel
          </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
