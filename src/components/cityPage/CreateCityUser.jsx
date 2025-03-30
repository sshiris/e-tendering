import React, { useState } from "react";
import axios from "axios";
import "./CreateCityUser.css";

export default function CreateCityUser({ onCancel, onSuccess }) {
  const API_URL = "http://localhost:5500";

  const [newUser, setNewUser] = useState({
    name: "",
    address: "",
    password: "",
    email: "",
    user_type: "City", // Always set user_type to "City"
  });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);

      // Prepare payload
      const payload = { ...newUser };

      // Send request to create the user
      const response = await axios.post(`${API_URL}/create_user`, payload);
      onSuccess(response.data.user); // Pass the created user to the parent component
    } catch (error) {
      console.error("Error creating City User:", error);
      setError(error.response?.data?.message || "Failed to create City User");
    }
  };

  return (
    <div className="create-city-user">
      <h3>Create City User</h3>
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
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleInputChange}
            placeholder="Enter email"
            required
          />
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
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Create User
          </button>
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
