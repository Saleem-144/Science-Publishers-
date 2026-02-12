import { Metadata } from 'next';
import React from 'react';

// Use environment variable or fallback to local backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

async function getArticle(journalSlug: string, articleSlug: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/articles/by-journal/${journalSlug}/${articleSlug}/`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Error fetching article for metadata:', error);
    return null;
  }
}

interface Props {
  params: {
    journal_slug: string;
    article_slug: string;
  };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle(params.journal_slug, params.article_slug);
  
  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  const plainAbstract = article.abstract ? article.abstract.replace(/<[^>]*>?/gm, '').substring(0, 160) : '';
  const description = article.meta_description || plainAbstract || `Read ${article.title} on Science Publishers.`;
  const keywords = Array.isArray(article.keywords) ? article.keywords.join(', ') : (article.keywords_display || '');
  const authors = article.authors?.map((a: any) => a.full_name) || [];

  return {
    title: `${article.title} | ${article.journal_info?.title || 'Science Publishers'}`,
    description: description,
    keywords: keywords,
    authors: authors.map((name: string) => ({ name })),
    openGraph: {
      title: article.title,
      description: description,
      type: 'article',
      publishedTime: article.published_date,
      authors: authors,
      section: article.journal_info?.title,
      tags: Array.isArray(article.keywords) ? article.keywords : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: description,
    },
    // Academic metadata for Google Scholar and indexing
    other: {
      'citation_title': article.title,
      'citation_author': authors,
      'citation_publication_date': article.published_date ? article.published_date.replace(/-/g, '/') : '',
      'citation_journal_title': article.journal_info?.title || '',
      'citation_issn': article.journal_info?.issn_online || article.journal_info?.issn_print || '',
      'citation_doi': article.doi || '',
      'citation_pdf_url': article.pdf_file || '',
      'citation_abstract_html_url': `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${params.journal_slug}/article/${params.article_slug}`,
      'citation_fulltext_html_url': `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${params.journal_slug}/article/${params.article_slug}/fulltext`,
      'citation_language': 'en',
    }
  };
}

export default function ArticleLayout({ children }: Props) {
  return <>{children}</>;
}

