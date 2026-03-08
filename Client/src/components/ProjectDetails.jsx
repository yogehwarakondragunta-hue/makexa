import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy logged-in user (later from auth)
  const currentUser = {
    id: "u101",
    name: "Yogeshwara",
    role: "Full Stack Developer",
  };

  const [project, setProject] = useState({
    id,
    title: "AI-Based Smart Attendance System",
    description:
      "An AI-powered face recognition system to automate classroom attendance and reduce manual effort.",
    techStack: ["React", "Node.js", "MongoDB", "Python", "OpenCV"],
    members: [
      { id: "u1", name: "Rahul Sharma", role: "Frontend Developer" },
      { id: "u2", name: "Anjali Verma", role: "Backend Developer" },
    ],
  });

  const handleJoinProject = () => {
    const alreadyMember = project.members.find(
      (member) => member.id === currentUser.id
    );

    if (alreadyMember) {
      alert("You are already a member of this project.");
      return;
    }

    setProject({
      ...project,
      members: [...project.members, currentUser],
    });
  };

  return (
    <div style={styles.container}>
      <h1>{project.title}</h1>
      <p style={styles.description}>{project.description}</p>

      <h3>Tech Stack</h3>
      <div style={styles.techContainer}>
        {project.techStack.map((tech, index) => (
          <span key={index} style={styles.techTag}>
            {tech}
          </span>
        ))}
      </div>

      <h3 style={{ marginTop: "30px" }}>Team Members</h3>
      <div style={styles.memberContainer}>
        {project.members.map((member) => (
          <div key={member.id} style={styles.memberCard}>
            <strong>{member.name}</strong>
            <p>{member.role}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "30px" }}>
        <button style={styles.joinBtn} onClick={handleJoinProject}>
          Join Project
        </button>

        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "30px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    fontFamily: "Arial",
  },
  description: {
    color: "#555",
    marginBottom: "20px",
  },
  techContainer: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  techTag: {
    backgroundColor: "#e0f2fe",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "14px",
  },
  memberContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "15px",
  },
  memberCard: {
    padding: "15px",
    backgroundColor: "#f3f4f6",
    borderRadius: "8px",
  },
  joinBtn: {
    backgroundColor: "#16a34a",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "10px",
  },
  backBtn: {
    backgroundColor: "#e5e7eb",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default ProjectDetails;