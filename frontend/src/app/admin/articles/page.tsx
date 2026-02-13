'use client';

import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiFileText, FiFilter, FiSearch, FiChevronUp, FiChevronDown, FiCheck, FiX } from 'react-icons/fi';
import { journalsApi, volumesApi, issuesApi, articlesApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminArticlesPage() {
  const queryClient = useQueryClient();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedJournal, setSelectedJournal] = useState('');
  const [selectedVolume, setSelectedVolume] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ field: string; direction: 'asc' | 'desc' }>({
    field: 'published_date',
    direction: 'desc',
  });

  // Fetch subjects
  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: journalsApi.subjects,
  });

  // Fetch journals filtered by subject
  const { data: journals } = useQuery({
    queryKey: ['journals-admin-list', selectedSubject],
    queryFn: () => journalsApi.adminList({ subjects__slug: selectedSubject || undefined }),
  });

  // Fetch volumes for selected journal
  const { data: volumes } = useQuery({
    queryKey: ['volumes-by-journal', selectedJournal],
    queryFn: () => volumesApi.listByJournal(selectedJournal),
    enabled: !!selectedJournal,
  });

  // Fetch articles with search, filtering and sorting
  const { data: articles, isLoading } = useQuery({
    queryKey: ['admin-articles', searchQuery, selectedJournal, selectedVolume, sortConfig],
    queryFn: () => articlesApi.adminList({ 
      search: searchQuery || undefined,
      journal: selectedJournal || undefined,
      volume: selectedVolume || undefined,
      ordering: `${sortConfig.direction === 'desc' ? '-' : ''}${sortConfig.field}`
    }),
  });

  const subjectsList = subjects?.results || subjects || [];
  const journalsList = journals?.results || journals || [];
  const volumesList = volumes?.results || volumes || [];
  const articlesList = articles?.results || articles || [];

  // Local filtering for subject (since backend filter is by journal_id or slug)
  const filteredJournals = selectedSubject
    ? journalsList.filter((j: any) => 
        j.subjects?.some((s: any) => s.slug === selectedSubject)
      )
    : journalsList;

  // We now use articlesList directly since Journal filtering is handled by the API
  const filteredArticles = articlesList;

  // Reset journal/volume selection when subject changes
  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
    setSelectedJournal('');
    setSelectedVolume('');
  };

  // Reset volume selection when journal changes
  const handleJournalChange = (value: string) => {
    setSelectedJournal(value);
    setSelectedVolume('');
  };

  const handleSort = (field: string) => {
    setSortConfig((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortConfig.field !== field) return null;
    return sortConfig.direction === 'asc' ? <FiChevronUp className="inline ml-1" /> : <FiChevronDown className="inline ml-1" />;
  };

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await articlesApi.delete(id);
      toast.success('Article deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
    } catch (error: any) {
      console.error('Error deleting article:', error);
      toast.error(error.response?.data?.detail || 'Failed to delete article');
    }
  };

  const handleTogglePreface = async (article: any) => {
    try {
      const newValue = !article.is_preface;
      await articlesApi.update(article.id, { is_preface: newValue });
      toast.success(newValue ? 'Article set as preface' : 'Preface status removed');
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      queryClient.invalidateQueries({ queryKey: ['journal-articles'] });
      queryClient.invalidateQueries({ queryKey: ['recent-articles'] });
    } catch (error: any) {
      console.error('Error toggling preface status:', error);
      toast.error('Failed to update preface status');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Articles</h1>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-academic-navy text-white font-medium rounded-lg hover:bg-academic-blue transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          Add Article
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <FiFilter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedSubject}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="min-w-[150px] px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
            >
              <option value="">All Subjects</option>
              {subjectsList.map((subject: any) => (
                <option key={subject.id} value={subject.slug}>
                  {subject.name}
                </option>
              ))}
            </select>
        </div>

          <div className="flex items-center gap-2">
        <select
          value={selectedJournal}
              onChange={(e) => handleJournalChange(e.target.value)}
              className="min-w-[200px] max-w-[300px] px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
        >
          <option value="">All Journals</option>
              {journalsList.map((journal: any) => (
                <option key={journal.id} value={journal.slug}>
              {journal.title}
            </option>
          ))}
        </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedVolume}
              onChange={(e) => setSelectedVolume(e.target.value)}
              disabled={!selectedJournal}
              className="min-w-[150px] px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">All Volumes</option>
              {volumesList.map((vol: any) => (
                <option key={vol.id} value={vol.id}>
                  Vol. {vol.volume_number} ({vol.year})
                </option>
              ))}
            </select>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 min-w-[300px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by article title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
            />
          </div>

          {(selectedSubject || selectedJournal || selectedVolume || searchQuery) && (
            <button
              onClick={() => { setSelectedSubject(''); setSelectedJournal(''); setSelectedVolume(''); setSearchQuery(''); }}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Clear all filters"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-academic-navy border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : filteredArticles.length > 0 ? (
            <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Preface
                </th>
                <th 
                  className="text-left px-6 py-3 text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('title')}
                >
                  Title <SortIcon field="title" />
                </th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Journal</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Volume/Issue</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Status</th>
                <th 
                  className="text-left px-6 py-3 text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('published_date')}
                >
                  Date <SortIcon field="published_date" />
                </th>
                <th className="text-right px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
              {filteredArticles.map((article: any) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div 
                        onClick={() => handleTogglePreface(article)}
                        className={`w-5 h-5 rounded border cursor-pointer flex items-center justify-center transition-all ${
                          article.is_preface 
                            ? 'bg-academic-gold border-academic-gold text-white' 
                            : 'bg-white border-gray-300 hover:border-academic-gold'
                        }`}
                        title={article.is_preface ? "Remove preface status" : "Set as preface"}
                      >
                        {article.is_preface && <FiCheck className="w-3.5 h-3.5 stroke-[4]" />}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 line-clamp-1 max-w-xs">{article.title}</p>
                    {article.is_preface && (
                      <span className="inline-flex items-center mt-1 px-1.5 py-0.5 bg-academic-gold/10 text-academic-gold text-[9px] font-black uppercase tracking-widest rounded border border-academic-gold/20">
                        Preface
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {article.journal_info?.title || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                    {article.volume_number ? (
                      <>
                        Vol. {article.volume_number}
                        {article.issue_number && `, Issue ${article.issue_number}`}
                      </>
                    ) : 'N/A'}
                    </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full uppercase tracking-wider ${
                      article.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : article.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-700'
                        : article.status === 'archive'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {article.status || 'Draft'}
                      </span>
                    </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                      {article.published_date
                      ? new Date(article.published_date).toLocaleDateString()
                      : 'Not published'
                    }
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                      {(article.journal_slug || article.journal_info?.slug) && (
                        <Link
                          href={`/${article.journal_slug || article.journal_info.slug}/article/${article.slug}`}
                          className="p-2 text-gray-400 hover:text-academic-blue transition-colors"
                          title="View"
                        >
                          <FiEye className="w-4 h-4" />
                        </Link>
                      )}
                        <Link
                          href={`/admin/articles/${article.id}`}
                        className="p-2 text-gray-400 hover:text-academic-blue transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(article.id, article.title)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        ) : (
          <div className="p-8 text-center text-gray-600">
            <FiFileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p>No articles found.</p>
            <Link
              href="/admin/articles/new"
              className="text-academic-blue hover:text-academic-navy font-medium mt-2 inline-block"
            >
              Create your first article
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
