'use client';

import Link from 'next/link';
import { FiExternalLink } from 'react-icons/fi';

export default function SpecialFeeWaiversAndDiscountPage() {
  const countries = [
    'Afghanistan', 'Albania', 'Armenia', 'Belize',
    'Benin', 'Bhutan', 'Bolivia', 'Burkina Faso',
    'Burundi', 'Cambodia', 'Cameroon', 'Cape Verde',
    'Central African Republic', 'Chad', 'Comoros', 'Congo, Dem. Rep',
    'Congo, Rep.', 'Côte d\'Ivoire', 'Djibouti', 'El Salvador',
    'Eritrea', 'Ethiopia', 'Fiji', 'Gambia, The',
    'Georgia', 'Ghana', 'Guatemala', 'Guinea',
    'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras',
    'Iraq', 'Kenya', 'Kiribati', 'Kosovo',
    'Kyrgyz Republic', 'Lao PDR', 'Lesotho', 'Liberia',
    'Madagascar', 'Malawi', 'Mali', 'Marshall Islands',
    'Mauritania', 'Micronesia, Fed. Sts.', 'Moldova', 'Mongolia',
    'Mozambique', 'Myanmar', 'Nepal', 'Nicaragua',
    'Niger', 'Papua New Guinea', 'Paraguay', 'Rwanda',
    'Samoa', 'Senegal', 'Sierra Leone', 'Solomon Islands',
    'Somalia', 'South Sudan', 'Sudan', 'Swaziland',
    'Syrian Arab Republic', 'São Tomé and Principe', 'Tajikistan', 'Tanzania',
    'Timor-Leste', 'Togo', 'Tonga', 'Uganda',
    'Vanuatu', 'West Bank and Gaza', 'Yemen, Rep.', 'Zambia',
    'Zimbabwe'
  ];

  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-academic-navy mb-8 pb-4 border-b-4 border-academic-gold">
          Special Fee Waivers and Discounts
        </h1>

        {/* Main Content */}
        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            Aethra offers waivers and discounts to those corresponding authors who are based in low-income countries*.
          </p>

          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            The authors who wish to avail this offer should request a waiver or discount at the time of submission of their manuscripts to Aethra.
          </p>

          {/* Eligibility Heading */}
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-academic-navy mb-4 mt-12">
            Eligibility
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6 text-base md:text-lg">
            Aethra offers a 50% discount on the Open Access fee for manuscripts from corresponding authors based in countries categorized as low-income economies by the World Bank (list given below)*.
          </p>

          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            For more information regarding Publication Fee of Aethra journals, please{' '}
            <Link
              href="/information/for-authors/article-processing-charges-policy"
              className="text-academic-blue hover:text-academic-navy underline inline-flex items-center gap-1"
            >
              click here
              <FiExternalLink className="w-4 h-4" />
            </Link>
            :
          </p>

          {/* List of Countries Heading */}
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-academic-navy mb-4 mt-12">
            List of Countries
          </h2>

          {/* Countries in 4 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {countries.map((country, index) => (
              <div
                key={index}
                className="text-gray-700 text-sm md:text-base"
              >
                {country}
              </div>
            ))}
          </div>

          {/* <p className="text-gray-600 text-sm italic mb-8">
            *Countries categorized as low-income economies by the World Bank
          </p> */}
        </div>
      </div>
    </div>
  );
}
