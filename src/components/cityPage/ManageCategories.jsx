import React, { useEffect, useState, memo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ManageCategories = memo(() => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [operationLoading, setOperationLoading] = useState({});
  const navigate = useNavigate();
  const API_URL = "http://localhost:5500";

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/categories`, {
        timeout: 5000,
      });
      setCategories(response.data);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (err) => {
    if (err.code === "ECONNABORTED")
      return "Request timed out. Please check your connection.";
    return err.response?.data?.message || "An unexpected error occurred.";
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      setError("Category name cannot be empty");
      return;
    }

    const tempId = "TEMP-" + Date.now();
    setOperationLoading((prev) => ({ ...prev, [tempId]: true }));

    try {
      const response = await axios.post(`${API_URL}/create_category`, {
        category_id: "CAT-" + Date.now(),
        category_name: newCategory.trim(),
      });
      setCategories([...categories, response.data]);
      setNewCategory("");
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setOperationLoading((prev) => ({ ...prev, [tempId]: false }));
    }
  };

  const handleEditCategory = async (categoryId, newName) => {
    if (!newName.trim()) {
      setError("Category name cannot be empty");
      return;
    }

    setOperationLoading((prev) => ({ ...prev, [categoryId]: true }));
    try {
      const response = await axios.put(
        `${API_URL}/update_category/${categoryId}`,
        {
          category_name: newName.trim(),
        }
      );
      setCategories(
        categories.map((cat) =>
          cat.category_id === categoryId ? response.data.updatedCategory : cat
        )
      );
      setEditingCategory(null);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setOperationLoading((prev) => ({ ...prev, [categoryId]: false }));
    }
  };
  const filteredCategories = categories.filter((category) =>
    category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Manage Categories
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <button
              onClick={() => navigate("/city/dashboard")}
              className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition duration-200"
            >
              Go Back
            </button>
          </div>
        </div>

        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Add New Category
          </h2>
          <form onSubmit={handleAddCategory} className="flex gap-4">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={Object.values(operationLoading).some(Boolean)}
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
              disabled={Object.values(operationLoading).some(Boolean)}
            >
              {Object.values(operationLoading).some(Boolean)
                ? "Processing..."
                : "Add Category"}
            </button>
          </form>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <svg
              className="h-5 w-5 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}

        {!loading && filteredCategories.length > 0 && (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category Name
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.map((category) => (
                  <tr key={category.category_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {editingCategory === category.category_id ? (
                        <div className="flex items-center w-full">
                          <input
                            type="text"
                            defaultValue={category.category_name}
                            id={`edit-input-${category.category_id}`}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                        </div>
                      ) : (
                        category.category_name
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                      {editingCategory !== category.category_id ? (
                        <>
                          <button
                            onClick={() =>
                              setEditingCategory(category.category_id)
                            }
                            className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                            disabled={operationLoading[category.category_id]}
                          >
                            Edit
                          </button>
                        </>
                      ) : (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              const newValue = document.getElementById(
                                `edit-input-${category.category_id}`
                              ).value;
                              handleEditCategory(
                                category.category_id,
                                newValue
                              );
                            }}
                            className="text-green-600 hover:text-green-800 disabled:opacity-50"
                            disabled={operationLoading[category.category_id]}
                          >
                            {operationLoading[category.category_id]
                              ? "Saving..."
                              : "Save"}
                          </button>
                          <button
                            onClick={() => setEditingCategory(null)}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredCategories.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No Categories Found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "No categories match your search."
                : "Add a category above to get started!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

ManageCategories.displayName = "ManageCategories";

export default ManageCategories;
