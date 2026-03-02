// src/components/Experience.jsx
import React from "react";
import "../App.css";
import useReveal from "../hooks/useReveal";

const TIMELINE_DATA = [
    {
        date: "2024 — Present",
        title: "Vice-President & Developer",
        subtitle: "iDEA Club, Amrita Vishwa Vidyapeeth",
        description:
            "Leading technical initiatives, mentoring students, and organizing hackathons. Built internal tools and managed club's web presence.",
        tags: ["Leadership", "Mentoring", "Full-Stack"],
        type: "role",
    },
    {
        date: "2023 — Present",
        title: "B.Tech Computer Science Engineering",
        subtitle: "Amrita Vishwa Vidyapeeth, Coimbatore",
        description:
            "Pre-final year undergraduate focusing on AI/ML, Data Structures, and Systems Design. CGPA: 7.06.",
        tags: ["AI/ML", "DSA", "Systems"],
        type: "education",
    },
    {
        date: "2024",
        title: "AgriSahayak — Full-Stack Platform",
        subtitle: "Personal Project",
        description:
            "Built a full-stack agricultural assistance platform with React, Node.js, and ML-based crop recommendations. End-to-end deployment with CI/CD.",
        tags: ["React", "Node.js", "ML", "DevOps"],
        type: "project",
    },
    {
        date: "2024",
        title: "Polyglot Ghost — AI Translation",
        subtitle: "Personal Project",
        description:
            "Developed an AI-powered real-time translation web app deployed on Vercel. Integrated language detection with a sleek, modern UI.",
        tags: ["React", "AI", "Vercel"],
        type: "project",
    },
    {
        date: "2023",
        title: "Air Canvas — Computer Vision",
        subtitle: "Research + Development",
        description:
            "Created a hand-gesture-based drawing tool using MediaPipe and Canvas API. Real-time finger tracking with multi-color brush support.",
        tags: ["MediaPipe", "Computer Vision", "Canvas"],
        type: "project",
    },
];

const TYPE_ICONS = {
    role: "💼",
    education: "🎓",
    project: "🚀",
};

function TimelineItem({ item, index }) {
    const { ref, isRevealed } = useReveal(0.15);
    const isLeft = index % 2 === 0;

    return (
        <div
            className={`tl-item ${isLeft ? "tl-item--left" : "tl-item--right"} ${isRevealed ? "revealed" : "reveal"}`}
            ref={ref}
        >
            {/* Center dot */}
            <div className="tl-dot">
                <span className="tl-dot-icon">{TYPE_ICONS[item.type] || "📌"}</span>
            </div>

            {/* Card */}
            <div className="tl-card">
                <div className="tl-date">{item.date}</div>
                <h3 className="tl-card-title">{item.title}</h3>
                <p className="tl-card-subtitle">{item.subtitle}</p>
                <p className="tl-card-desc">{item.description}</p>
                <div className="tl-tags">
                    {item.tags.map((tag) => (
                        <span key={tag} className="tech-badge">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function Experience() {
    const { ref: titleRef, isRevealed: titleRevealed } = useReveal(0.15);

    return (
        <section id="experience" className="section">
            <div
                ref={titleRef}
                className={titleRevealed ? "revealed" : "reveal"}
            >
                <h2 className="section-title">Experience</h2>
                <p className="section-subtitle">
                    My journey through education, roles, and impactful projects
                </p>
            </div>

            <div className="tl-container">
                {/* Center line */}
                <div className="tl-line" />

                {TIMELINE_DATA.map((item, i) => (
                    <TimelineItem key={i} item={item} index={i} />
                ))}
            </div>
        </section>
    );
}
