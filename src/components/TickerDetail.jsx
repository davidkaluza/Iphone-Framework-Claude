import { useState } from "react";
import PriceChart from "./PriceChart.jsx";
import { formatCurrency, formatPercent, formatCompact, formatDate } from "../lib/format.js";
import { seriesForRange, availableRanges } from "../lib/chartSeries.js";

export default function TickerDetail({ entry, onClose }) {
  const [selectedId, setSelectedId] = useState(entry.primaryPurchaseId ?? entry.purchases[0]?.id);
  const [rangeDays, setRangeDays] = useState(null); // null = automatisch (längster verfügbarer Zeitraum)
  const purchase = entry.purchases.find((p) => p.id === selectedId) ?? entry.purchases[0];

  const ranges = availableRanges(purchase?.prices);
  const longestAvailable = [...ranges].reverse().find((r) => r.available) ?? ranges[0];
  const effectiveDays = rangeDays ?? longestAvailable.days;
  const series = seriesForRange(purchase?.prices, effectiveDays);

  function selectPurchase(id) {
    setSelectedId(id);
    setRangeDays(null); // Zeitraum bei Kaufwechsel zurücksetzen
  }

  const missingFields = [];
  if (typeof purchase?.pricePerShare !== "number") missingFields.push("Kaufkurs");
  if (typeof purchase?.gainPct !== "number") missingFields.push("Differenz %");
  if (series.length < 2) missingFields.push("Kursverlauf");

  return (
    <div className="detail-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="detail-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="detail-sheet__handle" />

        <header className="detail-sheet__header">
          <div>
            <h2>{entry.issuer ?? entry.ticker}</h2>
            <span className="detail-sheet__ticker">{entry.ticker}</span>
          </div>
          <button type="button" className="detail-sheet__close" onClick={onClose} aria-label="Schließen">
            ✕
          </button>
        </header>

        {entry.purchases.length > 1 && (
          <div className="detail-sheet__tabs" role="tablist" aria-label="Käufe auswählen">
            {entry.purchases.map((p) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={p.id === selectedId}
                className={`detail-sheet__tab${p.id === selectedId ? " is-active" : ""}`}
                onClick={() => selectPurchase(p.id)}
              >
                {formatDate(p.transactionDate)}
              </button>
            ))}
          </div>
        )}

        {missingFields.length > 0 && (
          <div className="detail-sheet__warning">
            ⚠ Unvollständige Daten für diesen Kauf: {missingFields.join(", ")}
          </div>
        )}

        <PriceChart points={series} />

        <div className="detail-sheet__ranges" role="tablist" aria-label="Zeitraum auswählen">
          {ranges.map((r) => (
            <button
              key={r.key}
              type="button"
              role="tab"
              aria-selected={r.days === effectiveDays}
              disabled={!r.available}
              className={`detail-sheet__range${r.days === effectiveDays ? " is-active" : ""}`}
              onClick={() => setRangeDays(r.days)}
            >
              {r.label}
            </button>
          ))}
        </div>

        <dl className="detail-sheet__facts">
          <div>
            <dt>Kaufkurs</dt>
            <dd>{formatCurrency(purchase?.pricePerShare)}</dd>
          </div>
          <div>
            <dt>Differenz seit Kauf</dt>
            <dd className={purchase?.gainPct >= 0 ? "is-up" : "is-down"}>{formatPercent(purchase?.gainPct)}</dd>
          </div>
          <div>
            <dt>Kaufdatum</dt>
            <dd>{formatDate(purchase?.transactionDate)}</dd>
          </div>
          <div>
            <dt>Insider</dt>
            <dd>{purchase?.insiderName ?? "–"}</dd>
          </div>
          <div>
            <dt>Rolle</dt>
            <dd>{purchase?.insiderRole ?? "–"}</dd>
          </div>
          <div>
            <dt>Anteile</dt>
            <dd>{formatCompact(purchase?.shares)}</dd>
          </div>
          <div>
            <dt>Volumen</dt>
            <dd>{formatCurrency(purchase?.valueUsd)}</dd>
          </div>
          <div>
            <dt>Gehalten von</dt>
            <dd>{purchase?.heldBy ?? "–"}</dd>
          </div>
          <div>
            <dt>Letzte Synchronisierung</dt>
            <dd>{formatDate(purchase?.lastSynced)}</dd>
          </div>
        </dl>

        {purchase?.filingUrls?.length > 0 && (
          <div className="detail-sheet__filings">
            <span>SEC-Filing{purchase.filingUrls.length > 1 ? "s" : ""}</span>
            <ul>
              {purchase.filingUrls.map((url) => (
                <li key={url}>
                  <a href={url} target="_blank" rel="noreferrer">
                    {url.split("/").pop()}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
