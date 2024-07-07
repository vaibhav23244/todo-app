const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const auth = require("../middleware/authMiddleWare");
const noteController = require("../controllers/noteController");

router.use(auth);

router.get("/", noteController.getNote);

router.post(
  "/",
  [check("todo").isLength({ min: 1 })],
  noteController.createNote
);

router.put(
  "/:id",
  [check("todo").isLength({ min: 1 })],
  noteController.updateNote
);

router.delete("/:id", noteController.deleteNote);

module.exports = router;
