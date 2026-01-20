'use client';

import Link from 'next/link';
import { FiExternalLink } from 'react-icons/fi';

export default function ArchivingPoliciesPage() {
  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-academic-navy mb-8 pb-4 border-b-4 border-academic-gold">
          ARCHIVING POLICIES
        </h1>

        {/* Main Content */}
        <div className="prose prose-lg max-w-none">
          {/* First Paragraph */}
          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            Articles are licensed under the terms of the{' '}
            <Link
              href="https://creativecommons.org/licenses/by/4.0/legalcode"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-blue hover:text-academic-navy underline inline-flex items-center gap-1"
            >
              Creative Commons Attribution 4.0 International Public License (CC-BY 4.0)
              <FiExternalLink className="w-4 h-4" />
            </Link>
            {' '}(https://creativecommons.org/licenses/by/4.0/legalcode), which permits unrestricted, distribution and reproduction in any medium, provided that the work is properly cited. All articles are archived in Portico.
          </p>

          {/* Policy On Funded Publications Heading */}
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-academic-navy mb-4 mt-12">
            Policy On Funded Publications
          </h2>

          {/* Paragraph under Policy On Funded Publications */}
          <p className="text-gray-700 leading-relaxed mb-6 text-base md:text-lg">
            Aethra complies with open access mandates of all funding organizations. Authors who publish in Aethra journals retain the copyright to their published articles. Therefore, they can deposit a copy of the published manuscript to any open access repository for public archiving. The following policy is followed by Aethra for deposition of funded publications:
          </p>

          {/* Numbered List */}
          <ol className="list-decimal list-inside space-y-4 mb-8 text-gray-700 leading-relaxed text-base md:text-lg ml-4">
            <li className="mb-4">
              Authors can deposit the final published article in any other institutional, disciplinary or governmental repository. However, an acknowledgement must be given to the original source of publication, followed by a link inserted to the published article on the journal's/publisher's website.
            </li>
            <li>
              Aethra journals, indexed by PubMed Central (PMC), directly deposit the final published version of all articles to PMC immediately after publication on the journal website. In case a journal is not indexed by PubMed Central, the authors and their institutes are allowed to submit the published version of their manuscripts to PubMed Central.
            </li>
          </ol>

          {/* Archiving Policy Heading */}
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-academic-navy mb-4 mt-12">
            Archiving Policy
          </h2>

          {/* Archiving Policy Paragraph */}
          <p className="text-gray-700 leading-relaxed mb-6 text-base md:text-lg">
            Authors retain the copyright to their articles; therefore, they can self-archive their accepted manuscripts as well as published manuscripts on their personal websites, institutional repositories like PMC, or cross-institutional subject repositories like{' '}
            <Link
              href="https://arxiv.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-blue hover:text-academic-navy underline inline-flex items-center gap-1"
            >
              arXive.org
              <FiExternalLink className="w-4 h-4" />
            </Link>
            . All articles are published under the{' '}
            <Link
              href="https://creativecommons.org/licenses/by/4.0/legalcode"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-blue hover:text-academic-navy underline inline-flex items-center gap-1"
            >
              Creative Commons Attribution License
              <FiExternalLink className="w-4 h-4" />
            </Link>
            {' '}(https://creativecommons.org/licenses/by/4.0/legalcode), which permits unrestricted archiving, distribution, and reproduction in any medium, provided that the work is properly cited.
          </p>

          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            Publishers' self-archiving policies can be found on the{' '}
            <Link
              href="https://v2.sherpa.ac.uk/romeo/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-blue hover:text-academic-navy underline inline-flex items-center gap-1"
            >
              SHERPA/RoMEO database
              <FiExternalLink className="w-4 h-4" />
            </Link>
            .
          </p>

          {/* Long-Term Archiving Heading */}
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-academic-navy mb-4 mt-12">
            Long-Term Archiving Of Aethra Content
          </h2>

          {/* Long-Term Archiving Paragraph */}
          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            To ensure permanent access to our publications, Aethra has an agreement with{' '}
            <Link
              href="https://www.portico.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-blue hover:text-academic-navy underline inline-flex items-center gap-1"
            >
              Portico
              <FiExternalLink className="w-4 h-4" />
            </Link>
            {' '}to have a long-term preservation of the content published in its journals.
          </p>
        </div>
      </div>
    </div>
  );
}
