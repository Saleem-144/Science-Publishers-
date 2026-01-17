'use client';

import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiPlus, FiEdit2, FiTrash2, FiExternalLink, FiImage, FiX, FiCheck, FiUpload } from 'react-icons/fi';
import { affiliationsApi } from '@/lib/api';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface Affiliation {
  id: number;
  name: string;
  logo: string;
  logo_url: string;
  url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function AffiliationsPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  
  // State for add form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newLogo, setNewLogo] = useState<File | null>(null);
  const [newLogoPreview, setNewLogoPreview] = useState<string | null>(null);
  const [newDisplayOrder, setNewDisplayOrder] = useState(0);
  
  // State for edit
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editLogo, setEditLogo] = useState<File | null>(null);
  const [editLogoPreview, setEditLogoPreview] = useState<string | null>(null);
  const [editDisplayOrder, setEditDisplayOrder] = useState(0);
  
  // Fetch affiliations
  const { data: affiliations, isLoading } = useQuery({
    queryKey: ['admin-affiliations'],
    queryFn: affiliationsApi.adminList,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (formData: FormData) => affiliationsApi.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-affiliations'] });
      toast.success('Affiliation added successfully!');
      resetAddForm();
    },
    onError: () => {
      toast.error('Failed to add affiliation');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) => 
      affiliationsApi.update(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-affiliations'] });
      toast.success('Affiliation updated successfully!');
      cancelEdit();
    },
    onError: () => {
      toast.error('Failed to update affiliation');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => affiliationsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-affiliations'] });
      toast.success('Affiliation deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete affiliation');
    },
  });

  const resetAddForm = () => {
    setShowAddForm(false);
    setNewName('');
    setNewUrl('');
    setNewLogo(null);
    setNewLogoPreview(null);
    setNewDisplayOrder(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddSubmit = () => {
    if (!newName.trim() || !newLogo) {
      toast.error('Please provide a name and logo');
      return;
    }

    const formData = new FormData();
    formData.append('name', newName.trim());
    formData.append('url', newUrl.trim());
    formData.append('logo', newLogo);
    formData.append('display_order', String(newDisplayOrder));
    formData.append('is_active', 'true');

    createMutation.mutate(formData);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type - only JPG and PNG allowed
      const fileType = file.type.toLowerCase();
      const fileName = file.name.toLowerCase();
      const isValidType = 
        fileType === 'image/jpeg' || 
        fileType === 'image/jpg' || 
        fileType === 'image/png' ||
        fileName.endsWith('.jpg') ||
        fileName.endsWith('.jpeg') ||
        fileName.endsWith('.png');
      
      if (!isValidType) {
        toast.error('Only JPG and PNG image formats are allowed.');
        e.target.value = ''; // Clear the input
        return;
      }
      
      if (isEdit) {
        setEditLogo(file);
        const reader = new FileReader();
        reader.onload = (e) => setEditLogoPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setNewLogo(file);
        const reader = new FileReader();
        reader.onload = (e) => setNewLogoPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  const startEdit = (affiliation: Affiliation) => {
    setEditingId(affiliation.id);
    setEditName(affiliation.name);
    setEditUrl(affiliation.url || '');
    setEditDisplayOrder(affiliation.display_order);
    setEditLogo(null);
    setEditLogoPreview(affiliation.logo_url);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditUrl('');
    setEditLogo(null);
    setEditLogoPreview(null);
    setEditDisplayOrder(0);
    if (editFileInputRef.current) editFileInputRef.current.value = '';
  };

  const handleEditSubmit = () => {
    if (!editName.trim()) {
      toast.error('Please provide a name');
      return;
    }

    const formData = new FormData();
    formData.append('name', editName.trim());
    formData.append('url', editUrl.trim());
    formData.append('display_order', String(editDisplayOrder));
    if (editLogo) {
      formData.append('logo', editLogo);
    }

    updateMutation.mutate({ id: editingId!, formData });
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"? This will remove it from the website.`)) {
      deleteMutation.mutate(id);
    }
  };

  const affiliationsList = affiliations?.results || affiliations || [];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Corporate Affiliations</h1>
          <p className="text-gray-600 mt-1">Manage partner logos displayed on the homepage</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-academic-navy text-white rounded-lg hover:bg-academic-blue transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          Add Affiliation
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Add New Affiliation</h2>
            <button onClick={resetAddForm} className="text-gray-400 hover:text-gray-600">
              <FiX className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo <span className="text-red-500">*</span>
              </label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-academic-blue transition-colors"
              >
                {newLogoPreview ? (
                  <div className="relative h-24 w-full">
                    <Image
                      src={newLogoPreview}
                      alt="Logo preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div>
                    <FiUpload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Click to upload logo</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG only</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,.jpg,.jpeg,.png"
                onChange={(e) => handleFileSelect(e, false)}
                className="hidden"
              />
            </div>
            
            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g., Crossref"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={newDisplayOrder}
                  onChange={(e) => setNewDisplayOrder(Number(e.target.value))}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              onClick={resetAddForm}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={handleAddSubmit}
              disabled={createMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-academic-navy text-white rounded-lg hover:bg-academic-blue disabled:opacity-50 transition-colors"
            >
              {createMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <FiCheck className="w-5 h-5" />
                  Add Affiliation
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Affiliations List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : affiliationsList.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FiImage className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Affiliations Yet</h3>
          <p className="text-gray-500 mb-4">Add your first corporate affiliation to display partner logos on the homepage.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-academic-navy text-white rounded-lg hover:bg-academic-blue transition-colors"
          >
            <FiPlus className="w-5 h-5" />
            Add Affiliation
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Logo</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Name</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">URL</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700">Order</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {affiliationsList.map((affiliation: Affiliation) => (
                <tr key={affiliation.id} className="hover:bg-gray-50">
                  {editingId === affiliation.id ? (
                    // Edit Mode
                    <>
                      <td className="px-6 py-4">
                        <div 
                          onClick={() => editFileInputRef.current?.click()}
                          className="w-20 h-12 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-academic-blue relative overflow-hidden"
                        >
                          {editLogoPreview && (
                            <Image
                              src={editLogoPreview}
                              alt="Edit preview"
                              fill
                              className="object-contain p-1"
                            />
                          )}
                        </div>
                        <input
                          ref={editFileInputRef}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileSelect(e, true)}
                          className="hidden"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-academic-blue"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="url"
                          value={editUrl}
                          onChange={(e) => setEditUrl(e.target.value)}
                          placeholder="https://..."
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-academic-blue"
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input
                          type="number"
                          value={editDisplayOrder}
                          onChange={(e) => setEditDisplayOrder(Number(e.target.value))}
                          min="0"
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-academic-blue"
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          affiliation.is_active 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {affiliation.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={cancelEdit}
                            className="p-2 text-gray-400 hover:text-gray-600"
                          >
                            <FiX className="w-5 h-5" />
                          </button>
                          <button
                            onClick={handleEditSubmit}
                            disabled={updateMutation.isPending}
                            className="p-2 text-green-600 hover:text-green-700"
                          >
                            {updateMutation.isPending ? (
                              <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <FiCheck className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    // View Mode
                    <>
                      <td className="px-6 py-4">
                        <div className="relative w-20 h-12">
                          {affiliation.logo_url ? (
                            <Image
                              src={affiliation.logo_url}
                              alt={affiliation.name}
                              fill
                              className="object-contain"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                              <FiImage className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {affiliation.name}
                      </td>
                      <td className="px-6 py-4">
                        {affiliation.url ? (
                          <a
                            href={affiliation.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-academic-blue hover:underline flex items-center gap-1 text-sm"
                          >
                            {new URL(affiliation.url).hostname}
                            <FiExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">No URL</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-600">
                        {affiliation.display_order}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          affiliation.is_active 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {affiliation.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => startEdit(affiliation)}
                            className="p-2 text-gray-400 hover:text-academic-blue transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(affiliation.id, affiliation.name)}
                            disabled={deleteMutation.isPending}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


