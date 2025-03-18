import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Login/Login";
import TenderList from "./components/TenderList/TenderList";
import CreateTender from "./components/CreateTender/CreateTender";
import DetailedInfo from "./components/DetailedInfo/DetailedInfo";
import SubmitBid from "./components/SubmitBid";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [tenders, setTenders] = useState([]);
  const [bids, setBids] = useState([]);
  const API_URL = "http://localhost:5500";

  useEffect(() => {
    fetchTenders();
    fetchBids();
  }, []);

  const fetchTenders = async () => {
    try {
      const response = await axios.get(`${API_URL}/find`);
      setTenders(response.data);
    } catch (error) {
      console.error("Error fetching tenders:", error);
    }
  };

  const fetchBids = async () => {
    try {
      const response = await axios.get(`${API_URL}/bids`);
      setBids(response.data);
    } catch (error) {
      console.error("Error fetching bids:", error);
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      const users = response.data;

      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        throw new Error("Invalid user. Try again");
      }
      setIsAuthenticated(true);
      setUser({
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        address: user.address,
        user_type: user.user_type,
      });
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const addTender = async (newTender) => {
    try {
      const response = await axios.post(`${API_URL}/save_tender`, {
        ...newTender,
      });

      setTenders([...tenders, response.data.tender || newTender]);
      await fetchTenders();
      console.log("Tender added successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error adding tender:", error);
      throw error;
    }
  };

  return (
    <Router>
      <div className="app">
        <Navbar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
        <Routes>
          <Route
            path="/"
            element={
              <TenderList tenders={tenders} isAuthenticated={isAuthenticated} />
            }
          />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/" />
              ) : (
                <Login handleLogin={handleLogin} />
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
            element={
              <DetailedInfo
                tenders={tenders}
                bids={bids}
                isAuthenticated={isAuthenticated}
                user={user}
              />
            }
          />
          <Route
            path="/tender/:id/bid"
            element={
              isAuthenticated ? (
                <SubmitBid tenders={tenders} user={user} />
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
