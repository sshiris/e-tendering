import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const CitizenFeedback = ({ user }) => {
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = "http://localhost:5500";

  const tender_id = location.state?.tender_id || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await axios.post(`${API_URL}/submit_feedback`, {
        user_id: user.user_id,
        tender_id,
        feedback,
      });
      alert("Feedback submitted successfully!");
      navigate("/citizen/open-tenders");
    } catch (err) {
      setError("Failed to submit feedback. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Submit Feedback</h1>
      {tender_id && <p className="mt-2">Tender ID: {tender_id}</p>}
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-2 border rounded"
          rows="5"
          placeholder="Enter your feedback here..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          required
        />
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CitizenFeedback;
