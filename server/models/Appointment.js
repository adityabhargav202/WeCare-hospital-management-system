import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctorId: {
    type: String,
    required: [true, 'Doctor ID is required'],
  },
  departmentId: {
    type: String,
    required: [true, 'Department ID is required'],
  },
  patientName: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  appointmentDate: {
    type: String,
    required: [true, 'Appointment date is required'],
  },
  appointmentTime: {
    type: String,
    required: [true, 'Appointment time is required'],
  },
  symptoms: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Confirmed', 'Rejected', 'Cancelled', 'Completed', 'scheduled', 'cancelled'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Frontend specific alignment fields
  patientAge: {
    type: String,
    trim: true,
  },
  reason: {
    type: String,
    trim: true,
  },
  departmentName: {
    type: String,
    trim: true,
  },
  doctorName: {
    type: String,
    trim: true,
  },
  date: {
    type: String,
  },
  timeSlot: {
    type: String,
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Pre-save to keep frontend and backend naming perfectly synchronized
appointmentSchema.pre('save', function () {
  if (this.appointmentDate && !this.date) {
    this.date = this.appointmentDate;
  } else if (this.date && !this.appointmentDate) {
    this.appointmentDate = this.date;
  }

  if (this.appointmentTime && !this.timeSlot) {
    this.timeSlot = this.appointmentTime;
  } else if (this.timeSlot && !this.appointmentTime) {
    this.appointmentTime = this.timeSlot;
  }

  if (this.symptoms && !this.reason) {
    this.reason = this.symptoms;
  } else if (this.reason && !this.symptoms) {
    this.symptoms = this.reason;
  }

  // Handle status equivalence
  if (this.status === 'scheduled') {
    // Treat as Approved or Pending depending on context, or keep scheduled
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;