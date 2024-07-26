import React, { useEffect } from "react";
import "./coursestudy.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../main";
import { FaPlayCircle } from "react-icons/fa";
import { GrNotes } from "react-icons/gr";
import { MdAnnouncement } from "react-icons/md";

const CourseStudy = ({ user }) => {
  const params = useParams();
  const { fetchCourse, course } = CourseData();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== "admin" && !user.subscription.includes(params.id)) {
      navigate("/");
    } else {
      fetchCourse(params.id);
    }
  }, [params.id, user, fetchCourse, navigate]);

  return (
    <>
      {course && (
        <div className="course-study-page">
          <img src={`${server}/${course.image}`} alt="" width={350} />
          <h2>{course.title}</h2>
          <h4>{course.description}</h4>
          <h5>by - {course.createdBy}</h5>
          <h5>Duration - {course.duration} weeks</h5>
          <Link to={`/lectures/${course._id}`}>
            <button className="lectures-button">
              <FaPlayCircle className="play-icon" />
              Lectures
            </button>
          </Link>

          <Link to={`/announcements/${course._id}`}>
            <button className="announcements-button">
            <MdAnnouncement   className="play-icon"/>
              Announcements
              </button>
          </Link>

          {/* Conditionally show the Notes button if the user is not an admin */}
          {user && user.role !== "admin" && (
            <Link to={`/notes/${course._id}`}>
              <button className="notes-button">
              <GrNotes  className="play-icon"/>
                Notes
                </button>
            </Link>
          )}
        </div>
      )}
    </>
  );
};

export default CourseStudy;
