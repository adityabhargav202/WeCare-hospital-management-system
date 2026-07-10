/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Activity, Mail, Phone, MapPin, Clock, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (pageId: string) => {
    onNavigate(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer-container" className="bg-slate-900 text-slate-400 font-sans border-t border-slate-800">
      
      {/* Upper footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand Info (Col span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => handleLinkClick('home')}
            >
              <div className="p-2 bg-slate-800 text-blue-400 rounded-xl">
                <Activity className="h-6 w-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xl font-bold text-white tracking-tight block">WeCare</span>
                <span className="text-[10px] text-blue-400 font-mono tracking-wider uppercase block -mt-1 font-semibold">Hospitals</span>
              </div>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              An internationally JCI-accredited healthcare system committed to establishing exceptional diagnostic and treatment pathways with deep patient compassion.
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center space-x-2.5">
                <Clock className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span>Outpatient: Mon - Sat, 08:00 AM - 08:00 PM</span>
              </div>
              <div className="flex items-center space-x-2.5 font-bold text-blue-400">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span>Emergency Support & Trauma Care: 24/7/365</span>
              </div>
            </div>
          </div>

          {/* Quick Navigate Links (Col span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono">Quick Navigation</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  id="footer-nav-home"
                  onClick={() => handleLinkClick('home')}
                  className="hover:text-white transition-colors"
                >
                  Home Landing
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-about"
                  onClick={() => handleLinkClick('about')}
                  className="hover:text-white transition-colors"
                >
                  About Our Network
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-departments"
                  onClick={() => handleLinkClick('departments')}
                  className="hover:text-white transition-colors"
                >
                  Medical Departments
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-doctors"
                  onClick={() => handleLinkClick('doctors')}
                  className="hover:text-white transition-colors"
                >
                  Our Specialist Doctors
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-booking"
                  onClick={() => handleLinkClick('book')}
                  className="text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1"
                >
                  <span>Schedule Consultation</span>
                  <ArrowUpRight className="h-3 w-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Specialized Centers list (Col span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono">Specialized Centers</h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>Cardiology Care</li>
              <li>Neurological Center</li>
              <li>Orthopedic Reconstructions</li>
              <li>Pediatric Development</li>
              <li>Ophthalmic Vision</li>
            </ul>
          </div>

          {/* Contact Details (Col span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono">Contact Details</h3>
            <ul className="space-y-3.5 text-xs">
              <li className="flex items-start space-x-2.5">
                <MapPin className="h-4.5 w-4.5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  100 Healthcare Boulevard, Vijay Nagar,<br />
                  Indore, MP 452010
                </span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="h-4.5 w-4.5 text-blue-400 flex-shrink-0" />
                <span>+1 (555) 100-2828</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="h-4.5 w-4.5 text-blue-400 flex-shrink-0" />
                <span className="truncate">contact@wecarehospitals.com</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Lower copyright bar */}
      <div className="border-t border-slate-800/80 py-6 bg-slate-950/45">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-xs gap-3">
          <p>© {currentYear} WeCare Hospitals System. All medical records are kept strictly confidential.</p>
          <div className="flex space-x-6">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">HIPAA Compliance</span>
          </div>
        </div>
      </div>

    </footer>
  );
}
