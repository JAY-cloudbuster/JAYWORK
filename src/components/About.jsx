// src/components/About.jsx
import React from "react";
import "../App.css";

function About() {
  return (
    <section id="about" className="section">
      <h2 className="section-title">About</h2>
      <p className="section-subtitle">
        CSE Undergraduate at Amrita Vishwa Vidyapeeth | Developer and vice-president at iDEA
        Club
      </p>

      <div className="about-content">
        <div className="about-text">
          <p>
            I'm a passionate developer in my pre-final year of Computer Science
            Engineering at Amrita Vishwa Vidyapeeth, Coimbatore. I specialize in
            building end-to-end web applications and exploring cutting-edge
            technologies in AI/ML.
          </p>
          <p>
            As the Devloper at iDEA club, I lead technical initiatives
            and mentor students. My expertise spans full-stack development with
            React and Node.js, machine learning applications, computer vision,
            and deployments.
          </p>
          <p>
            I'm actively preparing for campus placements and internships
            while continuously learning and pushing the boundaries of what I can
            build.
          </p>
        </div>

        <div className="about-stats">
          <div className="stat-card">
            <div className="stat-number">10+</div>
            <div className="stat-label">Projects</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">5+</div>
            <div className="stat-label">Tech Domains</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">7.06</div>
            <div className="stat-label">CGPA</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">∞</div>
            <div className="stat-label">Passion</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
