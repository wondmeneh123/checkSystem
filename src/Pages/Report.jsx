import React, { useState, useEffect, useRef } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../fb";
import Sidebar from "../Components/Sidebar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns"; // Used to format dates
import { useReactToPrint } from "react-to-print";

const Report = () => {
  const [receipts, setReceipts] = useState([]);
  const [filteredReceipts, setFilteredReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    cashier: "",
    waiter: "",
    date: null, // Store date as a JavaScript Date object
  });
  const [cashiers, setCashiers] = useState([]);
  const [waiters, setWaiters] = useState([]);
  const receiptRef = useRef(); // Reference for printable content

  // Fetch receipts
  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "receipts"));
        const receiptData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReceipts(receiptData);
        setFilteredReceipts(receiptData);
      } catch (error) {
        console.error("Error fetching receipts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, []);

  // Fetch cashiers and waiters
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const cashierQuery = query(
          collection(db, "employees"),
          where("role", "==", "cashier")
        );
        const waiterQuery = query(
          collection(db, "employees"),
          where("role", "==", "waiter")
        );

        const [cashierSnapshot, waiterSnapshot] = await Promise.all([
          getDocs(cashierQuery),
          getDocs(waiterQuery),
        ]);

        setCashiers(
          cashierSnapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
          }))
        );
        setWaiters(
          waiterSnapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
          }))
        );
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFilters((prev) => ({
      ...prev,
      date,
    }));
  };

  useEffect(() => {
    let filtered = receipts;

    // Filter by cashier
    if (filters.cashier) {
      filtered = filtered.filter(
        (receipt) => receipt.acknowledgedBy === filters.cashier
      );
    }

    // Filter by waiter
    if (filters.waiter) {
      filtered = filtered.filter(
        (receipt) => receipt.claimedBy === filters.waiter
      );
    }

    // Filter by date
    if (filters.date) {
      const formattedDate = format(filters.date, "dd/MM/yyyy"); // Format the selected date
      filtered = filtered.filter(
        (receipt) => receipt.date_received === formattedDate
      );
    }

    setFilteredReceipts(filtered);
  }, [filters, receipts]);

  const reactToPrintFn = useReactToPrint({ receiptRef });
  return (
    <div className="flex w-full">
      <Sidebar />
      <div className="min-h-screen bg-gray-100 p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">Receipts Report</h1>
        <button
          onClick={() => reactToPrintFn()}
          className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition mb-4"
        >
          Print Report
        </button>
        {/* Filters */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Filter by Cashier
              </label>
              <select
                name="cashier"
                value={filters.cashier}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Cashiers</option>
                {cashiers.map((cashier) => (
                  <option key={cashier.id} value={cashier.name}>
                    {cashier.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Filter by Waiter
              </label>
              <select
                name="waiter"
                value={filters.waiter}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Waiters</option>
                {waiters.map((waiter) => (
                  <option key={waiter.id} value={waiter.name}>
                    {waiter.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Filter by Date
              </label>
              <DatePicker
                selected={filters.date}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholderText="Select a date"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading receipts...</p>
        ) : filteredReceipts.length === 0 ? (
          <p className="text-gray-500">No receipts found.</p>
        ) : (
          <div
            className="overflow-x-auto bg-white shadow-md rounded-lg"
            ref={receiptRef}
          >
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Received Money
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Received
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time Sent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cashier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Waiter
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredReceipts.map((receipt) => (
                  <tr key={receipt.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {receipt.reference}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {receipt.received_money}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {receipt.date_received}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {receipt.timeSent}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {receipt.isCollected ? (
                        <span className="text-green-600">Collected</span>
                      ) : (
                        <span className="text-red-600">Not Collected</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {receipt.acknowledgedBy || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {receipt.claimedBy || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;
