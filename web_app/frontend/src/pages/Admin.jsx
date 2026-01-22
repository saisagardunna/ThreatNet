import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { Users, MessageSquare, Star, TrendingUp, Calendar, Mail, Shield } from 'lucide-react';

export default function Admin() {
    const [reviews, setReviews] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('reviews'); // 'reviews' or 'users'
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalReviews: 0,
        avgRating: 0,
        totalUsers: 0
    });

    useEffect(() => {
        // Enforce Admin Auth
        const isAuth = localStorage.getItem('adminAuth') === 'true';
        if (!isAuth) {
            navigate('/admin-login');
            return;
        }

        fetchAllData();
    }, [navigate]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            // Fetch Reviews
            const { data: reviewsData, error: reviewsError } = await supabase
                .from('reviews')
                .select('*')
                .order('created_at', { ascending: false });

            if (reviewsError) throw reviewsError;

            // Fetch Users (Profiles)
            // Note: RLS policies must allow reading profiles. The schema says "Public profiles are viewable by everyone" so this should work.
            const { data: usersData, error: usersError } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (usersError) throw usersError;

            setReviews(reviewsData || []);
            setUsers(usersData || []);

            // Calculate stats
            const totalrev = reviewsData?.length || 0;
            const avgRating = totalrev > 0 ? (reviewsData.reduce((sum, r) => sum + r.rating, 0) / totalrev).toFixed(1) : 0;
            const totalUsr = usersData?.length || 0;

            setStats({
                totalReviews: totalrev,
                avgRating: avgRating,
                totalUsers: totalUsr
            });

        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminAuth');
        navigate('/admin-login');
    };

    return (
        <div style={{ background: 'linear-gradient(180deg, #f3f4f6 0%, #ffffff 100%)', minHeight: '100vh', paddingBottom: '3rem' }}>
            <div className="container" style={{ paddingTop: '3rem' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
                    <div>
                        <div className="badge badge-danger" style={{ marginBottom: '1rem' }}>
                            <Shield size={16} />
                            Administrator Access
                        </div>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: '800', color: '#1f2937' }}>
                            Administration Console
                        </h1>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
                            System Overview & Data Management
                        </p>
                    </div>
                    <button onClick={handleLogout} className="btn" style={{ border: '1px solid #fee2e2', color: '#dc2626', background: '#fef2f2' }}>
                        Log Out
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-3" style={{ marginBottom: '3rem' }}>
                    <StatCard
                        icon={<Users size={32} color="#4f46e5" />}
                        title="Registered Users"
                        value={stats.totalUsers}
                        color="#4f46e5"
                    />
                    <StatCard
                        icon={<MessageSquare size={32} color="#f59e0b" />}
                        title="Total Reviews"
                        value={stats.totalReviews}
                        color="#f59e0b"
                    />
                    <StatCard
                        icon={<Star size={32} color="#10b981" />}
                        title="Average Rating"
                        value={`${stats.avgRating}`}
                        color="#10b981"
                    />
                </div>

                {/* Navigation Tabs */}
                <div style={{ marginBottom: '2rem', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '2rem' }}>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        style={{
                            padding: '1rem 0',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'reviews' ? '2px solid #4f46e5' : '2px solid transparent',
                            color: activeTab === 'reviews' ? '#4f46e5' : '#6b7280',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <MessageSquare size={18} />
                        Reviews Database
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        style={{
                            padding: '1rem 0',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'users' ? '2px solid #4f46e5' : '2px solid transparent',
                            color: activeTab === 'users' ? '#4f46e5' : '#6b7280',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <Users size={18} />
                        User Login Data
                    </button>
                </div>

                {/* Content Area */}
                <div className="card card-elevated">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <div className="loader" style={{ margin: '0 auto' }}></div>
                            <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>Loading system data...</p>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'reviews' && (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>All Reviews</h3>
                                        <button onClick={fetchAllData} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                                            <TrendingUp size={16} /> Refresh
                                        </button>
                                    </div>
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
                                            <thead>
                                                <tr style={{ textAlign: 'left', color: '#6b7280', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>
                                                    <th style={{ padding: '1rem' }}>Date</th>
                                                    <th style={{ padding: '1rem' }}>User</th>
                                                    <th style={{ padding: '1rem' }}>Rating</th>
                                                    <th style={{ padding: '1rem' }}>Review</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reviews.map((review) => (
                                                    <tr key={review.id} style={{ background: '#f9fafb', borderRadius: '8px' }}>
                                                        <td style={{ padding: '1rem', borderRadius: '8px 0 0 8px' }}>
                                                            {new Date(review.created_at).toLocaleDateString()}
                                                        </td>
                                                        <td style={{ padding: '1rem' }}>
                                                            <div style={{ fontWeight: '500' }}>{review.email}</div>
                                                        </td>
                                                        <td style={{ padding: '1rem' }}>
                                                            <div className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                                                <Star size={12} fill="currentColor" /> {review.rating}
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '1rem', borderRadius: '0 8px 8px 0' }}>
                                                            {review.comment}
                                                        </td>
                                                    </tr>
                                                ))}
                                                {reviews.length === 0 && (
                                                    <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>No reviews found</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'users' && (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Registered Users (Login Data)</h3>
                                        <button onClick={fetchAllData} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                                            <TrendingUp size={16} /> Refresh
                                        </button>
                                    </div>
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
                                            <thead>
                                                <tr style={{ textAlign: 'left', color: '#6b7280', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>
                                                    <th style={{ padding: '1rem' }}>Joined Date</th>
                                                    <th style={{ padding: '1rem' }}>Email / Login ID</th>
                                                    <th style={{ padding: '1rem' }}>Name</th>
                                                    <th style={{ padding: '1rem' }}>User ID</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.map((user) => (
                                                    <tr key={user.id} style={{ background: '#f9fafb', borderRadius: '8px' }}>
                                                        <td style={{ padding: '1rem', borderRadius: '8px 0 0 8px' }}>
                                                            {new Date(user.created_at).toLocaleDateString()}
                                                            <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{new Date(user.created_at).toLocaleTimeString()}</div>
                                                        </td>
                                                        <td style={{ padding: '1rem' }}>
                                                            <div style={{ fontWeight: '600', color: '#111827' }}>{user.email}</div>
                                                        </td>
                                                        <td style={{ padding: '1rem' }}>
                                                            {user.name || 'N/A'}
                                                        </td>
                                                        <td style={{ padding: '1rem', borderRadius: '0 8px 8px 0' }}>
                                                            <code style={{ background: '#e5e7eb', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.8rem' }}>{user.id.slice(0, 8)}...</code>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {users.length === 0 && (
                                                    <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>No users found (Profiles table empty)</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

const StatCard = ({ icon, title, value, color }) => (
    <div className="card" style={{ textAlign: 'center', border: `2px solid ${color}15` }}>
        <div style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 1rem',
            borderRadius: '16px',
            background: `${color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {icon}
        </div>
        <div style={{ fontSize: '2.5rem', fontWeight: '800', color: color, marginBottom: '0.5rem' }}>
            {value}
        </div>
        <div style={{ color: 'var(--color-text-muted)', fontWeight: '500' }}>
            {title}
        </div>
    </div>
);
