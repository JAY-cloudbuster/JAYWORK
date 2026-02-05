// src/components/MagneticButton.jsx
import React, { useRef, useState } from "react";

function MagneticButton({ children, className = "", strength = 0.3, ...props }) {
    const buttonRef = useRef(null);
    const [transform, setTransform] = useState("");

    const handleMouseMove = (e) => {
        if (!buttonRef.current) return;

        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) * strength;
        const deltaY = (e.clientY - centerY) * strength;

        setTransform(`translate(${deltaX}px, ${deltaY}px)`);
    };

    const handleMouseLeave = () => {
        setTransform("");
    };

    return (
        <button
            ref={buttonRef}
            className={`magnetic-button ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transform,
                transition: transform ? "transform 0.1s ease-out" : "transform 0.3s ease-out",
            }}
            {...props}
        >
            {children}
        </button>
    );
}

export default MagneticButton;
