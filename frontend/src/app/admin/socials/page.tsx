'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  FiSave, FiShare2, FiGlobe, FiSearch, FiX, 
  FiMail, FiMessageCircle, FiEdit3, FiExternalLink,
  FiBookOpen
} from 'react-icons/fi';
import * as SiIcons from 'react-icons/si';
import { siteApi } from '@/lib/api';
import toast from 'react-hot-toast';

// Mapping of platform IDs to icons and labels
const SOCIAL_PLATFORMS = [
  { id: 'blogger', label: 'Blogger', icon: 'SiBlogger', color: 'hover:text-[#FF5722]', domain: 'blogger.com' },
  { id: 'bluesky', label: 'Bluesky', icon: 'SiBluesky', color: 'hover:text-[#0085FF]', domain: 'bsky.app' },
  { id: 'buffer', label: 'Buffer', icon: 'SiBuffer', color: 'hover:text-[#000000]', domain: 'buffer.com' },
  { id: 'diaspora', label: 'Diaspora', icon: 'SiDiaspora', color: 'hover:text-[#000000]', domain: 'diasporafoundation.org' },
  { id: 'digg', label: 'Digg', icon: 'SiDigg', color: 'hover:text-[#000000]', domain: 'digg.com' },
  { id: 'diigo', label: 'Diigo', icon: 'SiDiigo', color: 'hover:text-[#3399FF]', domain: 'diigo.com' },
  { id: 'douban', label: 'Douban', icon: 'SiDouban', color: 'hover:text-[#007722]', domain: 'douban.com' },
  { id: 'evernote', label: 'Evernote', icon: 'SiEvernote', color: 'hover:text-[#00A82D]', domain: 'evernote.com' },
  { id: 'facebook', label: 'Facebook', icon: 'SiFacebook', color: 'hover:text-[#1877F2]', domain: 'facebook.com' },
  { id: 'fark', label: 'Fark', icon: null, color: 'hover:text-[#000000]', domain: 'fark.com' },
  { id: 'flipboard', label: 'Flipboard', icon: 'SiFlipboard', color: 'hover:text-[#E12828]', domain: 'flipboard.com' },
  { id: 'gab', label: 'Gab', icon: 'SiGab', color: 'hover:text-[#00C853]', domain: 'gab.com' },
  { id: 'pocket', label: 'Pocket (GetPocket)', icon: 'SiPocket', color: 'hover:text-[#EF4056]', domain: 'getpocket.com' },
  { id: 'gmail', label: 'Gmail', icon: 'SiGmail', color: 'hover:text-[#EA4335]', domain: 'gmail.com' },
  { id: 'google_bookmarks', label: 'Google Bookmarks', icon: 'SiGooglebookmarks', color: 'hover:text-[#4285F4]', domain: 'google.com' },
  { id: 'hacker_news', label: 'Hacker News', icon: 'SiHackernews', color: 'hover:text-[#FF6600]', domain: 'news.ycombinator.com' },
  { id: 'houzz', label: 'Houzz', icon: 'SiHouzz', color: 'hover:text-[#7AC142]', domain: 'houzz.com' },
  { id: 'instapaper', label: 'Instapaper', icon: 'SiInstapaper', color: 'hover:text-[#000000]', domain: 'instapaper.com' },
  { id: 'iorbix', label: 'Iorbix', icon: null, color: 'hover:text-[#000000]', domain: 'iorbix.com' },
  { id: 'kakao', label: 'Kakao', icon: 'SiKakaotalk', color: 'hover:text-[#FFE812]', domain: 'kakao.com' },
  { id: 'kindle', label: 'Kindle It', icon: null, color: 'hover:text-[#000000]', domain: 'amazon.com' },
  { id: 'koo', label: 'Koo App', icon: null, color: 'hover:text-[#FACD00]', domain: 'kooapp.com' },
  { id: 'kudos', label: 'Kudos', icon: null, color: 'hover:text-[#000000]', domain: 'growkudos.com' },
  { id: 'line', label: 'Line', icon: 'SiLine', color: 'hover:text-[#00C300]', domain: 'line.me' },
  { id: 'linkedin', label: 'LinkedIn', icon: 'SiLinkedin', color: 'hover:text-[#0A66C2]', domain: 'linkedin.com' },
  { id: 'livejournal', label: 'LiveJournal', icon: 'SiLivejournal', color: 'hover:text-[#00B0EA]', domain: 'livejournal.com' },
  { id: 'mail_ru', label: 'Mail.ru', icon: 'SiMaildotru', color: 'hover:text-[#005FF9]', domain: 'mail.ru' },
  { id: 'meneame', label: 'Meneame', icon: 'SiMeneame', color: 'hover:text-[#FF5917]', domain: 'meneame.net' },
  { id: 'messenger', label: 'Messenger', icon: 'SiMessenger', color: 'hover:text-[#006AFF]', domain: 'messenger.com' },
  { id: 'ms_teams', label: 'Microsoft Teams', icon: 'SiMicrosoftteams', color: 'hover:text-[#6264A7]', domain: 'teams.microsoft.com' },
  { id: 'naver', label: 'Naver', icon: 'SiNaver', color: 'hover:text-[#03C75A]', domain: 'naver.com' },
  { id: 'nextdoor', label: 'Nextdoor', icon: 'SiNextdoor', color: 'hover:text-[#00B246]', domain: 'nextdoor.com' },
  { id: 'odnoklassniki', label: 'Odnoklassniki', icon: 'SiOdnoklassniki', color: 'hover:text-[#EE8208]', domain: 'ok.ru' },
  { id: 'outlook', label: 'Outlook', icon: 'SiMicrosoftoutlook', color: 'hover:text-[#0078D4]', domain: 'outlook.com' },
  { id: 'pinboard', label: 'Pinboard', icon: 'SiPinboard', color: 'hover:text-[#0000E6]', domain: 'pinboard.in' },
  { id: 'pinterest', label: 'Pinterest', icon: 'SiPinterest', color: 'hover:text-[#BD081C]', domain: 'pinterest.com' },
  { id: 'plurk', label: 'Plurk', icon: 'SiPlurk', color: 'hover:text-[#FF574D]', domain: 'plurk.com' },
  { id: 'qzone', label: 'Qzone', icon: 'SiQzone', color: 'hover:text-[#FECE00]', domain: 'qzone.qq.com' },
  { id: 'reddit', label: 'Reddit', icon: 'SiReddit', color: 'hover:text-[#FF4500]', domain: 'reddit.com' },
  { id: 'refind', label: 'Refind', icon: null, color: 'hover:text-[#3B5998]', domain: 'refind.com' },
  { id: 'renren', label: 'Renren', icon: 'SiRenren', color: 'hover:text-[#005EAC]', domain: 'renren.com' },
  { id: 'skype', label: 'Skype', icon: 'SiSkype', color: 'hover:text-[#00AFF0]', domain: 'skype.com' },
  { id: 'surfingbird', label: 'Surfingbird', icon: null, color: 'hover:text-[#000000]', domain: 'surfingbird.ru' },
  { id: 'telegram', label: 'Telegram', icon: 'SiTelegram', color: 'hover:text-[#26A5E4]', domain: 'telegram.org' },
  { id: 'tencent_qq', label: 'Tencent QQ', icon: 'SiTencentqq', color: 'hover:text-[#EB1923]', domain: 'qq.com' },
  { id: 'threema', label: 'Threema', icon: 'SiThreema', color: 'hover:text-[#000000]', domain: 'threema.ch' },
  { id: 'trello', label: 'Trello', icon: 'SiTrello', color: 'hover:text-[#0079BF]', domain: 'trello.com' },
  { id: 'tumblr', label: 'Tumblr', icon: 'SiTumblr', color: 'hover:text-[#36465D]', domain: 'tumblr.com' },
  { id: 'twitter', label: 'Twitter (X)', icon: 'SiX', color: 'hover:text-[#000000]', domain: 'twitter.com' },
  { id: 'vk', label: 'VK', icon: 'SiVk', color: 'hover:text-[#4C75A3]', domain: 'vk.com' },
  { id: 'wechat', label: 'WeChat', icon: 'SiWechat', color: 'hover:text-[#07C160]', domain: 'wechat.com' },
  { id: 'weibo', label: 'Weibo', icon: 'SiSinaweibo', color: 'hover:text-[#E6162D]', domain: 'weibo.com' },
  { id: 'whatsapp', label: 'WhatsApp', icon: 'SiWhatsapp', color: 'hover:text-[#25D366]', domain: 'whatsapp.com' },
  { id: 'wordpress', label: 'WordPress', icon: 'SiWordpress', color: 'hover:text-[#21759B]', domain: 'wordpress.com' },
  { id: 'xing', label: 'Xing', icon: 'SiXing', color: 'hover:text-[#006567]', domain: 'xing.com' },
  { id: 'yahoo_mail', label: 'Yahoo Mail', icon: 'SiYahoo', color: 'hover:text-[#6001D2]', domain: 'yahoo.com' },
  { id: 'yummly', label: 'Yummly', icon: 'SiYummly', color: 'hover:text-[#ED1C24]', domain: 'yummly.com' },
  { id: 'blm', label: 'BLM', icon: 'SiBlacklivesmatter', color: 'hover:text-[#000000]', domain: 'blacklivesmatter.com' },
];

const SocialIcon = ({ platform, className }: { platform: any, className: string }) => {
  const Icon = platform.icon ? (SiIcons as any)[platform.icon] : null;
  
  if (Icon) {
    return <Icon className={className} />;
  }
  
  // Fallback to favicon
  return (
    <img 
      src={`https://www.google.com/s2/favicons?sz=64&domain=${platform.domain}`} 
      alt={platform.label} 
      className={`${className} object-contain`}
      onError={(e) => {
        (e.target as HTMLImageElement).src = 'https://www.google.com/s2/favicons?sz=64&domain=google.com';
      }}
    />
  );
};

export default function AdminSocialsPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Fetch site settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: siteApi.getSettings,
  });

  // Initialize social links from settings
  useEffect(() => {
    if (settings?.social_links) {
      setSocialLinks(settings.social_links);
    }
  }, [settings]);

  const handleUrlChange = (id: string, value: string) => {
    setSocialLinks(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await siteApi.updateSettings({
        social_links: socialLinks
      });
      toast.success('Social links saved successfully!');
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
    } catch (error) {
      toast.error('Failed to save social links');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredPlatforms = SOCIAL_PLATFORMS.filter(p => 
    p.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-academic-navy border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-academic-navy rounded-lg">
                <FiShare2 className="w-6 h-6 text-white" />
              </div>
              Social Media Links
            </h1>
            <p className="text-gray-500 mt-1">Configure social icons and sharing links for articles and footer</p>
          </div>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-academic-navy text-white font-bold rounded-xl hover:bg-academic-blue transition-all disabled:opacity-50 shadow-md"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <FiSave className="w-5 h-5" />
            )}
            Save Socials
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search platforms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX />
                </button>
              )}
            </div>
            
            <div className="text-sm text-gray-500 font-medium">
              Showing {filteredPlatforms.length} of {SOCIAL_PLATFORMS.length} platforms
            </div>
          </div>

          <form onSubmit={handleSave} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlatforms.map((platform) => {
                return (
                  <div 
                    key={platform.id} 
                    className={`p-4 rounded-xl border transition-all ${
                      socialLinks[platform.id] 
                        ? 'border-academic-blue bg-blue-50/30' 
                        : 'border-gray-100 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg bg-white shadow-sm border border-gray-100 transition-colors ${platform.color} w-9 h-9 flex items-center justify-center overflow-hidden`}>
                        <SocialIcon platform={platform} className="w-5 h-5" />
                      </div>
                      <label htmlFor={platform.id} className="text-sm font-bold text-gray-700">
                        {platform.label}
                      </label>
                    </div>
                    
                    <div className="relative">
                      <input
                        id={platform.id}
                        type="url"
                        value={socialLinks[platform.id] || ''}
                        onChange={(e) => handleUrlChange(platform.id, e.target.value)}
                        placeholder="https://"
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-academic-blue bg-white"
                      />
                      {socialLinks[platform.id] && (
                        <a 
                          href={socialLinks[platform.id]} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-academic-blue hover:text-academic-navy"
                        >
                          <FiExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {filteredPlatforms.length === 0 && (
              <div className="text-center py-12">
                <FiShare2 className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500 italic">No platforms matching your search.</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
