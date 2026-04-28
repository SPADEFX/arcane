// Code Generation — transforms surgical extraction output into a clean React component.
// HTML → JSX, CSS → scoped styles, WAAPI → Framer Motion, props detection.

/**
 * @param {object} extraction — output from surgical-extract.js
 * @param {string} name — component name (PascalCase)
 * @returns {{ tsx: string, css: string, props: object[] }}
 */
function generateComponent(extraction, name = "ExtractedSection") {
  const { html, scopedCss, wapiAnimations, transitions, cssVars, images } = extraction;

  // ── HTML → JSX ─────────────────────────────────────────────────────
  let jsx = htmlToJsx(html);

  // ── Detect props from content ──────────────────────────────────────
  const props = detectProps(jsx);

  // ── Replace hardcoded content with prop references ─────────────────
  let propsInterface = "";
  let propsDestructure = "";
  let defaultPropsObj = {};

  if (props.length > 0) {
    // Build interface
    propsInterface = props.map(p => `  /** ${p.label} */\n  ${p.name}?: ${p.tsType};`).join("\n");
    propsDestructure = props.map(p => p.name).join(", ");
    defaultPropsObj = {};
    props.forEach(p => { defaultPropsObj[p.name] = p.defaultValue; });

    // Replace content in JSX with prop references
    for (const p of props) {
      if (p.type === "text" && p.defaultValue) {
        // Replace first occurrence of the default value with {propName}
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
  let motionImport = "";
  let motionCode = "";
  if (wapiAnimations && wapiAnimations.length > 0) {
    motionImport = 'import { motion } from "motion/react";';
    motionCode = wapiAnimationsToFramer(wapiAnimations);
  }

  // ── Build CSS module ───────────────────────────────────────────────
  // Scope all selectors by wrapping in a container class
  const scopeClass = `${camelToKebab(name)}-root`;
  let css = scopedCss || "";

  // ── Build the component TSX ────────────────────────────────────────
  const tsx = `"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@uilibrary/utils";
import { useReducedMotion } from "@uilibrary/hooks/use-reduced-motion";
${motionImport}

export interface ${name}Props extends HTMLAttributes<HTMLDivElement> {
${propsInterface || "  // No detected props — add your own"}
}

export const ${name} = forwardRef<HTMLDivElement, ${name}Props>(
  ({ ${propsDestructure ? propsDestructure + ", " : ""}className, ...rest }, ref) => {
    const prefersReduced = useReducedMotion();

    return (
      <div ref={ref} className={cn("${scopeClass}", className)} {...rest}>
        ${jsx}
      </div>
    );
  }
);
${name}.displayName = "${name}";
${motionCode}`;

  return {
    tsx,
    css,
    props,
    defaultProps: defaultPropsObj,
  };
}

// ── HTML → JSX conversion ────────────────────────────────────────────

function htmlToJsx(html) {
  let jsx = html;

  // Self-closing void elements
  const voids = ["img", "br", "hr", "input", "meta", "link", "area", "base", "col", "embed", "source", "track", "wbr"];
  for (const tag of voids) {
    jsx = jsx.replace(new RegExp(`<${tag}([^>]*?)(?<!/)>`, "gi"), `<${tag}$1 />`);
  }

  // class → className
  jsx = jsx.replace(/\bclass="/g, 'className="');
  jsx = jsx.replace(/\bclass='/g, "className='");

  // for → htmlFor
  jsx = jsx.replace(/\bfor="/g, 'htmlFor="');

  // tabindex → tabIndex
  jsx = jsx.replace(/\btabindex="/g, 'tabIndex="');

  // colspan → colSpan, rowspan → rowSpan
  jsx = jsx.replace(/\bcolspan="/g, 'colSpan="');
  jsx = jsx.replace(/\browspan="/g, 'rowSpan="');

  // autocomplete → autoComplete
  jsx = jsx.replace(/\bautocomplete="/g, 'autoComplete="');

  // style="..." → style={{ ... }}
  jsx = jsx.replace(/\bstyle="([^"]*)"/g, (match, styleStr) => {
    const obj = styleStringToObject(styleStr);
    return `style={${JSON.stringify(obj)}}`;
  });

  // Remove data-mx-* attributes (our internal markers)
  jsx = jsx.replace(/\s*data-mx-[\w-]+="[^"]*"/g, "");

  // Boolean attributes
  jsx = jsx.replace(/\b(disabled|checked|selected|readonly|required|hidden|autoplay|muted|loop|controls)(?=[\s>])/g, '$1={true}');

  // Comments
  jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');

  return jsx;
}

function styleStringToObject(styleStr) {
  const obj = {};
  const declarations = styleStr.split(";").filter(Boolean);
  for (const decl of declarations) {
    const idx = decl.indexOf(":");
    if (idx < 0) continue;
    const prop = decl.slice(0, idx).trim();
    const val = decl.slice(idx + 1).trim();
    if (!prop || !val) continue;
    // Convert CSS prop to camelCase
    const camelProp = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    obj[camelProp] = val;
  }
  return obj;
}

// ── Props detection ──────────────────────────────────────────────────

function detectProps(jsx) {
  const props = [];
  let propIdx = 0;

  // Detect heading text content
  const headingRegex = /<h([1-6])[^>]*>([^<]{3,80})<\/h[1-6]>/gi;
  let match;
  while ((match = headingRegex.exec(jsx)) !== null) {
    const level = match[1];
    const text = match[2].trim();
    if (text.length < 3) continue;
    const name = level === "1" ? "headline" : level === "2" ? "subheadline" : `heading${propIdx}`;
    props.push({
      name: props.some(p => p.name === name) ? name + propIdx : name,
      type: "text",
      tsType: "string",
      label: `Heading ${level} text`,
      defaultValue: text,
    });
    propIdx++;
  }

  // Detect paragraph text (first 2 paragraphs only)
  const pRegex = /<p[^>]*>([^<]{10,200})<\/p>/gi;
  let pCount = 0;
  while ((match = pRegex.exec(jsx)) !== null && pCount < 2) {
    const text = match[1].trim();
    props.push({
      name: pCount === 0 ? "description" : `paragraph${pCount}`,
      type: "text",
      tsType: "string",
      label: "Paragraph text",
      defaultValue: text,
    });
    pCount++;
    propIdx++;
  }

  // Detect button/link text
  const btnRegex = /<(?:button|a)[^>]*>([^<]{2,40})<\/(?:button|a)>/gi;
  let btnCount = 0;
  while ((match = btnRegex.exec(jsx)) !== null && btnCount < 3) {
    const text = match[1].trim();
    if (text.length < 2) continue;
    props.push({
      name: btnCount === 0 ? "ctaLabel" : `buttonLabel${btnCount}`,
      type: "text",
      tsType: "string",
      label: "Button/link text",
      defaultValue: text,
    });
    btnCount++;
    propIdx++;
  }

  // Detect images
  const imgRegex = /src="(https?:\/\/[^"]+)"/gi;
  let imgCount = 0;
  while ((match = imgRegex.exec(jsx)) !== null && imgCount < 5) {
    props.push({
      name: imgCount === 0 ? "imageSrc" : `image${imgCount}Src`,
      type: "image",
      tsType: "string",
      label: "Image source",
      defaultValue: match[1],
    });
    imgCount++;
    propIdx++;
  }

  // Detect links
  const hrefRegex = /href="(https?:\/\/[^"]+)"/gi;
  let hrefCount = 0;
  while ((match = hrefRegex.exec(jsx)) !== null && hrefCount < 3) {
    props.push({
      name: hrefCount === 0 ? "ctaHref" : `link${hrefCount}Href`,
      type: "href",
      tsType: "string",
      label: "Link URL",
      defaultValue: match[1],
    });
    hrefCount++;
    propIdx++;
  }

  return props;
}

// ── WAAPI → Framer Motion ────────────────────────────────────────────

function wapiAnimationsToFramer(animations) {
  if (!animations || animations.length === 0) return "";

  let code = "\n// Framer Motion variants extracted from WAAPI animations\n";
  for (let i = 0; i < animations.length; i++) {
    const a = animations[i];
    const varName = `anim${i}`;
    const kfs = a.keyframes || [];
    if (kfs.length < 2) continue;

    const first = kfs[0];
    const last = kfs[kfs.length - 1];

    // Build initial and animate objects
    const initial = {};
    const animate = {};

    for (const [key, val] of Object.entries(first)) {
      if (key === "offset" || key === "easing") continue;
      const camel = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      // Map web animation props to Framer props
      if (camel === "transform") {
        parseTransform(val, initial);
      } else {
        initial[camel] = val;
      }
    }
    for (const [key, val] of Object.entries(last)) {
      if (key === "offset" || key === "easing") continue;
      const camel = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      if (camel === "transform") {
        parseTransform(val, animate);
      } else {
        animate[camel] = val;
      }
    }

    const dur = (a.duration || 300) / 1000;
    const delay = (a.delay || 0) / 1000;

    code += `const ${varName} = {\n`;
    code += `  initial: ${JSON.stringify(initial)},\n`;
    code += `  animate: ${JSON.stringify(animate)},\n`;
    code += `  transition: { duration: ${dur}, delay: ${delay}, ease: ${JSON.stringify(a.easing || "easeOut")} },\n`;
    code += `};\n`;
  }
  return code;
}

function parseTransform(val, target) {
  if (!val || val === "none") return;
  const translateX = /translateX\(([^)]+)\)/.exec(val);
  const translateY = /translateY\(([^)]+)\)/.exec(val);
  const scale = /scale\(([^)]+)\)/.exec(val);
  const rotate = /rotate\(([^)]+)\)/.exec(val);
  if (translateX) target.x = parseFloat(translateX[1]) || 0;
  if (translateY) target.y = parseFloat(translateY[1]) || 0;
  if (scale) target.scale = parseFloat(scale[1]) || 1;
  if (rotate) target.rotate = parseFloat(rotate[1]) || 0;
}

// ── Utilities ────────────────────────────────────────────────────────

function camelToKebab(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

function escapeForRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports = { generateComponent };
