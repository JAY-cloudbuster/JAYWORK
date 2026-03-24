// src/components/InteractiveBuddy.jsx
import React, { useEffect, useRef, useState } from "react";
import "../App.css";

// Shapes map section to emoji/character
const SHAPES = {
  hero: "👻",
  about: "👤",
  work: "</>",
  skills: "🧠",
  contact: "✉️",
  aircanvas: "✨",
  default: "👻"
};

const NUM_PARTICLES = 1200;
const CANVAS_SIZE = 240;

function getShapePoints(text, width = CANVAS_SIZE, height = CANVAS_SIZE) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  
  ctx.clearRect(0, 0, width, height);
  // Dynamic font size
  const fontSize = text.length > 2 ? 65 : 110;
  // Use a system emoji font to ensure it renders emojis cleanly, fallback to sans-serif
  ctx.font = `bold ${fontSize}px "Segoe UI Emoji", "Apple Color Emoji", "Inter", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(text, width / 2, height / 2);
  
  const imageData = ctx.getImageData(0, 0, width, height).data;
  const points = [];
  
  // Sample every 2 pixels for higher precision and detail
  const step = 2;
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const alpha = imageData[(y * width + x) * 4 + 3];
      // Keep points with some opacity
      if (alpha > 30) {
        points.push({ x: x - width / 2, y: y - height / 2 });
      }
    }
  }
  
  // Shuffle points to make the morph mapping look organic and chaotic
  for (let i = points.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [points[i], points[j]] = [points[j], points[i]];
  }
  
  return points.length > 0 ? points : [{ x: 0, y: 0 }];
}

function InteractiveBuddy() {
  const canvasRef = useRef(null);
  const sectionRef = useRef("hero");
  const canvasRectRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const pointsCacheRef = useRef({});
  const particlesRef = useRef([]);

  // Generate points cache and init particles
  useEffect(() => {
    Object.keys(SHAPES).forEach((key) => {
      pointsCacheRef.current[key] = getShapePoints(SHAPES[key]);
    });

    const pts = [];
    for (let i = 0; i < NUM_PARTICLES; i++) {
      pts.push({
        x: Math.random() * CANVAS_SIZE,
        y: Math.random() * CANVAS_SIZE,
        tx: 0, ty: 0,
        vx: 0, vy: 0,
        size: Math.random() * 1.0 + 0.6,
        offset: Math.random() * 100
      });
    }
    particlesRef.current = pts;
    
    // Initial rect
    if (canvasRef.current) {
      canvasRectRef.current = canvasRef.current.getBoundingClientRect();
    }
  }, []);

  // Update rect on scroll/resize (throttled/passive)
  useEffect(() => {
    const updateRect = () => {
      if (canvasRef.current) {
        canvasRectRef.current = canvasRef.current.getBoundingClientRect();
      }
    };
    window.addEventListener("scroll", updateRect, { passive: true });
    window.addEventListener("resize", updateRect);
    setTimeout(updateRect, 500); // ensure layout
    return () => {
      window.removeEventListener("scroll", updateRect);
      window.removeEventListener("resize", updateRect);
    };
  }, []);

  // Mouse tracking globally so we know exactly when to scatter
  useEffect(() => {
    const handleMove = (e) => {
      if (!canvasRectRef.current) return;
      const rect = canvasRectRef.current;
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };
    const handleLeave = () => {
       mouseRef.current = { x: -1000, y: -1000 };
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseout", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseout", handleLeave);
    };
  }, []);

  // Section observer maps sections to shapes
  useEffect(() => {
    const sectionIds = ["hero", "about", "work", "skills", "contact", "aircanvas"];
    const observers = [];

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            sectionRef.current = id;
          }
        },
        { threshold: [0.3, 0.5, 0.7] }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  // Core Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    const dpr = window.devicePixelRatio || 1;

    canvas.width = CANVAS_SIZE * dpr;
    canvas.height = CANVAS_SIZE * dpr;
    ctx.scale(dpr, dpr);

    let animationFrameId;
    let time = 0;

    const render = () => {
      time += 0.05;
      
      // Clear with fading trail to make particles glow slightly
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Read accent color dynamically so it responds to theme changes instantly
      const style = getComputedStyle(document.documentElement);
      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      const baseColor = style.getPropertyValue("--accent").trim() || (isLight ? "#40c463" : "#39d353");

      const section = sectionRef.current;
      const targetPoints = pointsCacheRef.current[section] || pointsCacheRef.current["default"];
      const pCount = Math.max(targetPoints.length, 1);
      
      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      
      const cx = CANVAS_SIZE / 2;
      const cy = CANVAS_SIZE / 2;

      ctx.fillStyle = baseColor;
      
      particlesRef.current.forEach((p, i) => {
        // Find mapped point
        const pt = targetPoints[i % pCount];
        
        // Organic breathing/floating offset
        const floatX = Math.sin(time + p.offset * 0.1) * 3;
        const floatY = Math.cos(time + p.offset * 0.1) * 3;
        
        let tx = cx + pt.x + floatX;
        let ty = cy + pt.y + floatY;
        
        // Mouse repulsion logic
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = 80;
        
        if (dist < repelRadius && dist > 0.1) {
          const force = (repelRadius - dist) / repelRadius;
          const angle = Math.atan2(dy, dx);
          // Push outward strongly
          tx -= Math.cos(angle) * force * 150;
          ty -= Math.sin(angle) * force * 150;
          
          // Add chaotic vibration
          tx += (Math.random() - 0.5) * force * 150;
          ty += (Math.random() - 0.5) * force * 150;
        }
        
        // Spring physics pulling to target
        p.vx += (tx - p.x) * 0.06; // Spring stiffness
        p.vy += (ty - p.y) * 0.06;
        
        // Friction/damping (less = bouncy, more = smooth)
        p.vx *= 0.82;
        p.vy *= 0.82;
        
        p.x += p.vx;
        p.y += p.vy;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="constellation-wrapper">
      <canvas ref={canvasRef} className="constellation-canvas" />
    </div>
  );
}

export default InteractiveBuddy;
