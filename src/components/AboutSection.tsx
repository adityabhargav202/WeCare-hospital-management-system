/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, ShieldCheck, Heart, UserCheck, Flame, ThumbsUp, HelpCircle, ChevronDown, ChevronUp, CheckCircle, Activity } from 'lucide-react';
import { FAQS } from '../data/hospitalData';

export default function AboutSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const values = [
    {
      title: 'Compassionate Care',
      description: 'Treating every single patient with empathy, respect, and deep emotional sensitivity.',
      icon: Heart,
      color: 'bg-rose-50 text-rose-600 border-rose-100'
    },
    {
      title: 'Medical Excellence',
      description: 'Enforcing gold-standard clinical safety measures and rigorous continuous training.',
      icon: Award,
      color: 'bg-blue-50 text-blue-600 border-blue-100'
    },
    {
      title: 'Trust & Safety',
      description: 'Transparent treatments, fully HIPAA compliant records, and absolute security.',
      icon: ShieldCheck,
      color: 'bg-blue-50 text-blue-600 border-blue-100'
    },
    {
      title: 'Patient-First Ethics',
      description: 'Designing diagnostic strategies around patients comfort, financial transparency, and recovery pacing.',
      icon: UserCheck,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100'
    }
  ];

  const milestones = [
    { year: '1995', event: 'WeCare Health was established with a small clinical center.' },
    { year: '2012', event: 'Evolved into an internationally-accredited multi-specialty healthcare network.' },
    { year: '2018', event: 'Commissioned our state-of-the-art Diagnostics, Chemistry Labs, and surgical suites.' },
    { year: '2025', event: 'Integrated high-precision diagnostics and virtual telehealth care, serving thousands of patients annually.' },
  ];

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div id="about-section" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* About Us Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 pt-6">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            About WeCare Hospitals
          </h1>
          <p className="text-base text-slate-500 leading-relaxed font-sans">
            A legacy of excellence, a commitment to care. Discover the story behind our dedication to your health.
          </p>
        </div>

        {/* Story Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          {/* Left Column: Hospital Building Exterior Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-[32px] overflow-hidden shadow-xl border border-slate-100 bg-white p-3 group">
              <img
                src="/src/assets/images/wecare_hospital_exterior_1783418364502.jpg"
                alt="WeCare Hospital Building Exterior"
                referrerPolicy="no-referrer"
                className="rounded-[24px] w-full h-[460px] object-cover hover:scale-[1.03] transition-transform duration-500"
              />
            </div>
          </div>

          {/* Right Column: Philosophy & Vision Text */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono block">Clinical Excellence</span>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Our Core Philosophy & Vision</h2>
            <div className="space-y-4 text-slate-600 leading-relaxed text-sm">
              <p>
                At <strong>WeCare Hospitals</strong>, we believe that healing is a holistic journey that extends far beyond clinical treatments and prescriptions. Our foundational approach integrates the highest standards of modern medical science with deep-rooted empathy, comfort, and respect for every individual.
              </p>
              <p>
                We are dedicated to fostering absolute transparency between our medical experts and patients' families. By continuously upgrading our clinical protocols and investing in clinical research, we ensure that every therapeutic pathway is customized to the patient's unique lifestyle and long-term well-being.
              </p>
            </div>

            {/* Bullet Points with Checkmark Icon in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pt-6 border-t border-slate-100">
              <div className="flex items-center space-x-3 text-slate-700">
                <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <span className="text-sm font-semibold">25+ Years of Experience</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-700">
                <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <span className="text-sm font-semibold">500+ Medical Professionals</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-700">
                <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <span className="text-sm font-semibold">State-of-the-art Facilities</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-700">
                <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <span className="text-sm font-semibold">24/7 Emergency Service</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-700">
                <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <span className="text-sm font-semibold">Patient-Centric Approach</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-700">
                <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <span className="text-sm font-semibold">Award-winning Care</span>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Diagnostics and Facilities Showcase */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono block mb-2">Our Infrastructure</span>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Advanced Diagnostics & Facilities</h2>
            <p className="text-sm text-slate-500 mt-2">Explore our modern lab setups and clinical zones designed for safe, sterile, and rapid results.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Laboratory Card */}
            <div className="group relative bg-white p-4 rounded-[32px] shadow-lg border border-slate-100 overflow-hidden">
              <div className="relative rounded-[24px] overflow-hidden h-72">
                <img
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"
                  alt="WeCare Clinical Laboratory"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider font-mono">
                  Advanced Laboratory
                </span>
              </div>
              <div className="p-4">
                <h4 className="text-base font-bold text-slate-800 tracking-tight">Diagnostics & Pathology Labs</h4>
                <p className="text-xs text-slate-500 mt-1">Equipped with automated pathology chemistry analyzers, molecular diagnostic devices, and high-precision testing instruments for fast and precise findings.</p>
              </div>
            </div>

            {/* Facility Card */}
            <div className="group relative bg-white p-4 rounded-[32px] shadow-lg border border-slate-100 overflow-hidden">
              <div className="relative rounded-[24px] overflow-hidden h-72">
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"
                  alt="WeCare Healthcare Facility"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 bg-emerald-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider font-mono">
                  Smart Medical Facility
                </span>
              </div>
              <div className="p-4">
                <h4 className="text-base font-bold text-slate-800 tracking-tight">Outpatient & Consultation Suites</h4>
                <p className="text-xs text-slate-500 mt-1">Serene primary reception lounges, comfortable seating areas, sterile clinical cabins, and welcoming layout to minimize hospital anxiety.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Core Values */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono block mb-2">Our Pillars</span>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">The Core Values we live by every day</h2>
            <p className="text-sm text-slate-500 mt-2">Every clinician, nurse, and administrator at WelCare adheres to the highest medical ethics and compassionate standards.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, idx) => (
              <div key={idx} className="p-6 rounded-[32px] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
                <div className={`p-3 rounded-xl inline-block border mb-4 ${v.color}`}>
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800 tracking-tight mb-2">{v.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Milestones */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-4">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono block mb-2">Our History</span>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">A Journey of Expansion and Excellence</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              We started with a vision to make premium, specialized hospital care accessible. Over the last decade, we have consistently hit global clinical milestones, expanding our physical capacity and tech portfolio.
            </p>
          </div>
          <div className="lg:col-span-8 space-y-6">
            {milestones.map((item, idx) => (
              <div key={idx} className="flex space-x-6 border-l-2 border-blue-100 pl-6 relative">
                <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-50" />
                <div className="flex-shrink-0">
                  <span className="font-mono text-lg font-extrabold text-blue-600 block">{item.year}</span>
                </div>
                <div>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="bg-slate-50 rounded-[32px] p-8 sm:p-12 border border-slate-100">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono block mb-2">Help Center</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-sm text-slate-500 mt-2">Find answers to general questions about consulting, clinical procedures, and online appointment management.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {FAQS.map((faq, idx) => (
              <div 
                key={idx}
                id={`faq-item-${idx}`}
                className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm transition-all"
              >
                <button
                  id={`faq-toggle-${idx}`}
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex justify-between items-center px-6 py-4.5 text-left focus:outline-none hover:bg-slate-50 transition-colors"
                >
                  <span className="font-sans text-sm font-semibold text-slate-800 pr-4">
                    {faq.question}
                  </span>
                  {openFaq === idx ? (
                    <ChevronUp className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                
                {openFaq === idx && (
                  <div className="px-6 pb-5 pt-1 text-xs text-slate-600 border-t border-slate-50 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
