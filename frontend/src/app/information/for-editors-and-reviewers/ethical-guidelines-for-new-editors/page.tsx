'use client';

import Link from 'next/link';
import { FiExternalLink } from 'react-icons/fi';

export default function EthicalGuidelinesForNewEditorsPage() {
  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-academic-navy mb-8 pb-4 border-b-4 border-academic-gold">
          ETHICAL GUIDELINES FOR NEW EDITORS
        </h1>

        <div className="mt-8 text-gray-700 space-y-6 leading-relaxed">
          <p>
            The Committee on Publication Ethics (COPE) provides the backbone for the ethical and practical implementation of publication guidelines, which enlighten and offer support to the members. This non-statutory advisory membership body also lends a professional voice to contemporary discourse.
          </p>

          <p>
            COPE is committed to educating and supporting editors, publishers, and the relevant team with the aim to transform and integrate the ethical practices to become a part of the publishing culture. Our approach is consistent with COPE efforts to promote ethical practices in publishing through education, training, and following best international practices.
          </p>

          <p>
            Aethra recommends all new editors to carefully follow the guide to ethical editing for new editors and the sharing of information among Editors-in-Chief regarding possible misconduct by COPE. This is a brief document that is readily accessible to assist new editors with ethical practices. It contains general guidelines on the quality checks and audits for new editors while joining any journal and to establish and maintain business relationships with other editors/editorial board members. The guide also informs new editors about their role and organized approach toward journal management.
          </p>

          <p>
            COPE also provides comprehensive guidelines on publication ethics through its popular resources, i.e., core practices, flowcharts and cases (available on{' '}
            <Link
              href="https://publicationethics.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-blue hover:underline inline-flex items-center gap-1"
            >
              COPE's website
              <FiExternalLink className="w-4 h-4" />
            </Link>
            {' '}). Aethra expects its editorial staff and editors to strictly adhere to and follow the guidelines in order to comply with the Principles of Transparency and Best Practice in Scholarly Publishing.
          </p>
        </div>
      </div>
    </div>
  );
}

