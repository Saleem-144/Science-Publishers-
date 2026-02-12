'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  FiHome, FiBook, FiFileText, FiUsers, FiSettings, 
  FiLogOut, FiMenu, FiX, FiLayers, FiGrid, FiGlobe, 
  FiBell, FiChevronDown, FiChevronUp, FiImage, FiUserPlus
} from 'react-icons/fi';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [journalDropdownOpen, setJournalDropdownOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [pathname, router]);

  useEffect(() => {
    // Keep journal dropdown open if we are in one of its sub-routes
    if (['/admin/journals', '/admin/subjects', '/admin/volumes', '/admin/issues', '/admin/articles', '/admin/media'].some(path => pathname?.startsWith(path))) {
      setJournalDropdownOpen(true);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    router.push('/admin/login');
  };

  // Don't show admin layout for login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-academic-navy border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const isJournalActive = ['/admin/journals', '/admin/subjects', '/admin/volumes', '/admin/issues', '/admin/articles', '/admin/media'].some(path => pathname?.startsWith(path));

  return (
    <div className="min-h-screen bg-ivory flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-academic-navy transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-white/10">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-academic-gold rounded-lg flex items-center justify-center">
                <span className="text-academic-navy font-bold text-xl">A</span>
              </div>
              <div>
                <h1 className="text-white font-semibold">Admin Panel</h1>
                <p className="text-xs text-blue-200">Aethra Publishers</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {/* Dashboard */}
            <Link
              href="/admin"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === '/admin'
                  ? 'bg-academic-gold text-academic-navy font-bold'
                  : 'text-blue-100 hover:bg-white/10'
              }`}
            >
              <FiHome className="w-5 h-5" />
              Dashboard
            </Link>

            {/* Journal Dropdown */}
            <div>
              <button
                onClick={() => setJournalDropdownOpen(!journalDropdownOpen)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isJournalActive ? 'text-academic-gold' : 'text-blue-100 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FiBook className="w-5 h-5" />
                  <span>Journal</span>
                </div>
                {journalDropdownOpen ? <FiChevronUp /> : <FiChevronDown />}
              </button>

              {journalDropdownOpen && (
                <div className="mt-1 ml-4 pl-4 border-l border-white/10 space-y-1">
                  <Link
                    href="/admin/journals"
                    className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                      pathname?.startsWith('/admin/journals') ? 'text-academic-gold font-bold' : 'text-blue-200 hover:text-white'
                    }`}
                  >
                    Journal List
                  </Link>
                  <Link
                    href="/admin/subjects"
                    className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                      pathname?.startsWith('/admin/subjects') ? 'text-academic-gold font-bold' : 'text-blue-200 hover:text-white'
                    }`}
                  >
                    Subject
                  </Link>
                  <Link
                    href="/admin/volumes"
                    className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                      pathname?.startsWith('/admin/volumes') ? 'text-academic-gold font-bold' : 'text-blue-200 hover:text-white'
                    }`}
                  >
                    Volumes
                  </Link>
                  <Link
                    href="/admin/issues"
                    className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                      pathname?.startsWith('/admin/issues') ? 'text-academic-gold font-bold' : 'text-blue-200 hover:text-white'
                    }`}
                  >
                    Issues
                  </Link>
                  <Link
                    href="/admin/articles"
                    className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                      pathname?.startsWith('/admin/articles') ? 'text-academic-gold font-bold' : 'text-blue-200 hover:text-white'
                    }`}
                  >
                    Articles
                  </Link>
                  <Link
                    href="/admin/media"
                    className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                      pathname?.startsWith('/admin/media') ? 'text-academic-gold font-bold' : 'text-blue-200 hover:text-white'
                    }`}
                  >
                    Media
                  </Link>
                </div>
              )}
            </div>

            {/* Indexing (formerly Affiliations) */}
            <Link
              href="/admin/affiliations"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname?.startsWith('/admin/affiliations')
                  ? 'bg-academic-gold text-academic-navy font-bold'
                  : 'text-blue-100 hover:bg-white/10'
              }`}
            >
              <FiGlobe className="w-5 h-5" />
              Indexing
            </Link>

            {/* CTA Buttons */}
            <Link
              href="/admin/cta-buttons"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname?.startsWith('/admin/cta-buttons')
                  ? 'bg-academic-gold text-academic-navy font-bold'
                  : 'text-blue-100 hover:bg-white/10'
              }`}
            >
              <FiUserPlus className="w-5 h-5" />
              CTA Buttons
            </Link>

            {/* News */}
            <Link
              href="/admin/announcements"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname?.startsWith('/admin/announcements')
                  ? 'bg-academic-gold text-academic-navy font-bold'
                  : 'text-blue-100 hover:bg-white/10'
              }`}
            >
              <FiBell className="w-5 h-5" />
              News
            </Link>

            {/* Settings */}
                <Link
              href="/admin/settings"
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname?.startsWith('/admin/settings')
                  ? 'bg-academic-gold text-academic-navy font-bold'
                      : 'text-blue-100 hover:bg-white/10'
                  }`}
                >
              <FiSettings className="w-5 h-5" />
              Settings
                </Link>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
            >
              <FiLogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 h-16">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              <FiMenu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-4">
              {/* Removed View Site Button as requested */}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main>{children}</main>
      </div>
    </div>
  );
}
