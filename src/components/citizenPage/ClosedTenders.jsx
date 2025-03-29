import React from "react";

const ClosedTenders = ({ tenders }) => {
  const closedTenders = tenders.filter((tender) => tender.tender_status === "Closed");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Closed Tenders</h1>
      <ul className="mt-4">
        {closedTenders.map((tender) => (
          <li key={tender.tender_id} className="mb-2 p-2 border rounded">
            <h2 className="font-bold">{tender.tender_name}</h2>
            <p>{tender.description}</p>
            <p>
              <strong>Closed On:</strong> {new Date(tender.date_of_tender_close).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClosedTenders;
