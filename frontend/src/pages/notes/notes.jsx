import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { server } from "../../main";
import Loading from "../../components/loading/Loading";
import toast from "react-hot-toast";
import { TiDelete } from "react-icons/ti";
import "./notes.css";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const { data } = await axios.get(`${server}/api/notes/course/${params.id}`);
      const sortedNotes = data.notes.map(note => ({
        ...note,
        createdAt: new Date(note.createdAt)
      })).sort((a, b) => a.createdAt - b.createdAt);
      
      setNotes(sortedNotes);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const createNote = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/api/notes/new`,
        { title, content, courseId: params.id },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      toast.success(data.message);
      setBtnLoading(false);
      setTitle("");
      setContent("");
      fetchNotes();
      setShowForm(false);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "An error occurred");
      setBtnLoading(false);
    }
  };

  const deleteNote = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        const { data } = await axios.delete(`${server}/api/notes/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });

        toast.success(data.message);
        fetchNotes();
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "An error occurred");
      }
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const toggleUpdateForm = () => {
    setShowUpdateForm(!showUpdateForm);
    if (selectedNote) {
      setTitle(selectedNote.title);
      setContent(selectedNote.content);
    }
  };

  const updateNote = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const { data } = await axios.put(
        `${server}/api/notes/${selectedNote._id}`,
        { title, content },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      toast.success(data.message);
      setBtnLoading(false);
      setTitle("");
      setContent("");
      fetchNotes();
      setSelectedNote(null);
      setShowUpdateForm(false);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "An error occurred");
      setBtnLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="notes-page">
          <div className="left">
            {selectedNote ? (
              <>
                <h2>{selectedNote.title}</h2>
                <p>{selectedNote.content}</p>
              </>
            ) : (
              <h2>Please Select a Note</h2>
            )}
          </div>
          <div className="right">
            <button className="common-btn" onClick={toggleForm}>
              {showForm ? "Close Form" : "Add Note +"}
            </button>
            <button
              className="common-btn"
              onClick={toggleUpdateForm}
              disabled={!selectedNote}
            >
              {showUpdateForm ? "Close Update Form" : "Update Note"}
            </button>

            {showForm && (
              <div className="add-note-form">
                <h2>Add Note</h2>
                <form onSubmit={createNote}>
                  <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                  <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                  <button
                    className="common-btn"
                    type="submit"
                    disabled={btnLoading}
                  >
                    {btnLoading ? "Adding..." : "Add Note"}
                  </button>
                </form>
              </div>
            )}

            {showUpdateForm && selectedNote && (
              <div className="update-note-form">
                <h2>Update Note</h2>
                <form onSubmit={updateNote}>
                  <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                  <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                  <button
                    className="common-btn"
                    type="submit"
                    disabled={btnLoading}
                  >
                    {btnLoading ? "Updating..." : "Update Note"}
                  </button>
                </form>
              </div>
            )}

            {notes.length > 0 ? (
              notes.map((note) => (
                <div
                  key={note._id}
                  className={`note-item ${
                    selectedNote && selectedNote._id === note._id ? "active" : ""
                  }`}
                  onClick={() => setSelectedNote(note)}
                >
                  <h3>{note.title}</h3>
                  <p>{new Date(note.createdAt).toLocaleString()}</p>
                  <TiDelete
                    className="delete-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note._id);
                    }}
                  />
                </div>
              ))
            ) : (
              <p>No notes available for this course.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Notes;
