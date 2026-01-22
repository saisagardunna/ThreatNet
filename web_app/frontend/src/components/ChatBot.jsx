import React, { useState, useRef, useEffect } from 'react';
import { useLottie } from "lottie-react";
import { Send, X, MessageSquare, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Initialize Lottie explicitly if possible, or just fetch the json
// Since we copied it to public/, we can fetch it or just import if we were using a bundler loader
// But we are in Vite, so fetching from public URL is easy.
// Actually, lottie-react often takes the JSON object directly. 
// Let's try to fetch it first effectively.

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi! I am Cute Bot 🤖. I can help you detect phishing and explain how ThreatNet works. Ask me anything!' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const [animationData, setAnimationData] = useState(null);

    // Fetch animation JSON
    useEffect(() => {
        fetch('/animations/cute-bot-say-users-hello.json')
            .then(res => res.json())
            .then(data => setAnimationData(data))
            .catch(err => console.error("Failed to load animation:", err));
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:8000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    history: messages.map(m => ({ role: m.role, content: m.content }))
                })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);

        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Oops! My circuits got a bit tangled. Please try again later." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') sendMessage();
    };

    // Lottie Configuration
    const LottieIcon = () => {
        if (!animationData) return <MessageSquare size={32} />;

        const options = {
            animationData: animationData,
            loop: true,
            autoplay: true,
            style: { width: 60, height: 60 }
        };
        const { View } = useLottie(options);
        return View;
    };

    return (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        style={{
                            width: '350px',
                            height: '500px',
                            background: 'rgba(23, 23, 23, 0.95)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '1rem',
                            background: 'linear-gradient(to right, #4f46e5, #818cf8)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ background: 'white', borderRadius: '50%', padding: '4px', display: 'flex' }}>
                                    <Shield size={20} color="#4f46e5" />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>Cute Bot</h3>
                                    <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>ThreatNet Assistant</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div style={{
                            flex: 1,
                            padding: '1rem',
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem'
                        }}>
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                        background: msg.role === 'user' ? '#4f46e5' : 'rgba(255, 255, 255, 0.1)',
                                        color: 'white',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '12px',
                                        borderBottomRightRadius: msg.role === 'user' ? '2px' : '12px',
                                        borderBottomLeftRadius: msg.role === 'user' ? '12px' : '2px',
                                        maxWidth: '85%',
                                        lineHeight: '1.5',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    {msg.content}
                                </div>
                            ))}
                            {loading && (
                                <div style={{ alignSelf: 'flex-start', color: '#a5b4fc', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
                                    Cute Bot is typing...
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask about phishing..."
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        color: 'white',
                                        outline: 'none'
                                    }}
                                />
                                <button
                                    onClick={sendMessage}
                                    style={{
                                        background: '#4f46e5',
                                        border: 'none',
                                        borderRadius: '8px',
                                        width: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        color: 'white'
                                    }}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button (Avatar) */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    background: 'white',
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    padding: 0
                }}
            >
                <LottieIcon />
            </motion.button>
        </div>
    );
}
