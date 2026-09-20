import { useState } from "react";
import Header from "./components/Header.jsx";
import BottomNav from "./components/BottomNav.jsx";
import Logo from "./components/Logo.jsx";
import { useNetworkStatus } from "./hooks/useNetworkStatus.js";
import { usePwaStatus } from "./hooks/usePwaStatus.js";

function useDisplayMode() {
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true; // iOS Safari
  return isStandalone ? "Installiert (Standalone)" : "Browser-Tab";
}

export default function App() {
  const online = useNetworkStatus();
  const { swActive, needRefresh, updateServiceWorker } = usePwaStatus();
  const displayMode = useDisplayMode();
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="app-shell">
      <Header online={online} swActive={swActive} />

      <main className="app-content">
        <section className="card">
          <h1>Willkommen 👋</h1>
          <p>
            Dies ist ein minimalistisches PWA-Grundgerüst — React (Vite) +
            vite-plugin-pwa, offline-fähig via Service Worker und optimiert
            für die Installation auf dem iOS/iPadOS Home Screen.
          </p>
        </section>

        {needRefresh && (
          <section className="card card--accent">
            <h2>Update verfügbar</h2>
            <p>Eine neue Version der App ist bereit.</p>
            <button className="btn" type="button" onClick={() => updateServiceWorker(true)}>
              Jetzt aktualisieren
            </button>
          </section>
        )}

        <section className="card">
          <h2>Status</h2>
          <ul className="status-list">
            <li>
              <span>Netzwerk</span>
              <strong>{online ? "Online" : "Offline"}</strong>
            </li>
            <li>
              <span>Service Worker</span>
              <strong>{swActive ? "Aktiv" : "Nicht aktiv"}</strong>
            </li>
            <li>
              <span>Display-Modus</span>
              <strong>{displayMode}</strong>
            </li>
            <li>
              <span>Aktiver Tab</span>
              <strong>{activeTab}</strong>
            </li>
          </ul>
        </section>

        <section className="card">
          <h2>App-Icon (SVG)</h2>
          <p>Das App-Logo wird als React-Komponente aus Vektordaten gerendert.</p>
          <div className="logo-preview" aria-hidden="true">
            <Logo />
          </div>
        </section>

        <div className="content-spacer" />
      </main>

      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  );
}
