import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ChoiceDashboard() {
  const [tenders, setTenders] = useState([]);
  const [bids, setBids] = useState([]);
  const [selectedWinners, setSelectedWinners] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = "http://localhost:5500";
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch tenders
      const tendersResponse = await axios.get(`${API_URL}/find`);
      const tendersData = tendersResponse.data;

      // Fetch all bids
      const bidsResponse = await axios.get(`${API_URL}/bids`);
      const bidsData = bidsResponse.data;

      if (!Array.isArray(tendersData) || !Array.isArray(bidsData)) {
        throw new Error("Invalid data format received from the server.");
      }

      setTenders(tendersData);
      setBids(bidsData);
      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load tenders and bids. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle winner selection
  const handleWinnerChange = (tenderId, userId) => {
    setSelectedWinners((prev) => ({ ...prev, [tenderId]: userId }));
  };

  // Finalize winner selection
  const finalizeDecision = async (tenderId) => {
    const winnerId = selectedWinners[tenderId];

    if (!winnerId) {
      alert("Please select a winner before finalizing.");
      return;
    }

    try {
      // Get user details (to fetch MongoDB _id)
      const userResponse = await axios.get(`${API_URL}/users/${winnerId}`);
      const winnerObjectId = userResponse.data._id;

      // Update the tender with the winner
      const payload = {
        winner: winnerObjectId,
        tender_status: "Awarded",
      };

      const response = await axios.put(
        `${API_URL}/update_tender/${tenderId}`,
        payload
      );

      if (response.status === 200) {
        alert("Winner finalized successfully!");

        // Update UI: Mark tender as "Awarded" with the winner
        setTenders((prev) =>
          prev.map((tender) =>
            tender.tender_id === tenderId
              ? {
                  ...tender,
                  winner: {
                    user_id: winnerId,
                    name:
                      bids.find(
                        (bid) =>
                          bid.user?.user_id === winnerId &&
                          bid.tender?.tender_id === tenderId
                      )?.user?.name || "Unknown",
                  },
                  tender_status: "Awarded",
                }
              : tender
          )
        );
      } else {
        throw new Error("Unexpected response from the server.");
      }
    } catch (error) {
      console.error(
        "Error finalizing winner:",
        error.response?.data || error.message
      );
      alert(
        error.response?.data?.message ||
          "Failed to finalize winner. Please check the server logs."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <div
          className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"
          role="status"
          aria-label="Loading data"
        ></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"
        role="alert"
      >
        <svg
          className="h-5 w-5 text-red-500"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Finalize Tender Winners
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 transition duration-200"
          >
            Go Back
          </button>
        </div>

        {tenders.length === 0 ? (
          <div className="text-center py-6">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-6-4h6M3 17V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <p className="mt-2 text-gray-600">No tenders available.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">Tender Name</th>
                  <th className="px-6 py-3 text-left">Lowest Bidding Price</th>
                  <th className="px-6 py-3 text-left">Select Winner</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tenders
                  .filter((tender) => tender.tender_status !== "Awarded") // Show only non-awarded tenders
                  .map((tender) => {
                    // Get bids for this tender
                    const tenderBids = bids.filter(
                      (bid) =>
                        bid.tender?.tender_id === tender.tender_id &&
                        bid.user !== null
                    );

                    // Calculate lowest bid
                    const lowestBid =
                      tenderBids.length > 0
                        ? Math.min(
                            ...tenderBids.map(
                              (bid) => bid.bid_amount || bid.amount
                            )
                          ).toLocaleString()
                        : "No bids";

                    // Get unique users who bid on this tender
                    const bidders = [
                      ...new Map(
                        tenderBids.map((bid) => [
                          bid.user.user_id,
                          {
                            user_id: bid.user.user_id,
                            name: bid.user.name,
                          },
                        ])
                      ).values(),
                    ];

                    return (
                      <tr
                        key={tender.tender_id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">{tender.tender_name}</td>
                        <td className="px-6 py-4">
                          {lowestBid === "No bids"
                            ? lowestBid
                            : `$${lowestBid}`}
                        </td>
                        <td className="px-6 py-4">
                          {bidders.length > 0 ? (
                            <select
                              value={selectedWinners[tender.tender_id] || ""}
                              onChange={(e) =>
                                handleWinnerChange(
                                  tender.tender_id,
                                  e.target.value
                                )
                              }
                              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                              disabled={tender.tender_status === "Awarded"}
                            >
                              <option value="" disabled>
                                Select Winner
                              </option>
                              {bidders.map((bidder) => (
                                <option
                                  key={bidder.user_id}
                                  value={bidder.user_id}
                                >
                                  {bidder.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-gray-500">No bidders</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => finalizeDecision(tender.tender_id)}
                            className={`px-4 py-2 font-medium rounded-lg transition duration-200 ${
                              tender.tender_status === "Awarded"
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
                            }`}
                            disabled={tender.tender_status === "Awarded"}
                          >
                            {tender.tender_status === "Awarded"
                              ? "Awarded"
                              : "Finalize"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
