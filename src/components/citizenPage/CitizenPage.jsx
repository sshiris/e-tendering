/**
 * CitizenPage Component
 * Renders a citizen interface for exploring tenders and projects.
 * @param {Object} user - User object containing user information.
 * @param {string} user.name - The name of the user to personalize the page.
 */
import React from "react";
import { useNavigate } from "react-router-dom";

const CitizenPage = ({ user }) => {
  // useNavigate hook to navigate programmatically between routes.
  const navigate = useNavigate();

  return (
    // Main container with responsive layout and styling.
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header section for welcoming the user */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Welcome, {user.name}!
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Explore tenders and stay informed about ongoing projects in your
            city with ease.
          </p>
        </div>

        {/* Section for tender management options */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="p-6">
            {/* Section title */}
            <div className="flex items-center mb-4">
              <svg
                className="h-8 w-8 text-blue-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900">
                Tender Management
              </h2>
            </div>

            {/* Buttons for navigating to different tender pages */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* Button for viewing open tenders */}
              <button
                onClick={() => navigate("/citizen/open-tenders")}
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                View Open Tenders
              </button>

              {/* Button for viewing closed tenders */}
              <button
                onClick={() => navigate("/citizen/closed-tenders")}
                className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                View Closed Tenders
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenPage;
