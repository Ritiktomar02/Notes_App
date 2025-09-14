import React, { useState } from "react";
import ProfileInfo from "../Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {
  const [searchquery, setsearchquery] = useState("");

  const navigate = useNavigate();

  const onlogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    if (searchquery) {
      onSearchNote(searchquery);
    }
  };

  const onClearSearch = () => {
    setsearchquery("");
    handleClearSearch();
  };
  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <h2 className="text-xl font-medium text-black  py-2">Notes</h2>

      <SearchBar
        value={searchquery}
        onChange={(e) => setsearchquery(e.target.value)}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />
      <ProfileInfo userInfo={userInfo} onLogout={onlogout} />
    </div>
  );
};

export default Navbar;
