/**
 * 🆚 3-WAY COMPARISON: Gemini Flash vs Claude Opus vs Gemini 3.1 Pro
 *
 * - Gemini Flash: free tier
 * - Claude Opus 4.6: via your Claude Max subscription ($0)
 * - Gemini 3.1 Pro: paid (only runs if billing is set up)
 *
 * Run: node src/ai/compare-3way.mjs
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { claudeCode } from 'ai-sdk-provider-claude-code';
import { generateText } from 'ai';
import dotenv from 'dotenv';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🎨 SYSTEM PROMPT - high quality, anti-slop
const SYSTEM = `You are a senior product designer who codes. You create components for premium SaaS brands like Linear, Vercel, Rauno.me, Pitch, and Arc.

You HATE generic AI-generated UIs. You spot "AI slop" instantly:
- Centered hero with 3 feature cards = SLOP
- "Build Better, Faster" copy = SLOP
- Generic gradients purple-to-blue = SLOP
- Lucide rocket/sparkle icons = SLOP
- Symmetric layouts = SLOP
- "Get Started" / "Learn More" CTAs = SLOP
- Same padding everywhere = SLOP
- Predictable hierarchy = SLOP

Your work is RECOGNIZABLE. It has:
- Editorial typography with confident weight contrast (300 vs 800)
- Asymmetric layouts that create visual tension
- Specific, opinionated copy that sounds human
- Spacing rhythm (not uniform 16px everywhere — use 4/12/24/48/96 with intent)
- Custom easings: cubic-bezier(0.32, 0.72, 0, 1) for premium feel
- Micro-details: hover lifts, focus rings, subtle noise textures
- Real visual hierarchy: huge display + tiny meta + medium body
- ONE bold accent color, not gradients
- Tactile, almost magazine-like layouts

OUTPUT: Pure HTML with Tailwind CSS classes.
- Use class= (not className=)
- Just the <section> markup
- No <html>, no <body>, no markdown fences, no explanations
- Don't write "Here's the component" or anything before/after`;

const BRIEF = `Hero section for "Pulse" — a privacy-first analytics tool for indie hackers and small SaaS founders.

The brand voice is: confident, technical, slightly nerdy, no bullshit.
Reference vibes: plausible.io, linear.app, rauno.me, fly.io.

Specific requirements:
- Asymmetric layout with intentional negative space
- Editorial typography (mix Fraunces serif display + Inter sans body)
- Headline must be SPECIFIC and opinionated, not "Powerful Analytics"
- Real subhead that explains the actual value, not vague benefits
- 1 primary CTA + 1 quiet text link (with arrow)
- A small "social proof" element (number + tiny logos OR a quote, your call)
- Background should feel intentional, not generic gradient
- Use neutral palette (zinc/stone) + ONE confident accent (emerald or amber, you choose)
- Make it feel like a real product page from a designer-founder, not AI`;

function cleanHTML(text) {
  return text
    .replace(/^```html\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
}

const tasks = [
  // 1. GEMINI FLASH (free)
  {
    name: 'gemini-flash',
    label: 'Gemini 2.5 Flash',
    sublabel: 'Free tier',
    color: '#94a3b8',
    run: async () => {
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: { temperature: 0.8, maxOutputTokens: 8192 },
      });
      const result = await model.generateContent([SYSTEM, BRIEF]);
      return {
        html: cleanHTML(result.response.text()),
        tokens: result.response.usageMetadata?.totalTokenCount || 0,
      };
    },
  },

  // 2. CLAUDE OPUS (Max subscription)
  {
    name: 'claude-opus',
    label: 'Claude Opus 4.6',
    sublabel: 'Max subscription · $0',
    color: '#f97316',
    run: async () => {
      const result = await generateText({
        model: claudeCode('opus'),
        system: SYSTEM,
        prompt: BRIEF,
      });
      return {
        html: cleanHTML(result.text),
        tokens: (result.usage?.inputTokens || 0) + (result.usage?.outputTokens || 0),
      };
    },
  },

  // 3. GEMINI 3.1 PRO (paid - will fail gracefully if no billing)
  {
    name: 'gemini-pro',
    label: 'Gemini 3.1 Pro Preview',
    sublabel: 'Paid tier',
    color: '#10b981',
    run: async () => {
      const model = genAI.getGenerativeModel({
        model: 'gemini-3.1-pro-preview',
        generationConfig: { temperature: 0.8, maxOutputTokens: 8192 },
      });
      const result = await model.generateContent([SYSTEM, BRIEF]);
      return {
        html: cleanHTML(result.response.text()),
        tokens: result.response.usageMetadata?.totalTokenCount || 0,
      };
    },
  },
];

console.log('🚀 Generating with 3 models in parallel...\n');

const results = await Promise.all(
  tasks.map(async (task) => {
    const startTime = Date.now();
    console.log(`📡 ${task.label}...`);
    try {
      const { html, tokens } = await task.run();
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`   ✅ ${task.label}: ${duration}s · ${tokens} tokens\n`);
      return { ...task, html, tokens, duration, error: null };
    } catch (error) {
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`   ❌ ${task.label}: ${error.message.substring(0, 100)}\n`);
      return {
        ...task,
        html: `<div class="p-12">
          <div class="text-red-500 font-mono text-sm">⚠️ ${task.label} not available</div>
          <div class="text-zinc-500 text-xs mt-2">${error.message.substring(0, 200)}</div>
        </div>`,
        tokens: 0,
        duration,
        error: error.message,
      };
    }
  })
);

// 🎨 Build comparison HTML with TABS
const comparisonHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Model Comparison</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@300;400;700;900&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; background: #0a0a0a; color: #fafafa; margin: 0; }
    .font-serif { font-family: 'Fraunces', Georgia, serif; }
    .tab-bar {
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(20px);
      background: rgba(10,10,10,0.85);
      border-bottom: 1px solid #27272a;
    }
    .tab-btn {
      transition: all 0.2s cubic-bezier(0.32, 0.72, 0, 1);
    }
    .tab-btn:hover {
      background: rgba(255,255,255,0.05);
    }
    .tab-btn.active {
      background: white;
      color: black;
    }
    .preview-frame {
      background: white;
      color: black;
      min-height: calc(100vh - 80px);
    }
    .panel { display: none; }
    .panel.active { display: block; }
  </style>
</head>
<body>
  <div class="tab-bar">
    <div class="max-w-[1800px] mx-auto px-6 py-3 flex items-center gap-2">
      <div class="font-serif font-bold text-lg mr-6">Model Comparison</div>
      ${results.map((r, i) => `
        <button
          class="tab-btn ${i === 0 ? 'active' : ''} px-5 py-2.5 rounded-full text-sm font-medium border border-zinc-700"
          data-target="panel-${r.name}"
          style="--accent: ${r.color}"
        >
          <span class="inline-block w-2 h-2 rounded-full mr-2 align-middle" style="background: ${r.color}"></span>
          ${r.label}
          <span class="ml-2 text-xs opacity-60 font-mono">${r.duration}s</span>
        </button>
      `).join('')}
      <div class="ml-auto text-xs text-zinc-500 font-mono">
        Click to switch · Same brief on all models
      </div>
    </div>
  </div>

  ${results.map((r, i) => `
    <div class="panel ${i === 0 ? 'active' : ''}" id="panel-${r.name}">
      <div class="preview-frame">
        ${r.html}
      </div>
      <div class="bg-zinc-950 border-t border-zinc-800 p-6">
        <div class="max-w-[1800px] mx-auto flex items-center justify-between text-xs font-mono">
          <div class="flex items-center gap-6">
            <div>
              <span class="text-zinc-500">Model:</span>
              <span class="ml-2 font-bold" style="color: ${r.color}">${r.label}</span>
            </div>
            <div>
              <span class="text-zinc-500">Duration:</span>
              <span class="ml-2 text-white">${r.duration}s</span>
            </div>
            <div>
              <span class="text-zinc-500">Tokens:</span>
              <span class="ml-2 text-white">${r.tokens}</span>
            </div>
            <div>
              <span class="text-zinc-500">Tier:</span>
              <span class="ml-2 text-white">${r.sublabel}</span>
            </div>
          </div>
          <button onclick="document.getElementById('brief-modal').classList.toggle('hidden')" class="px-3 py-1.5 rounded border border-zinc-700 hover:bg-zinc-800 text-zinc-300">
            View brief
          </button>
        </div>
      </div>
    </div>
  `).join('')}

  <!-- Brief modal -->
  <div id="brief-modal" class="hidden fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6" onclick="this.classList.add('hidden')">
    <div class="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full p-6" onclick="event.stopPropagation()">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-bold text-white">📋 Brief used</h3>
        <button onclick="document.getElementById('brief-modal').classList.add('hidden')" class="text-zinc-500 hover:text-white">✕</button>
      </div>
      <pre class="text-xs text-zinc-400 whitespace-pre-wrap font-mono leading-relaxed">${BRIEF}</pre>
    </div>
  </div>

  <script>
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        // Deactivate all
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        // Activate clicked
        btn.classList.add('active');
        const target = btn.getAttribute('data-target');
        document.getElementById(target).classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  </script>
</body>
</html>`;

const outputPath = join(__dirname, 'comparison-3way.html');
writeFileSync(outputPath, comparisonHTML);

console.log('━'.repeat(60));
console.log('🎨 3-WAY COMPARISON READY!');
console.log('━'.repeat(60));
console.log('📂', outputPath);
console.log('');
console.log('👉 open ' + outputPath);
console.log('━'.repeat(60));
