import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function TenderList({ tenders, addTender }) {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [newTender, setNewTender] = useState({
    title: "",
    budget: "",
    deadline: "",
  });

  function handleCreateTender() {
    setShowForm(true);
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setNewTender((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const tenderToAdd = {
      id: Date.now(),
      title: newTender.title,
      budget: newTender.budget,
      deadline: newTender.deadline,
      status: "Open",
    };
    addTender(tenderToAdd);
    setNewTender({ title: "", budget: "", deadline: "" });
    setShowForm(false);
  }

  return (
    <div>
      <h2>Tenders</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Budget</th>
            <th>Deadline</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tenders.map((tender) => (
            <tr key={tender.id}>
              <td>{tender.title}</td>
              <td>{tender.budget}</td>
              <td>{tender.deadline}</td>
              <td>
                <button
                  onClick={() =>
                    navigate(`/tender/${tender.id}/bid`, { state: tender })
                  }
                >
                  Bid
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleCreateTender}>Create Tender</button>

      {showForm && (
        <div>
          <h3>Create New Tender</h3>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={newTender.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Budget:</label>
              <input
                type="text"
                name="budget"
                value={newTender.budget}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Deadline:</label>
              <input
                type="date"
                name="deadline"
                value={newTender.deadline}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit">Submit Tender</button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default TenderList;
