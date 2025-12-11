// src/components/Hero.jsx
import React from "react";
import "../App.css";
import profileImg from "./profile.jpg";

function Hero() {
  const goToWork = () => {
    const el = document.getElementById("work");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="hero">
      <div className="hero-content">
        {/* Profile card at the very top */}
        <div className="profile-card">
          <div className="profile-avatar">
            <img src={profileImg} alt="Jayesh Rao Kalla" />
          </div>
          <div className="profile-name">Jayesh Rao Kalla</div>
        </div>

        <div className="hero-subtitle">Full-Stack Developer & ML Engineer</div>
        <h1 className="hero-title">Crafting Intelligent Solutions</h1>
        <p className="hero-description">
          Building scalable web applications, exploring machine learning, and
          designing DevOps infrastructure. Based in Amrita school of computing, Coimbatore.
        </p>
        <button className="cta-button" onClick={goToWork}>
          Explore My Work
        </button>
      </div>
    </section>
  );
}

export default Hero;
