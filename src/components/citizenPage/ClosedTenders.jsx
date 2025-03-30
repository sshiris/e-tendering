import React from "react";
import { useNavigate } from "react-router-dom";

const ClosedTenders = ({ tenders }) => {
  const navigate = useNavigate();
  const closedTenders = tenders.filter(
    (tender) => tender.tender_status === "Closed"
  );

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Closed Tenders
          </h1>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Back to Dashboard
          </button>
        </div>

        {closedTenders.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {closedTenders.map((tender) => (
              <div
                key={tender.tender_id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
                    {tender.tender_name}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {tender.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <svg
                      className="h-5 w-5 mr-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Closed:{" "}
                    {new Date(tender.date_of_tender_close).toLocaleDateString()}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() =>
                        navigate("/citizen/feedback", {
                          state: { tender_id: tender.tender_id },
                        })
                      }
                      className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Feedback
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/tender/${tender.tender_id}/details`)
                      }
                      className="flex-1 px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-6-4h6M3 17V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No Closed Tenders
            </h3>
            <p className="mt-1 text-gray-500">
              There are currently no closed tenders to display.
            </p>
            <button
              onClick={() => navigate("/citizen/open-tenders")}
              className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
            >
              View Open Tenders
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClosedTenders;
