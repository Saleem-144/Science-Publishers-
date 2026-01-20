'use client';

import Link from 'next/link';
import { FiExternalLink } from 'react-icons/fi';

export default function EditorialPoliciesPage() {
  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-academic-navy mb-8 pb-4 border-b-4 border-academic-gold">
          EDITORIAL POLICIES
        </h1>

        <div className="mt-8 text-gray-700 space-y-6 leading-relaxed">
          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Open Access Publication
          </h2>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>All articles are freely available and immediately accessible online upon publication.</li>
            <li>Readers can study, download and/or print Open Access articles without any cost.</li>
          </ul>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Licensing
          </h2>
          <p>
            Open Access Articles are licensed under the terms of the{' '}
            <Link
              href="https://creativecommons.org/licenses/by/4.0/legalcode"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-blue hover:underline inline-flex items-center gap-1"
            >
              Creative Commons Attribution 4.0 International Public License (CC-BY 4.0)
              <FiExternalLink className="w-4 h-4" />
            </Link>
            {' '}(https://creativecommons.org/licenses/by/4.0/legalcode), which permits unrestricted, distribution and reproduction in any medium, as long as the work is properly credited/attributed.
          </p>
          <p>
            The use of a Creative Commons License enables authors to retain copyright to their work.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Terms and Conditions
          </h2>
          <p>
            Submission of a manuscript to the respective journals implies that all authors have read and agreed to the content of the Covering Letter or the Terms and Conditions. It is a condition of publication that manuscripts submitted to a journal have not been published and will not be simultaneously submitted or published elsewhere.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Self-Archiving and Reproduction
          </h2>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Authors can self-archive post prints of their published articles.</li>
            <li>Authors can reproduce derivative works of the article for educational purposes and distribute its copies.</li>
          </ul>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Preprint Policy
          </h2>
          <p>
            A preprint is an early version of an article that has not yet been accepted for publication in a journal. Articles submitted to a journal that have not been published and will not be simultaneously submitted elsewhere for publication can be considered for publication. Preprints are usually deposited on the author's own web page in an institutional repository or on a preprint server. However, they are not considered ahead-of-print or early-access publications.
          </p>
          <p>
            Preprint archiving on any recognized, non-profit preprint server is entirely supported and encouraged by Aethra. Preprints deposited in designated preprint repositories at the same time as, or before, submission to a journal are not considered as prior, citable publications by the Aethra Journals.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Conflict Of Interest
          </h2>
          <p>
            Financial contributions and any potential conflict of interest must be clearly acknowledged under the heading 'Conflict of Interest'. Authors must list the source(s) of funding for the study. This should be done for each author. For more details, please visit: Conflict Of Interest
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Confidentiality
          </h2>
          <p>
            Aethra maintains the confidentiality of the submitted manuscript and its content. The editors are advised not to disclose any information on submitted manuscripts before their publication.
          </p>
          <p>
            The peer review of a manuscript is a confidential process. Aethra follows a double-blind peer review process where the identities of both the reviewer and author are kept undisclosed to each other, ensuring anonymity and maintaining confidentiality throughout the entire review procedure.
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Reviewers should keep the whole process completely confidential. They should consult the EIC/senior editor and take permission before consulting another colleague for help in the peer-review of the submitted manuscript.</li>
            <li>Reviewers should not disclose any information whatsoever to anyone before the publication of the manuscript.</li>
          </ul>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Peer Review
          </h2>
          <p>
            Aethra follows the double-blind peer review procedure for submissions of all manuscripts to its journals.
          </p>
          <p>
            All submitted articles are subjected to an extensive peer review in consultation with members of the journal's editorial board and independent external referees (usually two reviewers). All manuscripts/chapters are assessed rapidly and the decision based on all the peer reviewers' comments, taken by the journal's Editor-in-Chief, is then conveyed to the author(s).
          </p>
          <p>
            Submissions from the Editor-in-Chief/Co-Editor/ Editorial Board Members will undergo independent peer review and will be submitted to another Editor for his decision on acceptance. For further details, please visit complete guidelines at:{' '}
            <Link
              href="https://benthamopenscience.com/peer-review-workflow.php"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-blue hover:underline inline-flex items-center gap-1"
            >
              https://benthamopenscience.com/peer-review-workflow.php
              <FiExternalLink className="w-4 h-4" />
            </Link>
          </p>

          <h3 className="text-xl font-serif font-bold text-academic-navy mt-8 mb-3">
            Use of Generative AI and AI-assisted Technologies in the Peer Review Process
          </h3>
          <p>
            Since the use of AI technology has increased, it has brought its own challenges regarding the originality of the review of submitted manuscripts. Aethra has been striving to improve its policies accordingly. With time, we will continue to update our policies to support our reviewers, authors, and editors.
          </p>
          <p>
            The quality of the peer review of submitted articles has been our top priority. The reviewers are advised not to use AI technologies or any other related assisting resources to generate review reports that could compromise the integrity and confidentiality of the reports.
          </p>
          <p>
            All efforts are made to expedite the peer review process for a timely publication.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Article Types
          </h2>
          <p>
            Authors have the choice to publish a wide range of articles in an Aethra journal e.g., short communications, full-length research and review articles, systematic reviews, editorials, perspectives, letters to the editor, commentaries as well as supplements, and case studies.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Hazard Study
          </h2>
          <p>
            Any unusual risks associated with the use of any chemicals, procedures, or equipment used in the work must be explicitly stated by the author in the manuscript, preferably in both the materials and methods section and the declaration section. For more information, visit{' '}
            <Link
              href="https://www.wma.net/what-we-do/public-health/chemicals"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-blue hover:underline inline-flex items-center gap-1"
            >
              The World Medical Association
              <FiExternalLink className="w-4 h-4" />
            </Link>
            {' '}(https://www.wma.net/what-we-do/public-health/chemicals).
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Sex and Gender Equity in Research (SAGER) Guidelines
          </h2>
          <p>
            We strive to promote gender and sex equity in research and adhere to the guidelines of Sex and Gender Equity in Research (SAGER) to ensure inclusivity and rigor of the work. All authors submitting research papers are required to follow the Sex and Gender Equity in Research (SAGER) guidelines. These guidelines are intended to encourage the inclusion of sex and gender considerations in research in order to improve the rigor and relevance of our publications.
          </p>
          <p>
            The SAGER guidelines for reporting sex and gender information in methodology or study design, data analysis, results, and interpretation of findings are strongly encouraged. Authors of review articles are advised to address the methods used for selecting, locating, extracting, and synthesizing data; systematic reviews are required to do so.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Patient Consent
          </h2>
          <p>
            Compliance with the guidelines of the International Committee of Medical Journal Editors ({' '}
            <Link
              href="https://www.icmje.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-blue hover:underline inline-flex items-center gap-1"
            >
              www.icmje.org
              <FiExternalLink className="w-4 h-4" />
            </Link>
            {' '}) is recommended, in accordance with the patient's consent for research or participation in a study for Aethra Publication as per the applicable laws and regulations regarding the privacy and/or security of personal information, including, but not limited to, the Health Insurance Portability and Accountability Act of 1996 ("HIPAA") and other U.S. federal and state laws relating to confidentiality and security of personally distinguishable evidence, the General Data Protection Regulation (GDPR) (EU) 2016/679 and member state implementing legislation, Canada's Personal Information Protection and Electronic Documents Act, India's Information Technology Act and related Privacy Rules, (together "Data Protection and Privacy Laws").
          </p>
          <p>It is the responsibility of the author to ensure that:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Patient's names, initials, or hospital numbers must not be mentioned anywhere in the manuscript (including figures).</li>
            <li>Authors are responsible for obtaining patient's consent-to-disclose form for all recognizable photographs, videos, or any other information or personal detail that may be published in the journal, in derivative works, or on the journal's website.</li>
            <li>The consent-to-disclose form should indicate specific use (publication in the medical literature in print and online, with the understanding that patients and the public will have access) of the patient's information and any images in figures or videos, and must contain the patient's signature or that of a legal guardian along with a statement that the patient or legal guardian has been offered the opportunity to review the recognizable personal data of the patient in the manuscript prior to publication. In case of children, consent should be obtained from the parent or the legal guardian.</li>
            <li>In case of not obtaining consent, concealing the identity through eye bars or blurring the face would not be acceptable.</li>
            <li>A specific declaration of all above mentioned other similar approvals and consent-to-disclose forms must be made in the copyright letter and a stand-alone paragraph at the end of the article, especially in the case of human studies, where the inclusion of a statement regarding obtaining the written informed consent from each subject or subject's guardian is a must. The original forms should be retained by the guarantor or the corresponding author. The editors, however, may request to provide the original forms by fax or email.</li>
            <li>All such case reports should be followed by proper consent prior to publishing.</li>
          </ul>
          <p>
            Editors may request the authors to provide documentation for a formal review and recommendation from the institutional review board or ethics committee, responsible for any oversight of the study. The editors reserve the right to reject manuscripts that do not comply with the above-mentioned requirements. The author will be held responsible for false statements or failure to fulfill the above-mentioned requirements.
          </p>

          <h3 className="text-xl font-serif font-bold text-academic-navy mt-8 mb-3">
            Non-identifiable Images
          </h3>
          <p>
            Anonymous images, that do not identify the individual directly or indirectly, such as through any identifying marks or text, do not require formal consent, for example, x-rays, ultrasound images, pathology slides or laparoscopic images.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Appeals and Complaints
          </h2>
          <p>
            The editorial decisions are not reverted. However, authors who think that their manuscript was rejected due to some misunderstanding may seek an explanation for the decision in the form of an appeal. Appeals must give sound reasoning and compelling evidence against the criticism raised in the rejection letter. A difference of opinion as to the interest, novelty, or suitability of the manuscript for the journal will not be considered as an appeal. The editor-in-chief and other relevant editors will consider the appeal and their decision will be deemed final. Acceptance of the manuscript is not guaranteed, even if the journal agrees to reconsider the manuscript, and the reconsideration process may involve previous or new reviewers or editors and substantive revision.
          </p>
          <p>
            Authors who intend to make a complaint should consult the editor-in-chief of the concerned journal. Complaints to the publisher may be emailed at info@aethra.net.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Plagiarism Prevention
          </h2>
          <p>
            Plagiarism means copying or paraphrasing another writer's content, be it a text, a result or an observation, and stating it as one's own, without citing a reference to the original source. Therefore, authors should acknowledge and cite references to the work of other scientists in their manuscripts. The author should ensure that all the sources are authentic and that there is no discrepancy in the content of the manuscript.
          </p>
          <p>
            Aethra is vigilant in checking and identifying the primary sources of the data within the content by using the iThenticate software to detect instances of overlapping and similarity of text in submitted manuscripts. iThenticate software verifies the content against a database of periodicals, materials on the Internet, and a comprehensive article database. The software generates a similarity report in percentage that matches the article in process and the published material. This similarity is further scrutinized for suspected plagiarism according to the publisher's Editorial Policies. The generated report comprises the overall percentage of the content reused.
          </p>

          <h3 className="text-xl font-serif font-bold text-academic-navy mt-8 mb-3">
            Credibility of Sources and Acknowledgements
          </h3>
          <p>
            The study of an author has to be original. If there are credible sources of the content referred to in the manuscript, the author needs to cite all of them. Authors are advised to use iThenticate before submitting a manuscript to ensure that there are no instances of plagiarism. Authors are required to provide proper consent from the individuals and contributions of other authors should be acknowledged.
          </p>
          <p>
            Aethra has different editorial policies for authors who have more than one publication. Following those policies, the authors need to specify the sources of the submission in their recent work.
          </p>
          <p>
            Aethra strictly follows COPE guidelines to detect plagiarism. For clearer insight, authors may refer to the flowcharts provided by COPE by clicking{' '}
            <Link
              href="https://publicationethics.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-blue hover:underline inline-flex items-center gap-1"
            >
              here
              <FiExternalLink className="w-4 h-4" />
            </Link>
            {' '}or visiting the{' '}
            <Link
              href="https://publicationethics.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-blue hover:underline inline-flex items-center gap-1"
            >
              COPE website
              <FiExternalLink className="w-4 h-4" />
            </Link>
            .
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Fabricating and Stating False Information
          </h2>
          <p>
            To secure the scholarly integrity of every article, Aethra publishes post-publication notices. The authors of the published articles, or those who have submitted the manuscripts with false information, such as fabricated supporting data or images, may incur sanctions, and their papers will be retracted. For further details, please visit the complete guidelines by clicking{' '}
            <Link
              href="#"
              className="text-academic-blue hover:underline"
            >
              here
            </Link>
            .
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Article Processing Charges Policy
          </h2>
          <p>
            Aethra is committed to disseminating research and scholarly publications as widely as possible. In this respect, it supports the principle that 'the results of research that have been publicly funded should be freely accessible in the public domain' and therefore it encourages researchers to make their research available through open access (OA).
          </p>
          <p>
            Open-access publishing is not free of cost. To facilitate open access, Aethra journals partly defray the expenses of peer review, journal production, and online hosting and archiving from authors and their research sponsors by charging a publication fee for each article they publish. The fee varies by journal. Prices are clearly displayed on our Article Processing Charges (APC) page.
          </p>
          <p>The following special discounts are offered to authors and editorial board members:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Authors from Aethra Member Institutes are entitled to up to a 20% discount on their article processing fees.</li>
            <li>All editors and editorial board members of Aethra journals are entitled to publish their articles free of charge.</li>
          </ul>
          <p>
            Waivers and additional discount requests are decided on the basis of the author's country of origin and the quality of the submitted article. Editors and reviewers have no knowledge of whether authors are able to pay; decisions to publish are only based on meeting the editorial criteria.
          </p>
          <p>
            Aethra does not impose submission charges.
          </p>
          <p>
            Once the paper is accepted for publication, the author will receive an electronic invoice via email.
          </p>

          <h3 className="text-xl font-serif font-bold text-academic-navy mt-8 mb-3">
            Waiver Policy
          </h3>
          <p>
            Aethra offers a discount of 50% on the publication fee for manuscripts of all corresponding authors who reside in countries that are categorized as low-income economies by the World Bank. To see if you qualify for the discount, please refer to the complete list of these countries by clicking{' '}
            <Link
              href="#"
              className="text-academic-blue hover:underline"
            >
              here
            </Link>
            .
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Errata or Corrigenda and Corrections in Published Articles
          </h2>
          <p>
            Authors and readers are encouraged to notify the editor-in-chief if they discover errors in published content, authors' names and affiliations or if they have concerns over the legitimacy of a publication. In such cases, Aethra will publish an erratum or a corrigendum, in consultation with the editor-in-chief and authors of the article to, replace or retract the article.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Article Withdrawal
          </h2>
          <p>
            Articles in press (articles that have been accepted for publication or published as E-pub ahead of schedule but which have not been formally published with volume/issue/page information) that include errors, or are determined to violate the publishing ethics guidelines, such as multiple submissions, fake claims of authorship, plagiarism, fraudulent use of data or the like, may be "withdrawn" from the journal. Withdrawal means that the files of the article are removed and replaced with a PDF, stating that the article has been withdrawn from the journal in accordance with the editorial policies of Aethra.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Article Retraction
          </h2>
          <p>
            If published manuscripts with the information of volume / issue / page number, are found to violate professional ethical codes in their content, such as plagiarism, excess similarity with some other article, fraudulent use of data, etc., then such manuscripts are retracted. Any decision to issue a retraction notice for an article will be taken in accordance with the COPE guidelines available at:{' '}
            <Link
              href="https://publicationethics.org/guidance/guideline/retraction-guidelines"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-blue hover:underline inline-flex items-center gap-1"
            >
              https://publicationethics.org/guidance/guideline/retraction-guidelines
              <FiExternalLink className="w-4 h-4" />
            </Link>
            .
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>A retraction note entitled "Retraction: [article title]" (for example Retraction: ABC experiment involving XYZ species) is published in the paginated part of the next scheduled issue of the journal and is also listed in the table of contents.</li>
            <li>The retraction note is approved by the editor-in-chief of the concerned journal.</li>
            <li>A link to the original article is displayed in the online (electronic) version.</li>
            <li>A screen containing the note of retraction appears before the electronic version of the article present on the website. On the screen, a link to the complete retracted article is present to access and view the article.</li>
            <li>The link webpage of the original article remains unchanged, however a downloadable PDF document in the form of a shaded watermark is available, referring that the article has been retracted.</li>
          </ul>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Concurrent Publication / Simultaneous Submission
          </h2>
          <p>
            It is a condition for manuscript publication that manuscripts submitted to the Aethra journals have not been previously published and will not be simultaneously submitted or published elsewhere. Plagiarism is strictly forbidden, and by submitting the article for publication the authors agree that the publishers have the legal right to take appropriate action against the authors if plagiarism or fabricated information is discovered.
          </p>
          <p>
            Abstracts and posters of conferences, results presented at meetings (for example, to inform investigators or participants about findings), results databases (data without interpretation, discussion, context or conclusions in the form of tables and text to describe data/information, where this is not easily presented in tabular form) are not considered prior to publication.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Handling Post-Publication Matters
          </h2>
          <p>
            To maintain the integrity of scientific research, Aethra carries out investigations regarding the concerns raised by authors and/or readers. However, authors are always provided a chance to respond to all complaints/ comments. We may require reviewers to go over the original data and consult with experts involved, in order to solve and conclude the investigation.
          </p>
          <p>
            Post Publication Discussions may be published online after review and are usually accompanied by a response from the original authors. For more details, please visit: Post-Publication Discussions and Corrections.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Disclaimer
          </h2>
          <p>
            Responsibility for the content published by Aethra in any of its journals, including any opinions expressed therein, rests exclusively with the author(s) of that content. To the maximum extent permitted by applicable law, Aethra (on behalf of its employees and editorial board members) disclaims the responsibility for any and all injury and/or damage, financial or otherwise, to persons or property, resulting directly or indirectly from any ideas, methods, instructions or products (including errors in the same) referred to the content of any of Aethra journals. Any dispute arising, including any claim, shall be governed exclusively by the laws of the United Arab Emirates, as applied in Sharjah.
          </p>
        </div>
      </div>
    </div>
  );
}

