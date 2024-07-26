import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { server } from "../../main";
import Loading from "../../components/loading/Loading";
import toast from "react-hot-toast";
import { TiDelete } from "react-icons/ti";
import "./announcement.css"; // Import the CSS file

const Announcement = ({ user }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false); // State for showing update form

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data } = await axios.get(`${server}/api/announcement/course/${params.id}`);
      // Map the data to include createdAt field and sort by createdAt in descending order
      const sortedAnnouncements = data.announcements.map(announcement => ({
        ...announcement,
        createdAt: new Date(announcement.createdAt) // Assuming createdAt is a valid date string from the backend
      })).sort((a, b) => b.createdAt - a.createdAt);
      
      setAnnouncements(sortedAnnouncements);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const createAnnouncement = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/api/announcement/new`,
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
      fetchAnnouncements();
      setShowForm(false);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "An error occurred");
      setBtnLoading(false);
    }
  };

  const deleteAnnouncement = async (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        const { data } = await axios.delete(`${server}/api/announcement/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });

        toast.success(data.message);
        fetchAnnouncements();
      } catch (error) {
        console.log(error); // Add logging to debug
        toast.error(error.response?.data?.message || "An error occurred");
      }
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const toggleUpdateForm = () => {
    setShowUpdateForm(!showUpdateForm);
    setTitle(selectedAnnouncement.title);
    setContent(selectedAnnouncement.content);
  };

  const updateAnnouncement = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const { data } = await axios.put(
        `${server}/api/announcement/${selectedAnnouncement._id}`,
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
      fetchAnnouncements();
      setSelectedAnnouncement(null);
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
        <div className="announcement-page">
          <div className="left">
            {selectedAnnouncement ? (
              <>
                <h2>{selectedAnnouncement.title}</h2>
                <p>{selectedAnnouncement.content}</p>
              </>
            ) : (
              <h2>Please Select an Announcement</h2>
            )}
          </div>
          <div className="right">
            {user && user.role === "admin" && (
              <>
                <button className="common-btn" onClick={toggleForm}>
                  {showForm ? "Close Form" : "Add Announcement +"}
                </button>
                <button
                  className="common-btn"
                  onClick={toggleUpdateForm}
                  disabled={!selectedAnnouncement}
                >
                  {showUpdateForm ? "Close Update Form" : "Update Announcement"}
                </button>
              </>
            )}

            {showForm && (
              <div className="add-announcement-form">
                <h2>Add Announcement</h2>
                <form onSubmit={createAnnouncement}>
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
                    {btnLoading ? "Adding..." : "Add Announcement"}
                  </button>
                </form>
              </div>
            )}

            {showUpdateForm && selectedAnnouncement && (
              <div className="update-announcement-form">
                <h2>Update Announcement</h2>
                <form onSubmit={updateAnnouncement}>
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
                    {btnLoading ? "Updating..." : "Update Announcement"}
                  </button>
                </form>
              </div>
            )}

            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <div
                  key={announcement._id}
                  className={`announcement-item ${
                    selectedAnnouncement && selectedAnnouncement._id === announcement._id ? "active" : ""
                  }`}
                  onClick={() => setSelectedAnnouncement(announcement)}
                >
                  <h3>{announcement.title}</h3>
                  <p>{new Date(announcement.createdAt).toLocaleString()}</p>
                  {user && user.role === "admin" && (
                    <>
                      <TiDelete
                        className="delete-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAnnouncement(announcement._id);
                        }}
                      />
                    </>
                  )}
                </div>
              ))
            ) : (
              <p>No announcements available for this course.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Announcement;
