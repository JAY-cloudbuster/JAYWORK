// src/components/GitHubContributions.jsx
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import "../App.css";

const USERNAME = "JAY-cloudbuster";
const API_URL = "https://github-contributions-api.jogruber.de/v4";

// ── Color palettes (classic GitHub greens) ──
const DARK_PALETTE = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];
const LIGHT_PALETTE = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_LABELS = ["Mon", "", "Wed", "", "Fri", "", ""];

function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function formatDisplayDate(dateStr) {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function getIntensityLevel(count, level) {
    // Use the level from the API if available (0-4), otherwise compute
    if (level !== undefined && level !== null) return level;
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 9) return 3;
    return 4;
}

// ── Build weekly grid structure ──
function buildWeekGrid(endDateStr) {
    const end = new Date(endDateStr + "T00:00:00");
    const start = new Date(end);
    start.setFullYear(start.getFullYear() - 1);
    // Align start to Sunday
    start.setDate(start.getDate() - start.getDay());

    const weeks = [];
    let currentWeek = [];
    const d = new Date(start);

    while (d <= end) {
        currentWeek.push(formatDate(d));
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
        d.setDate(d.getDate() + 1);
    }
    if (currentWeek.length > 0) {
        weeks.push(currentWeek);
    }
    return { weeks, startDate: start };
}

// ── Get month labels with positions ──
function getMonthLabels(weeks) {
    const labels = [];
    let lastMonth = -1;
    weeks.forEach((week, i) => {
        const d = new Date(week[0] + "T00:00:00");
        const month = d.getMonth();
        if (month !== lastMonth) {
            labels.push({ month: MONTH_NAMES[month], index: i });
            lastMonth = month;
        }
    });
    return labels;
}

// ── Fetch real contributions from GitHub ──
async function fetchContributions(username) {
    const res = await fetch(`${API_URL}/${username}?y=last`);
    if (!res.ok) throw new Error(`API returned ${res.status}`);
    const json = await res.json();

    // Build a map from the API response
    const map = {};
    let total = 0;
    if (json.contributions && Array.isArray(json.contributions)) {
        json.contributions.forEach(({ date, count, level }) => {
            map[date] = { count, level };
            total += count;
        });
    }
    // Use API total if available
    if (json.total?.lastYear) total = json.total.lastYear;

    return { map, total };
}

function GitHubContributions({
    username = USERNAME,
    onCellClick = null,
}) {
    const [tooltip, setTooltip] = useState(null);
    const [focusedCell, setFocusedCell] = useState(null);
    const [isLight, setIsLight] = useState(
        () => document.documentElement.getAttribute("data-theme") === "light"
    );
    const [contributionMap, setContributionMap] = useState({});
    const [totalContributions, setTotalContributions] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const gridRef = useRef(null);
    const tooltipRef = useRef(null);

    // Listen for theme changes
    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsLight(
                document.documentElement.getAttribute("data-theme") === "light"
            );
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-theme"],
        });
        return () => observer.disconnect();
    }, []);

    // Fetch live contribution data
    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);
            try {
                const { map, total } = await fetchContributions(username);
                if (!cancelled) {
                    setContributionMap(map);
                    setTotalContributions(total);
                }
            } catch (err) {
                console.error("Failed to fetch GitHub contributions:", err);
                if (!cancelled) {
                    setError(err.message);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, [username]);

    // Build the grid
    const today = useMemo(() => formatDate(new Date()), []);
    const { weeks } = useMemo(() => buildWeekGrid(today), [today]);
    const monthLabels = useMemo(() => getMonthLabels(weeks), [weeks]);

    const palette = isLight ? LIGHT_PALETTE : DARK_PALETTE;

    // ── Tooltip handlers ──
    const showTooltip = useCallback(
        (dateStr, count, event) => {
            const cell = event.currentTarget || event.target;
            const gridRect = gridRef.current?.getBoundingClientRect();
            const cellRect = cell.getBoundingClientRect();
            if (!gridRect) return;

            setTooltip({
                date: dateStr,
                count,
                x: cellRect.left - gridRect.left + cellRect.width / 2,
                y: cellRect.top - gridRect.top - 8,
            });
        },
        []
    );

    const hideTooltip = useCallback(() => setTooltip(null), []);

    // ── Click handler ──
    const handleCellClick = useCallback(
        (dateStr, count) => {
            if (onCellClick) {
                onCellClick(dateStr, count);
            } else {
                window.open(
                    `https://github.com/${username}?tab=overview&from=${dateStr}`,
                    "_blank"
                );
            }
        },
        [username, onCellClick]
    );

    // ── Keyboard navigation ──
    const handleKeyDown = useCallback(
        (e) => {
            if (!focusedCell) return;
            const { weekIdx, dayIdx } = focusedCell;
            let nw = weekIdx,
                nd = dayIdx;

            switch (e.key) {
                case "ArrowRight":
                    nw = Math.min(weekIdx + 1, weeks.length - 1);
                    break;
                case "ArrowLeft":
                    nw = Math.max(weekIdx - 1, 0);
                    break;
                case "ArrowDown":
                    nd = Math.min(dayIdx + 1, 6);
                    break;
                case "ArrowUp":
                    nd = Math.max(dayIdx - 1, 0);
                    break;
                case "Enter":
                case " ": {
                    e.preventDefault();
                    const dateStr = weeks[weekIdx]?.[dayIdx];
                    if (dateStr) {
                        const entry = contributionMap[dateStr];
                        handleCellClick(dateStr, entry?.count || 0);
                    }
                    return;
                }
                default:
                    return;
            }
            e.preventDefault();
            setFocusedCell({ weekIdx: nw, dayIdx: nd });

            const cellEl = gridRef.current?.querySelector(
                `[data-week="${nw}"][data-day="${nd}"]`
            );
            if (cellEl) cellEl.focus();
        },
        [focusedCell, weeks, contributionMap, handleCellClick]
    );

    const CELL_SIZE = 13;
    const CELL_GAP = 3;
    const CELL_STEP = CELL_SIZE + CELL_GAP;
    const DAY_LABEL_WIDTH = 36;

    return (
        <div className="bento-item bento-span-4x1 contrib-graph-card">
            <div className="contrib-graph-wrapper" ref={gridRef}>
                {/* Title */}
                <h3 className="contrib-graph-title">GITHUB CONTRIBUTIONS</h3>

                {loading && (
                    <div className="contrib-loading">Loading contributions…</div>
                )}

                {error && (
                    <div className="contrib-error">
                        Could not load contributions. <button onClick={() => window.location.reload()}>Retry</button>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        {/* Month labels */}
                        <div
                            className="contrib-months"
                            style={{ paddingLeft: `${DAY_LABEL_WIDTH}px` }}
                        >
                            {monthLabels.map((m, i) => (
                                <span
                                    key={i}
                                    className="contrib-month-label"
                                    style={{ left: `${DAY_LABEL_WIDTH + m.index * CELL_STEP}px` }}
                                >
                                    {m.month}
                                </span>
                            ))}
                        </div>

                        {/* Grid area with day labels */}
                        <div className="contrib-grid-area">
                            {/* Day labels */}
                            <div
                                className="contrib-days"
                                style={{ width: `${DAY_LABEL_WIDTH}px` }}
                            >
                                {DAY_LABELS.map((label, i) => (
                                    <span
                                        key={i}
                                        className="contrib-day-label"
                                        style={{ height: `${CELL_SIZE}px`, marginBottom: `${CELL_GAP}px` }}
                                    >
                                        {label}
                                    </span>
                                ))}
                            </div>

                            {/* The grid */}
                            <div
                                className="contrib-grid"
                                role="grid"
                                aria-label="Contribution graph"
                                onKeyDown={handleKeyDown}
                            >
                                {weeks.map((week, wi) => (
                                    <div key={wi} className="contrib-week" role="row">
                                        {week.map((dateStr, di) => {
                                            const entry = contributionMap[dateStr];
                                            const count = entry?.count ?? 0;
                                            const level = getIntensityLevel(count, entry?.level);
                                            const color = palette[level];
                                            const isFocused =
                                                focusedCell?.weekIdx === wi && focusedCell?.dayIdx === di;

                                            return (
                                                <div
                                                    key={dateStr}
                                                    className={`contrib-cell${isFocused ? " contrib-cell-focused" : ""}`}
                                                    role="gridcell"
                                                    tabIndex={isFocused ? 0 : -1}
                                                    data-week={wi}
                                                    data-day={di}
                                                    data-level={level}
                                                    aria-label={`${count} contribution${count !== 1 ? "s" : ""} on ${formatDisplayDate(dateStr)}`}
                                                    style={{
                                                        backgroundColor: color,
                                                        width: `${CELL_SIZE}px`,
                                                        height: `${CELL_SIZE}px`,
                                                    }}
                                                    onMouseEnter={(e) => showTooltip(dateStr, count, e)}
                                                    onMouseLeave={hideTooltip}
                                                    onFocus={(e) => {
                                                        setFocusedCell({ weekIdx: wi, dayIdx: di });
                                                        showTooltip(dateStr, count, e);
                                                    }}
                                                    onBlur={hideTooltip}
                                                    onClick={() => handleCellClick(dateStr, count)}
                                                />
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tooltip */}
                        {tooltip && (
                            <div
                                ref={tooltipRef}
                                className="contrib-tooltip"
                                style={{
                                    left: `${tooltip.x}px`,
                                    top: `${tooltip.y}px`,
                                }}
                            >
                                <strong>
                                    {tooltip.count === 0
                                        ? "No contributions"
                                        : `${tooltip.count} contribution${tooltip.count !== 1 ? "s" : ""}`}
                                </strong>
                                <span>{formatDisplayDate(tooltip.date)}</span>
                            </div>
                        )}

                        {/* Footer: total + legend */}
                        <div className="contrib-footer">
                            <span className="contrib-total">
                                {totalContributions.toLocaleString()} contributions in the last year
                            </span>
                            <div className="contrib-legend">
                                <span className="contrib-legend-label">Less</span>
                                {palette.map((color, i) => (
                                    <div
                                        key={i}
                                        className="contrib-legend-cell"
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                                <span className="contrib-legend-label">More</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default GitHubContributions;
