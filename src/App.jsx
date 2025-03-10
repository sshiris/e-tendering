import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login/Login";
import TenderList from "./components/TenderList/TenderList";
import CreateTender from "./components/CreateTender";
import SubmitBid from "./components/SubmitBid";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState([]);
  const [tenders, setTenders] = useState([]);
  const [bids, setBids] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [lastId, setLastId] = useState(0);
  useEffect(() => {
    const mockTenders = [];
    setTenders(mockTenders);
  }, []);

  const handleLogin = (email, password) => {
    if (email && password) {
      const newUser = {
        email: email,
        password: password,
      };
      setIsAuthenticated(true);
      setUser([...user, newUser]);

      //Use JSON.stringify for the back-end
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
    setLastId((prevId) => prevId + 1);
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
                <TenderList
                  tenders={tenders}
                  setShowForm={setShowForm}
                  lastId={lastId}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/create-tender"
            element={
              <CreateTender
                addTender={addTender}
                setShowForm={setShowForm}
              ></CreateTender>
            }
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
          <Route path="*" element={<Navigate to="/tenders" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
