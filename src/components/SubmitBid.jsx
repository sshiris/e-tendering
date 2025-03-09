import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function SubmitBid({ submitBid }) {
  const navigate = useNavigate();
  const location = useLocation();
  const tender = location?.state;
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    submitBid(tender.id, amount);
    navigate("/tenders");
  };

  if (!tender) return <div>No tender selected</div>;

  return (
    <div>
      <h2>Bid for {tender.title}</h2>
      <p>Budget: {tender.budget}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Bid Amount"
          required
        />
        <button type="submit">Submit Bid</button>
      </form>
    </div>
  );
}

export default SubmitBid;
