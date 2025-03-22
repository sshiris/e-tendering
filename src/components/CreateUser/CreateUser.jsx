import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories`);
        setAvailableCategories(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const determineUserType = (email) => {
    if (!email) return "Guest";
    const domain = email.split("@")[1]?.toLowerCase();
    if (domain === "vaasa.fi") return "Admin";
    if (domain?.startsWith("edu.") && domain.endsWith(".fi")) return "Company";
    return "Guest";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const userData = {
      ...newUser,
      user_id: newUser.email,
      categories: newUser.categories,
    };

    try {
      const response = await axios.post(`${API_URL}/create_user`, userData);
      console.log("User created successfully:", response.data);

      if (newUser.categories.length > 0) {
        await axios.post(`${API_URL}/categories/update-users`, {
          userId: response.data._id,
          categoryIds: newUser.categories,
        });
      }

      navigate("/users");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create user");
      console.error("Error creating user:", err);
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
    setNewUser((prev) => {
      const categories = prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId];
      return { ...prev, categories };
    });
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
        <div className="form-group">
          <label>Categories (Optional)</label>
          <div className="category-checkboxes">
            {availableCategories.map((category) => (
              <label key={category._id} className="category-checkbox">
                <input
                  type="checkbox"
                  value={category._id}
                  checked={newUser.categories.includes(category._id)}
                  onChange={() => handleCategoryChange(category._id)}
                />
                {category.category_name}
              </label>
            ))}
          </div>
          {newUser.categories.length === 0 && (
            <span className="no-categories">No categories selected</span>
          )}
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Create User
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/users")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
