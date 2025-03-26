import React, { useState, useEffect } from "react";
import axios from "axios";

const CompanyBids = ({ user }) => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:5500";

  useEffect(() => {
    fetchBids(); // Fetch bids when the component mounts
  }, []);

  const fetchBids = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get(`${API_URL}/bids`);
      const allBids = response.data;

      // Filter bids for this user and ensure the tender is not null
      if (!Array.isArray(allBids)) {
        throw new Error("Expected an array of bids.");
      }

      // Filter bids for this user (using user.user_id)
      const userBids = allBids.filter(
        (bid) =>
          bid.user && bid.user.user_id === user.user_id && bid.tender !== null
      );

      setBids(userBids); // Set the filtered bids
      setLoading(false); // Finish loading
    } catch (error) {
      console.error("Error fetching bids:", error);
      setError("Error fetching bids, please try again.");
      setLoading(false); // Stop loading in case of an error
    }
  };

  if (loading) return <div>Loading...</div>; // Loading state
  if (error) return <div>{error}</div>; // Error state

  return (
    <div>
      <h2>Your Bids</h2>
      {bids.length === 0 ? (
        <p>You have no bids.</p>
      ) : (
        <ul>
          {bids.map((bid) => (
            <li key={bid.bid_id}>
              <p>
                <strong>Tender Name:</strong> {bid.tender.tender_name}
              </p>{" "}
              {/* Access populated tender_name */}
              <p>
                <strong>Tender Description:</strong> {bid.tender.description}
              </p>{" "}
              {/* Access populated description */}
              <p>
                <strong>Bid Amount:</strong> {bid.amount}
              </p>
              <p>
                <strong>Submitted by:</strong> {bid.user.name}
              </p>{" "}
              {/* Access populated user name */}
              <p>
                <strong>User Email:</strong> {bid.user.email}
              </p>{" "}
              {/* Access populated user email */}
              <p>
                <strong>Submitted on:</strong>{" "}
                {new Date(bid.date).toLocaleDateString()}
              </p>{" "}
              {/* Bid submission date */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CompanyBids;
