import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./index.css";
import CheckReceipt from "./Pages/CheckReceipt.jsx";
import CreateEmplyee from "./Pages/CreateEmplyee.jsx";
import Emplyee from "./Pages/Emplyee.jsx";
import Report from "./Pages/Report.jsx";
import Auth from "./Pages/Auth.jsx";
import Header from "./Components/Header.jsx"; // Import Header component
import Home from "./Pages/Home.jsx";

const ProtectedRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/" />;
};

const App = () => {
  const [user, setUser] = useState(() => {
    // Initialize user from localStorage
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Clear user session
  };

  const handleLogin = (user) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user)); // Save user session
  };

  return (
    <StrictMode>
      <BrowserRouter>
        <Header user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/login" element={<Auth onLogin={handleLogin} />} />
          <Route
            path="/create"
            element={
              <ProtectedRoute user={user}>
                <CreateEmplyee />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee"
            element={
              <ProtectedRoute user={user}>
                <Emplyee />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report"
            element={
              <ProtectedRoute user={user}>
                <Report />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute user={user}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<CheckReceipt />} />
          <Route path="*" element={<h1>404: Page Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  );
};

createRoot(document.getElementById("root")).render(<App />);
