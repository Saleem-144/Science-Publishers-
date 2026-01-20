'use client';

export default function VirtualSpecialIssuesPage() {
  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-academic-navy mb-8 pb-4 border-b-4 border-academic-gold">
          VIRTUAL SPECIAL ISSUES
        </h1>

        <div className="mt-8 text-gray-700 space-y-6 leading-relaxed">
          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Introducing The Virtual Special Issues (VSIs)
          </h2>
          <p>
            Aethra journals now publish all special issues as Virtual Special Issues (VSIs)
          </p>
          <p>
            A VSI is a collection of special issue articles that are usually assigned to a single special issue. After being given a special identification number, every article in a VSI is promptly published in a regular journal volume.
          </p>
          <p>
            Articles that are compiled into a VSI maintain their original citation information.
          </p>
          <p>
            A VSI is easily accessible and navigable on the journal's website, where it is featured alongside the regular journal editions. A table of contents, a roster of guest editors, and other information pertinent to the VSI are included on its homepage.
          </p>
          <p>
            A VSI speeds up the publication of individual articles because, unlike the traditional special issue process, a VSI does not require the final article of the issue to be ready before publication.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Benefits of the New Process
          </h2>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              <strong>Faster publication time:</strong> The overall publication time is reduced.
            </li>
            <li>
              <strong>Visibility:</strong> Special issues appear on ScienceDirect with the publication of the very first article, thereby increasing visibility as new articles are added over time.
            </li>
            <li>
              <strong>Improved management:</strong> Guest editors can manage content more efficiently, as late submissions no longer delay the special issue.
            </li>
          </ul>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            How the New Process Works?
          </h2>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              <strong>Unchanged editorial process:</strong> Up to the point of acceptance, the editorial process remains the same. Manuscripts are submitted through the special issue portal and peer-reviewed as usual.
            </li>
            <li>
              <strong>Concurrent publication:</strong> Accepted manuscripts are produced and simultaneously published in the current regular volume and included in the online special issue.
            </li>
            <li>
              <strong>Introductory text:</strong> There is space for introductory text to highlight the theme(s) of the special issue. This text can be updated until the special issue is closed and can serve as a placeholder for the editorial.
            </li>
          </ul>

          <p className="mt-8">
            We believe that this process will enhance the publication experience of authors and provide readers with quick and easy access to high-quality research.
          </p>
        </div>
      </div>
    </div>
  );
}

