/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, FileText, CheckCircle, ArrowRight, ArrowLeft, Star, HeartPulse, CreditCard, Smartphone, ShieldCheck, Lock } from 'lucide-react';
import { DEPARTMENTS, DOCTORS, TIME_SLOTS } from '../data/hospitalData';
import { Appointment, Doctor, Department } from '../types';
import { appointmentService } from '../lib/api';

interface BookingFormProps {
  preselectedDoctorId?: string;
  preselectedDepartmentId?: string;
  onAddAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => void | Appointment;
  onNavigateToAppointments: () => void;
  doctors?: Doctor[];
  departments?: Department[];
}

export default function BookingForm({
  preselectedDoctorId,
  preselectedDepartmentId,
  onAddAppointment,
  onNavigateToAppointments,
  doctors = DOCTORS,
  departments = DEPARTMENTS
}: BookingFormProps) {
  // Wizard steps: 'specs' | 'dateTime' | 'patientDetails' | 'payment' | 'success'
  const [step, setStep] = useState<'specs' | 'dateTime' | 'patient' | 'payment' | 'success'>('specs');

  // Form State
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [selectedDocId, setSelectedDocId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  // Patient details state
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [reason, setReason] = useState('');

  // Form errors / status
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);

  // Payment (demo/mock) state
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [paymentErrors, setPaymentErrors] = useState<{ [key: string]: string }>({});
  const [processingPayment, setProcessingPayment] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  // Set min date to today dynamically to prevent booking past dates
  const todayDateStr = new Date().toISOString().split('T')[0];

  // Sync pre-selected specialists
  useEffect(() => {
    if (preselectedDepartmentId) {
      setSelectedDeptId(preselectedDepartmentId);
    }
    if (preselectedDoctorId) {
      setSelectedDocId(preselectedDoctorId);
      const doctor = doctors.find(d => d.id === preselectedDoctorId);
      if (doctor) {
        setSelectedDeptId(doctor.departmentId);
      }
    }
  }, [preselectedDoctorId, preselectedDepartmentId, doctors]);

  // Handle department changes - reset selected doctor if they are not in the new department
  const handleDepartmentChange = (deptId: string) => {
    setSelectedDeptId(deptId);
    setSelectedDocId(''); // Reset doctor choice
  };

  // Filter doctors based on selected department
  const availableDoctors = doctors.filter(
    (doc) => !selectedDeptId || doc.departmentId === selectedDeptId
  );

  const selectedDoctorDetails = doctors.find((d) => d.id === selectedDocId);
  const selectedDeptDetails = departments.find((d) => d.id === selectedDeptId);
  const consultationFee = selectedDoctorDetails?.consultationFee || 500;

  // Step 1: Specs Validation
  const validateSpecs = () => {
    const errs: { [key: string]: string } = {};
    if (!selectedDeptId) errs.department = 'Please select a medical department.';
    if (!selectedDocId) errs.doctor = 'Please select your preferred specialist.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 2: Date Time Validation
  const validateDateTime = () => {
    const errs: { [key: string]: string } = {};
    if (!selectedDate) errs.date = 'Please select a preferred date.';
    if (!selectedTime) errs.time = 'Please select an available consultation hour.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 3: Patient Form Validation
  const validatePatient = () => {
    const errs: { [key: string]: string } = {};
    if (!patientName.trim()) errs.name = 'Patient name is required.';
    
    if (!patientEmail.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(patientEmail)) {
      errs.email = 'Please provide a valid email format (e.g. name@domain.com).';
    }

    if (!patientPhone.trim()) {
      errs.phone = 'Contact number is required.';
    } else if (!/^\+?[0-9\s-]{7,15}$/.test(patientPhone)) {
      errs.phone = 'Provide a valid contact number (7-15 digits).';
    }

    if (!patientAge.trim()) {
      errs.age = 'Age is required.';
    } else {
      const ageNum = parseInt(patientAge);
      if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
        errs.age = 'Please enter a valid age (1-120).';
      }
    }

    if (!reason.trim()) errs.reason = 'Please state your brief symptoms or consult reason.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 4: Payment Validation (demo/mock — no real transaction occurs)
  const validatePayment = () => {
    const errs: { [key: string]: string } = {};

    if (paymentMethod === 'card') {
      if (!cardName.trim()) errs.cardName = 'Name on card is required.';
      const digitsOnly = cardNumber.replace(/\s/g, '');
      if (!digitsOnly) {
        errs.cardNumber = 'Card number is required.';
      } else if (!/^\d{16}$/.test(digitsOnly)) {
        errs.cardNumber = 'Enter a valid 16-digit card number.';
      }
      if (!cardExpiry.trim()) {
        errs.cardExpiry = 'Expiry date is required.';
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) {
        errs.cardExpiry = 'Use MM/YY format.';
      }
      if (!cardCvv.trim()) {
        errs.cardCvv = 'CVV is required.';
      } else if (!/^\d{3,4}$/.test(cardCvv)) {
        errs.cardCvv = 'Enter a valid 3-4 digit CVV.';
      }
    } else {
      if (!upiId.trim()) {
        errs.upiId = 'UPI ID is required.';
      } else if (!/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(upiId.trim())) {
        errs.upiId = 'Enter a valid UPI ID (e.g. name@bank).';
      }
    }

    setPaymentErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Navigation handlers
  const handleNextSpecs = () => {
    if (validateSpecs()) setStep('dateTime');
  };

  const handleNextDateTime = () => {
    if (validateDateTime()) setStep('patient');
  };

  const handleBackToSpecs = () => {
    setStep('specs');
  };

  const handleBackToDateTime = () => {
    setStep('dateTime');
  };

  // Patient details step -> move to Payment step (does not book yet)
  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePatient()) setStep('payment');
  };

  const handleBackToPatient = () => {
    setStep('patient');
  };

  // Final step: simulate payment, then actually create the appointment booking
  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePayment()) return;

    setProcessingPayment(true);
    setApiError('');

    // Simulate a brief payment gateway processing delay for realism
    await new Promise((resolve) => setTimeout(resolve, 1400));

    setSubmitting(true);
    try {
      // Build schema payload
      const payload = {
        doctorId: selectedDocId,
        doctorName: selectedDoctorDetails?.name || 'General Specialist',
        departmentId: selectedDeptId,
        departmentName: selectedDeptDetails?.name || 'General Division',
        patientName,
        email: patientEmail,
        phone: patientPhone,
        patientAge,
        symptoms: reason,
        reason,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        date: selectedDate,
        timeSlot: selectedTime,
      };

      // Call API to persist the appointment
      const response = await appointmentService.book(payload);
      if (response.success) {
        setCreatedAppointment(response.data);
        onAddAppointment(response.data);
        // Generate a mock transaction reference for the receipt
        setTransactionId('TXN' + Date.now().toString().slice(-10));
        setStep('success');
      } else {
        setApiError(response.message || 'Failed to book appointment after payment.');
      }
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Server error booking your appointment. Please check your credentials.');
    } finally {
      setSubmitting(false);
      setProcessingPayment(false);
    }
  };

  return (
    <div id="booking-flow-container" className="py-12 bg-slate-50/50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Wizard Progression Stepper Header */}
        {step !== 'success' && (
          <div id="booking-stepper" className="mb-10 flex justify-between items-center bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="flex items-center space-x-2.5">
              <span className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold font-mono border ${
                step === 'specs' 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                1
              </span>
              <span className="hidden sm:inline text-xs font-bold text-slate-700">Specialist Selection</span>
            </div>
            
            <div className="h-0.5 w-12 bg-slate-100 flex-grow mx-4" />

            <div className="flex items-center space-x-2.5">
              <span className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold font-mono border ${
                step === 'dateTime' 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : step === 'patient' 
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-slate-50 text-slate-400 border-slate-100'
              }`}>
                2
              </span>
              <span className="hidden sm:inline text-xs font-bold text-slate-700">Schedule Time</span>
            </div>

            <div className="h-0.5 w-12 bg-slate-100 flex-grow mx-4" />

            <div className="flex items-center space-x-2.5">
              <span className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold font-mono border ${
                step === 'patient' 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : step === 'payment'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-slate-50 text-slate-400 border-slate-100'
              }`}>
                3
              </span>
              <span className="hidden sm:inline text-xs font-bold text-slate-700">Patient Details</span>
            </div>

            <div className="h-0.5 w-12 bg-slate-100 flex-grow mx-4" />

            <div className="flex items-center space-x-2.5">
              <span className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold font-mono border ${
                step === 'payment' 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-slate-50 text-slate-400 border-slate-100'
              }`}>
                4
              </span>
              <span className="hidden sm:inline text-xs font-bold text-slate-700">Payment</span>
            </div>
          </div>
        )}

        {/* Dynamic Wizard Steps */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 sm:p-10">
          
          {/* STEP 1: CHOOSE DEPT AND DOCTOR */}
          {step === 'specs' && (
            <div id="step-specs-view" className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Select Medical Division & Specialist</h2>
                <p className="text-xs text-slate-500 mt-1">To connect you with the appropriate expert, select your target department and clinical doctor.</p>
              </div>

              {/* Department Select Dropdown */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Medical Department
                </label>
                <select
                  id="booking-dept-select"
                  value={selectedDeptId}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                  className="w-full bg-slate-50/80 border border-slate-200/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 transition-all font-medium text-slate-700"
                >
                  <option value="">-- Choose Department --</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <span className="text-[11px] font-semibold text-rose-600 font-mono flex items-center">
                    {errors.department}
                  </span>
                )}
              </div>

              {/* Doctor Selection Grid */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Preferred Medical Specialist
                </label>
                {selectedDeptId ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-1">
                    {availableDoctors.map((doc) => (
                      <div
                        key={doc.id}
                        id={`choose-doc-${doc.id}`}
                        onClick={() => setSelectedDocId(doc.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center space-x-3 ${
                          selectedDocId === doc.id
                            ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-500'
                            : 'border-slate-100 hover:bg-slate-50 hover:border-slate-200'
                        }`}
                      >
                        <img
                          src={doc.image}
                          alt={doc.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 truncate leading-tight">{doc.name}</h4>
                          <span className="text-[10px] text-blue-600 font-semibold block">{doc.role}</span>
                          <div className="flex items-center space-x-1 mt-0.5">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-[10px] font-bold text-slate-600 font-mono">{doc.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-6 text-center text-xs text-slate-500 font-medium">
                    Please select a Medical Department first to load our team of specialists.
                  </div>
                )}
                {errors.doctor && (
                  <span className="text-[11px] font-semibold text-rose-600 font-mono flex items-center">
                    {errors.doctor}
                  </span>
                )}
              </div>

              {/* Pre-selected Doctor Info Card */}
              {selectedDoctorDetails && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start space-x-4">
                  <img
                    src={selectedDoctorDetails.image}
                    alt={selectedDoctorDetails.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Assigned Consultant: {selectedDoctorDetails.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{selectedDoctorDetails.bio}</p>
                    <span className="inline-block mt-2 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                      Specialties: {selectedDoctorDetails.specialties.slice(0, 2).join(', ')}
                    </span>
                  </div>
                </div>
              )}

              {/* Next Button */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  id="step-specs-next-btn"
                  onClick={handleNextSpecs}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/10"
                >
                  <span>Select Date & Time</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CHOOSE DATE AND TIME */}
          {step === 'dateTime' && (
            <div id="step-datetime-view" className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-800 tracking-tight font-sans">Choose Preferred Consultation Slot</h2>
                <p className="text-xs text-slate-500 mt-1">Select a comfortable clinical day and precise consultation session hours.</p>
              </div>

              {/* Calendar input field */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Preferred Date
                </label>
                <div className="relative">
                  <input
                    id="booking-date-input"
                    type="date"
                    min={todayDateStr}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-slate-50/80 border border-slate-200/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 transition-all font-medium text-slate-700"
                  />
                </div>
                {errors.date && (
                  <span className="text-[11px] font-semibold text-rose-600 font-mono">
                    {errors.date}
                  </span>
                )}
              </div>

              {/* Specialist Availability Display */}
              {selectedDoctorDetails && (
                <div className="bg-blue-50/40 border border-blue-100 rounded-xl p-3.5 text-xs text-blue-800">
                  <p className="font-semibold">Doctor Availability Schedule:</p>
                  <p className="mt-0.5">
                    {selectedDoctorDetails.name} consults on: <strong>{selectedDoctorDetails.availability.days.join(', ')}</strong> during <strong>{selectedDoctorDetails.availability.hours}</strong>.
                  </p>
                </div>
              )}

              {/* Hour Slots selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Available Sessions
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      id={`time-slot-${slot.replace(':', '').replace(' ', '')}`}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2 px-1 rounded-xl text-center text-xs font-semibold tracking-tight transition-all border ${
                        selectedTime === slot
                          ? 'bg-blue-600 border-blue-600 text-white shadow-sm font-bold'
                          : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100 hover:border-slate-200'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                {errors.time && (
                  <span className="text-[11px] font-semibold text-rose-600 font-mono">
                    {errors.time}
                  </span>
                )}
              </div>

              {/* Stepper buttons */}
              <div className="pt-4 border-t border-slate-100 flex justify-between">
                <button
                  id="step-datetime-back-btn"
                  onClick={handleBackToSpecs}
                  className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-800 transition-all"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Choose Specialist</span>
                </button>
                <button
                  id="step-datetime-next-btn"
                  onClick={handleNextDateTime}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/10"
                >
                  <span>Fill Patient Details</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PATIENT INFORMATION */}
          {step === 'patient' && (
            <form onSubmit={handleNextToPayment} id="booking-patient-form" className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-800 tracking-tight font-sans">Patient Admission Details</h2>
                <p className="text-xs text-slate-500 mt-1">Please supply accurate patient records to register the clinical appointment correctly.</p>
              </div>

              {apiError && (
                <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-xs font-medium">
                  {apiError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                    Patient Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      id="patient-name-input"
                      type="text"
                      placeholder="e.g. Eleanor Vance"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 transition-all text-slate-700 font-medium"
                    />
                  </div>
                  {errors.name && <span className="text-[10px] font-semibold text-rose-600 font-mono">{errors.name}</span>}
                </div>

                {/* Patient Age */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                    Patient Age (Years)
                  </label>
                  <input
                    id="patient-age-input"
                    type="number"
                    placeholder="e.g. 28"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 transition-all text-slate-700 font-medium"
                  />
                  {errors.age && <span className="text-[10px] font-semibold text-rose-600 font-mono">{errors.age}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email address */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      id="patient-email-input"
                      type="email"
                      placeholder="e.g. eleanor@example.com"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 transition-all text-slate-700 font-medium"
                    />
                  </div>
                  {errors.email && <span className="text-[10px] font-semibold text-rose-600 font-mono">{errors.email}</span>}
                </div>

                {/* Contact phone number */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                    Contact Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      id="patient-phone-input"
                      type="tel"
                      placeholder="e.g. +1 (555) 019-2834"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 transition-all text-slate-700 font-medium"
                    />
                  </div>
                  {errors.phone && <span className="text-[10px] font-semibold text-rose-600 font-mono">{errors.phone}</span>}
                </div>
              </div>

              {/* Symptoms / Brief Description */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Reason for Consultation / Key Symptoms
                </label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <textarea
                    id="patient-reason-textarea"
                    rows={3}
                    placeholder="Briefly state symptoms, medical needs, or if this is a standard clinical follow-up..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 transition-all text-slate-700 font-medium"
                  />
                </div>
                {errors.reason && <span className="text-[10px] font-semibold text-rose-600 font-mono">{errors.reason}</span>}
              </div>

              {/* Action Stepper controls */}
              <div className="pt-4 border-t border-slate-100 flex justify-between">
                <button
                  id="step-patient-back-btn"
                  type="button"
                  onClick={handleBackToDateTime}
                  className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-800 transition-all"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Choose Schedule</span>
                </button>
                <button
                  id="booking-submit-btn"
                  type="submit"
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/10 hover:scale-[1.01]"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: PAYMENT (DEMO / MOCK — no real transaction occurs) */}
          {step === 'payment' && (
            <form onSubmit={handleConfirmPayment} id="booking-payment-form" className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-800 tracking-tight font-sans">Consultation Payment</h2>
                <p className="text-xs text-slate-500 mt-1">This is a demo payment step — no real transaction will be processed.</p>
              </div>

              {apiError && (
                <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-xs font-medium">
                  {apiError}
                </div>
              )}

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-2.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Consultant</span>
                  <strong className="text-slate-800">{selectedDoctorDetails?.name || 'General Specialist'}</strong>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Department</span>
                  <strong className="text-slate-800">{selectedDeptDetails?.name || 'General Division'}</strong>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Date &amp; Time</span>
                  <strong className="text-slate-800">{selectedDate} · {selectedTime}</strong>
                </div>
                <div className="flex justify-between items-center pt-2.5 border-t border-slate-200/70">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Consultation Fee</span>
                  <span className="text-lg font-extrabold text-blue-600 font-mono">₹{consultationFee}</span>
                </div>
              </div>

              <div className="flex bg-slate-100/90 p-1 rounded-2xl border border-slate-200/50">
                <button
                  id="payment-method-card-btn"
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    paymentMethod === 'card' ? 'bg-white text-blue-600 shadow-sm border border-slate-200/40' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Card</span>
                </button>
                <button
                  id="payment-method-upi-btn"
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    paymentMethod === 'upi' ? 'bg-white text-blue-600 shadow-sm border border-slate-200/40' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Smartphone className="h-4 w-4" />
                  <span>UPI</span>
                </button>
              </div>

              {paymentMethod === 'card' ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Name on Card</label>
                    <input
                      id="card-name-input"
                      type="text"
                      placeholder="e.g. Eleanor Vance"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 transition-all text-slate-700 font-medium"
                    />
                    {paymentErrors.cardName && <span className="text-[10px] font-semibold text-rose-600 font-mono">{paymentErrors.cardName}</span>}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        id="card-number-input"
                        type="text"
                        inputMode="numeric"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
                          setCardNumber(digits.replace(/(\d{4})(?=\d)/g, '$1 '));
                        }}
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 transition-all text-slate-700 font-medium font-mono"
                      />
                    </div>
                    {paymentErrors.cardNumber && <span className="text-[10px] font-semibold text-rose-600 font-mono">{paymentErrors.cardNumber}</span>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Expiry (MM/YY)</label>
                      <input
                        id="card-expiry-input"
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
                          setCardExpiry(digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
                        }}
                        className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 transition-all text-slate-700 font-medium font-mono"
                      />
                      {paymentErrors.cardExpiry && <span className="text-[10px] font-semibold text-rose-600 font-mono">{paymentErrors.cardExpiry}</span>}
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">CVV</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                        <input
                          id="card-cvv-input"
                          type="password"
                          inputMode="numeric"
                          placeholder="•••"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          className="w-full pl-10 pr-3 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 transition-all text-slate-700 font-medium font-mono"
                        />
                      </div>
                      {paymentErrors.cardCvv && <span className="text-[10px] font-semibold text-rose-600 font-mono">{paymentErrors.cardCvv}</span>}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">UPI ID</label>
                  <div className="relative">
                    <Smartphone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      id="upi-id-input"
                      type="text"
                      placeholder="yourname@bank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 transition-all text-slate-700 font-medium"
                    />
                  </div>
                  {paymentErrors.upiId && <span className="text-[10px] font-semibold text-rose-600 font-mono">{paymentErrors.upiId}</span>}
                </div>
              )}

              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>Simulated secure checkout — for demo purposes only. No real card or bank details are transmitted.</span>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between">
                <button
                  id="step-payment-back-btn"
                  type="button"
                  onClick={handleBackToPatient}
                  disabled={processingPayment || submitting}
                  className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-800 transition-all disabled:opacity-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Patient Details</span>
                </button>
                <button
                  id="confirm-payment-btn"
                  type="submit"
                  disabled={processingPayment || submitting}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/10 hover:scale-[1.01] disabled:opacity-50"
                >
                  <Lock className="h-4 w-4" />
                  <span>
                    {processingPayment || submitting ? 'Processing Payment...' : `Pay ₹${consultationFee} Now`}
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 5: SUCCESS CONFIRMATION RECEIPT */}
          {step === 'success' && createdAppointment && (
            <div id="booking-success-view" className="text-center space-y-6 animate-in zoom-in-95 duration-300">
              <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-100">
                <CheckCircle className="h-10 w-10 stroke-[2]" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight font-sans">Payment Successful — Appointment Booked!</h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Your payment was processed and the appointment receipt has been securely registered. A confirmation text and calendar invitation has been simulated to your registered contact coordinates.
                </p>
              </div>

              {/* Booking Summary Receipt details */}
              <div className="bg-slate-50 rounded-[32px] p-6 border border-slate-100 text-left max-w-md mx-auto space-y-4">
                <div className="flex justify-between border-b border-slate-200/60 pb-3">
                  <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">Appointment ID</span>
                  <span className="text-xs font-mono font-bold text-slate-700">{createdAppointment.id}</span>
                </div>

                <div className="flex justify-between border-b border-slate-200/60 pb-3">
                  <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">Transaction ID</span>
                  <span className="text-xs font-mono font-bold text-emerald-600">{transactionId}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Patient:</span>
                    <strong className="text-slate-800">{createdAppointment.patientName} ({createdAppointment.patientAge} Yrs)</strong>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Consultant:</span>
                    <strong className="text-slate-800">{createdAppointment.doctorName}</strong>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Division:</span>
                    <strong className="text-slate-800">{createdAppointment.departmentName}</strong>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Scheduled Date:</span>
                    <strong className="text-blue-600">{createdAppointment.date}</strong>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Scheduled Hour:</span>
                    <strong className="text-blue-600">{createdAppointment.timeSlot}</strong>
                  </div>
                  <div className="flex justify-between text-xs pt-2 border-t border-slate-200/60">
                    <span className="text-slate-500">Amount Paid:</span>
                    <strong className="text-emerald-600 font-mono">₹{consultationFee}.00</strong>
                  </div>
                </div>

                <div className="border-t border-slate-200/60 pt-3 text-[10px] text-slate-500 leading-normal flex items-start space-x-2">
                  <span className="font-bold text-amber-600 uppercase">Note:</span>
                  <span>Please present yourself at the <strong>{createdAppointment.departmentName} Desk</strong> 15 minutes prior to your scheduled hour with a valid photo ID.</span>
                </div>
              </div>

              {/* Action redirection buttons */}
              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  id="view-my-bookings-btn"
                  onClick={onNavigateToAppointments}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-6 py-2.5 rounded-xl transition-all"
                >
                  Manage My Appointments
                </button>
                <button
                  id="book-another-session-btn"
                  onClick={() => {
                    setStep('specs');
                    setSelectedDate('');
                    setSelectedTime('');
                    setPatientName('');
                    setPatientAge('');
                    setPatientEmail('');
                    setPatientPhone('');
                    setReason('');
                    setCardName('');
                    setCardNumber('');
                    setCardExpiry('');
                    setCardCvv('');
                    setUpiId('');
                    setTransactionId('');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-md shadow-blue-600/10"
                >
                  Schedule Another Appointment
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
