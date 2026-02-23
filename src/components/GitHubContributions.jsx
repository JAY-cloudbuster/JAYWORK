// src/components/GitHubContributions.jsx
import React, { useEffect, useState } from "react";
import "../App.css";

const USERNAME = "JAY-cloudbuster";

function GitHubContributions() {
    const [stats, setStats] = useState({
        totalCommits: "...",
        totalPRs: "...",
        totalIssues: "...",
        contributions: "...",
    });

    // Theme-aware colors for the stats SVG
    // Based on index.css: Dark accent = #c8b6ff, Light accent = #7c5cfc
    const getThemeColors = () => {
        const isLight = document.documentElement.getAttribute("data-theme") === "light";
        return {
            title_color: isLight ? "7c5cfc" : "c8b6ff",
            text_color: isLight ? "555555" : "8a8a8a",
            icon_color: isLight ? "7c5cfc" : "c8b6ff",
            bg_color: "00000000", // Transparent
            hide_border: "true",
        };
    };

    const [colors, setColors] = useState(getThemeColors());

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setColors(getThemeColors());
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-theme"],
        });
        return () => observer.disconnect();
    }, []);

    // Construct URL for GitHub Readme Stats
    const statsUrl = `https://github-readme-stats.vercel.app/api?username=${USERNAME}&show_icons=true&theme=transparent&title_color=${colors.title_color}&text_color=${colors.text_color}&icon_color=${colors.icon_color}&hide_border=true&count_private=true`;
    const streakUrl = `https://github-readme-streak-stats.herokuapp.com/?user=${USERNAME}&theme=transparent&stroke=${colors.title_color}&point=${colors.icon_color}&currStreakNum=${colors.title_color}&sideLabels=${colors.text_color}&sideNumbers=${colors.text_color}&currStreakLabel=${colors.title_color}&dates=${colors.text_color}&hide_border=true`;

    return (
        <div className="bento-item bento-span-4x1 github-contributions-card">
            <div className="github-streak-container">
                <h3 className="github-streak-title">GitHub Contributions & Activity</h3>

                <div className="github-profile-stats">
                    <div className="github-stat-item">
                        <span className="github-stat-label">Total PRs</span>
                        <span className="github-stat-value">Coming Soon</span>
                    </div>
                    <div className="github-stat-item">
                        <span className="github-stat-label">Commit Velocity</span>
                        <span className="github-stat-value">High</span>
                    </div>
                    <div className="github-stat-item">
                        <span className="github-stat-label">Activity Level</span>
                        <span className="github-stat-value">Active</span>
                    </div>
                </div>

                <div className="github-streak-image">
                    <img
                        src={statsUrl}
                        alt="GitHub Stats"
                        style={{ width: '100%', maxWidth: '450px', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' }}
                    />
                </div>

                <div className="github-streak-image">
                    <img
                        src={streakUrl}
                        alt="GitHub Streak"
                        style={{ width: '100%', maxWidth: '450px', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' }}
                    />
                </div>

                <a
                    href={`https://github.com/${USERNAME}`}
                    target="_blank"
                    rel="noreferrer"
                    className="github-card-link"
                    style={{ marginTop: '1rem', display: 'inline-block' }}
                >
                    Explore Full Activity
                </a>
            </div>
        </div>
    );
}

export default GitHubContributions;
