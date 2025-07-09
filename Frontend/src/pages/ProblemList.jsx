import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Add this import

export default function ProblemList() {
  const [problems, setProblems] = useState([]);
  const { token } = useAuth(); // Get token

  useEffect(() => {
    if (!token) return;
    axios.get("http://localhost:5000/api/problem", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => setProblems(res.data))
      .catch(err => console.error("Error fetching problems:", err));
  }, [token]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Problem List</h1>
      {problems.length === 0 ? (
        <p>No problems available.</p>
      ) : (
        <ul className="space-y-2">
          {problems.map(problem => (
            <li key={problem._id} className="border p-3 rounded shadow">
              <Link to={`/problem/${problem._id}`} className="text-blue-600 hover:underline">
                {problem.title} - {problem.difficulty}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
