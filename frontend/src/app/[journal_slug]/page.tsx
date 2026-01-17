'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { FiCalendar, FiBook, FiFileText, FiUsers, FiExternalLink, FiArrowRight } from 'react-icons/fi';
import { journalsApi, articlesApi } from '@/lib/api';
import { ArticleCard } from '@/components/ArticleCard';

export default function JournalPage() {
  const params = useParams();
  const journalSlug = params.journal_slug as string;

  const { data: journal, isLoading: journalLoading } = useQuery({
    queryKey: ['journal', journalSlug],
    queryFn: () => journalsApi.getBySlug(journalSlug),
    enabled: !!journalSlug,
  });

  const { data: articles, isLoading: articlesLoading } = useQuery({
    queryKey: ['journal-articles', journalSlug],
    queryFn: () => articlesApi.recent(journalSlug),
    enabled: !!journalSlug,
  });

  const articlesList = articles?.results || articles || [];

  if (journalLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-academic-navy border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!journal) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Journal Not Found</h1>
          <p className="text-gray-600 mb-4">The journal you're looking for doesn't exist.</p>
          <Link href="/journals" className="text-academic-blue hover:text-academic-navy">
            Browse all journals →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* Journal Header */}
      <section 
        className="relative py-16 md:py-24 text-white"
        style={{ 
          backgroundColor: journal.primary_color || '#1e3a5f',
          backgroundImage: `linear-gradient(135deg, ${journal.primary_color || '#1e3a5f'} 0%, ${journal.secondary_color || '#2563eb'} 100%)`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Cover Image */}
            {journal.cover_image && (
              <div className="flex-shrink-0">
                <div className="w-48 h-64 relative rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src={journal.cover_image}
                    alt={journal.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* Journal Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                {journal.title}
              </h1>
              
              {journal.short_title && (
                <p className="text-xl text-white/80 mb-4">{journal.short_title}</p>
              )}

              <p className="text-lg text-white/90 mb-6 max-w-2xl">
                {journal.description || journal.short_description}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-6 text-sm">
                {journal.issn_print && (
                  <div>
                    <span className="text-white/60">ISSN (Print):</span>
                    <span className="ml-2 font-medium">{journal.issn_print}</span>
                  </div>
                )}
                {journal.issn_online && (
                  <div>
                    <span className="text-white/60">ISSN (Online):</span>
                    <span className="ml-2 font-medium">{journal.issn_online}</span>
                  </div>
                )}
                {journal.frequency && (
                  <div>
                    <span className="text-white/60">Frequency:</span>
                    <span className="ml-2 font-medium">{journal.frequency}</span>
                  </div>
                )}
              </div>

              {/* Editor Info */}
              {journal.editor_in_chief && (
                <div className="mt-6 flex items-center gap-3">
                  <FiUsers className="w-5 h-5 text-white/60" />
                  <span className="text-white/60">Editor-in-Chief:</span>
                  <span className="font-medium">{journal.editor_in_chief}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap justify-center md:justify-start gap-8 md:gap-16">
            <div className="text-center">
              <p className="text-3xl font-bold text-academic-navy">{journal.total_volumes || 0}</p>
              <p className="text-sm text-gray-600">Volumes</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-academic-navy">{journal.total_issues || 0}</p>
              <p className="text-sm text-gray-600">Issues</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-academic-navy">{journal.total_articles || 0}</p>
              <p className="text-sm text-gray-600">Articles</p>
            </div>
            {journal.founding_year && (
              <div className="text-center">
                <p className="text-3xl font-bold text-academic-navy">{journal.founding_year}</p>
                <p className="text-sm text-gray-600">Founded</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-4">
            <Link
              href={`/${journalSlug}/volumes`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 hover:border-academic-blue hover:text-academic-blue transition-colors"
            >
              <FiBook className="w-4 h-4" />
              Browse Volumes
            </Link>
            <Link
              href={`/search?journal=${journalSlug}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 hover:border-academic-blue hover:text-academic-blue transition-colors"
            >
              <FiFileText className="w-4 h-4" />
              Search Articles
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Articles */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-bold text-academic-navy">
              Recent Articles
            </h2>
            <Link
              href={`/${journalSlug}/volumes`}
              className="inline-flex items-center gap-2 text-academic-blue hover:text-academic-navy font-medium"
            >
              View All
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {articlesLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : articlesList.length > 0 ? (
            <div className="space-y-4">
              {articlesList.slice(0, 5).map((article: any) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl">
              <p className="text-gray-600">No articles published yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
