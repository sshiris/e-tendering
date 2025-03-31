import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./CitizenFeedback.css";

/**
 * CitizenFeedback Component
 * Allows citizens to view a specific tender and submit feedback.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.user - Logged-in user information.
 * @param {number} props.user.user_id - Unique identifier for the user.
 *
 * @returns {JSX.Element} The rendered CitizenFeedback component.
 */
const CitizenFeedback = ({ user }) => {
  /**
   * State variables to manage component data.
   * @var {Object|null} tender - Details of the specific tender being viewed.
   * @var {Array} feedbackList - List of feedbacks related to the tender.
   * @var {string} feedback - User-provided feedback text.
   * @var {string|null} error - Error messages encountered during API calls.
   */
  const [tender, setTender] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState(null);

  // Accessing route location state for tender_id.
  const location = useLocation();

  // API base URL for backend communication.
  const API_URL = "http://localhost:5500";

  // Extract tender_id from the route state.
  const tender_id = location.state?.tender_id;

  /**
   * Effect hook to fetch tender details and its feedbacks from the API.
   * Runs only when tender_id changes.
   */
  useEffect(() => {
    if (!tender_id) return;

    const fetchTenderAndFeedbacks = async () => {
      try {
        // Fetch tender details
        const tenderResponse = await axios.get(`${API_URL}/find`);
        const foundTender = tenderResponse.data.find(
          (t) => t.tender_id === tender_id
        );
        if (!foundTender) throw new Error("Tender not found");
        setTender(foundTender);

        // Fetch feedbacks for the tender
        const feedbackResponse = await axios.get(`${API_URL}/feedback`, {
          params: { tender_id },
        });
        setFeedbackList(feedbackResponse.data);
      } catch (err) {
        setError(err.message || "Failed to fetch data.");
      }
    };

    fetchTenderAndFeedbacks();
  }, [tender_id]);

  /**
   * Handles feedback submission to the backend.
   * Validates the input, sends a POST request, and updates feedback list.
   *
   * @param {Event} e - Form submit event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!feedback.trim()) throw new Error("Feedback cannot be empty.");

      // Log for debugging purposes
      console.log("Submitting feedback:", { user_id: user.user_id, feedback });

      // Submit feedback to the backend
      await axios.post(`${API_URL}/submit_feedback`, {
        user_id: user.user_id,
        tender_id,
        feedback,
      });

      setFeedback(""); // Clear the feedback input

      // Refresh feedback list after successful submission
      const feedbackResponse = await axios.get(`${API_URL}/feedback`, {
        params: { tender_id },
      });
      setFeedbackList(feedbackResponse.data);
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError(err.response?.data?.error || "Failed to submit feedback.");
    }
  };

  // If tender data is not loaded yet, display a loading message.
  if (!tender) {
    return <p>Loading tender details...</p>;
  }

  // Render the component UI
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Feedback for {tender.tender_name}</h1>
      <p>{tender.description}</p>
      <p>
        <strong>Close Date:</strong>{" "}
        {new Date(tender.date_of_tender_close).toLocaleDateString()}
      </p>

      {/* Feedback Form */}
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

      {/* Display Feedback List */}
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
