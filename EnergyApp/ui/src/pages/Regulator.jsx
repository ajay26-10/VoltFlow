// src/pages/Regulator.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

function Regulator() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Regulator Actions</h2>
      <button
        onClick={() => navigate('/auditsale')}
        className="w-64 h-16 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow-md"
      >
        Audit Sale
      </button>
      <button
        onClick={() => navigate('/energydetails')}
        className="w-64 h-16 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg shadow-md mt-4"
      >
        Energy Details
      </button>
    </div>
  );
}

export default Regulator;
