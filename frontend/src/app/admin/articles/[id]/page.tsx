'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { FiArrowLeft, FiSave, FiCheck, FiUpload, FiFile, FiExternalLink } from 'react-icons/fi';
import { articlesApi, journalsApi, volumesApi, issuesApi, authorsApi, xmlApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { AuthorManager } from '@/components/admin/AuthorManager';
import RichTextEditor from '@/components/admin/RichTextEditor';

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  // Cascading selections
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedJournal, setSelectedJournal] = useState(''); // Slug
  const [journalId, setJournalId] = useState<number | null>(null);
  const [selectedVolume, setSelectedVolume] = useState('');
  const [hasIssue, setHasIssue] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState('');
  const [isSpecialIssue, setIsSpecialIssue] = useState(false);
  const [articleAuthors, setArticleAuthors] = useState<any[]>([]);
  const [parsingInfo, setParsingInfo] = useState<{ status: string; errors: string; date: string | null } | null>(null);
  const [reparsing, setReparsing] = useState(false);

  // Article form data
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    abstract: '',
    keywords: '', // SEO Keywords
    keywords_display: '', // Display Keywords
    doi: '',
    status: 'draft',
    article_id_code: '',
    license_text: 'CC BY License',
    article_type: 'research',
    page_start: '',
    page_end: '',
    article_number: '',
    received_date: '',
    revised_date: '',
    accepted_date: '',
    published_date: '',
    cite_as: '',
    cite_score: '',
    cite_score_url: '',
    scopus_score: '',
    scopus_score_url: '',
    top_highlighted_line: '',
    crossmark_url: '',
  });

  // Existing files info
  const [existingFiles, setExistingFiles] = useState<{ [key: string]: string | null }>({
    xml_file: null,
    pdf_file: null,
    epub_file: null,
    prc_file: null,
    mobi_file: null,
    ris_file: null,
    bib_file: null,
    endnote_file: null,
    crossmark_logo: null,
  });

  // New files to upload
  const [newFiles, setNewFiles] = useState<{ [key: string]: File | null }>({
    xml_file: null,
    pdf_file: null,
    epub_file: null,
    prc_file: null,
    mobi_file: null,
    ris_file: null,
    bib_file: null,
    endnote_file: null,
    crossmark_logo: null,
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

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const article = await articlesApi.get(articleId);
        
        setFormData({
          title: article.title || '',
          slug: article.slug || '',
          abstract: article.abstract || '',
          keywords: typeof article.keywords === 'string' ? article.keywords : (article.keywords?.join(', ') || ''),
          keywords_display: article.keywords_display || '',
          doi: article.doi || '',
          status: article.status || 'draft',
          article_id_code: article.article_id_code || '',
          license_text: article.license_text || 'CC BY License',
          article_type: article.article_type || 'research',
          page_start: article.page_start || '',
          page_end: article.page_end || '',
          article_number: article.article_number || '',
          received_date: article.received_date || '',
          revised_date: article.revised_date || '',
          accepted_date: article.accepted_date || '',
          published_date: article.published_date || '',
          cite_as: article.cite_as || '',
          cite_score: article.cite_score || '',
          cite_score_url: article.cite_score_url || '',
          scopus_score: article.scopus_score || '',
          scopus_score_url: article.scopus_score_url || '',
          top_highlighted_line: article.top_highlighted_line || '',
          crossmark_url: article.crossmark_url || '',
        });

        setArticleAuthors(article.authors || []);

        const journal = article.journal_info;
        if (journal) {
          setSelectedJournal(journal.slug);
          setJournalId(journal.id);
          // Try to find subject
          if (journal.subjects && journal.subjects.length > 0) {
            setSelectedSubject(journal.subjects[0].slug);
          }
        }

        setIsSpecialIssue(article.is_special_issue || false);
        
        if (article.html_content) {
          setParsingInfo({
            status: article.html_content.parsing_status,
            errors: article.html_content.parsing_errors,
            date: article.html_content.parsed_at
          });
        }
        
        if (article.volume_info) {
          setSelectedVolume(article.volume_info.id.toString());
        }

        if (article.issue_info) {
          setHasIssue(true);
          setSelectedIssue(article.issue_info.id.toString());
        }

        setExistingFiles({
          xml_file: article.xml_file || null,
          pdf_file: article.pdf_file || null,
          epub_file: article.epub_file || null,
          prc_file: article.prc_file || null,
          mobi_file: article.mobi_file || null,
          ris_file: article.ris_file || null,
          bib_file: article.bib_file || null,
          endnote_file: article.endnote_file || null,
          crossmark_logo: article.crossmark_logo || null,
        });

      } catch (error) {
        toast.error('Failed to fetch article');
        router.push('/admin/articles');
      } finally {
        setFetching(false);
      }
    };

    fetchArticle();
  }, [articleId, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files[0]) {
      setNewFiles({ ...newFiles, [fieldName]: e.target.files[0] });
    }
  };

  const handleReparse = async () => {
    setReparsing(true);
    try {
      const response = await xmlApi.reparse(parseInt(articleId));
      if (response.success) {
        toast.success('XML re-parsed successfully');
        // Refresh page to show new content
        window.location.reload();
      } else {
        toast.error('Reparsing failed');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.errors?.join(', ') || 'Failed to re-parse XML');
    } finally {
      setReparsing(false);
    }
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

    setLoading(true);

    try {
      const data = new FormData();
      
      // Basic info
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      // Relationships
      if (journalId) {
        data.append('journal', journalId.toString());
      } else {
        const journalObj = journalsList.find((j: any) => j.slug === selectedJournal);
        if (journalObj) data.append('journal', journalObj.id.toString());
      }
      
      if (!isSpecialIssue) {
        if (selectedVolume) data.append('volume', selectedVolume.toString());
        if (hasIssue && selectedIssue) data.append('issue', selectedIssue.toString());
        else data.append('issue', ''); // Clear issue if unchecked
      } else {
        data.append('volume', '');
        data.append('issue', '');
      }
      
      data.append('is_special_issue', String(isSpecialIssue));

      // Files
      Object.entries(newFiles).forEach(([key, file]) => {
        if (file) data.append(key, file);
      });

      await articlesApi.updateWithFiles(parseInt(articleId), data);
      toast.success('Article updated successfully!');
      router.push('/admin/articles');
    } catch (error: any) {
      console.error('Error updating article:', error);
      const errorData = error.response?.data;
      let errorMessage = 'Failed to update article';
      
      if (errorData) {
        if (typeof errorData === 'object') {
          errorMessage = Object.entries(errorData)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join(' | ');
        } else {
          errorMessage = errorData;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-academic-navy border-t-transparent rounded-full"></div>
      </div>
    );
  }

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
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-900">Edit Article</h1>
          <p className="text-sm text-gray-500 font-mono">ID: {articleId}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Publication Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-academic-navy text-white text-xs flex items-center justify-center rounded-full">1</span>
              Publication Details
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Journal *
                  </label>
                  <select
                    value={selectedJournal}
                    onChange={(e) => {
                      const slug = e.target.value;
                      setSelectedJournal(slug);
                      const journalObj = journalsList.find((j: any) => j.slug === slug);
                      if (journalObj) setJournalId(journalObj.id);
                    }}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
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
                  className="w-4 h-4 text-academic-blue border-gray-300 rounded focus:ring-academic-blue"
                />
                <label htmlFor="isSpecialIssue" className="text-sm font-medium text-blue-900">
                  Is this a Special Issue?
                </label>
              </div>

              {!isSpecialIssue && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Volume *
                    </label>
                    <select
                      value={selectedVolume}
                      onChange={(e) => setSelectedVolume(e.target.value)}
                      required={!isSpecialIssue}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
                    >
                      <option value="">-- Select Volume --</option>
                      {volumesList.map((volume: any) => (
                        <option key={volume.id} value={volume.id}>
                          Volume {volume.volume_number} ({volume.year})
                        </option>
                      ))}
                    </select>
                  </div>

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
                        required={hasIssue}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
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
            </div>
          </div>

          {/* Step 2: Article Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-academic-navy text-white text-xs flex items-center justify-center rounded-full">2</span>
              Article Content
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Article ID (Code)
                  </label>
                  <input
                    type="text"
                    value={formData.article_id_code}
                    onChange={(e) => setFormData({ ...formData, article_id_code: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
                  />
                </div>
                <div className="md:col-span-2">
                  <RichTextEditor
                    label="License / Copyright Text"
                    value={formData.license_text}
                    onChange={(content) => setFormData({ ...formData, license_text: content })}
                    placeholder="Enter license or copyright info. HTML links are supported."
                  />
                </div>
                <div className="md:col-span-2">
                  <RichTextEditor
                    label="Cite As (Custom Text)"
                    value={formData.cite_as}
                    onChange={(content) => setFormData({ ...formData, cite_as: content })}
                    placeholder="Enter custom citation text. If empty, a default will be generated."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Abstract
                </label>
                <textarea
                  rows={6}
                  value={formData.abstract}
                  onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Keywords (SEO - Backend)
                </label>
                <textarea
                  rows={2}
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
                />
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
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Article Type
                  </label>
                  <select
                    value={formData.article_type}
                    onChange={(e) => setFormData({ ...formData, article_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
                  >
                    <option value="research">Research Article</option>
                    <option value="review">Review Article</option>
                    <option value="case_report">Case Report</option>
                    <option value="short_communication">Short Communication</option>
                    <option value="letter">Letter to the Editor</option>
                    <option value="editorial">Editorial</option>
                    <option value="commentary">Commentary</option>
                    <option value="perspective">Perspective</option>
                    <option value="book_review">Book Review</option>
                    <option value="erratum">Erratum</option>
                    <option value="retraction">Retraction</option>
                    <option value="other">Other</option>
                  </select>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Received Date
                  </label>
                  <input
                    type="date"
                    value={formData.received_date}
                    onChange={(e) => setFormData({ ...formData, received_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Revised Date
                  </label>
                  <input
                    type="date"
                    value={formData.revised_date}
                    onChange={(e) => setFormData({ ...formData, revised_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Accepted Date
                  </label>
                  <input
                    type="date"
                    value={formData.accepted_date}
                    onChange={(e) => setFormData({ ...formData, accepted_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Published Date
                  </label>
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

          {/* Author Management Section */}
          <AuthorManager 
            articleId={parseInt(articleId)} 
            initialAuthors={articleAuthors}
            onAuthorsUpdate={(updated) => setArticleAuthors(updated)}
          />

          {/* Step 4: Scores & Metrics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-academic-navy text-white text-xs flex items-center justify-center rounded-full">4</span>
              Scores & Metrics
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cite Score (Value)
                  </label>
                  <input
                    type="text"
                    value={formData.cite_score}
                    onChange={(e) => setFormData({ ...formData, cite_score: e.target.value })}
                    placeholder="e.g. 4.5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cite Score URL
                  </label>
                  <input
                    type="url"
                    value={formData.cite_score_url}
                    onChange={(e) => setFormData({ ...formData, cite_score_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scopus Score (Value)
                  </label>
                  <input
                    type="text"
                    value={formData.scopus_score}
                    onChange={(e) => setFormData({ ...formData, scopus_score: e.target.value })}
                    placeholder="e.g. 3.2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scopus Score URL
                  </label>
                  <input
                    type="url"
                    value={formData.scopus_score_url}
                    onChange={(e) => setFormData({ ...formData, scopus_score_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step 5: Top Branding & Highlights */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-academic-navy text-white text-xs flex items-center justify-center rounded-full">5</span>
              Top Branding & Highlights
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Top Highlighted Line (Red text at very top)
                </label>
                <textarea
                  value={formData.top_highlighted_line}
                  onChange={(e) => setFormData({ ...formData, top_highlighted_line: e.target.value })}
                  placeholder="e.g. IMPORTANT: This article has been updated with new research data."
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Crossmark Logo (or top branding logo)
                  </label>
                  <div className="mt-1 flex items-center gap-4">
                    {(newFiles.crossmark_logo || existingFiles.crossmark_logo) && (
                      <div className="relative w-16 h-16 bg-gray-50 border rounded-lg overflow-hidden flex items-center justify-center">
                        <img
                          src={newFiles.crossmark_logo ? URL.createObjectURL(newFiles.crossmark_logo) : existingFiles.crossmark_logo!}
                          alt="Logo preview"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setNewFiles({ ...newFiles, crossmark_logo: file });
                        }}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-academic-navy/5 file:text-academic-navy hover:file:bg-academic-navy/10"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Crossmark URL
                  </label>
                  <input
                    type="url"
                    value={formData.crossmark_url}
                    onChange={(e) => setFormData({ ...formData, crossmark_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* XML Parsing Status */}
          {existingFiles.xml_file && (
            <div className={`bg-white rounded-xl shadow-sm border p-6 ${
              parsingInfo?.status === 'success' ? 'border-green-200' : 
              parsingInfo?.status === 'failed' ? 'border-red-200' : 'border-blue-200'
            }`}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiFile className={
                  parsingInfo?.status === 'success' ? 'text-green-500' : 
                  parsingInfo?.status === 'failed' ? 'text-red-500' : 'text-blue-500'
                } />
                XML Parsing Status
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 font-medium">Status:</span>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    parsingInfo?.status === 'success' ? 'bg-green-100 text-green-700' : 
                    parsingInfo?.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {parsingInfo?.status || 'Pending'}
                  </span>
                </div>

                {parsingInfo?.date && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 font-medium">Last Parsed:</span>
                    <span className="text-sm text-gray-900">{new Date(parsingInfo.date).toLocaleString()}</span>
                  </div>
                )}

                {parsingInfo?.errors && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                    <p className="text-[10px] font-bold text-red-700 uppercase mb-1">Errors:</p>
                    <p className="text-xs text-red-600 font-mono whitespace-pre-wrap">{parsingInfo.errors}</p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleReparse}
                  disabled={reparsing}
                  className="w-full py-2 border-2 border-academic-blue text-academic-blue rounded-lg font-bold hover:bg-blue-50 transition-all text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {reparsing ? <div className="w-4 h-4 border-2 border-academic-blue/30 border-t-academic-blue rounded-full animate-spin"></div> : <FiCheck />}
                  Reparse XML File
                </button>
              </div>
            </div>
          )}

          {/* File Management */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiUpload className="w-5 h-5 text-academic-blue" />
              File Attachments
            </h2>
            
            <div className="space-y-6">
              {[
                { label: 'XML File', key: 'xml_file', accept: '.xml' },
                { label: 'PDF Document', key: 'pdf_file', accept: '.pdf' },
                { label: 'ePUB File', key: 'epub_file', accept: '.epub' },
                { label: 'PRC File', key: 'prc_file', accept: '.prc' },
                { label: 'Mobi File', key: 'mobi_file', accept: '.mobi' },
                { label: 'RIS Citation (.ris)', key: 'ris_file', accept: '.ris' },
                { label: 'BibTeX Citation (.bib)', key: 'bib_file', accept: '.bib' },
                { label: 'EndNote Citation (.enw)', key: 'endnote_file', accept: '.enw' },
              ].map((fileConfig) => (
                <div key={fileConfig.key} className="space-y-2">
                  <span className="block text-sm font-medium text-gray-700">{fileConfig.label}</span>
                  
                  {existingFiles[fileConfig.key] && (
                    <div className="flex items-center justify-between p-2 bg-green-50 border border-green-100 rounded-lg text-xs">
                      <span className="text-green-700 flex items-center gap-1 truncate">
                        <FiCheck className="flex-shrink-0" /> Existing File
                      </span>
                      <a 
                        href={existingFiles[fileConfig.key]!} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-academic-blue hover:underline flex items-center gap-1 flex-shrink-0"
                      >
                        View <FiExternalLink />
                      </a>
                    </div>
                  )}

                  <div className={`p-3 border rounded-lg ${newFiles[fileConfig.key] ? 'border-academic-blue bg-blue-50' : 'border-gray-200 bg-white'}`}>
                    <label className="block cursor-pointer">
                      <div className="flex items-center gap-2">
                        <FiFile className={newFiles[fileConfig.key] ? 'text-academic-blue' : 'text-gray-400'} />
                        <span className="text-xs text-gray-500 truncate">
                          {newFiles[fileConfig.key] ? newFiles[fileConfig.key]!.name : (existingFiles[fileConfig.key] ? 'Replace file' : 'Upload file')}
                        </span>
                      </div>
                      <input
                        type="file"
                        accept={fileConfig.accept}
                        className="hidden"
                        onChange={(e) => handleFileChange(e, fileConfig.key)}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Card */}
          <div className="bg-academic-navy rounded-xl shadow-lg p-6 text-white sticky top-6">
            <h3 className="font-semibold mb-4">Update Article</h3>
            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading || !selectedJournal || (!isSpecialIssue && !selectedVolume)}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-academic-navy font-bold rounded-lg hover:bg-academic-blue hover:text-white transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-academic-navy/30 border-t-academic-navy rounded-full animate-spin"></div>
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
