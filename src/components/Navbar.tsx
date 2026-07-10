/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Activity, Calendar, Menu, X, Clock3, Phone, Mail, MapPin } from 'lucide-react';

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  appointmentsCount: number;
  currentUser?: any | null;
  onLogout?: () => void;
}

export default function Navbar({ 
  activePage, 
  setActivePage, 
  appointmentsCount,
  currentUser = null,
  onLogout = () => {}
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'departments', label: 'Departments' },
    { id: 'doctors', label: 'Doctors' },
  ];

  const handleNavClick = (pageId: string) => {
    setActivePage(pageId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Top Contact Utility Bar */}
      <div className="bg-[#1e3a8a] text-slate-100 text-[11px] py-2 px-4 hidden md:block border-b border-blue-950/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="h-3.5 w-3.5 text-blue-300" />
              <span className="font-medium">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-3.5 w-3.5 text-blue-300" />
              <span className="font-medium">contact@wecarehospitals.com</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-3.5 w-3.5 text-blue-300" />
            <span className="font-medium">123 Health Avenue, Vijay Nagar, Indore, MP 452010</span>
          </div>
        </div>
      </div>

      <nav id="navbar-container" className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo & Brand */}
            <div 
              id="brand-logo" 
              className="flex items-center space-x-2 cursor-pointer group"
              onClick={() => handleNavClick('home')}
            >
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-100 transition-colors">
                <Activity className="h-6 w-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-sans text-xl font-bold text-slate-800 tracking-tight block">WeCare</span>
                <span className="text-[10px] text-blue-600 font-mono tracking-wider uppercase block -mt-1 font-semibold">Hospitals</span>
              </div>
            </div>

          {/* Desktop Navigation links */}
          <div id="desktop-nav-links" className="hidden md:flex items-center space-x-8">
            {currentUser?.role !== 'admin' && navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`font-sans text-sm font-medium transition-all duration-200 relative py-2 ${
                  activePage === item.id 
                    ? 'text-blue-600' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {item.label}
                {activePage === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* CTA & Booking Actions */}
          <div id="desktop-nav-cta" className="hidden md:flex items-center space-x-3">
            <button
              id="nav-my-appointments"
              onClick={() => handleNavClick('my-appointments')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                activePage === 'my-appointments'
                  ? 'bg-slate-100 text-slate-800'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <Clock3 className="h-4 w-4" />
              <span>{currentUser && currentUser.role === 'admin' ? 'Admin Hub' : 'My Appointments'}</span>
              {appointmentsCount > 0 && currentUser?.role !== 'admin' && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[11px] font-bold text-white font-mono animate-pulse">
                  {appointmentsCount}
                </span>
              )}
            </button>

            {currentUser?.role !== 'admin' && (
              <button
                id="nav-book-cta"
                onClick={() => handleNavClick('book')}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2.5 rounded-xl text-xs font-semibold tracking-tight shadow-md shadow-blue-600/10 transition-all hover:scale-[1.02]"
              >
                <Calendar className="h-4.5 w-4.5" />
                <span>Book Appointment</span>
              </button>
            )}

            {currentUser ? (
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 max-w-[150px] truncate" title={currentUser.fullName}>
                  👤 {currentUser.fullName}
                </span>
                <button
                  id="nav-logout"
                  onClick={onLogout}
                  className="text-xs font-bold text-slate-500 hover:text-rose-600 px-3 py-2 rounded-xl hover:bg-rose-50 transition-all"
                  title={`Logged in as ${currentUser.fullName}`}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                id="nav-signin"
                onClick={() => handleNavClick('auth')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-4 py-2 rounded-xl transition-all"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              id="mobile-appointments-badge"
              onClick={() => handleNavClick('my-appointments')}
              className="p-2 text-slate-500 relative"
            >
              <Clock3 className="h-5 w-5" />
              {appointmentsCount > 0 && currentUser?.role !== 'admin' && (
                <span className="absolute top-1 right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-blue-500 text-[9px] font-bold text-white font-mono">
                  {appointmentsCount}
                </span>
              )}
            </button>
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-50 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div id="mobile-nav-menu" className="md:hidden bg-white border-b border-slate-100 py-3 px-4 space-y-2 animate-in slide-in-from-top-4 duration-200">
          {currentUser?.role !== 'admin' && navItems.map((item) => (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left px-3 py-2.5 rounded-xl text-base font-medium transition-colors ${
                activePage === item.id
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="border-t border-slate-100 pt-3 flex flex-col space-y-2">
            <button
              id="mobile-nav-my-appointments"
              onClick={() => handleNavClick('my-appointments')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-base font-medium ${
                activePage === 'my-appointments'
                  ? 'bg-slate-100 text-slate-800'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Clock3 className="h-5 w-5 text-slate-500" />
                <span>{currentUser && currentUser.role === 'admin' ? 'Admin Hub' : 'My Appointments'}</span>
              </div>
              {appointmentsCount > 0 && currentUser?.role !== 'admin' && (
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500 text-xs font-bold text-white font-mono">
                  {appointmentsCount}
                </span>
              )}
            </button>

            {currentUser?.role !== 'admin' && (
              <button
                id="mobile-nav-book-cta"
                onClick={() => handleNavClick('book')}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl text-base font-semibold shadow-md shadow-blue-600/10"
              >
                <Calendar className="h-5 w-5" />
                <span>Book Appointment</span>
              </button>
            )}

            {currentUser ? (
              <button
                id="mobile-nav-logout"
                onClick={onLogout}
                className="w-full text-center px-4 py-2.5 rounded-xl text-sm font-bold text-rose-600 bg-rose-50 border border-rose-100 transition-all"
              >
                Sign Out ({currentUser.fullName})
              </button>
            ) : (
              <button
                id="mobile-nav-signin"
                onClick={() => handleNavClick('auth')}
                className="w-full text-center px-4 py-2.5 rounded-xl text-sm font-bold text-blue-600 bg-blue-50 border border-blue-100 transition-all"
              >
                Sign In / Sign Up
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
    </>
  );
}
