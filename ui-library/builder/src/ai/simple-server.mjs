/**
 * 🎯 SIMPLE PIPELINE - 100% Claude
 *
 * 2 stages, $0 (Max subscription):
 *   1. Claude Sonnet refines your prompt
 *   2. Claude Opus generates the result (cross-model from Sonnet)
 *
 * Run: node src/ai/simple-server.mjs
 * Open: http://localhost:5301
 */

import http from 'http';
import { claudeCode } from 'ai-sdk-provider-claude-code';
import { generateText } from 'ai';
import dotenv from 'dotenv';
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

const PORT = 5301;

// ─── Helpers ────────────────────────────────────────────

function cleanCode(text) {
  return text
    .replace(/^```html\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
}

// ─── STAGE 1: PROMPT REFINER (Claude Sonnet, fast & free) ─────

const REFINER_SYSTEM = `You are an expert prompt engineer specializing in writing prompts for Gemini 3.1 Pro to generate UI components.

Take a vague user input and rewrite it as a PERFECT prompt for Gemini that will produce premium, anti-AI-slop UI.

Your output prompt MUST include:
- Specific persona/context (invent one if missing)
- Mood/aesthetic with 3-5 evocative adjectives (e.g. "editorial restraint", "cold confidence")
- 3-5 real product references by name (linear.app, vercel.com, rauno.me, plausible.io, fly.io, pitch.com, arc.net, stripe.com)
- 8+ specific design constraints (asymmetric layout, type hierarchy, exact spacing, custom easings)
- Anti-slop banlist (no "Get Started", no "comes alive", no centered hero, no 3 symmetric cards, no generic gradient, no fake "12,000+ users")
- Required micro-details (hover lifts, custom easing cubic-bezier(0.32, 0.72, 0, 1), focus rings)
- Output format spec (pure HTML + Tailwind classes, no markdown fences)
- If the user mentions WebGL/three.js, include CDN: https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js

Use XML structure: <role>, <context>, <task>, <constraints>, <anti_slop>, <output_format>

Output ONLY the master prompt itself. No "Here's your prompt:", no explanations. Just the prompt, ready to send.`;

async function refinePrompt(userInput) {
  const result = await generateText({
    model: claudeCode('sonnet'),
    system: REFINER_SYSTEM,
    prompt: `User input: "${userInput}"\n\nWrite the perfect prompt for Gemini 3.1 Pro.`,
  });
  return result.text.trim();
}

// ─── STAGE 2: GEMINI GENERATOR (with STREAMING) ──────────

const GENERATOR_SYSTEM = `You are an expert HTML/CSS/JS developer who creates premium UI components.

Output:
- Pure HTML with Tailwind CSS classes (use class= not className=)
- Inline <style> tags for custom animations/keyframes
- Inline <script> tags for interactivity
- For WebGL/three.js: load from https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js
- Just the markup, no <html>/<body> wrappers
- No markdown fences, no explanations
- Start directly with HTML
- Assume Tailwind CDN and these fonts: Fraunces (serif), Inter (sans), JetBrains Mono`;

async function generateWithClaude(masterPrompt) {
  const result = await generateText({
    model: claudeCode('opus'),
    system: GENERATOR_SYSTEM,
    prompt: masterPrompt,
  });
  return {
    code: cleanCode(result.text),
    tokens: (result.usage?.inputTokens || 0) + (result.usage?.outputTokens || 0),
    modelUsed: 'Claude Opus 4.6',
  };
}

// ─── Server ────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  // ─── Serve UI ────────────────────────────
  if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(SIMPLE_HTML);
    return;
  }

  // ─── SSE pipeline ──────────────────────────
  if (req.url.startsWith('/run')) {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const userInput = url.searchParams.get('input') || '';

    if (!userInput) {
      res.writeHead(400);
      res.end('Missing input');
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

    // Persistence
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const runDir = join(__dirname, 'runs-simple', timestamp);
    mkdirSync(runDir, { recursive: true });
    writeFileSync(join(runDir, 'input.txt'), userInput);

    console.log(`\n🎯 Simple pipeline: "${userInput}"`);
    console.log(`💾 ${runDir}`);

    try {
      // ─── STAGE 1 ────────────────────
      send('stage', { stage: 1, status: 'running', label: 'Refining prompt...', model: 'Claude Sonnet 4.6' });
      console.log('  📝 Stage 1: Refining prompt with Claude Sonnet...');
      const t1 = Date.now();

      const masterPrompt = await refinePrompt(userInput);

      const t1dur = ((Date.now() - t1) / 1000).toFixed(1);
      console.log(`  ✅ Stage 1 done: ${t1dur}s`);
      writeFileSync(join(runDir, 'master-prompt.txt'), masterPrompt);

      send('stage', {
        stage: 1,
        status: 'done',
        label: 'Prompt refined',
        model: 'Claude Sonnet 4.6',
        duration: t1dur,
        output: masterPrompt,
      });

      // ─── STAGE 2 ────────────────────
      send('stage', { stage: 2, status: 'running', label: 'Generating with Claude Opus...', model: 'Claude Opus 4.6' });
      console.log('  ⚡ Stage 2: Generating with Claude Opus...');
      const t2 = Date.now();

      const { code, tokens, modelUsed } = await generateWithClaude(masterPrompt);
      console.log(`  🎯 Used: ${modelUsed}`);

      const t2dur = ((Date.now() - t2) / 1000).toFixed(1);
      console.log(`  ✅ Stage 2 done: ${t2dur}s · ${tokens} tokens · ${code.length} chars`);
      writeFileSync(join(runDir, 'final.html'), code);

      send('stage', {
        stage: 2,
        status: 'done',
        label: 'Generation complete',
        model: modelUsed || 'Gemini',
        duration: t2dur,
        tokens,
        output: code,
      });

      send('complete', { code, runDir });
      console.log('✅ Done\n');
    } catch (error) {
      console.error('❌ Error:', error.message);
      send('error', { message: error.message });
    }

    res.end();
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

// ─── HTML UI ──────────────────────────────────────────

const SIMPLE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>🎯 Simple AI Pipeline</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@300;400;700;900&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; background: #0a0a0a; color: #fafafa; margin: 0; }
    .font-serif { font-family: 'Fraunces', Georgia, serif; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }
    .stage-card { transition: all 0.3s cubic-bezier(0.32, 0.72, 0, 1); border: 1px solid #27272a; background: #18181b; }
    .stage-card.running { border-color: #f59e0b; box-shadow: 0 0 0 1px #f59e0b; }
    .stage-card.done { border-color: #10b981; }
    .spinner { animation: spin 1s linear infinite; display: inline-block; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    pre { max-height: 500px; overflow: auto; background: #000; border: 1px solid #27272a; padding: 16px; border-radius: 8px; font-size: 11px; line-height: 1.6; white-space: pre-wrap; word-break: break-word; font-family: 'JetBrains Mono', monospace; }
    pre::-webkit-scrollbar { width: 8px; }
    pre::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 4px; }
    .preview-iframe { width: 100%; min-height: 700px; border: none; background: white; border-radius: 12px; }
    details > summary { list-style: none; cursor: pointer; }
    details > summary::-webkit-details-marker { display: none; }
    details[open] > summary .chev { transform: rotate(90deg); }
    .chev { transition: transform 0.2s; display: inline-block; }
  </style>
</head>
<body>
  <div class="max-w-5xl mx-auto p-6">
    <header class="mb-8">
      <h1 class="font-serif text-4xl font-bold mb-2">🎯 Simple AI Pipeline</h1>
      <p class="text-zinc-400 text-sm">Claude refines your prompt → Gemini 3.1 Pro generates the result</p>
    </header>

    <!-- Input -->
    <div class="mb-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <label class="block text-xs font-mono text-zinc-500 uppercase tracking-wider mb-3">Your Input</label>
      <textarea
        id="input"
        rows="2"
        placeholder="hero section with webgl animation"
        class="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
      ></textarea>
      <div class="flex items-center justify-between mt-4">
        <div class="text-xs text-zinc-500 font-mono">
          2 stages · 100% Claude (Max sub) · <span class="text-emerald-400">$0/run</span> · ~2 min
        </div>
        <button id="run-btn" class="px-6 py-2.5 bg-white text-black rounded-full font-semibold text-sm hover:bg-zinc-200 transition disabled:opacity-50">
          ▶ Run
        </button>
      </div>
    </div>

    <!-- Stages -->
    <div id="stages" class="space-y-4 mb-6"></div>

    <!-- Streaming preview -->
    <div id="streaming-section" class="hidden mb-6">
      <div class="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">Live stream from Gemini</div>
      <pre id="stream-output" class="text-emerald-400"></pre>
    </div>

    <!-- Final result -->
    <div id="result-section" class="hidden">
      <h2 class="font-serif text-2xl font-bold mb-4">🎨 Result</h2>
      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-2">
        <iframe id="preview" class="preview-iframe"></iframe>
      </div>
    </div>
  </div>

  <script>
    const STAGES = [
      { id: 1, icon: '📝', label: 'Prompt Refiner', model: 'Claude Sonnet 4.6', color: '#fbbf24' },
      { id: 2, icon: '⚡', label: 'Generator', model: 'Claude Opus 4.6', color: '#f97316' },
    ];

    const stagesEl = document.getElementById('stages');
    const inputEl = document.getElementById('input');
    const runBtn = document.getElementById('run-btn');
    const streamSection = document.getElementById('streaming-section');
    const streamOutput = document.getElementById('stream-output');
    const resultSection = document.getElementById('result-section');
    const preview = document.getElementById('preview');

    function escape(s) {
      if (typeof s !== 'string') s = JSON.stringify(s, null, 2);
      return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    }

    function renderStages() {
      stagesEl.innerHTML = STAGES.map(s => \`
        <div class="stage-card rounded-xl p-5" id="stage-\${s.id}">
          <div class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <span class="text-2xl">\${s.icon}</span>
              <div>
                <div class="font-semibold text-sm">Stage \${s.id} · \${s.label}</div>
                <div class="text-xs font-mono mt-0.5" style="color: \${s.color}">\${s.model}</div>
              </div>
            </div>
            <div class="status text-xs font-mono text-zinc-600">waiting</div>
          </div>
          <div class="content mt-4 hidden"></div>
        </div>
      \`).join('');
    }

    function updateStage(id, data) {
      const card = document.getElementById('stage-' + id);
      if (!card) return;
      const statusEl = card.querySelector('.status');
      const contentEl = card.querySelector('.content');

      card.classList.remove('running', 'done');
      card.classList.add(data.status);

      if (data.status === 'running') {
        statusEl.innerHTML = '<span class="text-amber-500"><span class="spinner">⟳</span> ' + (data.label || 'running...') + '</span>';
      } else if (data.status === 'done') {
        statusEl.innerHTML = '<span class="text-emerald-500">✓ ' + data.duration + 's' + (data.tokens ? ' · ' + data.tokens + ' tok' : '') + '</span>';
        if (data.output) {
          contentEl.classList.remove('hidden');
          contentEl.innerHTML = '<details open><summary class="text-xs font-mono text-zinc-500 hover:text-zinc-300 mb-2"><span class="chev mr-1">▶</span> ' + (id === 1 ? 'Refined master prompt' : 'Generated code') + '</summary><pre>' + escape(data.output) + '</pre></details>';
        }
      }
    }

    async function run() {
      const input = inputEl.value.trim();
      if (!input) { alert('Enter something first'); return; }

      runBtn.disabled = true;
      runBtn.textContent = '⟳ Running...';
      resultSection.classList.add('hidden');
      streamSection.classList.add('hidden');
      streamOutput.textContent = '';
      renderStages();

      const es = new EventSource('/run?input=' + encodeURIComponent(input));

      es.addEventListener('stage', (e) => {
        const { stage, ...data } = JSON.parse(e.data);
        updateStage(stage, data);
        if (stage === 2 && data.status === 'running') {
          streamSection.classList.remove('hidden');
        }
      });

      es.addEventListener('chunk', (e) => {
        const { text } = JSON.parse(e.data);
        streamOutput.textContent += text;
        streamOutput.scrollTop = streamOutput.scrollHeight;
      });

      es.addEventListener('model-switch', (e) => {
        const { model } = JSON.parse(e.data);
        const card = document.getElementById('stage-2');
        const modelEl = card?.querySelector('.font-mono');
        if (modelEl) {
          modelEl.textContent = '⚡ ' + model;
        }
        // Reset stream output if switching mid-stream
        streamOutput.textContent = '';
      });

      es.addEventListener('complete', (e) => {
        const { code } = JSON.parse(e.data);
        runBtn.disabled = false;
        runBtn.textContent = '▶ Run';
        streamSection.classList.add('hidden');
        showResult(code);
        es.close();
      });

      es.addEventListener('error', (e) => {
        try {
          const data = JSON.parse(e.data || '{}');
          alert('Error: ' + (data.message || 'Unknown'));
        } catch {}
        runBtn.disabled = false;
        runBtn.textContent = '▶ Run';
        es.close();
      });
    }

    function showResult(code) {
      resultSection.classList.remove('hidden');
      const fullDoc = '<!DOCTYPE html><html><head><meta charset="UTF-8"><script src="https://cdn.tailwindcss.com"><\\/script><link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@300;400;700;900&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"><style>body{font-family:Inter,system-ui,sans-serif;margin:0}.font-serif{font-family:Fraunces,Georgia,serif}.font-mono{font-family:"JetBrains Mono",monospace}<\\/style></head><body>' + code + '</body></html>';
      preview.srcdoc = fullDoc;
      setTimeout(() => resultSection.scrollIntoView({ behavior: 'smooth' }), 200);
    }

    renderStages();
    runBtn.addEventListener('click', run);
    inputEl.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') run();
    });
    inputEl.value = 'hero section with webgl animation';
  </script>
</body>
</html>`;

server.listen(PORT, () => {
  console.log(`\n🎯 Simple AI Pipeline ready!`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`\n💡 1 input → Claude refines → Gemini generates (with streaming)\n`);
});
