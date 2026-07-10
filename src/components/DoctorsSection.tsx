/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, Filter, Star, Briefcase, Award, GraduationCap, Calendar, Clock, HeartPulse } from 'lucide-react';
import { DOCTORS, DEPARTMENTS } from '../data/hospitalData';
import { Doctor, Department } from '../types';

interface DoctorsSectionProps {
  onBookWithDoctor: (doctorId: string, departmentId: string) => void;
  doctors?: Doctor[];
  departments?: Department[];
}

export default function DoctorsSection({ 
  onBookWithDoctor,
  doctors = DOCTORS,
  departments = DEPARTMENTS
}: DoctorsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState('all');

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      // Filter by department
      const matchesDept = selectedDeptId === 'all' || doc.departmentId === selectedDeptId;
      
      // Filter by search query (name, bio, education, or specialties)
      const matchesSearch = 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.education.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialties.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase())) ||
        doc.role.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesDept && matchesSearch;
    });
  }, [searchQuery, selectedDeptId, doctors]);

  return (
    <div id="doctors-catalog-section" className="py-12 bg-slate-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono block mb-2">Our Specialists</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Meet Our World-Class Medical Experts</h2>
          <p className="text-sm text-slate-500 mt-2">
            Connect with board-certified consultants, research leaders, and clinicians trained at the world's most prestigious institutions.
          </p>
        </div>

        {/* Search and Filters Controls */}
        <div id="search-filter-controls" className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm mb-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                id="doctor-search-input"
                type="text"
                placeholder="Search doctors by name, specialty (e.g. 'Strokes', 'Asthma'), role, or education..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50/80 border border-slate-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
              />
            </div>
            {/* Active Doctors Counter */}
            <div className="md:col-span-4 flex items-center justify-end">
              <span className="text-xs font-mono font-semibold text-slate-400 uppercase bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-100">
                Found {filteredDoctors.length} Specialists
              </span>
            </div>
          </div>

          {/* Department Tabs Filter */}
          <div className="border-t border-slate-50 pt-5">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Filter by Department
            </label>
            <div id="dept-filter-tabs" className="flex flex-wrap gap-2">
              <button
                id="dept-filter-all"
                onClick={() => setSelectedDeptId('all')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedDeptId === 'all'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                All Departments
              </button>
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  id={`dept-filter-${dept.id}`}
                  onClick={() => setSelectedDeptId(dept.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedDeptId === dept.id
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {dept.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length > 0 ? (
          <div id="doctors-cards-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                id={`doctor-card-${doc.id}`}
                className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm hover:shadow-md hover:border-blue-100/50 transition-all flex flex-col justify-between h-full group"
              >
                {/* Doctor Header (Image & Key Meta) */}
                <div>
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="relative flex-shrink-0">
                      <img
                        src={doc.image}
                        alt={doc.name}
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 rounded-2xl object-cover border border-slate-100 shadow-sm"
                      />
                      <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500 text-white border-2 border-white shadow-sm">
                        <HeartPulse className="h-3 w-3" />
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
                        {doc.name}
                      </h3>
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full inline-block mt-1">
                        {doc.role}
                      </span>
                      <div className="flex items-center space-x-1.5 mt-2">
                        <div className="flex items-center">
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-bold font-mono text-slate-700 ml-1">{doc.rating}</span>
                        </div>
                        <span className="text-slate-300 text-xs">•</span>
                        <span className="text-xs text-slate-400 font-semibold">{doc.patientsServed.toLocaleString()}+ patients</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Profile bio */}
                  <p className="text-xs text-slate-600 leading-relaxed italic mb-4 line-clamp-3">
                    "{doc.bio}"
                  </p>

                  {/* Professional Details Section */}
                  <div className="space-y-2 text-xs text-slate-600 border-t border-slate-50 pt-4 mb-4">
                    <div className="flex items-start space-x-2.5">
                      <GraduationCap className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span>{doc.education}</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <Briefcase className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <span>Clinical Experience: <strong>{doc.experience}</strong></span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <Clock className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <span className="text-slate-600">
                        Available: <strong>{doc.availability.days.join(', ')}</strong> ({doc.availability.hours})
                      </span>
                    </div>
                  </div>

                  {/* Specialty Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {doc.specialties.map((spec, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Booking Button */}
                <div className="pt-4 border-t border-slate-50">
                  <button
                    id={`doc-book-btn-${doc.id}`}
                    onClick={() => onBookWithDoctor(doc.id, doc.departmentId)}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/5 hover:scale-[1.01]"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Book Consultation Session</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          /* Empty search fallbacks */
          <div id="doctors-empty-state" className="bg-white rounded-3xl border border-slate-100 p-12 text-center max-w-md mx-auto shadow-sm">
            <Search className="h-10 w-10 text-slate-300 mx-auto mb-4" />
            <h3 className="text-base font-bold text-slate-800 tracking-tight">No specialists found</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              We couldn't find any medical experts matching your current search parameters. Try clearing some query keywords or choosing another department.
            </p>
            <button
              id="clear-doctor-filters-btn"
              onClick={() => {
                setSearchQuery('');
                setSelectedDeptId('all');
              }}
              className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all"
            >
              Clear Search Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
