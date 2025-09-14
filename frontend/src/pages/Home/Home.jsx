import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosinstance from "../../utils/axiosInstances";
import Toast from "../../components/ToastMessage/ToastMessage";
import EmptyCard from "../../components/EmptyCard/EmptyCard";

// Place this once in your app entry point (index.js or App.js)
Modal.setAppElement("#root");

const Home = () => {
  const [openAddEditmodal, setopenAddEditmodal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [toastmsg, settoastmsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [userInfo, setuserInfo] = useState(null);
  const [notes, setnotes] = useState([]);

  const [isSearch, setisSearch] = useState(false);

  const navigate = useNavigate();

  const handleEdit = (noteDetail) => {
    setopenAddEditmodal({ isShown: true, type: "edit", data: noteDetail });
  };

  const shownToastMessage = (message, type) => {
    settoastmsg({
      isShown: true,
      message,
      type,
    });
  };

  const handleCloseToast = () => {
    settoastmsg({
      isShown: false,
      message: "",
    });
  };

  const getuserinfo = async () => {
    try {
      const res = await axiosinstance.get("/get-user");
      if (res.data?.user) {
        setuserInfo(res.data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        console.error("Failed to fetch user info", error);
      }
    }
  };

  const getallnotes = async () => {
    try {
      const res = await axiosinstance.get("/get-all-notes");
      if (res.data?.notes) {
        setnotes(res.data.notes);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        console.error("Failed to fetch notes", error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosinstance.delete(`/delete-note/${id}`);
      getallnotes();
      shownToastMessage("Note deleted successfully", "delete");
    } catch (error) {
      console.error("Failed to delete note", error);
      shownToastMessage("Failed to delete note", "delete");
    }
  };

  const handlePin = async (id, isPinned) => {
    try {
      await axiosinstance.patch(`/update-note-pinned/${id}`, {
        isPinned: !isPinned,
      });
      getallnotes();
      shownToastMessage(
        isPinned ? "Note unpinned successfully" : "Note pinned successfully",
        "add"
      );
    } catch (error) {
      console.error("Failed to pin/unpin note", error);
      shownToastMessage("Failed to pin/unpin note", "delete");
    }
  };

  const onSearchNote = async (query) => {
    try {
      const res = await axiosinstance.get("/search-notes", {
        params: { query },
      });

      if (res.data && res.data?.notes) {
        setisSearch(true);
        setnotes(res.data.notes);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClearSearch = () => {
    setisSearch(false);
    getallnotes();
  };

  useEffect(() => {
    getuserinfo();
    getallnotes();
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto">
        {notes.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 mt-8">
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                title={note.title}
                date={new Date(note.createdAt).toLocaleDateString()}
                content={note.content}
                tags={note.tags}
                isPinned={note.isPinned}
                onEdit={() => handleEdit(note)}
                onDelete={() => handleDelete(note._id)}
                onPinNote={() => handlePin(note._id, note.isPinned)}
              />
            ))}
          </div>
        ) : isSearch ? (
          <div className="flex flex-col items-center justify-center mt-20">
            <p className="w-1/2 text-sm font-medium text-slate-700 text-center leading-7 mt-5">
              Oops! No notes found matching your search.
            </p>
          </div>
        ) : (
          <EmptyCard />
        )}
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
          onClose={() =>
            setopenAddEditmodal({ isShown: false, type: "add", data: null })
          }
          getallnotes={getallnotes}
          showToast={shownToastMessage} // ✅ pass toast down
        />
      </Modal>

      <Toast
        isShown={toastmsg.isShown}
        message={toastmsg.message}
        type={toastmsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;
