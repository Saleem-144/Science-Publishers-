'use client';

import Link from 'next/link';
import { FiExternalLink } from 'react-icons/fi';

export default function GuidelinesForReviewersPage() {
  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-academic-navy mb-8 pb-4 border-b-4 border-academic-gold">
          GUIDELINES FOR REVIEWERS
        </h1>

        <div className="mt-8 text-gray-700 space-y-6 leading-relaxed">
          <p>
            Manuscripts submitted for publication in Aethra journals are subjected to double blind peer-review. The identities of both the reviewer and author are kept undisclosed to each other, ensuring anonymity and maintaining confidentiality throughout the entire review procedure. The anonymity of reviewers ensures an objective and unbiased assessment of the manuscript by the reviewers. Publishers recommend that reviewers review COPE Ethical Guidelines to provide quality unbiased review reports. Please read the complete guidelines at the Committee on Publication Ethics available at{' '}
            <Link
              href="https://publicationethics.org/resources/guidelines/cope-ethical-guidelines-peer-reviewers"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-blue hover:underline inline-flex items-center gap-1"
            >
              https://publicationethics.org/resources/guidelines/cope-ethical-guidelines-peer-reviewers
              <FiExternalLink className="w-4 h-4" />
            </Link>
            .
          </p>

          <p>
            Reviewers are advised to consider the following important aspects of a manuscript when conducting the review.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            1. Reporting of Original Results
          </h2>
          <p>
            The results reported in the manuscript must be original and authentic work of the authors. They should be devoid of any plagiarism and the material should not have been published earlier. Studies which report some reproduced results, for example a new clinical trial, may also be considered for publication.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            2. Experiments and Analyses
          </h2>
          <p>
            Experiments and other analyses should meet the recognized technical standards and must be described systematically. The research presented in a manuscript should facilitate in reaching accurate conclusions from the statistics. Methods and experiments as well as reagents should be documented in detail.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            3. Interpretation of Results
          </h2>
          <p>
            Authors should present and interpret the results and conclusions in an appropriate and comprehensive manner, clearly explaining the results and outcomes of their study. Incomplete interpretation of results may result in rejection of the manuscript.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            4. Language of Composition
          </h2>
          <p>
            The manuscript should be written in English in a clear, direct and active style, free from grammatical errors and other linguistic inconsistencies. All pages should be numbered sequentially, facilitating the reviewing and editing of the manuscript. Authors should seek professional assistance for correction of grammatical, scientific and typographical errors before submission of the revised version of the article for publication. Professional editing services may also be sought by the team available at Aethra at an extra charge.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            5. Experiments involving Humans and Animals
          </h2>
          <p>
            The research must meet the highest applicable international standards of the ethics of experimentation and research integrity. A brief description on ethical guidelines is given in the 'Instructions for Authors' of every journal published by Aethra.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            6. Reporting guidelines (e.g. CONSORT, MIAME, STROBE, EQUATOR) and Community Standards for Data
          </h2>
          <p>
            The manuscript should adhere to suitable reporting guidelines (e.g. CONSORT, MIAME, STROBE, EQUATOR) and community standards for data availability. Aethra seeks to disseminate research and therefore stipulates that the public deposition of data is as per the followed standards (for example gene sequences, microarray expression data, and structural studies). Other similar standards that may be applicable should also be followed.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Important Points To Consider
          </h2>
          <p>
            Reviewers are expected to provide advice on the following points in their review reports:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Is the manuscript written comprehensively enough to be understandable? If not, how could it be improved?</li>
            <li>Have adequate proofs been provided for the declarations?</li>
            <li>Have the authors addressed the previous findings fairly?</li>
            <li>Does the paper offer enough details of its methodology to reproduce the experiments?</li>
            <li>
              Aethra encourages authors to publish detailed protocols as supporting information online. Do any particular methods used in the manuscript warrant such a protocol?
            </li>
          </ul>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Use of Generative AI and AI-assisted Technologies in the Peer Review Process
          </h2>
          <p>
            Since the use of AI technology has increased, it has brought its own challenges regarding the originality of the review of submitted manuscripts. Aethra has been striving to improve its policies accordingly. With time, we will continue to update our policies to support our reviewers, authors, and editors.
          </p>
          <p>
            The quality of the peer review of submitted articles has been our top priority. The reviewers are advised not to use AI technologies or any other related assisting resources to generate review reports that could compromise the integrity and confidentiality of the reports.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Privacy Statement
          </h2>
          <p>
            The peer-review of a manuscript is a confidential process. Reviewers should keep the whole process completely confidential. They should consult the EiC/Senior Editor and obtain permission before consulting another colleague for help in the peer-review of the submitted manuscript.
          </p>
          <p>
            Reviewers should not disclose any information whatsoever to anyone before publication of the manuscript.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Prompt Review
          </h2>
          <p>
            The reviewers should provide their reports in a timely fashion, since a prompt review leads to the timely publication of a manuscript. This is beneficial not only for the authors but for the scientific community as well.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Discount Offer
          </h2>
          <p>
            Reviewers who complete their reviews within the deadline will receive 50 points. Accumulated points can be used for purchasing any Aethra content or availing any other services offered within the next 12 months.
          </p>
        </div>
      </div>
    </div>
  );
}

