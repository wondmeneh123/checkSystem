import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../fb"; // Firestore configuration
import { Link } from "react-router-dom";

const Emplyee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(5); // Number of employees per page

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "employees"));
        const employeeData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEmployees(employeeData);
      } catch (error) {
        console.error("Error fetching employees: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold mb-4">Employees</h1>
          <Link
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition"
            to="/create"
          >
            Add New
          </Link>
        </div>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <>
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentEmployees.map((employee) => (
                    <tr key={employee.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.email}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex justify-center items-center mt-4">
              <nav className="flex space-x-2">
                {Array.from(
                  { length: Math.ceil(employees.length / employeesPerPage) },
                  (_, i) => (
                    <button
                      key={i}
                      onClick={() => paginate(i + 1)}
                      className={`px-4 py-2 rounded ${
                        currentPage === i + 1
                          ? "bg-indigo-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      } hover:bg-indigo-600 hover:text-white transition`}
                    >
                      {i + 1}
                    </button>
                  )
                )}
              </nav>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Emplyee;
