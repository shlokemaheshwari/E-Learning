import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./database/db.js";
import cors from "cors";

dotenv.config();

const app = express();

const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Server is working");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDb();
});

// using middlewares
app.use(express.json()); 
app.use(cors());

app.use("/uploads", express.static("uploads"));

// importing routes
import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
import adminRoutes from "./routes/admin.js";
import announcementRoutes from "./routes/announcement.js";
import noteRoutes from "./routes/notes.js";





// using routes
app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", adminRoutes);
app.use("/api/announcement", announcementRoutes);
app.use("/api/notes", noteRoutes);


