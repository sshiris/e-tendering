import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./CitizenFeedback.css";

const CitizenFeedback = () => {
  const [tender, setTender] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState(null);
  const location = useLocation();
  const API_URL = "http://localhost:5500";

  const tender_id = location.state?.tender_id;

  useEffect(() => {
    if (!tender_id) return;

    const fetchTenderAndFeedbacks = async () => {
      try {
        // Fetch tender details
        const tenderResponse = await axios.get(`${API_URL}/find`);
        const foundTender = tenderResponse.data.find((t) => t.tender_id === tender_id);
        if (!foundTender) throw new Error("Tender not found");
        setTender(foundTender);

        // Fetch feedbacks for the tender
        const feedbackResponse = await axios.get(`${API_URL}/feedback`, {
          params: { tender_id }, // Fetch only feedbacks related to the selected tender
        });
        setFeedbackList(feedbackResponse.data);
      } catch (err) {
        setError(err.message || "Failed to fetch data.");
      }
    };

    fetchTenderAndFeedbacks();
  }, [tender_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!feedback.trim()) throw new Error("Feedback cannot be empty.");
      await axios.post(`${API_URL}/submit_feedback`, {
        tender_id,
        feedback,
      });
      setFeedback("");
      // Refresh feedback list
      const feedbackResponse = await axios.get(`${API_URL}/feedback`, {
        params: { tender_id },
      });
      setFeedbackList(feedbackResponse.data);
    } catch (err) {
      setError(err.message || "Failed to submit feedback.");
    }
  };

  if (!tender) {
    return <p>Loading tender details...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Feedback for {tender.tender_name}</h1>
      <p>{tender.description}</p>
      <p>
        <strong>Close Date:</strong> {new Date(tender.date_of_tender_close).toLocaleDateString()}
      </p>

      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          className="w-full p-2 border rounded"
          rows="5"
          placeholder="Enter your feedback..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          required
        />
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
        >
          Submit Feedback
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="mt-6">
        <h2 className="text-xl font-bold">Feedback from Other Users</h2>
        <ul className="feedback-list">
          {feedbackList.map((fb, index) => (
            <li key={index} className="feedback-item">
              <p className="feedback-message">{fb.message}</p>
              <p className="feedback-timestamp">
                {new Date(fb.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CitizenFeedback;
