'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiFileText, FiFilter } from 'react-icons/fi';
import { journalsApi, volumesApi, issuesApi, articlesApi } from '@/lib/api';

export default function AdminArticlesPage() {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedJournal, setSelectedJournal] = useState('');

  // Fetch subjects
  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: journalsApi.subjects,
  });

  // Fetch journals filtered by subject
  const { data: journals } = useQuery({
    queryKey: ['journals-by-subject', selectedSubject],
    queryFn: () => journalsApi.list({ subject: selectedSubject || undefined }),
  });

  // Fetch articles
  const { data: articles, isLoading } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: () => articlesApi.adminList(),
  });

  const subjectsList = subjects?.results || subjects || [];
  const journalsList = journals?.results || journals || [];
  const articlesList = articles?.results || articles || [];

  // Filter journals by selected subject
  const filteredJournals = selectedSubject
    ? journalsList.filter((j: any) => 
        j.subjects?.some((s: any) => s.slug === selectedSubject)
      )
    : journalsList;

  // Filter articles by selected journal
  const filteredArticles = selectedJournal
    ? articlesList.filter((a: any) => 
        a.issue?.volume?.journal?.slug === selectedJournal
      )
    : articlesList;

  // Reset journal selection when subject changes
  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
    setSelectedJournal('');
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

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <FiFilter className="w-5 h-5 text-gray-500" />
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Subject:</label>
            <select
              value={selectedSubject}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
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
            <label className="text-sm font-medium text-gray-700">Journal:</label>
            <select
              value={selectedJournal}
              onChange={(e) => setSelectedJournal(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
            >
              <option value="">All Journals</option>
              {filteredJournals.map((journal: any) => (
                <option key={journal.id} value={journal.slug}>
                  {journal.title}
                </option>
              ))}
            </select>
          </div>
          {(selectedSubject || selectedJournal) && (
            <button
              onClick={() => { setSelectedSubject(''); setSelectedJournal(''); }}
              className="text-sm text-academic-blue hover:text-academic-navy"
            >
              Clear filters
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
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Title</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Journal</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Volume/Issue</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Date</th>
                <th className="text-right px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredArticles.map((article: any) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 line-clamp-1 max-w-xs">{article.title}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {article.issue?.volume?.journal?.title || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {article.issue?.volume ? (
                      <>
                        Vol. {article.issue.volume.number}
                        {article.issue?.number && `, Issue ${article.issue.number}`}
                      </>
                    ) : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      article.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : article.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-700'
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
                      {article.issue?.volume?.journal?.slug && (
                        <Link
                          href={`/${article.issue.volume.journal.slug}/article/${article.slug}`}
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
