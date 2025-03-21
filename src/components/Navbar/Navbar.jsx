import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ isAuthenticated, handleLogout }) {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="logo">
        <h2>e-Tender</h2>
      </div>
      <ul>
        <button
          className="navbar-logo tender-home"
          onClick={() => navigate(isAuthenticated ? "/tenders" : "/")}
        >
          Home
        </button>
        <button className="navbar-logo">Explore</button>
        <button className="navbar-logo">Work & Study</button>
        <button className="navbar-logo">Business</button>
        <button className="navbar-logo">About Us</button>
        <button className="navbar-logo">Events</button>
        {isAuthenticated ? (
          <button className="navbar-btn log-out" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button className="navbar-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
