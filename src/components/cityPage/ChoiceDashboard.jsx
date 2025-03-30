import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ChoiceDashboard.css";

export default function ChoiceDashboard() {
  const [tenders, setTenders] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedWinners, setSelectedWinners] = useState({});
  const API_URL = "http://localhost:5500";

  useEffect(() => {
    fetchTenders();
    fetchUsers();
  }, []);

  const fetchTenders = async () => {
    try {
      const response = await axios.get(`${API_URL}/find`);
      setTenders(response.data);
    } catch (error) {
      console.error("Error fetching tenders:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleWinnerChange = (tenderId, userId) => {
    setSelectedWinners((prev) => ({ ...prev, [tenderId]: userId }));
  };

  const finalizeDecision = async (tenderId) => {
    const winnerId = selectedWinners[tenderId];
    if (!winnerId) {
      alert("Please select a winner before finalizing.");
      return;
    }

    try {
      // Fetch the user to get the ObjectId
      const userResponse = await axios.get(`${API_URL}/users/${winnerId}`);
      const winnerObjectId = userResponse.data._id;

      const payload = {
        winner: winnerObjectId, // Use the ObjectId
        tender_status: "Awarded",
      };

      console.log("Finalizing decision with payload:", payload);

      const response = await axios.put(`${API_URL}/update_tender/${tenderId}`, payload);

      if (response.status === 200) {
        alert("Winner finalized successfully!");
        setTenders((prev) =>
          prev.map((tender) =>
            tender.tender_id === tenderId
              ? {
                  ...tender,
                  winner: { user_id: winnerId, name: users.find((user) => user.user_id === winnerId)?.name },
                  tender_status: "Awarded",
                }
              : tender
          )
        );
      } else {
        throw new Error("Unexpected response from the server.");
      }
    } catch (error) {
      console.error("Error finalizing winner:", error.response?.data || error.message);
      alert(
        error.response?.data?.message ||
        "Failed to finalize winner. Please check the server logs for more details."
      );
    }
  };

  return (
    <div className="choice-dashboard">
      <h2>Finalize Tender Winners</h2>
      <table>
        <thead>
          <tr>
            <th>Tender Name</th>
            <th>Bidding Price</th>
            <th>Select Winner</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tenders.map((tender) => (
            <tr key={tender.tender_id}>
              <td>{tender.tender_name}</td>
              <td>{tender.bidding_price}</td>
              <td>
                <select
                  value={selectedWinners[tender.tender_id] || ""}
                  onChange={(e) =>
                    handleWinnerChange(tender.tender_id, e.target.value)
                  }
                >
                  <option value="" disabled>
                    Select Winner
                  </option>
                  {users.map((user) => (
                    <option key={user.user_id} value={user.user_id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button
                  onClick={() => finalizeDecision(tender.tender_id)}
                  className="finalize-btn"
                >
                  Finalize
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
