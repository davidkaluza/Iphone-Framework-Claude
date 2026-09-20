import Sparkline from "./Sparkline.jsx";
import { formatCurrency, formatPercent } from "../lib/format.js";
import { buildSeries, SHORT_HORIZON } from "../lib/chartSeries.js";

export default function TickerCard({ entry, onOpen }) {
  const primary = entry.purchases[0];
  const series = buildSeries(primary?.prices, SHORT_HORIZON);

  const hasPrice = typeof primary?.pricePerShare === "number";
  const hasGain = typeof primary?.gainPct === "number";
  const incomplete = !hasPrice || !hasGain || series.length < 2;
  const gainDirection = hasGain ? (primary.gainPct >= 0 ? "is-up" : "is-down") : "";

  return (
    <button type="button" className="ticker-card" onClick={() => onOpen(entry)}>
      <div className="ticker-card__row">
        <span className="ticker-card__issuer" title={entry.issuer ?? entry.ticker}>
          {entry.issuer ?? entry.ticker}
        </span>
        <span className="ticker-card__price">{formatCurrency(primary?.pricePerShare)}</span>
        <span className="ticker-card__chart">
          <Sparkline points={series} />
        </span>
      </div>

      <div className="ticker-card__row ticker-card__row--secondary">
        <span className="ticker-card__ticker">{entry.ticker}</span>
        {incomplete && (
          <span className="ticker-card__notice" title="Für diesen Ticker fehlen einzelne Kursdaten">
            ⚠ unvollständig
          </span>
        )}
        <span className={`ticker-card__gain ${gainDirection}`}>{formatPercent(primary?.gainPct)}</span>
      </div>
    </button>
  );
}
