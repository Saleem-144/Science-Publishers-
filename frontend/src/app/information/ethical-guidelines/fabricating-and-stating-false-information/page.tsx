'use client';

import Link from 'next/link';
import { FiExternalLink } from 'react-icons/fi';

export default function FabricationAndFalseInformationPage() {
  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-academic-navy mb-8 pb-4 border-b-4 border-academic-gold">
          FABRICATING AND STATING FALSE INFORMATION
        </h1>

        <div className="mt-8 text-gray-700 space-y-6 leading-relaxed">
          <p>
            To ensure the scholarly integrity of every article, Bentham Open publishes post-publication notices.
            The authors of the published articles, or those who have submitted manuscripts with false information,
            or fabricated the supporting data or images, will be liable for sanctions, and their papers will be
            retracted.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy">CORRECTION NOTICE</h2>

          <p>
            Bentham Open will issue a correction notice in case of any correction or omission causing a change in
            interpretation of the article. This applies to cases including mislabeled figures, missing integral
            funding and/or other information, and authors’ competing interests.
          </p>

          <p>
            There can be major or minor errors or corrections. Major inaccuracies or omissions are changes that
            affect the clarity and integrity of an article. Minor errors do not affect the overall meaning of the text.
          </p>

          <p>
            A separate correction notice will accompany major errors or corrections. The correction notice will
            provide precise details of the mistakes and the revisions or alterations incorporated in the final version.
          </p>

          <p className="font-semibold text-academic-navy">
            To rectify a significant error or omission, the Publisher will:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Amend the online version of the article.</li>
            <li>
              Issue a separate correction notice connected to the revised version of the article.
            </li>
            <li>
              Add a footnote to the article, hyperlinked to the correction notice.
            </li>
          </ul>

          <p>
            There will be no separate correction notice for minor errors or corrections. A footnote will be added
            to the article stating that it has been modified to update readers.
          </p>

          <p>
            Any decision to issue a retraction notice for an article will be taken in accordance with COPE
            guidelines available at:
          </p>

          <p>
            <Link
              href="https://publicationethics.org/guidance/flowchart/fabricated-data-published-article"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-blue hover:underline inline-flex items-center gap-1"
            >
              https://publicationethics.org/guidance/flowchart/fabricated-data-published-article
              <FiExternalLink className="w-4 h-4" />
            </Link>
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy">
            CORRECTION NOTICE FOR ARTICLES IN EARLY VIEW
          </h2>

          <p>
            Early View articles that include errors, or are determined to violate publishing ethics guidelines
            such as multiple submission, fake claims of authorship, plagiarism, or fraudulent use of data, may
            be withdrawn from the journal. Upon withdrawal, the article files are removed and replaced with a
            PDF stating that the article has been withdrawn in accordance with Bentham Open Editorial Policies.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy">
            COPIED SUBMISSION AND REDUNDANT PUBLICATION
          </h2>

          <p>
            Bentham Open journals ensure that submitted research is original and unpublished, electronically or
            in print. Only research representing original work, or a thesis available on a preprint server and
            not published elsewhere, is considered.
          </p>

          <p>
            Bentham Open journals only consider articles not submitted elsewhere for publication. Authors who
            make simultaneous submissions may be liable to penalties. Authors must cite previous research work
            and specify how the submitted manuscript differs from earlier publications.
          </p>

          <p>
            Authors may be asked to provide references for earlier research work, published or under review.
            If authors reuse their own text from previous publications, other than the Methods section, this
            must be clearly mentioned. Consent from the copyright holder is required when reusing figures or a
            substantial amount of text from previously published work.
          </p>

          <p>
            For projects presented at conferences, extended versions of manuscripts may be considered if
            declared in the cover letter. The previous version must be cited, and necessary permissions obtained
            for unpublished or original content.
          </p>

          <p>
            Redundant publication refers to the publication of the same data more than once. This may result in
            rejection, a request to merge manuscripts, or correction of published articles. Seriously flawed or
            misleading content, including plagiarized publications, may lead to retraction and penalties.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy">
            MANIPULATION OF CITATIONS
          </h2>

          <p>
            Adding the name of an author solely to increase citations to a research work or previously published
            manuscripts may result in sanctions. Editors and reviewers should not encourage authors to add
            references solely to increase citations to their own work, associates’ work, or to journals they
            are affiliated with.
          </p>
        </div>
      </div>
    </div>
  );
}
