import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  const handleBrowseList = () => {
    navigate("/");
  };

  return (
    <div className="home">
      <h1>Welcome to e-Tender</h1>
      <p>Explore available tenders by browsing the list below.</p>
      <button className="browse-list-btn" onClick={handleBrowseList}>
        Browse List
      </button>
    </div>
  );
}
