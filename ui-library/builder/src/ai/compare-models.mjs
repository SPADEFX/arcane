/**
 * 🆚 COMPARISON - Flash vs 3.1 Pro Preview
 *
 * Lance le même brief sur les 2 modèles et génère un fichier HTML
 * avec les 2 résultats côte à côte pour que tu juges la qualité.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🎨 SYSTEM PROMPT - beaucoup plus exigeant que la version 1
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

const models = [
  { name: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash (free)', color: '#94a3b8' },
  { name: 'gemini-3.1-pro-preview', label: 'Gemini 3.1 Pro Preview', color: '#10b981' },
];

console.log('🚀 Generating with both models...\n');

const results = [];

for (const m of models) {
  console.log(`📡 ${m.label}...`);
  const startTime = Date.now();

  try {
    const model = genAI.getGenerativeModel({
      model: m.name,
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 8192,
      },
    });

    const result = await model.generateContent([SYSTEM, BRIEF]);
    const response = result.response;
    let html = response.text();

    // Clean markdown fences
    html = html.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    const usage = response.usageMetadata;

    results.push({
      ...m,
      html,
      duration,
      tokens: usage?.totalTokenCount || 0,
    });

    console.log(`   ✅ ${duration}s · ${usage?.totalTokenCount} tokens\n`);
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}\n`);
    results.push({ ...m, html: `<div class="p-12 text-red-500">Error: ${error.message}</div>`, duration: 0, tokens: 0 });
  }
}

// 🎨 Build comparison HTML
const comparisonHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Gemini Flash vs 3.1 Pro Comparison</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@300;400;700;900&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; background: #f4f4f5; }
    .font-serif { font-family: 'Fraunces', Georgia, serif; }
    .compare-label {
      position: sticky;
      top: 0;
      z-index: 50;
      backdrop-filter: blur(12px);
      background: rgba(255,255,255,0.9);
      border-bottom: 1px solid #e4e4e7;
    }
  </style>
</head>
<body>
  <div class="max-w-[1800px] mx-auto p-6">
    <h1 class="text-3xl font-serif font-bold mb-2">Gemini Flash vs 3.1 Pro</h1>
    <p class="text-zinc-600 mb-8">Same brief, same system prompt, different models. Judge for yourself.</p>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      ${results.map(r => `
        <div class="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
          <div class="compare-label p-4 flex items-center justify-between">
            <div>
              <div class="font-bold text-sm" style="color: ${r.color}">${r.label}</div>
              <div class="text-xs text-zinc-500 font-mono">${r.duration}s · ${r.tokens} tokens</div>
            </div>
          </div>
          <div class="border-t border-zinc-100">
            ${r.html}
          </div>
        </div>
      `).join('')}
    </div>

    <div class="mt-8 p-6 bg-white rounded-2xl border border-zinc-200">
      <h3 class="font-bold mb-2">📋 Brief utilisé:</h3>
      <pre class="text-xs text-zinc-600 whitespace-pre-wrap font-mono">${BRIEF}</pre>
    </div>
  </div>
</body>
</html>`;

const outputPath = join(__dirname, 'comparison.html');
writeFileSync(outputPath, comparisonHTML);

console.log('━'.repeat(60));
console.log('🎨 COMPARISON READY!');
console.log('━'.repeat(60));
console.log('📂', outputPath);
console.log('');
console.log('👉 open ' + outputPath);
console.log('━'.repeat(60));
