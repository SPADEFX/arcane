# Yui reference library

Drop motion JSON files in this folder. Any file matching `motion-*.json` is
auto-discovered by Vite and rendered in the **Motions → Reference** tab via the
generic `YuiJsonTile` component.

## How to populate this folder

The repo includes an extraction script at `tools/extract-yui.js`. From that
folder, install puppeteer and run it pointing at the source pages you have
permission to mirror. The script writes one JSON per motion to its own `out/`
folder; copy whichever you want into this folder.

```bash
cd tools
npm install puppeteer
node extract-yui.js 1 55     # capture motions 1..55
cp out/motion-*.json ../shader-lab/src/pages/motions/yui-reference/
```

## JSON schema

Each file looks like:

```jsonc
{
  "url":   "...",
  "bodyHTML": "...",                      // HTML snapshot of the page body
  "keyframes": { "anim-xxx": [ { "keyText": "0%", "cssText": "..." }, ... ] },
  "nodes": [
    {
      "i": 0,                             // walk index in body *
      "tag": "div",
      "cls": "css-xxx",
      "styles": { "background": "...", "transform": "..." },
      "vars":   { "--gap": "24px" },
      "animations": [...]
    }
  ]
}
```

`YuiJsonTile` reads this shape directly — no per-motion code is required.
