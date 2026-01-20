'use client';

import Link from 'next/link';
import { FiExternalLink } from 'react-icons/fi';

export default function PeerReviewWorkflowPage() {
  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-academic-navy mb-8 pb-4 border-b-4 border-academic-gold">
          PEER REVIEW WORKFLOW
        </h1>

        <div className="mt-8 text-gray-700 space-y-6 leading-relaxed">
          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Selection of Reviewers
          </h2>
          <p>
            All manuscripts submitted to Aethra (AO) are peer-reviewed by members of the journals' editorial board, expert reviewers, and the editor-in-chief. Only those manuscripts which successfully meet our quality requirements are published.
          </p>
          <p>
            External reviewers are selected from different international Databases of peer reviewed scientific literature, depending on the field of expertise relevant to the articles' scope. Members of the editorial board and Aethra's reviewer panel are also invited to share their opinion.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Peer Review Invitation
          </h2>
          <p>
            Manuscripts are forwarded to editors for evaluation initially and subsequently to independent external reviewers to check if the research work presented in the manuscript:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Falls within the scope of the journal and</li>
            <li>Meets the editorial criteria of AO in terms of originality and quality.</li>
          </ul>
          <p>
            Regarding the first point, editors may recommend the acceptance or rejection of a manuscript by conducting the scope review themselves, based on their knowledge and experience, or they may take assistance and advice from other experts in the field.
          </p>
          <p>
            Regarding the second point, Aethra conducts independent peer review on all papers submitted for publication. Before sending any manuscript to reviewers, Aethra seeks consent from potential reviewers and editorial board members about their availability and willingness to review the paper. Correspondence between the members of the journal's editorial office and the reviewers is kept confidential. The reviewers are asked to:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Accept or decline review invitation based on the title and abstract.</li>
            <li>
              Suggest alternative reviewers (optional) if the reviewers decline the review invitation based on their field of expertise not being directly relevant to the article scope, their busy schedule, or any potential conflict of interest with the authors.
            </li>
          </ul>
          <p>
            Access to the full-text version of the manuscript is provided to the agreed reviewers via our online system ({' '}
            <Link
              href="https://bentham.manuscriptpoint.com/manuals/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-blue hover:underline inline-flex items-center gap-1"
            >
              https://bentham.manuscriptpoint.com/manuals/index.html
              <FiExternalLink className="w-4 h-4" />
            </Link>
            {' '}). To use our online peer-review system module, please read the reviewer's manual or watch the tutorial.
          </p>
          <p>
            Aethra follows a double-blind peer review process where the identities of both the reviewer and author are kept undisclosed to each other, ensuring anonymity and maintaining confidentiality throughout the entire review procedure. The anonymity of reviewers ensures an objective and unbiased assessment of the manuscript by the reviewers.
          </p>
          <p>
            After receiving the review report of the manuscript by at least two independent experts, in addition to the views of the editor, the decision is relayed to the authors via our Manuscript Processing System (MPS), which may be categorized as:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Requires minor changes</li>
            <li>Requires major changes</li>
            <li>Rejected with no resubmission</li>
          </ul>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Purpose of a Review
          </h2>
          <p>
            A review report provides the editor-in-chief/senior editor with an expert opinion on the quality of the manuscript under consideration. It also supplies authors with explicit feedback on how to improve their papers to make them acceptable for publication in the journal. Remarks that may help improve the quality of the manuscript are forwarded to the authors for their consideration.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Selfless Peer Review
          </h2>
          <p>
            AO aims to facilitate objective peer review free of self-interested bias. It is highly recommended to avoid self-promotion in any form, including the following:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              Potentially competitive work, whether in progress or submitted elsewhere, must not impact the timeliness of the manuscript or editorial assessment.
            </li>
            <li>
              All requests for particular citations must be relevant to the submission. During peer-review, referencing citations of the authors' own or his/her coworkers' publications must be avoided.
            </li>
            <li>
              Unless approved by the publisher, reference to articles with actual, potential, or perceived conflict of interest must be avoided. Competing interests guidelines must be followed.
            </li>
          </ul>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            How to Review
          </h2>
          <p>
            Reviewers are expected to provide advice on the following points in their review reports (depending on the type of article):
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Does the article lie within the scope of the journal?</li>
            <li>Is the manuscript written comprehensively? If not, how could it be improved?</li>
            <li>Have adequate proofs been provided for the declaration?</li>
            <li>Is this a new/ original contribution of significance?</li>
            <li>
              Does the paper offer enough details of its methodology to reproduce the experiments? In the case of experimentation on human subjects, has informed consent been taken?
            </li>
            <li>
              Has the author provided the approval from the local institutional review board? Or does the manuscript conform to the Helsinki Declaration on human experiments in the "Methods" section?
            </li>
            <li>
              Have the authors used the Reporting Guidelines, i.e., CONSORT, STROBE, PRISMA, STARD, CARE, EQUATOR, in their studies (if applicable)?
            </li>
            <li>
              Has the author obtained the approval of the institutional ethics committee regarding experimentation on animals or other species? Is the name of the species mentioned in the article's title, abstract, and methods section?
            </li>
            <li>
              Aethra encourages authors to publish detailed protocols as supporting information online. Does any particular method used in the manuscript warrant such a protocol?
            </li>
            <li>Are figures/illustrations of appropriate quality?</li>
            <li>Is the sample size adequate for the study?</li>
            <li>What are the main findings of the paper?</li>
            <li>
              Is relevant work of other authors in the field appropriately acknowledged and comprehensive references given to the previous relevant literature?
            </li>
          </ul>
          <p>
            During the review process, if reviewers find any scientific misconduct or fraud, plagiarism, conflict of interest, or any other unethical behavior related to the manuscript, they are expected to inform the editorial office immediately. Similarly, if they think that they are unable to review a certain section of the manuscript, then the editorial office should also be informed.
          </p>
          <p>
            Reviewers are required to rate manuscripts on each of the above-mentioned points, along with their remarks for authors and editors. For further details, please review a sample evaluation form [Template Evaluation Form]. The comments of the reviewers are conveyed to the authors, and they are given an opportunity to respond to them. In case the author does not agree with the comments of the reviewer, then the Editor-in-Chief may decide on the matter, or the manuscript may be sent to additional reviewers for a decision. The identity of the reviewers is always kept strictly confidential.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Use of Generative AI and AI-assisted Technologies in the Peer Review Process
          </h2>
          <p>
            Since the use of AI technology has increased, it has brought its own challenges regarding the originality of the review of submitted manuscripts. Aethra has been striving to improve its policies accordingly. With time, we will continue to update our policies to support our reviewers, authors, and editors.
          </p>
          <p>
            The quality of the peer review of submitted articles has been our top priority. The reviewers are advised not to use AI technologies or any other related assisting resources to generate review reports that could compromise the integrity and confidentiality of the reports.
          </p>
          <p>
            Publisher recommends that reviewers go through COPE Ethical Guidelines to provide quality, unbiased review reports. Please read complete guidelines on Committee on Publication Ethics available online.
          </p>
          <p>
            AO recommends its reviewers to strictly adhere to COPE guidelines to comply with the Principles of Transparency and Best Practice in Scholarly Publishing. Please also refer to the COPE's most popular resources, i.e., core practices, flowcharts and cases (available at{' '}
            <Link
              href="https://publicationethics.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-blue hover:underline inline-flex items-center gap-1"
            >
              COPE's website
              <FiExternalLink className="w-4 h-4" />
            </Link>
            {' '}).
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Confidentiality
          </h2>
          <p>
            The peer-review of a manuscript is a confidential process. Reviewers should keep the whole process completely confidential. They should consult the EIC/senior editor and take permission before consulting another colleague for help in the peer-review of the submitted manuscript.
          </p>
          <p>
            Reviewers should not disclose any information whatsoever to anyone before the publication of the manuscript.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Privileged Information / Transparency
          </h2>
          <p>
            Unpublished materials disclosed in a submitted manuscript should not be used in an editor's or reviewer's own research without the express written consent of the author. Privileged information or ideas obtained through peer review must be kept confidential and not used for personal advantage.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Peer Review Manipulation
          </h2>
          <p>
            Peer-review manipulations are dealt with as per the guidelines given by COPE.
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Peer-review manipulation suspected during the peer-review process [VIEW FLOW CHART].</li>
            <li>Peer-review manipulation suspected after publication [VIEW FLOW CHART].</li>
          </ul>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Review Time
          </h2>
          <p>
            The agreed reviewers are expected to provide their reports within 2-4 weeks since a prompt review leads to the timely publication of a manuscript, which is beneficial not only to the authors but also to the scientific community. However, a reviewer who needs extra time for reviewing should consult the editorial office.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Changes in Review Reports
          </h2>
          <p>
            The editorial staff relays the comments of the reviewers on behalf of the editor-in-chief/handling editor. The review reports are edited by the editor-in-chief/handling editor if the comments contain confidential information or are written in a language not suitable for scholarly communication. Reviewers should include such comments in the confidential section of the review form, which is intended to be read by the editors only.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Conflict of Interest
          </h2>
          <p>
            Aethra respects requests for not having the manuscripts peer-reviewed by those experts who may have a competing interest with the author(s) of a submitted manuscript. It is not possible for editors to be aware of all competing interests; therefore, we expect that reviewers would inform the editor-in-chief/handling editor/ editorial manager if they notice any potential competing interest during review of a manuscript; reviewers are not encouraged to contact authors directly regarding any of their conflict of interest. Peer reviewers should follow journals' policies in situations they consider to represent a conflict to reviewing. If no guidance is provided, they should inform the editorial manager in case: they work at the same institution as any of the authors (or will be joining that institution or are applying for a job there), they are or have been recent (e.g., within the past 3 years) mentors, mentees, close collaborators or joint grant holders, and they have a close personal relationship with any of the authors. Reviewers are asked to re-confirm that they do not have any conflict of interest with the authors of the submitted manuscript at the time of review completion.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Editorial Decision
          </h2>
          <p>
            The authors are usually requested to resubmit the revised paper within 15 days, and it is then returned to the reviewers for further evaluation. The publishers normally allow one round of revision, and in exceptional cases, a second round of revision may be allowed. If further revision is needed, then the manuscript is rejected, and the author is requested to resubmit the manuscript for fresh processing.
          </p>
          <p>
            The final decision regarding acceptance or rejection is made by the editor-in-chief, depending on his/her assessment of the revisions recommended by the referees and about the overall quality of the revised manuscript. In rare cases, manuscripts recommended for publication by the referees may be rejected in the final assessment by the editor-in-chief.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Transferred Articles
          </h2>
          <p>
            If a manuscript is rejected due to its unsuitability according to the aims and scope of a particular journal, then it may be transferred to another journal (with the consent of the author) that has a similar scope as the manuscript. For further details, please visit:{' '}
            <Link
              href="https://benthamopenscience.com/manuscript-transfer-facility.php"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-blue hover:underline inline-flex items-center gap-1"
            >
              https://benthamopenscience.com/manuscript-transfer-facility.php
              <FiExternalLink className="w-4 h-4" />
            </Link>
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Appeals and Complaints
          </h2>
          <p>
            Generally, editorial decisions by Aethra are not reverted. However, authors who think that their manuscript was rejected due to a misunderstanding or mistake may seek an explanation for the decision. Appeals must give sound reasoning and compelling evidence against the criticism raised in the rejection letter. A difference of opinion regarding the interest, novelty, or suitability of the manuscript for the journal will not be considered an appeal. The editor-in-chief and other relevant editors will consider the appeal, and the decision thereafter taken by the journal will be deemed final. Acceptance of the manuscript is not guaranteed even if the journal agrees to reconsider the manuscript, and the reconsideration process may involve previous or new reviewers or editors and substantive revision.
          </p>
          <p>
            Complaints on ethical practices or academic misconduct will be handled according to the processes outlined in our academic misconduct guidelines.
          </p>
          <p>
            Authors who wish to make a complaint should refer to the editor-in-chief of the journal concerned by contacting the editorial office. Complaints to the publisher may be emailed to info@aethra.net. Aethra sends an acknowledgment to the complainant and undertakes appropriate action. For matters involving the editor-in-chief of a journal, Aethra seeks the opinion of the editor-in-chief and suitable action is then taken.
          </p>
          <p>
            The complete peer-review history of a reviewer is maintained on our Online Manuscript Processing System. Each review is awarded some points, which can be redeemed by reviewers whenever they require.
          </p>
          <p>
            Aethra has also made its publication and review information available on Publons. Publons provides formal recognition to our peer reviewers by producing a verified record of their peer reviews and editorial contributions to academic journals. Learn more about Publons here:{' '}
            <Link
              href="https://publons.com/publisher/219/bentham-science-publishers"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-blue hover:underline inline-flex items-center gap-1"
            >
              https://publons.com/publisher/219/bentham-science-publishers
              <FiExternalLink className="w-4 h-4" />
            </Link>
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Become a Reviewer
          </h2>
          <p>For joining our reviewers' panel, the candidates must have:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Ph.D. degree and research experience in the main subject area of the journal and the articles under review</li>
            <li>Reviewed manuscripts earlier</li>
            <li>Published manuscripts that are very well-cited by the research community.</li>
          </ul>
          <p>
            Those willing to join our reviewers' panel are expected to submit their details at (REVIEWER REGISTRATION FORM)
          </p>
        </div>
      </div>
    </div>
  );
}

