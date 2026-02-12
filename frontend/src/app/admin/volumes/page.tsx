'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FiPlus, FiEdit2, FiTrash2, FiBook, FiLayers } from 'react-icons/fi';
import { journalsApi, volumesApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminVolumesPage() {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedJournal, setSelectedJournal] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingVolume, setEditingVolume] = useState<any>(null);
  const [newVolume, setNewVolume] = useState({ number: '', year: new Date().getFullYear().toString() });
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

  // ... (useQuery hooks remain the same)

  // Fetch subjects
  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: journalsApi.subjects,
  });

  // Fetch journals filtered by subject (include all journals for admin)
  const { data: journals } = useQuery({
    queryKey: ['admin-journals-by-subject', selectedSubject],
    queryFn: () => journalsApi.adminList({ subjects__slug: selectedSubject || undefined }),
  });

  // Fetch volumes for selected journal
  const { data: volumes, isLoading: volumesLoading, refetch: refetchVolumes } = useQuery({
    queryKey: ['volumes-by-journal', selectedJournal],
    queryFn: () => volumesApi.listByJournal(selectedJournal),
    enabled: !!selectedJournal,
  });

  const subjectsList = subjects?.results || subjects || [];
  const journalsList = journals?.results || journals || [];
  const volumesList = volumes?.results || volumes || [];

  // Filter journals by selected subject
  const filteredJournals = selectedSubject
    ? journalsList.filter((j: any) => 
        j.subjects?.some((s: any) => s.slug === selectedSubject)
      )
    : journalsList;

  // Reset journal selection when subject changes
  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
    setSelectedJournal('');
  };

  // Create new volume
  const handleCreateVolume = async () => {
    if (!selectedJournal || !newVolume.number || !newVolume.year) {
      toast.error('Please fill all fields');
      return;
    }

    setCreating(true);
    try {
      // Find the actual journal ID from the slug
      const journalId = journalsList.find((j: any) => j.slug === selectedJournal)?.id;
      
      await volumesApi.create({
        journal: journalId,
        volume_number: parseInt(newVolume.number),
        year: parseInt(newVolume.year),
      });
      toast.success('Volume created successfully!');
      setNewVolume({ number: '', year: new Date().getFullYear().toString() });
      setShowCreateForm(false);
      refetchVolumes();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to create volume');
    } finally {
      setCreating(false);
    }
  };

  // Update volume
  const handleUpdateVolume = async () => {
    if (!editingVolume || !editingVolume.volume_number || !editingVolume.year) {
      toast.error('Please fill all fields');
      return;
    }

    setUpdating(true);
    try {
      await volumesApi.update(editingVolume.id, {
        volume_number: parseInt(editingVolume.volume_number),
        year: parseInt(editingVolume.year),
      });
      toast.success('Volume updated successfully!');
      setEditingVolume(null);
      refetchVolumes();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to update volume');
    } finally {
      setUpdating(false);
    }
  };

  // Delete volume
  const handleDeleteVolume = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this volume? This will delete all associated issues and articles.')) {
      return;
    }

    try {
      await volumesApi.delete(id);
      toast.success('Volume deleted successfully');
      refetchVolumes();
    } catch (error: any) {
      toast.error('Failed to delete volume');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Volumes</h1>
      </div>

      {/* Cascading Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Journal</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Subject Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              1. Select Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => handleSubjectChange(e.target.value)}
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

          {/* Journal Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              2. Select Journal
            </label>
            <select
              value={selectedJournal}
              onChange={(e) => setSelectedJournal(e.target.value)}
              disabled={!selectedSubject}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue disabled:bg-gray-100 disabled:cursor-not-allowed"
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
      </div>

      {/* Volumes List & Create Form */}
      {selectedJournal ? (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiLayers className="w-5 h-5 text-academic-navy" />
              <h3 className="font-semibold text-gray-900">
                Volumes for {filteredJournals.find((j: any) => j.slug === selectedJournal)?.title}
              </h3>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-academic-navy text-white font-medium rounded-lg hover:bg-academic-blue transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Add Volume
            </button>
          </div>

          {/* Create Volume Form */}
          {showCreateForm && (
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Volume Number *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newVolume.number}
                    onChange={(e) => setNewVolume({ ...newVolume, number: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
                    placeholder="e.g., 1"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year *
                  </label>
                  <input
                    type="number"
                    min="1900"
                    max="2100"
                    value={newVolume.year}
                    onChange={(e) => setNewVolume({ ...newVolume, year: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
                  />
                </div>
                <button
                  onClick={handleCreateVolume}
                  disabled={creating}
                  className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create'}
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Volumes Table */}
          {volumesLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-academic-navy border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : volumesList.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Volume</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Year</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Issues</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Articles</th>
                  <th className="text-right px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {volumesList.map((volume: any) => (
                  <tr key={volume.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {editingVolume?.id === volume.id ? (
                        <input
                          type="number"
                          value={editingVolume.volume_number}
                          onChange={(e) => setEditingVolume({ ...editingVolume, volume_number: e.target.value })}
                          className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-academic-blue"
                        />
                      ) : (
                        `Volume ${volume.volume_number}`
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {editingVolume?.id === volume.id ? (
                        <input
                          type="number"
                          value={editingVolume.year}
                          onChange={(e) => setEditingVolume({ ...editingVolume, year: e.target.value })}
                          className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-academic-blue"
                        />
                      ) : (
                        volume.year
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {volume.issue_count || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {volume.article_count || 0}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {editingVolume?.id === volume.id ? (
                          <>
                            <button
                              onClick={handleUpdateVolume}
                              disabled={updating}
                              className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded hover:bg-green-700 disabled:opacity-50"
                            >
                              {updating ? '...' : 'Save'}
                            </button>
                            <button
                              onClick={() => setEditingVolume(null)}
                              className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                        <button
                              onClick={() => setEditingVolume({ 
                                id: volume.id, 
                                volume_number: volume.volume_number.toString(), 
                                year: volume.year.toString() 
                              })}
                          className="p-2 text-gray-400 hover:text-academic-blue transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                              onClick={() => handleDeleteVolume(volume.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-gray-600">
              <FiBook className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p>No volumes found for this journal.</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="text-academic-blue hover:text-academic-navy font-medium mt-2"
              >
                Create the first volume
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FiLayers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Journal</h3>
          <p className="text-gray-600">
            Choose a subject and journal above to view and manage its volumes.
          </p>
        </div>
      )}
    </div>
  );
}
