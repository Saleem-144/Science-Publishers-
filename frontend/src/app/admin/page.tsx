'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { FiBook, FiFileText, FiUsers, FiSettings, FiPlus, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { siteApi, journalsApi, articlesApi } from '@/lib/api';

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/admin/login');
    }
  }, [router]);

  // Fetch Dashboard Stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: siteApi.getDashboardStats,
  });

  // Fetch Recent Journals
  const { data: journalsData, isLoading: journalsLoading } = useQuery({
    queryKey: ['admin-recent-journals'],
    queryFn: () => journalsApi.adminList({ limit: 5 }),
  });

  // Fetch Recent Articles
  const { data: articlesData, isLoading: articlesLoading } = useQuery({
    queryKey: ['admin-recent-articles'],
    queryFn: () => articlesApi.adminList({ limit: 5 }),
  });

  const stats = [
    { label: 'Total Journals', value: statsData?.total_journals || '0', icon: FiBook, color: 'bg-blue-500' },
    { label: 'Total Articles', value: statsData?.total_articles || '0', icon: FiFileText, color: 'bg-indigo-500' },
    { label: 'Published Articles', value: statsData?.published_articles || '0', icon: FiCheckCircle, color: 'bg-emerald-500' },
  ];

  const quickActions = [
    { label: 'Add New Journal', href: '/admin/journals/new', icon: FiPlus },
    { label: 'Add New Article', href: '/admin/articles/new', icon: FiPlus },
    { label: 'Manage Authors', href: '/admin/authors', icon: FiUsers },
    { label: 'Site Settings', href: '/admin/settings', icon: FiSettings },
  ];

  const recentJournals = journalsData?.results || [];
  const recentArticles = articlesData?.results || [];

  return (
    <div className="min-h-screen bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-academic-navy">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome to the Aethra Science Publishers admin panel
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statsLoading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse h-28" />
            ))
          ) : (
            stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">{stat.label}</p>
                    <p className="text-3xl font-black text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.color} shadow-lg shadow-${stat.color.split('-')[1]}-200`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-gray-100">
          <h2 className="text-xl font-bold text-academic-navy mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-academic-gold rounded-full"></div>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-academic-blue hover:bg-academic-blue/5 transition-all group"
              >
                <div className="p-2.5 bg-academic-navy/5 rounded-lg group-hover:bg-academic-blue/10 transition-colors">
                  <action.icon className="w-5 h-5 text-academic-navy group-hover:text-academic-blue" />
                </div>
                <span className="font-bold text-gray-700 group-hover:text-academic-blue">
                  {action.label}
                </span>
                <FiArrowRight className="w-4 h-4 ml-auto text-gray-300 group-hover:text-academic-blue group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Journals */}
          <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-academic-navy flex items-center gap-2">
                <div className="w-2 h-6 bg-academic-blue rounded-full"></div>
                Recent Journals
              </h2>
              <Link href="/admin/journals" className="text-xs font-bold text-academic-blue hover:underline uppercase tracking-widest">
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {journalsLoading ? (
                [1, 2, 3].map((i) => <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />)
              ) : recentJournals.length > 0 ? (
                recentJournals.map((journal: any) => (
                  <div key={journal.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100">
                        {journal.logo_url ? (
                          <img src={journal.logo_url} alt="" className="w-8 h-8 object-contain" />
                        ) : (
                          <FiBook className="w-6 h-6 text-academic-navy" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 group-hover:text-academic-blue transition-colors line-clamp-1">{journal.title}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ISSN: {journal.issn_online || 'N/A'}</p>
                      </div>
                    </div>
                    <Link href={`/admin/journals/${journal.id}`} className="p-2 bg-white rounded-lg text-gray-400 hover:text-academic-blue hover:shadow-sm border border-gray-100 transition-all">
                      <FiSettings className="w-4 h-4" />
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-center py-8 text-gray-500 italic">No journals found.</p>
              )}
            </div>
          </div>

          {/* Recent Articles */}
          <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-academic-navy flex items-center gap-2">
                <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
                Recent Articles
              </h2>
              <Link href="/admin/articles" className="text-xs font-bold text-emerald-600 hover:underline uppercase tracking-widest">
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {articlesLoading ? (
                [1, 2, 3].map((i) => <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />)
              ) : recentArticles.length > 0 ? (
                recentArticles.map((article: any) => (
                  <div key={article.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100">
                        <FiFileText className="w-6 h-6 text-emerald-500" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 group-hover:text-academic-blue transition-colors line-clamp-1">{article.title}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status: <span className={article.status === 'published' ? 'text-emerald-600' : 'text-amber-600'}>{article.status}</span></p>
                      </div>
                    </div>
                    <Link href={`/admin/articles/${article.id}`} className="p-2 bg-white rounded-lg text-gray-400 hover:text-academic-blue hover:shadow-sm border border-gray-100 transition-all">
                      <FiSettings className="w-4 h-4" />
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-center py-8 text-gray-500 italic">No articles found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

