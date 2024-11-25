import React, { useState } from 'react';

function RecordEnergy() {
  const [formData, setFormData] = useState({ energyId: '', producer: '', energy: '', price: '' });
  const [response, setResponse] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/recordenergy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Record Energy</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="energyId"
            placeholder="Energy ID"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          <input
            name="producer"
            placeholder="Producer"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          <input
            name="energy"
            placeholder="Energy"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          <input
            name="price"
            placeholder="Price"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
          >
            Submit
          </button>
        </form>
        {response && (
          <p className={`mt-4 text-center ${response.success ? 'text-green-500' : 'text-red-500'}`}>
            {response.message}
          </p>
        )}
      </div>
    </div>
  );
}

export default RecordEnergy;
