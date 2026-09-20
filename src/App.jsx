import { useMemo, useState } from "react";
import Header from "./components/Header.jsx";
import BottomNav from "./components/BottomNav.jsx";
import TickerCard from "./components/TickerCard.jsx";
import TickerDetail from "./components/TickerDetail.jsx";
import { useNetworkStatus } from "./hooks/useNetworkStatus.js";
import { usePwaStatus } from "./hooks/usePwaStatus.js";
import { formatDate } from "./lib/format.js";
import tickerData from "./data/tickers.json";

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
  const [query, setQuery] = useState("");
  const [selectedTicker, setSelectedTicker] = useState(null);

  const filteredTickers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tickerData.tickers;
    return tickerData.tickers.filter(
      (t) => t.ticker.toLowerCase().includes(q) || (t.issuer ?? "").toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="app-shell">
      <Header online={online} swActive={swActive} />

      <main className="app-content">
        {needRefresh && (
          <section className="card card--accent">
            <h2>Update verfügbar</h2>
            <p>Eine neue Version der App ist bereit.</p>
            <button className="btn" type="button" onClick={() => updateServiceWorker(true)}>
              Jetzt aktualisieren
            </button>
          </section>
        )}

        {activeTab === "home" && (
          <>
            <input
              className="search-input"
              type="search"
              inputMode="search"
              placeholder="Ticker oder Firma suchen…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            {tickerData.missingTickers.length > 0 && (
              <div className="notice-banner">
                ⚠ Für {tickerData.missingTickers.length} Ticker aus der CSV liegen keine Kursdaten in
                MongoDB vor: {tickerData.missingTickers.join(", ")}
              </div>
            )}

            <div className="ticker-list">
              {filteredTickers.map((entry) => (
                <TickerCard key={entry.ticker} entry={entry} onOpen={setSelectedTicker} />
              ))}
              {filteredTickers.length === 0 && (
                <p className="empty-state">Keine Treffer für „{query}“.</p>
              )}
            </div>
          </>
        )}

        {activeTab === "status" && (
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
                <span>Ticker geladen</span>
                <strong>{tickerData.tickerCount}</strong>
              </li>
              <li>
                <span>Daten-Snapshot vom</span>
                <strong>{formatDate(tickerData.generatedAt)}</strong>
              </li>
            </ul>
          </section>
        )}

        {activeTab === "info" && (
          <section className="card">
            <h2>Über die Daten</h2>
            <p>
              Kursdaten stammen aus der MongoDB-Sammlung{" "}
              <code>{tickerData.source.mongoDb}</code>, abgeglichen mit den Tickern aus{" "}
              <code>{tickerData.source.csv}</code>. Da es sich um ein statisches Snapshot-Export
              handelt (kein Live-Backend auf GitHub Pages), ist der Stand so aktuell wie der letzte
              Export ({formatDate(tickerData.generatedAt)}).
            </p>
            {tickerData.missingTickers.length > 0 ? (
              <p>
                <strong>{tickerData.missingTickers.length} Ticker ohne Treffer:</strong>{" "}
                {tickerData.missingTickers.join(", ")}
              </p>
            ) : (
              <p>Alle CSV-Ticker haben passende Kursdaten gefunden.</p>
            )}
          </section>
        )}

        <div className="content-spacer" />
      </main>

      <BottomNav active={activeTab} onChange={setActiveTab} />

      {selectedTicker && <TickerDetail entry={selectedTicker} onClose={() => setSelectedTicker(null)} />}
    </div>
  );
}
