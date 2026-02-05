// src/components/InteractiveBuddy.jsx
import React, { useEffect, useState, useCallback } from "react";
import "../App.css";

const SECTION_MESSAGES = {
  hero: "Hey there! 👋",
  about: "Cool story, right?",
  work: "Nice projects!",
  skills: "Many talents! ✨",
  contact: "Say hello! 📧",
  default: "Scroll around!",
};

function InteractiveBuddy() {
  // ratios 0–1 for viewport position
  const [pos, setPos] = useState({ x: 0.2, y: 0.2 });
  const [currentSection, setCurrentSection] = useState("hero");

  // Mouse tracking
  useEffect(() => {
    const handleMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setPos({ x, y });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  // Section detection
  useEffect(() => {
    const sectionIds = ["hero", "about", "work", "skills", "contact"];
    const observers = [];

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            setCurrentSection(id);
          }
        },
        { threshold: [0.3, 0.5, 0.7] }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  // body gentle follow
  const offsetX = (pos.x - 0.5) * 20; // -20px to 20px
  const offsetY = (pos.y - 0.5) * 20;

  // eyes stronger follow inside face
  const eyeOffsetX = (pos.x - 0.5) * 40;
  const eyeOffsetY = (pos.y - 0.5) * 40;

  const message = SECTION_MESSAGES[currentSection] || SECTION_MESSAGES.default;

  return (
    <div
      className="buddy-wrapper"
      style={{
        transform: `translate(${offsetX}px, ${offsetY}px)`,
      }}
    >
      {/* speech bubble */}
      <div className="buddy-speech">
        <p>{message}</p>
      </div>

      <div className="buddy-face">
        <div
          className="buddy-eyes"
          style={{
            transform: `translate(${eyeOffsetX}px, ${eyeOffsetY}px)`,
          }}
        >
          <span className="buddy-eye" />
          <span className="buddy-eye" />
        </div>
      </div>
    </div>
  );
}

export default InteractiveBuddy;

