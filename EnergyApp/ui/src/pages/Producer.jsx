// src/pages/Producer.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

function Producer() {
  const navigate = useNavigate();

  const handleNavigation = (route) => {
    navigate(route);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Producer Actions</h2>
      
      <div className="space-y-4">
        <button
          onClick={() => handleNavigation('/recordenergy')}
          className="w-64 h-16 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Record Energy
        </button>
        
        <button
          onClick={() => handleNavigation('/getenergy')}
          className="w-64 h-16 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Get Energy
        </button>
        
        <button
          onClick={() => handleNavigation('/listenergy')}
          className="w-64 h-16 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          List Energy
        </button>
      </div>
    </div>
  );
}

export default Producer;
