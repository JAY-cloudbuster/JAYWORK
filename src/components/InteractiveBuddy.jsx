// src/components/InteractiveBuddy.jsx
import React, { useEffect, useState } from "react";
import "../App.css";

function InteractiveBuddy() {
  // ratios 0–1 for viewport position
  const [pos, setPos] = useState({ x: 0.2, y: 0.2 });

  useEffect(() => {
    const handleMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setPos({ x, y });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  // body gentle follow
  const offsetX = (pos.x - 0.5) * 20; // -20px to 20px
  const offsetY = (pos.y - 0.5) * 20;

  // eyes stronger follow inside face
  const eyeOffsetX = (pos.x - 0.5) * 40;
  const eyeOffsetY = (pos.y - 0.5) * 40;

  return (
    <div
      className="buddy-wrapper"
      style={{
        transform: `translate(${offsetX}px, ${offsetY}px)`,
      }}
    >
      {/* speech bubble */}
      <div className="buddy-speech">
        <p>oh?</p>
      </div>

      <div className="buddy-face">
        <div
          className="buddy-eyes"
          style={{
            transform: `translate(${eyeOffsetX}px, ${eyeOffsetY}px)`,
          }}
        >
          <span className="buddy-eye" />
          <span className="buddy-eye" />
        </div>
      </div>
    </div>
  );
}

export default InteractiveBuddy;
