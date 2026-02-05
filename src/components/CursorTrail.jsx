// src/components/CursorTrail.jsx
import React, { useEffect, useState, useRef } from "react";

const TRAIL_LENGTH = 15;
const TRAIL_FADE_SPEED = 0.05;
const LERP_FACTOR = 0.3;

function CursorTrail() {
    const [trail, setTrail] = useState([]);
    const mousePos = useRef({ x: 0, y: 0 });
    const animationRef = useRef(null);

    // Track mouse position
    useEffect(() => {
        const handleMouseMove = (e) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Animation loop for smooth trail
    useEffect(() => {
        let lastX = 0;
        let lastY = 0;

        const animate = () => {
            // Smooth interpolation towards mouse
            lastX += (mousePos.current.x - lastX) * LERP_FACTOR;
            lastY += (mousePos.current.y - lastY) * LERP_FACTOR;

            setTrail((prev) => {
                // Add new point
                const newPoint = {
                    x: lastX,
                    y: lastY,
                    id: Date.now() + Math.random(),
                    opacity: 1,
                };

                // Update existing points and add new one
                const updated = prev
                    .map((point) => ({
                        ...point,
                        opacity: point.opacity - TRAIL_FADE_SPEED,
                    }))
                    .filter((point) => point.opacity > 0);

                return [...updated, newPoint].slice(-TRAIL_LENGTH);
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return (
        <div className="cursor-trail-container">
            {trail.map((point, index) => {
                const progress = index / trail.length;
                return (
                    <div
                        key={point.id}
                        className="cursor-trail-dot"
                        style={{
                            left: point.x,
                            top: point.y,
                            opacity: point.opacity * progress,
                            transform: `translate(-50%, -50%) scale(${0.2 + progress * 0.8})`,
                        }}
                    />
                );
            })}
        </div>
    );
}

export default CursorTrail;

