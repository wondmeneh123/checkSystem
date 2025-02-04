import React from "react";
import Sidebar from "../Components/Sidebar";

const Home = () => {
  const metrics = [
    { title: "Total Employees", value: 45, icon: "👤", bgColor: "bg-blue-500" },
    {
      title: "Receipts Today",
      value: 120,
      icon: "🧾",
      bgColor: "bg-green-500",
    },
    {
      title: "Pending Claims",
      value: 15,
      icon: "⏳",
      bgColor: "bg-yellow-500",
    },
    {
      title: "Collected Revenue",
      value: "12,340 ETB",
      icon: "💰",
      bgColor: "bg-indigo-500",
    },
  ];

  return (
    <div className="flex w-full min-h-screen bg-gray-100 ">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Pyramid Hotel Dashboard
        </h1>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg shadow-lg text-white ${metric.bgColor}`}
            >
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{metric.icon}</div>
                <div>
                  <h2 className="text-lg font-semibold">{metric.title}</h2>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Widgets Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart Widget */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Revenue Analytics</h2>
            <div className="h-64 flex items-center justify-center">
              <p>Chart Placeholder</p>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <p className="text-sm">
                  Employee John Doe claimed receipt #1234
                </p>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                <p className="text-sm">New employee Mary added as cashier</p>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                <p className="text-sm">Receipt #5678 is pending review</p>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <p className="text-sm">
                  Employee John Doe claimed receipt #1234
                </p>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                <p className="text-sm">New employee Mary added as cashier</p>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                <p className="text-sm">Receipt #5678 is pending review</p>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <p className="text-sm">
                  Employee John Doe claimed receipt #1234
                </p>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                <p className="text-sm">New employee Mary added as cashier</p>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                <p className="text-sm">Receipt #5678 is pending review</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
