import { HomeIcon, ActivityIcon, InfoIcon } from "./NavIcons.jsx";

const ITEMS = [
  { key: "home", Icon: HomeIcon, label: "Start" },
  { key: "status", Icon: ActivityIcon, label: "Status" },
  { key: "info", Icon: InfoIcon, label: "Info" }
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="bottom-nav">
      {ITEMS.map(({ key, Icon, label }) => (
        <button
          key={key}
          type="button"
          className={`bottom-nav__item${active === key ? " is-active" : ""}`}
          onClick={() => onChange(key)}
        >
          <Icon className="bottom-nav__icon" />
          <span className="bottom-nav__label">{label}</span>
        </button>
      ))}
    </nav>
  );
}
