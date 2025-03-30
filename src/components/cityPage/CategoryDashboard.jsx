import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CategoryDashboard.css";

export default function CategoryDashboard() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ category_name: "" });
  const [error, setError] = useState(null);
  const API_URL = "http://localhost:5500";

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const categoryData = {
        category_id: "CAT-" + Date.now(),
        category_name: newCategory.category_name,
      };
      await axios.post(`${API_URL}/create_category`, categoryData);
      setNewCategory({ category_name: "" });
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
      setError("Failed to add category. Please try again.");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      console.log("Deleting category with ID:", categoryId); // Debugging log
      await axios.delete(`${API_URL}/delete_category/${categoryId}`);
      setCategories((prev) => prev.filter((category) => category.category_id !== categoryId));
      console.log("Category deleted successfully."); // Debugging log
    } catch (error) {
      console.error("Error deleting category:", error.response?.data || error.message);
    }
  };

  return (
    <div className="category-dashboard">
      <h2>Manage Categories</h2>
      {error && <p className="error-message">{error}</p>}
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
        <button type="submit" className="submit-btn">Add Category</button>
      </form>
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
                <button onClick={() => handleDeleteCategory(category.category_id)} className="delete-btn">
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
