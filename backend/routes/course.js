import express from "express";
import {
  getAllCourses,
  getSingleCourse,
  fetchLectures,
  fetchLecture,
  getMyCourses,
  enrollCourse,
  addProgress,
  getYourProgress
} from "../controllers/course.js";
import { isAuth } from "../middlewares/isAuth.js";
import {
  getAnnouncementsByCourse
} from "../controllers/announcement.js";

const router = express.Router();

router.get("/course/all", getAllCourses);
router.get("/course/:id", getSingleCourse);
router.get("/lectures/:id", isAuth, fetchLectures);
router.get("/lecture/:id", isAuth, fetchLecture);
router.get("/mycourse", isAuth, getMyCourses);
router.post("/course/enroll/:id", isAuth, enrollCourse);
router.post("/progress", isAuth, addProgress);
router.get("/progress", isAuth, getYourProgress);
router.get("/course/:id/announcements", getAnnouncementsByCourse);


export default router;
