import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="w-80 flex items-center bg-slate-100 rounded-md">
      <input
        type="text"
        value={value}
        className="w-full text-xs bg-transparent py-[11px] outline-none"
        placeholder="Search Notes"
        onChange={onChange}
      />

      {value && (
        <IoMdClose
          onClick={onClearSearch}
          className="text-slate-500 cursor-pointer hover:text-black mr-3"
        />
      )}

      <FaMagnifyingGlass
        className="text-slate-400 cursor-pointer hover:text-black"
        onClick={handleSearch}
      />
    </div>
  );
};

export default SearchBar;
