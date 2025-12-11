// src/components/Skills.jsx
import React from "react";
import "../App.css";

const categories = [
  {
    title: "Full-Stack Development",
    list: ["React / Vite", "Node.js", "Express", "MongoDB", "JavaScript"],
  },
  {
    title: "Machine Learning",
    list: ["Python", "TensorFlow", "NLP", "YOLO", "Q-Learning"],
  },
  {
    title: "DevOps & Cloud",
    list: ["Docker", "Git / GitHub", "CI/CD", "Linux", "GitHub Pages"],
  },
  {
    title: "Other Technologies",
    list: ["Java", "C", "SQL", "HTML/CSS", "STM32"],
  },
];

function Skills() {
  return (
    <section id="skills" className="section">
      <h2 className="section-title">Skills & Expertise</h2>
      <p className="section-subtitle">Technologies and domains I work with</p>

      <div className="skills-grid">
        {categories.map((cat) => (
          <div key={cat.title} className="skill-category">
            <div className="skill-category-title">{cat.title}</div>
            <div className="skill-list">
              {cat.list.map((s) => (
                <span key={s} className="skill-tag">
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Skills;
