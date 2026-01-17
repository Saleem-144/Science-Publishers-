'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiBook, FiFileText, FiUsers, FiSettings, FiPlus, FiArrowRight } from 'react-icons/fi';

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/admin/login');
    }
  }, [router]);

  const stats = [
    { label: 'Total Journals', value: '12', icon: FiBook, color: 'bg-blue-500' },
    { label: 'Total Articles', value: '156', icon: FiFileText, color: 'bg-green-500' },
    { label: 'Total Authors', value: '89', icon: FiUsers, color: 'bg-purple-500' },
    { label: 'Pending Reviews', value: '8', icon: FiSettings, color: 'bg-orange-500' },
  ];

  const quickActions = [
    { label: 'Add New Journal', href: '/admin/journals/new', icon: FiPlus },
    { label: 'Add New Article', href: '/admin/articles/new', icon: FiPlus },
    { label: 'Manage Authors', href: '/admin/authors', icon: FiUsers },
    { label: 'Site Settings', href: '/admin/settings', icon: FiSettings },
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-academic-navy mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-academic-blue hover:bg-academic-blue/5 transition-colors group"
              >
                <div className="p-2 bg-academic-navy/10 rounded-lg group-hover:bg-academic-blue/10 transition-colors">
                  <action.icon className="w-5 h-5 text-academic-navy group-hover:text-academic-blue" />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-academic-blue">
                  {action.label}
                </span>
                <FiArrowRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-academic-blue group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-academic-navy mb-4">Recent Journals</h2>
            <div className="space-y-3">
              {['Journal of Biomedical Research', 'Environmental Science Quarterly', 'Computer Science Review'].map((journal, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-academic-navy/10 rounded-lg flex items-center justify-center">
                      <FiBook className="w-5 h-5 text-academic-navy" />
                    </div>
                    <span className="font-medium text-gray-700">{journal}</span>
                  </div>
                  <Link href="#" className="text-academic-blue hover:text-academic-navy text-sm">
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-academic-navy mb-4">Recent Articles</h2>
            <div className="space-y-3">
              {['Machine Learning in Healthcare', 'Climate Change Impact Study', 'Quantum Computing Advances'].map((article, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <FiFileText className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="font-medium text-gray-700">{article}</span>
                  </div>
                  <Link href="#" className="text-academic-blue hover:text-academic-navy text-sm">
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
