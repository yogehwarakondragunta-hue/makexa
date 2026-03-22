import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PostProjectModal from "../components/PostProjectModal";

function FounderDashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [startupProfile, setStartupProfile] = useState(null);
    const [founderProjects, setFounderProjects] = useState([]);
    const [error, setError] = useState("");
    const [showPostProject, setShowPostProject] = useState(false);
    const [activeTab, setActiveTab] = useState("projects");

    useEffect(() => {
        const role = localStorage.getItem("userRole");
        const founderId = localStorage.getItem("userId");

        if ((role !== "founder" && role !== "admin") || !founderId) {
            navigate("/login");
            return;
        }

        fetchDashboardData(founderId);
    }, [navigate]);

    const fetchDashboardData = async (founderId) => {
        try {
            // Fetch startup profile
            const startupRes = await axios.get(`http://localhost:5000/api/startup/founder/${founderId}`);
            
            if (startupRes.data.success && startupRes.data.data) {
                setStartupProfile(startupRes.data.data);

                // Fetch founder's posted projects
                const projRes = await axios.get(`http://localhost:5000/api/founder-projects/startup/${startupRes.data.data._id}`);
                if (projRes.data.success) {
                    setFounderProjects(projRes.data.data);
                }
            } else {
                // If no startup found for this founder, force them to create it.
                navigate("/create-founder-profile");
            }
        } catch (err) {
            if (err.response && err.response.status === 404) {
                // Founder has no startup profile created yet
                navigate("/create-founder-profile");
            } else {
                console.error(err);
                setError("Could not load dashboard data.");
            }
        } finally {
            setLoading(false);
        }
    };

    const getDifficultyStyle = (difficulty) => {
        switch (difficulty) {
            case "Easy": return { color: "#10b981", bg: "rgba(16,185,129,0.1)" };
            case "Hard": return { color: "#ef4444", bg: "rgba(239,68,68,0.1)" };
            default: return { color: "#f59e0b", bg: "rgba(245,158,11,0.1)" };
        }
    };

    if (loading) return <div style={styles.loading}>Loading Dashboard...</div>;
    if (error) return <div style={styles.error}>{error}</div>;

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div style={styles.headerContent}>
                    <h1 style={styles.title}>Founder Dashboard</h1>
                    {startupProfile && (
                        <p style={styles.subtitle}>Managing: <span style={styles.accent}>{startupProfile.startupTitle}</span></p>
                    )}
                </div>
                <div style={styles.headerActions}>
                    {startupProfile && (
                        <button
                            style={styles.postProjectBtn}
                            onClick={() => setShowPostProject(true)}
                        >
                            + Post a Project
                        </button>
                    )}
                    <button
                        style={styles.logoutBtn}
                        onClick={() => {
                            localStorage.clear();
                            navigate('/login');
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div style={styles.mainContent}>
                {/* Tab Switcher - only projects now */}
                <div style={styles.tabBar}>
                    <button
                        style={activeTab === "projects" ? styles.tabActive : styles.tab}
                        onClick={() => setActiveTab("projects")}
                    >
                        📋 My Projects ({founderProjects.length})
                    </button>
                </div>

                {/* Projects Tab */}
                {activeTab === "projects" && (
                    <>
                        <div style={styles.sectionHeader}>
                            <h2 style={styles.sectionTitle}>Posted Projects</h2>
                            <p style={styles.sectionSubtitle}>Projects you've posted for job seekers to work on.</p>
                        </div>

                        {founderProjects.length === 0 ? (
                            <div style={styles.emptyState}>
                                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
                                <h3 style={{ color: "#f8fafc", marginBottom: "8px" }}>No projects posted yet</h3>
                                <p style={{ color: "#94a3b8", marginBottom: "20px" }}>Post a project to give job seekers a chance to showcase their talent!</p>
                                <button
                                    className="btn"
                                    onClick={() => setShowPostProject(true)}
                                >
                                    + Post Your First Project
                                </button>
                            </div>
                        ) : (
                            <div style={styles.grid}>
                                {founderProjects.map((proj) => {
                                    const diffStyle = getDifficultyStyle(proj.difficulty);
                                    return (
                                        <div key={proj._id} style={styles.card}>
                                            <div style={styles.cardTop}>
                                                <span style={{
                                                    ...styles.diffBadge,
                                                    color: diffStyle.color,
                                                    backgroundColor: diffStyle.bg
                                                }}>
                                                    {proj.difficulty}
                                                </span>
                                                <span style={styles.statusDot(proj.status === "open")}>
                                                    {proj.status === "open" ? "● Open" : "● Closed"}
                                                </span>
                                            </div>

                                            <h3 style={styles.cardTitle}>{proj.title}</h3>
                                            <p style={styles.cardDesc}>{proj.description}</p>

                                            {proj.requiredSkills?.length > 0 && (
                                                <div style={styles.skillsRow}>
                                                    {proj.requiredSkills.map((skill, i) => (
                                                        <span key={i} style={styles.skillTag}>{skill}</span>
                                                    ))}
                                                </div>
                                            )}

                                            <div style={styles.cardFooter}>
                                                <div style={styles.submissionCount}>
                                                    <span style={styles.submissionIcon}>📬</span>
                                                    <span>{proj.submissionCount || 0} submission{(proj.submissionCount || 0) !== 1 ? "s" : ""}</span>
                                                </div>
                                                <button
                                                    className="btn"
                                                    style={styles.viewSubsBtn}
                                                    onClick={() => navigate(`/founder-projects/${proj._id}/submissions`)}
                                                >
                                                    View Submissions
                                                </button>
                                            </div>

                                            {proj.deadline && (
                                                <div style={styles.deadlineText}>
                                                    Deadline: {new Date(proj.deadline).toLocaleDateString("en-IN", {
                                                        day: "numeric", month: "short", year: "numeric"
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Post Project Modal */}
            {showPostProject && startupProfile && (
                <PostProjectModal
                    onClose={() => {
                        setShowPostProject(false);
                        const founderId = localStorage.getItem("userId");
                        fetchDashboardData(founderId); // Refresh to show new project
                    }}
                    startupId={startupProfile._id}
                />
            )}
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
    header: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        backdropFilter: "blur(10px)",
        padding: "20px 40px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 100
    },
    headerContent: {},
    headerActions: {
        display: "flex",
        gap: "12px",
        alignItems: "center"
    },
    title: {
        margin: 0,
        fontSize: "24px",
        fontWeight: "bold",
        background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text"
    },
    subtitle: {
        margin: "5px 0 0 0",
        color: "#94a3b8",
        fontSize: "14px"
    },
    accent: {
        color: "#3b82f6",
        fontWeight: "600"
    },
    postProjectBtn: {
        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        color: "white",
        border: "none",
        padding: "10px 22px",
        borderRadius: "10px",
        fontWeight: "600",
        cursor: "pointer",
        fontSize: "14px",
        boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
        transition: "all 0.2s ease"
    },
    logoutBtn: {
        backgroundColor: "transparent",
        color: "#f8fafc",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        padding: "8px 20px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
        transition: "all 0.2s ease"
    },
    mainContent: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "30px 20px"
    },
    tabBar: {
        display: "flex",
        gap: "8px",
        marginBottom: "30px",
        padding: "4px",
        backgroundColor: "rgba(255,255,255,0.03)",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.06)"
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
        transition: "all 0.2s"
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
        boxShadow: "0 2px 8px rgba(59,130,246,0.15)"
    },
    sectionHeader: {
        marginBottom: "20px"
    },
    sectionTitle: {
        fontSize: "1.5rem",
        marginBottom: "0.25rem",
        color: "#f8fafc"
    },
    sectionSubtitle: {
        color: "#94a3b8",
        marginBottom: "1rem"
    },
    emptyState: {
        textAlign: "center",
        padding: "60px",
        backgroundColor: "#1e293b",
        borderRadius: "16px",
        color: "#94a3b8",
        border: "1px dashed rgba(255, 255, 255, 0.1)"
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
        gap: "24px"
    },
    card: {
        backgroundColor: "#1e293b",
        borderRadius: "16px",
        padding: "24px",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        display: "flex",
        flexDirection: "column"
    },
    cardTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "12px"
    },
    diffBadge: {
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "0.5px"
    },
    statusDot: (isOpen) => ({
        fontSize: "12px",
        color: isOpen ? "#10b981" : "#ef4444",
        fontWeight: "600"
    }),
    cardTitle: {
        margin: "0 0 8px 0",
        fontSize: "18px",
        color: "#f8fafc",
        fontWeight: "600"
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
        flex: 1
    },
    skillsRow: {
        display: "flex",
        flexWrap: "wrap",
        gap: "6px",
        marginBottom: "16px"
    },
    skillTag: {
        backgroundColor: "rgba(59,130,246,0.1)",
        color: "#3b82f6",
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "500"
    },
    cardFooter: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        paddingTop: "16px"
    },
    submissionCount: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "14px",
        color: "#94a3b8"
    },
    submissionIcon: {
        fontSize: "16px"
    },
    viewSubsBtn: {
        padding: "8px 16px",
        fontSize: "13px"
    },
    deadlineText: {
        fontSize: "12px",
        color: "#64748b",
        marginTop: "10px"
    }
};

export default FounderDashboard;
