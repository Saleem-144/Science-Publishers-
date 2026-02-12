'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { FiChevronRight, FiCalendar, FiFileText } from 'react-icons/fi';
import { journalsApi, issuesApi, articlesApi } from '@/lib/api';
import { ArticleCard } from '@/components/ArticleCard';

export default function IssuePage() {
  const params = useParams();
  const journalSlug = params.journal_slug as string;
  const issueNumber = params.issue_number as string;

  const { data: journal } = useQuery({
    queryKey: ['journal', journalSlug],
    queryFn: () => journalsApi.getBySlug(journalSlug),
    enabled: !!journalSlug,
  });

  const { data: issue, isLoading: issueLoading } = useQuery({
    queryKey: ['issue', journalSlug, issueNumber],
    queryFn: () => issuesApi.getByNumber(journalSlug, parseInt(issueNumber)),
    enabled: !!journalSlug && !!issueNumber,
  });

  const { data: articles, isLoading: articlesLoading } = useQuery({
    queryKey: ['issue-articles', issue?.id],
    queryFn: () => articlesApi.listByIssue(issue.id),
    enabled: !!issue?.id,
  });

  const articlesList = articles?.results || articles || [];

  if (issueLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-academic-navy border-t-transparent rounded-full"></div>
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
            <Link href={`/${journalSlug}/volumes`} className="text-gray-500 hover:text-academic-blue">
              Volumes
            </Link>
            <FiChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">Issue {issueNumber}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="bg-academic-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-blue-200 mb-2">{journal?.title}</p>
          <h1 className="text-3xl font-serif font-bold mb-4">
            Volume {issue?.volume_number}, Issue {issue?.issue_number}
          </h1>
          {issue?.publication_date && (
            <div className="flex items-center gap-2 text-blue-100">
              <FiCalendar className="w-4 h-4" />
              <span>Published: {new Date(issue.publication_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
          )}
        </div>
      </section>

      {/* Articles */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-8">
            <FiFileText className="w-5 h-5 text-academic-navy" />
            <h2 className="text-xl font-bold text-academic-navy">
              Articles in this Issue
            </h2>
            <span className="text-gray-500">({articlesList.length})</span>
          </div>

          {articlesLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : articlesList.length > 0 ? (
            <div className="space-y-4">
              {articlesList.map((article: any) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl">
              <p className="text-gray-600">No articles in this issue.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
