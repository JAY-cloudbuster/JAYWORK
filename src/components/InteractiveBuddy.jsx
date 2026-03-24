// src/components/InteractiveBuddy.jsx
// Pixel Art Lion Pet — follows cursor, reacts to scroll, section-aware speech
import React, { useEffect, useState, useRef, useCallback } from "react";
import "../App.css";

const SECTION_MESSAGES = {
  hero: ["Roar! Welcome! 🦁", "Hey explorer!", "Let's go! 💪"],
  about: ["Interesting... 🤔", "Tell me more!", "Cool story! 📖"],
  work: ["Great projects! ✨", "So creative!", "I'm impressed! 🎯"],
  skills: ["So many skills!", "Talented! 🌟", "Level up! ⬆️"],
  contact: ["Say hi! 📧", "Let's connect!", "Don't be shy! 💌"],
  aircanvas: ["AI is cool! 🤖", "Draw something!", "Magic! ✨"],
  default: ["Scroll around!", "Explore! 🔍", "*purrs*"],
};

const IDLE_EMOTES = ["😺", "💤", "✨", "🦁", "💭"];

// ── Pixel Lion drawing on canvas ──
function drawLion(ctx, w, h, eyeOffsetX, eyeOffsetY, state, frame) {
  ctx.clearRect(0, 0, w, h);
  ctx.imageSmoothingEnabled = false;

  const cx = w / 2;
  const cy = h / 2;
  const scale = Math.min(w, h) / 64;

  // Breathing animation
  const breathe = Math.sin(frame * 0.06) * 1.5;
  const tailWag = Math.sin(frame * 0.12) * 8;

  ctx.save();
  ctx.translate(cx, cy + breathe);
  ctx.scale(scale, scale);

  // ── Tail ──
  ctx.save();
  ctx.translate(18, 4);
  ctx.rotate((tailWag * Math.PI) / 180);
  ctx.fillStyle = "#D4891C";
  ctx.fillRect(0, -1, 8, 3);
  ctx.fillRect(8, -2, 3, 2);
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(10, -3, 4, 4);
  ctx.restore();

  // ── Body ──
  ctx.fillStyle = "#E8A430";
  ctx.beginPath();
  roundRect(ctx, -14, -2, 28, 18, 6);
  ctx.fill();

  // Belly
  ctx.fillStyle = "#F5D48B";
  ctx.beginPath();
  roundRect(ctx, -8, 4, 16, 10, 4);
  ctx.fill();

  // ── Legs ──
  ctx.fillStyle = "#D4891C";
  // Front legs
  ctx.fillRect(-12, 13, 5, 8);
  ctx.fillRect(7, 13, 5, 8);
  // Back legs (slight offset)
  ctx.fillRect(-10, 14, 4, 7);
  ctx.fillRect(6, 14, 4, 7);

  // Paws
  ctx.fillStyle = "#F5D48B";
  ctx.fillRect(-12, 19, 5, 3);
  ctx.fillRect(7, 19, 5, 3);

  // ── Mane ──
  ctx.fillStyle = "#C06B18";
  ctx.beginPath();
  ctx.arc(0, -6, 18, Math.PI * 0.8, Math.PI * 2.2);
  ctx.fill();

  ctx.fillStyle = "#D4891C";
  ctx.beginPath();
  ctx.arc(0, -4, 15, Math.PI * 0.85, Math.PI * 2.15);
  ctx.fill();

  // ── Head ──
  ctx.fillStyle = "#E8A430";
  ctx.beginPath();
  roundRect(ctx, -12, -18, 24, 20, 8);
  ctx.fill();

  // ── Ears ──
  ctx.fillStyle = "#D4891C";
  ctx.beginPath();
  ctx.arc(-10, -17, 5, 0, Math.PI * 2);
  ctx.arc(10, -17, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#F5B7C8";
  ctx.beginPath();
  ctx.arc(-10, -17, 3, 0, Math.PI * 2);
  ctx.arc(10, -17, 3, 0, Math.PI * 2);
  ctx.fill();

  // ── Eyes ──
  const maxEyeMove = 2.5;
  const ex = Math.max(-maxEyeMove, Math.min(maxEyeMove, eyeOffsetX * 4));
  const ey = Math.max(-maxEyeMove, Math.min(maxEyeMove, eyeOffsetY * 4));

  if (state === "blink" || (frame % 180 > 170 && frame % 180 < 178)) {
    // Blinking — closed eyes
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(-8, -9, 5, 2);
    ctx.fillRect(3, -9, 5, 2);
  } else if (state === "dizzy") {
    // Dizzy spiral eyes
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(-5.5 + ex, -9 + ey, 3, 0, Math.PI * 3);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(5.5 + ex, -9 + ey, 3, 0, Math.PI * 3);
    ctx.stroke();
  } else if (state === "happy") {
    // Happy ^ ^ eyes
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.moveTo(-8, -8);
    ctx.lineTo(-5.5, -11);
    ctx.lineTo(-3, -8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(3, -8);
    ctx.lineTo(5.5, -11);
    ctx.lineTo(8, -8);
    ctx.stroke();
  } else if (state === "sleep") {
    // Sleeping — closed eyes with Zz
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(-8, -9, 5, 2);
    ctx.fillRect(3, -9, 5, 2);
  } else {
    // Normal eyes
    // Whites
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(-5.5, -9, 4, 0, Math.PI * 2);
    ctx.arc(5.5, -9, 4, 0, Math.PI * 2);
    ctx.fill();

    // Pupils
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.arc(-5.5 + ex, -9 + ey, 2, 0, Math.PI * 2);
    ctx.arc(5.5 + ex, -9 + ey, 2, 0, Math.PI * 2);
    ctx.fill();

    // Highlights
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(-5 + ex * 0.5, -10 + ey * 0.5, 0.8, 0, Math.PI * 2);
    ctx.arc(6 + ex * 0.5, -10 + ey * 0.5, 0.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── Nose ──
  ctx.fillStyle = "#C06B18";
  ctx.beginPath();
  ctx.moveTo(-2, -4);
  ctx.lineTo(2, -4);
  ctx.lineTo(0, -2);
  ctx.closePath();
  ctx.fill();

  // ── Mouth ──
  ctx.strokeStyle = "#8B5E14";
  ctx.lineWidth = 0.8;
  if (state === "happy" || state === "petted") {
    // Smile
    ctx.beginPath();
    ctx.arc(0, -2, 4, 0.1, Math.PI - 0.1);
    ctx.stroke();
  } else {
    // Neutral W mouth
    ctx.beginPath();
    ctx.moveTo(-3, -1);
    ctx.lineTo(-1, 1);
    ctx.lineTo(0, -0.5);
    ctx.lineTo(1, 1);
    ctx.lineTo(3, -1);
    ctx.stroke();
  }

  // ── Whiskers ──
  ctx.strokeStyle = "#8B5E14";
  ctx.lineWidth = 0.5;
  // Left
  ctx.beginPath();
  ctx.moveTo(-12, -5);
  ctx.lineTo(-6, -3);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-13, -3);
  ctx.lineTo(-6, -2);
  ctx.stroke();
  // Right
  ctx.beginPath();
  ctx.moveTo(12, -5);
  ctx.lineTo(6, -3);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(13, -3);
  ctx.lineTo(6, -2);
  ctx.stroke();

  // ── Hearts when petted ──
  if (state === "petted" || state === "happy") {
    const heartBounce = Math.sin(frame * 0.15) * 3;
    ctx.fillStyle = "rgba(255, 100, 120, 0.8)";
    ctx.font = `${4}px serif`;
    ctx.fillText("♥", -16, -20 + heartBounce);
    ctx.fillText("♥", 12, -22 - heartBounce);
    if (state === "petted") {
      ctx.fillText("♥", 0, -25 + heartBounce * 0.5);
    }
  }

  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function InteractiveBuddy() {
  const canvasRef = useRef(null);
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  const [currentSection, setCurrentSection] = useState("hero");
  const [lionState, setLionState] = useState("idle"); // idle, dizzy, happy, sleep, petted, blink
  const [message, setMessage] = useState("");
  const [showEmote, setShowEmote] = useState(null);
  const [petCount, setPetCount] = useState(0);
  const frameRef = useRef(0);
  const scrollSpeedRef = useRef(0);
  const lastScrollRef = useRef(0);
  const idleTimerRef = useRef(null);
  const animFrameRef = useRef(null);

  // ── Pick a random message for current section ──
  const pickMessage = useCallback((section) => {
    const msgs = SECTION_MESSAGES[section] || SECTION_MESSAGES.default;
    return msgs[Math.floor(Math.random() * msgs.length)];
  }, []);

  // ── Mouse tracking ──
  useEffect(() => {
    const handleMove = (e) => {
      setPos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  // ── Section detection ──
  useEffect(() => {
    const sectionIds = ["hero", "about", "work", "skills", "contact", "aircanvas"];
    const observers = [];

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            setCurrentSection(id);
            setMessage(pickMessage(id));
          }
        },
        { threshold: [0.3, 0.5, 0.7] }
      );

      observer.observe(element);
      observers.push(observer);
    });

    setMessage(pickMessage("hero"));
    return () => observers.forEach((obs) => obs.disconnect());
  }, [pickMessage]);

  // ── Scroll speed detection ──
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const speed = Math.abs(window.scrollY - lastScrollRef.current);
          scrollSpeedRef.current = speed;
          lastScrollRef.current = window.scrollY;

          if (speed > 80) {
            setLionState("dizzy");
            setMessage("Whoa, slow down! 😵‍💫");
          } else if (lionState === "dizzy" && speed < 10) {
            setLionState("idle");
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lionState]);

  // ── Idle timer — lion falls asleep after 15s of no interaction ──
  useEffect(() => {
    const resetIdle = () => {
      if (lionState === "sleep") {
        setLionState("idle");
        setMessage("I'm awake! 😸");
      }
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        setLionState("sleep");
        setMessage("Zzz... 💤");
      }, 15000);
    };

    window.addEventListener("mousemove", resetIdle);
    window.addEventListener("scroll", resetIdle);
    resetIdle();

    return () => {
      window.removeEventListener("mousemove", resetIdle);
      window.removeEventListener("scroll", resetIdle);
      clearTimeout(idleTimerRef.current);
    };
  }, [lionState]);

  // ── Canvas animation loop ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    // Set canvas size (retina friendly)
    const displayW = 100;
    const displayH = 90;
    canvas.width = displayW * dpr;
    canvas.height = displayH * dpr;
    canvas.style.width = `${displayW}px`;
    canvas.style.height = `${displayH}px`;
    ctx.scale(dpr, dpr);

    const animate = () => {
      frameRef.current++;
      const eyeOffsetX = (pos.x - 0.5) * 2;
      const eyeOffsetY = (pos.y - 0.5) * 2;

      drawLion(ctx, displayW, displayH, eyeOffsetX, eyeOffsetY, lionState, frameRef.current);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [pos, lionState]);

  // ── Pet the lion! ──
  const handlePet = useCallback(() => {
    setPetCount((prev) => prev + 1);
    setLionState("petted");
    
    const petMessages = [
      "*purrs loudly* 😻",
      "More pets! 🥰",
      "Best day ever! 💖",
      "I love you! 🦁❤️",
      "*happy roar* 🦁",
    ];
    setMessage(petMessages[Math.floor(Math.random() * petMessages.length)]);

    // Random emote
    setShowEmote(IDLE_EMOTES[Math.floor(Math.random() * IDLE_EMOTES.length)]);
    setTimeout(() => setShowEmote(null), 1500);

    // Return to idle after 3s
    setTimeout(() => {
      setLionState("idle");
      setMessage(pickMessage(currentSection));
    }, 3000);
  }, [currentSection, pickMessage]);

  // Body gentle follow
  const offsetX = (pos.x - 0.5) * 15;
  const offsetY = (pos.y - 0.5) * 15;

  return (
    <div
      className="buddy-wrapper"
      style={{
        transform: `translate(${offsetX}px, ${offsetY}px)`,
      }}
    >
      {/* Speech bubble */}
      <div className="buddy-speech">
        <p>{message}</p>
      </div>

      {/* Floating emote */}
      {showEmote && (
        <div className="buddy-emote">{showEmote}</div>
      )}

      {/* Canvas lion */}
      <canvas
        ref={canvasRef}
        className="buddy-canvas"
        onClick={handlePet}
        title={`Pet the lion! (${petCount} pets)`}
        style={{ cursor: "pointer" }}
      />

      {/* Pet counter badge */}
      {petCount > 0 && (
        <div className="buddy-pet-count">
          ♥ {petCount}
        </div>
      )}
    </div>
  );
}

export default InteractiveBuddy;
