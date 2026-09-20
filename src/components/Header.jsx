export default function Header({ online, swActive }) {
  const dotClass = [
    "status-dot",
    online ? "is-online" : "is-offline",
    swActive ? "is-sw-active" : ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className="app-header">
      <div className="app-header__brand">
        <img src={`${import.meta.env.BASE_URL}icons/icon-192.png`} alt="Logo" className="app-header__logo" />
        <span className="app-header__title">Insider Tickers</span>
      </div>
      <div className="status-indicator" aria-live="polite">
        <span className={dotClass}></span>
        <span className="status-text">{online ? "Online" : "Offline"}</span>
      </div>
    </header>
  );
}
