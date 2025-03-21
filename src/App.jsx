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
  const [isCompany, setIsCompany] = useState(false);
  const [isCity, setIsCity] = useState(false);
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
      if (user.email.includes("@city")) {
        setIsCity(true);
        setIsCompany(false);
      } else {
        setIsCity(false);
        setIsCompany(true);
      }
      if (!user) {
        throw new Error("Invalid user. Try again");
      }
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
    setIsCompany(false);
    setIsCity(false);
    setUser(null);
  };

  return (
    <Router>
      <div className="app">
        <Navbar
          isAuthenticated={isCompany ?? isCity}
          handleLogout={handleLogout}
        />
        <Routes>
          <Route
            path="/"
            element={
              <TenderList
                tenders={tenders}
                isCompany={isCompany}
                isCity={isCity}
              />
            }
          />
          <Route
            path="/login"
            element={
              isCompany ? (
                <Navigate to="/" />
              ) : (
                <Login handleLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/create-tender"
            element={
              isCompany ? (
                <CreateTender
                  setTenders={setTenders}
                  fetchTenders={fetchTenders}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/tender/:id/details"
            element={<DetailedInfo tenders={tenders} />}
          />
          <Route
            path="/tender/:id/bid"
            element={
              isCompany ? (
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
