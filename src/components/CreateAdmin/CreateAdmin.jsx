import React, { useState } from "react";
import axios from "axios";

const CreateAdmin = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5500/create_admin", formData);
      alert("Administrator created successfully!");
      setFormData({ name: "", email: "", password: "", address: "" });
    } catch (error) {
      console.error("Error creating administrator:", error.response?.data || error.message);
      alert("Failed to create administrator. Please try again.");
    }
  };

  return (
    <div className="create-admin">
      <h2>Create Administrator</h2>
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
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
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
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Create Admin</button>
      </form>
    </div>
  );
};

export default CreateAdmin;
