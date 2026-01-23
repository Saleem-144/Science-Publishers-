'use client';

export default function PublishingEthicsPage() {
  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-academic-navy mb-8 pb-4 border-b-4 border-academic-gold">
          PUBLISHING ETHICS
        </h1>

        <div className="mt-8 text-gray-700 space-y-6 leading-relaxed">
          <p>
            The publication of scientific papers involves conscientious, systematic, and comprehensive processes
            by publishers and editors, which must be handled efficiently and competently. To maintain high
            ethical standards of scientific publication, publishers work closely with journal editors, authors,
            and peer reviewers.
          </p>

          <p>
            The essentials of Bentham Open publishing ethics for all groups involved in the publishing process
            are outlined below.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy">FOR EDITORS</h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              The editor holds a vital role in making editorial decisions on all peer-reviewed articles submitted
              for publication.
            </li>
            <li>
              Editors must maintain transparency of the academic record, uphold ethical standards, and publish
              retractions, corrections, or errata when required.
            </li>
            <li>
              Manuscripts must be assessed for scientific quality and intellectual content without bias related
              to race, gender, geographical origin, or religion.
            </li>
            <li>
              Editorial decisions must be based solely on academic merit, free from commercial or personal
              interests.
            </li>
            <li>
              Editors must not disclose any information regarding submitted manuscripts prior to publication.
            </li>
            <li>
              Any suspected research misconduct or irregularities in peer review must be investigated promptly
              and resolved with due diligence.
            </li>
          </ul>

          <h2 className="text-2xl font-serif font-bold text-academic-navy">FOR REVIEWERS</h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              Reviewers should provide detailed, constructive, and unbiased evaluations of scientific content
              in a timely manner.
            </li>
            <li>
              Reviews should assess relevance, clarity, originality, and scientific accuracy of the manuscript.
            </li>
            <li>
              Reviewers must maintain confidentiality, disclose any financial or personal conflicts of interest,
              and decline review requests where such conflicts exist.
            </li>
            <li>
              Any ethical concerns, including improper treatment of human or animal subjects or substantial
              similarity to previously published work, must be reported to the editors.
            </li>
          </ul>

          <h2 className="text-2xl font-serif font-bold text-academic-navy">FOR AUTHORS</h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              All content submitted must be original and free from plagiarism.
            </li>
            <li>
              Manuscripts must not be published elsewhere or under consideration by another journal at the time
              of submission.
            </li>
            <li>
              Any potential conflicts of interest must be clearly disclosed.
            </li>
            <li>
              Proper acknowledgment and citation of all referenced work must be provided, and permission
              obtained for reused content.
            </li>
            <li>
              Only individuals who made substantial contributions should be listed as authors; other
              contributors should be acknowledged appropriately.
            </li>
          </ul>

          <h2 className="text-2xl font-serif font-bold text-academic-navy">FOR PUBLISHERS</h2>

          <p>
            Bentham Open is committed to working closely with journal editors, clearly defining roles to ensure
            appropriate publication decisions and maintain transparency in editorial processes.
          </p>

          <p>
            Bentham Open ensures the integrity, autonomy, and originality of each published article with respect
            to the following:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Publication and research funding</li>
            <li>Publication ethics and rectitude</li>
            <li>Conflict of interests</li>
            <li>Confidentiality</li>
            <li>Authorship</li>
            <li>Article modifications</li>
            <li>Timely publication of content</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
