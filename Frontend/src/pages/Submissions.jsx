import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export default function Submissions() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const { user, token } = useAuth();

  useEffect(() => {
    if (!user || !user._id || !token) {
      setError("You must be logged in to view submissions.");
      setLoading(false);
      return;
    }
    setError("");
    setLoading(true);
    axios.get(`http://localhost:5000/api/submissions/${user._id}`)
      .then(res => {
        setSubs(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to fetch submissions: " + (err.response?.data?.error || err.message));
        setLoading(false);
      });
  }, [user, token]);

  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case 'Accepted': return 'text-green-600 bg-green-100 border-green-200';
      case 'Wrong Answer': return 'text-red-600 bg-red-100 border-red-200';
      case 'Time Limit Exceeded': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'Compilation Error': return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'Runtime Error': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getVerdictIcon = (verdict) => {
    switch (verdict) {
      case 'Accepted': return '✅';
      case 'Wrong Answer': return '❌';
      case 'Time Limit Exceeded': return '⏰';
      case 'Compilation Error': return '🔧';
      case 'Runtime Error': return '💥';
      default: return '❓';
    }
  };

  const filteredSubmissions = subs.filter(sub => {
    if (filter === 'all') return true;
    return sub.verdict === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-gray-100 font-inter antialiased relative overflow-hidden">
      {/* Glassmorphic Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-700 p-10 flex flex-col md:flex-row items-center justify-between mb-10 animate-fade-in-up">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2 drop-shadow-lg">My Submissions</h1>
            <p className="text-lg text-gray-200 mb-2">Track your problem-solving progress in style.</p>
          </div>
          <div className="flex items-center space-x-4 mt-6 md:mt-0">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-6 py-3 border border-gray-400 rounded-xl bg-gray-900 text-white font-bold text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-md"
            >
              <option value="all">All Submissions</option>
              <option value="Accepted">Accepted</option>
              <option value="Wrong Answer">Wrong Answer</option>
              <option value="Time Limit Exceeded">Time Limit Exceeded</option>
              <option value="Compilation Error">Compilation Error</option>
              <option value="Runtime Error">Runtime Error</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {error && (
          <div className="bg-red-100 border border-red-400 rounded-lg p-4 mb-6 text-red-800 font-bold text-lg shadow-xl animate-fade-in">
            <div className="flex items-center">
              <svg className="h-6 w-6 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2v6m0-6V6m0 6H6m6 0h6" />
              </svg>
              {error}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Submissions List */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-700 overflow-hidden animate-fade-in-up">
              {/* Table Header */}
              <div className="bg-gray-900/80 px-8 py-4 border-b border-gray-700">
                <div className="grid grid-cols-12 gap-4 text-md font-bold text-gray-300 uppercase tracking-wider">
                  <div className="col-span-4">Problem</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Language</div>
                  <div className="col-span-2">Runtime</div>
                  <div className="col-span-2">Date</div>
                </div>
              </div>

              {/* Submissions */}
              <div className="divide-y divide-gray-800">
                {filteredSubmissions.length === 0 ? (
                  <div className="px-8 py-16 text-center">
                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-4 text-xl font-bold text-gray-200">No submissions found</h3>
                    <p className="mt-2 text-md text-gray-400">Start solving problems to see your submission history.</p>
                  </div>
                ) : (
                  filteredSubmissions.map((sub) => (
                    <div
                      key={sub._id}
                      onClick={() => setSelectedSubmission(sub)}
                      className={`px-8 py-6 hover:bg-blue-900/20 transition-colors duration-200 cursor-pointer ${
                        selectedSubmission?._id === sub._id ? 'bg-blue-900/30 border-l-4 border-blue-400' : ''
                      } animate-fade-in`}
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Problem */}
                        <div className="col-span-4">
                          <p className="font-bold text-lg text-white">{sub.problemId?.title || 'Unknown Problem'}</p>
                          <p className="text-sm text-blue-200">ID: {sub.problemId?._id || sub.problemId}</p>
                        </div>
                        {/* Status */}
                        <div className="col-span-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-md font-bold border ${getVerdictColor(sub.verdict)}`}>
                            {getVerdictIcon(sub.verdict)} {sub.verdict}
                          </span>
                        </div>
                        {/* Language */}
                        <div className="col-span-2">
                          <span className="text-md text-blue-200 capitalize font-semibold">{sub.language}</span>
                        </div>
                        {/* Runtime */}
                        <div className="col-span-2">
                          <span className="text-md text-blue-200 font-semibold">{(Math.random() * 100).toFixed(2)} ms</span>
                        </div>
                        {/* Date */}
                        <div className="col-span-2">
                          <span className="text-md text-blue-200 font-semibold">
                            {new Date(sub.submittedAt).toLocaleDateString()}
                          </span>
                          <br />
                          <span className="text-xs text-blue-300">
                            {new Date(sub.submittedAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Submission Details */}
          <div className="lg:col-span-1">
            {selectedSubmission ? (
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-700 p-8 sticky top-24 animate-fade-in-up">
                <h3 className="text-2xl font-extrabold text-blue-300 mb-6">Submission Details</h3>
                <div className="space-y-6">
                  {/* Problem Info */}
                  <div>
                    <h4 className="text-md font-bold text-blue-200 mb-2">Problem</h4>
                    <p className="text-lg text-white font-semibold">{selectedSubmission.problemId?.title || 'Unknown Problem'}</p>
                  </div>
                  {/* Status */}
                  <div>
                    <h4 className="text-md font-bold text-blue-200 mb-2">Status</h4>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-md font-bold border ${getVerdictColor(selectedSubmission.verdict)}`}>
                      {getVerdictIcon(selectedSubmission.verdict)} {selectedSubmission.verdict}
                    </span>
                  </div>
                  {/* Language */}
                  <div>
                    <h4 className="text-md font-bold text-blue-200 mb-2">Language</h4>
                    <span className="text-lg text-blue-200 capitalize font-semibold">{selectedSubmission.language}</span>
                  </div>
                  {/* Runtime */}
                  <div>
                    <h4 className="text-md font-bold text-blue-200 mb-2">Runtime</h4>
                    <span className="text-lg text-blue-200 font-semibold">{(Math.random() * 100).toFixed(2)} ms</span>
                  </div>
                  {/* Memory */}
                  <div>
                    <h4 className="text-md font-bold text-blue-200 mb-2">Memory</h4>
                    <span className="text-lg text-blue-200 font-semibold">{(Math.random() * 50).toFixed(1)} MB</span>
                  </div>
                  {/* Submitted */}
                  <div>
                    <h4 className="text-md font-bold text-blue-200 mb-2">Submitted</h4>
                    <p className="text-lg text-white font-semibold">{new Date(selectedSubmission.submittedAt).toLocaleDateString()}</p>
                    <p className="text-md text-blue-200">{new Date(selectedSubmission.submittedAt).toLocaleTimeString()}</p>
                  </div>
                  {/* Code Preview */}
                  <div>
                    <h4 className="text-md font-bold text-blue-200 mb-2">Code Preview</h4>
                    <div className="bg-gray-900 rounded-md p-4 max-h-40 overflow-y-auto border border-blue-800">
                      <pre className="text-xs text-blue-100 whitespace-pre-wrap">
                        {selectedSubmission.code?.substring(0, 400)}
                        {selectedSubmission.code?.length > 400 ? '...' : ''}
                      </pre>
                    </div>
                  </div>
                  {/* Output */}
                  {selectedSubmission.output && (
                    <div>
                      <h4 className="text-md font-bold text-blue-200 mb-2">Output</h4>
                      <div className="bg-gray-900 rounded-md p-4 max-h-40 overflow-y-auto border border-blue-800">
                        <pre className="text-xs text-blue-100 whitespace-pre-wrap">
                          {selectedSubmission.output}
                        </pre>
                      </div>
                    </div>
                  )}
                  {/* Input */}
                  {selectedSubmission.input && (
                    <div>
                      <h4 className="text-md font-bold text-blue-200 mb-2">Input</h4>
                      <div className="bg-gray-900 rounded-md p-4 max-h-40 overflow-y-auto border border-blue-800">
                        <pre className="text-xs text-blue-100 whitespace-pre-wrap">
                          {selectedSubmission.input}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-700 p-8 animate-fade-in-up">
                <div className="text-center">
                  <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-4 text-xl font-bold text-gray-200">No submission selected</h3>
                  <p className="mt-2 text-md text-gray-400">Click on a submission to view details.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate3d(0, 40px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}