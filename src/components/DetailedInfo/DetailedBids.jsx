import React, { useState, useEffect } from "react";
import axios from "axios";

const DetailedBids = ({ tender }) => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:5500";

  useEffect(() => {
    fetchBids();
  }, [tender]);

  const fetchBids = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/bids`);
      const allBids = response.data;

      if (!Array.isArray(allBids)) {
        throw new Error("Expected an array of bids.");
      }

      const userBids = allBids.filter(
        (bid) =>
          bid.user &&
          bid.tender &&
          bid.tender.tender_id.toString() === tender.tender_id.toString()
      );

      setBids(userBids);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bids:", error);
      setError("Error fetching bids, please try again.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg flex items-center gap-3">
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        Bids on this Tender
      </h3>

      {bids.length === 0 ? (
        <div className="flex flex-col items-center py-6">
          <svg
            className="h-14 w-14 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-6-4h6M3 17V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <p className="mt-3 text-gray-600 text-lg">
            No bids have been placed yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {bids.map((bid) => (
            <div
              key={bid.bid_id}
              className="p-5 bg-gray-50 rounded-lg border border-gray-200 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-800">
                  {bid.user?.name || "Unknown"}
                </h4>
                <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">
                  {new Date(bid.bid_date || bid.date)
                    .toLocaleString()
                    .slice(0, 16)
                    .replace("T", " ")}
                </span>
              </div>

              <p className="text-sm text-gray-600 mt-2">
                <span className="font-semibold">Email:</span>{" "}
                {bid.user?.email || "N/A"}
              </p>

              <div className="flex items-center mt-3">
                <svg
                  className="h-6 w-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c1.105 0 2 .895 2 2v2h2a2 2 0 012 2v2h-8v-2a2 2 0 012-2h2v-2c0-1.105-.895-2-2-2m-4 10h8m-4-2v2"
                  />
                </svg>
                <p className="text-lg font-bold text-gray-900 ml-2">
                  ${Number(bid.bid_amount || bid.amount).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetailedBids;
