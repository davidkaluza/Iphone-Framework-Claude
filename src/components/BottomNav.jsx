const ITEMS = [
  { key: "home", icon: "🏠", label: "Start" },
  { key: "settings", icon: "⚙️", label: "Einstellungen" },
  { key: "info", icon: "ℹ️", label: "Info" }
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="bottom-nav">
      {ITEMS.map((item) => (
        <button
          key={item.key}
          type="button"
          className={`bottom-nav__item${active === item.key ? " is-active" : ""}`}
          onClick={() => onChange(item.key)}
        >
          <span className="bottom-nav__icon">{item.icon}</span>
          <span className="bottom-nav__label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
