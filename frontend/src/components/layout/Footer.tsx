'use client';

import Link from 'next/link';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { SiX, SiLinkedin, SiFacebook } from 'react-icons/si';
import { useQuery } from '@tanstack/react-query';
import { siteApi } from '@/lib/api';

export function Footer() {
  const currentYear = new Date().getFullYear();

  // Fetch site settings for social links
  const { data: settings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: siteApi.getSettings,
  });

  const socialLinks = settings?.social_links || {};

  return (
    <footer className="bg-academic-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        {/* Top Section: Centered Logo & Description */}
        <div className="flex flex-col items-center text-center mb-16">
          <Link href="/" className="flex flex-col items-center gap-4 group mb-6">
            <div className="w-16 h-16 bg-academic-gold rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-all duration-300">
              <span className="text-academic-navy font-black text-3xl">A</span>
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight uppercase">
              Aethra <span className="text-academic-gold">Science</span> Publishers
            </h3>
          </Link>
          <p className="max-w-2xl text-lg text-gray-400 font-medium leading-relaxed">
            Dedicated to advancing scientific knowledge through high-quality, 
            peer-reviewed academic publications.
          </p>
        </div>

        {/* Middle Section: 4 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 border-t border-white/10 pt-16">
          {/* Column 1: For Authors */}
          <div className="space-y-6">
            <h4 className="text-xs font-black text-academic-gold uppercase tracking-[0.2em]">
              For Authors
            </h4>
            <ul className="space-y-4">
              {[
                { href: '/publish-with-us', label: 'Submit Manuscript' },
                { href: '/guidelines', label: 'Author Guidelines' },
                { href: '/fees', label: 'Processing Charges' },
                { href: '/journals', label: 'Browse Journals' },
                { href: '/faq', label: 'Author FAQs' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-bold text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-academic-gold/20 group-hover:bg-academic-gold transition-colors"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: For Editors & Reviewers */}
          <div className="space-y-6">
            <h4 className="text-xs font-black text-academic-gold uppercase tracking-[0.2em]">
              For Editors & Reviewers
            </h4>
            <ul className="space-y-4">
              {[
                { href: '/apply/editorial-board', label: 'Join Editorial Board' },
                { href: '/apply/reviewer', label: 'Become a Reviewer' },
                { href: '/apply/editor', label: 'Call for Editors' },
                { href: '/services', label: 'Editorial Services' },
                { href: '/ethics', label: 'Reviewer Guidelines' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-bold text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-academic-gold/20 group-hover:bg-academic-gold transition-colors"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Ethical Guidelines */}
          <div className="space-y-6">
            <h4 className="text-xs font-black text-academic-gold uppercase tracking-[0.2em]">
              Ethical Guidelines
            </h4>
            <ul className="space-y-4">
              {[
                { href: '/ethics', label: 'Publication Ethics' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms & Conditions' },
                { href: '/cookies', label: 'Cookie Policy' },
                { href: '/about', label: 'Peer Review Policy' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-bold text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-academic-gold/20 group-hover:bg-academic-gold transition-colors"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="space-y-6">
            <h4 className="text-xs font-black text-academic-gold uppercase tracking-[0.2em]">
              Contact Us
            </h4>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="w-4 h-4 text-academic-gold" />
                </div>
                <p className="text-sm font-bold text-gray-400 leading-relaxed">
                  23 Hadley road , mitcham,<br />
                  London.Uk Cr41nw
                </p>
              </div>
              <a
                href="mailto:info@aethrasciencepublishers.com"
                className="flex items-center gap-4 group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-academic-gold/20 transition-colors">
                  <FiMail className="w-4 h-4 text-academic-gold" />
                </div>
                <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">
                  info@aethrasciencepublishers.com
                </span>
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center gap-4 group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-academic-gold/20 transition-colors">
                  <FiPhone className="w-4 h-4 text-academic-gold" />
                </div>
                <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">
                  +1 (234) 567-890
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm font-bold text-gray-500">
            © {currentYear} Aethra Science Publishers. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest mr-2">Follow Us</span>
            
            {socialLinks.twitter && (
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-400 hover:bg-academic-gold hover:text-academic-navy transition-all duration-300 shadow-sm"
                aria-label="Twitter"
              >
                <SiX className="w-4 h-4" />
              </a>
            )}
            
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-400 hover:bg-academic-gold hover:text-academic-navy transition-all duration-300 shadow-sm"
                aria-label="LinkedIn"
              >
                <SiLinkedin className="w-4 h-4" />
              </a>
            )}
            
            {socialLinks.facebook && (
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-400 hover:bg-academic-gold hover:text-academic-navy transition-all duration-300 shadow-sm"
                aria-label="Facebook"
              >
                <SiFacebook className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
