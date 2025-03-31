import React, { useState } from "react";
import axios from "axios";

const CompanyApplication = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    license: "",
    experience: "",
    engineer: "",
    engineerName: "",
    engineerLicense: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:5500";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/submit-application`,
        formData
      );

      setSuccess("Application submitted successfully!");
      setFormData({
        name: "",
        address: "",
        license: "",
        experience: "",
        engineer: "",
        engineerName: "",
        engineerLicense: "",
      });
      console.log("Application submitted:", response.data);
    } catch (err) {
      setError("Failed to submit application. Please try again.");
      console.error(
        "Error submitting application:",
        err.response?.data || err.message
      );
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6 sm:px-8 lg:px-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Submit Your Application
        </h2>

        {loading && (
          <div className="text-center text-gray-600 text-lg">Submitting...</div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Company Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Company Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">License:</label>
            <input
              type="text"
              name="license"
              value={formData.license}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Experience:</label>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Engineer Information:</label>
            <input
              type="text"
              name="engineer"
              value={formData.engineer}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Engineer Name:</label>
            <input
              type="text"
              name="engineerName"
              value={formData.engineerName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Engineer License:</label>
            <input
              type="text"
              name="engineerLicense"
              value={formData.engineerLicense}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyApplication;
