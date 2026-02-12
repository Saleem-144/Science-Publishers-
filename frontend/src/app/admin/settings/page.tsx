'use client';

import { useState } from 'react';
import { FiSave, FiGlobe, FiMail, FiSettings } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'Aethra Science Publishers',
    siteDescription: 'A comprehensive platform for academic journal publishing',
    contactEmail: 'info@aethrasciencepublishers.com',
    contactPhone: '+1 (234) 567-890',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLoading(false);
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
      {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-2 bg-academic-navy rounded-lg">
              <FiSettings className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
          </div>
          <p className="text-gray-600">Manage your website general information and contact details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
            <FiGlobe className="w-5 h-5 text-academic-blue" />
            <h2 className="text-xl font-bold text-gray-900">General</h2>
            </div>

          <div className="space-y-5 max-w-2xl mx-auto">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Site Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-academic-blue focus:border-academic-blue bg-gray-50 transition-all"
                placeholder="Enter your site name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Site Description
              </label>
              <textarea
                rows={3}
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-academic-blue focus:border-academic-blue resize-none bg-gray-50 transition-all"
                placeholder="Describe your website"
              />
            </div>
          </div>
        </div>

        {/* Contact Settings */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
            <FiMail className="w-5 h-5 text-academic-blue" />
            <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
          </div>
          
          <div className="space-y-5 max-w-2xl mx-auto">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-academic-blue focus:border-academic-blue bg-gray-50 transition-all"
                placeholder="contact@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Contact Phone
              </label>
              <input
                type="tel"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-academic-blue focus:border-academic-blue bg-gray-50 transition-all"
                placeholder="+1 (234) 567-890"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-academic-navy to-academic-blue text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 transform hover:-translate-y-0.5"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <FiSave className="w-5 h-5" />
                Save All Settings
              </>
            )}
          </button>
            </div>
      </form>
      </div>
    </div>
  );
}
