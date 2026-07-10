/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar, Clock, AlertCircle, Trash2, HeartPulse, Sparkles, Plus, CheckCircle, Search, CalendarCheck } from 'lucide-react';
import { Appointment } from '../types';

interface MyAppointmentsProps {
  appointments: Appointment[];
  onCancelAppointment: (id: string) => void;
  onNavigateToBooking: () => void;
}

export default function MyAppointments({
  appointments,
  onCancelAppointment,
  onNavigateToBooking
}: MyAppointmentsProps) {
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAppointments = appointments.filter((app) => {
    // Filter status
    const isScheduled = app.status === 'scheduled' || app.status === 'Approved' || app.status === 'Pending' || app.status === 'Confirmed';
    const isCancelled = app.status === 'cancelled' || app.status === 'Cancelled' || app.status === 'Rejected';
    
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'scheduled' && isScheduled) ||
      (filter === 'cancelled' && isCancelled);

    // Filter search
    const matchesSearch = 
      app.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.departmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const activeCount = appointments.filter((app) => 
    app.status === 'scheduled' || app.status === 'Approved' || app.status === 'Pending' || app.status === 'Confirmed'
  ).length;

  return (
    <div id="my-appointments-section" className="py-12 bg-slate-50/50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono block mb-1">Patient Portal</span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Scheduled Consultations</h1>
            <p className="text-xs text-slate-500 mt-1">Review, monitor, and cancel your pre-booked hospital appointments.</p>
          </div>
          
          <button
            id="appointments-new-booking-btn"
            onClick={onNavigateToBooking}
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/10 hover:scale-[1.01]"
          >
            <Plus className="h-4 w-4" />
            <span>New Appointment</span>
          </button>
        </div>

        {/* Filters and search box */}
        <div className="bg-white rounded-[32px] border border-slate-100 p-4 shadow-sm mb-6 flex flex-col md:flex-row justify-between gap-4">
          {/* Status Tabs */}
          <div id="appointments-status-tabs" className="flex bg-slate-50 p-1 rounded-xl w-fit border border-slate-100">
            <button
              id="app-filter-all"
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All Bookings ({appointments.length})
            </button>
            <button
              id="app-filter-scheduled"
              onClick={() => setFilter('scheduled')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'scheduled'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Scheduled ({activeCount})
            </button>
            <button
              id="app-filter-cancelled"
              onClick={() => setFilter('cancelled')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'cancelled'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Cancelled ({appointments.length - activeCount})
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              id="app-search-input"
              type="text"
              placeholder="Search by doctor or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-700 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Appointments List Render */}
        {filteredAppointments.length > 0 ? (
          <div id="appointments-cards-list" className="space-y-4">
            {filteredAppointments.map((app) => (
              <div
                key={app.id}
                id={`appointment-item-${app.id}`}
                className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
              >
                {/* Visual side accent border depending on status */}
                <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${
                  app.status === 'scheduled' ? 'bg-blue-500' : 'bg-slate-300'
                }`} />

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  
                  {/* Doctor & Dept details */}
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl flex-shrink-0 ${
                      app.status === 'scheduled' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'
                    }`}>
                      <HeartPulse className="h-6 w-6" />
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-bold text-slate-800 tracking-tight">{app.doctorName}</h3>
                        <span className="text-[10px] text-slate-400 font-mono">({app.id})</span>
                      </div>
                      <span className="text-xs text-blue-600 font-medium block mt-0.5">{app.departmentName}</span>
                      
                      <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                        <p>Patient: <strong>{app.patientName}</strong> <span className="text-slate-300">|</span> Age: <strong>{app.patientAge} Yrs</strong></p>
                        <p className="text-slate-500 text-[11px] leading-relaxed">Reason: "{app.reason}"</p>
                      </div>
                    </div>
                  </div>

                  {/* Schedule Details & Status actions */}
                  <div className="flex flex-col md:items-end justify-between border-t md:border-t-0 border-slate-50 pt-4 md:pt-0">
                    <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2.5 mb-3">
                      {/* Schedule Timing details */}
                      <div className="flex items-center space-x-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700">
                        <Calendar className="h-3.5 w-3.5 text-blue-600" />
                        <span>{app.date}</span>
                        <span className="text-slate-300">|</span>
                        <Clock className="h-3.5 w-3.5 text-blue-600" />
                        <span>{app.timeSlot}</span>
                      </div>

                      {/* Status Badges */}
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        app.status === 'Approved' || app.status === 'scheduled' || app.status === 'Confirmed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : app.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-100'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}>
                        {app.status === 'Approved' || app.status === 'scheduled' || app.status === 'Confirmed' ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping mr-1" />
                            <span>Confirmed</span>
                          </>
                        ) : app.status === 'Pending' ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1 animate-pulse" />
                            <span>Pending</span>
                          </>
                        ) : (
                          <span>{app.status}</span>
                        )}
                      </span>
                    </div>

                    {/* Cancel action */}
                    {(app.status === 'scheduled' || app.status === 'Approved' || app.status === 'Pending') && (
                      <button
                        id={`cancel-appt-btn-${app.id}`}
                        onClick={() => onCancelAppointment(app.id)}
                        className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-100 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 self-start md:self-auto transition-all"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Cancel Booking</span>
                      </button>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty portal state */
          <div id="appointments-empty-state" className="bg-white rounded-[32px] border border-slate-100 p-12 text-center max-w-md mx-auto shadow-sm">
            <CalendarCheck className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-base font-bold text-slate-800 tracking-tight">No appointments found</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              We couldn't locate any healthcare bookings under this filter state. Schedule a new clinical consultation instantly.
            </p>
            <button
              id="appointments-empty-book-btn"
              onClick={onNavigateToBooking}
              className="mt-6 inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>Book Appointment</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
