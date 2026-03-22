import React, { useState } from "react";
import axios from "axios";
import API_URL from '../config/api.js';

function SubmitWorkModal({ onClose, project }) {
    const [githubLink, setGithubLink] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const seekerId = localStorage.getItem("userId");

        if (!seekerId) {
            alert("Please login first!");
            return;
        }

        if (!githubLink.trim() || !videoFile) {
            alert("Both GitHub link and an MP4 explanation video are required!");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('seekerId', seekerId);
            formData.append('githubLink', githubLink.trim());
            formData.append('video', videoFile);
            if (description.trim()) {
                formData.append('description', description.trim());
            }

            const res = await axios.post(
                `${API_URL}/api/founder-projects/${project._id}/submit`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            if (res.data.success) {
                setSuccess(true);
            }
        } catch (err) {
            console.error("Submit work error:", err);
            alert(err.response?.data?.message || "Failed to submit work.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" style={styles.successModal} onClick={e => e.stopPropagation()}>
                    <div style={styles.successIcon}>✅</div>
                    <h2 style={styles.successTitle}>Your project is under review!</h2>
                    <p style={styles.successText}>
                        The founder will review your GitHub code and explanation video.
                        You'll be notified once they make a decision.
                    </p>
                    <button className="btn" onClick={onClose} style={styles.doneBtn}>
                        Got it!
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" style={styles.modal} onClick={e => e.stopPropagation()}>
                <div style={styles.modalHeader}>
                    <h2 style={styles.modalTitle}>Submit Your Work</h2>
                    <p style={styles.modalSubtitle}>
                        For: <span style={styles.projectName}>{project?.title}</span>
                    </p>
                </div>

                {/* Founder Info */}
                {project?.founderId && (
                    <div style={styles.founderBadge}>
                        <div style={styles.founderAvatar}>
                            {project.founderId.name?.charAt(0) || "F"}
                        </div>
                        <div>
                            <div style={styles.founderName}>
                                Posted by {project.founderId.name || "Founder"}
                            </div>
                            <div style={styles.founderStartup}>
                                {project.startupId?.startupTitle || "Startup"}
                            </div>
                        </div>
                    </div>
                )}

                <div style={styles.requirements}>
                    <div style={styles.reqItem}>
                        <span style={styles.reqIcon}>📂</span>
                        <span>GitHub Repository Link <span style={styles.required}>*</span></span>
                    </div>
                    <div style={styles.reqItem}>
                        <span style={styles.reqIcon}>🎥</span>
                        <span>Explanation Video (MP4) <span style={styles.required}>*</span></span>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>GitHub Repository Link *</label>
                        <input
                            className="input-field"
                            value={githubLink}
                            onChange={(e) => setGithubLink(e.target.value)}
                            placeholder="https://github.com/yourusername/project-repo"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Explanation Video (MP4) *</label>
                        <input
                            type="file"
                            accept="video/mp4"
                            className="input-field"
                            onChange={(e) => setVideoFile(e.target.files[0])}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Brief Description (optional)</label>
                        <textarea
                            className="input-field"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Explain your approach, technologies used, any challenges you faced..."
                            rows={3}
                            style={{ resize: "vertical" }}
                        />
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
                            disabled={loading || !githubLink.trim() || !videoFile}
                            style={{
                                opacity: (!githubLink.trim() || !videoFile) ? 0.5 : 1
                            }}
                        >
                            {loading ? "Submitting..." : "Submit Project"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const styles = {
    modal: {
        maxWidth: "520px",
        maxHeight: "90vh",
        overflowY: "auto"
    },
    modalHeader: {
        marginBottom: "16px"
    },
    modalTitle: {
        margin: 0,
        fontSize: "22px",
        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text"
    },
    modalSubtitle: {
        margin: "6px 0 0 0",
        color: "#94a3b8",
        fontSize: "14px"
    },
    projectName: {
        color: "#3b82f6",
        fontWeight: "600"
    },
    founderBadge: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        background: "rgba(59, 130, 246, 0.08)",
        border: "1px solid rgba(59, 130, 246, 0.15)",
        borderRadius: "12px",
        padding: "12px 16px",
        marginBottom: "16px"
    },
    founderAvatar: {
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: "16px"
    },
    founderName: {
        color: "#f8fafc",
        fontWeight: "600",
        fontSize: "14px"
    },
    founderStartup: {
        color: "#94a3b8",
        fontSize: "12px"
    },
    requirements: {
        background: "rgba(139, 92, 246, 0.08)",
        border: "1px solid rgba(139, 92, 246, 0.15)",
        borderRadius: "12px",
        padding: "14px 16px",
        marginBottom: "20px"
    },
    reqItem: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        color: "#e2e8f0",
        fontSize: "14px",
        padding: "4px 0"
    },
    reqIcon: {
        fontSize: "16px"
    },
    required: {
        color: "#ef4444",
        fontWeight: "bold"
    },
    actions: {
        display: "flex",
        gap: "12px",
        justifyContent: "flex-end",
        marginTop: "8px"
    },
    successModal: {
        textAlign: "center",
        maxWidth: "420px"
    },
    successIcon: {
        fontSize: "52px",
        marginBottom: "16px"
    },
    successTitle: {
        margin: "0 0 12px 0",
        color: "#10b981",
        fontSize: "22px"
    },
    successText: {
        color: "#94a3b8",
        marginBottom: "24px",
        lineHeight: "1.6",
        fontSize: "15px"
    },
    doneBtn: {
        width: "100%",
        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)"
    }
};

export default SubmitWorkModal;
