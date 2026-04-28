// Local code converter — no API needed. Handles HTML→React/Vue/Svelte
// syntax transformations. Less sophisticated than Claude but instant and free.

function htmlToReact(html, css) {
  let jsx = html
    // class → className
    .replace(/\bclass="/g, 'className="')
    .replace(/\bclass='/g, "className='")
    // for → htmlFor
    .replace(/\bfor="/g, 'htmlFor="')
    // Self-closing tags
    .replace(/<(img|br|hr|input|meta|link)([^>]*?)(?<!\/)>/gi, "<$1$2 />")
    // style="..." → style={{...}}
    .replace(/style="([^"]*)"/g, (_, s) => {
      const obj = s.split(";").filter(Boolean).map((d) => {
        const [k, ...v] = d.split(":");
        if (!k || !v.length) return null;
        const prop = k.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        const val = v.join(":").trim();
        const isNum = /^-?[\d.]+$/.test(val);
        return `${prop}: ${isNum ? val : `"${val}"`}`;
      }).filter(Boolean).join(", ");
      return `style={{${obj}}}`;
    })
    // tabindex → tabIndex
    .replace(/\btabindex=/gi, "tabIndex=")
    // onclick etc → onClick
    .replace(/\bon([a-z])/g, (_, c) => "on" + c.toUpperCase());

  return `import React from "react";

const styles = \`
${css}
\`;

export default function Section() {
  return (
    <>
      <style>{styles}</style>
      ${jsx}
    </>
  );
}
`;
}

function htmlToVue(html, css) {
  return `<template>
  ${html}
</template>

<script setup>
// Auto-generated from extracted HTML
</script>

<style scoped>
${css}
</style>
`;
}

function htmlToSvelte(html, css) {
  return `${html}

<style>
${css}
</style>
`;
}

function cssToTailwindApprox(html, css) {
  // Very basic: keep the HTML, add a comment with the CSS, note to convert manually
  return `<!-- Tailwind approximation — review and adjust classes -->
<!-- Original CSS preserved below for reference -->

${html}

<!--
Original CSS (convert to Tailwind utilities):
${css}
-->
`;
}

function convert(html, css, language) {
  switch (language) {
    case "react": return htmlToReact(html, css);
    case "vue": return htmlToVue(html, css);
    case "svelte": return htmlToSvelte(html, css);
    case "tailwind": return cssToTailwindApprox(html, css);
    case "nextjs": return htmlToReact(html, css).replace(
      'import React from "react"',
      '// Next.js App Router component\n"use client"'
    );
    default: return `${html}\n\n<style>\n${css}\n</style>`;
  }
}

module.exports = { convert };
