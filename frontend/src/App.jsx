import React from 'react';
import CollegeApplicationForm from './components/CollegeApplicationForm';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            College Application Portal
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Take the first step towards your academic future. Complete your application with care and attention to detail.
          </p>
        </div>
        <CollegeApplicationForm />
      </div>
    </div>
  );
}

export default App;