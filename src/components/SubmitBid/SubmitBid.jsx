import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./SubmitBid.css";

function SubmitBid({ tenders, user }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tender, setTender] = useState(null);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_URL = "http://localhost:5500";

  useEffect(() => {
    const selectedTender = tenders.find(
      (t) => t.tender_id.toString() === id.toString()
    );
    if (selectedTender) {
      setTender(selectedTender);
    } else {
      setError("Tender not found.");
    }
  }, [tenders, id]);

  const submitBid = async (tenderId, bidAmount) => {
    try {
      setLoading(true);
      setError(null);

      const amountNum = parseFloat(bidAmount);
      if (isNaN(amountNum) || amountNum <= 0) {
        throw new Error("Please enter a valid bid amount greater than 0.");
      }

      if (tender.bidding_price && amountNum < tender.bidding_price) {
        throw new Error(`Bid amount must be at least ${tender.bidding_price}.`);
      }

      const response = await axios.post(`${API_URL}/create_bid`, {
        tender_id: tenderId,
        user_id: user.user_id,
        amount: amountNum,
      });

      console.log("Bid submitted successfully:", response.data);
    } catch (err) {
      throw new Error(
        err.response?.data?.message || err.message || "Failed to submit bid."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitBid(tender.tender_id, amount);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  if (error && !tender) {
    return (
      <div className="submit-bid">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/")}>Back to Tender List</button>
      </div>
    );
  }

  if (!tender) {
    return (
      <div className="submit-bid">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="submit-bid">
      <h2>Bid for {tender.tender_name}</h2>
      <p>Minimum Bid: {tender.bidding_price || "Not specified"}</p>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">Bid Amount</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter your bid amount"
            min={tender.bidding_price}
            step="1000000"
            required
            disabled={loading}
          />
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Submitting..." : "Submit Bid"}
        </button>
      </form>
      <button
        className="cancel-btn"
        onClick={() => navigate(`/`)}
        disabled={loading}
      >
        Cancel
      </button>
    </div>
  );
}

export default SubmitBid;
