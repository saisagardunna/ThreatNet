import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';
import { MessageCircle, Send, Users, Clock } from 'lucide-react';

export default function Community({ session }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!session) return;

        fetchUserProfile();
        fetchMessages();

        // Subscribe to new messages
        const channel = supabase
            .channel('public:community_messages')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'community_messages' },
                (payload) => {
                    setMessages(prev => [...prev, payload.new]);
                    scrollToBottom();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [session]);

    const fetchUserProfile = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', session.user.id)
            .single();

        if (data) {
            setUserProfile(data);
        }
    };

    const fetchMessages = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('community_messages')
            .select('*')
            .order('created_at', { ascending: true })
            .limit(100);

        if (error) {
            console.error('Error fetching messages:', error);
        } else {
            setMessages(data || []);
            setTimeout(scrollToBottom, 100);
        }
        setLoading(false);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !userProfile) return;

        setSending(true);
        const { error } = await supabase
            .from('community_messages')
            .insert([
                {
                    user_id: session.user.id,
                    user_name: userProfile.name,
                    user_email: session.user.email,
                    message: newMessage.trim()
                }
            ]);

        if (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        } else {
            setNewMessage('');
        }
        setSending(false);
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
        return date.toLocaleDateString();
    };

    if (!session) {
        return (
            <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)' }}>
                <div className="card card-elevated" style={{ maxWidth: '500px', textAlign: 'center', padding: '3rem' }}>
                    <MessageCircle size={64} color="var(--color-primary)" style={{ margin: '0 auto 1.5rem' }} />
                    <h2 style={{ marginBottom: '1rem', fontSize: '1.75rem', fontWeight: '700' }}>Join the Community</h2>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: '1.7' }}>
                        Please log in to access the community chat and connect with other security professionals.
                    </p>
                    <a href="/login">
                        <button className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                            Login to Continue
                        </button>
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)', minHeight: '100vh', paddingBottom: '2rem' }}>
            <div className="container" style={{ paddingTop: '2rem', maxWidth: '1000px' }}>
                {/* Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <div className="badge badge-success" style={{ marginBottom: '1rem' }}>
                        <Users size={16} />
                        Live Chat
                    </div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: '800' }}>
                        Community Chat
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>
                        Connect with fellow security professionals in real-time
                    </p>
                </div>

                {/* Chat Container */}
                <div className="card card-elevated" style={{ height: '65vh', display: 'flex', flexDirection: 'column', padding: 0 }}>
                    {/* Messages Area */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '1.5rem',
                        background: 'var(--color-bg)'
                    }}>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '3rem' }}>
                                <div className="loader" style={{ margin: '0 auto' }}></div>
                                <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>Loading messages...</p>
                            </div>
                        ) : messages.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem' }}>
                                <MessageCircle size={48} color="var(--color-border)" style={{ margin: '0 auto 1rem' }} />
                                <p style={{ color: 'var(--color-text-muted)' }}>No messages yet. Start the conversation!</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {messages.map((msg, idx) => {
                                    const isOwnMessage = msg.user_id === session.user.id;
                                    return (
                                        <div
                                            key={msg.id || idx}
                                            style={{
                                                display: 'flex',
                                                justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                                                animation: 'fadeIn 0.3s ease-out'
                                            }}
                                        >
                                            <div style={{
                                                maxWidth: '70%',
                                                background: isOwnMessage ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' : 'white',
                                                color: isOwnMessage ? 'white' : 'var(--color-text)',
                                                padding: '1rem',
                                                borderRadius: '12px',
                                                boxShadow: 'var(--shadow-sm)',
                                                border: isOwnMessage ? 'none' : '1px solid var(--color-border)'
                                            }}>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    marginBottom: '0.5rem',
                                                    fontSize: '0.85rem',
                                                    opacity: 0.9
                                                }}>
                                                    <span style={{ fontWeight: '600' }}>{msg.user_name}</span>
                                                    <span style={{ opacity: 0.7 }}>•</span>
                                                    <span style={{ opacity: 0.7, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        <Clock size={12} />
                                                        {formatTime(msg.created_at)}
                                                    </span>
                                                </div>
                                                <div style={{ lineHeight: '1.6', wordBreak: 'break-word' }}>
                                                    {msg.message}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div style={{
                        padding: '1.5rem',
                        borderTop: '1px solid var(--color-border)',
                        background: 'white'
                    }}>
                        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '1rem' }}>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Type your message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                disabled={sending}
                                style={{ flex: 1, margin: 0 }}
                            />
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={sending || !newMessage.trim()}
                                style={{ flexShrink: 0 }}
                            >
                                {sending ? (
                                    <div className="loader"></div>
                                ) : (
                                    <>
                                        <Send size={20} />
                                        Send
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Info */}
                <div className="alert alert-info" style={{ marginTop: '1.5rem' }}>
                    <MessageCircle size={18} />
                    <div>
                        <strong>Community Guidelines:</strong> Be respectful, stay on topic, and help fellow members. Messages are visible to all logged-in users.
                    </div>
                </div>
            </div>
        </div>
    );
}
