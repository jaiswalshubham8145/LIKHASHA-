CopyTechnical Requirements Document (TRD)
Likhasha — AI Poetry & Quote Generator
Version: 4.0
Date: May 2026
Status: Final

1. Technical Inspiration from Reference Sites
WebsiteTechnical Pattern We Usening-h.comCustom cursor with spring physics, showreel-style transitions, GSAP SplitTextlandonorris.comFull-screen cinematic hero, smooth video integration, premium scroll behaviorosmo.supplyComponent-level precision, dark UI system, marquee scroll stripsshader.seWebGL/Three.js interactive backgrounds, creative studio polishnewmixcoffee.comDrag interactions, video-first content, unexpected micro-interactionsmvdriest.nlLenis smooth scroll, minimal DOM, typographic scroll revealspieterkoopt.nlOversized editorial typography, bold layout confidencevincent-lowe.infoTypography as visual art, poetic white space, refined pacingmadeinevolve.comImmersive storytelling flow, scroll-driven narrative

2. System Architecture
┌──────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                         │
│                                                               │
│  React.js 18 + Vite 5                                        │
│  ├── GSAP 3 + ScrollTrigger + SplitText   (scroll + type)   │
│  ├── Framer Motion 10                      (transitions)      │
│  ├── Three.js r160 + R3F                   (particles + WebGL)│
│  ├── Lenis 1.x                             (smooth scroll)    │
│  ├── Tailwind CSS 3                        (styling)          │
│  └── Zustand 4                             (state)            │
└─────────────────────────────┬────────────────────────────────┘
                              │ HTTPS
┌─────────────────────────────▼────────────────────────────────┐
│                   NODE.JS API (Railway)                        │
│                   Express.js 4.x                              │
└──────────┬──────────────────────────────────┬────────────────┘
           │                                  │
┌──────────▼──────────┐          ┌────────────▼──────────────┐
│    Claude API        │          │    Firebase Services       │
│    Anthropic         │          │    Auth + Firestore        │
└─────────────────────┘          └───────────────────────────┘
           │
┌──────────▼──────────┐          ┌───────────────────────────┐
│    Razorpay          │          │    Google AdSense          │
│    ₹99/month         │          │    Free users only         │
└─────────────────────┘          └───────────────────────────┘

3. Frontend — Complete Technical Spec
3.1 All Libraries
LibraryVersionInstall CommandInspired ByReact.js18.xnpm create vite@latest—Vite5.xincluded—React Router6.xnpm i react-router-dom—Tailwind CSS3.xnpm i -D tailwindcssosmo.supplyGSAP3.xnpm i gsapning-h.com, shader.se@gsap/react3.xnpm i @gsap/react—GSAP ScrollTriggerincludedGSAP pluginmvdriest.nlGSAP SplitTextincludedGSAP pluginpieterkoopt.nlFramer Motion10.xnpm i framer-motionlandonorris.comThree.jsr160+npm i threeshader.se@react-three/fiber8.xnpm i @react-three/fibershader.se@react-three/drei9.xnpm i @react-three/drei—Lenis1.xnpm i lenismvdriest.nlCountUp.js2.xnpm i countup.jsosmo.supplyZustand4.xnpm i zustand—Axios1.xnpm i axios—Firebase SDK10.xnpm i firebase—
3.2 Routes
RoutePageAuthBehavior/HomeNoFull cinematic storytelling page/loginLoginNoIf logged in → redirect /generate/generateGenerateYesIf no auth → redirect /login/libraryLibraryYesIf no auth → redirect /login/pricingPricingNoPublic/*404NoPoetic error page

4. Animation System — Full Spec
4.1 Custom Cursor
Inspired by: ning-h.com, mvdriest.nl
Two elements:
  1. Small dot: 8px, gold #d4af37, follows cursor exactly
  2. Large ring: 40px, gold outline, follows with spring lag

Spring physics:
  Ring lerp: 0.1 (smooth lag)
  Dot: instant follow

States:
  Default:    small dot + ring visible
  Hover text: ring expands to 60px + blend-mode: difference
  Hover btn:  ring fills gold + dot disappears
  Hover link: ring skews slightly (rotate 15deg)
  Click:      ring shrinks to 20px + bounces back

Implementation: useEffect + requestAnimationFrame
Mobile: cursor completely hidden (touch devices)
4.2 Page Transitions
Inspired by: ning-h.com
Black curtain overlay (full screen)
On page exit:
  Curtain slides UP from bottom: translateY(100%) → translateY(0)
  Duration: 400ms cubic-bezier(0.76, 0, 0.24, 1)

On page enter:
  Curtain slides UP again: translateY(0) → translateY(-100%)
  Duration: 400ms cubic-bezier(0.76, 0, 0.24, 1)
  New page fades in underneath

Total: 800ms — feels like turning a page
Implemented with: Framer Motion AnimatePresence
4.3 Loading Screen
Inspired by: ning-h.com letter drop
Background: #000000 pure black

Phase 1 — Letters drop (0-1200ms):
  LIKHASHA split into individual letters
  Each letter: translateY(-60px) opacity(0) → translateY(0) opacity(1)
  Stagger: 80ms per letter
  Duration per letter: 600ms ease-out
  Font: Cormorant Garamond, large, gold

Phase 2 — Tagline (800ms-1400ms):
  "har lafz ek nasha" fades in
  Inter, small, muted, italic
  300ms fade

Phase 3 — Progress (1400ms-2000ms):
  Gold line fills left to right
  Width: 0% → 100%, bottom of screen
  2px height, subtle

Phase 4 — Exit (2000ms-2500ms):
  Everything fades out together
  Page content fades in underneath
  500ms crossfade
4.4 Scroll Animations — GSAP ScrollTrigger
Inspired by: pieterkoopt.nl, vincent-lowe.info
Trigger settings (default):
  trigger: element
  start: "top 85%"
  end: "top 30%"
  toggleActions: "play none none none"
  once: true

Fade Up (most elements):
  from: { y: 50, opacity: 0 }
  to: { y: 0, opacity: 1 }
  duration: 0.8
  ease: "power2.out"

Typography — SplitText (headlines):
  Split by: words
  from: { y: 80, opacity: 0, rotateX: -30 }
  to: { y: 0, opacity: 1, rotateX: 0 }
  stagger: 0.06
  duration: 0.9
  ease: "power3.out"
  Inspired by: pieterkoopt.nl

Character split (small text, labels):
  Split by: chars
  from: { opacity: 0, y: 20 }
  stagger: 0.025
  duration: 0.6

Line draw (gold lines):
  from: { scaleX: 0, transformOrigin: "left" }
  to: { scaleX: 1 }
  duration: 0.8
  ease: "power2.inOut"

Stagger cards/rows:
  stagger: 0.1
  from bottom up

Parallax (backgrounds):
  scrub: 1
  from: { y: -80 }
  to: { y: 80 }
  Speed: 30-40% of scroll
4.5 Marquee Strip
Inspired by: osmo.supply
Component: <Marquee />
Content: "Poetry · Shayari · Quotes · Sher · Poems · "
Speed: 40px/second — slow and elegant
Direction: left (can reverse on hover)
Font: Cormorant Garamond, large, muted
Hover individual word: gold color transition 200ms
Implementation: CSS animation + transform: translateX
4.6 Hover Interactions
Feature rows (Home section 4):
Default: row normal state
Hover: 
  - translateY(-4px)
  - gold left border appears (width 0 → 3px, 200ms)
  - number brightens to full gold
  - description slides in from right (opacity 0→1)
  - thin gold underline draws across
Language sections (Home section 6):
Hover on large text:
  - slight skew: skewX(-3deg)
  - color shifts to gold
  - 300ms ease
Buttons:
Gold filled:
  - scale(1.03)
  - shimmer sweep left to right
  - glow shadow grows
  - 200ms ease

Ghost/outline:
  - background fills gold slowly
  - text color flips to dark
  - 300ms ease
4.7 Smooth Scrolling — Lenis
Inspired by: mvdriest.nl, landonorris.com
Config:
  lerp: 0.08  (slower than default — more cinematic)
  duration: 1.2
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
  orientation: vertical
  smoothWheel: true

Connected to GSAP:
  gsap.ticker.add((time) => { lenis.raf(time * 1000) })
  gsap.ticker.lagSmoothing(0)

Wrapped around entire app
4.8 Three.js Particle System
Component: <BackgroundParticles mood={activeMood} />

Canvas:
  position: fixed
  top: 0, left: 0
  width: 100%, height: 100%
  z-index: -1
  background: transparent
  pointer-events: none

Particle counts:
  Home:      300 particles
  Generate:  250 particles
  Others:    150 particles

Default particle behavior:
  Color: gold #d4af37
  Size: 0.5-2px random
  Opacity: 0.1-0.6 random
  Movement: slow random drift
  Speed: 0.1-0.3 units/second

Mood variants (Generate page):
  love:         color #ff9eb5 + gold, upward drift
  sad:          color #8899bb, slow downward drift
  motivational: color #ff8c00 + gold, fast upward
  happy:        multicolor, random directions
  mystery:      color #9b89c4, very slow drift
  default:      gold #d4af37, gentle drift

Mood transition: 1500ms color lerp + behavior shift

5. Backend — Complete Spec
5.1 Server Setup
Runtime:    Node.js 20.x
Framework:  Express.js 4.x
Hosting:    Railway
Port:       3000 (Railway auto-assigns)
CORS:       Only allow https://likhasha.com
Rate limit: express-rate-limit middleware
5.2 All API Endpoints
MethodEndpointAuthRate LimitDescriptionPOST/api/generateYes20/hour free, 60/hour premiumGenerate content via ClaudePOST/api/saveYes30/hourSave generation to FirestoreGET/api/library/:uidYes60/hourFetch user library with filtersDELETE/api/library/:idYes30/hourDelete a generationPOST/api/shareYes30/hourFormat content for platformGET/api/user/:uidYes60/hourGet plan + daily countPOST/api/subscribeYes5/hourCreate Razorpay subscriptionPOST/api/webhook/razorpaySignature—Handle payment events
5.3 Generation Pipeline
1. Receive POST /api/generate
2. Verify Firebase ID token (401 if invalid)
3. Fetch user doc from Firestore
4. Check daily limit:
     Free:    dailyCount >= 5 → 429 error
     Premium: no limit
5. Detect language from input:
     /[\u0600-\u06FF]/ → Urdu (ur)
     /[\u0900-\u097F]/ → Hindi (hi)
     roman keywords    → roman
     default           → English (en)
6. Detect mood from input keywords
7. Detect content type from input + category chip
8. Build Claude system prompt dynamically
9. Call Claude API: claude-sonnet-4-20250514, max_tokens: 1000
10. Parse response
11. Auto-save to Firestore generations collection
12. Increment user dailyCount
13. Return: { content, type, language, mood, generationId }
5.4 Language Detection
javascriptfunction detectLanguage(input) {
  const urdu  = /[\u0600-\u06FF]/
  const hindi = /[\u0900-\u097F]/
  const romanWords = ['shayari','likho','chahiye','dost',
                      'yaar','ishq','mohabbat','dil','pyaar']

  if (urdu.test(input))  return 'ur'
  if (hindi.test(input)) return 'hi'
  if (romanWords.some(w => input.toLowerCase().includes(w))) return 'roman'
  return 'en'
}
5.5 Mood Detection
javascriptconst moodMap = {
  love:         ['love','pyaar','mohabbat','ishq','romantic','dil'],
  sad:          ['sad','dukh','dard','tanha','akela','missing','cry'],
  motivational: ['motivat','inspire','himmat','strong','success'],
  dark:         ['dark','death','maut','broken','andhera'],
  happy:        ['happy','khush','celebrate','mast','funny']
}

function detectMood(input) {
  const lower = input.toLowerCase()
  for (const [mood, words] of Object.entries(moodMap)) {
    if (words.some(w => lower.includes(w))) return mood
  }
  return 'neutral'
}
5.6 Claude Prompt Templates
Urdu Shayari:
System: You are a master Urdu shayar (poet). Write authentic, 
emotionally deep shayari in Urdu script (Nastaliq). 
4-6 lines. No English. No explanation. Just the shayari.
User: {input}
Roman Urdu Shayari:
System: You are a master shayar. Write shayari in Roman Urdu.
4-6 lines. Emotional and authentic. Just the shayari.
User: {input}
Hindi Poem:
System: You are a Hindi poet. Write a beautiful poem in 
Hindi Devanagari script. 6-10 lines. Lyrical and emotional.
Just the poem.
User: {input}
English Quote:
System: You are a master quote writer. Write one powerful 
original quote in English. 1-3 sentences. Just the quote.
User: {input}
Sher (Urdu couplet):
System: You are a master of Urdu sher. Write exactly one 
sher (2-line couplet) in Urdu script. Perfect meter and rhyme.
Just the sher.
User: {input}

6. Firebase Schema
6.1 users collection
users/{uid}
  displayName:       string
  email:             string
  plan:              "free" | "premium"
  premiumExpiry:     timestamp | null
  dailyCount:        number        (resets midnight)
  dailyReset:        timestamp     (next reset time)
  totalGenerations:  number        (lifetime)
  preferredLang:     "en"|"hi"|"ur"|"roman"
  createdAt:         timestamp
  updatedAt:         timestamp
6.2 generations collection
generations/{id}
  uid:        string    (owner)
  content:    string    (generated text)
  type:       string    (quote|poem|shayari|sher|motivational)
  language:   string    (en|hi|ur|roman)
  mood:       string    (love|sad|motivational|happy|mystery|neutral)
  userInput:  string    (original prompt)
  createdAt:  timestamp

Indexes:
  uid + createdAt DESC   (library fetch)
  uid + type             (library filter)
  uid + language         (library filter)
6.3 subscriptions collection
subscriptions/{razorpaySubId}
  uid:          string
  amount:       99
  currency:     "INR"
  status:       "active"|"cancelled"|"expired"
  startDate:    timestamp
  nextBilling:  timestamp
  createdAt:    timestamp

7. Razorpay Payment Flow
User clicks "Upgrade" button
         ↓
POST /api/subscribe
  → Creates Razorpay subscription (₹99/month)
  → Returns: { subscriptionId, razorpayKeyId }
         ↓
Frontend opens Razorpay checkout
  → Payment methods: UPI, Card, Net Banking, Wallet
         ↓
Payment completes
         ↓
Razorpay sends webhook to POST /api/webhook/razorpay
  → Verify HMAC-SHA256 signature
  → subscription.activated:
      Firestore: plan = "premium"
      Firestore: premiumExpiry = now + 30 days
      Send: confirmation email via Resend
  → subscription.cancelled:
      Firestore: plan = "free"
      Firestore: premiumExpiry = null
      Send: cancellation email
         ↓
Frontend: refresh user state → ads disappear

8. Ad System
Component: <AdOverlay trigger="generate|share" />

Shows: free users only (plan === 'free')
Hides: premium users

Design:
  Position: fixed full screen z-index 1000
  Background: rgba(0,0,0,0.92)
  
  Center content:
    Text: "Preparing your words..." (Cormorant Garamond, gold)
    2 × AdSense 300x250 units (side by side desktop, stacked mobile)
    Gold countdown: 3... 2... 1...
    Gold progress bar fills as countdown runs
  
  After 3 seconds:
    "Skip →" button fades in (gold outline)
    Click skip: overlay fades out, action proceeds

Triggers:
  1. User clicks Generate → AdOverlay(trigger="generate")
  2. User clicks Share → AdOverlay(trigger="share")

9. Opal Workflows
WorkflowTriggerStepsGenerateUser clicks GenerateShow ads (free) → call API → auto-save → update countShareUser clicks ShareShow ads (free) → format content → open native shareNew UserFirebase auth signupCreate Firestore doc → send welcome emailPremium OnRazorpay webhook activatedUpdate plan → send emailPremium OffRazorpay webhook cancelledRevert plan → send emailDaily ResetMidnight cron dailyReset dailyCount all free users

10. Performance Requirements
MetricTargetMethodFirst Contentful Paint< 1.2sCode splitting, lazy loadingTime to Interactive< 2.5sDeferred scriptsAI generation response< 5sClaude APIPage transition800msFramer Motion curtainParticle FPS60fpsMax 300 particlesLighthouse score88+Optimized assetsLenis scroll FPS60fpsRAF loopGSAP animation FPS60fpsWill-change hints

11. Environment Variables
Backend — Railway:
ANTHROPIC_API_KEY
FIREBASE_PROJECT_ID
FIREBASE_PRIVATE_KEY
FIREBASE_CLIENT_EMAIL
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET
RESEND_API_KEY
PORT=3000
FRONTEND_URL=https://likhasha.com
Frontend — Vercel:
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_API_BASE_URL
VITE_ADSENSE_CLIENT_ID
VITE_RAZORPAY_KEY_ID

12. Hosting
LayerProviderCostNotesFrontendVercelFreeAuto-deploy from GitHubBackendRailway~₹420/moNode.js, auto-deployDatabaseFirebaseFree tier1GB FirestoreAuthFirebaseFree tier10K users/moDomainAny registrar~₹800/yrlikhasha.com

13. Project Structure
likhasha-frontend/
├── src/
│   ├── components/
│   │   ├── cursor/
│   │   │   └── CustomCursor.jsx        ← ning-h.com inspired
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── PageTransition.jsx      ← curtain transition
│   │   ├── ui/
│   │   │   ├── LoadingScreen.jsx       ← letter drop animation
│   │   │   ├── Marquee.jsx             ← osmo.supply inspired
│   │   │   ├── Toast.jsx
│   │   │   └── AdOverlay.jsx
│   │   ├── three/
│   │   │   └── BackgroundParticles.jsx
│   │   ├── home/
│   │   │   ├── Hero.jsx
│   │   │   ├── FeatureRows.jsx         ← editorial rows
│   │   │   ├── HowItWorks.jsx          ← scroll steps
│   │   │   ├── Languages.jsx           ← alternating layout
│   │   │   ├── LivePreview.jsx
│   │   │   ├── Stats.jsx
│   │   │   └── PricingPreview.jsx
│   │   └── chat/
│   │       ├── ChatWindow.jsx
│   │       ├── ChatBubble.jsx
│   │       ├── ChatInput.jsx
│   │       ├── CategoryChips.jsx
│   │       └── ActionButtons.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Generate.jsx
│   │   ├── Library.jsx
│   │   ├── Pricing.jsx
│   │   └── NotFound.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useLenis.js                 ← smooth scroll setup
│   │   ├── useGSAP.js                  ← scroll animations
│   │   ├── useCursor.js                ← custom cursor
│   │   ├── useGenerate.js
│   │   └── useMood.js
│   ├── services/
│   │   ├── api.js
│   │   ├── firebase.js
│   │   └── razorpay.js
│   ├── store/
│   │   └── appStore.js
│   ├── styles/
│   │   └── index.css
│   └── utils/
│       ├── detectLanguage.js
│       ├── detectMood.js
│       └── formatShare.js

likhasha-backend/
├── src/
│   ├── routes/
│   │   ├── generate.js
│   │   ├── library.js
│   │   ├── user.js
│   │   ├── subscribe.js
│   │   └── webhook.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── rateLimit.js
│   │   └── planCheck.js
│   └── services/
│       ├── claude.js
│       ├── firestore.js
│       ├── detector.js
│       └── email.js