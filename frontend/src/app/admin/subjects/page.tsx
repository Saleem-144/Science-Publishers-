'use client';

import { useQuery } from '@tanstack/react-query';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { journalsApi } from '@/lib/api';

export default function AdminSubjectsPage() {
  const { data: subjects, isLoading } = useQuery({
    queryKey: ['admin-subjects'],
    queryFn: journalsApi.subjects,
  });

  const subjectsList = subjects?.results || subjects || [];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Subjects</h1>
        <button
          className="inline-flex items-center gap-2 px-4 py-2 bg-academic-navy text-white font-medium rounded-lg hover:bg-academic-blue transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          Add Subject
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-academic-navy border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : subjectsList.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Name</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Slug</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Description</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Journals</th>
                <th className="text-right px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subjectsList.map((subject: any) => (
                <tr key={subject.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {subject.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {subject.slug}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    {subject.description || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {subject.journal_count || 0}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-2 text-gray-400 hover:text-academic-blue transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
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
            <p>No subjects found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
