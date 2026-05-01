/**
 * Local ledger for content generation usage tracking.
 *
 * Persisted as a single JSON file at public/generated/.ledger.json so it
 * lives next to the actual generated assets and is git-ignorable.
 *
 * Each entry: { id, provider, model, type, slug, prompt, aspectRatio,
 *               estimatedCost, durationSec, createdAt }
 *
 * `provider` is "google" | "fal"
 * `type` is "image" | "video" | "image-to-video" | "image-to-image"
 */
const fs = require("fs");
const path = require("path");

const LEDGER_FILE = path.join(__dirname, "..", "..", "public", "generated", ".ledger.json");

function ensureDir() {
  const dir = path.dirname(LEDGER_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readLedger() {
  ensureDir();
  if (!fs.existsSync(LEDGER_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(LEDGER_FILE, "utf8"));
  } catch {
    return [];
  }
}

async function append(entry) {
  ensureDir();
  const ledger = readLedger();
  const id = `gen_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const full = {
    id,
    createdAt: new Date().toISOString(),
    ...entry,
  };
  ledger.push(full);
  // Atomic write: tmp + rename
  const tmp = LEDGER_FILE + ".tmp";
  await fs.promises.writeFile(tmp, JSON.stringify(ledger, null, 2));
  await fs.promises.rename(tmp, LEDGER_FILE);
  return full;
}

/**
 * Aggregate stats across all entries.
 * @returns {{
 *   total: { count, cost },
 *   today: { count, cost },
 *   thisMonth: { count, cost },
 *   byProvider: Record<string, { count, cost }>,
 *   byModel: Record<string, { count, cost }>,
 *   recent: Array,
 * }}
 */
function getUsage() {
  const ledger = readLedger();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const stats = {
    total: { count: 0, cost: 0 },
    today: { count: 0, cost: 0 },
    thisMonth: { count: 0, cost: 0 },
    byProvider: {},
    byModel: {},
    byDay: {},
    recent: [],
  };

  for (const e of ledger) {
    const cost = e.estimatedCost || 0;
    stats.total.count++;
    stats.total.cost += cost;

    if (e.createdAt >= todayStart) {
      stats.today.count++;
      stats.today.cost += cost;
    }
    if (e.createdAt >= monthStart) {
      stats.thisMonth.count++;
      stats.thisMonth.cost += cost;
    }

    const p = e.provider || "unknown";
    if (!stats.byProvider[p]) stats.byProvider[p] = { count: 0, cost: 0 };
    stats.byProvider[p].count++;
    stats.byProvider[p].cost += cost;

    const m = e.model || "unknown";
    if (!stats.byModel[m]) stats.byModel[m] = { count: 0, cost: 0 };
    stats.byModel[m].count++;
    stats.byModel[m].cost += cost;

    const day = e.createdAt.slice(0, 10);
    if (!stats.byDay[day]) stats.byDay[day] = { count: 0, cost: 0 };
    stats.byDay[day].count++;
    stats.byDay[day].cost += cost;
  }

  // Round costs to 4 decimals
  const round = (n) => Math.round(n * 10000) / 10000;
  stats.total.cost = round(stats.total.cost);
  stats.today.cost = round(stats.today.cost);
  stats.thisMonth.cost = round(stats.thisMonth.cost);
  for (const k of Object.keys(stats.byProvider)) stats.byProvider[k].cost = round(stats.byProvider[k].cost);
  for (const k of Object.keys(stats.byModel)) stats.byModel[k].cost = round(stats.byModel[k].cost);
  for (const k of Object.keys(stats.byDay)) stats.byDay[k].cost = round(stats.byDay[k].cost);

  // Recent — last 20
  stats.recent = ledger.slice(-20).reverse();

  return stats;
}

module.exports = { append, getUsage, readLedger };
