import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function FounderDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Get user profile
        const userRes = await axios.get(
          "http://localhost:5000/api/auth/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        const userData = userRes.data;
        setProfile(userData);

        // Get user's startups
        const startupsRes = await axios.get(
          "http://localhost:5000/api/startups/my-startups",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        setStartups(startupsRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Welcome Section */}
      <div style={styles.welcomeSection}>
        <h1 style={styles.welcomeTitle}>Welcome, {profile?.name || "Founder"}! 👋</h1>
        <p style={styles.welcomeSubtitle}>
          Your founder profile is ready. You can now connect with other founders and collaborators.
        </p>
      </div>

      {/* Profile Card */}
      <div style={styles.profileCard}>
        <div style={styles.profileHeader}>
          <div style={styles.avatar}>
            {profile?.name?.charAt(0) || "F"}
          </div>
          <div style={styles.profileInfo}>
            <h2 style={styles.profileName}>{profile?.name || "Your Name"}</h2>
            <p style={styles.profileEmail}>{profile?.email || "your@email.com"}</p>
            <span style={styles.founderBadge}>✓ Founder Account</span>
          </div>
        </div>
        
        {profile?.bio && (
          <div style={styles.profileSection}>
            <h3>About</h3>
            <p>{profile.bio}</p>
          </div>
        )}

        {profile?.skills && (
          <div style={styles.profileSection}>
            <h3>Skills</h3>
            <div style={styles.skillsContainer}>
              {profile.skills.split(",").map((skill, index) => (
                <span key={index} style={styles.skillTag}>
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Startups Section */}
      <div style={styles.startupsSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Your Startups</h2>
          <button 
            style={styles.addButton}
            onClick={() => navigate("/create-startup")}
          >
            + Add Startup
          </button>
        </div>

        {startups.length > 0 ? (
          <div style={styles.startupsGrid}>
            {startups.map((startup) => (
              <div key={startup._id} style={styles.startupCard}>
                <h3 style={styles.startupName}>{startup.name}</h3>
                <p style={styles.startupDesc}>{startup.description}</p>
                <div style={styles.startupStats}>
                  <span>👥 {startup.members?.length || 0} Members</span>
                  <span>🔗 {startup.connections || 0} Connections</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <p>You haven't created any startups yet.</p>
            <button 
              style={styles.createStartupButton}
              onClick={() => navigate("/create-startup")}
            >
              Create Your First Startup
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={styles.quickActions}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.actionsGrid}>
          <button 
            style={styles.actionCard}
            onClick={() => navigate("/")}
          >
            <span style={styles.actionIcon}>🔍</span>
            <span>Browse Projects</span>
          </button>
          <button 
            style={styles.actionCard}
            onClick={() => navigate("/create-founder-profile")}
          >
            <span style={styles.actionIcon}>✏️</span>
            <span>Edit Profile</span>
          </button>
          <button 
            style={styles.actionCard}
            onClick={() => navigate("/messages")}
          >
            <span style={styles.actionIcon}>💬</span>
            <span>Messages</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "40px auto",
    padding: "0 20px",
  },
  loadingContainer: {
    textAlign: "center",
    padding: "60px",
    fontSize: "18px",
    color: "#666",
  },
  welcomeSection: {
    textAlign: "center",
    marginBottom: "40px",
    padding: "40px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "16px",
    color: "white",
  },
  welcomeTitle: {
    margin: "0 0 10px 0",
    fontSize: "28px",
    fontWeight: "600",
  },
  welcomeSubtitle: {
    margin: 0,
    opacity: 0.9,
    fontSize: "16px",
  },
  profileCard: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    marginBottom: "30px",
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "20px",
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "#667eea",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    fontWeight: "bold",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    margin: "0 0 5px 0",
    fontSize: "24px",
    color: "#333",
  },
  profileEmail: {
    margin: "0 0 10px 0",
    color: "#666",
  },
  founderBadge: {
    display: "inline-block",
    padding: "4px 12px",
    backgroundColor: "#10b981",
    color: "white",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "500",
  },
  profileSection: {
    marginTop: "20px",
    paddingTop: "20px",
    borderTop: "1px solid #eee",
  },
  skillsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "10px",
  },
  skillTag: {
    backgroundColor: "#e0e7ff",
    color: "#1e3a8a",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "14px",
  },
  startupsSection: {
    marginBottom: "30px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "22px",
    color: "#333",
  },
  addButton: {
    padding: "10px 20px",
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
  startupsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
  },
  startupCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  startupName: {
    margin: "0 0 10px 0",
    fontSize: "18px",
    color: "#333",
  },
  startupDesc: {
    margin: "0 0 15px 0",
    color: "#666",
    fontSize: "14px",
  },
  startupStats: {
    display: "flex",
    gap: "15px",
    fontSize: "13px",
    color: "#888",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  createStartupButton: {
    marginTop: "15px",
    padding: "12px 24px",
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
  quickActions: {
    marginBottom: "40px",
  },
  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "15px",
    marginTop: "20px",
  },
  actionCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    padding: "25px 20px",
    backgroundColor: "white",
    border: "none",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    cursor: "pointer",
    fontSize: "14px",
    color: "#333",
    fontWeight: "500",
  },
  actionIcon: {
    fontSize: "24px",
  },
};

export default FounderDashboard;
