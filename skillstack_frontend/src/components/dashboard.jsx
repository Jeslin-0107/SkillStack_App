import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import api from "../api/axiosInstance";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [skills, setSkills] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // ------------------- Fetch Skills -------------------
  const fetchSkills = async () => {
    try {
      const response = await api.get("skills/");
      setSkills(response.data);
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // ------------------- Chart Data -------------------
  const chartData = {
    labels: skills.map((s) => s.name),
    datasets: [
      {
        label: "Hours Spent",
        data: skills.map((s) => s.hours_spent),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
      },
    ],
  };

  // ------------------- Logout Handlers -------------------
  const handleLogout = () => {
    localStorage.removeItem("access"); // remove token
    window.location.href = "/login"; // redirect to login
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 relative">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-gradient-to-b from-blue-700 bg-pink-500/[71.37%] text-white flex flex-col transition-width duration-300`}
      >
        <div className="flex items-center justify-between p-4 border-b border-blue-800">
          {sidebarOpen && (
            <div>
              <h2 className="text-2xl font-bold">SkillStack</h2>
              <p className="text-sm mt-1">My Study Diary</p>
            </div>
          )}
          <button
            className="text-white focus:outline-none ml-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FaBars />
          </button>
        </div>

        <nav className="flex flex-col mt-6 space-y-4">
          <a href="/dashboard" className="hover:bg-blue-800 px-4 py-2 rounded flex items-center">
            {sidebarOpen && <span>Dashboard</span>}
          </a>
          <a href="/my-skills" className="hover:bg-blue-800 px-4 py-2 rounded flex items-center">
            {sidebarOpen && <span>My Skills</span>}
          </a>
          <a href="/profile" className="hover:bg-blue-800 px-4 py-2 rounded flex items-center">
            {sidebarOpen && <span>Profile</span>}
          </a>
          <a href="/notes" className="hover:bg-blue-800 px-4 py-2 rounded flex items-center">
            {sidebarOpen && <span>Notes</span>}
          </a>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="hover:bg-blue-800 px-4 py-2 rounded mt-auto flex items-center text-left"
          >
            {sidebarOpen && <span>Logout</span>}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold">Total Skills</h2>
            <p className="text-3xl mt-4">{skills.length}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold">Completed</h2>
            <p className="text-3xl mt-4">{skills.filter((s) => s.status === "Completed").length}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold">In Progress</h2>
            <p className="text-3xl mt-4">{skills.filter((s) => s.status === "In Progress").length}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Skill Hours Chart</h2>
          {skills.length > 0 ? (
            <Bar data={chartData} options={{ responsive: true }} />
          ) : (
            <p className="text-gray-500">No skills yet. Add skills to see the chart!</p>
          )}
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-96 text-center">
            <h2 className="text-xl font-bold mb-4">Are you sure you want to logout?</h2>
            <div className="flex justify-around mt-6">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
              <button
                onClick={handleCancelLogout}
                className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
