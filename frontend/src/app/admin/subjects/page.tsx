'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi';
import { journalsApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminSubjectsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const { data: subjects, isLoading } = useQuery({
    queryKey: ['admin-subjects'],
    queryFn: journalsApi.subjects,
  });

  const subjectsList = subjects?.results || subjects || [];

  const handleOpenModal = (subject: any = null) => {
    if (subject) {
      setEditingSubject(subject);
      setFormData({
        name: subject.name,
        description: subject.description || '',
      });
    } else {
      setEditingSubject(null);
      setFormData({
        name: '',
        description: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSubject(null);
    setFormData({ name: '', description: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSubject) {
        await journalsApi.updateSubject(editingSubject.id, formData);
        toast.success('Subject updated successfully');
      } else {
        await journalsApi.createSubject(formData);
        toast.success('Subject created successfully');
      }
      queryClient.invalidateQueries({ queryKey: ['admin-subjects'] });
      handleCloseModal();
    } catch (error: any) {
      const data = error.response?.data;
      if (data && typeof data === 'object') {
        const firstError = Object.values(data)[0];
        toast.error(Array.isArray(firstError) ? firstError[0] : String(firstError) || 'Something went wrong');
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    
    try {
      await journalsApi.deleteSubject(id);
      toast.success('Subject deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-subjects'] });
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to delete subject');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Subjects</h1>
        <button
          onClick={() => handleOpenModal()}
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
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600 text-center">Journals</th>
                <th className="text-right px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subjectsList.map((subject: any) => (
                <tr key={subject.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {subject.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {subject.slug}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    {subject.description || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-50 text-academic-blue rounded-full font-bold">
                      {subject.journal_count || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(subject)}
                        className="p-2 text-gray-400 hover:text-academic-blue hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(subject.id, subject.name)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
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
            No subjects found. Click "Add Subject" to create one.
          </div>
        )}
      </div>

      {/* Subject Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editingSubject ? 'Edit Subject' : 'Add New Subject'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase mb-1 tracking-wider">
                  Subject Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Engineering, Physics..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-academic-blue focus:border-academic-blue outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase mb-1 tracking-wider">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short description of the subject..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-academic-blue focus:border-academic-blue outline-none transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-academic-navy text-white font-bold rounded-xl hover:bg-academic-blue transition-colors flex items-center justify-center gap-2"
                >
                  <FiCheck className="w-4 h-4" />
                  {editingSubject ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
