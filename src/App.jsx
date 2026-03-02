// src/App.jsx
import React, { useEffect, useState } from "react";
import "./App.css";

import Preloader from "./components/Preloader";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Work from "./components/Work";
import Skills from "./components/Skills";
import AirCanvasSection from "./components/AirCanvasSection";
import AirCanvasPage from "./components/AirCanvasPage";
import InteractiveBuddy from "./components/InteractiveBuddy";
import ThemeToggle from "./components/ThemeToggle";
import ScrollProgress from "./components/ScrollProgress";
import Spotlight from "./components/Spotlight";
import CommandPalette from "./components/CommandPalette";
import Connect from "./components/Connect";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [loading, setLoading] = useState(
    () => !sessionStorage.getItem("preloader_played")
  );

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
      {/* Cinematic preloader */}
      {loading && <Preloader onComplete={() => setLoading(false)} />}

      {/* Command palette (⌘K) */}
      <CommandPalette />

      {/* Scroll progress bar */}
      <ScrollProgress />

      {/* Spotlight effect */}
      <Spotlight />

      {/* interactive background buddy, behind all content */}
      <InteractiveBuddy />

      <main>
        <Hero />
        <About />
        <Experience />
        <Work />
        <Skills />
        <AirCanvasSection onLaunch={launchAirCanvas} />
      </main>

      {/* Connect section + footer */}
      <Connect />

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
        <a href="#experience" onClick={handleNavClick("experience")}>
          Experience
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
