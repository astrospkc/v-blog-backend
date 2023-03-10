const mongoose = require("mongoose");
const { Schema } = mongoose;

const NoteSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: String, requires: true },
  body: String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs: Number,
  },
  tag: { type: String },
});
module.exports = mongoose.model("notes", NoteSchema);
