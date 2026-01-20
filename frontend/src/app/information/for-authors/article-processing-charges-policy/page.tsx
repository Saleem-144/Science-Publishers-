'use client';

import Link from 'next/link';
import { FiExternalLink } from 'react-icons/fi';

export default function ArticleProcessingChargesPolicyPage() {
  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-academic-navy mb-8 pb-4 border-b-4 border-academic-gold">
          Article Processing Charges Policy
        </h1>

        {/* Main Content */}
        <div className="prose prose-lg max-w-none">
          {/* First Paragraph */}
          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            Aethra is committed to disseminating research and scholarly publications as widely as possible. In this respect, it supports the principle that 'the results of research that have been publicly funded should be freely accessible in the public domain' and therefore it encourages researchers to make their research available through open access (OA).
          </p>

          {/* Second Paragraph */}
          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            Open-access publishing is not free of cost. To facilitate open access, Aethra journals partly defray the expenses of peer review, journal production, and online hosting and archiving from authors and their research sponsors by charging a publication fee for each article they publish. The fee varies by journal. Prices are clearly displayed on our Article Processing Charges (APC) page and on journal homepages.
          </p>

          {/* Special Discounts Heading */}
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-academic-navy mb-4 mt-12">
            The following special discounts are offered to authors and editorial board members:
          </h2>

          {/* Discount List */}
          <ul className="list-disc list-inside space-y-4 mb-8 text-gray-700 leading-relaxed text-base md:text-lg ml-4">
            <li className="mb-4">
              Authors from Aethra Member Institutes are entitled to up to a 20% discount on their article processing fees.
            </li>
            <li>
              All editors and editorial board members of Aethra journals are entitled to publish their articles free of charge.
            </li>
          </ul>

          {/* Additional Paragraph */}
          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            Waivers and additional discount requests are decided on the basis of the author's country of origin and the quality of the submitted article. Editors and reviewers have no knowledge of whether authors are able to pay; decisions to publish are only based on meeting the editorial criteria.
          </p>

          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            Aethra does not impose submission charges.
          </p>

          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            Once the paper is accepted for publication, the author will receive an electronic invoice via email.
          </p>

          {/* Waiver Policy Heading */}
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-academic-navy mb-4 mt-12">
            Waiver Policy
          </h2>

          {/* Waiver Policy Paragraph */}
          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            Aethra offers a discount of 50% on the publication fee for manuscripts of all corresponding authors who reside in countries that are categorized as low-income economies by the World Bank. To see if you qualify for the discount, please refer to the complete list of these countries by{' '}
            <Link
              href="https://datahelpdesk.worldbank.org/knowledgebase/articles/906519-world-bank-country-and-lending-groups"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-blue hover:text-academic-navy underline inline-flex items-center gap-1"
            >
              clicking here
              <FiExternalLink className="w-4 h-4" />
            </Link>
            .
          </p>

          {/* Promotional Services Heading */}
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-academic-navy mb-4 mt-12">
            Promotional Services
          </h2>

          {/* Promotional Services Paragraph */}
          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            Aethra encourages authors, institutions, and organizations to make use of various promotional opportunities for their publications, products, and services.
          </p>

          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            For more information, please view the 'Promotional Services'.
          </p>

          {/* Refund Policy Heading */}
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-academic-navy mb-4 mt-12">
            Refund Policy
          </h2>

          {/* Refund Policy Paragraph */}
          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            Kindly remember that requests for waivers or discounts should be made during the initial submission process, not after an article has been accepted. This process does not involve editors, and the ability to pay does not influence editorial decisions. Payment is not required unless and until the author's article is accepted. Articles that have been accepted will not be published until payment has been received. Aethra does not refund the publication fee once it has been paid.
          </p>

          {/* Publication Fee Refund Policy Heading */}
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-academic-navy mb-4 mt-12">
            Publication Fee Refund Policy
          </h2>

          {/* Prior to Publication Heading */}
          <h3 className="text-xl md:text-2xl font-serif font-semibold text-academic-navy mb-3 mt-8">
            Prior to Publication
          </h3>

          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            If Aethra believes that the article should not be published, we reserve the right to decline publication and refund the publication fee.
          </p>

          {/* After Publication Heading */}
          <h3 className="text-xl md:text-2xl font-serif font-semibold text-academic-navy mb-3 mt-8">
            After Publication
          </h3>

          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            If Aethra genuinely believes that the article should be retracted or removed from our website, for example, due to a breach of author warranties, we are under no obligation to refund the publication fee. The publication fee will not be refunded when articles are retracted due to author error or misconduct.
          </p>

          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            Delays caused by editorial decisions or author changes are a normal part of the publishing process.
          </p>
        </div>
      </div>
    </div>
  );
}
