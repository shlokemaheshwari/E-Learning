import TryCatch from "../middlewares/TryCatch.js";
import { Announcement } from "../models/Announcement.js";
import { Courses } from "../models/Courses.js";

export const createAnnouncement = TryCatch(async (req, res) => {
    const { title, content, courseId } = req.body;
  
    if (!title || !content || !courseId) {
      return res.status(400).json({ message: "Title, content, and courseId are required" });
    }
  
    const course = await Courses.findById(courseId);
  
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
  
    const announcement = await Announcement.create({ title, content, course: courseId });
  
    res.status(201).json({
      message: "Announcement created successfully",
      announcement,
    });
  });
  

export const getAnnouncementsByCourse = TryCatch(async (req, res) => {
    const courseId = req.params.courseId;
  
    const announcements = await Announcement.find({ course: courseId });
  
    res.json({ announcements });
  });
  
export const updateAnnouncement = TryCatch(async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  const announcement = await Announcement.findById(req.params.id);

  if (!announcement) {
    return res.status(404).json({ message: "Announcement not found" });
  }

  announcement.title = title;
  announcement.content = content;

  await announcement.save();

  res.json({
    message: "Announcement updated successfully",
    announcement,
  });
});

export const deleteAnnouncement = TryCatch(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);

  if (!announcement) {
    return res.status(404).json({ message: "Announcement not found" });
  }

  await announcement.deleteOne();

  res.json({ message: "Announcement deleted successfully" });
});
