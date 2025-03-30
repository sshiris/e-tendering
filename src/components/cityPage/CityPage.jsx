import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const BUTTON_CONFIG = [
  {
    label: "Create New Tender",
    path: "/create-tender",
    color: "blue",
    icon: "M12 4v16m8-8H4",
  },
  {
    label: "Manage Categories",
    path: "/manage-categories",
    color: "green",
    icon: "M3 7h18M3 12h18M3 17h18",
  },
  {
    label: "Manage User-Category Relationships",
    path: "/manage-user-categories",
    color: "gray",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 1.857h5M3 12h18",
  },
  {
    label: "View Feedbacks",
    path: "/view-feedbacks",
    color: "yellow",
    icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  },
  {
    label: "Manage Users",
    path: "/manage-users",
    color: "purple",
    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197",
  },
  {
    label: "View All Tenders",
    path: "/view-all-tenders",
    color: "teal",
    icon: "M3 12h18M3 6h18M3 18h18",
  },
];

const CityPage = memo(({ user }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="container mx-auto px-6 py-8 min-h-screen bg-gray-50">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Welcome, {user.name}
        </h1>
        <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
          Manage the tenders from these actions
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {BUTTON_CONFIG.map((button, index) => (
          <button
            key={index}
            onClick={() => handleNavigation(button.path)}
            className={`group relative px-6 py-4 bg-${button.color}-600 text-white font-medium rounded-xl 
              hover:bg-${button.color}-700 focus:ring-4 focus:ring-${button.color}-300 
              transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg 
              flex items-center justify-center space-x-3`}
          >
            <svg
              className="w-6 h-6 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={button.icon}
              />
            </svg>
            <span className="text-center">{button.label}</span>
            <span className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          </button>
        ))}
      </div>
    </div>
  );
});

CityPage.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

CityPage.displayName = "CityPage";

export default CityPage;
