/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Calendar, Stethoscope, Award, Activity, ShieldCheck, HeartPulse, ChevronRight, Clock, RefreshCw, AlertTriangle, Users, CheckCircle, Star, HelpCircle, Shield, ArrowRight, Video, FileText, Check, ChevronDown, Sparkles, Building, PhoneCall, Heart, X } from 'lucide-react';

interface HeroProps {
  onNavigate: (page: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const [activeTab, setActiveTab] = useState<'lobby' | 'triage'>('lobby');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  // Interactive component states
  const [activeStep, setActiveStep] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [tipsCategory, setTipsCategory] = useState<'cardio' | 'lifestyle' | 'nutrition'>('cardio');
  const [activeGalleryTab, setActiveGalleryTab] = useState<'icu' | 'lab' | 'consult' | 'lounge'>('icu');
  const [hoveredDept, setHoveredDept] = useState<number | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<any | null>(null);

  // Real-time telemetry simulated states
  const [triageData, setTriageData] = useState({
    cardiology: 12,
    neurology: 35,
    orthopedics: 22,
    pediatrics: 5,
    ophthalmology: 18,
    oncology: 8,
    icuOccupancy: 84,
    activeEmergencies: 3,
    activeSpecialists: 14,
    lastUpdated: 'Just now'
  });

  const handleSimulateUpdate = () => {
    setIsUpdating(true);
    setUpdateSuccess(false);
    setTimeout(() => {
      setTriageData({
        cardiology: Math.floor(8 + Math.random() * 12),
        neurology: Math.floor(25 + Math.random() * 20),
        orthopedics: Math.floor(15 + Math.random() * 15),
        pediatrics: Math.floor(3 + Math.random() * 8),
        ophthalmology: Math.floor(10 + Math.random() * 12),
        oncology: Math.floor(4 + Math.random() * 10),
        icuOccupancy: Math.floor(78 + Math.random() * 18),
        activeEmergencies: Math.floor(1 + Math.random() * 5),
        activeSpecialists: Math.floor(12 + Math.random() * 6),
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      });
      setIsUpdating(false);
      setUpdateSuccess(true);
    }, 750);
  };

  // Auto hide success badge after 3 seconds
  useEffect(() => {
    if (updateSuccess) {
      const timer = setTimeout(() => setUpdateSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess]);
  const stats = [
    { label: 'Active Specialists', value: '45+', icon: Stethoscope, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Clinical Departments', value: '5', icon: HeartPulse, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Patients Cared For', value: '15,000+', icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Quality Accreditation', value: '100%', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const QuickCards = [
    {
      title: 'Schedule Consultation',
      description: 'Book your in-person or telehealth visit with a certified doctor instantly.',
      cta: 'Book Appointment',
      page: 'book',
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
      textColor: 'text-blue-100',
      iconBg: 'bg-blue-500'
    },
    {
      title: 'Our Specializations',
      description: 'Explore our 5 core medical divisions engineered with advanced diagnostic care.',
      cta: 'View Departments',
      page: 'departments',
      color: 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-100 shadow-sm',
      textColor: 'text-slate-500',
      iconBg: 'bg-slate-100 text-slate-600'
    },
    {
      title: 'Meet Our Experts',
      description: 'Find, compare, and connect with board-certified consultants in your area.',
      cta: 'Search Doctors',
      page: 'doctors',
      color: 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-100 shadow-sm',
      textColor: 'text-slate-500',
      iconBg: 'bg-slate-100 text-slate-600'
    }
  ];

  return (
    <div id="hero-section" className="relative bg-gradient-to-b from-slate-50 via-white to-white pb-16 pt-8">
      {/* Background design elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-50/40 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-50/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero text and details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
              <Award className="h-4 w-4" />
              <span>WeCare Health System — Certified Excellence</span>
            </div>
            
            <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1]">
              Your <span className="text-blue-600">Health</span>, Our <span className="text-blue-600">Highest Priority</span>.
            </h1>
            
            <p className="font-sans text-lg text-slate-600 max-w-xl leading-relaxed">
              Experience modern medical infrastructure, world-class diagnostics, and highly empathetic specialists committed to delivering personalized healthcare treatments.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                id="hero-book-btn"
                onClick={() => onNavigate('book')}
                className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all hover:scale-[1.01]"
              >
                <Calendar className="h-5 w-5" />
                <span>Book Appointment Now</span>
              </button>
              
              <button
                id="hero-doctors-btn"
                onClick={() => onNavigate('doctors')}
                className="flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-8 py-3.5 rounded-xl font-semibold transition-all"
              >
                <span>Consult Our Doctors</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Hero Image & Live Triage Dashboard Tabs switcher */}
          <div className="lg:col-span-5 relative">
            {/* Tab switchers */}
            <div className="flex bg-slate-100/90 p-1 rounded-2xl mb-4 border border-slate-200/50 max-w-[340px] mx-auto lg:mx-0 shadow-sm">
              <button
                id="tab-lobby-btn"
                onClick={() => setActiveTab('lobby')}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                  activeTab === 'lobby'
                    ? 'bg-white text-blue-600 shadow-md border border-slate-200/30'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Hospital Lobby</span>
              </button>
              <button
                id="tab-triage-btn"
                onClick={() => setActiveTab('triage')}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                  activeTab === 'triage'
                    ? 'bg-white text-blue-600 shadow-md border border-slate-200/30'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Live Triage Tracker</span>
              </button>
            </div>

            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative borders with standard high curvature */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-blue-100/80 to-indigo-100/80 rounded-[36px] blur-md opacity-70" />
              
              {activeTab === 'lobby' ? (
                <div className="relative bg-white p-3 rounded-[32px] shadow-xl border border-slate-100 overflow-hidden transition-all duration-300">
                  <img
                    src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1600"
                    alt="WelCare Hospital Modern Lobby"
                    referrerPolicy="no-referrer"
                    className="rounded-[24px] w-full h-[380px] object-cover hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Float Clinical Assurance Badge */}
                  <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-slate-100 flex items-center space-x-4">
                    <div className="p-3 bg-blue-500 text-white rounded-xl">
                      <Activity className="h-6 w-6 animate-pulse" />
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-blue-600 uppercase tracking-widest font-mono">Emergency Services</span>
                      <span className="block text-base font-bold text-slate-800 leading-tight">24/7 Priority Emergency Care</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Interactive Live Triage Dashboard Panel */
                <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-[32px] shadow-xl border border-slate-800 text-white min-h-[404px] flex flex-col justify-between overflow-hidden transition-all duration-300">
                  {/* Glowing ambient background glow inside dashboard */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                          </span>
                          <h4 className="text-sm font-bold tracking-tight text-white uppercase font-mono">Live ER & Clinic Telemetry</h4>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">Last Synced: {triageData.lastUpdated}</p>
                      </div>
                      
                      {/* Simulation Button */}
                      <button
                        onClick={handleSimulateUpdate}
                        disabled={isUpdating}
                        className="p-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800/50 text-slate-200 hover:text-white rounded-xl transition-all border border-slate-700 flex items-center space-x-1.5 shadow-sm active:scale-95 cursor-pointer disabled:cursor-not-allowed"
                        title="Simulate patient flows"
                      >
                        <RefreshCw className={`h-3.5 w-3.5 ${isUpdating ? 'animate-spin text-blue-400' : ''}`} />
                        <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Simulate Feed</span>
                      </button>
                    </div>

                    {/* Quick Simulation Banner Success */}
                    {updateSuccess && (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center space-x-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                        <span>Telemetry updated: Fresh patient inflows integrated.</span>
                      </div>
                    )}

                    {/* Clinic Metrics Grid */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-slate-800/50 border border-slate-800/80 p-2.5 rounded-2xl flex flex-col justify-between">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">ICU Occupancy</span>
                        <div className="mt-1">
                          <span className="text-base font-extrabold text-white tracking-tight">{triageData.icuOccupancy}%</span>
                          <div className="w-full bg-slate-700 h-1 rounded-full mt-1 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${triageData.icuOccupancy > 90 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                              style={{ width: `${triageData.icuOccupancy}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-800/50 border border-slate-800/80 p-2.5 rounded-2xl flex flex-col justify-between">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Active ER Cases</span>
                        <div className="mt-1 flex items-baseline space-x-1">
                          <span className="text-base font-extrabold text-rose-400 tracking-tight">{triageData.activeEmergencies}</span>
                          <span className="text-[9px] font-bold text-rose-500/70 font-mono">Critical</span>
                        </div>
                      </div>

                      <div className="bg-slate-800/50 border border-slate-800/80 p-2.5 rounded-2xl flex flex-col justify-between">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Staff on Floor</span>
                        <div className="mt-1 flex items-baseline space-x-1">
                          <span className="text-base font-extrabold text-blue-400 tracking-tight">{triageData.activeSpecialists}</span>
                          <span className="text-[9px] font-bold text-blue-500/70 font-mono">MDs</span>
                        </div>
                      </div>
                    </div>

                    {/* Live Wait Times List */}
                    <div className="space-y-2 border-t border-slate-800/80 pt-3">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono block mb-1">Clinic Status & Wait Times</span>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {/* Cardiology */}
                        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/50 border border-slate-800/50">
                          <span className="text-[11px] font-semibold text-slate-300">Cardiology</span>
                          <span className={`text-[11px] font-extrabold px-1.5 py-0.5 rounded-md font-mono ${triageData.cardiology > 18 ? 'text-amber-400 bg-amber-400/10' : 'text-emerald-400 bg-emerald-400/10'}`}>
                            {triageData.cardiology}m
                          </span>
                        </div>

                        {/* Neurology */}
                        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/50 border border-slate-800/50">
                          <span className="text-[11px] font-semibold text-slate-300">Neurology</span>
                          <span className="text-[11px] font-extrabold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-md font-mono">
                            {triageData.neurology}m
                          </span>
                        </div>

                        {/* Pediatrics */}
                        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/50 border border-slate-800/50">
                          <span className="text-[11px] font-semibold text-slate-300">Pediatrics</span>
                          <span className={`text-[11px] font-extrabold px-1.5 py-0.5 rounded-md font-mono ${triageData.pediatrics > 10 ? 'text-amber-400 bg-amber-400/10' : 'text-emerald-400 bg-emerald-400/10'}`}>
                            {triageData.pediatrics}m
                          </span>
                        </div>

                        {/* Orthopedics */}
                        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/50 border border-slate-800/50">
                          <span className="text-[11px] font-semibold text-slate-300">Orthopedics</span>
                          <span className="text-[11px] font-extrabold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-md font-mono">
                            {triageData.orthopedics}m
                          </span>
                        </div>

                        {/* Ophthalmology */}
                        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/50 border border-slate-800/50">
                          <span className="text-[11px] font-semibold text-slate-300">Ophthalmology</span>
                          <span className="text-[11px] font-extrabold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-md font-mono">
                            {triageData.ophthalmology}m
                          </span>
                        </div>

                        {/* Oncology */}
                        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/50 border border-slate-800/50">
                          <span className="text-[11px] font-semibold text-slate-300">Oncology</span>
                          <span className="text-[11px] font-extrabold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-md font-mono">
                            {triageData.oncology}m
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Diagnostic Footer Info */}
                  <div className="text-[10px] text-slate-500 font-medium flex justify-between items-center border-t border-slate-800 pt-3 mt-4">
                    <span>Priority Emergency Intake Active</span>
                    <span className="flex items-center text-emerald-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                      Online Telemetry
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Our Story Section */}
        <div id="hero-our-story" className="border-t border-slate-100 mt-20 pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
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

            {/* Right Column: Story Text */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono block">Our Legacy</span>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Our Story</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed text-sm">
                <p>
                  Founded in 1995, <strong>WeCare Hospitals</strong> began with a simple yet profound mission: to provide accessible, high-quality healthcare to our community. Over the decades, we have grown from a small clinic into a multi-specialty medical center, but our core values remain unchanged.
                </p>
                <p>
                  Today, we are proud to be a leading healthcare provider, equipped with edge technology and staffed by some of the most respected medical professionals in the country. We believe in treating not just the illness, but the whole person.
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
        </div>

        {/* Interactive Visual Facility Walkthrough */}
        <div id="hero-gallery" className="border-t border-slate-100 mt-24 pt-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono bg-blue-50 px-3 py-1 rounded-full">Interactive Walkthrough</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 tracking-tight">Tour Our Virtual Healthcare Campus</h2>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">Explore our state-of-the-art medical environments and advanced clinical spaces designed for speed, safety, and comfort.</p>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-[32px] p-6 sm:p-8 shadow-sm">
            {/* Gallery Tabs Selector */}
            <div className="flex flex-wrap justify-center gap-2 mb-8 bg-slate-200/50 p-1.5 rounded-2xl max-w-2xl mx-auto border border-slate-300/20">
              {[
                { id: 'icu', label: 'Advanced ICU Rooms' },
                { id: 'lab', label: 'Automated Lab Hub' },
                { id: 'consult', label: 'Physician Suites' },
                { id: 'lounge', label: 'Pediatric Lounge' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveGalleryTab(tab.id as any)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeGalleryTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/15'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Gallery Details with Large Interactive Photo Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Visual Image Left */}
              <div className="lg:col-span-7 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl blur-md opacity-25 group-hover:opacity-40 transition-opacity" />
                <div className="relative rounded-[24px] overflow-hidden border border-slate-200/60 shadow-md bg-white">
                  <img
                    src={
                      activeGalleryTab === 'icu'
                        ? 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200'
                        : activeGalleryTab === 'lab'
                        ? 'https://images.unsplash.com/photo-1579154204601-01588f351167?auto=format&fit=crop&q=80&w=1200'
                        : activeGalleryTab === 'consult'
                        ? 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=1200'
                        : 'https://images.unsplash.com/photo-1502740479091-6398b19d99f4?auto=format&fit=crop&q=80&w=1200'
                    }
                    alt={activeGalleryTab}
                    className="w-full h-[320px] sm:h-[420px] object-cover transition-all duration-700 hover:scale-[1.03]"
                  />
                  <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold font-mono px-3 py-1.5 rounded-full flex items-center space-x-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Verified Gallery Asset</span>
                  </div>
                </div>
              </div>

              {/* Tech specifications details Right */}
              <div className="lg:col-span-5 space-y-6">
                <span className="text-[10px] font-bold font-mono text-blue-600 bg-blue-100/60 px-3 py-1 rounded-full uppercase tracking-wider">
                  {activeGalleryTab.toUpperCase()} INFRASTRUCTURE
                </span>
                
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                  {activeGalleryTab === 'icu'
                    ? 'High-Field Smart Inpatient ICU Unit'
                    : activeGalleryTab === 'lab'
                    ? 'Robotic Diagnostic & Pathology Lab Hub'
                    : activeGalleryTab === 'consult'
                    ? 'Ergonomic Physician Consulting Chambers'
                    : 'Comforting Pediatric Care & Play Lounge'}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {activeGalleryTab === 'icu'
                    ? 'Featuring state-of-the-art, fully networked central telemetry channels that transmit high-fidelity vitals straight to emergency consultants’ mobile tablets in real-time.'
                    : activeGalleryTab === 'lab'
                    ? 'Equipped with the latest automated blood assay analyzers, liquid-handling robots, and advanced molecular pathology systems for same-day reliable results.'
                    : activeGalleryTab === 'consult'
                    ? 'Expertly designed chambers optimized for total patient privacy, emotional comfort, and high-clarity consultation, featuring seamless electronic health record integration.'
                    : 'A warm, inviting children’s diagnostic room and play station built specifically to minimize clinical anxiety and foster a fun, soothing atmosphere.'}
                </p>

                <ul className="space-y-3 pt-2">
                  {(activeGalleryTab === 'icu'
                    ? ['Continuous automated telemetry loggers', 'HIPAA-grade remote nurse call feeds', 'Advanced physiological monitor screens', 'In-unit positive air ventilation chambers']
                    : activeGalleryTab === 'lab'
                    ? ['High-volume fully automated pipetting systems', 'Real-time blood analysis & sequencing', 'Same-day clinical diagnostic PDF logs', 'Direct cloud-portal integration']
                    : activeGalleryTab === 'consult'
                    ? ['Dual high-contrast diagnostic screens', 'Wheelchair-accessible clinical entryways', 'Private consult spaces with ambient acoustic insulation', 'Instant digital medicine prescription writing']
                    : ['Hypoallergenic clinical interactive play toys', 'Fascinating space and deep ocean digital story walls', 'Soothing warm-spectrum LED lighting', 'Fully certified pediatric nursing chairs']
                  ).map((bullet, bidx) => (
                    <li key={bidx} className="flex items-start space-x-2 text-xs font-semibold text-slate-700">
                      <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 flex">
                  <button
                    onClick={() => onNavigate('book')}
                    className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md shadow-blue-600/10 hover:shadow-blue-600/25"
                  >
                    <span>Schedule a Visit Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Specialties Grid Showcase */}
        <div id="hero-specialties-showcase" className="border-t border-slate-100 mt-24 pt-16">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono bg-blue-50 px-3 py-1 rounded-full">Excellence in Care</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 tracking-tight">Featured Specialty Divisions</h2>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">We operate five clinical centers of excellence, blending stellar practitioners with superior image-guided diagnostic infrastructure.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Cardiovascular Care',
                description: 'Complete preventative screens, structural intervention, electrophysiology, and advanced coronary therapeutics.',
                image: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&q=80&w=600',
                count: '12 Cardiologists',
              },
              {
                title: 'Neurological Sciences',
                description: 'Expert diagnostics for neural complications, spinal treatment, neurosurgery, and memory-cognitive support programs.',
                image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=600',
                count: '8 Neurologists',
              },
              {
                title: 'Pediatrics & Neonatology',
                description: 'Child-safe vaccinations, newborn developmental support, comprehensive pediatric emergency units, and specialty growth care.',
                image: 'https://images.unsplash.com/photo-1502740479091-6398b19d99f4?auto=format&fit=crop&q=80&w=600',
                count: '10 Pediatricians',
              },
              {
                title: 'Radiology & Advanced Scans',
                description: 'Ultra-clear digital x-rays, high-Tesla MRI scans, bone mineral mass screens, and same-day certified clinical results.',
                image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=600',
                count: '6 Radiologists',
              }
            ].map((specialty, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredDept(idx)}
                onMouseLeave={() => setHoveredDept(null)}
                className="bg-white border border-slate-100 rounded-[28px] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-[380px] relative group"
              >
                {/* Specialty Image Container */}
                <div className="relative h-44 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent z-10" />
                  <img
                    src={specialty.image}
                    alt={specialty.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="text-[10px] font-bold font-mono text-white bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full uppercase">
                      {specialty.count}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5">{specialty.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{specialty.description}</p>
                  </div>

                  <button
                    onClick={() => onNavigate('departments')}
                    className="mt-4 flex items-center text-xs font-bold text-blue-600 group/btn"
                  >
                    <span>View Division Services</span>
                    <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 1. Modern Facilities & Tech Bento Grid */}
        <div id="hero-facilities" className="border-t border-slate-100 mt-24 pt-16">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono bg-blue-50 px-3 py-1 rounded-full">World-Class Infrastructure</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 tracking-tight">Our Advanced Facilities & Technology</h2>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">We combine highly experienced specialists with bleeding-edge technology to offer the most accurate clinical solutions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Interactive Telehealth Hub',
                description: 'Connect with senior specialist consultants worldwide via lag-free encrypted video calls directly on our platform.',
                icon: Video,
                color: 'text-indigo-600 bg-indigo-50 border-indigo-100/50',
                tag: 'Virtual Care'
              },
              {
                title: 'Advanced AI Diagnostics',
                description: 'Equipped with the latest high-field MRI, spectral CT scans, and fully automated laboratories for same-day results.',
                icon: Sparkles,
                color: 'text-blue-600 bg-blue-50 border-blue-100/50',
                tag: 'Modern Tech'
              },
              {
                title: 'Smart Inpatient ICU',
                description: 'Each unit features state-of-the-art telemetry linked directly to emergency doctors’ devices for instantaneous intervention.',
                icon: Building,
                color: 'text-emerald-600 bg-emerald-50 border-emerald-100/50',
                tag: 'Trauma Unit'
              },
              {
                title: '24/7 Priority Emergency Care',
                description: 'Fully responsive trauma response systems, operating fully staffed intensive care transport vehicles, and priority pediatric intake.',
                icon: PhoneCall,
                color: 'text-rose-600 bg-rose-50 border-rose-100/50',
                tag: '24/7 Trauma'
              }
            ].map((facility, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className={`p-3 rounded-2xl ${facility.color}`}>
                      <facility.icon className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-bold font-mono text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full uppercase">
                      {facility.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-950 mb-2">{facility.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{facility.description}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-50/80 flex items-center text-xs font-bold text-blue-600">
                  <span>Learn more</span>
                  <ChevronRight className="h-3 w-3 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Interactive Patient Journey Stepper */}
        <div id="hero-journey" className="border-t border-slate-100 mt-24 pt-16">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono bg-blue-50 px-3 py-1 rounded-full">Patient Flow</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 tracking-tight">Your Journey To Perfect Health</h2>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">An optimized, completely digital and paperless clinical journey designed for your ease.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Interactive Selector Left */}
            <div className="lg:col-span-5 space-y-3">
              {[
                { title: '1. Browse Specialist', subtitle: 'Explore our certified experts', short: '01' },
                { title: '2. Instant Booking', subtitle: 'Select dates and dynamic slots', short: '02' },
                { title: '3. Digital Consultation', subtitle: 'Telehealth or Physical check', short: '03' },
                { title: '4. Continuous Support', subtitle: 'Access instant prescription logs', short: '04' }
              ].map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center space-x-4 cursor-pointer ${
                    activeStep === idx
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/10'
                      : 'bg-white border-slate-100 text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <span className={`text-base font-extrabold font-mono rounded-xl w-10 h-10 flex items-center justify-center ${
                    activeStep === idx ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {step.short}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold leading-tight">{step.title}</h3>
                    <p className={`text-xs mt-0.5 ${activeStep === idx ? 'text-blue-100' : 'text-slate-500'}`}>{step.subtitle}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Visual Display Panel Right */}
            <div className="lg:col-span-7 bg-slate-50 border border-slate-100 rounded-3xl p-8 min-h-[340px] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-100/30 rounded-full blur-2xl pointer-events-none" />
              
              <div>
                <span className="text-[10px] font-bold font-mono text-blue-600 uppercase tracking-widest bg-blue-100/50 px-2.5 py-1 rounded-full">
                  {[ 'Phase 01 — Specialization Finder', 'Phase 02 — Real-time Scheduler', 'Phase 03 — Consultation', 'Phase 04 — Aftercare System' ][activeStep]}
                </span>
                
                <div className="flex items-center space-x-3 mt-6">
                  {React.createElement([Stethoscope, Calendar, Heart, ShieldCheck][activeStep], {
                    className: "h-8 w-8 text-blue-600"
                  })}
                  <h3 className="text-xl font-bold text-slate-900">
                    {[
                      'Find Your Certified Medical Specialist',
                      'Secure Instant Real-time Slots',
                      'Thorough Clinical Consultations',
                      'Post-Clinical Digital Wellness Care'
                    ][activeStep]}
                  </h3>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed mt-4 max-w-xl">
                  {[
                    'Explore our certified network of over 45 doctors across 5 core departments. View specialized credentials, treatment plans, hospital ratings, and check live slot availability before choosing.',
                    'Select your highly preferred dates and morning or evening time slots. Our real-time integrated scheduler sends SMS and email confirmations, adding entries to your dashboard immediately.',
                    'Consult with your chosen doctor either physically at our modern clinical chambers or virtually from the comfort of your home with our HD lag-free telehealth engine.',
                    'Access your prescription PDFs, diagnostics files, and medicine dosage plans directly on your patient portal. Message health advisors or reschedule follow-up checkups with a single click.'
                  ][activeStep]}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-500">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>100% Secure & HIPAA Compliant</span>
                </div>
                
                <button
                  onClick={() => onNavigate('book')}
                  className="inline-flex items-center space-x-2 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  <span>Get started on this step</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Patient Testimonials & Reviews */}
        <div id="hero-testimonials" className="border-t border-slate-100 mt-24 pt-16">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono bg-blue-50 px-3 py-1 rounded-full">Patient Voice</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 tracking-tight">Trusted by Thousands of Families</h2>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">We prioritize medical excellence and patient satisfaction. Here is what they say about WeCare.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah Jenkins',
                role: 'Pediatric Patient’s Mother',
                avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
                rating: 5,
                text: 'The pediatric department is exceptionally warm and stress-free. The waiting room feels like an activity lounge, and Dr. Sharma is exceptionally patient with children.'
              },
              {
                name: 'Rajat Verma',
                role: 'Cardiac Surgery Recovery',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
                rating: 5,
                text: 'My bypass surgery was a major milestone. Post-surgery care was phenomenal, and the live clinic telemetry is extremely reassuring.'
              },
              {
                name: 'Amit Patel',
                role: 'General Wellness Consult',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
                rating: 5,
                text: 'Phenomenal booking experience. I selected a slot, finished my medical consultation, and received my complete digital prescription logs on my dashboard instantly.'
              }
            ].map((testimonial, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed mb-6">"{testimonial.text}"</p>
                </div>
                
                <div className="flex items-center space-x-3 pt-4 border-t border-slate-50">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-10 h-10 rounded-full object-cover border border-slate-100" 
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-none">{testimonial.name}</h4>
                    <span className="text-[10px] text-slate-400 font-medium mt-1 block">{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Interactive FAQs & Health Tips Category Switcher */}
        <div id="hero-wellness-faq" className="border-t border-slate-100 mt-24 pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Health Tips Switcher Left */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono bg-blue-50 px-3 py-1 rounded-full">Wellness Guidance</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3 tracking-tight">Our Daily Clinical Health Advisory</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-2">Interactive, professional medical tips curated by our clinical directors for you.</p>
              </div>

              {/* Tips Category Tabs */}
              <div className="flex bg-slate-100/80 p-1 rounded-2xl border border-slate-200/30 max-w-sm">
                {(['cardio', 'lifestyle', 'nutrition'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setTipsCategory(cat)}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all uppercase tracking-wider ${
                      tipsCategory === cat
                        ? 'bg-white text-blue-600 shadow-sm border border-slate-200/20'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Selected Tips Content */}
              <div className="space-y-4">
                {{
                  cardio: [
                    { title: 'Monitor Morning Rest Rate', desc: 'Check your resting heart rate weekly. A healthy resting rate is usually between 60 to 100 BPM. Keep an eye on consistent abnormalities.' },
                    { title: '30-Min Walk Standard', desc: 'Doing brisk walking or low-intensity cycling for 30 minutes, 5 days a week lowers cardiovascular risk markers significantly.' }
                  ],
                  lifestyle: [
                    { title: 'Screen Eye Habit (20-20-20)', desc: 'When utilizing laptops or smartphones, every 20 minutes, focus on any physical object 20 feet away for 20 seconds to prevent ocular fatigue.' },
                    { title: 'Strict Sleep Timings', desc: 'A regular sleep-wake schedule stabilizes your circadian rhythms, encouraging cellular healing and lowering daily cortisol.' }
                  ],
                  nutrition: [
                    { title: 'Adequate Daily Hydration', desc: 'Aim for 2.5 to 3 liters of water. Regular intake flushes metabolic deposits and optimizes renal function.' },
                    { title: 'Choose Complex Carbs', desc: 'Opt for unrefined, high-fiber carbohydrates like brown rice and whole oats to enjoy sustained energy without glycemic spikes.' }
                  ]
                }[tipsCategory].map((advice, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-blue-50/50 to-indigo-50/10 border border-blue-50/80 rounded-2xl p-4 flex items-start space-x-3">
                    <div className="p-2 bg-blue-100/50 rounded-xl text-blue-600 mt-0.5">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{advice.title}</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed mt-1">{advice.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs Accordion Right */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono bg-blue-50 px-3 py-1 rounded-full">FAQ Helpdesk</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3 tracking-tight">Frequently Asked Questions</h2>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  {
                    q: 'How do I schedule a virtual video consultation?',
                    a: 'Click on "Book Appointment", choose your doctor, and pick an available slot. You will receive a secure video consultation link in your dashboard instantly.'
                  },
                  {
                    q: 'Are walk-ins accepted in WeCare clinics?',
                    a: 'Yes, we accept walk-in patients for general examinations and emergencies. To minimize clinical wait times, we recommend booking a slot online beforehand.'
                  },
                  {
                    q: 'Can I cancel or reschedule my clinical sessions?',
                    a: 'Yes, you can edit or cancel appointments via the "My Appointments" or "Admin Hub" tab on your top menu bar up to 2 hours before the slot.'
                  },
                  {
                    q: 'What cashless insurance benefits do you offer?',
                    a: 'We have direct billing partnerships with all major corporate health panels and insurance networks. Our front desk handles pre-authorizations seamlessly.'
                  }
                ].map((faq, idx) => (
                  <div 
                    key={idx}
                    className="border border-slate-100 rounded-2xl bg-white overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${openFaq === idx ? 'rotate-180 text-blue-600' : ''}`} />
                    </button>
                    
                    {openFaq === idx && (
                      <div className="px-4 pb-4 text-xs text-slate-500 leading-relaxed border-t border-slate-50 pt-3 animate-in fade-in duration-200">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Accreditations & Quality Certifications Section */}
        <div id="hero-accreditations" className="border-t border-slate-100 mt-24 pt-16">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono bg-blue-50 px-3 py-1 rounded-full">Global Standards</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 tracking-tight">Accreditations & Quality Certificates</h2>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">WeCare maintains the absolute highest benchmarks in global healthcare quality, sterile environments, patient privacy, and clinical emergency care.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: 'jci',
                title: 'Joint Commission International',
                subtitle: 'The Gold Standard in Global Care',
                shortName: 'JCI Accredited',
                code: 'JCI-USA-2026-9482',
                issueDate: 'Jan 15, 2026',
                expiryDate: 'Jan 14, 2029',
                authority: 'Joint Commission International, Chicago, USA',
                color: 'from-amber-500/10 to-amber-600/5 hover:border-amber-400',
                badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
                iconColor: 'text-amber-500',
                sealText: 'GOLD SEAL OF APPROVAL',
                description: 'Verifies maximum safety guidelines, infection control standards, and premium surgical protocols aligned with elite global medical facilities.'
              },
              {
                id: 'nabh',
                title: 'National Accreditation Board',
                subtitle: 'Apex Healthcare Standards',
                shortName: 'NABH Certified',
                code: 'NABH-H-2026-0391',
                issueDate: 'Mar 10, 2026',
                expiryDate: 'Mar 09, 2029',
                authority: 'National Quality Assurance Council',
                color: 'from-blue-500/10 to-blue-600/5 hover:border-blue-400',
                badgeColor: 'text-blue-700 bg-blue-50 border-blue-200',
                iconColor: 'text-blue-500',
                sealText: 'PATIENT SAFETY COMMITTED',
                description: 'Certified for optimal nursery environments, critical cardiac triage timing, pediatric standards, and emergency preparedness.'
              },
              {
                id: 'iso',
                title: 'ISO 9001:2015 Quality Systems',
                subtitle: 'Clinical & Operational Excellence',
                shortName: 'ISO Certified',
                code: 'ISO-Q-9001-26938',
                issueDate: 'Feb 18, 2026',
                expiryDate: 'Feb 17, 2031',
                authority: 'International Quality Registrars',
                color: 'from-emerald-500/10 to-emerald-600/5 hover:border-emerald-400',
                badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
                iconColor: 'text-emerald-500',
                sealText: 'MANAGEMENT EFFICIENCY ISO',
                description: 'Validates automated diagnostic laboratory accuracy, smooth outpatient workflow, digital health record management, and secure telehealth engines.'
              },
              {
                id: 'hipaa',
                title: 'HIPAA & GDPR Privacy Compliance',
                subtitle: 'Maximum Digital Data Security',
                shortName: 'Data Compliant',
                code: 'SEC-HIPAA-2026-7740',
                issueDate: 'May 04, 2026',
                expiryDate: 'Continuous Audit',
                authority: 'Global Medical Security Compliance Board',
                color: 'from-purple-500/10 to-purple-600/5 hover:border-purple-400',
                badgeColor: 'text-purple-700 bg-purple-50 border-purple-200',
                iconColor: 'text-purple-500',
                sealText: '100% PRIVATE & ENCRYPTED',
                description: 'Certifies that clinical patient telemetry records, online booking information, telehealth video sessions, and prescription databases are protected by military-grade 256-bit encryption.'
              }
            ].map((cert, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br ${cert.color} border border-slate-100 rounded-[28px] p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group cursor-pointer`}
                onClick={() => setSelectedCertificate(cert)}
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className={`p-3 rounded-2xl bg-white shadow-sm border border-slate-50 ${cert.iconColor}`}>
                      <Award className="h-6 w-6" />
                    </div>
                    <span className={`text-[10px] font-extrabold font-mono px-2.5 py-1 rounded-full border ${cert.badgeColor}`}>
                      {cert.shortName}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
                    {cert.title}
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-400 mb-3">{cert.subtitle}</p>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">{cert.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-200/50 flex items-center justify-between">
                  <div className="font-mono text-[10px] text-slate-400 font-semibold">
                    Code: {cert.code}
                  </div>
                  <span className="text-xs font-bold text-blue-600 group-hover:underline flex items-center">
                    <span>View Certificate</span>
                    <ChevronRight className="h-3 w-3 ml-0.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Certificate Modal */}
          {selectedCertificate && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
              <div 
                className="bg-white border border-slate-100 rounded-3xl max-w-2xl w-full p-8 relative shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Styled Certificate Border Frame */}
                <div className="border-[12px] border-slate-900 rounded-2xl p-6 sm:p-10 bg-[#fdfdfb] relative overflow-hidden shadow-inner">
                  {/* Watermark Logo Backing */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                    <Heart className="h-72 w-72 text-slate-900 rotate-12" />
                  </div>

                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                      <Award className="h-14 w-14 text-amber-500" />
                    </div>
                    <span className="text-xs font-extrabold tracking-[0.2em] uppercase text-slate-400 font-mono">
                      Certificate of Accreditation & Quality Assurance
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-slate-900 tracking-tight mt-2 italic">
                      {selectedCertificate.title}
                    </h2>
                    <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-4" />
                  </div>

                  {/* Body Content */}
                  <div className="text-center space-y-4 mb-8">
                    <p className="text-xs text-slate-400 font-mono uppercase tracking-widest font-semibold">this official certificate confirms that</p>
                    <p className="text-2xl font-serif font-bold text-slate-950">WeCare Multi-Specialty Clinic & Hospital</p>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                      is fully accredited and verified for satisfying and maintaining rigorous, high-quality guidelines specified by the {selectedCertificate.authority}.
                    </p>
                    <p className="text-xs font-semibold text-slate-500 italic max-w-lg mx-auto">
                      "{selectedCertificate.description}"
                    </p>
                  </div>

                  {/* Footer Seal & Signatures */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-6 pt-6 border-t border-slate-200/60">
                    
                    {/* Left: Cert details */}
                    <div className="text-left space-y-1 font-mono text-[10px] text-slate-400 leading-normal">
                      <div><strong className="text-slate-600">ID CODE:</strong> {selectedCertificate.code}</div>
                      <div><strong className="text-slate-600">ISSUED:</strong> {selectedCertificate.issueDate}</div>
                      <div><strong className="text-slate-600">EXPIRES:</strong> {selectedCertificate.expiryDate}</div>
                    </div>

                    {/* Middle: Gold Seal badge */}
                    <div className="flex flex-col items-center justify-center">
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        <div className="absolute inset-0 bg-amber-500 rounded-full opacity-15 border-2 border-dashed border-amber-600" />
                        <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center shadow-lg border border-amber-500">
                          <Check className="h-6 w-6 text-amber-950 font-bold" />
                        </div>
                      </div>
                      <span className="text-[8px] font-black text-amber-600 font-mono text-center tracking-widest mt-2 uppercase leading-none block max-w-[100px]">
                        {selectedCertificate.sealText}
                      </span>
                    </div>

                    {/* Right: Signature */}
                    <div className="text-right flex flex-col items-end">
                      <div className="font-serif italic text-sm text-slate-800 border-b border-slate-300 pb-1 px-4 leading-none">
                        Dr. Robert Miller
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">
                        Board President
                      </span>
                    </div>

                  </div>
                </div>

                {/* Close Button Bottom */}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedCertificate(null)}
                    className="bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer shadow-md shadow-slate-900/10"
                  >
                    Close Verification Viewer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Navigate Cards Section */}
        <div id="hero-quick-cards" className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
          {QuickCards.map((card, idx) => (
            <div
              key={idx}
              id={`quick-card-${idx}`}
              className={`p-6 rounded-[32px] transition-all hover:translate-y-[-4px] cursor-pointer flex flex-col justify-between h-56 ${card.color}`}
              onClick={() => onNavigate(card.page)}
            >
              <div>
                <span className="inline-block p-2.5 rounded-xl bg-white/10 mb-4 font-bold text-lg">
                  {idx === 0 ? <Calendar className="h-5 w-5 text-white" /> : idx === 1 ? <HeartPulse className="h-5 w-5 text-blue-600" /> : <Stethoscope className="h-5 w-5 text-blue-600" />}
                </span>
                <h3 className="text-lg font-bold tracking-tight mb-2">{card.title}</h3>
                <p className={`text-xs leading-relaxed ${card.textColor}`}>{card.description}</p>
              </div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider pt-4 mt-auto">
                <span>{card.cta}</span>
                <ChevronRight className="h-3 w-3" />
              </div>
            </div>
          ))}
        </div>

        {/* Highlight Stats */}
        <div id="hero-stats" className="border-t border-slate-100 mt-16 pt-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex items-center space-x-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <span className="block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                    {stat.value}
                  </span>
                  <span className="block text-xs font-semibold text-slate-500 font-sans tracking-wide">
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
