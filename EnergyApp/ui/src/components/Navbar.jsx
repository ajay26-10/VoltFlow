// src/components/Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold hover:text-gray-300 transition duration-300">
          Energy Trading Platform
        </Link>
        <div className="space-x-4">
          <Link
            to="/"
            className="text-white hover:text-gray-300 transition duration-300"
          >
            Home
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
