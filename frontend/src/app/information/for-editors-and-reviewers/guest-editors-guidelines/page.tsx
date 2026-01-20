'use client';

import Link from 'next/link';
import { FiExternalLink } from 'react-icons/fi';

export default function GuestEditorsGuidelinesPage() {
  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-academic-navy mb-8 pb-4 border-b-4 border-academic-gold">
          GUEST EDITORS GUIDELINES
        </h1>

        <div className="mt-8 text-gray-700 space-y-6 leading-relaxed">
          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            The Role of Guest Editors
          </h2>
          <p>
            Guest Editors (GE) play a pivotal role in shaping and curating Special Issues for a journal. These proposals undergo a rigorous evaluation process, where they are carefully assessed and approved by the Editor-in-Chief of the journal to ensure their suitability and alignment with the journal's standards and scope.
          </p>
          <p>
            The Guest Editor is involved in handling and managing thematic issues' submissions and is expected to submit a brief proposal to the journal in a hot and emerging field for editorial consideration. Also, the guest editor is expected to assist in coordinating the submissions and management of the issue.
          </p>
          <p>
            Thematic issues may be solely guest-edited by the Guest Editor or in coordination with another expert in the field, who the Guest Editor includes as a Co-Guest Editor.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Guidelines for Thematic/Special Issue
          </h2>
          <p>
            A Thematic/Special issue is a collection of 8 to 10 comprehensive review articles on a topic of major importance to the field. The contributors should preferably be researchers having a respectable h-index and should ideally represent various regions to ensure diversity in contributions. Since the editorial decisions on all thematic issue manuscripts' submissions are made by the Editor-in-Chief (EiC) of the journal, hence it is preferred that the GE should provide a list of 12 to 14 contributors in their proposal along with the tentative titles of the papers, in case a few manuscripts may not be found suitable by the EiC or not make it through the review process.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Preparing a Proposal
          </h2>
          <p>
            To propose a Special Issue and select an appropriate journal prior to proceeding, it is essential to familiarize oneself with the journal's specific guidelines. These guidelines can usually be found on the journal's homepage under the "Author Guidelines" section. Familiarizing the guest editor with these instructions will ensure that the proposal aligns with the journal's scope and submission requirements.
          </p>
          <p>The proposal should contain the following information:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Tentative title of the Special Issue.</li>
            <li>A one-page proposal containing information about the importance of the specific area and the proposed date of submission of the articles.</li>
            <li>Subtopics of the Thematic Issue (typically 8 to 10 articles).</li>
            <li>List of potential contributors (who should all be eminent in the field) along with their affiliations.</li>
            <li>Tentative schedule.</li>
          </ul>
          <p>
            After the guest editor has compiled all the necessary information in the proposal, they can proceed to submit the completely filled Special Issue proposal form through the designated proposal submission system. This system will streamline the submission process and ensure that the proposal reaches the appropriate editorial team for review.
          </p>
          <p>
            To submit the proposal, please visit the following link:{' '}
            <Link
              href="https://bentham.manuscriptpoint.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-blue hover:underline inline-flex items-center gap-1"
            >
              https://bentham.manuscriptpoint.com/
              <FiExternalLink className="w-4 h-4" />
            </Link>
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Inviting Authors
          </h2>
          <p>
            The Guest Editor is responsible for nominating authors for the thematic issue. Once the editor of the journal approves their credentials, the Guest Editor invites them to submit high-quality papers for the special thematic issue. These papers are expected to meet rigorous standards in terms of scientific content and presentation.
          </p>
          <p>
            Submissions for special or thematic issues undergo the same rigorous evaluation process as regular contributed submissions. Each paper is independently assessed by at least two (preferably three) eminent experts in the field.
          </p>
          <p>
            The Guest Editors have the authority to recommend revision and resubmission of manuscripts. They communicate these decisions to the editorial office. Papers will only be published if they meet the criteria of originality and demonstrate overall importance in terms of results. Generally, final editorial decisions regarding all submissions for Special/Thematic Issues are made by the Editors-in-Chief of the journal.
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>The contributors should consist of prominent researchers capable of providing an up-to-date overview of the latest advancements in the field.</li>
            <li>A Guest Editor/Co-Guest Editor is allowed to be an author or a co-author in only one manuscript. Additionally, the Guest Editor is expected to write the Introduction/Editorial for the issue.</li>
            <li>It is highly recommended to select eminent contributing authors from diverse regions.</li>
            <li>An invitation to submit a paper for a special or thematic issue does not guarantee acceptance for publication. Some submissions may undergo rejection.</li>
            <li>
              Publication in Aethra journals requires that manuscripts should neither have been previously published nor simultaneously submitted or published elsewhere. Authors must adhere to the ethical guidelines outlined at{' '}
              <Link
                href="https://benthamopen.com/publishing-ethics.php"
                target="_blank"
                rel="noopener noreferrer"
                className="text-academic-blue hover:underline inline-flex items-center gap-1"
              >
                https://benthamopen.com/publishing-ethics.php
                <FiExternalLink className="w-4 h-4" />
              </Link>
            </li>
            <li>Guest Editors should inform authors about the proposed timeline for the Special Thematic Issue, and failure to submit articles within the specified timeframe may result in rejection of the submission by the Publisher.</li>
          </ul>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Peer Review of Special / Thematic Issue Papers
          </h2>
          <p>
            Peer review of all manuscripts is undertaken by Aethra in an independent manner and independent of the Guest Editors.
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Our editorial policy requires a minimum of two (preferably three) double-blind reviews for submitted articles.</li>
            <li>Selection Criteria: A reviewer must hold a Ph.D. degree.</li>
            <li>Peer review of special/thematic issue papers will be conducted by eminent reviewers who are completely independent.</li>
            <li>Nominated reviewers by the guest editor or the authors will also not be considered for the same article; however, these reviewers may review other relevant articles as per their expertise.</li>
            <li>Final editorial decisions on all Special/Thematic Issue submissions will be decided by the Editors-in-Chief.</li>
          </ul>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Submissions Procedure
          </h2>
          <p>
            To ensure a swift and cost-effective submission process, authors are encouraged to utilize the online submission and tracking service. The complete thematic issue should be submitted online through the Manuscript Processing System (MPS) at{' '}
            <Link
              href="https://bentham.manuscriptpoint.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-blue hover:underline inline-flex items-center gap-1"
            >
              https://bentham.manuscriptpoint.com/
              <FiExternalLink className="w-4 h-4" />
            </Link>
            {' '}/ View Submission Instructions.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Publication
          </h2>
          <p>
            After the Editor accepts the papers, they are forwarded to the publisher's for further publication processes. Authors will have the opportunity to review and approve the proofs online prior to their publication on the website.
          </p>
        </div>
      </div>
    </div>
  );
}

