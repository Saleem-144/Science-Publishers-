'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { articlesApi, journalsApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    abstract: '',
    keywords: '',
    journal_id: '',
    status: 'draft',
  });

  const { data: journals } = useQuery({
    queryKey: ['journals-select'],
    queryFn: journalsApi.list,
  });

  const journalsList = journals?.results || journals || [];

  useEffect(() => {
  const fetchArticle = async () => {
    try {
        const article = await articlesApi.get(articleId);
      setFormData({
        title: article.title || '',
        slug: article.slug || '',
        abstract: article.abstract || '',
          keywords: article.keywords || '',
          journal_id: article.issue?.volume?.journal?.id || '',
          status: article.status || 'draft',
        });
    } catch (error) {
        toast.error('Failed to fetch article');
      router.push('/admin/articles');
    } finally {
        setFetching(false);
    }
  };

    fetchArticle();
  }, [articleId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await articlesApi.update(articleId, formData);
      toast.success('Article updated successfully!');
      router.push('/admin/articles');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to update article');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-academic-navy border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href="/admin/articles"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-academic-navy"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Articles
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Article</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Article Title *
            </label>
              <input
                type="text"
              required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
              />
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Slug *
            </label>
              <input
                type="text"
              required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
              />
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Journal
            </label>
            <select
              value={formData.journal_id}
              onChange={(e) => setFormData({ ...formData, journal_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
            >
              <option value="">Select a journal</option>
              {journalsList.map((journal: any) => (
                <option key={journal.id} value={journal.id}>
                  {journal.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Abstract
            </label>
            <textarea
              rows={6}
              value={formData.abstract}
              onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Keywords
            </label>
            <input
              type="text"
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
              placeholder="Comma-separated keywords"
            />
          </div>

            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
              >
                <option value="draft">Draft</option>
              <option value="review">Under Review</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

        <div className="flex items-center gap-4">
            <button
              type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-academic-navy text-white font-semibold rounded-lg hover:bg-academic-blue transition-colors disabled:opacity-50"
            >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <FiSave className="w-5 h-5" />
                Save Changes
              </>
            )}
            </button>
          <Link
            href="/admin/articles"
            className="px-6 py-3 text-gray-600 font-semibold hover:text-gray-900"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
