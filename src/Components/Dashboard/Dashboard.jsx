import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-6 font-bold text-xl border-b">My Dashboard</div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link to="/" className="block px-4 py-2 hover:bg-gray-200 rounded">
                Home
              </Link>
            </li>
            <li>
              <Link to="/analytics" className="block px-4 py-2 hover:bg-gray-200 rounded">
                Analytics
              </Link>
            </li>
            <li>
              <Link to="/reports" className="block px-4 py-2 hover:bg-gray-200 rounded">
                Reports
              </Link>
            </li>
            <li>
              <Link to="/settings" className="block px-4 py-2 hover:bg-gray-200 rounded">
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              New Report
            </button>
        </header>

        {/* Main Body */}
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Example Cards */}
            <div className="bg-white p-4 shadow rounded">
              <h2 className="text-lg font-semibold">Total Users</h2>
              <p className="text-2xl mt-2">1,234</p>
            </div>
            <div className="bg-white p-4 shadow rounded">
              <h2 className="text-lg font-semibold">Active Sessions</h2>
              <p className="text-2xl mt-2">567</p>
            </div>
            <div className="bg-white p-4 shadow rounded">
              <h2 className="text-lg font-semibold">Sales Today</h2>
              <p className="text-2xl mt-2">$3,210</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
