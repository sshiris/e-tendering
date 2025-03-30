import React, { useState } from "react";
import axios from "axios";
import "./CreateCityAdmin.css";

export default function CreateCityAdmin() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    password: "",
    email: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const API_URL = "http://localhost:5500";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Check if email already exists
      const emailCheckResponse = await axios.get(`${API_URL}/users?email=${formData.email}`);
      if (emailCheckResponse.data.exists) {
        setError("This email is already registered. Please use a different email.");
        return;
      }

      // Create the City admin
      const response = await axios.post(`${API_URL}/create_user`, {
        ...formData,
        user_type: "City", // Fixed user_type for City admin
      });

      setSuccess("City admin created successfully!");
      setFormData({ name: "", address: "", password: "", email: "" });
      console.log("City admin created:", response.data);
    } catch (err) {
      console.error("Error creating City admin:", err.response?.data || err.message);
      setError("Failed to create City admin. Please try again.");
    }
  };

  return (
    <div className="create-city-admin">
      <h2>Create City Admin</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Create City Admin</button>
      </form>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
}
