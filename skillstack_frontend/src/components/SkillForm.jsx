import React, { useState, useEffect } from "react";
import axios from "axios";

const SkillForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    resource_type: "",
    platform: "",
    hours_spent: 0,
    difficulty: "Easy",
    status: "Not Started",
    certification_name: "",
    certification_link: "",
  });

  const [skills, setSkills] = useState([]); // To show all skills

  // Get JWT token from localStorage (must save it after login)
  const token = localStorage.getItem("access"); 

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`, // Send JWT token
    },
  };

  // Fetch all skills inside useEffect to avoid ESLint warnings
  useEffect(() => {
    const fetchSkills = async () => {
      const token = localStorage.getItem("access"); // inside effect
      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/skills/",
          axiosConfig
        );
        setSkills(response.data);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();
  }, []); // Empty dependency array, runs once

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/skills/",
        formData,
        axiosConfig
      );
      alert("Skill added successfully!");
      
      // Reset form
      setFormData({
        name: "",
        resource_type: "",
        platform: "",
        hours_spent: 0,
        difficulty: "Easy",
        status: "Not Started",
        certification_name: "",
        certification_link: "",
      });

      // Refresh skills list
      const response = await axios.get(
        "http://127.0.0.1:8000/api/skills/",
        axiosConfig
      );
      setSkills(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to add skill! Check console for details.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h2>Add a New Skill</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Skill Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="text"
          name="resource_type"
          placeholder="Resource Type"
          value={formData.resource_type}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="text"
          name="platform"
          placeholder="Platform"
          value={formData.platform}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="number"
          name="hours_spent"
          placeholder="Hours Spent"
          value={formData.hours_spent}
          onChange={handleChange}
          min="0"
          step="0.1"
        />
        <br /><br />

        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <br /><br />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="Not Started">Not Started</option>
          <option value="Started">Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <br /><br />

        <input
          type="text"
          name="certification_name"
          placeholder="Certification Name"
          value={formData.certification_name}
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="text"
          name="certification_link"
          placeholder="Certification Link"
          value={formData.certification_link}
          onChange={handleChange}
        />
        <br /><br />

        <button type="submit">Submit</button>
      </form>

      <h2>All Skills</h2>
      <ul>
        {skills.map((skill) => (
          <li key={skill.id}>
            <strong>{skill.name}</strong> | {skill.resource_type} | {skill.platform} | {skill.hours_spent} hrs | Difficulty: {skill.difficulty} | Status: {skill.status} <br />
            Certification: {skill.certification_name} | Link: {skill.certification_link}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SkillForm;
