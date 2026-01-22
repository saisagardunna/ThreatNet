import React, { useRef, useEffect, useState } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

const defaultImageDir = '/sequence/ezgif-frame-';
const defaultFrameCount = 40;

export default function ImageScrollBackground({
    imageDir = defaultImageDir,
    frameCount = defaultFrameCount,
    backgroundColor = '#050505'
}) {
    const canvasRef = useRef(null);
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Track the scroll of the entire document
    const { scrollYProgress } = useScroll();

    // Map scroll progress to current frame index
    const currentIndex = useTransform(scrollYProgress, [0, 1], [0, frameCount - 1]);

    // Preload images
    useEffect(() => {
        const loadImages = async () => {
            const loadedImages = [];
            const promises = [];

            setIsLoading(true);

            for (let i = 1; i <= frameCount; i++) {
                const promise = new Promise((resolve) => {
                    const img = new Image();
                    const frameNumber = i.toString().padStart(3, '0');
                    img.src = `${imageDir}${frameNumber}.jpg`;
                    img.onload = () => resolve(img);
                    img.onerror = () => {
                        console.error("Failed to load image", i, `${imageDir}${frameNumber}.jpg`);
                        resolve(null);
                    };
                    loadedImages[i - 1] = img;
                });
                promises.push(promise);
            }

            await Promise.all(promises);
            setImages(loadedImages);
            setIsLoading(false);
        };

        loadImages();
    }, [imageDir, frameCount]);

    // Draw to canvas
    useEffect(() => {
        const render = (index) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            const imgIndex = Math.min(frameCount - 1, Math.max(0, Math.round(index)));
            const img = images[imgIndex];

            if (img) {
                // Clear entire canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // "Cover" logic (fill the screen)
                // Maintain aspect ratio, fill the canvas
                const imgRatio = img.width / img.height;
                const canvasRatio = canvas.width / canvas.height;

                let drawWidth, drawHeight, offsetX, offsetY;

                if (canvasRatio > imgRatio) {
                    drawWidth = canvas.width;
                    drawHeight = canvas.width / imgRatio;
                    offsetX = 0;
                    offsetY = (canvas.height - drawHeight) / 2;
                } else {
                    drawHeight = canvas.height;
                    drawWidth = canvas.height * imgRatio;
                    offsetX = (canvas.width - drawWidth) / 2;
                    offsetY = 0;
                }

                ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
            }
        };

        const unsubscribe = currentIndex.on("change", (latest) => {
            if (!isLoading && images.length > 0) {
                render(latest);
            }
        });

        // Initial Render
        if (!isLoading && images.length > 0) {
            requestAnimationFrame(() => render(currentIndex.get()));
        }

        return () => unsubscribe();
    }, [currentIndex, isLoading, images, frameCount]);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            const canvas = canvasRef.current;
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                zIndex: 0,
                pointerEvents: 'none',
                backgroundColor: backgroundColor
            }}
        >
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center text-white z-20">
                    <div className="loading-spinner">Loading...</div>
                </div>
            )}

            <canvas
                ref={canvasRef}
                className="w-full h-full block"
            />

            {/* Optional Overlay to help text readability */}
            <div className="absolute inset-0 bg-black/40" />
        </div>
    );
}
