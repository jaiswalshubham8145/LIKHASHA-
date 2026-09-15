# Product Requirements Document (PRD)
## Likhasha — AI Poetry & Quote Generator
**Version:** 5.0 (Awwwards SOTY Edition — Aggressive Motion & WebGL Upgrade)  
**Date:** May 2026  
**Status:** Approved & Final  
**Tagline:** *Har lafz ek nasha.* 🌙  
**Aesthetic Vision:** The world's most aggressive, poetic, and handcrafted creative tech experience. Like `ning-h.com` + `landonorris.com` + `shader.se` + `labs.lusion.co` engineered for timeless poetry and quotes.

---

## 1. 17 Reference Sites — Comprehensive Breakdown & Motion Architecture

Likhasha v5.0 is designed by analyzing and synthesizing the bleeding edge of modern creative web development across 17 world-class benchmarks:

| # | Reference Website | Core Visual & Animation DNA | Likhasha Implementation & Aggressive Effect |
|---|---|---|---|
| 1 | **showcase2.piyushsingh123443.workers.dev** | WebGL fluid particle simulator, chromatic aberration, mouse repulsion, swirl distortion | Interactive gold ink particle canvas that explodes and swirls on cursor velocity; chromatic RGB split during high-velocity scrolling. |
| 2 | **madeinevolve.com** | Immersive 3D narrative, heavy camera dolly zoom on scroll, dramatic chapter pacing | Full-viewport 3D camera fly-through into volumetric ink clouds and floating verses; cinematic chapter progression on scroll. |
| 3 | **pieterkoopt.nl** | Raw editorial brutalism, colliding typography (120px+), split-character stagger | Massive offset headlines ("Write what / you feel.") with extreme negative tracking, magnetic text drift, brutalist script intersections. |
| 4 | **mvdriest.nl** | Dark ultra-refined portfolio, spring cursor with magnetic snap, multi-layer parallax | Multi-plane parallax calligraphy layers (Urdu Nastaliq + Devanagari), film grain shader overlay, magnetic snap cursor physics. |
| 5 | **osmo.supply** | Developer-grade component precision, 3D card tilt with specular sheen, bi-directional marquee | 3D gyroscope/mouse-driven card tilt with custom specular gold sheen shaders; multi-track bi-directional marquee with hover freeze & gold ignite. |
| 6 | **landonorris.com** | High-octane cinematic hero, velocity motion blur, shockwave reveals | Velocity-driven text skew (`skewY`), letter slam-in intro with shockwave ripple, explosive gold light streaks behind hero poetry. |
| 7 | **newmixcoffee.com/en** | Playful 2D/3D physics drops (Matter.js/Rapier), draggable collision objects | Interactive Draggable Mood Orbs & Poetry Badges with gravity, collision, and rubbery bounce physics in the live playground. |
| 8 | **ning-h.com** | Motion-first portfolio, showreel curtain wipes, difference cursor, SVG path drawing | Full-screen black/gold curtain page transitions, animated SVG calligraphy stroke drawing on scroll, difference blend mode cursor. |
| 9 | **vincent-lowe.info** | Typography as fine art, velocity text skewing, luxury editorial catalogue layout | Inertia-based text distortion, expanding editorial catalog rows with live preview drawers, floating gold ambient dust. |
| 10 | **shader.se** | WebGPU/TSL shaders, raymarching, glass refraction, liquid chromatic dispersion | Custom WebGL/WebGPU glass refraction on chat bubbles, ripple distortion on AI generation, real-time post-processing pipeline. |
| 11 | **hajimewatanabe.jp/portfolio** | Avant-garde Japanese editorial, kinetic scrambler, multi-axis inertia drag | Poetic character scrambler (Devanagari, Urdu, Latin), multi-axis floating grid with inertia scroll. |
| 12 | **taotajima.jp** | Hyper-cinematic filmmaker mood, volumetric lighting, dark ambient depth, seamless scrub | Volumetric light rays (god rays) behind logo, atmospheric dark fog reacting to scroll depth, scroll-scrubbed background videos. |
| 13 | **oryzo.ai** | Cyber-luxury AI interface, neural particle nodes, glowing holographic cards | Neural Mood-Network visualizer (connected glowing nodes that morph on mood detection), glowing holographic card borders. |
| 14 | **logartis.info** | Fluid drag canvas, 3D typography extrusion, dynamic collision physics | Interactive 3D Poetry Poster Generator with live mouse tilt and depth extrusion, drag-to-reorder verse blocks. |
| 15 | **labs.lusion.co** | Compute shaders, cloth/soft-body simulations, particle vortex explosions | 3D Golden Silk/Cloth simulation undulating in background, particle vortex when AI is thinking, organic procedural ink bloom. |
| 16 | **camera-webgi.vercel.app** | Scroll-driven 3D camera rig, photorealistic materials, bloom & depth of field | Scroll-driven 3D camera path through virtual celestial library (quill, ancient book, celestial rings) mapping scroll to 3D timeline. |
| 17 | **igloo.inc** | Pop-brutalist kinetic motion, draggable sticker bomb, rubber-band micro-interactions | Draggable poetry sticker bomb ("Wah Wah!", "100%", "Sher", "Jaan"), rubber-band bounce physics, tactile interactive sound feedback. |

---

## 2. Product Summary

**Likhasha** is an AI-powered poetry, shayari, sher, and quote generator where users describe any emotion, thought, mood, or life circumstance and instantly receive breathtaking literary output in **4 languages** (English, Hindi/Devanagari, Urdu/Nastaliq RTL, and Roman Urdu/Hindi).

The web platform rejects generic SaaS designs in favor of an **ultra-aggressive, motion-first, WebGL-driven artistic experience**. Every section is a living canvas featuring scroll-scrubbed background videos, real-time fluid particle dynamics, 3D camera choreographies, and magnetic interactive physics.

---

## 3. Core Experience Philosophy

### 3.1 Aggressive Motion First
Every element on the screen possesses mass, inertia, and intent. Static layouts are forbidden. Scroll is a continuous kinetic trigger. High-velocity scroll induces directional skew, chromatic aberration, and particle trails.

### 3.2 Typography as Kinetic Sculpture
Inspired by *pieterkoopt.nl*, *vincent-lowe.info*, and *hajimewatanabe.jp*: typography is oversized, expressive, and constantly alive. Characters scramble upon reveal, split into individual 3D rotational planes, and deform smoothly on hover.

### 3.3 Cinematic Video Scrubbing & Shader Atmosphere
Inspired by *taotajima.jp*, *landonorris.com*, and *madeinevolve.com*: Background videos (`1.mp4`, `2.mp4`, `4.mp4`, `6.mp4`) are integrated into a WebGL post-processing canvas, scrubbing dynamically with user scroll and blending seamlessly with dark gold volumetric fog.

### 3.4 Tangible Physics & Playful Friction
Inspired by *newmixcoffee.com* and *igloo.inc*: UI components are not just static rectangles; they are physical entities that can be dragged, tossed, collided, and stickered across the screen.

### 3.5 Real-Time Shader Refraction & Depth
Inspired by *shader.se* and *labs.lusion.co*: Glassmorphic cards feature physical index-of-refraction distortion, chromatic dispersion at the borders, and 3D specular light sheen tracking the cursor position.

---

## 4. Video Integration Architecture (Background Video Rigs)

The application utilizes high-bitrate cinematic video backdrops bound to scroll velocity and WebGL blend shaders:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        VIDEO BACKDROP SYSTEM                           │
├───────────────┬─────────────────────────┬──────────────────────────────┤
│ Video Asset   │ Target Page / Section   │ Motion & Shader Technique    │
├───────────────┼─────────────────────────┼──────────────────────────────┤
│ 1.mp4         │ Hero & Loading Screen   │ Scroll-scrubbed camera dolly,│
│               │ (Home Section 1 & 2)    │ WebGL chromatic blend, dark  │
│               │                         │ gold vignette overlay.       │
├───────────────┼─────────────────────────┼──────────────────────────────┤
│ 2.mp4         │ How It Works / Journey  │ Synced to GSAP ScrollTrigger │
│               │ (Home Section 5)        │ pinned timeline; scrub 1.5s  │
│               │                         │ with fluid particle veil.    │
├───────────────┼─────────────────────────┼──────────────────────────────┤
│ 4.mp4         │ Interactive Playground  │ Interactive hover scrub,     │
│               │ & Multilingual Showcase │ liquid ripple distortion on  │
│               │ (Home Section 6 & 7)    │ language switch.             │
├───────────────┼─────────────────────────┼──────────────────────────────┤
│ 6.mp4         │ Final CTA & 404 Cosmos  │ Infinite ambient loop with   │
│               │ (Home Section 10 & 404) │ volumetric god-rays and slow │
│               │                         │ gold stardust drift.         │
└───────────────┴─────────────────────────┴──────────────────────────────┘
```

---

## 5. Target Users & Personas

1. **Poetry & Shayari Lovers:** Enthusiasts of Mirza Ghalib, Faiz, Jaun Elia, Gulzar, seeking authentic Urdu (Nastaliq) and Hindi shayari with instant translation/transliteration.
2. **Content Creators & Social Media Influencers:** Instagram, Reels, YouTube Shorts creators needing aesthetic captions, viral quotes, and downloadable 3D poetry posters.
3. **Students & Young Professionals:** Users looking for daily motivational, philosophical, or emotional quotes to share on WhatsApp status and stories.
4. **Creative Developers & Designers:** Community members visiting for the awe-inspiring Awwwards-caliber interaction design.

---

## 6. Page Architecture & Section-by-Section Motion Specifications

The platform consists of **6 primary routes**:
1. `/` — Home (Cinematic 10-section WebGL journey)
2. `/login` — Login / Sign Up (Space atmosphere & glass morph card)
3. `/generate` — Generate Studio (Mood-reactive WebGL canvas & chat)
4. `/library` — Personal Vault (Interactive 3D museum card grid)
5. `/pricing` — Pricing & Memberships (Confident comparison & 3D gold card)
6. `/*` — 404 (Cosmic portal with interactive particle blackhole)

---

### 6.1 Home Page (/) — Detailed Kinetic Choreography

#### Section 1: The Intro Awakening (Loading Sequence)
- **Inspiration:** `ning-h.com`, `landonorris.com`, `taotajima.jp`
- **Visuals:** Fullscreen pure black `#000000`. Background video `1.mp4` preloaded with WebGL canvas blur.
- **Motion:**
  1. Letters `L I K H A S H A` slam downward with heavy spring physics (`translateY(-120px) -> 0px`, blur 20px -> 0px, stagger 60ms).
  2. Character Scrambler: Characters glitch through Arabic/Devanagari glyphs before snapping to gold Cormorant Garamond.
  3. Shockwave ripple expands across the screen on the final 'A' landing.
  4. Tagline *"Har lafz ek nasha"* fades in with gold tracking expansion (`letter-spacing: 0.1em -> 0.35em`).
  5. High-speed gold laser line draws across the bottom (width 0% -> 100% in 800ms).
  6. Smooth liquid curtain wipe upwards reveals the Hero.

#### Section 2: The Monolithic Hero
- **Inspiration:** `pieterkoopt.nl`, `vincent-lowe.info`, `landonorris.com`
- **Visuals:** Full viewport height. Background video `1.mp4` plays softly with scroll-scrubbed velocity.
- **Typography:**
  - Line 1: `"Write what"` — Massive Cormorant Garamond (clamp 84px to 160px), left-aligned, weight 300, negative tracking `-0.04em`.
  - Line 2: `"you feel."` — Right-aligned offset, italic Cormorant Garamond, glowing subtle gold.
- **Aggressive Interactions:**
  - **Velocity Skew:** Fast scrolling skews the entire hero container (`transform: skewY(calc(var(--velocity) * 0.08deg))`).
  - **Magnetic Mouse Displacement:** Letters repel gently as cursor sweeps across them.
  - **Primary CTA ("Start Writing — It's Free"):** Gold filled button with continuous internal light shimmer sweep + magnetic cursor snap.
  - **Secondary CTA ("Explore Library"):** Glass border button with gold hover fill.
  - **Scroll Indicator:** Pulsing gold line morphing into a downward arrow with audio-visual click effect.

#### Section 3: Kinetic Dual-Direction Marquee Strip
- **Inspiration:** `osmo.supply`, `shader.se`
- **Motion:** Two overlapping infinite marquee tracks moving in opposite directions at 40px/sec.
- **Track 1:** `"✦ SHAYARI · SHER · GHAZAL · NAZM · POEMS · QUOTES · SUFI · DARK POETRY ✦"`
- **Track 2 (Reverse):** `"✦ اردو شاعری · हिन्दी कविता · ROMAN URDU · ENGLISH POETICS · ETERNAL WORDS ✦"`
- **Interaction:** Hovering over any word freezes the marquee, scales the word `1.2x`, and casts a radiant gold radial bloom.

#### Section 4: The Poetic Catalog (What It Creates)
- **Inspiration:** `vincent-lowe.info`, `hajimewatanabe.jp`
- **Layout:** 6 full-width editorial rows (01 Shayari, 02 Sher, 03 Ghazal & Poems, 04 Motivational, 05 Romantic & Love, 06 Dark & Melancholy).
- **Kinetic Mechanics:**
  - On scroll trigger: Each row slides in with staggered horizontal inertia.
  - On hover: The row expands from 90px to 160px height; a floating image/video preview capsule follows the cursor; background gold accent line charges to 100% width.
  - Number prefix (`01`, `02`) glitches to gold; title shifts right by 24px with elastic easing.

#### Section 5: The Scroll-Bound Journey (How It Works)
- **Inspiration:** `madeinevolve.com`, `camera-webgi.vercel.app`, `taotajima.jp`
- **Visuals:** Pinned viewport container powered by GSAP ScrollTrigger (300vh total scroll distance). Background video `2.mp4` scrubs frame-by-frame with scroll position.
- **3-Step 3D Camera Stages:**
  - **Stage 1 (Scroll 0% - 33%):** *"01. Whisper Your Emotion"* — Floating glass prompt capsule emerges from 3D depth. Cursor types dynamic prompt: *"Teri yaad mein beete lamhe..."*
  - **Stage 2 (Scroll 34% - 66%):** *"02. Neural Mood Extraction"* — Camera dollys in closer. Glowing neural particle nodes analyze sentiment (Urdu detected, Melancholic mood, 98% resonance).
  - **Stage 3 (Scroll 67% - 100%):** *"03. Words Materialize"* — Golden ink particles condense to form a finished Nastaliq shayari card with glowing gold border and audio haptic chime.

#### Section 6: Multilingual Tapestry (Languages)
- **Inspiration:** `ning-h.com`, `hajimewatanabe.jp`
- **Visuals:** 4 immersive interactive language canvases (English, Hindi, Urdu RTL, Roman).
- **Interaction:**
  - Sliding accordion split panels.
  - Hovering a language panel expands it to 60% viewport width while others compress to 13%.
  - Background calligraphy characters float in 3D parallax with depth-of-field blur.
  - Urdu panel triggers native Nastaliq calligraphy brushstroke SVG drawing on hover.

#### Section 7: The Physics Playground (Interactive Live Preview)
- **Inspiration:** `newmixcoffee.com`, `igloo.inc`, `showcase2.piyushsingh123443.workers.dev`
- **Visuals:** Interactive 2D physics sandbox powered by Matter.js and Three.js canvas. Background video `4.mp4` provides ambient texture.
- **Interactions:**
  - 8 draggable Mood & Category Orbs (`Love`, `Pain`, `Fire`, `Sufi`, `Sher`, `Mirza Ghalib`, `Gulzar`, `Jaun Elia`).
  - Users can toss orbs across the screen; they bounce with realistic gravity, mass, and restitution.
  - Colliding two orbs generates an instant preview poem in a floating holographic bubble.
  - Draggable sticker collection can be slapped onto the preview card.

#### Section 8: Monumental Metrics (Stats)
- **Inspiration:** `osmo.supply`, `pieterkoopt.nl`
- **Layout:** Dark obsidian strip with 4 massive counters:
  - `1,00,000+` Verses Generated
  - `4` Native Languages & Scripts
  - `12+` Literary Formats
  - `99.4%` Emotional Accuracy
- **Motion:** Numbers count up using GSAP scrub with character scramble and gold particle fireworks bursting at target values.

#### Section 9: The Sovereign Vault (Pricing)
- **Inspiration:** `osmo.supply`, `shader.se`
- **Layout:** Two 3D glass cards: Free vs Premium ₹99/month.
- **Premium Card Aggressive Effects:**
  - 3D mouse tilt with dynamic gold specular highlight shader tracking the cursor.
  - Multi-layer animated conic gradient border (`linear-gradient(var(--angle), #d4af37, #f0c93a, transparent)`).
  - Price `₹99` in 84px Cormorant Garamond glowing with pulsing gold ambient occlusion.
  - Continuous gold shimmer sweep on the checkout button.

#### Section 10: The Infinite Horizon (Final CTA & Outro)
- **Inspiration:** `taotajima.jp`, `madeinevolve.com`
- **Visuals:** Fullscreen cosmic depth powered by background video `6.mp4` with drifting gold stardust particles.
- **Typography:** Massive centered headline: *"Start Writing. Your Words Are Waiting."* (100px+).
- **Motion:** Magnetic giant CTA button that stretches elastically toward the cursor; clicking triggers a fullscreen gold liquid vortex transition to `/generate`.

---

### 6.2 Studio / Generate Page (/generate)

- **Layout:** Pinned fullscreen focused creation environment.
- **Mood-Reactive WebGL Canvas:**
  - Detects sentiment in real-time (`love`, `sad`, `fire`, `mystery`, `sufi`, `happy`).
  - WebGL background smoothly morphs color palette and particle behavior (e.g., floating rose petals for love, rain streaks for sadness, ember sparks for fire, deep nebula for sufi).
- **Refractive Chat Bubbles:**
  - AI bubbles use real-time WebGL glass refraction shaders with chromatic dispersion at edges.
  - Dynamic font switching (Noto Nastaliq Urdu with RTL support, Noto Sans Devanagari, Cormorant Garamond).
- **Kinetic Action Bar:**
  - Instant One-Click Copy with ripple success animation.
  - One-Click WhatsApp / Instagram Story formatted export.
  - **3D Poster Exporter:** Opens interactive modal to customize 3D card tilt, background gradients, and export high-res PNG/JPG for social media.
- **Ad Experience (Free Plan):**
  - Fullscreen glassmorphic ad countdown (3 seconds) before generation with smooth circular progress timer.

---

### 6.3 Personal Vault / Library (/library)

- **Layout:** 3-column masonry grid with interactive 3D perspective.
- **Card Interactions:**
  - Cards tilt on cursor hover with specular sheen.
  - Filter tabs (All, Shayari, Sher, Quotes, Urdu, Hindi) with sliding magnetic gold indicator pill.
  - Search bar with instant fuzzy search and kinetic card rearrangement animation.
  - Bulk actions with spring-loaded floating bottom action dock.

---

### 6.4 Login & Authentication (/login)

- **Visuals:** Deep midnight space with 200 floating star particles and subtle gold nebula.
- **Card Entrance:** Glassmorphic card drops in with heavy spring physics (`y: 60px -> 0px, opacity: 0 -> 1, blur: 20px -> 0px`).
- **Google OAuth & Email/Password:** Seamless integration with animated input borders and gold focus ring.

---

### 6.5 Cosmic 404 Page (/*)

- **Visuals:** Background video `6.mp4` with a dynamic gravitational blackhole particle simulation.
- **Interaction:**
  - Massive `404` typography that distorts when the user moves the cursor near it.
  - Poetic subtitle: *"Lost in the cosmos. This page does not exist, but your next verse does."*
  - Elastic "Return to Sanctuary" gold button.

---

## 7. Complete Animation & Interaction Specifications

### 7.1 Cursor System (5-State Magnetic Spring Cursor)
- **Layer 1 (Center Dot):** 6px gold dot tracking exact pointer coordinates (0 lag).
- **Layer 2 (Spring Ring):** 36px circular border with lerp `0.12` spring physics and velocity-based stretching.
- **Layer 3 (Trail Particle):** 12 gold stardust particles emitted on mouse movement with 400ms fade.
- **States:**
  - `Default`: Subtle gold ring + dot.
  - `Hover Text`: Ring expands to 64px, sets `mix-blend-mode: difference`, turns solid white.
  - `Hover Button`: Ring snaps magnetical to button bounds; dot fades out; button text glows.
  - `Hover Link`: Ring skews `15deg` with animated rotation.
  - `MouseDown / Drag`: Ring shrinks to 24px with high-tension spring scale `0.85`.

### 7.2 Page Transitions (Liquid Black & Gold Curtain)
- **Exit:** Liquid SVG wave / dark curtain slides up from bottom (`translateY(100%) -> translateY(0%)`, duration `500ms`, easing `[0.76, 0, 0.24, 1]`).
- **Enter:** Curtain wipes off top (`translateY(0%) -> translateY(-100%)`, duration `500ms`), while new page content cascades in with staggered 3D fade-up (`y: 40px -> 0px`, stagger `40ms`).

### 7.3 Smooth Scroll Engine (Lenis + GSAP Sync)
- Lenis Smooth Scroll initialized with `lerp: 0.08`, `wheelMultiplier: 0.9`, and `smoothTouch: true`.
- Synced directly with GSAP `ScrollTrigger.update` and `requestAnimationFrame`.

---

## 8. Technical Architecture & Tech Stack

| Domain | Technology / Library | Version | Purpose |
|---|---|---|---|
| **Core Framework** | React + TypeScript + Vite | 19.x / 7.x | High-performance reactive frontend SPA |
| **Animation Engine** | GSAP + ScrollTrigger + SplitText | 3.15.x | Complex scroll timelines and kinetic typography |
| **Motion Physics** | Motion (Framer Motion) + Lenis | 12.x / 1.3.x | UI component transitions & smooth scrolling |
| **3D & WebGL Canvas** | Three.js + @react-three/fiber + drei | r184+ / 9.x | 3D scenes, particles, video shaders, and camera rigs |
| **2D Physics** | Matter.js / Spring Physics | 0.20.x | Draggable chips, sticker bomb, and interactive playground |
| **Styling & Design System** | Tailwind CSS v4 + Vanilla CSS Variables | 4.x | Tokenized styling, glassmorphic filters, and keyframes |
| **State Management** | Zustand | 5.x | Global app state, user session, and active mood scene |
| **Backend & APIs** | Node.js + Express + Firebase Admin | 22.x / 11.x | Authentication, AI generation, and library sync |
| **Payment Gateway** | Razorpay SDK | 2.x | Subscriptions for Likhasha Premium (₹99/mo) |

---

## 9. Monetization & Business Model

1. **Free Tier:**
   - 5 AI generations per day.
   - Access to all 4 languages and content formats.
   - Up to 20 saved items in personal library.
   - Ad-supported (Google AdSense 3-second glass countdown before generation + subtle in-feed banners).
2. **Likhasha Premium (₹99 / Month):**
   - Unlimited AI generations.
   - Zero ads across entire platform.
   - Unlimited library storage.
   - Priority AI model inference speed.
   - High-res 3D Social Media Poster Exporter.
   - Exclusive VIP themes and moods.

---

## 10. Success Metrics & Milestones

- **Aesthetic Benchmark:** Nominated for and winning **Awwwards Site of the Day (SOTD)** and **FWA of the Day**.
- **Performance Budget:** 60fps steady rendering during WebGL particle simulation and video scrubbing.
- **Engagement:** Average session duration > 4.5 minutes due to rich interactive animations and physics playground.
- **Month 3 Target:** 2,000+ Daily Active Users, 250+ paying Premium subscribers (₹25,000+ MRR).

---

*Likhasha — Har lafz ek nasha. 🌙*