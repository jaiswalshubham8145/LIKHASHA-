# Frontend Stack Document
## Likhasha — AI Quote & Poetry Generator

**Version:** 2.0  
**Date:** May 2026

---

## 1. Project Structure

```
likhasha-frontend/
├── public/
│   └── fonts/                        # Urdu + Hindi font files
├── src/
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatWindow.jsx         # Scrollable message area
│   │   │   ├── ChatBubble.jsx         # User + AI message bubbles
│   │   │   ├── ChatInput.jsx          # Bottom input bar
│   │   │   └── CategorySelector.jsx   # Horizontal chip selector
│   │   ├── three/
│   │   │   ├── SceneManager.jsx       # Controls active scene
│   │   │   ├── LandingCycler.jsx      # Cycles 4 scenes on landing
│   │   │   └── scenes/
│   │   │       ├── SpaceScene.jsx     # Dark space + stars
│   │   │       ├── OceanScene.jsx     # Deep ocean + waves
│   │   │       ├── GeometricScene.jsx # Neon abstract shapes
│   │   │       ├── NightSkyScene.jsx  # Moonlit clouds + aurora
│   │   │       ├── MoonlitScene.jsx   # Shayari/Sher mood
│   │   │       ├── PetalScene.jsx     # Romantic mood
│   │   │       ├── RainScene.jsx      # Sad/dark mood
│   │   │       ├── FireScene.jsx      # Motivational mood
│   │   │       ├── ConfettiScene.jsx  # Happy mood
│   │   │       └── CosmosScene.jsx    # Default/quote mood
│   │   ├── ads/
│   │   │   ├── AdOverlay.jsx          # Interstitial with countdown
│   │   │   └── AdBanner.jsx           # Banner below result
│   │   ├── auth/
│   │   │   ├── LoginCard.jsx
│   │   │   └── GoogleAuthButton.jsx
│   │   ├── premium/
│   │   │   ├── UpgradeModal.jsx       # Shown on limit hit
│   │   │   ├── PlanCard.jsx           # Free vs Premium comparison
│   │   │   └── RazorpayButton.jsx     # Payment trigger
│   │   └── ui/
│   │       ├── Header.jsx
│   │       ├── ActionButtons.jsx      # Copy/Share/Regen
│   │       ├── Toast.jsx
│   │       ├── LoadingDots.jsx
│   │       └── PlanBadge.jsx          # Free / Premium badge
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Chat.jsx
│   │   ├── Library.jsx
│   │   ├── Premium.jsx
│   │   └── Profile.jsx
│   ├── hooks/
│   │   ├── useAuth.js                 # Firebase auth state
│   │   ├── useGenerate.js             # Generation + Opal trigger
│   │   ├── useScene.js                # Scene switcher
│   │   ├── useLibrary.js              # Firestore CRUD
│   │   ├── usePremium.js              # Plan check + Razorpay
│   │   └── useAdTrigger.js            # Ad show/hide logic
│   ├── services/
│   │   ├── api.js                     # Backend calls
│   │   ├── firebase.js                # Firebase init
│   │   ├── opal.js                    # Opal workflow triggers
│   │   └── razorpay.js                # Payment helpers
│   ├── store/
│   │   └── appStore.js                # Zustand global state
│   ├── styles/
│   │   └── index.css                  # Tailwind + custom CSS vars
│   ├── utils/
│   │   ├── detectLanguage.js
│   │   ├── detectMood.js
│   │   └── formatShare.js
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
└── tailwind.config.js
```

---

## 2. Core Libraries

| Library | Version | Install |
|---------|---------|---------|
| React | 18.x | `npm create vite@latest` (React template) |
| React Router | 6.x | `npm i react-router-dom` |
| Three.js | r160+ | `npm i three` |
| @react-three/fiber | 8.x | `npm i @react-three/fiber` |
| @react-three/drei | 9.x | `npm i @react-three/drei` |
| Framer Motion | 10.x | `npm i framer-motion` |
| Tailwind CSS | 3.x | `npm i -D tailwindcss postcss autoprefixer` |
| Firebase | 10.x | `npm i firebase` |
| Zustand | 4.x | `npm i zustand` |
| Axios | 1.x | `npm i axios` |

---

## 3. Design Tokens (from Stitch — Deep Purple + Gold)

```css
:root {
  /* Colors */
  --color-bg:              #0d0218;
  --color-bg-2:            #110225;
  --color-surface:         rgba(255, 255, 255, 0.05);
  --color-surface-hover:   rgba(255, 255, 255, 0.08);
  --color-border:          rgba(212, 175, 55, 0.2);
  --color-accent:          #d4af37;
  --color-accent-hover:    #f0c93a;
  --color-accent-glow:     rgba(212, 175, 55, 0.3);
  --color-text-primary:    #f5f0ff;
  --color-text-secondary:  #9b89c4;
  --color-text-muted:      #6b5f8a;
  --color-ad-bg:           rgba(0, 0, 0, 0.88);
  --color-error:           #ff6b6b;
  --color-success:         #6bffb8;

  /* Typography */
  --font-primary:   'Inter', sans-serif;
  --font-urdu:      'Noto Nastaliq Urdu', serif;
  --font-hindi:     'Noto Sans Devanagari', sans-serif;
  --font-display:   'Playfair Display', serif;

  /* Spacing */
  --chat-max-width:   720px;
  --bubble-padding:   16px 20px;
  --input-height:     56px;
  --header-height:    64px;

  /* Shadows */
  --shadow-gold:    0 0 20px rgba(212, 175, 55, 0.2);
  --shadow-card:    0 8px 32px rgba(0, 0, 0, 0.4);
}
```

---

## 4. Three.js Scenes — Full Spec

### 4.1 Landing Page Scenes (Cycled every 8s)

**SpaceScene.jsx**
- `<Stars>` from drei: count=5000, radius=100, depth=50, fade
- `<Sparkles>` : count=200, size=0.5, speed=0.3, color="#d4af37"
- Slow camera auto-rotation: 0.05 rad/s around Y axis
- Background color: `#000005`

**OceanScene.jsx**
- Custom `PlaneGeometry` with animated wave vertex shader
- `<pointLight>` color="#00ffcc" intensity=2, position below plane
- Bioluminescent particle system: 800 points, teal glow
- Background color: `#000d1a`

**GeometricScene.jsx**
- `<InstancedMesh>`: 200 random geometric shapes (box, torus, octahedron)
- `<gridHelper>` with gold color
- Neon line material with emissive glow
- Shapes slowly rotate on all axes
- Background color: `#050010`

**NightSkyScene.jsx**
- `<Cloud>` from drei: 8 clouds, soft white, slow drift
- `<MeshBasicMaterial>` moon sphere, emissive white
- Custom aurora GLSL shader (sine wave color bands: purple + green)
- `<Stars>` count=2000, smaller than space scene
- Background color: `#05001a`

---

### 4.2 Chat Page Mood Scenes

**MoonlitScene.jsx** (Shayari / Sher)
- Moon mesh (emissive white, soft glow)
- 500 gold dust particles drifting upward slowly
- Urdu calligraphy SVG sprites as floating textures
- Background: deep navy `#04001f`

**PetalScene.jsx** (Romantic)
- 200 petal sprites (pink + gold tones) falling gently
- `<pointLight>` pink tint, soft intensity
- Subtle purple-pink fog
- Background: `#1a0020`

**RainScene.jsx** (Sad / Dark)
- 1000 raindrop lines (thin, grey-blue, falling fast)
- Dark environment, minimal ambient light
- Slow camera tilt effect
- Background: `#010510`

**FireScene.jsx** (Motivational)
- 800 upward-moving particles (orange → yellow gradient)
- Emissive glow on particles
- Warm directional light from below
- Background: `#0f0500`

**ConfettiScene.jsx** (Happy / Funny)
- 300 colorful confetti mesh pieces
- Physics-like random rotation + fall
- Warm ambient light
- Background: `#0a0a00`

**CosmosScene.jsx** (Default)
- Deep purple nebula texture (sprite)
- 400 gold light orbs drifting
- Gentle camera float
- Background: `#0d0218` (matches brand bg)

---

## 5. Global State (Zustand)

```javascript
// appStore.js
{
  // Auth
  user: null,
  plan: 'free',              // 'free' | 'premium'
  dailyCount: 0,

  // Chat
  messages: [],
  isLoading: false,
  activeCategory: 'surprise',

  // 3D
  activeScene: 'CosmosScene',
  isTransitioning: false,

  // Ads
  showAdOverlay: false,
  adCountdown: 3,

  // Actions
  addMessage: fn,
  setLoading: fn,
  setScene: fn,
  setCategory: fn,
  incrementCount: fn,
  showAd: fn,
  hideAd: fn,
  setUser: fn,
  setPlan: fn
}
```

---

## 6. Scene Switching Logic

```javascript
// useScene.js
const sceneMap = {
  shayari:      'MoonlitScene',
  sher:         'MoonlitScene',
  romantic:     'PetalScene',
  sad:          'RainScene',
  dark:         'RainScene',
  motivational: 'FireScene',
  happy:        'ConfettiScene',
  funny:        'ConfettiScene',
  default:      'CosmosScene',
  quote:        'CosmosScene'
}

function switchScene(type, mood) {
  const key = ['shayari','sher'].includes(type) ? type : mood
  const next = sceneMap[key] || sceneMap.default
  setTransitioning(true)           // fade out (600ms)
  setTimeout(() => {
    setActiveScene(next)
    setTransitioning(false)        // fade in
  }, 600)
}
```

---

## 7. Font Loading

```html
<!-- index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?
  family=Inter:wght@400;500;600&
  family=Playfair+Display:wght@600;700&
  family=Noto+Nastaliq+Urdu:wght@400;700&
  family=Noto+Sans+Devanagari:wght@400;500&
  display=swap" rel="stylesheet">
```

Urdu + Hindi fonts loaded lazily. Applied via CSS class on chat bubble based on detected language:

```css
.lang-urdu  { font-family: var(--font-urdu);  direction: rtl; }
.lang-hindi { font-family: var(--font-hindi); }
.lang-en    { font-family: var(--font-primary); }
```

---

## 8. Responsive Breakpoints

| Breakpoint | Width | Layout Notes |
|-----------|-------|-------------|
| Mobile | 375px | Full-screen chat, input pinned bottom, no sidebar |
| Tablet | 768px | Wider chat area, category chips scrollable |
| Desktop | 1280px | Max-width container centered, more padding |

---

## 9. Ad Components

**AdOverlay.jsx** (before generation — free users)
- Full-screen semi-transparent dark overlay
- Gold countdown timer (3 → 2 → 1)
- AdSense unit centered
- "Skip Ad" button appears after 3 seconds
- Framer Motion: slide up entrance

**AdBanner.jsx** (after generation — free users)
- Banner below generated content bubble
- AdSense responsive unit
- Subtle gold border top
- Dismiss X button (collapses, not removes)
