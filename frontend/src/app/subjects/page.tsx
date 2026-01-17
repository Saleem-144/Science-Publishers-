'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { FiBook, FiArrowRight } from 'react-icons/fi';
import { journalsApi } from '@/lib/api';

// Subject icons/colors mapping
const SUBJECT_THEMES: { [key: string]: { color: string; bgColor: string } } = {
  'medicine': { color: 'text-red-600', bgColor: 'bg-red-100' },
  'biology': { color: 'text-green-600', bgColor: 'bg-green-100' },
  'chemistry': { color: 'text-purple-600', bgColor: 'bg-purple-100' },
  'physics': { color: 'text-blue-600', bgColor: 'bg-blue-100' },
  'engineering': { color: 'text-orange-600', bgColor: 'bg-orange-100' },
  'computer-science': { color: 'text-cyan-600', bgColor: 'bg-cyan-100' },
  'environmental-science': { color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
  'mathematics': { color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
  'default': { color: 'text-academic-navy', bgColor: 'bg-academic-navy/10' },
};

export default function SubjectsPage() {
  const { data: subjects, isLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: journalsApi.subjects,
  });

  const subjectsList = subjects?.results || subjects || [];

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero Section */}
      <section className="bg-academic-navy text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Browse by Subject
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Explore our journals organized by research field and discipline.
          </p>
        </div>
      </section>

      {/* Subjects Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : subjectsList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjectsList.map((subject: any) => {
                const theme = SUBJECT_THEMES[subject.slug] || SUBJECT_THEMES.default;
                return (
                  <Link
                    key={subject.id}
                    href={`/journals?subject=${subject.slug}`}
                    className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className={`h-2 ${theme.bgColor}`}></div>
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className={`p-3 rounded-xl ${theme.bgColor}`}>
                          <FiBook className={`w-6 h-6 ${theme.color}`} />
                        </div>
                        <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-academic-blue group-hover:translate-x-1 transition-all" />
                      </div>
                      <h3 className="text-xl font-bold text-academic-navy mt-4 mb-2 group-hover:text-academic-blue transition-colors">
                        {subject.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {subject.description || `Explore journals in ${subject.name}`}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FiBook className="w-4 h-4" />
                        <span>{subject.journal_count || 0} Journals</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No subjects available yet.</p>
              <Link
                href="/journals"
                className="mt-4 inline-flex items-center gap-2 text-academic-blue hover:text-academic-navy font-medium"
              >
                Browse all journals
                <FiArrowRight />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Featured Subjects */}
      <section className="py-12 bg-gradient-to-br from-academic-navy/5 via-academic-blue/10 to-academic-navy/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-serif font-bold text-academic-navy mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our journals cover a wide range of disciplines. Contact us if you'd like to suggest a new subject area.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-academic-navy text-white font-semibold rounded-lg hover:bg-academic-blue transition-colors"
          >
            Contact Us
            <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
