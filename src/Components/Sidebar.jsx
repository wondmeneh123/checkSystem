import React from "react";
import { NavLink } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FaRegCircleUser } from "react-icons/fa6";
import { MdReport } from "react-icons/md";

const Sidebar = () => {
  const links = [
    {
      name: "Home",
      path: "/home",
      icon: <MdDashboard size={24} />,
    },
    {
      name: "Employee",
      path: "/employee",
      icon: <FaRegCircleUser size={24} />,
    },
    {
      name: "Report",
      path: "/report",
      icon: <MdReport size={24} />,
    },
  ];

  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col shadow-lg">
      <h1 className="text-2xl font-bold text-center py-6 border-b border-gray-700">
        Company Logo
      </h1>
      <nav className="flex-1 mt-4">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-lg transition-colors ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`
                }
              >
                {link.icon}
                <span className="ml-3">{link.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <p className="text-sm text-center text-gray-400">© 2024 Company Name</p>
      </div>
    </div>
  );
};

export default Sidebar;
