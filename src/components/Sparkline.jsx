import { buildLinePath } from "../lib/svgPath.js";

export default function Sparkline({ points, width = 88, height = 34 }) {
  if (!points || points.length < 2) {
    return <div className="sparkline sparkline--empty">n/v</div>;
  }

  const values = points.map((p) => p.value);
  const trendUp = values[values.length - 1] >= values[0];
  const { linePath, areaPath } = buildLinePath(values, width, height);
  const gradientId = `spark-grad-${trendUp ? "up" : "down"}`;

  return (
    <svg
      className={`sparkline ${trendUp ? "is-up" : "is-down"}`}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Kursverlauf, 30 Tage"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
      <path d={linePath} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
