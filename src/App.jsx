import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const Casher = () => {
  const [senderEmail, setSenderEmail] = useState("abdetaterefe@gmail.com"); // Email to fetch from
  const [emailData, setEmailData] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEmails(); // Automatically fetch emails on component mount
  }, []);

  const fetchEmails = async () => {
    if (!senderEmail) {
      setError("Please enter the sender's email address.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      // Replace this URL with your Google Apps Script URL
      const response = await axios.get(
        "https://script.google.com/macros/s/AKfycby7X6XGcwRV_Pu4KoNRqW8RwjMHBnHF0dDzSsJYvefnbIyJHApITocE42xRJOYETdag/exec",
        {
          params: { sender: senderEmail }, // Send sender email as a query parameter
        }
      );

      const fetchedEmails = response.data.data;

      setEmailData(fetchedEmails);
      setFilteredEmails(fetchedEmails);
    } catch (err) {
      setError("Failed to fetch emails. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterByDate = () => {
    if (!filterDate) {
      setFilteredEmails(emailData);
      return;
    }

    const formattedFilterDate = new Date(filterDate).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );

    const filtered = emailData.filter((email) =>
      email.date_received?.includes(formattedFilterDate)
    );
    setFilteredEmails(filtered);
  };

  return (
    <div className="p-6 font-sans bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
        All Transactions
      </h1>
      <div className="flex justify-center gap-4 items-center">
        <div className="mb-6 flex gap-4">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={filterByDate}
            className="px-4 py-2 bg-green-500 text-white font-medium rounded shadow hover:bg-green-600 focus:ring-2 focus:ring-green-300"
          >
            Filter by Date
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="text-sm">
        {loading ? (
          <p className="text-gray-500 text-center">Loading emails...</p>
        ) : (
          <>
            {/* PC View */}
            <div className="hidden md:block">
              {filteredEmails.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-200 shadow-sm">
                  <thead>
                    <tr>
                      <th className="border-b p-3 text-left text-gray-600">
                        Time Sent
                      </th>

                      <th className="border-b p-3 text-left text-gray-600">
                        Reference
                      </th>
                      <th className="border-b p-3 text-left text-gray-600">
                        Amount
                      </th>
                      <th className="border-b p-3 text-left text-gray-600">
                        Transaction Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmails.map((email, index) => (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="border-b p-3 text-gray-700">
                          {email.timeSent}
                        </td>

                        <td className="border-b p-3 text-gray-700">
                          {email.reference || "N/A"}
                        </td>
                        <td className="border-b p-3 text-gray-700">
                          {email.received_money || "N/A"}
                        </td>
                        <td className="border-b p-3 text-gray-700">
                          {email.date_received || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-600">No emails found.</p>
              )}
            </div>

            {/* Mobile View */}
            <div className="block md:hidden">
              {filteredEmails.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {filteredEmails.map((email, index) => (
                    <div
                      key={index}
                      className="border border-gray-300 rounded shadow p-4 bg-white"
                    >
                      <h2 className="font-bold text-lg text-gray-800 mb-2">
                        {email.timeSent}
                      </h2>

                      <p className="text-gray-600">
                        Reference: {email.reference || "N/A"}
                      </p>
                      <p className="text-gray-600">
                        Amount: {email.received_money || "N/A"}
                      </p>
                      <p className="text-gray-600">
                        Transaction Date: {email.date_received || "N/A"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No emails found.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Casher;
