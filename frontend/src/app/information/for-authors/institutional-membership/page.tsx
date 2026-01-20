'use client';

import Link from 'next/link';

export default function InstitutionalMembershipPage() {
  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-academic-navy mb-8 pb-4 border-b-4 border-academic-gold">
          INSTITUTIONAL MEMBERSHIPS
        </h1>

        {/* Main Content */}
        <div className="prose prose-lg max-w-none">
          {/* First Paragraph */}
          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            Aethra offers 'Complimentary Membership' to International R & D organizations, institutes and universities. Institutional Membership entitles authors from different member institutes to a special discount of 20% on the open access publication fee on their submissions to Aethra journals. Additionally, input and contributions from associate institutes would also be recognized and a link to their respective website would be displayed on the Aethra membership page. The member institution's logo will also be published on the same page.
          </p>

          {/* Benefits Heading */}
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-academic-navy mb-4 mt-12">
            Aethra Memberships provide the following advantages
          </h2>

          {/* Benefits List */}
          <ul className="list-disc list-inside space-y-4 mb-8 text-gray-700 leading-relaxed text-base md:text-lg ml-4">
            <li className="mb-4">
              Possibility to explore 13 distinct disciplines by means of publishing in Open Access journals.
            </li>
            <li className="mb-4">
              Author(s) own the copyrights to their published articles.
            </li>
            <li className="mb-4">
              Unbound right to read, download or print open access articles.
            </li>
            <li className="mb-4">
              Extensive peer-review of submitted articles.
            </li>
            <li className="mb-4">
              Access to a range of articles in printed form such as short communications, full length research articles, reviews or conference proceedings.
            </li>
            <li className="mb-4">
              Simple steps from submission to publication, leading to fast turn-around.
            </li>
            <li>
              Possibility of archiving published articles.
            </li>
          </ul>

          {/* Validity Paragraph */}
          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            The complimentary membership is valid for a span of one year and upon completion of the prescribed period, it is renewed by mutual interest and agreement.
          </p>

          {/* Contact Paragraph */}
          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            If you find the above mentioned details relevant, then kindly contact us via e-mail at{' '}
            <Link
              href="mailto:membership@aethrasciencepublishers.com"
              className="text-academic-blue hover:text-academic-navy underline"
            >
              membership@aethrasciencepublishers.com
            </Link>
            {' '}or{' '}
            <Link
              href="mailto:oa@aethrasciencepublishers.com"
              className="text-academic-blue hover:text-academic-navy underline"
            >
              oa@aethrasciencepublishers.com
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
