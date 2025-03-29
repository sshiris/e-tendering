import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const API_URL = "http://localhost:5500";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/users`);
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users. Please try again.");
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`${API_URL}/delete_user/${userId}`);
      setUsers(users.filter((user) => user.user_id !== userId));
    } catch (err) {
      setError("Failed to delete user. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Manage Users</h1>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="mt-4">
        {users.map((user) => (
          <li key={user.user_id} className="mb-4 p-4 border rounded">
            <h2 className="font-bold">{user.name}</h2>
            <p>Email: {user.email}</p>
            <p>Type: {user.user_type}</p>
            <button
              onClick={() => handleDelete(user.user_id)}
              className="mt-2 px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition"
            >
              Delete User
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageUsers;
