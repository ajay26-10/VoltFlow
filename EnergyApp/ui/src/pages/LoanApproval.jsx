import React, { useState } from 'react';

function LoanApproval() {
  const [formData, setFormData] = useState({
    loanId: '',
    producerId: '',
    amount: '',
    interestRate: '',
    term: '',
  });
  const [response, setResponse] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/loanapproval', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    setResponse(data);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-bl from-green-500 to-blue-700">
      <h2 className="text-3xl font-bold text-white mb-8">Loan Approval</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <input
          name="loanId"
          placeholder="Loan ID"
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="producerId"
          placeholder="Producer ID"
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="amount"
          placeholder="Amount"
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="interestRate"
          placeholder="Interest Rate"
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="term"
          placeholder="Term"
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
        >
          Submit
        </button>
      </form>
      {response && (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6 max-w-md text-center">
          <p className="text-lg font-medium text-gray-800">{response.message}</p>
        </div>
      )}
    </div>
  );
}

export default LoanApproval;
