require("dotenv").config();
const config = require("./config.json");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/user.model");
const Note = require("./models/note.model");
const { authenticationToken } = require("./utilities"); // you need to implement this

const app = express();

mongoose
  .connect(config.connectionString)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

app.post("/create-account", async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Account created successfully",
      user: {
        id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
      accessToken:token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/get-user", authenticationToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); 
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      user:user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/add-note", authenticationToken, async (req, res) => {
  try {
    const { title, content, tags,  } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Title required" });
    }

     if (!content) {
      return res.status(400).json({ success: false, message: "Content required" });
    }

    const note = await Note.create({
      title,
      content: content || "",
      tags: tags || [],
      userId: req.user.id, 
    });

    res.status(201).json({
      success: true,
      message: "Note added successfully",
      note,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.put("/edit-note/:noteId", authenticationToken, async (req, res) => {
  try {
    const { noteId } = req.params;
    const { title, content, tags, isPinned } = req.body;

    const note = await Note.findOne({ _id: noteId, userId: req.user.id });
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (tags !== undefined) note.tags = tags;
    if (isPinned !== undefined) note.isPinned = isPinned;

    await note.save();

    res.json({
      success: true,
      message: "Note updated successfully",
      note,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/get-all-notes", authenticationToken, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({ isPinned: -1, createdAt: -1 });
    res.json({
      success: true,
      count: notes.length,
      notes:notes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.delete("/delete-note/:noteId", authenticationToken, async (req, res) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findOneAndDelete({
      _id: noteId,
      userId: req.user.id,
    });

    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    res.json({ success: true, message: "Note deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.patch("/update-note-pinned/:noteId", authenticationToken, async (req, res) => {
  try {
    const { noteId } = req.params;
    const { isPinned } = req.body; // expects boolean true/false

    const note = await Note.findOne({ _id: noteId, userId: req.user.id });
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    note.isPinned = isPinned; // set pinned state
    await note.save();

    res.json({
      success: true,
      message: `Note ${isPinned ? "pinned" : "unpinned"} successfully`,
      note,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/search-notes", authenticationToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }
    const regex = new RegExp(query, "i");

    const notes = await Note.find({
      userId,
      $or: [
        { title: regex },
        { content: regex },
        { tags: regex }, 
      ],
    }).sort({ isPinned: -1, createdAt: -1 });

    res.json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (err) {
    console.error("Error in /search-notes:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});

module.exports = app;
