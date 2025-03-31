/**
 * CategoryDashboard Component
 * Allows users to manage categories, including adding new categories, viewing existing ones, and deleting them.
 * Handles error states and fetches category data from the server.
 */

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CategoryDashboard.css";

export default function CategoryDashboard() {
  // State to hold the list of categories retrieved from the server.
  const [categories, setCategories] = useState([]);

  // State to hold the input value for adding a new category.
  const [newCategory, setNewCategory] = useState({ category_name: "" });

  // State to capture any error messages encountered during operations.
  const [error, setError] = useState(null);

  // Base URL for API endpoints.
  const API_URL = "http://localhost:5500";

  // Fetch the list of categories when the component mounts.
  useEffect(() => {
    fetchCategories();
  }, []);

  /**
   * Fetches categories from the server and updates the state.
   */
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data); // Populate categories state with API data.
    } catch (error) {
      console.error("Error fetching categories:", error); // Log the error for debugging.
    }
  };

  /**
   * Handles input changes for adding a new category.
   * Updates the state with the value entered by the user.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Submits the form to add a new category to the server.
   * Fetches updated categories after a successful addition.
   */
  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      setError(null); // Clear any previous errors.
      const categoryData = {
        category_id: "CAT-" + Date.now(), // Generate a unique category ID.
        category_name: newCategory.category_name,
      };
      await axios.post(`${API_URL}/create_category`, categoryData); // Post category data to the server.
      setNewCategory({ category_name: "" }); // Reset form input.
      fetchCategories(); // Refresh the category list.
    } catch (error) {
      console.error("Error adding category:", error); // Log the error for debugging.
      setError("Failed to add category. Please try again."); // Update error state.
    }
  };

  /**
   * Deletes a category from the server based on the category ID.
   * Updates the state to reflect the deletion.
   */
  const handleDeleteCategory = async (categoryId) => {
    try {
      console.log("Deleting category with ID:", categoryId); // Debugging log.
      await axios.delete(`${API_URL}/delete_category/${categoryId}`); // Make DELETE request to server.
      setCategories((prev) =>
        prev.filter((category) => category.category_id !== categoryId)
      ); // Remove deleted category from state.
      console.log("Category deleted successfully."); // Debugging log.
    } catch (error) {
      console.error("Error deleting category:", error.response?.data || error.message); // Log the error for debugging.
    }
  };

  return (
    // Main container for the dashboard interface.
    <div className="category-dashboard">
      {/* Page title */}
      <h2>Manage Categories</h2>

      {/* Display error messages, if any */}
      {error && <p className="error-message">{error}</p>}

      {/* Form to add a new category */}
      <form onSubmit={handleAddCategory}>
        <div className="form-group">
          <label htmlFor="category_name">Category Name</label>
          <input
            id="category_name"
            type="text"
            name="category_name"
            value={newCategory.category_name}
            onChange={handleInputChange}
            placeholder="Enter category name"
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          Add Category
        </button>
      </form>

      {/* Table to display existing categories */}
      <table>
        <thead>
          <tr>
            <th>Category ID</th>
            <th>Category Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.category_id}>
              <td>{category.category_id}</td>
              <td>{category.category_name}</td>
              <td>
                <button
                  onClick={() => handleDeleteCategory(category.category_id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
