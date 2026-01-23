'use client';

import Link from 'next/link';
import { FiExternalLink } from 'react-icons/fi';

export default function OpenAccessPolicyPage() {
  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-academic-navy mb-8 pb-4 border-b-4 border-academic-gold">
          OPEN ACCESS POLICY (GOLD OPEN ACCESS)
        </h1>

        <div className="mt-8 text-gray-700 space-y-6 leading-relaxed">
          <p>
            All peer-reviewed accepted submissions in Bentham Open meeting high research and ethical
            standards are published with free access to all. The funding agencies or institutes of the
            authors pay the Article Processing Charges (APCs) to enable open-access publication.
          </p>

          <p>
            Articles are licensed under the terms of the Creative Commons Attribution 4.0 International
            Public License (CC-BY 4.0), which permits unrestricted distribution and reproduction in any
            medium, provided the work is properly credited.
          </p>

          <p>
            <Link
              href="https://creativecommons.org/licenses/by/4.0/legalcode"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-blue hover:underline inline-flex items-center gap-1"
            >
              https://creativecommons.org/licenses/by/4.0/legalcode
              <FiExternalLink className="w-4 h-4" />
            </Link>
          </p>

          <p>
            Authors who publish in this journal retain copyright to their work. It is a condition of
            publication that manuscripts submitted to this journal have not been published and will not
            be simultaneously submitted or published elsewhere. Bentham Open meets the criteria for Open
            Access as stated by major indexing services, including the Directory of Open Access Journals
            (DOAJ).
          </p>

          <h2 className="text-2xl font-serif font-semibold text-academic-navy pt-6">
            Advantages of Open Access
          </h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              Readers can study, download, and print Open Access articles without any cost.
            </li>
            <li>
              Articles are made immediately available in open access mode without any embargo period.
            </li>
            <li>
              Reuse of published content is permitted without seeking permission, provided proper
              attribution is given.
            </li>
            <li>
              Authors retain the right to reproduce the article.
            </li>
            <li>
              Authors may incorporate the article into one or more collective works.
            </li>
            <li>
              Authors may reproduce the article as part of collective works.
            </li>
            <li>
              Authors may create and reproduce derivative works for educational purposes.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
