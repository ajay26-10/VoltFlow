// src/pages/Finance.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

function Finance() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Finance Actions</h2>
      <button
        onClick={() => navigate('/loanapproval')}
        className="w-64 h-16 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg shadow-md"
      >
        Loan Approval
      </button>
    </div>
  );
}

export default Finance;
