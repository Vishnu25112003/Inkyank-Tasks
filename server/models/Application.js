import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  // Personal Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^\+?[\d\s\-\(\)]{10,}$/, 'Please enter a valid phone number']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required'],
    validate: {
      validator: function(date) {
        const age = (new Date() - date) / (365.25 * 24 * 60 * 60 * 1000);
        return age >= 16 && age <= 25;
      },
      message: 'Age must be between 16 and 25 years'
    }
  },
  
  // Address Information
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
    maxlength: [200, 'Address cannot exceed 200 characters']
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
    maxlength: [50, 'City cannot exceed 50 characters']
  },
  state: {
    type: String,
    required: [true, 'State/Province is required'],
    trim: true,
    maxlength: [50, 'State/Province cannot exceed 50 characters']
  },
  postalCode: {
    type: String,
    required: [true, 'Postal code is required'],
    trim: true,
    match: [/^[\w\s\-]{3,10}$/, 'Please enter a valid postal code']
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true,
    maxlength: [50, 'Country cannot exceed 50 characters']
  },
  
  // Academic Information
  highSchoolName: {
    type: String,
    required: [true, 'High school name is required'],
    trim: true,
    maxlength: [100, 'High school name cannot exceed 100 characters']
  },
  gpa: {
    type: Number,
    required: [true, 'GPA is required'],
    min: [0.0, 'GPA cannot be less than 0.0'],
    max: [4.0, 'GPA cannot exceed 4.0']
  },
  testScore: {
    type: Number,
    required: [true, 'Test score is required'],
    min: [400, 'Test score must be at least 400'],
    max: [1600, 'Test score cannot exceed 1600']
  },
  intendedMajor: {
    type: String,
    required: [true, 'Intended major is required'],
    trim: true,
    maxlength: [100, 'Intended major cannot exceed 100 characters']
  },
  personalStatement: {
    type: String,
    required: [true, 'Personal statement is required'],
    trim: true,
    minlength: [50, 'Personal statement must be at least 50 characters'],
    maxlength: [2000, 'Personal statement cannot exceed 2000 characters']
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
applicationSchema.index({ email: 1 });
applicationSchema.index({ lastName: 1, firstName: 1 });
applicationSchema.index({ createdAt: -1 });

export const Application = mongoose.model('Application', applicationSchema);