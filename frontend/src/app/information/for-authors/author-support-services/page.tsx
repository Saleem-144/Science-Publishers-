'use client';

export default function AuthorSupportServicesPage() {
  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-academic-navy mb-8 pb-4 border-b-4 border-academic-gold">
          Aethra Author Support Services
        </h1>

        {/* Main Content */}
        <div className="prose prose-lg max-w-none">
          {/* First Paragraph */}
          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            Once an article is submitted and following an initial cursory evaluation by the editor, it is forwarded to the Aethra Author Support Services (AASS) team for a comprehensive preliminary assessment.
          </p>

          {/* Second Paragraph */}
          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            The AASS team consists of skilled professionals specializing in reviewing manuscripts to ensure that they are fully prepared for the next stages of the editorial process. Their meticulous evaluation identifies and addresses common errors early on, thereby reducing potential delays during the publication stages.
          </p>

          {/* Third Paragraph */}
          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            By offering a systematic and efficient approach to manuscript preparation, AASS ensures that submissions meet the highest standards of quality and adhere to ethical guidelines. These practices uphold academic integrity and enhance the credibility of the published research.
          </p>
        </div>
      </div>
    </div>
  );
}
