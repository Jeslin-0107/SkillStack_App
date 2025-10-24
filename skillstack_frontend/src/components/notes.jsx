import React, { useState, useEffect } from "react";
import api from "../api/axiosInstance"; // ✅ using our token-safe Axios instance

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [editingNote, setEditingNote] = useState(null);

  // Fetch all notes
  const fetchNotes = async () => {
    try {
      const response = await api.get("notes/"); // ✅ token auto-attached
      setNotes(response.data);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  };

  // Fetch all skills for dropdown
  const fetchSkills = async () => {
    try {
      const response = await api.get("skills/"); // ✅ token auto-attached
      setSkills(response.data);
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
    fetchSkills();
  }, []);

  // Add or Edit Note
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNote) {
        // Update note
        await api.put(`notes/${editingNote.id}/`, {
          skill: selectedSkill,
          content: noteContent,
        });
        setEditingNote(null);
      } else {
        // Add new note
        await api.post("notes/", {
          skill: selectedSkill,
          content: noteContent,
        });
      }
      setNoteContent("");
      setSelectedSkill("");
      fetchNotes(); // refresh list
    } catch (error) {
      console.error(error);
      alert("Failed to save note.");
    }
  };

  // Delete Note
  const handleDelete = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await api.delete(`notes/${noteId}/`);
      fetchNotes();
    } catch (error) {
      console.error(error);
      alert("Failed to delete note.");
    }
  };

  // Edit Note
  const handleEdit = (note) => {
    setEditingNote(note);
    setSelectedSkill(note.skill);
    setNoteContent(note.content);
  };

  return (
    <div className="p-8 bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100  min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Notes</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-6 mb-6"
      >
        <select
          className="border p-2 rounded w-full mb-4"
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
          required
        >
          <option value="">Select Skill</option>
          {skills.map((skill) => (
            <option key={skill.id} value={skill.id}>
              {skill.name}
            </option>
          ))}
        </select>

        <textarea
          className="border p-2 rounded w-full mb-4"
          placeholder="Write your note..."
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
        >
          {editingNote ? "Update Note" : "Add Note"}
        </button>
      </form>

      {/* Notes List */}
      <div className="grid gap-4">
        {notes.map((note) => (
          <div key={note.id} className="bg-white p-4 shadow rounded-lg">
            <h2 className="font-semibold mb-2">
              Skill: {note.skill_name || "Unknown Skill"}
            </h2>
            <p className="mb-2">{note.content}</p>
            <p className="text-gray-400 text-sm">
              Created at: {new Date(note.created_at).toLocaleString()}
            </p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => handleEdit(note)}
                className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(note.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;
