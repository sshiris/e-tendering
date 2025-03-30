import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  const handleBrowseList = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.user_type === "City") {
      navigate("/city/dashboard");
    } else {
      navigate("/");
    }
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
