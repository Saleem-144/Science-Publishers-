'use client';

import Link from 'next/link';
import { FiExternalLink } from 'react-icons/fi';

export default function AllegationsFromWhistleblowersPage() {
  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-academic-navy mb-8 pb-4 border-b-4 border-academic-gold">
          ALLEGATIONS FROM WHISTLEBLOWERS
        </h1>

        <div className="mt-8 text-gray-700 space-y-6 leading-relaxed">
          <p>
            Whistleblowing is an intentional disclosure of information about critical and essential activities, which involve unethical, unlawful, threatening, or biased malpractice executed by a current or former staff member(s). Whistleblowing also rounds up any offensive or infringing misconduct. Aethra has strict rules and regulations regarding whistleblower allegations. Any concerned whistleblower allegation will be treated equally as any external complaint. Aethra's Ethics Advisory Panel will pass the verdict and detail necessary measures via email after a careful review and analysis of the allegation. Please view Aethra's guidelines for details on different types of misconduct by clicking on the link below:
          </p>
          <p>
            <Link
              href="https://benthamopenscience.com/research-misconduct.php"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-blue hover:underline inline-flex items-center gap-1"
            >
              https://benthamopenscience.com/research-misconduct.php
              <FiExternalLink className="w-4 h-4" />
            </Link>
          </p>
          <p>
            Aethra's Ethics Advisory Panel will examine all allegations of misconduct on social media according to the COPE Guidelines available at:
          </p>
          <p>
            <Link
              href="https://publicationethics.org/guidance/flowchart/responding-concerns-raised-social-media"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-blue hover:underline inline-flex items-center gap-1"
            >
              https://publicationethics.org/guidance/flowchart/responding-concerns-raised-social-media
              <FiExternalLink className="w-4 h-4" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

