import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const API_URL = "http://localhost:5500";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories`);
        setCategories(response.data);
      } catch (err) {
        setError("Failed to fetch categories. Please try again.");
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Manage Categories</h1>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="mt-4">
        {categories.map((category) => (
          <li key={category.category_id} className="mb-4 p-4 border rounded">
            <h2 className="font-bold">{category.category_name}</h2>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageCategories;
