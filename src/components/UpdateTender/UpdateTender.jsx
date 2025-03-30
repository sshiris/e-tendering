import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function UpdateTender({ tenders, fetchTenders, user_id }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = "http://localhost:5500";

  const [tender, setTender] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tenders || tenders.length === 0) {
      setError("No tenders available to update.");
      return;
    }

    const foundTender = tenders.find(
      (t) => t.tender_id.toString() === id.toString()
    );
    if (foundTender) {
      setTender({
        tender_id: foundTender.tender_id,
        tender_name: foundTender.tender_name,
        description: foundTender.description || "",
        construction_from: new Date(foundTender.construction_from)
          .toISOString()
          .split("T")[0],
        construction_to: new Date(foundTender.construction_to)
          .toISOString()
          .split("T")[0],
        date_of_tender_notice: new Date(foundTender.date_of_tender_notice)
          .toISOString()
          .slice(0, 16),
        date_of_tender_close: new Date(foundTender.date_of_tender_close)
          .toISOString()
          .slice(0, 16),
        date_of_tender_winner: foundTender.date_of_tender_winner
          ? new Date(foundTender.date_of_tender_winner)
              .toISOString()
              .slice(0, 16)
          : "",
        bidding_price: foundTender.bidding_price,
        tender_status: foundTender.tender_status,
        staff_id: foundTender.staff_id || user_id,
      });
    } else {
      setError("Tender not found.");
    }
  }, [tenders, id, user_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTender((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);

      const response = await axios.put(
        `${API_URL}/update_tender/${tender.tender_id}`,
        tender
      );

      if (fetchTenders) {
        await fetchTenders();
      }

      console.log("Tender updated successfully:", response.data);
      navigate(`/tender/${tender.tender_id}/details`);
    } catch (error) {
      console.error("Error updating tender:", error);
      setError(
        error.response?.data?.message ||
          "Failed to update tender. Please try again."
      );
    }
  };

  const handleCancel = () => {
    navigate(`/tender/${tender.tender_id}/details`);
  };

  if (error) {
    return (
      <div className="create-tender">
        <h3>Update Tender</h3>
        <p>{error}</p>
        <button onClick={() => navigate("/")}>Back to Tenders</button>
      </div>
    );
  }

  if (!tender) {
    return (
      <div className="create-tender">
        <h3>Update Tender</h3>
        <p>Loading tender data...</p>
        <button onClick={() => navigate("/")}>Back to Tenders</button>
      </div>
    );
  }

  return (
    <div className="create-tender">
      <h3>Update Tender</h3>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="tender_id">Tender ID</label>
          <input
            id="tender_id"
            type="text"
            name="tender_id"
            value={tender.tender_id}
            readOnly
            className="readonly"
          />
        </div>
        <div className="form-group">
          <label htmlFor="tender_name">Tender Name</label>
          <input
            id="tender_name"
            type="text"
            name="tender_name"
            value={tender.tender_name}
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
            value={tender.description}
            onChange={handleInputChange}
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
              value={tender.construction_from}
              onChange={handleInputChange}
              required
            />
            <span>—</span>
            <input
              id="construction_to"
              type="date"
              name="construction_to"
              value={tender.construction_to}
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
            value={tender.date_of_tender_notice}
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
            value={tender.date_of_tender_close}
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
            value={tender.date_of_tender_winner}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="bidding_price">Bidding Price</label>
          <input
            id="bidding_price"
            type="number"
            name="bidding_price"
            value={tender.bidding_price}
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
            value={tender.tender_status}
            onChange={handleInputChange}
            required
          >
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
            <option value="Pending">Pending</option>
            <option value="Awarded">Awarded</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="staff_id">Staff ID</label>
          <input
            id="staff_id"
            type="text"
            name="staff_id"
            value={tender.staff_id}
            readOnly
            className="readonly"
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Update Tender
          </button>
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
