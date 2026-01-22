import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, UserPlus, LogIn, User } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg('');

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setMsg(error.message);
        } else {
            // Check if user has a name in profile
            const { data: profile } = await supabase
                .from('profiles')
                .select('name')
                .eq('id', data.user.id)
                .single();

            if (!profile || !profile.name) {
                // Ask for name
                const userName = prompt('Please enter your name for the community:');
                if (userName) {
                    await supabase.from('profiles').upsert({
                        id: data.user.id,
                        email: data.user.email,
                        name: userName
                    });
                }
            }
            navigate('/dashboard');
        }
        setLoading(false);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg('');

        if (!name) {
            setMsg('Please enter your name');
            setLoading(false);
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setMsg(error.message);
        } else {
            // Create profile with name
            if (data.user) {
                await supabase.from('profiles').insert({
                    id: data.user.id,
                    email: email,
                    name: name
                });
            }
            setMsg('✅ Check your email for the confirmation link!');
        }
        setLoading(false);
    };

    return (
        <div style={{
            minHeight: '85vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
            padding: '2rem'
        }}>
            <div className="card card-elevated" style={{ width: '100%', maxWidth: '480px', padding: '3rem' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        margin: '0 auto 1.5rem',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Shield size={40} color="white" />
                    </div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: '700' }}>
                        {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>
                        {isSignUp ? 'Sign up to access THREATNET' : 'Sign in to your THREATNET account'}
                    </p>
                </div>

                {msg && (
                    <div className={`alert ${msg.includes('✅') ? 'alert-success' : 'alert-danger'}`} style={{ marginBottom: '1.5rem' }}>
                        {msg}
                    </div>
                )}

                <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
                    {isSignUp && (
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                color: 'var(--color-text)',
                                fontWeight: '500',
                                fontSize: '0.95rem'
                            }}>
                                <User size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                                Full Name
                            </label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required={isSignUp}
                            />
                        </div>
                    )}

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            color: 'var(--color-text)',
                            fontWeight: '500',
                            fontSize: '0.95rem'
                        }}>
                            <Mail size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                            Email Address
                        </label>
                        <input
                            type="email"
                            className="input-field"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            color: 'var(--color-text)',
                            fontWeight: '500',
                            fontSize: '0.95rem'
                        }}>
                            <Lock size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                            Password
                        </label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginBottom: '1rem', fontSize: '1rem' }}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="loader"></div>
                        ) : (
                            <>
                                {isSignUp ? <UserPlus size={20} /> : <LogIn size={20} />}
                                {isSignUp ? 'Create Account' : 'Sign In'}
                            </>
                        )}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                        <button
                            type="button"
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setMsg('');
                                setName('');
                            }}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--color-primary)',
                                cursor: 'pointer',
                                fontWeight: '500',
                                fontSize: '0.95rem'
                            }}
                        >
                            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                        </button>
                    </div>
                </form>

                {/* Info */}
                <div className="alert alert-info" style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
                    <Shield size={18} />
                    <div>
                        <strong>Admin Access:</strong> Use admin@threatnet.com to access admin features
                    </div>
                </div>
            </div>
        </div>
    );
}
