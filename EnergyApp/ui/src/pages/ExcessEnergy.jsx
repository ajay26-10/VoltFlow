import React, { useState } from 'react';

function ExcessEnergy() {
  const [formData, setFormData] = useState({
    storageId: '',
    consumerId: '',
    energy: '',
    price: '',
  });
  const [response, setResponse] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/excessenergy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    setResponse(data);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-indigo-500">
      <h2 className="text-3xl font-bold text-white mb-8">Excess Energy Sale</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg px-8 py-6 w-full max-w-md">
        <input
          name="storageId"
          placeholder="Storage ID"
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          name="consumerId"
          placeholder="Consumer ID"
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          name="energy"
          placeholder="Energy Amount"
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          name="price"
          placeholder="Price"
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
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

export default ExcessEnergy;
