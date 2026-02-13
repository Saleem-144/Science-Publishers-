'use client';

import Link from 'next/link';
import { FiTarget, FiEye, FiAward, FiUsers, FiGlobe, FiShield, FiArrowRight } from 'react-icons/fi';

export default function AboutPage() {
  const values = [
    {
      icon: FiShield,
      title: 'Integrity',
      description: 'We uphold the highest standards of publication ethics and scientific integrity.',
    },
    {
      icon: FiGlobe,
      title: 'Open Access',
      description: 'We believe scientific knowledge should be freely accessible to everyone.',
    },
    {
      icon: FiUsers,
      title: 'Collaboration',
      description: 'We foster global collaboration among researchers and institutions.',
    },
    {
      icon: FiAward,
      title: 'Excellence',
      description: 'We strive for excellence in every publication we release.',
    },
  ];

  const stats = [
    { value: '50+', label: 'Journals' },
    { value: '10,000+', label: 'Published Articles' },
    { value: '25,000+', label: 'Authors Worldwide' },
    { value: '150+', label: 'Countries Reached' },
  ];

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero Section */}
      <section className="bg-academic-navy text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              About Aethra Science Publishers
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              We are dedicated to advancing scientific knowledge through high-quality, 
              peer-reviewed academic publications that serve researchers and scholars worldwide.
          </p>
        </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-academic-gold/10 rounded-xl">
                  <FiTarget className="w-8 h-8 text-academic-gold" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-academic-navy">Our Mission</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To provide a platform for researchers to share their discoveries with the global 
                scientific community. We are committed to maintaining rigorous peer review standards 
                while making research accessible to all who seek knowledge.
              </p>
      </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-academic-blue/10 rounded-xl">
                  <FiEye className="w-8 h-8 text-academic-blue" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-academic-navy">Our Vision</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To become a leading global publisher recognized for excellence in scientific 
                publishing, innovation in research dissemination, and unwavering commitment 
                to advancing human knowledge across all disciplines.
                </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-br from-academic-navy/5 via-academic-blue/10 to-academic-navy/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-academic-navy mb-2">
                  {stat.value}
                </p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
          </div>
        </section>

      {/* Our Values */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-academic-navy mb-4">
              Our Core Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do at Aethra Science Publishers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                <div className="inline-flex p-3 bg-academic-navy/10 rounded-xl mb-4">
                  <value.icon className="w-6 h-6 text-academic-navy" />
                </div>
                <h3 className="text-lg font-bold text-academic-navy mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
          </div>
        </section>

    </div>
  );
}
