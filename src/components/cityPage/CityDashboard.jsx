import React, { useState, useEffect } from "react";
import axios from "axios";
import EditComponent from "./EditComponent";
import CreateTender from "../CreateTender/CreateTender";
import CreateUser from "../CreateUser/CreateUser";
import UpdateUser from "../UpdateUser/UpdateUser"; // Import UpdateUser component
import CategoryDashboard from "./CategoryDashboard"; // Import CategoryDashboard
import CreateCityUser from "./CreateCityUser"; // Ensure CreateCityUser is imported
import EditUser from "./EditUser"; // Import the new EditUser component
import "./CityDashboard.css";

export default function CityDashboard() {
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
  const API_URL = "http://localhost:5500";

  useEffect(() => {
    fetchTenders();
    fetchUsers();
    fetchCategories();
  }, []);

  const fetchTenders = async () => {
    try {
      const response = await axios.get(`${API_URL}/find`);
      setTenders(response.data);
    } catch (error) {
      console.error("Error fetching tenders:", error);
    }
  };

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

  const handleDelete = async (tenderId) => {
    try {
      await axios.delete(`${API_URL}/delete_tender/${tenderId}`);
      setTenders((prev) => prev.filter((tender) => tender.tender_id !== tenderId));
    } catch (error) {
      console.error("Error deleting tender:", error);
    }
  };

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

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setIsCreating(true);
  };

  const handleEditUser = (user) => {
    setEditingUserData(user); // Set the user data to be edited
    setIsEditingUser(true); // Open the UpdateUser form
  };

  const handleCancelEditUser = () => {
    setIsEditingUser(false); // Close the UpdateUser form
    setEditingUserData(null); // Clear the editing user data
  };

  const handleUpdateUser = async (updatedUser) => {
    try {
      const response = await axios.put(`${API_URL}/update_user/${updatedUser.user_id}`, updatedUser);
      setUsers((prev) =>
        prev.map((user) =>
          user.user_id === updatedUser.user_id ? response.data.updatedUser : user
        )
      ); // Update the users list
      setIsEditingUser(false); // Close the form
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${API_URL}/delete_user/${userId}`);
      setUsers((prev) => prev.filter((user) => user.user_id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleCreateCityUser = () => {
    setIsCreatingUser(true); // Open the CreateUser form
  };

  const handleCancelCreateUser = () => {
    setIsCreatingUser(false); // Close the CreateUser form
  };

  return (
    <div className="city-dashboard">
      <h1>City Dashboard</h1>

      {/* Tenders Section */}
      <section>
        <h2>Manage Tenders</h2>
        <button onClick={handleCreate} className="create-btn">
          Create Tender
        </button>
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
                  <button onClick={() => handleEdit(tender)}>Update</button>
                  <button onClick={() => handleDelete(tender.tender_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Users Section */}
      <section>
        <h2>Manage Users</h2>
        <button onClick={handleCreateCityUser} className="create-btn">
          Create City User
        </button>
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
              <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => handleEditUser(user)}>Edit</button>
                  <button onClick={() => handleDeleteUser(user.user_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      {isCreatingUser && (
        <CreateCityUser
          onCancel={handleCancelCreateUser}
          onSuccess={(newUser) => {
            setUsers((prev) => [...prev, { ...newUser, user_type: "City" }]); // Ensure user_type is "City"
            setIsCreatingUser(false);
          }}
        />
      )}
      {isEditingUser && (
        <EditUser
          initialData={editingUserData} // Pass the user data to be edited
          onCancel={handleCancelEditUser} // Pass cancel handler
          onSuccess={handleUpdateUser} // Pass success handler
        />
      )}

      {/* Categories Section */}
      <section>
        
        <CategoryDashboard />
      </section>

      {/* Edit Form */}
      {isEditing && (
        <EditComponent
          data={editData}
          fields={editFields}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {/* Create Tender Form */}
      {isCreating && (
        <CreateTender
          setTenders={setTenders}
          fetchTenders={fetchTenders}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
