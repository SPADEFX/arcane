/**
 * 🤖 PIPELINE - Multi-agent prompt refinement + generation
 *
 * 6 stages:
 *  1. Brief Expander (Sonnet)    → JSON spec
 *  2. Prompt Architect (Opus)    → Master prompt v1
 *  3. Self-Critic (Gemini)       → Critiques
 *  4. Prompt Refiner (Opus)      → Master prompt v2
 *  5. Generator (Gemini)         → Component code
 *  6. Code Reviewer (Claude)     → Final polished code (with optional 1 retry loop)
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { claudeCode } from 'ai-sdk-provider-claude-code';
import { generateText } from 'ai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFileSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

// 💾 Persistence helper
function persistStage(runDir, stageNum, data) {
  try {
    mkdirSync(runDir, { recursive: true });
    writeFileSync(
      join(runDir, `stage-${stageNum}.json`),
      JSON.stringify(data, null, 2)
    );
  } catch (e) {
    console.error('Failed to persist stage:', e.message);
  }
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─── Helpers ────────────────────────────────────────────────────

function cleanCode(text) {
  return text
    .replace(/^```html\s*/i, '')
    .replace(/^```jsx?\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
}

function extractJSON(text) {
  // Try to extract JSON from markdown code blocks or raw text
  const jsonMatch = text.match(/```json\s*([\s\S]*?)```/i) || text.match(/```\s*([\s\S]*?)```/);
  const jsonStr = jsonMatch ? jsonMatch[1] : text;
  try {
    return JSON.parse(jsonStr.trim());
  } catch {
    // Fallback: try to find {...}
    const objMatch = text.match(/\{[\s\S]*\}/);
    if (objMatch) {
      try { return JSON.parse(objMatch[0]); } catch {}
    }
    return { raw: text };
  }
}

async function callClaude(model, system, prompt) {
  const result = await generateText({
    model: claudeCode(model),
    system,
    prompt,
  });
  return {
    text: result.text,
    tokens: (result.usage?.inputTokens || 0) + (result.usage?.outputTokens || 0),
  };
}

async function callGemini(modelName, system, prompt, maxTokens = 8192, attempt = 1) {
  const MAX_ATTEMPTS = 3;
  try {
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: system,
      generationConfig: {
        temperature: 0.85,
        maxOutputTokens: maxTokens,
      },
    });
    const result = await model.generateContent(prompt);
    return {
      text: result.response.text(),
      tokens: result.response.usageMetadata?.totalTokenCount || 0,
    };
  } catch (error) {
    const isRetryable =
      error.message?.includes('fetch failed') ||
      error.message?.includes('ECONNRESET') ||
      error.message?.includes('ETIMEDOUT') ||
      error.message?.includes('503') ||
      error.message?.includes('500') ||
      error.message?.includes('429');

    if (isRetryable && attempt < MAX_ATTEMPTS) {
      const delay = attempt * 2000; // 2s, 4s
      console.log(`  ⚠️  Gemini call failed (attempt ${attempt}/${MAX_ATTEMPTS}): ${error.message?.substring(0, 80)}`);
      console.log(`  ⏳ Retrying in ${delay/1000}s...`);
      await new Promise(r => setTimeout(r, delay));
      return callGemini(modelName, system, prompt, maxTokens, attempt + 1);
    }
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════
// STAGE 1 — BRIEF EXPANDER (Claude Sonnet)
// ═══════════════════════════════════════════════════════════════

const STAGE_1_SYSTEM = `You are a senior product designer with 10+ years of experience.
You take vague briefs and expand them into structured specifications.

Given a one-line brief, you produce a JSON spec with:
- componentType: the type of component (hero, pricing, features, etc.)
- persona: a specific user persona (name, age, role, what decision they're making)
- productContext: what kind of product this is for
- mood: 3-5 evocative adjectives
- visualReferences: 3-5 real product names whose style fits (linear.app, vercel.com, rauno.me, etc.)
- technicalRequirements: any specific tech mentioned (webgl, three.js, animation, etc.)
- contentRequirements: what must appear in the component
- constraints: design constraints (palette, layout, etc.)

Output ONLY valid JSON, no markdown fences, no commentary.`;

async function stage1_briefExpander(userBrief) {
  const prompt = `User brief: "${userBrief}"

Expand this into a structured spec. Be opinionated and specific.`;

  const { text, tokens } = await callClaude('sonnet', STAGE_1_SYSTEM, prompt);
  const json = extractJSON(text);
  return { json, raw: text, tokens };
}

// ═══════════════════════════════════════════════════════════════
// STAGE 2 — PROMPT ARCHITECT (Claude Opus)
// ═══════════════════════════════════════════════════════════════

const STAGE_2_SYSTEM = `You are an expert prompt engineer specializing in writing prompts for Gemini 3.1 Pro to generate UI components.

Your job: take a structured spec and write THE PERFECT prompt for Gemini.

Rules for excellent prompts:
1. Use XML structure: <role>, <context>, <task>, <constraints>, <acceptance_criteria>, <output_format>
2. Reference real products by name
3. Describe MOOD with evocative adjectives
4. Include 8+ specific constraints (sizes, colors, behaviors)
5. Add explicit anti-slop list (banned patterns)
6. Specify acceptance criteria as a checklist
7. Be EXTREMELY specific about output format (HTML/CSS/JS, no markdown fences)
8. Include micro-detail requirements (custom easings, hover states, focus rings)

The prompt you write will be sent DIRECTLY to Gemini 3.1 Pro to generate code.
Output ONLY the master prompt itself, nothing else. No "Here's the prompt:", just the prompt.`;

async function stage2_promptArchitect(spec) {
  const prompt = `Here's the structured spec:

${JSON.stringify(spec, null, 2)}

Write the master prompt for Gemini 3.1 Pro. Make it excellent.`;

  const { text, tokens } = await callClaude('opus', STAGE_2_SYSTEM, prompt);
  return { masterPrompt: text.trim(), tokens };
}

// ═══════════════════════════════════════════════════════════════
// STAGE 3 — SELF-CRITIC (Gemini)
// ═══════════════════════════════════════════════════════════════

const STAGE_3_SYSTEM = `You are Gemini 3.1 Pro. You will soon receive a prompt asking you to generate a UI component.

Before executing, your job NOW is to CRITIQUE that prompt. You know better than anyone what makes a good prompt for yourself.

For the prompt you'll be shown, identify:
- ambiguities: things that are unclear or open to interpretation
- missingContext: what additional info would help you produce A+ work
- conflicts: contradictions or conflicting constraints
- improvements: specific suggestions to make the prompt better
- score: 1-10 quality score of this prompt

Output ONLY valid JSON in this exact format:
{
  "score": 7,
  "ambiguities": ["...", "..."],
  "missingContext": ["...", "..."],
  "conflicts": ["..."],
  "improvements": ["...", "..."]
}

No markdown fences, just raw JSON.`;

async function stage3_selfCritic(masterPrompt) {
  const prompt = `Here is the prompt I'm about to receive. Critique it:

═══ START OF PROMPT ═══
${masterPrompt}
═══ END OF PROMPT ═══

Give your honest critique as JSON.`;

  // Cross-model: Sonnet critiques Opus's prompt (different POV than Opus itself)
  const { text, tokens } = await callClaude('sonnet', STAGE_3_SYSTEM, prompt);
  const json = extractJSON(text);
  return { critique: json, raw: text, tokens };
}

// ═══════════════════════════════════════════════════════════════
// STAGE 4 — PROMPT REFINER (Claude Opus)
// ═══════════════════════════════════════════════════════════════

const STAGE_4_SYSTEM = `You are an expert prompt engineer.
You take a master prompt and a list of critiques, and you produce an improved version of the prompt that addresses every critique.

Rules:
- Keep what works, fix what's flagged
- Add specifics where context was missing
- Resolve any conflicts
- Make ambiguities precise
- Maintain the XML structure

Output ONLY the improved master prompt. No commentary, no "Here's the improved version:", just the prompt itself.`;

async function stage4_promptRefiner(masterPromptV1, critique) {
  const prompt = `Original master prompt:

═══ START ═══
${masterPromptV1}
═══ END ═══

Critique to address:
${JSON.stringify(critique, null, 2)}

Rewrite the master prompt to fix all issues. Be ruthless.`;

  const { text, tokens } = await callClaude('opus', STAGE_4_SYSTEM, prompt);
  return { masterPromptV2: text.trim(), tokens };
}

// ═══════════════════════════════════════════════════════════════
// STAGE 5 — GENERATOR (Gemini 3.1 Pro)
// ═══════════════════════════════════════════════════════════════

const STAGE_5_SYSTEM = `You are an expert HTML/CSS/JS developer who creates premium UI components.

Output:
- Pure HTML with Tailwind CSS classes (use class= not className=)
- Inline <style> tags for custom animations/keyframes
- Inline <script> tags for interactivity (vanilla JS, three.js if needed via CDN)
- Just the markup, no <html>/<body> wrappers
- No markdown fences, no explanations, no "Here's the component:"
- Start directly with HTML
- Assume Tailwind CDN and these fonts loaded: Fraunces (serif), Inter (sans)
- For three.js: load from https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js`;

async function stage5_generator(masterPromptV2) {
  // Generator: Opus for max quality (Claude excels at UI Elo per benchmarks)
  const { text, tokens } = await callClaude('opus', STAGE_5_SYSTEM, masterPromptV2);
  return { code: cleanCode(text), tokens };
}

// ═══════════════════════════════════════════════════════════════
// STAGE 6 — CODE REVIEWER (Claude Opus)
// ═══════════════════════════════════════════════════════════════

const STAGE_6_SYSTEM = `You are a senior code reviewer specializing in premium UI components.

You review code generated by another AI model and:
1. Check if it actually works (syntax, no broken imports, valid three.js calls)
2. Check for AI slop (generic copy, predictable layouts, missing micro-details)
3. Check accessibility (ARIA, semantic HTML, keyboard nav)
4. Check responsiveness
5. Check if hover/focus states are present
6. Check if the original brief is respected

Then you classify severity:
- "high": broken code, missing core feature, brief not respected → needs regeneration
- "medium": works but has slop or quality issues → fix in place
- "low": minor polish needed → fix in place
- "none": already good → return as-is

Output ONLY this JSON format (no markdown fences):
{
  "severity": "low|medium|high|none",
  "issues": [
    { "type": "slop|bug|a11y|responsive|brief", "description": "...", "severity": "high|medium|low" }
  ],
  "summary": "one-line summary",
  "fixedCode": "the full corrected HTML code (only if severity is medium/low/none, otherwise empty string)"
}

For "fixedCode": output the COMPLETE corrected HTML with all fixes applied. Same format as input (no markdown fences).
If severity is "high", set fixedCode to empty string and the orchestrator will retry generation.`;

async function stage6_codeReviewer(originalBrief, generatedCode) {
  const prompt = `Original user brief: "${originalBrief}"

Generated code to review:

═══ CODE START ═══
${generatedCode}
═══ CODE END ═══

Review this code thoroughly. Output JSON with severity, issues, summary, and fixedCode.`;

  // Cross-model: Sonnet reviews Opus's generation (different POV)
  const { text, tokens } = await callClaude('sonnet', STAGE_6_SYSTEM, prompt);
  const json = extractJSON(text);
  return { review: json, raw: text, tokens };
}

// ═══════════════════════════════════════════════════════════════
// 🚀 MAIN PIPELINE
// ═══════════════════════════════════════════════════════════════

export async function runPipeline(userBrief, onProgress) {
  const startTotal = Date.now();
  const results = {};

  // 💾 Create unique run directory
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const runDir = join(__dirname, 'runs', timestamp);
  mkdirSync(runDir, { recursive: true });
  writeFileSync(join(runDir, 'brief.txt'), userBrief);
  console.log(`💾 Run dir: ${runDir}`);

  const emit = (stage, data) => {
    // Persist on every "done" status
    if (typeof stage === 'number' && data.status === 'done') {
      persistStage(runDir, stage, data);
    }
    if (stage === 'done') {
      writeFileSync(join(runDir, 'final.html'), data.finalCode || '');
      writeFileSync(join(runDir, 'summary.json'), JSON.stringify(data, null, 2));
    }
    if (onProgress) onProgress(stage, data);
  };

  // ─── STAGE 1 ──────────────────────────────────────
  emit(1, { status: 'running', label: 'Brief Expander', model: 'Claude Sonnet 4.6' });
  const t1 = Date.now();
  try {
    const r1 = await stage1_briefExpander(userBrief);
    results.stage1 = {
      status: 'done',
      duration: ((Date.now() - t1) / 1000).toFixed(1),
      tokens: r1.tokens,
      model: 'Claude Sonnet 4.6',
      label: 'Brief Expander',
      input: userBrief,
      output: r1.json,
      raw: r1.raw,
    };
    emit(1, results.stage1);
  } catch (e) {
    results.stage1 = { status: 'failed', error: e.message };
    emit(1, results.stage1);
    throw e;
  }

  // ─── STAGE 2 ──────────────────────────────────────
  emit(2, { status: 'running', label: 'Prompt Architect', model: 'Claude Opus 4.6' });
  const t2 = Date.now();
  try {
    const r2 = await stage2_promptArchitect(results.stage1.output);
    results.stage2 = {
      status: 'done',
      duration: ((Date.now() - t2) / 1000).toFixed(1),
      tokens: r2.tokens,
      model: 'Claude Opus 4.6',
      label: 'Prompt Architect',
      input: results.stage1.output,
      output: r2.masterPrompt,
    };
    emit(2, results.stage2);
  } catch (e) {
    results.stage2 = { status: 'failed', error: e.message };
    emit(2, results.stage2);
    throw e;
  }

  // ─── STAGE 3 ──────────────────────────────────────
  emit(3, { status: 'running', label: 'Self-Critic', model: 'Gemini 3.1 Pro' });
  const t3 = Date.now();
  try {
    const r3 = await stage3_selfCritic(results.stage2.output);
    results.stage3 = {
      status: 'done',
      duration: ((Date.now() - t3) / 1000).toFixed(1),
      tokens: r3.tokens,
      model: 'Claude Sonnet 4.6',
      label: 'Self-Critic',
      input: results.stage2.output,
      output: r3.critique,
    };
    emit(3, results.stage3);
  } catch (e) {
    results.stage3 = { status: 'failed', error: e.message };
    emit(3, results.stage3);
    throw e;
  }

  // ─── STAGE 4 ──────────────────────────────────────
  emit(4, { status: 'running', label: 'Prompt Refiner', model: 'Claude Opus 4.6' });
  const t4 = Date.now();
  try {
    const r4 = await stage4_promptRefiner(results.stage2.output, results.stage3.output);
    results.stage4 = {
      status: 'done',
      duration: ((Date.now() - t4) / 1000).toFixed(1),
      tokens: r4.tokens,
      model: 'Claude Opus 4.6',
      label: 'Prompt Refiner',
      input: { v1: results.stage2.output, critique: results.stage3.output },
      output: r4.masterPromptV2,
    };
    emit(4, results.stage4);
  } catch (e) {
    results.stage4 = { status: 'failed', error: e.message };
    emit(4, results.stage4);
    throw e;
  }

  // ─── STAGE 5 ──────────────────────────────────────
  emit(5, { status: 'running', label: 'Generator', model: 'Gemini 3.1 Pro' });
  const t5 = Date.now();
  try {
    const r5 = await stage5_generator(results.stage4.output);
    results.stage5 = {
      status: 'done',
      duration: ((Date.now() - t5) / 1000).toFixed(1),
      tokens: r5.tokens,
      model: 'Claude Opus 4.6',
      label: 'Generator',
      input: results.stage4.output,
      output: r5.code,
    };
    emit(5, results.stage5);
  } catch (e) {
    results.stage5 = { status: 'failed', error: e.message };
    emit(5, results.stage5);
    throw e;
  }

  // ─── STAGE 6 ──────────────────────────────────────
  emit(6, { status: 'running', label: 'Code Reviewer', model: 'Claude Opus 4.6' });
  const t6 = Date.now();
  try {
    const r6 = await stage6_codeReviewer(userBrief, results.stage5.output);
    let finalCode = r6.review.fixedCode || results.stage5.output;
    let retried = false;

    // Hybrid: retry once if severity is high
    if (r6.review.severity === 'high') {
      emit(6, {
        status: 'retrying',
        label: 'Code Reviewer',
        model: 'Claude Opus 4.6',
        message: 'High severity issues found, regenerating...',
      });

      // Build feedback for Gemini regeneration
      const feedback = `Previous attempt had these issues:\n${JSON.stringify(r6.review.issues, null, 2)}\n\nFix them and regenerate.`;
      const retryPrompt = results.stage4.output + '\n\n' + feedback;
      const retryGen = await stage5_generator(retryPrompt);
      finalCode = retryGen.code;
      retried = true;

      // Re-review after retry
      const r6retry = await stage6_codeReviewer(userBrief, finalCode);
      if (r6retry.review.fixedCode) finalCode = r6retry.review.fixedCode;
    }

    results.stage6 = {
      status: 'done',
      duration: ((Date.now() - t6) / 1000).toFixed(1),
      tokens: r6.tokens,
      model: 'Claude Sonnet 4.6',
      label: 'Code Reviewer',
      input: results.stage5.output,
      output: r6.review,
      retried,
      finalCode,
    };
    emit(6, results.stage6);
  } catch (e) {
    results.stage6 = { status: 'failed', error: e.message };
    emit(6, results.stage6);
    throw e;
  }

  // ─── DONE ──────────────────────────────────────
  const totalDuration = ((Date.now() - startTotal) / 1000).toFixed(1);
  emit('done', {
    totalDuration,
    finalCode: results.stage6.finalCode,
    results,
  });

  return results;
}
