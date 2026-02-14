'use client';
import Link from 'next/link';
import { FiExternalLink } from 'react-icons/fi';

export default function ConflictOfInterestPage() {
  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-academic-navy mb-8 pb-4 border-b-4 border-academic-gold">
          CONFLICT OF INTEREST
        </h1>

        <div className="mt-8 text-gray-700 space-y-6 leading-relaxed">
          <h2 className="text-2xl font-serif font-bold text-academic-navy">AUTHORS</h2>

          <p>
            All potential conflicts of interest (competing interests) that could have a direct or indirect influence
            on the work must be disclosed by the authors. Even if an author does not have a conflict, disclosing
            affiliations and interests allows for a more comprehensive and open approach, which leads to a more
            accurate and objective evaluation of the work. Conflicts of interest, whether genuine or imagined, are a
            perspective to which the readers are entitled.
          </p>

          <p>
            The publication of a conflict statement in the article itself, as well as the submission of the conflict
            disclosure form, is required for all types of papers. It is not necessarily the case that a monetary
            relationship with examination support or funding for counseling work is inappropriate. Even if the authors
            do not have any conflict of interest, they still need to provide a confirmation statement in their
            manuscripts, i.e., “The author(s) confirm(s) that there is no conflict of interest related to the
            manuscript.”
          </p>

          <p>
            The following are some examples of potential conflicts of interest that are directly or indirectly related
            to the research:
          </p>

          <p className="font-semibold text-academic-navy">Financial competing interests include (but are not limited to):</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Type of support/grant number</li>
            <li>Institutional Conflicts of Interest</li>
            <li>Funds received by the author</li>
            <li>Funds received by the institution</li>
            <li>Travel allowances for the research</li>
            <li>Funds received for article preparation and reviewing</li>
            <li>Funds for conducting review activities</li>
            <li>Support provided for article writing assistance, for drugs, equipment, etc</li>
            <li>Paid lectures</li>
            <li>Pending fund or grant</li>
          </ul>

          <p>
            Financial conflicts of interest can be personal as well as institutional. A personal conflict of interest
            occurs when a contributor involved in the publication process either receives an amount of money or expects
            to receive some financial help (including any other financial benefits such as patents or stocks, gifts, or
            services) that may impact the work related to a specific publication. More importantly, in academic
            research, such financial relationships can lead to institutional conflicts of interest (COIs) because the
            economic interests of the institution or institutional representatives may unsuitably affect the
            decision-making process.
          </p>

          <p>
            An institutional conflict of interest arises in a situation when the financial interests of an institution
            or any institutional official (e.g., investments held by the university in a company) have the potential to
            unduly influence the research conducted by its employees or students, or pose an unacceptable risk to human
            subjects. Such conflicts usually arise in a state of affairs where a research project directly offers
            assistance or a benefit to an external entity via evaluation, validation, trial, or test of an invention,
            product, drug, service, or technology, and the institution holds a financial interest with the external
            entity. Such financial interests incorporate but are not limited to the receipt of licensing payments or
            royalties from the external entity or ownership interest with the external entity. When human subjects are
            involved in any research project, and the institution supports such a financial interest, the conflict of
            interest is speculated to be unreasonable.
          </p>

          <p className="font-semibold text-academic-navy">
            Non-financial competing interests include (but are not limited to):
          </p>
          <p>
            In addition, interests other than monetary and any funding (non-financial interests) should be declared if
            they are relevant to readers. Personal relationships or conflicting interests directly or indirectly related
            to research, as well as professional interests or personal opinions that may impact your research, are
            examples of these.
          </p>

          <p className="font-semibold text-academic-navy">Intellectual Property</p>
          <p>
            Intellectual property, in basic terms, refers to any intangible property that is the result of creativity,
            such as patents, copyrights, etc. Similarly, this section seeks to know about copyright and patent (licensed
            patent, pending or issued) and any payment received for intellectual property, such as:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Patent</li>
            <li>Licensed Patent</li>
            <li>Issued Patent</li>
            <li>Pending Patent</li>
            <li>Royalties</li>
            <li>Licensee</li>
            <li>Remarks</li>
          </ul>

          <h2 className="text-2xl font-serif font-bold text-academic-navy">DISCLOSURE STATEMENT</h2>

          <p>
            All conflict of interest disclosure forms are collected by the corresponding author. It is sufficient for
            the corresponding author to sign the disclosure form on behalf of all authors in author collaborations when
            legal agreements for representation allow it. The templates of the form can be found here.
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              <Link
                href="#"
                className="text-academic-blue hover:underline inline-flex items-center gap-1"
              >
                Disclosure form
                <FiExternalLink className="w-4 h-4" />
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-academic-blue hover:underline inline-flex items-center gap-1"
              >
                ICMJE disclosure form
                <FiExternalLink className="w-4 h-4" />
              </Link>
            </li>
          </ul>

          <p>
            Before the reference list, the corresponding author will include a summary statement in the text of the
            article that reflects what is reported in the potential conflict of interest disclosure form(s). Author(s)
            may declare(s) names of reviewers who they think might have a potential conflict of interest; therefore, the
            Editorial Office could avoid inviting such reviewers for an unbiased opinion.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy">UNDISCLOSED CONFLICT OF INTEREST</h2>

          <p>
            Undisclosed conflict of interest cases before or after the publication of an article are dealt with as per
            the guidelines of COPE.
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              <Link
                href="#"
                className="text-academic-blue hover:underline inline-flex items-center gap-1"
              >
                Undisclosed conflict of interest in a submitted article (View COPE guidelines)
                <FiExternalLink className="w-4 h-4" />
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-academic-blue hover:underline inline-flex items-center gap-1"
              >
                Undisclosed conflict of interest in a published article (View COPE guidelines)
                <FiExternalLink className="w-4 h-4" />
              </Link>
            </li>
          </ul>

          <p>
            For more information on COIs, see the guidance from the ICMJE.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy">PEER REVIEWERS</h2>

          <p>
            Bentham Open tries to conduct a transparent peer-review process with the help of reviewers who do not have
            any conflict of interest with the authors. In this connection, reviewers who belong to the same institute
            or countries as authors are not invited to review manuscripts. However, it is not possible for the Editorial
            Office to be aware of all competing interests; therefore, it is expected from authors to submit:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              List of reviewers who they think have a conflict of interest to ensure a transparent and unbiased review
              process.
            </li>
          </ul>

          <p className="font-semibold text-academic-navy">The Editorial Office expects reviewers:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Not to accept manuscript review requests if they have any potential conflict of interest and inform the
              Editorial Office accordingly.
            </li>
            <li>
              To decline review requests if they have recently published or submitted an article with any of the authors
              listed in the manuscript.
            </li>
            <li>
              To inform the Editorial Office if they have any personal relationship with the authors or work in the same
              institutes as of authors, which could affect the review transparency.
            </li>
            <li>
              To abstain from reviewing and informing the Editorial Office/Editor-in-Chief/Handling Editors about any
              scientific misconduct or fraud, plagiarism, conflict of interest, or any other unethical behavior related
              to the manuscript.
            </li>
          </ul>

          <p>
            During the submission of review comments, reviewers are asked to reconfirm that they do not have any conflict
            of interest related to the article. After confirming the below statement, they can submit their comments.
          </p>

          <p className="italic">
            “I hereby confirm that I don’t have any conflict of interest related to the manuscript.”
          </p>

          <p>
            If, however, there are still any remaining interests, then reviewers must mention those in the
            ‘Confidential’ section of the review form.
          </p>

          <p>
            Reviewers are not encouraged to contact authors directly regarding any of their conflicts of interest. Peer
            reviewers should follow journals’ policies in situations they consider to represent a conflict.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy">UNDISCLOSED CONFLICT OF INTEREST</h2>

          <p>
            If reviewers intentionally do not disclose any conflict of interest, they will be blacklisted for any future
            peer-reviewing activity of the journal.
          </p>

          <p>
            The Editorial Office always ensures that an author, if added after peer review activity of a manuscript, is
            not part of the reviewers’ list who have conducted a peer review of the same manuscript.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy">EDITORS</h2>

          <p>
            Editors must not review submitted manuscripts if they have any personal, professional or financial
            involvement/conflict of interest with the authors of the manuscript. Every participant involved in the peer
            review process, including editorial board members, reviewers, and editors, must declare any potential
            conflicts of interest to ensure a transparent and unbiased review activity.
          </p>

          <p>
            Editors-in-Chief or Editors who are responsible for the initial and final decision should recuse themselves
            to review or take decisions on any manuscript that is written by authors affiliated with the same institute
            as of editor, or if they have been a family member, competitor, collaborator, or have published any
            manuscript in the last 3 years with the authors associated with the manuscript. They can however nominate
            someone else on the Board who could provide a neutral opinion on the manuscript.
          </p>

          <p>
            The Editorial office recommends editors follow COPE and WAME guidelines to process manuscripts, which involve
            their personal relationships.
          </p>

          <p className="font-semibold text-academic-navy">Manuscripts submission by an Editor/Editor-in-Chief</p>
          <p>
            The initial and final decision on the manuscripts submitted by an Editor/Editor-in-Chief will be taken by
            any other member of the Board. The Editorial Office will identify members who do not have any potential
            conflict of interest with the Editor or Editor-in-Chief.
          </p>
        </div>
      </div>
    </div>
  );
}













