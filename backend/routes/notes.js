// routes/notes.jsx
import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import {
  createNote,
  getNotesByCourse,
  updateNote,
  deleteNote,
} from "../controllers/notes.js";

const router = express.Router();

router.post("/new", isAuth, createNote);
router.get("/course/:courseId", getNotesByCourse);
router.put("/:id", isAuth, updateNote);
router.delete("/:id", isAuth, deleteNote);

export default router;
