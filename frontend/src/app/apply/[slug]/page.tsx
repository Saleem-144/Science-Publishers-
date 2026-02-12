'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { FiUpload, FiSend, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import { journalsApi, ctaButtonsApi } from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

const TITLES = ['Mr.', 'Mrs.', 'Ms.', 'Prof.', 'Dr.'];

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast",
  "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway",
  "Oman",
  "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
  "Yemen",
  "Zambia", "Zimbabwe"
];

export default function ApplicationPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const { data: button, isLoading: buttonLoading } = useQuery({
    queryKey: ['cta-button', slug],
    queryFn: () => ctaButtonsApi.getBySlug(slug as string),
    enabled: !!slug,
  });

  const { data: journals } = useQuery({
    queryKey: ['journals-list'],
    queryFn: () => journalsApi.list(),
  });

  const journalsList = journals?.results || journals || [];

  const [formData, setFormData] = useState({
    title: '',
    first_name: '',
    last_name: '',
    email: '',
    qualification: '',
    affiliation: '',
    journal: '',
    country: '',
    expertise: '',
    orcid_id: '',
    scopus_id: '',
    comments: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile) {
      toast.error('Please upload your CV');
      return;
    }

    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('button', String(button.id));
      submitData.append('cv_file', cvFile);
      
      Object.entries(formData).forEach(([key, value]) => {
        if (value) submitData.append(key, value);
      });

      await ctaButtonsApi.submitForm(submitData);
      setSubmitted(true);
      toast.success('Form submitted successfully!');
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error('Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (buttonLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <div className="animate-spin w-10 h-10 border-4 border-academic-navy border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!button) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-ivory p-4 text-center">
        <h1 className="text-4xl font-serif font-bold text-academic-navy mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">The application page you are looking for does not exist or has been moved.</p>
        <Link href="/" className="px-6 py-3 bg-academic-navy text-white font-bold rounded-lg hover:bg-academic-blue transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory p-4">
        <div className="bg-white rounded-3xl p-12 max-w-2xl w-full text-center space-y-8 shadow-xl animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-gray-900">Application Received!</h2>
          <div className="space-y-4">
            <p className="text-xl text-gray-600 leading-relaxed">
              Your application for <strong>{button.label}</strong> has been submitted successfully.
            </p>
            <p className="text-gray-500">
              Our editorial team will review your qualifications and contact you at <strong>{formData.email}</strong> soon.
            </p>
          </div>
          <div className="pt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-academic-navy text-white font-bold rounded-xl hover:bg-academic-blue transition-all shadow-lg hover:shadow-academic-navy/30"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      {/* Page Header - Full Width */}
      <div className="bg-academic-navy text-white p-8 md:p-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-blue-300 hover:text-white font-bold mb-8 transition-colors group"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">{button.label}</h1>
          <p className="text-blue-100 text-xl md:text-2xl max-w-3xl opacity-90 leading-relaxed">
            Join our community of academic experts. Please provide your professional details to begin the application process.
          </p>
        </div>
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-academic-gold/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>
      </div>

      {/* Form Content - Centered with Max Width for readability but larger than before */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-12 md:py-20">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 md:p-16 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Personal Info */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b-2 border-academic-gold/20">
                  <div className="w-8 h-8 bg-academic-gold/10 rounded-lg flex items-center justify-center">
                    <span className="text-academic-gold font-bold">01</span>
                  </div>
                  <h3 className="text-xl font-bold text-academic-navy">Personal Details</h3>
                </div>
                
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Title *</label>
                  <select
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-academic-blue focus:bg-white rounded-xl outline-none transition-all"
                  >
                    <option value="">Select Title</option>
                    {TITLES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">First Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-academic-blue focus:bg-white rounded-xl outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-academic-blue focus:bg-white rounded-xl outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-academic-blue focus:bg-white rounded-xl outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Country *</label>
                  <select
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-academic-blue focus:bg-white rounded-xl outline-none transition-all"
                  >
                    <option value="">Select Country</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Professional Info */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b-2 border-academic-gold/20">
                  <div className="w-8 h-8 bg-academic-gold/10 rounded-lg flex items-center justify-center">
                    <span className="text-academic-gold font-bold">02</span>
                  </div>
                  <h3 className="text-xl font-bold text-academic-navy">Professional Details</h3>
                </div>
                
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Last Academic Qualification *</label>
                  <input
                    type="text"
                    required
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    placeholder="e.g. Ph.D. in Computer Science"
                    className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-academic-blue focus:bg-white rounded-xl outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Affiliation / Institution *</label>
                  <input
                    type="text"
                    required
                    value={formData.affiliation}
                    onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                    placeholder="University or Research Center"
                    className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-academic-blue focus:bg-white rounded-xl outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Target Journal *</label>
                  <select
                    required
                    value={formData.journal}
                    onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
                    className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-academic-blue focus:bg-white rounded-xl outline-none transition-all"
                  >
                    <option value="">Choose a Journal</option>
                    {journalsList.map((j: any) => (
                      <option key={j.id} value={j.id}>{j.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Field of Expertise *</label>
                  <input
                    type="text"
                    required
                    value={formData.expertise}
                    onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                    className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-academic-blue focus:bg-white rounded-xl outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b-2 border-academic-gold/20">
                  <div className="w-8 h-8 bg-academic-gold/10 rounded-lg flex items-center justify-center">
                    <span className="text-academic-gold font-bold">03</span>
                  </div>
                  <h3 className="text-xl font-bold text-academic-navy">Identifiers</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">ORCID ID</label>
                    <input
                      type="text"
                      value={formData.orcid_id}
                      onChange={(e) => setFormData({ ...formData, orcid_id: e.target.value })}
                      placeholder="0000-0000-..."
                      className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-academic-blue focus:bg-white rounded-xl outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Scopus ID</label>
                    <input
                      type="text"
                      value={formData.scopus_id}
                      onChange={(e) => setFormData({ ...formData, scopus_id: e.target.value })}
                      className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-academic-blue focus:bg-white rounded-xl outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b-2 border-academic-gold/20">
                  <div className="w-8 h-8 bg-academic-gold/10 rounded-lg flex items-center justify-center">
                    <span className="text-academic-gold font-bold">04</span>
                  </div>
                  <h3 className="text-xl font-bold text-academic-navy">Curriculum Vitae</h3>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Upload CV * (PDF/DOCX)</label>
                  <div className="relative">
                    <input
                      type="file"
                      required
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="cv-upload-page"
                    />
                    <label
                      htmlFor="cv-upload-page"
                      className="flex items-center justify-between px-5 py-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-academic-blue hover:bg-blue-50 transition-all group"
                    >
                      <span className="text-gray-600 truncate mr-4">
                        {cvFile ? cvFile.name : 'Click to upload your CV'}
                      </span>
                      <FiUpload className="text-gray-400 group-hover:text-academic-blue flex-shrink-0" />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Comments / Additional Information</label>
              <textarea
                rows={4}
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                placeholder="Tell us more about your experience and why you'd like to join..."
                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-academic-blue focus:bg-white rounded-xl outline-none transition-all resize-none"
              />
            </div>

            {/* Form Actions */}
            <div className="pt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-academic-navy text-white text-lg font-bold rounded-2xl hover:bg-academic-blue transition-all shadow-xl hover:shadow-academic-navy/30 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <FiSend className="text-xl" />
                    Submit Application
                  </>
                )}
              </button>
              <p className="text-center text-sm text-gray-400 mt-6">
                * All fields marked with an asterisk are mandatory for application processing.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

