import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ManageUserCategories() {
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [validSelection, setValidSelection] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const API_URL = "http://localhost:5500";

  useEffect(() => {
    fetchUsers();
    fetchCategories();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddUserToCategory = async (e) => {
    e.preventDefault();

    if (!selectedUser || !selectedCategory) {
      setValidSelection(false);
      setErrorMessage("Please select both a user and a category.");
      return;
    }

    try {
      console.log(selectedCategory);
      const response = await axios.post(`${API_URL}/add_user_to_category`, {
        user_id: selectedUser,
        category_id: selectedCategory,
      });

      alert(response.data.message);
      fetchUsers();
      setValidSelection(true);
      setErrorMessage("");
    } catch (error) {
      console.error("Error adding user to category:", error);
    }
  };

  const handleRemoveUserFromCategory = async (e) => {
    e.preventDefault();

    // Ensure both user and category are selected
    if (!selectedUser || !selectedCategory) {
      setValidSelection(false);
      setErrorMessage("Please select both a user and a category.");
      return;
    }

    try {
      // Send the correct IDs for user and category
      const response = await axios.post(
        `${API_URL}/remove_user_from_category`,
        {
          user_id: selectedUser, // Sending the user_id (ID of the selected user)
          category_id: selectedCategory, // Sending the category_id (ID of the selected category)
        }
      );

      alert(response.data.message);
      fetchUsers(); // Refresh the user list after updating
      setValidSelection(true); // Reset validation
      setErrorMessage(""); // Clear the error message
    } catch (error) {
      console.error("Error removing user from category:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Manage User-Category Relationships
      </h2>

      {/* Add User to Category Form */}
      <form onSubmit={handleAddUserToCategory} className="mb-4 flex gap-4">
        <select
          className="p-2 border border-gray-300 rounded-md"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          required
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user.user_id} value={user.user_id}>
              {user.name}
            </option>
          ))}
        </select>

        <select
          className="p-2 border border-gray-300 rounded-md"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.category_id} value={category.category_id}>
              {category.category_name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Add
        </button>
      </form>

      <form onSubmit={handleRemoveUserFromCategory} className="mb-6 flex gap-4">
        <select
          className="p-2 border border-gray-300 rounded-md"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          required
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user.user_id} value={user.user_id}>
              {user.name}
            </option>
          ))}
        </select>

        <select
          className="p-2 border border-gray-300 rounded-md"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.category_id} value={category.category_id}>
              {category.category_name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          Remove
        </button>
      </form>

      {!validSelection && (
        <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
      )}

      <h3 className="text-lg font-semibold text-gray-700 mt-6">
        User-Category Relationships
      </h3>
      <table className="w-full border border-gray-200 shadow-md rounded-lg mt-2">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2">User Name</th>
            <th className="px-4 py-2">Category Name</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) =>
            user.categories?.map((categoryId) => {
              const category = categories.find(
                (c) => c.category_id === categoryId
              );
              return (
                <tr
                  key={`${user.user_id}-${categoryId}`}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">
                    {category?.category_name || "Unknown Category"}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
