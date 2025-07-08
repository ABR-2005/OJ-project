import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CodeEditor from '../components/codeEditor';

export default function ProblemPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState(null);

  // Fetch problem details when component mounts
  useEffect(() => {
    axios.get(`http://localhost:5000/api/problems/${id}`)
      .then(res => setProblem(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/submit', {
        problemId: id,
        code,
        input,
        language,
        userId: 'dummy' // Replace with actual logged-in userId
      });

      setOutput(res.data);
    } catch (err) {
      console.error("Submission error:", err);
      setOutput({ verdict: "Internal Server Error", error: err.message });
    }
  };

  if (!problem) return <div className="p-4">Loading problem...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">{problem.title}</h1>
      <p className="my-2">{problem.description}</p>

      <div className="my-4">
        <label className="mr-2 font-medium">Select Language:</label>
        <select
          value={language}
          onChange={e => setLanguage(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
        </select>
      </div>

      {/* ⌨️ Monaco Code Editor */}
      <CodeEditor code={code} setCode={setCode} language={language} />

      <textarea
        className="w-full border p-2 mt-4 rounded"
        rows={4}
        placeholder="Custom input (optional)"
        value={input}
        onChange={e => setInput(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>

      {output && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="text-lg font-bold text-gray-700">
            Verdict: {output.verdict}
          </h3>
          {output.output && (
            <pre className="mt-2 bg-white p-2 rounded border text-sm text-gray-700 whitespace-pre-wrap">
              {output.output}
            </pre>
          )}
          {output.error && (
            <pre className="mt-2 bg-red-100 text-red-800 p-2 rounded text-sm whitespace-pre-wrap">
              {output.error}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
