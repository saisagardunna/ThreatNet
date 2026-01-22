import React from 'react';
import { X, Star } from 'lucide-react';

export const UserReviewModal = ({ isOpen, onClose, userEmail, onSubmit }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
            padding: '1rem'
        }} onClick={onClose}>
            <div className="card card-elevated" style={{
                width: '100%',
                maxWidth: '550px',
                padding: '2.5rem',
                position: 'relative'
            }} onClick={(e) => e.stopPropagation()}>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1.5rem',
                        right: '1.5rem',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        borderRadius: '8px',
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'var(--color-bg)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                    <X size={24} color="var(--color-text-muted)" />
                </button>

                {/* Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        margin: '0 auto 1.5rem',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Star size={32} color="white" />
                    </div>
                    <h2 style={{ textAlign: 'center', fontSize: '1.75rem', marginBottom: '0.5rem', fontWeight: '700' }}>
                        Submit Your Feedback
                    </h2>
                    <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        Help us improve THREATNET with your valuable feedback
                    </p>
                </div>

                <form onSubmit={onSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.75rem',
                            fontWeight: '600',
                            color: 'var(--color-text)'
                        }}>
                            Rating (1-5 Stars)
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            {[1, 2, 3, 4, 5].map((num) => (
                                <label key={num} style={{ cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        name="rating"
                                        value={num}
                                        required
                                        style={{ display: 'none' }}
                                    />
                                    <Star
                                        size={32}
                                        style={{
                                            fill: 'var(--color-warning)',
                                            color: 'var(--color-warning)',
                                            transition: 'transform 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                    />
                                </label>
                            ))}
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                            Click on the stars to select your rating
                        </p>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.75rem',
                            fontWeight: '600',
                            color: 'var(--color-text)'
                        }}>
                            Your Comments
                        </label>
                        <textarea
                            name="comment"
                            className="input-field"
                            rows="5"
                            placeholder="Share your experience with THREATNET..."
                            required
                            style={{ resize: 'vertical' }}
                        ></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-secondary"
                            style={{ flex: 1 }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ flex: 1 }}
                        >
                            <Star size={18} />
                            Submit Review
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
