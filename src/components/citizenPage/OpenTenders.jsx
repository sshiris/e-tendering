import React from "react";
import { useNavigate } from "react-router-dom";

const OpenTenders = ({ tenders }) => {
  const navigate = useNavigate();
  const openTenders = tenders.filter((tender) => tender.tender_status === "Open");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Open Tenders</h1>
      <table className="table-auto w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Tender Name</th>
            <th className="border border-gray-300 px-4 py-2">Description</th>
            <th className="border border-gray-300 px-4 py-2">Close Date</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {openTenders.map((tender) => (
            <tr key={tender.tender_id} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">{tender.tender_name}</td>
              <td className="border border-gray-300 px-4 py-2">{tender.description}</td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(tender.date_of_tender_close).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => navigate(`/citizen/tender-details/${tender.tender_id}`)}
                  className="px-4 py-2 bg-gray-600 text-white font-semibold rounded hover:bg-gray-700 transition mr-2"
                >
                  More
                </button>
                <button
                  onClick={() => navigate("/citizen/feedback", { state: { tender_id: tender.tender_id } })}
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
                >
                  Provide Feedback
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OpenTenders;
