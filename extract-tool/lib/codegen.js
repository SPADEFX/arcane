// Code Generation — transforms surgical extraction output into a clean React component.
// HTML → JSX (parse5 AST), CSS → scoped styles, WAAPI → Framer Motion variants, props detection.

const parse5 = require("parse5");

/**
 * @param {object} extraction — output from surgical-extract.js
 * @param {string} name — component name (PascalCase)
 * @returns {{ tsx: string, css: string, props: object[], defaultProps: object }}
 */
function generateComponent(extraction, name = "ExtractedSection") {
  const { html, scopedCss, wapiAnimations, transitions, cssVars, images } = extraction;

  // ── HTML → JSX ─────────────────────────────────────────────────────
  let jsx = htmlToJsx(html);

  // ── Detect props from content ──────────────────────────────────────
  const props = detectProps(jsx, images);

  // ── Replace hardcoded content with prop references ─────────────────
  let propsInterface = "";
  let propsDestructure = "";
  let defaultPropsObj = {};

  if (props.length > 0) {
    propsInterface = props.map(p => `  /** ${p.label} */\n  ${p.name}?: ${p.tsType};`).join("\n");
    propsDestructure = props.map(p => p.name).join(", ");
    props.forEach(p => { defaultPropsObj[p.name] = p.defaultValue; });

    for (const p of props) {
      if (p.type === "text" && p.defaultValue) {
        const escaped = escapeForRegex(p.defaultValue);
        jsx = jsx.replace(new RegExp(`>${escaped}<`), `>{${p.name}}<`);
      }
      if (p.type === "image" && p.defaultValue) {
        jsx = jsx.replace(`"${p.defaultValue}"`, `{${p.name}}`);
      }
      if (p.type === "href" && p.defaultValue) {
        jsx = jsx.replace(`"${p.defaultValue}"`, `{${p.name}}`);
      }
    }
  }

  // ── WAAPI → Framer Motion ──────────────────────────────────────────
  const hasAnimations = wapiAnimations && wapiAnimations.length > 0;
  let motionImport = "";
  let motionVariants = "";
  let wrapperTag = "div";
  let wrapperAnimProps = "";

  if (hasAnimations) {
    motionImport = 'import { motion, useReducedMotion as useFramerReducedMotion } from "motion/react";';
    motionVariants = wapiAnimationsToFramer(wapiAnimations);
    wrapperTag = "motion.div";
    // Apply the first animation variant to the wrapper
    wrapperAnimProps = `\n        initial="initial"\n        animate="animate"\n        variants={anim0}`;
  }

  // ── CSS variables injection ────────────────────────────────────────
  let cssVarStyle = "";
  if (cssVars && Object.keys(cssVars).length > 0) {
    const varDecls = Object.entries(cssVars)
      .map(([k, v]) => `"${k}": "${v}"`)
      .join(", ");
    cssVarStyle = `\n        style={{ ${varDecls} }}`;
  }

  // ── Scope class ───────────────────────────────────────────────────
  const scopeClass = `${camelToKebab(name)}-root`;
  const css = scopedCss || "";

  // ── Build component TSX ────────────────────────────────────────────
  const reducedMotionImport = hasAnimations
    ? ""
    : 'import { useReducedMotion } from "@uilibrary/hooks/use-reduced-motion";';

  const tsx = `"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@uilibrary/utils";
${hasAnimations ? motionImport : reducedMotionImport}

export interface ${name}Props extends HTMLAttributes<HTMLDivElement> {
${propsInterface || "  // No detected props — add your own"}
}

export const ${name} = forwardRef<HTMLDivElement, ${name}Props>(
  ({ ${propsDestructure ? propsDestructure + ", " : ""}className, ...rest }, ref) => {
    return (
      <${wrapperTag}
        ref={ref}
        className={cn("${scopeClass}", className)}${wrapperAnimProps}${cssVarStyle}
        {...rest}
      >
        ${jsx}
      </${wrapperTag}>
    );
  }
);
${name}.displayName = "${name}";
${motionVariants}`;

  return { tsx, css, props, defaultProps: defaultPropsObj };
}

// ── HTML → JSX (parse5 AST-based) ──────────────────────────────────────
//
// Rationale: chained regex replacements on raw HTML are fragile — they break
// on attribute order, embedded quotes, malformed input. We parse to an AST
// once, walk it, emit JSX. Single source of truth for attribute mapping.

const VOID_ELEMENTS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "source", "track", "wbr",
]);

const BOOLEAN_ATTRS = new Set([
  "disabled", "checked", "selected", "readonly", "required", "hidden",
  "autoplay", "muted", "loop", "controls", "open", "default", "reversed",
  "ismap", "novalidate", "formnovalidate", "playsinline", "autofocus",
]);

// HTML attr name → JSX attr name. Anything not listed passes through unchanged.
const ATTR_RENAME = {
  class: "className",
  for: "htmlFor",
  tabindex: "tabIndex",
  colspan: "colSpan",
  rowspan: "rowSpan",
  autocomplete: "autoComplete",
  autofocus: "autoFocus",
  contenteditable: "contentEditable",
  spellcheck: "spellCheck",
  crossorigin: "crossOrigin",
  enctype: "encType",
  formaction: "formAction",
  formenctype: "formEncType",
  formmethod: "formMethod",
  formnovalidate: "formNoValidate",
  formtarget: "formTarget",
  maxlength: "maxLength",
  minlength: "minLength",
  novalidate: "noValidate",
  readonly: "readOnly",
  srcset: "srcSet",
  srcdoc: "srcDoc",
  srclang: "srcLang",
  usemap: "useMap",
  accesskey: "accessKey",
  allowfullscreen: "allowFullScreen",
  charset: "charSet",
  hreflang: "hrefLang",
  inputmode: "inputMode",
  itemprop: "itemProp",
  itemscope: "itemScope",
  itemtype: "itemType",
  itemref: "itemRef",
  itemid: "itemID",
  marginheight: "marginHeight",
  marginwidth: "marginWidth",
  cellpadding: "cellPadding",
  cellspacing: "cellSpacing",
  frameborder: "frameBorder",
  scrolling: "scrolling",
  bgcolor: "bgColor",
  acceptcharset: "acceptCharset",
  longdesc: "longDesc",
  mediagroup: "mediaGroup",
};

// Escape a string so it's safe inside a JSX text node.
function jsxEscapeText(s) {
  return s.replace(/[{}<>]/g, (c) => `{"${c}"}`);
}

// Escape a string so it's safe inside a JSX attribute value (double-quoted).
function jsxEscapeAttr(s) {
  return s.replace(/"/g, "&quot;");
}

function isInternalMarker(attrName) {
  return /^data-mx-/.test(attrName);
}

function renderAttribute(attr) {
  const name = attr.name.toLowerCase();
  if (isInternalMarker(name)) return null;

  const jsxName = ATTR_RENAME[name] || (name.startsWith("data-") || name.startsWith("aria-") ? name : name);

  // Style string → object literal
  if (name === "style") {
    const obj = styleStringToObject(attr.value);
    return `${jsxName}={${JSON.stringify(obj)}}`;
  }

  // Boolean attribute (HTML allows valueless or empty-string)
  if (BOOLEAN_ATTRS.has(name) && (attr.value === "" || attr.value === name)) {
    return `${jsxName}={true}`;
  }

  return `${jsxName}="${jsxEscapeAttr(attr.value)}"`;
}

function renderNode(node, depth = 0) {
  // Text node
  if (node.nodeName === "#text") {
    return jsxEscapeText(node.value);
  }
  // Comment node → JSX comment
  if (node.nodeName === "#comment") {
    return `{/* ${node.data.replace(/\*\//g, "* /")} */}`;
  }
  // Document fragment / root — render children only
  if (node.nodeName === "#document-fragment" || node.nodeName === "#document") {
    return (node.childNodes || []).map((c) => renderNode(c, depth)).join("");
  }

  const tag = node.tagName;
  if (!tag) return "";

  // Render attributes
  const attrs = (node.attrs || [])
    .map(renderAttribute)
    .filter((s) => s !== null)
    .join(" ");
  const attrsStr = attrs ? " " + attrs : "";

  // Self-closing for void elements
  if (VOID_ELEMENTS.has(tag.toLowerCase())) {
    return `<${tag}${attrsStr} />`;
  }

  const children = (node.childNodes || []).map((c) => renderNode(c, depth + 1)).join("");
  return `<${tag}${attrsStr}>${children}</${tag}>`;
}

function htmlToJsx(html) {
  if (!html || !html.trim()) return "";
  // parseFragment because we get section-level HTML, not full documents.
  const fragment = parse5.parseFragment(html);
  return renderNode(fragment);
}

function styleStringToObject(styleStr) {
  const obj = {};
  for (const decl of styleStr.split(";")) {
    const idx = decl.indexOf(":");
    if (idx < 0) continue;
    const prop = decl.slice(0, idx).trim();
    const val = decl.slice(idx + 1).trim();
    if (!prop || !val) continue;
    const camelProp = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    obj[camelProp] = val;
  }
  return obj;
}

// ── Props detection ──────────────────────────────────────────────────

function detectProps(jsx, images) {
  const props = [];
  let propIdx = 0;

  // Headings
  const headingRegex = /<h([1-6])[^>]*>([^<]{3,120})<\/h[1-6]>/gi;
  let match;
  while ((match = headingRegex.exec(jsx)) !== null) {
    const level = match[1];
    const text = match[2].trim();
    if (text.length < 3) continue;
    const baseName = level === "1" ? "headline" : level === "2" ? "subheadline" : `heading${propIdx}`;
    const name = props.some(p => p.name === baseName) ? `${baseName}${propIdx}` : baseName;
    props.push({ name, type: "text", tsType: "string", label: `Heading ${level}`, defaultValue: text });
    propIdx++;
  }

  // Paragraphs (first 2)
  const pRegex = /<p[^>]*>([^<]{10,300})<\/p>/gi;
  let pCount = 0;
  while ((match = pRegex.exec(jsx)) !== null && pCount < 2) {
    const text = match[1].trim();
    const name = pCount === 0 ? "description" : `paragraph${pCount}`;
    props.push({ name, type: "text", tsType: "string", label: "Paragraph", defaultValue: text });
    pCount++; propIdx++;
  }

  // Buttons / links text (first 3)
  const btnRegex = /<(?:button|a)[^>]*>([^<]{2,60})<\/(?:button|a)>/gi;
  let btnCount = 0;
  while ((match = btnRegex.exec(jsx)) !== null && btnCount < 3) {
    const text = match[1].trim();
    if (text.length < 2) continue;
    const name = btnCount === 0 ? "ctaLabel" : `buttonLabel${btnCount}`;
    props.push({ name, type: "text", tsType: "string", label: "Button text", defaultValue: text });
    btnCount++; propIdx++;
  }

  // Images — prefer the images array (already resolved URLs) over src attributes in JSX
  // since JSX may contain long base64 data URIs that shouldn't become default prop values.
  const imageUrls = (images || [])
    .filter(img => img.url && !img.url.startsWith("data:"))
    .map(img => img.url);

  if (imageUrls.length > 0) {
    imageUrls.slice(0, 5).forEach((url, i) => {
      const name = i === 0 ? "imageSrc" : `image${i}Src`;
      props.push({ name, type: "image", tsType: "string", label: "Image URL", defaultValue: url });
      propIdx++;
    });
  } else {
    // Fallback: scan src attributes that look like real URLs (not data URIs)
    const imgRegex = /src="(https?:\/\/[^"]{4,300})"/gi;
    let imgCount = 0;
    while ((match = imgRegex.exec(jsx)) !== null && imgCount < 5) {
      const name = imgCount === 0 ? "imageSrc" : `image${imgCount}Src`;
      props.push({ name, type: "image", tsType: "string", label: "Image URL", defaultValue: match[1] });
      imgCount++; propIdx++;
    }
  }

  // External href links (first 3)
  const hrefRegex = /href="(https?:\/\/[^"]{4,300})"/gi;
  let hrefCount = 0;
  while ((match = hrefRegex.exec(jsx)) !== null && hrefCount < 3) {
    const name = hrefCount === 0 ? "ctaHref" : `link${hrefCount}Href`;
    props.push({ name, type: "href", tsType: "string", label: "Link URL", defaultValue: match[1] });
    hrefCount++; propIdx++;
  }

  return props;
}

// ── WAAPI → Framer Motion variants ──────────────────────────────────

function wapiAnimationsToFramer(animations) {
  if (!animations || animations.length === 0) return "";

  let code = "\n// Framer Motion variants — extracted from WAAPI animations\n";

  for (let i = 0; i < Math.min(animations.length, 8); i++) {
    const a = animations[i];
    const varName = `anim${i}`;
    const kfs = a.keyframes || [];
    if (kfs.length < 2) continue;

    const first = kfs[0];
    const last = kfs[kfs.length - 1];

    const initial = {};
    const animate = {};

    for (const [key, val] of Object.entries(first)) {
      if (key === "offset" || key === "easing" || key === "composite") continue;
      const camel = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      if (camel === "transform") parseTransform(val, initial);
      else initial[camel] = val;
    }
    for (const [key, val] of Object.entries(last)) {
      if (key === "offset" || key === "easing" || key === "composite") continue;
      const camel = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      if (camel === "transform") parseTransform(val, animate);
      else animate[camel] = val;
    }

    // Build intermediate keyframes for multi-stop animations
    const keyframesObj = {};
    if (kfs.length > 2) {
      const allProps = new Set(
        kfs.flatMap(kf => Object.keys(kf).filter(k => k !== "offset" && k !== "easing" && k !== "composite"))
      );
      for (const prop of allProps) {
        const camel = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        const vals = kfs.map(kf => {
          const v = kf[prop];
          if (v == null) return null;
          if (camel === "transform") {
            const t = {};
            parseTransform(v, t);
            return Object.keys(t).length === 1 ? Object.values(t)[0] : v;
          }
          return v;
        });
        if (vals.some(v => v != null)) {
          keyframesObj[camel] = vals.filter(v => v != null);
        }
      }
    }

    const dur = (a.duration || 300) / 1000;
    const delay = (a.delay || 0) / 1000;
    const iterations = a.timing?.iterations === Infinity || a.timing?.iterations === null
      ? "Infinity"
      : String(a.timing?.iterations ?? 1);

    const transition = {
      duration: dur,
      delay,
      ease: normalizeEasing(a.easing || a.timing?.easing || "ease"),
      ...(iterations !== "1" ? { repeat: "Infinity", repeatType: "loop" } : {}),
    };

    code += `const ${varName} = {\n`;
    code += `  initial: ${JSON.stringify(initial)},\n`;
    if (Object.keys(keyframesObj).length > 0) {
      code += `  animate: ${JSON.stringify(keyframesObj)},\n`;
    } else {
      code += `  animate: ${JSON.stringify(animate)},\n`;
    }
    code += `  transition: ${JSON.stringify(transition)},\n`;
    code += `};\n`;
  }

  return code;
}

function parseTransform(val, target) {
  if (!val || val === "none") return;

  // matrix3d(16 values)
  const mat3d = /matrix3d\(([^)]+)\)/.exec(val);
  if (mat3d) {
    // Extract translation from matrix3d (indices 12, 13, 14)
    const v = mat3d[1].split(",").map(n => parseFloat(n.trim()));
    if (v.length === 16) {
      if (v[12]) target.x = v[12];
      if (v[13]) target.y = v[13];
    }
    return;
  }

  // matrix(a,b,c,d,e,f) — 2D
  const mat = /\bmatrix\(([^)]+)\)/.exec(val);
  if (mat) {
    const v = mat[1].split(",").map(n => parseFloat(n.trim()));
    if (v.length === 6) {
      if (v[4]) target.x = v[4];
      if (v[5]) target.y = v[5];
      // Extract rotation from matrix if no separate rotate
      const angle = Math.atan2(v[1], v[0]) * (180 / Math.PI);
      if (Math.abs(angle) > 0.01) target.rotate = Math.round(angle * 100) / 100;
    }
    return;
  }

  // translate3d(x, y, z)
  const t3d = /translate3d\(([^,]+),\s*([^,]+),\s*([^)]+)\)/.exec(val);
  if (t3d) {
    const x = parseFloat(t3d[1]);
    const y = parseFloat(t3d[2]);
    if (x) target.x = x;
    if (y) target.y = y;
  }

  // translate(x[, y])
  const t2 = /(?<![a-zA-Z])translate\(([^,)]+)(?:,\s*([^)]+))?\)/.exec(val);
  if (t2) {
    const x = parseFloat(t2[1]);
    const y = t2[2] ? parseFloat(t2[2]) : 0;
    if (x) target.x = x;
    if (y) target.y = y;
  }

  // translateX / translateY
  const tx = /translateX\(([^)]+)\)/.exec(val);
  const ty = /translateY\(([^)]+)\)/.exec(val);
  if (tx) target.x = parseFloat(tx[1]) || 0;
  if (ty) target.y = parseFloat(ty[1]) || 0;

  // scale(x[, y]) — handles uniform and non-uniform
  const sc = /(?<![a-zA-Z])scale\(([^)]+)\)/.exec(val);
  if (sc) {
    const parts = sc[1].split(",").map(n => parseFloat(n.trim()));
    target.scale = parts[0] || 1;
    if (parts[1] !== undefined && parts[1] !== parts[0]) target.scaleY = parts[1];
  }
  const scx = /scaleX\(([^)]+)\)/.exec(val);
  const scy = /scaleY\(([^)]+)\)/.exec(val);
  if (scx && !sc) target.scaleX = parseFloat(scx[1]) || 1;
  if (scy && !sc) target.scaleY = parseFloat(scy[1]) || 1;

  // rotate / rotateZ
  const rot = /(?:rotate|rotateZ)\(([^)]+)\)/.exec(val);
  if (rot) {
    const rv = rot[1].trim();
    if (rv.endsWith("deg")) target.rotate = parseFloat(rv);
    else if (rv.endsWith("rad")) target.rotate = Math.round(parseFloat(rv) * (180 / Math.PI) * 100) / 100;
    else if (rv.endsWith("turn")) target.rotate = parseFloat(rv) * 360;
    else target.rotate = parseFloat(rv) || 0;
  }

  // skewX / skewY
  const skx = /skewX\(([^)]+)\)/.exec(val);
  const sky = /skewY\(([^)]+)\)/.exec(val);
  if (skx) target.skewX = parseFloat(skx[1]) || 0;
  if (sky) target.skewY = parseFloat(sky[1]) || 0;

  // perspective — pass through as string (Framer doesn't have a direct prop)
  const persp = /perspective\(([^)]+)\)/.exec(val);
  if (persp && Object.keys(target).length === 0) {
    target.perspective = parseFloat(persp[1]) || 0;
  }
}

function normalizeEasing(easing) {
  if (!easing) return "easeOut";
  if (easing.startsWith("cubic-bezier")) return easing;
  const map = {
    "linear": "linear",
    "ease": "easeInOut",
    "ease-in": "easeIn",
    "ease-out": "easeOut",
    "ease-in-out": "easeInOut",
    "step-start": "steps(1, start)",
    "step-end": "steps(1, end)",
  };
  return map[easing] || "easeOut";
}

// ── Utilities ────────────────────────────────────────────────────────

function camelToKebab(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

function escapeForRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports = { generateComponent };
