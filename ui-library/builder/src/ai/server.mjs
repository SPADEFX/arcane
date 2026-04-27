/**
 * 🌐 SERVER - HTTP server with SSE for live pipeline updates
 *
 * Run: node src/ai/server.mjs
 * Open: http://localhost:5300
 */

import http from 'http';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { runPipeline } from './pipeline.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 5300;

const server = http.createServer(async (req, res) => {
  // CORS / common headers
  res.setHeader('Access-Control-Allow-Origin', '*');

  // ─── Serve UI ────────────────────────────────────
  if (req.url === '/' || req.url === '/index.html') {
    try {
      const html = readFileSync(join(__dirname, 'ui.html'), 'utf-8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    } catch (e) {
      res.writeHead(500);
      res.end('Error loading UI: ' + e.message);
    }
    return;
  }

  // ─── SSE endpoint: run pipeline ────────────────────
  if (req.url.startsWith('/run')) {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const brief = url.searchParams.get('brief') || '';

    if (!brief) {
      res.writeHead(400);
      res.end('Missing brief');
      return;
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    const send = (event, data) => {
      res.write(`event: ${event}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    send('start', { brief });
    console.log(`\n🚀 Running pipeline for: "${brief}"`);

    try {
      await runPipeline(brief, (stage, data) => {
        console.log(`  📡 Stage ${stage}: ${data.status}${data.duration ? ` (${data.duration}s)` : ''}`);
        send('stage', { stage, data });
      });
      send('complete', {});
      console.log('✅ Pipeline complete\n');
    } catch (error) {
      console.error('❌ Pipeline error:', error.message);
      send('error', { message: error.message });
    }

    res.end();
    return;
  }

  // ─── 404 ───────────────────────────────────────
  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`\n🎨 AI Pipeline UI ready!`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`\n💡 Type a brief in the input field and click "Run Pipeline"`);
  console.log(`   Each stage will appear live as it completes.\n`);
});
