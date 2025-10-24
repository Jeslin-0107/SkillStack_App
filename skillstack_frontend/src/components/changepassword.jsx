import React, { useState } from "react";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // for redirect

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setMessage("");
      return;
    }

    try {
      const res = await api.post("/change-password/", { new_password: newPassword });
      setMessage(res.data.message);
      setError("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (err) {
      console.error("Password change failed:", err);
      setError(err.response?.data?.error || "Something went wrong");
      setMessage("");
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Change Password</h2>

        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          className="border p-2 w-full rounded mb-4"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="border p-2 w-full rounded mb-4"
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition mb-2"
        >
          Change Password
        </button>

        {message && <p className="text-green-600 mt-2">{message}</p>}
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default ChangePassword;
