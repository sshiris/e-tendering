import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CitySpecificComponent.css";

export default function CitySpecificComponent() {
  const [cityData, setCityData] = useState([]);
  const API_URL = "http://localhost:5500";

  useEffect(() => {
    fetchCityData();
  }, []);

  const fetchCityData = async () => {
    try {
      const response = await axios.get(`${API_URL}/city_data`);
      setCityData(response.data);
    } catch (error) {
      console.error("Error fetching city data:", error);
    }
  };

  const handleAction = async (data) => {
    try {
      await axios.post(`${API_URL}/city_action`, data);
      alert("Action completed successfully!");
      fetchCityData();
    } catch (error) {
      console.error("Error performing action:", error);
    }
  };

  return (
    <div className="city-specific-component">
      <h1>City Specific Component</h1>
      <button onClick={() => handleAction({ example: "data" })}>
        Perform Action
      </button>
      <ul>
        {cityData.map((item, index) => (
          <li key={index}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
