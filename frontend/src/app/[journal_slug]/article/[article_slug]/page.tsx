'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { FiChevronRight, FiDownload, FiFileText, FiUser, FiCalendar, FiTag, FiBookOpen } from 'react-icons/fi';
import { journalsApi, articlesApi } from '@/lib/api';

export default function ArticlePage() {
  const params = useParams();
  const journalSlug = params.journal_slug as string;
  const articleSlug = params.article_slug as string;

  const { data: journal } = useQuery({
    queryKey: ['journal', journalSlug],
    queryFn: () => journalsApi.getBySlug(journalSlug),
    enabled: !!journalSlug,
  });

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', journalSlug, articleSlug],
    queryFn: () => articlesApi.getBySlug(journalSlug, articleSlug),
    enabled: !!journalSlug && !!articleSlug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-academic-navy border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h1>
          <p className="text-gray-600 mb-4">The article you're looking for doesn't exist.</p>
          <Link href={`/${journalSlug}`} className="text-academic-blue hover:text-academic-navy">
            Back to journal →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm flex-wrap">
            <Link href="/journals" className="text-gray-500 hover:text-academic-blue">
              Journals
            </Link>
            <FiChevronRight className="w-4 h-4 text-gray-400" />
            <Link href={`/${journalSlug}`} className="text-gray-500 hover:text-academic-blue">
              {journal?.short_title || journal?.title}
            </Link>
            <FiChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium truncate max-w-xs">{article.title}</span>
          </nav>
        </div>
      </div>

      {/* Article Header */}
      <section className="bg-white py-8 md:py-12 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Article Type Badge */}
          {article.article_type && (
            <span className="inline-block px-3 py-1 bg-academic-navy/10 text-academic-navy text-sm font-medium rounded-full mb-4">
              {article.article_type}
            </span>
          )}

          <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Authors */}
          {article.authors && article.authors.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <FiUser className="w-4 h-4 text-gray-400" />
                {article.authors.map((author: any, index: number) => (
                  <span key={author.id} className="text-gray-700">
                    {author.full_name}
                    {author.is_corresponding && (
                      <span className="text-academic-gold" title="Corresponding author">*</span>
                    )}
                    {index < article.authors.length - 1 && ', '}
                  </span>
                ))}
              </div>
              {article.authors.some((a: any) => a.affiliation) && (
                <div className="mt-2 text-sm text-gray-500">
                  {article.authors.map((author: any) => author.affiliation).filter(Boolean).join('; ')}
                </div>
              )}
            </div>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-6">
            {article.published_date && (
              <div className="flex items-center gap-2">
                <FiCalendar className="w-4 h-4" />
                <span>Published: {new Date(article.published_date).toLocaleDateString()}</span>
              </div>
            )}
            {article.doi && (
              <div className="flex items-center gap-2">
                <FiTag className="w-4 h-4" />
                <span>DOI: {article.doi}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${journalSlug}/article/${articleSlug}/fulltext`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-academic-navy text-white font-medium rounded-lg hover:bg-academic-blue transition-colors"
            >
              <FiBookOpen className="w-4 h-4" />
              Read Full Text
            </Link>
            <a
              href={articlesApi.getPdfUrl(journalSlug, articleSlug)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:border-academic-blue hover:text-academic-blue transition-colors"
            >
              <FiDownload className="w-4 h-4" />
              Download PDF
            </a>
          </div>
        </div>
      </section>

      {/* Abstract */}
      <section className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <h2 className="text-xl font-bold text-academic-navy mb-4">Abstract</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {article.abstract || 'No abstract available.'}
            </p>

            {/* Keywords */}
            {article.keywords && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {article.keywords.split(',').map((keyword: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {keyword.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Citation Info */}
          <div className="mt-6 bg-white rounded-xl shadow-md p-6 md:p-8">
            <h2 className="text-lg font-bold text-academic-navy mb-4">How to Cite</h2>
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 font-mono">
              {article.authors?.map((a: any) => a.full_name).join(', ')} ({new Date(article.published_date || Date.now()).getFullYear()}). {article.title}. <em>{journal?.title}</em>.
              {article.doi && ` https://doi.org/${article.doi}`}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
