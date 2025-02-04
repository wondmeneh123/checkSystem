import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { db } from "../fb";

const CheckReceipt = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState({ waiters: [], cashiers: [] });
  const [selectedWaiter, setSelectedWaiter] = useState("");
  const [selectedCashier, setSelectedCashier] = useState("");

  // Fetch employees with roles "waiter" and "cashier"
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const waiterQuery = query(
          collection(db, "employees"),
          where("role", "==", "waiter")
        );
        const cashierQuery = query(
          collection(db, "employees"),
          where("role", "==", "cashier")
        );

        const [waiterSnapshot, cashierSnapshot] = await Promise.all([
          getDocs(waiterQuery),
          getDocs(cashierQuery),
        ]);

        setEmployees({
          waiters: waiterSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })),
          cashiers: cashierSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })),
        });
      } catch (error) {
        console.error("Error fetching employees: ", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setResults([]);
    try {
      const q = query(
        collection(db, "receipts"),
        where("reference", "==", searchTerm)
      );
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setResults(items);
    } catch (error) {
      console.error("Error fetching search results: ", error);
    }
    setLoading(false);
  };

  const handleClaim = async (id) => {
    try {
      if (!selectedWaiter || !selectedCashier) {
        alert("Please select a waiter and a cashier.");
        return;
      }

      const receiptDoc = doc(db, "receipts", id);
      const waiter = employees.waiters.find((w) => w.id === selectedWaiter);
      const cashier = employees.cashiers.find((c) => c.id === selectedCashier);

      await updateDoc(receiptDoc, {
        isCollected: true,
        claimedBy: waiter.name,
        acknowledgedBy: cashier.name,
      });

      setResults((prevResults) =>
        prevResults.map((item) =>
          item.id === id
            ? {
                ...item,
                isCollected: true,
                claimedBy: waiter.name,
                acknowledgedBy: cashier.name,
              }
            : item
        )
      );
      alert("Claim marked as collected successfully!");
    } catch (error) {
      console.error("Error updating receipt: ", error);
      alert("Failed to update receipt. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Search Receipts
        </h1>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter Reference"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSearch}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Search
          </button>
        </div>
        {loading ? (
          <p className="text-center mt-4 text-gray-500">Loading...</p>
        ) : results.length === 0 ? (
          <p className="text-center mt-4 text-gray-500">No results found.</p>
        ) : (
          <div className="mt-6 space-y-4">
            {results.map((result) => (
              <div
                key={result.id}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm"
              >
                <p className="text-gray-600 text-sm">
                  <span className="font-semibold">Date Received:</span>{" "}
                  {result.date_received}
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-semibold">Received Money:</span>{" "}
                  {result.received_money}
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-semibold">Reference:</span>{" "}
                  {result.reference}
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-semibold">Time Sent:</span>{" "}
                  {result.timeSent}
                </p>
                <p className="text-gray-600 text-sm font-semibold">
                  {result.isCollected
                    ? `Money collected by ${result.claimedBy} and acknowledged by ${result.acknowledgedBy}`
                    : "Not collected yet"}
                </p>
                {!result.isCollected && (
                  <>
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Select Waiter:
                      </label>
                      <select
                        value={selectedWaiter}
                        onChange={(e) => setSelectedWaiter(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">-- Select Waiter --</option>
                        {employees.waiters.map((waiter) => (
                          <option key={waiter.id} value={waiter.id}>
                            {waiter.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Select Cashier:
                      </label>
                      <select
                        value={selectedCashier}
                        onChange={(e) => setSelectedCashier(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">-- Select Cashier --</option>
                        {employees.cashiers.map((cashier) => (
                          <option key={cashier.id} value={cashier.id}>
                            {cashier.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => handleClaim(result.id)}
                      className="bg-indigo-600 text-white p-2 rounded mt-3 hover:bg-indigo-700 transition w-full"
                    >
                      Claim Now
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckReceipt;
