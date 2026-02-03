'use client';

import Link from 'next/link';
import { FiExternalLink } from 'react-icons/fi';

export default function ResearchMisconductPage() {
  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-academic-navy mb-8 pb-4 border-b-4 border-academic-gold">
          RESEARCH MISCONDUCT
        </h1>

        <div className="mt-8 text-gray-700 space-y-6 leading-relaxed">
          <p>
            Scholarly misconduct is defined and divided into eight basic types. The measures to avoid and address
            these issues are discussed below. The suggested actions for individual issues, in light of
            recommendations by COPE, are outlined here.
          </p>

          <p>
            The suggested protocols for each issue can be viewed by clicking the relevant links. Flowcharts are
            provided under each category to indicate how ethical issues in a submitted manuscript or a published
            article are handled.
          </p>

          <p>
            Bentham Open follows a systematic protocol to deal with allegations of misconduct before publication
            or after publication. The sequence of actions is provided in flowcharts and aligns with the
            recommendations of the Committee on Publication Ethics (COPE).
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy">ETHICS ADVISORY PANEL</h2>

          <p>To deal with issues of misconduct, Bentham Open has an Ethics Advisory Panel consisting of:</p>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              A team of senior researchers and experts associated with Bentham Open as Editors in different
              fields.
            </li>
            <li>
              A team of experts in legal and corporate affairs who advise on issues requiring legal or corporate
              communications.
            </li>
            <li>
              Bentham Open’s senior publication team at the editorial office, which manages communication and
              executes decisions of the Ethics Advisory Panel.
            </li>
          </ul>

          <p>
            When a complaint is received, Bentham Open’s senior publication team consults the Ethics Advisory
            Panel. The Panel reviews the case and advises on ethical issues and decisions in line with COPE core
            practices and guidelines.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy">BASIC PROCEDURE</h2>

          <h3 className="text-xl font-serif font-bold text-academic-navy">1. Documentation of the Claim</h3>
          <p>
            The senior publication team coordinates with the complainant to document the claim and prepare a
            factual report addressing: Who is implicated, what is the ethical issue, when did it happen, where
            was the problem, and why is it important.
          </p>

          <h3 className="text-xl font-serif font-bold text-academic-navy">2. Involvement of Author(s)</h3>
          <p>
            If a complaint is against an author of a Bentham Open article, the senior publication team contacts
            the author and provides an opportunity to respond. The author’s comments are reviewed by the Ethics
            Advisory Panel and relayed to the Editor-in-Chief for further action. The Panel may agree or
            disagree with the Editor-in-Chief’s decision if it is not aligned with the Panel’s assessment.
          </p>

          <h3 className="text-xl font-serif font-bold text-academic-navy">3. Involvement of External Committees</h3>
          <p>
            External committees may be involved for complex or meritorious complaints. Depending on the nature
            of the allegation, the following bodies may be contacted:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Other journals or publishers for plagiarism and duplicate publication claims.</li>
            <li>Institutions of researchers for complaints related to authorship and fraud.</li>
            <li>
              Funding agencies or ethical committees for matters involving conflicts of interest or violation of
              research ethics.
            </li>
            <li>COPE, if advice is required.</li>
            <li>
              If a complaint is made within Bentham Open publications, Editors-in-Chief may coordinate across
              journals. The procedure remains the same.
            </li>
          </ul>

          <h2 className="text-2xl font-serif font-bold text-academic-navy">4. TYPES OF MISCONDUCT</h2>

          <h3 className="text-xl font-serif font-bold text-academic-navy">4.1. Data Fabrication/Data Falsification</h3>

          <h4 className="text-lg font-serif font-bold text-academic-navy">4.1.1. Data Fabrication</h4>
          <p>
            Data fabrication is the intentional misrepresentation of research results, including reporting
            experiments that were never conducted or misrepresenting data to fit an anticipated outcome.
          </p>

          <h4 className="text-lg font-serif font-bold text-academic-navy">4.1.2. Data Falsification</h4>
          <p>
            Data falsification involves manipulating resources, equipment, or processes, including omitting or
            presenting facts to create a false impression. This also applies to deceptive image-based data or
            inappropriate image changes, including mislabeled figures, missing integral funding and or other
            information, and authors’ competing interests.
          </p>

          <p>
            Image editing may be legitimate or necessary in some situations, such as enlarging a region to show
            otherwise hidden features or editing video to protect participant privacy. If figures are
            questionable, authors may be asked to provide original data.
          </p>

          <p>
            Authors are recommended to declare that there are no image manipulations and to provide original
            images when requested or be able to supply them upon request.
          </p>

          <p className="font-semibold text-academic-navy">
            COPE recommendations to avoid allegations of image manipulation:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Do not enhance, obscure, remove, move, or add specific features within an image.</li>
            <li>
              Brightness or contrast adjustments are acceptable only if applied equally across the entire image
              and to controls, and do not obscure or misrepresent information.
            </li>
            <li>
              Excessive manipulations that emphasize one region at the expense of others are inappropriate, as
              is emphasizing experimental data relative to the control.
            </li>
            <li>Nonlinear adjustments or deleting portions of a recording must be disclosed in a figure legend.</li>
            <li>
              Constructing figures from different gels, fields, exposures, or experimental series is discouraged.
              When necessary, composite parts must be clearly demarcated and described.
            </li>
            <li>
              Original unprocessed images must be provided if any indication of inappropriate processing is
              identified. Journals may suggest submitting original unprocessed images alongside processed ones.
            </li>
          </ul>

          <h4 className="text-lg font-serif font-bold text-academic-navy">4.1.3. Recommended Action</h4>
          <p>
            For claims involving data fabrication or falsification, the publisher contacts the corresponding
            author for justification. If the author cannot reasonably defend the allegation, the publisher may
            involve the author’s institution or employer. Cases are handled per COPE protocols, including:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Before publication: Suspected fabricated data in a submitted manuscript</li>
            <li>After publication: Suspected fabricated data in a published article</li>
            <li>Inappropriate image manipulation in a published article</li>
          </ul>

          <h3 className="text-xl font-serif font-bold text-academic-navy">
            4.2. Duplicate Submission/Publication and Redundant Publication
          </h3>

          <h4 className="text-lg font-serif font-bold text-academic-navy">4.2.1. Duplicate Submission/Publication</h4>
          <p>
            Duplicate submission involves submitting a single study to two different journals, or publishing an
            almost similar study in two journals. Such cases may be simultaneous or separated by years. Motives
            may include obtaining peer review services from one publisher while intending to publish elsewhere,
            or simply increasing publication counts.
          </p>

          <h4 className="text-lg font-serif font-bold text-academic-navy">4.2.2. Redundant Publication</h4>
          <p>
            Redundant publication refers to publishing the same data more than once. This may result in rejection,
            requests to merge manuscripts, corrections of published articles, retraction, and penalties in cases
            of seriously flawed or misleading content.
          </p>

          <h4 className="text-lg font-serif font-bold text-academic-navy">4.2.3. Recommended Action</h4>
          <p>
            Authors are advised to avoid duplicate or redundant submission. The submitted manuscript should be
            original and not previously submitted elsewhere. Initial checks may involve side-by-side comparisons
            of relevant text, followed by more detailed analysis for complex cases.
          </p>

          <p>
            Legitimate republication may be acceptable under some journal policies and agreements between editors,
            provided prior publication is disclosed and agreed upon. A full citation and a brief explanation of
            the circumstances should accompany the republished version, preferably as a footnote.
          </p>

          <p>
            Cases are handled according to COPE protocols, including:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Before publication: Suspected redundant (duplicate) publication in a submitted manuscript</li>
            <li>After publication: Suspected redundant (duplicate) publication in a published article</li>
          </ul>

          <h3 className="text-xl font-serif font-bold text-academic-navy">4.3. Duplication of Text and/or Figures (Plagiarism)</h3>

          <h4 className="text-lg font-serif font-bold text-academic-navy">4.3.1. Plagiarism</h4>
          <p>
            Plagiarism refers to presenting someone else’s work including words, ideas, or information as one’s
            own without proper citation or acknowledgment. It may be categorized based on magnitude, novelty,
            context, and attribution.
          </p>

          <p>
            Bentham Open maintains an editorial policy on plagiarism prevention and uses iThenticate to detect
            overlapping text. COPE provides flowcharts for handling suspected plagiarism in submitted or published
            work, and Bentham follows the same protocols.
          </p>

          <h4 className="text-lg font-serif font-bold text-academic-navy">4.3.2. Recommended Action</h4>
          <p>
            For plagiarism complaints, the senior publications team compares the referred text with the manuscript
            on a word-to-word basis. Significant overlap is escalated to the Editor-in-Chief, who may consult the
            Editorial Board or external reviewers. Copyright issues may be referred to legal advisors. The
            corresponding author is contacted for explanation, and institutions or employers may be informed if
            explanations are inadequate. Cases follow COPE flowcharts, including:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Before publication: Suspected plagiarism in a submitted manuscript</li>
            <li>After publication: Suspected plagiarism in a published article</li>
          </ul>

          <h3 className="text-xl font-serif font-bold text-academic-navy">4.4. Authorship Issues</h3>

          <p>
            Authorship assigns credibility to work. Only genuine contributors should be included. Bentham Open
            follows ICMJE guidance, which states authorship requires all four criteria:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Substantial contributions to conception/design or acquisition/analysis/interpretation of data.</li>
            <li>Drafting the work or revising it critically for important intellectual content.</li>
            <li>Final approval of the version to be published.</li>
            <li>Agreement to be accountable for all aspects of the work.</li>
          </ul>

          <p>
            Bentham Open publishes authors’ names as previously cited and displays institutional affiliations and
            corresponding author email addresses. Contact numbers are not disclosed unless required by editorial
            policy. Affiliations are not changed after publication except to correct errors.
          </p>

          <h4 className="text-lg font-serif font-bold text-academic-navy">4.4.1. Recommended Action</h4>
          <p>
            Authors must provide the final author list at submission. Additions, deletions, or rearrangements are
            not considered after final submission unless approved by an Editor. The Editor-in-Chief requires:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>The reason for the change in author list and order.</li>
            <li>Confirmation from all co-authors for any amendment or removal.</li>
          </ul>

          <p>
            If approved after online publication, an erratum or corrigendum may be issued. Authorship disputes
            are handled per COPE and ICMJE guidance, including:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>General advice: Advice on how to spot authorship problems</li>
            <li>Before publication: Requests to add or remove authors</li>
            <li>After publication: Requests to add or remove authors and suspected guest/ghost/gift authorship</li>
          </ul>

          <h3 className="text-xl font-serif font-bold text-academic-navy">4.5. Undeclared Conflict of Interest (CoI)</h3>

          <p>
            A conflict of interest exists when financial or personal considerations could compromise professional
            judgment and objectivity. Authors and reviewers must declare relevant conflicts to avoid bias. Such
            declarations may be presented in the article.
          </p>

          <h4 className="text-lg font-serif font-bold text-academic-navy">4.5.1. Recommended Action</h4>
          <p>
            CoI complaints typically require notifying the author through due process and may require involving
            institutions or companies where research took place. Cases follow COPE guidance, including:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              Before publication: What to do if a reviewer suspects undisclosed CoI in a submitted manuscript
            </li>
            <li>
              After publication: What to do if a reader suspects undisclosed CoI in a published article
            </li>
          </ul>

          <h3 className="text-xl font-serif font-bold text-academic-navy">
            4.6. Suspected Manipulation of Peer Review/Bias of Peer Review
          </h3>

          <p>
            Bentham Open selects reviewers with due care to avoid conflicts of interest and follows COPE guidance
            on peer review.
          </p>

          <h4 className="text-lg font-serif font-bold text-academic-navy">4.6.1. Recommended Action</h4>
          <p>
            Reviewers must declare conflicts that could bias peer review and must not use manuscript information
            for personal benefit before publication. Editors must withdraw from decisions where conflicts exist.
            Complaints against reviewers are investigated, and affiliations or employers may be involved if
            reviewers cannot reasonably defend against allegations. Cases follow COPE protocols, including:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Before publication: Manipulation of peer-review during the review</li>
            <li>After publication: Suspected manipulation of peer-review after publication</li>
            <li>Reviewer suspected to have appropriated an author’s ideas or data</li>
          </ul>

          <h3 className="text-xl font-serif font-bold text-academic-navy">4.7. Manipulation of Citations</h3>

          <p>
            Self-citation is including one’s own work to increase citation counts. Citation manipulation occurs
            when references do not contribute to scholarly content and are included solely to boost citations.
            Bentham Open may sanction authors for such practices, and discourages editors and reviewers from
            requesting irrelevant citations.
          </p>

          <h4 className="text-lg font-serif font-bold text-academic-navy">4.7.1. Recommended Action</h4>
          <p>
            Bentham Open identifies excessive self-citation and requests a reasonable justification. After
            consultation with the Editor-in-Chief, decisions are made case by case. Such issues are handled per
            COPE protocols. General guidance:
          </p>

          <p>
            <Link
              href="https://publicationethics.org/citation-manipulation-discussion-document"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-blue hover:underline inline-flex items-center gap-1"
            >
              https://publicationethics.org/citation-manipulation-discussion-document
              <FiExternalLink className="w-4 h-4" />
            </Link>
          </p>

          <h3 className="text-xl font-serif font-bold text-academic-navy">4.8. Violation of Research Ethics</h3>

          <p>Research ethics may involve issues such as:</p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Patient consent (medical research)</li>
            <li>Animal experimentation (life sciences)</li>
            <li>Recipient consent (market research)</li>
            <li>User consent (social or online research)</li>
          </ul>

          <p>
            Studies involving humans or animals must include informed consent and follow standard protocols.
            Detailed policies are available under Editorial Policies.
          </p>

          <h4 className="text-lg font-serif font-bold text-academic-navy">4.8.1. Recommended Action</h4>
          <p>
            Ethical concerns may be referred to institutions, standard-setting bodies, or other relevant agencies
            unless a reasonable explanation is provided and accepted. Cases are handled per COPE protocols.
            General guidance:
          </p>

          <p>
            <Link
              href="https://publicationethics.org/guidance/flowchart/suspected-ethical-problem-submitted-manuscript"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-blue hover:underline inline-flex items-center gap-1"
            >
              https://publicationethics.org/guidance/flowchart/suspected-ethical-problem-submitted-manuscript
              <FiExternalLink className="w-4 h-4" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}





