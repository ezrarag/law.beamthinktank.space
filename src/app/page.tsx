'use client';

import { useState } from 'react';
import Link from 'next/link';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, firebaseConfigured } from '@/lib/firebase';
import { CHAPTERS, trackForIssue } from '@/lib/domain';
import { 
  Scale, 
  Shield, 
  Building2, 
  Mail, 
  Phone, 
  MapPin,
  Heart,
  ArrowRight
} from 'lucide-react';

export default function Home() {
  const [selectedCity, setSelectedCity] = useState('');
  const [donationAmount, setDonationAmount] = useState(50);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    legalIssue: '',
    message: ''
  });
  const [submitState, setSubmitState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const cities = CHAPTERS.map((chapter) => chapter.city);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseConfigured) return setSubmitState('error');
    setSubmitState('saving');
    try {
      const chapter = CHAPTERS.find((item) => item.city === contactForm.city);
      await addDoc(collection(db, 'cases'), {
        clientName: contactForm.name.trim(), email: contactForm.email.trim().toLowerCase(), phone: contactForm.phone.trim(),
        city: contactForm.city, chapterId: chapter?.id ?? null, issueType: contactForm.legalIssue,
        message: contactForm.message.trim(), trackId: trackForIssue(contactForm.legalIssue), phase: 'New',
        assignedParticipantId: null, linkedOrgId: chapter?.id ?? null, source: 'public_intake',
        createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      });
      setContactForm({ name: '', email: '', phone: '', city: '', legalIssue: '', message: '' });
      setSubmitState('saved');
    } catch (error) {
      console.error(error);
      setSubmitState('error');
    }
  };

  const handleDonation = () => {
    // Handle donation - integrate with Stripe later
    console.log('Donation amount:', donationAmount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Scale className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">BEAM Law & Justice League</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#services" className="text-gray-700 hover:text-blue-600 transition-colors">Services</a>
              <a href="#donate" className="text-gray-700 hover:text-blue-600 transition-colors">Donate</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
              <Link href="/join" className="text-gray-700 hover:text-blue-600 transition-colors">Volunteer</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Justice for All
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Empowering communities through legal aid, intellectual property support, and governance reform. 
            Join the fight for justice and equality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#services" 
              className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center"
            >
              Our Services <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a 
              href="#donate" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors"
            >
              Support Our Mission
            </a>
          </div>
        </div>
      </section>

      {/* City Selector */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Find Your Local Chapter</h2>
          <div className="max-w-md mx-auto">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select your city</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            {selectedCity && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-900">
                  <MapPin className="inline h-5 w-5 mr-2" />
                  Legal aid services available in {selectedCity}
                </p>
                <button className="mt-2 text-blue-600 hover:text-blue-800 font-medium">
                  Contact Local Chapter →
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive legal support for communities in need
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Legal Aid */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Scale className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Legal Aid</h3>
              <p className="text-gray-600 mb-6">
                Free legal assistance for individuals and families facing legal challenges. 
                Our volunteer attorneys provide guidance and representation.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Family law support</li>
                <li>• Housing assistance</li>
                <li>• Employment rights</li>
                <li>• Immigration help</li>
              </ul>
            </div>

            {/* IP Support */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">IP Support</h3>
              <p className="text-gray-600 mb-6">
                Protecting intellectual property rights for creators, inventors, and businesses. 
                Expert guidance on patents, trademarks, and copyrights.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Patent applications</li>
                <li>• Trademark registration</li>
                <li>• Copyright protection</li>
                <li>• IP litigation support</li>
              </ul>
            </div>

            {/* Governance Reform */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Building2 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Governance Reform</h3>
              <p className="text-gray-600 mb-6">
                Advocating for systemic change and policy reform. 
                Working with communities to create fair and just governance structures.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Policy advocacy</li>
                <li>• Community organizing</li>
                <li>• Legislative support</li>
                <li>• Civic education</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section id="donate" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white">
            <Heart className="h-16 w-16 mx-auto mb-6 text-red-200" />
            <h2 className="text-3xl font-bold mb-4">Support Our Mission</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Your donation helps us provide free legal services, support communities, 
              and fight for justice and equality across the nation.
            </p>
            
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-2 mb-6">
                {[25, 50, 100, 250, 500].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setDonationAmount(amount)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      donationAmount === amount
                        ? 'bg-white text-blue-600'
                        : 'bg-blue-500 text-white hover:bg-blue-400'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              
              <div className="mb-6">
                <input
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 border-0 rounded-lg text-gray-900 font-medium text-center"
                  placeholder="Enter amount"
                />
              </div>
              
              <button
                onClick={handleDonation}
                className="w-full bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors"
              >
                Donate Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Legal Help</h2>
                          <p className="text-xl text-gray-600">
                Need legal assistance? Contact us and we&apos;ll connect you with the right resources.
              </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <select
                    value={contactForm.city}
                    onChange={(e) => setContactForm({...contactForm, city: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select your city</option>
                    {CHAPTERS.map((chapter) => <option key={chapter.id} value={chapter.city}>{chapter.city}</option>)}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Legal Issue Type</label>
                <select
                  value={contactForm.legalIssue}
                  onChange={(e) => setContactForm({...contactForm, legalIssue: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select an issue type</option>
                  <option value="family">Family Law</option>
                  <option value="housing">Housing</option>
                  <option value="employment">Employment</option>
                  <option value="immigration">Immigration</option>
                  <option value="ip">Intellectual Property</option>
                  <option value="governance">Governance Reform</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Please describe your legal issue and how we can help..."
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={submitState === 'saving'}
                className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors"
              >
                {submitState === 'saving' ? 'Submitting…' : 'Submit Request'}
              </button>
              {submitState === 'saved' && <p className="text-center text-green-700">Your request was received. Our intake team will review it.</p>}
              {submitState === 'error' && <p className="text-center text-red-700">We could not submit your request. Please check the site configuration and try again.</p>}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Scale className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">BEAM Law & Justice League</span>
              </div>
              <p className="text-gray-300 mb-4">
                Empowering communities through legal aid, IP support, and governance reform. 
                Join us in the fight for justice and equality.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#donate" className="hover:text-white transition-colors">Donate</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><Link href="/join" className="hover:text-white transition-colors">Volunteer / Join the Team</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>info@beamlaw.org</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>(555) 123-4567</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BEAM Law & Justice League. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
