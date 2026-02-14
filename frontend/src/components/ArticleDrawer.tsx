'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  FiX, FiUser, FiDownload, FiList, FiGrid, FiShare2, 
  FiCheck, FiCopy, FiFile, FiFileText, FiMail, FiMapPin, FiBookOpen,
  FiInfo, FiShield, FiExternalLink, FiTag
} from 'react-icons/fi';
import * as SiIcons from 'react-icons/si';
import toast from 'react-hot-toast';
import { articlesApi, siteApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

// Mapping of platform IDs to icons and labels
const SOCIAL_PLATFORMS: Record<string, { label: string; icon: string | null; color: string; domain: string }> = {
  blogger: { label: 'Blogger', icon: 'SiBlogger', color: 'text-[#FF5722]', domain: 'blogger.com' },
  bluesky: { label: 'Bluesky', icon: 'SiBluesky', color: 'text-[#0085FF]', domain: 'bsky.app' },
  buffer: { label: 'Buffer', icon: 'SiBuffer', color: 'text-[#000000]', domain: 'buffer.com' },
  diaspora: { label: 'Diaspora', icon: 'SiDiaspora', color: 'text-[#000000]', domain: 'diasporafoundation.org' },
  digg: { label: 'Digg', icon: 'SiDigg', color: 'text-[#000000]', domain: 'digg.com' },
  diigo: { label: 'Diigo', icon: null, color: 'text-[#3399FF]', domain: 'diigo.com' },
  douban: { label: 'Douban', icon: 'SiDouban', color: 'text-[#007722]', domain: 'douban.com' },
  evernote: { label: 'Evernote', icon: 'SiEvernote', color: 'text-[#00A82D]', domain: 'evernote.com' },
  facebook: { label: 'Facebook', icon: 'SiFacebook', color: 'text-[#1877F2]', domain: 'facebook.com' },
  fark: { label: 'Fark', icon: null, color: 'text-[#000000]', domain: 'fark.com' },
  flipboard: { label: 'Flipboard', icon: 'SiFlipboard', color: 'text-[#E12828]', domain: 'flipboard.com' },
  gab: { label: 'Gab', icon: null, color: 'text-[#00C853]', domain: 'gab.com' },
  pocket: { label: 'Pocket (GetPocket)', icon: 'SiPocket', color: 'text-[#EF4056]', domain: 'getpocket.com' },
  gmail: { label: 'Gmail', icon: 'SiGmail', color: 'text-[#EA4335]', domain: 'gmail.com' },
  google_bookmarks: { label: 'Google Bookmarks', icon: null, color: 'text-[#4285F4]', domain: 'google.com' },
  hacker_news: { label: 'Hacker News', icon: null, color: 'text-[#FF6600]', domain: 'news.ycombinator.com' },
  houzz: { label: 'Houzz', icon: 'SiHouzz', color: 'text-[#7AC142]', domain: 'houzz.com' },
  instapaper: { label: 'Instapaper', icon: 'SiInstapaper', color: 'text-[#000000]', domain: 'instapaper.com' },
  iorbix: { label: 'Iorbix', icon: null, color: 'text-[#000000]', domain: 'iorbix.com' },
  kakao: { label: 'Kakao', icon: 'SiKakaotalk', color: 'text-[#FFE812]', domain: 'kakao.com' },
  kindle: { label: 'Kindle It', icon: null, color: 'text-[#000000]', domain: 'amazon.com' },
  koo: { label: 'Koo App', icon: null, color: 'text-[#FACD00]', domain: 'kooapp.com' },
  kudos: { label: 'Kudos', icon: null, color: 'text-[#000000]', domain: 'growkudos.com' },
  line: { label: 'Line', icon: 'SiLine', color: 'text-[#00C300]', domain: 'line.me' },
  linkedin: { label: 'LinkedIn', icon: 'SiLinkedin', color: 'text-[#0A66C2]', domain: 'linkedin.com' },
  livejournal: { label: 'LiveJournal', icon: 'SiLivejournal', color: 'text-[#00B0EA]', domain: 'livejournal.com' },
  mail_ru: { label: 'Mail.ru', icon: 'SiMaildotru', color: 'text-[#005FF9]', domain: 'mail.ru' },
  meneame: { label: 'Meneame', icon: null, color: 'text-[#FF5917]', domain: 'meneame.net' },
  messenger: { label: 'Messenger', icon: 'SiMessenger', color: 'text-[#006AFF]', domain: 'messenger.com' },
  ms_teams: { label: 'Microsoft Teams', icon: null, color: 'text-[#6264A7]', domain: 'teams.microsoft.com' },
  naver: { label: 'Naver', icon: 'SiNaver', color: 'text-[#03C75A]', domain: 'naver.com' },
  nextdoor: { label: 'Nextdoor', icon: 'SiNextdoor', color: 'text-[#00B246]', domain: 'nextdoor.com' },
  odnoklassniki: { label: 'Odnoklassniki', icon: 'SiOdnoklassniki', color: 'text-[#EE8208]', domain: 'ok.ru' },
  outlook: { label: 'Outlook', icon: 'SiMicrosoftoutlook', color: 'text-[#0078D4]', domain: 'outlook.com' },
  pinboard: { label: 'Pinboard', icon: 'SiPinboard', color: 'text-[#0000E6]', domain: 'pinboard.in' },
  pinterest: { label: 'Pinterest', icon: 'SiPinterest', color: 'text-[#BD081C]', domain: 'pinterest.com' },
  plurk: { label: 'Plurk', icon: 'SiPlurk', color: 'text-[#FF574D]', domain: 'plurk.com' },
  qzone: { label: 'Qzone', icon: 'SiQzone', color: 'text-[#FECE00]', domain: 'qzone.qq.com' },
  reddit: { label: 'Reddit', icon: 'SiReddit', color: 'text-[#FF4500]', domain: 'reddit.com' },
  refind: { label: 'Refind', icon: null, color: 'text-[#3B5998]', domain: 'refind.com' },
  renren: { label: 'Renren', icon: 'SiRenren', color: 'text-[#005EAC]', domain: 'renren.com' },
  skype: { label: 'Skype', icon: 'SiSkype', color: 'text-[#00AFF0]', domain: 'skype.com' },
  surfingbird: { label: 'Surfingbird', icon: null, color: 'text-[#000000]', domain: 'surfingbird.ru' },
  telegram: { label: 'Telegram', icon: 'SiTelegram', color: 'text-[#26A5E4]', domain: 'telegram.org' },
  tencent_qq: { label: 'Tencent QQ', icon: 'SiTencentqq', color: 'text-[#EB1923]', domain: 'qq.com' },
  threema: { label: 'Threema', icon: 'SiThreema', color: 'text-[#000000]', domain: 'threema.ch' },
  trello: { label: 'Trello', icon: 'SiTrello', color: 'text-[#0079BF]', domain: 'trello.com' },
  tumblr: { label: 'Tumblr', icon: 'SiTumblr', color: 'text-[#36465D]', domain: 'tumblr.com' },
  twitter: { label: 'Twitter', icon: 'SiX', color: 'text-[#000000]', domain: 'twitter.com' },
  vk: { label: 'VK', icon: 'SiVk', color: 'text-[#4C75A3]', domain: 'vk.com' },
  wechat: { label: 'WeChat', icon: 'SiWechat', color: 'text-[#07C160]', domain: 'wechat.com' },
  weibo: { label: 'Weibo', icon: 'SiSinaweibo', color: 'text-[#E6162D]', domain: 'weibo.com' },
  whatsapp: { label: 'WhatsApp', icon: 'SiWhatsapp', color: 'text-[#25D366]', domain: 'whatsapp.com' },
  wordpress: { label: 'WordPress', icon: 'SiWordpress', color: 'text-[#21759B]', domain: 'wordpress.com' },
  xing: { label: 'Xing', icon: 'SiXing', color: 'text-[#006567]', domain: 'xing.com' },
  yahoo_mail: { label: 'Yahoo Mail', icon: null, color: 'text-[#6001D2]', domain: 'yahoo.com' },
  yummly: { label: 'Yummly', icon: null, color: 'text-[#ED1C24]', domain: 'yummly.com' },
  blm: { label: 'BLM', icon: null, color: 'text-[#000000]', domain: 'blacklivesmatter.com' },
};

const SocialIcon = ({ id, className }: { id: string, className: string }) => {
  const platform = SOCIAL_PLATFORMS[id];
  if (!platform) return <FiShare2 className={className} />;

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

interface ArticleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'authors' | 'downloads' | 'references' | 'tables' | 'share' | 'about' | 'cite' | 'advertising' | 'promotional' | null;
  data: any;
}

export function ArticleDrawer({ isOpen, onClose, type, data }: ArticleDrawerProps) {
  const [copied, setStatus] = useState(false);

  // Fetch site settings for social links
  const { data: settings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: siteApi.getSettings,
    enabled: isOpen && type === 'share',
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      // Typeset MathJax when drawer opens or content changes
      if (typeof window !== 'undefined' && window.MathJax && window.MathJax.typeset) {
        window.MathJax.typeset();
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, type]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setStatus(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setStatus(false), 2000);
  };

  if (!isOpen) return null;

  const renderContent = () => {
    switch (type) {
      case 'authors':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 bg-academic-navy/5 rounded-lg flex items-center justify-center text-academic-navy">
                <FiUser className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Author Information</h3>
            </div>
            
            <div className="space-y-10">
              {data.authors?.map((author: any) => (
                <div key={author.id} className="group">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-base font-black text-academic-blue leading-tight">{author.full_name}</h4>
                    {author.is_corresponding && (
                      <span className="text-[8px] font-black uppercase tracking-widest bg-academic-gold/10 text-academic-gold px-1.5 py-0.5 rounded">Corresponding</span>
                    )}
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {author.email && (
                      <div className="flex items-center gap-2.5 text-[11px] font-bold text-gray-500">
                        <FiMail className="w-3.5 h-3.5 text-gray-300" />
                        <a href={`mailto:${author.email}`} className="hover:text-academic-blue transition-colors">{author.email}</a>
                      </div>
                    )}
                    {author.orcid_id && (
                      <div className="flex items-center gap-2.5 text-[11px] font-bold text-gray-500">
                        <Image 
                          src="https://orcid.org/assets/vectors/orcid.logo.icon.svg" 
                          alt="ORCID" 
                          width={14} 
                          height={14}
                          className="w-3.5 h-3.5" 
                        />
                        <a 
                          href={author.orcid_id.startsWith('http') ? author.orcid_id : `https://orcid.org/${author.orcid_id}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-academic-blue transition-colors" 
                        >
                          {author.orcid_id.replace('https://orcid.org/', '')}
                        </a>
                      </div>
                    )}
                    {(author.affiliation || author.department) && (
                      <div className="flex items-start gap-2.5 text-[11px] text-gray-500 leading-relaxed">
                        <FiMapPin className="w-3.5 h-3.5 text-gray-300 mt-0.5" />
                        <div className="font-bold">
                          {author.department && <span>{author.department}, </span>}
                          {author.affiliation && <span className="text-gray-400 font-medium">{author.affiliation}</span>}
                        </div>
                      </div>
                    )}
                  </div>

                  {author.bio && (
                    <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100/50">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-2">Biography</span>
                      <div 
                        className="text-[12px] leading-relaxed text-gray-600 line-clamp-4 hover:line-clamp-none transition-all cursor-default" 
                        dangerouslySetInnerHTML={{ __html: author.bio }} 
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case 'downloads':
        const journalSlug = data.journal_info?.slug || data.journal_slug;
        const articleSlug = data.slug;
        
        const files = [
          { label: 'PDF Document', url: data.pdf_file ? articlesApi.getPdfUrl(journalSlug, articleSlug) : null, icon: FiFileText, key: 'pdf' },
          { label: 'XML Source', url: data.xml_file ? articlesApi.getXmlUrl(journalSlug, articleSlug) : null, icon: FiFile, key: 'xml' },
          { label: 'ePUB Format', url: data.epub_file, icon: FiBookOpen, key: 'epub' },
          { label: 'PRC Format', url: data.prc_file, icon: FiFile, key: 'prc' },
          { label: 'Mobi Format', url: data.mobi_file, icon: FiFile, key: 'mobi' },
        ].filter(f => f.url);

        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-academic-navy border-b pb-2">Download Article</h3>
            <div className="grid gap-4">
              {files.map((file) => (
                <a
                  key={file.key}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-academic-blue hover:bg-blue-50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-academic-blue">
                    <file.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{file.label}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-tighter">Click to download</p>
                  </div>
                </a>
              ))}
              {files.length === 0 && (
                <p className="text-center py-8 text-gray-500">No downloadable files available.</p>
              )}
            </div>
          </div>
        );
      case 'references':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 bg-academic-navy/5 rounded-lg flex items-center justify-center text-academic-navy">
                <FiList className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">References</h3>
            </div>
            
            {data.html_content?.references_html ? (
              <div 
                className="text-sm text-gray-700 leading-relaxed references-drawer-list"
                dangerouslySetInnerHTML={{ __html: data.html_content.references_html }}
              />
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-400 text-sm font-medium">No references found in XML.</p>
              </div>
            )}
          </div>
        );
      case 'tables':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 bg-academic-navy/5 rounded-lg flex items-center justify-center text-academic-navy">
                <FiGrid className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Tables & Figures</h3>
            </div>
            
            {(data.tables?.length > 0 || data.figures?.length > 0) ? (
              <div className="space-y-12">
                {/* Tables */}
                {data.tables?.map((table: any) => (
                  <div key={table.id} className="space-y-4 group">
                    <h4 className="text-sm font-black text-academic-blue uppercase tracking-wider">{table.label || 'Table'}</h4>
                    <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm bg-white">
                      <div className="overflow-x-auto custom-scrollbar">
                        <div 
                          className="text-[12px] p-1 drawer-table-container" 
                          dangerouslySetInnerHTML={{ __html: table.table_html }} 
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Figures */}
                {data.figures?.map((figure: any) => (
                  <div key={figure.id} className="space-y-4 group">
                    <h4 className="text-sm font-black text-academic-blue uppercase tracking-wider">{figure.label || 'Figure'}</h4>
                    <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm bg-white p-2">
                      <div className="relative w-full aspect-video">
                        {(figure.image_url || figure.image) ? (
                          <Image 
                            src={figure.image_url || figure.image} 
                            alt={figure.label || "Figure"} 
                            fill
                            className="object-contain rounded-lg shadow-sm"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <FiGrid className="w-8 h-8 text-gray-200" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-400 text-sm font-medium">No tables or figures found.</p>
              </div>
            )}
          </div>
        );
      case 'cite':
        const citationFiles = [
          { label: 'RIS (EndNote, Reference Manager)', url: data.ris_file, key: 'ris' },
          { label: 'BibTeX (LaTeX)', url: data.bib_file, key: 'bib' },
          { label: 'EndNote (ENW)', url: data.endnote_file, key: 'endnote' },
        ].filter(f => f.url);

        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 bg-academic-navy/5 rounded-lg flex items-center justify-center text-academic-navy">
                <FiBookOpen className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Cite As</h3>
            </div>
            
            <div className="bg-academic-navy/[0.02] p-6 rounded-2xl border border-gray-100 space-y-4">
              <div className="text-sm font-serif leading-relaxed text-gray-700">
                {data.cite_as ? (
                  <div dangerouslySetInnerHTML={{ __html: data.cite_as }} />
                ) : (
                  <>
                    {data.authors?.[0]?.last_name} et al. {data.title}. 
                    <span> {data.journal_info?.title}</span>, {new Date(data.published_date).getFullYear()}; {data.volume_info?.volume_number || '20'}: {data.article_id_code || 'e187421'}.
                    <br />
                    <span className="text-academic-blue break-all text-[11px]">http://dx.doi.org/{data.doi}</span>
                  </>
                )}
              </div>
              
              <button
                onClick={() => {
                  const text = data.cite_as ? 
                    data.cite_as.replace(/<[^>]*>?/gm, '') : 
                    `${data.authors?.[0]?.last_name} et al. ${data.title}. ${data.journal_info?.title}, ${new Date(data.published_date).getFullYear()}; ${data.volume_info?.volume_number || '20'}: ${data.article_id_code || 'e187421'}. DOI: ${data.doi}`;
                  navigator.clipboard.writeText(text);
                  toast.success('Citation copied to clipboard!');
                }}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-academic-blue hover:text-academic-navy transition-colors"
              >
                <FiCopy className="w-3 h-3" />
                Copy Citation
              </button>
            </div>

            {citationFiles.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Download Citation</h4>
                <div className="grid grid-cols-1 gap-2">
                  {citationFiles.map((file) => (
                    <a
                      key={file.key}
                      href={file.url}
                      download
                      className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:border-academic-blue hover:shadow-sm transition-all group"
                    >
                      <span className="text-[11px] font-bold text-gray-600">{file.label}</span>
                      <FiDownload className="w-3.5 h-3.5 text-gray-300 group-hover:text-academic-blue" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case 'share':
        const activeSocials = settings?.social_links 
          ? Object.entries(settings.social_links).filter(([_, url]) => !!url)
          : [];

        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-academic-navy border-b pb-2">Share Article</h3>
            
            <div className="grid grid-cols-4 gap-4">
              {activeSocials.map(([id, url]) => {
                const platform = SOCIAL_PLATFORMS[id];
                if (!platform) return null;
                
                return (
                  <a
                    key={id}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 hover:border-academic-blue hover:bg-blue-50 transition-all group`}
                    title={platform.label}
                  >
                    <div className="w-6 h-6 transition-transform group-hover:scale-110">
                      <SocialIcon id={id} className={`w-full h-full ${platform.color}`} />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-tighter text-gray-400 group-hover:text-academic-navy truncate w-full text-center">{platform.label}</span>
                  </a>
                );
              })}
            </div>

            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
              <p className="text-sm text-gray-600 font-medium">Copy article URL:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={typeof window !== 'undefined' ? window.location.href : ''}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                />
                <button
                  onClick={handleCopyLink}
                  className="p-2 bg-academic-navy text-white rounded-lg hover:bg-academic-blue transition-colors"
                >
                  {copied ? <FiCheck /> : <FiCopy />}
                </button>
              </div>
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 bg-academic-navy/5 rounded-lg flex items-center justify-center text-academic-navy">
                <FiInfo className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">About Article</h3>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h4 className="text-xs font-black uppercase tracking-widest text-academic-navy/60 mb-4 flex items-center gap-2">
                  <FiShield className="w-3 h-3" />
                  Copyright & License
                </h4>
                <div className="text-sm text-gray-700 leading-relaxed space-y-3">
                  {data.license_text ? (
                    <div 
                      className="prose prose-sm max-w-none prose-p:text-gray-600"
                      dangerouslySetInnerHTML={{ __html: data.license_text }} 
                    />
                  ) : (
                    <p className="text-gray-500">Open Access. Distributed under the terms of the Creative Commons Attribution 4.0 International License (CC BY 4.0).</p>
                  )}
                </div>
              </div>

              {/* Publication History */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h4 className="text-xs font-black uppercase tracking-widest text-academic-navy/60 mb-4">Article History</h4>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { label: 'Received', date: data.received_date },
                    { label: 'Revised', date: data.revised_date },
                    { label: 'Accepted', date: data.accepted_date },
                    { label: 'Published', date: data.published_date }
                  ].filter(h => h.date).map((item) => (
                    <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                      <span className="text-xs font-bold text-gray-400">{item.label}</span>
                      <span className="text-xs font-black text-gray-900">
                        {new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Keywords if available */}
              {data.keywords && data.keywords.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h4 className="text-xs font-black uppercase tracking-widest text-academic-navy/60 mb-4">Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.keywords.map((kw: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-gray-50 text-gray-600 text-[10px] font-bold rounded-full border border-gray-100 uppercase tracking-wider">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 'advertising':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 bg-academic-navy/5 rounded-lg flex items-center justify-center text-academic-navy">
                <FiTag className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Advertising Policy</h3>
            </div>
            <div className="bg-gray-50/50 rounded-2xl p-8 border border-dashed border-gray-200 flex flex-col items-center justify-center text-center py-20">
              <FiShield className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium italic">Our advertising policy content will be added here soon.</p>
            </div>
          </div>
        );
      case 'promotional':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 bg-academic-navy/5 rounded-lg flex items-center justify-center text-academic-navy">
                <FiShare2 className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Promotional Services</h3>
            </div>
            <div className="bg-gray-50/50 rounded-2xl p-8 border border-dashed border-gray-200 flex flex-col items-center justify-center text-center py-20">
              <FiExternalLink className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium italic">Information about our promotional services for authors will be available soon.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex flex-col">
            <span className="font-black uppercase tracking-[0.2em] text-[10px] text-academic-gold mb-0.5">Article Resources</span>
            <span className="text-[11px] font-bold text-gray-400 truncate max-w-[240px]">
              {data.title}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-50 rounded-full transition-all text-gray-400 hover:text-gray-900 border border-transparent hover:border-gray-100"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {renderContent()}
        </div>
      </div>

      <style jsx global>{`
        /* Consistent Reference Styling */
        .references-list-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .reference-line {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          font-size: 0.8125rem;
          line-height: 1.6;
          color: #4b5563;
        }
        .reference-label {
          font-weight: 900;
          color: #1e3a8a;
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          min-width: 1.8rem;
          margin-top: 0.1rem;
        }
        .reference-label::before { content: "["; }
        .reference-label::after { content: "]"; }
        
        .reference-content {
          flex: 1;
        }
        .reference-content a {
          color: #1e3a8a;
          text-decoration: none;
          word-break: break-all;
        }
        .reference-content a:hover {
          text-decoration: underline;
        }

        /* Support for standard LI references (Fallback) */
        .references-drawer-list {
          counter-reset: ref-counter;
        }
        .references-drawer-list ol, .references-drawer-list ul { 
          list-style: none !important; 
          padding-left: 0 !important; 
        }
        .references-drawer-list li { 
          margin-bottom: 1.5rem; 
          position: relative;
          padding-left: 2.2rem;
          font-size: 0.8125rem;
          line-height: 1.6;
          color: #4b5563;
        }
        .references-drawer-list li::before {
          counter-increment: ref-counter;
          content: "[" counter(ref-counter) "]";
          position: absolute;
          left: 0;
          top: 0;
          font-weight: 900;
          color: #1e3a8a;
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          width: 2rem;
        }

        /* Table Styles for Drawer */
        .drawer-table-container table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }
        .drawer-table-container th {
          background-color: #f8fafc;
          color: #334155;
          font-weight: 800;
          text-transform: uppercase;
          font-size: 10px;
          letter-spacing: 0.05em;
          padding: 12px 16px;
          text-align: left;
          border-bottom: 2px solid #e2e8f0;
        }
        .drawer-table-container td {
          padding: 12px 16px;
          font-size: 11px;
          color: #64748b;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }
        .drawer-table-container sub, .drawer-table-container sup {
          font-size: 70%;
          line-height: 0;
          position: relative;
          vertical-align: baseline;
        }
        .drawer-table-container sub { bottom: -0.25em; }
        .drawer-table-container sup { top: -0.5em; }
        .drawer-table-container tr:last-child td {
          border-bottom: none;
        }
        .drawer-table-container tr:hover td {
          background-color: #f8fafc;
          color: #1e3a8a;
        }

        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
}
