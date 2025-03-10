import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TenderList.css";
function TenderList({ tenders, lastId }) {
  const navigate = useNavigate();
  return (
    <div>
      <h2>Tenders</h2>
      <table>
        <thead>
          <tr>
            <th>Tender ID</th>
            <th>Tender Name</th>
            <th>Date of Tender Notice</th>
            <th>Date of Tender Close</th>
            <th>Date of Disclosing Winner</th>
            <th>Tender status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tenders.map((tender) => (
            <tr key={tender.id}>
              <td>{lastId}</td>
              <td>{tender.name}</td>
              <td>{tender.notice}</td>
              <td>{tender.close}</td>
              <td>{tender.winner}</td>
              <td>{tender.status}</td>
              <td>
                <button
                  onClick={() =>
                    navigate(`/tender/${tender.id}/bid`, { state: tender })
                  }
                >
                  Bid
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => navigate("/create-tender")}>
        Register Tender
      </button>
    </div>
  );
}

export default TenderList;
