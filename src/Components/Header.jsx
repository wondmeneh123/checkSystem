import React from "react";

const Header = ({ user, onLogout }) => {
  return (
    <div className="bg-indigo-600 text-white p-4 flex items-center justify-between">
      <h1 className="text-xl font-bold">Pyramid Hotel</h1>
      {user ? (
        <div className="flex items-center space-x-4">
          <p>Welcome, {user.email}</p>
          <button
            onClick={onLogout}
            className="bg-red-500 px-4 py-1 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <p>Please log in to continue</p>
      )}
    </div>
  );
};

export default Header;
