/**
 * 🥊 BATTLE - Claude Opus 4.6 vs Gemini 3.1 Pro
 *
 * 2 composants × 2 modèles avec prompts OPTIMISÉS:
 * - Thinking mode activé des deux côtés
 * - Constraint-first prompts
 * - User personas explicites
 * - Acceptance criteria
 * - Reference designs spécifiques
 * - Anti-slop checklist intégrée
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

// ═══════════════════════════════════════════════════════════
// 🎨 SHARED SYSTEM PROMPT (anti-slop bible)
// ═══════════════════════════════════════════════════════════

const SYSTEM = `<role>
You are a senior product designer who codes — the kind that ships at Linear, Vercel, Rauno.me, Pitch, Arc, Stripe, Plausible, Fly.io.
You have 10+ years of taste. You can spot AI-generated UIs in 0.3 seconds and you HATE them.
</role>

<thought_process>
Before writing any code, think deeply about:
1. WHO is this for? (be specific: name a real persona)
2. WHAT decision are they making in this 8 seconds of attention?
3. WHAT'S the ONE thing this section must communicate?
4. WHAT visual tension creates memorability?
5. WHAT would make a designer-founder say "damn that's good"?
</thought_process>

<ai_slop_to_avoid>
NEVER produce these patterns. They are instant tells of AI-generated UI:
- ❌ Centered hero with 3 symmetric feature cards
- ❌ "Build Better, Faster" / "Powerful Analytics" / "Get Started" copy
- ❌ Purple-to-blue gradient backgrounds
- ❌ Lucide rocket/sparkle/zap icons sprinkled randomly
- ❌ Symmetric grid layouts (3 cols, 4 cols, equal everything)
- ❌ Same padding everywhere (no rhythm, no hierarchy)
- ❌ Generic copy that could fit any product
- ❌ Default Tailwind colors (slate-500, blue-600) without intention
- ❌ ease-in-out as the only transition
- ❌ Stock placeholder content ("Lorem ipsum", "Customer Name")
- ❌ Emoji as decoration
- ❌ Floating chat bubbles, badges saying "NEW!"
</ai_slop_to_avoid>

<quality_signals>
Your work has these signals of taste:
- ✅ Editorial typography: confident weight contrast (300 vs 800), tight tracking on display
- ✅ Asymmetric layouts that create visual tension and negative space
- ✅ Specific, opinionated copy that sounds like a real human wrote it
- ✅ Spacing rhythm: use 4/8/16/32/64/128 with INTENT, not uniform 16px
- ✅ Custom easings: cubic-bezier(0.32, 0.72, 0, 1), cubic-bezier(0.16, 1, 0.3, 1)
- ✅ Subtle micro-details: hover lifts (-2px), focus rings, noise textures
- ✅ Strong visual hierarchy: huge display + tiny meta + medium body
- ✅ ONE bold accent color used sparingly, not gradients
- ✅ Semantic spacing (space says something, not just "looks ok")
- ✅ Real numbers, real names, real social proof
</quality_signals>

<output_format>
- Pure HTML with Tailwind CSS classes (NOT JSX, use class= not className=)
- Just the markup, no <html>, no <body>, no markdown fences
- No "Here's the component" — start directly with the HTML
- Inline <style> tags allowed for custom animations/keyframes
- Inline <script> tags allowed for interactivity (vanilla JS, three.js if requested)
- Assume Tailwind CDN is loaded and these fonts available: Fraunces (serif), Inter (sans)
</output_format>`;

// ═══════════════════════════════════════════════════════════
// 🎯 COMPONENT 1: Pricing Section (Pro)
// ═══════════════════════════════════════════════════════════

const BRIEF_PRICING = `<context>
Product: "Pulse" — privacy-first analytics for indie SaaS founders
Persona: Marc, 34, indie founder of a $20k MRR SaaS, technical, hates marketing fluff,
         used Plausible before but wants more depth. Decides in 30 seconds if a tool is "for him".
Section: Pricing section (placed mid-page, after features)
</context>

<task>
Build a pricing section that feels like a designer-founder wrote it, not a SaaS template.
Reference vibes: linear.app/pricing, plausible.io/#pricing, rauno.me, fly.io/pricing.
</task>

<constraints>
- Exactly 3 tiers: "Solo" / "Studio" / "Custom"
- ONE tier visually elevated (NOT centered - asymmetric emphasis instead)
- Real opinionated copy ("For the 1-person SaaS that doesn't need 47 dashboards")
- Real numbers ($9, $29, "Talk to us")
- Show what's INCLUDED with concrete numbers (10k pageviews, 100k events, etc)
- NO checkmark icons — use typography hierarchy instead
- Toggle for monthly/yearly with 20% off yearly
- A small "honest" footer: "Cancel anytime · No credit card required · Real humans answer support"
- Background should feel intentional (subtle, maybe a faint grid or noise)
- Palette: zinc + ONE accent (your choice, but justify it visually)
</constraints>

<acceptance_criteria>
□ Asymmetric, NOT 3-equal-columns
□ Copy feels human and specific to the indie founder persona
□ NO generic SaaS phrases
□ Strong type hierarchy (huge price + tiny meta)
□ The chosen tier is elevated through DESIGN, not a "Most Popular" badge
□ Interactivity hint (hover state described in code)
□ Looks like it could be on Linear's actual site
</acceptance_criteria>`;

// ═══════════════════════════════════════════════════════════
// 🎨 COMPONENT 2: Animated Hero with Three.js
// ═══════════════════════════════════════════════════════════

const BRIEF_ANIMATED = `<context>
Product: "Aurora" — a creative coding playground for designers learning shaders
Persona: Maya, 28, designer at a startup, curious about shaders/WebGL, intimidated by code.
         Will spend 5 seconds deciding if Aurora is "for her".
Section: Hero section that MUST showcase WebGL capability through the visual itself
</context>

<task>
Build a hero section with a REAL working three.js animation in the background.
The animation IS the visual proof of what Aurora teaches.
</task>

<constraints>
- Use Three.js loaded from CDN: <script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>
- Animation: Choose ONE of these (your call, pick the most beautiful):
  a) Floating mesh of particles forming an organic shape, slow rotation
  b) Animated wireframe geometry (icosahedron/torus) with smooth color shifts
  c) GLSL shader-like effect using a plane with custom vertex displacement
- Animation must be SUBTLE and slow (no seizure-mode), feel premium
- Hero text overlays on top of the canvas, must be readable
- Asymmetric layout: text 50% left, canvas extends full width but is anchored visually right
- Headline that's POETIC not generic ("The medium is the syntax" / something better)
- 1 primary CTA, 1 quiet text link with arrow
- Small "what's inside" badge: "20 lessons · 3 shader projects · GLSL primer"
- The whole section feels like a magazine cover for a code zine
- Palette: deep navy/almost-black + ONE phosphor accent (cyan / lime / amber)
- Custom font weights, NO generic Tailwind text-2xl etc — use clamp() for fluid type
</constraints>

<acceptance_criteria>
□ Three.js code WORKS when rendered in browser (no errors)
□ Animation is visible, smooth, premium-feeling
□ Text is readable on top of the canvas
□ Asymmetric layout with intentional negative space
□ Copy is poetic and specific, not generic
□ Looks like a real product page, not a tutorial demo
□ Custom CSS animations on text (slow fade-in, character stagger if possible)
</acceptance_criteria>`;

// ═══════════════════════════════════════════════════════════
// 🤖 MODEL RUNNERS
// ═══════════════════════════════════════════════════════════

function cleanHTML(text) {
  return text
    .replace(/^```html\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
}

async function runGemini(brief) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.1-pro-preview',
    systemInstruction: SYSTEM,
    generationConfig: {
      temperature: 0.85,
      maxOutputTokens: 16384,
    },
  });
  const result = await model.generateContent(brief);
  return {
    html: cleanHTML(result.response.text()),
    tokens: result.response.usageMetadata?.totalTokenCount || 0,
  };
}

async function runClaude(brief) {
  const result = await generateText({
    model: claudeCode('opus'),
    system: SYSTEM,
    prompt: brief,
  });
  return {
    html: cleanHTML(result.text),
    tokens: (result.usage?.inputTokens || 0) + (result.usage?.outputTokens || 0),
  };
}

// ═══════════════════════════════════════════════════════════
// 🚀 BATTLE
// ═══════════════════════════════════════════════════════════

const battles = [
  {
    id: 'pricing',
    title: 'Pricing Section (Pro)',
    icon: '💎',
    description: 'Tests structure, hierarchy, copy, business design',
    brief: BRIEF_PRICING,
  },
  {
    id: 'animated',
    title: 'Animated Hero with Three.js',
    icon: '🎨',
    description: 'Tests creativity, animation, complex code',
    brief: BRIEF_ANIMATED,
  },
];

const models = [
  {
    id: 'claude',
    name: 'Claude Opus 4.6',
    sublabel: 'Max sub · $0',
    color: '#f97316',
    run: runClaude,
  },
  {
    id: 'gemini',
    name: 'Gemini 3.1 Pro Preview',
    sublabel: 'Paid · ~$0.05',
    color: '#10b981',
    run: runGemini,
  },
];

console.log('🥊 BATTLE: Claude Opus vs Gemini 3.1 Pro');
console.log('━'.repeat(60));
console.log('2 components × 2 models = 4 generations\n');

const results = {};

for (const battle of battles) {
  console.log(`\n📦 Component: ${battle.title}`);
  console.log('─'.repeat(60));

  const battleResults = await Promise.all(
    models.map(async (m) => {
      const start = Date.now();
      console.log(`  📡 ${m.name}...`);
      try {
        const { html, tokens } = await m.run(battle.brief);
        const duration = ((Date.now() - start) / 1000).toFixed(1);
        console.log(`  ✅ ${m.name}: ${duration}s · ${tokens} tokens`);
        return { ...m, html, tokens, duration, error: null };
      } catch (error) {
        const duration = ((Date.now() - start) / 1000).toFixed(1);
        console.log(`  ❌ ${m.name}: ${error.message.substring(0, 100)}`);
        return {
          ...m,
          html: `<div class="p-12"><div class="text-red-500">⚠️ ${error.message.substring(0, 200)}</div></div>`,
          tokens: 0,
          duration,
          error: error.message,
        };
      }
    })
  );

  results[battle.id] = battleResults;
}

// ═══════════════════════════════════════════════════════════
// 🎨 BUILD HTML UI WITH TABS (component + model)
// ═══════════════════════════════════════════════════════════

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>🥊 Model Battle</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@300;400;700;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; background: #0a0a0a; color: #fafafa; margin: 0; }
    .font-serif { font-family: 'Fraunces', Georgia, serif; }
    .header-bar {
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(20px);
      background: rgba(10,10,10,0.9);
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
    .panel { display: none; }
    .panel.active { display: block; }
    .component-section { display: none; }
    .component-section.active { display: block; }
    .preview {
      background: white;
      color: black;
      min-height: calc(100vh - 160px);
    }
  </style>
</head>
<body>
  <div class="header-bar">
    <div class="max-w-[1800px] mx-auto px-6 py-4">
      <div class="flex items-center justify-between mb-3">
        <div>
          <div class="font-serif font-bold text-xl">🥊 Model Battle</div>
          <div class="text-xs text-zinc-500 font-mono mt-1">Optimized prompts · Thinking mode · 4 generations</div>
        </div>
        <button onclick="document.getElementById('brief-modal').classList.toggle('hidden')" class="px-3 py-1.5 rounded border border-zinc-700 hover:bg-zinc-800 text-zinc-300 text-xs">
          View prompts
        </button>
      </div>

      <!-- Component tabs -->
      <div class="flex items-center gap-2 mb-3">
        ${battles.map((b, i) => `
          <button
            class="component-tab ${i === 0 ? 'active' : ''} px-4 py-2 rounded-lg text-sm font-medium border border-zinc-700"
            data-component="${b.id}"
          >
            ${b.icon} ${b.title}
          </button>
        `).join('')}
      </div>

      <!-- Model tabs (per component) -->
      ${battles.map((b, i) => `
        <div class="model-tabs ${i === 0 ? 'flex' : 'hidden'} items-center gap-2" data-component-tabs="${b.id}">
          ${results[b.id].map((r, j) => `
            <button
              class="model-tab tab-btn ${j === 0 ? 'active' : ''} px-4 py-2 rounded-full text-xs font-medium border border-zinc-700"
              data-target="${b.id}-${r.id}"
              data-component-parent="${b.id}"
            >
              <span class="inline-block w-2 h-2 rounded-full mr-2 align-middle" style="background: ${r.color}"></span>
              ${r.name}
              <span class="ml-2 opacity-60 font-mono">${r.duration}s</span>
            </button>
          `).join('')}
        </div>
      `).join('')}
    </div>
  </div>

  ${battles.map((b, i) => `
    <div class="component-section ${i === 0 ? 'active' : ''}" data-component-section="${b.id}">
      ${results[b.id].map((r, j) => `
        <div class="panel ${j === 0 ? 'active' : ''}" id="${b.id}-${r.id}">
          <div class="preview">
            ${r.html}
          </div>
          <div class="bg-zinc-950 border-t border-zinc-800 p-4">
            <div class="max-w-[1800px] mx-auto flex items-center gap-6 text-xs font-mono text-zinc-400">
              <div><span class="text-zinc-600">Component:</span> <span class="text-white">${b.title}</span></div>
              <div><span class="text-zinc-600">Model:</span> <span class="font-bold" style="color: ${r.color}">${r.name}</span></div>
              <div><span class="text-zinc-600">Duration:</span> <span class="text-white">${r.duration}s</span></div>
              <div><span class="text-zinc-600">Tokens:</span> <span class="text-white">${r.tokens}</span></div>
              <div><span class="text-zinc-600">Cost:</span> <span class="text-white">${r.sublabel}</span></div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `).join('')}

  <!-- Brief modal -->
  <div id="brief-modal" class="hidden fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 overflow-auto" onclick="this.classList.add('hidden')">
    <div class="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-4xl w-full p-6 max-h-[90vh] overflow-auto" onclick="event.stopPropagation()">
      <div class="flex items-center justify-between mb-4 sticky top-0 bg-zinc-900 pb-2">
        <h3 class="font-bold text-white">📋 Prompts used</h3>
        <button onclick="document.getElementById('brief-modal').classList.add('hidden')" class="text-zinc-500 hover:text-white">✕</button>
      </div>
      ${battles.map(b => `
        <div class="mb-6">
          <h4 class="text-sm font-bold text-white mb-2">${b.icon} ${b.title}</h4>
          <pre class="text-[11px] text-zinc-400 whitespace-pre-wrap font-mono leading-relaxed bg-black/40 p-4 rounded">${b.brief.replace(/</g, '&lt;')}</pre>
        </div>
      `).join('')}
    </div>
  </div>

  <script>
    // Component tabs
    document.querySelectorAll('.component-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-component');
        document.querySelectorAll('.component-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.component-section').forEach(s => s.classList.remove('active'));
        document.querySelector('[data-component-section="' + id + '"]').classList.add('active');
        // Show right model tabs
        document.querySelectorAll('.model-tabs').forEach(t => { t.classList.remove('flex'); t.classList.add('hidden'); });
        const tabs = document.querySelector('[data-component-tabs="' + id + '"]');
        tabs.classList.remove('hidden');
        tabs.classList.add('flex');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    // Model tabs
    document.querySelectorAll('.model-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        const parent = btn.getAttribute('data-component-parent');
        // Reset siblings within same component
        document.querySelectorAll('[data-component-parent="' + parent + '"]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // Hide all panels in this component, show target
        document.querySelector('[data-component-section="' + parent + '"]').querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        document.getElementById(target).classList.add('active');
      });
    });
  </script>
</body>
</html>`;

const outputPath = join(__dirname, 'battle.html');
writeFileSync(outputPath, html);

console.log('\n' + '━'.repeat(60));
console.log('🥊 BATTLE READY!');
console.log('━'.repeat(60));
console.log('📂', outputPath);
console.log('');
console.log('👉 open ' + outputPath);
console.log('━'.repeat(60));
