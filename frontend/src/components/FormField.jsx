import React from 'react';
import { AlertCircle } from 'lucide-react';

const FormField = ({
  label,
  name,
  type,
  value,
  onChange,
  error,
  required = false,
  placeholder,
  rows = 4,
  min,
  max,
  step
}) => {
  const baseInputClasses = `
    w-full px-4 py-3 border rounded-lg shadow-sm transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    ${error 
      ? 'border-red-300 bg-red-50' 
      : 'border-gray-300 bg-white hover:border-gray-400 focus:bg-white'
    }
  `;

  const handleChange = (e) => {
    onChange(name, e.target.value);
  };

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-900">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows}
          required={required}
          className={`${baseInputClasses} resize-vertical`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          step={step}
          className={baseInputClasses}
        />
      )}
      
      {error && (
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
};

export default FormField;