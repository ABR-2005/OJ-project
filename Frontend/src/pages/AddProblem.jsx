import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

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
  const [error, setError] = useState('');
  const [validJson, setValidJson] = useState(true);
  const { token } = useAuth();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'testCases') {
      try {
        JSON.parse(e.target.value);
        setValidJson(true);
      } catch {
        setValidJson(false);
      }
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const testCases = JSON.parse(form.testCases);
      await axios.post(`${import.meta.env.VITE_API_URL || '/api'}/problem/`, {
        ...form
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessage('✅ Problem added successfully!');
      setForm({
        title: '',
        description: '',
        sampleInput: '',
        sampleOutput: '',
        difficulty: 'Easy',
        timeLimit: 2000,
        testCases: ''
      });
    } catch (err) {
      setError('❌ ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Add New Problem</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input name="title" placeholder="Title" className="border p-2 w-full rounded" value={form.title} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select name="difficulty" className="border p-2 w-full rounded" value={form.difficulty} onChange={handleChange} required>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sample Input</label>
              <input name="sampleInput" placeholder="Sample Input" className="border p-2 w-full rounded" value={form.sampleInput} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sample Output</label>
              <input name="sampleOutput" placeholder="Sample Output" className="border p-2 w-full rounded" value={form.sampleOutput} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (ms)</label>
              <input name="timeLimit" type="number" placeholder="Time Limit (ms)" className="border p-2 w-full rounded" value={form.timeLimit} onChange={handleChange} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" placeholder="Description" className="border p-2 w-full rounded h-28" value={form.description} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Test Cases <span className="text-xs text-gray-400">(JSON array)</span></label>
            <textarea name="testCases" placeholder='[{"input":"1 2","expectedOutput":"3","isHidden":false}]' className={`border p-2 w-full rounded h-28 ${validJson ? '' : 'border-red-500'}`} value={form.testCases} onChange={handleChange} required />
            {!validJson && <div className="text-red-600 text-xs mt-1">Invalid JSON format</div>}
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50" disabled={!validJson}>Add Problem</button>
        </form>
        {message && <div className="mt-4 text-green-700 font-semibold text-center">{message}</div>}
        {error && <div className="mt-4 text-red-700 font-semibold text-center">{error}</div>}
      </div>
    </div>
  );
}
