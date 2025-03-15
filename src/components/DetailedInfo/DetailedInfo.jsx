import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DetailedInfo.css";

export default function DetailedTenderInfo({ tenders }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tender, setTender] = useState(null);

  useEffect(() => {
    const foundTender = tenders.find((tender) => tender.id.toString() === id);
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
        <h2>{tender.name}</h2>

        <div className="detail-row">
          <p>
            <strong>ID:</strong> {tender.id}
          </p>
          <p>
            <strong>Notice Date:</strong> {tender.notice}
          </p>
        </div>

        <div className="detail-row">
          <p>
            <strong>Description:</strong> {tender.description || "N/A"}
          </p>
          <p>
            <strong>Close Date:</strong> {tender.close}
          </p>
        </div>

        <div className="detail-row">
          <p>
            <strong>Term of Construction:</strong> {tender.disclosingWinner}
          </p>
          <p>
            <strong>Winner Disclosure:</strong> {tender.disclosingWinner}
          </p>
        </div>

        <div className="detail-row">
          <p>
            <strong>Estimated tender price:</strong> {tender.disclosingWinner}
          </p>
          <p>
            <strong>Reason of the winner:</strong> {tender.disclosingWinner}
          </p>
        </div>
        <div className="actions">
          <button onClick={() => navigate("/")}>Back</button>
        </div>
      </div>
    </div>
  );
}
