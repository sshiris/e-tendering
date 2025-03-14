import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function DetailedTenderInfo({ tenders, isAuthenticated }) {
  return (
    <div>
      <h2>Tenders</h2>
      <table>
        <thead>
          <tr>
            <th>Tender ID</th>
            <th>Tender Name</th>
            <th>Staff Name</th>
            <th>Tender Description</th>
            <th>Term of Construction</th>
            <th>Estimated tender price</th>
            <th>Staff E-mail Address</th>
            <th>Date of Tender Notice</th>
            <th>Date of Tender Close</th>
            <th>Date of Disclosing Winner</th>
            <th>Reason of the winner</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tenders.map((tender) => (
            <tr key={tender.id} onClick={handleRowClick(tender)}>
              <td>{tender.id}</td>
              <td>{tender.name}</td>
              <td>{tender.notice}</td>
              <td>{tender.close}</td>
              <td>{tender.disclosingWinner}</td>
              <td>{tender.status}</td>
              <td>
                {isAuthenticated && (
                  <button
                    onClick={() =>
                      navigate(`/tender/${tender.id}/bid`, { state: tender })
                    }
                  >
                    Bid
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
