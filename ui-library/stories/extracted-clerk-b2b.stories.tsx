import type { Meta, StoryObj } from "@storybook/react";

// Extracted component — rendered via raw HTML + scoped CSS in Shadow DOM
function ClerkB2BPreview() {
  return (
    <div
      ref={(el) => {
        if (!el) return;
        let shadow = el.shadowRoot;
        if (!shadow) shadow = el.attachShadow({ mode: "open" });
        shadow.innerHTML = `<style>:host {
  --typography-code: #131316;
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
}

*, ::before, ::after, ::backdrop { --tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:#3b82f680;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000 }
*, ::before, ::after { box-sizing:border-box;border-top-width:0px;border-right-width:0px;border-bottom-width:0px;border-left-width:0px;border-top-style:solid;border-right-style:solid;border-bottom-style:solid;border-left-style:solid;border-top-color:rgb(217, 217, 222);border-right-color:rgb(217, 217, 222);border-bottom-color:rgb(217, 217, 222);border-left-color:rgb(217, 217, 222);border-image-source:initial;border-image-slice:initial;border-image-width:initial;border-image-outset:initial;border-image-repeat:initial }
h1, h2, h3, h4, h5, h6 { font-size:inherit;font-weight:inherit }
a { color:inherit;text-decoration-line:inherit;text-decoration-thickness:inherit;text-decoration-style:inherit;text-decoration-color:inherit }
blockquote, dl, dd, h1, h2, h3, h4, h5, h6, hr, figure, p, pre { margin-top:0px;margin-right:0px;margin-bottom:0px;margin-left:0px }
img, svg, video, canvas, audio, iframe, embed, object { vertical-align:middle;display:block }
img, video { max-width:100%;height:auto }
.typography code:not(:is(pre, h1, h2, h3, h4) code) { color:var(--typography-code);overflow-wrap:break-word;padding-top:0.375rem;padding-right:0.375rem;padding-bottom:0.375rem;padding-left:0.375rem;font-size:0.8125rem }
.typography :is(h1, h2, h3, h4, h5) + * { margin-top:0px !important }
.pointer-events-none { pointer-events:none }
.absolute { position:absolute }
.relative { position:relative }
.inset-0 { top:0px;right:0px;bottom:0px;left:0px }
.-bottom-1 { bottom:-0.25rem }
.-bottom-1\.5 { bottom:-0.375rem }
.left-1\/2 { left:50% }
.left-\[calc\(\(304-264\)\/304\*50\%\)\] { left:6.57895% }
.top-1\/2 { top:50% }
.isolate { isolation:isolate }
.-z-10 { z-index:-10 }
.z-10 { z-index:10 }
.z-20 { z-index:20 }
.order-first { order:-9999 }
.order-last { order:9999 }
.row-span-2 { grid-row-start:span 2;grid-row-end:span 2 }
.mx-auto { margin-left:auto;margin-right:auto }
.-ml-10 { margin-left:-2.5rem }
.-ml-2\.5 { margin-left:-0.625rem }
.-ml-36 { margin-left:-9rem }
.-mt-32 { margin-top:-8rem }
.mb-4 { margin-bottom:1rem }
.ml-2 { margin-left:0.5rem }
.ml-3 { margin-left:0.75rem }
.ml-\[calc\(-216\/2\/16\*1rem\)\] { margin-left:-6.75rem }
.ml-\[calc\(-280\/2\/16\*1rem\)\] { margin-left:-8.75rem }
.ml-\[calc\(-344\/2\/16\*1rem\)\] { margin-left:-10.75rem }
.ml-\[calc\(-408\/2\/16\*1rem\)\] { margin-left:-12.75rem }
.mr-1\.5 { margin-right:0.375rem }
.mt-10 { margin-top:2.5rem }
.mt-12 { margin-top:3rem }
.mt-2 { margin-top:0.5rem }
.mt-4 { margin-top:1rem }
.mt-\[calc\(-108\/16\*1rem\)\] { margin-top:-6.75rem }
.mt-\[calc\(-216\/2\/16\*1rem\)\] { margin-top:-6.75rem }
.mt-\[calc\(-280\/2\/16\*1rem\)\] { margin-top:-8.75rem }
.mt-\[calc\(-344\/2\/16\*1rem\)\] { margin-top:-10.75rem }
.mt-\[calc\(-408\/2\/16\*1rem\)\] { margin-top:-12.75rem }
.mt-px { margin-top:1px }
.flex { display:flex }
.inline-flex { display:inline-flex }
.grid { display:grid }
.aspect-\[128\/55\] { aspect-ratio:128 / 55 }
.aspect-\[288\/256\] { aspect-ratio:288 / 256 }
.size-10 { width:2.5rem;height:2.5rem }
.size-4 { width:1rem;height:1rem }
.size-6 { width:1.5rem;height:1.5rem }
.size-9 { width:2.25rem;height:2.25rem }
.size-\[calc\(216\/16\*1rem\)\] { width:13.5rem;height:13.5rem }
.size-\[calc\(280\/16\*1rem\)\] { width:17.5rem;height:17.5rem }
.size-\[calc\(344\/16\*1rem\)\] { width:21.5rem;height:21.5rem }
.size-\[calc\(408\/16\*1rem\)\] { width:25.5rem;height:25.5rem }
.size-full { width:100%;height:100% }
.h-2\.5 { height:0.625rem }
.h-3 { height:0.75rem }
.h-6 { height:1.5rem }
.h-\[5\.25rem\] { height:5.25rem }
.h-full { height:100% }
.min-h-\[10\.25rem\] { min-height:10.25rem }
.w-2\.5 { width:0.625rem }
.w-20 { width:5rem }
.w-32 { width:8rem }
.w-72 { width:18rem }
.w-\[4\.5rem\] { width:4.5rem }
.w-\[calc\(264\/304\*100\%\)\] { width:86.8421% }
.w-full { width:100% }
.w-max { width:max-content }
.max-w-md { max-width:28rem }
.flex-auto { flex-grow:1;flex-shrink:1;flex-basis:auto }
.flex-none { flex-grow:0;flex-shrink:0;flex-basis:auto }
.-translate-x-2 { --tw-translate-x:-.5rem;transform:translate(var(--tw-translate-x),var(--tw-translate-y))rotate(var(--tw-rotate))skewX(var(--tw-skew-x))skewY(var(--tw-skew-y))scaleX(var(--tw-scale-x))scaleY(var(--tw-scale-y)) }
.transform-gpu { transform:translate3d(var(--tw-translate-x),var(--tw-translate-y),0)rotate(var(--tw-rotate))skewX(var(--tw-skew-x))skewY(var(--tw-skew-y))scaleX(var(--tw-scale-x))scaleY(var(--tw-scale-y)) }
.select-none { user-select:none }
.grid-flow-col { grid-auto-flow:column }
.grid-cols-1 { grid-template-columns:repeat(1, minmax(0px, 1fr)) }
.grid-cols-3 { grid-template-columns:repeat(3, minmax(0px, 1fr)) }
.grid-rows-3 { grid-template-rows:repeat(3, minmax(0px, 1fr)) }
.grid-rows-6 { grid-template-rows:repeat(6, minmax(0px, 1fr)) }
.flex-col { flex-direction:column }
.flex-wrap { flex-wrap:wrap }
.items-center { align-items:center }
.justify-center { justify-content:center }
.gap-1\.5 { row-gap:0.375rem;column-gap:0.375rem }
.gap-2 { row-gap:0.5rem;column-gap:0.5rem }
.gap-3 { row-gap:0.75rem;column-gap:0.75rem }
.gap-4 { row-gap:1rem;column-gap:1rem }
.gap-x-3 { column-gap:0.75rem }
.overflow-hidden { overflow-x:hidden;overflow-y:hidden }
.whitespace-nowrap { white-space-collapse:collapse;text-wrap:nowrap }
.text-balance { text-wrap:balance }
.text-pretty { text-wrap:pretty }
.rounded { border-top-left-radius:0.25rem;border-top-right-radius:0.25rem;border-bottom-right-radius:0.25rem;border-bottom-left-radius:0.25rem }
.rounded-2xl { border-top-left-radius:1rem;border-top-right-radius:1rem;border-bottom-right-radius:1rem;border-bottom-left-radius:1rem }
.rounded-\[50\%\] { border-top-left-radius:50%;border-top-right-radius:50%;border-bottom-right-radius:50%;border-bottom-left-radius:50% }
.rounded-full { border-top-left-radius:9999px;border-top-right-radius:9999px;border-bottom-right-radius:9999px;border-bottom-left-radius:9999px }
.rounded-lg { border-top-left-radius:0.5rem;border-top-right-radius:0.5rem;border-bottom-right-radius:0.5rem;border-bottom-left-radius:0.5rem }
.rounded-md { border-top-left-radius:0.375rem;border-top-right-radius:0.375rem;border-bottom-right-radius:0.375rem;border-bottom-left-radius:0.375rem }
.rounded-sm { border-top-left-radius:0.125rem;border-top-right-radius:0.125rem;border-bottom-right-radius:0.125rem;border-bottom-left-radius:0.125rem }
.rounded-xl { border-top-left-radius:0.75rem;border-top-right-radius:0.75rem;border-bottom-right-radius:0.75rem;border-bottom-left-radius:0.75rem }
.rounded-b-xl { border-bottom-right-radius:0.75rem;border-bottom-left-radius:0.75rem }
.border { border-top-width:1px;border-right-width:1px;border-bottom-width:1px;border-left-width:1px }
.border-2 { border-top-width:2px;border-right-width:2px;border-bottom-width:2px;border-left-width:2px }
.border-dashed { border-top-style:dashed;border-right-style:dashed;border-bottom-style:dashed;border-left-style:dashed }
.border-gray-150 { --tw-border-opacity:1 }
.border-gray-400 { --tw-border-opacity:1 }
.border-white { --tw-border-opacity:1 }
.bg-gray-25 { --tw-bg-opacity:1;background-color:rgb(250 250 251/var(--tw-bg-opacity,1)) }
.bg-gray-25\/50 { background-color:rgba(250, 250, 251, 0.5) }
.bg-gray-50 { --tw-bg-opacity:1;background-color:rgb(247 247 248/var(--tw-bg-opacity,1)) }
.bg-gray-50\/80 { background-color:rgba(247, 247, 248, 0.8) }
.bg-gray-800 { --tw-bg-opacity:1;background-color:rgb(47 48 55/var(--tw-bg-opacity,1)) }
.bg-gray-800\/2\.5 { background-color:rgba(47, 48, 55, 0.024) }
.bg-gray-800\/7\.5 { background-color:rgba(47, 48, 55, 0.075) }
.bg-gray-950\/5 { background-color:rgba(19, 19, 22, 0.05) }
.bg-white { --tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity,1)) }
.bg-gradient-to-r { background-image:linear-gradient(to right,var(--tw-gradient-stops)) }
.from-purple-500 { --tw-gradient-from:#6c47ff var(--tw-gradient-from-position);--tw-gradient-to:#6c47ff00 var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to) }
.from-25\% { --tw-gradient-from-position:25% }
.to-sky-300 { --tw-gradient-to:#5de3ff var(--tw-gradient-to-position) }
.to-75\% { --tw-gradient-to-position:75% }
.stroke-gray-600 { stroke:rgb(94, 95, 110) }
.stroke-gray-800 { stroke:rgb(47, 48, 55) }
.stroke-gray-950\/10 { stroke:rgba(19, 19, 22, 0.1) }
.object-cover { object-fit:cover }
.p-0\.5 { padding-top:0.125rem;padding-right:0.125rem;padding-bottom:0.125rem;padding-left:0.125rem }
.p-1 { padding-top:0.25rem;padding-right:0.25rem;padding-bottom:0.25rem;padding-left:0.25rem }
.p-3 { padding-top:0.75rem;padding-right:0.75rem;padding-bottom:0.75rem;padding-left:0.75rem }
.px-12 { padding-left:3rem;padding-right:3rem }
.px-2 { padding-left:0.5rem;padding-right:0.5rem }
.px-4 { padding-left:1rem;padding-right:1rem }
.px-6 { padding-left:1.5rem;padding-right:1.5rem }
.py-1 { padding-top:0.25rem;padding-bottom:0.25rem }
.py-3 { padding-top:0.75rem;padding-bottom:0.75rem }
.pb-6 { padding-bottom:1.5rem }
.pl-1\.5 { padding-left:0.375rem }
.pr-2 { padding-right:0.5rem }
.pt-32 { padding-top:8rem }
.pt-6 { padding-top:1.5rem }
.text-left { text-align:left }
.text-2xs { font-size:0.6875rem;line-height:1.25rem }
.text-3xl { font-size:2rem;line-height:2.5rem }
.text-base\/6 { font-size:0.9375rem;line-height:1.5rem }
.text-sm { font-size:0.8125rem;line-height:1.5rem }
.text-sm\/5 { font-size:0.8125rem;line-height:1.25rem }
.font-book { font-weight:450 }
.font-medium { font-weight:500 }
.font-semibold { font-weight:600 }
.tracking-\[-0\.015em\] { letter-spacing:-0.015em }
.text-gray-300 { --tw-text-opacity:1;color:rgb(183 184 194/var(--tw-text-opacity,1)) }
.text-gray-400 { --tw-text-opacity:1;color:rgb(147 148 161/var(--tw-text-opacity,1)) }
.text-gray-600 { --tw-text-opacity:1;color:rgb(94 95 110/var(--tw-text-opacity,1)) }
.text-gray-950 { --tw-text-opacity:1;color:rgb(19 19 22/var(--tw-text-opacity,1)) }
.text-purple-500 { --tw-text-opacity:1;color:rgb(108 71 255/var(--tw-text-opacity,1)) }
.text-white { --tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity,1)) }
.opacity-0 { opacity:0 }
.opacity-10 { opacity:0.1 }
.opacity-12\.5 { opacity:0.125 }
.opacity-15 { opacity:0.15 }
.opacity-25 { opacity:0.25 }
.opacity-60 { opacity:0.6 }
.opacity-7\.5 { opacity:0.075 }
.opacity-70 { opacity:0.7 }
.mix-blend-multiply { mix-blend-mode:multiply }
.mix-blend-exclusion { mix-blend-mode:exclusion }
.mix-blend-luminosity { mix-blend-mode:luminosity }
.ring-1 { --tw-ring-offset-shadow:var(--tw-ring-inset)0 0 0 var(--tw-ring-offset-width)var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset)0 0 0 calc(1px + var(--tw-ring-offset-width))var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow,0 0 #0000) }
.ring-inset { --tw-ring-inset:inset }
.ring-black\/5 { --tw-ring-color:#0000000d }
.ring-gray-800 { --tw-ring-opacity:1;--tw-ring-color:rgb(47 48 55/var(--tw-ring-opacity,1)) }
.ring-gray-800\/10 { --tw-ring-color:#2f30371a }
.ring-gray-900\/12\.5 { --tw-ring-color:#21212620 }
.ring-gray-900\/5 { --tw-ring-color:#2121260d }
.ring-gray-900\/7\.5 { --tw-ring-color:#21212613 }
.ring-gray-950\/5 { --tw-ring-color:#1313160d }
.ring-gray-950\/7\.5 { --tw-ring-color:#13131613 }
.blur-\[1px\] { --tw-blur:blur(1px);filter:var(--tw-blur)var(--tw-brightness)var(--tw-contrast)var(--tw-grayscale)var(--tw-hue-rotate)var(--tw-invert)var(--tw-saturate)var(--tw-sepia)var(--tw-drop-shadow) }
.blur-sm { --tw-blur:blur(4px);filter:var(--tw-blur)var(--tw-brightness)var(--tw-contrast)var(--tw-grayscale)var(--tw-hue-rotate)var(--tw-invert)var(--tw-saturate)var(--tw-sepia)var(--tw-drop-shadow) }
.backdrop-blur-\[10px\] { --tw-backdrop-blur:blur(10px);backdrop-filter:var(--tw-backdrop-blur)var(--tw-backdrop-brightness)var(--tw-backdrop-contrast)var(--tw-backdrop-grayscale)var(--tw-backdrop-hue-rotate)var(--tw-backdrop-invert)var(--tw-backdrop-opacity)var(--tw-backdrop-saturate)var(--tw-backdrop-sepia) }
.transition { transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter, backdrop-filter;transition-duration:0.15s;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1) }
.duration-1000 { transition-duration:1s }
.duration-300 { transition-duration:0.3s }
.duration-500 { transition-duration:0.5s }
.before\:transition-opacity::before { content:var(--tw-content);transition-property:opacity;transition-duration:0.15s;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1) }
.before\:duration-300::before { content:var(--tw-content);transition-duration:0.3s }
@media (hover: hover) and (pointer: fine) {
  .group:hover .group-hover\:translate-x-0 { --tw-translate-x:0px;transform:translate(var(--tw-translate-x),var(--tw-translate-y))rotate(var(--tw-rotate))skewX(var(--tw-skew-x))skewY(var(--tw-skew-y))scaleX(var(--tw-scale-x))scaleY(var(--tw-scale-y)) }
  .group:hover .group-hover\:translate-x-6 { --tw-translate-x:1.5rem;transform:translate(var(--tw-translate-x),var(--tw-translate-y))rotate(var(--tw-rotate))skewX(var(--tw-skew-x))skewY(var(--tw-skew-y))scaleX(var(--tw-scale-x))scaleY(var(--tw-scale-y)) }
  .group:hover .group-hover\:opacity-0 { opacity:0 }
  .group:hover .group-hover\:opacity-100 { opacity:1 }
}

@media (min-width: 40em) {
  .sm\:max-w-\[40rem\] { max-width:40rem }
}

@media (min-width: 48em) {
  .md\:max-w-\[48rem\] { max-width:48rem }
  .md\:grid-cols-2 { grid-template-columns:repeat(2, minmax(0px, 1fr)) }
  .md\:grid-rows-3 { grid-template-rows:repeat(3, minmax(0px, 1fr)) }
  .md\:px-8 { padding-left:2rem;padding-right:2rem }
}

@media (min-width: 64em) {
  .lg\:max-w-\[64rem\] { max-width:64rem }
}

@media (min-width: 80em) {
  .xl\:order-none { order:0 }
  .xl\:max-w-\[80rem\] { max-width:80rem }
  .xl\:grid-cols-3 { grid-template-columns:repeat(3, minmax(0px, 1fr)) }
  .xl\:grid-rows-2 { grid-template-rows:repeat(2, minmax(0px, 1fr)) }
}

</style><div class="pt-32 mx-auto w-full px-6 sm:max-w-[40rem] md:max-w-[48rem] md:px-8 lg:max-w-[64rem] xl:max-w-[80rem]" id="b2b-saas"><div class=""><h2 class="text-sm font-medium text-purple-500">B2B Authentication</h2><p class="mt-4 text-balance text-3xl font-semibold tracking-[-0.015em] text-gray-950">The easy solution to multi-tenancy</p><p class="mb-4 mt-4 max-w-md text-pretty text-base/6 text-gray-600">Clerk has all the features you need to onboard and manage the users and organizations of your multi-tenant SaaS application.</p><a class="group relative isolate inline-flex items-center justify-center overflow-hidden text-left font-medium transition duration-300 ease-[cubic-bezier(0.4,0.36,0,1)] before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] before:transition-opacity text-gray-950 text-sm text-gray-950" target="" href="https://clerk.dev/organizations">Explore B2B features<svg viewBox="0 0 10 10" aria-hidden="true" class="ml-2 h-2.5 w-2.5 flex-none opacity-60 group-hover:translate-x-6 group-hover:opacity-0 transition duration-300 ease-[cubic-bezier(0.4,0.36,0,1)] before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] before:transition-opacity"><path fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m7.25 5-3.5-2.25v4.5L7.25 5Z"></path></svg><svg viewBox="0 0 10 10" aria-hidden="true" class="-ml-2.5 h-2.5 w-2.5 flex-none -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition duration-300 ease-[cubic-bezier(0.4,0.36,0,1)] before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] before:transition-opacity"><path fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m7.25 5-3.5-2.25v4.5L7.25 5Z"></path></svg></a></div><div class="mt-12 grid grid-flow-col grid-cols-1 grid-rows-6 gap-2 md:grid-cols-2 md:grid-rows-3 xl:grid-cols-3 xl:grid-rows-2"><div class="group isolate flex flex-col rounded-2xl bg-white shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] overflow-hidden row-span-2"><div class="relative z-20 flex-none px-6 pt-6"><div class="flex flex-wrap items-center gap-2"><h3 class="text-sm font-medium text-gray-950">Custom roles and permissions</h3></div><div class="mt-2 text-pretty text-sm/5 text-gray-600"><div>Powerful primitives to fully customize your app's authorization story.</div></div></div><div class="pointer-events-none relative z-10 flex-auto select-none min-h-[10.25rem]" aria-hidden="true"><svg width="0" height="0" aria-hidden="true"><defs><pattern id="wave" width="12" height="3" patternUnits="userSpaceOnUse"><path fill="none" stroke="white" stroke-opacity="0.1" d="M-6 0c3 2 6 0 6 0s3-2 6 0 6 0 6 0 3-2 6 0M-6 3c3 2 6 0 6 0s3-2 6 0 6 0 6 0 3-2 6 0"></path></pattern></defs></svg><div class="flex h-full flex-col items-center justify-center"><div class="grid w-max grid-cols-3 grid-rows-3 gap-2"><div class="rounded-lg ring-1 ring-gray-900/7.5"></div><div class="rounded-lg p-1 ring-1 ring-gray-900/5 transition duration-1000 shadow-[0_1px_1px_rgba(0,0,0,0.05),0_5px_11px_rgba(34,42,53,0.14),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)]"><div class="relative overflow-hidden rounded bg-gray-50 transition duration-1000" style="background:radial-gradient(241.22% 160.71% at 49.27% -9.52%, rgb(108 71 255 / 0.3), rgb(255 249 99 / 0.24) 41.24%, rgb(56 218 253 / 0.18) 62.34%, rgb(98 72 246 / 0) 91.89%)"><img alt="" loading="lazy" width="72" height="84" decoding="async" data-nimg="1" class="h-[5.25rem] w-[4.5rem] object-cover mix-blend-multiply" style="color:transparent" srcset="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-1%403x.ab226876.png&amp;w=96&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc 1x, /_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-1%403x.ab226876.png&amp;w=256&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc 2x" src="https://clerk.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-1%403x.ab226876.png&amp;w=256&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc"><svg class="absolute inset-0 size-full" aria-hidden="true"><rect width="100%" height="100%" fill="url(#wave)"></rect></svg><div class="absolute inset-0 rounded ring-1 ring-inset ring-black/5"></div></div></div><div class="rounded-lg bg-gray-800/7.5 ring-1 ring-gray-900/12.5"></div><div class="rounded-lg p-1 ring-1 ring-gray-900/5 transition duration-1000 shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)]"><div class="relative overflow-hidden rounded bg-gray-50 transition duration-1000 opacity-70 mix-blend-luminosity" style="background:radial-gradient(241.22% 160.71% at 49.27% -9.52%, rgb(108 71 255 / 0.3), rgb(255 249 99 / 0.24) 41.24%, rgb(56 218 253 / 0.18) 62.34%, rgb(98 72 246 / 0) 91.89%)"><img alt="" loading="lazy" width="72" height="84" decoding="async" data-nimg="1" class="h-[5.25rem] w-[4.5rem] object-cover mix-blend-multiply" style="color:transparent" srcset="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-2%403x.b8da10b3.png&amp;w=96&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc 1x, /_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-2%403x.b8da10b3.png&amp;w=256&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc 2x" src="https://clerk.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-2%403x.b8da10b3.png&amp;w=256&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc"><svg class="absolute inset-0 size-full" aria-hidden="true"><rect width="100%" height="100%" fill="url(#wave)"></rect></svg><div class="absolute inset-0 rounded ring-1 ring-inset ring-black/5"></div></div></div><div class="rounded-lg bg-gray-800/2.5 ring-1 ring-gray-900/7.5"></div><div class="rounded-lg p-1 ring-1 ring-gray-900/5 transition duration-1000 shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)]"><div class="relative overflow-hidden rounded bg-gray-50 transition duration-1000 opacity-70 mix-blend-luminosity" style="background:radial-gradient(241.22% 160.71% at 49.27% -9.52%, rgb(108 71 255 / 0.3), rgb(255 249 99 / 0.24) 41.24%, rgb(56 218 253 / 0.18) 62.34%, rgb(98 72 246 / 0) 91.89%)"><img alt="" loading="lazy" width="72" height="84" decoding="async" data-nimg="1" class="h-[5.25rem] w-[4.5rem] object-cover mix-blend-multiply" style="color:transparent" srcset="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-3%403x.035bd2d4.png&amp;w=96&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc 1x, /_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-3%403x.035bd2d4.png&amp;w=256&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc 2x" src="https://clerk.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-3%403x.035bd2d4.png&amp;w=256&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc"><svg class="absolute inset-0 size-full" aria-hidden="true"><rect width="100%" height="100%" fill="url(#wave)"></rect></svg><div class="absolute inset-0 rounded ring-1 ring-inset ring-black/5"></div></div></div><div class="rounded-lg ring-1 ring-gray-900/7.5"></div><div class="rounded-lg p-1 ring-1 ring-gray-900/5 transition duration-1000 shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)]"><div class="relative overflow-hidden rounded bg-gray-50 transition duration-1000 opacity-70 mix-blend-luminosity" style="background:radial-gradient(241.22% 160.71% at 49.27% -9.52%, rgb(108 71 255 / 0.3), rgb(255 249 99 / 0.24) 41.24%, rgb(56 218 253 / 0.18) 62.34%, rgb(98 72 246 / 0) 91.89%)"><img alt="" loading="lazy" width="72" height="84" decoding="async" data-nimg="1" class="h-[5.25rem] w-[4.5rem] object-cover mix-blend-multiply" style="color:transparent" srcset="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-4%403x.baebdc1d.png&amp;w=96&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc 1x, /_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-4%403x.baebdc1d.png&amp;w=256&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc 2x" src="https://clerk.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-4%403x.baebdc1d.png&amp;w=256&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc"><svg class="absolute inset-0 size-full" aria-hidden="true"><rect width="100%" height="100%" fill="url(#wave)"></rect></svg><div class="absolute inset-0 rounded ring-1 ring-inset ring-black/5"></div></div></div><div class="rounded-lg ring-1 ring-gray-900/7.5"></div></div><div class="relative mt-10 w-full"><div class="flex gap-x-3" style="transform: translateX(42.9375px);"><div class="relative whitespace-nowrap rounded-full px-2 py-1 text-2xs font-medium text-gray-300 transition duration-500"><span class="relative z-10">Product Member</span></div><div class="relative whitespace-nowrap rounded-full px-2 py-1 text-2xs font-medium text-gray-300 transition duration-500"><span class="absolute inset-0 z-20 bg-gray-25 mix-blend-exclusion ring-1 ring-gray-800/10" style="border-radius: 9999px; opacity: 1;"></span><span class="relative z-10">Administrator</span></div><div class="relative whitespace-nowrap rounded-full px-2 py-1 text-2xs font-medium text-gray-300 transition duration-500"><span class="relative z-10">Editor</span></div><div class="relative whitespace-nowrap rounded-full px-2 py-1 text-2xs font-medium text-gray-300 transition duration-500"><span class="relative z-10">QA Tester</span></div><div class="relative whitespace-nowrap rounded-full px-2 py-1 text-2xs font-medium text-gray-300 transition duration-500"><span class="relative z-10">Owner</span></div><div class="relative whitespace-nowrap rounded-full px-2 py-1 text-2xs font-medium text-gray-300 transition duration-500"><span class="relative z-10">Engineer</span></div><div class="relative whitespace-nowrap rounded-full px-2 py-1 text-2xs font-medium text-gray-300 transition duration-500"><span class="relative z-10">Marketing</span></div><div class="relative whitespace-nowrap rounded-full px-2 py-1 text-2xs font-medium text-gray-300 transition duration-500"><span class="relative z-10">Human Resources</span></div></div></div></div></div></div><div class="group isolate flex flex-col rounded-2xl bg-white shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] overflow-hidden order-first xl:order-none"><div class="relative z-20 flex-none px-6 order-last pb-6"><div class="flex flex-wrap items-center gap-2"><h3 class="text-sm font-medium text-gray-950">Auto-join</h3></div><div class="mt-2 text-pretty text-sm/5 text-gray-600"><div>Let your users discover and join organizations based on their email domain.</div></div></div><div class="pointer-events-none relative z-10 flex-auto select-none min-h-[10.25rem]" aria-hidden="true"><div class="relative flex h-full flex-col items-center justify-center"><div class="absolute -z-10 mt-[calc(-108/16*1rem)] blur-[1px]"><div class="absolute left-1/2 top-1/2 ml-[calc(-216/2/16*1rem)] mt-[calc(-216/2/16*1rem)] size-[calc(216/16*1rem)] rounded-full border border-gray-400 opacity-15" style="transform:scale(1)"></div><div class="absolute left-1/2 top-1/2 ml-[calc(-280/2/16*1rem)] mt-[calc(-280/2/16*1rem)] size-[calc(280/16*1rem)] rounded-full border border-gray-400 opacity-12.5" style="transform:scale(1)"></div><div class="absolute left-1/2 top-1/2 ml-[calc(-344/2/16*1rem)] mt-[calc(-344/2/16*1rem)] size-[calc(344/16*1rem)] rounded-full border border-gray-400 opacity-10" style="transform:scale(1)"></div><div class="absolute left-1/2 top-1/2 ml-[calc(-408/2/16*1rem)] mt-[calc(-408/2/16*1rem)] size-[calc(408/16*1rem)] rounded-full border border-gray-400 opacity-7.5" style="transform:scale(1)"></div></div><div class="flex gap-4"><div class="transition duration-1000 opacity-1"><div class="size-10 rounded-full border-2 border-white bg-gray-50 shadow-[0_2px_3px_rgba(0,0,0,0.04),0_24px_68px_rgba(47,48,55,0.05),0_4px_6px_rgba(34,42,53,0.04),0_1px_1px_rgba(0,0,0,0.05)] ring-1 ring-gray-950/5"><img alt="" loading="lazy" width="36" height="36" decoding="async" data-nimg="1" class="rounded-full" style="color:transparent" srcset="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-sm-1%403x.a9f1fecd.png&amp;w=48&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc 1x, /_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-sm-1%403x.a9f1fecd.png&amp;w=96&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc 2x" src="https://clerk.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-sm-1%403x.a9f1fecd.png&amp;w=96&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc"></div></div><div class="transition duration-1000 opacity-25"><div class="size-10 rounded-full border-2 border-white bg-gray-50 shadow-[0_2px_3px_rgba(0,0,0,0.04),0_24px_68px_rgba(47,48,55,0.05),0_4px_6px_rgba(34,42,53,0.04),0_1px_1px_rgba(0,0,0,0.05)] ring-1 ring-gray-950/5"><img alt="" loading="lazy" width="36" height="36" decoding="async" data-nimg="1" class="rounded-full" style="color:transparent" srcset="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-sm-2%403x.acf53dc7.png&amp;w=48&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc 1x, /_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-sm-2%403x.acf53dc7.png&amp;w=96&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc 2x" src="https://clerk.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-sm-2%403x.acf53dc7.png&amp;w=96&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc"></div></div><div class="transition duration-1000 opacity-25"><div class="size-10 rounded-full border-2 border-white bg-gray-50 shadow-[0_2px_3px_rgba(0,0,0,0.04),0_24px_68px_rgba(47,48,55,0.05),0_4px_6px_rgba(34,42,53,0.04),0_1px_1px_rgba(0,0,0,0.05)] ring-1 ring-gray-950/5"><img alt="" loading="lazy" width="36" height="36" decoding="async" data-nimg="1" class="rounded-full" style="color:transparent" srcset="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-sm-3%403x.c91cd676.png&amp;w=48&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc 1x, /_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-sm-3%403x.c91cd676.png&amp;w=96&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc 2x" src="https://clerk.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-sm-3%403x.c91cd676.png&amp;w=96&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc"></div></div></div><div class="relative aspect-[128/55] w-32"><svg viewBox="0 0 128 55" fill="none" aria-hidden="true" class="absolute inset-0 size-full stroke-gray-950/10"><path d="M64 0v25M8 0v8c0 8.837 7.163 16 16 16h24c8.837 0 16 7.163 16 16v15M120 0v8c0 8.837-7.163 16-16 16H80c-5.922 0-11.093 3.218-13.86 8"></path></svg></div><div class="relative mt-px flex items-center gap-1.5 rounded-lg bg-white py-1 pl-1.5 pr-2 text-2xs font-medium text-gray-950 shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] ring-1 ring-gray-950/5"><svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="size-4"><g stroke="#9394A1" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"><circle cx="8" cy="8" r="6.25"></circle><path d="M8 5v6m3-3H5"></path></g></svg>Auto-join<div class="absolute -bottom-1.5 left-1/2 -z-10 -ml-10 h-6 w-20 transform-gpu rounded-[50%] bg-gradient-to-r from-purple-500 from-25% to-sky-300 to-75% blur-sm" style="opacity:0.25"></div></div></div></div></div><div class="group isolate flex flex-col rounded-2xl bg-white shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] overflow-hidden"><div class="relative z-20 flex-none px-6 order-last pb-6"><div class="flex flex-wrap items-center gap-2"><h3 class="text-sm font-medium text-gray-950">Invitations</h3></div><div class="mt-2 text-pretty text-sm/5 text-gray-600"><div>Fuel your application's growth by making it simple for your customers to invite their team.</div></div></div><div class="pointer-events-none relative z-10 flex-auto select-none min-h-[10.25rem]" aria-hidden="true"><div class="flex h-full items-center justify-center [mask:linear-gradient(black_66%,transparent)]"><div class="relative flex items-center gap-1.5 rounded-full bg-gray-800 px-2 py-1 text-2xs font-medium text-white shadow-[0_2px_13px_rgba(0,0,0,0.2),0_2px_4px_rgba(47,48,55,0.3)] ring-1 ring-gray-800"><svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="size-4"><g stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"><rect width="12.5" height="10.5" x="1.75" y="2.75" rx="2"></rect><path d="M4.75 5.75 8 8.25l3.25-2.5"></path></g></svg>Invite this person<div class="absolute inset-0 -z-10 rounded-full bg-gray-950/5" style="transform:scaleX(1) scaleY(1);opacity:0"></div><div class="absolute inset-0 -z-10 rounded-full bg-gray-950/5" style="transform:scaleX(1) scaleY(1);opacity:0"></div><div class="absolute inset-0 -z-10 rounded-full bg-gray-950/5" style="transform:scaleX(1) scaleY(1);opacity:0"></div><div class="absolute left-1/2 top-1/2 -z-10 -ml-36 -mt-32 aspect-[288/256] w-72"><svg viewBox="0 0 288 256" fill="none" aria-hidden="true" class="absolute inset-0 size-full stroke-gray-950/10"><path d="M4 0v112c0 8.837 7.163 16 16 16h248c8.837 0 16 7.163 16 16v112"></path></svg></div></div></div></div></div><div class="group isolate flex flex-col rounded-2xl bg-white shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] overflow-hidden row-span-2"><div class="relative z-20 flex-none px-6 pt-6"><div class="flex flex-wrap items-center gap-2"><h3 class="text-sm font-medium text-gray-950">Organization UI Components</h3></div><div class="mt-2 text-pretty text-sm/5 text-gray-600"><div>Clerk's UI components add turn-key simplicity to complex Organization management tasks.</div></div></div><div class="pointer-events-none relative z-10 flex-auto select-none min-h-[10.25rem]" aria-hidden="true"><div class="flex h-full flex-col items-center justify-center px-12"><div class="flex items-center rounded-lg px-2 py-1 text-2xs font-medium text-gray-950 shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] ring-1 ring-gray-900/5"><svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="mr-1.5 size-4"><g filter="url(#filter0_d_5068_3324)"><path fill="#B7B8C2" d="M12.556 2.317a.405.405 0 0 1 .05.626l-1.562 1.561a.462.462 0 0 1-.537.073A3.846 3.846 0 0 0 5.33 9.753a.462.462 0 0 1-.073.538l-1.562 1.561a.405.405 0 0 1-.625-.05 6.838 6.838 0 0 1 9.485-9.485Z"></path><path fill="url(#paint0_linear_5068_3324)" fill-opacity=".19" d="M12.556 2.317a.405.405 0 0 1 .05.626l-1.562 1.561a.462.462 0 0 1-.537.073A3.846 3.846 0 0 0 5.33 9.753a.462.462 0 0 1-.073.538l-1.562 1.561a.405.405 0 0 1-.625-.05 6.838 6.838 0 0 1 9.485-9.485Z"></path><g filter="url(#filter1_i_5068_3324)"><path fill="#131316" d="M10.89 8.002a2.137 2.137 0 1 1-4.273 0 2.137 2.137 0 0 1 4.274 0Z"></path><path fill="url(#paint1_linear_5068_3324)" fill-opacity=".11" d="M10.89 8.002a2.137 2.137 0 1 1-4.273 0 2.137 2.137 0 0 1 4.274 0Z"></path><path fill="#131316" d="M12.604 13.06a.405.405 0 0 1-.05.627 6.806 6.806 0 0 1-3.8 1.152 6.806 6.806 0 0 1-3.8-1.152.405.405 0 0 1-.05-.626l1.561-1.562a.462.462 0 0 1 .538-.072 3.83 3.83 0 0 0 1.751.42 3.83 3.83 0 0 0 1.751-.42.462.462 0 0 1 .538.072l1.562 1.562Z"></path><path fill="url(#paint2_linear_5068_3324)" fill-opacity=".11" d="M12.604 13.06a.405.405 0 0 1-.05.627 6.806 6.806 0 0 1-3.8 1.152 6.806 6.806 0 0 1-3.8-1.152.405.405 0 0 1-.05-.626l1.561-1.562a.462.462 0 0 1 .538-.072 3.83 3.83 0 0 0 1.751.42 3.83 3.83 0 0 0 1.751-.42.462.462 0 0 1 .538.072l1.562 1.562Z"></path></g></g><defs><linearGradient id="paint0_linear_5068_3324" x1="7.433" x2="7.433" y1="1.164" y2="12.195" gradientUnits="userSpaceOnUse"><stop stop-opacity="0"></stop><stop offset="1"></stop></linearGradient><linearGradient id="paint1_linear_5068_3324" x1="8.754" x2="8.754" y1="5.865" y2="14.839" gradientUnits="userSpaceOnUse"><stop stop-color="#fff"></stop><stop offset="1" stop-color="#fff" stop-opacity="0"></stop></linearGradient><linearGradient id="paint2_linear_5068_3324" x1="8.754" x2="8.754" y1="5.865" y2="14.839" gradientUnits="userSpaceOnUse"><stop stop-color="#fff"></stop><stop offset="1" stop-color="#fff" stop-opacity="0"></stop></linearGradient><filter id="filter0_d_5068_3324" width="13.676" height="13.861" x="1.918" y="1.163" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dy=".185"></feOffset><feComposite in2="hardAlpha" operator="out"></feComposite><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"></feColorMatrix><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_5068_3324"></feBlend><feBlend in="SourceGraphic" in2="effect1_dropShadow_5068_3324" result="shape"></feBlend></filter><filter id="filter1_i_5068_3324" width="7.949" height="9.067" x="4.779" y="5.865" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dy=".185"></feOffset><feGaussianBlur stdDeviation=".046"></feGaussianBlur><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"></feComposite><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.18 0"></feColorMatrix><feBlend in2="shape" result="effect1_innerShadow_5068_3324"></feBlend></filter></defs></svg>Clerk<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="ml-3 size-4"><path fill="#9394A1" fill-rule="evenodd" d="M4.24 6.2a.75.75 0 0 1 1.06.04l2.698 2.906 2.45-2.655a.744.744 0 0 1 .022-.021l.25-.25a.75.75 0 1 1 1.06 1.06l-.24.24-2.989 3.239a.75.75 0 0 1-1.1.001L4.2 7.26A.75.75 0 0 1 4.24 6.2Z" clip-rule="evenodd"></path></svg></div><div class="relative mt-4 w-full"><div class="absolute inset-0 rounded-xl border border-dashed border-gray-150 bg-gray-25/50"></div><div class="relative w-full" style="opacity:0;transform:scale(0.95);filter:blur(8px)"><div class="absolute -bottom-1 left-[calc((304-264)/304*50%)] -z-10 h-6 w-[calc(264/304*100%)] rounded-[50%] bg-gradient-to-r from-purple-500 from-25% to-sky-300 to-75% opacity-25 blur-sm"></div><div class="overflow-hidden rounded-xl bg-gray-50/80 shadow-[0_2px_13px_rgba(0,0,0,0.08),0_15px_35px_-5px_rgba(25,28,33,0.12)] ring-1 ring-gray-950/5 backdrop-blur-[10px]"><div class="rounded-b-xl bg-white shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] ring-1 ring-gray-900/5"><div class="flex items-center gap-3 px-4 py-3 [&amp;:not(:first-child)]:border-t [&amp;:not(:first-child)]:border-gray-400/10"><div class="flex-none rounded p-0.5 shadow-[0_2px_3px_rgba(0,0,0,0.04),0_24px_68px_rgba(47,48,55,0.05),0_4px_6px_rgba(34,42,53,0.04),0_1px_1px_rgba(0,0,0,0.05)] ring-1 ring-gray-900/5"><svg viewBox="0 0 36 36" fill="none" aria-hidden="true" class="size-9"><path fill="#22C543" fill-rule="evenodd" d="M18 28c5.523 0 10-4.477 10-10S23.523 8 18 8 8 12.477 8 18s4.477 10 10 10Zm-8-10a8 8 0 0 1 8-8v16a8 8 0 0 1-8-8Z" clip-rule="evenodd"></path></svg></div><div class="flex-auto text-2xs"><div class="font-book text-gray-950">Bluth Company</div><div class="text-gray-400">Mr. Manager</div></div><div class="flex-none rounded-md shadow-[0_2px_3px_-1px_rgba(0,0,0,0.08),0_1px_rgba(25,28,33,0.02)] ring-1 ring-gray-950/7.5"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true" class="size-6"><path fill="#5E5F6E" fill-rule="evenodd" clip-rule="evenodd" d="M10.56 6.536A.667.667 0 0 1 11.212 6h1.573a.667.667 0 0 1 .653.536l.221 1.101c.466.178.9.429 1.286.744l1.065-.36a.667.667 0 0 1 .791.298l.787 1.362a.667.667 0 0 1-.137.834l-.845.742c.08.492.08.994 0 1.486l.845.742a.666.666 0 0 1 .137.833l-.786 1.363a.666.666 0 0 1-.792.298l-1.065-.36c-.386.315-.82.566-1.286.744l-.22 1.101a.666.666 0 0 1-.653.536h-1.574a.666.666 0 0 1-.654-.536l-.22-1.101a4.664 4.664 0 0 1-1.286-.744l-1.066.36a.666.666 0 0 1-.79-.298L6.41 14.32a.667.667 0 0 1 .137-.834l.844-.743a4.7 4.7 0 0 1 0-1.485l-.844-.742a.667.667 0 0 1-.138-.833l.787-1.363a.667.667 0 0 1 .791-.298l1.066.36c.386-.315.82-.566 1.286-.744l.22-1.101ZM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path></svg></div></div><div class="flex items-center gap-3 px-4 py-3 [&amp;:not(:first-child)]:border-t [&amp;:not(:first-child)]:border-gray-400/10"><div class="flex-none rounded p-0.5 shadow-[0_2px_3px_rgba(0,0,0,0.04),0_24px_68px_rgba(47,48,55,0.05),0_4px_6px_rgba(34,42,53,0.04),0_1px_1px_rgba(0,0,0,0.05)] ring-1 ring-gray-900/5"><svg viewBox="0 0 36 36" fill="none" aria-hidden="true" class="size-9"><path class="stroke-gray-600" stroke-linecap="square" stroke-linejoin="round" stroke-width="4" d="M18 9s4.5 3.6 0 9 0 9 0 9"></path><path stroke="#fff" stroke-linecap="square" stroke-linejoin="round" stroke-width="6" d="M18 9s4.5 3.6 0 9 0 9 0 9" transform="rotate(90 18 18)"></path><path class="stroke-gray-800" stroke-linecap="square" stroke-linejoin="round" stroke-width="4" d="M18 9s4.5 3.6 0 9 0 9 0 9" transform="rotate(90 18 18)"></path></svg></div><div class="flex-auto text-2xs"><div class="font-book text-gray-950">Dunder Mifflin</div><div class="text-gray-400">Asst (to the) Regional Manager</div></div></div><div class="flex items-center gap-3 px-4 py-3 [&amp;:not(:first-child)]:border-t [&amp;:not(:first-child)]:border-gray-400/10"><div class="flex-none rounded p-0.5 shadow-[0_2px_3px_rgba(0,0,0,0.04),0_24px_68px_rgba(47,48,55,0.05),0_4px_6px_rgba(34,42,53,0.04),0_1px_1px_rgba(0,0,0,0.05)] ring-1 ring-gray-900/5"><img alt="" loading="lazy" width="36" height="36" decoding="async" data-nimg="1" class="size-9 rounded-sm" style="color:transparent" srcset="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-5%403x.1fd08732.png&amp;w=48&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc 1x, /_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-5%403x.1fd08732.png&amp;w=96&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc 2x" src="https://clerk.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperson-5%403x.1fd08732.png&amp;w=96&amp;q=75&amp;dpl=dpl_8iKsqc7Bz1ntLGU4dmXCQFuZsCvc"></div><div class="flex-auto text-2xs"><div class="font-book text-gray-950">Personal account</div></div></div><div class="flex items-center gap-3 px-4 py-3 [&amp;:not(:first-child)]:border-t [&amp;:not(:first-child)]:border-gray-400/10"><svg viewBox="0 0 40 40" fill="none" aria-hidden="true" class="size-10 flex-none"><rect width="40" height="40" fill="#fff" rx="4"></rect><circle cx="20" cy="20" r="11" fill="#EEEEF0"></circle><path stroke="#9394A1" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25" d="M20 16v8m4-4h-8"></path></svg><div class="flex-auto text-2xs"><div class="font-book text-gray-950">Create organization</div></div></div></div><div class="flex items-center justify-center gap-2 p-3 text-2xs font-medium text-gray-400">Secured by <svg viewBox="0 0 43 12" fill="none" aria-hidden="true" class="h-3"><circle cx="6.834" cy="6" r="1.875" fill="#747686"></circle><path fill="#747686" d="M10.212 10.44c.16.159.144.423-.044.548A5.972 5.972 0 0 1 6.834 12a5.972 5.972 0 0 1-3.335-1.012.356.356 0 0 1-.044-.549l1.37-1.37a.405.405 0 0 1 .472-.064c.46.236.983.37 1.537.37a3.36 3.36 0 0 0 1.536-.37.405.405 0 0 1 .472.064l1.37 1.37Z"></path><path fill="#747686" d="M10.169 1.011c.187.126.203.39.044.55l-1.37 1.37a.405.405 0 0 1-.472.063 3.375 3.375 0 0 0-4.542 4.542c.08.157.06.349-.064.473l-1.37 1.37a.356.356 0 0 1-.55-.044 6 6 0 0 1 8.323-8.323Z" opacity=".5"></path><path fill="#747686" fill-rule="evenodd" d="M20.426 1.219c0-.052.042-.094.094-.094h1.406c.052 0 .094.042.094.094v9.562a.094.094 0 0 1-.094.094H20.52a.094.094 0 0 1-.094-.094V1.22ZM18.44 8.847a.096.096 0 0 0-.129.004 2.508 2.508 0 0 1-1.732.675 2.111 2.111 0 0 1-.827-.142 2.076 2.076 0 0 1-.7-.451c-.364-.37-.573-.9-.573-1.53 0-1.263.84-2.126 2.1-2.126.338-.005.673.063.98.2.28.124.53.3.738.52a.097.097 0 0 0 .133.009l.95-.822a.092.092 0 0 0 .009-.13c-.715-.798-1.833-1.21-2.897-1.21-2.142 0-3.661 1.445-3.661 3.57 0 1.052.377 1.937 1.014 2.562.637.625 1.544.993 2.59.993 1.312 0 2.368-.503 2.987-1.149a.091.091 0 0 0-.007-.132l-.975-.841Zm11.325-.977a.093.093 0 0 1-.092.082h-4.927a.09.09 0 0 0-.088.114c.245.908.975 1.458 1.973 1.458.336.007.67-.062.974-.202.284-.13.535-.32.738-.553a.069.069 0 0 1 .096-.009l.99.862c.038.033.044.09.011.129-.598.705-1.566 1.218-2.896 1.218-2.045 0-3.588-1.417-3.588-3.568 0-1.056.363-1.941.97-2.566.319-.322.702-.576 1.126-.746a3.4 3.4 0 0 1 1.334-.245c2.073 0 3.414 1.458 3.414 3.471a5.72 5.72 0 0 1-.035.555Zm-5.078-1.306a.09.09 0 0 0 .088.114h3.275a.09.09 0 0 0 .089-.115c-.223-.772-.79-1.288-1.67-1.288a1.826 1.826 0 0 0-1.382.572c-.184.208-.32.453-.4.717Zm9.987-2.72c.052 0 .095.042.095.095v1.574a.094.094 0 0 1-.101.094 6.153 6.153 0 0 0-.39-.021c-1.227 0-1.947.863-1.947 1.996v3.2a.094.094 0 0 1-.094.093h-1.406a.094.094 0 0 1-.094-.094V4.036c0-.052.042-.094.094-.094h1.406c.052 0 .094.042.094.094v.947a.01.01 0 0 0 .017.005c.55-.734 1.362-1.142 2.219-1.142l.107-.001Zm3.809 4.124a.03.03 0 0 1 .048.005l1.778 2.858a.094.094 0 0 0 .08.044h1.598c.074 0 .119-.08.08-.143l-2.44-3.936a.094.094 0 0 1 .01-.112L41.99 4.09a.094.094 0 0 0-.07-.156h-1.667a.094.094 0 0 0-.07.03l-2.718 2.964a.094.094 0 0 1-.163-.063V1.219a.094.094 0 0 0-.094-.094h-1.406a.094.094 0 0 0-.094.094v9.562c0 .052.042.094.094.094h1.406a.094.094 0 0 0 .094-.094V9.276c0-.023.009-.046.025-.063l1.158-1.245Z" clip-rule="evenodd"></path></svg></div></div></div></div></div></div></div></div></div>`;
      }}
      style={{ width: "100%" }}
    />
  );
}

const meta = {
  title: "Extracted/ClerkB2B",
  component: ClerkB2BPreview,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ClerkB2BPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
