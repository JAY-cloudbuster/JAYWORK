// src/components/CommandPalette.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import "../App.css";

const COMMANDS = [
    { id: "home", label: "Go to Home", section: "Navigate", icon: "", action: "scroll", target: "hero" },
    { id: "about", label: "Go to About", section: "Navigate", icon: "", action: "scroll", target: "about" },
    { id: "experience", label: "Go to Experience", section: "Navigate", icon: "", action: "scroll", target: "experience" },
    { id: "work", label: "Go to Work", section: "Navigate", icon: "", action: "scroll", target: "work" },
    { id: "skills", label: "Go to Skills", section: "Navigate", icon: "", action: "scroll", target: "skills" },
    { id: "ailab", label: "Go to AI Lab", section: "Navigate", icon: "", action: "scroll", target: "aircanvas" },
    { id: "contact", label: "Go to Contact", section: "Navigate", icon: "", action: "scroll", target: "contact" },
    { id: "theme", label: "Toggle Theme", section: "Actions", icon: "", action: "theme" },
    { id: "resume", label: "Download Resume", section: "Actions", icon: "", action: "download", url: "/resume.pdf" },
    { id: "github", label: "Open GitHub", section: "Links", icon: "", action: "link", url: "https://github.com/JAY-cloudbuster" },
    { id: "linkedin", label: "Open LinkedIn", section: "Links", icon: "", action: "link", url: "https://linkedin.com" },
    { id: "email", label: "Send Email", section: "Links", icon: "", action: "link", url: "mailto:kjayeshro@gmail.com" },
];

export default function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef(null);
    const listRef = useRef(null);

    // Filter commands
    const filtered = COMMANDS.filter(
        (cmd) =>
            cmd.label.toLowerCase().includes(query.toLowerCase()) ||
            cmd.section.toLowerCase().includes(query.toLowerCase())
    );

    // Group by section
    const grouped = filtered.reduce((acc, cmd) => {
        if (!acc[cmd.section]) acc[cmd.section] = [];
        acc[cmd.section].push(cmd);
        return acc;
    }, {});

    // Keyboard shortcut to open
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setOpen((prev) => !prev);
                setQuery("");
                setActiveIndex(0);
            }
            if (e.key === "Escape" && open) {
                setOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open]);

    // Focus input on open
    useEffect(() => {
        if (open && inputRef.current) {
            setTimeout(() => inputRef.current.focus(), 50);
        }
    }, [open]);

    // Reset active index on filter change
    useEffect(() => {
        setActiveIndex(0);
    }, [query]);

    // Scroll active item into view
    useEffect(() => {
        if (listRef.current) {
            const activeEl = listRef.current.querySelector(".cmd-item--active");
            if (activeEl) {
                activeEl.scrollIntoView({ block: "nearest" });
            }
        }
    }, [activeIndex]);

    const executeCommand = useCallback(
        (cmd) => {
            setOpen(false);
            setQuery("");

            switch (cmd.action) {
                case "scroll": {
                    const el = document.getElementById(cmd.target);
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                    break;
                }
                case "theme": {
                    const current = document.documentElement.getAttribute("data-theme");
                    const next = current === "light" ? "dark" : "light";
                    document.documentElement.setAttribute("data-theme", next);
                    localStorage.setItem("theme", next);
                    break;
                }
                case "download": {
                    const a = document.createElement("a");
                    a.href = cmd.url;
                    a.download = "Jayesh_Rao_Resume.pdf";
                    a.click();
                    break;
                }
                case "link": {
                    window.open(cmd.url, "_blank", "noopener");
                    break;
                }
                default:
                    break;
            }
        },
        []
    );

    const handleKeyNav = (e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((prev) => (prev + 1) % filtered.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
        } else if (e.key === "Enter" && filtered[activeIndex]) {
            e.preventDefault();
            executeCommand(filtered[activeIndex]);
        }
    };

    if (!open) return null;

    let flatIndex = -1;

    return (
        <div className="cmd-overlay" onClick={() => setOpen(false)}>
            <div className="cmd-container" onClick={(e) => e.stopPropagation()}>
                {/* Search input */}
                <div className="cmd-input-wrapper">
                    <span className="cmd-input-icon">⌘</span>
                    <input
                        ref={inputRef}
                        type="text"
                        className="cmd-input"
                        placeholder="Type a command or search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyNav}
                        autoComplete="off"
                        spellCheck="false"
                    />
                    <kbd className="cmd-kbd">ESC</kbd>
                </div>

                {/* Results */}
                <div className="cmd-list" ref={listRef}>
                    {Object.keys(grouped).length === 0 && (
                        <div className="cmd-empty">No results found</div>
                    )}
                    {Object.entries(grouped).map(([section, commands]) => (
                        <div key={section}>
                            <div className="cmd-section-label">{section}</div>
                            {commands.map((cmd) => {
                                flatIndex++;
                                const idx = flatIndex;
                                return (
                                    <button
                                        key={cmd.id}
                                        className={`cmd-item ${idx === activeIndex ? "cmd-item--active" : ""}`}
                                        onClick={() => executeCommand(cmd)}
                                        onMouseEnter={() => setActiveIndex(idx)}
                                    >
                                        <span className="cmd-item-icon">{cmd.icon}</span>
                                        <span className="cmd-item-label">{cmd.label}</span>
                                        {idx === activeIndex && (
                                            <span className="cmd-item-hint">↵</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Footer hint */}
                <div className="cmd-footer">
                    <span><kbd>↑↓</kbd> Navigate</span>
                    <span><kbd>↵</kbd> Select</span>
                    <span><kbd>Esc</kbd> Close</span>
                </div>
            </div>
        </div>
    );
}
