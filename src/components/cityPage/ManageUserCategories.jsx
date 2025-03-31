/**
 * ManageUserCategories Component
 * Enables management of user-category relationships, including adding and removing users from categories.
 * Fetches user and category data from the backend and provides feedback for operations.
 */

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ManageUserCategories() {
  // State variables
  const [users, setUsers] = useState([]); // List of users
  const [categories, setCategories] = useState([]); // List of categories
  const [selectedUserAdd, setSelectedUserAdd] = useState(""); // Selected user for adding to category
  const [selectedCategoryAdd, setSelectedCategoryAdd] = useState(""); // Selected category for adding a user
  const [selectedUserRemove, setSelectedUserRemove] = useState(""); // Selected user for removing from category
  const [selectedCategoryRemove, setSelectedCategoryRemove] = useState(""); // Selected category for removing a user
  const [validSelectionAdd, setValidSelectionAdd] = useState(true); // Validation for adding operation
  const [validSelectionRemove, setValidSelectionRemove] = useState(true); // Validation for removing operation
  const [errorMessageAdd, setErrorMessageAdd] = useState(""); // Error message for adding operation
  const [errorMessageRemove, setErrorMessageRemove] = useState(""); // Error message for removing operation
  const [successMessageAdd, setSuccessMessageAdd] = useState(""); // Success message for adding operation
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // General error state

  const API_URL = "http://localhost:5500"; // Backend API URL

  // Fetch data when the component is mounted
  useEffect(() => {
    fetchData();
  }, []);

  /**
   * Fetches users and categories data from the backend.
   */
  const fetchData = async () => {
    setLoading(true); // Set loading state
    try {
      // Make parallel API calls to fetch users and categories
      const [usersResponse, categoriesResponse] = await Promise.all([
        axios.get(`${API_URL}/users`),
        axios.get(`${API_URL}/categories`),
      ]);

      console.log("Users data:", usersResponse.data); // Debug log
      console.log("Categories data:", categoriesResponse.data); // Debug log

      setUsers(usersResponse.data);
      setCategories(categoriesResponse.data);
      setError(null); // Clear any existing errors
    } catch (error) {
      console.error("Error fetching data:", error); // Log error
      setError("Failed to load users and categories. Please try again."); // Set error message
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  /**
   * Handles adding a user to a category.
   * @param {Object} e - Event object
   */
  const handleAddUserToCategory = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validate selections
    if (!selectedUserAdd || !selectedCategoryAdd) {
      setValidSelectionAdd(false);
      setErrorMessageAdd("Please select both a user and a category.");
      setSuccessMessageAdd(""); // Clear success message
      return;
    }

    try {
      const payload = { user_id: selectedUserAdd, category_id: selectedCategoryAdd };
      console.log("Adding user to category with payload:", payload); // Debug log

      const response = await axios.post(`${API_URL}/add_user_to_specific_category`, payload);
      console.log("Add response:", response.data); // Debug log

      // Display success message and reset form
      setSuccessMessageAdd(response.data.message || "User added to category successfully!");
      setErrorMessageAdd("");
      setValidSelectionAdd(true);
      await fetchData(); // Refresh user and category data
      setSelectedUserAdd("");
      setSelectedCategoryAdd("");
    } catch (error) {
      console.error("Error adding user to category:", error); // Log error
      setErrorMessageAdd(
        error.response?.data?.message || "Failed to add user to category. Please try again."
      );
      setSuccessMessageAdd(""); // Clear success message
      setValidSelectionAdd(false);
    }
  };

  /**
   * Handles removing a user from a category.
   * @param {Object} e - Event object
   */
  const handleRemoveUserFromCategory = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validate selections
    if (!selectedUserRemove || !selectedCategoryRemove) {
      setValidSelectionRemove(false);
      setErrorMessageRemove("Please select both a user and a category.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/remove_user_from_category`, {
        user_id: selectedUserRemove,
        category_id: selectedCategoryRemove,
      });

      alert(response.data.message); // Show success alert
      await fetchData(); // Refresh user and category data
      setSelectedUserRemove("");
      setSelectedCategoryRemove("");
      setValidSelectionRemove(true);
      setErrorMessageRemove("");
    } catch (error) {
      console.error("Error removing user from category:", error); // Log error
      setErrorMessageRemove(
        error.response?.data?.message || "Failed to remove user from category. Please try again."
      );
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <div
          className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"
          role="status"
          aria-label="Loading data"
        ></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"
        role="alert"
      >
        <svg
          className="h-5 w-5 text-red-500"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  // Process user-category relationships
  const userCategoryRelationships = users
    .filter((user) => Array.isArray(user.categories) && user.categories.length >= 2)
    .flatMap((user) =>
      user.categories.map((categoryId) => ({
        user_id: user.user_id,
        user_name: user.name,
        category_id:
          typeof categoryId === "string"
            ? categoryId
            : categoryId?.category_id || "unknown",
        category_name:
          categories.find((c) => c.category_id === categoryId)?.category_name || "Unknown Category",
      }))
    );
    return ( <div className="container mx-auto px-6 py-8 bg-gray-50 min-h-screen"> <div className="bg-white rounded-xl shadow-md p-6"> <h2 className="text-2xl font-semibold text-gray-900 mb-6"> Manage User-Category Relationships </h2> {/* Add User to Category Form */} <div className="mb-8"> <h3 className="text-lg font-semibold text-gray-700 mb-4"> Add User to Category </h3> <form onSubmit={handleAddUserToCategory} className="flex gap-4"> <select className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" value={selectedUserAdd} onChange={(e) => { setSelectedUserAdd(e.target.value); setValidSelectionAdd(true); setErrorMessageAdd(""); setSuccessMessageAdd(""); }} required aria-label="Select User to Add" > <option value="" disabled> Select User to Add </option> {users.map((user) => ( <option key={user.user_id} value={user.user_id}> {user.name} </option> ))} </select> <select className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" value={selectedCategoryAdd} onChange={(e) => { setSelectedCategoryAdd(e.target.value); setValidSelectionAdd(true); setErrorMessageAdd(""); setSuccessMessageAdd(""); }} required aria-label="Select Category to Add" > <option value="" disabled> Select Category to Add </option> {categories.map((category) => ( <option key={category.category_id} value={category.category_id}> {category.category_name} </option> ))} </select> <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition duration-200" > Add </button> </form> {!validSelectionAdd && ( <div className="text-red-500 text-sm mt-2">{errorMessageAdd}</div> )} {successMessageAdd && ( <div className="text-green-500 text-sm mt-2"> {successMessageAdd} </div> )} </div> {/* Remove User from Category Form */} <div className="mb-8"> <h3 className="text-lg font-semibold text-gray-700 mb-4"> Remove User from Category </h3> <form onSubmit={handleRemoveUserFromCategory} className="flex gap-4"> <select className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" value={selectedUserRemove} onChange={(e) => { setSelectedUserRemove(e.target.value); setValidSelectionRemove(true); setErrorMessageRemove(""); }} required aria-label="Select User to Remove" > <option value="" disabled> Select User to Remove </option> {users.map((user) => ( <option key={user.user_id} value={user.user_id}> {user.name} </option> ))} </select> <select className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" value={selectedCategoryRemove} onChange={(e) => { setSelectedCategoryRemove(e.target.value); setValidSelectionRemove(true); setErrorMessageRemove(""); }} required aria-label="Select Category to Remove" > <option value="" disabled> Select Category to Remove </option> {categories.map((category) => ( <option key={category.category_id} value={category.category_id}> {category.category_name} </option> ))} </select> <button type="submit" className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 transition duration-200" > Remove </button> </form> {!validSelectionRemove && ( <div className="text-red-500 text-sm mt-2"> {errorMessageRemove} </div> )} </div> <h3 className="text-lg font-semibold text-gray-700 mt-6"> User-Category Relationships </h3> {userCategoryRelationships.length === 0 ? ( <div className="text-center py-6"> <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" > <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" /> </svg> <p className="mt-2 text-gray-600"> No users with two or more category relationships found. </p> </div> ) : ( <div className="overflow-x-auto"> <table className="w-full bg-white rounded-lg"> <thead className="bg-gray-100 text-gray-700"> <tr> <th className="px-6 py-3 text-left">User Name</th> <th className="px-6 py-3 text-left">Category Name</th> </tr> </thead> <tbody> {userCategoryRelationships.map((relationship) => ( <tr key={`${relationship.user_id}-${relationship.category_id}`} className="border-b border-gray-200 hover:bg-gray-50" > <td className="px-6 py-4">{relationship.user_name}</td> <td className="px-6 py-4">{relationship.category_name}</td> </tr> ))} </tbody> </table> </div> )} </div> </div> );
  }
   
    