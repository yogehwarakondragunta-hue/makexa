import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SubmitWorkModal from "./SubmitWorkModal";

export default function ProjectFeed({ onActionClick }) {
    const [startups, setStartups] = useState([]);
    const [talent, setTalent] = useState([]);
    const [founderProjects, setFounderProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitProject, setSubmitProject] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUnifiedFeed = async () => {
            try {
                // Fetch Startups, Users, and Founder Projects in parallel
                const [startupsRes, usersRes, founderProjRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/startup'),
                    axios.get('http://localhost:5000/api/users'),
                    axios.get('http://localhost:5000/api/founder-projects')
                ]);

                if (startupsRes.data.success) {
                    setStartups(startupsRes.data.data);
                }

                if (usersRes.data.success) {
                    const jobSeekers = usersRes.data.data.filter(u => u.role !== 'founder' && u.role !== 'admin');
                    setTalent(jobSeekers);
                }

                if (founderProjRes.data.success) {
                    setFounderProjects(founderProjRes.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch feed:", err);
                setError('Failed to load the feed.');
            } finally {
                setLoading(false);
            }
        };

        fetchUnifiedFeed();
    }, []);

    const handleConnectClick = async (user) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert("Please login first to connect!");
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/api/messages', {
                senderId: userId,
                receiverId: user._id,
                content: `Hi ${user.name}, I'd like to connect and collaborate with you!`
            });
            if (res.data.success) {
                alert(`Connection request sent to ${user.name}!`);
            }
        } catch (err) {
            console.error("Connect error:", err);
            alert("Failed to send connection request.");
        }
    };

    const getDifficultyStyle = (difficulty) => {
        switch (difficulty) {
            case "Easy": return { color: "#10b981", bg: "rgba(16,185,129,0.15)" };
            case "Hard": return { color: "#ef4444", bg: "rgba(239,68,68,0.15)" };
            default: return { color: "#f59e0b", bg: "rgba(245,158,11,0.15)" };
        }
    };

    if (loading) return <div style={styles.loadingState}>Loading ecosystem...</div>;
    if (error) return <div style={styles.errorState}>{error}</div>;

    // Helper to render continuous scroll row
    const renderScrollRow = (items, type, direction) => {
        if (!items || items.length === 0) return null;
        
        // We double the items array for the loop
        const displayItems = [...items, ...items, ...items, ...items]; 

        const animationClass = direction === 'left' ? 'scrolling-wrapper-left' : 'scrolling-wrapper-right';

        return (
            <div style={styles.scrollRowContainer}>
                <h3 style={styles.scrollRowTitle}>
                    {type === 'startups' ? '🚀 Discover Startups' : '💎 Top Talent'}
                </h3>
                <div style={styles.scrollRowWrapper} className="scroll-container-main">
                    <div className={animationClass} style={styles.scrollRowInner}>
                        {displayItems.map((item, index) => (
                            <div key={`${item._id}-${index}`} style={styles.scrollCard}>
                                <div style={styles.scrollCardHeader}>
                                    <div style={type === 'startups' ? styles.startupAvatar : styles.userAvatar}>
                                        {type === 'startups' ? '🚀' : item.name?.charAt(0) || 'U'}
                                    </div>
                                    <div style={styles.cardMeta}>
                                        <span style={styles.badge}>
                                            {type === 'startups' ? 'Startup' : 'Talent'}
                                        </span>
                                    </div>
                                </div>
                                <h4 style={styles.scrollCardTitle}>
                                    {type === 'startups' ? item.startupTitle : item.name}
                                </h4>
                                <p style={styles.scrollCardRole}>
                                    {type === 'startups' ? item.sector : (item.role || 'Job Seeker')}
                                </p>
                                <p style={styles.scrollCardDesc}>
                                    {type === 'startups' ? item.coreIdea : `Reach out to connect and collaborate with ${item.name}.`}
                                </p>

                                <div style={styles.cardActions}>
                                    {type === 'startups' ? (
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => navigate(`/profile/${item._id}`)}
                                            style={{ flex: 1, padding: "8px", fontSize: "13px" }}
                                        >
                                            View Profile
                                        </button>
                                    ) : (
                                        <button
                                            className="btn"
                                            onClick={() => handleConnectClick(item)}
                                            style={{ flex: 1, padding: "8px", fontSize: "13px" }}
                                        >
                                            Connect
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div style={styles.container}>

            {/* Continuous Scrolling Ecosystem Rows */}
            <div style={styles.ecosystemSection}>
                {/* 
                  Startup: Right to Left (direction='left' -> scroll-left: 0 to -50%) 
                  Talent: Left to Right (direction='right' -> scroll-right: -50% to 0)
                */}
                {renderScrollRow(startups, 'startups', 'left')}
                {renderScrollRow(talent, 'talent', 'right')}
            </div>

            {/* Divider */}
            {founderProjects.length > 0 && (
                <div style={styles.divider}>
                    <span style={styles.dividerLine}></span>
                    <span style={styles.dividerText}>Open Projects</span>
                    <span style={styles.dividerLine}></span>
                </div>
            )}

            {/* Founder Projects Section */}
            {founderProjects.length > 0 && (
                <div style={styles.projectsSection}>
                    <div style={styles.projectsSectionHeader}>
                        <h2 style={styles.projectsSectionTitle}>🚀 Open Projects</h2>
                        <p style={styles.projectsSectionSub}>Projects posted by founders — complete them to showcase your talent!</p>
                    </div>

                    <div style={styles.projectsGrid}>
                        {founderProjects.map(proj => {
                            const diffStyle = getDifficultyStyle(proj.difficulty);
                            return (
                                <div key={proj._id} style={styles.projectCard}>
                                    {/* Top badges */}
                                    <div style={styles.projectCardTop}>
                                        <span style={{
                                            ...styles.diffBadge,
                                            color: diffStyle.color,
                                            backgroundColor: diffStyle.bg
                                        }}>
                                            {proj.difficulty}
                                        </span>
                                        <span style={styles.openBadge}>● Open</span>
                                    </div>

                                    <h3 style={styles.projectCardTitle}>{proj.title}</h3>
                                    <p style={styles.projectCardDesc}>{proj.description}</p>

                                    {/* Founder info */}
                                    <div style={styles.founderInfo}>
                                        <div style={styles.founderSmallAvatar}>
                                            {proj.founderId?.name?.charAt(0) || "F"}
                                        </div>
                                        <div>
                                            <div style={styles.founderSmallName}>
                                                {proj.founderId?.name || "Founder"}
                                            </div>
                                            <div style={styles.founderSmallStartup}>
                                                {proj.startupId?.startupTitle || "Startup"}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Skills */}
                                    {proj.requiredSkills?.length > 0 && (
                                        <div style={styles.skillsRow}>
                                            {proj.requiredSkills.map((skill, i) => (
                                                <span key={i} style={styles.skillTag}>{skill}</span>
                                            ))}
                                        </div>
                                    )}

                                    {proj.deadline && (
                                        <div style={styles.deadlineText}>
                                            Deadline: {new Date(proj.deadline).toLocaleDateString("en-IN", {
                                                day: "numeric", month: "short", year: "numeric"
                                            })}
                                        </div>
                                    )}

                                    {/* Requirements & Submit */}
                                    <div style={styles.reqsBox}>
                                        <span style={styles.reqIcon}>📂</span> GitHub Link &nbsp;+&nbsp;
                                        <span style={styles.reqIcon}>🎥</span> Video required
                                    </div>

                                    <button
                                        className="btn"
                                        style={styles.submitWorkBtn}
                                        onClick={() => {
                                            const userId = localStorage.getItem('userId');
                                            if (!userId) {
                                                alert("Please login first!");
                                                return;
                                            }
                                            setSubmitProject(proj);
                                        }}
                                    >
                                        Submit Your Work
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Floating Action Button */}
            <button style={styles.fab} onClick={onActionClick}>
                <span style={styles.fabIcon}>+</span>
                Connect
            </button>

            {/* Submit Work Modal */}
            {submitProject && (
                <SubmitWorkModal
                    project={submitProject}
                    onClose={() => setSubmitProject(null)}
                />
            )}
        </div>
    );
}

const styles = {
    container: {
        position: 'relative',
        minHeight: '80vh',
        padding: '20px',
        paddingBottom: '100px',
        overflowX: 'hidden'
    },
    loadingState: {
        textAlign: 'center',
        padding: '50px',
        color: 'var(--text-muted)'
    },
    errorState: {
        textAlign: 'center',
        padding: '50px',
        color: 'var(--danger)'
    },

    // Ecosystem Continuous Scrolling
    ecosystemSection: {
        marginBottom: '40px',
        maxWidth: '100vw'
    },
    scrollRowContainer: {
        marginBottom: '30px'
    },
    scrollRowTitle: {
        fontSize: '1.25rem',
        color: 'var(--text-main)',
        marginBottom: '16px',
        paddingLeft: '20px'
    },
    scrollRowWrapper: {
        overflow: 'hidden',
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
    },
    scrollRowInner: {
        display: 'flex',
        gap: '20px',
        width: 'max-content',
        padding: '10px 0'
    },
    scrollCard: {
        width: '300px',
        background: 'var(--card-bg)',
        padding: '20px',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        flexShrink: 0
    },
    scrollCardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px'
    },
    scrollCardTitle: {
        margin: '0 0 4px 0',
        fontSize: '1.1rem',
        color: 'var(--text-main)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    scrollCardRole: {
        margin: '0 0 10px 0',
        fontSize: '0.85rem',
        color: 'var(--accent)',
        fontWeight: '500'
    },
    scrollCardDesc: {
        color: 'var(--text-muted)',
        fontSize: '0.9rem',
        marginBottom: '16px',
        flex: 1,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
    },

    userAvatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        fontWeight: 'bold',
        color: 'white'
    },
    startupAvatar: {
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: 'rgba(59, 130, 246, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px'
    },
    badge: {
        fontSize: '0.7rem',
        padding: '3px 8px',
        borderRadius: '20px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    },
    cardActions: {
        display: 'flex',
        gap: '8px',
        marginTop: 'auto'
    },

    // Founder Projects Section
    projectsSection: {
        maxWidth: '1200px',
        margin: '0 auto 30px auto'
    },
    projectsSectionHeader: {
        marginBottom: '20px'
    },
    projectsSectionTitle: {
        fontSize: '1.5rem',
        margin: '0 0 4px 0',
        color: 'var(--text-main)'
    },
    projectsSectionSub: {
        color: 'var(--text-muted)',
        fontSize: '14px',
        margin: 0
    },
    projectsGrid: {
        display: 'grid',
        gap: '24px',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))'
    },
    projectCard: {
        background: 'var(--card-bg)',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid rgba(16,185,129,0.1)',
        display: 'flex',
        flexDirection: 'column'
    },
    projectCardTop: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
    },
    diffBadge: {
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    openBadge: {
        fontSize: '12px',
        color: '#10b981',
        fontWeight: '600'
    },
    projectCardTitle: {
        margin: '0 0 8px 0',
        fontSize: '18px',
        color: 'var(--text-main)',
        fontWeight: '600'
    },
    projectCardDesc: {
        fontSize: '14px',
        color: 'var(--text-muted)',
        lineHeight: '1.6',
        marginBottom: '14px',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
    },
    founderInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: 'rgba(59,130,246,0.06)',
        borderRadius: '10px',
        padding: '10px 12px',
        marginBottom: '14px'
    },
    founderSmallAvatar: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '14px'
    },
    founderSmallName: {
        color: '#f8fafc',
        fontWeight: '600',
        fontSize: '13px'
    },
    founderSmallStartup: {
        color: '#94a3b8',
        fontSize: '11px'
    },
    skillsRow: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        marginBottom: '12px'
    },
    skillTag: {
        backgroundColor: 'rgba(59,130,246,0.1)',
        color: '#3b82f6',
        padding: '3px 10px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '500'
    },
    deadlineText: {
        fontSize: '12px',
        color: '#64748b',
        marginBottom: '10px'
    },
    reqsBox: {
        background: 'rgba(139,92,246,0.08)',
        borderRadius: '8px',
        padding: '8px 12px',
        fontSize: '12px',
        color: '#94a3b8',
        marginBottom: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
    },
    reqIcon: {
        fontSize: '14px'
    },
    submitWorkBtn: {
        width: '100%',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        fontSize: '14px',
        boxShadow: '0 4px 12px rgba(16,185,129,0.2)'
    },

    // Divider
    divider: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        maxWidth: '1200px',
        margin: '10px auto 30px auto'
    },
    dividerLine: {
        flex: 1,
        height: '1px',
        background: 'rgba(255,255,255,0.08)'
    },
    dividerText: {
        color: '#64748b',
        fontSize: '13px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    },

    fab: {
        position: 'fixed',
        bottom: '40px',
        right: '40px',
        backgroundColor: 'var(--accent)',
        color: 'white',
        border: 'none',
        borderRadius: '30px',
        padding: '15px 30px',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 10px 25px rgba(59, 130, 246, 0.5)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        transition: 'transform 0.2s ease',
        zIndex: 100
    },
    fabIcon: {
        fontSize: '24px',
        lineHeight: '1'
    }
};