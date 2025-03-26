import React from "react";
import { useNavigate } from "react-router-dom";

const CompanyPage = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome to {user.name} Dashboard</h1>

      <button
        onClick={() => navigate("/company/bids")}
        className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
      >
        View My Bids
      </button>
    </div>
  );
};

export default CompanyPage;
