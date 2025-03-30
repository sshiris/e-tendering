import React from "react";
import { useNavigate } from "react-router-dom";

const CityPage = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome to {user.name}'s Dashboard</h1>
      <p className="mt-2">Manage tenders, categories, and user-category relationships.</p>

      <button
        onClick={() => navigate("/create-tender")}
        className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
      >
        Create New Tender
      </button>

      <button
        onClick={() => navigate("/manage-categories")}
        className="mt-4 ml-4 px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition"
      >
        Manage Categories
      </button>

      <button
        onClick={() => navigate("/manage-user-categories")}
        className="mt-4 ml-4 px-4 py-2 bg-gray-600 text-white font-semibold rounded hover:bg-gray-700 transition"
      >
        Manage User-Category Relationships
      </button>

      <button
        onClick={() => navigate("/view-feedbacks")}
        className="mt-4 ml-4 px-4 py-2 bg-yellow-600 text-white font-semibold rounded hover:bg-yellow-700 transition"
      >
        View Feedbacks
      </button>

      <button
        onClick={() => navigate("/manage-users")}
        className="mt-4 ml-4 px-4 py-2 bg-purple-600 text-white font-semibold rounded hover:bg-purple-700 transition"
      >
        Manage Users
      </button>

      <button
        onClick={() => navigate("/view-all-tenders")}
        className="mt-4 ml-4 px-4 py-2 bg-teal-600 text-white font-semibold rounded hover:bg-teal-700 transition"
      >
        View All Tenders
      </button>
    </div>
  );
};

export default CityPage;
