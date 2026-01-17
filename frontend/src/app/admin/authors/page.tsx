'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { FiPlus, FiEdit2, FiTrash2, FiMail } from 'react-icons/fi';
import { authorsApi } from '@/lib/api';

export default function AdminAuthorsPage() {
  const { data: authors, isLoading } = useQuery({
    queryKey: ['admin-authors'],
    queryFn: () => authorsApi.list(),
  });

  const authorsList = authors?.results || authors || [];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Authors</h1>
        <button
          className="inline-flex items-center gap-2 px-4 py-2 bg-academic-navy text-white font-medium rounded-lg hover:bg-academic-blue transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          Add Author
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-academic-navy border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : authorsList.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Name</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Email</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Affiliation</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Articles</th>
                <th className="text-right px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {authorsList.map((author: any) => (
                <tr key={author.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{author.full_name}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {author.email || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {author.affiliation || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {author.article_count || 0}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {author.email && (
                        <a
                          href={`mailto:${author.email}`}
                          className="p-2 text-gray-400 hover:text-academic-blue transition-colors"
                          title="Email"
                        >
                          <FiMail className="w-4 h-4" />
                        </a>
                      )}
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
            <p>No authors found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
