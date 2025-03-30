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
      setCategories(
        response.data.map((cat) => ({
          ...cat,
          category_name: cat.category_name || "",
        }))
      );
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
    const trimmedCategory = newCategory.trim();

    if (!trimmedCategory) {
      setError("Category name cannot be empty");
      return;
    }
    if (
      categories.some(
        (cat) =>
          cat.category_name?.toLowerCase() === trimmedCategory.toLowerCase()
      )
    ) {
      setError("Category name already exists");
      return;
    }

    const tempId = "TEMP-" + Date.now();
    const tempCategory = {
      category_id: tempId,
      category_name: trimmedCategory,
    };

    setCategories((prev) => [...prev, tempCategory]);
    setOperationLoading((prev) => ({ ...prev, [tempId]: true }));
    setNewCategory("");

    try {
      const response = await axios.post(`${API_URL}/create_category`, {
        category_id: "CAT-" + Date.now(),
        category_name: trimmedCategory,
      });
      fetchCategories();
      setCategories((prev) =>
        prev.map((cat) => (cat.category_id === tempId ? response.data : cat))
      );
      setError(null);
    } catch (err) {
      setCategories((prev) => prev.filter((cat) => cat.category_id !== tempId));
      setNewCategory(trimmedCategory);
      setError(getErrorMessage(err));
    } finally {
      setOperationLoading((prev) => ({ ...prev, [tempId]: false }));
    }
  };

  const handleEditCategory = async (categoryId) => {
    const trimmedName = editingCategory?.newName?.trim();

    if (!trimmedName) {
      setError("Category name cannot be empty");
      return;
    }
    if (trimmedName.length < 2) {
      setError("Category name must be at least 2 characters long");
      return;
    }
    if (
      categories.some(
        (cat) =>
          cat.category_id !== categoryId &&
          cat.category_name?.toLowerCase() === trimmedName.toLowerCase()
      )
    ) {
      setError("Category name already exists");
      return;
    }

    const originalCategory = categories.find(
      (cat) => cat.category_id === categoryId
    );

    setCategories((prev) =>
      prev.map((cat) =>
        cat.category_id === categoryId
          ? { ...cat, category_name: trimmedName }
          : cat
      )
    );
    setOperationLoading((prev) => ({ ...prev, [categoryId]: true }));

    try {
      const response = await axios.put(
        `${API_URL}/update_category/${categoryId}`,
        {
          category_name: trimmedName,
        }
      );

      if (response.data.updatedCategory) {
        setCategories((prev) =>
          prev.map((cat) =>
            cat.category_id === categoryId ? response.data.updatedCategory : cat
          )
        );
      } else {
        fetchCategories();
      }

      setEditingCategory(null);
      setError(null);
    } catch (err) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.category_id === categoryId ? originalCategory : cat
        )
      );
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Manage Categories
          </h1>
          <button
            onClick={() => navigate("/city/dashboard")}
            className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700"
          >
            Go Back
          </button>
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
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Category
            </button>
          </form>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Category Name
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.map((category) => (
                  <tr key={category.category_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {editingCategory?.id === category.category_id ? (
                        <input
                          type="text"
                          value={editingCategory.newName}
                          onChange={(e) =>
                            setEditingCategory({
                              id: category.category_id,
                              newName: e.target.value,
                            })
                          }
                          className="w-full px-2 py-1 border rounded"
                          autoFocus
                        />
                      ) : (
                        category.category_name
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-sm space-x-2">
                      {editingCategory?.id === category.category_id ? (
                        <>
                          <button
                            onClick={() =>
                              handleEditCategory(category.category_id)
                            }
                            className="text-green-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingCategory(null)}
                            className="text-gray-600"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() =>
                            setEditingCategory({
                              id: category.category_id,
                              newName: category.category_name,
                            })
                          }
                          className="text-blue-600"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
});

ManageCategories.displayName = "ManageCategories";

export default ManageCategories;
