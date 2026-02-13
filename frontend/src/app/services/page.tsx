'use client';

import Link from 'next/link';
import { FiEdit3, FiImage, FiShield, FiTarget, FiLayers, FiUserCheck, FiGitMerge, FiList, FiArrowRight, FiMail } from 'react-icons/fi';

export default function ServicesPage() {
  const authorServices = [
    {
      icon: FiEdit3,
      title: 'Language Editing',
      description: 'Our expert editors polish your manuscript for clarity, grammar, and academic style. We ensure your research communicates effectively to a global audience.',
      features: ['Grammar and punctuation', 'Academic tone refinement', 'Clarity enhancement', 'Style consistency'],
    },
    {
      icon: FiImage,
      title: 'Graphics Enhancement',
      description: 'Transform your figures and illustrations into publication-ready graphics. Our design team ensures your visuals meet journal standards.',
      features: ['Figure redesign', 'Resolution optimization', 'Color correction', 'Chart standardization'],
    },
    {
      icon: FiShield,
      title: 'Plagiarism Screening',
      description: 'Comprehensive originality checks using industry-leading tools. Receive detailed reports and guidance on addressing any concerns.',
      features: ['Full document scan', 'Detailed similarity report', 'Citation verification', 'Remediation guidance'],
    },
    {
      icon: FiTarget,
      title: 'Journal Selection',
      description: 'Expert guidance to identify the ideal journal for your research. We analyze scope, impact factors, and acceptance rates to maximize your success.',
      features: ['Scope matching', 'Impact factor analysis', 'Timeline assessment', 'Success probability'],
    },
  ];

  const publishingServices = [
    {
      icon: FiLayers,
      title: 'Journals Launching',
      description: 'End-to-end support for establishing new academic journals. From concept to first issue, we guide you through every step.',
      features: ['Strategic planning', 'Editorial board setup', 'Platform configuration', 'Marketing support'],
    },
    {
      icon: FiUserCheck,
      title: 'Managing Editor Support',
      description: 'Dedicated editorial management assistance to streamline your journal operations and maintain publication schedules.',
      features: ['Workflow management', 'Author communication', 'Deadline tracking', 'Quality assurance'],
    },
    {
      icon: FiGitMerge,
      title: 'Peer Review Management',
      description: 'Streamlined peer review coordination to ensure timely, high-quality evaluations of submitted manuscripts.',
      features: ['Reviewer matching', 'Review tracking', 'Report compilation', 'Decision support'],
    },
    {
      icon: FiList,
      title: 'Indexation Support',
      description: 'Comprehensive support for journal indexing in major databases. We help increase your journal\'s visibility and impact.',
      features: ['Application preparation', 'Compliance review', 'Submission management', 'Status monitoring'],
    },
  ];

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero Section */}
      <section className="relative bg-academic-navy text-white py-16 md:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Our Services
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Comprehensive publishing and author support services designed to help researchers 
            and journals succeed in academic publishing.
          </p>
        </div>
      </section>

      {/* Author Services */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-academic-navy mb-4">
              Author Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Support researchers in preparing high-quality manuscripts for publication
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {authorServices.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-academic-gold/10 rounded-xl flex-shrink-0">
                    <service.icon className="w-8 h-8 text-academic-gold" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-academic-navy mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-academic-gold rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Publishing Services */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-academic-navy/5 via-academic-blue/10 to-academic-navy/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-academic-navy mb-4">
              Publishing Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive solutions for journal management and publishing operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {publishingServices.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-academic-blue/10 rounded-xl flex-shrink-0">
                    <service.icon className="w-8 h-8 text-academic-blue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-academic-navy mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-academic-blue rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}





