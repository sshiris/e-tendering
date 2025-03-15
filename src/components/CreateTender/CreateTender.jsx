import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateTender.css";
export default function CreateTender({ addTender, lastId }) {
  const today = new Date().toISOString().slice(0, 16).replace("T", " ");
  const navigate = useNavigate();

  const [newTender, setNewTender] = useState({
    id: lastId + 1,
    name: "",
    description: "",
    term: today,
    notice: today,
    close: today,
    disclosingWinner: today,
    status: "Open",
  });

  function handleSubmit(e) {
    e.preventDefault();

    addTender(newTender);
    setNewTender({
      id: newTender.id + 1,
      name: "",
      description: "",
      term: today,
      notice: today,
      close: today,
      disclosingWinner: today,
      status: "Open",
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
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={newTender.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={newTender.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Term of Construction:</label>
          <div className="date-range-container"></div>
        </div>
        <div>
          <label>Date of Tender Notice:</label>
          <input
            type="datetime-local"
            name="notice"
            value={newTender.notice}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Date of Tender Close:</label>
          <input
            type="datetime-local"
            name="close"
            value={newTender.close}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Date of Disclosing Winner:</label>
          <input
            type="datetime-local"
            name="disclosingWinner"
            value={newTender.disclosingWinner}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Tender Status:</label>
          <input
            type="text"
            name="status"
            value={newTender.status}
            onChange={handleInputChange}
            required
          />
        </div>
        <div style={{ marginTop: "20px" }}>
          <button type="submit">Submit Tender</button>
          <button type="button" onClick={() => navigate("/tenders")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
