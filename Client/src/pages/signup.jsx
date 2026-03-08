import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        formData
      );

      localStorage.setItem("token", res.data.token);

      alert("Signup successful! Please create your founder profile.");
      navigate("/create-founder-profile");
    } catch (error) {
      console.error(error);
      alert("Signup failed");
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.backgroundPattern}></div>
      <div style={styles.container}>
        <div style={styles.logoSection}>
          <h1 style={styles.logo}>🚀 Makexa</h1>
          <p style={styles.tagline}>Connect. Collaborate. Create.</p>
        </div>

        <h2 style={styles.title}>Create Your Account</h2>
        <p style={styles.subtitle}>Join thousands of founders and innovators</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button}>
            Sign Up
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account?{" "}
          <span
            style={styles.link}
            onClick={() => navigate("/login")}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    position: "relative",
    overflow: "hidden"
  },
  backgroundPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)",
    pointerEvents: "none"
  },
  container: {
    maxWidth: "420px",
    width: "90%",
    padding: "40px",
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "20px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    position: "relative",
    zIndex: 1
  },
  logoSection: {
    textAlign: "center",
    marginBottom: "30px"
  },
  logo: {
    fontSize: "32px",
    margin: "0 0 8px 0",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  },
  tagline: {
    color: "#888",
    margin: 0,
    fontSize: "14px"
  },
  title: {
    textAlign: "center",
    margin: "0 0 8px 0",
    color: "#333",
    fontSize: "24px",
    fontWeight: "600"
  },
  subtitle: {
    textAlign: "center",
    margin: "0 0 30px 0",
    color: "#666",
    fontSize: "14px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  inputGroup: {
    marginBottom: "0"
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    border: "2px solid #e1e1e1",
    borderRadius: "10px",
    fontSize: "15px",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
    outline: "none"
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    marginTop: "10px"
  },
  footerText: {
    textAlign: "center",
    marginTop: "25px",
    color: "#666",
    fontSize: "14px"
  },
  link: {
    color: "#667eea",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "none",
    transition: "color 0.2s ease"
  }
};

export default Signup;
