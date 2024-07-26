import express from "express";
import { isAuth, isAdmin } from "../middlewares/isAuth.js";
import {
  createAnnouncement,
  getAnnouncementsByCourse,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcement.js";

const router = express.Router();

router.post("/new", isAuth, isAdmin, createAnnouncement);
router.get("/course/:courseId", getAnnouncementsByCourse);
router.put("/:id", isAuth, isAdmin, updateAnnouncement);
router.delete("/:id", isAuth, isAdmin, deleteAnnouncement);

export default router;
