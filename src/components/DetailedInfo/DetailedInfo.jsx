import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DetailedInfo.css";

export default function DetailedTenderInfo({ tenders }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tender, setTender] = useState(null);

  useEffect(() => {
    const foundTender = tenders.find(
      (tender) => tender.tender_id.toString() === id
    );
    if (foundTender) {
      setTender(foundTender);
    }
  }, [tenders, id]);

  if (!tender) {
    return (
      <div className="not-found">
        <h2>Tender Details</h2>
        <p>Tender not found</p>
        <button onClick={() => navigate("/")}>Back to Tenders</button>
      </div>
    );
  }

  return (
    <div className="tender-detail">
      <h2>Tender Details</h2>

      <div className="tender-card">
        <h2>{tender.tender_name}</h2>

        <div className="detail-row">
          <p>
            <strong>ID:</strong> {tender.tender_id}
          </p>
          <p>
            <strong>Notice Date:</strong>{" "}
            {tender.date_of_tender_notice.slice(0, 16).replace("T", " ")}
          </p>
        </div>

        <div className="detail-row">
          <p>
            <strong>Description:</strong> {tender.description || "N/A"}
          </p>
          <p>
            <strong>Close Date:</strong>{" "}
            {tender.date_of_tender_close.slice(0, 16).replace("T", " ")}
          </p>
        </div>

        <div className="detail-row">
          <p>
            <strong>Term of Construction:</strong>{" "}
            {tender.construction_from.slice(0, 16).replace("T", " ")} to{" "}
            {tender.construction_to.slice(0, 16).replace("T", " ")}
          </p>
        </div>

        <div className="detail-row">
          <p>
            <strong>Estimated tender price:</strong> {tender.bidding_price}
          </p>
        </div>
        <div className="detail-row">
          <p>
            <strong>Status</strong> {tender.tender_status}
          </p>
        </div>
        <div className="detail-row">
          <p>
            <strong>Staff ID:</strong> {tender.staff_id}
          </p>
        </div>
        <div className="actions">
          <button onClick={() => navigate("/")}>Back</button>
        </div>
      </div>
    </div>
  );
}
