import React, { useState, useEffect } from "react";
import api from "../api/axiosInstance";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [summary, setSummary] = useState("");
  const [editingNote, setEditingNote] = useState(null);

  // Fetch skills and notes on component mount
  useEffect(() => {
    fetchSkills();
    fetchNotes();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await api.get("skills/");
      setSkills(response.data);
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await api.get("notes/");
      setNotes(response.data);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  };

  // Summarize note content using OpenAI
  const handleSummarize = async () => {
    if (!noteContent) {
      alert("Please write something to summarize!");
      return;
    }

    try {
      const response = await api.post("summarize-notes/", {
        note_contents: [noteContent],
      });
      setSummary(response.data.summary);
    } catch (error) {
      console.error("Summarization failed:", error);
      alert("Failed to summarize note.");
    }
  };

  // Add or update note
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSkill) {
      alert("Please select a skill!");
      return;
    }

    try {
      const payload = {
        skill: selectedSkill,
        content: summary || noteContent, // Use summary if available
      };

      if (editingNote) {
        await api.put(`notes/${editingNote.id}/`, payload);
      } else {
        await api.post("notes/", payload);
      }

      // Reset form
      setNoteContent("");
      setSelectedSkill("");
      setSummary("");
      setEditingNote(null);

      fetchNotes();
    } catch (error) {
      console.error("Failed to save note:", error);
      alert("Failed to save note.");
    }
  };

  // Edit note
  const handleEdit = (note) => {
    setEditingNote(note);
    setSelectedSkill(note.skill);
    setNoteContent(note.content);
    setSummary("");
  };

  // Delete note
  const handleDelete = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await api.delete(`notes/${noteId}/`);
      fetchNotes();
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Notes</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-6 mb-6"
      >
        {/* Skill Selector */}
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

        {/* Note Content */}
        <textarea
          className="border p-2 rounded w-full mb-4"
          placeholder="Write your note..."
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          required
        />

        {/* Summary Display */}
        {summary && (
          <div className="bg-gray-100 p-3 rounded mb-4">
            <strong>Summary:</strong>
            <p>{summary}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={handleSummarize}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
          >
            Summarize Note
          </button>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            {editingNote ? "Update Note" : "Add Note"}
          </button>
        </div>
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
