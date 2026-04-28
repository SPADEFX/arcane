// Multi-pass synthesis. Each pass loads the page in a fresh tab and produces
// its own capture. Elements are identified across passes by a stable CSS-path
// (computed in capture.js → `stablePath`). For each path, we pick the pass
// with the highest-confidence animation binding and transplant its keyframes
// into the baseline output.
//
// Scoring priorities (higher = better):
//   • animate-hook source    +80   (WAAPI spec, declared by JS)
//   • isLoopClean verified   +100  (period empirically verified)
//   • more keyframe stops    +min(60, stopCount)
//   • mutation-analyzer      +20
//   • sampler                +10
//   • waapi-synth            + 5
//
// The baseline (last run) provides HTML structure, stylesheet rules, node
// metadata. Only animation rules and keyframes get swapped per-element.

function scoreBinding(b) {
  let s = 0;
  if (b.isLoopClean) s += 100;
  s += Math.min(60, b.stopCount || 0);
  switch (b.source) {
    case "animate-hook":      s += 80; break;
    case "mutation-analyzer": s += 20; break;
    case "sampler":           s += 10; break;
    case "waapi-synth":       s += 5;  break;
  }
  return s;
}

function mergeRuns(runs) {
  if (!runs || runs.length === 0) return null;
  if (runs.length === 1) return runs[0];

  // Deep-clone the baseline (last run) — we'll mutate its keyframes + rules.
  const baseline = JSON.parse(JSON.stringify(runs[runs.length - 1]));
  const baselineIdx = runs.length - 1;

  // Map: path → [{ runIdx, binding }, ...] across ALL runs
  const byPath = new Map();
  for (let i = 0; i < runs.length; i++) {
    for (const b of (runs[i].animationBindings || [])) {
      if (!b.path) continue;
      const arr = byPath.get(b.path) || [];
      arr.push({ runIdx: i, binding: b });
      byPath.set(b.path, arr);
    }
  }

  // Paths that exist in the baseline — we can only swap for these (the
  // baseline's DOM has the selector we target; we can't add a binding for
  // an element that isn't identified in the baseline).
  const baselineByPath = new Map();
  for (const b of (baseline.animationBindings || [])) {
    if (b.path) baselineByPath.set(b.path, b);
  }

  let swapsApplied = 0;
  let pathsConsidered = 0;

  for (const [path, candidates] of byPath) {
    pathsConsidered++;
    candidates.sort((a, b) => scoreBinding(b.binding) - scoreBinding(a.binding));
    const best = candidates[0];
    if (best.runIdx === baselineIdx) continue; // baseline already wins

    const baselineBinding = baselineByPath.get(path);
    if (!baselineBinding) continue; // path not in baseline — can't target

    const bestScore = scoreBinding(best.binding);
    const baselineScore = scoreBinding(baselineBinding);
    if (bestScore <= baselineScore) continue; // baseline is as good or better

    const bestRun = runs[best.runIdx];
    const nameMap = {};
    for (const kfName of (best.binding.keyframeNames || [])) {
      if (!kfName || !bestRun.keyframes[kfName]) continue;
      // Prefix to avoid collisions with baseline's keyframes namespace.
      const newName = `r${best.runIdx}_${kfName}`;
      baseline.keyframes[newName] = bestRun.keyframes[kfName];
      nameMap[kfName] = newName;
    }
    if (Object.keys(nameMap).length === 0) continue;

    // Rewrite the baseline rule that targets this element.
    const targetSelector = baselineBinding.selector;
    const bestRuleInBestRun = (bestRun.cssRules || []).find((r) => r.selector === best.binding.selector);
    if (!bestRuleInBestRun) continue;

    // Replace every best-run keyframe name in the cssText with the prefixed
    // version we just imported into the baseline.
    let newCssText = bestRuleInBestRun.cssText;
    for (const [oldName, newName] of Object.entries(nameMap)) {
      newCssText = newCssText.replace(new RegExp("\\b" + oldName + "\\b", "g"), newName);
    }

    // Find and overwrite the baseline rule.
    for (const rule of baseline.cssRules) {
      if (rule.selector === targetSelector && /animation\s*:/i.test(rule.cssText)) {
        rule.cssText = newCssText;
        swapsApplied++;
        break;
      }
    }
  }

  baseline.merge = {
    passes: runs.length,
    pathsConsidered,
    swapsApplied,
  };
  return baseline;
}

module.exports = { mergeRuns, scoreBinding };
