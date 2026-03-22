import React, { useState } from "react";
import axios from "axios";
import API_URL from '../config/api.js';

function PostProjectModal({ onClose, startupId }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        requiredSkills: "",
        difficulty: "Medium",
        deadline: ""
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const founderId = localStorage.getItem("userId");

        if (!founderId || !startupId) {
            alert("Missing founder or startup info.");
            return;
        }

        if (!formData.title.trim() || !formData.description.trim()) {
            alert("Title and description are required.");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                founderId,
                startupId,
                title: formData.title.trim(),
                description: formData.description.trim(),
                requiredSkills: formData.requiredSkills
                    .split(",")
                    .map(s => s.trim())
                    .filter(Boolean),
                difficulty: formData.difficulty,
                deadline: formData.deadline || null
            };

            const res = await axios.post(`${API_URL}/api/founder-projects`, payload);
            if (res.data.success) {
                setSuccess(true);
            }
        } catch (err) {
            console.error("Post project error:", err);
            alert(err.response?.data?.message || "Failed to post project.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" style={styles.successModal} onClick={e => e.stopPropagation()}>
                    <div style={styles.successIcon}>🚀</div>
                    <h2 style={styles.successTitle}>Project Posted!</h2>
                    <p style={styles.successText}>
                        Your project is now live. Job seekers can see it and start submitting their work.
                    </p>
                    <button className="btn" onClick={onClose} style={styles.doneBtn}>
                        Done
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" style={styles.modal} onClick={e => e.stopPropagation()}>
                <div style={styles.modalHeader}>
                    <h2 style={styles.modalTitle}>Post a Project</h2>
                    <p style={styles.modalSubtitle}>Give job seekers a chance to showcase their talent</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Project Title *</label>
                        <input
                            className="input-field"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., Build an E-Commerce Cart UI"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Description *</label>
                        <textarea
                            className="input-field"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe what the job seeker needs to build, what features to include..."
                            rows={4}
                            style={{ resize: "vertical", minHeight: "100px" }}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Required Skills (comma separated)</label>
                        <input
                            className="input-field"
                            name="requiredSkills"
                            value={formData.requiredSkills}
                            onChange={handleChange}
                            placeholder="e.g., React, CSS, Node.js"
                        />
                    </div>

                    <div style={styles.row}>
                        <div className="input-group" style={{ flex: 1 }}>
                            <label>Difficulty</label>
                            <select
                                className="input-field"
                                name="difficulty"
                                value={formData.difficulty}
                                onChange={handleChange}
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                        <div className="input-group" style={{ flex: 1 }}>
                            <label>Deadline (optional)</label>
                            <input
                                className="input-field"
                                type="date"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div style={styles.infoBox}>
                        <span style={styles.infoIcon}>ℹ️</span>
                        <span>Job seekers must submit both a <strong>GitHub link</strong> and an <strong>explanation video</strong> to complete this project.</span>
                    </div>

                    <div style={styles.actions}>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn"
                            disabled={loading}
                        >
                            {loading ? "Posting..." : "Post Project"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const styles = {
    modal: {
        maxWidth: "560px",
        maxHeight: "90vh",
        overflowY: "auto"
    },
    modalHeader: {
        marginBottom: "24px"
    },
    modalTitle: {
        margin: 0,
        fontSize: "22px",
        background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text"
    },
    modalSubtitle: {
        margin: "6px 0 0 0",
        color: "#94a3b8",
        fontSize: "14px"
    },
    row: {
        display: "flex",
        gap: "16px"
    },
    infoBox: {
        background: "rgba(59, 130, 246, 0.1)",
        border: "1px solid rgba(59, 130, 246, 0.2)",
        borderRadius: "10px",
        padding: "12px 16px",
        fontSize: "13px",
        color: "#94a3b8",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "20px"
    },
    infoIcon: {
        fontSize: "18px"
    },
    actions: {
        display: "flex",
        gap: "12px",
        justifyContent: "flex-end"
    },
    successModal: {
        textAlign: "center",
        maxWidth: "400px"
    },
    successIcon: {
        fontSize: "48px",
        marginBottom: "16px"
    },
    successTitle: {
        margin: "0 0 8px 0",
        color: "#10b981",
        fontSize: "24px"
    },
    successText: {
        color: "#94a3b8",
        marginBottom: "24px",
        lineHeight: "1.6"
    },
    doneBtn: {
        width: "100%",
        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)"
    }
};

export default PostProjectModal;
