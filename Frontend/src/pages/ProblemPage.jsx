import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProblemPage = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('// Write your solution here');
  const [language, setLanguage] = useState('cpp');
  const [output, setOutput] = useState(null);
  const [verdict, setVerdict] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [customOutput, setCustomOutput] = useState('');
  const [showCustomTest, setShowCustomTest] = useState(false);
  const [lastTestCase, setLastTestCase] = useState(null);
  const { token, user } = useAuth();

  useEffect(() => {
    if (!token) return;
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/problem/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProblem(res.data);
      } catch (err) {
        console.error('Failed to fetch problem:', err);
      }
    };
    fetchProblem();
  }, [id, token]);

  const handleSubmit = async () => {
    setLoading(true);
    setVerdict(null);
    setOutput(null);
    setLastTestCase(null);
    try {
      const res = await axios.post(
        'http://localhost:5000/api/submit/submit',
        {
          code,
          language,
          problemId: id,
          userId: user?._id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setOutput(res.data.output);
      setVerdict(res.data.verdict);
      if (res.data.error) {
        setOutput(res.data.error);
        setVerdict('Error');
      }
      if (res.data.verdict === 'Wrong Answer' && problem?.testCases) {
        setLastTestCase(problem.testCases[problem.testCases.length - 1]);
      }
    } catch (err) {
      setOutput(err.response?.data?.error || 'Error during submission');
      setVerdict('Error');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomTest = async () => {
    if (!customInput.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5001/compile', {
        code,
        input: customInput,
        language,
        timeLimit: 5000
      });
      setCustomOutput(res.data.output || res.data.error || 'No output');
    } catch (err) {
      setCustomOutput(err.response?.data?.error || 'Compilation error');
    } finally {
      setLoading(false);
    }
  };

  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case 'Accepted': return 'text-green-400 bg-green-900/40 border-green-400';
      case 'Wrong Answer': return 'text-red-400 bg-red-900/40 border-red-400';
      case 'Time Limit Exceeded': return 'text-orange-400 bg-orange-900/40 border-orange-400';
      case 'Compilation Error': return 'text-purple-400 bg-purple-900/40 border-purple-400';
      default: return 'text-gray-400 bg-gray-900/40 border-gray-400';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-400 bg-green-900/40 border-green-400';
      case 'medium': return 'text-yellow-400 bg-yellow-900/40 border-yellow-400';
      case 'hard': return 'text-red-400 bg-red-900/40 border-red-400';
      default: return 'text-gray-400 bg-gray-900/40 border-gray-400';
    }
  };

  if (!problem) {
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
          <div className="flex items-center space-x-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2 drop-shadow-lg">{problem.title}</h1>
            <span className={`px-4 py-2 rounded-full text-lg font-bold border ${getDifficultyColor(problem.difficulty)}`}>{problem.difficulty || 'Unknown'}</span>
          </div>
          <div className="flex items-center space-x-4 mt-6 md:mt-0">
            <button
              onClick={() => setShowCustomTest(!showCustomTest)}
              className="px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-xl shadow-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300"
            >
              Custom Input
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Panel - Problem Description */}
          <div className="space-y-8">
            {/* Problem Description */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-700 p-8 animate-fade-in-up">
              <h2 className="text-2xl font-bold text-blue-300 mb-6">Problem Description</h2>
              <div className="prose prose-sm max-w-none">
                <p className="text-lg text-gray-200 whitespace-pre-wrap mb-4">{problem.description}</p>
                <h3 className="font-bold text-blue-200 mt-6 mb-2">Example 1:</h3>
                <div className="bg-gray-900 rounded-lg p-4 space-y-2 border border-blue-800">
                  <div>
                    <span className="font-bold text-blue-100">Input: </span>
                    <code className="bg-gray-800 px-2 py-1 rounded text-md text-blue-200">{problem.sampleInput}</code>
                  </div>
                  <div>
                    <span className="font-bold text-blue-100">Output: </span>
                    <code className="bg-gray-800 px-2 py-1 rounded text-md text-blue-200">{problem.sampleOutput}</code>
                  </div>
                </div>
              </div>
            </div>
            {/* Test Cases */}
            {problem.testCases && problem.testCases.length > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-700 p-8 animate-fade-in-up">
                <h2 className="text-2xl font-bold text-blue-300 mb-6">Test Cases</h2>
                <div className="space-y-4">
                  {problem.testCases.map((testCase, index) => (
                    <div key={index} className="border border-blue-800 rounded-lg p-4 bg-gray-900">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-md font-bold text-blue-200">Test Case {index + 1}</span>
                        {testCase.isHidden && (
                          <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">Hidden</span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-md">
                        <div>
                          <span className="font-bold text-blue-100">Input:</span>
                          <pre className="mt-1 bg-gray-800 p-2 rounded text-blue-200">{testCase.input}</pre>
                        </div>
                        <div>
                          <span className="font-bold text-blue-100">Expected:</span>
                          <pre className="mt-1 bg-gray-800 p-2 rounded text-blue-200">{testCase.expectedOutput}</pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Custom Input Test */}
            {showCustomTest && (
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-xl border border-green-700 p-8 animate-fade-in-up">
                <h2 className="text-2xl font-bold text-green-300 mb-6">Custom Input Test</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-bold text-green-200 mb-2">Input:</label>
                    <textarea
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      className="w-full h-32 px-4 py-3 border border-green-400 rounded-xl bg-gray-900 text-green-200 font-mono focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your test input here..."
                    />
                  </div>
                  <button
                    onClick={handleCustomTest}
                    disabled={loading}
                    className="px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-xl shadow-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300"
                  >
                    {loading ? 'Running...' : 'Run Test'}
                  </button>
                  {customOutput && (
                    <div>
                      <label className="block text-lg font-bold text-green-200 mb-2">Output:</label>
                      <pre className="bg-gray-900 p-4 rounded-xl text-green-200 text-lg overflow-x-auto border border-green-700">{customOutput}</pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* Right Panel - Code Editor */}
          <div className="space-y-8">
            {/* Language Selector */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-700 p-6 animate-fade-in-up">
              <div className="flex justify-between items-center">
                <label className="text-lg font-bold text-blue-200">Language:</label>
                <select
                  className="px-4 py-3 border border-blue-400 rounded-xl bg-gray-900 text-blue-200 font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="cpp">C++</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                </select>
              </div>
            </div>
            {/* Code Editor */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-700 overflow-hidden animate-fade-in-up">
              <div className="bg-gray-900 px-6 py-3 border-b border-blue-800">
                <span className="text-lg font-bold text-blue-200">Code Editor</span>
              </div>
              <div className="h-96">
                <Editor
                  height="100%"
                  theme="vs-dark"
                  defaultLanguage={language}
                  value={code}
                  onChange={(value) => setCode(value)}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 16,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </div>
            </div>
            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full px-8 py-4 text-2xl font-extrabold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed animate-fade-in-up"
            >
              {loading ? 'Submitting...' : 'Submit Solution'}
            </button>
            {/* Results */}
            {(output || verdict) && (
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-700 p-8 animate-fade-in-up">
                <h3 className="text-2xl font-bold text-blue-300 mb-6">Results</h3>
                {verdict && (
                  <div className="mb-6">
                    <span className="text-lg font-bold text-blue-200">Verdict: </span>
                    <span className={`px-4 py-2 rounded-full text-lg font-bold border ${getVerdictColor(verdict)}`}>
                      {verdict}
                    </span>
                  </div>
                )}
                {output && (
                  <div className="mb-6">
                    <label className="block text-lg font-bold text-blue-200 mb-2">Output:</label>
                    <pre className="bg-gray-900 p-4 rounded-xl text-blue-200 text-lg overflow-x-auto border border-blue-800 whitespace-pre-wrap">{output}</pre>
                  </div>
                )}
                {/* Last Test Case for Wrong Answer */}
                {lastTestCase && verdict === 'Wrong Answer' && (
                  <div className="border-t border-blue-800 pt-6 mt-6">
                    <h4 className="text-lg font-bold text-red-400 mb-2">Last Executed Test Case:</h4>
                    <div className="bg-red-900/40 border border-red-400 rounded-xl p-6">
                      <div className="grid grid-cols-2 gap-6 text-lg">
                        <div>
                          <span className="font-bold text-red-200">Input:</span>
                          <pre className="mt-1 bg-gray-900 p-2 rounded text-red-200">{lastTestCase.input}</pre>
                        </div>
                        <div>
                          <span className="font-bold text-red-200">Expected:</span>
                          <pre className="mt-1 bg-gray-900 p-2 rounded text-red-200">{lastTestCase.expectedOutput}</pre>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
      `}</style>
    </div>
  );
};

export default ProblemPage;