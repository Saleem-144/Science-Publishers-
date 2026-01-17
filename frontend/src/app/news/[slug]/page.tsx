'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiCalendar, FiArrowLeft } from 'react-icons/fi';
import { announcementsApi } from '@/lib/api';

interface Announcement {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string | null;
  author_name: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: announcement, isLoading, error } = useQuery({
    queryKey: ['announcement', slug],
    queryFn: () => announcementsApi.getBySlug(slug),
    enabled: !!slug,
  });

  // Fetch other news articles for sidebar (excluding current one)
  const { data: otherNews } = useQuery({
    queryKey: ['announcements-list'],
    queryFn: () => announcementsApi.list(),
    enabled: !!announcement,
  });

  // Filter out current article and get up to 5 other articles
  const allNews = otherNews?.results || (Array.isArray(otherNews) ? otherNews : []);
  const moreNews = allNews.filter((item: Announcement) => item.slug !== slug).slice(0, 5);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content skeleton */}
            <div className="lg:col-span-2">
              <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse mb-8" />
              <div className="h-80 bg-gray-200 rounded-lg animate-pulse mb-6" />
              <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-8" />
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: `${Math.random() * 30 + 70}%` }} />
                ))}
              </div>
            </div>
            {/* Sidebar skeleton */}
            <div className="lg:col-span-1">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-6" />
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div className="h-40 bg-gray-200 rounded-lg animate-pulse mb-3" />
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8">The news article you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-6 py-3 bg-academic-navy text-white rounded-lg hover:bg-academic-blue transition-colors"
          >
            <FiArrowLeft />
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Back Button */}
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-academic-blue mb-6 transition-colors text-sm"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to News
        </Link>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column (2/3 width on large screens) */}
          <div className="lg:col-span-2">
            {/* Title */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1a365d] leading-tight mb-4">
              {announcement.title}
            </h1>

            {/* Excerpt - Summary under title */}
            {announcement.excerpt && (
              <p className="text-lg text-gray-600 leading-relaxed mb-6 italic">
                {announcement.excerpt}
              </p>
            )}

            {/* Publication Date */}
            <div className="flex items-center gap-2 text-gray-600 mb-6">
              <FiCalendar className="w-4 h-4 text-red-600" />
              <span className="text-sm">
                Published at {formatDate(announcement.published_at || announcement.created_at)}
              </span>
            </div>

            {/* Featured Image */}
            {announcement.featured_image && (
              <div className="relative w-full mb-8 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={announcement.featured_image}
                  alt={announcement.title}
                  width={900}
                  height={500}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            )}

            {/* Main Content */}
            <article className="prose prose-lg max-w-none
              prose-headings:text-[#1a365d] prose-headings:font-bold
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-[15px]
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900
              prose-em:text-[#0369a1] prose-em:font-medium
              prose-ul:my-4 prose-ul:space-y-2
              prose-li:text-gray-700 prose-li:text-[15px]
              prose-li:marker:text-gray-400
              prose-img:rounded-lg prose-img:shadow-md
            ">
              {/* Full Content */}
              <div dangerouslySetInnerHTML={{ __html: announcement.content }} />
            </article>

            {/* Footer Link */}
            {announcement.content.includes('href=') && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-gray-600 text-sm">
                  For more details, please visit the journal page.
                </p>
              </div>
            )}

            {/* Back to News Button */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a365d] text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <FiArrowLeft className="w-4 h-4" />
                Back to All News
              </Link>
            </div>
          </div>

          {/* Sidebar - Right Column (1/3 width on large screens) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h2 className="text-xl font-bold text-[#1a365d] mb-6 pb-3 border-b border-gray-200">
                More News
              </h2>
              {moreNews.length > 0 ? (
                <div className="space-y-6">
                  {moreNews.map((item: Announcement) => (
                    <Link
                      key={item.id}
                      href={`/news/${item.slug}`}
                      className="block group hover:opacity-90 transition-opacity"
                    >
                      {/* Image */}
                      {item.featured_image ? (
                        <div className="relative w-full h-40 mb-3 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                          <Image
                            src={item.featured_image}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-40 mb-3 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                          <span className="text-gray-500 text-sm">No Image</span>
                        </div>
                      )}
                      
                      {/* Title */}
                      <h3 className="text-base font-semibold text-gray-900 group-hover:text-academic-blue transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      
                      {/* Date */}
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                        <FiCalendar className="w-3 h-3 text-red-600" />
                        <span>
                          {formatDate(item.published_at || item.created_at)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No other news articles available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
