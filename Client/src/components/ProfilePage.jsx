import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CreateStartupModal from "./CreateStartupModal";

function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/startup/${id}`);
        if (res.data.success) {
          const data = res.data.data;
          setProfile({
            name: data.fullName,
            email: data.email,
            mobileNumber: data.mobileNumber,
            role: "Startup Founder",
            sector: data.sector,
            about: data.futureVision,
            startupTitle: data.startupTitle,
            coreIdea: data.coreIdea,
            aadharPhoto: data.aadharPhoto ? `http://localhost:5000/${data.aadharPhoto.replace(/\\/g, '/')}` : null
          });
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading profile...</div>;
  if (error) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>{error}</div>;
  if (!profile) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Profile not found</div>;

  // 🔥 CONNECT FUNCTIONALITY
  const handleConnect = async () => {
    // Show the modal
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <div style={styles.avatar}>
          {profile.name.charAt(0)}
        </div>
        <div>
          <h2 style={{ margin: 0 }}>{profile.name}</h2>
          <p style={styles.role}>{profile.role}</p>
          <p style={styles.university}>{profile.sector}</p>
        </div>
      </div>

      {/* Contact Section */}
      <div style={styles.section}>
        <h3>Contact Info</h3>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Mobile:</strong> {profile.mobileNumber}</p>
      </div>

      {/* Startup Info Section */}
      <div style={styles.section}>
        <h3>Startup Idea: {profile.startupTitle}</h3>
        <p><strong>Core Idea:</strong> {profile.coreIdea}</p>
        <p><strong>Vision:</strong> {profile.about}</p>
      </div>

      {profile.aadharPhoto && (
        <div style={styles.section}>
          <h3>Verification Document</h3>
          <img src={profile.aadharPhoto} alt="Aadhar" style={{ maxWidth: '100%', borderRadius: '8px', maxHeight: '300px', objectFit: 'contain' }} />
        </div>
      )}

      {/* Action Buttons */}
      <div style={styles.buttonContainer}>
        <button style={styles.primaryBtn} onClick={handleConnect}>
          Connect
        </button>

        <button
          style={styles.secondaryBtn}
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>

      {/* Startup Modal Instead of standard confirm */}
      {showModal && (
        <CreateStartupModal onClose={closeModal} />
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "30px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "20px",
  },
  avatar: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    backgroundColor: "#2563eb",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "bold",
  },
  role: {
    margin: "5px 0",
    color: "#555",
  },
  university: {
    margin: 0,
    color: "#777",
    fontSize: "14px",
  },
  section: {
    marginTop: "25px",
  },
  skillsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  skillTag: {
    backgroundColor: "#e0e7ff",
    color: "#1e3a8a",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "14px",
  },
  buttonContainer: {
    marginTop: "30px",
    display: "flex",
    gap: "15px",
  },
  primaryBtn: {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "500",
  },
  secondaryBtn: {
    backgroundColor: "#e5e7eb",
    color: "#111",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
  },
  // Modal Styles
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "16px",
    textAlign: "center",
    maxWidth: "400px",
    width: "90%",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
    animation: "fadeIn 0.3s ease",
  },
  modalIcon: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: "#10b981",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    margin: "0 auto 20px",
  },
  modalTitle: {
    margin: "0 0 10px 0",
    color: "#333",
    fontSize: "24px",
    fontWeight: "600",
  },
  modalMessage: {
    margin: "0 0 25px 0",
    color: "#666",
    fontSize: "16px",
  },
  modalButton: {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "12px 40px",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
  },
};

export default ProfilePage;
