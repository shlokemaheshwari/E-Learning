import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { rm } from "fs";
import { promisify } from "util";
import fs from "fs";
import { User } from "../models/User.js";
import { Announcement } from "../models/Announcement.js";

const rmAsync = promisify(rm);
const unlinkAsync = promisify(fs.unlink);

export const createCourse = TryCatch(async (req, res) => {
  const { title, description, category, createdBy, duration, price } = req.body;

  if (!title || !description || !category || !createdBy || !duration || !price) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const image = req.file;

  await Courses.create({
    title,
    description,
    category,
    createdBy,
    image: image?.path,
    duration,
    price,
  });

  res.status(201).json({
    message: "Course Created Successfully",
  });
});

export const addLectures = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);

  if (!course) {
    return res.status(404).json({
      message: "No Course with this ID",
    });
  }

  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: "Title and Description are required" });
  }

  const file = req.file;

  const lecture = await Lecture.create({
    title,
    description,
    video: file?.path,
    course: course._id,
  });

  res.status(201).json({
    message: "Lecture Added",
    lecture,
  });
});

export const deleteLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);

  if (!lecture) {
    return res.status(404).json({ message: "No Lecture with this ID" });
  }

  await unlinkAsync(lecture.video);

  await lecture.deleteOne();

  res.json({ message: "Lecture Deleted" });
});

export const deleteCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);

  if (!course) {
    return res.status(404).json({ message: "No Course with this ID" });
  }

  const lectures = await Lecture.find({ course: course._id });

  await Promise.all(
    lectures.map(async (lecture) => {
      await unlinkAsync(lecture.video);
      console.log("Video deleted");
    })
  );

  await rmAsync(course.image);
  console.log("Image deleted");

  await Lecture.deleteMany({ course: req.params.id });

  await course.deleteOne();

  await User.updateMany({}, { $pull: { subscription: req.params.id } });

  res.json({
    message: "Course Deleted",
  });
});

export const getAllStats = TryCatch(async (req, res) => {
  const totalCoures = await Courses.countDocuments();
  const totalLectures = await Lecture.countDocuments();
  const totalUsers = await User.countDocuments();
  const totalAnnouncements = await Announcement.countDocuments();

  const stats = {
    totalCoures,
    totalLectures,
    totalUsers,
    totalAnnouncements,
  };

  res.json({
    stats,
  });
});

export const getAllUser = TryCatch(async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } }).select("-password");

  res.json({ users });
});

export const updateRole = TryCatch(async (req, res) => {
  // Check if the authenticated user is an admin
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Only admins can update user roles",
    });
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  if (user.role === "user") {
    user.role = "admin";
  } else if (user.role === "admin") {
    user.role = "user";
  } else {
    return res.status(400).json({
      message: "Cannot update role for this user",
    });
  }

  await user.save();

  return res.status(200).json({
    message: `Role updated to ${user.role}`,
  });
});
