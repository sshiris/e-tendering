import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ManageCategories() {
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
    setNewCategory({ category_name: e.target.value });
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
      await axios.delete(`${API_URL}/delete_category/${categoryId}`);
      setCategories((prev) =>
        prev.filter((category) => category.category_id !== categoryId)
      );
    } catch (error) {
      console.error(
        "Error deleting category:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Manage Categories
      </h2>

      {error && (
        <p className="text-red-500 text-sm bg-red-100 p-2 rounded mb-4">
          {error}
        </p>
      )}

      {/* Add Category Form */}
      <form onSubmit={handleAddCategory} className="mb-6 flex gap-4">
        <input
          type="text"
          name="category_name"
          value={newCategory.category_name}
          onChange={handleInputChange}
          placeholder="Enter category name"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add Category
        </button>
      </form>

      {/* Categories Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 shadow-md rounded-lg">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Category ID</th>
              <th className="px-4 py-2 text-left">Category Name</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr
                key={category.category_id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-2">{category.category_id}</td>
                <td className="px-4 py-2">{category.category_name}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => handleDeleteCategory(category.category_id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
