import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/leaderboard")
      .then(res => setLeaders(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
      <ol>
        {leaders.map((user, index) => (
          <li key={index} className="border p-2 mb-1">
            {index + 1}. {user.username} — {user.acceptedCount} Accepted
          </li>
        ))}
      </ol>
    </div>
  );
}