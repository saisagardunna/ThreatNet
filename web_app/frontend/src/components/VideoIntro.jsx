import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VideoIntro({ onComplete }) {
    const [isVisible, setIsVisible] = useState(true);
    const videoRef = useRef(null);

    const handleVideoEnd = () => {
        setIsVisible(false);
        setTimeout(() => {
            if (onComplete) onComplete();
        }, 1000); // Wait for exit animation
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100vh',
                        zIndex: 9999,
                        backgroundColor: 'black',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        onEnded={handleVideoEnd}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    >
                        <source src="/intro.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    <button
                        onClick={handleVideoEnd}
                        style={{
                            position: 'absolute',
                            bottom: '2rem',
                            right: '2rem',
                            background: 'rgba(255,255,255,0.2)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            color: 'white',
                            padding: '0.5rem 1.5rem',
                            borderRadius: '99px',
                            cursor: 'pointer',
                            backdropFilter: 'blur(5px)',
                            zIndex: 10000
                        }}
                    >
                        Skip Intro
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
