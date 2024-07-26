// models/Notes.jsx
import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Note = mongoose.model('Note', noteSchema);
