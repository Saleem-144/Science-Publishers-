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
  subjects?: Subject[];
}

interface JournalCardProps {
  journal: Journal;
}

// Mock cover images for journals
const MOCK_COVER_IMAGES: { [key: string]: string } = {
  'default': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop',
  'journal-biomedical-research': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop',
  'journal-environmental-science': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
  'journal-computer-science': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
  'journal-applied-physics': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop',
};

const DEFAULT_EDITOR_IMAGE = 'https://ui-avatars.com/api/?name=Editor&background=1a365d&color=fff&size=128';

export function JournalCard({ journal }: JournalCardProps) {
  const editorName = journal.editor_in_chief || 'Dr. James Wilson';
  const editorImage = DEFAULT_EDITOR_IMAGE.replace('Editor', encodeURIComponent(editorName.split(' ').map(n => n[0]).join('')));
  const coverImage = journal.cover_image || MOCK_COVER_IMAGES[journal.slug] || MOCK_COVER_IMAGES.default;

  return (
    <Link href={`/${journal.slug}`} className="group block">
      <article className="bg-ivory rounded-xl shadow-md border border-ivory-200 overflow-hidden hover:shadow-xl transition-all duration-300 h-[480px] w-full flex flex-col">
        {/* Journal Cover Image Section */}
        <div className="h-48 relative flex-shrink-0 overflow-hidden">
          <Image
            src={coverImage}
            alt={`${journal.title} Cover`}
            fill
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
