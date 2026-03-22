import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api.js';

function CreateStartupModal({ onClose, initialStartupId = '', joinRole = '' }) {
    const navigate = useNavigate();
    const [step, setStep] = useState(0); // 0: Options, 1: Form, 2: OTP, 3: Success
    const [createdId, setCreatedId] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        dob: '',
        aadharNumber: '',
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

    const [joinData, setJoinData] = useState({
        startupId: initialStartupId,
        roleAppliedFor: joinRole,
        coverLetter: '',
        resumeLink: ''
    });

    // If initialStartupId is passed, jump to join step (step 4)
    useEffect(() => {
        if (initialStartupId) {
            setStep(4);
            setJoinData(prev => ({ ...prev, startupId: initialStartupId }));
        }
    }, [initialStartupId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleJoinInputChange = (e) => {
        const { name, value } = e.target;
        setJoinData({ ...joinData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, aadharPhoto: e.target.files[0] });
    };

    const handleGenerateOtp = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/api/startup/generate-otp`, {
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
            const res = await axios.post(`${API_URL}/api/startup/verify-otp`, {
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
            if (token) {
                const userRes = await axios.get(`${API_URL}/api/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                founderId = userRes.data._id;
            } else {
                founderId = localStorage.getItem('userId');
            }

            if (!founderId) {
                setMessage("Please login first to create a startup.");
                return;
            }

            const submitData = new FormData();
            Object.keys(formData).forEach(key => {
                submitData.append(key, formData[key]);
            });
            submitData.append('founderId', founderId);

            const res = await axios.post(`${API_URL}/api/startup/create`, submitData, {
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
    };

    const submitJoinForm = async (e) => {
        e.preventDefault();
        try {
            const applicantId = localStorage.getItem('userId');

            if (!applicantId) {
                setMessage("Please login first to join a startup.");
                return;
            }

            const res = await axios.post(`${API_URL}/api/application/apply`, {
                ...joinData,
                applicantId
            });

            if (res.data.success) {
                setMessage("Application submitted successfully!");
                setStep(3); // Go to success step
            }
        } catch (error) {
            console.error(error);
            setMessage(error.response?.data?.message || 'Failed to submit application');
        }
    };

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <button style={styles.closeButton} onClick={onClose}>×</button>

                {step === 0 && (
                    <div>
                        <h2 style={styles.title}>How would you like to connect?</h2>
                        <div style={styles.buttonGroup}>
                            <button style={styles.primaryBtn} onClick={() => setStep(1)}>Create a Startup</button>
                            <button style={styles.secondaryBtn} onClick={() => setStep(4)}>Join a Startup</button>
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
                            <label style={{ fontWeight: '600', color: '#334155' }}>Aadhaar Number:</label>
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
                            <label style={{ fontWeight: '600', color: '#334155' }}>Aadhaar Photo:</label>
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
                        <p>{createdId ? "Your idea is under validation!" : "Your application was sent!"}</p>
                        <button style={styles.primaryBtn} onClick={() => {
                            onClose();
                            if (createdId) navigate(`/profile/${createdId}`);
                        }}>Back to Feed</button>
                    </div>
                )}

                {/* JOIN A STARTUP FORM */}
                {step === 4 && (
                    <form style={styles.form} onSubmit={submitJoinForm}>
                        <h2 style={styles.title}>Apply to Join</h2>
                        {message && <p style={{ color: 'red' }}>{message}</p>}

                        <input required style={styles.input} type="text" name="startupId" placeholder="Startup ID (Paste from Feed)" onChange={handleJoinInputChange} />
                        <input required style={styles.input} type="text" name="roleAppliedFor" placeholder="Role (e.g. Developer, Designer)" onChange={handleJoinInputChange} />
                        <textarea required style={styles.textarea} name="coverLetter" placeholder="Why do you want to join?" onChange={handleJoinInputChange}></textarea>
                        <input style={styles.input} type="url" name="resumeLink" placeholder="Resume/Portfolio URL (Optional)" onChange={handleJoinInputChange} />

                        <button style={styles.primaryBtn} type="submit">Submit Application</button>
                    </form>
                )}

            </div>
        </div>
    );
} // <-- Close CreateStartupModal component

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
