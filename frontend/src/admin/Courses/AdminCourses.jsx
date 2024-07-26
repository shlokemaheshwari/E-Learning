import React from "react";
import CourseCard from "../../components/coursecard/CourseCard";
import "./admincourses.css";
import Layout from "../Utils/Layout";
import { CourseData } from "../../context/CourseContext";


const AdminCourses = () => {
  const { courses } = CourseData();

  return (
    <Layout>
      <div className="admin-courses">
        <h1>All Courses</h1>
        <div className="dashboard-content">
          {courses && courses.length > 0 ? (
            courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))
          ) : (
            <p>No Courses Yet</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminCourses;

