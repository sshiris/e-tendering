import React, { useState, useEffect } from "react";
import axios from "axios";

const CompanyBids = ({ user }) => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:5500";

  useEffect(() => {
    fetchBids();
  }, []);

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
          bid.user && bid.user.user_id === user.user_id && bid.tender !== null
      );

      const userResult = userBids.map((bid) => ({
        ...bid,
        isWinner: bid.winner === user.user_id,
      }));

      setBids(userResult);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bids:", error);
      setError("Error fetching bids, please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6 sm:px-8 lg:px-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">📑 Your Bids</h2>

        {loading && (
          <div className="text-center text-gray-600 text-lg">Loading...</div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
            {error}
          </div>
        )}

        {!loading && bids.length === 0 && (
          <p className="text-gray-600 text-center">You have no bids yet.</p>
        )}

        <div className="space-y-6">
          {bids.map((bid) => (
            <div
              key={bid.bid_id}
              className="p-5 bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {bid.tender.tender_name}
              </h3>
              <p className="text-gray-700 mb-2">
                <strong>Description:</strong> {bid.tender.description}
              </p>
              <p className="text-gray-900 font-bold mb-2">
                💰 Bid Amount: ${bid.amount}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Submitted on:</strong>{" "}
                {new Date(bid.date).toLocaleDateString()}
              </p>

              {bid.isWinner ? (
                <p className="mt-4 text-green-600 font-semibold">
                  🎉 You won this bid!
                </p>
              ) : (
                <p className="mt-4 text-red-600 font-semibold">
                  You did not win this bid.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyBids;
