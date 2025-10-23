import React, { useState, useEffect } from "react";
import axios from "axios";

const MySkills = () => {
  const [skills, setSkills] = useState([]);

  // JWT token from localStorage
  const token = localStorage.getItem("access");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Fetch all skills from backend
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Skills</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <div key={skill.id} className="bg-white shadow rounded-lg p-4">
            <h2 className="font-semibold text-lg">{skill.name}</h2>
            <p>Resource: {skill.resource_type}</p>
            <p>Platform: {skill.platform}</p>
            <p>Hours: {skill.hours_spent}</p>
            <p>Difficulty: {skill.difficulty}</p>
            <p>Status: {skill.status}</p>
            <p>Certification: {skill.certification_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MySkills;
