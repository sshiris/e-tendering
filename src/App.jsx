import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login/Login";
import TenderList from "./components/TenderList";
import SubmitBid from "./components/SubmitBid";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tenders, setTenders] = useState([]);
  const [bids, setBids] = useState([]);

  useEffect(() => {
    const mockTenders = [
      {
        id: 1,
        title: "Road Project",
        budget: "$2M",
        deadline: "2025-06-30",
        status: "Open",
      },
      {
        id: 2,
        title: "Hospital Supply",
        budget: "$500K",
        deadline: "2025-05-15",
        status: "Open",
      },
    ];
    setTenders(mockTenders);
  }, []);

  const handleLogin = (email, password) => {
    if (email && password) {
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const submitBid = (tenderId, amount) => {
    const newBid = {
      id: bids.length + 1,
      tenderId,
      amount,
    };
    setBids([...bids, newBid]);
  };

  const addTender = (newTender) => {
    setTenders([...tenders, newTender]);
  };

  return (
    <Router>
      <div className="app">
        <Navbar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
        <Routes>
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Login handleLogin={handleLogin} />
              ) : (
                <Navigate to="/tenders" />
              )
            }
          />
          <Route
            path="/tenders"
            element={
              isAuthenticated ? (
                <TenderList tenders={tenders} addTender={addTender} /> // Added addTender prop
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="" />
          <Route
            path="/tender/:id/bid"
            element={
              isAuthenticated ? (
                <SubmitBid submitBid={submitBid} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="*" element={<Navigate to="/tenders" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
