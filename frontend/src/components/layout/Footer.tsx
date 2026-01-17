'use client';

import Link from 'next/link';
import { FiMail, FiPhone, FiMapPin, FiTwitter, FiLinkedin, FiFacebook } from 'react-icons/fi';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-academic-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-academic-gold rounded-lg flex items-center justify-center">
                <span className="text-academic-navy font-bold text-xl">A</span>
              </div>
              <h3 className="text-lg font-semibold text-academic-gold">
                Aethra Science Publishers
              </h3>
            </div>
            <p className="text-sm text-gray-300 mb-4 leading-relaxed">
              Dedicated to advancing scientific knowledge through high-quality,
              peer-reviewed academic publications.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2 bg-white/10 rounded-lg hover:bg-academic-gold hover:text-academic-navy transition-colors"
                aria-label="Twitter"
              >
                <FiTwitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 bg-white/10 rounded-lg hover:bg-academic-gold hover:text-academic-navy transition-colors"
                aria-label="LinkedIn"
              >
                <FiLinkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 bg-white/10 rounded-lg hover:bg-academic-gold hover:text-academic-navy transition-colors"
                aria-label="Facebook"
              >
                <FiFacebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-academic-gold uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { href: '/journals', label: 'All Journals' },
                { href: '/subjects', label: 'Browse by Subject' },
                { href: '/services', label: 'Services' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Authors */}
          <div>
            <h4 className="text-sm font-semibold text-academic-gold uppercase tracking-wider mb-4">
              For Authors
            </h4>
            <ul className="space-y-2">
              {[
                { href: '/submit', label: 'Submit Manuscript' },
                { href: '/guidelines', label: 'Author Guidelines' },
                { href: '/ethics', label: 'Publication Ethics' },
                { href: '/fees', label: 'Article Processing Charges' },
                { href: '/faq', label: 'FAQs' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-academic-gold uppercase tracking-wider mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FiMapPin className="w-4 h-4 mt-1 text-academic-gold flex-shrink-0" />
                <span className="text-sm text-gray-300">
                  123 Academic Way, Research Park,
                  <br />
                  Science City, SC 12345
                </span>
              </li>
              <li>
                <a
                  href="mailto:info@aethrasciencepublishers.com"
                  className="flex items-center gap-3 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  <FiMail className="w-4 h-4 text-academic-gold flex-shrink-0" />
                  info@aethrasciencepublishers.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+1234567890"
                  className="flex items-center gap-3 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  <FiPhone className="w-4 h-4 text-academic-gold flex-shrink-0" />
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} Aethra Science Publishers. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
