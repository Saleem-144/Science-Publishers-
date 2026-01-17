'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiFilter } from 'react-icons/fi';
import { journalsApi } from '@/lib/api';

export default function AdminJournalsPage() {
  const [selectedSubject, setSelectedSubject] = useState('');

  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: journalsApi.subjects,
  });

  const { data: journals, isLoading } = useQuery({
    queryKey: ['admin-journals', selectedSubject],
    queryFn: () => journalsApi.list({ subject: selectedSubject || undefined }),
  });

  const subjectsList = subjects?.results || subjects || [];
  const journalsList = journals?.results || journals || [];

  // Filter journals by selected subject
  const filteredJournals = selectedSubject
    ? journalsList.filter((j: any) => 
        j.subjects?.some((s: any) => s.slug === selectedSubject || s.id === selectedSubject)
      )
    : journalsList;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Journals</h1>
        <Link
          href="/admin/journals/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-academic-navy text-white font-medium rounded-lg hover:bg-academic-blue transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          Add Journal
        </Link>
      </div>

      {/* Subject Filter */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex items-center gap-4">
          <FiFilter className="w-5 h-5 text-gray-500" />
          <label className="text-sm font-medium text-gray-700">Filter by Subject:</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="flex-1 max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
          >
            <option value="">All Subjects</option>
            {subjectsList.map((subject: any) => (
              <option key={subject.id} value={subject.slug}>
                {subject.name}
              </option>
            ))}
          </select>
          {selectedSubject && (
            <button
              onClick={() => setSelectedSubject('')}
              className="text-sm text-academic-blue hover:text-academic-navy"
            >
              Clear filter
            </button>
          )}
        </div>
      </div>

      {/* Journals Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-academic-navy border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : filteredJournals.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Title</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Subject</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">ISSN</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Volumes</th>
                <th className="text-right px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredJournals.map((journal: any) => (
                <tr key={journal.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{journal.title}</p>
                      <p className="text-sm text-gray-500">{journal.short_title}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {journal.subjects?.length > 0 ? (
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                        {journal.subjects[0].name}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">No subject</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {journal.issn_print || journal.issn_online || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      journal.is_active 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {journal.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {journal.total_volumes || 0}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/${journal.slug}`}
                        className="p-2 text-gray-400 hover:text-academic-blue transition-colors"
                        title="View"
                      >
                        <FiEye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/journals/${journal.id}`}
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
            <p>No journals found{selectedSubject ? ' for this subject' : ''}.</p>
            <Link
              href="/admin/journals/new"
              className="text-academic-blue hover:text-academic-navy font-medium mt-2 inline-block"
            >
              Create your first journal
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
