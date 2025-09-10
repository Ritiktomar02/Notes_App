import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";

Modal.setAppElement("#root"); // place this at app entry once

const Home = () => {
  const [openAddEditmodal, setopenAddEditmodal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  return (
    <>
      <Navbar />
      <div className="container mx-auto ">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
          <NoteCard
            title="Meeting on 7 april"
            date="3rd april 2024"
            content="fasdfsdaf fgasfsdf"
            tags="#meeting #fasdfs"
            isPinned={true}
            onEdit={() => {}}
            onDelete={() => {}}
            onPinNote={() => {}}
          />
          {/* repeat other cards */}
        </div>
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-[#2B85FF] hover:bg-blue-600 absolute right-10 bottom-10 "
        onClick={() =>
          setopenAddEditmodal({ isShown: true, type: "add", data: null })
        }
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditmodal.isShown}
        onRequestClose={() =>
          setopenAddEditmodal((prev) => ({ ...prev, isShown: false }))
        }
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel="Add or edit note"
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes 
        type={openAddEditmodal.type}
        noteData={openAddEditmodal.data}
        onClose={()=>{setopenAddEditmodal({isShown: false, type: "add", data: null})}} />
      </Modal>
    </>
  );
};

export default Home;
