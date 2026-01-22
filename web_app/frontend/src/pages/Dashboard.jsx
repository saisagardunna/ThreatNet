import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Send, TrendingUp, Mail, MessageSquare, Smartphone, Lock, Target, BookOpen, Download, Database } from 'lucide-react';
import jsPDF from 'jspdf';
import { AnimatePresence } from 'framer-motion';

export default function Dashboard({ session }) {
    const [text, setText] = useState('');
    const [messageType, setMessageType] = useState('email');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [datasetResult, setDatasetResult] = useState(null);
    const [whatsappNum, setWhatsappNum] = useState('');
    const [activeTab, setActiveTab] = useState('analysis');
    const [error, setError] = useState('');


    const analyzeThreat = async () => {
        if (!text.trim()) {
            alert('Please enter some text to analyze');
            return;
        }

        setLoading(true);
        setResult(null);
        setDatasetResult(null);
        setError('');

        try {
            // Call Backend API (which handles Dataset + Groq + ML)
            const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
            const response = await fetch(`${apiUrl}/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: text,
                    message_type: messageType
                })
            });

            if (!response.ok) {
                throw new Error(`Backend API error: ${response.status}`);
            }

            const data = await response.json();

            // 1. Set Dataset Result
            if (data.dataset_result) {
                setDatasetResult(data.dataset_result);
            }

            // 2. Set AI Result (Groq)
            if (data.ai_result) {
                // Ensure AI result has 'method' tag
                const aiData = { ...data.ai_result, method: 'AI' };
                setResult(aiData);
            } else if (data.ml_result) {
                // Fallback to ML result if AI fails/not available
                setResult({
                    threat_type: data.ml_result.prediction,
                    confidence: data.ml_result.confidence,
                    spam_score: Math.round(data.ml_result.confidence * 100),
                    method: 'Machine Learning (Local)',
                    explanation: 'Analysis based on local ML model.',
                    caution: data.ml_result.mitigation?.Caution || 'None',
                    precautions: data.ml_result.mitigation?.Precautions || [],
                    solution: data.ml_result.mitigation?.Solution || 'Unknown'
                });
            }

        } catch (error) {
            console.error("Analysis failed:", error);
            setError(`Analysis Error: ${error.message}. Ensure backend is running.`);
        } finally {
            setLoading(false);
        }
    };


    const sendWhatsAppAlert = () => {
        if (!whatsappNum || !result) return;
        const msg = `🚨 *THREATNET ALERT* 🚨%0A%0A*Threat Type:* ${result.threat_type}%0A*Confidence:* ${(result.confidence * 100).toFixed(1)}%%0A*Spam Score:* ${result.spam_score}/100%0A%0A*Warning:* ${result.caution}%0A%0A*Action Required:* ${result.solution}`;
        window.open(`https://wa.me/${whatsappNum.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
    };

    const downloadPDF = () => {
        if (!result && !datasetResult) return;

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const padding = 20;
        let yPos = 20;

        // Header
        doc.setFillColor(79, 70, 229);
        doc.rect(0, 0, pageWidth, 35, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('THREATNET ANALYSIS REPORT', pageWidth / 2, 20, { align: 'center' });
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 28, { align: 'center' });

        yPos = 45;
        doc.setTextColor(0, 0, 0);

        // Message Content Section
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Analyzed Message:', padding, yPos);
        yPos += 8;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const splitMessage = doc.splitTextToSize(text, pageWidth - 2 * padding);
        doc.text(splitMessage, padding, yPos);
        yPos += splitMessage.length * 5 + 10;

        // Dataset Detection Results
        if (datasetResult) {
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('📊 DATASET DETECTION', padding, yPos);
            yPos += 10;

            // Threat box
            const isSpam = datasetResult.threat_type !== 'Legitimate';
            doc.setFillColor(isSpam ? 239 : 16, isSpam ? 68 : 185, isSpam ? 68 : 129);
            doc.setDrawColor(isSpam ? 239 : 16, isSpam ? 68 : 185, isSpam ? 68 : 129);
            doc.roundedRect(padding, yPos, pageWidth - 2 * padding, 40, 3, 3, 'S');

            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(`${isSpam ? '⚠️ SPAM' : '✓ SAFE'}`, padding + 5, yPos + 10);
            doc.text('Threat Detected', padding + 5, yPos + 18);

            doc.setFontSize(10);
            doc.text('CONFIDENCE', padding + 5, yPos + 28);
            doc.setFontSize(16);
            doc.text(`${(datasetResult.confidence * 100).toFixed(1)}%`, padding + 5, yPos + 36);

            doc.setFontSize(10);
            doc.text('Spam Score', pageWidth / 2, yPos + 28);
            doc.setFontSize(16);
            doc.text(`${datasetResult.spam_score}/100`, pageWidth / 2, yPos + 36);

            doc.setFontSize(10);
            doc.text('Detection Confidence', pageWidth - padding - 50, yPos + 28);

            yPos += 50;

            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text(`Detected Type: ${datasetResult.threat_type}`, padding, yPos);
            yPos += 7;
            doc.setFont('helvetica', 'normal');
            const splitExplanation = doc.splitTextToSize(datasetResult.explanation, pageWidth - 2 * padding);
            doc.text(splitExplanation, padding, yPos);
            yPos += splitExplanation.length * 5 + 10;
        }

        // AI Detection Results
        if (result) {
            // Add new page if needed
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }

            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('🤖 AI DETECTION (Groq)', padding, yPos);
            yPos += 10;

            const isSpam = result.threat_type !== 'Legitimate';
            doc.setFillColor(isSpam ? 239 : 16, isSpam ? 68 : 185, isSpam ? 68 : 129);
            doc.setDrawColor(isSpam ? 239 : 16, isSpam ? 68 : 185, isSpam ? 68 : 129);
            doc.roundedRect(padding, yPos, pageWidth - 2 * padding, 40, 3, 3, 'S');

            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(`${isSpam ? '⚠️ SPAM' : '✓ SAFE'}`, padding + 5, yPos + 10);
            doc.text('Threat Detected', padding + 5, yPos + 18);

            doc.setFontSize(10);
            doc.text('CONFIDENCE', padding + 5, yPos + 28);
            doc.setFontSize(16);
            doc.text(`${(result.confidence * 100).toFixed(1)}%`, padding + 5, yPos + 36);

            doc.setFontSize(10);
            doc.text('Spam Score', pageWidth / 2, yPos + 28);
            doc.setFontSize(16);
            doc.text(`${result.spam_score}/100`, pageWidth / 2, yPos + 36);

            yPos += 50;

            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text(`Detected Type: ${result.threat_type}`, padding, yPos);
            yPos += 7;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);

            if (result.explanation) {
                const splitAIExplanation = doc.splitTextToSize(result.explanation, pageWidth - 2 * padding);
                doc.text(splitAIExplanation, padding, yPos);
                yPos += splitAIExplanation.length * 5 + 8;
            }

            if (result.caution) {
                if (yPos > 260) {
                    doc.addPage();
                    yPos = 20;
                }
                doc.setFillColor(254, 226, 226);
                doc.roundedRect(padding, yPos, pageWidth - 2 * padding, 15, 2, 2, 'F');
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.text('⚠ Warning:', padding + 3, yPos + 6);
                doc.setFont('helvetica', 'normal');
                const splitCaution = doc.splitTextToSize(result.caution, pageWidth - 2 * padding - 30);
                doc.text(splitCaution, padding + 25, yPos + 6);
                yPos += 20;
            }

            if (result.solution) {
                if (yPos > 260) {
                    doc.addPage();
                    yPos = 20;
                }
                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.text('Recommended Solution:', padding, yPos);
                yPos += 6;
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);
                const splitSolution = doc.splitTextToSize(result.solution, pageWidth - 2 * padding);
                doc.text(splitSolution, padding, yPos);
                yPos += splitSolution.length * 5 + 8;
            }

            if (result.precautions && result.precautions.length > 0) {
                if (yPos > 240) {
                    doc.addPage();
                    yPos = 20;
                }
                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.text('Precautions:', padding, yPos);
                yPos += 6;
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                result.precautions.forEach((precaution, idx) => {
                    if (yPos > 280) {
                        doc.addPage();
                        yPos = 20;
                    }
                    doc.text(`${idx + 1}. ${precaution}`, padding + 5, yPos);
                    yPos += 6;
                });
            }
        }

        // Footer
        const pageCount = doc.internal.pages.length - 1;
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(128, 128, 128);
            doc.text(`Page ${i} of ${pageCount} | ThreatNet AI Analysis`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
        }

        // Save PDF
        const timestamp = new Date().getTime();
        doc.save(`ThreatNet_Analysis_${timestamp}.pdf`);
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: '3rem', color: 'white' }}>
            {/* Background Video */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', zIndex: 1 }}></div>
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                >
                    <source src="/dashboard_bg.mp4" type="video/mp4" />
                </video>
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '3rem' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div className="badge badge-primary" style={{ marginBottom: '1rem' }}>
                        <Shield size={16} />
                        AI-Powered Threat Detection Engine
                    </div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: '800' }}>
                        Comprehensive Threat Analyzer
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto' }}>
                        Advanced spam detection and threat classification powered by Groq AI
                    </p>
                </div>

                {error && (
                    <div className="alert alert-danger" style={{ maxWidth: '900px', margin: '0 auto 2rem' }}>
                        <AlertTriangle size={20} />
                        <div>{error}</div>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1.8fr' : '1fr', gap: '2rem', maxWidth: '1600px', margin: '0 auto' }}>

                    {/* Input Section */}
                    <div>
                        <div className="card card-elevated" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '700', color: 'white' }}>
                                Input Message
                            </h3>

                            {/* Message Type Selection */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: 'white' }}>
                                    Message Type
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                                    {['email', 'whatsapp', 'text'].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setMessageType(type)}
                                            className={`btn ${messageType === type ? 'btn-primary' : ''}`}
                                            style={{
                                                padding: '0.75rem',
                                                background: messageType === type ? undefined : 'rgba(255,255,255,0.05)',
                                                border: messageType === type ? undefined : '1px solid rgba(255,255,255,0.2)',
                                                color: messageType === type ? undefined : 'rgba(255,255,255,0.7)'
                                            }}
                                        >
                                            {type === 'email' && <Mail size={18} />}
                                            {type === 'whatsapp' && <Smartphone size={18} />}
                                            {type === 'text' && <MessageSquare size={18} />}
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <textarea
                                className="input-field"
                                style={{
                                    height: '250px',
                                    resize: 'vertical',
                                    fontFamily: 'monospace',
                                    fontSize: '0.9rem',
                                    background: 'rgba(255,255,255,0.1)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    color: 'white'
                                }}
                                placeholder="Paste your message content here for analysis..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            ></textarea>

                            <button
                                onClick={analyzeThreat}
                                className="btn btn-primary"
                                style={{ width: '100%', fontSize: '1rem', marginTop: '1.5rem', padding: '1rem' }}
                                disabled={loading || !text.trim()}
                            >
                                {loading ? (
                                    <>
                                        <div className="loader"></div>
                                        Analyzing with AI...
                                    </>
                                ) : (
                                    <>
                                        <Shield size={20} />
                                        Analyze Message
                                    </>
                                )}
                            </button>

                            {result && (
                                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem', color: 'white' }}>
                                        Send WhatsApp Alert
                                    </label>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <input
                                            type="tel"
                                            className="input-field"
                                            placeholder="+1234567890"
                                            value={whatsappNum}
                                            onChange={(e) => setWhatsappNum(e.target.value)}
                                            style={{ flex: 1, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
                                        />
                                        <button
                                            onClick={sendWhatsAppAlert}
                                            className="btn btn-success"
                                            disabled={!whatsappNum}
                                        >
                                            <Send size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '12px', border: '1px solid rgba(79, 70, 229, 0.2)' }}>
                                <p style={{ fontSize: '0.85rem', color: '#a5b4fc', margin: 0 }}>
                                    🔒 Analyzed using Groq AI. No data is stored.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Results Section */}
                    {(datasetResult || result) && (
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            {/* Download PDF Button - Top Right */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button
                                    onClick={downloadPDF}
                                    className="btn btn-success"
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <Download size={18} />
                                    Download PDF Report
                                </button>
                            </div>

                            {/* Dataset Detection Card */}
                            {datasetResult && (
                                <div className="card card-elevated fade-in" style={{
                                    border: `2px solid ${getThreatColor(datasetResult.threat_type)}`,
                                    background: `linear-gradient(to bottom, ${getThreatColor(datasetResult.threat_type)}15, rgba(0,0,0,0.4))`,
                                    backdropFilter: 'blur(5px)'
                                }}>
                                    {/* Header with Badge */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <Database size={24} color={getThreatColor(datasetResult.threat_type)} />
                                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0, color: 'white' }}>
                                                Dataset Detection
                                            </h3>
                                        </div>
                                        <div className={`badge ${getThreatBadge(datasetResult.threat_type)}`}>
                                            {datasetResult.threat_type.toUpperCase()}
                                        </div>
                                    </div>

                                    {/* Threat Warning Box */}
                                    <div style={{
                                        background: datasetResult.threat_type !== 'Legitimate'
                                            ? 'rgba(239, 68, 68, 0.1)'
                                            : 'rgba(16, 185, 129, 0.1)',
                                        border: `1px solid ${getThreatColor(datasetResult.threat_type)}`,
                                        borderRadius: '12px',
                                        padding: '1.5rem',
                                        marginBottom: '1.5rem'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                            <div style={{ fontSize: '2.5rem' }}>
                                                {datasetResult.threat_type !== 'Legitimate' ? '⚠️' : '✅'}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h2 style={{
                                                    fontSize: '1.75rem',
                                                    fontWeight: '800',
                                                    color: getThreatColor(datasetResult.threat_type),
                                                    margin: '0 0 0.25rem 0'
                                                }}>
                                                    {datasetResult.threat_type !== 'Legitimate' ? '⚠️ SPAM' : '✓ SAFE MESSAGE'}
                                                </h2>
                                                <p style={{
                                                    fontSize: '1.1rem',
                                                    fontWeight: '600',
                                                    color: getThreatColor(datasetResult.threat_type),
                                                    margin: 0,
                                                    opacity: 0.9
                                                }}>
                                                    {datasetResult.threat_type !== 'Legitimate' ? 'Threat Detected' : 'No Threat Detected'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Metrics Grid */}
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(3, 1fr)',
                                            gap: '1rem',
                                            marginTop: '1.5rem'
                                        }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'rgba(255,255,255,0.6)', marginBottom: '0.25rem' }}>
                                                    CONFIDENCE
                                                </div>
                                                <div style={{ fontSize: '2rem', fontWeight: '800', color: getThreatColor(datasetResult.threat_type) }}>
                                                    {(datasetResult.confidence * 100).toFixed(1)}%
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'rgba(255,255,255,0.6)', marginBottom: '0.25rem' }}>
                                                    Spam Score
                                                </div>
                                                <div style={{ fontSize: '2rem', fontWeight: '800', color: getThreatColor(datasetResult.threat_type) }}>
                                                    {datasetResult.spam_score}/100
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'rgba(255,255,255,0.6)', marginBottom: '0.25rem' }}>
                                                    Detection Confidence
                                                </div>
                                                <div className="progress-bar" style={{ marginTop: '0.5rem', background: 'rgba(255,255,255,0.1)' }}>
                                                    <div
                                                        className="progress-fill"
                                                        style={{
                                                            width: `${datasetResult.confidence * 100}%`,
                                                            background: `linear-gradient(90deg, ${getThreatColor(datasetResult.threat_type)}, ${getThreatColor(datasetResult.threat_type)}dd)`
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Explanation */}
                                    <div className="card" style={{ background: 'rgba(255,255,255,0.05)', border: 'none' }}>
                                        <h4 style={{ marginBottom: '0.75rem', fontSize: '1rem', fontWeight: '600', color: 'white' }}>
                                            Dataset Analysis
                                        </h4>
                                        <p style={{ margin: 0, lineHeight: '1.6', color: 'rgba(255,255,255,0.8)' }}>
                                            {datasetResult.explanation}
                                        </p>
                                        {datasetResult.matched_patterns && datasetResult.matched_patterns.length > 0 && (
                                            <div style={{ marginTop: '1rem' }}>
                                                <strong style={{ color: 'white' }}>Matched Patterns:</strong>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                                                    {datasetResult.matched_patterns.map((pattern, idx) => (
                                                        <span key={idx} className="badge badge-danger" style={{ fontSize: '0.8rem' }}>
                                                            {pattern}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* AI Detection Card */}
                            {result && (
                                <div className="card card-elevated fade-in" style={{
                                    border: `2px solid ${getThreatColor(result.threat_type)}`,
                                    background: `linear-gradient(to bottom, ${getThreatColor(result.threat_type)}15, rgba(0,0,0,0.4))`,
                                    backdropFilter: 'blur(5px)'
                                }}>
                                    {/* Header with Badge */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <Shield size={24} color={getThreatColor(result.threat_type)} />
                                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0, color: 'white' }}>
                                                AI Detection (Groq)
                                            </h3>
                                        </div>
                                        <div className={`badge ${getThreatBadge(result.threat_type)}`}>
                                            {result.threat_type.toUpperCase()}
                                        </div>
                                    </div>

                                    {/* Threat Warning Box */}
                                    <div style={{
                                        background: result.threat_type !== 'Legitimate'
                                            ? 'rgba(239, 68, 68, 0.1)'
                                            : 'rgba(16, 185, 129, 0.1)',
                                        border: `1px solid ${getThreatColor(result.threat_type)}`,
                                        borderRadius: '12px',
                                        padding: '1.5rem',
                                        marginBottom: '1.5rem'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                            <div style={{ fontSize: '2.5rem' }}>
                                                {result.threat_type !== 'Legitimate' ? '⚠️' : '✅'}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h2 style={{
                                                    fontSize: '1.75rem',
                                                    fontWeight: '800',
                                                    color: getThreatColor(result.threat_type),
                                                    margin: '0 0 0.25rem 0'
                                                }}>
                                                    {result.threat_type !== 'Legitimate' ? '⚠️ SPAM' : '✓ SAFE MESSAGE'}
                                                </h2>
                                                <p style={{
                                                    fontSize: '1.1rem',
                                                    fontWeight: '600',
                                                    color: getThreatColor(result.threat_type),
                                                    margin: 0,
                                                    opacity: 0.9
                                                }}>
                                                    {result.threat_type !== 'Legitimate' ? 'Threat Detected' : 'No Threat Detected'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Metrics Grid */}
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(3, 1fr)',
                                            gap: '1rem',
                                            marginTop: '1.5rem'
                                        }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'rgba(255,255,255,0.6)', marginBottom: '0.25rem' }}>
                                                    CONFIDENCE
                                                </div>
                                                <div style={{ fontSize: '2rem', fontWeight: '800', color: getThreatColor(result.threat_type) }}>
                                                    {(result.confidence * 100).toFixed(1)}%
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'rgba(255,255,255,0.6)', marginBottom: '0.25rem' }}>
                                                    Spam Score
                                                </div>
                                                <div style={{ fontSize: '2rem', fontWeight: '800', color: getThreatColor(result.threat_type) }}>
                                                    {result.spam_score}/100
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'rgba(255,255,255,0.6)', marginBottom: '0.25rem' }}>
                                                    Detection Confidence
                                                </div>
                                                <div className="progress-bar" style={{ marginTop: '0.5rem', background: 'rgba(255,255,255,0.1)' }}>
                                                    <div
                                                        className="progress-fill"
                                                        style={{
                                                            width: `${result.confidence * 100}%`,
                                                            background: `linear-gradient(90deg, ${getThreatColor(result.threat_type)}, ${getThreatColor(result.threat_type)}dd)`
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tabs for detailed information */}
                                    <div className="tabs">
                                        <button
                                            className={`tab ${activeTab === 'analysis' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('analysis')}
                                            style={{ color: activeTab === 'analysis' ? '#4f46e5' : 'rgba(255,255,255,0.7)' }}
                                        >
                                            Analysis
                                        </button>
                                        <button
                                            className={`tab ${activeTab === 'mitigation' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('mitigation')}
                                            style={{ color: activeTab === 'mitigation' ? '#4f46e5' : 'rgba(255,255,255,0.7)' }}
                                        >
                                            Mitigation
                                        </button>
                                        <button
                                            className={`tab ${activeTab === 'details' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('details')}
                                            style={{ color: activeTab === 'details' ? '#4f46e5' : 'rgba(255,255,255,0.7)' }}
                                        >
                                            Details
                                        </button>
                                        <button
                                            className={`tab ${activeTab === 'graph' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('graph')}
                                            style={{ color: activeTab === 'graph' ? '#4f46e5' : 'rgba(255,255,255,0.7)' }}
                                        >
                                            Attack Flow
                                        </button>
                                    </div>

                                    {/* Tab Content */}
                                    <div style={{ marginTop: '1.5rem' }}>
                                        {activeTab === 'analysis' && (
                                            <div className="fade-in">
                                                <div className="card" style={{ background: 'rgba(255,255,255,0.05)', marginBottom: '1.5rem', border: 'none' }}>
                                                    <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
                                                        <Target size={20} color="#818cf8" />
                                                        AI Explanation
                                                    </h4>
                                                    <p style={{ lineHeight: '1.8', color: 'rgba(255,255,255,0.8)' }}>
                                                        {result.explanation}
                                                    </p>
                                                </div>

                                                {result.system_hacked && (
                                                    <div className={`alert ${result.system_hacked.status === 'Possible' ? 'alert-danger' : 'alert-info'}`}>
                                                        <Lock size={20} />
                                                        <div>
                                                            <strong>System Compromise Status:</strong> {result.system_hacked.status}
                                                            <p style={{ marginTop: '0.5rem', marginBottom: 0 }}>{result.system_hacked.reason}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {activeTab === 'mitigation' && (
                                            <div className="fade-in">
                                                <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
                                                    <AlertTriangle size={20} />
                                                    <div>
                                                        <strong>Critical Warning:</strong> {result.caution}
                                                    </div>
                                                </div>

                                                <div className="card" style={{ marginBottom: '1.5rem', background: 'var(--color-bg)' }}>
                                                    <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <Shield size={20} color="var(--color-warning)" />
                                                        Immediate Precautions
                                                    </h4>
                                                    <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                                                        {result.precautions?.map((step, idx) => (
                                                            <li key={idx} style={{ marginBottom: '0.5rem' }}>{step}</li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="alert alert-success">
                                                    <CheckCircle size={20} />
                                                    <div>
                                                        <strong>Recommended Solution:</strong> {result.solution}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'details' && (
                                            <div className="fade-in">
                                                {result.objectives && result.objectives.length > 0 && (
                                                    <div className="card" style={{ background: 'var(--color-bg)', marginBottom: '1.5rem' }}>
                                                        <h4 style={{ marginBottom: '1rem' }}>Attacker Objectives</h4>
                                                        <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                                                            {result.objectives.map((obj, idx) => (
                                                                <li key={idx} style={{ marginBottom: '0.5rem' }}>{obj}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {result.methodology && result.methodology.length > 0 && (
                                                    <div className="card" style={{ background: 'var(--color-bg)' }}>
                                                        <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <BookOpen size={20} color="var(--color-primary)" />
                                                            Attack Methodology
                                                        </h4>
                                                        <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                                                            {result.methodology.map((method, idx) => (
                                                                <li key={idx} style={{ marginBottom: '0.5rem' }}>{method}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {activeTab === 'graph' && result.attack_flow && (
                                            <div className="fade-in">
                                                <div className="card" style={{ background: 'var(--color-bg)', padding: '2rem', textAlign: 'center' }}>
                                                    <h4 style={{ marginBottom: '1.5rem' }}>Attack Vector Flow</h4>
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        gap: '1rem',
                                                        flexWrap: 'wrap'
                                                    }}>
                                                        <GraphNode label={result.attack_flow.source} color="#ef4444" />
                                                        <Arrow />
                                                        <GraphNode label={result.attack_flow.vulnerability} color="#f59e0b" />
                                                        <Arrow />
                                                        <GraphNode label={result.threat_type} color="#ec4899" />
                                                        <Arrow />
                                                        <GraphNode label={result.attack_flow.impact} color="#8b5cf6" />
                                                    </div>
                                                    <p style={{ marginTop: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                                        This diagram shows the complete attack chain from source to impact
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Helper Components
const GraphNode = ({ label, color }) => (
    <div style={{
        padding: '1rem 1.5rem',
        background: `${color}15`,
        border: `2px solid ${color}`,
        borderRadius: '12px',
        fontWeight: '600',
        color: color,
        minWidth: '140px'
    }}>
        {label}
    </div>
);

const Arrow = () => (
    <div style={{ fontSize: '1.5rem', color: 'var(--color-text-muted)' }}>→</div>
);

// Helper Functions
const getThreatColor = (prediction) => {
    const colors = {
        'Phishing': '#ef4444',
        'Malware': '#dc2626',
        'Ransomware': '#b91c1c',
        'SQL Injection': '#f59e0b',
        'DDoS': '#ec4899',
        'Spam': '#f97316',
        'Legitimate': '#10b981'
    };
    return colors[prediction] || '#6b7280';
};

const getThreatBadge = (prediction) => {
    return (prediction === 'Legitimate' || prediction === 'Safe') ? 'badge-success' : 'badge-danger';
};

const getThreatIcon = (prediction) => {
    return (prediction === 'Legitimate' || prediction === 'Safe') ? '✅ ' : '⚠️ ';
};
