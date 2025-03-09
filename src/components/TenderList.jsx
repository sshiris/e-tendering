import React from "react";
import { useNavigate } from "react-router-dom";

function TenderList({ tenders }) {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Tenders</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Budget</th>
            <th>Deadline</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tenders.map((tender) => (
            <tr key={tender.id}>
              <td>{tender.title}</td>
              <td>{tender.budget}</td>
              <td>{tender.deadline}</td>
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
    </div>
  );
}

export default TenderList;