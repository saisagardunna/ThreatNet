import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

import ImageScrollBackground from '../components/ImageScrollBackground';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access_key: import.meta.env.VITE_WEB3FORMS_KEY,
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                    subject: 'New Contact Form Submission from THREATNET'
                }),
            });

            const data = await response.json();

            if (data.success) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: '3rem', color: 'white' }}>
            <ImageScrollBackground
                imageDir='/sequence_contactus/ezgif-frame-'
                frameCount={40}
            />

            <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '3rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div className="badge badge-primary" style={{ marginBottom: '1rem', backgroundColor: 'rgba(79, 70, 229, 0.2)', color: '#bbbdf6', backdropFilter: 'blur(2px)' }}>
                        <Mail size={16} />
                        Get In Touch
                    </div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: '800', color: 'white', textShadow: '0 0 20px rgba(0,0,0,0.5)' }}>
                        Contact Us
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                        Have questions? We're here to help. Reach out to our team anytime.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
                    {/* Contact Form */}
                    <div className="card card-elevated" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>
                            Send us a Message
                        </h3>

                        {status === 'success' && (
                            <div className="alert alert-success" style={{ marginBottom: '1.5rem', background: 'rgba(16, 185, 129, 0.2)', color: '#a7f3d0' }}>
                                <CheckCircle size={20} />
                                <div>
                                    <strong>Success!</strong> Your message has been sent. We'll get back to you soon!
                                </div>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="alert alert-danger" style={{ marginBottom: '1.5rem', background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}>
                                <strong>Error!</strong> Something went wrong. Please try again.
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'rgba(255,255,255,0.9)' }}>
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    className="input-field"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'rgba(255,255,255,0.9)' }}>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    className="input-field"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
                                />
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'rgba(255,255,255,0.9)' }}>
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    className="input-field"
                                    rows="6"
                                    placeholder="Tell us how we can help..."
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
                                ></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                                {loading ? (
                                    <div className="loader"></div>
                                ) : (
                                    <>
                                        <Send size={20} />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <div className="card" style={{ marginBottom: '1.5rem', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(3px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    background: 'rgba(79, 70, 229, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <Mail size={24} color="#818cf8" />
                                </div>
                                <div>
                                    <h4 style={{ marginBottom: '0.5rem', fontWeight: '600', color: 'white' }}>Email Us</h4>
                                    <a
                                        href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL}`}
                                        style={{ color: '#a5b4fc', textDecoration: 'none', fontWeight: '500' }}
                                    >
                                        {import.meta.env.VITE_CONTACT_EMAIL}
                                    </a>
                                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                                        We'll respond within 24 hours
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="card" style={{ marginBottom: '1.5rem', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(3px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    background: 'rgba(16, 185, 129, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <Phone size={24} color="#34d399" />
                                </div>
                                <div>
                                    <h4 style={{ marginBottom: '0.5rem', fontWeight: '600', color: 'white' }}>Call Us</h4>
                                    <a
                                        href={`tel:${import.meta.env.VITE_CONTACT_PHONE}`}
                                        style={{ color: '#6ee7b7', textDecoration: 'none', fontWeight: '500', fontSize: '1.1rem' }}
                                    >
                                        {import.meta.env.VITE_CONTACT_PHONE}
                                    </a>
                                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                                        Available 24/7 for emergencies
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="card" style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(3px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    background: 'rgba(245, 158, 11, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <MapPin size={24} color="#fbbf24" />
                                </div>
                                <div>
                                    <h4 style={{ marginBottom: '0.5rem', fontWeight: '600', color: 'white' }}>Toll-Free Helpline</h4>
                                    <p style={{ color: '#fcd34d', fontWeight: '600', fontSize: '1.1rem' }}>
                                        1-800-CYBER-HELP
                                    </p>
                                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                                        Free support for all users
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="alert alert-info" style={{ marginTop: '1.5rem', background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                            <Mail size={18} />
                            <div>
                                <strong>Quick Response:</strong> For urgent security incidents, please call our emergency hotline directly.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
