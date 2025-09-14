import React from "react";
import addNote from "../../assets/images/add-note.svg"; // Make sure path & name are exact

const EmptyCard = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      {/* SVG used as <img> */}
      <img
        src={addNote}
        alt="Add note"
        className="w-60"
      />
      <p className="w-1/2 tex-sm font-medium text-slate-700 text-center leading-7 mt-5">Start creating your first note! Click the 'Add' button to jot down your thoughts, idea, and reminders. Let's get started! </p>
    </div>
  );
};

export default EmptyCard;
