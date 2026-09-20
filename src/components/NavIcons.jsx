const common = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};

export function HomeIcon(props) {
  return (
    <svg {...common} {...props}>
      <path d="M3.5 11.5 12 4l8.5 7.5" />
      <path d="M5.5 10v9.25a.75.75 0 0 0 .75.75H9.5v-6h5v6h3.25a.75.75 0 0 0 .75-.75V10" />
    </svg>
  );
}

export function ActivityIcon(props) {
  return (
    <svg {...common} {...props}>
      <path d="M4 18v-3.5" />
      <path d="M9.5 18V9" />
      <path d="M15 18v-6.5" />
      <path d="M20 18V5.5" />
    </svg>
  );
}

export function InfoIcon(props) {
  return (
    <svg {...common} {...props}>
      <circle cx="12" cy="12" r="8.25" />
      <line x1="12" y1="11" x2="12" y2="16" />
      <circle cx="12" cy="7.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
