'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FiChevronRight, FiDownload, FiUser, FiCalendar, 
  FiTag, FiBookOpen, FiHash, FiAward, FiArrowLeft, 
  FiArrowRight, FiList, FiGrid, FiShare2, FiInfo, FiExternalLink, FiBarChart2, FiClock, FiFileText
} from 'react-icons/fi';
import { journalsApi, articlesApi } from '@/lib/api';
import { ArticleDrawer } from '@/components/ArticleDrawer';
import Script from 'next/script';

declare global {
  interface Window {
    MathJax: any;
  }
}

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const journalSlug = params.journal_slug as string;
  const articleSlug = params.article_slug as string;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<'authors' | 'downloads' | 'references' | 'tables' | 'share' | 'about' | null>(null);

  const { data: journal } = useQuery({
    queryKey: ['journal', journalSlug],
    queryFn: () => journalsApi.getBySlug(journalSlug),
    enabled: !!journalSlug,
  });

  const { data: article, isLoading: articleLoading } = useQuery({
    queryKey: ['article', journalSlug, articleSlug],
    queryFn: () => articlesApi.getBySlug(journalSlug, articleSlug),
    enabled: !!journalSlug && !!articleSlug,
  });

  const { data: fullText, isLoading: fullTextLoading } = useQuery({
    queryKey: ['article-fulltext', journalSlug, articleSlug],
    queryFn: () => articlesApi.getFullText(journalSlug, articleSlug),
    enabled: !!journalSlug && !!articleSlug,
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && fullText && window.MathJax && window.MathJax.typeset) {
      window.MathJax.typeset();
    }
  }, [fullText]);

  const openDrawer = (type: 'authors' | 'downloads' | 'references' | 'tables' | 'share' | 'about') => {
    setDrawerType(type);
    setDrawerOpen(true);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isLoading = articleLoading || fullTextLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-academic-navy border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h1>
          <p className="text-gray-600 mb-4">The article you're looking for doesn't exist.</p>
          <Link href={`/${journalSlug}`} className="text-academic-blue hover:text-academic-navy">
            Back to journal →
          </Link>
        </div>
      </div>
    );
  }

  const htmlContent = fullText?.html_content;
  const publishDate = formatDate(article.published_date);

  return (
    <div className="min-h-screen bg-white relative font-sans text-gray-900">
      <Script id="mathjax-config" strategy="beforeInteractive">
        {`
          window.MathJax = {
            loader: { load: ['input/mml', 'output/svg', 'a11y/assistive-mml'] },
            tex: { 
              inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
              displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
              processEscapes: true,
              processEnvironments: true
            },
            mml: {
              forceReparse: true
            },
            svg: { 
              fontCache: 'global',
              scale: 1,
              minScale: 0.5,
              matchFontHeight: true,
              useFontCache: true
            },
            options: {
              enableMenu: true,
              processHtmlClass: 'math-container|tex-math',
              ignoreHtmlClass: 'tex2jax_ignore',
              renderActions: {
                findScript: [10, function (doc) {
                  for (const node of Array.from(document.querySelectorAll('script[type^="math/mml"]'))) {
                    const math = new doc.options.MathItem(node.textContent, doc.inputJax[0], true);
                    const text = document.createTextNode('');
                    node.parentNode.replaceChild(text, node);
                    math.start = {node: text, delim: '', n: 0};
                    math.end = {node: text, delim: '', n: 0};
                    doc.math.push(math);
                  }
                }, '']
              }
            }
          };
        `}
      </Script>
      <Script 
        src="https://unpkg.com/mathjs@14.2.1/lib/browser/math.js" 
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />
      <Script 
        src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-svg.js" 
        strategy="afterInteractive"
        crossOrigin="anonymous"
        onLoad={() => {
          if (window.MathJax && window.MathJax.typeset) {
            window.MathJax.typeset();
          }
        }}
      />
      {/* Top Breadcrumb Bar - Clean & Minimal */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <Link href="/" className="hover:text-academic-blue transition-colors">Home</Link>
            <FiChevronRight className="w-3 h-3" />
            <Link href={`/${journalSlug}`} className="hover:text-academic-blue transition-colors">
              {journal?.short_title || journal?.title || 'Journal'}
            </Link>
            <FiChevronRight className="w-3 h-3" />
            <span className="text-gray-900">Article Details</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 relative">
            <header className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-academic-gold bg-academic-gold/5 px-2 py-0.5 rounded">
                  {article.article_type_display || 'Research Article'}
                </span>
                {article.is_open_access && (
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-600 bg-green-50 px-2 py-0.5 rounded">
                    Open Access
            </span>
          )}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-black text-gray-900 leading-[1.15]">
            {article.title}
          </h1>

              <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-2 pt-1">
                {article.authors?.map((author: any, index: number) => (
                  <div key={author.id} className="flex items-center">
                    <button 
                      type="button"
                      onClick={() => openDrawer('authors')}
                      className="text-base font-bold text-academic-blue hover:text-academic-navy border-b border-transparent hover:border-academic-gold transition-all"
                    >
                    {author.full_name}
                    {author.is_corresponding && (
                        <sup className="text-academic-gold ml-0.5">*</sup>
                    )}
                    </button>
                    {index < article.authors.length - 1 && <span className="mr-1.5 text-gray-300">,</span>}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] font-bold uppercase tracking-wider text-gray-500 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Journal:</span>
                  <Link href={`/${journalSlug}`} className="text-academic-blue hover:underline">
                    {journal?.title}
                  </Link>
                </div>
                {article.article_id_code && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Article ID:</span>
                    <span className="text-gray-900 font-black">{article.article_id_code}</span>
                  </div>
                )}
                {article.received_date && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Received:</span>
                    <span className="text-gray-900 font-black">{formatDate(article.received_date)}</span>
                </div>
              )}
                {article.revised_date && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Revised:</span>
                    <span className="text-gray-900 font-black">{formatDate(article.revised_date)}</span>
            </div>
          )}
                {article.accepted_date && (
              <div className="flex items-center gap-2">
                    <span className="text-gray-400">Accepted:</span>
                    <span className="text-gray-900 font-black">{formatDate(article.accepted_date)}</span>
              </div>
            )}
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Published:</span>
                  <span className="text-gray-900 font-black">{publishDate || 'Processing'}</span>
                </div>
              <div className="flex items-center gap-2">
                  <span className="text-gray-400">DOI:</span>
                  {article.doi ? (
                    <a href={`https://doi.org/${article.doi}`} target="_blank" rel="noopener noreferrer" className="text-academic-blue hover:underline">
                      {article.doi}
                    </a>
                  ) : 'N/A'}
                </div>
              </div>
            </header>

            {/* Premium CTA Block */}
            <div className="flex flex-wrap items-center gap-2 bg-gray-50/50 p-2.5 rounded-2xl border border-gray-100 mt-4">
            <Link
              href={`/${journalSlug}/article/${articleSlug}/fulltext`}
                className="inline-flex items-center gap-2 px-5 py-2 bg-academic-navy text-white font-black uppercase tracking-widest text-[9px] rounded-xl hover:bg-academic-blue transition-all shadow-lg shadow-academic-navy/10"
            >
                <FiBookOpen className="w-3.5 h-3.5" />
                View Abstract
            </Link>
              
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'PDF', url: article.pdf_file ? articlesApi.getPdfUrl(journalSlug, articleSlug) : null, color: 'text-red-600 bg-white border-gray-200' },
                  { label: 'XML', url: article.xml_file ? articlesApi.getXmlUrl(journalSlug, articleSlug) : null, color: 'text-emerald-600 bg-white border-gray-200' },
                  { label: 'ePUB', url: article.epub_file, color: 'text-blue-600 bg-white border-gray-200' },
                  { label: 'Mobi', url: article.mobi_file, color: 'text-orange-600 bg-white border-gray-200' },
                  { label: 'PRC', url: article.prc_file, color: 'text-purple-600 bg-white border-gray-200' },
                ].filter(f => f.url).map((file) => (
                  <a
                    key={file.label}
                    href={file.url}
              target="_blank"
              rel="noopener noreferrer"
                    download
                    className={`inline-flex items-center gap-1.5 px-3 py-2 border font-black uppercase tracking-widest rounded-xl transition-all text-[9px] hover:shadow-md ${file.color}`}
            >
                    <FiDownload className="w-3 h-3" />
                    {file.label}
            </a>
                ))}
          </div>
        </div>

            <main className="mt-4 space-y-4 relative">
              {/* Docked Utility Rail - Floating Wrapper (Takes no space) */}
              <div className="absolute left-full top-0 h-full w-20 hidden xl:block">
                <div className="sticky top-32 ml-4 lg:ml-0 flex flex-col gap-0.5 p-1 bg-white/90 backdrop-blur-md rounded-full shadow-xl border border-gray-100 z-40 items-center w-10">
                  {[
                    { type: 'authors' as const, icon: FiUser, label: 'Authors' },
                    { type: 'about' as const, icon: FiInfo, label: 'About' },
                    { type: 'downloads' as const, icon: FiDownload, label: 'Downloads' },
                    { type: 'references' as const, icon: FiList, label: 'References' },
                    { type: 'tables' as const, icon: FiGrid, label: 'Figures' },
                    { type: 'share' as const, icon: FiShare2, label: 'Share' },
                  ].map((item) => (
                    <button 
                      key={item.type}
                      type="button"
                      onClick={() => openDrawer(item.type)}
                      className="p-2 text-gray-400 hover:text-academic-blue hover:bg-gray-50 rounded-full transition-all group relative"
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="absolute right-full mr-4 px-2 py-1 bg-gray-900 text-white text-[9px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-sm">
                        {item.label}
                    </span>
                    </button>
                  ))}
                </div>
              </div>

              <article className="bg-white rounded-3xl p-0">
                {htmlContent ? (
                  <div className="article-content font-serif">
                    {/* Abstract Section */}
                    <section className="mb-12 pb-12 border-b border-gray-100">
                      <h2 className="text-xl font-black text-academic-navy mb-6 uppercase tracking-widest font-sans">Abstract</h2>
                      {htmlContent.abstract_html ? (
                        <div 
                          className="text-base leading-relaxed italic text-gray-700 ql-editor !p-0 abstract-content-container"
                          dangerouslySetInnerHTML={{ __html: htmlContent.abstract_html }} 
                        />
                      ) : (
                        <div className="text-base leading-relaxed italic text-gray-700">
                          {article.abstract}
                        </div>
                      )}

                      {/* Keywords display after abstract */}
                      {(article.keywords_display || (article.keywords && article.keywords.length > 0)) && (
                        <div className="mt-8 pt-6 border-t border-gray-50">
                          <span className="text-[12px] font-black uppercase tracking-[0.2em] text-academic-navy/60 block mb-3">Keywords</span>
                          <div className="flex flex-wrap gap-2">
                            {(article.keywords_display ? article.keywords_display.split(',') : article.keywords).map((k: string) => (
                              <span key={k} className="px-3 py-1 bg-gray-50 text-gray-600 text-[11px] font-bold rounded-md border border-gray-100 hover:border-academic-blue transition-colors cursor-default">
                                {k.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </section>

                    {/* Body Content */}
                    <div 
                      className="max-w-none article-body-content"
                      dangerouslySetInnerHTML={{ __html: htmlContent.body_html }}
                    />

                    {/* References */}
                    {htmlContent.references_html && (
                      <div className="mt-24 pt-12 border-t border-gray-100">
                        <h2 className="text-2xl font-black text-academic-navy mb-10 uppercase tracking-widest font-sans">References</h2>
                        <div 
                          className="max-w-none text-gray-600 references-list-container leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: htmlContent.references_html }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-32 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 text-gray-200 shadow-sm">
                      <FiFileText className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">Content Processing</h3>
                    <p className="text-gray-500 mb-10 max-w-md mx-auto leading-relaxed">
                      The full-text presentation is currently being optimized. 
                      {article.pdf_file ? ' Please use the definitive PDF version below.' : ''}
                    </p>
                    {article.pdf_file && (
                      <a
                        href={articlesApi.getPdfUrl(journalSlug, articleSlug)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-10 py-4 bg-academic-navy text-white font-black uppercase tracking-widest rounded-xl hover:bg-academic-blue transition-all shadow-xl shadow-academic-navy/10"
                      >
                        <FiDownload className="w-5 h-5" />
                        Download PDF
                      </a>
                    )}
              </div>
            )}
              </article>
            </main>
          </div>

          {/* Sidebar Area */}
          <aside className="lg:col-span-4 space-y-4">
            
            {/* Journal Card - Premium minimal */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110 duration-700" />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-white rounded-xl p-2.5 mb-3 shadow-lg border border-gray-50">
                  {journal?.logo ? (
                    <img src={journal.logo} alt="" className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full bg-academic-navy rounded-lg flex items-center justify-center text-white font-serif font-black text-xl">
                      {journal?.title?.[0]}
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-black text-gray-900 leading-tight mb-1">{journal?.title}</h3>
                <p className="text-[12px] text-black font-medium uppercase tracking-widest mb-3">Science Publishers</p>
                
                <div className="w-full grid grid-cols-2 gap-3 pt-3 border-t border-gray-50 mb-4 text-left">
                  <div>
                    <span className="text-[12px] font-medium text-black uppercase block">Print ISSN</span>
                    <span className="text-[9px] font-mono font-bold text-gray-700">{journal?.issn_print || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[12px] font-medium text-black uppercase block">Online ISSN</span>
                    <span className="text-[9px] font-mono font-bold text-gray-700">{journal?.issn_online || 'N/A'}</span>
                  </div>
                </div>

                <Link
                  href={`/${journalSlug}`}
                  className="w-full py-2.5 bg-academic-navy text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-academic-blue transition-all shadow-md"
                >
                  Visit Journal Page
                </Link>
              </div>
            </div>

            {/* Metrics Section - Clean & Statistical */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <FiBarChart2 className="text-academic-blue w-3.5 h-3.5" />
                <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Article Metrics</h4>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-medium text-black">Total Views</span>
                  <span className="text-lg font-black text-academic-navy">{(article.view_count || 1240).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-medium text-black">Downloads</span>
                  <span className="text-lg font-black text-academic-navy">{(article.download_count || 843).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-2">
              {[
                { label: 'About Article', type: 'about' as const, icon: FiInfo, color: 'hover:border-academic-navy' },
                { label: 'Figures & Tables', type: 'tables' as const, icon: FiGrid, color: 'hover:border-academic-blue' },
                { label: 'References', type: 'references' as const, icon: FiList, color: 'hover:border-academic-gold' },
              ].map((action) => (
                <button 
                  key={action.type}
                  type="button"
                  onClick={() => openDrawer(action.type)}
                  className={`flex items-center gap-3 w-full p-3.5 bg-white border border-gray-100 rounded-2xl transition-all group ${action.color} hover:shadow-md`}
                >
                  <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-white transition-colors">
                    <action.icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-academic-navy" />
                  </div>
                  <span className="font-black text-gray-900 text-[9px] uppercase tracking-widest">{action.label}</span>
                </button>
              ))}
          </div>

          </aside>
        </div>
      </div>

      {/* Drawer Component */}
      <ArticleDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        type={drawerType}
        data={article}
      />
    </div>
  );
}
