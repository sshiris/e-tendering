import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TenderList.css";
function TenderList({ tenders, lastId, isAuthenticated }) {
  const [filteredTender, setFilteredTender] = useState(tenders);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();

    setFilteredTender(() =>
      tenders.filter((tender) => tender.name.toLowerCase().includes(query))
    );
  };

  const navigate = useNavigate();
  return (
    <div>
      <h2>Tenders</h2>
      <input
        id="tender-search"
        type="text"
        placeholder="Search for Tender Name"
        onChange={handleSearch}
      ></input>
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
          {filteredTender.map((tender) => (
            <tr key={tender.id}>
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

      {isAuthenticated && (
        <button onClick={() => navigate("/create-tender")}>
          Register Tender
        </button>
      )}
    </div>
  );
}

export default TenderList;
