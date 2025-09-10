import React, { useState } from "react";
import TagInput from "../../components/Input/TagInput";
import { MdClose } from "react-icons/md";

const AddEditNotes = ({ type, noteData, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setcontent] = useState("");
  const [tags, setTags] = useState([]);

  const [error, seterror] = useState("");

  const addNewNote = async () => {};

  const editNote = async () => {};

  const handleAddNote = () => {
    if (!title) {
      seterror("Please enter the title");
      return;
    }

    if (!content) {
      seterror("Please enter the Content");
      return;
    }

    seterror("");

    if (type === "edit") {
      editNote();
    } else {
      addNewNote()
    }
  };

  return (
    <div className="relative">
      <button
        className="w-10 h-10 flex items-center justify-center rounded-full absolute -top-3 -right-3 hover:bg-slate-500"
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
          onChange={(e) => setcontent(e.target.value)}
        />
      </div>

      <div className="mt-3">
        <label className="input-label">Tags</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

      <button
        className="btn-primary font-medium mt-5 p-3"
        onClick={() => {
          handleAddNote();
        }}
      >
        ADD
      </button>
    </div>
  );
};

export default AddEditNotes;
