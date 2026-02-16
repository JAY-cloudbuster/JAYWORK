// src/App.jsx
import React, { useEffect, useState } from "react";
import "./App.css";

import Hero from "./components/Hero";
import About from "./components/About";
import Work from "./components/Work";
import Skills from "./components/Skills";
import AirCanvasSection from "./components/AirCanvasSection";
import AirCanvasPage from "./components/AirCanvasPage";
import InteractiveBuddy from "./components/InteractiveBuddy";
import ThemeToggle from "./components/ThemeToggle";
import ScrollProgress from "./components/ScrollProgress";
import Spotlight from "./components/Spotlight";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // control visibility of scroll-to-top button
  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Navigate to Air Canvas page
  const launchAirCanvas = () => {
    setCurrentPage("aircanvas");
    window.scrollTo({ top: 0 });
  };

  const goHome = () => {
    setCurrentPage("home");
    window.scrollTo({ top: 0 });
  };

  // ─── Air Canvas Full Page ───
  if (currentPage === "aircanvas") {
    return <AirCanvasPage onBack={goHome} />;
  }

  // ─── Home Page ───
  return (
    <>
      {/* Scroll progress bar */}
      <ScrollProgress />

      {/* Spotlight effect */}
      <Spotlight />

      {/* interactive background buddy, behind all content */}
      <InteractiveBuddy />

      <main>
        <Hero />
        <About />
        <Work />
        <Skills />
        <AirCanvasSection onLaunch={launchAirCanvas} />

        {/* Minimal contact section */}
        <section id="contact" className="section contact-section">
          <h2 className="contact-title">Let&apos;s build something.</h2>
          <p className="contact-subtitle">
            Prefer email? Reach out anytime, and replies are usually within 24 hours.
          </p>

          <div className="contact-actions">
            <a
              href="mailto:kjayeshro@gmail.com"
              className="contact-primary contact-full"
            >
              EMAIL ME
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="social-links">
          <a href="https://github.com" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href="mailto:kjayeshro@gmail.com">Email</a>
        </div>
        <p>
          &copy; 2026 Jay. Built with passion for Code, AI, and DevOps.
        </p>
      </footer>

      {/* Scroll-to-top button */}
      {showScrollTop && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          ↑
        </button>
      )}

      {/* Floating side navigation */}
      <nav className="floating-nav">
        <ThemeToggle />
        <a href="#hero" onClick={handleNavClick("hero")}>
          Home
        </a>
        <a href="#about" onClick={handleNavClick("about")}>
          About
        </a>
        <a href="#work" onClick={handleNavClick("work")}>
          Work
        </a>
        <a href="#skills" onClick={handleNavClick("skills")}>
          Skills
        </a>
        <a href="#aircanvas" onClick={handleNavClick("aircanvas")}>
          AI Lab
        </a>
        <a href="#contact" onClick={handleNavClick("contact")}>
          Contact
        </a>
      </nav>
    </>
  );
}

export default App;
