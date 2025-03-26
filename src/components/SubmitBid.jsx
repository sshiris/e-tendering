import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function SubmitBid({ submitBid, user_id }) {
  const navigate = useNavigate();
  const location = useLocation();
  const tender = location?.state;
  const [amount, setAmount] = useState("");

  console.log(tender);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting bid", tender.tender_id, amount);
    submitBid(tender.tender_id, amount, user_id);
    navigate("/company");
  };

  if (!tender) return <div>No tender selected</div>;

  return (
    <div>
      <h2>Bid for {tender.tender_name}</h2>
      <p>Budget: {tender.bidding_price}</p>
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
