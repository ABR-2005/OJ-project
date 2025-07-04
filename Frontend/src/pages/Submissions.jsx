import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Submissions() {
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/submissions/user/dummy")
      .then(res => setSubs(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Submission History</h2>
      <ul>
        {subs.map(sub => (
          <li key={sub._id} className="mb-2 border p-2">
            Problem: {sub.problemId}<br />
            Verdict: {sub.verdict}<br />
            Language: {sub.language}<br />
            Time: {new Date(sub.submittedAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}