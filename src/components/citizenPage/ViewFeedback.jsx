/**
 * ViewFeedback Component
 * Fetches and displays the feedback list specific to a user based on their user ID.
 * Handles errors during data fetching gracefully.
 * 
 * @param {Object} user - The user object containing user information.
 * @param {string} user.user_id - The unique ID of the user whose feedback is being retrieved.
 */
import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewFeedback = ({ user }) => {
  // State to store the list of feedback and to capture any error messages.
  const [feedbackList, setFeedbackList] = useState([]);
  const [error, setError] = useState(null);

  // Base URL for the API requests.
  const API_URL = "http://localhost:5500";

  // Effect to fetch user-specific feedback data when the component mounts
  // or when `user.user_id` changes.
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        // Make an API call to fetch feedback based on the user's ID.
        const response = await axios.get(`${API_URL}/feedback`, {
          params: { user_id: user.user_id },
        });

        // Update the feedback list state with the retrieved data.
        setFeedbackList(response.data);
      } catch (err) {
        // Handle errors during the API call gracefully.
        setError("Failed to fetch feedback. Please try again.");
      }
    };

    fetchFeedback();
  }, [user.user_id]);

  return (
    // Container for displaying user feedback.
    <div className="p-6">
      {/* Page title */}
      <h1 className="text-2xl font-bold">Your Feedback</h1>

      {/* Error message, if any */}
      {error && <p className="text-red-500">{error}</p>}

      {/* List of feedback */}
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
