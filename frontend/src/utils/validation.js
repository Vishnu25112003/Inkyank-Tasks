export const validateForm = (data) => {
  const errors = {};

  // Personal Information Validation
  if (!data.firstName.trim()) {
    errors.firstName = 'First name is required';
  } else if (data.firstName.length > 50) {
    errors.firstName = 'First name cannot exceed 50 characters';
  }

  if (!data.lastName.trim()) {
    errors.lastName = 'Last name is required';
  } else if (data.lastName.length > 50) {
    errors.lastName = 'Last name cannot exceed 50 characters';
  }

  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.phoneNumber.trim()) {
    errors.phoneNumber = 'Phone number is required';
  } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(data.phoneNumber)) {
    errors.phoneNumber = 'Please enter a valid phone number';
  }

  if (!data.dateOfBirth) {
    errors.dateOfBirth = 'Date of birth is required';
  } else {
    const birthDate = new Date(data.dateOfBirth);
    const today = new Date();
    const age = (today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    
    if (age < 16 || age > 25) {
      errors.dateOfBirth = 'Age must be between 16 and 25 years';
    }
  }

  // Address Information Validation
  if (!data.address.trim()) {
    errors.address = 'Address is required';
  } else if (data.address.length > 200) {
    errors.address = 'Address cannot exceed 200 characters';
  }

  if (!data.city.trim()) {
    errors.city = 'City is required';
  } else if (data.city.length > 50) {
    errors.city = 'City cannot exceed 50 characters';
  }

  if (!data.state.trim()) {
    errors.state = 'State/Province is required';
  } else if (data.state.length > 50) {
    errors.state = 'State/Province cannot exceed 50 characters';
  }

  if (!data.postalCode.trim()) {
    errors.postalCode = 'Postal code is required';
  } else if (!/^[\w\s\-]{3,10}$/.test(data.postalCode)) {
    errors.postalCode = 'Please enter a valid postal code';
  }

  if (!data.country.trim()) {
    errors.country = 'Country is required';
  } else if (data.country.length > 50) {
    errors.country = 'Country cannot exceed 50 characters';
  }

  // Academic Information Validation
  if (!data.highSchoolName.trim()) {
    errors.highSchoolName = 'High school name is required';
  } else if (data.highSchoolName.length > 100) {
    errors.highSchoolName = 'High school name cannot exceed 100 characters';
  }

  if (!data.gpa.trim()) {
    errors.gpa = 'GPA is required';
  } else {
    const gpaValue = parseFloat(data.gpa);
    if (isNaN(gpaValue) || gpaValue < 0.0 || gpaValue > 4.0) {
      errors.gpa = 'GPA must be between 0.0 and 4.0';
    }
  }

  if (!data.testScore.trim()) {
    errors.testScore = 'Test score is required';
  } else {
    const scoreValue = parseInt(data.testScore);
    if (isNaN(scoreValue) || scoreValue < 400 || scoreValue > 1600) {
      errors.testScore = 'Test score must be between 400 and 1600';
    }
  }

  if (!data.intendedMajor.trim()) {
    errors.intendedMajor = 'Intended major is required';
  } else if (data.intendedMajor.length > 100) {
    errors.intendedMajor = 'Intended major cannot exceed 100 characters';
  }

  if (!data.personalStatement.trim()) {
    errors.personalStatement = 'Personal statement is required';
  } else if (data.personalStatement.length < 50) {
    errors.personalStatement = 'Personal statement must be at least 50 characters';
  } else if (data.personalStatement.length > 2000) {
    errors.personalStatement = 'Personal statement cannot exceed 2000 characters';
  }

  return errors;
};