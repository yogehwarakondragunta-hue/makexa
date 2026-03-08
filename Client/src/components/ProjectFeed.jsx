import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export default function ProjectFeed({ onActionClick }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Dummy fallback projects
    const dummyProjects = [
        {
            _id: "1",
            title: "React Frontend Developer",
            description: "Join our AI startup and build modern UI",
            techStack: ["React", "Tailwind"]
        },
        {
            _id: "2",
            title: "Backend Developer Needed",
            description: "Work on scalable APIs using Node.js",
            techStack: ["Node", "MongoDB"]
        }
    ];

    useEffect(() => {
        fetch('http://localhost:5000/api/projects')
            .then(res => res.json())
            .then(data => {
                console.log("API Response:", data);

                // If backend returns array directly
                if (Array.isArray(data)) {
                    setProjects(data.length ? data : dummyProjects);
                }

                // If backend returns { success, data }
                else if (data.success && Array.isArray(data.data)) {
                    setProjects(data.data.length ? data.data : dummyProjects);
                }

                else {
                    setProjects(dummyProjects);
                }

                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch projects:", err);
                setProjects(dummyProjects); // fallback
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading projects...</div>;

    return (
        <div style={{
            display: 'grid',
            gap: '2rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
        }}>
            {projects.map(proj => (
                <div key={proj._id}
                    style={{
                        background: 'var(--card-bg)',
                        padding: '2rem',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.05)'
                    }}
                >
                    <span style={{
                        fontSize: '0.8rem',
                        color: 'var(--accent)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        {proj.techStack?.join(', ') || "Startup Project"}
                    </span>

                    <h2 style={{ marginTop: '0.5rem' }}>
                        {proj.title || "Untitled"}
                    </h2>

                    <p style={{
                        color: 'var(--text-muted)',
                        marginBottom: '2rem'
                    }}>
                        {proj.description}
                    </p>

                   <div style={{ display: 'flex', gap: '1rem' }}>
    <button 
        className="btn btn-secondary"
        onClick={() => navigate(`/profile/${proj._id}`)}
    >
        See Profile
    </button>

    <button 
        className="btn"
        onClick={onActionClick}
    >
        Join Project
    </button>
</div>
                </div>
            ))}
        </div>
    );
}