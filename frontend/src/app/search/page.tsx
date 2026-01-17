'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { FiSearch, FiFilter, FiX, FiFileText, FiBook } from 'react-icons/fi';
import { articlesApi, journalsApi } from '@/lib/api';
import { ArticleCard } from '@/components/ArticleCard';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'articles' | 'journals'>('articles');
  const [selectedJournal, setSelectedJournal] = useState('');

  const { data: articles, isLoading: articlesLoading } = useQuery({
    queryKey: ['search-articles', searchQuery],
    queryFn: () => articlesApi.search(searchQuery),
    enabled: searchQuery.length > 2 && activeTab === 'articles',
  });

  const { data: journals, isLoading: journalsLoading } = useQuery({
    queryKey: ['search-journals', searchQuery],
    queryFn: () => journalsApi.list({ search: searchQuery }),
    enabled: searchQuery.length > 2 && activeTab === 'journals',
  });

  const { data: allJournals } = useQuery({
    queryKey: ['all-journals'],
    queryFn: () => journalsApi.list(),
  });

  const articlesList = articles?.results || articles || [];
  const journalsList = journals?.results || journals || [];
  const allJournalsList = allJournals?.results || allJournals || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-ivory">
      {/* Search Header */}
      <section className="bg-academic-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Search Publications
          </h1>
          
          <form onSubmit={handleSearch} className="max-w-3xl">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Search articles, journals, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-12 py-4 text-gray-900 text-lg rounded-xl focus:ring-2 focus:ring-academic-gold focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* Tabs & Filters */}
      <section className="border-b border-gray-200 bg-white sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('articles')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'articles'
                    ? 'bg-white text-academic-navy shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FiFileText className="w-4 h-4" />
                Articles
              </button>
              <button
                onClick={() => setActiveTab('journals')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'journals'
                    ? 'bg-white text-academic-navy shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FiBook className="w-4 h-4" />
                Journals
              </button>
            </div>

            {/* Filter by Journal (for articles) */}
            {activeTab === 'articles' && (
              <div className="flex items-center gap-2">
                <FiFilter className="text-gray-500 w-5 h-5" />
                <select
                  value={selectedJournal}
                  onChange={(e) => setSelectedJournal(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
                >
                  <option value="">All Journals</option>
                  {allJournalsList.map((journal: any) => (
                    <option key={journal.id} value={journal.slug}>
                      {journal.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {searchQuery.length < 3 ? (
            <div className="text-center py-16">
              <FiSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                Start Searching
              </h2>
              <p className="text-gray-500">
                Enter at least 3 characters to search for articles and journals.
              </p>
            </div>
          ) : activeTab === 'articles' ? (
            <>
              {articlesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : articlesList.length > 0 ? (
                <>
                  <p className="text-gray-600 mb-6">
                    Found {articlesList.length} article{articlesList.length !== 1 ? 's' : ''} for "{searchQuery}"
                  </p>
                  <div className="space-y-4">
                    {articlesList.map((article: any) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-600 text-lg">No articles found for "{searchQuery}"</p>
                  <p className="text-gray-500 mt-2">Try different keywords or browse our journals.</p>
                </div>
              )}
            </>
          ) : (
            <>
              {journalsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : journalsList.length > 0 ? (
                <>
                  <p className="text-gray-600 mb-6">
                    Found {journalsList.length} journal{journalsList.length !== 1 ? 's' : ''} for "{searchQuery}"
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {journalsList.map((journal: any) => (
                      <Link
                        key={journal.id}
                        href={`/${journal.slug}`}
                        className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                      >
                        <h3 className="text-lg font-bold text-academic-navy mb-2 hover:text-academic-blue transition-colors">
                          {journal.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {journal.short_description || journal.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-600 text-lg">No journals found for "{searchQuery}"</p>
                  <Link href="/journals" className="text-academic-blue hover:text-academic-navy font-medium mt-2 inline-block">
                    Browse all journals →
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
