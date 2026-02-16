// src/components/AirCanvasSection.jsx
import React from "react";
import "../App.css";
import useReveal from "../hooks/useReveal";

function AirCanvasSection({ onLaunch }) {
    const { ref, isRevealed } = useReveal(0.15);

    return (
        <section
            id="aircanvas"
            className={`section ${isRevealed ? "revealed" : "reveal"}`}
            ref={ref}
        >
            <h2 className="section-title">Air Canvas</h2>
            <p className="section-subtitle">
                Draw in thin air using just your hand — powered by real-time ML
            </p>

            <div className="ac-info-grid">
                {/* Left: description */}
                <div className="ac-info-text">
                    <h3 className="ac-info-heading">What is it?</h3>
                    <p>
                        Air Canvas turns your webcam into a drawing surface. Using
                        Google&apos;s <strong>MediaPipe Hands</strong> model, the app tracks
                        21 hand landmarks in real-time and uses your index fingertip as a
                        paintbrush — no touch screen required.
                    </p>

                    <h3 className="ac-info-heading">How it works</h3>
                    <p>
                        A convolutional neural network detects your hand in each video frame,
                        then a regression model predicts the 3D coordinates of every joint.
                        The app interprets finger positions to determine gestures:
                    </p>

                    <div className="ac-gesture-list">
                        <div className="ac-gesture-item">
                            <span className="ac-gesture-icon">☝️</span>
                            <div>
                                <strong>Index finger up</strong>
                                <span className="ac-gesture-desc">Draw mode — paint on the canvas</span>
                            </div>
                        </div>
                        <div className="ac-gesture-item">
                            <span className="ac-gesture-icon">✋</span>
                            <div>
                                <strong>Open palm</strong>
                                <span className="ac-gesture-desc">Pause — lift the brush</span>
                            </div>
                        </div>
                        <div className="ac-gesture-item">
                            <span className="ac-gesture-icon">✊</span>
                            <div>
                                <strong>Fist</strong>
                                <span className="ac-gesture-desc">Clear the entire canvas</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: tech details */}
                <div className="ac-info-tech">
                    <h3 className="ac-info-heading">Tech Stack</h3>
                    <div className="ac-tech-pills">
                        {[
                            "MediaPipe Hands",
                            "TensorFlow.js",
                            "WebAssembly",
                            "Canvas API",
                            "WebRTC",
                            "React",
                            "Real-time ML",
                            "Computer Vision",
                        ].map((t) => (
                            <span key={t} className="tech-badge">{t}</span>
                        ))}
                    </div>

                    <div className="ac-stats-preview">
                        <div className="ac-stat">
                            <span className="ac-stat-number">21</span>
                            <span className="ac-stat-label">Hand landmarks tracked</span>
                        </div>
                        <div className="ac-stat">
                            <span className="ac-stat-number">30+</span>
                            <span className="ac-stat-label">FPS real-time inference</span>
                        </div>
                        <div className="ac-stat">
                            <span className="ac-stat-number">0</span>
                            <span className="ac-stat-label">Server calls — 100% client-side</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="ac-launch-row">
                <button className="ac-launch-btn magnetic-button" onClick={onLaunch}>
                    🎨 Try the Air Canvas
                </button>
                <p className="ac-launch-note">
                    Requires camera access · Works best on desktop Chrome/Edge
                </p>
            </div>
        </section>
    );
}

export default AirCanvasSection;
