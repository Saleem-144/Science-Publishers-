'use client';

import { useState, useEffect } from 'react';
import { 
  FiPlus, FiTrash2, FiEdit2, FiCheck, FiX, 
  FiUser, FiMail, FiMapPin, FiAward, FiBook
} from 'react-icons/fi';
import { authorsApi, articlesApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface Author {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  orcid_id: string;
  affiliation: string;
  department: string;
  bio: string;
}

interface ArticleAuthor {
  id?: number; // ArticleAuthor relation ID
  author_id: number; // Author ID
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  orcid_id: string;
  affiliation: string; // Author's primary
  department: string;
  bio: string;
  author_order: number;
  is_corresponding: boolean;
  author_contribution: string;
}

interface AuthorManagerProps {
  articleId: number;
  initialAuthors: any[];
  onAuthorsUpdate?: (authors: any[]) => void;
}

export function AuthorManager({ articleId, initialAuthors, onAuthorsUpdate }: AuthorManagerProps) {
  const [articleAuthors, setArticleAuthors] = useState<ArticleAuthor[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingAuthorId, setEditingAuthorId] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [authorForm, setAuthorForm] = useState<Partial<Author>>({
    first_name: '',
    last_name: '',
    email: '',
    orcid_id: '',
    affiliation: '',
    department: '',
    bio: ''
  });

  const [linkForm, setLinkForm] = useState({
    is_corresponding: false,
    author_order: 1,
    author_contribution: ''
  });

  useEffect(() => {
    if (initialAuthors) {
      const formatted = initialAuthors.map((aa: any) => ({
        author_id: aa.id,
        first_name: aa.first_name,
        last_name: aa.last_name,
        full_name: aa.full_name,
        email: aa.email,
        orcid_id: aa.orcid_id || '',
        affiliation: aa.affiliation,
        department: aa.department,
        bio: aa.bio,
        author_order: aa.author_order || 1,
        is_corresponding: aa.is_corresponding || false,
        author_contribution: aa.contribution || ''
      }));
      setArticleAuthors(formatted);
    }
  }, [initialAuthors]);

  const handleAddAuthor = async () => {
    if (!authorForm.first_name || !authorForm.last_name) {
      toast.error('First and last name are required');
      return;
    }

    setLoading(true);
    try {
      let savedAuthor;
      if (editingAuthorId) {
        // Update existing author metadata
        savedAuthor = await authorsApi.update(editingAuthorId, authorForm);
        
        // Update local state for the specific author
        const updatedAuthors = articleAuthors.map((aa, idx) => 
          idx === editingIndex 
            ? { 
                ...aa, 
                ...savedAuthor, 
                author_id: savedAuthor.id,
                orcid_id: savedAuthor.orcid_id,
                is_corresponding: linkForm.is_corresponding,
                author_contribution: linkForm.author_contribution
              } 
            : aa
        );
        setArticleAuthors(updatedAuthors);
        await saveAuthorsToBackend(updatedAuthors);
        toast.success('Author updated successfully');
      } else {
        // 1. Create the author
        savedAuthor = await authorsApi.create(authorForm);
        
        // 2. Add to local state
        const newArticleAuthor: ArticleAuthor = {
          author_id: savedAuthor.id,
          first_name: savedAuthor.first_name,
          last_name: savedAuthor.last_name,
          full_name: savedAuthor.full_name,
          email: savedAuthor.email,
          orcid_id: savedAuthor.orcid_id,
          affiliation: savedAuthor.affiliation,
          department: savedAuthor.department,
          bio: savedAuthor.bio,
          author_order: articleAuthors.length + 1,
          is_corresponding: linkForm.is_corresponding,
          author_contribution: linkForm.author_contribution
        };

        const updatedAuthors = [...articleAuthors, newArticleAuthor];
        setArticleAuthors(updatedAuthors);
        
        // 3. Save to backend
        await saveAuthorsToBackend(updatedAuthors);
        toast.success('Author added successfully');
      }

      // Reset form
      handleCancelEdit();
      
    } catch (error: any) {
      console.error('Error saving author:', error);
      toast.error(error.response?.data?.detail || 'Failed to save author');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAuthor = (aa: ArticleAuthor, index: number) => {
    setEditingAuthorId(aa.author_id);
    setEditingIndex(index);
    setAuthorForm({
      first_name: aa.first_name || '',
      last_name: aa.last_name || '',
      email: aa.email || '',
      orcid_id: aa.orcid_id || '',
      affiliation: aa.affiliation || '',
      department: aa.department || '',
      bio: aa.bio || ''
    });
    setLinkForm({
      is_corresponding: aa.is_corresponding,
      author_order: aa.author_order,
      author_contribution: aa.author_contribution
    });
    setIsAddingNew(true);
  };

  const handleCancelEdit = () => {
    setAuthorForm({ first_name: '', last_name: '', email: '', orcid_id: '', affiliation: '', department: '', bio: '' });
    setLinkForm({ is_corresponding: false, author_order: articleAuthors.length + 1, author_contribution: '' });
    setIsAddingNew(false);
    setEditingAuthorId(null);
    setEditingIndex(null);
  };

  const handleDeleteAuthor = async (index: number) => {
    const updatedAuthors = articleAuthors.filter((_, i) => i !== index);
    setArticleAuthors(updatedAuthors);
    await saveAuthorsToBackend(updatedAuthors);
    toast.success('Author removed from article');
  };

  const saveAuthorsToBackend = async (authors: ArticleAuthor[]) => {
    try {
      const payload = authors.map(aa => ({
        author_id: aa.author_id,
        author_order: aa.author_order,
        is_corresponding: aa.is_corresponding,
        author_contribution: aa.author_contribution
      }));
      await articlesApi.updateAuthors(articleId, payload);
      
      // Map back to parent format
      const parentFormat = authors.map(aa => ({
        id: aa.author_id,
        first_name: aa.first_name,
        last_name: aa.last_name,
        full_name: aa.full_name,
        email: aa.email,
        orcid_id: aa.orcid_id,
        affiliation: aa.affiliation,
        department: aa.department,
        bio: aa.bio,
        author_order: aa.author_order,
        is_corresponding: aa.is_corresponding,
        contribution: aa.author_contribution
      }));
      
      if (onAuthorsUpdate) onAuthorsUpdate(parentFormat);
    } catch (error) {
      console.error('Failed to sync authors:', error);
      toast.error('Failed to sync authors with server');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <FiUser className="text-academic-blue" />
          Article Authors
        </h3>
        {!isAddingNew && (
          <button
            type="button"
            onClick={() => setIsAddingNew(true)}
            className="text-xs font-bold uppercase tracking-widest bg-academic-navy text-white px-3 py-1.5 rounded-md hover:bg-academic-blue transition-colors flex items-center gap-1"
          >
            <FiPlus /> Add Author
          </button>
        )}
      </div>

      <div className="p-4">
        {isAddingNew && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wider">
                {editingAuthorId ? 'Edit Author' : 'Add New Author'}
              </h4>
              <button 
                type="button"
                onClick={handleCancelEdit} 
                className="text-blue-500 hover:text-blue-700"
              >
                <FiX />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-blue-700 uppercase mb-1">First Name *</label>
                <input
                  type="text"
                  value={authorForm.first_name}
                  onChange={(e) => setAuthorForm({ ...authorForm, first_name: e.target.value })}
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-academic-blue"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-blue-700 uppercase mb-1">Last Name *</label>
                <input
                  type="text"
                  value={authorForm.last_name}
                  onChange={(e) => setAuthorForm({ ...authorForm, last_name: e.target.value })}
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-academic-blue"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-blue-700 uppercase mb-1">Email</label>
                <input
                  type="email"
                  value={authorForm.email}
                  onChange={(e) => setAuthorForm({ ...authorForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-academic-blue"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-blue-700 uppercase mb-1">ORCiD ID (e.g., 0000-0002-1825-0097)</label>
                <input
                  type="text"
                  value={authorForm.orcid_id}
                  onChange={(e) => setAuthorForm({ ...authorForm, orcid_id: e.target.value })}
                  placeholder="https://orcid.org/0000-0002-1825-0097"
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-academic-blue"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-blue-700 uppercase mb-1">University / College Name (Affiliation)</label>
                <input
                  type="text"
                  value={authorForm.affiliation}
                  onChange={(e) => setAuthorForm({ ...authorForm, affiliation: e.target.value })}
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-academic-blue"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-blue-700 uppercase mb-1">Department Name</label>
                <input
                  type="text"
                  value={authorForm.department}
                  onChange={(e) => setAuthorForm({ ...authorForm, department: e.target.value })}
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-academic-blue"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-blue-700 uppercase mb-1">Description (Bio)</label>
                <textarea
                  rows={3}
                  value={authorForm.bio}
                  onChange={(e) => setAuthorForm({ ...authorForm, bio: e.target.value })}
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-academic-blue resize-none"
                />
              </div>
              
              <div className="flex items-center gap-4 py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={linkForm.is_corresponding}
                    onChange={(e) => setLinkForm({ ...linkForm, is_corresponding: e.target.checked })}
                    className="w-4 h-4 text-academic-blue border-blue-300 rounded focus:ring-academic-blue"
                  />
                  <span className="text-xs font-bold text-blue-900 uppercase">Corresponding Author</span>
                </label>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddAuthor}
              disabled={loading}
              className="w-full py-2 bg-academic-navy text-white rounded-lg font-bold hover:bg-academic-blue transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <FiCheck />}
              Save Author to Article
            </button>
          </div>
        )}

        <div className="space-y-3">
          {articleAuthors.length === 0 ? (
            <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
              <FiUser className="w-8 h-8 mx-auto mb-2 opacity-20" />
              <p className="text-sm">No authors added yet.</p>
            </div>
          ) : (
            articleAuthors.sort((a, b) => a.author_order - b.author_order).map((aa, index) => (
              <div 
                key={aa.author_id || `new-${index}`}
                className="group flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-academic-blue hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-academic-navy font-bold text-sm">
                    {aa.author_order}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                      {aa.full_name}
                      {aa.is_corresponding && (
                        <span className="px-2 py-0.5 bg-academic-gold/20 text-academic-gold text-[10px] font-bold uppercase rounded">
                          Corresponding
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-1 italic">
                      {[aa.department, aa.affiliation].filter(Boolean).join(', ') || 'No affiliation set'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => handleEditAuthor(aa, index)}
                    className="p-2 text-gray-400 hover:text-academic-blue hover:bg-blue-50 rounded-lg transition-all"
                    title="Edit Author"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteAuthor(index)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Remove Author"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

