'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FiCalendar, FiBook, FiFileText, FiUsers, 
  FiExternalLink, FiArrowRight, FiInfo, 
  FiChevronRight, FiDownload, FiEdit3,
  FiStar
} from 'react-icons/fi';
import { journalsApi, articlesApi, volumesApi } from '@/lib/api';
import { ArticleCard } from '@/components/ArticleCard';
import 'react-quill/dist/quill.snow.css';

type TabType = 'home' | 'aims' | 'editorial' | 'about' | 'indexing' | 'thematic' | 'special';

export default function JournalPage() {
  const params = useParams();
  const journalSlug = params.journal_slug as string;
  const [activeTab, setActiveTab] = useState<TabType>('home');

  const { data: journal, isLoading: journalLoading } = useQuery({
    queryKey: ['journal', journalSlug],
    queryFn: () => journalsApi.getBySlug(journalSlug),
    enabled: !!journalSlug,
  });

  const { data: articles, isLoading: articlesLoading } = useQuery({
    queryKey: ['journal-articles', journalSlug],
    queryFn: () => articlesApi.recent(journalSlug),
    enabled: !!journalSlug,
  });

  const { data: specialArticles, isLoading: specialArticlesLoading } = useQuery({
    queryKey: ['journal-special-articles', journalSlug],
    queryFn: () => articlesApi.specialIssues(journalSlug),
    enabled: !!journalSlug,
  });

  const { data: volumesData } = useQuery({
    queryKey: ['journal-volumes', journalSlug],
    queryFn: () => volumesApi.listByJournal(journalSlug),
    enabled: !!journalSlug,
  });

  const articlesList = articles?.results || articles || [];
  const specialArticlesList = specialArticles?.results || specialArticles || [];
  const volumesList = volumesData?.results || volumesData || [];

  // Group articles by volume and issue
  const groupedArticles = articlesList.reduce((acc: any, article: any) => {
    if (article.is_special_issue) return acc; // Skip special issues in normal grouping

    const volNum = article.volume_number || 'Unknown Volume';
    const issueNum = article.issue_number || 'Unknown Issue';
    const year = article.year || '';
    const key = `Volume ${volNum}, Issue ${issueNum} (${year})`;
    
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(article);
    return acc;
  }, {});

  if (journalLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-academic-blue"></div>
      </div>
    );
  }

  if (!journal) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Journal Not Found</h1>
          <p className="text-gray-600 mb-4">The journal you're looking for doesn't exist.</p>
          <Link href="/journals" className="text-academic-blue hover:text-academic-navy">
            Browse all journals →
          </Link>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    const contentClasses = "bg-white p-8 rounded-xl border border-gray-100 min-h-[400px]";
    
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-8">
            {Object.keys(groupedArticles).length > 0 ? (
              Object.entries(groupedArticles).map(([groupKey, groupArticles]: [string, any]) => (
                <div key={groupKey} className="space-y-4">
                  <div className="bg-gray-100 px-4 py-2 rounded-lg">
                    <h3 className="text-lg font-bold text-academic-navy">{groupKey}</h3>
                  </div>
                  <div className="space-y-4">
                    {groupArticles.map((article: any) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <p className="text-gray-500">No recent articles published yet.</p>
              </div>
            )}
          </div>
        );
      case 'special':
        return (
          <div className={contentClasses}>
            <h2 className="text-2xl font-bold text-academic-navy mb-6 border-b pb-2 flex items-center gap-2">
              <FiStar className="text-academic-gold" />
              Special Issues
            </h2>
            {specialArticlesLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-academic-blue"></div>
              </div>
            ) : specialArticlesList.length > 0 ? (
              <div className="space-y-4">
                {specialArticlesList.map((article: any) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-gray-500 italic">No special issue articles available at this time.</p>
              </div>
            )}
          </div>
        );
      case 'aims':
        return (
          <div className={contentClasses}>
            <h2 className="text-2xl font-bold text-academic-navy mb-6 border-b pb-2">Aims and Scope</h2>
            <div className="ql-editor !p-0" dangerouslySetInnerHTML={{ __html: journal.aims_and_scope || 'No information available.' }} />
          </div>
        );
      case 'editorial':
        const groupedMembers = (journal.editorial_board_members || []).reduce((acc: any, member: any) => {
          if (!acc[member.designation]) {
            acc[member.designation] = [];
          }
          acc[member.designation].push(member);
          return acc;
        }, {});

        return (
          <div className={contentClasses}>
            <h2 className="text-2xl font-bold text-academic-navy mb-8 border-b pb-2">Editorial Board</h2>
            
            {Object.keys(groupedMembers).length > 0 ? (
              <div className="space-y-12">
                {Object.entries(groupedMembers).map(([designation, members]: [string, any]) => (
                  <div key={designation} className="space-y-6">
                    <h3 className="text-xl font-bold text-academic-blue border-l-4 border-academic-gold pl-4 bg-academic-blue/5 py-2">
                      {designation}
                    </h3>
                    <div className="divide-y divide-gray-100">
                      {members.map((member: any) => (
                        <div key={member.id} className="flex flex-col md:flex-row gap-4 py-2 first:pt-0 last:pb-0 transition-all hover:bg-gray-50/50 px-2 -mx-2 rounded-lg items-start">
                          {member.image_url && (
                            <div className="flex-shrink-0 w-full md:w-28 lg:w-32">
                              <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden shadow-sm border border-gray-100 bg-gray-50">
                                <Image
                                  src={member.image_url}
                                  alt={member.name}
                                  fill
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 128px, 128px"
                                  className="object-cover"
                                />
                              </div>
                            </div>
                          )}
                          <div className="flex-1 min-w-0 flex flex-col pt-0.5">
                            <h4 className="text-base font-bold text-gray-900 leading-tight mb-0.5">{member.name}</h4>
                            <div className="text-gray-600 space-y-0.5">
                              {member.department && (
                                <p className="text-[12px] font-medium text-academic-navy/80 leading-tight">{member.department}</p>
                              )}
                              {member.institution && (
                                <p className="text-[12px] leading-tight">{member.institution}</p>
                              )}
                              {member.country && (
                                <p className="text-[10px] font-bold uppercase tracking-widest text-academic-gold mt-0.5">{member.country}</p>
                              )}
                            </div>
                            {member.description && (
                              <div 
                                className="ql-editor !p-0 mt-0.5 text-gray-700 leading-tight text-[12px] italic border-l-2 border-academic-gold/20 pl-3 editorial-description max-h-20 overflow-y-auto scrollbar-hide"
                                dangerouslySetInnerHTML={{ __html: member.description }}
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 italic">
                No editorial board information available.
              </div>
            )}
          </div>
        );
      case 'about':
        return (
          <div className={contentClasses}>
            <h2 className="text-2xl font-bold text-academic-navy mb-6 border-b pb-2">About Journal</h2>
            <div className="ql-editor !p-0" dangerouslySetInnerHTML={{ __html: journal.description || journal.short_description || 'No information available.' }} />
          </div>
        );
      case 'indexing':
        // Group indexing entries by category
        const groupedIndexing = (journal.indexing_entries || []).reduce((acc: any, entry: any) => {
          const category = entry.category || 'Research Integrity & Quality Assurance';
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(entry);
          return acc;
        }, {});

        return (
          <div className={contentClasses}>
            <h2 className="text-2xl font-bold text-academic-navy mb-8 border-b pb-2">Indexing</h2>
            
            {Object.keys(groupedIndexing).length > 0 ? (
              <div className="space-y-12">
                {Object.entries(groupedIndexing).map(([category, entries]: [string, any]) => (
                  <div key={category} className="space-y-6">
                    <h3 className="text-lg font-bold text-academic-blue border-l-4 border-academic-gold pl-4 bg-academic-blue/5 py-2">
                      {category}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {entries.map((entry: any) => (
                        <div key={entry.id} className="flex flex-col items-center text-center space-y-3 group">
                          {entry.url ? (
                            <a 
                              href={entry.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="relative w-full aspect-[3/2] bg-white rounded-lg border border-gray-100 shadow-sm p-4 flex items-center justify-center transition-all group-hover:shadow-md group-hover:border-academic-blue/30"
                              title={entry.title}
                            >
                              {entry.logo_url ? (
                                <div className="relative w-full h-full">
                                  <Image
                                    src={entry.logo_url}
                                    alt={entry.title}
                                    fill
                                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                                    className="object-contain"
                                  />
                                </div>
                              ) : (
                                <span className="font-bold text-gray-400 text-xs">{entry.title}</span>
                              )}
                            </a>
                          ) : (
                            <div className="relative w-full aspect-[3/2] bg-white rounded-lg border border-gray-100 shadow-sm p-4 flex items-center justify-center">
                              {entry.logo_url ? (
                                <div className="relative w-full h-full">
                                  <Image
                                    src={entry.logo_url}
                                    alt={entry.title}
                                    fill
                                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                                    className="object-contain"
                                  />
                                </div>
                              ) : (
                                <span className="font-bold text-gray-400 text-xs">{entry.title}</span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="ql-editor !p-0" dangerouslySetInnerHTML={{ __html: journal.indexing || 'No information available.' }} />
            )}
          </div>
        );
      case 'thematic':
        return (
          <div className={contentClasses}>
            <h2 className="text-2xl font-bold text-academic-navy mb-6 border-b pb-2">Open thematic issue</h2>
            <div className="ql-editor !p-0" dangerouslySetInnerHTML={{ __html: journal.open_thematic_issue || 'No information available.' }} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-ivory">
      {/* Journal Header Banner */}
      <section 
        className="relative py-12 md:py-16 text-white overflow-hidden"
        style={{ 
          backgroundColor: journal.primary_color || '#1e3a5f',
          backgroundImage: `linear-gradient(135deg, ${journal.primary_color || '#1e3a5f'} 0%, ${journal.secondary_color || '#2563eb'} 100%)`
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -mr-48 -mt-48"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {journal.cover_image && (
              <div className="flex-shrink-0 w-40 h-52 relative rounded-lg overflow-hidden shadow-2xl border-2 border-white/20">
                <Image src={journal.cover_image} alt={journal.title} fill sizes="160px" className="object-cover" />
              </div>
            )}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-serif font-bold mb-3 leading-tight">
                {journal.title}
              </h1>
              
              {/* ISSN Numbers */}
              <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-white/90 mb-4">
                {journal.issn_print && (
                  <div className="flex items-center gap-2">
                    <span className="text-white/60">ISSN (Print):</span>
                    <span className="font-medium font-mono">{journal.issn_print}</span>
                  </div>
                )}
                {journal.issn_online && (
                  <div className="flex items-center gap-2">
                    <span className="text-white/60">ISSN (Online):</span>
                    <span className="font-medium font-mono">{journal.issn_online}</span>
                  </div>
                )}
              </div>

              {/* Editor Info */}
              {journal.editor_in_chief && (
                <div className="flex items-center justify-center md:justify-start gap-3 mb-4 text-white/90">
                  {journal.editor_in_chief_image ? (
                    <div className="relative w-10 h-10 rounded-full border-2 border-academic-gold overflow-hidden shadow-md">
                      <Image 
                        src={journal.editor_in_chief_image} 
                        alt={journal.editor_in_chief} 
                        fill 
                        sizes="40px"
                        className="object-cover" 
                      />
                    </div>
                  ) : (
                    <FiUsers className="w-5 h-5 text-academic-gold" />
                  )}
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-[10px] text-white/60 uppercase tracking-widest font-bold">Editor-in-Chief</span>
                    <span className="font-semibold text-base">{journal.editor_in_chief}</span>
                  </div>
                </div>
              )}

              {/* Short Description */}
              <div className="max-w-3xl mb-8">
                <p className="text-lg text-white/80 leading-relaxed italic">
                  {journal.short_description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <Link
                  href={journal.submission_url || '#'}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-academic-gold hover:bg-yellow-500 text-academic-navy font-bold rounded-full transition-all transform hover:scale-105 shadow-lg"
                >
                  <FiEdit3 className="w-5 h-5" />
                  Submit Your Work
                </Link>
                {journal.flyer_pdf && (
                  <a
                    href={journal.flyer_pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-academic-gold hover:bg-yellow-500 text-academic-navy font-bold rounded-full transition-all transform hover:scale-105 shadow-lg"
                  >
                    <FiDownload className="w-5 h-5" />
                    Download Flyer
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column - Navigation & Volumes (1/4) */}
          <aside className="lg:col-span-1 space-y-8">
            {/* Journal Information Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100">
                <h3 className="font-bold text-academic-navy flex items-center gap-2">
                  <FiInfo className="w-4 h-4" />
                  Journal Information
                </h3>
            </div>
              <nav className="flex flex-col">
                {[
                  { id: 'home', label: 'Home' },
                  { id: 'aims', label: 'Aims and Scope' },
                  { id: 'editorial', label: 'Editorial Board' },
                  { id: 'about', label: 'About Journal' },
                  { id: 'indexing', label: 'Indexing' },
                  { id: 'thematic', label: 'Open thematic issue' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center gap-3 px-4 py-3 text-left transition-colors border-l-4 ${
                      activeTab === tab.id 
                        ? 'bg-academic-blue/5 border-academic-blue text-academic-blue font-semibold' 
                        : 'border-transparent text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <FiChevronRight className={`w-4 h-4 transition-transform ${activeTab === tab.id ? 'rotate-90' : ''}`} />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Special Issues Tab Button */}
            <button
              onClick={() => setActiveTab('special')}
              className={`w-full flex items-center justify-between gap-3 px-4 py-4 rounded-xl shadow-sm border transition-all ${
                activeTab === 'special'
                  ? 'bg-academic-navy text-white border-academic-navy ring-2 ring-academic-gold/50'
                  : 'bg-white text-academic-navy border-gray-100 hover:border-academic-blue hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <FiStar className={`w-5 h-5 ${activeTab === 'special' ? 'text-academic-gold' : 'text-academic-blue'}`} />
                <span className="font-bold">Special Issues</span>
              </div>
              <FiChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'special' ? 'rotate-90' : ''}`} />
            </button>

            {/* Volumes & Issues List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100">
                <h3 className="font-bold text-academic-navy flex items-center gap-2">
              <FiBook className="w-4 h-4" />
                  Volumes
                </h3>
          </div>
              <div className="max-h-[400px] overflow-y-auto">
                {volumesList.length > 0 ? (
                  <div className="divide-y divide-gray-50">
                    {volumesList.map((vol: any) => (
                      <div key={vol.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <Link href={`/${journalSlug}/volumes/${vol.volume_number}`} className="block group">
                          <p className="font-semibold text-gray-900 group-hover:text-academic-blue transition-colors">
                            Volume {vol.volume_number}
                          </p>
                          <p className="text-sm text-gray-500">{vol.year}</p>
            </Link>
          </div>
              ))}
            </div>
          ) : (
                  <p className="p-4 text-sm text-gray-500 italic">No volumes available.</p>
                )}
              </div>
            </div>
          </aside>

          {/* Right Column - Content (3/4) */}
          <main className="lg:col-span-3">
            {renderTabContent()}
          </main>
        </div>
      </div>

      <style jsx global>{`
        .ql-editor h1, .ql-editor h2, .ql-editor h3 {
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          font-weight: bold;
          color: #1a365d;
        }
        .ql-editor h1 { font-size: 2em; }
        .ql-editor h2 { font-size: 1.5em; }
        .ql-editor h3 { font-size: 1.25em; }
        .ql-editor p {
          margin-bottom: 1em;
          line-height: 1.6;
        }
        .ql-editor ul, .ql-editor ol {
          margin-bottom: 1em;
          padding-left: 1.5em;
        }
        .ql-editor ul { list-style-type: disc; }
        .ql-editor ol { list-style-type: decimal; }
        
        /* Compact description for Editorial Board */
        .editorial-description p {
          margin-bottom: 0px !important;
          line-height: 1.25 !important;
        }
        .editorial-description ul, .editorial-description ol {
          margin-bottom: 0px !important;
        }
        /* Hide scrollbar but allow scrolling */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
