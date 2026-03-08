import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          🚀 Makexa
        </Link>
        <nav style={styles.nav}>
          {token ? (
            <>
              <Link to="/" style={styles.navLink}>Projects</Link>
              <Link to="/create-founder-profile" style={styles.navLink}>Create Profile</Link>
              <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.navLink}>Login</Link>
              <Link to="/signup" style={styles.signupButton}>Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

const styles = {
  header: {
    background: "rgba(255, 255, 255, 0.98)",
    borderBottom: "1px solid #e1e1e1",
    padding: "15px 0",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  logo: {
    fontSize: "24px",
    fontWeight: "700",
    textDecoration: "none",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "20px"
  },
  navLink: {
    textDecoration: "none",
    color: "#333",
    fontWeight: "500",
    fontSize: "15px",
    transition: "color 0.2s ease"
  },
  signupButton: {
    padding: "8px 20px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "20px",
    fontWeight: "600",
    fontSize: "14px",
    transition: "transform 0.2s ease"
  },
  logoutButton: {
    padding: "8px 20px",
    background: "transparent",
    color: "#667eea",
    border: "2px solid #667eea",
    borderRadius: "20px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.2s ease"
  }
};

export default Header;
