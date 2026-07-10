import React, { useState, useEffect } from 'react';
import { 
  Users, Stethoscope, Building2, CalendarRange, 
  Clock, CheckCircle2, XCircle, Trash2, Edit, Plus, RefreshCw, 
  TrendingUp, Award, UserCheck, ShieldAlert
} from 'lucide-react';
import { adminService, doctorService, departmentService } from '../lib/api';
import { Doctor, Department, Appointment } from '../types';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'appointments' | 'doctors' | 'departments' | 'users'>('appointments');
  
  // Dashboard metrics
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
  });

  // Database Collections lists
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  // Action Loading states
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Modals / Forms state
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<any | null>(null);
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    role: 'Senior Consultant',
    bio: '',
    education: '',
    experience: '10 Years',
    image: '',
    availableDays: 'Mon, Wed, Fri',
    availableTime: '09:00 AM - 05:00 PM',
    rating: '4.9',
    patientsServed: 1200,
    specialties: 'Cardiovascular Care, Angioplasty',
    departmentId: '',
  });

  const [showDeptModal, setShowDeptModal] = useState(false);
  const [editingDept, setEditingDept] = useState<any | null>(null);
  const [deptForm, setDeptForm] = useState({
    name: '',
    description: '',
    detailedDescription: '',
    services: 'Diagnostic testing, Advanced consulting',
    image: '',
    iconName: 'HeartPulse',
  });

  // Fetch Dashboard Stats and Collections
  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Load Stats
      const statsRes = await adminService.getDashboardStats();
      if (statsRes.success) {
        setStats(statsRes.stats);
      }

      // 2. Load Appointments
      const aptsRes = await adminService.getAllAppointments();
      if (aptsRes.success) {
        setAppointments(aptsRes.data);
      }

      // 3. Load Doctors
      const docsRes = await doctorService.getDoctors();
      if (docsRes.success) {
        setDoctors(docsRes.data);
      }

      // 4. Load Departments
      const deptsRes = await departmentService.getDepartments();
      if (deptsRes.success) {
        setDepartments(deptsRes.data);
      }

      // 5. Load Users
      const usersRes = await adminService.getUsers();
      if (usersRes.success) {
        setUsers(usersRes.data);
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch full administrative records from the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Appointment Actions
  const handleUpdateAptStatus = async (id: string, status: string) => {
    try {
      const res = await adminService.updateAppointmentStatus(id, status);
      if (res.success) {
        setMessage(`Appointment status updated to ${status}.`);
        loadDashboardData();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update appointment status.');
    }
  };

  // Doctor CRUD Actions
  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...doctorForm,
        specialties: doctorForm.specialties.split(',').map(s => s.trim()).filter(Boolean),
        availability: {
          days: doctorForm.availableDays.split(',').map(d => d.trim()).filter(Boolean),
          hours: doctorForm.availableTime,
        },
      };

      let res;
      if (editingDoctor) {
        res = await doctorService.updateDoctor(editingDoctor._id, formattedData);
      } else {
        res = await doctorService.createDoctor(formattedData);
      }

      if (res.success) {
        setMessage(editingDoctor ? 'Doctor profile updated.' : 'New Doctor registered.');
        setShowDoctorModal(false);
        setEditingDoctor(null);
        // Reset form
        setDoctorForm({
          name: '', role: 'Senior Consultant', bio: '', education: '', experience: '10 Years',
          image: '', availableDays: 'Mon, Wed, Fri', availableTime: '09:00 AM - 05:00 PM',
          rating: '4.9', patientsServed: 1200, specialties: 'Cardiovascular Care, Angioplasty',
          departmentId: '',
        });
        loadDashboardData();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit doctor data.');
    }
  };

  const handleEditDoctor = (doc: any) => {
    setEditingDoctor(doc);
    setDoctorForm({
      name: doc.name,
      role: doc.role,
      bio: doc.bio,
      education: doc.education,
      experience: doc.experience,
      image: doc.image,
      availableDays: doc.availability?.days?.join(', ') || doc.availableDays || 'Mon, Wed, Fri',
      availableTime: doc.availability?.hours || doc.availableTime || '09:00 AM - 05:00 PM',
      rating: doc.rating,
      patientsServed: doc.patientsServed,
      specialties: doc.specialties?.join(', ') || '',
      departmentId: doc.departmentId || '',
    });
    setShowDoctorModal(true);
  };

  const handleDeleteDoctor = async (id: string) => {
    if (window.confirm('Are you absolutely sure you want to delete this doctor? This cannot be undone.')) {
      try {
        const res = await doctorService.deleteDoctor(id);
        if (res.success) {
          setMessage('Doctor removed successfully.');
          loadDashboardData();
          setTimeout(() => setMessage(''), 3000);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete doctor.');
      }
    }
  };

  // Department CRUD Actions
  const handleDeptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...deptForm,
        services: deptForm.services.split(',').map(s => s.trim()).filter(Boolean),
      };

      let res;
      if (editingDept) {
        res = await departmentService.updateDepartment(editingDept._id, formattedData);
      } else {
        res = await departmentService.createDepartment(formattedData);
      }

      if (res.success) {
        setMessage(editingDept ? 'Department details updated.' : 'New Department created.');
        setShowDeptModal(false);
        setEditingDept(null);
        setDeptForm({
          name: '', description: '', detailedDescription: '', services: 'Diagnostic testing, Advanced consulting',
          image: '', iconName: 'HeartPulse',
        });
        loadDashboardData();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save department details.');
    }
  };

  const handleEditDept = (dept: any) => {
    setEditingDept(dept);
    setDeptForm({
      name: dept.name,
      description: dept.description,
      detailedDescription: dept.detailedDescription || dept.description,
      services: dept.services?.join(', ') || '',
      image: dept.image,
      iconName: dept.iconName || 'HeartPulse',
    });
    setShowDeptModal(true);
  };

  const handleDeleteDept = async (id: string) => {
    if (window.confirm('Are you absolutely sure you want to delete this department? This cannot be undone.')) {
      try {
        const res = await departmentService.deleteDepartment(id);
        if (res.success) {
          setMessage('Department removed successfully.');
          loadDashboardData();
          setTimeout(() => setMessage(''), 3000);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete department.');
      }
    }
  };

  return (
    <div id="admin-dashboard-container" className="py-8 bg-slate-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-200/50 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-slate-800">
              <ShieldAlert className="h-5 w-5 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-widest font-mono">WeCare Admin Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">Hospital Control Center</h1>
            <p className="text-xs text-slate-500">Real-time stats monitor, physician database, and patient schedule managers.</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={loadDashboardData}
              disabled={loading}
              className="flex items-center space-x-1 px-3.5 py-2 rounded-xl bg-white text-slate-700 text-xs font-semibold border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Sync</span>
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-amber-400 text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              Log Out Control Panel
            </button>
          </div>
        </div>

        {/* Action Alerts */}
        {message && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-xs font-medium mb-6">
            {message}
          </div>
        )}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-xs font-medium mb-6">
            {error}
          </div>
        )}

        {/* STATS PANEL CARDS */}
        <div id="admin-stats-grid" className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Specialists</span>
              <span className="text-2xl font-bold font-mono text-slate-800 block">{stats.totalDoctors}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registered Patients</span>
              <span className="text-2xl font-bold font-mono text-slate-800 block">{stats.totalPatients}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <CalendarRange className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">All Appointments</span>
              <span className="text-2xl font-bold font-mono text-slate-800 block">{stats.totalAppointments}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Actions</span>
              <span className="text-2xl font-bold font-mono text-slate-800 block">{stats.pendingAppointments}</span>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION CONTROLS */}
        <div className="flex border-b border-slate-200/60 mb-6 bg-white p-1 rounded-2xl border border-slate-100 w-fit">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'appointments' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Manage Appointments ({appointments.length})
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'doctors' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Doctors Database ({doctors.length})
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'departments' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Divisions Catalog ({departments.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'users' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Registered Accounts ({users.length})
          </button>
        </div>

        {/* CONTENT DOCK SECTION */}

        {/* 1. APPOINTMENTS CONTROL PANEL */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-extrabold text-slate-800">Booking Management Deck</h3>
                <p className="text-[11px] text-slate-400">Approve schedules, reject requests, or flag status modifications.</p>
              </div>
            </div>

            {appointments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4">Code</th>
                      <th className="py-3 px-4">Patient details</th>
                      <th className="py-3 px-4">Specialist & Dept</th>
                      <th className="py-3 px-4">Scheduled Date/Slot</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-xs">
                    {appointments.map((apt) => (
                      <tr key={apt._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-4 font-mono font-bold text-slate-700">{apt.id}</td>
                        <td className="py-4 px-4">
                          <strong className="text-slate-800 block">{apt.patientName}</strong>
                          <span className="text-[10px] text-slate-400 block">{apt.email} • {apt.phone}</span>
                        </td>
                        <td className="py-4 px-4">
                          <strong className="text-slate-700 block">{apt.doctorName}</strong>
                          <span className="text-[10px] text-blue-600 font-medium block">{apt.departmentName}</span>
                        </td>
                        <td className="py-4 px-4 text-slate-600">
                          <strong className="block">{apt.date || apt.appointmentDate}</strong>
                          <span className="text-[10px] text-slate-400 block">{apt.timeSlot || apt.appointmentTime}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                            apt.status?.toLowerCase() === 'approved' || apt.status?.toLowerCase() === 'scheduled' || apt.status?.toLowerCase() === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : apt.status?.toLowerCase() === 'cancelled' || apt.status?.toLowerCase() === 'rejected'
                                ? 'bg-rose-50 text-rose-700 border border-rose-100'
                                : 'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                            {apt.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex justify-end space-x-1">
                            <button
                              onClick={() => handleUpdateAptStatus(apt._id, 'Confirmed')}
                              title="Confirm Session"
                              className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleUpdateAptStatus(apt._id, 'Rejected')}
                              title="Reject Session"
                              className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                No appointment bookings registered in the system yet.
              </div>
            )}
          </div>
        )}

        {/* 2. DOCTORS DIRECTORY CRUD */}
        {activeTab === 'doctors' && (
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-800">Medical Specialists Database</h3>
                <p className="text-[11px] text-slate-400">List, edit profile logs, experience tags, and availability schedules.</p>
              </div>
              <button
                onClick={() => {
                  setEditingDoctor(null);
                  setDoctorForm({
                    name: '', role: 'Senior Consultant', bio: '', education: '', experience: '10 Years',
                    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300', availableDays: 'Mon, Wed, Fri', availableTime: '09:00 AM - 05:00 PM',
                    rating: '4.9', patientsServed: 1200, specialties: 'General Health Care, Medicine',
                    departmentId: departments[0]?.id || '',
                  });
                  setShowDoctorModal(true);
                }}
                className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/10"
              >
                <Plus className="h-4 w-4" />
                <span>Onboard Physician</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doc) => (
                <div key={doc._id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/30 flex items-start justify-between">
                  <div className="flex items-start space-x-4 min-w-0">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-100 shadow-sm flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <strong className="text-xs font-extrabold text-slate-800 block truncate">{doc.name}</strong>
                      <span className="text-[10px] text-blue-600 font-semibold block">{doc.role}</span>
                      <span className="text-[10px] text-slate-400 block mt-1">Exp: {doc.experience}</span>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {doc.specialties?.slice(0, 2).map((s: string, i: number) => (
                          <span key={i} className="text-[9px] bg-white border border-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEditDoctor(doc)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-white rounded-lg transition-all"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDoctor(doc._id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. DEPARTMENTS DIRECTORY CRUD */}
        {activeTab === 'departments' && (
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-800">Medical Divisions & Specializations</h3>
                <p className="text-[11px] text-slate-400">Configure medical wards, services lists, wait timers, and details.</p>
              </div>
              <button
                onClick={() => {
                  setEditingDept(null);
                  setDeptForm({
                    name: '', description: '', detailedDescription: '', services: 'Clinical diagnostics, Consulting',
                    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400', iconName: 'HeartPulse',
                  });
                  setShowDeptModal(true);
                }}
                className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/10"
              >
                <Plus className="h-4 w-4" />
                <span>Create Department</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((dept) => (
                <div key={dept._id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/30 flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800 block">{dept.name}</h4>
                    <p className="text-[10px] text-slate-400 leading-normal mt-1 max-w-xs">{dept.description}</p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {dept.services?.slice(0, 3).map((s: string, i: number) => (
                        <span key={i} className="text-[8px] bg-blue-50/60 text-blue-700 font-bold px-1.5 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-1 flex-shrink-0">
                    <button
                      onClick={() => handleEditDept(dept)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-white rounded-lg transition-all"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDept(dept._id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. REGISTERED USERS LIST */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden p-6 sm:p-8">
            <div className="mb-6">
              <h3 className="text-base font-extrabold text-slate-800">User Account Registry</h3>
              <p className="text-[11px] text-slate-400">Total registered patients and administrators recorded on MongoDB.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Full Name</th>
                    <th className="py-3 px-4">Email Coordinates</th>
                    <th className="py-3 px-4">Phone Number</th>
                    <th className="py-3 px-4">Role Position</th>
                    <th className="py-3 px-4">Created At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/30">
                      <td className="py-3.5 px-4 font-bold text-slate-800">{u.fullName}</td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">{u.email}</td>
                      <td className="py-3.5 px-4 text-slate-500">{u.phone}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          u.role === 'admin' ? 'bg-slate-800 text-amber-400' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {u.role?.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[10px]">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DOCTOR CREATION/EDITING MODAL */}
        {showDoctorModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-base font-bold text-slate-900">{editingDoctor ? 'Edit Specialist Profile' : 'Onboard New Specialist'}</h3>
              
              <form onSubmit={handleDoctorSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400">Physician Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Dr. Allison Vance"
                    value={doctorForm.name}
                    onChange={(e) => setDoctorForm({...doctorForm, name: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400">Role Rank</label>
                    <input
                      type="text"
                      required
                      placeholder="Senior Consultant"
                      value={doctorForm.role}
                      onChange={(e) => setDoctorForm({...doctorForm, role: e.target.value})}
                      className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400">Department Division</label>
                    <select
                      value={doctorForm.departmentId}
                      required
                      onChange={(e) => setDoctorForm({...doctorForm, departmentId: e.target.value})}
                      className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl"
                    >
                      <option value="">-- Choose Division --</option>
                      {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400">Brief Bio Summary</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Brief physician intro bio..."
                    value={doctorForm.bio}
                    onChange={(e) => setDoctorForm({...doctorForm, bio: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400">Education Background</label>
                  <input
                    type="text"
                    required
                    placeholder="MD, Stanford Medical School"
                    value={doctorForm.education}
                    onChange={(e) => setDoctorForm({...doctorForm, education: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400">Experience Years</label>
                    <input
                      type="text"
                      required
                      placeholder="12 Years"
                      value={doctorForm.experience}
                      onChange={(e) => setDoctorForm({...doctorForm, experience: e.target.value})}
                      className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400">Physician Image Link</label>
                    <input
                      type="text"
                      required
                      placeholder="Image URL"
                      value={doctorForm.image}
                      onChange={(e) => setDoctorForm({...doctorForm, image: e.target.value})}
                      className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400">Available Days</label>
                    <input
                      type="text"
                      required
                      placeholder="Mon, Tue, Wed"
                      value={doctorForm.availableDays}
                      onChange={(e) => setDoctorForm({...doctorForm, availableDays: e.target.value})}
                      className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400">Available Hours</label>
                    <input
                      type="text"
                      required
                      placeholder="09:00 AM - 05:00 PM"
                      value={doctorForm.availableTime}
                      onChange={(e) => setDoctorForm({...doctorForm, availableTime: e.target.value})}
                      className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400">Specialty Tags (Comma separated)</label>
                  <input
                    type="text"
                    required
                    placeholder="Cardiovascular Care, Stents, Angioplasty"
                    value={doctorForm.specialties}
                    onChange={(e) => setDoctorForm({...doctorForm, specialties: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDoctorModal(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                  >
                    Save Physician Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DEPARTMENT CREATION/EDITING MODAL */}
        {showDeptModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-base font-bold text-slate-900">{editingDept ? 'Edit Division Details' : 'Create New Division'}</h3>
              
              <form onSubmit={handleDeptSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400">Division Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Pediatrics"
                    value={deptForm.name}
                    onChange={(e) => setDeptForm({...deptForm, name: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400">Quick Grid Description</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Brief description for departments listing catalog..."
                    value={deptForm.description}
                    onChange={(e) => setDeptForm({...deptForm, description: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400">Detailed Ward Description</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Detailed page description explaining standard treatments..."
                    value={deptForm.detailedDescription}
                    onChange={(e) => setDeptForm({...deptForm, detailedDescription: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400">Wards/Services List (Comma separated)</label>
                  <input
                    type="text"
                    required
                    placeholder="Child Immunizations, Pediatric Emergency, Well-Child exams"
                    value={deptForm.services}
                    onChange={(e) => setDeptForm({...deptForm, services: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400">Banner Photo link</label>
                    <input
                      type="text"
                      required
                      placeholder="Photo URL link"
                      value={deptForm.image}
                      onChange={(e) => setDeptForm({...deptForm, image: e.target.value})}
                      className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400">Lucide Icon Name</label>
                    <select
                      value={deptForm.iconName}
                      onChange={(e) => setDeptForm({...deptForm, iconName: e.target.value})}
                      className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl font-mono"
                    >
                      <option value="HeartPulse">HeartPulse</option>
                      <option value="Brain">Brain</option>
                      <option value="Bone">Bone</option>
                      <option value="Baby">Baby</option>
                      <option value="Eye">Eye</option>
                      <option value="Activity">Activity</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDeptModal(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                  >
                    Save Division Details
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
