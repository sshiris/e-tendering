/**
 * TenderDetails Component
 * Fetches and displays the details of a specific tender based on its ID from URL parameters.
 * Handles loading and error states during data fetching.
 */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TenderDetails = () => {
  // Extract tender ID from URL parameters using React Router's useParams hook.
  const { id } = useParams();

  // State to hold fetched tender details and error messages.
  const [tender, setTender] = useState(null);
  const [error, setError] = useState(null);

  // Define API base URL.
  const API_URL = "http://localhost:5500";

  // Fetch tender details when the component mounts or the ID changes.
  useEffect(() => {
    const fetchTenderDetails = async () => {
      try {
        // Make API call to fetch tenders.
        const response = await axios.get(`${API_URL}/find`);

        // Find the specific tender by ID.
        const foundTender = response.data.find((t) => t.tender_id === id);

        // Handle case where tender is not found.
        if (!foundTender) {
          throw new Error("Tender not found");
        }

        // Set tender details in state.
        setTender(foundTender);
      } catch (err) {
        // Set error message if data fetching fails.
        setError(err.message || "Failed to fetch tender details.");
      }
    };

    fetchTenderDetails();
  }, [id]);

  // Render error message if an error occurred.
  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  // Render loading message until tender details are available.
  if (!tender) {
    return <p>Loading...</p>;
  }

  return (
    // Render tender details in a styled container.
    <div className="p-6">
      {/* Tender title */}
      <h1 className="text-2xl font-bold">{tender.tender_name}</h1>

      {/* Tender description */}
      <p>{tender.description}</p>

      {/* Notice and close dates */}
      <p>
        <strong>Notice Date:</strong>{" "}
        {new Date(tender.date_of_tender_notice).toLocaleDateString()}
      </p>
      <p>
        <strong>Close Date:</strong>{" "}
        {new Date(tender.date_of_tender_close).toLocaleDateString()}
      </p>

      {/* Tender status */}
      <p>
        <strong>Status:</strong> {tender.tender_status}
      </p>

      {/* Bidding price */}
      <p>
        <strong>Bidding Price:</strong> ${tender.bidding_price}
      </p>

      {/* Construction period */}
      <p>
        <strong>Construction Period:</strong>{" "}
        {new Date(tender.construction_from).toLocaleDateString()} -{" "}
        {new Date(tender.construction_to).toLocaleDateString()}
      </p>

      {/* Display winner or competing companies */}
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

// JSDoc Summary:
// - This component uses React Router's useParams hook to extract the tender ID from the URL.
// - Axios is used to make an API call to fetch tender data from the server.
// - Error handling ensures graceful failure when the tender is not found or the API call fails.
// - The component displays relevant tender information including notice date, close date, status, bidding price, and competing companies or the winner.
// - Tailwind CSS is used for styling the component.

export default TenderDetails;
