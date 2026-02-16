// src/components/AirCanvasPage.jsx
import React, { useRef, useEffect, useState, useCallback } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { HAND_CONNECTIONS } from "@mediapipe/hands";
import "../App.css";

// Determine which fingers are up from landmarks
function countFingers(landmarks) {
    // Thumb: tip (4) vs IP joint (3) — x-axis comparison for right hand
    const thumbUp = landmarks[4].x < landmarks[3].x;
    // Other fingers: tip vs PIP joint y-axis comparison (y is inverted in screen coords)
    const indexUp = landmarks[8].y < landmarks[6].y;
    const middleUp = landmarks[12].y < landmarks[10].y;
    const ringUp = landmarks[16].y < landmarks[14].y;
    const pinkyUp = landmarks[20].y < landmarks[18].y;

    return { thumbUp, indexUp, middleUp, ringUp, pinkyUp };
}

function getGesture(fingers) {
    const { thumbUp, indexUp, middleUp, ringUp, pinkyUp } = fingers;
    const totalUp = [thumbUp, indexUp, middleUp, ringUp, pinkyUp].filter(Boolean).length;

    // Only index finger up → draw
    if (indexUp && !middleUp && !ringUp && !pinkyUp) return "draw";
    // All fingers up → pause
    if (totalUp >= 4) return "pause";
    // No fingers up → clear
    if (totalUp === 0) return "clear";
    // Default
    return "pause";
}

const COLORS = ["#c8b6ff", "#ff6b6b", "#51cf66", "#ffd43b", "#74c0fc", "#ff922b", "#f06595"];
const BRUSH_SIZES = [3, 6, 10, 16];

function AirCanvasPage({ onBack }) {
    const videoRef = useRef(null);
    const drawCanvasRef = useRef(null);
    const overlayCanvasRef = useRef(null);
    const cameraRef = useRef(null);
    const handsRef = useRef(null);
    const prevPointRef = useRef(null);
    const gestureRef = useRef("pause");
    const clearTimeoutRef = useRef(null);

    const [gesture, setGesture] = useState("pause");
    const [fingerCount, setFingerCount] = useState(0);
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [brushSize, setBrushSize] = useState(BRUSH_SIZES[1]);
    const [stats, setStats] = useState({
        strokes: 0,
        points: 0,
        startTime: Date.now(),
        elapsed: "0:00",
    });
    const [cameraReady, setCameraReady] = useState(false);
    const [cameraError, setCameraError] = useState(false);

    const statsRef = useRef(stats);
    statsRef.current = stats;
    const colorRef = useRef(selectedColor);
    colorRef.current = selectedColor;
    const brushRef = useRef(brushSize);
    brushRef.current = brushSize;

    // Timer
    useEffect(() => {
        const interval = setInterval(() => {
            setStats((prev) => {
                const secs = Math.floor((Date.now() - prev.startTime) / 1000);
                const m = Math.floor(secs / 60);
                const s = String(secs % 60).padStart(2, "0");
                return { ...prev, elapsed: `${m}:${s}` };
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const onResults = useCallback((results) => {
        const overlayCanvas = overlayCanvasRef.current;
        const drawCanvas = drawCanvasRef.current;
        if (!overlayCanvas || !drawCanvas) return;

        const ctx = overlayCanvas.getContext("2d");
        ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

        // Mirror the overlay
        ctx.save();
        ctx.translate(overlayCanvas.width, 0);
        ctx.scale(-1, 1);

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];

            // Draw hand skeleton
            drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
                color: "rgba(200, 182, 255, 0.4)",
                lineWidth: 2,
            });
            drawLandmarks(ctx, landmarks, {
                color: "rgba(200, 182, 255, 0.8)",
                lineWidth: 1,
                radius: 3,
            });

            const fingers = countFingers(landmarks);
            const totalUp = [fingers.thumbUp, fingers.indexUp, fingers.middleUp, fingers.ringUp, fingers.pinkyUp].filter(Boolean).length;
            const currentGesture = getGesture(fingers);

            setFingerCount(totalUp);
            setGesture(currentGesture);
            gestureRef.current = currentGesture;

            if (currentGesture === "draw") {
                // Index fingertip position (mirrored)
                const tipX = (1 - landmarks[8].x) * drawCanvas.width;
                const tipY = landmarks[8].y * drawCanvas.height;

                const dCtx = drawCanvas.getContext("2d");
                dCtx.strokeStyle = colorRef.current;
                dCtx.lineWidth = brushRef.current;
                dCtx.lineCap = "round";
                dCtx.lineJoin = "round";

                if (prevPointRef.current) {
                    dCtx.beginPath();
                    dCtx.moveTo(prevPointRef.current.x, prevPointRef.current.y);
                    dCtx.lineTo(tipX, tipY);
                    dCtx.stroke();
                }

                prevPointRef.current = { x: tipX, y: tipY };

                setStats((prev) => ({
                    ...prev,
                    points: prev.points + 1,
                }));

                // Highlight fingertip
                ctx.beginPath();
                const dotX = landmarks[8].x * overlayCanvas.width;
                const dotY = landmarks[8].y * overlayCanvas.height;
                ctx.arc(dotX, dotY, 8, 0, 2 * Math.PI);
                ctx.fillStyle = colorRef.current;
                ctx.fill();
            } else {
                if (prevPointRef.current) {
                    // End of a stroke
                    setStats((prev) => ({
                        ...prev,
                        strokes: prev.strokes + 1,
                    }));
                }
                prevPointRef.current = null;

                if (currentGesture === "clear") {
                    // Require holding fist for a moment
                    if (!clearTimeoutRef.current) {
                        clearTimeoutRef.current = setTimeout(() => {
                            const dCtx = drawCanvas.getContext("2d");
                            dCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
                            setStats((prev) => ({
                                ...prev,
                                strokes: 0,
                                points: 0,
                            }));
                            clearTimeoutRef.current = null;
                        }, 800);
                    }
                } else {
                    if (clearTimeoutRef.current) {
                        clearTimeout(clearTimeoutRef.current);
                        clearTimeoutRef.current = null;
                    }
                }
            }
        } else {
            prevPointRef.current = null;
            setFingerCount(0);
            setGesture("no hand");
            if (clearTimeoutRef.current) {
                clearTimeout(clearTimeoutRef.current);
                clearTimeoutRef.current = null;
            }
        }

        ctx.restore();
    }, []);

    // Initialize MediaPipe + Camera
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const hands = new Hands({
            locateFile: (file) =>
                `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.5,
        });

        hands.onResults(onResults);
        handsRef.current = hands;

        const camera = new Camera(video, {
            onFrame: async () => {
                await hands.send({ image: video });
            },
            width: 1280,
            height: 720,
        });

        camera
            .start()
            .then(() => {
                setCameraReady(true);
                // Set canvas sizes once video dimensions are known
                const setCanvasSizes = () => {
                    const w = video.videoWidth || 1280;
                    const h = video.videoHeight || 720;
                    if (drawCanvasRef.current) {
                        drawCanvasRef.current.width = w;
                        drawCanvasRef.current.height = h;
                    }
                    if (overlayCanvasRef.current) {
                        overlayCanvasRef.current.width = w;
                        overlayCanvasRef.current.height = h;
                    }
                };
                video.addEventListener("loadedmetadata", setCanvasSizes);
                setCanvasSizes();
            })
            .catch((err) => {
                console.error("Camera error:", err);
                setCameraError(true);
            });

        cameraRef.current = camera;

        return () => {
            camera.stop();
            hands.close();
        };
    }, [onResults]);

    const clearCanvas = () => {
        const dCtx = drawCanvasRef.current?.getContext("2d");
        if (dCtx) {
            dCtx.clearRect(0, 0, drawCanvasRef.current.width, drawCanvasRef.current.height);
            setStats((prev) => ({ ...prev, strokes: 0, points: 0 }));
        }
    };

    const saveImage = () => {
        const canvas = drawCanvasRef.current;
        if (!canvas) return;
        const link = document.createElement("a");
        link.download = "air-canvas-drawing.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    };

    const gestureLabel = {
        draw: "✏️ Drawing",
        pause: "✋ Paused",
        clear: "✊ Clearing…",
        "no hand": "👋 Show your hand",
    };

    return (
        <div className="ac-page">
            {/* Top nav */}
            <header className="ac-page-header">
                <button className="ac-back-btn" onClick={onBack}>
                    ← Back to Portfolio
                </button>
                <h1 className="ac-page-title">Air Canvas</h1>
                <div className="ac-page-spacer" />
            </header>

            <div className="ac-page-body">
                {/* Canvas area */}
                <div className="ac-canvas-wrapper">
                    {cameraError && (
                        <div className="ac-camera-error">
                            <p>📷 Camera access denied or unavailable.</p>
                            <p>Please allow camera permissions and reload.</p>
                        </div>
                    )}

                    {!cameraReady && !cameraError && (
                        <div className="ac-loading">
                            <div className="ac-loading-spinner" />
                            <p>Loading ML model & camera…</p>
                        </div>
                    )}

                    <video
                        ref={videoRef}
                        className="ac-video"
                        autoPlay
                        playsInline
                        muted
                        style={{ opacity: cameraReady ? 1 : 0 }}
                    />
                    <canvas ref={drawCanvasRef} className="ac-draw-layer" />
                    <canvas ref={overlayCanvasRef} className="ac-overlay-layer" />

                    {/* Gesture indicator */}
                    {cameraReady && (
                        <div className={`ac-gesture-badge ac-gesture-${gesture.replace(" ", "-")}`}>
                            {gestureLabel[gesture] || gesture}
                        </div>
                    )}

                    {/* Finger count */}
                    {cameraReady && gesture !== "no hand" && (
                        <div className="ac-finger-count">{fingerCount}</div>
                    )}
                </div>

                {/* Sidebar: tools + stats */}
                <aside className="ac-sidebar">
                    {/* Color picker */}
                    <div className="ac-tool-group">
                        <h3 className="ac-tool-title">Color</h3>
                        <div className="ac-color-grid">
                            {COLORS.map((c) => (
                                <button
                                    key={c}
                                    className={`ac-color-swatch ${selectedColor === c ? "ac-color-active" : ""}`}
                                    style={{ background: c }}
                                    onClick={() => setSelectedColor(c)}
                                    aria-label={`Select color ${c}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Brush size */}
                    <div className="ac-tool-group">
                        <h3 className="ac-tool-title">Brush</h3>
                        <div className="ac-brush-options">
                            {BRUSH_SIZES.map((s) => (
                                <button
                                    key={s}
                                    className={`ac-brush-btn ${brushSize === s ? "ac-brush-active" : ""}`}
                                    onClick={() => setBrushSize(s)}
                                >
                                    <span
                                        className="ac-brush-dot"
                                        style={{ width: s + 4, height: s + 4 }}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="ac-tool-group">
                        <h3 className="ac-tool-title">Actions</h3>
                        <button className="ac-action-btn" onClick={clearCanvas}>
                            🗑️ Clear Canvas
                        </button>
                        <button className="ac-action-btn" onClick={saveImage}>
                            💾 Save Drawing
                        </button>
                    </div>

                    {/* Live stats */}
                    <div className="ac-tool-group ac-stats-group">
                        <h3 className="ac-tool-title">Live Stats</h3>
                        <div className="ac-stat-row">
                            <span className="ac-stat-key">⏱️ Time</span>
                            <span className="ac-stat-val">{stats.elapsed}</span>
                        </div>
                        <div className="ac-stat-row">
                            <span className="ac-stat-key">✏️ Strokes</span>
                            <span className="ac-stat-val">{stats.strokes}</span>
                        </div>
                        <div className="ac-stat-row">
                            <span className="ac-stat-key">📍 Points</span>
                            <span className="ac-stat-val">{stats.points.toLocaleString()}</span>
                        </div>
                        <div className="ac-stat-row">
                            <span className="ac-stat-key">🎨 Color</span>
                            <span
                                className="ac-stat-color-dot"
                                style={{ background: selectedColor }}
                            />
                        </div>
                    </div>

                    {/* Gesture guide */}
                    <div className="ac-tool-group">
                        <h3 className="ac-tool-title">Gestures</h3>
                        <div className="ac-guide-item">☝️ Index → Draw</div>
                        <div className="ac-guide-item">✋ Palm → Pause</div>
                        <div className="ac-guide-item">✊ Fist → Clear</div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default AirCanvasPage;
