const Note = require("../models/noteModel");
const { validationResult } = require("express-validator");

const getNote = async (req, res, next) => {
  try {
    const notes = await Note.find({ user: req.user._id });
    res.json({ message: notes, status: true });
  } catch (err) {
    return next(err);
  }
};

const createNote = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      res.json({
        message: "Make sure all the fields are filled",
        status: false,
      })
    );
  }
  const { todo } = req.body;
  const newNote = new Note({
    todo,
    user: req.user._id,
  });
  try {
    await newNote.save();
    res.status(201).json({ message: newNote, status: true });
  } catch (err) {
    return next(err);
  }
};

const updateNote = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      res.json({
        message: "Make sure all the fields are filled",
        status: false,
      })
    );
  }
  const { id } = req.params;
  const { todo } = req.body;
  try {
    const note = await Note.findOneAndUpdate(
      { _id: id },
      { todo },
      { new: true }
    );
    if (!note) {
      return next(
        res.json({ message: "Note not found or unauthorized", status: false })
      );
    }
    res.json({ message: "Note updated", note, status: true });
  } catch (err) {
    return next(err);
  }
};

const deleteNote = async (req, res, next) => {
  const { id } = req.params;
  try {
    const note = await Note.findOneAndDelete({ _id: id });
    if (!note) {
      return next(
        res.json({ message: "Note not found or unauthorized", status: false })
      );
    }
    res.json({ message: "Note deleted", status: true });
  } catch (err) {
    return next(err);
  }
};

module.exports.getNote = getNote;
module.exports.createNote = createNote;
module.exports.updateNote = updateNote;
module.exports.deleteNote = deleteNote;
