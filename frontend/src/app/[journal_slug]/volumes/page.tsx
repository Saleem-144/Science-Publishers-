'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
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

  const volumesList = volumes?.results || volumes || [];

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
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/journals" className="text-gray-500 hover:text-academic-blue">
              Journals
            </Link>
            <FiChevronRight className="w-4 h-4 text-gray-400" />
            <Link href={`/${journalSlug}`} className="text-gray-500 hover:text-academic-blue">
              {journal?.short_title || journal?.title}
            </Link>
            <FiChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">Volumes</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="bg-academic-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-serif font-bold mb-2">
            {journal?.title}
          </h1>
          <p className="text-xl text-blue-100">Volumes & Issues</p>
        </div>
      </section>

      {/* Volumes List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {volumesList.length > 0 ? (
            <div className="space-y-6">
              {volumesList.map((volume: any) => (
                <div key={volume.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-academic-navy">
                        Volume {volume.number} ({volume.year})
                      </h3>
                      <span className="text-sm text-gray-500">
                        {volume.issue_count || 0} Issues
                      </span>
                    </div>

                    {/* Issues */}
                    {volume.issues && volume.issues.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {volume.issues.map((issue: any) => (
                          <Link
                            key={issue.id}
                            href={`/${journalSlug}/issue/${issue.number}`}
                            className="group p-4 rounded-lg border border-gray-200 hover:border-academic-blue hover:shadow-md transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-academic-navy/10 rounded-lg group-hover:bg-academic-blue/10">
                                <FiFileText className="w-5 h-5 text-academic-navy group-hover:text-academic-blue" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 group-hover:text-academic-blue">
                                  Issue {issue.number}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {issue.article_count || 0} Articles
                                </p>
                              </div>
                              <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-academic-blue group-hover:translate-x-1 transition-all" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No issues available for this volume.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl">
              <FiBook className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No volumes published yet.</p>
              <Link
                href={`/${journalSlug}`}
                className="text-academic-blue hover:text-academic-navy font-medium mt-2 inline-block"
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
