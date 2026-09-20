export default function Logo({ size = 96, rounded = true }) {
  return (
    <svg viewBox="0 0 512 512" width={size} height={size} role="img" aria-label="App-Logo">
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6366f1" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx={rounded ? 96 : 0} fill="url(#logo-grad)" />
      <rect x="140" y="286" width="56" height="120" rx="28" fill="#ffffff" />
      <rect x="228" y="216" width="56" height="190" rx="28" fill="#ffffff" />
      <rect x="316" y="146" width="56" height="260" rx="28" fill="#ffffff" />
    </svg>
  );
}
