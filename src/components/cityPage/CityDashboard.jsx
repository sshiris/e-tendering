/**
 * CityDashboard Component
 * Acts as the central hub for managing tenders, users, categories, and city-related operations.
 * Includes CRUD operations for tenders and users, as well as integration of various related components.
 */

import React, { useState, useEffect } from "react";
import axios from "axios";
import EditComponent from "./EditComponent";
import CreateTender from "../CreateTender/CreateTender";
import CreateUser from "../CreateUser/CreateUser";
import UpdateUser from "../UpdateUser/UpdateUser"; 
import CategoryDashboard from "./CategoryDashboard"; 
import CreateCityUser from "./CreateCityUser"; 
import EditUser from "./EditUser"; 
import ChoiceDashboard from "./ChoiceDashboard"; 
import "./CityDashboard.css";

export default function CityDashboard() {
  // State variables to manage tenders, users, categories, and their modals/forms.
  const [tenders, setTenders] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editFields, setEditFields] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editingUserData, setEditingUserData] = useState(null);

  // API base URL for server communication.
  const API_URL = "http://localhost:5500";

  // Effect hook to fetch initial data on component mount.
  useEffect(() => {
    fetchTenders();
    fetchUsers();
    fetchCategories();
  }, []);

  /**
   * Fetches tenders from the server and updates the state.
   */
  const fetchTenders = async () => {
    try {
      const response = await axios.get(`${API_URL}/find`);
      setTenders(response.data);
    } catch (error) {
      console.error("Error fetching tenders:", error);
    }
  };

  /**
   * Fetches users from the server and updates the state.
   */
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  /**
   * Fetches categories from the server and updates the state.
   */
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  /**
   * Deletes a tender by ID and updates the state.
   * @param {string} tenderId - The ID of the tender to delete.
   */
  const handleDelete = async (tenderId) => {
    try {
      await axios.delete(`${API_URL}/delete_tender/${tenderId}`);
      setTenders((prev) => prev.filter((tender) => tender.tender_id !== tenderId));
    } catch (error) {
      console.error("Error deleting tender:", error);
    }
  };

  /**
   * Opens the edit modal for a tender.
   * @param {Object} tender - The tender data to edit.
   */
  const handleEdit = (tender) => {
    setEditData(tender);
    setEditFields([
      { name: "tender_name", label: "Tender Name", type: "text", required: true },
      { name: "description", label: "Description", type: "text", required: true },
      { name: "construction_from", label: "Construction From", type: "date", required: true },
      { name: "construction_to", label: "Construction To", type: "date", required: true },
      { name: "date_of_tender_notice", label: "Notice Date", type: "datetime-local", required: true },
      { name: "date_of_tender_close", label: "Close Date", type: "datetime-local", required: true },
      { name: "bidding_price", label: "Bidding Price", type: "number", required: true },
      { name: "tender_status", label: "Status", type: "text", required: true },
    ]);
    setIsEditing(true);
  };

  /**
   * Saves updated tender data and updates the state.
   * @param {Object} updatedData - The updated tender data.
   */
  const handleSave = async (updatedData) => {
    try {
      if (updatedData.tender_id) {
        const response = await axios.put(`${API_URL}/update_tender/${updatedData.tender_id}`, updatedData);
        setTenders((prev) =>
          prev.map((tender) =>
            tender.tender_id === updatedData.tender_id ? response.data.updatedTender : tender
          )
        );
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating tender:", error);
    }
  };

  /**
   * Cancels editing or creating actions.
   */
  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
  };

  /**
   * Opens the form to create a new tender.
   */
  const handleCreate = () => {
    setIsCreating(true);
  };

  /**
   * Opens the edit modal for a user.
   * @param {Object} user - The user data to edit.
   */
  const handleEditUser = (user) => {
    setEditingUserData(user);
    setIsEditingUser(true);
  };

  /**
   * Cancels editing a user.
   */
  const handleCancelEditUser = () => {
    setIsEditingUser(false);
    setEditingUserData(null);
  };

  /**
   * Updates user data and refreshes the state.
   * @param {Object} updatedUser - The updated user data.
   */
  const handleUpdateUser = async (updatedUser) => {
    try {
      const response = await axios.put(`${API_URL}/update_user/${updatedUser.user_id}`, updatedUser);
      setUsers((prev) =>
        prev.map((user) =>
          user.user_id === updatedUser.user_id ? response.data.updatedUser : user
        )
      );
      setIsEditingUser(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  /**
   * Deletes a user by ID and updates the state.
   * @param {string} userId - The ID of the user to delete.
   */
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${API_URL}/delete_user/${userId}`);
      setUsers((prev) => prev.filter((user) => user.user_id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  /**
   * Opens the form to create a new city user.
   */
  const handleCreateCityUser = () => {
    setIsCreatingUser(true);
  };

  /**
   * Cancels the creation of a new city user.
   */
  const handleCancelCreateUser = () => {
    setIsCreatingUser(false);
  };
  return (
    // Main container for the city dashboard
    <div className="city-dashboard">
      {/* Dashboard title */}
      <h1>City Dashboard</h1>
  
      {/* Tenders Section */}
      <section>
        <h2>Manage Tenders</h2>
        {/* Button to create a new tender */}
        <button onClick={handleCreate} className="create-btn">
          Create Tender
        </button>
        {/* Table displaying list of tenders */}
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Construction From</th>
              <th>Construction To</th>
              <th>Notice Date</th>
              <th>Close Date</th>
              <th>Bidding Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenders.map((tender) => (
              // Render each tender in a table row
              <tr key={tender.tender_id}>
                <td>{tender.tender_id}</td>
                <td>{tender.tender_name}</td>
                <td>{tender.description}</td>
                <td>{new Date(tender.construction_from).toLocaleDateString()}</td>
                <td>{new Date(tender.construction_to).toLocaleDateString()}</td>
                <td>{new Date(tender.date_of_tender_notice).toLocaleString()}</td>
                <td>{new Date(tender.date_of_tender_close).toLocaleString()}</td>
                <td>{tender.bidding_price}</td>
                <td>{tender.tender_status}</td>
                <td>
                  {/* Action buttons for editing or deleting a tender */}
                  <button onClick={() => handleEdit(tender)}>Update</button>
                  <button onClick={() => handleDelete(tender.tender_id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
  
      {/* Users Section */}
      <section>
        <h2>Manage Users</h2>
        {/* Button to create a new city user */}
        <button onClick={handleCreateCityUser} className="create-btn">
          Create City User
        </button>
        {/* Table displaying list of users */}
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              // Render each user in a table row
              <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {/* Action buttons for editing or deleting a user */}
                  <button onClick={() => handleEditUser(user)}>Edit</button>
                  <button onClick={() => handleDeleteUser(user.user_id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
  
      {/* Create City User Form (conditionally rendered) */}
      {isCreatingUser && (
        <CreateCityUser
          onCancel={handleCancelCreateUser}
          onSuccess={(newUser) => {
            // Add the newly created user to the users list
            setUsers((prev) => [...prev, { ...newUser, user_type: "City" }]);
            setIsCreatingUser(false);
          }}
        />
      )}
  
      {/* Edit User Form (conditionally rendered) */}
      {isEditingUser && (
        <EditUser
          initialData={editingUserData} // User data to edit
          onCancel={handleCancelEditUser} // Cancel edit handler
          onSuccess={handleUpdateUser} // Save changes handler
        />
      )}
  
      {/* Categories Section */}
      <section>
        <CategoryDashboard />
      </section>
  
      {/* Choice Dashboard Section */}
      <section>
        <ChoiceDashboard />
      </section>
  
      {/* Edit Tender Form (conditionally rendered) */}
      {isEditing && (
        <EditComponent
          data={editData} // Tender data to edit
          fields={editFields} // Editable fields
          onSave={handleSave} // Save changes handler
          onCancel={handleCancel} // Cancel edit handler
        />
      )}
  
      {/* Create Tender Form (conditionally rendered) */}
      {isCreating && (
        <CreateTender
          setTenders={setTenders} // Update tenders state
          fetchTenders={fetchTenders} // Refresh tenders
          onCancel={handleCancel} // Cancel create handler
        />
      )}
    </div>
  );
}