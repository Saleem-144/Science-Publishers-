'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { FiArrowRight, FiBook, FiFileText, FiUsers, FiAward, FiCheckCircle, FiGlobe, FiSend, FiArchive, FiEdit3, FiImage, FiShield, FiTarget, FiLayers, FiUserCheck, FiGitMerge, FiList, FiBell, FiCalendar } from 'react-icons/fi';
import { journalsApi, articlesApi, affiliationsApi, announcementsApi } from '@/lib/api';
import { JournalCard } from '@/components/JournalCard';
import { ArticleCard } from '@/components/ArticleCard';

interface Affiliation {
  id: number;
  name: string;
  logo_url: string;
  url: string;
}

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  author_name: string;
  created_by_name: string;
  published_at: string;
  created_at: string;
}

// Hero background images - will auto-rotate every 5 seconds
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&h=1080&fit=crop',
];

export default function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate background images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const { data: featuredJournals, isLoading: journalsLoading } = useQuery({
    queryKey: ['featured-journals'],
    queryFn: journalsApi.featured,
  });

  const { data: recentArticles, isLoading: articlesLoading } = useQuery({
    queryKey: ['recent-articles'],
    queryFn: () => articlesApi.recent(),
  });

  const { data: affiliations, isLoading: affiliationsLoading } = useQuery({
    queryKey: ['affiliations'],
    queryFn: affiliationsApi.list,
  });

  const { data: newsData, isLoading: newsLoading } = useQuery({
    queryKey: ['homepage-news'],
    queryFn: announcementsApi.homepage,
  });

  const affiliationsList: Affiliation[] = affiliations?.results || affiliations || [];
  const newsList: NewsItem[] = newsData?.results || newsData || [];

  // Default images for news items without featured images
  const defaultNewsImages = [
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&h=400&fit=crop',
  ];

  const formatNewsDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    // If it's already a full URL, return it
    if (imagePath.startsWith('http')) return imagePath;
    // Otherwise, prepend the backend base URL
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8000';
    return `${baseUrl}${imagePath}`;
  };

  return (
    <div className="page-enter">
      {/* Hero Section with Background Image Slider */}
      <section className="relative text-white overflow-hidden">
        {/* Background Images with Crossfade */}
        {HERO_IMAGES.map((image, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              opacity: index === currentImageIndex ? 1 : 0,
              backgroundImage: `url("${image}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
        
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-academic-navy/90 via-academic-blue/80 to-blue-900/85" />
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
              Advancing Knowledge Through
              <span className="text-academic-gold"> Open Research</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
              Explore peer-reviewed academic journals across multiple disciplines.
              Access cutting-edge research and contribute to the global scientific community.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/journals"
                className="inline-flex items-center gap-2 px-6 py-3 bg-academic-gold text-white font-semibold rounded-lg hover:bg-yellow-500 hover:shadow-lg hover:shadow-yellow-500/30 transition-all duration-300"
              >
                Browse Journals
                <FiArrowRight />
              </Link>
              <Link
                href="/subjects"
                className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-white/50 text-white font-semibold rounded-lg hover:bg-ivory/10 hover:shadow-lg hover:shadow-white/20 transition-all duration-300"
              >
                Explore Subjects
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="relative bg-black/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: FiBook, value: '50+', label: 'Journals' },
                { icon: FiFileText, value: '10,000+', label: 'Articles' },
                { icon: FiUsers, value: '25,000+', label: 'Authors' },
                { icon: FiAward, value: '100%', label: 'Peer Reviewed' },
              ].map((stat, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="p-3 bg-ivory/10 rounded-lg">
                    <stat.icon className="w-6 h-6 text-academic-gold" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-blue-200">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-6 pt-6 border-t border-white/10">
              {[
                { icon: FiCheckCircle, value: '150+', label: 'EBM' },
                { icon: FiGlobe, value: '200+', label: 'Affiliations & Partnerships' },
                { icon: FiSend, value: '5,000+', label: 'Submitted Manuscripts' },
                { icon: FiArchive, value: '3,500+', label: 'Published Manuscripts' },
              ].map((stat, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="p-3 bg-ivory/10 rounded-lg">
                    <stat.icon className="w-6 h-6 text-academic-gold" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-blue-200">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Journals - Enhanced Background */}
      <section className="relative py-14 md:py-20 bg-gradient-to-br from-academic-navy/5 via-academic-blue/10 to-academic-navy/5 overflow-hidden">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 right-10 w-80 h-80 bg-academic-blue/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-academic-gold/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-serif font-bold text-academic-navy mb-2">
              Recent Journals
            </h2>
            <p className="text-gray-600">
              Explore our latest academic journals
            </p>
          </div>
          <Link
            href="/journals"
            className="hidden sm:inline-flex items-center gap-2 text-academic-blue hover:text-academic-navy font-medium transition-colors"
          >
            View All Journals
            <FiArrowRight />
          </Link>
        </div>

        {journalsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[480px] bg-section-light rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(featuredJournals?.results || featuredJournals || []).slice(0, 6).map((journal: any) => (
              <JournalCard key={journal.id} journal={journal} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/journals"
            className="inline-flex items-center gap-2 text-academic-blue font-medium"
          >
            View All Journals
            <FiArrowRight />
          </Link>
        </div>
        </div>
      </section>

      {/* Recent Articles - Ivory Background */}
      <section className="py-14 md:py-20 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-serif font-bold text-academic-navy mb-2">
                Latest Research
              </h2>
              <p className="text-gray-600">
                Recently published articles from our journals
              </p>
            </div>
            <Link
              href="/search"
              className="hidden sm:inline-flex items-center gap-2 text-academic-blue hover:text-academic-navy font-medium transition-colors"
            >
              Search Articles
              <FiArrowRight />
            </Link>
          </div>

          {articlesLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-section-dark rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {(recentArticles?.results || recentArticles || []).slice(0, 5).map((article: any) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Services Section - Enhanced Background */}
      <section id="services" className="relative py-14 md:py-20 bg-gradient-to-br from-academic-navy/5 via-academic-blue/10 to-academic-navy/5 overflow-hidden">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-72 h-72 bg-academic-gold/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-academic-blue/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-academic-navy mb-3">
              Our Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive publishing and author support services to help you succeed in academic publishing
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Author Services */}
            <div className="bg-ivory rounded-2xl shadow-md border border-ivory-200 p-8 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-academic-blue/10 rounded-xl">
                  <FiEdit3 className="w-6 h-6 text-academic-blue" />
                </div>
                <h3 className="text-xl font-bold text-academic-navy">Author Services</h3>
              </div>
              <ul className="space-y-4">
                {[
                  { icon: FiEdit3, title: 'Language Editing', desc: 'Professional editing to enhance clarity and readability' },
                  { icon: FiImage, title: 'Graphics Enhancement', desc: 'High-quality figure and illustration improvements' },
                  { icon: FiShield, title: 'Plagiarism Screening', desc: 'Comprehensive originality checks for your manuscript' },
                  { icon: FiTarget, title: 'Journal Selection', desc: 'Expert guidance to find the right journal for your research' },
                ].map((service, index) => (
                  <li key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-academic-blue/5 transition-colors">
                    <div className="p-2 bg-academic-gold/10 rounded-lg flex-shrink-0">
                      <service.icon className="w-5 h-5 text-academic-gold" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{service.title}</h4>
                      <p className="text-sm text-gray-600">{service.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Publishing Services */}
            <div className="bg-ivory rounded-2xl shadow-md border border-ivory-200 p-8 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-academic-navy/10 rounded-xl">
                  <FiLayers className="w-6 h-6 text-academic-navy" />
                </div>
                <h3 className="text-xl font-bold text-academic-navy">Publishing Services</h3>
              </div>
              <ul className="space-y-4">
                {[
                  { icon: FiLayers, title: 'Journals Launching', desc: 'End-to-end support for launching new academic journals' },
                  { icon: FiUserCheck, title: 'Managing Editor Support', desc: 'Dedicated editorial management assistance' },
                  { icon: FiGitMerge, title: 'Peer Review Management Support', desc: 'Streamlined peer review process coordination' },
                  { icon: FiList, title: 'Indexation', desc: 'Support for journal indexing in major databases' },
                ].map((service, index) => (
                  <li key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-academic-blue/5 transition-colors">
                    <div className="p-2 bg-academic-blue/10 rounded-lg flex-shrink-0">
                      <service.icon className="w-5 h-5 text-academic-blue" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{service.title}</h4>
                      <p className="text-sm text-gray-600">{service.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-8 py-4 bg-academic-navy text-white font-semibold rounded-lg hover:bg-academic-blue hover:shadow-lg hover:shadow-academic-navy/30 transition-all duration-300"
            >
              Learn More About Our Services
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* News & Announcements Section - Ivory Background */}
      <section className="py-14 md:py-20 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FiBell className="w-6 h-6 text-academic-gold" />
                <h2 className="text-3xl font-serif font-bold text-academic-navy">
                  News & Announcements
                </h2>
              </div>
              <p className="text-gray-600">
                Stay updated with the latest from Aethra Science Publishers
              </p>
            </div>
            <Link
              href="/news"
              className="hidden sm:inline-flex items-center gap-2 text-academic-blue hover:text-academic-navy font-medium transition-colors"
            >
              View All News
              <FiArrowRight />
            </Link>
          </div>

          {/* News Grid - Magazine Style */}
          {newsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1 space-y-4">
                <div className="h-52 bg-gray-200 rounded-xl animate-pulse" />
                <div className="h-52 bg-gray-200 rounded-xl animate-pulse" />
              </div>
              <div className="md:col-span-2">
                <div className="h-full min-h-[400px] bg-gray-200 rounded-xl animate-pulse" />
              </div>
              <div className="md:col-span-1 space-y-4">
                <div className="h-52 bg-gray-200 rounded-xl animate-pulse" />
                <div className="h-52 bg-gray-200 rounded-xl animate-pulse" />
              </div>
            </div>
          ) : newsList.length === 0 ? (
            <div className="text-center py-12">
              <FiBell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No announcements yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Left Column - 2 stacked cards */}
              <div className="md:col-span-1 space-y-4">
                {newsList[1] && (
                  <Link href={`/news/${newsList[1].slug}`} className="group block relative h-52 md:h-[calc(50%-0.5rem)] rounded-xl overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url('${getImageUrl(newsList[1].featured_image) || defaultNewsImages[0]}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="font-bold text-sm leading-tight mb-2 line-clamp-2">{newsList[1].title}</h3>
                      <div className="flex items-center gap-3 text-xs text-gray-300">
                        {(newsList[1].created_by_name || newsList[1].author_name) && (
                          <span className="flex items-center gap-1">
                            <FiUsers className="w-3 h-3" />
                            {newsList[1].created_by_name || newsList[1].author_name}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <FiCalendar className="w-3 h-3" />
                          {formatNewsDate(newsList[1].published_at || newsList[1].created_at)}
                        </span>
                      </div>
                    </div>
                  </Link>
                )}

                {newsList[2] && (
                  <Link href={`/news/${newsList[2].slug}`} className="group block relative h-52 md:h-[calc(50%-0.5rem)] rounded-xl overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url('${getImageUrl(newsList[2].featured_image) || defaultNewsImages[1]}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="font-bold text-sm leading-tight mb-2 line-clamp-2">{newsList[2].title}</h3>
                      <div className="flex items-center gap-3 text-xs text-gray-300">
                        {(newsList[2].created_by_name || newsList[2].author_name) && (
                          <span className="flex items-center gap-1">
                            <FiUsers className="w-3 h-3" />
                            {newsList[2].created_by_name || newsList[2].author_name}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <FiCalendar className="w-3 h-3" />
                          {formatNewsDate(newsList[2].published_at || newsList[2].created_at)}
                        </span>
                      </div>
                    </div>
                  </Link>
                )}
              </div>

              {/* Center - Large Featured Card */}
              <div className="md:col-span-2">
                {newsList[0] && (
                  <Link href={`/news/${newsList[0].slug}`} className="group block relative h-52 md:h-full min-h-[400px] rounded-xl overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url('${getImageUrl(newsList[0].featured_image) || defaultNewsImages[2]}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="font-bold text-xl md:text-2xl leading-tight mb-3 line-clamp-2">{newsList[0].title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-300">
                        {(newsList[0].created_by_name || newsList[0].author_name) && (
                          <span className="flex items-center gap-1">
                            <FiUsers className="w-4 h-4" />
                            {newsList[0].created_by_name || newsList[0].author_name}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <FiCalendar className="w-4 h-4" />
                          {formatNewsDate(newsList[0].published_at || newsList[0].created_at)}
                        </span>
                      </div>
                    </div>
                  </Link>
                )}
              </div>

              {/* Right Column - 2 stacked cards */}
              <div className="md:col-span-1 space-y-4">
                {newsList[3] && (
                  <Link href={`/news/${newsList[3].slug}`} className="group block relative h-52 md:h-[calc(50%-0.5rem)] rounded-xl overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url('${newsList[3].featured_image || defaultNewsImages[3]}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="font-bold text-sm leading-tight mb-2 line-clamp-2">{newsList[3].title}</h3>
                      <div className="flex items-center gap-3 text-xs text-gray-300">
                        {(newsList[3].created_by_name || newsList[3].author_name) && (
                          <span className="flex items-center gap-1">
                            <FiUsers className="w-3 h-3" />
                            {newsList[3].created_by_name || newsList[3].author_name}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <FiCalendar className="w-3 h-3" />
                          {formatNewsDate(newsList[3].published_at || newsList[3].created_at)}
                        </span>
                      </div>
                    </div>
                  </Link>
                )}

                {newsList[4] && (
                  <Link href={`/news/${newsList[4].slug}`} className="group block relative h-52 md:h-[calc(50%-0.5rem)] rounded-xl overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url('${newsList[4].featured_image || defaultNewsImages[4]}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="font-bold text-sm leading-tight mb-2 line-clamp-2">{newsList[4].title}</h3>
                      <div className="flex items-center gap-3 text-xs text-gray-300">
                        {(newsList[4].created_by_name || newsList[4].author_name) && (
                          <span className="flex items-center gap-1">
                            <FiUsers className="w-3 h-3" />
                            {newsList[4].created_by_name || newsList[4].author_name}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <FiCalendar className="w-3 h-3" />
                          {formatNewsDate(newsList[4].published_at || newsList[4].created_at)}
                        </span>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          )}

          <div className="mt-10 text-center sm:hidden">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-academic-blue font-medium"
            >
              View All News
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Corporate Affiliations Section */}
      <section className="relative py-14 md:py-20 bg-gradient-to-br from-academic-navy/5 via-academic-blue/10 to-academic-navy/5 overflow-hidden">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-64 h-64 bg-academic-blue/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-academic-gold/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-academic-navy mb-3">
              Corporate Affiliations
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Partnering with leading organizations to advance scientific research and publishing
            </p>
          </div>

          {/* Auto-Sliding Logo Carousel */}
          {affiliationsLoading ? (
            <div className="flex items-center justify-center gap-10 py-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-36 h-20 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : affiliationsList.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FiGlobe className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No affiliations to display</p>
            </div>
          ) : (
            <div className="relative overflow-hidden">
              {/* Gradient Fade Left */}
              <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#eef2f6] to-transparent z-10 pointer-events-none" />
              
              {/* Gradient Fade Right */}
              <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#eef2f6] to-transparent z-10 pointer-events-none" />
              
              {/* Infinite Scrolling Container */}
              <div className="animate-scroll py-4">
                {/* First set of logos */}
                {affiliationsList.map((affiliation: Affiliation) => (
                  <a 
                    key={`first-${affiliation.id}`}
                    href={affiliation.url || '#'} 
                    target={affiliation.url ? '_blank' : undefined}
                    rel={affiliation.url ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center justify-center h-20 px-8 cursor-pointer hover:scale-105 transition-transform duration-300"
                    title={affiliation.name}
                  >
                    {affiliation.logo_url ? (
                      <div className="relative h-14 w-40">
                        <Image
                          src={affiliation.logo_url}
                          alt={affiliation.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="px-5 py-2.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <span className="text-base font-bold text-academic-navy whitespace-nowrap">{affiliation.name}</span>
                      </div>
                    )}
                  </a>
                ))}
                {/* Duplicate set for seamless loop */}
                {affiliationsList.map((affiliation: Affiliation) => (
                  <a 
                    key={`second-${affiliation.id}`}
                    href={affiliation.url || '#'} 
                    target={affiliation.url ? '_blank' : undefined}
                    rel={affiliation.url ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center justify-center h-20 px-8 cursor-pointer hover:scale-105 transition-transform duration-300"
                    title={affiliation.name}
                  >
                    {affiliation.logo_url ? (
                      <div className="relative h-14 w-40">
                        <Image
                          src={affiliation.logo_url}
                          alt={affiliation.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="px-5 py-2.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <span className="text-base font-bold text-academic-navy whitespace-nowrap">{affiliation.name}</span>
                      </div>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-academic-navy py-10 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
            Ready to Contribute to Science?
          </h2>
          <p className="text-lg text-blue-200 mb-8">
            Submit your research to one of our peer-reviewed journals and join
            thousands of researchers advancing knowledge worldwide.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/journals"
              className="inline-flex items-center gap-2 px-6 py-3 bg-academic-gold text-academic-navy font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Find Your Journal
              <FiArrowRight />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-white/50 text-white font-semibold rounded-lg hover:bg-ivory/10 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
