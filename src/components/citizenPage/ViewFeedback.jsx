import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewFeedback = ({ user }) => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [error, setError] = useState(null);
  const API_URL = "http://localhost:5500";

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(`${API_URL}/feedback`, {
          params: { user_id: user.user_id },
        });
        setFeedbackList(response.data);
      } catch (err) {
        setError("Failed to fetch feedback. Please try again.");
      }
    };

    fetchFeedback();
  }, [user.user_id]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Your Feedback</h1>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="mt-4">
        {feedbackList.map((feedback, index) => (
          <li key={index} className="mb-2 p-2 border rounded">
            {feedback.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewFeedback;
