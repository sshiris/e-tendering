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

      setBids(userBids);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bids:", error);
      setError("Error fetching bids, please try again.");
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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
              <p>
                <strong>Tender Description:</strong> {bid.tender.description}
              </p>{" "}
              <p>
                <strong>Bid Amount:</strong> {bid.amount}
              </p>
              <p>
                <strong>Submitted by:</strong> {bid.user.name}
              </p>{" "}
              <p>
                <strong>User Email:</strong> {bid.user.email}
              </p>{" "}
              <p>
                <strong>Submitted on:</strong>{" "}
                {new Date(bid.date).toLocaleDateString()}
              </p>{" "}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CompanyBids;
