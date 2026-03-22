import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const location = useLocation(); // Forces re-render on route change
  
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
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
              {userRole === 'founder' || userRole === 'admin' ? (
                <Link to="/founder-dashboard" style={styles.navLink}>Dashboard</Link>
              ) : (
                <Link to="/job-seeker-dashboard" style={styles.navLink}>My Dashboard</Link>
              )}
              {userName && (
                <div style={styles.userGreeting}>
                  <span style={styles.greetingText}>Hello,</span>
                  <span style={styles.userNameText}>{userName}</span>
                </div>
              )}
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
    background: "rgba(15, 23, 42, 0.9)", // Matches var(--bg-color) with transparency
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "15px 0",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
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
    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "24px"
  },
  navLink: {
    textDecoration: "none",
    color: "#f8fafc", // var(--text-main)
    fontWeight: "500",
    fontSize: "15px",
    transition: "color 0.2s ease",
    opacity: 0.8
  },
  signupButton: {
    padding: "10px 24px",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)"
  },
  logoutButton: {
    padding: "8px 20px",
    background: "transparent",
    color: "#f8fafc",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.2s ease"
  },
  userGreeting: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    lineHeight: "1.2",
    cursor: "pointer",
    marginRight: "10px"
  },
  greetingText: {
    fontSize: "12px",
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "400"
  },
  userNameText: {
    fontSize: "14px",
    color: "#fff",
    fontWeight: "700"
  }
};

export default Header;
