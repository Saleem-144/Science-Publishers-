'use client';

import { useState, useEffect, useRef } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiImage, FiSave, FiX, FiUpload, FiUsers } from 'react-icons/fi';
import Image from 'next/image';
import { editorialBoardApi } from '@/lib/api';
import toast from 'react-hot-toast';
import RichTextEditor from './RichTextEditor';

interface Member {
  id: number;
  designation: string;
  name: string;
  image_url?: string;
  department: string;
  institution: string;
  country: string;
  description: string;
  display_order: number;
}

interface EditorialBoardManagerProps {
  journalId: number;
}

export default function EditorialBoardManager({ journalId }: EditorialBoardManagerProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<Partial<Member> | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Get unique designations from existing members
  const existingDesignations = Array.from(new Set(members.map(m => m.designation))).sort();

  useEffect(() => {
    fetchMembers();
  }, [journalId]);

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setImagePreview(null);
    setImageFile(null);
    // Scroll to form with a small delay to ensure it's rendered
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const fetchMembers = async () => {
    try {
      const data = await editorialBoardApi.list(journalId);
      setMembers(data.results || data || []);
    } catch (error) {
      toast.error('Failed to fetch editorial board members');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!editingMember) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('journal', String(journalId));
    formData.append('designation', editingMember.designation || '');
    formData.append('name', editingMember.name || '');
    formData.append('department', editingMember.department || '');
    formData.append('institution', editingMember.institution || '');
    formData.append('country', editingMember.country || '');
    formData.append('description', editingMember.description || '');
    formData.append('display_order', String(editingMember.display_order || 0));

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (editingMember.id) {
        await editorialBoardApi.update(editingMember.id, formData);
        toast.success('Member updated');
      } else {
        await editorialBoardApi.create(formData);
        toast.success('Member added');
      }
      setEditingMember(null);
      setImageFile(null);
      setImagePreview(null);
      await fetchMembers();
    } catch (error: any) {
      console.error('Save error:', error.response?.data);
      const errorMsg = error.response?.data 
        ? Object.entries(error.response.data).map(([k, v]) => `${k}: ${v}`).join(', ')
        : 'Failed to save member';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    try {
      await editorialBoardApi.delete(id);
      toast.success('Member deleted');
      fetchMembers();
    } catch (error) {
      toast.error('Failed to delete member');
    }
  };

  if (loading) return <div className="p-4 text-center">Loading board members...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Editorial Board Members</h2>
        {!editingMember && (
          <button
            onClick={() => setEditingMember({
              designation: '',
              name: '',
              department: '',
              institution: '',
              country: '',
              description: '',
              display_order: 0
            })}
            className="inline-flex items-center gap-2 px-4 py-2 bg-academic-navy text-white rounded-lg hover:bg-academic-blue"
          >
            <FiPlus /> Add Member
          </button>
        )}
      </div>

      {editingMember && (
        <div ref={formRef} className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">{editingMember.id ? 'Edit Member' : 'Add New Member'}</h3>
            <button type="button" onClick={() => setEditingMember(null)} className="text-gray-500 hover:text-gray-700">
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Designation (e.g. Editor-in-Chief)</label>
                <div className="relative">
                  <input
                    type="text"
                    list="designations-list"
                    required
                    value={editingMember.designation}
                    onChange={(e) => setEditingMember({ ...editingMember, designation: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-academic-blue"
                    placeholder="Select or type designation..."
                  />
                  <datalist id="designations-list">
                    {existingDesignations.map((d) => (
                      <option key={d} value={d} />
                    ))}
                    {!existingDesignations.includes('Editor-in-Chief') && <option value="Editor-in-Chief" />}
                    {!existingDesignations.includes('Associate Editor') && <option value="Associate Editor" />}
                    {!existingDesignations.includes('Section Editor') && <option value="Section Editor" />}
                    {!existingDesignations.includes('Reviewer') && <option value="Reviewer" />}
                  </datalist>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  required
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-academic-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <input
                  type="text"
                  value={editingMember.department}
                  onChange={(e) => setEditingMember({ ...editingMember, department: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-academic-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">School/College/University</label>
                <input
                  type="text"
                  value={editingMember.institution}
                  onChange={(e) => setEditingMember({ ...editingMember, institution: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-academic-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <input
                  type="text"
                  value={editingMember.country}
                  onChange={(e) => setEditingMember({ ...editingMember, country: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-academic-blue"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Member Photo</label>
                <div className="flex items-center gap-4">
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200 bg-white">
                    {(imagePreview || editingMember.image_url) ? (
                      <Image
                        src={imagePreview || editingMember.image_url!}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FiImage className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageSelect}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-3 py-2 border rounded-lg text-sm hover:bg-white"
                    >
                      <FiUpload /> {editingMember.id ? 'Change' : 'Upload'}
                    </button>
                    {(imagePreview || imageFile) && (
                      <button
                        type="button"
                        onClick={() => { setImageFile(null); setImagePreview(null); }}
                        className="block text-xs text-red-500 hover:underline"
                      >
                        Remove selection
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Display Order</label>
                <input
                  type="number"
                  value={editingMember.display_order}
                  onChange={(e) => setEditingMember({ ...editingMember, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-academic-blue"
                />
              </div>
            </div>
          </div>

          <RichTextEditor
            label="Description / Bio"
            value={editingMember.description || ''}
            onChange={(content) => setEditingMember({ ...editingMember, description: content })}
            placeholder="Additional information about this member..."
          />

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700"
            >
              <FiSave /> Save Member
            </button>
            <button
              type="button"
              onClick={() => setEditingMember(null)}
              className="px-6 py-2 border rounded-lg hover:bg-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {members.map((member) => (
          <div key={member.id} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4 shadow-sm">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gray-200 flex-shrink-0 bg-gray-50">
              {member.image_url ? (
                <Image src={member.image_url} alt={member.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <FiUsers className="w-6 h-6" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 truncate">{member.name}</p>
              <p className="text-sm text-academic-blue font-semibold">{member.designation}</p>
              <p className="text-xs text-gray-500 truncate">{member.institution}, {member.country}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleEdit(member)}
                className="p-2 text-gray-400 hover:text-academic-blue transition-colors"
              >
                <FiEdit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(member.id)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        {members.length === 0 && !editingMember && (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            No board members added yet. Click "Add Member" to start.
          </div>
        )}
      </div>
    </div>
  );
}

