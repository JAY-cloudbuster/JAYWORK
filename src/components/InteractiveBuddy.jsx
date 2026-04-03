// src/components/InteractiveBuddy.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import "./RubiksCube.css";

/* ═══ Colors ═══ */
const FACE_COLORS = {
  front: "#ef4444",   // Red
  back: "#f97316",    // Orange
  left: "#22c55e",    // Green
  right: "#3b82f6",   // Blue
  top: "#f8fafc",     // White
  bottom: "#eab308",  // Yellow
};
const FACE_KEYS = ["front", "back", "left", "right", "top", "bottom"];

/* ═══ Solved state helper ═══ */
function solvedState() {
  const s = {};
  FACE_KEYS.forEach((f) => (s[f] = Array(9).fill(FACE_COLORS[f])));
  return s;
}

/* ═══ Rotate a 3×3 face array 90° clockwise ═══
   0 1 2      6 3 0
   3 4 5  →   7 4 1
   6 7 8      8 5 2                                */
function rotateCW(a) {
  return [a[6], a[3], a[0], a[7], a[4], a[1], a[8], a[5], a[2]];
}

/* ═══ Move definitions ═══
   Each move rotates one face CW and cycles 4 strips of 3 cells.
   Cycle order: strip₀ ← strip₃ ← strip₂ ← strip₁ ← strip₀     */
const MOVE_DEFS = [
  // U — top row: front → right → back → left
  {
    face: "top",
    cycle: [
      ["front", [0, 1, 2]],
      ["right", [0, 1, 2]],
      ["back",  [0, 1, 2]],
      ["left",  [0, 1, 2]],
    ],
  },
  // D — bottom row: front → left → back → right
  {
    face: "bottom",
    cycle: [
      ["front",  [6, 7, 8]],
      ["left",   [6, 7, 8]],
      ["back",   [6, 7, 8]],
      ["right",  [6, 7, 8]],
    ],
  },
  // R — right column: front → top → back(reversed) → bottom
  {
    face: "right",
    cycle: [
      ["front",  [2, 5, 8]],
      ["top",    [2, 5, 8]],
      ["back",   [6, 3, 0]],
      ["bottom", [2, 5, 8]],
    ],
  },
  // L — left column: front → bottom → back(reversed) → top
  {
    face: "left",
    cycle: [
      ["front",  [0, 3, 6]],
      ["bottom", [0, 3, 6]],
      ["back",   [8, 5, 2]],
      ["top",    [0, 3, 6]],
    ],
  },
  // F — front face: top-bottom → right-left → bottom-top(rev) → left-right(rev)
  {
    face: "front",
    cycle: [
      ["top",    [6, 7, 8]],
      ["right",  [0, 3, 6]],
      ["bottom", [2, 1, 0]],
      ["left",   [8, 5, 2]],
    ],
  },
  // B — back face
  {
    face: "back",
    cycle: [
      ["top",    [2, 1, 0]],
      ["left",   [0, 3, 6]],
      ["bottom", [6, 7, 8]],
      ["right",  [8, 5, 2]],
    ],
  },
];

/* ═══ Apply a single move to the cube state ═══ */
function applyMove(state, def) {
  // Deep-copy
  const n = {};
  FACE_KEYS.forEach((f) => (n[f] = [...state[f]]));

  // 1. Rotate the target face CW
  n[def.face] = rotateCW(state[def.face]);

  // 2. Cycle the 4 three-cell strips (A ← D ← C ← B ← A)
  const c = def.cycle;
  const saved = c[0][1].map((idx) => state[c[0][0]][idx]);

  for (let i = 0; i < 3; i++) n[c[0][0]][c[0][1][i]] = state[c[3][0]][c[3][1][i]];
  for (let i = 0; i < 3; i++) n[c[3][0]][c[3][1][i]] = state[c[2][0]][c[2][1][i]];
  for (let i = 0; i < 3; i++) n[c[2][0]][c[2][1][i]] = state[c[1][0]][c[1][1][i]];
  for (let i = 0; i < 3; i++) n[c[1][0]][c[1][1][i]] = saved[i];

  return n;
}

/* ═══ Pre-shuffle from solved ═══ */
function scramble(n = 20) {
  let s = solvedState();
  for (let i = 0; i < n; i++) {
    s = applyMove(s, MOVE_DEFS[Math.floor(Math.random() * MOVE_DEFS.length)]);
  }
  return s;
}

/* ═══ Component ═══ */
export default function InteractiveBuddy() {
  const [mode, setMode] = useState("shuffling"); // shuffling | solving | solved
  const [faces, setFaces] = useState(() => scramble(20));
  const [kick, setKick] = useState(false); // triggers a brief CSS kick
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  /* ── Shuffling loop: apply a random move every 700ms ── */
  useEffect(() => {
    if (mode !== "shuffling") return;

    intervalRef.current = setInterval(() => {
      const move = MOVE_DEFS[Math.floor(Math.random() * MOVE_DEFS.length)];
      setFaces((prev) => applyMove(prev, move));

      // Trigger a brief kick animation
      setKick(true);
      setTimeout(() => setKick(false), 250);
    }, 700);

    return () => clearInterval(intervalRef.current);
  }, [mode]);

  /* ── Click handler: solve → hold 5 s → shuffle again ── */
  const handleClick = useCallback(() => {
    if (mode !== "shuffling") return;
    clearInterval(intervalRef.current);

    setMode("solving");
    setFaces(solvedState());

    setTimeout(() => setMode("solved"), 800);

    timeoutRef.current = setTimeout(() => {
      setFaces(scramble(20));
      setMode("shuffling");
    }, 5800);
  }, [mode]);

  /* ── Cleanup ── */
  useEffect(() => () => {
    clearInterval(intervalRef.current);
    clearTimeout(timeoutRef.current);
  }, []);

  /* ── Render ── */
  const cubeClass = [
    "rubiks-cube",
    mode === "shuffling" ? "cube-shuffling" : "",
    mode === "solving" ? "cube-solving" : "",
    mode === "solved" ? "cube-solved" : "",
    kick ? "cube-kick" : "",
  ].join(" ");

  return (
    <div className="rubiks-wrapper" onClick={handleClick} title="Click to solve!">
      <div className="my-loader">
        <div className={cubeClass}>
          {FACE_KEYS.map((face) => (
            <div key={face} className={`face ${face}`}>
              {faces[face].map((color, i) => (
                <div key={i} className="rcube-cell" style={{ backgroundColor: color }} />
              ))}
            </div>
          ))}
        </div>
      </div>
      {mode === "shuffling" && <span className="cube-hint">Click to solve</span>}
    </div>
  );
}
