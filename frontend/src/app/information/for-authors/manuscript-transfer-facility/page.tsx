'use client';

export default function ManuscriptTransferFacilityPage() {
  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-academic-navy mb-8 pb-4 border-b-4 border-academic-gold">
          MANUSCRIPT TRANSFER FACILITY
        </h1>

        {/* Main Content */}
        <div className="prose prose-lg max-w-none">
          {/* First Paragraph */}
          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            If the author's manuscript is assessed as inappropriate to be published in his/her preferred journal, our editorial team may help the author in transferring the submission to a more appropriate Aethra journal through Aethra's Manuscript Transfer Facility.
          </p>

          {/* Transfer of Submission Heading */}
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-academic-navy mb-4 mt-12">
            Transfer of Submission
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6 text-base md:text-lg">
            Transfer of submission with Aethra's Manuscript Transfer Facility is very simple.
          </p>

          {/* Steps */}
          <div className="space-y-6 mb-8">
            <div>
              <h3 className="text-xl md:text-2xl font-serif font-semibold text-academic-navy mb-3">
                Step 1.
              </h3>
              <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                The author receives the transfer proposal by email; the transfer process is initiated by an affirmative response from the author to our transfer proposal.
              </p>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-serif font-semibold text-academic-navy mb-3">
                Step 2.
              </h3>
              <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                The authors' manuscript is transferred to a suitable journal for initial editorial scrutiny.
              </p>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-serif font-semibold text-academic-navy mb-3">
                Step 3.
              </h3>
              <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                The author then receives an editorial decision from the journal.
              </p>
            </div>
          </div>

          {/* Selection of Another Journal Heading */}
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-academic-navy mb-4 mt-12">
            Selection of Another Journal
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6 text-base md:text-lg">
            The author is free to choose to submit the manuscript to a new journal by declining our transfer offer.
          </p>

          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            Our aim is to facilitate and develop rapid, effective and truly innovative solutions to facilitate our valued authors by enabling more options and offering better services to improve the publication process.
          </p>
        </div>
      </div>
    </div>
  );
}
