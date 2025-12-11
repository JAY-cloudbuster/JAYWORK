// src/components/Navbar.jsx
import React from "react";
import "../App.css";

function Navbar() {
  const scrollTo = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="nav">
      <div className="logo">JAY</div>
      <ul className="nav-links">
        <li>
          <a href="#about" onClick={scrollTo("about")}>
            About
          </a>
        </li>
        <li>
          <a href="#work" onClick={scrollTo("work")}>
            Work
          </a>
        </li>
        <li>
          <a href="#skills" onClick={scrollTo("skills")}>
            Skills
          </a>
        </li>
        <li>
          <a href="#contact" onClick={scrollTo("contact")}>
            Contact
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
