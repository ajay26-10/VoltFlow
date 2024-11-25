import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const handleNavigation = (route) => {
    navigate(route);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600">
      <h1 className="text-4xl font-bold text-white mb-10">
        Energy Trading Platform
      </h1>
      <p className="text-lg text-white mb-8">
        Seamlessly manage energy transactions and transfers.
      </p>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <button
          onClick={() => handleNavigation('/producer')}
          className="w-52 h-20 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Producer
        </button>
        
        <button
          onClick={() => handleNavigation('/consumer')}
          className="w-52 h-20 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Consumer
        </button>
        
        <button
          onClick={() => handleNavigation('/regulator')}
          className="w-52 h-20 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Regulator
        </button>
        
        <button
          onClick={() => handleNavigation('/storage')}
          className="w-52 h-20 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Storage
        </button>
        
        <button
          onClick={() => handleNavigation('/finance')}
          className="w-52 h-20 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Finance
        </button>
      </div>
    </div>
  );
}

export default HomePage;
