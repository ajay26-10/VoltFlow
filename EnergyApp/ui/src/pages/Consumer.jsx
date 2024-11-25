// src/pages/Consumer.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

function Consumer() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Consumer Actions</h2>
      <button
        onClick={() => navigate('/purchaseenergy')}
        className="w-64 h-16 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md"
      >
        Purchase Energy
      </button>
    </div>
  );
}

export default Consumer;
