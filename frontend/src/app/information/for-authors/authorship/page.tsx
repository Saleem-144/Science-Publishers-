'use client';

import Link from 'next/link';
import { FiExternalLink } from 'react-icons/fi';

export default function AuthorshipPage() {
  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-academic-navy mb-8 pb-4 border-b-4 border-academic-gold">
          Authorship
        </h1>

        {/* Main Content */}
        <div className="prose prose-lg max-w-none">
          {/* Authorship Criteria Heading */}
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-academic-navy mb-4 mt-8">
            Authorship Criteria
          </h2>

          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            Aethra requires that all individuals listed as authors must have made a substantial contribution to the design, performance, analysis, or reporting of the work. The role of authors is judged on the basis of{' '}
            <Link
              href="https://www.icmje.org/recommendations/browse/roles-and-responsibilities/defining-the-role-of-authors-and-contributors.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-blue hover:text-academic-navy underline inline-flex items-center gap-1"
            >
              ICMJE
              <FiExternalLink className="w-4 h-4" />
            </Link>
            {' '}and{' '}
            <Link
              href="https://publicationethics.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-blue hover:text-academic-navy underline inline-flex items-center gap-1"
            >
              COPE
              <FiExternalLink className="w-4 h-4" />
            </Link>
            {' '}guidelines.
          </p>

          {/* Authorship Declaration Heading */}
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-academic-navy mb-4 mt-12">
            Authorship Declaration
          </h2>

          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            All contributing authors are required to sign a copyright letter, mentioning complete details, including full name, affiliation, email address, ORCID ID, and their role in the article. After successful electronic submission of a manuscript, a system-generated acknowledgement will be sent to all authors on their provided email addresses.
          </p>

          {/* Authors and Institutional Affiliations Heading */}
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-academic-navy mb-4 mt-12">
            Authors and Institutional Affiliations
          </h2>

          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            Authors must provide a final list of authors at the time of submission, ensuring the correct sequence of the names of authors, which will not be considered for any addition, deletion or rearrangement after the final submission of the manuscript. The email address of the principal author should be provided with an asterisk. However, the complete address, business telephone numbers, fax numbers and e-mail address of the corresponding author must be stated to receive correspondence and galley proofs. Aethra recommends that all contributors regularly update their profiles on SCOPUS/ORCID and other databases.
          </p>

          {/* Author Identification Heading */}
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-academic-navy mb-4 mt-12">
            Author Identification
          </h2>

          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            Authors are strongly recommended to use their ORCID ID when submitting an article for consideration. Alternatively, they can acquire an ORCID ID via the submission process. For more information about ORCID IDs,{' '}
            <Link
              href="https://orcid.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-blue hover:text-academic-navy underline inline-flex items-center gap-1"
            >
              visit here
              <FiExternalLink className="w-4 h-4" />
            </Link>
            .
          </p>

          {/* Authorship and AI Tools Heading */}
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-academic-navy mb-4 mt-12">
            Authorship and AI Tools
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6 text-base md:text-lg">
            Aethra recognizes that authors use a variety of tools for preparing articles related to their scientific works, ranging from simple ones to very sophisticated ones.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6 text-base md:text-lg">
            According to the COPE (Committee on Publication Ethics) guidelines, "AI tools cannot meet the requirements for authorship as they cannot take responsibility for the submitted work. As non-legal entities, they cannot assert the presence or absence of conflicts of interest nor manage copyright and license agreements".
          </p>

          <p className="text-gray-700 leading-relaxed mb-6 text-base md:text-lg">
            The pertinence of such tools may vary and evolve with public opinion, due to which the use of AI-powered language tools has led to a significant debate. These tools may generate useful results, but they can also lead to errors or misleading results; therefore, it is important to know which tools were used for evaluating and interpreting a particular scientific work.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4 text-base md:text-lg">
            Considering the above, we require that:
          </p>

          <ol className="list-decimal list-inside space-y-4 mb-8 text-gray-700 leading-relaxed text-base md:text-lg ml-4">
            <li className="mb-4">
              The authors are to report any significant use of such tools in their works, such as instruments and software, along with text-to-text generative AI consistent with subject standards for methodology.
            </li>
            <li className="mb-4">
              All co-authors should sign a declaration that they take full responsibility for all of its contents, regardless of how the contents were generated. Inappropriate language, plagiarized and biased content, errors, mistakes, incorrect references, or misleading content generated by AI language tools and the relevant results reported in scientific works are the full and shared responsibilities of all the authors, including co-authors.
            </li>
            <li>
              AI language tools should not be listed as an author; instead, authors should follow clause (1) above.
            </li>
          </ol>

          {/* Changes to Authorship Heading */}
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-academic-navy mb-4 mt-12">
            Changes to Authorship
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6 text-base md:text-lg">
            At the time of initial submission, the finalized list of authors in the correct sequence should be provided, which will not be changed once the publication process starts.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6 text-base md:text-lg">
            In exceptional cases, requests for the addition/deletion of an author may be considered by the publisher subject to a) written approval from all co-authors and b) a strong justification (which may or may not be accepted by the Publisher).
          </p>

          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            Here is some advice from{' '}
            <Link
              href="https://publicationethics.org/authorship"
              target="_blank"
              rel="noopener noreferrer"
              className="text-academic-blue hover:text-academic-navy underline inline-flex items-center gap-1"
            >
              COPE on authorship issues
              <FiExternalLink className="w-4 h-4" />
            </Link>
            . Aethra strives to follow these guidelines.
          </p>

          {/* General Advice Heading */}
          <h3 className="text-xl md:text-2xl font-serif font-semibold text-academic-navy mb-3 mt-8">
            General Advice
          </h3>

          <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 leading-relaxed text-base md:text-lg ml-4">
            <li>
              <Link
                href="https://publicationethics.org/resources/flowcharts/identifying-author-problems"
                target="_blank"
                rel="noopener noreferrer"
                className="text-academic-blue hover:text-academic-navy underline inline-flex items-center gap-1"
              >
                Advice on how to spot authorship problems
                <FiExternalLink className="w-4 h-4" />
              </Link>
            </li>
          </ul>

          {/* Before Publication Heading */}
          <h3 className="text-xl md:text-2xl font-serif font-semibold text-academic-navy mb-3 mt-8">
            Before Publication
          </h3>

          <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 leading-relaxed text-base md:text-lg ml-4">
            <li>
              <Link
                href="https://publicationethics.org/resources/flowcharts/corresponding-author-requests-addition-extra-author-publication"
                target="_blank"
                rel="noopener noreferrer"
                className="text-academic-blue hover:text-academic-navy underline inline-flex items-center gap-1"
              >
                Corresponding author requests addition of extra author before publication
                <FiExternalLink className="w-4 h-4" />
              </Link>
            </li>
            <li>
              <Link
                href="https://publicationethics.org/resources/flowcharts/corresponding-author-requests-removal-author-publication"
                target="_blank"
                rel="noopener noreferrer"
                className="text-academic-blue hover:text-academic-navy underline inline-flex items-center gap-1"
              >
                Corresponding author requests removal of the author before publication
                <FiExternalLink className="w-4 h-4" />
              </Link>
            </li>
          </ul>

          {/* After Publication Heading */}
          <h3 className="text-xl md:text-2xl font-serif font-semibold text-academic-navy mb-3 mt-8">
            After Publication
          </h3>

          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700 leading-relaxed text-base md:text-lg ml-4">
            <li>
              <Link
                href="https://publicationethics.org/resources/flowcharts/request-addition-extra-author-after-publication"
                target="_blank"
                rel="noopener noreferrer"
                className="text-academic-blue hover:text-academic-navy underline inline-flex items-center gap-1"
              >
                Request for addition of extra author after publication
                <FiExternalLink className="w-4 h-4" />
              </Link>
            </li>
            <li>
              <Link
                href="https://publicationethics.org/resources/flowcharts/request-removal-author-after-publication"
                target="_blank"
                rel="noopener noreferrer"
                className="text-academic-blue hover:text-academic-navy underline inline-flex items-center gap-1"
              >
                Request for removal of author after publication
                <FiExternalLink className="w-4 h-4" />
              </Link>
            </li>
          </ul>

          {/* Non-Author Contributors Heading */}
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-academic-navy mb-4 mt-12">
            Non-Author Contributors
          </h2>

          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            Activities such as the acquisition of funding, general supervision of a research group or general administrative support, writing assistance, technical editing, language editing, and proofreading alone do not qualify any contributor for authorship. Such contributors may be acknowledged individually or together as a group in the acknowledgement section. Further details for writing acknowledgements are available on the official website. Persons not meeting authorship criteria can be acknowledged in the acknowledgement section of the article rather than being enlisted as authors.
          </p>

          {/* Guest or Honorary Authorship Heading */}
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-academic-navy mb-4 mt-12">
            Guest or Honorary Authorship
          </h2>

          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            All contributing authors should contribute substantially to the article and sign the copyright letter. Aethra discourages authorship based solely on position (e.g., a research supervisor or a departmental head). We use COPE guidelines for identifying any suspected ghost, guest, or gift authorship.
          </p>
        </div>
      </div>
    </div>
  );
}
