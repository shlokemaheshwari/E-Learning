// controllers/notes.jsx
import TryCatch from "../middlewares/TryCatch.js";
import { Note } from "../models/Notes.js";
import { Courses } from "../models/Courses.js";

export const createNote = TryCatch(async (req, res) => {
  const { title, content, courseId } = req.body;

  if (!title || !content || !courseId) {
    return res.status(400).json({ message: "Title, content, and courseId are required" });
  }

  const course = await Courses.findById(courseId);

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  const note = await Note.create({ title, content, course: courseId });

  res.status(201).json({
    message: "Note created successfully",
    note,
  });
});

export const getNotesByCourse = TryCatch(async (req, res) => {
  const courseId = req.params.courseId;

  const notes = await Note.find({ course: courseId });

  res.json({ notes });
});

export const updateNote = TryCatch(async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  const note = await Note.findById(req.params.id);

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  note.title = title;
  note.content = content;

  await note.save();

  res.json({
    message: "Note updated successfully",
    note,
  });
});

export const deleteNote = TryCatch(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  await note.deleteOne();

  res.json({ message: "Note deleted successfully" });
});
