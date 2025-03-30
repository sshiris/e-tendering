import React, { useState } from "react";
import "./EditComponent.css";

export default function EditComponent({ data, fields, onSave, onCancel }) {
  const [formData, setFormData] = useState(data);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="edit-component">
      <h2>Edit Details</h2>
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div className="form-group" key={field.name}>
            <label htmlFor={field.name}>{field.label}</label>
            <input
              id={field.name}
              type={field.type}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleInputChange}
              required={field.required}
            />
          </div>
        ))}
        <div className="form-actions">
          <button type="submit" className="save-btn">
            Save
          </button>
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
