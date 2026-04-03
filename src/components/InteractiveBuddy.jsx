// src/components/InteractiveBuddy.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import "./RubiksCube.css";

// Solved face colors
const SOLVED_COLORS = {
  front: "#ef4444",  // Red
  back: "#f97316",   // Orange
  left: "#22c55e",   // Green
  right: "#3b82f6",  // Blue
  top: "#f8fafc",    // White
  bottom: "#eab308", // Yellow
};

// Extra colors used during "shuffling" illusion
const ALL_COLORS = ["#ef4444", "#f97316", "#22c55e", "#3b82f6", "#f8fafc", "#eab308"];

function getRandomColor() {
  return ALL_COLORS[Math.floor(Math.random() * ALL_COLORS.length)];
}

// Generate a shuffled 3x3 face (array of 9 random colors)
function shuffledFace() {
  return Array.from({ length: 9 }, () => getRandomColor());
}

// Generate a solved face (all 9 same color)
function solvedFace(color) {
  return Array(9).fill(color);
}

export default function InteractiveBuddy() {
  const [mode, setMode] = useState("shuffling"); // "shuffling" | "solving" | "solved"
  const [faces, setFaces] = useState({
    front: shuffledFace(),
    back: shuffledFace(),
    left: shuffledFace(),
    right: shuffledFace(),
    top: shuffledFace(),
    bottom: shuffledFace(),
  });
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  // Shuffle: swap random cells every 400ms
  useEffect(() => {
    if (mode === "shuffling") {
      intervalRef.current = setInterval(() => {
        setFaces((prev) => {
          const faceNames = Object.keys(prev);
          const newFaces = { ...prev };
          // Swap 6 random cells across faces each tick
          for (let s = 0; s < 6; s++) {
            const fA = faceNames[Math.floor(Math.random() * 6)];
            const fB = faceNames[Math.floor(Math.random() * 6)];
            const iA = Math.floor(Math.random() * 9);
            const iB = Math.floor(Math.random() * 9);
            const arrA = [...newFaces[fA]];
            const arrB = [...newFaces[fB]];
            const tmp = arrA[iA];
            arrA[iA] = arrB[iB];
            arrB[iB] = tmp;
            newFaces[fA] = arrA;
            newFaces[fB] = arrB;
          }
          return newFaces;
        });
      }, 400);
    }
    return () => clearInterval(intervalRef.current);
  }, [mode]);

  // Handle click: solve → hold 5s → shuffle again
  const handleClick = useCallback(() => {
    if (mode !== "shuffling") return;

    // Clear shuffle interval
    clearInterval(intervalRef.current);

    setMode("solving");

    // Animate to solved over 800ms (the CSS transition handles the visual)
    setFaces({
      front: solvedFace(SOLVED_COLORS.front),
      back: solvedFace(SOLVED_COLORS.back),
      left: solvedFace(SOLVED_COLORS.left),
      right: solvedFace(SOLVED_COLORS.right),
      top: solvedFace(SOLVED_COLORS.top),
      bottom: solvedFace(SOLVED_COLORS.bottom),
    });

    // After a brief solving animation, mark as solved
    setTimeout(() => setMode("solved"), 800);

    // After 5 seconds in solved state, start shuffling again
    timeoutRef.current = setTimeout(() => {
      setFaces({
        front: shuffledFace(),
        back: shuffledFace(),
        left: shuffledFace(),
        right: shuffledFace(),
        top: shuffledFace(),
        bottom: shuffledFace(),
      });
      setMode("shuffling");
    }, 5800); // 800ms solve + 5000ms hold
  }, [mode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const faceNames = ["front", "back", "left", "right", "top", "bottom"];

  return (
    <div className="rubiks-wrapper" onClick={handleClick} title="Click to solve!">
      <div className="my-loader">
        <div className={`rubiks-cube ${mode === "shuffling" ? "cube-shuffling" : ""} ${mode === "solving" ? "cube-solving" : ""} ${mode === "solved" ? "cube-solved" : ""}`}>
          {faceNames.map((face) => (
            <div key={face} className={`face ${face}`}>
              {faces[face].map((color, i) => (
                <div
                  key={i}
                  className="cube"
                  style={{ backgroundColor: color, transition: "background-color 0.5s ease" }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      {mode === "shuffling" && <span className="cube-hint">Click to solve</span>}
    </div>
  );
}
