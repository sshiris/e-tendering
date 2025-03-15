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
    term_start: new Date().toISOString().split("T")[0],
    term_end: new Date().toISOString().split("T")[0],
    notice: today,
    close: today,
    disclosingWinner: today,
    status: "",
  });

  function handleSubmit(e) {
    e.preventDefault();

    addTender(newTender);
    setNewTender({
      id: newTender.id + 1,
      name: "",
      description: "",
      term_start: today,
      term_end: today,
      notice: today,
      close: today,
      disclosingWinner: today,
      status: "",
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
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            name="name"
            value={newTender.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <input
            id="description"
            type="text"
            name="description"
            value={newTender.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="term-start">Term of Construction:</label>
          <input
            id="term-start"
            type="date"
            name="term-start"
            value={newTender.term_start}
            onChange={handleInputChange}
            required
          />
          -
          <input
            id="term-end"
            type="date"
            name="term-end"
            value={newTender.term_end}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="price">Estimated tender price:</label>
          <input id="price" type="number" min="1" step="500" />
        </div>
        <div>
          <label htmlFor="notice">Date of Tender Notice:</label>
          <input
            id="notice"
            type="datetime-local"
            name="notice"
            value={newTender.notice}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="close">Date of Tender Close:</label>
          <input
            id="close"
            type="datetime-local"
            name="close"
            value={newTender.close}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="disclosingWinner">Date of Disclosing Winner:</label>
          <input
            id="disclosingWinner"
            type="datetime-local"
            name="disclosingWinner"
            value={newTender.disclosingWinner}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="status">Tender Status:</label>
          <input
            id="status"
            type="text"
            name="status"
            value={newTender.status}
            onChange={handleInputChange}
            required
          />
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
