const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");
const { db } = require("../models/User");

//Route 0: Get all data in home page: GET : /api/notes/getalldata, login not required
const getAllData = async (req, res) => {
  // console.log("get all data ", req.body);
  try {
    const notes = await Notes.find();
    // console.log("notes: ", notes);
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal error occurred");
  }
};

// Route 1: Fetch user data  GET: /api/notes/fetchdata , Login required
const fetchData = async (req, res) => {
  // console.log("fetch data ", req.body);
  try {
    // console.log("fetching data....");
    const notes = await Notes.find({ user: req.user._id });
    // console.log("notes: ", notes);
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal error occurred");
  }
};

// Route 2: Add notes POST: /api/notes/addnotes , Login required
const addNotes = async (req, res) => {
  console.log("user id: ", req.user.id);
  console.log("Inside add note:", req.body);
  const { title, description, tag } = req.body;
  try {
    // finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400, "Place to be filled.")
        .json({ errors: errors.array() });
    }

    const note = new Notes({
      title,
      description,
      tag,
      user: req.user.id,
    });
    const savedNote = await note.save();
    console.log("savedNote", savedNote);
    res.json(savedNote);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal error occurred");
  }
};
// Route 3: update notes PUT: /api/notes/updatenotes , Login required
const updateNotes = async (req, res) => {
  // console.log("getting the id", req.user.id);
  const { title, description, tag } = req.body;
  // console.log("update:", req.body);
  try {
    // create new note object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    // console.log("newNote:", newNote);

    // find the note to be updated and update it
    // console.log(req.params.id);
    let note = await Notes.findById(req.params.id);
    // console.log("note:", note);
    if (!note) {
      return res.status(404).send("Not Found");
    }
    // console.log("note user:", note.user);
    if (note.user.toString() !== req.user._id) {
      return res.status(401).send("Not allowed");
    }

    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    ); // here new:true means if any new content comes it will get updated
    // console.log("editted note:", note);
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal error occurred");
  }
};
// Route 4: Delete a note: DELETE: api/notes/deletenote/:id , Login required
const deleteNotes = async (req, res) => {
  // console.log(req.body);
  try {
    // find the note to be updated and update it
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }

    if (note.user.toString() !== req.user._id) {
      return res.status(401).send("Not allowed");
    }

    note = await Notes.findByIdAndDelete(req.params.id); // here new:true means if any new content comes it will get updated
    // console.log("Deleted note: " + note);
    res.json({ Success: "Note has been deleted.", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal error occurred");
  }
};
// Route: 5 -> Search notes
const searchNotes = async (req, res) => {
  const query = req.query.search
    ? { title: { $regex: req.query.search, $options: "i" } }
    : {};

  console.log("query: ", query);
  try {
    let searchNotes = await Notes.find(query);
    res.json(searchNotes);
  } catch (error) {
    console.error("Error occurred while searching notes:", error);
    // Send an error response
    res.status(500).json({ error: "An error occurred while searching notes." });
  }
};

router.get("/getalldata", getAllData);
router.get("/fetchdata", fetchuser, fetchData);
router.post(
  "/addnotes",
  fetchuser,
  [
    body("title", "Write the title "),

    body(
      "description",
      "Description should be of atleast 5 character"
    ).isLength({ min: 5 }),
  ],
  addNotes
);
router.put(
  "/updatenotes/:id",
  fetchuser,
  [
    body("title", "Write the title ").isLength({ min: 5 }),

    body(
      "description",
      "Description should be of atleast 5 character"
    ).isLength({ min: 5 }),
  ],
  updateNotes
);
router.delete("/deletenote/:id", fetchuser, deleteNotes);
router.get("/search", searchNotes);

module.exports = router;
