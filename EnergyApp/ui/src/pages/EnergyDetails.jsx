import React, { useState } from 'react';

function EnergyDetails() {
  const [energyId, setEnergyId] = useState('');
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/energydetails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ energyId }),
    });
    const data = await res.json();
    setResponse(data);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-blue-500">
      <h2 className="text-3xl font-bold text-white mb-8">Energy Details</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <input
          value={energyId}
          onChange={(e) => setEnergyId(e.target.value)}
          placeholder="Energy ID"
          className="mb-4 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
        >
          Submit
        </button>
      </form>
      {response && (
        <div className="bg-white p-6 rounded-lg shadow-lg mt-6 max-w-md text-center">
          <p className="text-lg font-semibold text-gray-700">{response.message}</p>
        </div>
      )}
    </div>
  );
}

export default EnergyDetails;
