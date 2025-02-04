import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../fb"; // Firestore initialization
import Sidebar from "../Components/Sidebar";

const CreateEmployee = () => {
  const [formData, setFormData] = useState({
    name: "",
    role: "cashier", // Default role
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, role, email, password } = formData;

    if (!name || !role || !email || !password) {
      setMessage("All fields are required.");
      return;
    }

    try {
      // Create user in Firebase Auth

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save employee details in Firestore
      const userDocRef = doc(db, "employees", user.uid);
      await setDoc(userDocRef, {
        name,
        role,
        email,
        uid: user.uid,
      });

      setMessage("Employee created successfully!");
      setFormData({
        name: "",
        role: "cashier",
        email: "",
        password: "",
      });
    } catch (error) {
      console.error("Error creating employee:", error);
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div className="flex w-full">
      <Sidebar />
      <div className="min-h-screen bg-gray-100 flex items-center w-full justify-center">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
            Create Employee
          </h1>
          {message && <p className="text-center text-green-500">{message}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter employee name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="cashier">Cashier</option>
                <option value="waiter">Waiter</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter employee email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter employee password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Create Employee
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEmployee;
