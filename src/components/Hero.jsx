// src/components/Hero.jsx
import React, { useState, useEffect } from "react";
import "../App.css";
import profileImg from "./profile.jpg";

// Typing animation hook
function useTypingEffect(phrases, typingSpeed = 100, deletingSpeed = 50, pauseTime = 2000) {
  const [displayText, setDisplayText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentPhrase.length) {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseTime]);

  return displayText;
}

function Hero() {
  const phrases = [
    "Full-Stack Developer",
    "ML Engineer",
    "DevOps Enthusiast",
    "Problem Solver",
    "Tech Explorer"
  ];

  const typedText = useTypingEffect(phrases, 80, 40, 1500);

  const goToWork = () => {
    const el = document.getElementById("work");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="hero">
      <div className="hero-content">
        {/* Compact profile pill */}
        <div className="profile-card">
          <div className="profile-avatar">
            <img src={profileImg} alt="Jayesh Rao Kalla" />
          </div>
          <div className="profile-name">Jayesh Rao Kalla</div>
        </div>

        <div className="hero-subtitle">
          <span className="typed-text">{typedText}</span>
          <span className="typing-cursor">|</span>
        </div>
        <h1 className="hero-title">Crafting Intelligent<br />Solutions</h1>
        <p className="hero-description">
          Building scalable web applications, exploring machine learning, and
          designing DevOps infrastructure. Based in Amrita School of Computing, Coimbatore.
        </p>
        <button className="cta-button magnetic-button" onClick={goToWork}>
          Explore My Work
        </button>
      </div>
    </section>
  );
}

export default Hero;
