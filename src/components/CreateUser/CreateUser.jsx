import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import "./CreateUser.css";

export default function CreateUser() {
  const API_URL = "http://localhost:5500";
  const navigate = useNavigate();

  const [newUser, setNewUser] = useState({
    name: "",
    address: "",
    user_type: "Guest",
    password: "",
    email: "",
    categories: [],
  });

  const [error, setError] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [userId, setUserId] = useState(null);

  const determineUserType = (email) => {
    if (!email) return "Guest";
    const domain = email.split("@")[1]?.toLowerCase();
    if (domain === "vaasa.fi") return "City";
    if (domain?.startsWith("edu.") && domain.endsWith(".fi")) return "Company";
    return "Guest";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/create_user`, newUser);
      const userListResponse = await axios.get(`${API_URL}/users`);
      const userList = userListResponse.data;
      const matchedUser = userList.find((user) => user.email === newUser.email);
      setUserId(matchedUser ? matchedUser.user_id : "unknown");
      setOpenDialog(true);
      console.log("User added successfully:", response.data);
    } catch (error) {
      console.error("Error adding user:", error);
      setError(error.response?.data?.message || "Failed to add user");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => {
      const updatedUser = { ...prev, [name]: value };
      if (name === "email") {
        updatedUser.user_type = determineUserType(value);
      }
      return updatedUser;
    });
  };

  const handleCategoryChange = (categoryId) => {
    console.log("H2llo");
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    navigate("/login");
  };

  return (
    <div className="create-user">
      <h3>Create New User</h3>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={newUser.name}
            onChange={handleInputChange}
            placeholder="Enter full name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email (User ID)</label>
          <input
            id="email"
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleInputChange}
            placeholder="Enter email"
            required
          />
          <span className="email-note">
            City staff: @vaasa.fi | Companies: @edu.<strong>companyname</strong>
            .fi
          </span>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={newUser.password}
            onChange={handleInputChange}
            placeholder="Enter password"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            id="address"
            type="text"
            name="address"
            value={newUser.address}
            onChange={handleInputChange}
            placeholder="Enter address"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="user_type">User Type</label>
          <input
            id="user_type"
            name="user_type"
            value={newUser.user_type}
            disabled
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Create User
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/login")}
          >
            Cancel
          </button>
        </div>
      </form>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>User Created</DialogTitle>
        <DialogContent>
          <p>
            User created successfully! You can use your ID to login:{" "}
            <strong>{userId}</strong>
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
