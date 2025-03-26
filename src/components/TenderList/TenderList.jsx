import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TenderList.css";

function TenderList({ tenders, isCompany, isCity }) {
  const navigate = useNavigate();

  const [filteredTender, setFilteredTender] = useState(tenders);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setFilteredTender(
      tenders.filter((tender) =>
        tender.tender_name.toLowerCase().includes(query)
      )
    );
  };

  function handleRowClick(tender) {
    navigate(`/tender/${tender.tender_id}/details`);
  }

  return (
    <div className="tender-list">
      <div className="search-container">
        <span className="search-icon material-symbols-outlined">search</span>
        <input
          id="tender-search"
          type="text"
          placeholder="Search for Tender Name"
          onChange={handleSearch}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Tender ID</th>
            <th>Tender Name</th>
            <th>Date of Tender Notice</th>
            <th>Date of Tender Close</th>
            <th>Date of Disclosing Winner</th>
            <th>Tender Status</th>
            {isCompany && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredTender.map((tender) => (
            <tr key={tender.tender_id}>
              <td>{tender.tender_id}</td>
              <td>
                <span
                  onClick={() => handleRowClick(tender)}
                  className="click-to-detail"
                >
                  {tender.tender_name}
                </span>
              </td>
              <td>
                {tender.date_of_tender_notice.slice(0, 16).replace("T", " ")}
              </td>
              <td>
                {tender.date_of_tender_close.slice(0, 16).replace("T", " ")}
              </td>
              <td>
                {tender.date_of_tender_winner.slice(0, 16).replace("T", " ")}
              </td>
              <td
                className={`tender-status ${
                  tender.tender_status === "Open"
                    ? "status-open"
                    : tender.tender_status === "Closed"
                    ? "status-closed"
                    : tender.tender_status === "Pending"
                    ? "status-pending"
                    : "status-invalid"
                }`}
              >
                {tender.tender_status}
              </td>
              {isCompany && (
                <td className="action-buttons">
                  <button
                    className="action-btn bid-btn"
                    onClick={() =>
                      navigate(`/tender/${tender.tender_id}/bid`, {
                        state: tender,
                      })
                    }
                    disabled={tender.tender_status !== "Open"}
                  >
                    Bid
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {isCity && (
        <button
          className="action-btn register-btn"
          onClick={() => navigate("/create-tender")}
        >
          +
        </button>
      )}
    </div>
  );
}

export default TenderList;
