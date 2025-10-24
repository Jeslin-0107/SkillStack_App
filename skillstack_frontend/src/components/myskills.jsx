import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";


Modal.setAppElement("#root"); // important for accessibility

const MySkills = () => {
  const [skills, setSkills] = useState([]);
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: "",
    resource_type: "",
    platform: "",
    hours_spent: 0,
    difficulty: "Easy",
    status: "Not Started",
    certification_name: "",
    certification_link: "",
  });

  const token = localStorage.getItem("access");
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

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

  // ------------------- Add Skill -------------------
  const handleNewSkillChange = (e) => {
    const { name, value } = e.target;
    setNewSkill({ ...newSkill, [name]: value });
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/skills/", newSkill, axiosConfig);
      fetchSkills();
      setModalOpen(false);
      setNewSkill({
        name: "",
        resource_type: "",
        platform: "",
        hours_spent: 0,
        difficulty: "Easy",
        status: "Not Started",
        certification_name: "",
        certification_link: "",
      });
    } catch (error) {
      console.error("Failed to add skill:", error);
    }
  };

  // ------------------- Edit/Delete (same as before) -------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/skills/${id}/`, axiosConfig);
      setSkills(skills.filter((skill) => skill.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleEdit = (skill) => {
    setEditingSkillId(skill.id);
    setEditFormData({ ...skill });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/skills/${editingSkillId}/`,
        editFormData,
        axiosConfig
      );
      setEditingSkillId(null);
      fetchSkills();
    } catch (error) {
      console.error("Edit failed:", error);
    }
  };

  // Chart data
  const chartData = skills.map((skill) => ({ name: skill.name, hours: skill.hours_spent }));

  return (
    <div className="p-6 bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100  min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Skills</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          + Add Skill
        </button>
      </div>

      {/* ------------------- Chart ------------------- */}
      {skills.length > 0 && (
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">Skill Hours Spent</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="hours" fill="#1D4ED8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ------------------- Skills Grid ------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <div key={skill.id} className="bg-white shadow-lg rounded-lg p-4 relative hover:shadow-xl transition">
            {editingSkillId === skill.id ? (
              <form onSubmit={handleEditSubmit} className="space-y-2">
                <input type="text" name="name" value={editFormData.name} onChange={handleEditChange} className="border p-1 w-full rounded" />
                <input type="text" name="resource_type" value={editFormData.resource_type} onChange={handleEditChange} className="border p-1 w-full rounded" />
                <input type="text" name="platform" value={editFormData.platform} onChange={handleEditChange} className="border p-1 w-full rounded" />
                <input type="number" name="hours_spent" value={editFormData.hours_spent} onChange={handleEditChange} className="border p-1 w-full rounded" />
                <select name="difficulty" value={editFormData.difficulty} onChange={handleEditChange} className="border p-1 w-full rounded">
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
                <select name="status" value={editFormData.status} onChange={handleEditChange} className="border p-1 w-full rounded">
                  <option>Not Started</option>
                  <option>Started</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
                <input type="text" name="certification_name" value={editFormData.certification_name} onChange={handleEditChange} className="border p-1 w-full rounded" />
                <input type="text" name="certification_link" value={editFormData.certification_link} onChange={handleEditChange} className="border p-1 w-full rounded" />
                <div className="flex justify-end space-x-2">
                  <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Save</button>
                  <button type="button" onClick={() => setEditingSkillId(null)} className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400">Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <h3 className="text-lg font-bold">{skill.name}</h3>
                <p className="text-gray-600">{skill.resource_type}</p>
                <p className="text-gray-600">{skill.platform}</p>
                <p className="text-gray-800 mt-2">Status: <span className="font-semibold">{skill.status}</span></p>
                <p className="text-gray-800 mt-1">Difficulty: <span className="font-semibold">{skill.difficulty}</span></p>
                <p className="text-gray-500 mt-2">Certification: {skill.certification_name} | Link: {skill.certification_link}</p>
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button onClick={() => handleEdit(skill)} className="text-blue-500 hover:text-blue-700">Edit</button>
                  <button onClick={() => handleDelete(skill.id)} className="text-red-500 hover:text-red-700">Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* ------------------- Add Skill Modal ------------------- */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="bg-white p-6 max-w-lg mx-auto mt-20 rounded shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start"
      >
        <h2 className="text-xl font-bold mb-4">Add New Skill</h2>
        <form onSubmit={handleAddSkill} className="space-y-2">
          <input type="text" name="name" value={newSkill.name} onChange={handleNewSkillChange} placeholder="Skill Name" className="border p-2 w-full rounded" required />
          <input type="text" name="resource_type" value={newSkill.resource_type} onChange={handleNewSkillChange} placeholder="Resource Type" className="border p-2 w-full rounded" />
          <input type="text" name="platform" value={newSkill.platform} onChange={handleNewSkillChange} placeholder="Platform" className="border p-2 w-full rounded" />
          <input type="number" name="hours_spent" value={newSkill.hours_spent} onChange={handleNewSkillChange} placeholder="Hours Spent" className="border p-2 w-full rounded" />
          <select name="difficulty" value={newSkill.difficulty} onChange={handleNewSkillChange} className="border p-2 w-full rounded">
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
          <select name="status" value={newSkill.status} onChange={handleNewSkillChange} className="border p-2 w-full rounded">
            <option>Not Started</option>
            <option>Started</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <input type="text" name="certification_name" value={newSkill.certification_name} onChange={handleNewSkillChange} placeholder="Certification Name" className="border p-2 w-full rounded" />
          <input type="text" name="certification_link" value={newSkill.certification_link} onChange={handleNewSkillChange} placeholder="Certification Link" className="border p-2 w-full rounded" />
          <div className="flex justify-end space-x-2 mt-2">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add</button>
            <button type="button" onClick={() => setModalOpen(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MySkills;
