import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { validatePassword } from "../../utils/validation.js";
import "./CreateUser.css";

export default function CreateUser() {
  const API_URL = "http://localhost:5500";
  const navigate = useNavigate();

  const [newUser, setNewUser] = useState({
    name: "",
    address: "",
    user_type: "",
    password: "",
    confirmPassword: "",
    email: "",
    categories: [],
  });

  const [error, setError] = useState(null);
  const [passwordErrors, setPasswordErrors] = useState([]);
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

        const validCategories = categories.map((category) => ({
          category_id: category.category_id,
          category_name: category.category_name,
          user_type: category.user_type || "Company",
        }));

        setAvailableCategories(validCategories);

        const userTypesResponse = await axios.get(`${API_URL}/user_types`);
        setAvailableUserTypes(
          userTypesResponse.data.filter((type) => type.type_name !== "City")
        );
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

  useEffect(() => {
    if (newUser.password) {
      const { isValid, errors } = validatePassword(newUser.password);
      setPasswordErrors(errors);
    } else {
      setPasswordErrors([]);
    }
  }, [newUser.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);

      const { isValid, errors } = validatePassword(newUser.password);
      if (!isValid) {
        setPasswordErrors(errors);
        setError("Please fix the password issues before submitting.");
        return;
      }

      if (newUser.password !== newUser.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      console.log("Submitting form with data:", newUser);

      if (newUser.user_type === "City") {
        setError("Registration as 'City' is not allowed.");
        return;
      }

      console.log("Checking if email exists:", newUser.email);
      const emailCheckResponse = await axios.get(
        `${API_URL}/users?email=${newUser.email}`
      );
      if (emailCheckResponse.data.exists) {
        setError(
          "This email is already registered. Please use a different email."
        );
        return;
      }

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

      if (newUser.categories.length > 0) {
        console.log("Adding user to categories...");
        const categoryPromises = newUser.categories.map(async (category_id) => {
          console.log(
            `Associating category_id: ${category_id} with user_id: ${createdUserId}`
          );
          const response = await axios.post(
            `${API_URL}/add_user_to_specific_category`,
            {
              user_id: createdUserId,
              category_id,
            }
          );
          console.log(
            `Category association response for category_id ${category_id}:`,
            response.data
          );
          return response.data;
        });

        try {
          await Promise.all(categoryPromises);
          console.log("User added to all selected categories successfully.");
        } catch (error) {
          console.error("Error adding user to categories:", error);
          setError(
            "Failed to add user to one or more categories. Please try again."
          );
          return;
        }
      }

      console.log("Fetching updated user data...");
      const updatedUserResponse = await axios.get(
        `${API_URL}/users/${createdUserId}`
      );
      console.log("Updated user data:", updatedUserResponse.data);

      setUserId(createdUserId);
      setOpenDialog(true);
      console.log("User and categories added successfully.");
    } catch (error) {
      console.error("Error adding user or categories:", error);

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
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
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
          {passwordErrors.length > 0 && (
            <ul className="password-error-list">
              {passwordErrors.map((err, index) => (
                <li key={index} className="password-error-item">
                  {err}
                </li>
              ))}
            </ul>
          )}
          <div className="password-requirements">
            <p>Password must:</p>
            <ul>
              <li
                className={
                  newUser.password.length >= 8 && newUser.password.length <= 12
                    ? "requirement-met"
                    : ""
                }
              >
                Be 8-12 characters long
              </li>
              <li
                className={
                  /[A-Z]/.test(newUser.password) ? "requirement-met" : ""
                }
              >
                Contain at least one uppercase letter
              </li>
              <li
                className={
                  /[a-z]/.test(newUser.password) ? "requirement-met" : ""
                }
              >
                Contain at least one lowercase letter
              </li>
              <li
                className={
                  /[0-9]/.test(newUser.password) ? "requirement-met" : ""
                }
              >
                Contain at least one number
              </li>
            </ul>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={newUser.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm password"
            required
            autoComplete="new-password"
          />
          {newUser.password &&
            newUser.confirmPassword &&
            newUser.password !== newUser.confirmPassword && (
              <p className="password-error-item">Passwords do not match</p>
            )}
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
            <option value="" disabled>
              Select user type
            </option>
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
            <p>
              Please select "Company" as the user type to choose categories.
            </p>
          )}
        </div>
        <div className="form-actions">
          <button
            type="submit"
            className="submit-btn"
            disabled={
              passwordErrors.length > 0 ||
              (newUser.password !== newUser.confirmPassword &&
                newUser.confirmPassword)
            }
          >
            Create User
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate(-1)}
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
