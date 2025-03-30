import React from "react";
import { useNavigate } from "react-router-dom";

const OpenTenders = ({ tenders }) => {
  const navigate = useNavigate();
  const openTenders = tenders.filter(
    (tender) => tender.tender_status === "Open"
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Open Tenders</h1>
      <ul className="mt-4">
        {openTenders.map((tender) => (
          <li key={tender.tender_id} className="mb-4 p-4 border rounded">
            <h2 className="font-bold">{tender.tender_name}</h2>
            <p>{tender.description}</p>
            <p>
              <strong>Close Date:</strong>{" "}
              {new Date(tender.date_of_tender_close).toLocaleDateString()}
            </p>
            <button
              onClick={() =>
                navigate("/citizen/feedback", {
                  state: { tender_id: tender.tender_id },
                })
              }
              className="mt-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
            >
              Provide Feedback
            </button>
            <button
              onClick={() =>
                navigate(`/citizen/tender-details/${tender.tender_id}`)
              }
              className="mt-2 px-4 py-2 bg-gray-600 text-white font-semibold rounded hover:bg-gray-700 transition"
            >
              More
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={() => navigate("/")}
        className="mt-6 px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition"
      >
        Back
      </button>
    </div>
  );
};

export default OpenTenders;
