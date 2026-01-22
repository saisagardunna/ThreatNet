import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Navbar({ session }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div>
                <Link to="/" style={{
                    fontSize: '1.5rem',
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    THREATNET
                </Link>
            </div>

            <div className="nav-links">
                <Link to="/" className="nav-link">Home</Link>
                {session && <Link to="/dashboard" className="nav-link">Dashboard</Link>}
                {session && <Link to="/community" className="nav-link">Community</Link>}
                {session && <Link to="/review" className="nav-link">Give Review</Link>}

                <Link to="/about" className="nav-link">About</Link>
                <Link to="/contact" className="nav-link">Contact</Link>
                {/* Admin link removed, use /admin-login portal */}
            </div>

            <div>
                {session ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                            {session.user.email}
                        </span>
                        <button onClick={handleLogout} className="btn" style={{
                            background: 'transparent',
                            border: '2px solid var(--color-danger)',
                            color: 'var(--color-danger)',
                            padding: '0.5rem 1.25rem'
                        }}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link to="/login">
                        <button className="btn btn-primary">Login</button>
                    </Link>
                )}
            </div>
        </nav>
    );
}
