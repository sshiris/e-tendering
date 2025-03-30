import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EditUser.css";

export default function EditUser({ initialData, onCancel, onSuccess }) {
  const API_URL = "http://localhost:5500";

  const [updatedUser, setUpdatedUser] = useState({ ...initialData });
  const [error, setError] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories`);
        setAvailableCategories(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (updatedUser.user_type === "Company") {
      setFilteredCategories(availableCategories);
    } else {
      setFilteredCategories([]);
    }
  }, [updatedUser.user_type, availableCategories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setUpdatedUser((prev) => ({ ...prev, categories: selectedOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);

      const response = await axios.put(`${API_URL}/update_user/${updatedUser.user_id}`, updatedUser);
      onSuccess(response.data.updatedUser);
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err.response?.data?.message || "Failed to update user");
    }
  };

  return (
    <div className="edit-user">
      <h3>Edit User</h3>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={updatedUser.name || ""}
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
            value={updatedUser.email || ""}
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
            value={updatedUser.password || ""}
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
            value={updatedUser.address || ""}
            onChange={handleInputChange}
            placeholder="Enter address"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="user_type">User Type</label>
          <select
            id="user_type"
            name="user_type"
            value={updatedUser.user_type || ""}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>Select user type</option>
            <option value="Company">Company</option>
            <option value="City">City</option>
            <option value="Citizen">Citizen</option>
          </select>
        </div>
        {updatedUser.user_type === "Company" && (
          <div className="form-group">
            <label htmlFor="categories">Categories</label>
            <select
              id="categories"
              name="categories"
              multiple
              value={updatedUser.categories || []}
              onChange={handleCategoryChange}
            >
              {filteredCategories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="form-actions">
          <button type="submit" className="submit-btn">Save Changes</button>
          <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
