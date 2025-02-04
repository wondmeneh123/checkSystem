import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Components/Header";

const Casher = () => {
  const [senderEmail, setSenderEmail] = useState("wondmenhfekadu@gmail.com"); // Email to fetch from
  const [emailData, setEmailData] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        "https://script.google.com/macros/s/AKfycbxo7JoQASmwfZfjTHaMyfsVFpDTF0bKJ8yu3AZaqkeHkNXIQByrjzYXTfPIgz95YV55/exec",
        {
          params: { sender: senderEmail }, // Send sender email as a query parameter
        }
      );

      const fetchedEmails = response.data.data;

      // Get the current date in "MM/DD/YYYY" format
      const today = new Date();
      const currentDate = `${String(today.getDate()).padStart(2, "0")}/${String(
        today.getMonth() + 1
      ).padStart(2, "0")}/${today.getFullYear()}`;

      // Filter emails by date
      const todayEmails = fetchedEmails.filter((email) => {
        const emailDate = email.timeSent.split(",")[0];
        if (emailDate.includes(currentDate)) {
          return true;
        }
        return false;
      });

      setEmailData(fetchedEmails);

      setFilteredEmails(todayEmails);
      console.log(emailData);
      console.log(currentDate);
    } catch (err) {
      setError("Failed to fetch emails. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <Header />
      <h1>Fetch Emails from Specific Sender</h1>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="email"
          placeholder="Enter sender's email"
          value={senderEmail}
          onChange={(e) => setSenderEmail(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
        <button
          onClick={fetchEmails}
          style={{
            padding: "10px 20px",
            marginLeft: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {loading ? "Loading..." : "Fetch Emails"}
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading emails...</p>}
      {!loading && filteredEmails.length > 0 && (
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Time Sent
                </th>
                <th scope="col" className="px-6 py-3">
                  Body
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEmails.map((email, index) => (
                <tr key={index} className="bg-white border-b ">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                  >
                    {email.timeSent}
                  </th>
                  <td className="px-6 py-4">{email.body}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!loading && filteredEmails.length === 0 && !error && (
        <p>No emails found for today from this sender.</p>
      )}
    </div>
  );
};

export default Casher;
