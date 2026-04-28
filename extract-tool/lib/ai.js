// Claude API wrapper for code conversion and section generation.
// Requires ANTHROPIC_API_KEY environment variable.
const https = require("https");

const API_HOST = "api.anthropic.com";
const API_PATH = "/v1/messages";
const MODEL = "claude-sonnet-4-20250514";

function getApiKey() {
  return process.env.ANTHROPIC_API_KEY || null;
}

async function callClaude(systemPrompt, userPrompt, maxTokens = 8192) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set. Export it as an env variable.");

  const body = JSON.stringify({
    model: MODEL,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: API_HOST,
      path: API_PATH,
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-length": Buffer.byteLength(body),
      },
    }, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          if (json.error) return reject(new Error(json.error.message || JSON.stringify(json.error)));
          const text = (json.content || []).map((b) => b.text || "").join("");
          resolve(text);
        } catch (e) { reject(e); }
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// Convert extracted HTML/CSS to a target language/framework.
async function convertCode(html, css, language) {
  const langMap = {
    react: "React (JSX + CSS modules or styled-components)",
    vue: "Vue 3 (Single File Component with <script setup>)",
    svelte: "Svelte (Single File Component)",
    tailwind: "HTML with Tailwind CSS classes (no custom CSS, only Tailwind utilities)",
    nextjs: "Next.js (App Router, TypeScript, Tailwind)",
    angular: "Angular (standalone component + template + SCSS)",
  };
  const targetDesc = langMap[language] || language;

  const system = `You are an expert frontend developer. Convert the provided HTML + CSS into ${targetDesc}.
Rules:
- Output ONLY the code, no explanations, no markdown fences.
- Preserve the exact visual appearance — same colors, spacing, fonts, layout.
- Use semantic, clean, idiomatic code for the target framework.
- If converting to Tailwind, map every CSS property to the closest Tailwind utility class.
- Keep animations/transitions faithful to the source.
- If the code uses CSS custom properties (--vars), preserve them.`;

  const userMsg = `Convert this to ${targetDesc}:\n\n--- HTML ---\n${html}\n\n--- CSS ---\n${css}`;
  return callClaude(system, userMsg, 16384);
}

// Generate a new section matching a site's design tokens.
async function generateSection(tokens, prompt, language) {
  const langMap = {
    html: "plain HTML + CSS",
    react: "React JSX + CSS",
    vue: "Vue 3 SFC",
    svelte: "Svelte",
    tailwind: "HTML + Tailwind CSS",
    nextjs: "Next.js + Tailwind",
  };
  const targetDesc = langMap[language] || "plain HTML + CSS";

  const tokenSummary = `Design Tokens:
- Colors: ${(tokens.colors || []).join(", ")}
- Fonts: ${(tokens.fonts || []).join(", ")}
- Font sizes: ${(tokens.fontSizes || []).join(", ")}
- Font weights: ${(tokens.fontWeights || []).join(", ")}
- Border radius: ${(tokens.borderRadius || []).join(", ")}
- Spacing: ${(tokens.spacing || []).join(", ")}
- Shadows: ${(tokens.shadows || []).join(", ")}
- Gradients: ${(tokens.gradients || []).slice(0, 5).join(", ")}
- Line heights: ${(tokens.lineHeights || []).join(", ")}`;

  const system = `You are an expert frontend developer and designer. Generate a new section that PERFECTLY matches the visual style described by the design tokens below. Use the EXACT same colors, fonts, spacing, border-radius, and shadows — the new section must look like it belongs on the same website.

${tokenSummary}

Rules:
- Output ONLY the code, no explanations, no markdown fences.
- Use ${targetDesc} as the output format.
- The section must be self-contained (works standalone).
- Use realistic placeholder content (not lorem ipsum — real words).
- Include responsive design (mobile-friendly).
- Match the visual density and whitespace of the source site.`;

  return callClaude(system, `Create this section: ${prompt}`, 16384);
}

module.exports = { callClaude, convertCode, generateSection, getApiKey };
