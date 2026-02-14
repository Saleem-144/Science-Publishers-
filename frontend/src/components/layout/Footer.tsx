'use client';

import Link from 'next/link';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { SiX, SiLinkedin, SiFacebook } from 'react-icons/si';
import { useQuery } from '@tanstack/react-query';
import { siteApi } from '@/lib/api';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { data: settings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: siteApi.getSettings,
  });
  const socialLinks = settings?.social_links || {};

  return (
    <footer className="bg-academic-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 border-t border-white/10 pt-16">
          <div className="space-y-6">
            <h4 className="text-xs font-black text-academic-gold uppercase tracking-[0.2em]">For Authors</h4>
            <ul className="space-y-4">
              {['Submit Manuscript', 'Author Guidelines', 'Processing Charges', 'Browse Journals', 'Author FAQs'].map((label, i) => (
                <li key={i}>
                  <Link href="#" className="text-sm font-bold text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-academic-gold/20 group-hover:bg-academic-gold transition-colors"></span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-xs font-black text-academic-gold uppercase tracking-[0.2em]">For Editors</h4>
            <ul className="space-y-4">
              {['Join Editorial Board', 'Become a Reviewer', 'Call for Editors', 'Editorial Services', 'Reviewer Guidelines'].map((label, i) => (
                <li key={i}>
                  <Link href="#" className="text-sm font-bold text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-academic-gold/20 group-hover:bg-academic-gold transition-colors"></span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-xs font-black text-academic-gold uppercase tracking-[0.2em]">Ethics</h4>
            <ul className="space-y-4">
              {['Publication Ethics', 'Privacy Policy', 'Terms & Conditions', 'Cookie Policy', 'Peer Review Policy'].map((label, i) => (
                <li key={i}>
                  <Link href="#" className="text-sm font-bold text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-academic-gold/20 group-hover:bg-academic-gold transition-colors"></span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-xs font-black text-academic-gold uppercase tracking-[0.2em]">Contact Us</h4>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <FiMapPin className="w-4 h-4 text-academic-gold" />
                <p className="text-sm font-bold text-gray-400 leading-relaxed">23 Hadley road, mitcham, London.Uk Cr41nw</p>
              </div>
              <div className="flex items-center gap-4">
                <FiMail className="w-4 h-4 text-academic-gold" />
                <span className="text-sm font-bold text-gray-400">info@aethrasciencepublishers.com</span>
              </div>
              <div className="flex items-center gap-4">
                <FiPhone className="w-4 h-4 text-academic-gold" />
                <span className="text-sm font-bold text-gray-400">+1 (234) 567-890</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm font-bold text-gray-500">© {currentYear} Aethra Science Publishers. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {socialLinks.twitter && <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 bg-academic-gold rounded-xl flex items-center justify-center text-academic-navy"><SiX /></a>}
            {socialLinks.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 bg-academic-gold rounded-xl flex items-center justify-center text-academic-navy"><SiLinkedin /></a>}
            {socialLinks.facebook && <a href={socialLinks.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 bg-academic-gold rounded-xl flex items-center justify-center text-academic-navy"><SiFacebook /></a>}
            {socialLinks.kudos && (
              <a href={socialLinks.kudos} target="_blank" rel="noreferrer" className="w-10 h-10 bg-academic-gold rounded-xl flex items-center justify-center text-academic-navy overflow-hidden">
                <img src="https://www.google.com/s2/favicons?sz=64&domain=growkudos.com" className="w-5 h-5 grayscale hover:grayscale-0 transition-all" alt="Kudos" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
