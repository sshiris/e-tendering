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
          onClick={() => navigate("/home")}
        >
          Home
        </button>
        {isAuthenticated && (
          <button
            className="navbar-logo browse-list"
            onClick={() => navigate("/")}
          >
            Main
          </button>
        )}

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
