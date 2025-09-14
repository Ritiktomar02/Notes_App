import React, { useState, useEffect } from "react";
import TagInput from "../../components/Input/TagInput";
import { MdClose } from "react-icons/md";
import axiosinstance from "../../utils/axiosInstances";

const AddEditNotes = ({ type, noteData, onClose, getallnotes, showToast }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [error, setError] = useState("");

  // pre-fill data in edit mode
  useEffect(() => {
    if (type === "edit" && noteData) {
      setTitle(noteData.title || "");
      setContent(noteData.content || "");
      setTags(noteData.tags || []);
    } else {
      setTitle("");
      setContent("");
      setTags([]);
    }
  }, [type, noteData]);

  const addNewNote = async () => {
    try {
      const res = await axiosinstance.post("/add-note", {
        title,
        content,
        tags,
      });

      if (res.data?.note) {
        getallnotes();
        onClose();
        showToast("Note added successfully", "add");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to add note");
      showToast("Failed to add note", "delete");
    }
  };

  const editNote = async () => {
    try {
      const res = await axiosinstance.put(`/edit-note/${noteData._id}`, {
        title,
        content,
        tags,
      });

      if (res.data?.note) {
        getallnotes();
        onClose();
        showToast("Note updated successfully", "add");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to update note");
      showToast("Failed to update note", "delete");
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      setError("Please enter the title");
      return;
    }
    if (!content.trim()) {
      setError("Please enter the content");
      return;
    }

    setError("");
    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };

  return (
    <div className="relative">
      <button
        className="w-10 h-10 flex items-center justify-center rounded-full absolute -top-3 -right-3 hover:bg-slate-200"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>

      <div className="flex flex-col gap-2">
        <label className="input-label">TITLE</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="go to gym 5pm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">CONTENT</label>
        <textarea
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="Content"
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="mt-3">
        <label className="input-label">Tags</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

      <button
        className="btn-primary font-medium mt-5 p-3"
        onClick={handleSubmit}
      >
        {type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
};

export default AddEditNotes;
