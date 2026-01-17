'use client';

import Link from 'next/link';
import { FiCalendar, FiUser, FiBookOpen, FiUnlock, FiLock } from 'react-icons/fi';

interface Author {
  author?: {
    full_name: string;
  };
  name?: string; // Alternative field from API
  order?: number;
}

interface Article {
  id: number;
  title: string;
  slug: string;
  abstract?: string;
  published_date?: string;
  is_open_access?: boolean;
  article_type?: string; // e.g., "research", "review", "case_report"
  article_type_display?: string; // Human-readable: "Research Article", "Review Article"
  journal_slug?: string; // Direct from API
  journal_title?: string; // Direct from API
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
  const journal = article.issue?.volume?.journal || article.volume?.journal;
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
      {/* Top Row: Article Type & Access Badge - Both on Left */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {/* Article Type Tag - Dynamic from Admin */}
        <span className="inline-flex items-center px-3 py-1 bg-academic-blue/10 text-academic-blue text-xs font-semibold rounded-md border border-academic-blue/20">
          {articleType}
        </span>
        
        {/* Access Status Badge */}
        {isOpenAccess ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md border border-emerald-200">
            <FiUnlock className="w-3.5 h-3.5" />
            Open Access
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-md border border-amber-200">
            <FiLock className="w-3.5 h-3.5" />
            Subscription
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
          <span className="truncate max-w-[200px]">{authors}</span>
        </span>
        {publishDate && (
          <span className="flex items-center gap-1.5">
            <FiCalendar className="w-4 h-4 text-academic-gold" />
            {publishDate}
          </span>
        )}
      </div>

      {!compact && article.abstract && (
        <p className="mt-3 text-sm text-gray-600 line-clamp-2">
          {article.abstract}
        </p>
      )}

      <div className="mt-3 pt-3 border-t border-gray-200">
        <Link 
          href={`/${journalSlug}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-academic-navy hover:text-academic-blue transition-colors"
        >
          <FiBookOpen className="w-3.5 h-3.5" />
          {journalTitle}
        </Link>
      </div>
    </article>
  );
}
