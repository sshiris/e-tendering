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
import SubmitBid from "./components/SubmitBid/SubmitBid";
import { ConfirmProvider } from "material-ui-confirm";
import Home from "./components/Home/Home";
import "./App.css";
import CompanyPage from "./components/companyPage/CompanyPage";
import CompanyBids from "./components/companyPage/CompanyBids";
import UpdateTender from "./components/UpdateTender/UpdateTender";
import CitizenPage from "./components/citizenPage/CitizenPage";
import CitizenFeedback from "./components/citizenPage/CitizenFeedback";
import ViewFeedback from "./components/citizenPage/ViewFeedback";
import OpenTenders from "./components/citizenPage/OpenTenders";
import ClosedTenders from "./components/citizenPage/ClosedTenders";
import TenderDetails from "./components/citizenPage/TenderDetails";
import CityPage from "./components/cityPage/cityPage";
import ManageCategories from "./components/cityPage/ManageCategories";
import ManageUserCategories from "./components/cityPage/ManageUserCategories";
import ManageUsers from "./components/cityPage/ManageUsers";
import CompanyApplication from "./components/companyPage/CompanyApplication";
import ViewAllTenders from "./components/cityPage/ViewAllTenders";
import CreateAdmin from "./components/CreateAdmin/CreateAdmin";
import ChoiceDashboard from "./components/cityPage/ChoiceDashboard";
import ViewFeedbacks from "./components/cityPage/ViewFeedbacks";

function App() {
  const [isCompany, setIsCompany] = useState(false);
  const [isCity, setIsCity] = useState(false);
  const [isCitizen, setIsCitizen] = useState(false);
  const [user, setUser] = useState(null);
  const [tenders, setTenders] = useState([]);
  const [users, setUsers] = useState([]);
  const API_URL = "http://localhost:5500";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (parsedUser.user_type === "City") setIsCity(true);
      else if (parsedUser.user_type === "Company") setIsCompany(true);
      else if (parsedUser.user_type === "Citizen") setIsCitizen(true);
    }

    fetchTenders();
    fetchUsers();

    const interval = setInterval(() => {
      updateTenderStatus();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const updateTenderStatus = async (tendersToUpdate = tenders) => {
    if (!tendersToUpdate || tendersToUpdate.length === 0) {
      return tendersToUpdate;
    }

    const currentDate = new Date();
    const updatedTenders = await Promise.all(
      tendersToUpdate.map(async (tender) => {
        const noticeDate = new Date(tender.date_of_tender_notice);
        const closeDate = new Date(tender.date_of_tender_close);

        if (closeDate <= noticeDate) {
          console.error(
            `Invalid dates for tender ${tender.tender_id}: date_of_tender_close (${closeDate}) must be greater than date_of_tender_notice (${noticeDate})`
          );
          return { ...tender, tender_status: "Invalid" };
        }

        let newStatus;
        if (currentDate < noticeDate) {
          newStatus = "Pending";
        } else if (currentDate >= noticeDate && currentDate <= closeDate) {
          newStatus = "Open";
        } else {
          newStatus = "Closed";
        }

        const updatedTender = { ...tender, tender_status: newStatus };

        try {
          await axios.put(
            `${API_URL}/update_tender/${tender.tender_id}`,
            updatedTender
          );
        } catch (updateErr) {
          console.error(
            `Failed to update tender ${tender.tender_id} on backend:`,
            updateErr.message
          );
        }

        return updatedTender;
      })
    );

    setTenders(updatedTenders);
    return updatedTenders;
  };

  const fetchTenders = async () => {
    try {
      const response = await axios.get(`${API_URL}/find`, { timeout: 5000 });
      const fetchedTenders = response.data;
      const updatedTenders = await updateTenderStatus(fetchedTenders);
      setTenders(updatedTenders);
    } catch (error) {
      console.error("Error fetching tenders:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      const users = response.data.map((user) => ({
        ...user,
        categories: user.categories.map((category) => category.category_id),
      }));
      setUsers(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleLogin = async (email, password, id) => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      const users = response.data;

      if (!users || users.length === 0) {
        console.error("No users found in the database.");
        throw new Error("No users found. Please contact support.");
      }

      let user = users.find(
        (u) =>
          (u.email === email || u.user_id === id) && u.password === password
      );

      if (!user) {
        console.error(
          `Login failed for email: ${email}, user ID: ${id}. Invalid credentials.`
        );
        throw new Error(
          "Invalid email, user ID, or password. Please try again."
        );
      }

      if (user.user_type === "City") {
        setIsCity(true);
        setIsCompany(false);
        setIsCitizen(false);
      } else if (user.user_type === "Company") {
        setIsCity(false);
        setIsCompany(true);
        setIsCitizen(false);
      } else if (user.user_type === "Citizen") {
        setIsCitizen(true);
        setIsCity(false);
        setIsCompany(false);
      } else {
        throw new Error("Invalid user type.");
      }

      localStorage.setItem("user", JSON.stringify(user));

      setUser({
        _id: user._id,
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        address: user.address,
        user_type: user.user_type,
        password: user.password,
        lock: user.lock || false,
        categories: user.categories || [],
        tenders: user.tenders || [],
        bids: user.bids || [],
        __v: user.__v || 0,
      });

      return true;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please try again."
      );
    }
  };

  const handleLogout = () => {
    setIsCompany(false);
    setIsCity(false);
    setIsCitizen(false);
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <Router>
      <div className="app">
        <Navbar
          isAuthenticated={isCompany || isCity || isCitizen}
          handleLogout={handleLogout}
          userType={user?.user_type}
        />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route
            path="/"
            element={
              isCompany ? (
                <>
                  <CompanyPage user={user} />
                </>
              ) : isCity ? (
                <CityPage user={user} />
              ) : isCitizen ? (
                <CitizenPage user={user} />
              ) : (
                <Navigate to="/login" />
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
              isCompany || isCity || isCitizen ? (
                <Navigate to="/" />
              ) : (
                <Login handleLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/list"
            element={
              isCompany || isCity || isCitizen ? (
                <TenderList
                  tenders={tenders}
                  isCity={isCity}
                  isCompany={isCompany}
                />
              ) : (
                <Login handleLogin={handleLogin} />
              )
            }
          />

          <Route path="/create-user" element={<CreateUser />} />

          <Route
            path="/create-tender"
            element={
              isCity ? (
                <CreateTender
                  setTenders={setTenders}
                  fetchTenders={fetchTenders}
                  user_id={user?.user_id}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/update-tender/:id"
            element={
              isCity ? (
                <UpdateTender
                  tenders={tenders}
                  fetchTenders={fetchTenders}
                  user_id={user?.user_id}
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
                  isCity={isCity}
                />
              </ConfirmProvider>
            }
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

          <Route
            path="/citizen/feedback"
            element={
              isCitizen ? (
                <CitizenFeedback user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/citizen/view-feedback"
            element={
              isCitizen ? (
                <ViewFeedback user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/citizen/open-tenders"
            element={
              isCitizen ? (
                <OpenTenders tenders={tenders} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/citizen/closed-tenders"
            element={
              isCitizen ? (
                <ClosedTenders tenders={tenders} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/citizen/tender-details/:id"
            element={isCitizen ? <TenderDetails /> : <Navigate to="/login" />}
          />
          <Route
            path="/city/dashboard"
            element={
              isCity ? <CityPage user={user} /> : <Navigate to="/login" />
            }
          />
          <Route path="/choice-dashboard" element={<ChoiceDashboard />} />
          <Route
            path="/manage-user-categories"
            element={
              isCity ? <ManageUserCategories /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/manage-categories"
            element={isCity ? <ManageCategories /> : <Navigate to="/login" />}
          />
          <Route
            path="/manage-users"
            element={isCity ? <ManageUsers /> : <Navigate to="/login" />}
          />
          <Route
            path="/view-all-tenders"
            element={
              isCity ? (
                <ViewAllTenders
                  tenders={tenders}
                  updateTenderStatus={updateTenderStatus}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/submit-application" element={<CompanyApplication />} />
          <Route
            path="/create-admin"
            element={isCity ? <CreateAdmin /> : <Navigate to="/login" />}
          />
          <Route
            path="/view-feedbacks"
            element={isCity ? <ViewFeedbacks /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
export { App };
