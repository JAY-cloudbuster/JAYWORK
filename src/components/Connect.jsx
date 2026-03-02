// src/components/Connect.jsx
import React, { useState } from "react";
import "../App.css";

export default function Connect() {
    const [copied, setCopied] = useState(false);

    const copyEmail = () => {
        navigator.clipboard.writeText("kjayeshro@gmail.com").then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            <section id="contact" className="section connect-section">
                <h2 className="connect-heading">LET&apos;S BUILD SOMETHING.</h2>
                <p className="connect-subtitle">
                    Got a project in mind? Let&apos;s make it happen. Fill out the form or
                    drop me an email directly.
                </p>

                {/* Contact form */}
                <form
                    className="connect-form"
                    action="mailto:kjayeshro@gmail.com"
                    method="POST"
                    encType="text/plain"
                >
                    <div className="connect-field">
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            required
                            autoComplete="name"
                        />
                    </div>
                    <div className="connect-field">
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            required
                            autoComplete="email"
                        />
                    </div>
                    <div className="connect-field">
                        <textarea
                            name="message"
                            placeholder="Your Message"
                            rows={4}
                            required
                        />
                    </div>
                    <div className="connect-form-actions">
                        <button type="submit" className="connect-submit">
                            Send Message
                        </button>
                        <button
                            type="button"
                            className="connect-copy"
                            onClick={copyEmail}
                        >
                            {copied ? "✓ Copied!" : "Copy Email"}
                        </button>
                    </div>
                </form>
            </section>

            {/* Footer */}
            <footer className="footer connect-footer">
                <div className="connect-footer-row">
                    <span>© {new Date().getFullYear()} Jayesh Rao</span>
                    <span className="connect-footer-dot">·</span>
                    <span>Based in India 🇮🇳</span>
                </div>
                <div className="social-links">
                    <a href="https://github.com/JAY-cloudbuster" target="_blank" rel="noreferrer">
                        GitHub
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                        LinkedIn
                    </a>
                    <a href="mailto:kjayeshro@gmail.com">Email</a>
                </div>
                <button className="connect-backtop" onClick={scrollToTop}>
                    ↑ Back to Top
                </button>
            </footer>
        </>
    );
}
