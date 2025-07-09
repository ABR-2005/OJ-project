import React, { useState } from "react";
import axios from "axios";
import CodeEditor from "../components/codeEditor";

export default function AIReview() {
  const [code, setCode] = useState("");
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReview = async () => {
    setLoading(true);
    setReview(null);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/ai/review",
        { code },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReview(res.data.review || "No review returned.");
    } catch (err) {
      console.error("AI Review Error:", err);
      setError(
        err.response?.data?.error ||
          "Error while getting AI review. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">AI Code Review</h2>

      <CodeEditor code={code} setCode={setCode} />

      <button
        onClick={handleReview}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? "Reviewing..." : "Review"}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded border border-red-300">
          {error}
        </div>
      )}

      {review && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow-inner whitespace-pre-wrap">
          <h3 className="font-semibold text-lg mb-2">AI Review:</h3>
          <pre>{review}</pre>
        </div>
      )}
    </div>
  );
}
