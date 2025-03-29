import React, { useEffect, useState } from "react";
import axios from "axios";

const AllFeedbacks = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [error, setError] = useState(null);
  const API_URL = "http://localhost:5500";

  useEffect(() => {
    const fetchAllFeedbacks = async () => {
      try {
        const response = await axios.get(`${API_URL}/feedback`);
        setFeedbackList(response.data);
      } catch (err) {
        setError("Failed to fetch feedbacks. Please try again.");
      }
    };

    fetchAllFeedbacks();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">All Feedbacks</h1>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="mt-4">
        {feedbackList.map((feedback, index) => (
          <li key={index} className="mb-2 p-2 border rounded">
            <p>
              <strong>User ID:</strong> {feedback.user_id}
            </p>
            <p>{feedback.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllFeedbacks;
