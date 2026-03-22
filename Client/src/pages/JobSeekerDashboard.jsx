import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from '../config/api.js';

function JobSeekerDashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [dashData, setDashData] = useState(null);
    const [activeTab, setActiveTab] = useState("submissions");

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!userId || !token) {
            navigate("/login");
            return;
        }

        fetchDashboard(userId);
    }, [navigate]);

    const fetchDashboard = async (userId) => {
        try {
            const res = await axios.get(`${API_URL}/api/users/${userId}/dashboard`);
            if (res.data.success) {
                setDashData(res.data.data);
            }
        } catch (err) {
            console.error(err);
            setError("Could not load dashboard data.");
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "accepted": return { color: "#10b981", bg: "rgba(16,185,129,0.12)", label: "Accepted" };
            case "rejected": return { color: "#ef4444", bg: "rgba(239,68,68,0.12)", label: "Rejected" };
            case "under review": return { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", label: "Under Review" };
            case "pending": return { color: "#3b82f6", bg: "rgba(59,130,246,0.12)", label: "Pending" };
            case "reviewed": return { color: "#8b5cf6", bg: "rgba(139,92,246,0.12)", label: "Reviewed" };
            default: return { color: "#94a3b8", bg: "rgba(148,163,184,0.12)", label: status };
        }
    };

    if (loading) return <div style={styles.loading}>Loading Dashboard...</div>;
    if (error) return <div style={styles.error}>{error}</div>;
    if (!dashData) return <div style={styles.error}>No data found.</div>;

    const { user, submissions, applications, stats } = dashData;

    return (
        <div style={styles.container}>
            {/* Profile Header */}
            <div style={styles.profileHeader}>
                <div style={styles.profileLeft}>
                    <div style={styles.avatar}>
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div style={styles.profileInfo}>
                        <h1 style={styles.profileName}>{user.name}</h1>
                        <p style={styles.profileRole}>{user.role || "Job Seeker"}</p>
                        <p style={styles.profileEmail}>{user.email}</p>
                        <p style={styles.memberSince}>
                            Member since {new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div style={styles.statsGrid}>
                <div style={{ ...styles.statCard, borderLeft: "4px solid #3b82f6" }}>
                    <div style={styles.statNumber}>{stats.totalSubmissions}</div>
                    <div style={styles.statLabel}>Total Submissions</div>
                </div>
                <div style={{ ...styles.statCard, borderLeft: "4px solid #f59e0b" }}>
                    <div style={styles.statNumber}>{stats.underReview}</div>
                    <div style={styles.statLabel}>Under Review</div>
                </div>
                <div style={{ ...styles.statCard, borderLeft: "4px solid #10b981" }}>
                    <div style={styles.statNumber}>{stats.accepted}</div>
                    <div style={styles.statLabel}>Accepted</div>
                </div>
                <div style={{ ...styles.statCard, borderLeft: "4px solid #ef4444" }}>
                    <div style={styles.statNumber}>{stats.rejected}</div>
                    <div style={styles.statLabel}>Rejected</div>
                </div>
            </div>

            {/* Tabs */}
            <div style={styles.mainContent}>
                <div style={styles.tabBar}>
                    <button
                        style={activeTab === "submissions" ? styles.tabActive : styles.tab}
                        onClick={() => setActiveTab("submissions")}
                    >
                        📬 My Submissions ({submissions.length})
                    </button>
                    <button
                        style={activeTab === "applications" ? styles.tabActive : styles.tab}
                        onClick={() => setActiveTab("applications")}
                    >
                        📋 Startup Applications ({applications.length})
                    </button>
                </div>

                {/* Submissions Tab */}
                {activeTab === "submissions" && (
                    <>
                        <div style={styles.sectionHeader}>
                            <h2 style={styles.sectionTitle}>Project Submissions</h2>
                            <p style={styles.sectionSubtitle}>All projects you've submitted work for.</p>
                        </div>

                        {submissions.length === 0 ? (
                            <div style={styles.emptyState}>
                                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
                                <h3 style={{ color: "#f8fafc", marginBottom: "8px" }}>No submissions yet</h3>
                                <p style={{ color: "#94a3b8", marginBottom: "20px" }}>
                                    Browse projects and submit your work to get started!
                                </p>
                                <button className="btn" onClick={() => navigate("/")}>
                                    Browse Projects
                                </button>
                            </div>
                        ) : (
                            <div style={styles.grid}>
                                {submissions.map((sub) => {
                                    const statusStyle = getStatusStyle(sub.status);
                                    return (
                                        <div key={sub._id} style={styles.card}>
                                            <div style={styles.cardTop}>
                                                <span style={{
                                                    ...styles.statusBadge,
                                                    color: statusStyle.color,
                                                    backgroundColor: statusStyle.bg
                                                }}>
                                                    {statusStyle.label}
                                                </span>
                                                <span style={styles.dateText}>
                                                    {new Date(sub.createdAt).toLocaleDateString("en-IN", {
                                                        day: "numeric", month: "short", year: "numeric"
                                                    })}
                                                </span>
                                            </div>

                                            <h3 style={styles.cardTitle}>
                                                {sub.projectId?.title || "Unknown Project"}
                                            </h3>

                                            {sub.projectId?.startupId && (
                                                <p style={styles.startupName}>
                                                    🏢 {sub.projectId.startupId.startupTitle}
                                                </p>
                                            )}

                                            {sub.description && (
                                                <p style={styles.cardDesc}>{sub.description}</p>
                                            )}

                                            <div style={styles.linksRow}>
                                                {sub.githubLink && (
                                                    <a href={sub.githubLink} target="_blank" rel="noreferrer" style={styles.linkBtn}>
                                                        📂 GitHub
                                                    </a>
                                                )}
                                                {sub.videoLink && (
                                                    <a href={sub.videoLink} target="_blank" rel="noreferrer" style={styles.linkBtnVideo}>
                                                        🎥 Video
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}

                {/* Applications Tab */}
                {activeTab === "applications" && (
                    <>
                        <div style={styles.sectionHeader}>
                            <h2 style={styles.sectionTitle}>Startup Applications</h2>
                            <p style={styles.sectionSubtitle}>Startups you've applied to join.</p>
                        </div>

                        {applications.length === 0 ? (
                            <div style={styles.emptyState}>
                                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
                                <h3 style={{ color: "#f8fafc", marginBottom: "8px" }}>No applications yet</h3>
                                <p style={{ color: "#94a3b8", marginBottom: "20px" }}>
                                    Find a startup and apply to join their team!
                                </p>
                                <button className="btn" onClick={() => navigate("/")}>
                                    Explore Startups
                                </button>
                            </div>
                        ) : (
                            <div style={styles.grid}>
                                {applications.map((app) => {
                                    const statusStyle = getStatusStyle(app.status);
                                    return (
                                        <div key={app._id} style={styles.card}>
                                            <div style={styles.cardTop}>
                                                <span style={{
                                                    ...styles.statusBadge,
                                                    color: statusStyle.color,
                                                    backgroundColor: statusStyle.bg
                                                }}>
                                                    {statusStyle.label}
                                                </span>
                                                <span style={styles.dateText}>
                                                    {new Date(app.createdAt).toLocaleDateString("en-IN", {
                                                        day: "numeric", month: "short", year: "numeric"
                                                    })}
                                                </span>
                                            </div>

                                            <h3 style={styles.cardTitle}>
                                                {app.startupId?.startupTitle || "Unknown Startup"}
                                            </h3>

                                            {app.startupId?.sector && (
                                                <p style={styles.startupName}>
                                                    🏷️ Sector: {app.startupId.sector}
                                                </p>
                                            )}

                                            <div style={styles.roleApplied}>
                                                <span style={styles.roleLabel}>Role Applied:</span>
                                                <span style={styles.roleValue}>{app.roleAppliedFor}</span>
                                            </div>

                                            {app.coverLetter && (
                                                <p style={styles.cardDesc}>{app.coverLetter}</p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        fontFamily: "'Inter', sans-serif",
        color: "#f8fafc"
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
    // Profile Header
    profileHeader: {
        background: "linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.15) 100%)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        padding: "40px",
    },
    profileLeft: {
        display: "flex",
        alignItems: "center",
        gap: "24px",
        maxWidth: "1200px",
        margin: "0 auto",
    },
    avatar: {
        width: "90px",
        height: "90px",
        borderRadius: "20px",
        background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "36px",
        fontWeight: "bold",
        boxShadow: "0 8px 24px rgba(59, 130, 246, 0.3)",
        flexShrink: 0,
    },
    profileInfo: {},
    profileName: {
        margin: 0,
        fontSize: "28px",
        fontWeight: "700",
        background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
    },
    profileRole: {
        margin: "4px 0 0 0",
        fontSize: "14px",
        color: "#3b82f6",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        fontWeight: "bold",
    },
    profileEmail: {
        margin: "6px 0 0 0",
        fontSize: "15px",
        color: "#cbd5e1",
    },
    memberSince: {
        margin: "4px 0 0 0",
        fontSize: "13px",
        color: "#64748b",
    },
    // Stats Grid
    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "30px 20px 0 20px",
    },
    statCard: {
        backgroundColor: "#1e293b",
        borderRadius: "14px",
        padding: "24px",
        border: "1px solid rgba(255, 255, 255, 0.05)",
    },
    statNumber: {
        fontSize: "32px",
        fontWeight: "700",
        color: "#f8fafc",
        marginBottom: "4px",
    },
    statLabel: {
        fontSize: "14px",
        color: "#94a3b8",
        fontWeight: "500",
    },
    // Main Content
    mainContent: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "30px 20px",
    },
    tabBar: {
        display: "flex",
        gap: "8px",
        marginBottom: "30px",
        padding: "4px",
        backgroundColor: "rgba(255,255,255,0.03)",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.06)",
    },
    tab: {
        flex: 1,
        padding: "12px 20px",
        borderRadius: "10px",
        border: "none",
        background: "transparent",
        color: "#94a3b8",
        fontWeight: "600",
        cursor: "pointer",
        fontSize: "14px",
        transition: "all 0.2s",
    },
    tabActive: {
        flex: 1,
        padding: "12px 20px",
        borderRadius: "10px",
        border: "none",
        background: "rgba(59,130,246,0.15)",
        color: "#3b82f6",
        fontWeight: "600",
        cursor: "pointer",
        fontSize: "14px",
        boxShadow: "0 2px 8px rgba(59,130,246,0.15)",
    },
    sectionHeader: {
        marginBottom: "20px",
    },
    sectionTitle: {
        fontSize: "1.5rem",
        marginBottom: "0.25rem",
        color: "#f8fafc",
    },
    sectionSubtitle: {
        color: "#94a3b8",
        marginBottom: "1rem",
    },
    emptyState: {
        textAlign: "center",
        padding: "60px",
        backgroundColor: "#1e293b",
        borderRadius: "16px",
        color: "#94a3b8",
        border: "1px dashed rgba(255, 255, 255, 0.1)",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
        gap: "24px",
    },
    card: {
        backgroundColor: "#1e293b",
        borderRadius: "16px",
        padding: "24px",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        display: "flex",
        flexDirection: "column",
    },
    cardTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "12px",
    },
    statusBadge: {
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
    },
    dateText: {
        fontSize: "12px",
        color: "#64748b",
    },
    cardTitle: {
        margin: "0 0 8px 0",
        fontSize: "18px",
        color: "#f8fafc",
        fontWeight: "600",
    },
    startupName: {
        margin: "0 0 10px 0",
        fontSize: "13px",
        color: "#94a3b8",
    },
    cardDesc: {
        fontSize: "14px",
        color: "#94a3b8",
        lineHeight: "1.6",
        marginBottom: "16px",
        display: "-webkit-box",
        WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        flex: 1,
    },
    linksRow: {
        display: "flex",
        gap: "10px",
        marginTop: "auto",
        paddingTop: "16px",
        borderTop: "1px solid rgba(255,255,255,0.05)",
    },
    linkBtn: {
        padding: "8px 16px",
        borderRadius: "8px",
        backgroundColor: "rgba(59,130,246,0.12)",
        color: "#3b82f6",
        textDecoration: "none",
        fontSize: "13px",
        fontWeight: "600",
        transition: "all 0.2s",
    },
    linkBtnVideo: {
        padding: "8px 16px",
        borderRadius: "8px",
        backgroundColor: "rgba(139,92,246,0.12)",
        color: "#8b5cf6",
        textDecoration: "none",
        fontSize: "13px",
        fontWeight: "600",
        transition: "all 0.2s",
    },
    roleApplied: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "12px",
        padding: "10px 14px",
        backgroundColor: "rgba(59,130,246,0.06)",
        borderRadius: "10px",
        border: "1px solid rgba(59,130,246,0.1)",
    },
    roleLabel: {
        fontSize: "13px",
        color: "#94a3b8",
        fontWeight: "500",
    },
    roleValue: {
        fontSize: "14px",
        color: "#3b82f6",
        fontWeight: "600",
    },
};

export default JobSeekerDashboard;
