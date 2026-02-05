// src/components/TiltCard.jsx
import React, { useRef, useState } from "react";

function TiltCard({ children, className = "", intensity = 15 }) {
    const cardRef = useRef(null);
    const [transform, setTransform] = useState("");

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -intensity;
        const rotateY = ((x - centerX) / centerX) * intensity;

        setTransform(
            `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
        );
    };

    const handleMouseLeave = () => {
        setTransform("");
    };

    return (
        <div
            ref={cardRef}
            className={`tilt-card ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transform,
                transition: transform ? "transform 0.1s ease-out" : "transform 0.4s ease-out",
            }}
        >
            {children}
        </div>
    );
}

export default TiltCard;
