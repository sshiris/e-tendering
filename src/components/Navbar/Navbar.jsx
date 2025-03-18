import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
function Navbar({ isAuthenticated, handleLogout }) {
  const navigate = useNavigate();

  return (
    <nav>
      {isAuthenticated ? (
        <>
          <button className="tender-home" onClick={() => navigate("/tenders")}>
            Tenders
          </button>
          <button className="log-out" onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (
        <>
          <button className="tender-home" onClick={() => navigate("/")}>
            Tenders
          </button>
          <button onClick={() => navigate("/login")}>Login</button>
        </>
      )}
    </nav>
  );
}

export default Navbar;
