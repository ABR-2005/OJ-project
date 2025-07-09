import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // already imported

const ProblemPage = () => {
  const { id } = useParams(); // changed from problemId to id
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('// Write your solution here');
  const [language, setLanguage] = useState('cpp');
  const [output, setOutput] = useState(null);
  const [verdict, setVerdict] = useState(null);
  const { token, user } = useAuth(); // Get token and user

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
    try {
      const res = await axios.post(
        'http://localhost:5000/api/submit/submit',
        {
          code,
          language,
          problemId: id,
          userId: user?._id // include userId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setOutput(res.data.output);
      setVerdict(res.data.verdict);
      // Show error if present
      if (res.data.error) {
        setOutput(res.data.error);
        setVerdict('Error');
      }
    } catch (err) {
      console.error('Submission failed:', err);
      setOutput(err.response?.data?.error || 'Error during submission');
      setVerdict('Error');
    }
  };

  if (!problem) return <div className="p-4">Loading problem...</div>;

  return (
    <div className="p-4 space-y-6">
      <div className="bg-white shadow p-4 rounded">
        <h1 className="text-2xl font-bold mb-2">{problem.title}</h1>
        <p className="text-gray-700 whitespace-pre-wrap">{problem.description}</p>

        <h3 className="mt-4 font-semibold">Sample Input:</h3>
        <pre className="bg-gray-100 p-2 rounded text-sm">{problem.sampleInput}</pre>

        <h3 className="mt-2 font-semibold">Sample Output:</h3>
        <pre className="bg-gray-100 p-2 rounded text-sm">{problem.sampleOutput}</pre>
      </div>

      <div className="flex justify-between items-center">
        <label className="font-medium">Language:</label>
        <select
          className="border px-2 py-1 rounded"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="cpp">C++</option>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
        </select>
      </div>

      <div className="h-[400px]">
        <Editor
          height="100%"
          theme="vs-dark"
          defaultLanguage={language}
          value={code}
          onChange={(value) => setCode(value)}
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>

      {output && (
        <div className="bg-white shadow p-4 rounded">
          <h3 className="font-bold text-green-600">Output:</h3>
          <pre className="whitespace-pre-wrap text-sm">{output}</pre>
          <p className="mt-2 font-semibold">Verdict: <span className="text-blue-700">{verdict}</span></p>
        </div>
      )}
    </div>
  );
};

export default ProblemPage;