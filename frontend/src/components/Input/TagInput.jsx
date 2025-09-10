import React, { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";

const TagInput = ({ tags, setTags }) => {
  const [inputvalue, setinputvalue] = useState("");

  const handleinputchange = (e) => {
    setinputvalue(e.target.value);
  };

  const addNewtags = () => {
    if (inputvalue.trim() != "") {
      setTags([...tags, inputvalue.trim()]);
      setinputvalue("");
    }
  };

  const handlekeydown = (e) => {
    if (e.key == "Enter") {
      addNewtags();
    }
  };

  const removeTag = (value) => {
    setTags(tags.filter((tag) => tag !== value));
  };

  return (
    <div>
      {tags?.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {tags.map((tag, index) => (
            <span key={index} className="flex items-center gap-2 text-sm text-slate-900 bg-slate-100 px-3 py-1 rounded">
              #{tag}
              <button onClick={() => removeTag(tag)}>
                <MdClose />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 mt-3">
        <input
          value={inputvalue} 
          type="text"
          className="text-sm bg-transparent border px-3 py-2 rounded outline-none"
          onChange={handleinputchange}
          onKeyDown={handlekeydown}
        ></input>

        <button
          className="w-8 h-8 flex items-center justify-center rounded border border-blue-700 hover:bg-blue-700"
          onClick={() => addNewtags()}
        >
          <MdAdd className="text-2xl text-blue-700 hover:text-white " />
        </button>
      </div>
    </div>
  );
};

export default TagInput;
