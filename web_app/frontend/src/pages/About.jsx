import React from 'react';
import { Shield, Target, Users, Zap, Award, TrendingUp } from 'lucide-react';

export default function About() {
    return (
        <div style={{ background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)', minHeight: '100vh', paddingBottom: '3rem' }}>
            <div className="container" style={{ paddingTop: '3rem' }}>
                {/* Hero Section */}
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div className="badge badge-primary" style={{ marginBottom: '1rem' }}>
                        <Shield size={16} />
                        About THREATNET
                    </div>
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: '800' }}>
                        Protecting Organizations with AI-Powered Intelligence
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
                        THREATNET is an advanced cyber threat intelligence platform that leverages artificial intelligence to detect, analyze, and mitigate security threats in real-time.
                    </p>
                </div>

                {/* Mission & Vision */}
                <div className="grid grid-2" style={{ marginBottom: '4rem', maxWidth: '1200px', margin: '0 auto 4rem' }}>
                    <div className="card card-elevated">
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1.5rem'
                        }}>
                            <Target size={32} color="white" />
                        </div>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '700' }}>Our Mission</h3>
                        <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
                            To democratize cybersecurity by providing accessible, AI-powered threat detection tools that help organizations of all sizes protect their digital assets and maintain security posture.
                        </p>
                    </div>

                    <div className="card card-elevated">
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1.5rem'
                        }}>
                            <TrendingUp size={32} color="white" />
                        </div>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '700' }}>Our Vision</h3>
                        <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
                            To create a world where cyber threats are detected and neutralized before they cause harm, making the digital landscape safer for everyone through continuous innovation in AI and machine learning.
                        </p>
                    </div>
                </div>

                {/* Features */}
                <div style={{ marginBottom: '4rem' }}>
                    <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem', fontWeight: '800' }}>
                        What Makes Us Different
                    </h2>
                    <div className="grid grid-3">
                        <FeatureCard
                            icon={<Zap size={32} color="#f59e0b" />}
                            title="Real-Time Detection"
                            desc="Our AI models analyze threats in milliseconds, providing instant alerts and actionable insights."
                            color="#f59e0b"
                        />
                        <FeatureCard
                            icon={<Shield size={32} color="#4f46e5" />}
                            title="99.8% Accuracy"
                            desc="Trained on millions of threat samples, our models achieve industry-leading detection accuracy."
                            color="#4f46e5"
                        />
                        <FeatureCard
                            icon={<Users size={32} color="#10b981" />}
                            title="User-Friendly"
                            desc="Complex security made simple. No technical expertise required to understand and act on threats."
                            color="#10b981"
                        />
                        <FeatureCard
                            icon={<Award size={32} color="#ec4899" />}
                            title="Comprehensive Coverage"
                            desc="Detects phishing, malware, ransomware, SQL injection, DDoS, and emerging zero-day threats."
                            color="#ec4899"
                        />
                        <FeatureCard
                            icon={<TrendingUp size={32} color="#8b5cf6" />}
                            title="Continuous Learning"
                            desc="Our AI models continuously improve by learning from new threat patterns and user feedback."
                            color="#8b5cf6"
                        />
                        <FeatureCard
                            icon={<Shield size={32} color="#ef4444" />}
                            title="Zero Trust Architecture"
                            desc="Built on security-first principles with end-to-end encryption and privacy protection."
                            color="#ef4444"
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="card card-elevated" style={{ padding: '3rem', marginBottom: '4rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', textAlign: 'center' }}>
                        <StatCard number="99.8%" label="Detection Accuracy" />
                        <StatCard number="<1s" label="Analysis Time" />
                        <StatCard number="24/7" label="Monitoring" />
                        <StatCard number="1000+" label="Threats Detected" />
                    </div>
                </div>

                {/* Technology Stack */}
                <div style={{ marginBottom: '4rem' }}>
                    <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem', fontWeight: '800' }}>
                        Powered by Advanced Technology
                    </h2>
                    <div className="card card-elevated">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', padding: '1rem' }}>
                            <TechBadge name="Machine Learning" desc="Random Forest & Neural Networks" />
                            <TechBadge name="Natural Language Processing" desc="Advanced Text Analysis" />
                            <TechBadge name="Real-Time Processing" desc="Sub-second Response Times" />
                            <TechBadge name="Cloud Infrastructure" desc="Scalable & Reliable" />
                            <TechBadge name="API Integration" desc="Seamless Connectivity" />
                            <TechBadge name="Secure Database" desc="Encrypted Data Storage" />
                        </div>
                    </div>
                </div>

                {/* Team */}
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: '800' }}>
                        Built by Security Experts
                    </h2>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto 2rem' }}>
                        THREATNET is developed as a final year project by cybersecurity students passionate about making the internet safer for everyone.
                    </p>
                    <div className="badge badge-primary" style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}>
                        Final Year Project - Cyber Threat Intelligence System
                    </div>
                </div>
            </div>
        </div>
    );
}

const FeatureCard = ({ icon, title, desc, color }) => (
    <div className="card">
        <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: `${color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
        }}>
            {icon}
        </div>
        <h4 style={{ marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: '600' }}>{title}</h4>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>{desc}</p>
    </div>
);

const StatCard = ({ number, label }) => (
    <div>
        <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
            {number}
        </div>
        <div style={{ color: 'var(--color-text-muted)', fontWeight: '500' }}>
            {label}
        </div>
    </div>
);

const TechBadge = ({ name, desc }) => (
    <div style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: '600', marginBottom: '0.25rem', color: 'var(--color-primary)' }}>
            {name}
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            {desc}
        </div>
    </div>
);
