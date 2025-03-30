import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPage.css";

const AdminPage = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newUser, setNewUser] = useState({
    name: "",
    address: "",
    user_type: "",
    password: "",
    email: "",
  });
  const API_URL = "http://localhost:5500";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch users.");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const generateUserID = () => {
    return "USR-" + Date.now();
  };

  const saveUser = async (e) => {
    e.preventDefault();
    const userData = {
      user_id: generateUserID(),
      ...newUser,
      categories: [], // Empty array as in your HTML
    };

    try {
      const response = await axios.post(`${API_URL}/create_user`, userData);
      alert(response.data.message);
      setNewUser({
        name: "",
        address: "",
        user_type: "",
        password: "",
        email: "",
      });
      fetchUsers(); // Refresh user list
    } catch (err) {
      setError("Failed to save user.");
    }
  };

  const handleUpdateUser = async (userId, updatedData) => {
    try {
      await axios.put(`${API_URL}/users/${userId}`, updatedData);
      setUsers(users.map((u) => (u.user_id === userId ? { ...u, ...updatedData } : u)));
      alert("User updated successfully!");
    } catch (err) {
      setError("Failed to update user.");
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await axios.delete(`${API_URL}/delete_user/${userId}`);
        alert(response.data.message);
        fetchUsers(); // Refresh user list
      } catch (err) {
        setError("Failed to delete user.");
      }
    }
  };

  if (!user?.canAccessAdminPage) {
    return <div className="admin-unauthorized">Unauthorized access.</div>;
  }

  return (
    <div className="admin-page-container">
      <h1 className="admin-title">Admin Dashboard</h1>
      <p className="admin-welcome">Welcome, {user.name || "Admin"} (Admin)</p>
      {error && <div className="admin-error">{error}</div>}

      {/* User Creation Form */}
      <div className="admin-user-form">
        <h2 className="admin-subtitle">Enter User Details</h2>
        <form onSubmit={saveUser}>
          <div className="admin-form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newUser.name}
              onChange={handleInputChange}
              required
              className="admin-input"
            />
          </div>
          <div className="admin-form-group">
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={newUser.address}
              onChange={handleInputChange}
              required
              className="admin-input"
            />
          </div>
          <div className="admin-form-group">
            <label htmlFor="user_type">User Type:</label>
            <select
              id="user_type"
              name="user_type"
              value={newUser.user_type}
              onChange={handleInputChange}
              required
              className="admin-input"
            >
              <option value="">Select Type</option>
              <option value="City">City</option>
              <option value="Company">Company</option>
              <option value="Citizen">Citizen</option>
            </select>
          </div>
          <div className="admin-form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={newUser.password}
              onChange={handleInputChange}
              required
              className="admin-input"
            />
          </div>
          <div className="admin-form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={newUser.email}
              onChange={handleInputChange}
              required
              className="admin-input"
            />
          </div>
          <button type="submit" className="admin-save-btn">Save User</button>
        </form>
      </div>

      {/* User List */}
      {loading ? (
        <div className="admin-loading">Loading users...</div>
      ) : (
        <div className="admin-user-management">
          <h2 className="admin-subtitle">List of Users</h2>
          <table className="admin-user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Type</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.user_id}>
                  <td>{u.user_id}</td>
                  <td>
                    <input
                      type="text"
                      defaultValue={u.name}
                      onBlur={(e) =>
                        handleUpdateUser(u.user_id, { name: e.target.value })
                      }
                      className="admin-input"
                    />
                  </td>
                  <td>
                    <input
                      type="email"
                      defaultValue={u.email}
                      onBlur={(e) =>
                        handleUpdateUser(u.user_id, { email: e.target.value })
                      }
                      className="admin-input"
                    />
                  </td>
                  <td>{u.user_type}</td>
                  <td>{u.address}</td>
                  <td>
                    <button
                      onClick={() => deleteUser(u.user_id)}
                      className="admin-delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPage;