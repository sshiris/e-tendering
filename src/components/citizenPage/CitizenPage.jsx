import React from "react";
import { useNavigate } from "react-router-dom";

const CitizenPage = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome to {user.name}'s Dashboard</h1>
      <p className="mt-2">Explore tenders and stay informed about ongoing projects in your city.</p>

      <button
        onClick={() => navigate("/citizen/open-tenders")}
        className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition"
      >
        View Open Tenders
      </button>

      <button
        onClick={() => navigate("/citizen/closed-tenders")}
        className="mt-4 ml-4 px-4 py-2 bg-gray-600 text-white font-semibold rounded hover:bg-gray-700 transition"
      >
        View Closed Tenders
      </button>

      <button
        onClick={() => navigate("/citizen/all-feedbacks")}
        className="mt-4 ml-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
      >
        View All Feedbacks
      </button>

      <button
        onClick={() => navigate("/citizen/view-feedback")}
        className="mt-4 ml-4 px-4 py-2 bg-yellow-600 text-white font-semibold rounded hover:bg-yellow-700 transition"
      >
        View Feedback
      </button>
    </div>
  );
};

export default CitizenPage;
