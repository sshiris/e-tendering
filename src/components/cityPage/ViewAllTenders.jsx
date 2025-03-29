import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewAllTenders = () => {
  const [tenders, setTenders] = useState([]);
  const [error, setError] = useState(null);
  const API_URL = "http://localhost:5500";

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const response = await axios.get(`${API_URL}/find`);
        setTenders(response.data);
      } catch (err) {
        setError("Failed to fetch tenders. Please try again.");
      }
    };

    fetchTenders();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">All Tenders</h1>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="mt-4">
        {tenders.map((tender) => (
          <li key={tender.tender_id} className="mb-4 p-4 border rounded">
            <h2 className="font-bold">{tender.tender_name}</h2>
            <p>Status: {tender.tender_status}</p>
            <p>Budget: {tender.bidding_price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewAllTenders;
