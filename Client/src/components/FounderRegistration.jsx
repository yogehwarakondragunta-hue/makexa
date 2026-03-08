import React from 'react';

export default function FounderRegistration({ onBack, name, setName, email, setEmail, password, setPassword, onSendOtp }) {
    return (
        <form onSubmit={onSendOtp}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <button type="button" onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>← Back</button>
                <h2 style={{ margin: 0 }}>Create a Project</h2>
            </div>

            <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Personal Info</h3>
            <div className="input-group">
                <label>Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="input-field" placeholder="John Doe" />
            </div>
            <div className="input-group">
                <label>Email ID</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field" placeholder="john@example.com" />
            </div>
            <div className="input-group">
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input-field" placeholder="Create a password" minLength={6} />
            </div>

            <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginTop: '2rem', marginBottom: '1rem' }}>Startup Details</h3>
            <div className="input-group">
                <label>Core Idea</label>
                <textarea required className="input-field" rows="3" placeholder="What problem are you solving?"></textarea>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="input-group" style={{ flex: 1 }}>
                    <label>Startup Sector</label>
                    <input type="text" required className="input-field" placeholder="e.g. HealthTech, AI" />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                    <label>Members Required</label>
                    <input type="number" required min="1" className="input-field" placeholder="e.g. 2" />
                </div>
            </div>

            <div className="input-group">
                <label>Aadhar Card Number</label>
                <input type="text" required pattern="\d{12}" title="12 digit Aadhar number" className="input-field" placeholder="1234 5678 9012" />
                <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>
                    *OTP will be sent to the linked email (mock Aadhar simulation).
                </small>
            </div>

            <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }}>
                Send Verification OTP
            </button>
        </form>
    );
}
