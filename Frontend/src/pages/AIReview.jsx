import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import Editor from '@monaco-editor/react';

const AIReview = () => {
  const [code, setCode] = useState('// Write your code here for AI review');
  const [language, setLanguage] = useState('cpp');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuth();

  const languageOptions = [
    { label: 'C++', value: 'cpp' },
    { label: 'Python', value: 'python' },
    { label: 'JavaScript', value: 'javascript' },
    { label: 'Java', value: 'java' }
  ];

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError('Please enter some code to review');
      return;
    }

    setLoading(true);
    setError('');
    setReview('');

    try {
      const response = await axios.post('http://localhost:5000/api/ai/review', {
        code: code
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setReview(response.data.review);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to get AI review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCode('// Write your code here for AI review');
    setReview('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">AI Code Review</h1>
          <p className="text-gray-400 text-lg">
            Get instant feedback on your code with AI-powered analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Code Editor Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">Your Code</h2>
              <div className="flex gap-2">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
                >
                  {languageOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
              <Editor
                height="500px"
                language={language}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  wordWrap: 'on'
                }}
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Getting Review...
                  </div>
                ) : (
                  'Get AI Review'
                )}
              </button>
              <button
                onClick={handleClear}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                Clear
              </button>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-500 text-red-400 p-4 rounded-lg">
                {error}
              </div>
            )}
          </div>

          {/* Review Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">AI Review</h2>
            
            {review ? (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 h-[500px] overflow-y-auto">
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                    {review}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 h-[500px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-6xl mb-4">🤖</div>
                  <p className="text-lg">Submit your code to get an AI-powered review</p>
                  <p className="text-sm mt-2">The AI will analyze your code for bugs, best practices, and optimizations</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <div className="text-3xl mb-4">🐛</div>
            <h3 className="text-xl font-semibold text-white mb-2">Bug Detection</h3>
            <p className="text-gray-400">Identify potential bugs and logical errors in your code</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <div className="text-3xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-white mb-2">Best Practices</h3>
            <p className="text-gray-400">Learn coding best practices and style improvements</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-white mb-2">Optimization</h3>
            <p className="text-gray-400">Get suggestions for performance and efficiency improvements</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIReview;
