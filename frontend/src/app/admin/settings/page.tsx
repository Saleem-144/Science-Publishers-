'use client';

import { useState, useRef } from 'react';
import { FiSave, FiGlobe, FiMail, FiImage, FiUpload, FiX, FiSettings } from 'react-icons/fi';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'Aethra Science Publishers',
    siteDescription: 'A comprehensive platform for academic journal publishing',
    contactEmail: 'info@aethrasciencepublishers.com',
    contactPhone: '+1 (234) 567-890',
    address: '123 Academic Way, Research Park, Science City, SC 12345',
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type - only JPG and PNG allowed
      const fileType = file.type.toLowerCase();
      const fileName = file.name.toLowerCase();
      const isValidType = 
        fileType === 'image/jpeg' || 
        fileType === 'image/jpg' || 
        fileType === 'image/png' ||
        fileName.endsWith('.jpg') ||
        fileName.endsWith('.jpeg') ||
        fileName.endsWith('.png');
      
      if (!isValidType) {
        toast.error('Only JPG and PNG image formats are allowed for logo.');
        e.target.value = '';
        return;
      }
      
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type - only ICO, PNG, JPG allowed for favicon
      const fileType = file.type.toLowerCase();
      const fileName = file.name.toLowerCase();
      const isValidType = 
        fileType === 'image/x-icon' ||
        fileType === 'image/png' ||
        fileType === 'image/jpeg' ||
        fileType === 'image/jpg' ||
        fileName.endsWith('.ico') ||
        fileName.endsWith('.png') ||
        fileName.endsWith('.jpg') ||
        fileName.endsWith('.jpeg');
      
      if (!isValidType) {
        toast.error('Only ICO, PNG, and JPG formats are allowed for favicon.');
        e.target.value = '';
        return;
      }
      
      setFaviconFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFaviconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
          <p className="text-gray-600">Manage your website branding and general information</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
        {/* Branding Settings */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
            <FiImage className="w-5 h-5 text-academic-blue" />
            <h2 className="text-xl font-bold text-gray-900">Branding</h2>
          </div>

          <div className="space-y-6">
            {/* Site Logo */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Site Logo
              </label>
              <div className="flex flex-col items-center gap-6">
                {logoPreview && (
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-200 shadow-md">
                    <Image
                      src={logoPreview}
                      alt="Logo preview"
                      fill
                      className="object-contain p-2 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setLogoFile(null);
                        setLogoPreview(null);
                        if (logoInputRef.current) logoInputRef.current.value = '';
                      }}
                      className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <div className="w-full max-w-md mx-auto">
                  <div
                    onClick={() => logoInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-academic-blue hover:bg-academic-blue/5 transition-all"
                  >
                    <FiUpload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {logoPreview ? 'Change Logo' : 'Upload Logo'}
                    </p>
                    <p className="text-xs text-gray-500">JPG, PNG only (Recommended: 200x200px or larger)</p>
                  </div>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,.jpg,.jpeg,.png"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Favicon */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Favicon
              </label>
              <div className="flex flex-col items-center gap-6">
                {faviconPreview && (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200 shadow-md bg-white">
                    <Image
                      src={faviconPreview}
                      alt="Favicon preview"
                      fill
                      className="object-contain p-1"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFaviconFile(null);
                        setFaviconPreview(null);
                        if (faviconInputRef.current) faviconInputRef.current.value = '';
                      }}
                      className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <FiX className="w-2.5 h-2.5" />
                    </button>
                  </div>
                )}
                <div className="w-full max-w-md mx-auto">
                  <div
                    onClick={() => faviconInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-academic-blue hover:bg-academic-blue/5 transition-all"
                  >
                    <FiUpload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {faviconPreview ? 'Change Favicon' : 'Upload Favicon'}
                    </p>
                    <p className="text-xs text-gray-500">ICO, PNG, JPG (Recommended: 32x32px or 16x16px)</p>
                  </div>
                  <input
                    ref={faviconInputRef}
                    type="file"
                    accept="image/x-icon,image/png,image/jpeg,image/jpg,.ico,.png,.jpg,.jpeg"
                    onChange={handleFaviconChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

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

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Address
              </label>
              <textarea
                rows={2}
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-academic-blue focus:border-academic-blue resize-none bg-gray-50 transition-all"
                placeholder="Enter your business address"
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
