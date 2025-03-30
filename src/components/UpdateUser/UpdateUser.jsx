import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UpdateUser.css";

export default function UpdateUser({ initialData, onCancel, onSuccess, isCityUser = false }) {
  const API_URL = "http://localhost:5500";

  const [updatedUser, setUpdatedUser] = useState({
    ...initialData,
    user_type: isCityUser ? "City" : initialData.user_type,
  });
  const [error, setError] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableUserTypes, setAvailableUserTypes] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);

  useEffect(() => {
    const fetchCategoriesAndUserTypes = async () => {
      try {
        const categoriesResponse = await axios.get(`${API_URL}/categories`);
        const categories = categoriesResponse.data;

        const validCategories = categories.map((category) => ({
          category_id: category.category_id,
          category_name: category.category_name,
          user_type: category.user_type || "Company",
        }));

        setAvailableCategories(validCategories);

        const userTypesResponse = await axios.get(`${API_URL}/user_types`);
        setAvailableUserTypes(userTypesResponse.data.filter((type) => type.type_name !== "City"));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCategoriesAndUserTypes();
  }, []);

  useEffect(() => {
    if (updatedUser.user_type) {
      const relevantCategories = availableCategories.filter(
        (category) => category.user_type === updatedUser.user_type
      );
      setFilteredCategories(relevantCategories);
    } else {
      setFilteredCategories([]);
    }
  }, [updatedUser.user_type, availableCategories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);

      // Validate required fields
      if (!updatedUser.name || !updatedUser.email || !updatedUser.password) {
        setError("Name, Email, and Password are required.");
        return;
      }

      // Ensure user type is "City" if isCityUser is true
      if (isCityUser) {
        updatedUser.user_type = "City";
      }

      console.log("Submitting form with data:", updatedUser);

      // Prepare payload for the server
      const payload = {
        user_id: updatedUser.user_id, // Ensure user_id is included
        name: updatedUser.name,
        address: updatedUser.address,
        user_type: updatedUser.user_type,
        password: updatedUser.password,
        email: updatedUser.email,
        categories: updatedUser.categories || [],
      };

      // Update user details
      const response = await axios.put(`${API_URL}/update_user/${updatedUser.user_id}`, payload);
      console.log("User updated successfully:", response.data);

      onSuccess(response.data.updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      setError(error.response?.data?.message || "Failed to update user");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setUpdatedUser((prev) => ({ ...prev, categories: selectedOptions }));
  };

  return (
    <div className="update-user">
      <h3>{isCityUser ? "Create City User" : "Update User"}</h3>
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
            autoComplete="name"
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
            autoComplete="email"
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
            autoComplete="new-password"
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
            autoComplete="street-address"
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
            disabled={isCityUser} // Disable dropdown if creating a City user
          >
            <option value="" disabled>Select user type</option>
            {availableUserTypes.map((type) => (
              <option key={type.type_id} value={type.type_name}>
                {type.type_name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="categories">Categories</label>
          {updatedUser.user_type === "Company" ? (
            <select
              id="categories"
              name="categories"
              multiple
              value={updatedUser.categories || []}
              onChange={handleCategoryChange}
              className="categories-dropdown"
            >
              {filteredCategories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          ) : (
            <p>Please select "Company" as the user type to choose categories.</p>
          )}
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {isCityUser ? "Create City User" : "Update User"}
          </button>
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}