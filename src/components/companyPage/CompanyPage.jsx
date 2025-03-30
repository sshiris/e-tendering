import React from "react";
import { useNavigate } from "react-router-dom";

const CompanyPage = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6 sm:px-8 lg:px-10">
      <div className="max-w-4xl mx-auto">
        {/* Welcome & Actions */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome, {user.name} 👋
          </h1>
          <p className="text-gray-600 mb-6">
            Manage your company activities below.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/company/bids")}
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg 
              hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg"
            >
              📑 View My Bids
            </button>
            <button
              onClick={() => navigate("/list")}
              className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg 
              hover:bg-green-700 transition duration-200 shadow-md hover:shadow-lg"
            >
              🏆 Browse Tenders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;
