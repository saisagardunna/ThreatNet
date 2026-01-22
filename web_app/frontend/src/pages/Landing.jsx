import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Globe, Lock, TrendingUp, AlertTriangle, Phone } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

import HeadphoneScroll from '../components/HeadphoneScroll';

export default function Landing() {
    return (
        <div style={{ position: 'relative', minHeight: '100vh', color: 'white' }}>
            <HeadphoneScroll />

            {/* Hero Section */}
            <section style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                padding: '4rem 2rem',
                zIndex: 1
            }}>
                {/* Decorative Background - Modified for dark theme */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle at center, rgba(79, 70, 229, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
                    zIndex: -1,
                    pointerEvents: 'none'
                }}></div>

                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '1000px' }}>
                    {/* Badge */}
                    <div className="badge badge-primary" style={{ marginBottom: '2rem', fontSize: '0.9rem', backgroundColor: 'rgba(79, 70, 229, 0.2)', color: '#bbbdf6', border: '1px solid rgba(79, 70, 229, 0.3)', backdropFilter: 'blur(2px)' }}>
                        <Shield size={16} style={{ marginRight: '0.5rem' }} />
                        AI-Powered Threat Intelligence Platform
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(3rem, 7vw, 5rem)',
                        marginBottom: '1.5rem',
                        fontWeight: '800',
                        color: 'white',
                        textShadow: '0 0 30px rgba(79, 70, 229, 0.6)',
                        letterSpacing: '-0.02em',
                        lineHeight: '1.1'
                    }}>
                        Secure Your Digital Future with <span style={{ color: '#818cf8' }}>THREATNET</span>
                    </h1>

                    <p style={{
                        fontSize: '1.25rem',
                        color: 'rgba(255, 255, 255, 0.8)',
                        marginBottom: '3rem',
                        lineHeight: '1.8',
                        maxWidth: '800px',
                        marginLeft: 'auto',
                        marginRight: 'auto'
                    }}>
                        Advanced Cyber Threat Intelligence powered by Artificial Intelligence.
                        Detect phishing, malware, ransomware, and SQL injection attacks in real-time with actionable insights.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/login">
                            <button className="btn" style={{
                                fontSize: '1.1rem',
                                padding: '1rem 2.5rem',
                                background: 'white',
                                color: 'black',
                                borderRadius: '99px',
                                fontWeight: '700'
                            }}>
                                <Shield size={20} />
                                Launch Console
                            </button>
                        </Link>
                        <a href="#features">
                            <button className="btn" style={{
                                fontSize: '1.1rem',
                                padding: '1rem 2.5rem',
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '99px',
                                backdropFilter: 'blur(3px)'
                            }}>
                                <TrendingUp size={20} />
                                Explore Features
                            </button>
                        </a>
                    </div>

                    {/* Stats */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '2rem',
                        marginTop: '5rem',
                        maxWidth: '800px',
                        margin: '5rem auto 0',
                        padding: '2rem',
                        background: 'rgba(0,0,0,0.2)',
                        borderRadius: '24px',
                        border: '1px solid rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(2px)'
                    }}>
                        <StatCard number="99.8%" label="Detection Rate" />
                        <StatCard number="<1s" label="Analysis Time" />
                        <StatCard number="24/7" label="Monitoring" />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="container" style={{ paddingBottom: '5rem', position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: '700', color: 'white' }}>
                        Powerful Features for Complete Protection
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                        Everything you need to detect, analyze, and mitigate cyber threats
                    </p>
                </div>

                <div className="grid grid-3">
                    <FeatureCard
                        icon={<Shield color="#818cf8" size={32} />}
                        title="AI Threat Detection"
                        desc="Advanced machine learning models classify threats from email text, server logs, and network traffic with 99.8% accuracy."
                        color="#4f46e5"
                    />
                    <FeatureCard
                        icon={<Zap color="#fbbf24" size={32} />}
                        title="Real-time Analysis"
                        desc="Get instant results with confidence scores, detailed mitigation strategies, and step-by-step remediation guides."
                        color="#f59e0b"
                    />
                    <FeatureCard
                        icon={<Globe color="#34d399" size={32} />}
                        title="Attack Graph Visualization"
                        desc="Visualize attack vectors and understand the complete flow of compromise from source to impact."
                        color="#10b981"
                    />
                    <FeatureCard
                        icon={<Lock color="#f472b6" size={32} />}
                        title="Zero Trust Security"
                        desc="Built on a foundation of continuous verification. Your data is encrypted and processed securely."
                        color="#ec4899"
                    />
                    <FeatureCard
                        icon={<AlertTriangle color="#f87171" size={32} />}
                        title="Instant Alerts"
                        desc="WhatsApp integration for immediate threat notifications to your security team with detailed reports."
                        color="#ef4444"
                    />
                    <FeatureCard
                        icon={<TrendingUp color="#a78bfa" size={32} />}
                        title="PDF Reports"
                        desc="Generate comprehensive incident reports for compliance, auditing, and documentation purposes."
                        color="#8b5cf6"
                    />
                </div>
            </section>

            {/* Threat Types Section */}
            <section className="container" style={{ paddingBottom: '5rem', position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: '700', color: 'white' }}>
                        Detects All Major Threat Types
                    </h2>
                </div>

                <div className="grid grid-2" style={{ gap: '1.5rem' }}>
                    <ThreatCard
                        title="Phishing Attacks"
                        desc="Identifies spoofed emails, credential theft attempts, and social engineering tactics"
                        icon="🎣"
                    />
                    <ThreatCard
                        title="Malware Detection"
                        desc="Detects trojans, viruses, spyware, and other malicious software patterns"
                        icon="🦠"
                    />
                    <ThreatCard
                        title="Ransomware"
                        desc="Identifies encryption attempts, file system anomalies, and ransom demands"
                        icon="🔒"
                    />
                    <ThreatCard
                        title="SQL Injection"
                        desc="Analyzes database queries for injection attempts and data exfiltration"
                        icon="💉"
                    />
                    <ThreatCard
                        title="DDoS Attacks"
                        desc="Monitors traffic patterns for distributed denial of service indicators"
                        icon="🌊"
                    />
                    <ThreatCard
                        title="Zero-Day Threats"
                        desc="Machine learning identifies unknown threats based on behavioral patterns"
                        icon="⚡"
                    />
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                position: 'relative',
                zIndex: 1,
                background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.9) 0%, rgba(124, 58, 237, 0.9) 100%)',
                padding: '5rem 2rem',
                textAlign: 'center',
                color: 'white',
                marginTop: '4rem',
                backdropFilter: 'blur(10px)'
            }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: '700', color: 'white' }}>
                    Ready to Protect Your Organization?
                </h2>
                <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 2rem' }}>
                    Join thousands of security professionals using THREATNET to stay ahead of cyber threats
                </p>
                <Link to="/login">
                    <button className="btn" style={{
                        background: 'white',
                        color: '#4f46e5',
                        fontSize: '1.1rem',
                        padding: '1rem 2.5rem',
                        borderRadius: '99px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                    }}>
                        Get Started Now
                    </button>
                </Link>
            </section>

            {/* Footer */}
            <footer style={{
                position: 'relative',
                zIndex: 1,
                borderTop: '1px solid rgba(255,255,255,0.1)',
                padding: '3rem 2rem',
                background: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(20px)',
                marginTop: '0'
            }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                        <div>
                            <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>THREATNET</h3>
                            <p style={{ color: 'rgba(255,255,255,0.6)' }}>
                                Advanced AI-powered cyber threat intelligence platform for modern security teams.
                            </p>
                        </div>
                        <div>
                            <h4 style={{ marginBottom: '1rem', fontWeight: '600', color: 'white' }}>Support</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.6)' }}>
                                <Phone size={18} />
                                <span>Toll-Free: 1-800-CYBER-HELP</span>
                            </div>
                            <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                                Available 24/7 for emergency support
                            </p>
                        </div>
                    </div>
                    <div style={{
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        paddingTop: '2rem',
                        textAlign: 'center',
                        color: 'rgba(255,255,255,0.5)'
                    }}>
                        <p>© 2026 AI-CTI Systems Inc. | Advanced Threat Intelligence Platform</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

const StatCard = ({ number, label }) => (
    <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#818cf8', marginBottom: '0.5rem', textShadow: '0 0 20px rgba(79, 70, 229, 0.3)' }}>
            {number}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', fontWeight: '500' }}>
            {label}
        </div>
    </div>
);

const FeatureCard = ({ icon, title, desc, color }) => (
    <div className="card" style={{
        textAlign: 'left',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(2px)',
        borderRadius: '20px',
        padding: '2rem',
        transition: 'all 0.3s ease'
    }}>
        <div style={{
            marginBottom: '1.5rem',
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.05)'
        }}>
            {icon}
        </div>
        <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: '600', color: 'white' }}>{title}</h3>
        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.7' }}>{desc}</p>
    </div>
);

const ThreatCard = ({ title, desc, icon }) => (
    <div className="card" style={{
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'flex-start',
        background: 'rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(2px)',
        padding: '2rem',
        borderRadius: '20px'
    }}>
        <div style={{ fontSize: '2.5rem', flexShrink: 0, filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))' }}>{icon}</div>
        <div>
            <h4 style={{ marginBottom: '0.5rem', fontSize: '1.2rem', fontWeight: '700', color: 'white' }}>{title}</h4>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: '1.6' }}>{desc}</p>
        </div>
    </div>
);
