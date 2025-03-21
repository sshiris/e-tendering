import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateTender.css";

export default function CreateTender({ setTenders, fetchTenders }) {
  const today = new Date().toISOString().slice(0, 16).replace("T", " ");
  const todayDate = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();

  const addTender = async (newTender) => {
    try {
      const response = await axios.post(`${API_URL}/save_tender`, {
        ...newTender,
      });

      setTenders([...tenders, response.data.tender || newTender]);
      await fetchTenders();
      console.log("Tender added successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error adding tender:", error);
      throw error;
    }
  };

  const [newTender, setNewTender] = useState({
    tender_name: "",
    construction_from: todayDate,
    construction_to: todayDate,
    date_of_tender_notice: today,
    date_of_tender_close: today,
    date_of_tender_winner: today,
    bidding_price: 0,
    tender_status: "",
    staff_id: "",
  });

  function handleSubmit(e) {
    e.preventDefault();

    addTender(newTender);

    setNewTender({
      tender_name: "",
      construction_from: todayDate,
      construction_to: todayDate,
      date_of_tender_notice: today,
      date_of_tender_close: today,
      date_of_tender_winner: today,
      bidding_price: 0,
      tender_status: "",
      staff_id: "",
    });

    navigate("/tenders");
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setNewTender((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <div>
      <h3>Create New Tender</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="tender_name">Tender Name:</label>
          <input
            id="tender_name"
            type="text"
            name="tender_name"
            value={newTender.tender_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="construction_from">Terms of Construction:</label>
          <input
            id="construction_from"
            type="date"
            name="construction_from"
            value={newTender.construction_from}
            onChange={handleInputChange}
            required
          />
          -
          <input
            id="construction_to"
            type="date"
            name="construction_to"
            value={newTender.construction_to}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="date_of_tender_notice">Date of Tender Notice:</label>
          <input
            id="date_of_tender_notice"
            type="datetime-local"
            name="date_of_tender_notice"
            value={newTender.date_of_tender_notice}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="date_of_tender_close">Date of Tender Close:</label>
          <input
            id="date_of_tender_close"
            type="datetime-local"
            name="date_of_tender_close"
            value={newTender.date_of_tender_close}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="date_of_tender_winner">Date of Tender Winner:</label>
          <input
            id="date_of_tender_winner"
            type="datetime-local"
            name="date_of_tender_winner"
            value={newTender.date_of_tender_winner}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="bidding_price">Bidding Price:</label>
          <input
            id="bidding_price"
            type="number"
            name="bidding_price"
            value={newTender.bidding_price}
            onChange={handleInputChange}
            min="0"
            step="1000000"
            required
          />
        </div>
        <div>
          <label htmlFor="tender_status">Tender Status:</label>
          <select
            id="tender_status"
            name="tender_status"
            value={newTender.tender_status}
            onChange={handleInputChange}
            required
          >
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
        <div>
          <button type="submit">Submit Tender</button>
          <button type="button" onClick={() => navigate("/tenders")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
