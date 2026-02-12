'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { FiBook, FiChevronRight, FiArrowLeft } from 'react-icons/fi';
import { journalsApi, volumesApi, articlesApi } from '@/lib/api';
import { ArticleCard } from '@/components/ArticleCard';

export default function VolumeDetailPage() {
  const params = useParams();
  const journalSlug = params.journal_slug as string;
  const volumeNumber = params.volume_number as string;

  const { data: journal } = useQuery({
    queryKey: ['journal', journalSlug],
    queryFn: () => journalsApi.getBySlug(journalSlug),
    enabled: !!journalSlug,
  });

  const { data: volume, isLoading: volumeLoading } = useQuery({
    queryKey: ['volume', journalSlug, volumeNumber],
    queryFn: () => volumesApi.getByNumber(journalSlug, volumeNumber),
    enabled: !!journalSlug && !!volumeNumber,
  });

  const { data: articlesData, isLoading: articlesLoading } = useQuery({
    queryKey: ['volume-articles', volume?.id],
    queryFn: () => articlesApi.list({ volume: volume?.id }),
    enabled: !!volume?.id,
  });

  const articles = articlesData?.results || articlesData || [];

  // Group articles by issue
  const groupedArticles = articles.reduce((acc: any, article: any) => {
    const issueNum = article.issue_number || 'No Issue';
    const key = issueNum === 'No Issue' ? 'Other Articles' : `Issue ${issueNum}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(article);
    return acc;
  }, {});

  if (volumeLoading || articlesLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-academic-navy border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!volume) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Volume Not Found</h1>
          <p className="text-gray-600 mb-4">The volume you're looking for doesn't exist.</p>
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
          <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <Link href="/" className="hover:text-academic-blue transition-colors">Home</Link>
            <FiChevronRight className="w-3 h-3" />
            <Link href={`/${journalSlug}`} className="hover:text-academic-blue transition-colors">
              {journal?.short_title || journal?.title}
            </Link>
            <FiChevronRight className="w-3 h-3" />
            <Link href={`/${journalSlug}/volumes`} className="hover:text-academic-blue transition-colors">
              Volumes
            </Link>
            <FiChevronRight className="w-3 h-3" />
            <span className="text-gray-900">Volume {volume.volume_number}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href={`/${journalSlug}`}
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-academic-blue mb-8 transition-all group"
        >
          <FiArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
          Back to Journal
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-academic-navy rounded-xl flex items-center justify-center text-white">
              <FiBook className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-black text-gray-900">
                Volume {volume.volume_number}
              </h1>
              <p className="text-academic-gold font-bold tracking-widest uppercase text-xs">
                Published in {volume.year}
              </p>
            </div>
          </div>
          {volume.description && (
            <div className="text-gray-600 italic border-l-4 border-gray-100 pl-6 mt-6 max-w-3xl">
              {volume.description}
            </div>
          )}
        </header>

        <div className="space-y-12">
          {Object.keys(groupedArticles).length > 0 ? (
            Object.entries(groupedArticles).map(([issueKey, issueArticles]: [string, any]) => (
              <div key={issueKey} className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-black text-academic-navy uppercase tracking-wider whitespace-nowrap">
                    {issueKey}
                  </h2>
                  <div className="h-px flex-1 bg-gray-200"></div>
                </div>
                <div className="space-y-4">
                  {issueArticles.map((article: any) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-400 italic">No articles found in this volume.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

