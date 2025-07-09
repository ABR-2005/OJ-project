import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext'; // Add this import

export default function AddProblem() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    sampleInput: '',
    sampleOutput: '',
    difficulty: 'Easy',
    timeLimit: 2000,
    testCases: ''
  });
  const [message, setMessage] = useState('');
  const { token } = useAuth(); // Get token from context

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const testCases = JSON.parse(form.testCases);
      await axios.post('http://localhost:5000/api/problem/', {
        ...form,
        testCases
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessage('Problem added!');
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Add New Problem</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="title" placeholder="Title" className="border p-2 w-full" value={form.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" className="border p-2 w-full" value={form.description} onChange={handleChange} required />
        <input name="sampleInput" placeholder="Sample Input" className="border p-2 w-full" value={form.sampleInput} onChange={handleChange} required />
        <input name="sampleOutput" placeholder="Sample Output" className="border p-2 w-full" value={form.sampleOutput} onChange={handleChange} required />
        <input name="difficulty" placeholder="Difficulty" className="border p-2 w-full" value={form.difficulty} onChange={handleChange} required />
        <input name="timeLimit" type="number" placeholder="Time Limit (ms)" className="border p-2 w-full" value={form.timeLimit} onChange={handleChange} required />
        <textarea name="testCases" placeholder='Test Cases (JSON array: [{"input":"1 2","expectedOutput":"3","isHidden":false}])' className="border p-2 w-full" value={form.testCases} onChange={handleChange} required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Problem</button>
      </form>
      {message && <div className="mt-2">{message}</div>}
    </div>
  );
}
