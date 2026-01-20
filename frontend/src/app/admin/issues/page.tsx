'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FiPlus, FiEdit2, FiTrash2, FiFileText, FiLayers } from 'react-icons/fi';
import { journalsApi, volumesApi, issuesApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminIssuesPage() {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedJournal, setSelectedJournal] = useState('');
  const [selectedVolume, setSelectedVolume] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newIssue, setNewIssue] = useState({ number: '', title: '' });
  const [creating, setCreating] = useState(false);

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

  // Fetch volumes for selected journal
  const { data: volumes } = useQuery({
    queryKey: ['volumes-by-journal', selectedJournal],
    queryFn: () => volumesApi.listByJournal(selectedJournal),
    enabled: !!selectedJournal,
  });

  // Fetch issues for selected volume
  const { data: issues, isLoading: issuesLoading, refetch: refetchIssues } = useQuery({
    queryKey: ['issues-by-volume', selectedVolume],
    queryFn: () => issuesApi.listByVolume(parseInt(selectedVolume)),
    enabled: !!selectedVolume,
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

  // Reset selections when parent changes
  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
    setSelectedJournal('');
    setSelectedVolume('');
  };

  const handleJournalChange = (value: string) => {
    setSelectedJournal(value);
    setSelectedVolume('');
  };

  // Create new issue
  const handleCreateIssue = async () => {
    if (!selectedVolume || !newIssue.number) {
      toast.error('Please fill required fields');
      return;
    }

    setCreating(true);
    try {
      await issuesApi.create({
        volume: parseInt(selectedVolume),
        number: parseInt(newIssue.number),
        title: newIssue.title || undefined,
      });
      toast.success('Issue created successfully!');
      setNewIssue({ number: '', title: '' });
      setShowCreateForm(false);
      refetchIssues();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to create issue');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Issues</h1>
      </div>

      {/* Cascading Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Volume</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              onChange={(e) => handleJournalChange(e.target.value)}
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

          {/* Volume Dropdown */}
              <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              3. Select Volume
            </label>
            <select
              value={selectedVolume}
              onChange={(e) => setSelectedVolume(e.target.value)}
              disabled={!selectedJournal}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">-- Select Volume --</option>
              {volumesList.map((volume: any) => (
                <option key={volume.id} value={volume.id}>
                  Volume {volume.number} ({volume.year})
                </option>
              ))}
            </select>
          </div>
        </div>
              </div>

      {/* Issues List & Create Form */}
      {selectedVolume ? (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiFileText className="w-5 h-5 text-academic-navy" />
              <h3 className="font-semibold text-gray-900">
                Issues for Volume {volumesList.find((v: any) => v.id === parseInt(selectedVolume))?.number}
              </h3>
              </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-academic-navy text-white font-medium rounded-lg hover:bg-academic-blue transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Add Issue
            </button>
              </div>

          {/* Create Issue Form */}
          {showCreateForm && (
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issue Number *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newIssue.number}
                    onChange={(e) => setNewIssue({ ...newIssue, number: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
                    placeholder="e.g., 1"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title (Optional)
                </label>
                  <input
                    type="text"
                    value={newIssue.title}
                    onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
                    placeholder="e.g., Special Edition"
                  />
              </div>
                <button
                  onClick={handleCreateIssue}
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

          {/* Issues Table */}
          {issuesLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-academic-navy border-t-transparent rounded-full mx-auto"></div>
          </div>
          ) : issuesList.length > 0 ? (
          <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Issue</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Title</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Articles</th>
                  <th className="text-right px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
              <tbody className="divide-y divide-gray-100">
                {issuesList.map((issue: any) => (
                <tr key={issue.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      Issue {issue.number}
                  </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {issue.title || '-'}
                  </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {issue.article_count || 0}
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
              <FiFileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p>No issues found for this volume.</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="text-academic-blue hover:text-academic-navy font-medium mt-2"
              >
                Create the first issue
              </button>
            </div>
        )}
      </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FiLayers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Volume</h3>
          <p className="text-gray-600">
            Choose a subject, journal, and volume above to view and manage its issues.
          </p>
        </div>
      )}
    </div>
  );
}
