// src/components/Preloader.jsx
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import "./Preloader.css";

const LETTERS = ["J", "A", "Y", "E", "S", "H", "R", "A", "O"];

export default function Preloader({ onComplete }) {
    const overlayRef = useRef(null);
    const letterRefs = useRef([]);

    useEffect(() => {
        // Lock scrolling while preloader is active
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const tl = gsap.timeline({
            onComplete: () => {
                // Restore scrolling & notify parent
                document.body.style.overflow = prevOverflow || "";
                sessionStorage.setItem("preloader_played", "true");
                if (onComplete) onComplete();
            },
        });

        const letters = letterRefs.current;

        // ─── Phase 1: Entrance — all letters fade in together, slow & cinematic ───
        tl.to(letters, {
            opacity: 1,
            filter: "blur(0px)",
            scale: 1,
            duration: 2.2,
            stagger: {
                each: 0.02,
                from: "center",
            },
            ease: "power2.out",
        });

        // ─── Phase 2: Hold — clean pause (~2s) ───
        tl.to({}, { duration: 2 });

        // ─── Phase 3: Exit — letters fade out together ───
        tl.to(letters, {
            opacity: 0,
            y: -20,
            filter: "blur(6px)",
            duration: 1.2,
            stagger: {
                each: 0.02,
                from: "edges",
            },
            ease: "power2.in",
        });

        // ─── Phase 4: Transition — slide overlay up to reveal page ───
        tl.to(overlayRef.current, {
            y: "-100%",
            duration: 0.8,
            ease: "power3.inOut",
        });

        return () => {
            tl.kill();
            document.body.style.overflow = prevOverflow || "";
        };
    }, [onComplete]);

    return (
        <div className="preloader-overlay" ref={overlayRef}>
            <div className="preloader-grid">
                {LETTERS.map((char, i) => (
                    <span
                        key={i}
                        className="preloader-letter"
                        ref={(el) => (letterRefs.current[i] = el)}
                    >
                        {char}
                    </span>
                ))}
            </div>
        </div>
    );
}
