/**
 * 🍌 NANO BANANA PRO TEST - Generate a hero background image
 *
 * Uses gemini-3-pro-image-preview (Nano Banana Pro)
 * Cost: ~$0.12 per image
 */

import dotenv from 'dotenv';
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

const KEY = process.env.GEMINI_API_KEY;
const MODEL = 'gemini-3-pro-image-preview';

const PROMPT = `A cinematic, dark, premium background for a luxury SaaS landing page hero section.
Aesthetic: editorial, mysterious, sophisticated.
Visual: deep midnight navy and charcoal gradients, soft volumetric light beams from upper left, subtle particle dust floating in light, distant out-of-focus city lights as bokeh in the background.
Composition: cinematic 16:9, leaving the center-left area dark and clean for headline text overlay.
Mood: cold restraint, expensive, like the opening shot of a Christopher Nolan film.
Style: photographic, no text, no logos, no UI elements. High detail, 8K cinematic quality.`;

console.log('🍌 Calling Nano Banana Pro...\n');
console.log('📝 Prompt:', PROMPT.substring(0, 100) + '...\n');

const startTime = Date.now();

try {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: PROMPT }] }],
        generationConfig: {
          responseModalities: ['IMAGE'],
        },
      }),
    }
  );

  const data = await res.json();
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  if (data.error) {
    console.error('❌ Error:', data.error.message);
    console.error('Full error:', JSON.stringify(data.error, null, 2));
    process.exit(1);
  }

  // Find the image in the response
  const parts = data.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find((p) => p.inlineData?.mimeType?.startsWith('image/'));

  if (!imagePart) {
    console.error('❌ No image in response');
    console.log('Response:', JSON.stringify(data, null, 2).substring(0, 1500));
    process.exit(1);
  }

  // Save image
  const outputDir = join(__dirname, 'generated-assets');
  mkdirSync(outputDir, { recursive: true });
  const ext = imagePart.inlineData.mimeType.split('/')[1] || 'png';
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outPath = join(outputDir, `hero-bg-${timestamp}.${ext}`);
  writeFileSync(outPath, Buffer.from(imagePart.inlineData.data, 'base64'));

  console.log('✅ Success!');
  console.log('⏱️  Duration:', duration + 's');
  console.log('📊 Tokens (prompt):', data.usageMetadata?.promptTokenCount || 'N/A');
  console.log('📊 Tokens (output):', data.usageMetadata?.candidatesTokenCount || 'N/A');
  console.log('📊 Total tokens:', data.usageMetadata?.totalTokenCount || 'N/A');
  console.log('💰 Estimated cost: ~$0.12');
  console.log('');
  console.log('📂 Saved to:', outPath);
  console.log('');
  console.log('👉 open', outPath);
} catch (error) {
  console.error('❌ Network error:', error.message);
  process.exit(1);
}
