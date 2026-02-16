// src/components/Work.jsx
import React, { useState } from "react";
import "../App.css";
import GithubWidget from "./GithubWidget";

const projects = [
  {
    title: "Hate Speech Detection",
    description:
      "Developed an LSTM-based NLP model to detect hate and offensive speech in tweets.",
    technologies: ["Python", "NLP", "LSTM", "Deep Learning"],
    buttons: [{ label: "GitHub", kind: "primary", href: "https://github.com/JAY-cloudbuster/hate-speech-detection" }],
  },
  {
    title: "Heart Health & Mortality Prediction",
    description:
      "Built a deep learning model using clinical data to predict heart failure risk.",
    technologies: ["Python", "Pandas", "Deep Learning", "Healthcare"],
    buttons: [{ label: "GitHub", kind: "primary", href: "https://github.com/JAY-cloudbuster/heart-mortality-prediction" }],
  },
  {
    title: "Credit EDA Prediction",
    description:
      "Created a credit scoring model by analyzing customer and loan history data.",
    technologies: ["Python", "EDA", "Machine Learning"],
    buttons: [{ label: "GitHub", kind: "primary", href: "https://github.com/JAY-cloudbuster/credit-EDA" }],
  },
  {
    title: "BuyThem | Smart Marketplace",
    description:
      "Clean and user-friendly marketplace platform for browsing and buying products.",
    technologies: ["React", "Node.js", "MongoDB", "REST API"],
    buttons: [
      { label: "Live Demo", kind: "ghost", href: "https://jay-cloudbuster.github.io/sell-them_jay/" },
      { label: "GitHub", kind: "primary", href: "https://github.com/JAY-cloudbuster/sell-them_jay" },
    ],
  },
  {
    title: "BLE Indoor Distance",
    description:
      "Compared BLE-based indoor positioning methods using ESP32‑C6 for cost, accuracy, and compatibility.",
    technologies: ["ESP32", "BLE", "IoT", "Signal Processing"],
    buttons: [{ label: "GitHub", kind: "primary", href: "https://github.com/JAY-cloudbuster/Comparison-study-on-different-distance-measurement-techniques-using-BLE" }],
  },
  {
    title: "Traffic Light Optimization",
    description:
      "Fuzzy Logic and Q‑Learning based traffic light optimization using real-time queue length and density.",
    technologies: ["Python", "Q-Learning", "Fuzzy Logic"],
    buttons: [{ label: "GitHub", kind: "primary", href: "https://github.com/23CSE362-edge-computing-2025-26-odd/capstone-project-29_edgenodes" }],
  },
];

function Work() {
  // Club 1 slider
  const [clubIndex1, setClubIndex1] = useState(0);
  const [isFading1, setIsFading1] = useState(false);
  const clubImages1 = ["/club-photo-1.jpg", "/club-photo-2.jpg"];

  const changeSlide1 = (direction) => {
    if (isFading1) return;
    setIsFading1(true);
    setTimeout(() => {
      setClubIndex1((prev) =>
        direction === "next"
          ? (prev + 1) % clubImages1.length
          : prev === 0 ? clubImages1.length - 1 : prev - 1
      );
      setIsFading1(false);
    }, 200);
  };

  // Club 2 slider
  const [clubIndex2, setClubIndex2] = useState(0);
  const [isFading2, setIsFading2] = useState(false);
  const clubImages2 = [
    "/club2-photo-1.jpg",
    "/club2-photo-2.jpg",
    "/club2-photo-3.jpg",
    "/club2-photo-4.jpg",
  ];

  const changeSlide2 = (direction) => {
    if (isFading2) return;
    setIsFading2(true);
    setTimeout(() => {
      setClubIndex2((prev) =>
        direction === "next"
          ? (prev + 1) % clubImages2.length
          : prev === 0 ? clubImages2.length - 1 : prev - 1
      );
      setIsFading2(false);
    }, 200);
  };

  return (
    <section id="work" className="section">
      <h2 className="section-title">Featured Work</h2>
      <p className="section-subtitle">Recent projects and innovations</p>

      {/* Bento Grid */}
      <div className="bento-grid">

        {/* GitHub Widget — full width row */}
        <div className="bento-item bento-span-4x1" style={{ padding: 0, background: "transparent", border: "none", boxShadow: "none" }}>
          <GithubWidget />
        </div>

        {/* Club 1 — 2x2 bento cell */}
        <div className="bento-item bento-span-2x2 club-bento-card">
          <div className="club-slider">
            <button
              type="button"
              className="club-arrow club-arrow-left"
              onClick={() => changeSlide1("prev")}
            >
              ‹
            </button>
            <img
              src={clubImages1[clubIndex1]}
              alt="iDEA Tech Club"
              className={isFading1 ? "club-fade-out" : "club-fade-in"}
            />
            <button
              type="button"
              className="club-arrow club-arrow-right"
              onClick={() => changeSlide1("next")}
            >
              ›
            </button>
          </div>
          <div className="club-text-block">
            <h3 className="club-title">iDEA — Tech Club</h3>
            <p className="club-description">
              A technical club at Amrita School of Computing, Coimbatore.
            </p>
            <p className="club-note">
              A space for motivated developers to collaborate on
              innovative projects and expand their skill sets.
            </p>
          </div>
        </div>

        {/* Club 2 — 2x2 bento cell */}
        <div className="bento-item bento-span-2x2 club-bento-card">
          <div className="club-slider">
            <button
              type="button"
              className="club-arrow club-arrow-left"
              onClick={() => changeSlide2("prev")}
            >
              ‹
            </button>
            <img
              src={clubImages2[clubIndex2]}
              alt="NSS National Service Scheme"
              className={isFading2 ? "club-fade-out" : "club-fade-in"}
            />
            <button
              type="button"
              className="club-arrow club-arrow-right"
              onClick={() => changeSlide2("next")}
            >
              ›
            </button>
          </div>
          <div className="club-text-block">
            <h3 className="club-title">NSS — National Service Scheme</h3>
            <p className="club-description">
              Engaging college students in community service and personality development.
            </p>
            <p className="club-note">
              As an active member and student coordinator, the special camp
              was a transformative experience.
            </p>
          </div>
        </div>

        {/* Project cards */}
        {projects.map((p) => (
          <div key={p.title} className="bento-item tilt-card">
            <h3 className="project-title">{p.title}</h3>
            <p className="project-description">{p.description}</p>

            <div className="project-tech">
              {p.technologies.map((tech) => (
                <span key={tech} className="tech-badge">
                  {tech}
                </span>
              ))}
            </div>

            <div className="project-buttons">
              {p.buttons.map((btn, idx) => (
                <a
                  key={idx}
                  href={btn.href || "#"}
                  target={btn.href ? "_blank" : "_self"}
                  rel="noreferrer"
                  className={`project-btn ${btn.kind === "primary" ? "project-btn-primary" : "project-btn-ghost"
                    }`}
                >
                  {btn.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Work;
