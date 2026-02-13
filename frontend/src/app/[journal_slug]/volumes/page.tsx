'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { FiBook, FiFileText, FiArrowRight, FiChevronRight } from 'react-icons/fi';
import { journalsApi, volumesApi } from '@/lib/api';

export default function JournalVolumesPage() {
  const params = useParams();
  const journalSlug = params.journal_slug as string;

  const { data: journal, isLoading: journalLoading } = useQuery({
    queryKey: ['journal', journalSlug],
    queryFn: () => journalsApi.getBySlug(journalSlug),
    enabled: !!journalSlug,
  });

  const { data: volumes, isLoading: volumesLoading } = useQuery({
    queryKey: ['journal-volumes', journalSlug],
    queryFn: () => volumesApi.listByJournal(journalSlug),
    enabled: !!journalSlug,
  });

  const volumesList = Array.isArray(volumes) ? volumes : volumes?.results || [];

  if (journalLoading || volumesLoading) {
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
          <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <Link href="/" className="hover:text-academic-blue transition-colors">Home</Link>
            <FiChevronRight className="w-3 h-3" />
            <Link href={`/${journalSlug}`} className="hover:text-academic-blue transition-colors">
              {journal?.short_title || journal?.title}
            </Link>
            <FiChevronRight className="w-3 h-3" />
            <span className="text-gray-900">Volumes</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="bg-academic-navy text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-academic-navy via-academic-navy to-academic-blue opacity-90"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-black mb-4 uppercase tracking-tight">
            {journal?.title}
          </h1>
          <div className="h-1 w-20 bg-academic-gold mx-auto mb-6"></div>
          <p className="text-xl text-blue-100/80 font-medium max-w-2xl mx-auto">
            Journal Archive: Volumes & Issues
          </p>
        </div>
      </section>

      {/* Volumes List */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {volumesList.length > 0 ? (
            <div className="grid grid-cols-1 gap-12">
              {volumesList.map((volume: any) => (
                <div key={volume.id} className="flex flex-col md:flex-row gap-8 bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100 group hover:shadow-2xl hover:shadow-gray-300/50 transition-all duration-500">
                  {/* Volume Cover */}
                  <div className="w-full md:w-64 lg:w-72 bg-gray-50 flex-shrink-0 relative aspect-[3/4] md:aspect-auto">
                    {volume.cover_image ? (
                      <Image
                        src={volume.cover_image}
                        alt={`Volume ${volume.volume_number}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-gray-50 to-gray-100">
                        <FiBook className="w-16 h-16 text-gray-200 mb-4" />
                        <span className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Volume</span>
                        <span className="text-4xl font-serif font-black text-gray-300">{volume.volume_number}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-academic-navy/0 group-hover:bg-academic-navy/10 transition-colors duration-500"></div>
                  </div>

                  <div className="flex-1 p-8 md:py-10">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                      <div>
                        <h3 className="text-3xl font-serif font-black text-gray-900 mb-1 group-hover:text-academic-blue transition-colors">
                          Volume {volume.volume_number}
                        </h3>
                        <p className="text-academic-gold font-bold tracking-[0.2em] uppercase text-xs">
                          Published in {volume.year}
                        </p>
                      </div>
                      <Link
                        href={`/${journalSlug}/volumes/${volume.volume_number}`}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-academic-blue transition-all"
                      >
                        View Volume <FiArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                    {/* Issues Grid */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Issues in this volume</span>
                        <div className="h-px flex-1 bg-gray-100"></div>
                      </div>
                      
                      {volume.issues && volume.issues.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {volume.issues.map((issue: any) => (
                            <Link
                              key={issue.id}
                              href={`/${journalSlug}/issue/${issue.issue_number}`}
                              className="group/issue flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-academic-blue/30 hover:shadow-lg hover:shadow-academic-blue/5 transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-gray-100 shadow-sm group-hover/issue:border-academic-blue/20 transition-colors">
                                  <FiFileText className="w-5 h-5 text-academic-navy group-hover/issue:text-academic-blue transition-colors" />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-gray-900 group-hover/issue:text-academic-blue transition-colors">
                                    Issue {issue.issue_number}
                                  </p>
                                  <p className="text-[10px] text-gray-500 font-medium">
                                    {issue.total_articles || 0} Articles
                                  </p>
                                </div>
                              </div>
                              <FiChevronRight className="w-4 h-4 text-gray-300 group-hover/issue:text-academic-blue group-hover/issue:translate-x-1 transition-all" />
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                          <p className="text-sm text-gray-400 italic font-medium">No issues released yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
              <FiBook className="w-16 h-16 text-gray-200 mx-auto mb-6" />
              <h3 className="text-xl font-serif font-black text-gray-900 mb-2">No Volumes Found</h3>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">This journal hasn't published any volumes yet. Please check back later.</p>
              <Link
                href={`/${journalSlug}`}
                className="inline-flex items-center gap-2 px-8 py-3 bg-academic-navy text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-academic-blue transition-all"
              >
                ← Back to Journal
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
