import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from '../config/api.js';
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
      // MongoDB ObjectIds are exactly 24 hex characters
      if (id.length !== 24) {
        setError("Invalid Profile ID");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/api/startup/${id}`);
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
            aadharPhoto: data.aadharPhoto ? `${API_URL}/${data.aadharPhoto.replace(/\\\/g, '/')}` : null
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
          <h2 style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>{profile.name}</h2>
          <p style={styles.role}>{profile.role}</p>
          <p style={styles.university}>{profile.sector}</p>
        </div>
      </div>

      {/* Contact Section */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Contact Info</h3>
        <p style={styles.text}><span style={styles.label}>Email:</span> {profile.email}</p>
        <p style={styles.text}><span style={styles.label}>Mobile:</span> {profile.mobileNumber}</p>
      </div>

      {/* Startup Info Section */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Startup Idea: {profile.startupTitle}</h3>
        <p style={styles.text}><span style={styles.label}>Core Idea:</span> {profile.coreIdea}</p>
        <p style={styles.text}><span style={styles.label}>Vision:</span> {profile.about}</p>
      </div>

      {profile.aadharPhoto && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Verification Document</h3>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
            <img src={profile.aadharPhoto} alt="Aadhar" style={{ maxWidth: '100%', borderRadius: '12px', maxHeight: '400px', objectFit: 'contain', border: '1px solid rgba(255,255,255,0.1)' }} />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={styles.buttonContainer}>
        <button className="btn" style={styles.primaryBtn} onClick={handleConnect}>
          Connect
        </button>

        <button
          className="btn btn-secondary"
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
    margin: "60px auto",
    padding: "40px",
    backgroundColor: "var(--card-bg)",
    borderRadius: "16px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    fontFamily: "'Inter', sans-serif",
    color: "var(--text-main)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    marginBottom: "30px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    paddingBottom: "30px",
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "16px",
    backgroundColor: "var(--accent)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    fontWeight: "bold",
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
  },
  role: {
    margin: "5px 0",
    color: "var(--accent)",
    fontWeight: "600",
    fontSize: "18px",
  },
  university: {
    margin: 0,
    color: "var(--text-muted)",
    fontSize: "15px",
  },
  section: {
    marginTop: "30px",
    padding: "20px",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
  },
  sectionTitle: {
    margin: "0 0 15px 0",
    fontSize: "20px",
    color: "var(--text-main)",
    fontWeight: "600",
  },
  text: {
    color: "var(--text-main)",
    lineHeight: "1.6",
    fontSize: "16px",
  },
  label: {
    color: "var(--text-muted)",
    fontWeight: "500",
    marginRight: "8px",
  },
  buttonContainer: {
    marginTop: "40px",
    display: "flex",
    gap: "15px",
  },
  primaryBtn: {
    flex: 1,
    padding: "12px 24px",
  },
  secondaryBtn: {
    flex: 1,
    padding: "12px 24px",
    color: "var(--text-main)",
  },
};

export default ProfilePage;
