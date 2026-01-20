/**
 * TypeScript types for Academic Journal Publishing Platform
 */

// =============================================================================
// Auth Types
// =============================================================================

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  is_staff: boolean;
  is_superuser: boolean;
  is_active: boolean;
  date_joined: string;
  last_login: string | null;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse extends AuthTokens {
  user: User;
}

// =============================================================================
// Subject Types
// =============================================================================

export interface Subject {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent?: number | null;
  parent_name?: string;
  children?: Subject[];
  is_active: boolean;
  display_order: number;
  journal_count: number;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// Journal Types
// =============================================================================

export interface JournalListItem {
  id: number;
  title: string;
  slug: string;
  short_title?: string;
  short_description?: string;
  issn_print?: string;
  issn_online?: string;
  cover_image?: string;
  logo?: string;
  primary_color: string;
  is_featured: boolean;
  subjects: Subject[];
  total_volumes: number;
  total_articles: number;
}

export interface Journal extends JournalListItem {
  description?: string;
  secondary_color: string;
  favicon?: string;
  editor_in_chief?: string;
  publisher?: string;
  founding_year?: number;
  frequency?: string;
  aims_and_scope?: string;
  author_guidelines?: string;
  peer_review_policy?: string;
  contact_email?: string;
  website_url?: string;
  is_active: boolean;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  current_issue?: {
    id: number;
    issue_number: number;
    volume_number: number;
    year: number;
    title?: string;
    publication_date?: string;
  };
  created_at: string;
  updated_at: string;
}

// =============================================================================
// Volume Types
// =============================================================================

export interface Volume {
  id: number;
  journal: number;
  journal_title: string;
  journal_slug: string;
  volume_number: number;
  title?: string;
  year: number;
  description?: string;
  cover_image?: string;
  is_active: boolean;
  total_issues: number;
  total_articles: number;
  display_name: string;
  issues?: Issue[];
  created_at?: string;
  updated_at?: string;
}

// =============================================================================
// Issue Types
// =============================================================================

export interface Issue {
  id: number;
  volume: number;
  volume_number: number;
  year: number;
  journal_id?: number;
  journal_title: string;
  journal_slug: string;
  issue_number: number;
  title?: string;
  publication_date?: string;
  description?: string;
  cover_image?: string;
  is_special_issue: boolean;
  special_issue_title?: string;
  is_active: boolean;
  is_current: boolean;
  total_articles: number;
  display_name: string;
  full_citation: string;
  articles?: ArticleListItem[];
  created_at?: string;
  updated_at?: string;
}

// =============================================================================
// Author Types
// =============================================================================

export interface Author {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  citation_name?: string;
  email?: string;
  orcid_id?: string;
  affiliation?: string;
  department?: string;
  country?: string;
  bio?: string;
  article_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ArticleAuthor {
  id: number;
  name: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  orcid_id?: string;
  affiliation?: string;
  is_corresponding: boolean;
  author_order?: number;
  contribution?: string;
}

// =============================================================================
// Article Types
// =============================================================================

export type ArticleType = 
  | 'research'
  | 'review'
  | 'case_report'
  | 'short_communication'
  | 'letter'
  | 'editorial'
  | 'commentary'
  | 'perspective'
  | 'book_review'
  | 'erratum'
  | 'retraction'
  | 'other';

export type ArticleStatus = 'draft' | 'published' | 'retracted';

export interface ArticleListItem {
  id: number;
  title: string;
  slug: string;
  doi?: string;
  article_type: ArticleType;
  abstract?: string;
  keywords?: string[];
  pages?: string;
  journal_slug: string;
  journal_title: string;
  volume_number: number;
  issue_number: number;
  year: number;
  published_date?: string;
  is_open_access: boolean;
  is_featured: boolean;
  authors: { id: number; name: string; is_corresponding: boolean }[];
  view_count: number;
}

export interface Article extends ArticleListItem {
  status: ArticleStatus;
  page_start?: string;
  page_end?: string;
  article_number?: string;
  received_date?: string;
  revised_date?: string;
  accepted_date?: string;
  download_count: number;
  meta_title?: string;
  meta_description?: string;
  journal: {
    id: number;
    title: string;
    slug: string;
    short_title?: string;
    issn_print?: string;
    issn_online?: string;
  };
  volume: {
    id: number;
    volume_number: number;
    year: number;
    title?: string;
  };
  issue: number;
  issue_info: {
    id: number;
    issue_number: number;
    title?: string;
    publication_date?: string;
    is_special_issue: boolean;
    special_issue_title?: string;
  };
  authors: ArticleAuthor[];
  corresponding_author?: {
    id: number;
    name: string;
    email?: string;
    affiliation?: string;
  };
  files: ArticleFile[];
  figures: Figure[];
  tables: Table[];
  citation: string;
  created_at: string;
  updated_at: string;
}

export interface ArticleFile {
  id: number;
  file_type: 'xml' | 'pdf' | 'supplementary' | 'data';
  file: string;
  file_url?: string;
  original_filename: string;
  file_size: number;
  mime_type: string;
  is_primary: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Figure {
  id: number;
  figure_id: string;
  figure_number: number;
  label: string;
  caption: string;
  image: string;
  image_url?: string;
  original_filename: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Table {
  id: number;
  table_id: string;
  table_number: number;
  label: string;
  caption: string;
  table_html: string;
  footnotes?: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ArticleHTMLContent {
  id: number;
  original_xml?: string;
  abstract_html?: string;
  body_html?: string;
  references_html?: string;
  acknowledgments_html?: string;
  figures_json?: any[];
  tables_json?: any[];
  parsing_status: 'pending' | 'processing' | 'success' | 'failed';
  parsing_errors?: string;
  parsed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ArticleFullText {
  id: number;
  title: string;
  slug: string;
  doi?: string;
  abstract?: string;
  keywords?: string[];
  journal_slug: string;
  published_date?: string;
  authors: ArticleAuthor[];
  html_content?: ArticleHTMLContent;
  figures: Figure[];
  tables: Table[];
}

// =============================================================================
// Site Types
// =============================================================================

export interface SiteSettings {
  site_name: string;
  site_description?: string;
  tagline?: string;
  logo?: string;
  favicon?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_address?: string;
  social_links?: Record<string, string>;
  footer_text?: string;
  copyright_text?: string;
  meta_keywords?: string;
  meta_description?: string;
  google_analytics_id?: string;
  updated_at: string;
}

export interface Page {
  id: number;
  journal?: number;
  journal_slug?: string;
  journal_title?: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  is_active: boolean;
  show_in_navigation: boolean;
  display_order: number;
  meta_title?: string;
  meta_description?: string;
  template_name?: string;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// Dashboard Stats
// =============================================================================

export interface DashboardStats {
  total_journals: number;
  active_journals: number;
  total_volumes: number;
  total_issues: number;
  total_articles: number;
  published_articles: number;
  draft_articles: number;
  total_authors: number;
  featured_journals: number;
  featured_articles: number;
}

// =============================================================================
// Pagination Types
// =============================================================================

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}










