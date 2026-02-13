'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { FiEdit3, FiLogIn, FiBookOpen, FiArrowRight } from 'react-icons/fi';
import { journalsApi } from '@/lib/api';

export default function PublishWithUsPage() {
  const { data: journalsData, isLoading } = useQuery({
    queryKey: ['journals-publish'],
    queryFn: () => journalsApi.list({ page: 1 }),
  });

  const journals = journalsData?.results || journalsData || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-academic-navy text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1920&h=1080&fit=crop')] bg-cover bg-center" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black mb-6">
              Publish With Us
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Join our community of world-class researchers. Select a journal below to start your submission process or access your author dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Journals List */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-academic-blue mb-4"></div>
            <p className="text-gray-500 font-medium">Loading journals...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {journals.map((journal: any) => (
              <div key={journal.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 group">
                {/* Journal Cover */}
                <div className="relative h-64 overflow-hidden">
                  {journal.cover_image ? (
                    <Image
                      src={journal.cover_image}
                      alt={journal.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-academic-navy flex items-center justify-center text-white">
                      <FiBookOpen className="w-16 h-16 opacity-20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Journal Info */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4 flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-academic-blue transition-colors">
                      {journal.title}
                    </h2>
                    {journal.issn_online && (
                      <p className="text-xs text-gray-500 font-mono">
                        ISSN (Online): {journal.issn_online}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 mt-auto">
                    <div className="grid grid-cols-2 gap-3">
                      <a
                        href={journal.submission_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                          journal.submission_url 
                            ? 'bg-academic-blue text-white hover:bg-academic-navy shadow-md hover:shadow-lg' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <FiEdit3 className="w-4 h-4" />
                        Submit
                      </a>
                      <a
                        href={journal.login_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                          journal.login_url 
                            ? 'bg-academic-gold text-academic-navy hover:bg-yellow-500 shadow-md hover:shadow-lg' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <FiLogIn className="w-4 h-4" />
                        Login
                      </a>
                    </div>
                    
                    <Link
                      href={`/${journal.slug}`}
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 text-academic-navy font-bold text-xs uppercase tracking-widest hover:text-academic-blue transition-colors"
                    >
                      View Journal Details
                      <FiArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-black text-gray-900 mb-4">
            Need Help With Your Submission?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Our editorial team is here to assist you through every step of the publication process. Visit our author guidelines for more information.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/information/for-authors/instructions-for-authors"
              className="px-8 py-3 bg-gray-100 text-academic-navy font-bold rounded-full hover:bg-gray-200 transition-all"
            >
              Author Guidelines
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 border-2 border-academic-navy text-academic-navy font-bold rounded-full hover:bg-academic-navy hover:text-white transition-all"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

