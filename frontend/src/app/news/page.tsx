'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { FiCalendar, FiSearch, FiChevronDown, FiX } from 'react-icons/fi';
import { announcementsApi } from '@/lib/api';

interface Announcement {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  author_name: string;
  published_at: string;
  created_at: string;
}

const DATE_RANGES = [
  { label: 'All Time', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Last 7 Days', value: 'last7days' },
  { label: 'Last 30 Days', value: 'last30days' },
  { label: 'This Month', value: 'thismonth' },
  { label: 'Last Month', value: 'lastmonth' },
  { label: 'Last 3 Months', value: 'last3months' },
  { label: 'Last 6 Months', value: 'last6months' },
  { label: 'Last 12 Months', value: 'last12months' },
];

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Title A-Z', value: 'title-asc' },
  { label: 'Title Z-A', value: 'title-desc' },
];

// Default placeholder images for news items
const defaultImages = [
  'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=500&fit=crop',
];

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const { data: announcements, isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: announcementsApi.list,
  });

  const announcementsList: Announcement[] = announcements?.results || announcements || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    });
  };

  // Filter and sort announcements
  const filteredAnnouncements = useMemo(() => {
    let filtered = [...announcementsList];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (ann) =>
          ann.title.toLowerCase().includes(query) ||
          ann.excerpt.toLowerCase().includes(query)
      );
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter((ann) => {
        const annDate = new Date(ann.published_at || ann.created_at);
        
        switch (dateRange) {
          case 'today':
            return annDate >= today;
          case 'yesterday':
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            return annDate >= yesterday && annDate < today;
          case 'last7days':
            const last7 = new Date(today);
            last7.setDate(last7.getDate() - 7);
            return annDate >= last7;
          case 'last30days':
            const last30 = new Date(today);
            last30.setDate(last30.getDate() - 30);
            return annDate >= last30;
          case 'thismonth':
            return annDate.getMonth() === now.getMonth() && annDate.getFullYear() === now.getFullYear();
          case 'lastmonth':
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            return annDate >= lastMonth && annDate < thisMonthStart;
          case 'last3months':
            const last3m = new Date(today);
            last3m.setMonth(last3m.getMonth() - 3);
            return annDate >= last3m;
          case 'last6months':
            const last6m = new Date(today);
            last6m.setMonth(last6m.getMonth() - 6);
            return annDate >= last6m;
          case 'last12months':
            const last12m = new Date(today);
            last12m.setFullYear(last12m.getFullYear() - 1);
            return annDate >= last12m;
          default:
            return true;
        }
      });
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.published_at || a.created_at).getTime();
      const dateB = new Date(b.published_at || b.created_at).getTime();
      
      switch (sortBy) {
        case 'newest':
          return dateB - dateA;
        case 'oldest':
          return dateA - dateB;
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        default:
          return dateB - dateA;
      }
    });

    return filtered;
  }, [announcementsList, searchQuery, dateRange, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already reactive via useMemo
  };

  const clearFilters = () => {
    setSearchQuery('');
    setDateRange('all');
    setSortBy('newest');
  };

  const hasActiveFilters = searchQuery || dateRange !== 'all' || sortBy !== 'newest';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-academic-navy mb-2">
                News & Updates
              </h1>
              <p className="text-gray-600 text-lg">Stay informed with the latest announcements and news</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sticky Search & Filter Sidebar - Left Column (1/4 width on large screens) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
                  <FiSearch className="w-5 h-5 text-academic-blue" />
                  <h2 className="text-xl font-bold text-academic-navy">Search & Filter</h2>
                </div>
                
                <form onSubmit={handleSearch} className="space-y-5">
                  {/* Search Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2.5">
                      Search Articles
                    </label>
                    <div className="relative">
                      <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by title or keyword..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-academic-blue focus:border-academic-blue bg-gray-50 text-sm transition-all hover:border-gray-300"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Date Range Dropdown */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2.5">
                      Date Range
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setShowDateDropdown(!showDateDropdown);
                          setShowSortDropdown(false);
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 hover:border-gray-300 transition-all text-sm font-medium text-gray-700"
                      >
                        <span className="flex items-center gap-2.5">
                          <FiCalendar className="w-4 h-4 text-academic-blue" />
                          {DATE_RANGES.find(d => d.value === dateRange)?.label || 'Select range...'}
                        </span>
                        <FiChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showDateDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {showDateDropdown && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setShowDateDropdown(false)} />
                          <div className="absolute top-full left-0 right-0 mt-2 w-full bg-white border-2 border-gray-200 rounded-xl shadow-xl z-20 py-2 max-h-80 overflow-y-auto">
                            {DATE_RANGES.map((range) => (
                              <button
                                key={range.value}
                                type="button"
                                onClick={() => {
                                  setDateRange(range.value);
                                  setShowDateDropdown(false);
                                }}
                                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-sm font-medium ${
                                  dateRange === range.value 
                                    ? 'bg-academic-blue text-white hover:bg-academic-blue' 
                                    : 'text-gray-700 hover:text-academic-blue'
                                }`}
                              >
                                {range.label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Sort Dropdown */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2.5">
                      Sort By
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setShowSortDropdown(!showSortDropdown);
                          setShowDateDropdown(false);
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 hover:border-gray-300 transition-all text-sm font-medium text-gray-700"
                      >
                        <span>
                          {SORT_OPTIONS.find(s => s.value === sortBy)?.label || 'Sort By'}
                        </span>
                        <FiChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showSortDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {showSortDropdown && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)} />
                          <div className="absolute top-full left-0 right-0 mt-2 w-full bg-white border-2 border-gray-200 rounded-xl shadow-xl z-20 py-2">
                            {SORT_OPTIONS.map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  setSortBy(option.value);
                                  setShowSortDropdown(false);
                                }}
                                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-sm font-medium ${
                                  sortBy === option.value 
                                    ? 'bg-academic-blue text-white hover:bg-academic-blue' 
                                    : 'text-gray-700 hover:text-academic-blue'
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Search Button */}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm"
                  >
                    <FiSearch className="w-4 h-4" />
                    Search
                  </button>
                </form>

                {/* Active Filters */}
                {hasActiveFilters && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-gray-800">Active Filters</span>
                      <button
                        onClick={clearFilters}
                        className="text-xs text-red-600 hover:text-red-700 font-semibold transition-colors"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {searchQuery && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-academic-blue/10 text-academic-blue text-xs font-medium rounded-full border border-academic-blue/20">
                          "{searchQuery}"
                          <button onClick={() => setSearchQuery('')} className="hover:text-academic-navy transition-colors">
                            <FiX className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {dateRange !== 'all' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-academic-blue/10 text-academic-blue text-xs font-medium rounded-full border border-academic-blue/20">
                          {DATE_RANGES.find(d => d.value === dateRange)?.label}
                          <button onClick={() => setDateRange('all')} className="hover:text-academic-navy transition-colors">
                            <FiX className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {sortBy !== 'newest' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-academic-blue/10 text-academic-blue text-xs font-medium rounded-full border border-academic-blue/20">
                          {SORT_OPTIONS.find(s => s.value === sortBy)?.label}
                          <button onClick={() => setSortBy('newest')} className="hover:text-academic-navy transition-colors">
                            <FiX className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* News Grid - Right Column (3/4 width on large screens) */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
                    <div className="h-64 md:h-72 bg-gradient-to-br from-gray-200 to-gray-300" />
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 rounded-lg w-32 mb-4" />
                      <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-3" />
                      <div className="h-4 bg-gray-200 rounded-lg w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredAnnouncements.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiSearch className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">No results found</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {hasActiveFilters
                    ? 'Try adjusting your search or filters to find what you\'re looking for.'
                    : 'No news articles available yet. Check back soon for updates!'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-8 py-3 bg-gradient-to-r from-academic-navy to-academic-blue text-white rounded-xl hover:shadow-lg transition-all font-semibold"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Results Count */}
                <div className="mb-8 pb-4 border-b border-gray-200">
                  <p className="text-base font-semibold text-gray-700">
                    Showing <span className="text-academic-blue font-bold">{filteredAnnouncements.length}</span> {filteredAnnouncements.length === 1 ? 'article' : 'articles'}
                  </p>
                </div>

                {/* News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  {filteredAnnouncements.map((announcement, index) => (
                    <Link
                      key={announcement.id}
                      href={`/news/${announcement.slug}`}
                      className="group block"
                    >
                      <article className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1">
                        {/* Image */}
                        <div className="relative h-64 md:h-72 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                          <Image
                            src={announcement.featured_image || defaultImages[index % defaultImages.length]}
                            alt={announcement.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        
                        {/* Content */}
                        <div className="p-6">
                          {/* Date */}
                          <div className="flex items-center gap-2 text-gray-600 mb-4">
                            <div className="p-1.5 bg-red-50 rounded-lg">
                              <FiCalendar className="w-3.5 h-3.5 text-red-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              {formatDate(announcement.published_at || announcement.created_at)}
                            </span>
                          </div>
                          
                          {/* Title */}
                          <h2 className="text-xl font-bold text-academic-navy group-hover:text-academic-blue transition-colors line-clamp-2 leading-tight mb-2">
                            {announcement.title}
                          </h2>
                          
                          {/* Excerpt if available */}
                          {announcement.excerpt && (
                            <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mt-2">
                              {announcement.excerpt}
                            </p>
                          )}
                          
                          {/* Read More Indicator */}
                          <div className="mt-4 flex items-center text-academic-blue text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            Read more →
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
