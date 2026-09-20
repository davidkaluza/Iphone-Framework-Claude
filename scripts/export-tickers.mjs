// Exportiert die Insider-Kaufdaten aus MongoDB (insider_buys_db.purchases) als
// statisches JSON für die React-App. Muss von einem Rechner mit Zugriff auf
// das LAN (10.0.0.1:27017) ausgeführt werden: `npm run sync:data`.
// Anschließend src/data/tickers.json committen & pushen, um die App zu aktualisieren.

import { MongoClient } from "mongodb";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const MONGO_URI = process.env.MONGO_URI ?? "mongodb://10.0.0.1:27017/?serverSelectionTimeoutMS=5000";
const CSV_PATH = path.join(ROOT, "insider_superinvestor_tickers.csv");
const OUT_PATH = path.join(ROOT, "src", "data", "tickers.json");

function readCsvTickers() {
  const lines = readFileSync(CSV_PATH, "utf8").trim().split("\n").slice(1);
  const tickers = new Set();
  for (const line of lines) {
    const [, ticker] = line.split(",");
    if (ticker) tickers.add(ticker.trim());
  }
  return [...tickers];
}

function toCamelPrices(prices = {}) {
  return {
    atPurchase: prices.at_purchase ?? null,
    plus2d: prices.plus_2d ?? null,
    plus3d: prices.plus_3d ?? null,
    plus4d: prices.plus_4d ?? null,
    plus5d: prices.plus_5d ?? null,
    plus6d: prices.plus_6d ?? null,
    plus1w: prices.plus_1w ?? null,
    plus2w: prices.plus_2w ?? null,
    plus3w: prices.plus_3w ?? null,
    plus1m: prices.plus_1m ?? null,
    plus2m: prices.plus_2m ?? null,
    plus3m: prices.plus_3m ?? null,
    plus6m: prices.plus_6m ?? null,
    plus1y: prices.plus_1y ?? null,
    today: prices.today ?? null
  };
}

async function main() {
  const csvTickers = readCsvTickers();
  console.log(`CSV: ${csvTickers.length} Ticker gefunden.`);

  const client = new MongoClient(MONGO_URI);
  await client.connect();
  console.log("MongoDB verbunden.");

  const col = client.db("insider_buys_db").collection("purchases");
  const docs = await col.find({ ticker: { $in: csvTickers } }).toArray();
  console.log(`${docs.length} Kauf-Dokumente aus MongoDB geladen.`);

  const byTicker = new Map();
  for (const doc of docs) {
    const list = byTicker.get(doc.ticker) ?? [];
    list.push({
      id: String(doc._id),
      insiderName: doc.insider_name ?? null,
      insiderRole: doc.insider_role ?? null,
      heldBy: doc.held_by ?? null,
      transactionDate: doc.transaction_date ?? null,
      pricePerShare: doc.price_per_share ?? null,
      shares: doc.shares ?? null,
      valueUsd: doc.value_usd ?? null,
      gainPct: typeof doc.gain_pct === "number" ? doc.gain_pct : null,
      numTransactions: doc.num_transactions ?? null,
      lastSynced: doc.last_synced ?? null,
      filingUrls: doc.filing_urls ?? [],
      prices: toCamelPrices(doc.prices)
    });
    byTicker.set(doc.ticker, list);
  }

  const missingTickers = csvTickers.filter((t) => !byTicker.has(t));

  const tickers = csvTickers
    .filter((t) => byTicker.has(t))
    .map((ticker) => {
      const purchases = byTicker
        .get(ticker)
        .sort((a, b) => (a.transactionDate < b.transactionDate ? 1 : -1)); // neueste zuerst

      const primary = purchases[0];
      const issuer =
        docs.find((d) => d.ticker === ticker && d.issuer)?.issuer ?? null;

      return {
        ticker,
        issuer,
        primaryPurchaseId: primary?.id ?? null,
        purchases
      };
    })
    .sort((a, b) => {
      // Neuester Insider-Kauf zuerst (statt alphabetisch nach Ticker)
      const dateA = a.purchases[0]?.transactionDate ?? "";
      const dateB = b.purchases[0]?.transactionDate ?? "";
      return dateB.localeCompare(dateA);
    });

  const output = {
    generatedAt: new Date().toISOString(),
    source: {
      mongoDb: "insider_buys_db.purchases",
      csv: "insider_superinvestor_tickers.csv"
    },
    tickerCount: tickers.length,
    missingTickers,
    tickers
  };

  writeFileSync(OUT_PATH, JSON.stringify(output, null, 2));
  console.log(`Geschrieben: ${OUT_PATH} (${tickers.length} Ticker, ${missingTickers.length} ohne Treffer)`);

  await client.close();
}

main().catch((err) => {
  console.error("Export fehlgeschlagen:", err.message);
  process.exit(1);
});
