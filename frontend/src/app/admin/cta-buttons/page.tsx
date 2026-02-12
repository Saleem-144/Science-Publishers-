'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiEdit2, FiSave, FiX, FiCheck, FiMail, FiMessageSquare } from 'react-icons/fi';
import { ctaButtonsApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function CTAButtonsAdminPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ label: '', notification_email: '' });

  const { data: buttons, isLoading } = useQuery({
    queryKey: ['admin-cta-buttons'],
    queryFn: ctaButtonsApi.adminList,
  });

  const { data: submissions } = useQuery({
    queryKey: ['admin-cta-submissions'],
    queryFn: ctaButtonsApi.submissions,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => ctaButtonsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cta-buttons'] });
      setEditingId(null);
      toast.success('Button updated successfully');
    },
    onError: () => {
      toast.error('Failed to update button');
    },
  });

  const handleEdit = (btn: any) => {
    setEditingId(btn.id);
    setEditForm({ label: btn.label, notification_email: btn.notification_email });
  };

  const handleSave = (id: number) => {
    updateMutation.mutate({ id, data: editForm });
  };

  const buttonsList = buttons?.results || buttons || [];
  const submissionsList = submissions?.results || submissions || [];

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CTA Buttons & Forms</h1>
          <p className="text-gray-500">Manage homepage hero buttons and notification emails.</p>
        </div>
      </div>

      {/* Buttons Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Hero Section Buttons</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Button Label</th>
                <th className="px-6 py-4">Notification Email</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">Loading...</td>
                </tr>
              ) : buttonsList.map((btn: any) => (
                <tr key={btn.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">{btn.slug}</td>
                  <td className="px-6 py-4">
                    {editingId === btn.id ? (
                      <input
                        type="text"
                        value={editForm.label}
                        onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                        className="w-full px-3 py-1 border border-academic-blue rounded outline-none"
                      />
                    ) : (
                      <span className="font-medium text-gray-900">{btn.label}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === btn.id ? (
                      <input
                        type="email"
                        value={editForm.notification_email}
                        onChange={(e) => setEditForm({ ...editForm, notification_email: e.target.value })}
                        className="w-full px-3 py-1 border border-academic-blue rounded outline-none"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiMail className="w-4 h-4 text-gray-400" />
                        {btn.notification_email}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      btn.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {btn.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {editingId === btn.id ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleSave(btn.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Save"
                        >
                          <FiSave className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Cancel"
                        >
                          <FiX className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(btn)}
                        className="p-2 text-academic-blue hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Form Submissions</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FiMessageSquare />
            {submissionsList.length} Total Submissions
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Applicant</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Affiliation</th>
                <th className="px-6 py-4">CV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {submissionsList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">No submissions yet</td>
                </tr>
              ) : submissionsList.map((sub: any) => (
                <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(sub.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{sub.title} {sub.first_name} {sub.last_name}</div>
                    <div className="text-xs text-gray-500">{sub.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-academic-navy bg-blue-50 px-2 py-1 rounded">
                      {buttonsList.find((b: any) => b.id === sub.button)?.label || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{sub.affiliation}</div>
                    <div className="text-xs text-gray-500">{sub.country}</div>
                  </td>
                  <td className="px-6 py-4">
                    {sub.cv_file && (
                      <a
                        href={sub.cv_file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-academic-blue hover:underline text-sm font-medium"
                      >
                        Download CV
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

