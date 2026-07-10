/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Doctor {
  id: string;
  name: string;
  role: string;
  departmentId: string;
  departmentName: string;
  experience: string;
  education: string;
  rating: number;
  patientsServed: number;
  consultationFee?: number;
  image: string;
  bio: string;
  specialties: string[];
  availability: {
    days: string[];
    hours: string;
  };
}

export interface Department {
  id: string;
  name: string;
  iconName: string; // Used to reference a Lucide icon
  description: string;
  detailedDescription: string;
  services: string[];
  bannerImage: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientAge: string;
  reason: string;
  departmentId: string;
  departmentName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  timeSlot: string;
  status: 'scheduled' | 'cancelled' | 'Pending' | 'Approved' | 'Cancelled' | 'Rejected' | 'Confirmed';
  createdAt: string;
}
