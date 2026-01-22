import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { Star, MessageSquare } from 'lucide-react';

import ImageScrollBackground from '../components/ImageScrollBackground';

export default function GiveReview({ session }) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    if (!session) {
        return (
            <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <ImageScrollBackground
                    imageDir='/sequence_reviews/ezgif-frame-'
                    frameCount={40}
                />
                <div style={{ position: 'relative', zIndex: 1, padding: '2rem', width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <div className="card card-elevated" style={{ maxWidth: '500px', textAlign: 'center', padding: '3rem', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                        <Star size={64} color="#f59e0b" style={{ margin: '0 auto 1.5rem' }} />
                        <h2 style={{ marginBottom: '1rem', fontSize: '1.75rem', fontWeight: '700', color: 'white' }}>Login Required</h2>
                        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem', lineHeight: '1.7' }}>
                            Please log in to submit a review
                        </p>
                        <a href="/login">
                            <button className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                                Login to Continue
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            alert('Please select a rating');
            return;
        }

        setSubmitting(true);
        const { error } = await supabase.from('reviews').insert([
            {
                user_id: session.user.id,
                email: session.user.email,
                rating: rating,
                comment: comment
            }
        ]);

        if (error) {
            alert("Error submitting review: " + error.message);
        } else {
            alert("✅ Review submitted successfully!");
            navigate('/reviews');
        }
        setSubmitting(false);
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: '3rem', color: 'white' }}>
            <ImageScrollBackground
                imageDir='/sequence_reviews/ezgif-frame-'
                frameCount={40}
            />

            <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '3rem', maxWidth: '700px' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div className="badge badge-warning" style={{ marginBottom: '1rem', backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#fcd34d', backdropFilter: 'blur(2px)' }}>
                        <Star size={16} />
                        Your Feedback
                    </div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: '800', color: 'white', textShadow: '0 0 20px rgba(0,0,0,0.5)' }}>
                        Submit Your Review
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
                        Help us improve THREATNET with your valuable feedback
                    </p>
                </div>

                <div className="card card-elevated" style={{ padding: '3rem', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '1rem', fontWeight: '600', fontSize: '1.1rem', color: 'white' }}>
                                Rating
                            </label>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <button
                                        key={num}
                                        type="button"
                                        onClick={() => setRating(num)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: 0
                                        }}
                                    >
                                        <Star
                                            size={48}
                                            fill={num <= rating ? '#f59e0b' : 'rgba(255,255,255,0.1)'}
                                            color={num <= rating ? '#f59e0b' : 'rgba(255,255,255,0.3)'}
                                            style={{ transition: 'transform 0.2s' }}
                                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                        />
                                    </button>
                                ))}
                            </div>
                            <p style={{ textAlign: 'center', marginTop: '1rem', color: 'rgba(255,255,255,0.6)' }}>
                                {rating > 0 ? `You selected ${rating} star${rating > 1 ? 's' : ''}` : 'Click on stars to rate'}
                            </p>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', fontSize: '1.1rem', color: 'white' }}>
                                Your Comments
                            </label>
                            <textarea
                                className="input-field"
                                rows="6"
                                placeholder="Share your experience with THREATNET..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                                style={{ resize: 'vertical', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', fontSize: '1rem', padding: '1rem' }}
                            disabled={submitting || rating === 0}
                        >
                            {submitting ? (
                                <div className="loader"></div>
                            ) : (
                                <>
                                    <Star size={20} />
                                    Submit Review
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
