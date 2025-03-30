import React, { useEffect, useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ViewAllTenders = memo(() => {
  const [tenders, setTenders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const navigate = useNavigate();
  const API_URL = "http://localhost:5500";

  useEffect(() => {
    const fetchTenders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/find`, {
          timeout: 8000,
        });
        const sortedTenders = sortTenders(response.data);
        setTenders(sortedTenders);
        setError(null);
      } catch (err) {
        setError(
          err.code === "ECONNABORTED"
            ? "Connection timed out. Please check your network."
            : "Failed to load tenders. Please refresh the page."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTenders();
  }, []);

  const sortTenders = (tendersToSort) => {
    const statusOrder = {
      Open: 1,
      Pending: 2,
      Closed: 3,
    };

    return tendersToSort.sort((a, b) => {
      const statusA = statusOrder[a.tender_status] || 4;
      const statusB = statusOrder[b.tender_status] || 4;
      return statusA - statusB;
    });
  };

  const filteredTenders =
    filterStatus === "All"
      ? tenders
      : tenders.filter((tender) => tender.tender_status === filterStatus);

  const statusOptions = ["All", "Open", "Pending", "Closed"];

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Tender Overview
          </h1>
          <div className="flex items-center space-x-4">
            <label
              htmlFor="status-filter"
              className="text-sm font-medium text-gray-700"
            >
              Filter by Status:
            </label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-40 pl-3 pr-8 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white shadow-sm"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <svg
              className="h-5 w-5 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-pulse flex space-x-4">
              <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        )}

        {!loading && filteredTenders.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTenders.map((tender) => (
              <div
                key={tender.tender_id}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl"
              >
                <div
                  className={`h-2 w-full ${
                    tender.tender_status === "Open"
                      ? "bg-green-500"
                      : tender.tender_status === "Closed"
                      ? "bg-red-500"
                      : tender.tender_status === "Pending"
                      ? "bg-yellow-500"
                      : "bg-gray-500"
                  }`}
                ></div>
                <div className="p-5">
                  <h2 className="text-lg font-semibold text-gray-800 truncate">
                    {tender.tender_name}
                  </h2>
                  <div className="mt-3 space-y-2">
                    <p className="text-sm flex items-center">
                      <span className="text-gray-600 font-medium mr-2">
                        Status:
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          tender.tender_status === "Open"
                            ? "bg-green-100 text-green-700"
                            : tender.tender_status === "Closed"
                            ? "bg-red-100 text-red-700"
                            : tender.tender_status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {tender.tender_status}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Budget:</span> $
                      {Number(tender.bidding_price).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
                <div className="px-5 py-3 bg-gray-50 flex justify-end">
                  <button
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    onClick={() =>
                      navigate(`/tender/${tender.tender_id}/details`)
                    }
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredTenders.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No Tenders Found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filterStatus === "All"
                ? "There are no tenders available at this time."
                : `No tenders with "${filterStatus}" status.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

ViewAllTenders.displayName = "ViewAllTenders";

export default ViewAllTenders;
