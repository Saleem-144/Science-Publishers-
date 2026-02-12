'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { FiPlus, FiEdit2, FiTrash2, FiFilter, FiSearch } from 'react-icons/fi';
import { journalsApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminJournalsPage() {
  const queryClient = useQueryClient();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: journalsApi.subjects,
  });

  const { data: journals, isLoading } = useQuery({
    queryKey: ['admin-journals', selectedSubject, selectedStatus, searchQuery],
    queryFn: () => journalsApi.adminList({ 
      subjects__slug: selectedSubject || undefined,
      is_active: selectedStatus === '' ? undefined : selectedStatus === 'active',
      search: searchQuery || undefined
    }),
  });

  const subjectsList = subjects?.results || subjects || [];
  const journalsList = journals?.results || journals || [];

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This will also delete all volumes, issues, and articles associated with this journal.`)) {
      return;
    }

    try {
      await journalsApi.delete(id);
      toast.success('Journal deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-journals'] });
    } catch (error: any) {
      console.error('Error deleting journal:', error);
      toast.error(error.response?.data?.detail || 'Failed to delete journal');
    }
  };

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

      {/* Filters & Search */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <FiFilter className="w-5 h-5 text-gray-500" />
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Subject:</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue min-w-[150px]"
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
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Status:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue min-w-[120px]"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {(selectedSubject || selectedStatus || searchQuery) && (
              <button
                onClick={() => { setSelectedSubject(''); setSelectedStatus(''); setSearchQuery(''); }}
                className="text-sm text-academic-blue hover:text-academic-navy"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[300px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by Title or ISSN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-academic-blue focus:border-academic-blue sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Journals Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-academic-navy border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : journalsList.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Title</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Subject</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">ISSN</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600 text-center">Status</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600 text-center">Volumes</th>
                <th className="text-right px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {journalsList.map((journal: any) => (
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
                    <div className="space-y-0.5">
                      {journal.issn_print && <div className="flex items-center gap-1.5"><span className="text-[10px] font-bold text-gray-400 uppercase whitespace-nowrap">P:</span> {journal.issn_print}</div>}
                      {journal.issn_online && <div className="flex items-center gap-1.5"><span className="text-[10px] font-bold text-gray-400 uppercase whitespace-nowrap">O:</span> {journal.issn_online}</div>}
                      {!journal.issn_print && !journal.issn_online && 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      journal.is_active 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {journal.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 text-center font-bold">
                    {journal.total_volumes || 0}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/journals/${journal.id}`}
                        className="p-2 text-gray-400 hover:text-academic-blue transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(journal.id, journal.title)}
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
          <div className="p-12 text-center text-gray-500 italic">
            No journals found {(selectedSubject || selectedStatus) ? 'matching your filters' : ''}.
          </div>
        )}
      </div>
    </div>
  );
}
