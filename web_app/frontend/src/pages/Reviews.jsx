import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Star, MessageSquare, User, TrendingUp } from 'lucide-react';

import ImageScrollBackground from '../components/ImageScrollBackground';

export default function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalReviews: 0,
        avgRating: 0,
        ratings: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    });

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching reviews:', error);
        } else {
            setReviews(data);

            // Calculate stats
            const total = data.length;
            const avgRating = total > 0 ? (data.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1) : 0;
            const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
            data.forEach(r => ratingCounts[r.rating]++);

            setStats({
                totalReviews: total,
                avgRating: avgRating,
                ratings: ratingCounts
            });
        }
        setLoading(false);
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: '3rem', color: 'white' }}>
            <ImageScrollBackground
                imageDir='/sequence_reviews/ezgif-frame-'
                frameCount={40}
            />

            <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '3rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div className="badge badge-warning" style={{ marginBottom: '1rem', backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#fcd34d', backdropFilter: 'blur(2px)' }}>
                        <Star size={16} />
                        User Feedback
                    </div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: '800', color: 'white', textShadow: '0 0 20px rgba(0,0,0,0.5)' }}>
                        Community Reviews
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                        See what our users are saying about THREATNET
                    </p>
                </div>

                {/* Stats Section */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginBottom: '3rem', maxWidth: '1200px', margin: '0 auto 3rem' }}>
                    <div className="card card-elevated" style={{ textAlign: 'center', padding: '2.5rem', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(3px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ fontSize: '4rem', fontWeight: '800', color: '#f59e0b', marginBottom: '0.5rem', textShadow: '0 0 20px rgba(245, 158, 11, 0.3)' }}>
                            {stats.avgRating}
                        </div>
                        <div style={{ color: '#f59e0b', marginBottom: '0.5rem', fontSize: '1.2rem' }}>
                            {'★'.repeat(Math.round(stats.avgRating))}{'☆'.repeat(5 - Math.round(stats.avgRating))}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                            Based on {stats.totalReviews} reviews
                        </div>
                    </div>

                    <div className="card card-elevated" style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(3px)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                        <h4 style={{ marginBottom: '1.5rem', fontWeight: '600' }}>Rating Distribution</h4>
                        {[5, 4, 3, 2, 1].map(rating => (
                            <div key={rating} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                                <div style={{ width: '60px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <span style={{ fontWeight: '600' }}>{rating}</span>
                                    <Star size={16} color="#f59e0b" fill="#f59e0b" />
                                </div>
                                <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${stats.totalReviews > 0 ? (stats.ratings[rating] / stats.totalReviews) * 100 : 0}%`,
                                        height: '100%',
                                        background: '#f59e0b',
                                        transition: 'width 0.6s ease',
                                        boxShadow: '0 0 10px rgba(245, 158, 11, 0.5)'
                                    }}></div>
                                </div>
                                <div style={{ width: '40px', textAlign: 'right', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                                    {stats.ratings[rating]}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reviews List */}
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
                        <MessageSquare size={24} color="#818cf8" />
                        Recent Reviews
                    </h3>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <div className="loader" style={{ margin: '0 auto', borderColor: 'rgba(255,255,255,0.2)', borderLeftColor: 'white' }}></div>
                            <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.6)' }}>Loading reviews...</p>
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', padding: '3rem', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(3px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <MessageSquare size={48} color="rgba(255,255,255,0.2)" style={{ margin: '0 auto 1rem' }} />
                            <p style={{ color: 'rgba(255,255,255,0.6)' }}>No reviews yet. Be the first to share your experience!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            {reviews.map((review) => (
                                <div key={review.id} className="card fade-in" style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(3px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontWeight: '600',
                                                fontSize: '1.2rem',
                                                boxShadow: '0 0 10px rgba(79, 70, 229, 0.4)'
                                            }}>
                                                {review.email.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600', marginBottom: '0.25rem', color: 'white' }}>
                                                    {review.email.split('@')[0]}
                                                </div>
                                                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                                                    {new Date(review.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ color: '#f59e0b', fontSize: '1.1rem' }}>
                                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                        </div>
                                    </div>
                                    <p style={{ lineHeight: '1.7', color: 'rgba(255,255,255,0.9)' }}>
                                        {review.comment}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
