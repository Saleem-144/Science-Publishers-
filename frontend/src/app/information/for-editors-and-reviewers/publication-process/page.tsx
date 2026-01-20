'use client';

export default function PublicationProcessPage() {
  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-academic-navy mb-8 pb-4 border-b-4 border-academic-gold">
          PUBLICATION PROCESS
        </h1>

        <div className="mt-8 text-gray-700 space-y-6 leading-relaxed">
          <p>
            The below given flowchart explains the manuscript submission at a glance. Once the manuscript is submitted for publication, it is subjected to screening, quality assessment, reviewing, and further production processing involving language assessment, figure improvement, preparation of proofs and incorporation of required corrections.
          </p>

          <h2 className="text-2xl font-serif font-bold text-academic-navy mt-10 mb-4">
            Publication Process Flowchart
          </h2>

          <div className="bg-white rounded-lg border border-gray-200 p-6 my-6">
            <ol className="space-y-4">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-academic-blue text-white rounded-full flex items-center justify-center font-semibold mr-4">1</span>
                <div>
                  <strong className="text-academic-navy">Manuscript Submission</strong>
                  <p className="text-sm text-gray-600 mt-1">The process begins with manuscript submission.</p>
                </div>
              </li>

              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-academic-blue text-white rounded-full flex items-center justify-center font-semibold mr-4">2</span>
                <div>
                  <strong className="text-academic-navy">First Screening by Editor in Chief</strong>
                  <p className="text-sm text-gray-600 mt-1">Initial evaluation by the Editor-in-Chief.</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-2 ml-4">
                    <li>If <strong>Accepted</strong>: Proceeds to Content Verification</li>
                    <li>If <strong>Rejected</strong>: Returned to Author</li>
                  </ul>
                </div>
              </li>

              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-academic-blue text-white rounded-full flex items-center justify-center font-semibold mr-4">3</span>
                <div>
                  <strong className="text-academic-navy">Content Verification/Pre-Submission Checking</strong>
                  <p className="text-sm text-gray-600 mt-1">Quality and content assessment.</p>
                </div>
              </li>

              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-academic-gold text-academic-navy rounded-full flex items-center justify-center font-semibold mr-4">4</span>
                <div>
                  <strong className="text-academic-navy">Content OK?</strong>
                  <p className="text-sm text-gray-600 mt-1">Decision point for content quality.</p>
                  <p className="text-sm text-gray-600 mt-1">If OK: Proceeds to Peer Review</p>
                </div>
              </li>

              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-academic-blue text-white rounded-full flex items-center justify-center font-semibold mr-4">5</span>
                <div>
                  <strong className="text-academic-navy">Peer Review</strong>
                  <p className="text-sm text-gray-600 mt-1">Independent review by expert reviewers.</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-2 ml-4">
                    <li>If <strong>Accepted with Minor/Major Revision</strong>: Proceeds to revision process</li>
                    <li>If <strong>Rejected</strong>: Returned to Author</li>
                  </ul>
                </div>
              </li>

              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-academic-blue text-white rounded-full flex items-center justify-center font-semibold mr-4">6</span>
                <div>
                  <strong className="text-academic-navy">Review Comments Sent to Editor in Chief</strong>
                  <p className="text-sm text-gray-600 mt-1">Reviewer feedback is compiled and sent to EiC.</p>
                </div>
              </li>

              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-academic-blue text-white rounded-full flex items-center justify-center font-semibold mr-4">7</span>
                <div>
                  <strong className="text-academic-navy">Proceed for Revision</strong>
                  <p className="text-sm text-gray-600 mt-1">Author prepares revised version.</p>
                </div>
              </li>

              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-academic-blue text-white rounded-full flex items-center justify-center font-semibold mr-4">8</span>
                <div>
                  <strong className="text-academic-navy">Revised Version</strong>
                  <p className="text-sm text-gray-600 mt-1">Author submits revised manuscript.</p>
                </div>
              </li>

              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-academic-blue text-white rounded-full flex items-center justify-center font-semibold mr-4">9</span>
                <div>
                  <strong className="text-academic-navy">Second Round Review</strong>
                  <p className="text-sm text-gray-600 mt-1">Revised manuscript undergoes second review.</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-2 ml-4">
                    <li>If <strong>Accepted</strong>: Proceeds to EiC for Final Decision</li>
                    <li>If <strong>Rejected</strong>: Returned to Author</li>
                  </ul>
                </div>
              </li>

              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-academic-blue text-white rounded-full flex items-center justify-center font-semibold mr-4">10</span>
                <div>
                  <strong className="text-academic-navy">Send to EiC for Final Decision</strong>
                  <p className="text-sm text-gray-600 mt-1">Editor-in-Chief makes final assessment.</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-2 ml-4">
                    <li>If <strong>Accepted</strong>: Proceeds to In-house Publication Process</li>
                    <li>If <strong>Rejected</strong>: Returned to Author</li>
                  </ul>
                </div>
              </li>

              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">✓</span>
                <div>
                  <strong className="text-academic-navy">In-house Publication Process</strong>
                  <p className="text-sm text-gray-600 mt-1">Final production process including language assessment, figure improvement, proof preparation, and incorporation of corrections.</p>
                </div>
              </li>
            </ol>
          </div>

          <div className="bg-blue-50 border-l-4 border-academic-blue p-4 my-6">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> At any stage where a manuscript is rejected (after first screening, peer review, second round review, or final decision), it is returned to the author. The manuscript only proceeds to publication after successful completion of all review stages and final acceptance by the Editor-in-Chief.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

