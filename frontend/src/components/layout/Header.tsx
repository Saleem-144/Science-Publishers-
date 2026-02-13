'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { FiMenu, FiX, FiSearch, FiChevronDown, FiFileText, FiBook } from 'react-icons/fi';
import { articlesApi } from '@/lib/api';

interface NavLink {
  href?: string;
  label: string;
  children?: NavLink[];
}

// Configurable PublishWithUs URL - can be set via environment variable or default
const PUBLISH_WITH_US_URL = process.env.NEXT_PUBLIC_PUBLISH_WITH_US_URL || '/publish-with-us';

const navLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  {
    label: 'About Us',
    children: [
      { href: '/about', label: 'About Aethra science publisher' },
      { href: '/about/open-access-policy', label: 'Open access policy' },
      { href: '/contact', label: 'ContactUs' },
    ],
  },
  { href: '/journals', label: 'Browse Journals' },
  { href: '/services', label: 'Our Services' },
  {
    label: 'Information',
    children: [
      {
        label: 'For Authors',
        children: [
          { href: '/information/for-authors/archiving-policies', label: 'Archiving policies' },
          { href: '/information/for-authors/article-processing-charges-policy', label: 'Article processing charges policy' },
          { href: '/information/for-authors/authorship', label: 'Authorship' },
          { href: '/information/for-authors/author-benefits', label: 'Author benefits' },
          { href: '/information/for-authors/author-support-services', label: 'Aethra author support services' },
          { href: '/information/for-authors/institutional-membership', label: 'Institutional membership' },
          { href: '/information/for-authors/instructions-for-authors', label: 'Instructions for authors' },
          { href: '/information/for-authors/manuscript-transfer-facility', label: 'Manuscript transfer facility' },
          { href: '/information/for-authors/special-fee-waivers-and-discount', label: 'Special fee waivers and discount' },
        ],
      },
      {
        label: 'For Editors And Reviewers',
        children: [
          { href: '/information/for-editors-and-reviewers/editorial-management', label: 'Editorial management' },
          { href: '/information/for-editors-and-reviewers/editorial-policies', label: 'Editorial policies' },
          { href: '/information/for-editors-and-reviewers/ensuring-content-integrity', label: 'Ensuring content integrity' },
          { href: '/information/for-editors-and-reviewers/ethical-guidelines-for-new-editors', label: 'Ethical guidelines for new editors' },
          { href: '/information/for-editors-and-reviewers/guest-editors-guidelines', label: 'Guest editors guidelines' },
          { href: '/information/for-editors-and-reviewers/guidelines-for-reviewers', label: 'Guidelines for reviewers' },
          { href: '/information/for-editors-and-reviewers/virtual-special-issues', label: 'Virtual special issues' },
          { href: '/information/for-editors-and-reviewers/peer-review-workflow', label: 'Peer review workflow' },
          { href: '/information/for-editors-and-reviewers/publication-process', label: 'Publication process' },
        ],
      },
      {
        label: 'Ethical Guidelines',
        children: [
          { href: '/information/ethical-guidelines/allegations-from-whistleblowers', label: 'Allegations from whistleblowers' },
          { href: '/information/ethical-guidelines/aethra-advisory-board', label: 'Aethra advisory board' },
          { href: '/information/ethical-guidelines/conflict-of-interest', label: 'Conflict of interest' },
          { href: '/information/ethical-guidelines/fabricating-and-stating-false-information', label: 'Fabricating and stating false information' },
          { href: '/information/ethical-guidelines/plagiarism-prevention', label: 'Plagiarism prevention' },
          { href: '/information/ethical-guidelines/publishing-ethics', label: 'Publishing ethics' },
          { href: '/information/ethical-guidelines/post-publication-discussions-and-corrections', label: 'Post publication discussions and corrections' },
          { href: '/information/ethical-guidelines/research-misconduct', label: 'Research misconduct' },
        ],
      },
    ],
  },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());
  const [openNestedDropdowns, setOpenNestedDropdowns] = useState<Set<string>>(new Set());
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Search articles
  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ['header-search', searchQuery],
    queryFn: () => articlesApi.search(searchQuery),
    enabled: searchQuery.length >= 3 && searchOpen,
  });

  const articlesList = searchResults?.results || searchResults || [];

  // Close dropdowns and search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close search
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }

      // Close dropdowns
      let clickedInsideDropdown = false;
      Object.values(dropdownRefs.current).forEach((ref) => {
        if (ref && ref.contains(event.target as Node)) {
          clickedInsideDropdown = true;
        }
      });

      if (!clickedInsideDropdown) {
        setOpenDropdowns(new Set());
        setOpenNestedDropdowns(new Set());
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchOpen]);

  // Close dropdowns when route changes
  useEffect(() => {
    setOpenDropdowns(new Set());
    setOpenNestedDropdowns(new Set());
    setMobileMenuOpen(false);
  }, [pathname]);

  const toggleDropdown = (label: string) => {
    setOpenDropdowns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(label)) {
        // If clicking the same dropdown, close it
        newSet.delete(label);
      } else {
        // Close all other dropdowns and open only this one
        newSet.clear();
        newSet.add(label);
      }
      return newSet;
    });
    // Close nested dropdowns when parent changes
    setOpenNestedDropdowns(new Set());
  };

  const toggleNestedDropdown = (label: string) => {
    setOpenNestedDropdowns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(label)) {
        // If clicking the same nested dropdown, close it
        newSet.delete(label);
      } else {
        // Close all other nested dropdowns and open only this one
        newSet.clear();
        newSet.add(label);
      }
      return newSet;
    });
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href;
  };

  const hasActiveChild = (link: NavLink): boolean => {
    if (link.href && isActive(link.href)) return true;
    if (link.children) {
      return link.children.some((child) => hasActiveChild(child));
    }
    return false;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 3) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const renderDesktopNavItem = (link: NavLink, index: number) => {
    if (link.children) {
      const isOpen = openDropdowns.has(link.label);
      const active = hasActiveChild(link);

      return (
        <div
          key={index}
          className="relative"
          ref={(el) => {
            dropdownRefs.current[link.label] = el;
          }}
        >
          <button
            onClick={() => toggleDropdown(link.label)}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 relative group ${
              active || isOpen
                ? 'text-black'
                : 'text-black'
            }`}
          >
            {link.label}
            <span className={`absolute bottom-0 left-0 h-0.5 transition-all duration-200 ${
              active ? 'bg-yellow-500 w-full' : 'bg-yellow-500 group-hover:w-full w-0'
            }`}></span>
            <FiChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isOpen && (
            <div className="absolute top-full right-0 mt-1 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 transition-all duration-200">
              {link.children.map((child, childIndex) => {
                if (child.children) {
                  // Nested dropdown (For authors)
                  const isNestedOpen = openNestedDropdowns.has(child.label);
                  return (
                    <div key={childIndex} className="relative">
                      <button
                        onClick={() => toggleNestedDropdown(child.label)}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-black hover:bg-gray-100 cursor-pointer transition-colors"
                      >
                        <span className="font-medium">{child.label}</span>
                        <FiChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${isNestedOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {isNestedOpen && (
                        <div className="absolute top-0 left-full ml-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                          {child.children.map((grandchild, grandIndex) => (
                            <Link
                              key={grandIndex}
                              href={grandchild.href || '#'}
                              className={`block px-4 py-2.5 text-sm transition-all duration-150 ${
                                isActive(grandchild.href)
                                  ? 'bg-gray-200 text-black font-medium'
                                  : 'text-black hover:bg-gray-100 hover:pl-6'
                              }`}
                              onClick={() => {
                                setOpenDropdowns(new Set());
                                setOpenNestedDropdowns(new Set());
                              }}
                            >
                              {grandchild.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link
                    key={childIndex}
                    href={child.href || '#'}
                    className={`block px-4 py-2.5 text-sm transition-all duration-150 ${
                      isActive(child.href)
                        ? 'bg-gray-200 text-black font-medium'
                        : 'text-black hover:bg-gray-100 hover:pl-6'
                    }`}
                    onClick={() => setOpenDropdowns(new Set())}
                  >
                    {child.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={index}
        href={link.href || '#'}
        className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative group ${
          isActive(link.href)
            ? 'text-black'
            : 'text-black'
        }`}
      >
        {link.label}
        <span className={`absolute bottom-0 left-0 h-0.5 transition-all duration-200 ${
          isActive(link.href) ? 'bg-yellow-500 w-full' : 'bg-yellow-500 group-hover:w-full w-0'
        }`}></span>
      </Link>
    );
  };

  const renderMobileNavItem = (link: NavLink, level: number = 0) => {
    const indent = level * 4;
    const isOpen = level === 0 
      ? openDropdowns.has(link.label)
      : openNestedDropdowns.has(link.label);

    if (link.children) {
      return (
        <div key={link.label} className="space-y-1">
          <button
            onClick={() => {
              if (level === 0) {
                toggleDropdown(link.label);
              } else {
                toggleNestedDropdown(link.label);
              }
            }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors ${
              hasActiveChild(link)
                ? 'bg-gray-200 text-black'
                : 'text-black hover:bg-gray-100'
            }`}
            style={{ paddingLeft: `${indent + 1}rem` }}
          >
            <span>{link.label}</span>
            <FiChevronDown
              className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {isOpen && (
            <div className="space-y-1">
              {link.children.map((child) => renderMobileNavItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={link.href || link.label}
        href={link.href || '#'}
        onClick={() => {
          setMobileMenuOpen(false);
          setOpenDropdowns(new Set());
          setOpenNestedDropdowns(new Set());
        }}
        className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
          isActive(link.href)
            ? 'bg-gray-200 text-black'
            : 'text-black hover:bg-gray-100'
        }`}
        style={{ paddingLeft: `${indent + 1}rem` }}
      >
        {link.label}
      </Link>
    );
  };

  return (
    <header className="bg-white text-black sticky top-0 z-50 shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-academic-gold to-yellow-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
              <span className="text-academic-navy font-bold text-xl">A</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-black">
                Aethra Science Publishers
              </h1>
              <p className="text-xs text-gray-600 -mt-0.5">Academic Excellence</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link, index) => renderDesktopNavItem(link, index))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-lg text-black hover:bg-gray-100 transition-all duration-200 relative group"
                aria-label="Search"
              >
                <FiSearch className="w-5 h-5" />
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gray-400 transition-all duration-200 group-hover:w-full"></span>
              </button>

              {/* Search Dropdown */}
              {searchOpen && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                  <form onSubmit={handleSearchSubmit} className="p-4 border-b border-gray-200">
                    <div className="relative">
                      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue outline-none text-gray-900"
                        autoFocus
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </form>

                  {/* Search Results */}
                  <div className="max-h-96 overflow-y-auto">
                    {searchQuery.length < 3 ? (
                      <div className="p-8 text-center text-gray-500">
                        <FiSearch className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-sm">Type at least 3 characters to search</p>
                      </div>
                    ) : searchLoading ? (
                      <div className="p-8 text-center">
                        <div className="inline-block w-6 h-6 border-2 border-academic-blue border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm text-gray-500 mt-3">Searching...</p>
                      </div>
                    ) : articlesList.length > 0 ? (
                      <div className="p-2">
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Articles ({articlesList.length})
                        </div>
                        {articlesList.slice(0, 5).map((article: any) => (
                          <Link
                            key={article.id}
                            href={`/${article.issue?.volume?.journal?.slug}/article/${article.slug}`}
                            onClick={() => {
                              setSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className="block px-3 py-2.5 hover:bg-academic-blue/5 rounded-lg transition-colors group"
                          >
                            <div className="flex items-start gap-3">
                              <FiFileText className="w-4 h-4 text-academic-blue mt-1 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 group-hover:text-academic-blue line-clamp-1">
                                  {article.title}
                                </h4>
                                {article.issue?.volume?.journal && (
                                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                                    {article.issue.volume.journal.title}
                                  </p>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                        {articlesList.length > 5 && (
                          <button
                            onClick={handleSearchSubmit}
                            className="w-full px-3 py-2.5 text-sm text-academic-blue hover:bg-academic-blue/5 rounded-lg font-medium transition-colors"
                          >
                            View all {articlesList.length} results →
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <FiFileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-sm">No articles found</p>
                        <p className="text-xs text-gray-400 mt-1">Try different keywords</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* PublishWithUs Button */}
            <Link
              href={PUBLISH_WITH_US_URL}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-black bg-yellow-500 hover:bg-yellow-600 transition-all duration-200 shadow-sm"
            >
              Publish With Us
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-lg text-black hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => renderMobileNavItem(link))}
            {/* PublishWithUs button in mobile menu */}
            <Link
              href={PUBLISH_WITH_US_URL}
              onClick={() => {
                setMobileMenuOpen(false);
                setOpenDropdowns(new Set());
                setOpenNestedDropdowns(new Set());
              }}
              className="block px-4 py-3 rounded-lg font-medium transition-colors text-black bg-yellow-500 hover:bg-yellow-600 mt-2 text-center shadow-sm"
            >
              Publish With Us
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
