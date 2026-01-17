'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { FiChevronRight, FiDownload, FiArrowLeft } from 'react-icons/fi';
import { journalsApi, articlesApi } from '@/lib/api';

export default function FullTextPage() {
  const params = useParams();
  const journalSlug = params.journal_slug as string;
  const articleSlug = params.article_slug as string;

  const { data: journal } = useQuery({
    queryKey: ['journal', journalSlug],
    queryFn: () => journalsApi.getBySlug(journalSlug),
    enabled: !!journalSlug,
  });

  const { data: article, isLoading: articleLoading } = useQuery({
    queryKey: ['article', journalSlug, articleSlug],
    queryFn: () => articlesApi.getBySlug(journalSlug, articleSlug),
    enabled: !!journalSlug && !!articleSlug,
  });

  const { data: fullText, isLoading: fullTextLoading } = useQuery({
    queryKey: ['article-fulltext', journalSlug, articleSlug],
    queryFn: () => articlesApi.getFullText(journalSlug, articleSlug),
    enabled: !!journalSlug && !!articleSlug,
  });

  const isLoading = articleLoading || fullTextLoading;

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
            <Link href={`/${journalSlug}/article/${articleSlug}`} className="text-gray-500 hover:text-academic-blue truncate max-w-xs">
              {article.title}
            </Link>
            <FiChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">Full Text</span>
          </nav>
        </div>
      </div>

      {/* Article Header */}
      <section className="bg-white py-6 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href={`/${journalSlug}/article/${articleSlug}`}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-academic-blue"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back to Abstract
            </Link>
            <a
              href={articlesApi.getPdfUrl(journalSlug, articleSlug)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-academic-navy text-white font-medium rounded-lg hover:bg-academic-blue transition-colors"
            >
              <FiDownload className="w-4 h-4" />
              Download PDF
            </a>
          </div>

          <h1 className="text-xl md:text-2xl font-serif font-bold text-gray-900 mt-6">
            {article.title}
          </h1>

          {article.authors && article.authors.length > 0 && (
            <p className="text-gray-600 mt-2">
              {article.authors.map((a: any) => a.full_name).join(', ')}
            </p>
          )}
        </div>
      </section>

      {/* Full Text Content */}
      <section className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="bg-white rounded-xl shadow-md p-6 md:p-8">
            {fullText?.content ? (
              <div 
                className="prose prose-lg max-w-none prose-headings:text-academic-navy prose-a:text-academic-blue"
                dangerouslySetInnerHTML={{ __html: fullText.content }}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">Full text is not available for this article.</p>
                <a
                  href={articlesApi.getPdfUrl(journalSlug, articleSlug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-academic-blue hover:text-academic-navy font-medium"
                >
                  <FiDownload className="w-4 h-4" />
                  Download PDF instead
                </a>
              </div>
            )}
          </article>
        </div>
      </section>
    </div>
  );
}
