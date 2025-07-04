import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function ProblemPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [output, setOutput] = useState(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:5000/api/problems/${id}`)
      .then(res => setProblem(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleSubmit = async () => {
    const response = await axios.post("http://localhost:5000/api/submit", {
      problemId: id,
      code,
      input,
      language,
      userId: "dummy" // Replace with real user ID
    });
    setOutput(response.data);
  };

  if (!problem) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">{problem.title}</h1>
      <p>{problem.description}</p>

      <select value={language} onChange={e => setLanguage(e.target.value)} className="mt-4">
        <option value="cpp">C++</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
      </select>

      <textarea
        className="w-full border p-2 my-2"
        rows={10}
        placeholder="Write your code here..."
        value={code}
        onChange={e => setCode(e.target.value)}
      />

      <textarea
        className="w-full border p-2 my-2"
        rows={3}
        placeholder="Custom Input (optional)"
        value={input}
        onChange={e => setInput(e.target.value)}
      />

      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
        Submit
      </button>

      {output && (
        <div className="mt-4">
          <h3 className="font-bold">Verdict: {output.verdict}</h3>
          {output.output && <pre className="bg-gray-100 p-2">{output.output}</pre>}
          {output.error && <pre className="bg-red-100 text-red-600 p-2">{output.error}</pre>}
        </div>
      )}
    </div>
  );
}