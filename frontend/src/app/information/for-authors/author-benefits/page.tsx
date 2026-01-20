'use client';

import Link from 'next/link';
import { FiExternalLink } from 'react-icons/fi';

export default function AuthorBenefitsPage() {
  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-academic-navy mb-8 pb-4 border-b-4 border-academic-gold">
          Author Benefits
        </h1>

        {/* Main Content */}
        <div className="prose prose-lg max-w-none">
          {/* Submit Manuscripts Easily Heading */}
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-academic-navy mb-4 mt-8">
            Submit Manuscripts Easily
          </h2>

          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            Manuscripts can be submitted easily through a simple process using the Aethra Manuscript Processing System (MPS). For more information, please visit the following link:{' '}
            <Link
              href="https://bentham.manuscriptpoint.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-blue hover:text-academic-navy underline inline-flex items-center gap-1"
            >
              https://bentham.manuscriptpoint.com
              <FiExternalLink className="w-4 h-4" />
            </Link>
          </p>

          {/* Track Your Article's Progress Heading */}
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-academic-navy mb-4 mt-12">
            Track Your Article's Progress
          </h2>

          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            Authors may track their articles at any time during the publication process via the Manuscript Processing System (MPS).
          </p>

          {/* Make your Research More Discoverable Heading */}
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-academic-navy mb-4 mt-12">
            Make your Research More Discoverable through the Various Indexing Agencies where Aethra Journals are Indexed
          </h2>

          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            Information on our journals' indexation by various indexing agencies can be viewed at{' '}
            <Link
              href="https://benthamopen.com/indexing-agencies.php"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-blue hover:text-academic-navy underline inline-flex items-center gap-1"
            >
              https://benthamopen.com/indexing-agencies.php
              <FiExternalLink className="w-4 h-4" />
            </Link>
          </p>

          {/* Utilize Multimedia Content Heading */}
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-academic-navy mb-4 mt-12">
            Utilize Multimedia Content
          </h2>

          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            The marketing team can assist authors in presenting their published research in video (podcast) format and blogs, helping to disseminate published results to a wider audience.
          </p>

          {/* Expand Your Presence Heading */}
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-academic-navy mb-4 mt-12">
            Expand Your Presence
          </h2>

          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            The Marketing team can assist authors in promoting and sharing their research through various social media platforms, thus providing an opportunity to network with both academic and industrial professionals around the world. For more information, please contact{' '}
            <Link
              href="mailto:marketing@aethrasciencepublishers.com"
              className="text-academic-blue hover:text-academic-navy underline"
            >
              marketing@aethrasciencepublishers.com
            </Link>
          </p>

          {/* Get Editorial Assistance Heading */}
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-academic-navy mb-4 mt-12">
            Get Editorial Assistance
          </h2>

          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            Our experienced editorial staff assists authors in the management, proofing, and typesetting of submitted manuscripts, prior to publication.
          </p>

          {/* Obtain Article Reprints Heading */}
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-academic-navy mb-4 mt-12">
            Obtain Article Reprints At Competitive Rates
          </h2>

          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            Aethra provides high-quality article reprints, ideal for presentation to authors' colleagues and collaborators, at a very reasonable cost.
          </p>

          {/* Maximize Visibility of Articles via Kudos Heading */}
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-academic-navy mb-4 mt-12">
            Maximize Visibility of Articles via Kudos
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6 text-base md:text-lg">
            Aethra has collaborated with{' '}
            <Link
              href="https://www.growkudos.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-blue hover:text-academic-navy underline inline-flex items-center gap-1"
            >
              Kudos (www.growkudos.com)
              <FiExternalLink className="w-4 h-4" />
            </Link>
            {' '}to increase the portfolio of its services for the authors. Kudos is a web-based service that helps researchers maximize the visibility, usage, and citations for published articles. We provide the article title, its online link (DOI), and authors' contact information to Kudos. Kudos will contact them to register and use this newly offered service to a selected group of authors to help increase the readership and citations of their articles.
          </p>

          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            For more information, please visit the following link:{' '}
            <Link
              href="https://benthamscience.com/kudos"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-blue hover:text-academic-navy underline inline-flex items-center gap-1"
            >
              https://benthamscience.com/kudos
              <FiExternalLink className="w-4 h-4" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
