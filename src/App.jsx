import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login/Login";
import TenderList from "./components/TenderList/TenderList";
import CreateTender from "./components/CreateTender/CreateTender";
import DetailedInfo from "./components/DetailedInfo/DetailedInfo";
import SubmitBid from "./components/SubmitBid";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Change to null for single user
  const [tenders, setTenders] = useState([]);
  const [bids, setBids] = useState([]);
  const API_URL = "http://localhost:5500";

  // Fetch tenders on mount
  useEffect(() => {
    axios
      .get(`${API_URL}/find`)
      .then((response) => setTenders(response.data))
      .catch((error) => console.error("Error fetching tenders:", error));
  }, []);

  // Login function with backend integration
  const handleLogin = async (email, password) => {
    try {
      // Assuming you add a /login endpoint in backend
      const response = await axios.post(`${API_URL}/login`, { email, password });
      if (response.data.success) {
        setIsAuthenticated(true);
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  // Submit bid to backend
  const submitBid = async (tenderId, amount) => {
    if (!user) return alert("Please login first");
    try {
      const response = await axios.post(`${API_URL}/create_bid`, {
        amount,
        user_id: user.user_id,
        tender_id: tenderId,
      });
      setBids([...bids, response.data.bid]);
    } catch (error) {
      console.error("Error submitting bid:", error);
    }
  };

  // Add tender to backend
  const addTender = async (newTender) => {
    try {
      const response = await axios.post(`${API_URL}/save_tender`, newTender);
      setTenders([...tenders, response.data.tender || { ...newTender, tender_id: response.data.message.split(' ')[2] }]);
    } catch (error) {
      console.error("Error adding tender:", error);
    }
  };

  return (
    <Router>
      <div className="app">
        <Navbar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
        <Routes>
          <Route
            path="/"
            element={<TenderList tenders={tenders} isAuthenticated={isAuthenticated} />}
          />
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Login handleLogin={handleLogin} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/create-tender"
            element={
              isAuthenticated ? (
                <CreateTender addTender={addTender} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/tender/:id/details"
            element={<DetailedInfo tenders={tenders} isAuthenticated={isAuthenticated} />}
          />
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
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;