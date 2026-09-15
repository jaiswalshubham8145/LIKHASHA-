# DESIGN.md
## Likhasha — Complete Design System, Kinetic Motion Architecture & Shader Engine

**Version:** 5.0 (Awwwards SOTY Edition — Aggressive Motion & WebGL Upgrade)  
**Date:** May 2026  
**Quality Target:** Awwwards Site of the Year / FWA of the Day tier  
**Design Philosophy:** *Typography is kinetic sculpture. Motion is emotion. Darkness is infinite canvas. Har lafz ek nasha.* 🌙  

---

# ═══════════════════════════════════════
# PART 1 — DESIGN PHILOSOPHY & 17 REFERENCE SITES SYNTHESIS
# ═══════════════════════════════════════

## 1.1 The Core Thesis

Likhasha is not a utility — it is an emotional, visceral experience. It marries classical Indo-Persian poetry (Shayari, Sher, Ghazal, Nazm) with bleeding-edge creative web engineering. 

We completely reject static, safe, boring corporate templates. Every element on screen possesses **mass, momentum, specular reflectance, and kinetic intent**. When the user scrolls, drags, clicks, or rests, the interface breathes and reacts with immediate visual wow-factor.

## 1.2 The 17 Reference Sites Motion Matrix

The visual and technical architecture of Likhasha v5.0 is directly derived from these 17 world-class benchmarks:

| # | Reference Benchmark | Core Animation & Aesthetic DNA | Likhasha Implementation |
|---|---|---|---|
| 1 | **showcase2.piyushsingh123443.workers.dev** | WebGL fluid particle simulator, chromatic aberration, mouse repulsion, swirl distortion | Interactive gold ink particle canvas that explodes and swirls on cursor velocity; chromatic RGB split during high-velocity scrolling. |
| 2 | **madeinevolve.com** | Immersive 3D narrative, heavy camera dolly zoom on scroll, dramatic chapter pacing | Full-viewport 3D camera fly-through into volumetric ink clouds and floating verses; cinematic chapter progression on scroll. |
| 3 | **pieterkoopt.nl** | Raw editorial brutalism, colliding typography (120px+), split-character stagger | Massive offset headlines (`"Write what / you feel."`) with extreme negative tracking, magnetic text drift, brutalist script intersections. |
| 4 | **mvdriest.nl** | Dark ultra-refined portfolio, spring cursor with magnetic snap, multi-layer parallax | Multi-plane parallax calligraphy layers (Urdu Nastaliq + Devanagari), film grain shader overlay, magnetic snap cursor physics. |
| 5 | **osmo.supply** | Developer-grade component precision, 3D card tilt with specular sheen, bi-directional marquee | 3D gyroscope/mouse-driven card tilt with custom specular gold sheen shaders; multi-track bi-directional marquee with hover freeze & gold ignite. |
| 6 | **landonorris.com** | High-octane cinematic hero, velocity motion blur, shockwave reveals | Velocity-driven text skew (`skewY`), letter slam-in intro with shockwave ripple, explosive gold light streaks behind hero poetry. |
| 7 | **newmixcoffee.com/en** | Playful 2D/3D physics drops (Matter.js/Rapier), draggable collision objects | Interactive Draggable Mood Orbs & Poetry Badges with gravity, collision, and rubbery bounce physics in the live playground. |
| 8 | **ning-h.com** | Motion-first portfolio, showreel curtain wipes, difference cursor, SVG path drawing | Full-screen black/gold curtain page transitions, animated SVG calligraphy stroke drawing on scroll, difference blend mode cursor. |
| 9 | **vincent-lowe.info** | Typography as fine art, velocity text skewing, luxury editorial catalogue layout | Inertia-based text distortion, expanding editorial catalog rows with live preview drawers, floating gold ambient dust. |
| 10 | **shader.se** | WebGPU/TSL shaders, raymarching, glass refraction, liquid chromatic dispersion | Custom WebGL/WebGPU glass refraction on chat bubbles, ripple distortion on AI generation, real-time post-processing pipeline. |
| 11 | **hajimewatanabe.jp/portfolio** | Avant-garde Japanese editorial, kinetic scrambler, multi-axis inertia drag | Poetic character scrambler (Devanagari, Urdu, Latin), multi-axis floating grid with inertia scroll. |
| 12 | **taotajima.jp** | Hyper-cinematic filmmaker mood, volumetric lighting, dark ambient depth, seamless scrub | Volumetric light rays (god rays) behind logo, atmospheric dark fog reacting to scroll depth, scroll-scrubbed background videos (`1.mp4`, `2.mp4`, `4.mp4`, `6.mp4`). |
| 13 | **oryzo.ai** | Cyber-luxury AI interface, neural particle nodes, glowing holographic cards | Neural Mood-Network visualizer (connected glowing nodes that morph on mood detection), glowing holographic card borders. |
| 14 | **logartis.info** | Fluid drag canvas, 3D typography extrusion, dynamic collision physics | Interactive 3D Poetry Poster Generator with live mouse tilt and depth extrusion, drag-to-reorder verse blocks. |
| 15 | **labs.lusion.co** | Compute shaders, cloth/soft-body simulations, particle vortex explosions | 3D Golden Silk/Cloth simulation undulating in background, particle vortex when AI is thinking, organic procedural ink bloom. |
| 16 | **camera-webgi.vercel.app** | Scroll-driven 3D camera rig, photorealistic materials, bloom & depth of field | Scroll-driven 3D camera path through virtual celestial library (quill, ancient book, celestial rings) mapping scroll to 3D timeline. |
| 17 | **igloo.inc** | Pop-brutalist kinetic motion, draggable sticker bomb, rubber-band micro-interactions | Draggable poetry sticker bomb (`"Wah Wah!"`, `"100%"`, `"Sher"`, `"Jaan"`), rubber-band bounce physics, tactile interactive sound feedback. |

## 1.3 The 7 Core Architectural Principles

1. **Velocity-Reactive Dynamics:** Scrolling speed dynamically alters font skew, video scrub speed, particle trail length, and RGB chromatic dispersion.
2. **Kinetic Script Synthesis:** Urdu Nastaliq (RTL), Hindi Devanagari (LTR), and Latin scripts interact dynamically, overlapping and resolving via animated SVG path drawing and glyph scramblers.
3. **Seamless Video-WebGL Blending:** Background videos (`1.mp4`, `2.mp4`, `4.mp4`, `6.mp4`) are integrated into a high-performance WebGL post-processing canvas with grain, vignette, and volumetric gold god-rays.
4. **Physical Tangibility:** Cards, chips, and badges possess mass and can be dragged, tossed, and collided with realistic spring and restitution physics.
5. **Real-Time Optical Refraction:** Glass surfaces do not use cheap CSS opacity; they simulate true optical refraction, specular Fresnel sheen, and chromatic dispersion.
6. **Cinematic Chapter Pacing:** Pinned scroll containers feel like movie scenes, guiding the eye through 3D camera dollies, focal depth shifts, and dramatic reveals.
7. **Midnight Gold Luxury:** A rich, deep color palette of midnight blacks, deep obsidian blues, and warm radiant 24k gold accents that glow like embers in the dark.

---

# ═══════════════════════════════════════
# PART 2 — COLOR SYSTEM & SHADER TOKENS
# ═══════════════════════════════════════

## 2.1 CSS Custom Properties (Design Tokens)

```css
:root {
  /* ─── Background Depths ───────────────────────────────────────── */
  --bg-primary:          #080810;   /* Midnight obsidian black */
  --bg-secondary:        #0d0d1a;   /* Deep slate-tinted dark */
  --bg-tertiary:         #121224;   /* Surface card fill */
  --bg-pure-black:       #000000;   /* Overlays, loading screen, curtains */
  --bg-cosmic-radial:    radial-gradient(circle at 50% 30%, #15102a 0%, #080810 70%, #000000 100%);

  /* ─── Gold Luminescence Palette ───────────────────────────────── */
  --gold:                #d4af37;   /* Imperial 24k Gold */
  --gold-bright:         #f3cf55;   /* High-energy hover & specular highlight */
  --gold-dim:            #8b7536;   /* Subdued borders & background lines */
  --gold-deep:           #5c4a1e;   /* Deep metallic shadows */
  --gold-glow-subtle:    rgba(212, 175, 55, 0.08);
  --gold-glow-medium:    rgba(212, 175, 55, 0.20);
  --gold-glow-strong:    rgba(212, 175, 55, 0.45);
  --gold-laser:          #ffe885;   /* Intense pinpoint light beam */

  /* ─── Typography Colors ────────────────────────────────────────── */
  --text-primary:        #f5f0e8;   /* Warm antique cream */
  --text-secondary:      #9b8fb5;   /* Muted mystical lavender-grey */
  --text-muted:          #5e5473;   /* Deep metadata grey */
  --text-gold:           #d4af37;   /* Radiant accent text */
  --text-inverse:        #080810;   /* Dark text on gold buttons */

  /* ─── Glass & Refraction Surfaces ─────────────────────────────── */
  --surface-glass:       rgba(255, 255, 255, 0.035);
  --surface-glass-hover: rgba(255, 255, 255, 0.07);
  --surface-glass-gold:  rgba(212, 175, 55, 0.08);
  --border-subtle:       rgba(255, 255, 255, 0.08);
  --border-gold:         rgba(212, 175, 55, 0.22);
  --border-gold-hover:   rgba(212, 175, 55, 0.65);
  --border-conic-glow:   conic-gradient(from var(--border-angle, 0deg), #d4af37, #f3cf55, transparent 60%, #d4af37);

  /* ─── Mood Resonance Palettes (Generate Studio) ───────────────── */
  --mood-love-bg:        #180814;
  --mood-love-glow:      rgba(255, 130, 160, 0.35);
  --mood-love-accent:    #ff7597;

  --mood-sad-bg:         #070d18;
  --mood-sad-glow:       rgba(110, 150, 210, 0.30);
  --mood-sad-accent:     #7ea5dc;

  --mood-fire-bg:        #160802;
  --mood-fire-glow:      rgba(255, 120, 40, 0.40);
  --mood-fire-accent:    #ff7a29;

  --mood-sufi-bg:        #0e071c;
  --mood-sufi-glow:      rgba(175, 125, 255, 0.35);
  --mood-sufi-accent:    #c494ff;

  --mood-happy-bg:       #121104;
  --mood-happy-glow:     rgba(240, 210, 60, 0.35);
  --mood-happy-accent:   #f0d23c;

  /* ─── WebGL Shader Uniform Parameters ─────────────────────────── */
  --shader-chromatic-aberration: 0.003;
  --shader-film-grain-intensity: 0.045;
  --shader-bloom-radius:         0.75;
  --shader-fog-density:          0.025;
}
```

---

# ═══════════════════════════════════════
# PART 3 — KINETIC TYPOGRAPHY SYSTEM
# ═══════════════════════════════════════

## 3.1 Font Stack Architecture

```css
/* Google Fonts Import */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&family=Noto+Nastaliq+Urdu:wght@400;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Cinzel:wght@400;700&display=swap');

:root {
  --font-display:   'Cormorant Garamond', Georgia, serif;
  --font-heading:   'Playfair Display', serif;
  --font-monument:  'Cinzel', serif;
  --font-body:      'Inter', system-ui, -apple-system, sans-serif;
  --font-urdu:      'Noto Nastaliq Urdu', serif;
  --font-hindi:     'Noto Sans Devanagari', sans-serif;
}
```

## 3.2 Fluid Responsive Typography Clamp Formulas

```css
:root {
  /* Display Heroes (Monolithic) */
  --text-hero-giant:    clamp(76px, 11vw, 160px);
  --text-hero-sub:      clamp(48px, 7vw, 96px);
  --text-section-title: clamp(36px, 4.8vw, 64px);

  /* Editorial & Content */
  --text-poetry-urdu:   clamp(22px, 2.5vw, 34px);
  --text-poetry-hindi:  clamp(19px, 2.1vw, 28px);
  --text-poetry-en:     clamp(20px, 2.2vw, 30px);

  /* UI Scale */
  --text-heading-card:  clamp(20px, 2.2vw, 28px);
  --text-body-lg:       18px;
  --text-body-md:       15px;
  --text-body-sm:       13px;
  --text-caption:       11px;
}
```

## 3.3 Kinetic Typography Treatments & Techniques

### 1. Velocity-Dependent Text Skewing
When scrolling rapidly, text elements dynamically skew along the Y axis, simulating physical momentum:
```javascript
// GSAP + Lenis Velocity Skew Implementation
let proxy = { skew: 0 };
let skewSetter = gsap.quickSetter(".kinetic-skew-target", "skewY", "deg");
let clamp = gsap.utils.clamp(-12, 12);

lenis.on("scroll", (e) => {
  let skew = clamp(e.velocity * 0.06);
  if (Math.abs(skew) > Math.abs(proxy.skew)) {
    proxy.skew = skew;
    gsap.to(proxy, {
      skew: 0,
      duration: 0.8,
      ease: "power3.out",
      overwrite: true,
      onUpdate: () => skewSetter(proxy.skew)
    });
  }
});
```

### 2. Multi-Script Glyph Scrambler (Hajime Watanabe Style)
Text scrambles through Devanagari, Urdu, and Roman characters before locking into the target phrase:
```typescript
// Glyph Scrambler Engine
const GLYPHS = "ابپتٹثجچحخدڈذرزژسشصضطظعغفقکگلمنوہیےअआइईउऊऋएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह✦✧★0123456789";

export function scrambleText(element: HTMLElement, finalString: string, durationMs = 1200) {
  let iteration = 0;
  const totalFrames = (durationMs / 1000) * 60;
  const length = finalString.length;
  
  const interval = setInterval(() => {
    element.innerText = finalString
      .split("")
      .map((char, index) => {
        if (char === " ") return " ";
        if (index < (iteration / totalFrames) * length) {
          return finalString[index];
        }
        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      })
      .join("");

    iteration++;
    if (iteration >= totalFrames) {
      clearInterval(interval);
      element.innerText = finalString;
    }
  }, 1000 / 60);
}
```

### 3. GSAP 3D SplitText Stagger Entrance
```javascript
// SplitText 3D Reveal
const split = new SplitText(".hero-kinetic-title", { type: "chars, words" });

gsap.fromTo(split.chars, 
  {
    opacity: 0,
    y: 100,
    rotateX: -70,
    rotateY: 20,
    z: -150,
    filter: "blur(12px)"
  },
  {
    opacity: 1,
    y: 0,
    rotateX: 0,
    rotateY: 0,
    z: 0,
    filter: "blur(0px)",
    stagger: {
      amount: 0.75,
      from: "start"
    },
    duration: 1.2,
    ease: "power4.out"
  }
);
```

---

# ═══════════════════════════════════════
# PART 4 — BACKGROUND VIDEO RIGS & SCROLL SCRUBBING
# ═══════════════════════════════════════

## 4.1 Video Asset Mapping & Playback Architecture

Likhasha v5.0 integrates 4 dedicated high-bitrate video assets into the core canvas pipeline:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        VIDEO SCRUB & BLEND MATRIX                      │
├───────────────┬─────────────────────────┬──────────────────────────────┤
│ File Name     │ Primary Page & Section  │ Rendering & Scrub Pipeline   │
├───────────────┼─────────────────────────┼──────────────────────────────┤
│ 1.mp4         │ Home: Hero & Loading    │ Canvas frame scrub on scroll │
│               │ (Section 1 & Section 2) │ with chromatic blur overlay. │
├───────────────┼─────────────────────────┼──────────────────────────────┤
│ 2.mp4         │ Home: How It Works      │ Pinned 300vh GSAP timeline;  │
│               │ (Section 5 — 3D Journey)│ video.currentTime mapped to  │
│               │                         │ scroll progress (0.0 to 1.0).│
├───────────────┼─────────────────────────┼──────────────────────────────┤
│ 4.mp4         │ Home: Playground &      │ Interactive canvas texture;  │
│               │ Multilingual Showcase   │ liquid ripple shader blend.  │
├───────────────┼─────────────────────────┼──────────────────────────────┤
│ 6.mp4         │ Final CTA & 404 Cosmos  │ Ambient continuous loop with │
│               │ (Home Sec 10 & /*)      │ WebGL volumetric god-rays.   │
└───────────────┴─────────────────────────┴──────────────────────────────┘
```

## 4.2 High-Performance Video Scrubbing Hook (React + GSAP)

```tsx
// VideoScrollScrubber.tsx
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface VideoScrubberProps {
  videoSrc: string;
  triggerElementRef: React.RefObject<HTMLElement>;
  start?: string;
  end?: string;
}

export const VideoScrubber: React.FC<VideoScrubberProps> = ({
  videoSrc,
  triggerElementRef,
  start = "top top",
  end = "+=2500"
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !triggerElementRef.current) return;

    // Ensure video metadata is loaded for accurate duration
    const onLoadedMetadata = () => {
      ScrollTrigger.create({
        trigger: triggerElementRef.current,
        start: start,
        end: end,
        pin: true,
        scrub: 1.2, // Smooth interpolation lag
        onUpdate: (self) => {
          if (video.duration) {
            video.currentTime = self.progress * video.duration;
          }
        }
      });
    };

    video.addEventListener('loadedmetadata', onLoadedMetadata);
    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [videoSrc, triggerElementRef, start, end]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-[-1]">
      <video
        ref={videoRef}
        src={videoSrc}
        playsInline
        muted
        preload="auto"
        className="w-full h-full object-cover opacity-45 mix-blend-screen filter contrast-125 brightness-90"
      />
      {/* Dark Vignette & Gold Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080810]/70 via-transparent to-[#080810]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#080810_85%)]" />
    </div>
  );
};
```

---

# ═══════════════════════════════════════
# PART 5 — COMPONENT DESIGN SYSTEM & SHADERS
# ═══════════════════════════════════════

## 5.1 3D Tilt Card with Specular Gold Sheen (Osmo Supply Style)

```css
.card-3d-sheen {
  position: relative;
  background: var(--surface-glass);
  border: 1px solid var(--border-gold);
  border-radius: 20px;
  backdrop-filter: blur(24px);
  transform-style: preserve-3d;
  transition: border-color 300ms ease, box-shadow 300ms ease;
  overflow: hidden;

  /* Specular Light Reflection Follower */
  &::before {
    content: '';
    position: absolute;
    inset: -50%;
    background: radial-gradient(
      circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      rgba(212, 175, 55, 0.28) 0%,
      rgba(212, 175, 55, 0.08) 25%,
      transparent 60%
    );
    opacity: 0;
    pointer-events: none;
    transition: opacity 300ms ease;
    mix-blend-mode: overlay;
  }

  /* Animated Conic Border Highlight */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    padding: 1.5px;
    background: conic-gradient(
      from var(--border-angle, 0deg),
      transparent 0deg,
      var(--gold-bright) 45deg,
      transparent 90deg
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 400ms ease;
  }

  &:hover {
    border-color: var(--border-gold-hover);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6), 0 0 32px var(--gold-glow-medium);

    &::before { opacity: 1; }
    &::after  { opacity: 1; }
  }
}
```

## 5.2 Kinetic 3D Tilt React Hook

```typescript
// use3DTilt.ts
import { useCallback, useRef } from 'react';

export function use3DTilt(maxTiltDeg = 12) {
  const cardRef = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTiltDeg;
    const rotateY = ((x - centerX) / centerX) * maxTiltDeg;

    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
  }, [maxTiltDeg]);

  const onMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  }, []);

  return { cardRef, onMouseMove, onMouseLeave };
}
```

## 5.3 Magnetic Elastic CTA Button (Lando Norris & Ning H Style)

```css
.btn-magnetic-gold {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 36px;
  background: var(--gold);
  color: var(--text-inverse);
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.03em;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  overflow: hidden;
  will-change: transform;
  transition: background 250ms ease, box-shadow 250ms ease;

  /* Continuous Inner Light Sweeper */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -150%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.45),
      transparent
    );
    transform: skewX(-25deg);
    animation: btnShimmerSweep 3.5s infinite ease-in-out;
  }

  &:hover {
    background: var(--gold-bright);
    box-shadow: 0 0 36px var(--gold-glow-strong), 0 8px 24px rgba(0, 0, 0, 0.4);
  }
}

@keyframes btnShimmerSweep {
  0% { left: -150%; }
  35%, 100% { left: 150%; }
}
```

## 5.4 5-State Magnetic Spring Cursor (Ning H & Mvdriest Style)

```tsx
// SpringCursor.tsx
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const SpringCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const canvas = trailCanvasRef.current;
    if (!dot || !ring || !canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    const particles: Array<{ x: number; y: number; alpha: number; size: number; color: string }> = [];

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.08, overwrite: "auto" });

      // Spawn stardust trail particles
      if (Math.random() > 0.4) {
        particles.push({
          x: mouseX,
          y: mouseY,
          alpha: 0.8,
          size: Math.random() * 2.5 + 1,
          color: Math.random() > 0.5 ? "#d4af37" : "#f3cf55"
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    // Spring Lerp Loop for Ring and Particles
    let animId: number;
    const render = () => {
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;

      gsap.set(ring, { x: ringX, y: ringY });

      // Render Trail Canvas
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.alpha -= 0.025;
          p.y -= 0.3;
          if (p.alpha <= 0) {
            particles.splice(i, 1);
            continue;
          }
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = "#d4af37";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    // Interaction Hover Observers
    const handleElementHover = () => {
      document.querySelectorAll('a, button, [role="button"], .interactive-hover').forEach((el) => {
        el.addEventListener('mouseenter', () => {
          ring.classList.add('cursor-hover-active');
        });
        el.addEventListener('mouseleave', () => {
          ring.classList.remove('cursor-hover-active');
        });
      });

      document.querySelectorAll('h1, h2, .kinetic-title').forEach((el) => {
        el.addEventListener('mouseenter', () => {
          ring.classList.add('cursor-text-active');
        });
        el.addEventListener('mouseleave', () => {
          ring.classList.remove('cursor-text-active');
        });
      });
    };

    handleElementHover();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <canvas ref={trailCanvasRef} className="fixed inset-0 pointer-events-none z-[99990]" />
      <div ref={dotRef} className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#d4af37] pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2 shadow-[0_0_12px_#d4af37]" />
      <div ref={ringRef} className="cursor-ring fixed top-0 left-0 w-10 h-10 rounded-full border border-[#d4af37]/60 pointer-events-none z-[99998] -translate-x-1/2 -translate-y-1/2 transition-[width,height,background-color,border-color] duration-300 ease-out" />
    </>
  );
};
```

```css
/* Cursor States */
.cursor-ring.cursor-hover-active {
  width: 54px;
  height: 54px;
  background: rgba(212, 175, 55, 0.20);
  border-color: #f3cf55;
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.35);
}

.cursor-ring.cursor-text-active {
  width: 72px;
  height: 72px;
  mix-blend-mode: difference;
  background: #ffffff;
  border-color: transparent;
}
```

---

# ═══════════════════════════════════════
# PART 6 — ADVANCED MOTION ENGINES & PHYSICS
# ═══════════════════════════════════════

## 6.1 Three.js / WebGL Fluid Gold Ink & Particle Simulation (Piyush Singh & Shader.se)

```tsx
// FluidGoldInkCanvas.tsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleField: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 1800;

  const [positions, velocities, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const sca = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;

      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;

      sca[i] = Math.random() * 1.8 + 0.4;
    }
    return [pos, vel, sca];
  }, [count]);

  useFrame(({ mouse, clock }) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const posArr = posAttr.array as Float32Array;

    const time = clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      // Swirl equation around mouse pointer
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      posArr[ix] += velocities[ix] + Math.sin(time + posArr[iy]) * 0.005;
      posArr[iy] += velocities[iy] + Math.cos(time + posArr[ix]) * 0.005;

      // Mouse repulsion
      const dx = posArr[ix] - mouse.x * 10;
      const dy = posArr[iy] - mouse.y * 10;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 3.5) {
        const force = (3.5 - dist) * 0.08;
        posArr[ix] += (dx / dist) * force;
        posArr[iy] += (dy / dist) * force;
      }

      // Boundary loop
      if (posArr[ix] > 10) posArr[ix] = -10;
      if (posArr[ix] < -10) posArr[ix] = 10;
      if (posArr[iy] > 10) posArr[iy] = -10;
      if (posArr[iy] < -10) posArr[iy] = 10;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-scale"
          args={[scales, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.14}
        color="#d4af37"
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export const FluidGoldInkCanvas: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none z-0">
    <Canvas camera={{ position: [0, 0, 8], fov: 60 }} dpr={[1, 2]}>
      <ambientLight intensity={0.5} />
      <ParticleField />
    </Canvas>
  </div>
);
```

## 6.2 2D Physics Playground with Draggable Collision Orbs (New Mix Coffee & Igloo Inc)

```tsx
// PhysicsPlayground.tsx
import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const ORB_LABELS = [
  { text: "Love / Ishq", color: "#ff7597" },
  { text: "Pain / Dard", color: "#7ea5dc" },
  { text: "Fire / Josh", color: "#ff7a29" },
  { text: "Sufi / Rooh", color: "#c494ff" },
  { text: "Mirza Ghalib", color: "#d4af37" },
  { text: "Jaun Elia", color: "#f3cf55" },
  { text: "Gulzar", color: "#6bffb8" },
  { text: "Faiz Ahmed", color: "#ffe885" }
];

export const PhysicsPlayground: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = sceneRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = 450;

    const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint;

    const engine = Engine.create();
    engine.gravity.y = 0.8;

    const render = Render.create({
      element: container,
      engine: engine,
      options: {
        width: width,
        height: height,
        wireframes: false,
        background: 'transparent'
      }
    });

    // Boundaries
    const ground = Bodies.rectangle(width / 2, height + 30, width * 2, 60, { isStatic: true });
    const leftWall = Bodies.rectangle(-30, height / 2, 60, height * 2, { isStatic: true });
    const rightWall = Bodies.rectangle(width + 30, height / 2, 60, height * 2, { isStatic: true });

    // Spawn Pill Badges
    const pills = ORB_LABELS.map((item, idx) => {
      const x = 100 + (idx % 4) * 140;
      const y = 50 + Math.floor(idx / 4) * 80;
      return Bodies.rectangle(x, y, 120, 44, {
        chamfer: { radius: 22 },
        restitution: 0.75, // Rubbery bounce
        friction: 0.1,
        render: {
          fillStyle: '#0d0d1a',
          strokeStyle: item.color,
          lineWidth: 2
        }
      });
    });

    Composite.add(engine.world, [ground, leftWall, rightWall, ...pills]);

    // Mouse Drag Control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });

    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, []);

  return (
    <div className="w-full relative rounded-2xl border border-[#d4af37]/20 bg-[#0d0d1a]/50 backdrop-blur-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      <div className="absolute top-4 left-6 z-10 pointer-events-none">
        <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">Interactive Physics Sandbox</span>
        <p className="text-xs text-[#9b8fb5] mt-1">Grab, throw, and collide emotion tokens</p>
      </div>
      <div ref={sceneRef} className="w-full h-[450px]" />
    </div>
  );
};
```

---

# ═══════════════════════════════════════
# PART 7 — PAGE-BY-PAGE KINETIC DESIGN SPECIFICATIONS
# ═══════════════════════════════════════

## 7.1 Home Page (/)

### Visual Architecture Hierarchy
```
┌────────────────────────────────────────────────────────────────────────┐
│ NAVBAR (Fixed, Dynamic Blur, Gold Logo, Magnetic Links, Free Counter)  │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 1: THE INTRO AWAKENING (0.0s - 2.4s Preloader)                 │
│ • Pure Black #000000 -> Video 1.mp4 Preload                            │
│ • Letters "LIKHASHA" Slam In With Shockwave Ripple                     │
│ • Tagline Letter-Spacing Expansion: "Har lafz ek nasha."               │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 2: THE MONOLITHIC HERO                                         │
│ • Video 1.mp4 Velocity-Scrubbed Backdrop                               │
│ • Monolithic Split Headline: "Write what" [Left] / "you feel." [Right] │
│ • 3D Particle Ink Swirl Canvas Reacting to Mouse                       │
│ • Primary CTA: Magnetic Gold Filled + Secondary: Glass Border          │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 3: DUAL-DIRECTION KINETIC MARQUEE                              │
│ • Track 1 (LTR): Shayari · Sher · Ghazal · Nazm · Poems · Quotes       │
│ • Track 2 (RTL): اردو شاعری · हिन्दी कविता · Roman Urdu · Sufi Poetics  │
│ • Word Hover: Freeze track, 1.25x scale, radiant gold radial bloom     │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 4: THE POETIC CATALOG (What It Creates)                        │
│ • 01 Shayari | 02 Sher | 03 Ghazal | 04 Motivation | 05 Love | 06 Dark │
│ • Row Hover: Expands 90px -> 160px with floating video capsule         │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 5: THE SCROLL-BOUND JOURNEY (How It Works)                     │
│ • Pinned 300vh ScrollTrigger with Video 2.mp4 Frame-by-Frame Scrub     │
│ • Stage 1: Whisper Emotion -> Stage 2: Neural Mood -> Stage 3: Verse   │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 6: MULTILINGUAL TAPESTRY                                       │
│ • 4 Expandable Accordion Canvases (English, Hindi, Urdu RTL, Roman)    │
│ • Urdu: SVG Path Drawing of Nastaliq calligraphy on hover              │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 7: THE PHYSICS PLAYGROUND                                      │
│ • Video 4.mp4 Background Texture                                       │
│ • Matter.js Draggable Emotion Orbs & Sticker Bomb Sandbox              │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 8: MONUMENTAL METRICS (Stats)                                  │
│ • 1,00,000+ Verses | 4 Scripts | 12 Formats | 99.4% Emotional Depth    │
│ • GSAP Scrub CountUp with Stardust particle bursts                     │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 9: THE SOVEREIGN VAULT (Pricing)                               │
│ • Free Tier Card vs Premium ₹99/mo 3D Tilt Card with Conic Gold Border │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION 10: THE INFINITE HORIZON (Final CTA & Outro)                   │
│ • Video 6.mp4 Cosmos Loop with Magnetic Giant "Start Writing" Button   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 7.2 Studio / Generate Page (/generate)

- **Atmosphere:** Pinned focus layout without header/footer clutter.
- **Dynamic Mood Engine:**
  - AI detects mood in real-time (`love`, `sad`, `fire`, `sufi`, `happy`).
  - Smooth 1500ms CSS and WebGL gradient transition morphing ambient background.
- **Refractive AI Chat Bubbles:**
  - True glassmorphism using SVG displacement filters for realistic glass refraction.
  - Multi-script rendering with custom line-height and font-weight per language (Urdu RTL Noto Nastaliq line-height `2.4`, Hindi `1.9`).
- **Interactive Social Media 3D Poster Modal:**
  - Allows users to preview their generated verse on an Instagram/Story 9:16 card.
  - Controls for gold border intensity, typography sizing, and 4k PNG export.
- **AdSense Glass Countdown Modal (Free Plan):**
  - Appears seamlessly for 3 seconds before generating text, featuring a radial gold countdown clock.

---

## 7.3 Personal Vault / Library (/library)

- **Layout:** 3D perspective masonry grid.
- **Micro-Interactions:**
  - Cards tilt slightly toward cursor position.
  - One-click copy with instant floating toast animation.
  - Magnetic filter pill dock that tracks active category tab.

---

## 7.4 Authentication (/login)

- **Atmosphere:** Deep midnight space with 200 floating star particles.
- **Card Entrance:** 3D drop-in with heavy spring deceleration (`y: 80px -> 0px, blur: 24px -> 0px`).
- **Inputs:** Liquid gold laser outline that traces the perimeter of active input fields on focus.

---

## 7.5 Cosmic 404 Sanctuary (/*)

- **Atmosphere:** Background video `6.mp4` with an interactive gravitational particle vortex.
- **Interaction:**
  - Huge `404` title that pulls and distorts particles toward cursor center.
  - Poetic subtext: *"Lost in the cosmos. This page does not exist, but your next poem does."*
  - Elastic gold button returning to `/`.

---

# ═══════════════════════════════════════
# PART 8 — RESPONSIVE DESIGN & PERFORMANCE BUDGET
# ═══════════════════════════════════════

## 8.1 Performance Targets

| Metric | Target Value | Optimization Strategy |
|---|---|---|
| **Frame Rate** | 60 FPS Steady | Offscreen Canvas rendering, passive scroll listeners, `will-change: transform`. |
| **First Contentful Paint (FCP)** | < 1.2s | Critical font preload, lightweight SVG icons, WebP/WebM video compression. |
| **Cumulative Layout Shift (CLS)** | 0.00 | Fixed aspect-ratio containers, reserved bounding boxes. |

## 8.2 Responsive Adaptive Adjustments

| Component | Desktop (1440px+) | Tablet (768px - 1024px) | Mobile (375px - 480px) |
|---|---|---|---|
| **Particle Count** | 1,800 points | 800 points | 350 points |
| **Custom Cursor** | Full 5-state spring cursor | Hidden (Touch mode) | Hidden (Native touch) |
| **Hero Title** | 140px Monolithic split | 84px Split | 54px Compact stack |
| **3D Video Scrub** | Direct scroll sync | Video loop fallback | Video loop fallback |
| **Physics Sandbox** | Full interactive canvas | Simplified touch canvas | Static interactive chips |

---

# ═══════════════════════════════════════
# PART 9 — AI GENERATION & STITCH PROMPTS
# ═══════════════════════════════════════

When generating code or UI assets in Stitch or Antigravity, prepend this global design directive:

```
[SYSTEM PROMPT FOR LIKHASHA UI DESIGN]
Theme: Dark luxury poetic editorial with aggressive kinetic animations.
Palette: Midnight black #080810, Imperial 24k Gold #d4af37, Bright Gold #f3cf55, Cream #f5f0e8, Mystical Lavender #9b8fb5.
Typography: Cormorant Garamond (Display), Playfair Display (Heading), Inter (UI), Noto Nastaliq Urdu (Urdu RTL), Noto Sans Devanagari (Hindi).
Surfaces: rgba(255,255,255,0.035) glassmorphism with 1px gold border rgba(212,175,55,0.22) and blur 24px.
Motion: Velocity skew, 3D card tilt with specular sheen, magnetic elastic buttons, spring cursor, and GSAP SplitText kinetic reveals.
Quality: Awwwards Site of the Year benchmark (inspired by ning-h.com, landonorris.com, shader.se, and labs.lusion.co).
```

---

*Likhasha — Har lafz ek nasha. 🌙*  
*Handcrafted with poetry, physics, and light.*
