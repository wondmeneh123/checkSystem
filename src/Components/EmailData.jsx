import React, { useState, useEffect } from "react";

const EmailData = () => {
  const [emailData, setEmailData] = useState([]); // Store email data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const fetchEmails = async () => {
    const API_URL = "/api?sender=abdetaterefe@gmail.com"; // Use proxy path

    try {
      setLoading(true);
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch email data");
      }

      const result = await response.json(); // Parse JSON response
      setEmailData(result.data); // Set the email data
    } catch (err) {
      setError(err.message); // Handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails(); // Fetch data on component mount
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Email Data</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loading && !error && emailData.length > 0 && (
        <table border="1" cellPadding="10" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Body</th>
            </tr>
          </thead>
          <tbody>
            {emailData.map((email, index) => (
              <tr key={index}>
                <td>{email.subject}</td>
                <td>{email.body}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!loading && !error && emailData.length === 0 && <p>No emails found.</p>}
    </div>
  );
};

export default EmailData;
