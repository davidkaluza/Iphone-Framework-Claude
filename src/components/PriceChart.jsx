import { useState } from "react";
import { buildLinePath } from "../lib/svgPath.js";
import { formatCurrency } from "../lib/format.js";

export default function PriceChart({ points, width = 320, height = 160 }) {
  const [activeIndex, setActiveIndex] = useState(null);

  if (!points || points.length < 2) {
    return <div className="price-chart price-chart--empty">Keine Kursdaten verfügbar.</div>;
  }

  const values = points.map((p) => p.value);
  const trendUp = values[values.length - 1] >= values[0];
  const padding = 24;
  const { linePath, areaPath, coords, min, max } = buildLinePath(values, width, height, padding);
  const gradientId = `price-grad-${trendUp ? "up" : "down"}`;
  const active = activeIndex !== null ? points[activeIndex] : points[points.length - 1];
  const activeCoord = activeIndex !== null ? coords[activeIndex] : coords[coords.length - 1];

  return (
    <div className={`price-chart ${trendUp ? "is-up" : "is-down"}`}>
      <div className="price-chart__readout">
        <span className="price-chart__readout-value">{formatCurrency(active.value)}</span>
        <span className="price-chart__readout-label">{active.label}</span>
      </div>

      <svg
        width="100%"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Kursverlauf"
        onMouseLeave={() => setActiveIndex(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>

        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} className="price-chart__axis" />

        <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
        <path d={linePath} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {coords.map((c, i) => (
          <circle
            key={points[i].key}
            cx={c.x}
            cy={c.y}
            r={i === activeIndex ? 5 : 3}
            className="price-chart__dot"
            onMouseEnter={() => setActiveIndex(i)}
            onClick={() => setActiveIndex(i)}
          />
        ))}

        {activeCoord && (
          <line
            x1={activeCoord.x}
            y1={padding}
            x2={activeCoord.x}
            y2={height - padding}
            className="price-chart__crosshair"
          />
        )}
      </svg>

      <div className="price-chart__axis-labels">
        {points.map((p, i) => (
          <button
            key={p.key}
            type="button"
            className={`price-chart__axis-tick${i === activeIndex ? " is-active" : ""}`}
            onClick={() => setActiveIndex(i)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="price-chart__range">
        <span>Tief {formatCurrency(min)}</span>
        <span>Hoch {formatCurrency(max)}</span>
      </div>
    </div>
  );
}
