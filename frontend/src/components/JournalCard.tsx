'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiBook, FiFileText, FiArrowRight } from 'react-icons/fi';

interface Subject {
  id: number;
  name: string;
  slug: string;
}

interface Journal {
  id: number;
  title: string;
  slug: string;
  short_title?: string;
  description?: string;
  short_description?: string;
  cover_image?: string;
  issn_print?: string;
  issn_online?: string;
  is_featured?: boolean;
  total_volumes?: number;
  total_articles?: number;
  editor_in_chief?: string;
  editor_in_chief_image?: string;
  subjects?: Subject[];
}

interface JournalCardProps {
  journal: Journal;
  viewMode?: 'grid' | 'list';
}

// Mock cover images for journals as fallback
const MOCK_COVER_IMAGES: { [key: string]: string } = {
  'default': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop',
};

const DEFAULT_EDITOR_IMAGE = 'https://ui-avatars.com/api/?name=Editor&background=1a365d&color=fff&size=128';

export function JournalCard({ journal, viewMode = 'grid' }: JournalCardProps) {
  const editorName = journal.editor_in_chief || 'TBA';
  const editorImage = journal.editor_in_chief_image || 
    DEFAULT_EDITOR_IMAGE.replace('Editor', encodeURIComponent(editorName.split(' ').map(n => n[0]).join('')));
  const coverImage = journal.cover_image || MOCK_COVER_IMAGES.default;

  if (viewMode === 'list') {
    return (
      <Link href={`/${journal.slug}`} className="group block">
        <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col md:flex-row h-auto md:h-48">
          {/* Image Section */}
          <div className="w-full md:w-48 h-48 relative flex-shrink-0 overflow-hidden">
            <Image
              src={coverImage}
              alt={`${journal.title} Cover`}
              fill
              sizes="(max-width: 768px) 100vw, 192px"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {journal.is_featured && (
              <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-academic-gold text-academic-navy text-[10px] font-bold rounded">
                Featured
              </span>
            )}
          </div>

          {/* Content Section */}
          <div className="p-4 md:p-6 flex flex-col flex-grow min-w-0">
            <div className="flex justify-between items-start gap-4 mb-2">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-academic-blue transition-colors truncate">
                {journal.title}
              </h3>
              {journal.subjects && journal.subjects.length > 0 && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium rounded whitespace-nowrap">
                  {journal.subjects[0].name}
                </span>
              )}
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {journal.short_description || journal.description || 'A peer-reviewed academic journal publishing cutting-edge research.'}
            </p>

            <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-2">
              {/* Editor */}
              <div className="flex items-center gap-2">
                <div className="relative w-6 h-6 flex-shrink-0">
                  <Image
                    src={editorImage}
                    alt={editorName}
                    width={24}
                    height={24}
                    className="rounded-full border border-gray-100"
                  />
                </div>
                <span className="text-xs text-gray-700 font-medium truncate max-w-[150px]">{editorName}</span>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <FiBook className="w-3.5 h-3.5 text-academic-blue" />
                  <span className="font-semibold text-gray-700">{journal.total_volumes || 0}</span> Volumes
                </span>
                <span className="flex items-center gap-1">
                  <FiFileText className="w-3.5 h-3.5 text-academic-blue" />
                  <span className="font-semibold text-gray-700">{journal.total_articles || 0}</span> Articles
                </span>
              </div>

              {/* ISSN */}
              <div className="text-[10px] text-gray-400">
                {journal.issn_online && <span>ISSN (Online): {journal.issn_online}</span>}
                {journal.issn_online && journal.issn_print && <span className="mx-1">•</span>}
                {journal.issn_print && <span>ISSN (Print): {journal.issn_print}</span>}
              </div>
            </div>
          </div>

          {/* Action Arrow */}
          <div className="hidden md:flex items-center px-6 bg-gray-50 group-hover:bg-academic-blue/5 transition-colors">
            <FiArrowRight className="w-6 h-6 text-gray-300 group-hover:text-academic-blue group-hover:translate-x-1 transition-all" />
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/${journal.slug}`} className="group block">
      <article className="bg-ivory rounded-xl shadow-md border border-ivory-200 overflow-hidden hover:shadow-xl transition-all duration-300 h-[480px] w-full flex flex-col">
        {/* Journal Cover Image Section */}
        <div className="h-48 relative flex-shrink-0 overflow-hidden">
          <Image
            src={coverImage}
            alt={`${journal.title} Cover`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          {journal.is_featured && (
            <span className="absolute top-3 right-3 px-2 py-1 bg-academic-gold text-academic-navy text-xs font-semibold rounded">
              Featured
            </span>
          )}
          {journal.subjects && journal.subjects.length > 0 && (
            <span className="absolute top-3 left-3 px-2 py-1 bg-ivory/90 text-gray-700 text-xs font-medium rounded">
              {journal.subjects[0].name}
            </span>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-academic-blue transition-colors line-clamp-2 leading-tight">
            {journal.title}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
            {journal.short_description || journal.description || 'A peer-reviewed academic journal publishing cutting-edge research.'}
          </p>

          {/* Editor Section */}
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
            <div className="relative w-8 h-8 flex-shrink-0">
              <Image
                src={editorImage}
                alt={editorName}
                width={32}
                height={32}
                className="rounded-full object-cover border border-gray-200"
              />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-gray-500 uppercase tracking-wide">Editor-in-Chief</p>
              <p className="text-xs font-medium text-gray-800 truncate">{editorName}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
            <span className="flex items-center gap-1">
              <FiBook className="w-3.5 h-3.5 text-academic-blue" />
              <span className="font-semibold">{journal.total_volumes || 0}</span>
              <span className="text-gray-500">Volumes</span>
            </span>
            <span className="flex items-center gap-1">
              <FiFileText className="w-3.5 h-3.5 text-academic-blue" />
              <span className="font-semibold">{journal.total_articles || 0}</span>
              <span className="text-gray-500">Articles</span>
            </span>
          </div>

          {/* ISSN */}
          <div className="text-[10px] text-gray-400 mt-auto">
            {journal.issn_print && <span>ISSN (Print): {journal.issn_print}</span>}
            {journal.issn_print && journal.issn_online && <span className="mx-1">•</span>}
            {journal.issn_online && <span>ISSN (Online): {journal.issn_online}</span>}
            {!journal.issn_print && !journal.issn_online && <span>ISSN: Pending</span>}
          </div>

          {/* View Journal Link */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-academic-blue group-hover:text-academic-navy transition-colors">
              View Journal
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
