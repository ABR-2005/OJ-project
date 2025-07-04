import React, { useState } from 'react';
import axios from 'axios';

export default function AIReview() {
  const [code, setCode] = useState("");
  const [review, setReview] = useState(null);

  const handleReview = async () => {
    const res = await axios.post("http://localhost:5000/api/review", { code });
    setReview(res.data.review);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">AI Code Review</h2>
      <textarea
        rows={10}
        className="w-full border p-2"
        placeholder="Paste your code here"
        value={code}
        onChange={e => setCode(e.target.value)}
      />
      <button onClick={handleReview} className="bg-blue-500 text-white px-4 py-2 mt-2">
        Review
      </button>

      {review && (
        <div className="mt-4 bg-gray-100 p-4 rounded">
          <pre>{review}</pre>
        </div>
      )}
    </div>
  );
}