// src/pages/Storage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

function Storage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Storage Actions</h2>
      <button
        onClick={() => navigate('/excessenergy')}
        className="w-64 h-16 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg shadow-md"
      >
        Excess Energy Sale
      </button>
    </div>
  );
}

export default Storage;
