'use client';

import Link from 'next/link';
import { FiExternalLink } from 'react-icons/fi';

export default function PlagiarismPreventionPage() {
  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-academic-navy mb-8 pb-4 border-b-4 border-academic-gold">
          PLAGIARISM PREVENTION
        </h1>

        <div className="mt-8 text-gray-700 space-y-6 leading-relaxed">
          <p>
            Plagiarism means copying or paraphrasing another writer’s content, be it a text, a result, or an
            observation, and stating it as one’s own without citing a reference to the original source.
            Therefore, authors must acknowledge and cite references to the work of other scientists in their
            manuscripts. Authors should ensure that all sources are authentic and that there is no discrepancy
            in the manuscript content.
          </p>

          <p>
            Bentham Open is vigilant in identifying primary sources of data by using iThenticate software to
            detect overlapping and similarity of text in submitted manuscripts. iThenticate verifies content
            against a database of periodicals, internet materials, and a comprehensive article database. The
            software generates a similarity report expressed as a percentage matching the article under
            evaluation with published material. This similarity is further scrutinized for suspected plagiarism
            according to the publisher’s Editorial Policies.
          </p>

          <p>
            The generated similarity report comprises the overall percentage of reused content.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy">
            THE CREDIBILITY OF SOURCES – ACKNOWLEDGMENTS
          </h2>

          <p>
            The study conducted by an author must be original. If credible sources are referred to in the
            manuscript, all such sources must be cited. Authors are advised to use iThenticate prior to
            submission to ensure the absence of plagiarism. Proper consent must be obtained from individuals,
            and the contributions of other authors must be acknowledged.
          </p>

          <p>
            Bentham Open has specific editorial policies for authors with more than one publication. In
            accordance with these policies, authors must specify the sources of submission in their recent
            work. For further details, please refer to the Editorial Policies for Concurrent Publication or
            Simultaneous Submission at:
          </p>

          <p>
            <Link
              href="https://benthamopenscience.com/editorial-policies.php"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-blue hover:underline inline-flex items-center gap-1"
            >
              https://benthamopenscience.com/editorial-policies.php
              <FiExternalLink className="w-4 h-4" />
            </Link>
          </p>

          <p>
            Bentham Open strictly follows COPE guidelines to detect plagiarism. For further clarity, authors may
            refer to the flowcharts provided by COPE by visiting the COPE website.
          </p>
        </div>
      </div>
    </div>
  );
}











