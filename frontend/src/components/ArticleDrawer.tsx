'use client';

import { useState, useEffect } from 'react';
import { 
  FiX, FiUser, FiDownload, FiList, FiGrid, FiShare2, 
  FiCheck, FiCopy, FiFile, FiFileText, FiMail, FiMapPin, FiBookOpen,
  FiInfo, FiShield
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { articlesApi } from '@/lib/api';

interface ArticleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'authors' | 'downloads' | 'references' | 'tables' | 'share' | 'about' | null;
  data: any;
}

export function ArticleDrawer({ isOpen, onClose, type, data }: ArticleDrawerProps) {
  const [copied, setStatus] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      // Typeset MathJax when drawer opens or content changes
      if (typeof window !== 'undefined' && window.MathJax && window.MathJax.typeset) {
        window.MathJax.typeset();
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, type]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setStatus(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setStatus(false), 2000);
  };

  if (!isOpen) return null;

  const renderContent = () => {
    switch (type) {
      case 'authors':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 bg-academic-navy/5 rounded-lg flex items-center justify-center text-academic-navy">
                <FiUser className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Author Information</h3>
            </div>
            
            <div className="space-y-10">
              {data.authors?.map((author: any) => (
                <div key={author.id} className="group">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-base font-black text-academic-blue leading-tight">{author.full_name}</h4>
                    {author.is_corresponding && (
                      <span className="text-[8px] font-black uppercase tracking-widest bg-academic-gold/10 text-academic-gold px-1.5 py-0.5 rounded">Corresponding</span>
                    )}
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {author.email && (
                      <div className="flex items-center gap-2.5 text-[11px] font-bold text-gray-500">
                        <FiMail className="w-3.5 h-3.5 text-gray-300" />
                        <a href={`mailto:${author.email}`} className="hover:text-academic-blue transition-colors">{author.email}</a>
                      </div>
                    )}
                    {author.orcid_id && (
                      <div className="flex items-center gap-2.5 text-[11px] font-bold text-gray-500">
                        <img src="https://orcid.org/assets/vectors/orcid.logo.icon.svg" alt="ORCID" className="w-3.5 h-3.5" />
                        <a 
                          href={author.orcid_id.startsWith('http') ? author.orcid_id : `https://orcid.org/${author.orcid_id}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-academic-blue transition-colors"
                        >
                          {author.orcid_id.replace('https://orcid.org/', '')}
                        </a>
                      </div>
                    )}
                    {(author.affiliation || author.department) && (
                      <div className="flex items-start gap-2.5 text-[11px] text-gray-500 leading-relaxed">
                        <FiMapPin className="w-3.5 h-3.5 text-gray-300 mt-0.5" />
                        <div className="font-bold">
                          {author.department && <span>{author.department}, </span>}
                          {author.affiliation && <span className="text-gray-400 font-medium">{author.affiliation}</span>}
                        </div>
                      </div>
                    )}
                  </div>

                  {author.bio && (
                    <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100/50">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-2">Biography</span>
                      <div 
                        className="text-[12px] leading-relaxed text-gray-600 line-clamp-4 hover:line-clamp-none transition-all cursor-default" 
                        dangerouslySetInnerHTML={{ __html: author.bio }} 
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case 'downloads':
        const journalSlug = data.journal_info?.slug || data.journal_slug;
        const articleSlug = data.slug;
        
        const files = [
          { label: 'PDF Document', url: data.pdf_file ? articlesApi.getPdfUrl(journalSlug, articleSlug) : null, icon: FiFileText, key: 'pdf' },
          { label: 'XML Source', url: data.xml_file ? articlesApi.getXmlUrl(journalSlug, articleSlug) : null, icon: FiFile, key: 'xml' },
          { label: 'ePUB Format', url: data.epub_file, icon: FiBookOpen, key: 'epub' },
          { label: 'PRC Format', url: data.prc_file, icon: FiFile, key: 'prc' },
          { label: 'Mobi Format', url: data.mobi_file, icon: FiFile, key: 'mobi' },
        ].filter(f => f.url);

        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-academic-navy border-b pb-2">Download Article</h3>
            <div className="grid gap-4">
              {files.map((file) => (
                <a
                  key={file.key}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-academic-blue hover:bg-blue-50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-academic-blue">
                    <file.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{file.label}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-tighter">Click to download</p>
                  </div>
                </a>
              ))}
              {files.length === 0 && (
                <p className="text-center py-8 text-gray-500 italic">No downloadable files available.</p>
              )}
            </div>
          </div>
        );
      case 'references':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 bg-academic-navy/5 rounded-lg flex items-center justify-center text-academic-navy">
                <FiList className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">References</h3>
            </div>
            
            {data.html_content?.references_html ? (
              <div 
                className="text-sm text-gray-700 leading-relaxed references-drawer-list"
                dangerouslySetInnerHTML={{ __html: data.html_content.references_html }}
              />
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-400 text-sm font-medium italic">No references found in XML.</p>
              </div>
            )}
          </div>
        );
      case 'tables':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 bg-academic-navy/5 rounded-lg flex items-center justify-center text-academic-navy">
                <FiGrid className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Tables & Figures</h3>
            </div>

            {(data.tables?.length > 0 || data.figures?.length > 0) ? (
              <div className="space-y-12">
                {/* Tables */}
                {data.tables?.map((table: any) => (
                  <div key={table.id} className="space-y-4 group">
                    <h4 className="text-sm font-black text-academic-blue uppercase tracking-wider">{table.label || 'Table'}</h4>
                    <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm bg-white">
                      <div className="overflow-x-auto custom-scrollbar">
                        <div 
                          className="text-[12px] p-1 drawer-table-container" 
                          dangerouslySetInnerHTML={{ __html: table.table_html }} 
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Figures */}
                {data.figures?.map((figure: any) => (
                  <div key={figure.id} className="space-y-4 group">
                    <h4 className="text-sm font-black text-academic-blue uppercase tracking-wider">{figure.label || 'Figure'}</h4>
                    <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm bg-white p-2">
                      <img 
                        src={figure.image_file} 
                        alt={figure.label} 
                        className="w-full h-auto rounded-lg shadow-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-400 text-sm font-medium italic">No tables or figures found.</p>
              </div>
            )}
          </div>
        );
      case 'share':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-academic-navy border-b pb-2">Share Article</h3>
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
              <p className="text-sm text-gray-600 font-medium">Copy article URL:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={typeof window !== 'undefined' ? window.location.href : ''}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                />
                <button
                  onClick={handleCopyLink}
                  className="p-2 bg-academic-navy text-white rounded-lg hover:bg-academic-blue transition-colors"
                >
                  {copied ? <FiCheck /> : <FiCopy />}
                </button>
              </div>
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 bg-academic-navy/5 rounded-lg flex items-center justify-center text-academic-navy">
                <FiInfo className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">About Article</h3>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h4 className="text-xs font-black uppercase tracking-widest text-academic-navy/60 mb-4 flex items-center gap-2">
                  <FiShield className="w-3 h-3" />
                  Copyright & License
                </h4>
                <div className="text-sm text-gray-700 leading-relaxed space-y-3">
                  {data.license_text ? (
                    <div 
                      className="prose prose-sm max-w-none prose-p:text-gray-600"
                      dangerouslySetInnerHTML={{ __html: data.license_text }} 
                    />
                  ) : (
                    <p className="text-gray-500 italic">Open Access. Distributed under the terms of the Creative Commons Attribution 4.0 International License (CC BY 4.0).</p>
                  )}
                </div>
              </div>

              {/* Publication History */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h4 className="text-xs font-black uppercase tracking-widest text-academic-navy/60 mb-4">Article History</h4>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { label: 'Received', date: data.received_date },
                    { label: 'Revised', date: data.revised_date },
                    { label: 'Accepted', date: data.accepted_date },
                    { label: 'Published', date: data.published_date }
                  ].filter(h => h.date).map((item) => (
                    <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                      <span className="text-xs font-bold text-gray-400">{item.label}</span>
                      <span className="text-xs font-black text-gray-900">
                        {new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Keywords if available */}
              {data.keywords && data.keywords.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h4 className="text-xs font-black uppercase tracking-widest text-academic-navy/60 mb-4">Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.keywords.map((kw: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-gray-50 text-gray-600 text-[10px] font-bold rounded-full border border-gray-100 uppercase tracking-wider">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex flex-col">
            <span className="font-black uppercase tracking-[0.2em] text-[10px] text-academic-gold mb-0.5">Article Resources</span>
            <span className="text-[11px] font-bold text-gray-400 truncate max-w-[240px] italic">
              {data.title}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-50 rounded-full transition-all text-gray-400 hover:text-gray-900 border border-transparent hover:border-gray-100"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {renderContent()}
        </div>
      </div>

      <style jsx global>{`
        /* Consistent Reference Styling */
        .references-list-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .reference-line {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          font-size: 0.8125rem;
          line-height: 1.6;
          color: #4b5563;
        }
        .reference-label {
          font-weight: 900;
          color: #1e3a8a;
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          min-width: 1.8rem;
          margin-top: 0.1rem;
        }
        .reference-label::before { content: "["; }
        .reference-label::after { content: "]"; }
        
        .reference-content {
          flex: 1;
        }
        .reference-content a {
          color: #1e3a8a;
          text-decoration: none;
          word-break: break-all;
        }
        .reference-content a:hover {
          text-decoration: underline;
        }

        /* Support for standard LI references (Fallback) */
        .references-drawer-list {
          counter-reset: ref-counter;
        }
        .references-drawer-list ol, .references-drawer-list ul { 
          list-style: none !important; 
          padding-left: 0 !important; 
        }
        .references-drawer-list li { 
          margin-bottom: 1.5rem; 
          position: relative;
          padding-left: 2.2rem;
          font-size: 0.8125rem;
          line-height: 1.6;
          color: #4b5563;
        }
        .references-drawer-list li::before {
          counter-increment: ref-counter;
          content: "[" counter(ref-counter) "]";
          position: absolute;
          left: 0;
          top: 0;
          font-weight: 900;
          color: #1e3a8a;
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          width: 2rem;
        }

        /* Table Styles for Drawer */
        .drawer-table-container table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }
        .drawer-table-container th {
          background-color: #f8fafc;
          color: #334155;
          font-weight: 800;
          text-transform: uppercase;
          font-size: 10px;
          letter-spacing: 0.05em;
          padding: 12px 16px;
          text-align: left;
          border-bottom: 2px solid #e2e8f0;
        }
        .drawer-table-container td {
          padding: 12px 16px;
          font-size: 11px;
          color: #64748b;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }
        .drawer-table-container sub, .drawer-table-container sup {
          font-size: 70%;
          line-height: 0;
          position: relative;
          vertical-align: baseline;
        }
        .drawer-table-container sub { bottom: -0.25em; }
        .drawer-table-container sup { top: -0.5em; }
        .drawer-table-container tr:last-child td {
          border-bottom: none;
        }
        .drawer-table-container tr:hover td {
          background-color: #f8fafc;
          color: #1e3a8a;
        }

        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
}

