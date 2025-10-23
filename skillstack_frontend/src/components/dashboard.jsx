import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import axios from "axios";
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [skills, setSkills] = useState([]);

  const token = localStorage.getItem("access");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchSkills = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/skills/", axiosConfig);
      setSkills(response.data);
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // Prepare data for chart
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

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100">

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-gradient-to-b from-blue-700 to-indigo-700 text-white flex flex-col transition-width duration-300`}
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
          <a
            href="/dashboard"
            className="hover:bg-blue-800 px-4 py-2 rounded flex items-center"
          >
            {sidebarOpen && <span>Dashboard</span>}
          </a>
          <a
            href="/my-skills"
            className="hover:bg-blue-800 px-4 py-2 rounded flex items-center"
          >
            {sidebarOpen && <span>My Skills</span>}
          </a>
          <a
            href="#"
            className="hover:bg-blue-800 px-4 py-2 rounded flex items-center"
          >
            {sidebarOpen && <span>Profile</span>}
          </a>
          <a
            href="/login"
            className="hover:bg-blue-800 px-4 py-2 rounded mt-auto flex items-center"
          >
            {sidebarOpen && <span>Logout</span>}
          </a>
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
            <p className="text-3xl mt-4">
              {skills.filter((s) => s.status === "Completed").length}
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold">In Progress</h2>
            <p className="text-3xl mt-4">
              {skills.filter((s) => s.status === "In Progress").length}
            </p>
          </div>
        </div>

        {/* Add Skill Button */}
        <div className="text-center mb-6">
          <button className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition">
            + Add Skill
          </button>
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
    </div>
  );
};

export default Dashboard;
