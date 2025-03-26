import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateTender.css";

export default function CreateTender({ setTenders, fetchTenders, user_id }) {
  const API_URL = "http://localhost:5500";
  const today = new Date().toISOString().slice(0, 16).replace("T", " ");
  const todayDate = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();

  const [newTender, setNewTender] = useState({
    tender_name: "",
    description: "",
    construction_from: todayDate,
    construction_to: todayDate,
    date_of_tender_notice: today,
    date_of_tender_close: today,
    date_of_tender_winner: today,
    bidding_price: 0,
    tender_status: "Open",
    staff_id: user_id || "",
  });
  const [error, setError] = useState(null);

  const addTender = async (newTender) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/save_tender`, newTender);
      if (setTenders) {
        setTenders((prev) => [...prev, response.data.tender || newTender]);
      }
      if (fetchTenders) {
        await fetchTenders();
      }
      console.log("Tender added successfully:", response.data);
      navigate("/");
    } catch (error) {
      console.error("Error adding tender:", error);
      setError(error.response?.data?.message || "Failed to add tender");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTender(newTender);
    setNewTender({
      tender_name: "",
      description: "",
      construction_from: todayDate,
      construction_to: todayDate,
      date_of_tender_notice: today,
      date_of_tender_close: today,
      date_of_tender_winner: today,
      bidding_price: 0,
      tender_status: "Open",
      staff_id: user_id || "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTender((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="create-tender">
      <h3>Create New Tender</h3>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="tender_name">Tender Name</label>
          <input
            id="tender_name"
            type="text"
            name="tender_name"
            value={newTender.tender_name}
            onChange={handleInputChange}
            required
            placeholder="Enter tender name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={newTender.description}
            onChange={handleInputChange}
            required
            rows="3"
            placeholder="Describe the tender"
          />
        </div>
        <div className="form-group">
          <label>Terms of Construction</label>
          <div className="date-range">
            <input
              id="construction_from"
              type="date"
              name="construction_from"
              value={newTender.construction_from}
              onChange={handleInputChange}
              required
            />
            <span>—</span>
            <input
              id="construction_to"
              type="date"
              name="construction_to"
              value={newTender.construction_to}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="date_of_tender_notice">Tender Notice Date</label>
          <input
            id="date_of_tender_notice"
            type="datetime-local"
            name="date_of_tender_notice"
            value={newTender.date_of_tender_notice}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="date_of_tender_close">Tender Close Date</label>
          <input
            id="date_of_tender_close"
            type="datetime-local"
            name="date_of_tender_close"
            value={newTender.date_of_tender_close}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="date_of_tender_winner">Tender Winner Date</label>
          <input
            id="date_of_tender_winner"
            type="datetime-local"
            name="date_of_tender_winner"
            value={newTender.date_of_tender_winner}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="bidding_price">Estimated Price</label>
          <input
            id="bidding_price"
            type="number"
            name="bidding_price"
            value={newTender.bidding_price}
            onChange={handleInputChange}
            min="0"
            step="1000000"
            required
            placeholder="e.g., 1000000"
          />
        </div>
        <div className="form-group">
          <label htmlFor="tender_status">Tender Status</label>
          <select
            id="tender_status"
            name="tender_status"
            value={newTender.tender_status}
            onChange={handleInputChange}
            required
          >
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="staff_id">Staff ID</label>
          <input
            id="staff_id"
            type="text"
            name="staff_id"
            value={newTender.staff_id}
            readOnly
            className="readonly"
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Submit Tender
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
