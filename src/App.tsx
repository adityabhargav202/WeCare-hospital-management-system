/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsSection from './components/StatsSection';
import TestimonialsSection from './components/TestimonialsSection';
import FloatingContactButton from './components/FloatingContactButton';
import AboutSection from './components/AboutSection';
import DepartmentsSection from './components/DepartmentsSection';
import DoctorsSection from './components/DoctorsSection';
import BookingForm from './components/BookingForm';
import MyAppointments from './components/MyAppointments';
import AuthPage from './components/AuthPage';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import { Appointment, Doctor, Department } from './types';
import { authService, doctorService, departmentService, appointmentService } from './lib/api';
import { DEPARTMENTS, DOCTORS } from './data/hospitalData';

export default function App() {
  const [activePage, setActivePage] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  // Dynamic clinical catalog states
  const [doctors, setDoctors] = useState<Doctor[]>(DOCTORS);
  const [departments, setDepartments] = useState<Department[]>(DEPARTMENTS);

  // Deep linking selections for booking
  const [preselectedDocId, setPreselectedDocId] = useState<string>('');
  const [preselectedDeptId, setPreselectedDeptId] = useState<string>('');

  // Persisted Appointments State with standard LocalStorage / API handling
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // 1. Initial Authentication Check on mount
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  // 2. Load Clinical Specialists & Divisions from live MongoDB on mount
  useEffect(() => {
    async function loadCatalog() {
      try {
        const [docsRes, deptsRes] = await Promise.all([
          doctorService.getDoctors(),
          departmentService.getDepartments()
        ]);
        if (docsRes.success && docsRes.data && docsRes.data.length > 0) {
          setDoctors(docsRes.data);
        }
        if (deptsRes.success && deptsRes.data && deptsRes.data.length > 0) {
          setDepartments(deptsRes.data);
        }
      } catch (err) {
        console.warn('Live API clinical catalog offline. Falling back to robust static definitions.', err);
      }
    }
    loadCatalog();
  }, []);

  // 3. Load dynamic User Appointments from MongoDB when logged in
  useEffect(() => {
    async function fetchAppointments() {
      if (!currentUser) {
        setAppointments([]);
        return;
      }
      try {
        const response = await appointmentService.getMyAppointments();
        if (response.success && response.data) {
          setAppointments(response.data);
        }
      } catch (err) {
        console.error('Failed to load real appointments. Falling back to local storage.', err);
        // Fallback to local storage for patient convenience
        const saved = localStorage.getItem('welcare_appointments');
        if (saved) {
          try {
            setAppointments(JSON.parse(saved));
          } catch (e) {}
        }
      }
    }
    fetchAppointments();
  }, [currentUser]);

  // Navigate & scroll to top smoothly
  const handlePageChange = (pageId: string) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Preselected doctor/department booking redirect
  const handleBookWithDoctor = (doctorId: string, departmentId: string) => {
    setPreselectedDocId(doctorId);
    setPreselectedDeptId(departmentId);
    handlePageChange('book');
  };

  // Add/Sync Appointment handler
  const handleAddAppointment = (apptData: any) => {
    // Reload clinical list from backend API
    async function refresh() {
      try {
        const response = await appointmentService.getMyAppointments();
        if (response.success && response.data) {
          setAppointments(response.data);
        } else {
          setAppointments((prev) => [apptData, ...prev]);
        }
      } catch (err) {
        setAppointments((prev) => [apptData, ...prev]);
      }
    }
    refresh();
  };

  // Cancel Appointment handler
  const handleCancelAppointment = async (id: string) => {
    try {
      const confirmCancel = window.confirm('Are you sure you want to cancel this appointment?');
      if (!confirmCancel) return;

      const res = await appointmentService.cancel(id);
      if (res.success) {
        // Update local list
        setAppointments((prev) =>
          prev.map((appt) =>
            appt.id === id ? { ...appt, status: 'cancelled' as const } : appt
          )
        );
      } else {
        alert(res.message || 'Failed to cancel appointment.');
      }
    } catch (err: any) {
      console.error('API cancel failed, updating local state.', err);
      // Resilient local state update fallback
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === id ? { ...appt, status: 'cancelled' as const } : appt
        )
      );
    }
  };

  // Handle successful login/signup authentication
  const handleAuthSuccess = (user: any) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      handlePageChange('my-appointments');
    } else {
      handlePageChange('home');
    }
  };

  // Handle session teardown
  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setAppointments([]);
    handlePageChange('home');
  };

  // Render Page Component Dynamically
  const renderPage = () => {
    // If Admin page is requested but user is not admin, show Admin login
    if (activePage === 'admin-dashboard') {
      if (currentUser && currentUser.role === 'admin') {
        return <AdminDashboard onLogout={handleLogout} />;
      } else {
        return (
          <div className="py-12 bg-slate-50/50 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-lg">
              <AuthPage onAuthSuccess={handleAuthSuccess} initialMode="admin" />
            </div>
          </div>
        );
      }
    }

    // Patient booking or view appointments: if not logged in, show login/signup first
    if ((activePage === 'book' || activePage === 'my-appointments') && !currentUser) {
      return (
        <div className="py-12 bg-slate-50/50 min-h-screen">
          <div className="max-w-md mx-auto text-center mb-8 px-4">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">Authentication Required</span>
            <p className="text-xs text-slate-500 mt-1">Please sign in or create an account to book and manage medical appointments securely.</p>
          </div>
          <AuthPage onAuthSuccess={handleAuthSuccess} initialMode="login" />
        </div>
      );
    }

    switch (activePage) {
      case 'home':
        return (
          <>
            <Hero onNavigate={handlePageChange} />
            <StatsSection />
            <TestimonialsSection />
          </>
        );
      case 'about':
        return <AboutSection />;
      case 'departments':
        return (
          <DepartmentsSection
            onBookWithDoctor={handleBookWithDoctor}
            onNavigateToDoctors={() => handlePageChange('doctors')}
            doctors={doctors}
            departments={departments}
          />
        );
      case 'doctors':
        return (
          <DoctorsSection 
            onBookWithDoctor={handleBookWithDoctor} 
            doctors={doctors}
            departments={departments}
          />
        );
      case 'book':
        return (
          <BookingForm
            preselectedDoctorId={preselectedDocId}
            preselectedDepartmentId={preselectedDeptId}
            onAddAppointment={handleAddAppointment}
            onNavigateToAppointments={() => {
              // Reset pre-selections
              setPreselectedDocId('');
              setPreselectedDeptId('');
              handlePageChange('my-appointments');
            }}
            doctors={doctors}
            departments={departments}
          />
        );
      case 'my-appointments':
        if (currentUser && currentUser.role === 'admin') {
          return <AdminDashboard onLogout={handleLogout} />;
        }
        return (
          <MyAppointments
            appointments={appointments}
            onCancelAppointment={handleCancelAppointment}
            onNavigateToBooking={() => handlePageChange('book')}
          />
        );
      case 'auth':
        return (
          <div className="py-12 bg-slate-50/50 min-h-screen">
            <AuthPage onAuthSuccess={handleAuthSuccess} initialMode="login" />
          </div>
        );
      default:
        return <Hero onNavigate={handlePageChange} />;
    }
  };

  const activeAppointmentsCount = appointments.filter(
    (app) => app.status === 'scheduled' || app.status === 'Approved' || app.status === 'Pending'
  ).length;

  return (
    <div id="welcare-app-root" className="min-h-screen bg-white text-slate-700 antialiased flex flex-col justify-between">
      <div>
        {/* Navigation bar */}
        <Navbar 
          activePage={activePage} 
          setActivePage={handlePageChange} 
          appointmentsCount={activeAppointmentsCount}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Dynamic transition container */}
        <main id="main-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Footer component */}
      <Footer onNavigate={handlePageChange} />

      {/* Floating WhatsApp / Call button */}
      <FloatingContactButton />
    </div>
  );
}
