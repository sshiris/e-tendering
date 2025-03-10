import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateTender({ addTender, setShowForm }) {
  const navigate = useNavigate();
  const [newTender, setNewTender] = useState({
    id: "",
    name: "",
    notice: "",
    close: "",
    winner: "",
    status: "",
  });

  function handleSubmit(e) {
    e.preventDefault();
    const tenderToAdd = {
      id: newTender.id,
      name: newTender.name,
      notice: newTender.notice,
      close: newTender.close,
      winner: newTender.winner,
      status: newTender.status,
    };

    addTender(tenderToAdd);
    setNewTender({
      name: "",
      notice: "",
      close: "",
      winner: "",
      status: "Open",
    });

    //display in JSON
    setShowForm(false);
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
          <label>Date of Tender Notice:</label>
          <input
            type="date"
            name="notice"
            value={newTender.notice}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Date of Tender Close:</label>
          <input
            type="date"
            name="close"
            value={newTender.close}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Date of Disclosing Winner:</label>
          <input
            type="date"
            name="winner"
            value={newTender.winner}
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
