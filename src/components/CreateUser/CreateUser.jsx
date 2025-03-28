import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import "./CreateUser.css";

export default function CreateUser() {
  const API_URL = "http://localhost:5500";
  const navigate = useNavigate();

  const [newUser, setNewUser] = useState({
    name: "",
    address: "",
    user_type: "",
    password: "",
    email: "",
    categories: [],
  });

  const [error, setError] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableUserTypes, setAvailableUserTypes] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchCategoriesAndUserTypes = async () => {
      try {
        const categoriesResponse = await axios.get(`${API_URL}/categories`);
        const categories = categoriesResponse.data;

        // Проверяем, что категории содержат необходимые поля
        const validCategories = categories.map((category) => ({
          category_id: category.category_id,
          category_name: category.category_name,
          user_type: category.user_type || "Company", // Устанавливаем значение по умолчанию, если user_type отсутствует
        }));

        setAvailableCategories(validCategories);

        const userTypesResponse = await axios.get(`${API_URL}/user_types`);
        setAvailableUserTypes(userTypesResponse.data.filter((type) => type.type_name !== "City"));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCategoriesAndUserTypes();
  }, []);

  useEffect(() => {
    if (newUser.user_type) {
      const relevantCategories = availableCategories.filter(
        (category) => category.user_type === newUser.user_type
      );
      setFilteredCategories(relevantCategories);
    } else {
      setFilteredCategories([]);
    }
  }, [newUser.user_type, availableCategories]);

  const addUserToCategory = (user_id, category_id) => {
    fetch(`${API_URL}/add_user_to_category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id, category_id }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("User added to category successfully:", data.message);
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      console.log("Submitting form with data:", newUser);

      if (newUser.user_type === "City") {
        setError("Registration as 'City' is not allowed.");
        return;
      }

      // Проверка email перед созданием пользователя
      console.log("Checking if email exists:", newUser.email);
      const emailCheckResponse = await axios.get(`${API_URL}/users?email=${newUser.email}`);
      if (emailCheckResponse.data.exists) {
        setError("This email is already registered. Please use a different email.");
        return;
      }

      // Создание пользователя
      console.log("Creating user...");
      const userResponse = await axios.post(`${API_URL}/create_user`, {
        name: newUser.name,
        address: newUser.address,
        user_type: newUser.user_type,
        password: newUser.password,
        email: newUser.email,
      });

      console.log("User created successfully:", userResponse.data);
      const createdUserId = userResponse.data.user.user_id;

      if (!createdUserId) {
        throw new Error("Failed to retrieve user_id from server response.");
      }

      // Проверка перед отправкой категорий
      if (newUser.categories.length > 0) {
        const categoryPayload = {
          user_id: createdUserId,
          categories: newUser.categories,
        };

        console.log("Sending categories payload:", categoryPayload);
        try {
          const categoryResponse = await axios.post(`${API_URL}/user_categories`, categoryPayload);
          console.log("Categories added successfully:", categoryResponse.data);

          // Add user to each selected category
          for (const category_id of newUser.categories) {
            addUserToCategory(createdUserId, category_id);
          }
        } catch (error) {
          console.error("Error adding categories:", error);

          if (error.response?.status === 404) {
            setError("The server endpoint for adding categories was not found. Please contact support.");
          } else {
            setError(error.response?.data?.error || "Failed to add categories. Please try again.");
          }
          return; // Stop further execution if categories fail
        }
      }

      setUserId(createdUserId);
      setOpenDialog(true);
      console.log("User and categories added successfully.");
    } catch (error) {
      console.error("Error adding user or categories:", error);

      // Enhanced error handling
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "An unknown error occurred. Please try again later.";
      setError(errorMessage);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => {
      const updatedUser = { ...prev, [name]: value };
      return updatedUser;
    });
  };

  const handleCategoryChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setNewUser((prev) => ({ ...prev, categories: selectedOptions }));
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    navigate("/login");
  };

  return (
    <div className="create-user">
      <h3>Create New User</h3>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={newUser.name}
            onChange={handleInputChange}
            placeholder="Enter full name"
            required
            autoComplete="name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email (User ID)</label>
          <input
            id="email"
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleInputChange}
            placeholder="Enter email"
            required
            autoComplete="email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={newUser.password}
            onChange={handleInputChange}
            placeholder="Enter password"
            required
            autoComplete="new-password"
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            id="address"
            type="text"
            name="address"
            value={newUser.address}
            onChange={handleInputChange}
            placeholder="Enter address"
            required
            autoComplete="street-address"
          />
        </div>
        <div className="form-group">
          <label htmlFor="user_type">User Type</label>
          <select
            id="user_type"
            name="user_type"
            value={newUser.user_type}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>Select user type</option>
            {availableUserTypes.map((type) => (
              <option key={type.type_id} value={type.type_name}>
                {type.type_name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="categories">Categories</label>
          {newUser.user_type === "Company" ? (
            <select
              id="categories"
              name="categories"
              multiple
              value={newUser.categories}
              onChange={handleCategoryChange}
              className="categories-dropdown"
            >
              {filteredCategories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          ) : (
            <p>Please select "Company" as the user type to choose categories.</p>
          )}
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Create User
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/login")}
          >
            Cancel
          </button>
        </div>
      </form>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>User Created</DialogTitle>
        <DialogContent>
          <p>
            User created successfully! You can use your ID to login:{" "}
            <strong>{userId}</strong>
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
