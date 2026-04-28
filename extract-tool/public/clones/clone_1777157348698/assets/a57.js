;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="0de2a6ac-a8bf-af03-7b71-0c2c7be61d02")}catch(e){}}();
(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,115751,(e,t,i)=>{"use strict";Object.defineProperty(i,"__esModule",{value:!0});var a={default:function(){return u},getImageProps:function(){return c}};for(var r in a)Object.defineProperty(i,r,{enumerable:!0,get:a[r]});let o=e.r(481258),n=e.r(586860),l=e.r(891236),s=o._(e.r(962819));function c(e){let{props:t}=(0,n.getImgProps)(e,{defaultLoader:s.default,imgConf:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75,90,95],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!0,unoptimized:!1}});for(let[e,i]of Object.entries(t))void 0===i&&delete t[e];return{props:t}}let u=l.Image},274948,(e,t,i)=>{t.exports=e.r(115751)},728107,e=>{"use strict";var t=e.i(405124),i=e.i(635125);let a=`#version 300 es
precision mediump float;
in vec2 coordinates;

uniform vec2 u_resolution;

out vec2 fragCoord;

void main(void) {
  gl_Position = vec4(coordinates, 0.0, 1.0);
  fragCoord = (coordinates + 1.0) * 0.5 * u_resolution;
  fragCoord.y = u_resolution.y - fragCoord.y;
}
`,r=(0,i.forwardRef)(function({source:e,uniforms:r={},textures:o=[],maxFps:n=1/0,initialState:l="playing",onRender:s},c){let u=(0,i.useRef)(null),d=(0,i.useRef)(l),f=(0,i.useRef)(0),h=(0,i.useRef)(0),m=(0,i.useRef)(r);return(0,i.useEffect)(()=>{m.current=r},[r]),(0,i.useImperativeHandle)(c,()=>({play(){d.current="playing"},pause(){d.current="paused"},fireEvent:()=>(h.current=f.current,h.current)}),[]),(0,i.useEffect)(()=>{var t,i,l;let c,p,g=u.current,x=document.createElement("canvas"),v=Math.round(Math.max(1,Math.min(window.devicePixelRatio??1,2)));g.width=x.width=g.offsetWidth*v,g.height=x.height=g.offsetHeight*v;let A=x.getContext("webgl2"),_=g.getContext("2d");if(!A||!_){A=null;return}let w=C(A,A.VERTEX_SHADER,a),y=C(A,A.FRAGMENT_SHADER,e);if(!w||!y){A=null;return}let T=(t=A,i=w,l=y,c=t.createProgram(),(t.attachShader(c,i),t.attachShader(c,l),t.linkProgram(c),t.getProgramParameter(c,t.LINK_STATUS))?c:(console.error("Unable to initialize the shader program: "+t.getProgramInfoLog(c)),null));if(!T){A=null;return}A.useProgram(T);let E=A.createBuffer(),R=new Float32Array([-1,-1,1,-1,-1,1,1,1]);A.bindBuffer(A.ARRAY_BUFFER,E),A.bufferData(A.ARRAY_BUFFER,R,A.STATIC_DRAW);let b=A.getAttribLocation(T,"coordinates");A.enableVertexAttribArray(b),A.vertexAttribPointer(b,2,A.FLOAT,!1,0,0);let P=A.getUniformLocation(T,"u_resolution"),S=A.getUniformLocation(T,"u_time"),z=A.getUniformLocation(T,"u_scroll"),j=A.getUniformLocation(T,"u_event_time"),U=new Map;for(let e in r){let t=A.getUniformLocation(T,e);U.set(e,t)}A.uniform2f(P,g.width/v,g.height/v),A.enable(A.BLEND),A.blendFunc(A.SRC_ALPHA,A.ONE),A.disable(A.DEPTH_TEST);let L=null,F=0,I=[];function B(e){if(!A||!_)return;if("paused"===d.current){p=window.requestAnimationFrame(B);return}let t=e/1e3;if(null===L&&(L=t),n!==1/0){if(e-F<1e3/n){p=window.requestAnimationFrame(B);return}F=e}f.current=t-L,s?.(f.current),A.viewport(0,0,A.canvas.width,A.canvas.height),A.uniform1f(S,f.current),A.uniform1f(z,window.scrollY),A.uniform1f(j,h.current);let i=m.current;for(let e in i){let t=U.get(e)??null,a=i[e];switch(a.type){case"uniform1f":A.uniform1f(t,a.value);break;case"uniform3f":A.uniform3f(t,a.value[0],a.value[1],a.value[2]);break;case"uniform1fv":A.uniform1fv(t,a.value);break;case"uniform3fv":A.uniform3fv(t,a.value.flat());break;case"uniform1i":A.uniform1i(t,a.value);break;default:return a}}A.clear(A.COLOR_BUFFER_BIT|A.DEPTH_BUFFER_BIT);for(let e=0;e<I.length;e++){var a,r,o;let t=I[e];t.location&&(a=t.texture,r=t.location,o=e,A&&(A.uniform1i(r,o),A.activeTexture(A[`TEXTURE${o}`]),A.bindTexture(A.TEXTURE_2D,a)))}A.drawArrays(A.TRIANGLE_STRIP,0,4),_.clearRect(0,0,g.width,g.height),x.width>0&&x.height>0&&_.drawImage(x,0,0),p=window.requestAnimationFrame(B)}function C(e,t,i){let a=e.createShader(t);return(e.shaderSource(a,i),e.compileShader(a),e.getShaderParameter(a,e.COMPILE_STATUS))?a:(console.error("An error occurred compiling the shaders: "+e.getShaderInfoLog(a)),e.deleteShader(a),null)}!async function(){for(let e=0;e<o.length;e++)try{I.push(await function(e,t,i,a){return new Promise((r,o)=>{if(!e||!t)return o();let n=e.createTexture();if(!n)return o();e.activeTexture(e[`TEXTURE${a}`]),e.bindTexture(e.TEXTURE_2D,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR);let l={width:1,height:1,texture:n,location:e.getUniformLocation(t,`u_texture_${a}`)},s=new Image;s.addEventListener("load",()=>{if(!e)return o();l.width=s.width,l.height=s.height,e.activeTexture(e[`TEXTURE${a}`]),e.bindTexture(e.TEXTURE_2D,l.texture),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,s),r(l)}),s.src=i})}(A,T,o[e],e))}catch{return}A&&(p=window.requestAnimationFrame(B))}();let N=new window.ResizeObserver(()=>{g.width=x.width=g.offsetWidth*v,g.height=x.height=g.offsetHeight*v,A?.uniform2f(P,g.width/v,g.height/v)});return N.observe(g),()=>{if(window.cancelAnimationFrame(p),N.disconnect(),A){for(let{texture:e}of(A.deleteShader(w),A.deleteShader(y),A.deleteProgram(T),A.deleteBuffer(E),I))A.deleteTexture(e);A=null}_&&(_=null)}},[e,n,o.join("")]),(0,t.jsx)("canvas",{ref:u,className:"absolute inset-0 h-full w-full","aria-hidden":!0})});e.s(["Shader",0,r])},37288,e=>{"use strict";var t=e.i(405124),i=e.i(728107),a=e.i(635125);let r=(0,a.forwardRef)(function({colors:e=[[0,0,0]],opacities:r=[.04,.04,.04,.04,.04,.08,.08,.08,.08,.14],totalSize:o=4,dotSize:n=2,init:l,textures:s,shader:c,center:u,uniforms:d,maxFps:f=30},h){let m=(0,a.useMemo)(()=>{let t=[e[0],e[0],e[0],e[0],e[0],e[0]];return 2===e.length?t=[e[0],e[0],e[0],e[1],e[1],e[1]]:3===e.length&&(t=[e[0],e[0],e[1],e[1],e[2],e[2]]),{u_colors:{value:t.map(e=>[e[0]/255,e[1]/255,e[2]/255]),type:"uniform3fv"},u_opacities:{value:r,type:"uniform1fv"},u_total_size:{value:o,type:"uniform1f"},u_dot_size:{value:n,type:"uniform1f"},...d}},[e,r,o,n,d]);return(0,t.jsx)(i.Shader,{ref:h,source:function({init:e="",shader:t="",center:i=["x","y"]}){return`#version 300 es
precision mediump float;

in vec2 fragCoord;

uniform float u_time;
uniform float u_opacities[10];
uniform vec3 u_colors[6];
uniform float u_total_size;
uniform float u_dot_size;
uniform vec2 u_resolution;
${e}

out vec4 fragColor;

// https://stackoverflow.com/a/28095165
float PHI = 1.61803398874989484820459;
float random(vec2 xy) {
  return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
}

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float map_clamp(float value, float min1, float max1, float min2, float max2) {
  return clamp(map(value, min1, max1, min2, max2), min(min2, max2), max(min2, max2));
}

void main() {
  vec2 st = fragCoord.xy;

  // Center dots on canvas
  // Remove the 'floor' to allow subpixel positioning
  ${i.includes("x")?"st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));":""}
  ${i.includes("y")?"st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));":""}

  float opacity = step(0.0, st.x);
  opacity *= step(0.0, st.y);

  vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));

  float frequency = 5.0;
  float show_offset = random(st2);
  // Without the +1.0 the first column is all the same opacity
  float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency) + 1.0);
  opacity *= u_opacities[int(rand * 10.0)];
  opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
  opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));

  vec3 color = u_colors[int(show_offset * 6.0)];

  ${t}

  fragColor = vec4(color, opacity);
  fragColor.rgb *= fragColor.a;
}
`}({init:l,shader:c,center:u}),textures:s,uniforms:m,maxFps:f})});e.s(["Dots",0,r])},643504,e=>{e.v("/_next/static/media/cta-glow.9ebcaed3.avif")},141575,e=>{e.v("/_next/static/media/cta-glow.d1130aab.png")},271683,e=>{"use strict";var t=e.i(405124),i=e.i(867543),a=e.i(932444),r=e.i(635125);function o(){let e=(0,a.usePathname)(),o=(0,i.useAnalytics)();return(0,r.useEffect)(()=>{o.initialized&&o.track("page_not_found",{pathname:e})},[e,o.initialized]),(0,t.jsx)(t.Fragment,{})}e.s(["PageNotFoundTracker",()=>o])},158508,e=>{"use strict";var t=e.i(405124),i=e.i(529449),a=e.i(37288),r=e.i(271683);let o={src:e.i(643504).default,width:100,height:100,blurWidth:1,blurHeight:1,blurDataURL:"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="},n={src:e.i(141575).default,width:1463,height:1112,blurWidth:8,blurHeight:6,blurDataURL:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAGCAYAAAD+Bd/7AAAAvElEQVR42mWNTQvBAABAt+Rj9sEUKbZwUOKg1i7kJA0bVohoO2gOOzj4A67KwS/wA7ithoviJu2qloMc3JwcdrY5SMg7vl49gFU1vrbVZSJbxgh/3oVAIRvwTXVz7AtX89Re30ZS/c5xtJrA4MgnClAZhF1qA+FiHqSZNZGFR6vYVMJubxB8FSAI+JJpqKTsG+LZnPZWVlecG1EyV/ld4fGUg1ns6I5uFKjhGLXDGPAHSsRsJMO7nB4cfLsnWuMu5tmLSdMAAAAASUVORK5CYII="};var l=e.i(294237),s=e.i(821957),c=e.i(274948);let u=[{key:"xs",canvas:{clipPath:"[--canvas-clip-path:url(#text-path-xs)]",size:"[--canvas-width:300px] [--canvas-height:150px]"},svg:{width:300,height:150,fontSize:140,clipPath:{id:"text-path-xs"}}},{key:"sm",canvas:{clipPath:"sm:[--canvas-clip-path:url(#text-path-sm)]",size:"sm:[--canvas-width:400px] sm:[--canvas-height:200px]"},svg:{width:400,height:200,fontSize:180,clipPath:{id:"text-path-sm"}}},{key:"md",canvas:{clipPath:"md:[--canvas-clip-path:url(#text-path-md)]",size:"md:[--canvas-width:612px] md:[--canvas-height:306px]"},svg:{width:612,height:306,fontSize:280,clipPath:{id:"text-path-md"}}},{key:"lg",canvas:{clipPath:"lg:[--canvas-clip-path:url(#text-path-lg)]",size:"lg:[--canvas-width:696px] lg:[--canvas-height:348px]"},svg:{width:696,height:348,fontSize:316,clipPath:{id:"text-path-lg"}}},{key:"xl",canvas:{clipPath:"xl:[--canvas-clip-path:url(#text-path-xl)]",size:"xl:[--canvas-width:1008px] xl:[--canvas-height:504px]"},svg:{width:1008,height:504,fontSize:"26.875rem",clipPath:{id:"text-path-xl"}}}];function d(){let{resolvedTheme:e}=(0,s.useTheme)(),d="dark"===e;return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("div",{className:(0,l.cx)("pointer-events-none absolute inset-x-0 bottom-0 top-[-28.75rem] z-10 overflow-hidden",d?"opacity-50 mix-blend-overlay":"opacity-10 mix-blend-darken"),children:(0,t.jsxs)("picture",{className:"",children:[(0,t.jsx)("source",{srcSet:o.src,type:"image/avif"}),(0,t.jsx)(c.default,{src:n,alt:"",unoptimized:!0,className:"ml-[calc(50%-63.6875rem)] w-[calc(2428/16*1rem)] max-w-none"})]})}),(0,t.jsxs)("article",{className:"flex w-full flex-col items-center justify-center gap-8 overflow-hidden pb-48 pt-16",children:[(0,t.jsxs)("header",{className:"relative",children:[(0,t.jsx)("h1",{className:"sr-only",children:"404"}),(0,t.jsx)("div",{"aria-hidden":!0,children:(0,t.jsxs)("div",{className:(0,l.cx)(u.map(({canvas:e})=>[e.clipPath,e.size])),children:[(0,t.jsxs)("div",{className:(0,l.cx)("w-[--canvas-width]","h-[--canvas-height]","relative",d?"opacity-30":"opacity-60",d&&"mix-blend-plus-lighter"),children:[(0,t.jsx)("div",{className:(0,l.cx)("absolute inset-0",d?"opacity-20":"opacity-40"),children:(0,t.jsx)(a.Dots,{colors:[d?[255,255,255]:[0,0,0]],dotSize:1,totalSize:3,opacities:[.3,.3,.5,.5,.7,.7,.8,.8,.9,.9],shader:`
                opacity *= step(random(st2) * 2.0, u_time);
                `})}),(0,t.jsx)("div",{className:(0,l.cx)("absolute inset-0 [clip-path:var(--canvas-clip-path)]",!d&&"opacity-80"),children:(0,t.jsx)(a.Dots,{colors:[d?[255,255,255]:[0,0,0]],dotSize:1,totalSize:3,opacities:d?[.4,.4,.48,.48,.56,.56,.64,.64,.72,.72]:[.6,.6,.7,.7,.8,.8,.9,.9,1,1],shader:`
                  opacity *= step(random(st2) * 2.0, u_time);
                `})})]}),u.map(({key:e,svg:i})=>(0,t.jsx)("svg",{width:"0",height:"0",viewBox:["0 0",i.width,i.height].join(" "),fontFamily:"var(--font-geist-numbers)",fontWeight:600,fontSize:i.fontSize,children:(0,t.jsx)("clipPath",{id:i.clipPath.id,children:(0,t.jsx)("text",{x:i.width/2,y:i.height/2,dy:"0.35em",textAnchor:"middle",children:"404"})})},e))]})})]}),(0,t.jsxs)("div",{className:"z-20 flex flex-col items-center justify-center gap-6",children:[(0,t.jsx)("p",{className:"text-md text-pretty text-center font-normal text-gray-400 sm:text-lg",children:"Sorry, we can't find the page you're looking for."}),(0,t.jsxs)("div",{className:"grid grid-cols-1 gap-6 sm:grid-cols-3",children:[(0,t.jsx)(i.LinkButton,{variant:"primary",href:"/docs",color:"neutral-inverted",arrow:!0,children:"Go to docs homepage"}),(0,t.jsx)(i.LinkButton,{variant:"primary",href:"/contact/support",color:"neutral-inverted",arrow:!0,children:"Contact support"}),(0,t.jsx)(i.LinkButton,{variant:"primary",href:"https://github.com/clerk/clerk-docs/issues/new",color:"neutral-inverted",arrow:!0,newTab:!0,children:"Open an issue"})]})]})]}),(0,t.jsx)(r.PageNotFoundTracker,{})]})}e.s(["default",()=>d],158508)}]);

//# debugId=0de2a6ac-a8bf-af03-7b71-0c2c7be61d02
//# sourceMappingURL=fef43c66f53f6542.js.map