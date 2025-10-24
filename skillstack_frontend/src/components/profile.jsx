import React, { useState, useEffect } from "react";
import api from "../api/axiosInstance";

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editMode, setEditMode] = useState(false);

  // Fetch profile on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile/");
        setProfile(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Handle file select
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Save profile changes
  const handleSave = async () => {
    const formData = new FormData();
    if (bio) formData.append("bio", bio);
    if (image) formData.append("profile_image", image);

    try {
      const res = await api.put("/profile/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile(res.data);
      setBio("");
      setImage(null);
      setMessage("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setMessage("Failed to update profile");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="flex justify-center items-start min-h-screen bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md flex flex-col items-center">

        {/* Profile Image */}
        <img
          src={
            profile.profile_image
              ? `http://127.0.0.1:8000${profile.profile_image}`
              : "https://via.placeholder.com/120"
          }
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-400 mb-4"
        />

        {/* Username & Email */}
        <h2 className="text-2xl font-bold">{profile.username || "Username"}</h2>
        <p className="text-gray-600 mb-2">
          {profile.email || "Email"}{" "}
          {profile.is_verified && <span className="text-green-600">(Verified)</span>}
        </p>

        {/* Bio */}
        {!editMode ? (
          <p className="text-gray-700 mb-4">{profile.bio || "No bio yet"}</p>
        ) : (
          <input
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write a short bio..."
            className="border p-2 w-full rounded mb-4 text-center"
          />
        )}

        {/* File upload (only in edit mode) */}
        {editMode && (
          <input type="file" onChange={handleFileChange} className="mb-4" />
        )}

        {/* Edit / Save Button */}
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition mb-2"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition mb-2"
          >
            Save
          </button>
        )}

        {/* Change Password Button */}
        <a
          href="/change-password"
          className="text-blue-600 hover:underline"
        >
          Change Password
        </a>

        {/* Message */}
        {message && <p className="text-green-600 mt-2">{message}</p>}
      </div>
    </div>
  );
};

export default Profile;
