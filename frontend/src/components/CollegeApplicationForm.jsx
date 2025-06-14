import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Loader2, Mail } from 'lucide-react';
import axios from 'axios';
import FormField from './FormField';
import { validateForm } from '../utils/validation';

const CollegeApplicationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    highSchoolName: '',
    gpa: '',
    testScore: '',
    intendedMajor: '',
    personalStatement: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await axios.post('http://localhost:5000/api/applications', {
        ...formData,
        gpa: parseFloat(formData.gpa),
        testScore: parseInt(formData.testScore)
      });

      if (response.data.success) {
        setSubmitStatus('success');
        setSubmitMessage(response.data.message || 'Application submitted successfully! You will receive a confirmation email shortly.');
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          dateOfBirth: '',
          address: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
          highSchoolName: '',
          gpa: '',
          testScore: '',
          intendedMajor: '',
          personalStatement: ''
        });
      }
    } catch (error) {
      setSubmitStatus('error');
      if (error.response?.data?.message) {
        setSubmitMessage(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const serverErrors = {};
        error.response.data.errors.forEach((err) => {
          serverErrors[err.field] = err.message;
        });
        setErrors(serverErrors);
        setSubmitMessage('Please fix the errors below and try again.');
      } else {
        setSubmitMessage('Failed to submit application. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">Application Form</h2>
          <p className="text-blue-100 mt-2">Please fill out all required fields carefully</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Personal Information Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="First Name"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                error={errors.firstName}
                required
              />
              <FormField
                label="Last Name"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                error={errors.lastName}
                required
              />
              <FormField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                required
              />
              <FormField
                label="Phone Number"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                error={errors.phoneNumber}
                required
                placeholder="+1 (555) 123-4567"
              />
              <FormField
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                error={errors.dateOfBirth}
                required
              />
            </div>
          </div>

          {/* Address Information Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Address Information
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <FormField
                label="Street Address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleInputChange}
                error={errors.address}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FormField
                  label="City"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleInputChange}
                  error={errors.city}
                  required
                />
                <FormField
                  label="State/Province"
                  name="state"
                  type="text"
                  value={formData.state}
                  onChange={handleInputChange}
                  error={errors.state}
                  required
                />
                <FormField
                  label="Postal Code"
                  name="postalCode"
                  type="text"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  error={errors.postalCode}
                  required
                />
                <FormField
                  label="Country"
                  name="country"
                  type="text"
                  value={formData.country}
                  onChange={handleInputChange}
                  error={errors.country}
                  required
                />
              </div>
            </div>
          </div>

          {/* Academic Information Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Academic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="High School Name"
                name="highSchoolName"
                type="text"
                value={formData.highSchoolName}
                onChange={handleInputChange}
                error={errors.highSchoolName}
                required
              />
              <FormField
                label="GPA (0.0 - 4.0)"
                name="gpa"
                type="number"
                value={formData.gpa}
                onChange={handleInputChange}
                error={errors.gpa}
                required
                step="0.01"
                min="0"
                max="4"
              />
              <FormField
                label="SAT/ACT Score"
                name="testScore"
                type="number"
                value={formData.testScore}
                onChange={handleInputChange}
                error={errors.testScore}
                required
                min="400"
                max="1600"
              />
              <FormField
                label="Intended Major"
                name="intendedMajor"
                type="text"
                value={formData.intendedMajor}
                onChange={handleInputChange}
                error={errors.intendedMajor}
                required
              />
            </div>
            <FormField
              label="Personal Statement"
              name="personalStatement"
              type="textarea"
              value={formData.personalStatement}
              onChange={handleInputChange}
              error={errors.personalStatement}
              required
              placeholder="Tell us about yourself, your goals, and why you want to attend our college... (50-2000 characters)"
              rows={6}
            />
          </div>

          {/* Submit Status */}
          {submitStatus !== 'idle' && (
            <div className={`p-4 rounded-lg flex items-start space-x-3 ${
              submitStatus === 'success' 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              {submitStatus === 'success' ? (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <Mail className="h-5 w-5 text-green-600 flex-shrink-0" />
                </div>
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`text-sm font-medium ${
                  submitStatus === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {submitStatus === 'success' ? 'Application Submitted Successfully!' : 'Submission Failed'}
                </p>
                <p className={`text-sm mt-1 ${
                  submitStatus === 'success' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {submitMessage}
                </p>
                {submitStatus === 'success' && (
                  <p className="text-xs text-green-600 mt-2">
                    📧 Check your email for a confirmation message with your application details.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollegeApplicationForm;