import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  // Handle actual logout
  const handleLogout = () => {
    // Remove tokens or any auth info
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    // Redirect to login
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Are you sure you want to logout?</h2>
        <p className="text-gray-600 mb-6">You will be redirected to the login page.</p>

        <div className="flex justify-center gap-4">
          {/* Cancel button */}
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold transition"
          >
            Cancel
          </button>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="px-6 py-2 rounded bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 text-white font-semibold hover:from-purple-500 hover:via-pink-500 hover:to-yellow-500 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
