// src/components/Work.jsx
import React, { useState } from "react";
import "../App.css";
import GithubWidget from "./GithubWidget";

const projects = [
  {
    icon: "",
    title: "Hate Speech Detection",
    description:
      "Developed an LSTM-based NLP model to detect hate and offensive speech in tweets.",
    technologies: ["Python", "NLP", "LSTM", "Deep Learning"],
    buttons: [{ label: "GitHub", kind: "primary", href: "https://github.com/JAY-cloudbuster/hate-speech-detection" }],
  },
  {
    icon: "",
    title: "Heart Health & Mortality Prediction",
    description:
      "Built a deep learning model using clinical data to predict heart failure risk.",
    technologies: ["Python", "Pandas", "Deep Learning", "Healthcare"],
    buttons: [{ label: "GitHub", kind: "primary", href: "https://github.com/JAY-cloudbuster/heart-mortality-prediction" }],
  },
  {
    icon: "",
    title: "Credit EDA Prediction",
    description:
      "Created a credit scoring model by analyzing customer and loan history data.",
    technologies: ["Python", "EDA", "Machine Learning"],
    buttons: [{ label: "GitHub", kind: "primary", href: "https://github.com/JAY-cloudbuster/credit-EDA" }],
  },
  {
    icon: "",
    title: "BuyThem | Smart Marketplace",
    description:
      "Clean and user-friendly marketplace platform for browsing and buying products.",
    technologies: ["React", "Node.js", "MongoDB", "REST API"],
    buttons: [
      { label: "Live Demo", kind: "primary", href: "https://github.com/JAY-cloudbuster/sell-them_jay" },
      { label: "GitHub", kind: "primary", href: "https://github.com/JAY-cloudbuster/sell-them_jay" },
    ],
  },
  {
    icon: "https://github.com/JAY-cloudbuster/Comparison-study-on-different-distance-measurement-techniques-using-BLE",
    title: "BLE Indoor Distance Measurement",
    description:
      "Compared BLE-based indoor positioning methods using ESP32‑C6 for cost, accuracy, and compatibility.",
    technologies: ["ESP32", "BLE", "IoT", "Signal Processing"],
    buttons: [{ label: "GitHub", kind: "primary", href: "" }],
  },
  {
    icon: "https://github.com/23CSE362-edge-computing-2025-26-odd/capstone-project-29_edgenodes",
    title: "Adaptive Traffic Light Optimization",
    description:
      "Fuzzy Logic and Q‑Learning based traffic light optimization using real-time queue length and density.",
    technologies: ["Python", "Q-Learning", "Fuzzy Logic"],
    buttons: [{ label: "GitHub", kind: "primary", href: "" }],
  },
];

function Work() {
  // club 1 slider (2 images) - using public folder paths
  const [clubIndex1, setClubIndex1] = useState(0);
  const [isFading1, setIsFading1] = useState(false);
  const clubImages1 = [
    "/club-photo-1.jpg",
    "/club-photo-2.jpg",
  ];

  const changeSlide1 = (direction) => {
    if (isFading1) return;
    setIsFading1(true);
    setTimeout(() => {
      setClubIndex1((prev) => {
        const next =
          direction === "next"
            ? (prev + 1) % clubImages1.length
            : prev === 0
            ? clubImages1.length - 1
            : prev - 1;
        return next;
      });
      setIsFading1(false);
    }, 200);
  };

  // club 2 slider (4 images) - using public folder paths
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
      setClubIndex2((prev) => {
        const next =
          direction === "next"
            ? (prev + 1) % clubImages2.length
            : prev === 0
            ? clubImages2.length - 1
            : prev - 1;
        return next;
      });
      setIsFading2(false);
    }, 200);
  };

  return (
    <section id="work" className="section">
      <h2 className="section-title">Featured Work</h2>
      <p className="section-subtitle">Recent projects and innovations</p>

      {/* Full-width GitHub widget row */}
      <div className="github-widget-row">
        <GithubWidget />
      </div>

      {/* Club 1 */}
      <div className="club-frame-row">
        <div className="club-frame">
          <button
            type="button"
            className="club-arrow club-arrow-left"
            onClick={() => changeSlide1("prev")}
          >
            ‹
          </button>

          <div
            className={
              "club-frame-inner " +
              (isFading1 ? "club-fade-out" : "club-fade-in")
            }
          >
            <img
              src={clubImages1[clubIndex1]}
              alt="iDEA Tech Club"
              className="club-image"
            />
          </div>

          <button
            type="button"
            className="club-arrow club-arrow-right"
            onClick={() => changeSlide1("next")}
          >
            ›
          </button>
        </div>

        <div className="club-text">
          <h3 className="club-title">iDEA – tech club</h3>
          <p className="club-description">
            A technical club at Amrita school of computing, Coimbatore
          </p>
          <p className="club-note">
            This is a space for motivated developers to collaborate on
            innovative projects and expand their skill sets. Our goal is to
            foster a dynamic environment where everyone can contribute and learn
            from one another. We&apos;re confident that our new members will bring
            fresh perspectives and valuable talent to our community.
          </p>
        </div>
      </div>

      {/* Club 2 (4-image slider) */}
      <div className="club-frame-row">
        <div className="club-frame">
          <button
            type="button"
            className="club-arrow club-arrow-left"
            onClick={() => changeSlide2("prev")}
          >
            ‹
          </button>

          <div
            className={
              "club-frame-inner " +
              (isFading2 ? "club-fade-out" : "club-fade-in")
            }
          >
            <img
              src={clubImages2[clubIndex2]}
              alt="NSS National Service Scheme"
              className="club-image"
            />
          </div>

          <button
            type="button"
            className="club-arrow club-arrow-right"
            onClick={() => changeSlide2("next")}
          >
            ›
          </button>
        </div>

        <div className="club-text">
          <h3 className="club-title">NSS (NATIONAL SERVICE SCHEME)</h3>
          <p className="club-description">
            The National Service Scheme (NSS) is a voluntary program in India,
            launched in 1969 by the Government of India under the Ministry of
            Youth Affairs and Sports, to engage college students in community
            service and personality development
          </p>
          <p className="club-note">
            As an active member and student coordinator in NSS, the special camp
            was a great experience that developed my character.
          </p>
        </div>
      </div>

      {/* Project cards grid */}
      <div className="projects-grid">
        {projects.map((p) => (
          <div key={p.title} className="project-card">
            <div className="project-icon">{p.icon}</div>
            <h3 className="project-title">{p.title}</h3>
            <p className="project-description">{p.description}</p>

            <div className="project-tech">
              {p.technologies.map((tech) => (
                <span key={tech} className="tech-badge">
                  {tech}
                </span>
              ))}
            </div>

            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                flexWrap: "wrap",
                gap: "0.75rem",
                justifyContent: "center",
              }}
            >
              {p.buttons.map((btn, idx) => {
                const baseStyle = {
                  padding: "0.55rem 1.4rem",
                  borderRadius: "6px",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  letterSpacing: "0.4px",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: btn.href ? "pointer" : "default",
                };

                const primary =
                  btn.kind === "primary"
                    ? {
                        background: "#16a34a",
                        color: "#ffffff",
                        border: "none",
                      }
                    : {};

                const ghost =
                  btn.kind === "ghost"
                    ? {
                        background: "transparent",
                        color: "#16a34a",
                        border: "1px solid #16a34a",
                      }
                    : {};

                return (
                  <a
                    key={idx}
                    href={btn.href || "#"}
                    target={btn.href ? "_blank" : "_self"}
                    rel="noreferrer"
                    style={{ ...baseStyle, ...primary, ...ghost }}
                  >
                    {btn.label}
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Work;
