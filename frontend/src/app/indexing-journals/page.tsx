'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { indexingPlatformsApi } from '@/lib/api';
import { FiChevronDown, FiChevronUp, FiExternalLink } from 'react-icons/fi';

interface IndexingLink {
  id: number;
  journal: number;
  journal_title: string;
  url: string;
}

interface IndexingPlatform {
  id: number;
  name: string;
  is_active: boolean;
  display_order: number;
  journal_links: IndexingLink[];
}

export default function IndexingJournalsPublicPage() {
  const [openPlatformId, setOpenPlatformId] = useState<number | null>(null);

  const { data: platforms, isLoading } = useQuery({
    queryKey: ['public-indexing-platforms'],
    queryFn: () => indexingPlatformsApi.list(),
  });

  const togglePlatform = (id: number) => {
    setOpenPlatformId(openPlatformId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Heading Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-academic-navy mb-2 uppercase tracking-tight">
            ABSTRACTING AND INDEXING
          </h1>
          <div className="h-1 bg-academic-gold w-full"></div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-10 h-10 border-4 border-academic-navy border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {platforms?.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">No indexing information available at this time.</p>
              </div>
            ) : (
              platforms?.map((platform: IndexingPlatform) => (
                <div key={platform.id} className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => togglePlatform(platform.id)}
                    className="w-full flex items-center justify-between py-5 px-6 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg font-bold text-gray-800 uppercase tracking-wide text-left">
                      {platform.name}
                    </span>
                    {openPlatformId === platform.id ? (
                      <FiChevronUp className="w-6 h-6 text-gray-400" />
                    ) : (
                      <FiChevronDown className="w-6 h-6 text-gray-400" />
                    )}
                  </button>

                  {openPlatformId === platform.id && (
                    <div className="p-6 bg-white border-t border-gray-50 space-y-4">
                      {platform.journal_links.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {platform.journal_links.map((link) => (
                            <a
                              key={link.id}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-4 rounded bg-gray-50 hover:bg-ivory border border-transparent hover:border-academic-gold transition-all group"
                            >
                              <span className="text-md font-semibold text-academic-navy">
                                {link.journal_title}
                              </span>
                              <FiExternalLink className="w-4 h-4 text-gray-300 group-hover:text-academic-gold" />
                            </a>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">No journals currently listed for this platform.</p>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

