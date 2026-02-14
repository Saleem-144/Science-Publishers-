'use client';

import { useState, useEffect, useRef } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiHelpCircle, FiMove } from 'react-icons/fi';
import { faqsApi } from '@/lib/api';
import toast from 'react-hot-toast';
import RichTextEditor from './RichTextEditor';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
}

interface FAQManagerProps {
  journalId: number;
}

export default function FAQManager({ journalId }: FAQManagerProps) {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFAQ, setEditingFAQ] = useState<Partial<FAQ> | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchFAQs();
  }, [journalId]);

  const fetchFAQs = async () => {
    try {
      const data = await faqsApi.list(journalId);
      setFaqs(data.results || data || []);
    } catch (error) {
      toast.error('Failed to fetch FAQs');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFAQ(faq);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSave = async () => {
    if (!editingFAQ || !editingFAQ.question || !editingFAQ.answer) {
      toast.error('Question and Answer are required');
      return;
    }

    setLoading(true);
    const payload = {
      journal: journalId,
      question: editingFAQ.question,
      answer: editingFAQ.answer,
      display_order: editingFAQ.display_order || 0,
      is_active: editingFAQ.is_active ?? true,
    };

    try {
      if (editingFAQ.id) {
        await faqsApi.update(editingFAQ.id, payload);
        toast.success('FAQ updated');
      } else {
        await faqsApi.create(payload);
        toast.success('FAQ added');
      }
      setEditingFAQ(null);
      await fetchFAQs();
    } catch (error: any) {
      toast.error('Failed to save FAQ');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await faqsApi.delete(id);
      toast.success('FAQ deleted');
      fetchFAQs();
    } catch (error) {
      toast.error('Failed to delete FAQ');
    }
  };

  if (loading && faqs.length === 0) return <div className="p-4 text-center">Loading FAQs...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FiHelpCircle className="text-academic-blue" /> Frequently Asked Questions
        </h2>
        {!editingFAQ && (
          <button
            onClick={() => setEditingFAQ({
              question: '',
              answer: '',
              display_order: faqs.length,
              is_active: true
            })}
            className="inline-flex items-center gap-2 px-4 py-2 bg-academic-navy text-white rounded-lg hover:bg-academic-blue transition-colors"
          >
            <FiPlus /> Add FAQ
          </button>
        )}
      </div>

      {editingFAQ && (
        <div ref={formRef} className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">{editingFAQ.id ? 'Edit FAQ' : 'Add New FAQ'}</h3>
            <button type="button" onClick={() => setEditingFAQ(null)} className="text-gray-500 hover:text-gray-700">
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
              <textarea
                required
                value={editingFAQ.question}
                onChange={(e) => setEditingFAQ({ ...editingFAQ, question: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-academic-blue"
                rows={2}
                placeholder="Enter the question..."
              />
            </div>
            
            <RichTextEditor
              label="Answer"
              value={editingFAQ.answer || ''}
              onChange={(content) => setEditingFAQ({ ...editingFAQ, answer: content })}
              placeholder="Enter the answer..."
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <input
                  type="number"
                  value={editingFAQ.display_order}
                  onChange={(e) => setEditingFAQ({ ...editingFAQ, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-academic-blue"
                />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingFAQ.is_active}
                    onChange={(e) => setEditingFAQ({ ...editingFAQ, is_active: e.target.checked })}
                    className="w-4 h-4 text-academic-blue border-gray-300 rounded focus:ring-academic-blue"
                  />
                  <span className="text-sm font-medium text-gray-700">Active / Visible</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
            >
              <FiSave /> Save FAQ
            </button>
            <button
              type="button"
              onClick={() => setEditingFAQ(null)}
              className="px-6 py-2 border rounded-lg hover:bg-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {faqs.map((faq) => (
          <div key={faq.id} className={`bg-white p-4 rounded-xl border flex items-start gap-4 shadow-sm transition-all hover:border-academic-blue/30 ${!faq.is_active ? 'opacity-60 bg-gray-50' : ''}`}>
            <div className="mt-1 text-gray-400">
              <FiHelpCircle className="w-5 h-5 text-academic-blue" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900">{faq.question}</p>
              <div 
                className="text-sm text-gray-500 mt-1 line-clamp-2 ql-editor !p-0"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
              <div className="flex items-center gap-4 mt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                  Order: {faq.display_order}
                </span>
                {!faq.is_active && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-50 px-2 py-0.5 rounded">
                    Inactive
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => handleEdit(faq)}
                className="p-2 text-gray-400 hover:text-academic-blue transition-colors"
                title="Edit FAQ"
              >
                <FiEdit2 className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(faq.id)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Delete FAQ"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        {faqs.length === 0 && !editingFAQ && (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <FiHelpCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No FAQs added for this journal yet.</p>
            <p className="text-sm text-gray-400 mt-1">Click "Add FAQ" to create your first question and answer.</p>
          </div>
        )}
      </div>
    </div>
  );
}

