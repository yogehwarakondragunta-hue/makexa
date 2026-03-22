import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from '../config/api.js';

function FounderProjectSubmissions() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const founderId = localStorage.getItem("userId");
        const role = localStorage.getItem("userRole");

        if (role !== "founder" || !founderId) {
            navigate("/login");
            return;
        }

        fetchSubmissions();
    }, [projectId, navigate]);

    const fetchSubmissions = async () => {
        try {
            const res = await axios.get(
                `${API_URL}/api/founder-projects/${projectId}/submissions`
            );
            if (res.data.success !== false) {
                setProject(res.data.project);
                setSubmissions(res.data.data);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load submissions.");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (submissionId, status) => {
        const founderId = localStorage.getItem("userId");
        try {
            const res = await axios.put(
                `${API_URL}/api/founder-projects/submissions/${submissionId}/status`,
                { status, founderId }
            );
            if (res.data.success) {
                setSubmissions(prev =>
                    prev.map(s => s._id === submissionId ? { ...s, status } : s)
                );
            }
        } catch (err) {
            console.error(err);
            alert("Failed to update status.");
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "accepted": return { color: "#10b981", bg: "rgba(16, 185, 129, 0.1)", border: "rgba(16, 185, 129, 0.2)" };
            case "rejected": return { color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)", border: "rgba(239, 68, 68, 0.2)" };
            default: return { color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)", border: "rgba(245, 158, 11, 0.2)" };
        }
    };

    if (loading) return <div style={styles.loading}>Loading submissions...</div>;
    if (error) return <div style={styles.error}>{error}</div>;

    return (
        <div style={styles.container}>
            {/* Back button */}
            <button
                style={styles.backBtn}
                onClick={() => navigate("/founder-dashboard")}
            >
                ← Back to Dashboard
            </button>

            {/* Project Header */}
            {project && (
                <div style={styles.projectHeader}>
                    <div style={styles.projectIcon}>📋</div>
                    <div>
                        <h1 style={styles.projectTitle}>{project.title}</h1>
                        <p style={styles.projectMeta}>
                            {project.startupId?.startupTitle} • {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>
            )}

            {/* Submissions */}
            <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Submissions</h2>
                <p style={styles.sectionSubtitle}>Review job seeker submissions, check their GitHub code and explanation videos.</p>
            </div>

            {submissions.length === 0 ? (
                <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>📭</div>
                    <h3 style={styles.emptyTitle}>No submissions yet</h3>
                    <p style={styles.emptyText}>Job seekers haven't submitted work for this project yet.</p>
                </div>
            ) : (
                <div style={styles.grid}>
                    {submissions.map((sub) => {
                        const statusStyle = getStatusStyle(sub.status);
                        return (
                            <div key={sub._id} style={styles.card}>
                                {/* Seeker Info */}
                                <div style={styles.cardHeader}>
                                    <div style={styles.seekerAvatar}>
                                        {sub.seekerId?.name?.charAt(0) || "?"}
                                    </div>
                                    <div style={styles.seekerInfo}>
                                        <h3 style={styles.seekerName}>{sub.seekerId?.name || "Unknown"}</h3>
                                        <p style={styles.seekerEmail}>{sub.seekerId?.email || ""}</p>
                                    </div>
                                    <div style={{
                                        ...styles.statusBadge,
                                        color: statusStyle.color,
                                        backgroundColor: statusStyle.bg,
                                        border: `1px solid ${statusStyle.border}`
                                    }}>
                                        {sub.status}
                                    </div>
                                </div>

                                {/* Links */}
                                <div style={styles.linksSection}>
                                    <a
                                        href={sub.githubLink?.startsWith('http') ? sub.githubLink : `https://${sub.githubLink}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={styles.linkCard}
                                    >
                                        <span style={styles.linkIcon}>📂</span>
                                        <div>
                                            <div style={styles.linkLabel}>GitHub Repository</div>
                                            <div style={styles.linkUrl}>{sub.githubLink}</div>
                                        </div>
                                        <span style={styles.externalIcon}>↗</span>
                                    </a>

                                    <div style={{ marginTop: '10px' }}>
                                        <div style={styles.linkLabel}>Explanation Video</div>
                                        <video
                                            controls
                                            style={{ width: '100%', maxHeight: '400px', borderRadius: '8px', marginTop: '8px', backgroundColor: '#000' }}
                                            src={sub.videoLink?.startsWith('http') ? sub.videoLink : `${API_URL}${sub.videoLink}`}
                                        >
                                            Your browser does not support the video tag.
                                        </video>
                                        <a
                                            href={sub.videoLink?.startsWith('http') ? sub.videoLink : `${API_URL}${sub.videoLink}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ ...styles.linkCard, marginTop: '8px' }}
                                        >
                                            <span style={styles.linkIcon}>🎥</span>
                                            <div>
                                                <div style={styles.linkLabel}>Open Video in New Tab</div>
                                            </div>
                                            <span style={styles.externalIcon}>↗</span>
                                        </a>
                                    </div>
                                </div>

                                {/* Description */}
                                {sub.description && (
                                    <div style={styles.descriptionBox}>
                                        <p style={styles.descriptionText}>{sub.description}</p>
                                    </div>
                                )}

                                {/* Submitted date */}
                                <div style={styles.dateText}>
                                    Submitted on {new Date(sub.createdAt).toLocaleDateString("en-IN", {
                                        day: "numeric", month: "short", year: "numeric"
                                    })}
                                </div>

                                {/* Actions */}
                                {sub.status === "under review" && (
                                    <div style={styles.actions}>
                                        <button
                                            style={styles.acceptBtn}
                                            onClick={() => handleStatusUpdate(sub._id, "accepted")}
                                        >
                                            ✓ Accept
                                        </button>
                                        <button
                                            style={styles.rejectBtn}
                                            onClick={() => handleStatusUpdate(sub._id, "rejected")}
                                        >
                                            ✕ Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        fontFamily: "'Inter', sans-serif",
        color: "#f8fafc",
        padding: "20px 40px"
    },
    loading: {
        textAlign: "center",
        marginTop: "100px",
        fontSize: "18px",
        color: "#94a3b8"
    },
    error: {
        textAlign: "center",
        marginTop: "100px",
        fontSize: "18px",
        color: "#ef4444"
    },
    backBtn: {
        background: "transparent",
        border: "1px solid rgba(255,255,255,0.15)",
        color: "#94a3b8",
        padding: "8px 20px",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px",
        marginBottom: "24px",
        transition: "all 0.2s"
    },
    projectHeader: {
        display: "flex",
        alignItems: "center",
        gap: "20px",
        marginBottom: "32px",
        padding: "24px",
        background: "linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.1) 100%)",
        borderRadius: "16px",
        border: "1px solid rgba(59,130,246,0.15)"
    },
    projectIcon: {
        fontSize: "40px"
    },
    projectTitle: {
        margin: 0,
        fontSize: "24px",
        background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text"
    },
    projectMeta: {
        margin: "4px 0 0 0",
        color: "#94a3b8",
        fontSize: "14px"
    },
    sectionHeader: {
        marginBottom: "24px"
    },
    sectionTitle: {
        fontSize: "1.5rem",
        marginBottom: "0.25rem",
        color: "#f8fafc"
    },
    sectionSubtitle: {
        color: "#94a3b8",
        fontSize: "14px"
    },
    emptyState: {
        textAlign: "center",
        padding: "60px",
        backgroundColor: "#1e293b",
        borderRadius: "16px",
        border: "1px dashed rgba(255,255,255,0.1)"
    },
    emptyIcon: {
        fontSize: "48px",
        marginBottom: "16px"
    },
    emptyTitle: {
        color: "#f8fafc",
        marginBottom: "8px"
    },
    emptyText: {
        color: "#94a3b8"
    },
    grid: {
        display: "grid",
        gap: "24px",
        gridTemplateColumns: "1fr"
    },
    card: {
        backgroundColor: "#1e293b",
        borderRadius: "16px",
        padding: "24px",
        border: "1px solid rgba(255,255,255,0.05)",
        transition: "transform 0.2s ease"
    },
    cardHeader: {
        display: "flex",
        alignItems: "center",
        gap: "14px",
        marginBottom: "20px"
    },
    seekerAvatar: {
        width: "44px",
        height: "44px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: "18px"
    },
    seekerInfo: {
        flex: 1
    },
    seekerName: {
        margin: 0,
        fontSize: "16px",
        color: "#f8fafc",
        fontWeight: "600"
    },
    seekerEmail: {
        margin: "2px 0 0 0",
        fontSize: "13px",
        color: "#94a3b8"
    },
    statusBadge: {
        padding: "5px 14px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "0.5px"
    },
    linksSection: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        marginBottom: "16px"
    },
    linkCard: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px 16px",
        background: "rgba(0,0,0,0.2)",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.06)",
        textDecoration: "none",
        color: "#f8fafc",
        transition: "all 0.2s"
    },
    linkIcon: {
        fontSize: "22px"
    },
    linkLabel: {
        fontSize: "13px",
        color: "#94a3b8",
        marginBottom: "2px"
    },
    linkUrl: {
        fontSize: "14px",
        color: "#3b82f6",
        wordBreak: "break-all"
    },
    externalIcon: {
        marginLeft: "auto",
        color: "#94a3b8",
        fontSize: "16px"
    },
    descriptionBox: {
        background: "rgba(255,255,255,0.03)",
        borderRadius: "10px",
        padding: "12px 16px",
        marginBottom: "12px"
    },
    descriptionText: {
        margin: 0,
        fontSize: "14px",
        color: "#cbd5e1",
        lineHeight: "1.6"
    },
    dateText: {
        fontSize: "12px",
        color: "#64748b",
        marginBottom: "16px"
    },
    actions: {
        display: "flex",
        gap: "12px",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        paddingTop: "16px"
    },
    acceptBtn: {
        flex: 1,
        padding: "10px",
        borderRadius: "10px",
        border: "none",
        backgroundColor: "rgba(16, 185, 129, 0.15)",
        color: "#10b981",
        fontWeight: "600",
        cursor: "pointer",
        fontSize: "14px",
        transition: "all 0.2s"
    },
    rejectBtn: {
        flex: 1,
        padding: "10px",
        borderRadius: "10px",
        border: "none",
        backgroundColor: "rgba(239, 68, 68, 0.15)",
        color: "#ef4444",
        fontWeight: "600",
        cursor: "pointer",
        fontSize: "14px",
        transition: "all 0.2s"
    }
};

export default FounderProjectSubmissions;
