const currencyFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const compactFormatter = new Intl.NumberFormat("de-DE", {
  notation: "compact",
  maximumFractionDigits: 1
});

const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "short",
  year: "numeric"
});

export function formatCurrency(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "–";
  return currencyFormatter.format(value);
}

export function formatPercent(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "–";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1).replace(".", ",")} %`;
}

export function formatCompact(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "–";
  return compactFormatter.format(value);
}

export function formatDate(isoDate) {
  if (!isoDate) return "–";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return dateFormatter.format(date);
}

/** Deutsche Kurzschreibweise TT.MM.JJJJ, z. B. "05.03.2026". */
export function formatDateDMY(isoDate) {
  if (!isoDate) return null;
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${date.getFullYear()}`;
}
