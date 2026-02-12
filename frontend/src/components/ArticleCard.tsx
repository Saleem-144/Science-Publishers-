'use client';

import Link from 'next/link';
import { FiCalendar, FiUser, FiBookOpen, FiUnlock, FiLock, FiHash, FiAward, FiTag, FiDownload } from 'react-icons/fi';
import { articlesApi } from '@/lib/api';

interface Author {
  author?: {
    full_name: string;
  };
  name?: string; // Alternative field from API
  order?: number;
}

interface Article {
  id: number;
  article_id_code?: string;
  title: string;
  slug: string;
  abstract?: string;
  keywords_display?: string;
  license_text?: string;
  published_date?: string;
  is_open_access?: boolean;
  is_special_issue?: boolean;
  article_type?: string; // e.g., "research", "review", "case_report"
  article_type_display?: string; // Human-readable: "Research Article", "Review Article"
  journal_slug?: string; // Direct from API
  journal_title?: string; // Direct from API
  journal_info?: {
    slug: string;
    title: string;
  };
  pdf_file?: string;
  xml_file?: string;
  epub_file?: string;
  mobi_file?: string;
  prc_file?: string;
  authors?: Author[];
  issue?: {
    volume?: {
      journal?: {
        title: string;
        slug: string;
      };
    };
  };
  volume?: {
    journal?: {
      title: string;
      slug: string;
    };
  };
}

interface ArticleCardProps {
  article: Article;
  compact?: boolean;
}

export function ArticleCard({ article, compact = false }: ArticleCardProps) {
  // Get journal info from various possible sources
  const journal = article.journal_info || article.issue?.volume?.journal || article.volume?.journal;
  const journalSlug = article.journal_slug || journal?.slug || 'journal';
  const journalTitle = article.journal_title || journal?.title || 'Journal';
  
  // Get authors - handle both API formats
  const authors = article.authors?.map(a => a.name || a.author?.full_name).filter(Boolean).join(', ') || 'Unknown Author';
  
  const publishDate = article.published_date 
    ? new Date(article.published_date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    : '';
  
  // Article type/category from admin panel (human-readable display)
  const articleType = article.article_type_display || 'Research Article';
  // Open access status from admin panel (defaults to true)
  const isOpenAccess = article.is_open_access !== false;

  return (
    <article className={`bg-[#F5F3ED] rounded-xl border border-ivory-200 shadow-sm hover:shadow-lg transition-all duration-300 ${compact ? 'p-4' : 'p-6'}`}>
      {/* Top Row: Article Type & Access Badge & Special Issue */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {/* Article Type Tag */}
        <span className="inline-flex items-center px-3 py-1 bg-academic-blue/10 text-academic-blue text-[10px] font-bold uppercase tracking-wider rounded-md border border-academic-blue/20">
          {articleType}
        </span>
        
        {/* Special Issue Tag */}
        {article.is_special_issue && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-academic-gold text-academic-navy text-[10px] font-bold uppercase tracking-wider rounded-md">
            Special Issue
          </span>
        )}
        
        {/* Access Status Badge */}
        {isOpenAccess ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-md border border-emerald-200">
            <FiUnlock className="w-3.5 h-3.5" />
            Open Access
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider rounded-md border border-amber-200">
            <FiLock className="w-3.5 h-3.5" />
            Subscription
          </span>
        )}

        {/* Article ID Code */}
        {article.article_id_code && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-gray-200">
            <FiHash className="w-3.5 h-3.5" />
            ID: {article.article_id_code}
          </span>
        )}
      </div>

      <Link href={`/${journalSlug}/article/${article.slug}`} className="block group">
        <h3 className={`font-bold text-gray-900 group-hover:text-academic-blue transition-colors line-clamp-2 ${compact ? 'text-sm' : 'text-lg'}`}>
          {article.title}
        </h3>
      </Link>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
        <span className="flex items-center gap-1.5">
          <FiUser className="w-4 h-4 text-academic-blue" />
          <span className="truncate max-w-[200px] font-medium">{authors}</span>
        </span>
        {publishDate && (
          <span className="flex items-center gap-1.5">
            <FiCalendar className="w-4 h-4 text-academic-gold" />
            {publishDate}
          </span>
        )}
      </div>

      {!compact && article.abstract && (
        <p className="mt-3 text-sm text-gray-600 line-clamp-2 italic">
          {article.abstract}
        </p>
      )}

      {/* Keywords Display */}
      {!compact && article.keywords_display && (
        <div className="mt-3 flex items-start gap-2">
          <FiTag className="w-4 h-4 text-academic-blue mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-500 line-clamp-1">
            <span className="font-semibold uppercase tracking-tighter">Keywords:</span> {article.keywords_display}
          </p>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href={`/${journalSlug}`}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-academic-navy hover:text-academic-blue transition-colors"
          >
            <FiBookOpen className="w-3.5 h-3.5" />
            {journalTitle}
          </Link>

          {article.license_text && (
            <div className="hidden sm:flex items-center gap-1 text-[10px] text-gray-400 font-medium">
              <FiAward className="w-3 h-3" />
              {article.license_text}
            </div>
          )}
        </div>

        {/* Download Buttons - Bottom Right */}
        <div className="flex flex-wrap gap-1.5 ml-auto">
          {/* PDF Button - Show only if file exists */}
          {article.pdf_file && (
            <a
              href={articlesApi.getPdfUrl(journalSlug, article.slug)}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 text-[9px] font-black uppercase tracking-widest rounded-md border border-red-100 hover:bg-red-100 transition-all shadow-sm"
              title="Download PDF"
            >
              <FiDownload className="w-2.5 h-2.5" />
              PDF
            </a>
          )}
          
          {/* XML Button - Show if XML file exists */}
          {article.xml_file && (
            <a
              href={articlesApi.getXmlUrl(journalSlug, article.slug)}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-widest rounded-md border border-emerald-100 hover:bg-emerald-100 transition-all shadow-sm"
              title="Download XML"
            >
              <FiDownload className="w-2.5 h-2.5" />
              XML
            </a>
          )}

          {/* ePUB Button */}
          {article.epub_file && (
            <a
              href={article.epub_file}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-[9px] font-black uppercase tracking-widest rounded-md border border-blue-100 hover:bg-blue-100 transition-all shadow-sm"
              title="Download ePUB"
            >
              <FiDownload className="w-2.5 h-2.5" />
              ePUB
            </a>
          )}

          {/* Mobi Button */}
          {article.mobi_file && (
            <a
              href={article.mobi_file}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 text-[9px] font-black uppercase tracking-widest rounded-md border border-orange-100 hover:bg-orange-100 transition-all shadow-sm"
              title="Download Mobi"
            >
              <FiDownload className="w-2.5 h-2.5" />
              Mobi
            </a>
          )}

          {/* PRC Button */}
          {article.prc_file && (
            <a
              href={article.prc_file}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 text-[9px] font-black uppercase tracking-widest rounded-md border border-purple-100 hover:bg-purple-100 transition-all shadow-sm"
              title="Download PRC"
            >
              <FiDownload className="w-2.5 h-2.5" />
              PRC
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
