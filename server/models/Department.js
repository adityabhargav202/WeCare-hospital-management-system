import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Department name is required'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
  // Frontend specific alignment fields
  id: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  iconName: {
    type: String,
    default: 'Activity',
  },
  detailedDescription: {
    type: String,
    trim: true,
  },
  services: {
    type: [String],
    default: [],
  },
  bannerImage: {
    type: String,
    trim: true,
  }
});

// Pre-save to auto-sync properties
departmentSchema.pre('save', function () {
  if (this.name && !this.id) {
    this.id = this.name.toLowerCase().replace(/\s+/g, '-');
  }
  if (this.image && !this.bannerImage) {
    this.bannerImage = this.image;
  } else if (this.bannerImage && !this.image) {
    this.image = this.bannerImage;
  }
  if (this.description && !this.detailedDescription) {
    this.detailedDescription = this.description;
  }
});

const Department = mongoose.model('Department', departmentSchema);
export default Department;