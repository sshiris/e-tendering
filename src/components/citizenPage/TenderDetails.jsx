import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TenderDetails = () => {
  const { id } = useParams();
  const [tender, setTender] = useState(null);
  const [error, setError] = useState(null);
  const API_URL = "http://localhost:5500";

  useEffect(() => {
    const fetchTenderDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/find`);
        const foundTender = response.data.find((t) => t.tender_id === id);
        if (!foundTender) {
          throw new Error("Tender not found");
        }
        setTender(foundTender);
      } catch (err) {
        setError(err.message || "Failed to fetch tender details.");
      }
    };

    fetchTenderDetails();
  }, [id]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!tender) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{tender.tender_name}</h1>
      <p>{tender.description}</p>
      <p>
        <strong>Notice Date:</strong>{" "}
        {new Date(tender.date_of_tender_notice).toLocaleDateString()}
      </p>
      <p>
        <strong>Close Date:</strong>{" "}
        {new Date(tender.date_of_tender_close).toLocaleDateString()}
      </p>
      <p>
        <strong>Status:</strong> {tender.tender_status}
      </p>
      <p>
        <strong>Bidding Price:</strong> ${tender.bidding_price}
      </p>
      <p>
        <strong>Construction Period:</strong>{" "}
        {new Date(tender.construction_from).toLocaleDateString()} -{" "}
        {new Date(tender.construction_to).toLocaleDateString()}
      </p>
      {tender.winner ? (
        <p>
          <strong>Winner:</strong> {tender.winner.name}
        </p>
      ) : (
        <p>
          <strong>Competing Companies:</strong>{" "}
          {tender.bids && tender.bids.length > 0
            ? tender.bids.map((bid) => bid.user.name).join(", ")
            : "No bids yet"}
        </p>
      )}
    </div>
  );
};
// This component fetches and displays the details of a specific tender based on the ID passed in the URL parameters. It handles loading and error states, and displays relevant information about the tender, including its status, bidding price, and competing companies or winner.
// It uses React Router's useParams to extract the tender ID from the URL, and Axios to fetch data from the server. The component is styled using Tailwind CSS classes.
export default TenderDetails;
