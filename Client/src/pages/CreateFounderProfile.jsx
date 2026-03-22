import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateFounderProfile() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Form, 2: OTP, 3: Success
  const [message, setMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [createdId, setCreatedId] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    dob: "",
    aadharNumber: "",
    aadharPhoto: null,
    startupTitle: "",
    coreIdea: "",
    members: "",
    sector: "",
    futureVision: "",
    mobileNumber: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, aadharPhoto: e.target.files[0] });
  };

  const handleGenerateOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/startup/generate-otp', {
        mobileNumber: formData.mobileNumber
      });
      if (res.data.success) {
        if (res.data.mockOtp) {
          setOtp(res.data.mockOtp);
          alert(`Development Mode: Your mock OTP is ${res.data.mockOtp}`);
        }
        setStep(2); // Go to OTP step
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/startup/verify-otp', {
        mobileNumber: formData.mobileNumber,
        otp
      });
      if (res.data.success) {
        submitStartupForm();
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || 'Invalid OTP');
    }
  };

  const submitStartupForm = async () => {
    try {
      const founderId = localStorage.getItem('userId');

      if (!founderId) {
        setMessage("Please login first to create a startup.");
        return;
      }

      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      submitData.append('founderId', founderId);

      const res = await axios.post('http://localhost:5000/api/startup/create', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        setCreatedId(res.data.data._id);
        setStep(3); // Success step
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || 'Failed to create startup');
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.backgroundPattern}></div>
      <div style={styles.container}>
        <div style={styles.logoSection}>
          <h1 style={styles.logo}>🚀 Makexa</h1>
          <p style={styles.tagline}>Launch Your Startup</p>
        </div>

        {step === 1 && (
          <form style={styles.form} onSubmit={handleGenerateOtp}>
            <h2 style={styles.title}>Create your Startup Profile</h2>
            <p style={styles.subtitle}>Tell us about your next big idea</p>
            {message && <p style={{ color: 'red', textAlign: 'center' }}>{message}</p>}

            <input required style={styles.input} type="text" name="fullName" placeholder="Full Name" onChange={handleInputChange} />
            <input required style={styles.input} type="email" name="email" placeholder="Email Address" onChange={handleInputChange} />
            <input required style={styles.input} type="date" name="dob" placeholder="Date of Birth" onChange={handleInputChange} />

            <div style={styles.fileInputGroup}>
              <label style={{ fontWeight: '600', color: '#555', fontSize: '14px' }}>Aadhaar Number:</label>
              <input
                required
                style={styles.input}
                type="text"
                name="aadharNumber"
                placeholder="Enter 12-digit Aadhaar Number"
                maxLength={12}
                pattern="[0-9]{12}"
                title="Aadhaar number must be exactly 12 digits"
                onChange={handleInputChange}
              />
            </div>

            <div style={styles.fileInputGroup}>
              <label style={{ fontWeight: '600', color: '#555', fontSize: '14px' }}>Aadhaar Photo:</label>
              <input required style={{ ...styles.input, padding: '10px' }} type="file" name="aadharPhoto" accept="image/*" onChange={handleFileChange} />
            </div>

            <input required style={styles.input} type="text" name="startupTitle" placeholder="Startup Title" onChange={handleInputChange} />

            <textarea required style={styles.textarea} name="coreIdea" placeholder="Core Idea" onChange={handleInputChange}></textarea>

            <input required style={styles.input} type="number" name="members" placeholder="Number of Members" onChange={handleInputChange} />

            <input required style={styles.input} type="text" name="sector" placeholder="Sector (e.g. EdTech, SaaS)" onChange={handleInputChange} />

            <textarea required style={styles.textarea} name="futureVision" placeholder="Future Vision" onChange={handleInputChange}></textarea>

            <input required style={styles.input} type="tel" name="mobileNumber" placeholder="Mobile Number" onChange={handleInputChange} />

            <button style={styles.button} type="submit">Continue & Verify Mobile</button>
          </form>
        )}

        {step === 2 && (
          <form style={styles.form} onSubmit={handleVerifyOtp}>
            <h2 style={styles.title}>Verify Mobile Number</h2>
            <p style={styles.subtitle}>An OTP has been sent to {formData.mobileNumber}.</p>
            {message && <p style={{ color: 'red', textAlign: 'center' }}>{message}</p>}

            <input required style={styles.input} type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
            <button style={styles.button} type="submit">Verify & Create</button>
          </form>
        )}

        {step === 3 && (
          <div style={styles.successContainer}>
            <div style={styles.successIcon}>✓</div>
            <h2 style={styles.title}>Startup Registered!</h2>
            <p style={styles.subtitle}>Your startup <strong>{formData.startupTitle}</strong> has been successfully created and is now part of the Makexa ecosystem.</p>
            <button style={styles.button} onClick={() => {
              navigate("/");
            }}>Go to Home Feed</button>
          </div>
        )}
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
    background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    padding: "60px 20px"
  },
  backgroundPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.03) 0%, transparent 50%)",
    pointerEvents: "none"
  },
  container: {
    maxWidth: "600px",
    width: "100%",
    padding: "40px",
    background: "rgba(255, 255, 255, 0.98)",
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
    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  },
  tagline: {
    color: "#64748b",
    margin: 0,
    fontSize: "14px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "1px"
  },
  title: {
    textAlign: "center",
    margin: "0 0 8px 0",
    color: "#1e293b",
    fontSize: "24px",
    fontWeight: "700"
  },
  subtitle: {
    textAlign: "center",
    margin: "0 0 30px 0",
    color: "#64748b",
    fontSize: "15px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    border: "2px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "15px",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
    outline: "none",
    color: "#1e293b"
  },
  textarea: {
    width: "100%",
    padding: "14px 16px",
    border: "2px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "15px",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
    outline: "none",
    minHeight: "100px",
    resize: "vertical",
    fontFamily: "inherit",
    color: "#1e293b"
  },
  fileInputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },
  button: {
    width: "100%",
    padding: "16px",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    marginTop: "10px",
    boxShadow: "0 4px 14px rgba(59, 130, 246, 0.4)"
  },
  successContainer: {
    textAlign: 'center',
    padding: '20px 0'
  },
  successIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    margin: '0 auto 24px',
    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)'
  }
};

export default CreateFounderProfile;

