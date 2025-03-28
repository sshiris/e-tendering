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
import CreateUser from "./components/CreateUser/CreateUser";
import DetailedInfo from "./components/DetailedInfo/DetailedInfo";
import SubmitBid from "./components/SubmitBid";
import { ConfirmProvider } from "material-ui-confirm";

import "./App.css";
import CompanyPage from "./components/companyPage/CompanyPage";
import CompanyBids from "./components/companyBids/CompanyBids";

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

  const handleLogin = async (email, password, id) => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      const users = response.data;

      const user = users.find(
        (u) =>
          (u.email === email || u.user_id === id) && u.password === password
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

      localStorage.setItem("user", JSON.stringify(user));

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

  const submitBid = async (tender_id, amount, user_id) => {
    const bidData = {
      amount: amount,
      user_id: user_id,
      tender_id: tender_id,
    };
    console.log("Bid Data:", bidData);
    console.log("User ID:", user_id);
    console.log("Tender ID:", tender_id);

    try {
      const response = await axios.post(
        "http://localhost:5500/create_bid",
        bidData
      );
      // Handle success
    } catch (error) {
      console.error(
        "Error submitting bid:",
        error.response?.data || error.message
      );
    }
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
            path="/company"
            element={
              isCompany ? (
                <>
                  <CompanyPage user={user}></CompanyPage>
                  <TenderList tenders={tenders} isCompany={isCompany} />
                </>
              ) : (
                <Navigate to="/login" /> // Redirect to login if not a company
              )
            }
          />

          <Route
            path="/company/bids"
            element={
              isCompany ? <CompanyBids user={user} /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/login"
            element={
              isCompany ? (
                <Navigate to="/company" />
              ) : (
                <Login handleLogin={handleLogin} />
              )
            }
          />
          <Route path="/create-user" element={<CreateUser />} />
          <Route
            path="/create-tender"
            element={
              isCompany ? (
                <CreateTender
                  setTenders={setTenders}
                  fetchTenders={fetchTenders}
                  user_id={user.user_id}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/update-tender/:id"
            element={
              isCompany ? (
                <UpdateTender
                  tenders={tenders}
                  fetchTenders={fetchTenders}
                  user_id={user.user_id}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/tender/:id/details"
            element={
              <ConfirmProvider>
                <DetailedInfo
                  tenders={tenders}
                  fetchTenders={fetchTenders}
                  user={user}
                />
              </ConfirmProvider>
            }
          />
          <Route
            path="/tender/:id/bid"
            element={
              isCompany ? (
                <SubmitBid submitBid={submitBid} user_id={user?.user_id} />
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
