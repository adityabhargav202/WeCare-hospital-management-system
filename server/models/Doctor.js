import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Doctor name is required'],
    trim: true,
  },
  specialization: {
    type: String,
    trim: true,
  },
  department: {
    type: String,
    trim: true,
  },
  qualification: {
    type: String,
    trim: true,
  },
  experience: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
  },
  availableDays: {
    type: [String],
    default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  },
  availableTime: {
    type: String,
    default: '09:00 AM - 05:00 PM',
  },
  consultationFee: {
    type: Number,
    default: 500,
  },
  description: {
    type: String,
    trim: true,
  },
  // Frontend specific alignment fields
  role: {
    type: String,
    trim: true,
  },
  departmentId: {
    type: String,
    trim: true,
  },
  departmentName: {
    type: String,
    trim: true,
  },
  education: {
    type: String,
    trim: true,
  },
  rating: {
    type: Number,
    default: 4.8,
  },
  patientsServed: {
    type: Number,
    default: 100,
  },
  bio: {
    type: String,
    trim: true,
  },
  specialties: {
    type: [String],
    default: [],
  },
  availability: {
    days: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    hours: {
      type: String,
      default: '09:00 AM - 05:00 PM',
    }
  }
});

// Sync compound virtuals or pre-save triggers to make sure requested and frontend fields are always in sync
doctorSchema.pre('save', function (next) {
  // Sync specialization <-> specialties
  if (this.specialization && (!this.specialties || this.specialties.length === 0)) {
    this.specialties = [this.specialization];
  } else if (this.specialties && this.specialties.length > 0 && !this.specialization) {
    this.specialization = this.specialties[0];
  }

  // Sync description <-> bio
  if (this.description && !this.bio) {
    this.bio = this.description;
  } else if (this.bio && !this.description) {
    this.description = this.bio;
  }

  // Sync qualification <-> education
  if (this.qualification && !this.education) {
    this.education = this.qualification;
  } else if (this.education && !this.qualification) {
    this.qualification = this.education;
  }

  // Sync department <-> departmentId & departmentName
  if (this.department && !this.departmentName) {
    this.departmentName = this.department;
  }

  // Sync availableDays / availableTime <-> availability
  if (this.availableDays && this.availableDays.length > 0) {
    this.availability.days = this.availableDays;
  }
  if (this.availableTime) {
    this.availability.hours = this.availableTime;
  }

  next();
});

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
