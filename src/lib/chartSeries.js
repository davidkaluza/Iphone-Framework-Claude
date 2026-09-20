// Checkpoints, wie sie in prices.* aus MongoDB vorliegen (kein täglicher
// Kursverlauf, sondern feste Zeitpunkte relativ zum Kaufdatum).

export const SHORT_HORIZON = [
  { key: "atPurchase", label: "Kauf", days: 0 },
  { key: "plus2d", label: "+2T", days: 2 },
  { key: "plus3d", label: "+3T", days: 3 },
  { key: "plus4d", label: "+4T", days: 4 },
  { key: "plus5d", label: "+5T", days: 5 },
  { key: "plus6d", label: "+6T", days: 6 },
  { key: "plus1w", label: "1W", days: 7 },
  { key: "plus2w", label: "2W", days: 14 },
  { key: "plus3w", label: "3W", days: 21 },
  { key: "plus1m", label: "1M", days: 30 }
];

export const FULL_HORIZON = [
  ...SHORT_HORIZON,
  { key: "plus2m", label: "2M", days: 60 },
  { key: "plus3m", label: "3M", days: 90 },
  { key: "plus6m", label: "6M", days: 180 },
  { key: "plus1y", label: "1J", days: 365 }
];

/**
 * Baut aus dem prices-Objekt einer Order eine geordnete, lückenlose Punktreihe.
 * Fehlende (null) Werte am Ende werden verworfen; fehlt der Startwert (Kauf),
 * gilt die Reihe als nicht darstellbar.
 */
export function buildSeries(prices, horizon = SHORT_HORIZON) {
  if (!prices) return [];
  const points = horizon
    .map((def) => ({ ...def, value: prices[def.key] }))
    .filter((point) => typeof point.value === "number");

  return points;
}

export function seriesHasGap(prices, horizon = SHORT_HORIZON) {
  let seenNull = false;
  for (const def of horizon) {
    const value = prices?.[def.key];
    const isNull = typeof value !== "number";
    if (isNull) {
      seenNull = true;
    } else if (seenNull) {
      return true; // Wert nach einer Lücke -> echte Lücke, nicht nur "noch nicht erreicht"
    }
  }
  return false;
}
