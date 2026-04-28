import type { Meta, StoryObj } from "@storybook/react";

// Extracted component — rendered via raw HTML + scoped CSS in Shadow DOM
function ExtractedSectionPreview() {
  return (
    <div
      ref={(el) => {
        if (!el) return;
        let shadow = el.shadowRoot;
        if (!shadow) shadow = el.attachShadow({ mode: "open" });
        shadow.innerHTML = `<style>:host {
  --font-geist-numbers: "geistNumbers";
  --font-suisse: "suisse","suisse Fallback";
  --typography-code: #131316;
  --typography-heading: #131316;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: #3b82f680;
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
}

@font-face { font-family: geistSans; src: url("../media/GeistVF.70416cc0.woff2") format("woff2"); font-display: swap; }

@font-face { font-family: geistMono; src: url("../media/GeistMonoVF.f130cd20.woff2") format("woff2"); font-display: swap; }

@font-face { font-family: geistNumbers; src: url("../media/GeistVariableVF_numbers.p.0c4219ec.woff2") format("woff2"); font-display: swap; }

@font-face { font-family: suisse; src: url("../media/SuisseIntl_Bold-s.p.d1f0186f.woff2") format("woff2"); font-display: swap; font-weight: 700; font-style: normal; }

@font-face { font-family: suisse; src: url("../media/SuisseIntl_BoldItalic-s.p.b8ac4d5e.woff2") format("woff2"); font-display: swap; font-weight: 700; font-style: italic; }

@font-face { font-family: suisse; src: url("../media/SuisseIntl_SemiBold-s.p.23c22dd6.woff2") format("woff2"); font-display: swap; font-weight: 600; font-style: normal; }

@font-face { font-family: suisse; src: url("../media/SuisseIntl_SemiBoldItalic-s.p.ab699982.woff2") format("woff2"); font-display: swap; font-weight: 600; font-style: italic; }

@font-face { font-family: suisse; src: url("../media/SuisseIntl_Medium-s.p.30660eee.woff2") format("woff2"); font-display: swap; font-weight: 500; font-style: normal; }

@font-face { font-family: suisse; src: url("../media/SuisseIntl_MediumItalic-s.p.17af4928.woff2") format("woff2"); font-display: swap; font-weight: 500; font-style: italic; }

@font-face { font-family: suisse; src: url("../media/SuisseIntl_Book-s.p.699687dc.woff2") format("woff2"); font-display: swap; font-weight: 450; font-style: normal; }

@font-face { font-family: suisse; src: url("../media/SuisseIntl_BookItalic-s.p.88eb5cd9.woff2") format("woff2"); font-display: swap; font-weight: 450; font-style: italic; }

@font-face { font-family: suisse; src: url("../media/SuisseIntl_Regular-s.p.1479d0fb.woff2") format("woff2"); font-display: swap; font-weight: 400; font-style: normal; }

@font-face { font-family: suisse; src: url("../media/SuisseIntl_RegularItalic-s.p.bd23132e.woff2") format("woff2"); font-display: swap; font-weight: 400; font-style: italic; }

@font-face { font-family: "suisse Fallback"; src: local("Arial"); ascent-override: 95.68%; descent-override: 30.18%; line-gap-override: 0%; size-adjust: 103.05%; }

@font-face { font-family: soehneMono; src: url("../media/soehne_mono_buch.d9bfb82c.woff2") format("woff2"); font-display: swap; font-weight: 400; font-style: normal; }

@font-face { font-family: soehneMono; src: url("../media/soehne_mono_buch_kursiv.872a1585.woff2") format("woff2"); font-display: swap; font-weight: 400; font-style: italic; }

@font-face { font-family: soehneMono; src: url("../media/soehne_mono_kraftig.b39a8667.woff2") format("woff2"); font-display: swap; font-weight: 500; font-style: normal; }

@font-face { font-family: soehneMono; src: url("../media/soehne_mono_kraftig_kursiv.4dc5b6dd.woff2") format("woff2"); font-display: swap; font-weight: 500; font-style: italic; }

@font-face { font-family: Inter; font-style: normal; font-weight: 100 900; font-display: swap; src: url("../media/2c55a0e60120577a-s.2a48534a.woff2") format("woff2"); unicode-range: U+460-52F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F; }

@font-face { font-family: Inter; font-style: normal; font-weight: 100 900; font-display: swap; src: url("../media/9c72aa0f40e4eef8-s.18a48cbc.woff2") format("woff2"); unicode-range: U+301, U+400-45F, U+490-491, U+4B0-4B1, U+2116; }

@font-face { font-family: Inter; font-style: normal; font-weight: 100 900; font-display: swap; src: url("../media/ad66f9afd8947f86-s.7a40eb73.woff2") format("woff2"); unicode-range: U+1F00-1FFF; }

@font-face { font-family: Inter; font-style: normal; font-weight: 100 900; font-display: swap; src: url("../media/5476f68d60460930-s.c995e352.woff2") format("woff2"); unicode-range: U+370-377, U+37A-37F, U+384-38A, U+38C, U+38E-3A1, U+3A3-3FF; }

@font-face { font-family: Inter; font-style: normal; font-weight: 100 900; font-display: swap; src: url("../media/2bbe8d2671613f1f-s.76dcb0b2.woff2") format("woff2"); unicode-range: U+102-103, U+110-111, U+128-129, U+168-169, U+1A0-1A1, U+1AF-1B0, U+300-301, U+303-304, U+308-309, U+323, U+329, U+1EA0-1EF9, U+20AB; }

@font-face { font-family: Inter; font-style: normal; font-weight: 100 900; font-display: swap; src: url("../media/1bffadaabf893a1e-s.7cd81963.woff2") format("woff2"); unicode-range: U+100-2BA, U+2BD-2C5, U+2C7-2CC, U+2CE-2D7, U+2DD-2FF, U+304, U+308, U+329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF; }

@font-face { font-family: Inter; font-style: normal; font-weight: 100 900; font-display: swap; src: url("../media/83afe278b6a6bb3c-s.3a6ba036.woff2") format("woff2"); unicode-range: U+0-FF, U+131, U+152-153, U+2BB-2BC, U+2C6, U+2DA, U+2DC, U+304, U+308, U+329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }

@font-face { font-family: "Inter Fallback"; src: local("Arial"); ascent-override: 90.44%; descent-override: 22.52%; line-gap-override: 0%; size-adjust: 107.12%; }

.geistnumbers_bd8c890c-module__bH8fPa__variable { --font-geist-numbers:"geistNumbers" }
.suisse_c1aba7e9-module__WpjB7a__variable { --font-suisse:"suisse","suisse Fallback" }
.soehnemono_a1bc168a-module__FMl8Nq__variable { --font-soehne-mono:"soehneMono" }
*, ::before, ::after, ::backdrop { --tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:#3b82f680;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000 }
*, ::before, ::after { box-sizing:border-box;border-top-width:0px;border-right-width:0px;border-bottom-width:0px;border-left-width:0px;border-top-style:solid;border-right-style:solid;border-bottom-style:solid;border-left-style:solid;border-top-color:rgb(217, 217, 222);border-right-color:rgb(217, 217, 222);border-bottom-color:rgb(217, 217, 222);border-left-color:rgb(217, 217, 222);border-image-source:initial;border-image-slice:initial;border-image-width:initial;border-image-outset:initial;border-image-repeat:initial }
html, :host { text-size-adjust:100%;tab-size:4;line-height:1.5;font-family:var(--font-geist-numbers),var(--font-suisse);font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent }
body { line-height:inherit;margin-top:0px;margin-right:0px;margin-bottom:0px;margin-left:0px }
h1, h2, h3, h4, h5, h6 { font-size:inherit;font-weight:inherit }
a { color:inherit;text-decoration-line:inherit;text-decoration-thickness:inherit;text-decoration-style:inherit;text-decoration-color:inherit }
blockquote, dl, dd, h1, h2, h3, h4, h5, h6, hr, figure, p, pre { margin-top:0px;margin-right:0px;margin-bottom:0px;margin-left:0px }
img, svg, video, canvas, audio, iframe, embed, object { vertical-align:middle;display:block }
img, video { max-width:100%;height:auto }
:host { --light:initial;--shiki-foreground:#fff;--shiki-token-function:#bab1ff;--shiki-token-keyword:#bab1ff;--shiki-token-string:#5de3ff;--shiki-token-string-expression:#5de3ff;--shiki-token-constant:#86ef9b;--shiki-token-parameter:#86ef9b;--shiki-token-link:#86ef9b;--shiki-token-comment:#9394a1;--shiki-token-punctuation:#b7b8c2;--shiki-light-foreground:#131316;--shiki-light-token-function:#6c47ff;--shiki-light-token-keyword:#6c47ff;--shiki-light-token-string:#00aee3;--shiki-light-token-string-expression:#00aee3;--shiki-light-token-constant:#22c543;--shiki-light-token-parameter:#22c543;--shiki-light-token-link:#22c543;--shiki-light-token-comment:#9394a1;--shiki-light-token-punctuation:#747686;--typography-color:#42434d;--typography-heavy:#131316;--typography-heading:#131316;--typography-link:#131316;--typography-link-hover:#131316;--typography-underline:#d9d9de;--typography-underline-hover:#131316;--typography-strong:#131316;--typography-code:#131316;--typography-thead-border:#d9d9de;--typography-tbody-border:#eeeef0;--typography-link-indicator:#eeeef0;--typography-link-indicator-hover:#131316;--typography-link-icon:#9394a1;--typography-link-icon-hover:#fff;--typography-link-icon-bg:#eeeef0;--typography-link-icon-bg-hover:#131316;--typography-code-bg:#fff;--typography-code-border:#d9d9de }
.typography a { overflow-wrap:break-word }
.typography code:not(:is(pre, h1, h2, h3, h4) code) { color:var(--typography-code);overflow-wrap:break-word;padding-top:0.375rem;padding-right:0.375rem;padding-bottom:0.375rem;padding-left:0.375rem;font-size:0.8125rem }
.typography a code:not(pre code) { color:inherit }
.typography:not([data-heading-base]) h1, .typography[data-heading-base="1"] h1, .typography[data-heading-base="2"] h2 { color:var(--typography-heading);letter-spacing:-0.015em;margin-bottom:1.5rem;font-size:2rem;font-weight:600;line-height:2.5rem }
.typography:not([data-heading-base]) h2:not([data-heading-step]), .typography[data-heading-base="1"] h2:not([data-heading-step]), .typography[data-heading-base="2"] h3:not([data-heading-step]) { color:var(--typography-heading);letter-spacing:-0.025em;margin-top:4rem;margin-bottom:1rem;scroll-margin-top:4rem;font-size:1.5rem;font-weight:600;line-height:2rem }
.typography:not([data-heading-base]) h2:not([data-heading-step]) code, .typography[data-heading-base="1"] h2:not([data-heading-step]) code, .typography[data-heading-base="2"] h3:not([data-heading-step]) code { background-image:var(--type-code-middle-bg),url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 30'%3E%3Crect width='15' height='29' x='.5' y='.5' rx='8' ry='8' fill='white' stroke='%23D9D9DE'/%3E%3C/svg%3E"),url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 30'%3E%3Crect width='15' height='29' x='.5' y='.5' rx='8' ry='8' fill='white' stroke='%23D9D9DE'/%3E%3C/svg%3E");background-size:calc(100% - 1rem) 1.875rem, 0.5rem 1.875rem, 1rem 1.875rem;padding-top:0.125rem;padding-right:0.5rem;padding-bottom:0.125rem;padding-left:0.5rem;font-size:1.375rem;font-weight:500 }
.dark .typography:not([data-heading-base]) h2:not([data-heading-step]) code, .dark .typography[data-heading-base="1"] h2:not([data-heading-step]) code, .dark .typography[data-heading-base="2"] h3:not([data-heading-step]) code { background-image:var(--type-code-middle-bg),url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 30'%3E%3Crect width='15' height='29' x='.5' y='.5' rx='8' ry='8' fill='%23212126' stroke='%232F3037'/%3E%3C/svg%3E"),url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 30'%3E%3Crect width='15' height='29' x='.5' y='.5' rx='8' ry='8' fill='%23212126' stroke='%232F3037'/%3E%3C/svg%3E") }
.typography:not([data-heading-base]) h3, .typography[data-heading-base="1"] h3, .typography[data-heading-base="2"] h4, .typography [data-heading-step] { color:var(--typography-heading);letter-spacing:-0.015em;margin-top:3rem;margin-bottom:1rem;scroll-margin-top:3rem;font-size:1.25rem;font-weight:600;line-height:1.75rem }
.typography:not([data-heading-base]) h3 code, .typography[data-heading-base="1"] h3 code, .typography[data-heading-base="2"] h4 code, .typography [data-heading-step] code { padding-top:0.25rem;padding-right:0.375rem;padding-bottom:0.25rem;padding-left:0.375rem;font-size:1.125rem;font-weight:500 }
.typography:not([data-heading-base]) h4, .typography[data-heading-base="1"] h4, .typography[data-heading-base="2"] h5, [data-component="Steps"] .typography h3:not([data-heading-step]) { color:var(--typography-heading);letter-spacing:-0.015em;margin-top:3rem;margin-bottom:1rem;scroll-margin-top:3rem;font-size:1.125rem;font-weight:600;line-height:1.75rem }
.typography:not([data-heading-base]) h4 code, .typography[data-heading-base="1"] h4 code, .typography[data-heading-base="2"] h5 code, [data-component="Steps"] .typography h3:not([data-heading-step]) code { padding-top:0.25rem;padding-right:0.375rem;padding-bottom:0.25rem;padding-left:0.375rem;font-size:1rem;font-weight:500 }
.typography :is(h1, h2, h3, h4, h5) + * { margin-top:0px !important }
.pointer-events-none { pointer-events:none }
.absolute { position:absolute }
.relative { position:relative }
.inset-0 { top:0px;right:0px;bottom:0px;left:0px }
.inset-0\.5 { top:0.125rem;right:0.125rem;bottom:0.125rem;left:0.125rem }
.-bottom-1 { bottom:-0.25rem }
.-bottom-1\.5 { bottom:-0.375rem }
.-bottom-11 { bottom:-2.75rem }
.-bottom-14 { bottom:-3.5rem }
.-bottom-16 { bottom:-4rem }
.isolate { isolation:isolate }
.-z-10 { z-index:-10 }
.z-10 { z-index:10 }
.z-20 { z-index:20 }
.order-first { order:-9999 }
.order-last { order:9999 }
.row-span-2 { grid-row-start:span 2;grid-row-end:span 2 }
.mx-auto { margin-left:auto;margin-right:auto }
.-ml-10 { margin-left:-2.5rem }
.-ml-36 { margin-left:-9rem }
.-mt-32 { margin-top:-8rem }
.mb-4 { margin-bottom:1rem }
.mt-10 { margin-top:2.5rem }
.mt-12 { margin-top:3rem }
.mt-2 { margin-top:0.5rem }
.mt-2\.5 { margin-top:0.625rem }
.mt-20 { margin-top:5rem }
.mt-24 { margin-top:6rem }
.mt-28 { margin-top:7rem }
.mt-4 { margin-top:1rem }
.mt-px { margin-top:1px }
.flex { display:flex }
.inline-flex { display:inline-flex }
.grid { display:grid }
.size-10 { width:2.5rem;height:2.5rem }
.size-9 { width:2.25rem;height:2.25rem }
.size-96 { width:24rem;height:24rem }
.h-6 { height:1.5rem }
.h-64 { height:16rem }
.h-full { height:100% }
.min-h-full { min-height:100% }
.w-20 { width:5rem }
.w-32 { width:8rem }
.w-72 { width:18rem }
.w-full { width:100% }
.w-max { width:max-content }
.max-w-md { max-width:28rem }
.flex-1 { flex-grow:1;flex-shrink:1;flex-basis:0% }
.flex-auto { flex-grow:1;flex-shrink:1;flex-basis:auto }
.flex-none { flex-grow:0;flex-shrink:0;flex-basis:auto }
.flex-shrink { flex-shrink:1 }
.flex-shrink-0 { flex-shrink:0 }
.flex-grow { flex-grow:1 }
.flex-grow-0 { flex-grow:0 }
.transform-gpu { transform:translate3d(var(--tw-translate-x),var(--tw-translate-y),0)rotate(var(--tw-rotate))skewX(var(--tw-skew-x))skewY(var(--tw-skew-y))scaleX(var(--tw-scale-x))scaleY(var(--tw-scale-y)) }
.select-none { user-select:none }
.grid-flow-col { grid-auto-flow:column }
.grid-cols-1 { grid-template-columns:repeat(1, minmax(0px, 1fr)) }
.grid-cols-12 { grid-template-columns:repeat(12, minmax(0px, 1fr)) }
.grid-cols-2 { grid-template-columns:repeat(2, minmax(0px, 1fr)) }
.grid-cols-3 { grid-template-columns:repeat(3, minmax(0px, 1fr)) }
.grid-cols-4 { grid-template-columns:repeat(4, minmax(0px, 1fr)) }
.grid-cols-5 { grid-template-columns:repeat(5, minmax(0px, 1fr)) }
.grid-cols-8 { grid-template-columns:repeat(8, minmax(0px, 1fr)) }
.grid-cols-\[0\.75rem_minmax\(0\,1fr\)\] { grid-template-columns:0.75rem minmax(0px, 1fr) }
.grid-cols-\[1\.25rem_1fr_auto\] { grid-template-columns:1.25rem 1fr auto }
.grid-cols-\[1ch_minmax\(0\,1fr\)\] { grid-template-columns:1ch minmax(0px, 1fr) }
.grid-cols-\[1fr_auto\] { grid-template-columns:1fr auto }
.grid-cols-\[1fr_auto_1fr\] { grid-template-columns:1fr auto 1fr }
.grid-cols-\[1fr_var\(--gap\)_1fr\] { grid-template-columns:1fr var(--gap)1fr }
.grid-cols-\[9\.2rem_1fr\] { grid-template-columns:9.2rem 1fr }
.grid-cols-\[auto_1fr_auto\] { grid-template-columns:auto 1fr auto }
.grid-cols-subgrid { grid-template-columns:subgrid }
.grid-rows-1 { grid-template-rows:repeat(1, minmax(0px, 1fr)) }
.grid-rows-2 { grid-template-rows:repeat(2, minmax(0px, 1fr)) }
.grid-rows-3 { grid-template-rows:repeat(3, minmax(0px, 1fr)) }
.grid-rows-6 { grid-template-rows:repeat(6, minmax(0px, 1fr)) }
.grid-rows-\[0fr\] { grid-template-rows:0fr }
.grid-rows-\[1fr\] { grid-template-rows:1fr }
.grid-rows-\[min-content_min-content\] { grid-template-rows:min-content min-content }
.grid-rows-\[min-content_min-content_min-content_min-content\] { grid-template-rows:min-content min-content min-content min-content }
.grid-rows-\[repeat\(12\,minmax\(0\,1fr\)\)\] { grid-template-rows:repeat(12, minmax(0px, 1fr)) }
.grid-rows-\[repeat\(2\,auto\)\] { grid-template-rows:repeat(2, auto) }
.grid-rows-\[repeat\(3\,auto\)\] { grid-template-rows:repeat(3, auto) }
.grid-rows-\[repeat\(4\,auto\)\] { grid-template-rows:repeat(4, auto) }
.grid-rows-\[subgrid\], .grid-rows-subgrid { grid-template-rows:subgrid }
.flex-row { flex-direction:row }
.flex-row-reverse { flex-direction:row-reverse }
.flex-col { flex-direction:column }
.flex-col-reverse { flex-direction:column-reverse }
.flex-wrap { flex-wrap:wrap }
.flex-nowrap { flex-wrap:nowrap }
.items-center { align-items:center }
.justify-center { justify-content:center }
.gap-2 { row-gap:0.5rem;column-gap:0.5rem }
.gap-2\.5 { row-gap:0.625rem;column-gap:0.625rem }
.gap-20 { row-gap:5rem;column-gap:5rem }
.gap-3 { row-gap:0.75rem;column-gap:0.75rem }
.gap-3\.5 { row-gap:0.875rem;column-gap:0.875rem }
.gap-4 { row-gap:1rem;column-gap:1rem }
.gap-x-3 { column-gap:0.75rem }
.gap-x-3\.5 { column-gap:0.875rem }
.gap-x-32 { column-gap:8rem }
.overflow-hidden { overflow-x:hidden;overflow-y:hidden }
.whitespace-nowrap { white-space-collapse:collapse;text-wrap:nowrap }
.text-balance { text-wrap:balance }
.text-pretty { text-wrap:pretty }
.rounded { border-top-left-radius:0.25rem;border-top-right-radius:0.25rem;border-bottom-right-radius:0.25rem;border-bottom-left-radius:0.25rem }
.rounded-2xl { border-top-left-radius:1rem;border-top-right-radius:1rem;border-bottom-right-radius:1rem;border-bottom-left-radius:1rem }
.rounded-3xl { border-top-left-radius:1.5rem;border-top-right-radius:1.5rem;border-bottom-right-radius:1.5rem;border-bottom-left-radius:1.5rem }
.rounded-\[0\.03125rem\] { border-top-left-radius:0.03125rem;border-top-right-radius:0.03125rem;border-bottom-right-radius:0.03125rem;border-bottom-left-radius:0.03125rem }
.rounded-\[0\.0625rem\] { border-top-left-radius:0.0625rem;border-top-right-radius:0.0625rem;border-bottom-right-radius:0.0625rem;border-bottom-left-radius:0.0625rem }
.rounded-\[0\.0625rem_0_0_0\] { border-top-left-radius:0.0625rem;border-top-right-radius:0px;border-bottom-right-radius:0px;border-bottom-left-radius:0px }
.rounded-\[0\.125rem\] { border-top-left-radius:0.125rem;border-top-right-radius:0.125rem;border-bottom-right-radius:0.125rem;border-bottom-left-radius:0.125rem }
.rounded-\[0\.15rem\] { border-top-left-radius:0.15rem;border-top-right-radius:0.15rem;border-bottom-right-radius:0.15rem;border-bottom-left-radius:0.15rem }
.rounded-\[0\.1875rem\] { border-top-left-radius:0.1875rem;border-top-right-radius:0.1875rem;border-bottom-right-radius:0.1875rem;border-bottom-left-radius:0.1875rem }
.rounded-\[0\.21rem\] { border-top-left-radius:0.21rem;border-top-right-radius:0.21rem;border-bottom-right-radius:0.21rem;border-bottom-left-radius:0.21rem }
.rounded-\[0\.25rem\] { border-top-left-radius:0.25rem;border-top-right-radius:0.25rem;border-bottom-right-radius:0.25rem;border-bottom-left-radius:0.25rem }
.rounded-\[0\.2em\] { border-top-left-radius:0.2em;border-top-right-radius:0.2em;border-bottom-right-radius:0.2em;border-bottom-left-radius:0.2em }
.rounded-\[0\.31213rem\] { border-top-left-radius:0.31213rem;border-top-right-radius:0.31213rem;border-bottom-right-radius:0.31213rem;border-bottom-left-radius:0.31213rem }
.rounded-\[0\.3125rem\] { border-top-left-radius:0.3125rem;border-top-right-radius:0.3125rem;border-bottom-right-radius:0.3125rem;border-bottom-left-radius:0.3125rem }
.rounded-\[0\.31rem\] { border-top-left-radius:0.31rem;border-top-right-radius:0.31rem;border-bottom-right-radius:0.31rem;border-bottom-left-radius:0.31rem }
.rounded-\[0\.32144rem\] { border-top-left-radius:0.32144rem;border-top-right-radius:0.32144rem;border-bottom-right-radius:0.32144rem;border-bottom-left-radius:0.32144rem }
.rounded-\[0\.33544rem\] { border-top-left-radius:0.33544rem;border-top-right-radius:0.33544rem;border-bottom-right-radius:0.33544rem;border-bottom-left-radius:0.33544rem }
.rounded-\[0\.3375rem\] { border-top-left-radius:0.3375rem;border-top-right-radius:0.3375rem;border-bottom-right-radius:0.3375rem;border-bottom-left-radius:0.3375rem }
.rounded-\[0\.34231rem\] { border-top-left-radius:0.34231rem;border-top-right-radius:0.34231rem;border-bottom-right-radius:0.34231rem;border-bottom-left-radius:0.34231rem }
.rounded-\[0\.34rem\] { border-top-left-radius:0.34rem;border-top-right-radius:0.34rem;border-bottom-right-radius:0.34rem;border-bottom-left-radius:0.34rem }
.rounded-\[0\.375rem\] { border-top-left-radius:0.375rem;border-top-right-radius:0.375rem;border-bottom-right-radius:0.375rem;border-bottom-left-radius:0.375rem }
.rounded-\[0\.3rem\] { border-top-left-radius:0.3rem;border-top-right-radius:0.3rem;border-bottom-right-radius:0.3rem;border-bottom-left-radius:0.3rem }
.rounded-\[0\.4375rem\] { border-top-left-radius:0.4375rem;border-top-right-radius:0.4375rem;border-bottom-right-radius:0.4375rem;border-bottom-left-radius:0.4375rem }
.rounded-\[0\.5rem\] { border-top-left-radius:0.5rem;border-top-right-radius:0.5rem;border-bottom-right-radius:0.5rem;border-bottom-left-radius:0.5rem }
.rounded-\[0\.625rem\] { border-top-left-radius:0.625rem;border-top-right-radius:0.625rem;border-bottom-right-radius:0.625rem;border-bottom-left-radius:0.625rem }
.rounded-\[0\.67088rem\] { border-top-left-radius:0.67088rem;border-top-right-radius:0.67088rem;border-bottom-right-radius:0.67088rem;border-bottom-left-radius:0.67088rem }
.rounded-\[0\.6875rem\] { border-top-left-radius:0.6875rem;border-top-right-radius:0.6875rem;border-bottom-right-radius:0.6875rem;border-bottom-left-radius:0.6875rem }
.rounded-\[0\.723rem\] { border-top-left-radius:0.723rem;border-top-right-radius:0.723rem;border-bottom-right-radius:0.723rem;border-bottom-left-radius:0.723rem }
.rounded-\[0\.75rem\] { border-top-left-radius:0.75rem;border-top-right-radius:0.75rem;border-bottom-right-radius:0.75rem;border-bottom-left-radius:0.75rem }
.rounded-\[0\.8125rem\] { border-top-left-radius:0.8125rem;border-top-right-radius:0.8125rem;border-bottom-right-radius:0.8125rem;border-bottom-left-radius:0.8125rem }
.rounded-\[0\.875rem\] { border-top-left-radius:0.875rem;border-top-right-radius:0.875rem;border-bottom-right-radius:0.875rem;border-bottom-left-radius:0.875rem }
.rounded-\[0_0_0\.0625rem_0\] { border-top-left-radius:0px;border-top-right-radius:0px;border-bottom-right-radius:0.0625rem;border-bottom-left-radius:0px }
.rounded-\[1\.13619rem\] { border-top-left-radius:1.13619rem;border-top-right-radius:1.13619rem;border-bottom-right-radius:1.13619rem;border-bottom-left-radius:1.13619rem }
.rounded-\[1\.1875rem\] { border-top-left-radius:1.1875rem;border-top-right-radius:1.1875rem;border-bottom-right-radius:1.1875rem;border-bottom-left-radius:1.1875rem }
.rounded-\[1\.25rem\] { border-top-left-radius:1.25rem;border-top-right-radius:1.25rem;border-bottom-right-radius:1.25rem;border-bottom-left-radius:1.25rem }
.rounded-\[1\.375rem\] { border-top-left-radius:1.375rem;border-top-right-radius:1.375rem;border-bottom-right-radius:1.375rem;border-bottom-left-radius:1.375rem }
.rounded-\[1\.5px\] { border-top-left-radius:1.5px;border-top-right-radius:1.5px;border-bottom-right-radius:1.5px;border-bottom-left-radius:1.5px }
.rounded-\[1\.5rem\] { border-top-left-radius:1.5rem;border-top-right-radius:1.5rem;border-bottom-right-radius:1.5rem;border-bottom-left-radius:1.5rem }
.rounded-\[11px\] { border-top-left-radius:11px;border-top-right-radius:11px;border-bottom-right-radius:11px;border-bottom-left-radius:11px }
.rounded-\[2\.25rem\] { border-top-left-radius:2.25rem;border-top-right-radius:2.25rem;border-bottom-right-radius:2.25rem;border-bottom-left-radius:2.25rem }
.rounded-\[2\.4375rem\] { border-top-left-radius:2.4375rem;border-top-right-radius:2.4375rem;border-bottom-right-radius:2.4375rem;border-bottom-left-radius:2.4375rem }
.rounded-\[2\.5rem\] { border-top-left-radius:2.5rem;border-top-right-radius:2.5rem;border-bottom-right-radius:2.5rem;border-bottom-left-radius:2.5rem }
.rounded-\[2\.6875rem\] { border-top-left-radius:2.6875rem;border-top-right-radius:2.6875rem;border-bottom-right-radius:2.6875rem;border-bottom-left-radius:2.6875rem }
.rounded-\[2\.8125rem\] { border-top-left-radius:2.8125rem;border-top-right-radius:2.8125rem;border-bottom-right-radius:2.8125rem;border-bottom-left-radius:2.8125rem }
.rounded-\[22px\] { border-top-left-radius:22px;border-top-right-radius:22px;border-bottom-right-radius:22px;border-bottom-left-radius:22px }
.rounded-\[2px\] { border-top-left-radius:2px;border-top-right-radius:2px;border-bottom-right-radius:2px;border-bottom-left-radius:2px }
.rounded-\[2rem\] { border-top-left-radius:2rem;border-top-right-radius:2rem;border-bottom-right-radius:2rem;border-bottom-left-radius:2rem }
.rounded-\[3px\] { border-top-left-radius:3px;border-top-right-radius:3px;border-bottom-right-radius:3px;border-bottom-left-radius:3px }
.rounded-\[4\.5rem\] { border-top-left-radius:4.5rem;border-top-right-radius:4.5rem;border-bottom-right-radius:4.5rem;border-bottom-left-radius:4.5rem }
.rounded-\[4\.9375rem\] { border-top-left-radius:4.9375rem;border-top-right-radius:4.9375rem;border-bottom-right-radius:4.9375rem;border-bottom-left-radius:4.9375rem }
.rounded-\[4px\] { border-top-left-radius:4px;border-top-right-radius:4px;border-bottom-right-radius:4px;border-bottom-left-radius:4px }
.rounded-\[5\.125rem\] { border-top-left-radius:5.125rem;border-top-right-radius:5.125rem;border-bottom-right-radius:5.125rem;border-bottom-left-radius:5.125rem }
.rounded-\[5\.8125rem\] { border-top-left-radius:5.8125rem;border-top-right-radius:5.8125rem;border-bottom-right-radius:5.8125rem;border-bottom-left-radius:5.8125rem }
.rounded-\[50\%\] { border-top-left-radius:50%;border-top-right-radius:50%;border-bottom-right-radius:50%;border-bottom-left-radius:50% }
.rounded-\[50px\] { border-top-left-radius:50px;border-top-right-radius:50px;border-bottom-right-radius:50px;border-bottom-left-radius:50px }
.rounded-\[5px\] { border-top-left-radius:5px;border-top-right-radius:5px;border-bottom-right-radius:5px;border-bottom-left-radius:5px }
.rounded-\[5rem\] { border-top-left-radius:5rem;border-top-right-radius:5rem;border-bottom-right-radius:5rem;border-bottom-left-radius:5rem }
.rounded-\[6\.6875rem\] { border-top-left-radius:6.6875rem;border-top-right-radius:6.6875rem;border-bottom-right-radius:6.6875rem;border-bottom-left-radius:6.6875rem }
.rounded-\[6px\] { border-top-left-radius:6px;border-top-right-radius:6px;border-bottom-right-radius:6px;border-bottom-left-radius:6px }
.rounded-\[8\.5625rem\] { border-top-left-radius:8.5625rem;border-top-right-radius:8.5625rem;border-bottom-right-radius:8.5625rem;border-bottom-left-radius:8.5625rem }
.rounded-\[999px\] { border-top-left-radius:999px;border-top-right-radius:999px;border-bottom-right-radius:999px;border-bottom-left-radius:999px }
.rounded-\[calc\(1\.5rem-0\.125rem\)\] { border-top-left-radius:1.375rem;border-top-right-radius:1.375rem;border-bottom-right-radius:1.375rem;border-bottom-left-radius:1.375rem }
.rounded-\[calc\(10\/16\*1rem\)\] { border-top-left-radius:0.625rem;border-top-right-radius:0.625rem;border-bottom-right-radius:0.625rem;border-bottom-left-radius:0.625rem }
.rounded-\[calc\(3\.273\/16\*1rem\)\] { border-top-left-radius:0.204563rem;border-top-right-radius:0.204563rem;border-bottom-right-radius:0.204563rem;border-bottom-left-radius:0.204563rem }
.rounded-\[calc\(38\/16\*1rem\)\] { border-top-left-radius:2.375rem;border-top-right-radius:2.375rem;border-bottom-right-radius:2.375rem;border-bottom-left-radius:2.375rem }
.rounded-\[calc\(4\.994\/16\*1rem\)\] { border-top-left-radius:0.312125rem;border-top-right-radius:0.312125rem;border-bottom-right-radius:0.312125rem;border-bottom-left-radius:0.312125rem }
.rounded-\[calc\(44\/16\*1rem\)\] { border-top-left-radius:2.75rem;border-top-right-radius:2.75rem;border-bottom-right-radius:2.75rem;border-bottom-left-radius:2.75rem }
.rounded-\[calc\(5\/16\*1rem\)\] { border-top-left-radius:0.3125rem;border-top-right-radius:0.3125rem;border-bottom-right-radius:0.3125rem;border-bottom-left-radius:0.3125rem }
.rounded-\[calc\(58\/16\*1rem\)\] { border-top-left-radius:3.625rem;border-top-right-radius:3.625rem;border-bottom-right-radius:3.625rem;border-bottom-left-radius:3.625rem }
.rounded-\[calc\(6\/16\*1rem\)\] { border-top-left-radius:0.375rem;border-top-right-radius:0.375rem;border-bottom-right-radius:0.375rem;border-bottom-left-radius:0.375rem }
.rounded-\[calc\(theme\(spacing\.4\)-theme\(spacing\.1\)\)\] { border-top-left-radius:0.75rem;border-top-right-radius:0.75rem;border-bottom-right-radius:0.75rem;border-bottom-left-radius:0.75rem }
.rounded-\[calc\(var\(--rounded-cqi\,0\)-var\(--inset-cqi\,0\)\)\] { border-radius: calc(var(--rounded-cqi,0) - var(--inset-cqi,0)); }
.rounded-\[inherit\] { border-top-left-radius:inherit;border-top-right-radius:inherit;border-bottom-right-radius:inherit;border-bottom-left-radius:inherit }
.rounded-\[var\(--rounded\)\] { border-radius: var(--rounded); }
.rounded-\[var\(--rounded-cqi\)\] { border-radius: var(--rounded-cqi); }
.rounded-full { border-top-left-radius:9999px;border-top-right-radius:9999px;border-bottom-right-radius:9999px;border-bottom-left-radius:9999px }
.rounded-lg { border-top-left-radius:0.5rem;border-top-right-radius:0.5rem;border-bottom-right-radius:0.5rem;border-bottom-left-radius:0.5rem }
.rounded-md { border-top-left-radius:0.375rem;border-top-right-radius:0.375rem;border-bottom-right-radius:0.375rem;border-bottom-left-radius:0.375rem }
.rounded-none { border-top-left-radius:0px;border-top-right-radius:0px;border-bottom-right-radius:0px;border-bottom-left-radius:0px }
.rounded-sm { border-top-left-radius:0.125rem;border-top-right-radius:0.125rem;border-bottom-right-radius:0.125rem;border-bottom-left-radius:0.125rem }
.rounded-xl { border-top-left-radius:0.75rem;border-top-right-radius:0.75rem;border-bottom-right-radius:0.75rem;border-bottom-left-radius:0.75rem }
.rounded-b { border-bottom-right-radius:0.25rem;border-bottom-left-radius:0.25rem }
.rounded-b-2xl { border-bottom-right-radius:1rem;border-bottom-left-radius:1rem }
.rounded-b-\[0\.19rem\] { border-bottom-right-radius:0.19rem;border-bottom-left-radius:0.19rem }
.rounded-b-\[0\.5rem\] { border-bottom-right-radius:0.5rem;border-bottom-left-radius:0.5rem }
.rounded-b-\[1\.5px\] { border-bottom-right-radius:1.5px;border-bottom-left-radius:1.5px }
.rounded-b-lg { border-bottom-right-radius:0.5rem;border-bottom-left-radius:0.5rem }
.rounded-b-md { border-bottom-right-radius:0.375rem;border-bottom-left-radius:0.375rem }
.rounded-b-none { border-bottom-right-radius:0px;border-bottom-left-radius:0px }
.rounded-b-xl { border-bottom-right-radius:0.75rem;border-bottom-left-radius:0.75rem }
.rounded-l-\[0\.3305rem\] { border-top-left-radius:0.3305rem;border-bottom-left-radius:0.3305rem }
.rounded-l-\[0\.375rem\], .rounded-l-md { border-top-left-radius:0.375rem;border-bottom-left-radius:0.375rem }
.rounded-l-none { border-top-left-radius:0px;border-bottom-left-radius:0px }
.rounded-r-\[11px\] { border-top-right-radius:11px;border-bottom-right-radius:11px }
.rounded-r-lg { border-top-right-radius:0.5rem;border-bottom-right-radius:0.5rem }
.rounded-r-md { border-top-right-radius:0.375rem;border-bottom-right-radius:0.375rem }
.rounded-r-none { border-top-right-radius:0px;border-bottom-right-radius:0px }
.rounded-t { border-top-left-radius:0.25rem;border-top-right-radius:0.25rem }
.rounded-t-2xl { border-top-left-radius:1rem;border-top-right-radius:1rem }
.rounded-t-\[0\.19rem\] { border-top-left-radius:0.19rem;border-top-right-radius:0.19rem }
.rounded-t-\[0\.5rem\] { border-top-left-radius:0.5rem;border-top-right-radius:0.5rem }
.rounded-t-\[0\.75rem\] { border-top-left-radius:0.75rem;border-top-right-radius:0.75rem }
.rounded-t-\[1\.5px\] { border-top-left-radius:1.5px;border-top-right-radius:1.5px }
.rounded-t-\[6px\] { border-top-left-radius:6px;border-top-right-radius:6px }
.rounded-t-lg { border-top-left-radius:0.5rem;border-top-right-radius:0.5rem }
.rounded-t-md { border-top-left-radius:0.375rem;border-top-right-radius:0.375rem }
.rounded-t-none { border-top-left-radius:0px;border-top-right-radius:0px }
.rounded-t-sm { border-top-left-radius:0.125rem;border-top-right-radius:0.125rem }
.rounded-t-xl { border-top-left-radius:0.75rem;border-top-right-radius:0.75rem }
.rounded-tl-\[0\.75rem\], .rounded-tl-xl { border-top-left-radius:0.75rem }
.rounded-tr-\[0\.75rem\] { border-top-right-radius:0.75rem }
.border { border-top-width:1px;border-right-width:1px;border-bottom-width:1px;border-left-width:1px }
.border-0 { border-top-width:0px;border-right-width:0px;border-bottom-width:0px;border-left-width:0px }
.border-2 { border-top-width:2px;border-right-width:2px;border-bottom-width:2px;border-left-width:2px }
.border-4 { border-top-width:4px;border-right-width:4px;border-bottom-width:4px;border-left-width:4px }
.border-\[0\.03125rem\] { border-top-width:0.03125rem;border-right-width:0.03125rem;border-bottom-width:0.03125rem;border-left-width:0.03125rem }
.border-\[0\.125rem\] { border-top-width:0.125rem;border-right-width:0.125rem;border-bottom-width:0.125rem;border-left-width:0.125rem }
.border-\[0\.1875rem\] { border-top-width:0.1875rem;border-right-width:0.1875rem;border-bottom-width:0.1875rem;border-left-width:0.1875rem }
.border-\[0\.5px\] { border-top-width:0.5px;border-right-width:0.5px;border-bottom-width:0.5px;border-left-width:0.5px }
.border-\[3px\] { border-top-width:3px;border-right-width:3px;border-bottom-width:3px;border-left-width:3px }
.border-x { border-left-width:1px;border-right-width:1px }
.border-y { border-top-width:1px;border-bottom-width:1px }
.border-y-2 { border-top-width:2px;border-bottom-width:2px }
.border-b { border-bottom-width:1px }
.border-b-2 { border-bottom-width:2px }
.border-b-\[0\.5px\] { border-bottom-width:0.5px }
.border-l { border-left-width:1px }
.border-l-4 { border-left-width:4px }
.border-l-\[0\.5px\] { border-left-width:0.5px }
.border-r { border-right-width:1px }
.border-r-\[0\.5px\] { border-right-width:0.5px }
.border-t { border-top-width:1px }
.border-t-\[0\.5px\] { border-top-width:0.5px }
.border-t-\[2px\] { border-top-width:2px }
.border-solid { border-top-style:solid;border-right-style:solid;border-bottom-style:solid;border-left-style:solid }
.border-dashed { border-top-style:dashed;border-right-style:dashed;border-bottom-style:dashed;border-left-style:dashed }
.border-dotted { border-top-style:dotted;border-right-style:dotted;border-bottom-style:dotted;border-left-style:dotted }
.border-none { border-top-style:none;border-right-style:none;border-bottom-style:none;border-left-style:none }
.border-\[\#101013\] { --tw-border-opacity:1 }
.border-\[\#141D2E\] { --tw-border-opacity:1 }
.border-\[\#1c1c22\] { --tw-border-opacity:1 }
.border-\[\#1f1b1a\] { --tw-border-opacity:1 }
.border-\[\#211f1e\] { --tw-border-opacity:1 }
.border-\[\#2F2F35\] { --tw-border-opacity:1 }
.border-\[\#2F3037\] { --tw-border-opacity:1 }
.border-\[\#333237\] { --tw-border-opacity:1 }
.border-\[\#373840\] { --tw-border-opacity:1 }
.border-\[\#D1D9E0\] { --tw-border-opacity:1 }
.border-\[\#D9D9DE\] { --tw-border-opacity:1 }
.border-\[\#DBDBDB\] { --tw-border-opacity:1 }
.border-\[\#DFE2E7\] { --tw-border-opacity:1 }
.border-\[\#E0E0E0\] { --tw-border-opacity:1 }
.border-\[\#E3E3E7\] { --tw-border-opacity:1 }
.border-\[\#E4E4E7\] { --tw-border-opacity:1 }
.border-\[\#E4E4E8\] { --tw-border-opacity:1 }
.border-\[\#E4E9F2\] { --tw-border-opacity:1 }
.border-\[\#EEEEF0\] { --tw-border-opacity:1 }
.border-\[\#EEEFF0\] { --tw-border-opacity:1 }
.border-\[--addon-color\] { border-color: var(--addon-color); }
.border-\[color-mix\(in_srgb\,theme\(colors\.white\)_30\%\,theme\(colors\.gray\.950\)\)\] { border-top-color:rgb(90, 90, 92);border-right-color:rgb(90, 90, 92);border-bottom-color:rgb(90, 90, 92);border-left-color:rgb(90, 90, 92) }
.border-\[rgba\(0\,0\,0\,0\.06\)\] { border-top-color:rgba(0, 0, 0, 0.06);border-right-color:rgba(0, 0, 0, 0.06);border-bottom-color:rgba(0, 0, 0, 0.06);border-left-color:rgba(0, 0, 0, 0.06) }
.border-\[rgba\(0\,0\,0\,0\.10\)\] { border-top-color:rgba(0, 0, 0, 0.1);border-right-color:rgba(0, 0, 0, 0.1);border-bottom-color:rgba(0, 0, 0, 0.1);border-left-color:rgba(0, 0, 0, 0.1) }
.border-\[rgba\(0\,0\,0\,0\.11\)\] { border-top-color:rgba(0, 0, 0, 0.11);border-right-color:rgba(0, 0, 0, 0.11);border-bottom-color:rgba(0, 0, 0, 0.11);border-left-color:rgba(0, 0, 0, 0.11) }
.border-\[rgba\(0\,0\,0\,0\.2\)\] { border-top-color:rgba(0, 0, 0, 0.2);border-right-color:rgba(0, 0, 0, 0.2);border-bottom-color:rgba(0, 0, 0, 0.2);border-left-color:rgba(0, 0, 0, 0.2) }
.border-\[rgba\(100\,229\,255\,0\.08\)\] { border-top-color:rgba(100, 229, 255, 0.08);border-right-color:rgba(100, 229, 255, 0.08);border-bottom-color:rgba(100, 229, 255, 0.08);border-left-color:rgba(100, 229, 255, 0.08) }
.border-\[rgba\(118\,118\,132\,0\.16\)\] { border-top-color:rgba(118, 118, 132, 0.16);border-right-color:rgba(118, 118, 132, 0.16);border-bottom-color:rgba(118, 118, 132, 0.16);border-left-color:rgba(118, 118, 132, 0.16) }
.border-\[rgba\(19\,19\,22\,0\)\] { border-top-color:rgba(19, 19, 22, 0);border-right-color:rgba(19, 19, 22, 0);border-bottom-color:rgba(19, 19, 22, 0);border-left-color:rgba(19, 19, 22, 0) }
.border-\[rgba\(19\,19\,22\,0\.1\)\], .border-\[rgba\(19\,19\,22\,0\.10\)\] { border-top-color:rgba(19, 19, 22, 0.1);border-right-color:rgba(19, 19, 22, 0.1);border-bottom-color:rgba(19, 19, 22, 0.1);border-left-color:rgba(19, 19, 22, 0.1) }
.border-\[rgba\(19\,19\,22\,0\.12\)\] { border-top-color:rgba(19, 19, 22, 0.12);border-right-color:rgba(19, 19, 22, 0.12);border-bottom-color:rgba(19, 19, 22, 0.12);border-left-color:rgba(19, 19, 22, 0.12) }
.border-\[rgba\(19\,19\,22\,0\.15\)\] { border-top-color:rgba(19, 19, 22, 0.15);border-right-color:rgba(19, 19, 22, 0.15);border-bottom-color:rgba(19, 19, 22, 0.15);border-left-color:rgba(19, 19, 22, 0.15) }
.border-\[rgba\(238\,238\,240\,0\.06\)\] { border-top-color:rgba(238, 238, 240, 0.06);border-right-color:rgba(238, 238, 240, 0.06);border-bottom-color:rgba(238, 238, 240, 0.06);border-left-color:rgba(238, 238, 240, 0.06) }
.border-\[rgba\(255\,255\,255\,0\.90\)\] { border-top-color:rgba(255, 255, 255, 0.9);border-right-color:rgba(255, 255, 255, 0.9);border-bottom-color:rgba(255, 255, 255, 0.9);border-left-color:rgba(255, 255, 255, 0.9) }
.border-\[rgba\(255\,255\,255\,1\)\] { border-top-color:rgb(255, 255, 255);border-right-color:rgb(255, 255, 255);border-bottom-color:rgb(255, 255, 255);border-left-color:rgb(255, 255, 255) }
.border-\[var\(--border-color\)\] { border-color: var(--border-color); }
.border-\[var\(--dots-border\,theme\(colors\.gray\.800\)\)\] { border-color: var(--dots-border,#2f3037); }
.border-\[var\(--dots-border-active\,theme\(colors\.gray\.700\)\)\] { border-color: var(--dots-border-active,#42434d); }
.border-\[var\(--scalar-border-color\)\] { border-color: var(--scalar-border-color); }
.border-black\/10 { border-top-color:rgba(0, 0, 0, 0.1);border-right-color:rgba(0, 0, 0, 0.1);border-bottom-color:rgba(0, 0, 0, 0.1);border-left-color:rgba(0, 0, 0, 0.1) }
.border-black\/15 { border-top-color:rgba(0, 0, 0, 0.15);border-right-color:rgba(0, 0, 0, 0.15);border-bottom-color:rgba(0, 0, 0, 0.15);border-left-color:rgba(0, 0, 0, 0.15) }
.border-black\/25 { border-top-color:rgba(0, 0, 0, 0.25);border-right-color:rgba(0, 0, 0, 0.25);border-bottom-color:rgba(0, 0, 0, 0.25);border-left-color:rgba(0, 0, 0, 0.25) }
.border-black\/30 { border-top-color:rgba(0, 0, 0, 0.3);border-right-color:rgba(0, 0, 0, 0.3);border-bottom-color:rgba(0, 0, 0, 0.3);border-left-color:rgba(0, 0, 0, 0.3) }
.border-black\/40 { border-top-color:rgba(0, 0, 0, 0.4);border-right-color:rgba(0, 0, 0, 0.4);border-bottom-color:rgba(0, 0, 0, 0.4);border-left-color:rgba(0, 0, 0, 0.4) }
.border-black\/5 { border-top-color:rgba(0, 0, 0, 0.05);border-right-color:rgba(0, 0, 0, 0.05);border-bottom-color:rgba(0, 0, 0, 0.05);border-left-color:rgba(0, 0, 0, 0.05) }
.border-black\/7\.5 { border-top-color:rgba(0, 0, 0, 0.075);border-right-color:rgba(0, 0, 0, 0.075);border-bottom-color:rgba(0, 0, 0, 0.075);border-left-color:rgba(0, 0, 0, 0.075) }
.border-black\/\[0\.06\] { border-top-color:rgba(0, 0, 0, 0.06);border-right-color:rgba(0, 0, 0, 0.06);border-bottom-color:rgba(0, 0, 0, 0.06);border-left-color:rgba(0, 0, 0, 0.06) }
.border-black\/\[0\.42\] { border-top-color:rgba(0, 0, 0, 0.42);border-right-color:rgba(0, 0, 0, 0.42);border-bottom-color:rgba(0, 0, 0, 0.42);border-left-color:rgba(0, 0, 0, 0.42) }
.border-blue-600 { --tw-border-opacity:1 }
.border-current { border-top-color:currentcolor;border-right-color:currentcolor;border-bottom-color:currentcolor;border-left-color:currentcolor }
.border-gray-100 { --tw-border-opacity:1 }
.border-gray-150 { --tw-border-opacity:1 }
.border-gray-200 { --tw-border-opacity:1 }
.border-gray-300 { --tw-border-opacity:1 }
.border-gray-400 { --tw-border-opacity:1 }
.border-gray-400\/10 { border-top-color:rgba(147, 148, 161, 0.1);border-right-color:rgba(147, 148, 161, 0.1);border-bottom-color:rgba(147, 148, 161, 0.1);border-left-color:rgba(147, 148, 161, 0.1) }
.border-gray-50 { --tw-border-opacity:1 }
.border-gray-500 { --tw-border-opacity:1 }
.border-gray-600 { --tw-border-opacity:1 }
.border-gray-600\/10 { border-top-color:rgba(94, 95, 110, 0.1);border-right-color:rgba(94, 95, 110, 0.1);border-bottom-color:rgba(94, 95, 110, 0.1);border-left-color:rgba(94, 95, 110, 0.1) }
.border-gray-700 { --tw-border-opacity:1 }
.border-gray-700\/40 { border-top-color:rgba(66, 67, 77, 0.4);border-right-color:rgba(66, 67, 77, 0.4);border-bottom-color:rgba(66, 67, 77, 0.4);border-left-color:rgba(66, 67, 77, 0.4) }
.border-gray-800 { --tw-border-opacity:1 }
.border-gray-900 { --tw-border-opacity:1 }
.border-gray-950 { --tw-border-opacity:1 }
.border-gray-950\/10 { border-top-color:rgba(19, 19, 22, 0.1);border-right-color:rgba(19, 19, 22, 0.1);border-bottom-color:rgba(19, 19, 22, 0.1);border-left-color:rgba(19, 19, 22, 0.1) }
.border-gray-950\/20 { border-top-color:rgba(19, 19, 22, 0.2);border-right-color:rgba(19, 19, 22, 0.2);border-bottom-color:rgba(19, 19, 22, 0.2);border-left-color:rgba(19, 19, 22, 0.2) }
.border-gray-950\/5 { border-top-color:rgba(19, 19, 22, 0.05);border-right-color:rgba(19, 19, 22, 0.05);border-bottom-color:rgba(19, 19, 22, 0.05);border-left-color:rgba(19, 19, 22, 0.05) }
.border-gray-950\/7\.5 { border-top-color:rgba(19, 19, 22, 0.075);border-right-color:rgba(19, 19, 22, 0.075);border-bottom-color:rgba(19, 19, 22, 0.075);border-left-color:rgba(19, 19, 22, 0.075) }
.border-green-300 { --tw-border-opacity:1 }
.border-green-400 { --tw-border-opacity:1 }
.border-purple-100 { --tw-border-opacity:1 }
.border-purple-200 { --tw-border-opacity:1 }
.border-purple-500 { --tw-border-opacity:1 }
.border-purple-500\/15 { border-top-color:rgba(108, 71, 255, 0.15);border-right-color:rgba(108, 71, 255, 0.15);border-bottom-color:rgba(108, 71, 255, 0.15);border-left-color:rgba(108, 71, 255, 0.15) }
.border-red-300 { --tw-border-opacity:1 }
.border-red-400 { --tw-border-opacity:1 }
.border-red-500 { --tw-border-opacity:1 }
.border-red-500\/35 { border-top-color:rgba(239, 68, 68, 0.35);border-right-color:rgba(239, 68, 68, 0.35);border-bottom-color:rgba(239, 68, 68, 0.35);border-left-color:rgba(239, 68, 68, 0.35) }
.border-red-900\/30 { border-top-color:rgba(127, 29, 29, 0.3);border-right-color:rgba(127, 29, 29, 0.3);border-bottom-color:rgba(127, 29, 29, 0.3);border-left-color:rgba(127, 29, 29, 0.3) }
.border-sky-300 { --tw-border-opacity:1 }
.border-sky-300\/15 { border-top-color:rgba(93, 227, 255, 0.15);border-right-color:rgba(93, 227, 255, 0.15);border-bottom-color:rgba(93, 227, 255, 0.15);border-left-color:rgba(93, 227, 255, 0.15) }
.border-sky-300\/35 { border-top-color:rgba(93, 227, 255, 0.35);border-right-color:rgba(93, 227, 255, 0.35);border-bottom-color:rgba(93, 227, 255, 0.35);border-left-color:rgba(93, 227, 255, 0.35) }
.border-sky-300\/50 { border-top-color:rgba(93, 227, 255, 0.5);border-right-color:rgba(93, 227, 255, 0.5);border-bottom-color:rgba(93, 227, 255, 0.5);border-left-color:rgba(93, 227, 255, 0.5) }
.border-sky-400 { --tw-border-opacity:1 }
.border-sky-900\/30 { border-top-color:rgba(16, 74, 105, 0.3);border-right-color:rgba(16, 74, 105, 0.3);border-bottom-color:rgba(16, 74, 105, 0.3);border-left-color:rgba(16, 74, 105, 0.3) }
.border-transparent { border-top-color:rgba(0, 0, 0, 0);border-right-color:rgba(0, 0, 0, 0);border-bottom-color:rgba(0, 0, 0, 0);border-left-color:rgba(0, 0, 0, 0) }
.border-white { --tw-border-opacity:1 }
.border-white\/0 { border-top-color:rgba(255, 255, 255, 0);border-right-color:rgba(255, 255, 255, 0);border-bottom-color:rgba(255, 255, 255, 0);border-left-color:rgba(255, 255, 255, 0) }
.border-white\/10 { border-top-color:rgba(255, 255, 255, 0.1);border-right-color:rgba(255, 255, 255, 0.1);border-bottom-color:rgba(255, 255, 255, 0.1);border-left-color:rgba(255, 255, 255, 0.1) }
.border-white\/15 { border-top-color:rgba(255, 255, 255, 0.15);border-right-color:rgba(255, 255, 255, 0.15);border-bottom-color:rgba(255, 255, 255, 0.15);border-left-color:rgba(255, 255, 255, 0.15) }
.border-white\/25 { border-top-color:rgba(255, 255, 255, 0.25);border-right-color:rgba(255, 255, 255, 0.25);border-bottom-color:rgba(255, 255, 255, 0.25);border-left-color:rgba(255, 255, 255, 0.25) }
.border-white\/30 { border-top-color:rgba(255, 255, 255, 0.3);border-right-color:rgba(255, 255, 255, 0.3);border-bottom-color:rgba(255, 255, 255, 0.3);border-left-color:rgba(255, 255, 255, 0.3) }
.border-white\/40 { border-top-color:rgba(255, 255, 255, 0.4);border-right-color:rgba(255, 255, 255, 0.4);border-bottom-color:rgba(255, 255, 255, 0.4);border-left-color:rgba(255, 255, 255, 0.4) }
.border-white\/5 { border-top-color:rgba(255, 255, 255, 0.05);border-right-color:rgba(255, 255, 255, 0.05);border-bottom-color:rgba(255, 255, 255, 0.05);border-left-color:rgba(255, 255, 255, 0.05) }
.border-white\/7\.5 { border-top-color:rgba(255, 255, 255, 0.075);border-right-color:rgba(255, 255, 255, 0.075);border-bottom-color:rgba(255, 255, 255, 0.075);border-left-color:rgba(255, 255, 255, 0.075) }
.border-white\/\[0\.04\] { border-top-color:rgba(255, 255, 255, 0.04);border-right-color:rgba(255, 255, 255, 0.04);border-bottom-color:rgba(255, 255, 255, 0.04);border-left-color:rgba(255, 255, 255, 0.04) }
.border-white\/\[0\.06\] { border-top-color:rgba(255, 255, 255, 0.06);border-right-color:rgba(255, 255, 255, 0.06);border-bottom-color:rgba(255, 255, 255, 0.06);border-left-color:rgba(255, 255, 255, 0.06) }
.border-white\/\[0\.08\] { border-top-color:rgba(255, 255, 255, 0.08);border-right-color:rgba(255, 255, 255, 0.08);border-bottom-color:rgba(255, 255, 255, 0.08);border-left-color:rgba(255, 255, 255, 0.08) }
.border-white\/\[0\.10\] { border-top-color:rgba(255, 255, 255, 0.1);border-right-color:rgba(255, 255, 255, 0.1);border-bottom-color:rgba(255, 255, 255, 0.1);border-left-color:rgba(255, 255, 255, 0.1) }
.border-white\/\[0\.12\] { border-top-color:rgba(255, 255, 255, 0.12);border-right-color:rgba(255, 255, 255, 0.12);border-bottom-color:rgba(255, 255, 255, 0.12);border-left-color:rgba(255, 255, 255, 0.12) }
.border-yellow-300 { --tw-border-opacity:1 }
.border-x-white\/10 { border-left-color:rgba(255, 255, 255, 0.1);border-right-color:rgba(255, 255, 255, 0.1) }
.border-y-white\/10 { border-top-color:rgba(255, 255, 255, 0.1);border-bottom-color:rgba(255, 255, 255, 0.1) }
.border-b-\[\#ECECEE\] { --tw-border-opacity:1;border-bottom-color:rgb(236 236 238/var(--tw-border-opacity,1)) }
.border-b-\[--border-default\] { border-bottom-color:var(--border-default) }
.border-b-gray-950\/10 { border-bottom-color:rgba(19, 19, 22, 0.1) }
.border-b-transparent { border-bottom-color:rgba(0, 0, 0, 0) }
.border-b-white { --tw-border-opacity:1;border-bottom-color:rgb(255 255 255/var(--tw-border-opacity,1)) }
.border-b-white\/10 { border-bottom-color:rgba(255, 255, 255, 0.1) }
.border-b-white\/\[0\.04\] { border-bottom-color:rgba(255, 255, 255, 0.04) }
.border-r-gray-950\/10 { border-right-color:rgba(19, 19, 22, 0.1) }
.border-r-white { --tw-border-opacity:1;border-right-color:rgb(255 255 255/var(--tw-border-opacity,1)) }
.border-t-gray-700 { --tw-border-opacity:1;border-top-color:rgb(66 67 77/var(--tw-border-opacity,1)) }
.border-t-gray-950\/5 { border-top-color:rgba(19, 19, 22, 0.05) }
.border-t-transparent { border-top-color:rgba(0, 0, 0, 0) }
.border-t-white { --tw-border-opacity:1;border-top-color:rgb(255 255 255/var(--tw-border-opacity,1)) }
.border-t-white\/10 { border-top-color:rgba(255, 255, 255, 0.1) }
.border-opacity-10 { --tw-border-opacity:.1 }
.bg-gray-25 { --tw-bg-opacity:1;background-color:rgb(250 250 251/var(--tw-bg-opacity,1)) }
.bg-gray-25\/50 { background-color:rgba(250, 250, 251, 0.5) }
.bg-gray-50 { --tw-bg-opacity:1;background-color:rgb(247 247 248/var(--tw-bg-opacity,1)) }
.bg-gray-50\/50 { background-color:rgba(247, 247, 248, 0.5) }
.bg-gray-50\/70 { background-color:rgba(247, 247, 248, 0.7) }
.bg-gray-50\/80 { background-color:rgba(247, 247, 248, 0.8) }
.bg-gray-500 { --tw-bg-opacity:1;background-color:rgb(116 118 134/var(--tw-bg-opacity,1)) }
.bg-gray-500\/5 { background-color:rgba(116, 118, 134, 0.05) }
.bg-gray-800 { --tw-bg-opacity:1;background-color:rgb(47 48 55/var(--tw-bg-opacity,1)) }
.bg-gray-800\/10 { background-color:rgba(47, 48, 55, 0.1) }
.bg-gray-800\/2\.5 { background-color:rgba(47, 48, 55, 0.024) }
.bg-gray-800\/20 { background-color:rgba(47, 48, 55, 0.2) }
.bg-gray-800\/7\.5 { background-color:rgba(47, 48, 55, 0.075) }
.bg-gray-800\/75 { background-color:rgba(47, 48, 55, 0.75) }
.bg-gray-800\/80 { background-color:rgba(47, 48, 55, 0.8) }
.bg-white { --tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity,1)) }
.bg-white\/10 { background-color:rgba(255, 255, 255, 0.1) }
.bg-white\/15 { background-color:rgba(255, 255, 255, 0.15) }
.bg-white\/17\.5 { background-color:rgba(255, 255, 255, 0.176) }
.bg-white\/2\.5 { background-color:rgba(255, 255, 255, 0.024) }
.bg-white\/20 { background-color:rgba(255, 255, 255, 0.2) }
.bg-white\/30 { background-color:rgba(255, 255, 255, 0.3) }
.bg-white\/40 { background-color:rgba(255, 255, 255, 0.4) }
.bg-white\/5 { background-color:rgba(255, 255, 255, 0.05) }
.bg-white\/50 { background-color:rgba(255, 255, 255, 0.5) }
.bg-white\/55 { background-color:rgba(255, 255, 255, 0.55) }
.bg-white\/60 { background-color:rgba(255, 255, 255, 0.6) }
.bg-white\/70 { background-color:rgba(255, 255, 255, 0.7) }
.bg-white\/75 { background-color:rgba(255, 255, 255, 0.75) }
.bg-white\/80 { background-color:rgba(255, 255, 255, 0.8) }
.bg-white\/\[0\.015\] { background-color:rgba(255, 255, 255, 0.016) }
.bg-white\/\[0\.02\] { background-color:rgba(255, 255, 255, 0.02) }
.bg-white\/\[0\.035\] { background-color:rgba(255, 255, 255, 0.035) }
.bg-white\/\[0\.03\] { background-color:rgba(255, 255, 255, 0.03) }
.bg-white\/\[0\.04\] { background-color:rgba(255, 255, 255, 0.04) }
.bg-white\/\[0\.06\] { background-color:rgba(255, 255, 255, 0.06) }
.bg-white\/\[0\.08\] { background-color:rgba(255, 255, 255, 0.08) }
.bg-white\/\[0\.12\] { background-color:rgba(255, 255, 255, 0.12) }
.bg-white\/\[0\.18\] { background-color:rgba(255, 255, 255, 0.18) }
.bg-white\/\[0\.36\] { background-color:rgba(255, 255, 255, 0.36) }
.bg-white\/\[0\.52\] { background-color:rgba(255, 255, 255, 0.52) }
.bg-gradient-to-r { background-image:linear-gradient(to right,var(--tw-gradient-stops)) }
.from-purple-500 { --tw-gradient-from:#6c47ff var(--tw-gradient-from-position);--tw-gradient-to:#6c47ff00 var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to) }
.to-sky-300 { --tw-gradient-to:#5de3ff var(--tw-gradient-to-position) }
.object-cover { object-fit:cover }
.p-1 { padding-top:0.25rem;padding-right:0.25rem;padding-bottom:0.25rem;padding-left:0.25rem }
.p-1\.5 { padding-top:0.375rem;padding-right:0.375rem;padding-bottom:0.375rem;padding-left:0.375rem }
.p-10 { padding-top:2.5rem;padding-right:2.5rem;padding-bottom:2.5rem;padding-left:2.5rem }
.p-16 { padding-top:4rem;padding-right:4rem;padding-bottom:4rem;padding-left:4rem }
.p-3 { padding-top:0.75rem;padding-right:0.75rem;padding-bottom:0.75rem;padding-left:0.75rem }
.p-3\.5 { padding-top:0.875rem;padding-right:0.875rem;padding-bottom:0.875rem;padding-left:0.875rem }
.px-12 { padding-left:3rem;padding-right:3rem }
.px-2 { padding-left:0.5rem;padding-right:0.5rem }
.px-2\.5 { padding-left:0.625rem;padding-right:0.625rem }
.px-4 { padding-left:1rem;padding-right:1rem }
.px-6 { padding-left:1.5rem;padding-right:1.5rem }
.py-1 { padding-top:0.25rem;padding-bottom:0.25rem }
.py-1\.5 { padding-top:0.375rem;padding-bottom:0.375rem }
.py-10 { padding-top:2.5rem;padding-bottom:2.5rem }
.py-12 { padding-top:3rem;padding-bottom:3rem }
.py-14 { padding-top:3.5rem;padding-bottom:3.5rem }
.py-16 { padding-top:4rem;padding-bottom:4rem }
.py-3 { padding-top:0.75rem;padding-bottom:0.75rem }
.py-3\.5 { padding-top:0.875rem;padding-bottom:0.875rem }
.pb-6 { padding-bottom:1.5rem }
.pr-2 { padding-right:0.5rem }
.pr-2\.5 { padding-right:0.625rem }
.pt-32 { padding-top:8rem }
.pt-6 { padding-top:1.5rem }
.pt-64 { padding-top:16rem }
.text-left { text-align:left }
.text-2xs { font-size:0.6875rem;line-height:1.25rem }
.text-2xs\/4 { font-size:0.6875rem;line-height:1rem }
.text-2xs\/6 { font-size:0.6875rem;line-height:1.5rem }
.text-2xs\/\[0\.875rem\] { font-size:0.6875rem;line-height:0.875rem }
.text-2xs\/\[1\.125rem\] { font-size:0.6875rem;line-height:1.125rem }
.text-3xl { font-size:2rem;line-height:2.5rem }
.text-3xl\/9 { font-size:2rem;line-height:2.25rem }
.text-sm { font-size:0.8125rem;line-height:1.5rem }
.text-sm\/4 { font-size:0.8125rem;line-height:1rem }
.text-sm\/5 { font-size:0.8125rem;line-height:1.25rem }
.text-sm\/6 { font-size:0.8125rem;line-height:1.5rem }
.text-sm\/\[1\.125rem\] { font-size:0.8125rem;line-height:1.125rem }
.text-sm\/\[1\.5\] { font-size:0.8125rem;line-height:1.5 }
.text-sm\/\[22px\] { font-size:0.8125rem;line-height:22px }
.font-book { font-weight:450 }
.font-medium { font-weight:500 }
.font-semibold { font-weight:600 }
.text-gray-300 { --tw-text-opacity:1;color:rgb(183 184 194/var(--tw-text-opacity,1)) }
.text-gray-400 { --tw-text-opacity:1;color:rgb(147 148 161/var(--tw-text-opacity,1)) }
.text-gray-400\/80 { color:rgba(147, 148, 161, 0.8) }
.text-gray-600 { --tw-text-opacity:1;color:rgb(94 95 110/var(--tw-text-opacity,1)) }
.text-gray-950 { --tw-text-opacity:1;color:rgb(19 19 22/var(--tw-text-opacity,1)) }
.text-purple-500 { --tw-text-opacity:1;color:rgb(108 71 255/var(--tw-text-opacity,1)) }
.text-white { --tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity,1)) }
.text-white\/40 { color:rgba(255, 255, 255, 0.4) }
.text-white\/50 { color:rgba(255, 255, 255, 0.5) }
.text-white\/70 { color:rgba(255, 255, 255, 0.7) }
.text-white\/80 { color:rgba(255, 255, 255, 0.8) }
.text-white\/\[0\.26\] { color:rgba(255, 255, 255, 0.26) }
.text-white\/\[0\.32\] { color:rgba(255, 255, 255, 0.32) }
.antialiased { -webkit-font-smoothing:antialiased }
.opacity-10 { opacity:0.1 }
.opacity-100 { opacity:1 }
.opacity-12\.5 { opacity:0.125 }
.opacity-15 { opacity:0.15 }
.opacity-25 { opacity:0.25 }
.opacity-70 { opacity:0.7 }
.mix-blend-multiply { mix-blend-mode:multiply }
.mix-blend-exclusion { mix-blend-mode:exclusion }
.mix-blend-luminosity { mix-blend-mode:luminosity }
.ring-1 { --tw-ring-offset-shadow:var(--tw-ring-inset)0 0 0 var(--tw-ring-offset-width)var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset)0 0 0 calc(1px + var(--tw-ring-offset-width))var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow,0 0 #0000) }
.ring-inset { --tw-ring-inset:inset }
.ring-gray-800 { --tw-ring-opacity:1;--tw-ring-color:rgb(47 48 55/var(--tw-ring-opacity,1)) }
.ring-gray-800\/10 { --tw-ring-color:#2f30371a }
.blur-sm { --tw-blur:blur(4px);filter:var(--tw-blur)var(--tw-brightness)var(--tw-contrast)var(--tw-grayscale)var(--tw-hue-rotate)var(--tw-invert)var(--tw-saturate)var(--tw-sepia)var(--tw-drop-shadow) }
.transition { transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter, backdrop-filter;transition-duration:0.15s;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1) }
.transition-\[border-color\,z-index\] { transition-property:border-color, z-index;transition-duration:0.15s;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1) }
.transition-\[clip-path\] { transition-property:clip-path;transition-duration:0.15s;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1) }
.transition-\[color\,background-color\,border-color\,text-decoration-color\,fill\,stroke\,box-shadow\,background\] { transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, box-shadow, background;transition-duration:0.15s;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1) }
.transition-\[filter\] { transition-property:filter;transition-duration:0.15s;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1) }
.transition-\[grid-template-columns\] { transition-property:grid-template-columns;transition-duration:0.15s;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1) }
.transition-\[grid-template-rows\] { transition-property:grid-template-rows;transition-duration:0.15s;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1) }
.transition-\[height\] { transition-property:height;transition-duration:0.15s;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1) }
.transition-\[width\] { transition-property:width;transition-duration:0.15s;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1) }
.transition-all { transition-property:all;transition-duration:0.15s;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1) }
.transition-colors { transition-property:color, background-color, border-color, text-decoration-color, fill, stroke;transition-duration:0.15s;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1) }
.transition-opacity { transition-property:opacity;transition-duration:0.15s;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1) }
.transition-shadow { transition-property:box-shadow;transition-duration:0.15s;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1) }
.transition-transform { transition-property:transform;transition-duration:0.15s;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1) }
.duration-1000 { transition-duration:1s }
.duration-300 { transition-duration:0.3s }
.duration-500 { transition-duration:0.5s }
.focus-visible\:outline-focus:focus-visible, .group\/link:focus-visible .group-focus-visible\/link\:outline-focus, .group:focus-visible .group-focus-visible\:outline-focus { outline-offset:var(--focus-outline-offset,2px) }
.group\/tablist:has([data-focus-visible]) .group-has-\[\[data-focus-visible\]\]\/tablist\:outline-focus { outline-offset:var(--focus-outline-offset,2px) }
.data-\[focus-visible\]\:outline-focus[data-focus-visible], .group[data-focus-visible] .group-data-\[focus-visible\]\:outline-focus { outline-offset:var(--focus-outline-offset,2px) }
.before\:dark .typography:not([data-heading-base]) h2:not([data-heading-step]) code::before, .before\:dark .typography[data-heading-base="1"] h2:not([data-heading-step]) code::before, .before\:dark .typography[data-heading-base="2"] h3:not([data-heading-step]) code::before { content:var(--tw-content);background-image:var(--type-code-middle-bg),url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 30'%3E%3Crect width='15' height='29' x='.5' y='.5' rx='8' ry='8' fill='%23212126' stroke='%232F3037'/%3E%3C/svg%3E"),url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 30'%3E%3Crect width='15' height='29' x='.5' y='.5' rx='8' ry='8' fill='%23212126' stroke='%232F3037'/%3E%3C/svg%3E") }
.before\:transition-opacity::before { content:var(--tw-content);transition-property:opacity;transition-duration:0.15s;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1) }
.before\:duration-300::before { content:var(--tw-content);transition-duration:0.3s }
.group\/fold:first-child .group-first\/fold\:mt-0 { margin-top:0px }
.group\/item:first-child .group-first\/item\:border-t-0 { border-top-width:0px }
.group\/item:first-child .group-first\/item\:pt-2\.5 { padding-top:0.625rem }
.group\/fold:last-child .group-last\/fold\:mb-0 { margin-bottom:0px }
.group:last-child .group-last\:after\:absolute::after { content:var(--tw-content);position:absolute }
.group:last-child .group-last\:after\:bottom-0::after { content:var(--tw-content);bottom:0px }
.group:last-child .group-last\:after\:left-0::after { content:var(--tw-content);left:0px }
.group:last-child .group-last\:after\:z-10::after { content:var(--tw-content);z-index:10 }
.group:last-child .group-last\:after\:h-px::after { content:var(--tw-content);height:1px }
.group:last-child .group-last\:after\:w-\[50vmax\]::after { content:var(--tw-content);width:50vmax }
.group:last-child .group-last\:after\:bg-white::after { content:var(--tw-content);--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity,1)) }
.group:last-child .group-last\:after\:from-white::after { content:var(--tw-content);--tw-gradient-from:#fff var(--tw-gradient-from-position);--tw-gradient-to:#fff0 var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to) }
.group:last-child .group-last\:after\:to-transparent::after { content:var(--tw-content);--tw-gradient-to:transparent var(--tw-gradient-to-position) }
.group:last-child .group-last\:after\:to-\[70\%\]::after { content:var(--tw-content);--tw-gradient-to-position:70% }
.group:last-child .group-last\:after\:opacity-\[0\.30\]::after { content:var(--tw-content);opacity:0.3 }
.group\/disc:first-of-type .group-first-of-type\/disc\:before\:hidden::before, .group\/disc:last-of-type .group-last-of-type\/disc\:after\:hidden::after { content:var(--tw-content);display:none }
.group\/fold[open] .group-open\/fold\:hidden { display:none }
.group:focus-within .group-focus-within\:inset-\[2px\] { top:2px;right:2px;bottom:2px;left:2px }
.group:focus-within .group-focus-within\:from-blue-400 { --tw-gradient-from:#60a5fa var(--tw-gradient-from-position);--tw-gradient-to:#60a5fa00 var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to) }
.group:focus-within .group-focus-within\:to-purple-400 { --tw-gradient-to:#9785ff var(--tw-gradient-to-position) }
@media (hover: hover) and (pointer: fine) {
  .group\/card:hover .group-hover\/card\:translate-x-0 { --tw-translate-x:0px;transform:translate(var(--tw-translate-x),var(--tw-translate-y))rotate(var(--tw-rotate))skewX(var(--tw-skew-x))skewY(var(--tw-skew-y))scaleX(var(--tw-scale-x))scaleY(var(--tw-scale-y)) }
  .group:hover .group-hover\:-translate-x-6 { --tw-translate-x:-1.5rem;transform:translate(var(--tw-translate-x),var(--tw-translate-y))rotate(var(--tw-rotate))skewX(var(--tw-skew-x))skewY(var(--tw-skew-y))scaleX(var(--tw-scale-x))scaleY(var(--tw-scale-y)) }
  .group:hover .group-hover\:translate-x-0 { --tw-translate-x:0px;transform:translate(var(--tw-translate-x),var(--tw-translate-y))rotate(var(--tw-rotate))skewX(var(--tw-skew-x))skewY(var(--tw-skew-y))scaleX(var(--tw-scale-x))scaleY(var(--tw-scale-y)) }
  .group:hover .group-hover\:translate-x-2 { --tw-translate-x:.5rem;transform:translate(var(--tw-translate-x),var(--tw-translate-y))rotate(var(--tw-rotate))skewX(var(--tw-skew-x))skewY(var(--tw-skew-y))scaleX(var(--tw-scale-x))scaleY(var(--tw-scale-y)) }
  .group:hover .group-hover\:translate-x-6 { --tw-translate-x:1.5rem;transform:translate(var(--tw-translate-x),var(--tw-translate-y))rotate(var(--tw-rotate))skewX(var(--tw-skew-x))skewY(var(--tw-skew-y))scaleX(var(--tw-scale-x))scaleY(var(--tw-scale-y)) }
  .group:hover .group-hover\:translate-y-0 { --tw-translate-y:0px;transform:translate(var(--tw-translate-x),var(--tw-translate-y))rotate(var(--tw-rotate))skewX(var(--tw-skew-x))skewY(var(--tw-skew-y))scaleX(var(--tw-scale-x))scaleY(var(--tw-scale-y)) }
  .group:hover .group-hover\:translate-y-\[-2px\] { --tw-translate-y:-2px;transform:translate(var(--tw-translate-x),var(--tw-translate-y))rotate(var(--tw-rotate))skewX(var(--tw-skew-x))skewY(var(--tw-skew-y))scaleX(var(--tw-scale-x))scaleY(var(--tw-scale-y)) }
  .group:hover .group-hover\:rotate-90 { --tw-rotate:90deg;transform:translate(var(--tw-translate-x),var(--tw-translate-y))rotate(var(--tw-rotate))skewX(var(--tw-skew-x))skewY(var(--tw-skew-y))scaleX(var(--tw-scale-x))scaleY(var(--tw-scale-y)) }
  .group\/code-block:hover .group-hover\/code-block\:border-white\/50 { border-top-color:rgba(255, 255, 255, 0.5);border-right-color:rgba(255, 255, 255, 0.5);border-bottom-color:rgba(255, 255, 255, 0.5);border-left-color:rgba(255, 255, 255, 0.5) }
  .group:hover .group-hover\:border-blue-600 { --tw-border-opacity:1 }
  .group\/link:hover .group-hover\/link\:bg-black\/10 { background-color:rgba(0, 0, 0, 0.1) }
  .group\/link:hover .group-hover\/link\:bg-gray-950\/10 { background-color:rgba(19, 19, 22, 0.1) }
  .group\/terminal:hover .group-hover\/terminal\:bg-\[\#28c840\] { --tw-bg-opacity:1;background-color:rgb(40 200 64/var(--tw-bg-opacity,1)) }
  .group\/terminal:hover .group-hover\/terminal\:bg-\[\#febc2e\] { --tw-bg-opacity:1;background-color:rgb(254 188 46/var(--tw-bg-opacity,1)) }
  .group\/terminal:hover .group-hover\/terminal\:bg-\[\#ff5f57\] { --tw-bg-opacity:1;background-color:rgb(255 95 87/var(--tw-bg-opacity,1)) }
  .group:hover .group-hover\:bg-\[--bg-hover\] { background-color:var(--bg-hover) }
  .group:hover .group-hover\:bg-gray-950\/10 { background-color:rgba(19, 19, 22, 0.1) }
  .group:hover .group-hover\:bg-purple-100\/70 { background-color:rgba(234, 232, 255, 0.7) }
  .group:hover .group-hover\:bg-white\/20 { background-color:rgba(255, 255, 255, 0.2) }
  .group:hover .group-hover\:bg-white\/75 { background-color:rgba(255, 255, 255, 0.75) }
  .group\/toggle:hover .group-hover\/toggle\:fill-white { fill:rgb(255, 255, 255) }
  .group:hover .group-hover\:fill-gray-400 { fill:rgb(147, 148, 161) }
  .group:hover .group-hover\:fill-white { fill:rgb(255, 255, 255) }
  .group\/button:hover .group-hover\/button\:stroke-gray-300 { stroke:rgb(183, 184, 194) }
  .group\/card:hover .group-hover\/card\:stroke-gray-950 { stroke:rgb(19, 19, 22) }
  .group\/item:hover .group-hover\/item\:stroke-gray-500 { stroke:rgb(116, 118, 134) }
  .group\/option:hover .group-hover\/option\:stroke-gray-300 { stroke:rgb(183, 184, 194) }
  .group\/option:hover .group-hover\/option\:stroke-gray-900 { stroke:rgb(33, 33, 38) }
  .group\/button:hover .group-hover\/button\:text-gray-400 { --tw-text-opacity:1;color:rgb(147 148 161/var(--tw-text-opacity,1)) }
  .group\/button:hover .group-hover\/button\:text-gray-500 { --tw-text-opacity:1;color:rgb(116 118 134/var(--tw-text-opacity,1)) }
  .group\/button:hover .group-hover\/button\:text-white\/60 { color:rgba(255, 255, 255, 0.6) }
  .group\/card:hover .group-hover\/card\:text-gray-950 { --tw-text-opacity:1;color:rgb(19 19 22/var(--tw-text-opacity,1)) }
  .group\/item:hover .group-hover\/item\:text-gray-600 { --tw-text-opacity:1;color:rgb(94 95 110/var(--tw-text-opacity,1)) }
  .group\/link:hover .group-hover\/link\:text-\[\#0A66C2\] { --tw-text-opacity:1;color:rgb(10 102 194/var(--tw-text-opacity,1)) }
  .group\/link:hover .group-hover\/link\:text-\[\#FF6600\] { --tw-text-opacity:1;color:rgb(255 102 0/var(--tw-text-opacity,1)) }
  .group\/link:hover .group-hover\/link\:text-black { --tw-text-opacity:1;color:rgb(0 0 0/var(--tw-text-opacity,1)) }
  .group\/link:hover .group-hover\/link\:text-gray-800 { --tw-text-opacity:1;color:rgb(47 48 55/var(--tw-text-opacity,1)) }
  .group\/post:hover .group-hover\/post\:text-gray-600 { --tw-text-opacity:1;color:rgb(94 95 110/var(--tw-text-opacity,1)) }
  .group\/radio:hover .group-hover\/radio\:text-gray-800 { --tw-text-opacity:1;color:rgb(47 48 55/var(--tw-text-opacity,1)) }
  .group\/terminal:hover .group-hover\/terminal\:text-\[\#70B8FF\] { --tw-text-opacity:1;color:rgb(112 184 255/var(--tw-text-opacity,1)) }
  .group:hover .group-hover\:\!text-gray-950 { --tw-text-opacity:1 !important;color:rgb(19 19 22/var(--tw-text-opacity,1)) !important }
  .group:hover .group-hover\:text-\[var\(--cli-gray-12\)\] { color:var(--cli-gray-12) }
  .group:hover .group-hover\:text-black { --tw-text-opacity:1;color:rgb(0 0 0/var(--tw-text-opacity,1)) }
  .group:hover .group-hover\:text-blue-600 { --tw-text-opacity:1;color:rgb(37 99 235/var(--tw-text-opacity,1)) }
  .group:hover .group-hover\:text-gray-600 { --tw-text-opacity:1;color:rgb(94 95 110/var(--tw-text-opacity,1)) }
  .group:hover .group-hover\:text-gray-950 { --tw-text-opacity:1;color:rgb(19 19 22/var(--tw-text-opacity,1)) }
  .group:hover .group-hover\:text-purple-500 { --tw-text-opacity:1;color:rgb(108 71 255/var(--tw-text-opacity,1)) }
  .group:hover .group-hover\:text-white { --tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity,1)) }
  .group\/link:hover .group-hover\/link\:decoration-gray-950, .group:hover .group-hover\:decoration-gray-950 { text-decoration-color:rgb(19, 19, 22) }
  .group\/card:hover .group-hover\/card\:opacity-100 { opacity:1 }
  .group\/card:hover .group-hover\/card\:opacity-50 { opacity:0.5 }
  .group\/code-root:hover .group-hover\/code-root\:opacity-100, .group\/copyable-root:hover .group-hover\/copyable-root\:opacity-100, .group\/disc:hover .group-hover\/disc\:opacity-100, .group\/link:hover .group-hover\/link\:opacity-100, .group\/terminal:hover .group-hover\/terminal\:opacity-100 { opacity:1 }
  .group:hover .group-hover\:opacity-0 { opacity:0 }
  .group:hover .group-hover\:opacity-100 { opacity:1 }
  .group:hover .group-hover\:ring-gray-700 { --tw-ring-opacity:1;--tw-ring-color:rgb(66 67 77/var(--tw-ring-opacity,1)) }
  .group:hover .group-hover\:grayscale-0 { --tw-grayscale:grayscale(0);filter:var(--tw-blur)var(--tw-brightness)var(--tw-contrast)var(--tw-grayscale)var(--tw-hue-rotate)var(--tw-invert)var(--tw-saturate)var(--tw-sepia)var(--tw-drop-shadow) }
  .group:hover .group-hover\:delay-75 { transition-delay:75ms }
  .group:hover .group-hover\:duration-1000 { transition-duration:1s }
  .group:hover .before\:group-hover\:opacity-0::before { content:var(--tw-content);opacity:0 }
  .group:hover .before\:group-hover\:duration-500::before { content:var(--tw-content);transition-duration:0.5s }
}

.group:focus .group-focus\:translate-y-0 { --tw-translate-y:0px;transform:translate(var(--tw-translate-x),var(--tw-translate-y))rotate(var(--tw-rotate))skewX(var(--tw-skew-x))skewY(var(--tw-skew-y))scaleX(var(--tw-scale-x))scaleY(var(--tw-scale-y)) }
.group:focus .group-focus\:opacity-0 { opacity:0 }
.group:focus .group-focus\:opacity-100 { opacity:1 }
.group:focus .group-focus\:delay-75 { transition-delay:75ms }
.group:focus-visible .group-focus-visible\:border-blue-600 { --tw-border-opacity:1 }
.group:focus-visible .group-focus-visible\:text-blue-600 { --tw-text-opacity:1;color:rgb(37 99 235/var(--tw-text-opacity,1)) }
.group:focus-visible .group-focus-visible\:opacity-100 { opacity:1 }
.group\/link:focus-visible .group-focus-visible\/link\:outline-offset-4 { outline-offset:4px }
.has-\[\>span\>code\[data-last\]\]\:pr-0:has(> span > code[data-last]) { padding-right:0px }
.group\/nav:has([data-navitem]:hover) .group-has-\[\[data-navitem\]\:hover\]\/nav\:text-gray-500 { --tw-text-opacity:1;color:rgb(116 118 134/var(--tw-text-opacity,1)) }
.group\/nav:has([data-state="open"]) .group-has-\[\[data-state\=open\]\]\/nav\:text-gray-500 { --tw-text-opacity:1;color:rgb(116 118 134/var(--tw-text-opacity,1)) }
.group\/hero:has(canvas) .group-has-\[canvas\]\/hero\:opacity-100 { opacity:1 }
.group\/hero:has(canvas) .group-has-\[canvas\]\/hero\:\[clip-path\:polygon\(0_0\,100\%_0\,100\%_100\%\,0_100\%\)\] { clip-path:polygon(0px 0px, 100% 0px, 100% 100%, 0px 100%) }
.group[aria-expanded="true"] .group-aria-expanded\:block { display:block }
.group[aria-expanded="true"] .group-aria-expanded\:hidden { display:none }
.group\/toggle[aria-expanded="true"] .group-aria-expanded\/toggle\:fill-white { fill:rgb(255, 255, 255) }
.group[aria-expanded="true"] .group-aria-expanded\:fill-gray-400 { fill:rgb(147, 148, 161) }
.group\/button[aria-expanded="true"] .group-aria-expanded\/button\:text-white\/60 { color:rgba(255, 255, 255, 0.6) }
.group\/link[aria-expanded="true"] .group-aria-expanded\/link\:decoration-gray-950 { text-decoration-color:rgb(19, 19, 22) }
.group\/item[aria-selected="true"] .group-aria-\[selected\=true\]\/item\:block { display:block }
.group[aria-expanded="true"] .group-aria-\[expanded\=true\]\:rotate-180 { --tw-rotate:180deg;transform:translate(var(--tw-translate-x),var(--tw-translate-y))rotate(var(--tw-rotate))skewX(var(--tw-skew-x))skewY(var(--tw-skew-y))scaleX(var(--tw-scale-x))scaleY(var(--tw-scale-y)) }
.group[aria-expanded="true"] .group-aria-\[expanded\=true\]\:text-gray-950 { --tw-text-opacity:1;color:rgb(19 19 22/var(--tw-text-opacity,1)) }
.group\/disclosure[data-expanded] .group-data-\[expanded\]\/disclosure\:visible { visibility:visible }
.group\/disclosure[data-expanded] .group-data-\[expanded\]\/disclosure\:invisible { visibility:hidden }
.group\/disclosure[data-expanded] .group-data-\[expanded\]\/disclosure\:top-\[0\.0625rem\] { top:0.0625rem }
.group[data-selected] .group-data-\[selected\]\:translate-x-full { --tw-translate-x:100%;transform:translate(var(--tw-translate-x),var(--tw-translate-y))rotate(var(--tw-rotate))skewX(var(--tw-skew-x))skewY(var(--tw-skew-y))scaleX(var(--tw-scale-x))scaleY(var(--tw-scale-y)) }
.group[data-state="open"] .group-data-\[state\=open\]\:translate-y-0 { --tw-translate-y:0px;transform:translate(var(--tw-translate-x),var(--tw-translate-y))rotate(var(--tw-rotate))skewX(var(--tw-skew-x))skewY(var(--tw-skew-y))scaleX(var(--tw-scale-x))scaleY(var(--tw-scale-y)) }
.group[data-state="open"] .group-data-\[state\=open\]\:translate-y-\[2px\] { --tw-translate-y:2px;transform:translate(var(--tw-translate-x),var(--tw-translate-y))rotate(var(--tw-rotate))skewX(var(--tw-skew-x))skewY(var(--tw-skew-y))scaleX(var(--tw-scale-x))scaleY(var(--tw-scale-y)) }
.group\/code-wrapper[data-collapsed="false"] .group-data-\[collapsed\=false\]\/code-wrapper\:rotate-180 { --tw-rotate:180deg;transform:translate(var(--tw-translate-x),var(--tw-translate-y))rotate(var(--tw-rotate))skewX(var(--tw-skew-x))skewY(var(--tw-skew-y))scaleX(var(--tw-scale-x))scaleY(var(--tw-scale-y)) }
.group\/disclosure[data-expanded] .group-data-\[expanded\]\/disclosure\:rotate-0 { --tw-rotate:0deg;transform:translate(var(--tw-translate-x),var(--tw-translate-y))rotate(var(--tw-rotate))skewX(var(--tw-skew-x))skewY(var(--tw-skew-y))scaleX(var(--tw-scale-x))scaleY(var(--tw-scale-y)) }
.group\/disclosure[data-expanded] .group-data-\[expanded\]\/disclosure\:rotate-180 { --tw-rotate:180deg;transform:translate(var(--tw-translate-x),var(--tw-translate-y))rotate(var(--tw-rotate))skewX(var(--tw-skew-x))skewY(var(--tw-skew-y))scaleX(var(--tw-scale-x))scaleY(var(--tw-scale-y)) }
.group\/code-wrapper[data-collapsed="true"] .group-data-\[collapsed\=true\]\/code-wrapper\:overflow-hidden { overflow-x:hidden;overflow-y:hidden }
.group[data-selected] .group-data-\[selected\]\:border-\[rgb\(19\,19\,22\)\] { --tw-border-opacity:1 }
.group\/item[data-highlighted] .group-data-\[highlighted\]\/item\:bg-gray-50 { --tw-bg-opacity:1;background-color:rgb(247 247 248/var(--tw-bg-opacity,1)) }
.group[data-selected] .group-data-\[selected\]\:bg-\[--addon-color\] { background-color:var(--addon-color) }
.group[data-selected] .group-data-\[selected\]\:bg-\[rgb\(19\,19\,22\)\] { --tw-bg-opacity:1;background-color:rgb(19 19 22/var(--tw-bg-opacity,1)) }
.group\/code-wrapper[data-collapsed="false"] .group-data-\[collapsed\=false\]\/code-wrapper\:bg-none { background-image:none }
.group\/field[data-disabled] .group-data-\[disabled\]\/field\:fill-gray-200 { fill:rgb(217, 217, 222) }
.group\/field[data-disabled] .group-data-\[disabled\]\/field\:fill-gray-600 { fill:rgb(94, 95, 110) }
.group\/button[data-hovered] .group-data-\[hovered\]\/button\:stroke-gray-400 { stroke:rgb(147, 148, 161) }
.group\/button[data-hovered] .group-data-\[hovered\]\/button\:stroke-gray-950 { stroke:rgb(19, 19, 22) }
.group\/code-wrapper[data-collapsed] .group-data-\[collapsed\]\/code-wrapper\:pb-12 { padding-bottom:3rem }
.group\/field[data-disabled] .group-data-\[disabled\]\/field\:text-gray-400 { --tw-text-opacity:1;color:rgb(147 148 161/var(--tw-text-opacity,1)) }
.group\/radio[data-selected] .group-data-\[selected\]\/radio\:text-gray-800 { --tw-text-opacity:1;color:rgb(47 48 55/var(--tw-text-opacity,1)) }
.group\/segment-control-item[data-selected] .group-data-\[selected\]\/segment-control-item\:text-gray-900 { --tw-text-opacity:1;color:rgb(33 33 38/var(--tw-text-opacity,1)) }
.group[data-state="open"] .group-data-\[state\=open\]\:\!text-gray-950 { --tw-text-opacity:1 !important;color:rgb(19 19 22/var(--tw-text-opacity,1)) !important }
.group\/item[data-focused] .group-data-\[focused\]\/item\:opacity-100, .group\/item[data-hovered] .group-data-\[hovered\]\/item\:opacity-100, .group\/tab[data-selected] .group-data-\[selected\]\/tab\:opacity-100, .group[data-selected] .group-data-\[selected\]\:opacity-100 { opacity:1 }
.group[data-state="open"] .group-data-\[state\=open\]\:opacity-0 { opacity:0 }
.group[data-state="open"] .group-data-\[state\=open\]\:opacity-100 { opacity:1 }
.group[data-selected] .group-data-\[selected\]\:shadow-\[0_0_8px_4px\] { --tw-shadow:0 0 8px 4px;--tw-shadow-colored:0 0 8px 4px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow) }
.group[data-selected] .group-data-\[selected\]\:shadow-\[--addon-shadow\] { --tw-shadow-color:var(--addon-shadow);--tw-shadow:var(--tw-shadow-colored) }
.group\/field[data-invalid] .group-data-\[invalid\]\/field\:ring-red-400 { --tw-ring-opacity:1;--tw-ring-color:rgb(248 113 113/var(--tw-ring-opacity,1)) }
.group[data-selected] .group-data-\[selected\]\:ring-\[--addon-color\] { --tw-ring-color:var(--addon-color) }
.group\/disc[data-expanded="true"] .group-data-\[expanded\=true\]\/disc\:\[transition\:grid-template-rows_spring\(0\.3\,_0\)\,transform_spring\(0\.3\,_0\)\,opacity_linear_0\.3s_0\.12s\] { transition-behavior:normal, normal, normal;transition-duration:0.45s, 0.45s, 0.3s;transition-timing-function:linear(0 0%, 0.1092 7.14286%, 0.309 14.2857%, 0.5015 21.4286%, 0.656 28.5714%, 0.7698 35.7143%, 0.8493 42.8571%, 0.9029 50%, 0.9383 57.1429%, 0.9612 64.2857%, 0.9758 71.4286%, 0.985 78.5714%, 0.9908 85.7143%, 0.9944 92.8571%, 1 100%), linear(0 0%, 0.1092 7.14286%, 0.309 14.2857%, 0.5015 21.4286%, 0.656 28.5714%, 0.7698 35.7143%, 0.8493 42.8571%, 0.9029 50%, 0.9383 57.1429%, 0.9612 64.2857%, 0.9758 71.4286%, 0.985 78.5714%, 0.9908 85.7143%, 0.9944 92.8571%, 1 100%), linear;transition-delay:0s, 0s, 0.12s;transition-property:grid-template-rows, transform, opacity }
.group\/disclosure[data-expanded] .group-data-\[expanded\]\/disclosure\:after\:bottom-2::after { content:var(--tw-content);bottom:0.5rem }
.group\/field[data-invalid] .group-data-\[invalid\]\/field\:focus\:ring-red-500\/15:focus { --tw-ring-color:#ef444426 }
.group\/field[data-invalid] .group-data-\[invalid\]\/field\:focus\:ring-offset-red-400:focus { --tw-ring-offset-color:#f87171 }
@media (hover: hover) and (pointer: fine) {
  .group:hover .dark\:group-hover\:border-blue-400:is(.dark *) { --tw-border-opacity:1 }
  .group:hover .dark\:group-hover\:bg-gray-800\/50:is(.dark *) { background-color:rgba(47, 48, 55, 0.5) }
  .group\/item:hover .dark\:group-hover\/item\:fill-gray-700:is(.dark *) { fill:rgb(66, 67, 77) }
  .group\/card:hover .dark\:group-hover\/card\:stroke-white:is(.dark *) { stroke:rgb(255, 255, 255) }
  .group\/item:hover .dark\:group-hover\/item\:stroke-gray-300:is(.dark *) { stroke:rgb(183, 184, 194) }
  .group\/option:hover .dark\:group-hover\/option\:stroke-gray-100:is(.dark *) { stroke:rgb(238, 238, 240) }
  .group\/card:hover .dark\:group-hover\/card\:text-gray-300:is(.dark *), .group\/item:hover .dark\:group-hover\/item\:text-gray-300:is(.dark *), .group\/link:hover .dark\:group-hover\/link\:text-gray-300:is(.dark *), .group\/radio:hover .dark\:group-hover\/radio\:text-gray-300:is(.dark *) { --tw-text-opacity:1;color:rgb(183 184 194/var(--tw-text-opacity,1)) }
  .group:hover .dark\:group-hover\:\!text-gray-50:is(.dark *) { --tw-text-opacity:1 !important;color:rgb(247 247 248/var(--tw-text-opacity,1)) !important }
  .group:hover .dark\:group-hover\:text-blue-400:is(.dark *) { --tw-text-opacity:1;color:rgb(96 165 250/var(--tw-text-opacity,1)) }
  .group:hover .dark\:group-hover\:text-gray-50:is(.dark *) { --tw-text-opacity:1;color:rgb(247 247 248/var(--tw-text-opacity,1)) }
  .group\/link:hover .dark\:group-hover\/link\:decoration-white:is(.dark *), .group:hover .dark\:group-hover\:decoration-white:is(.dark *) { text-decoration-color:rgb(255, 255, 255) }
}

.group:focus-visible .dark\:group-focus-visible\:border-blue-400:is(.dark *) { --tw-border-opacity:1 }
.group:focus-visible .dark\:group-focus-visible\:text-blue-400:is(.dark *) { --tw-text-opacity:1;color:rgb(96 165 250/var(--tw-text-opacity,1)) }
.group\/nav:has([data-navitem]:hover) .dark\:group-has-\[\[data-navitem\]\:hover\]\/nav\:text-gray-300:is(.dark *) { --tw-text-opacity:1;color:rgb(183 184 194/var(--tw-text-opacity,1)) }
.group\/nav:has([data-state="open"]) .dark\:group-has-\[\[data-state\=open\]\]\/nav\:text-gray-300:is(.dark *) { --tw-text-opacity:1;color:rgb(183 184 194/var(--tw-text-opacity,1)) }
.group\/link[aria-expanded="true"] .dark\:group-aria-expanded\/link\:decoration-white:is(.dark *) { text-decoration-color:rgb(255, 255, 255) }
.group[aria-expanded="true"] .dark\:group-aria-\[expanded\=true\]\:text-gray-50:is(.dark *) { --tw-text-opacity:1;color:rgb(247 247 248/var(--tw-text-opacity,1)) }
.group\/button[data-hovered] .dark\:group-data-\[hovered\]\/button\:stroke-gray-500:is(.dark *) { stroke:rgb(116, 118, 134) }
.group\/button[data-hovered] .dark\:group-data-\[hovered\]\/button\:stroke-white:is(.dark *) { stroke:rgb(255, 255, 255) }
.group\/radio[data-selected] .dark\:group-data-\[selected\]\/radio\:text-gray-300:is(.dark *) { --tw-text-opacity:1;color:rgb(183 184 194/var(--tw-text-opacity,1)) }
.group[data-state="open"] .dark\:group-data-\[state\=open\]\:\!text-gray-50:is(.dark *) { --tw-text-opacity:1 !important;color:rgb(247 247 248/var(--tw-text-opacity,1)) !important }
@media (min-width: 48em) {
  .md\:grid-cols-2 { grid-template-columns:repeat(2, minmax(0px, 1fr)) }
  .md\:grid-rows-3 { grid-template-rows:repeat(3, minmax(0px, 1fr)) }
  .md\:px-8 { padding-left:2rem;padding-right:2rem }
  .group:last-child .md\:group-last\:after\:bg-transparent::after { content:var(--tw-content);background-color:rgba(0, 0, 0, 0) }
  .group:last-child .md\:group-last\:after\:bg-gradient-to-r::after { content:var(--tw-content);background-image:linear-gradient(to right,var(--tw-gradient-stops)) }
}

@media (min-width: 80em) {
  .xl\:order-none { order:0 }
  .xl\:grid-cols-3 { grid-template-columns:repeat(3, minmax(0px, 1fr)) }
  .xl\:grid-rows-2 { grid-template-rows:repeat(2, minmax(0px, 1fr)) }
  .group\/companies[data-narrow] .xl\:group-data-\[narrow\]\/companies\:hidden { display:none }
}

.\[\&\>\:first-child_a\]\:before\:hidden > :first-child a::before { content:var(--tw-content);display:none }
.\[\&\>\:is\(img\,svg\)\]\:size-4 > :is(img, svg) { width:1rem;height:1rem }
.\[\&\>\:is\(img\,svg\)\]\:size-5 > :is(img, svg) { width:1.25rem;height:1.25rem }
.\[\&\>\:is\(img\,svg\)\]\:h-10 > :is(img, svg) { height:2.5rem }
.\[\&\>\:is\(img\,svg\)\]\:h-8 > :is(img, svg) { height:2rem }
.\[\&\>\:is\(img\,svg\)\]\:h-auto > :is(img, svg) { height:auto }
.\[\&\>\:is\(img\,svg\)\]\:w-8 > :is(img, svg) { width:2rem }
.\[\&\>\:is\(img\,svg\)\]\:w-auto > :is(img, svg) { width:auto }
.\[\&\>figure\>div\>div\]\:flex > figure > div > div, .\[\&\>figure\>div\]\:flex > figure > div { display:flex }
.\[\&\>figure\>div\]\:flex-1 > figure > div { flex-grow:1;flex-shrink:1;flex-basis:0% }
.\[\&\>img\]\:absolute > img { position:absolute }
.\[\&\>img\]\:inset-0 > img { top:0px;right:0px;bottom:0px;left:0px }
.\[\&\>img\]\:size-full > img { width:100%;height:100% }
.\[\&\>img\]\:object-contain > img { object-fit:contain }
.\[\&\>img\]\:object-cover > img { object-fit:cover }
.\[\&\>p\]\:px-0 > p { padding-left:0px;padding-right:0px }
.\[\&\>p\]\:px-\[calc\(30\/16\*1rem\)\] > p { padding-left:1.875rem;padding-right:1.875rem }
.\[\&\>p\]\:text-xs > p { font-size:0.75rem;line-height:1.25rem }
.\[\&\>p\]\:leading-\[calc\(18\/16\*1rem\)\] > p { line-height:1.125rem }
.\[\&\>p\]\:text-gray-500 > p { --tw-text-opacity:1;color:rgb(116 118 134/var(--tw-text-opacity,1)) }
.\[\&\>svg\]\:absolute > svg { position:absolute }
.\[\&\>svg\]\:inset-0 > svg { top:0px;right:0px;bottom:0px;left:0px }
.\[\&\>svg\]\:size-2\.5 > svg { width:0.625rem;height:0.625rem }
.\[\&\>svg\]\:size-4 > svg { width:1rem;height:1rem }
.\[\&\>svg\]\:size-full > svg { width:100%;height:100% }
.\[\&\>svg\]\:h-full > svg { height:100% }
.\[\&\>svg\]\:w-full > svg { width:100% }
.\[\&\>svg\]\:overflow-visible > svg { overflow-x:visible;overflow-y:visible }
.\[\&_a\[x-apple-data-detectors\]\]\:text-inherit a[x-apple-data-detectors] { color:inherit }
.\[\&_a\[x-apple-data-detectors\]\]\:no-underline a[x-apple-data-detectors] { text-decoration-line:none }
.\[\&_a\]\:relative a { position:relative }
.\[\&_a\]\:bg-black a { --tw-bg-opacity:1;background-color:rgb(0 0 0/var(--tw-bg-opacity,1)) }
.\[\&_a\]\:font-medium a { font-weight:500 }
.\[\&_a\]\:text-inherit a { color:inherit }
.\[\&_a\]\:text-white a { --tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity,1)) }
.\[\&_a\]\:underline a { text-decoration-line:underline }
.\[\&_a\]\:no-underline a { text-decoration-line:none }
.\[\&_a\]\:decoration-gray-200 a { text-decoration-color:rgb(217, 217, 222) }
.\[\&_a\]\:decoration-2 a { text-decoration-thickness:2px }
.\[\&_a\]\:underline-offset-\[0\.25em\] a { text-underline-offset:0.25em }
.\[\&_a\]\:transition-colors a { transition-property:color, background-color, border-color, text-decoration-color, fill, stroke;transition-duration:0.15s;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1) }
.\[\&_a\]\:before\:absolute a::before { content:var(--tw-content);position:absolute }
.\[\&_a\]\:before\:inset-\[-2px_0\.25rem_100\%_0\.25rem\] a::before { content:var(--tw-content);top:-2px;right:0.25rem;bottom:100%;left:0.25rem }
@media (hover: hover) and (pointer: fine) {
  .hover\:\[\&_a\]\:decoration-gray-950 a:hover { text-decoration-color:rgb(19, 19, 22) }
}

.dark\:\[\&_a\]\:decoration-gray-600 a:is(.dark *) { text-decoration-color:rgb(94, 95, 110) }
@media (hover: hover) and (pointer: fine) {
  .dark\:hover\:\[\&_a\]\:text-white a:hover:is(.dark *) { --tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity,1)) }
  .dark\:hover\:\[\&_a\]\:decoration-white a:hover:is(.dark *) { text-decoration-color:rgb(255, 255, 255) }
}

.\[\&_div\]\:rounded-full div { border-top-left-radius:9999px;border-top-right-radius:9999px;border-bottom-right-radius:9999px;border-bottom-left-radius:9999px }
.\[\&_path\]\:fill-gray-500 path { fill:rgb(116, 118, 134) }
.\[\&_path\]\:transition-\[fill\] path { transition-property:fill;transition-duration:0.15s;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1) }
.\[\&_path\]\:duration-200 path { transition-duration:0.2s }
@media (hover: hover) and (pointer: fine) {
  .group:hover .group-hover\:\[\&_path\]\:fill-black path { fill:rgb(0, 0, 0) }
}

.group[data-state="open"] .group-data-\[state\=open\]\:\[\&_path\]\:fill-black path { fill:rgb(0, 0, 0) }
.dark\:\[\&_path\]\:fill-gray-400 path:is(.dark *) { fill:rgb(147, 148, 161) }
@media (hover: hover) and (pointer: fine) {
  .group:hover .dark\:group-hover\:\[\&_path\]\:fill-gray-50 path:is(.dark *) { fill:rgb(247, 247, 248) }
}

.group[data-state="open"] .dark\:group-data-\[state\=open\]\:\[\&_path\]\:fill-gray-50 path:is(.dark *) { fill:rgb(247, 247, 248) }
.group:not(:last-child) .\[\.group\:not\(\:last-child\)_\&\]\:before\:absolute::before { content:var(--tw-content);position:absolute }
.group:not(:last-child) .\[\.group\:not\(\:last-child\)_\&\]\:before\:inset-x-0::before { content:var(--tw-content);left:0px;right:0px }
.group:not(:last-child) .\[\.group\:not\(\:last-child\)_\&\]\:before\:bottom-0::before { content:var(--tw-content);bottom:0px }
.group:not(:last-child) .\[\.group\:not\(\:last-child\)_\&\]\:before\:left-0::before { content:var(--tw-content);left:0px }
.group:not(:last-child) .\[\.group\:not\(\:last-child\)_\&\]\:before\:z-10::before { content:var(--tw-content);z-index:10 }
.group:not(:last-child) .\[\.group\:not\(\:last-child\)_\&\]\:before\:h-px::before { content:var(--tw-content);height:1px }
.group:not(:last-child) .\[\.group\:not\(\:last-child\)_\&\]\:before\:bg-white::before { content:var(--tw-content);--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity,1)) }
.group:not(:last-child) .\[\.group\:not\(\:last-child\)_\&\]\:before\:opacity-\[0\.30\]::before { content:var(--tw-content);opacity:0.3 }
.signed-in .\[\.signed-in_\&\]\:contents, .signed-out .\[\.signed-out_\&\]\:contents { display:contents }
.typography:has(> p:last-child) + .\[\.typography\:has\(\>p\:last-child\)\+\&\]\:mt-\[calc\(theme\(margin\.1\)\*-1\)\] { margin-top:-0.25rem }
.typography:has(> p:last-child) + [data-auth] > .\[\.typography\:has\(\>p\:last-child\)\+\[data-auth\]\>\&\:first-child\]\:mt-\[calc\(theme\(margin\.1\)\*-1\)\]:first-child { margin-top:-0.25rem }
:is(.signed-in [data-signed-in], .signed-out [data-signed-out], [data-auth][data-visible]):has(> .typography:last-child > p:last-child) + .\[\:is\(\.signed-in_\[data-signed-in\]\,\.signed-out_\[data-signed-out\]\,\[data-auth\]\[data-visible\]\)\:has\(\>\.typography\:last-child\>p\:last-child\)\+\&\]\:mt-\[calc\(theme\(margin\.1\)\*-1\)\] { margin-top:-0.25rem }
:is(.signed-in [data-signed-in], .signed-out [data-signed-out], [data-auth][data-visible]):has(> .typography:last-child > p:last-child) + [data-auth] + .\[\:is\(\.signed-in_\[data-signed-in\]\,\.signed-out_\[data-signed-out\]\,\[data-auth\]\[data-visible\]\)\:has\(\>\.typography\:last-child\>p\:last-child\)\+\[data-auth\]\+\&\]\:mt-\[calc\(theme\(margin\.1\)\*-1\)\] { margin-top:-0.25rem }
:host { --header-mt:3rem }
</style><div class="pt-32 mx-auto w-full px-6 sm:max-w-[40rem] md:max-w-[48rem] md:px-8 lg:max-w-[64rem] xl:max-w-[80rem]" id="b2b-saas"><div class=""><h2 class="text-sm font-medium text-purple-500">B2B Authentication</h2><p class="mt-4 text-balance text-3xl font-semibold tracking-[-0.015em] text-gray-950">The easy solution to multi-tenancy</p><p class="mb-4 mt-4 max-w-md text-pretty text-base/6 text-gray-600">Clerk has all the features you need to onboard and manage the users and organizations of your multi-tenant SaaS application.</p><a class="group relative isolate inline-flex items-center justify-center overflow-hidden text-left font-medium transition duration-300 ease-[cubic-bezier(0.4,0.36,0,1)] before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] before:transition-opacity text-gray-950 text-sm text-gray-950" target="" href="https://clerk.com/organizations">Explore B2B features<svg viewBox="0 0 10 10" aria-hidden="true" class="ml-2 h-2.5 w-2.5 flex-none opacity-60 group-hover:translate-x-6 group-hover:opacity-0 transition duration-300 ease-[cubic-bezier(0.4,0.36,0,1)] before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] before:transition-opacity"><path fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m7.25 5-3.5-2.25v4.5L7.25 5Z"></path></svg><svg viewBox="0 0 10 10" aria-hidden="true" class="-ml-2.5 h-2.5 w-2.5 flex-none -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition duration-300 ease-[cubic-bezier(0.4,0.36,0,1)] before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] before:transition-opacity"><path fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m7.25 5-3.5-2.25v4.5L7.25 5Z"></path></svg></a></div><div class="mt-12 grid grid-flow-col grid-cols-1 grid-rows-6 gap-2 md:grid-cols-2 md:grid-rows-3 xl:grid-cols-3 xl:grid-rows-2"><div class="group isolate flex flex-col rounded-2xl bg-white shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] overflow-hidden row-span-2"><div class="relative z-20 flex-none px-6 pt-6"><div class="flex flex-wrap items-center gap-2"><h3 class="text-sm font-medium text-gray-950">Custom roles and permissions</h3></div><div class="mt-2 text-pretty text-sm/5 text-gray-600"><div>Powerful primitives to fully customize your app's authorization story.</div></div></div><div class="pointer-events-none relative z-10 flex-auto select-none min-h-[10.25rem]" aria-hidden="true"><svg width="0" height="0" aria-hidden="true"><defs><pattern id="wave" width="12" height="3" patternUnits="userSpaceOnUse"><path fill="none" stroke="white" stroke-opacity="0.1" d="M-6 0c3 2 6 0 6 0s3-2 6 0 6 0 6 0 3-2 6 0M-6 3c3 2 6 0 6 0s3-2 6 0 6 0 6 0 3-2 6 0"></path></pattern></defs></svg><div class="flex h-full flex-col items-center justify-center"><div class="grid w-max grid-cols-3 grid-rows-3 gap-2"><div class="rounded-lg ring-1 ring-gray-900/7.5"></div><div class="rounded-lg p-1 ring-1 ring-gray-900/5 transition duration-1000 shadow-[0_1px_1px_rgba(0,0,0,0.05),0_5px_11px_rgba(34,42,53,0.14),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)]"><div class="relative overflow-hidden rounded bg-gray-50 transition duration-1000" style="background:radial-gradient(241.22% 160.71% at 49.27% -9.52%, rgb(108 71 255 / 0.3), rgb(255 249 99 / 0.24) 41.24%, rgb(56 218 253 / 0.18) 62.34%, rgb(98 72 246 / 0) 91.89%)"><img alt="" loading="lazy" width="72" height="84" decoding="async" data-nimg="1" class="h-[5.25rem] w-[4.5rem] object-cover mix-blend-multiply" style="color:transparent" srcset="https://clerk.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-1%403x.ab226876.png&amp;w=96&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc 1x, https://clerk.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-1%403x.ab226876.png&amp;w=256&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc 2x" src="https://clerk.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-1%403x.ab226876.png&amp;w=256&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc"><svg class="absolute inset-0 size-full" aria-hidden="true"><rect width="100%" height="100%" fill="url(#wave)"></rect></svg><div class="absolute inset-0 rounded ring-1 ring-inset ring-black/5"></div></div></div><div class="rounded-lg bg-gray-800/7.5 ring-1 ring-gray-900/12.5"></div><div class="rounded-lg p-1 ring-1 ring-gray-900/5 transition duration-1000 shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)]"><div class="relative overflow-hidden rounded bg-gray-50 transition duration-1000 opacity-70 mix-blend-luminosity" style="background:radial-gradient(241.22% 160.71% at 49.27% -9.52%, rgb(108 71 255 / 0.3), rgb(255 249 99 / 0.24) 41.24%, rgb(56 218 253 / 0.18) 62.34%, rgb(98 72 246 / 0) 91.89%)"><img alt="" loading="lazy" width="72" height="84" decoding="async" data-nimg="1" class="h-[5.25rem] w-[4.5rem] object-cover mix-blend-multiply" style="color:transparent" srcset="https://clerk.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-2%403x.b8da10b3.png&amp;w=96&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc 1x, https://clerk.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-2%403x.b8da10b3.png&amp;w=256&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc 2x" src="https://clerk.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-2%403x.b8da10b3.png&amp;w=256&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc"><svg class="absolute inset-0 size-full" aria-hidden="true"><rect width="100%" height="100%" fill="url(#wave)"></rect></svg><div class="absolute inset-0 rounded ring-1 ring-inset ring-black/5"></div></div></div><div class="rounded-lg bg-gray-800/2.5 ring-1 ring-gray-900/7.5"></div><div class="rounded-lg p-1 ring-1 ring-gray-900/5 transition duration-1000 shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)]"><div class="relative overflow-hidden rounded bg-gray-50 transition duration-1000 opacity-70 mix-blend-luminosity" style="background:radial-gradient(241.22% 160.71% at 49.27% -9.52%, rgb(108 71 255 / 0.3), rgb(255 249 99 / 0.24) 41.24%, rgb(56 218 253 / 0.18) 62.34%, rgb(98 72 246 / 0) 91.89%)"><img alt="" loading="lazy" width="72" height="84" decoding="async" data-nimg="1" class="h-[5.25rem] w-[4.5rem] object-cover mix-blend-multiply" style="color:transparent" srcset="https://clerk.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-3%403x.035bd2d4.png&amp;w=96&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc 1x, https://clerk.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-3%403x.035bd2d4.png&amp;w=256&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc 2x" src="https://clerk.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-3%403x.035bd2d4.png&amp;w=256&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc"><svg class="absolute inset-0 size-full" aria-hidden="true"><rect width="100%" height="100%" fill="url(#wave)"></rect></svg><div class="absolute inset-0 rounded ring-1 ring-inset ring-black/5"></div></div></div><div class="rounded-lg ring-1 ring-gray-900/7.5"></div><div class="rounded-lg p-1 ring-1 ring-gray-900/5 transition duration-1000 shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)]"><div class="relative overflow-hidden rounded bg-gray-50 transition duration-1000 opacity-70 mix-blend-luminosity" style="background:radial-gradient(241.22% 160.71% at 49.27% -9.52%, rgb(108 71 255 / 0.3), rgb(255 249 99 / 0.24) 41.24%, rgb(56 218 253 / 0.18) 62.34%, rgb(98 72 246 / 0) 91.89%)"><img alt="" loading="lazy" width="72" height="84" decoding="async" data-nimg="1" class="h-[5.25rem] w-[4.5rem] object-cover mix-blend-multiply" style="color:transparent" srcset="https://clerk.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-4%403x.baebdc1d.png&amp;w=96&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc 1x, https://clerk.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-4%403x.baebdc1d.png&amp;w=256&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc 2x" src="https://clerk.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-4%403x.baebdc1d.png&amp;w=256&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc"><svg class="absolute inset-0 size-full" aria-hidden="true"><rect width="100%" height="100%" fill="url(#wave)"></rect></svg><div class="absolute inset-0 rounded ring-1 ring-inset ring-black/5"></div></div></div><div class="rounded-lg ring-1 ring-gray-900/7.5"></div></div><div class="relative mt-10 w-full"><div class="flex gap-x-3" style="transform: translateX(42.9375px);"><div class="relative whitespace-nowrap rounded-full px-2 py-1 text-2xs font-medium text-gray-300 transition duration-500"><span class="relative z-10">Product Member</span></div><div class="relative whitespace-nowrap rounded-full px-2 py-1 text-2xs font-medium text-gray-300 transition duration-500"><span class="absolute inset-0 z-20 bg-gray-25 mix-blend-exclusion ring-1 ring-gray-800/10" style="border-radius: 9999px; opacity: 1;"></span><span class="relative z-10">Administrator</span></div><div class="relative whitespace-nowrap rounded-full px-2 py-1 text-2xs font-medium text-gray-300 transition duration-500"><span class="relative z-10">Editor</span></div><div class="relative whitespace-nowrap rounded-full px-2 py-1 text-2xs font-medium text-gray-300 transition duration-500"><span class="relative z-10">QA Tester</span></div><div class="relative whitespace-nowrap rounded-full px-2 py-1 text-2xs font-medium text-gray-300 transition duration-500"><span class="relative z-10">Owner</span></div><div class="relative whitespace-nowrap rounded-full px-2 py-1 text-2xs font-medium text-gray-300 transition duration-500"><span class="relative z-10">Engineer</span></div><div class="relative whitespace-nowrap rounded-full px-2 py-1 text-2xs font-medium text-gray-300 transition duration-500"><span class="relative z-10">Marketing</span></div><div class="relative whitespace-nowrap rounded-full px-2 py-1 text-2xs font-medium text-gray-300 transition duration-500"><span class="relative z-10">Human Resources</span></div></div></div></div></div></div><div class="group isolate flex flex-col rounded-2xl bg-white shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] overflow-hidden order-first xl:order-none"><div class="relative z-20 flex-none px-6 order-last pb-6"><div class="flex flex-wrap items-center gap-2"><h3 class="text-sm font-medium text-gray-950">Auto-join</h3></div><div class="mt-2 text-pretty text-sm/5 text-gray-600"><div>Let your users discover and join organizations based on their email domain.</div></div></div><div class="pointer-events-none relative z-10 flex-auto select-none min-h-[10.25rem]" aria-hidden="true"><div class="relative flex h-full flex-col items-center justify-center"><div class="absolute -z-10 mt-[calc(-108/16*1rem)] blur-[1px]"><div class="absolute left-1/2 top-1/2 ml-[calc(-216/2/16*1rem)] mt-[calc(-216/2/16*1rem)] size-[calc(216/16*1rem)] rounded-full border border-gray-400 opacity-15" style="transform:scale(1)"></div><div class="absolute left-1/2 top-1/2 ml-[calc(-280/2/16*1rem)] mt-[calc(-280/2/16*1rem)] size-[calc(280/16*1rem)] rounded-full border border-gray-400 opacity-12.5" style="transform:scale(1)"></div><div class="absolute left-1/2 top-1/2 ml-[calc(-344/2/16*1rem)] mt-[calc(-344/2/16*1rem)] size-[calc(344/16*1rem)] rounded-full border border-gray-400 opacity-10" style="transform:scale(1)"></div><div class="absolute left-1/2 top-1/2 ml-[calc(-408/2/16*1rem)] mt-[calc(-408/2/16*1rem)] size-[calc(408/16*1rem)] rounded-full border border-gray-400 opacity-7.5" style="transform:scale(1)"></div></div><div class="flex gap-4"><div class="transition duration-1000 opacity-1"><div class="size-10 rounded-full border-2 border-white bg-gray-50 shadow-[0_2px_3px_rgba(0,0,0,0.04),0_24px_68px_rgba(47,48,55,0.05),0_4px_6px_rgba(34,42,53,0.04),0_1px_1px_rgba(0,0,0,0.05)] ring-1 ring-gray-950/5"><img alt="" loading="lazy" width="36" height="36" decoding="async" data-nimg="1" class="rounded-full" style="color:transparent" srcset="https://clerk.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-sm-1%403x.a9f1fecd.png&amp;w=48&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc 1x, https://clerk.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-sm-1%403x.a9f1fecd.png&amp;w=96&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc 2x" src="https://clerk.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-sm-1%403x.a9f1fecd.png&amp;w=96&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc"></div></div><div class="transition duration-1000 opacity-25"><div class="size-10 rounded-full border-2 border-white bg-gray-50 shadow-[0_2px_3px_rgba(0,0,0,0.04),0_24px_68px_rgba(47,48,55,0.05),0_4px_6px_rgba(34,42,53,0.04),0_1px_1px_rgba(0,0,0,0.05)] ring-1 ring-gray-950/5"><img alt="" loading="lazy" width="36" height="36" decoding="async" data-nimg="1" class="rounded-full" style="color:transparent" srcset="https://clerk.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-sm-2%403x.acf53dc7.png&amp;w=48&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc 1x, https://clerk.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-sm-2%403x.acf53dc7.png&amp;w=96&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc 2x" src="https://clerk.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-sm-2%403x.acf53dc7.png&amp;w=96&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc"></div></div><div class="transition duration-1000 opacity-25"><div class="size-10 rounded-full border-2 border-white bg-gray-50 shadow-[0_2px_3px_rgba(0,0,0,0.04),0_24px_68px_rgba(47,48,55,0.05),0_4px_6px_rgba(34,42,53,0.04),0_1px_1px_rgba(0,0,0,0.05)] ring-1 ring-gray-950/5"><img alt="" loading="lazy" width="36" height="36" decoding="async" data-nimg="1" class="rounded-full" style="color:transparent" srcset="https://clerk.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-sm-3%403x.c91cd676.png&amp;w=48&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc 1x, https://clerk.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-sm-3%403x.c91cd676.png&amp;w=96&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc 2x" src="https://clerk.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-sm-3%403x.c91cd676.png&amp;w=96&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc"></div></div></div><div class="relative aspect-[128/55] w-32"><svg viewBox="0 0 128 55" fill="none" aria-hidden="true" class="absolute inset-0 size-full stroke-gray-950/10"><path d="M64 0v25M8 0v8c0 8.837 7.163 16 16 16h24c8.837 0 16 7.163 16 16v15M120 0v8c0 8.837-7.163 16-16 16H80c-5.922 0-11.093 3.218-13.86 8"></path></svg></div><div class="relative mt-px flex items-center gap-1.5 rounded-lg bg-white py-1 pl-1.5 pr-2 text-2xs font-medium text-gray-950 shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] ring-1 ring-gray-950/5"><svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="size-4"><g stroke="#9394A1" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"><circle cx="8" cy="8" r="6.25"></circle><path d="M8 5v6m3-3H5"></path></g></svg>Auto-join<div class="absolute -bottom-1.5 left-1/2 -z-10 -ml-10 h-6 w-20 transform-gpu rounded-[50%] bg-gradient-to-r from-purple-500 from-25% to-sky-300 to-75% blur-sm" style="opacity:0.25"></div></div></div></div></div><div class="group isolate flex flex-col rounded-2xl bg-white shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] overflow-hidden"><div class="relative z-20 flex-none px-6 order-last pb-6"><div class="flex flex-wrap items-center gap-2"><h3 class="text-sm font-medium text-gray-950">Invitations</h3></div><div class="mt-2 text-pretty text-sm/5 text-gray-600"><div>Fuel your application's growth by making it simple for your customers to invite their team.</div></div></div><div class="pointer-events-none relative z-10 flex-auto select-none min-h-[10.25rem]" aria-hidden="true"><div class="flex h-full items-center justify-center [mask:linear-gradient(black_66%,transparent)]"><div class="relative flex items-center gap-1.5 rounded-full bg-gray-800 px-2 py-1 text-2xs font-medium text-white shadow-[0_2px_13px_rgba(0,0,0,0.2),0_2px_4px_rgba(47,48,55,0.3)] ring-1 ring-gray-800"><svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="size-4"><g stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"><rect width="12.5" height="10.5" x="1.75" y="2.75" rx="2"></rect><path d="M4.75 5.75 8 8.25l3.25-2.5"></path></g></svg>Invite this person<div class="absolute inset-0 -z-10 rounded-full bg-gray-950/5" style="transform:scaleX(1) scaleY(1);opacity:0"></div><div class="absolute inset-0 -z-10 rounded-full bg-gray-950/5" style="transform:scaleX(1) scaleY(1);opacity:0"></div><div class="absolute inset-0 -z-10 rounded-full bg-gray-950/5" style="transform:scaleX(1) scaleY(1);opacity:0"></div><div class="absolute left-1/2 top-1/2 -z-10 -ml-36 -mt-32 aspect-[288/256] w-72"><svg viewBox="0 0 288 256" fill="none" aria-hidden="true" class="absolute inset-0 size-full stroke-gray-950/10"><path d="M4 0v112c0 8.837 7.163 16 16 16h248c8.837 0 16 7.163 16 16v112"></path></svg></div></div></div></div></div><div class="group isolate flex flex-col rounded-2xl bg-white shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] overflow-hidden row-span-2"><div class="relative z-20 flex-none px-6 pt-6"><div class="flex flex-wrap items-center gap-2"><h3 class="text-sm font-medium text-gray-950">Organization UI Components</h3></div><div class="mt-2 text-pretty text-sm/5 text-gray-600"><div>Clerk's UI components add turn-key simplicity to complex Organization management tasks.</div></div></div><div class="pointer-events-none relative z-10 flex-auto select-none min-h-[10.25rem]" aria-hidden="true"><div class="flex h-full flex-col items-center justify-center px-12"><div class="flex items-center rounded-lg px-2 py-1 text-2xs font-medium text-gray-950 shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] ring-1 ring-gray-900/5"><svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="mr-1.5 size-4"><g filter="url(#filter0_d_5068_3324)"><path fill="#B7B8C2" d="M12.556 2.317a.405.405 0 0 1 .05.626l-1.562 1.561a.462.462 0 0 1-.537.073A3.846 3.846 0 0 0 5.33 9.753a.462.462 0 0 1-.073.538l-1.562 1.561a.405.405 0 0 1-.625-.05 6.838 6.838 0 0 1 9.485-9.485Z"></path><path fill="url(#paint0_linear_5068_3324)" fill-opacity=".19" d="M12.556 2.317a.405.405 0 0 1 .05.626l-1.562 1.561a.462.462 0 0 1-.537.073A3.846 3.846 0 0 0 5.33 9.753a.462.462 0 0 1-.073.538l-1.562 1.561a.405.405 0 0 1-.625-.05 6.838 6.838 0 0 1 9.485-9.485Z"></path><g filter="url(#filter1_i_5068_3324)"><path fill="#131316" d="M10.89 8.002a2.137 2.137 0 1 1-4.273 0 2.137 2.137 0 0 1 4.274 0Z"></path><path fill="url(#paint1_linear_5068_3324)" fill-opacity=".11" d="M10.89 8.002a2.137 2.137 0 1 1-4.273 0 2.137 2.137 0 0 1 4.274 0Z"></path><path fill="#131316" d="M12.604 13.06a.405.405 0 0 1-.05.627 6.806 6.806 0 0 1-3.8 1.152 6.806 6.806 0 0 1-3.8-1.152.405.405 0 0 1-.05-.626l1.561-1.562a.462.462 0 0 1 .538-.072 3.83 3.83 0 0 0 1.751.42 3.83 3.83 0 0 0 1.751-.42.462.462 0 0 1 .538.072l1.562 1.562Z"></path><path fill="url(#paint2_linear_5068_3324)" fill-opacity=".11" d="M12.604 13.06a.405.405 0 0 1-.05.627 6.806 6.806 0 0 1-3.8 1.152 6.806 6.806 0 0 1-3.8-1.152.405.405 0 0 1-.05-.626l1.561-1.562a.462.462 0 0 1 .538-.072 3.83 3.83 0 0 0 1.751.42 3.83 3.83 0 0 0 1.751-.42.462.462 0 0 1 .538.072l1.562 1.562Z"></path></g></g><defs><linearGradient id="paint0_linear_5068_3324" x1="7.433" x2="7.433" y1="1.164" y2="12.195" gradientUnits="userSpaceOnUse"><stop stop-opacity="0"></stop><stop offset="1"></stop></linearGradient><linearGradient id="paint1_linear_5068_3324" x1="8.754" x2="8.754" y1="5.865" y2="14.839" gradientUnits="userSpaceOnUse"><stop stop-color="#fff"></stop><stop offset="1" stop-color="#fff" stop-opacity="0"></stop></linearGradient><linearGradient id="paint2_linear_5068_3324" x1="8.754" x2="8.754" y1="5.865" y2="14.839" gradientUnits="userSpaceOnUse"><stop stop-color="#fff"></stop><stop offset="1" stop-color="#fff" stop-opacity="0"></stop></linearGradient><filter id="filter0_d_5068_3324" width="13.676" height="13.861" x="1.918" y="1.163" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dy=".185"></feOffset><feComposite in2="hardAlpha" operator="out"></feComposite><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"></feColorMatrix><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_5068_3324"></feBlend><feBlend in="SourceGraphic" in2="effect1_dropShadow_5068_3324" result="shape"></feBlend></filter><filter id="filter1_i_5068_3324" width="7.949" height="9.067" x="4.779" y="5.865" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dy=".185"></feOffset><feGaussianBlur stdDeviation=".046"></feGaussianBlur><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"></feComposite><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.18 0"></feColorMatrix><feBlend in2="shape" result="effect1_innerShadow_5068_3324"></feBlend></filter></defs></svg>Clerk<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="ml-3 size-4"><path fill="#9394A1" fill-rule="evenodd" d="M4.24 6.2a.75.75 0 0 1 1.06.04l2.698 2.906 2.45-2.655a.744.744 0 0 1 .022-.021l.25-.25a.75.75 0 1 1 1.06 1.06l-.24.24-2.989 3.239a.75.75 0 0 1-1.1.001L4.2 7.26A.75.75 0 0 1 4.24 6.2Z" clip-rule="evenodd"></path></svg></div><div class="relative mt-4 w-full"><div class="absolute inset-0 rounded-xl border border-dashed border-gray-150 bg-gray-25/50"></div><div class="relative w-full" style="opacity:0;transform:scale(0.95);filter:blur(8px)"><div class="absolute -bottom-1 left-[calc((304-264)/304*50%)] -z-10 h-6 w-[calc(264/304*100%)] rounded-[50%] bg-gradient-to-r from-purple-500 from-25% to-sky-300 to-75% opacity-25 blur-sm"></div><div class="overflow-hidden rounded-xl bg-gray-50/80 shadow-[0_2px_13px_rgba(0,0,0,0.08),0_15px_35px_-5px_rgba(25,28,33,0.12)] ring-1 ring-gray-950/5 backdrop-blur-[10px]"><div class="rounded-b-xl bg-white shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] ring-1 ring-gray-900/5"><div class="flex items-center gap-3 px-4 py-3 [&amp;:not(:first-child)]:border-t [&amp;:not(:first-child)]:border-gray-400/10"><div class="flex-none rounded p-0.5 shadow-[0_2px_3px_rgba(0,0,0,0.04),0_24px_68px_rgba(47,48,55,0.05),0_4px_6px_rgba(34,42,53,0.04),0_1px_1px_rgba(0,0,0,0.05)] ring-1 ring-gray-900/5"><svg viewBox="0 0 36 36" fill="none" aria-hidden="true" class="size-9"><path fill="#22C543" fill-rule="evenodd" d="M18 28c5.523 0 10-4.477 10-10S23.523 8 18 8 8 12.477 8 18s4.477 10 10 10Zm-8-10a8 8 0 0 1 8-8v16a8 8 0 0 1-8-8Z" clip-rule="evenodd"></path></svg></div><div class="flex-auto text-2xs"><div class="font-book text-gray-950">Bluth Company</div><div class="text-gray-400">Mr. Manager</div></div><div class="flex-none rounded-md shadow-[0_2px_3px_-1px_rgba(0,0,0,0.08),0_1px_rgba(25,28,33,0.02)] ring-1 ring-gray-950/7.5"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true" class="size-6"><path fill="#5E5F6E" fill-rule="evenodd" clip-rule="evenodd" d="M10.56 6.536A.667.667 0 0 1 11.212 6h1.573a.667.667 0 0 1 .653.536l.221 1.101c.466.178.9.429 1.286.744l1.065-.36a.667.667 0 0 1 .791.298l.787 1.362a.667.667 0 0 1-.137.834l-.845.742c.08.492.08.994 0 1.486l.845.742a.666.666 0 0 1 .137.833l-.786 1.363a.666.666 0 0 1-.792.298l-1.065-.36c-.386.315-.82.566-1.286.744l-.22 1.101a.666.666 0 0 1-.653.536h-1.574a.666.666 0 0 1-.654-.536l-.22-1.101a4.664 4.664 0 0 1-1.286-.744l-1.066.36a.666.666 0 0 1-.79-.298L6.41 14.32a.667.667 0 0 1 .137-.834l.844-.743a4.7 4.7 0 0 1 0-1.485l-.844-.742a.667.667 0 0 1-.138-.833l.787-1.363a.667.667 0 0 1 .791-.298l1.066.36c.386-.315.82-.566 1.286-.744l.22-1.101ZM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path></svg></div></div><div class="flex items-center gap-3 px-4 py-3 [&amp;:not(:first-child)]:border-t [&amp;:not(:first-child)]:border-gray-400/10"><div class="flex-none rounded p-0.5 shadow-[0_2px_3px_rgba(0,0,0,0.04),0_24px_68px_rgba(47,48,55,0.05),0_4px_6px_rgba(34,42,53,0.04),0_1px_1px_rgba(0,0,0,0.05)] ring-1 ring-gray-900/5"><svg viewBox="0 0 36 36" fill="none" aria-hidden="true" class="size-9"><path class="stroke-gray-600" stroke-linecap="square" stroke-linejoin="round" stroke-width="4" d="M18 9s4.5 3.6 0 9 0 9 0 9"></path><path stroke="#fff" stroke-linecap="square" stroke-linejoin="round" stroke-width="6" d="M18 9s4.5 3.6 0 9 0 9 0 9" transform="rotate(90 18 18)"></path><path class="stroke-gray-800" stroke-linecap="square" stroke-linejoin="round" stroke-width="4" d="M18 9s4.5 3.6 0 9 0 9 0 9" transform="rotate(90 18 18)"></path></svg></div><div class="flex-auto text-2xs"><div class="font-book text-gray-950">Dunder Mifflin</div><div class="text-gray-400">Asst (to the) Regional Manager</div></div></div><div class="flex items-center gap-3 px-4 py-3 [&amp;:not(:first-child)]:border-t [&amp;:not(:first-child)]:border-gray-400/10"><div class="flex-none rounded p-0.5 shadow-[0_2px_3px_rgba(0,0,0,0.04),0_24px_68px_rgba(47,48,55,0.05),0_4px_6px_rgba(34,42,53,0.04),0_1px_1px_rgba(0,0,0,0.05)] ring-1 ring-gray-900/5"><img alt="" loading="lazy" width="36" height="36" decoding="async" data-nimg="1" class="size-9 rounded-sm" style="color:transparent" srcset="https://clerk.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-5%403x.1fd08732.png&amp;w=48&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc 1x, https://clerk.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-5%403x.1fd08732.png&amp;w=96&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc 2x" src="https://clerk.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-5%403x.1fd08732.png&amp;w=96&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc"></div><div class="flex-auto text-2xs"><div class="font-book text-gray-950">Personal account</div></div></div><div class="flex items-center gap-3 px-4 py-3 [&amp;:not(:first-child)]:border-t [&amp;:not(:first-child)]:border-gray-400/10"><svg viewBox="0 0 40 40" fill="none" aria-hidden="true" class="size-10 flex-none"><rect width="40" height="40" fill="#fff" rx="4"></rect><circle cx="20" cy="20" r="11" fill="#EEEEF0"></circle><path stroke="#9394A1" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25" d="M20 16v8m4-4h-8"></path></svg><div class="flex-auto text-2xs"><div class="font-book text-gray-950">Create organization</div></div></div></div><div class="flex items-center justify-center gap-2 p-3 text-2xs font-medium text-gray-400">Secured by <svg viewBox="0 0 43 12" fill="none" aria-hidden="true" class="h-3"><circle cx="6.834" cy="6" r="1.875" fill="#747686"></circle><path fill="#747686" d="M10.212 10.44c.16.159.144.423-.044.548A5.972 5.972 0 0 1 6.834 12a5.972 5.972 0 0 1-3.335-1.012.356.356 0 0 1-.044-.549l1.37-1.37a.405.405 0 0 1 .472-.064c.46.236.983.37 1.537.37a3.36 3.36 0 0 0 1.536-.37.405.405 0 0 1 .472.064l1.37 1.37Z"></path><path fill="#747686" d="M10.169 1.011c.187.126.203.39.044.55l-1.37 1.37a.405.405 0 0 1-.472.063 3.375 3.375 0 0 0-4.542 4.542c.08.157.06.349-.064.473l-1.37 1.37a.356.356 0 0 1-.55-.044 6 6 0 0 1 8.323-8.323Z" opacity=".5"></path><path fill="#747686" fill-rule="evenodd" d="M20.426 1.219c0-.052.042-.094.094-.094h1.406c.052 0 .094.042.094.094v9.562a.094.094 0 0 1-.094.094H20.52a.094.094 0 0 1-.094-.094V1.22ZM18.44 8.847a.096.096 0 0 0-.129.004 2.508 2.508 0 0 1-1.732.675 2.111 2.111 0 0 1-.827-.142 2.076 2.076 0 0 1-.7-.451c-.364-.37-.573-.9-.573-1.53 0-1.263.84-2.126 2.1-2.126.338-.005.673.063.98.2.28.124.53.3.738.52a.097.097 0 0 0 .133.009l.95-.822a.092.092 0 0 0 .009-.13c-.715-.798-1.833-1.21-2.897-1.21-2.142 0-3.661 1.445-3.661 3.57 0 1.052.377 1.937 1.014 2.562.637.625 1.544.993 2.59.993 1.312 0 2.368-.503 2.987-1.149a.091.091 0 0 0-.007-.132l-.975-.841Zm11.325-.977a.093.093 0 0 1-.092.082h-4.927a.09.09 0 0 0-.088.114c.245.908.975 1.458 1.973 1.458.336.007.67-.062.974-.202.284-.13.535-.32.738-.553a.069.069 0 0 1 .096-.009l.99.862c.038.033.044.09.011.129-.598.705-1.566 1.218-2.896 1.218-2.045 0-3.588-1.417-3.588-3.568 0-1.056.363-1.941.97-2.566.319-.322.702-.576 1.126-.746a3.4 3.4 0 0 1 1.334-.245c2.073 0 3.414 1.458 3.414 3.471a5.72 5.72 0 0 1-.035.555Zm-5.078-1.306a.09.09 0 0 0 .088.114h3.275a.09.09 0 0 0 .089-.115c-.223-.772-.79-1.288-1.67-1.288a1.826 1.826 0 0 0-1.382.572c-.184.208-.32.453-.4.717Zm9.987-2.72c.052 0 .095.042.095.095v1.574a.094.094 0 0 1-.101.094 6.153 6.153 0 0 0-.39-.021c-1.227 0-1.947.863-1.947 1.996v3.2a.094.094 0 0 1-.094.093h-1.406a.094.094 0 0 1-.094-.094V4.036c0-.052.042-.094.094-.094h1.406c.052 0 .094.042.094.094v.947a.01.01 0 0 0 .017.005c.55-.734 1.362-1.142 2.219-1.142l.107-.001Zm3.809 4.124a.03.03 0 0 1 .048.005l1.778 2.858a.094.094 0 0 0 .08.044h1.598c.074 0 .119-.08.08-.143l-2.44-3.936a.094.094 0 0 1 .01-.112L41.99 4.09a.094.094 0 0 0-.07-.156h-1.667a.094.094 0 0 0-.07.03l-2.718 2.964a.094.094 0 0 1-.163-.063V1.219a.094.094 0 0 0-.094-.094h-1.406a.094.094 0 0 0-.094.094v9.562c0 .052.042.094.094.094h1.406a.094.094 0 0 0 .094-.094V9.276c0-.023.009-.046.025-.063l1.158-1.245Z" clip-rule="evenodd"></path></svg></div></div></div></div></div></div></div></div></div>`;
      }}
      style={{ width: "100%" }}
    />
  );
}

const meta = {
  title: "Extracted/ExtractedSection",
  component: ExtractedSectionPreview,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ExtractedSectionPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
