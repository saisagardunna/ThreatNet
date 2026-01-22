import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Shield, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        // Hardcoded custom admin credentials as requested
        if (email === 'hemanthshiva77@gmail.com' && password === 'hemanth') {
            localStorage.setItem('adminAuth', 'true');
            // Basic event simulation or state update if needed, but simple localStorage is enough for this scope
            navigate('/admin');
        } else {
            setError('Invalid administration credentials');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }}>
            <div className="card" style={{
                maxWidth: '450px',
                width: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.5)'
                    }}>
                        <Shield size={32} color="white" />
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                        Admin Portal
                    </h1>
                    <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        Restricted Access Area
                    </p>
                </div>

                {error && (
                    <div className="alert alert-danger" style={{ marginBottom: '1.5rem', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5' }}>
                        <Lock size={18} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.8)' }}>
                            Admin Email
                        </label>
                        <input
                            type="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                            style={{
                                background: 'rgba(0, 0, 0, 0.2)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: 'white'
                            }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.8)' }}>
                            Passkey
                        </label>
                        <input
                            type="password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            style={{
                                background: 'rgba(0, 0, 0, 0.2)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: 'white'
                            }}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{
                            width: '100%',
                            background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                            border: 'none',
                            padding: '1rem',
                            fontSize: '1rem',
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '0.75rem'
                        }}
                    >
                        Access Dashboard
                        <ArrowRight size={20} />
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <a href="/" style={{ color: 'rgba(255, 255, 255, 0.4)', textDecoration: 'none', fontSize: '0.9rem' }}>
                        Return to Public Site
                    </a>
                </div>
            </div>
        </div>
    );
}
