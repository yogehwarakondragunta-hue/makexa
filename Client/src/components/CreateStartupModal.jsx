import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreateStartupModal({ onClose }) {
    const navigate = useNavigate();
    const [step, setStep] = useState(0); // 0: Options, 1: Form, 2: OTP, 3: Success
    const [createdId, setCreatedId] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        dob: '',
        aadharPhoto: null,
        startupTitle: '',
        coreIdea: '',
        members: '',
        sector: '',
        futureVision: '',
        mobileNumber: ''
    });
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');

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
            const token = localStorage.getItem('token'); // Might be null if no auth
            // Assuming we mock a user ID if no token exists for the demo
            let founderId = "000000000000000000000000";

            if (token) {
                const userRes = await axios.get("http://localhost:5000/api/auth/me", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                founderId = userRes.data._id;
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
            setMessage(error.response?.data?.message || 'Failed to create startup request');
        }
    }

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <button style={styles.closeButton} onClick={onClose}>×</button>

                {step === 0 && (
                    <div>
                        <h2 style={styles.title}>What would you like to do?</h2>
                        <div style={styles.buttonGroup}>
                            <button style={styles.primaryBtn} onClick={() => setStep(1)}>Create a startup</button>
                            <button style={styles.secondaryBtn} onClick={() => alert("Join startup feature coming soon!")}>Join a startup</button>
                        </div>
                    </div>
                )}

                {step === 1 && (
                    <form style={styles.form} onSubmit={handleGenerateOtp}>
                        <h2 style={styles.title}>Create a Startup</h2>
                        {message && <p style={{ color: 'red' }}>{message}</p>}

                        <input required style={styles.input} type="text" name="fullName" placeholder="Full Name" onChange={handleInputChange} />
                        <input required style={styles.input} type="email" name="email" placeholder="Email Address" onChange={handleInputChange} />
                        <input required style={styles.input} type="date" name="dob" placeholder="Date of Birth" onChange={handleInputChange} />

                        <div style={styles.fileInputGroup}>
                            <label>Aadhar Photo:</label>
                            <input required style={styles.input} type="file" name="aadharPhoto" accept="image/*" onChange={handleFileChange} />
                        </div>

                        <input required style={styles.input} type="text" name="startupTitle" placeholder="Startup Title" onChange={handleInputChange} />

                        <textarea required style={styles.textarea} name="coreIdea" placeholder="Core Idea" onChange={handleInputChange}></textarea>

                        <input required style={styles.input} type="number" name="members" placeholder="Number of Members" onChange={handleInputChange} />

                        <input required style={styles.input} type="text" name="sector" placeholder="Sector" onChange={handleInputChange} />

                        <textarea required style={styles.textarea} name="futureVision" placeholder="Future Vision" onChange={handleInputChange}></textarea>

                        <input required style={styles.input} type="tel" name="mobileNumber" placeholder="Mobile Number" onChange={handleInputChange} />

                        <button style={styles.primaryBtn} type="submit">Create</button>
                    </form>
                )}

                {step === 2 && (
                    <form style={styles.form} onSubmit={handleVerifyOtp}>
                        <h2 style={styles.title}>Verify Mobile Number</h2>
                        <p>An OTP has been sent to {formData.mobileNumber}. (Check server console for mock OTP)</p>
                        {message && <p style={{ color: 'red' }}>{message}</p>}

                        <input required style={styles.input} type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
                        <button style={styles.primaryBtn} type="submit">Verify</button>
                    </form>
                )}

                {step === 3 && (
                    <div style={styles.successContainer}>
                        <div style={styles.successIcon}>✓</div>
                        <h2 style={styles.title}>Success!</h2>
                        <p>Your idea is under validation!</p>
                        <button style={styles.primaryBtn} onClick={() => {
                            onClose();
                            navigate(`/profile/${createdId}`);
                        }}>View Profile</button>
                    </div>
                )}

            </div>
        </div>
    );
}

const styles = {
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
    },
    closeButton: {
        position: 'absolute',
        top: '15px',
        right: '20px',
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        color: '#666'
    },
    title: {
        marginBottom: '20px',
        textAlign: 'center',
        color: '#333'
    },
    buttonGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        marginTop: '30px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    input: {
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '16px'
    },
    textarea: {
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '16px',
        minHeight: '100px',
        resize: 'vertical'
    },
    fileInputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
    },
    primaryBtn: {
        backgroundColor: '#2563eb',
        color: 'white',
        padding: '14px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    },
    secondaryBtn: {
        backgroundColor: '#f1f5f9',
        color: '#334155',
        padding: '14px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    },
    successContainer: {
        textAlign: 'center',
        padding: '20px 0'
    },
    successIcon: {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#10b981',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '30px',
        margin: '0 auto 20px',
    }
};

export default CreateStartupModal;
