'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { FiSearch, FiFilter, FiGrid, FiList, FiX } from 'react-icons/fi';
import { journalsApi } from '@/lib/api';
import { JournalCard } from '@/components/JournalCard';

export default function JournalsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [issnOnline, setIssnOnline] = useState('');
  const [debouncedIssn, setDebouncedIssn] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Debounce search inputs
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedIssn(issnOnline);
    }, 500);
    return () => clearTimeout(timer);
  }, [issnOnline]);

  const { data: journals, isLoading } = useQuery({
    queryKey: ['journals', debouncedSearch, selectedSubject, debouncedIssn],
    queryFn: () => journalsApi.list({ 
      search: debouncedSearch, 
      subjects__slug: selectedSubject,
      issn: debouncedIssn 
    }),
  });

  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: journalsApi.subjects,
  });

  const journalsList = journals?.results || journals || [];
  const subjectsList = subjects?.results || subjects || [];

  const clearFilters = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setSelectedSubject('');
    setIssnOnline('');
    setDebouncedIssn('');
  };

  const hasActiveFilters = searchQuery || selectedSubject || issnOnline;

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero Section */}
      <section className="bg-academic-navy text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Browse Our Journals
          </h1>
              <p className="text-xl text-blue-100 max-w-2xl">
            Explore our collection of peer-reviewed academic journals across multiple disciplines.
          </p>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium border border-white/20"
              >
                <FiX className="w-4 h-4" />
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-gray-200 bg-white sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* Search by Name */}
            <div className="lg:col-span-5 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by journal name, description or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue bg-gray-50/50"
              />
            </div>

            {/* ISSN Online Filter */}
            <div className="lg:col-span-3 relative">
              <input
                type="text"
                placeholder="ISSN (Online/Print)..."
                value={issnOnline}
                onChange={(e) => setIssnOnline(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue bg-gray-50/50"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold uppercase tracking-wider pointer-events-none">
                ISSN
              </div>
            </div>

            {/* Subject Filter */}
            <div className="lg:col-span-3 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <FiFilter className="w-4 h-4" />
              </div>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue bg-gray-50/50 appearance-none"
                >
                  <option value="">All Subjects</option>
                {subjectsList.map((subject: any) => (
                    <option key={subject.id} value={subject.slug}>
                    {subject.name} ({subject.journal_count || 0})
                    </option>
                  ))}
                </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
              </div>

              {/* View Mode Toggle */}
            <div className="lg:col-span-1 flex justify-end">
              <div className="flex border border-gray-300 rounded-lg overflow-hidden flex-shrink-0">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-academic-navy text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  title="Grid View"
                >
                  <FiGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-academic-navy text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  title="List View"
                >
                  <FiList className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journals Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Info */}
          {!isLoading && (
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                Showing <span className="font-bold text-gray-900">{journalsList.length}</span> journals
                {hasActiveFilters && (
                  <span> matching your filters</span>
                )}
              </p>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-[480px] bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse overflow-hidden">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                    <div className="pt-6 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full" />
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-20" />
                        <div className="h-3 bg-gray-200 rounded w-32" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : journalsList.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              : "space-y-6"
            }>
              {journalsList.map((journal: any) => (
                <JournalCard key={journal.id} journal={journal} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 text-gray-400 rounded-full mb-4">
                <FiSearch className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No journals found</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                We couldn't find any journals matching your current filters. Try adjusting your search or clearing all filters.
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-6 py-3 bg-academic-navy text-white rounded-lg hover:bg-academic-blue transition-colors font-semibold"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
