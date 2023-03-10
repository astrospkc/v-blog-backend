const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

// Route 1: Fetch user data  GET: /api/notes/fetchdata , Login required
router.get("/fetchdata", fetchuser, async (req, res) => {
  console.log("fetch data ", req.body);
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal error occurred");
  }
});

// Route 2: Add notes POST: /api/notes/addnotes , Login required
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
  async (req, res) => {
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
      console.log("outside try note :", req.body);
      console.log("request user", req.user);
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
  }
);

// Route 3: update notes PUT: /api/notes/updatenotes , Login required
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
  async (req, res) => {
    console.log("getting the id", req.user.id);
    const { title, description, tag } = req.body;
    console.log("update:", req.body);
    try {
      // create new note object
      const newNote = {};
      if (title) {
        newNote.title = title;
      }
      if (description) {
        newNote.description = description;
      }
      console.log("newNote:", newNote);

      // find the note to be updated and update it
      console.log(req.params.id);
      let note = await Notes.findById(req.params.id);
      console.log("note:", note);
      if (!note) {
        return res.status(404).send("Not Found");
      }
      console.log("note user:", note.user);
      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not allowed");
      }

      note = await Notes.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
      ); // here new:true means if any new content comes it will get updated
      console.log("editted note:", note);
      res.json({ note });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal error occurred");
    }
  }
);

// Route 4: Delete a note: DELETE: api/notes/deletenote/:id , Login required
router.delete(
  "/deletenote/:id",
  fetchuser,

  async (req, res) => {
    console.log(req.body);
    try {
      // find the note to be updated and update it
      let note = await Notes.findById(req.params.id);
      if (!note) {
        return res.status(404).send("Not Found");
      }

      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not allowed");
      }

      note = await Notes.findByIdAndDelete(req.params.id); // here new:true means if any new content comes it will get updated
      console.log("Deleted note: " + note);
      res.json({ Success: "Note has been deleted.", note: note });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal error occurred");
    }
  }
);
module.exports = router;
