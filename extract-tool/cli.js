#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { launch, extractWith } = require("./lib/extract");
const { buildHtml } = require("./lib/render");

function parseArgs(argv) {
  const out = {
    url: null, range: null, list: null, selector: null,
    format: "json", output: path.join(__dirname, "out"),
    concurrency: 2, viewport: "900x900", waitMs: 800,
    retries: 2, timeoutMs: 30000, verbose: false, help: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    const eat = () => argv[++i];
    switch (a) {
      case "-h": case "--help": out.help = true; break;
      case "--url": out.url = eat(); break;
      case "--range": out.range = eat(); break;
      case "--list": out.list = eat(); break;
      case "--selector": out.selector = eat(); break;
      case "--format": out.format = eat(); break;
      case "--output": case "-o": out.output = path.resolve(eat()); break;
      case "--concurrency": case "-c": out.concurrency = Number(eat()); break;
      case "--viewport": out.viewport = eat(); break;
      case "--wait-ms": out.waitMs = Number(eat()); break;
      case "--retries": out.retries = Number(eat()); break;
      case "--timeout-ms": out.timeoutMs = Number(eat()); break;
      case "-v": case "--verbose": out.verbose = true; break;
      default:
        if (a.startsWith("--")) { console.error(`Unknown flag: ${a}`); process.exit(2); }
    }
  }
  return out;
}

const HELP = `
motion-extract — capture animations from rendered web pages

USAGE
  node cli.js --url "<pattern>" --range <n-m>   [options]
  node cli.js --list urls.txt                   [options]

REQUIRED (one of)
  --url <pattern>        URL template. Use "{n}" placeholder with --range.
  --list <file>          Path to text file with one URL per line.

OPTIONS
  --range <start-end>    Numeric range to expand "{n}". e.g. 1-55
  --selector <css>       CSS selector for the motion root.
  --format <fmt>         json | html | both. Default: json
  --output <dir>, -o     Output folder. Default: ./out
  --concurrency <n>, -c  Parallel page contexts. Default: 2
  --viewport <WxH>       Default: 900x900
  --wait-ms <ms>         Settle delay after networkidle2. Default: 800
  --retries <n>          Retries per URL on failure. Default: 2
  --timeout-ms <ms>      Navigation timeout. Default: 30000
  --verbose, -v          Log every captured element's class.
  --help, -h             Show this help.
`;

async function runQueue(items, concurrency, worker) {
  const queue = items.slice();
  const active = new Set();
  async function spawn() {
    if (queue.length === 0) return;
    const item = queue.shift();
    const p = worker(item).finally(() => active.delete(p));
    active.add(p);
    if (active.size < concurrency && queue.length > 0) await spawn();
  }
  while (queue.length > 0 && active.size < concurrency) await spawn();
  while (active.size > 0) {
    await Promise.race(active);
    if (queue.length > 0) await spawn();
  }
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help || (!args.url && !args.list)) {
    console.log(HELP);
    process.exit(args.help ? 0 : 2);
  }

  let urls = [];
  if (args.list) {
    const txt = fs.readFileSync(args.list, "utf8");
    urls = txt.split(/\r?\n/).map((s) => s.trim()).filter(Boolean).filter((s) => !s.startsWith("#"));
  } else if (args.range) {
    const m = /^(\d+)\s*-\s*(\d+)$/.exec(args.range);
    if (!m) { console.error("Bad --range, expected e.g. 1-55"); process.exit(2); }
    const [s, e] = [Number(m[1]), Number(m[2])];
    for (let n = s; n <= e; n++) urls.push({ n, url: args.url.replace("{n}", String(n)) });
  } else {
    urls.push({ n: 1, url: args.url });
  }
  if (urls.length === 0) { console.error("No URLs to process."); process.exit(2); }

  urls = urls.map((u, i) => typeof u === "string"
    ? { label: `item-${i + 1}`, url: u }
    : { label: `motion-${String(u.n).padStart(2, "0")}`, url: u.url });

  fs.mkdirSync(args.output, { recursive: true });

  const browser = await launch();
  const t0 = Date.now();
  let done = 0, failed = 0;

  const worker = async ({ label, url }) => {
    let lastErr;
    for (let attempt = 0; attempt <= args.retries; attempt++) {
      try {
        const data = await extractWith(browser, url, {
          selector: args.selector,
          viewport: args.viewport,
          waitMs: args.waitMs,
          timeoutMs: args.timeoutMs,
        });
        if (args.format === "json" || args.format === "both") {
          fs.writeFileSync(path.join(args.output, `${label}.json`), JSON.stringify(data, null, 2));
        }
        if (args.format === "html" || args.format === "both") {
          fs.writeFileSync(path.join(args.output, `${label}.html`), buildHtml(data));
        }
        done++;
        const pct = (((done + failed) / urls.length) * 100).toFixed(0);
        console.log(`  [${pct}%] ${label} · ${data.nodes.length} nodes · ${Object.keys(data.keyframes).length} kfs`);
        if (args.verbose) {
          for (const n of data.nodes.slice(0, 12)) console.log(`      ${n.tag}.${n.cls || ""}`);
        }
        return;
      } catch (e) {
        lastErr = e;
        if (attempt < args.retries) continue;
      }
    }
    failed++;
    console.error(`  [FAIL] ${label} (${url}): ${lastErr && lastErr.message}`);
  };

  console.log(`motion-extract · ${urls.length} url(s) · concurrency ${args.concurrency} · format ${args.format}`);
  await runQueue(urls, args.concurrency, worker);
  await browser.close();

  const dt = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\nfinished: ${done} ok, ${failed} failed in ${dt}s`);
  console.log(`output dir: ${args.output}`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
