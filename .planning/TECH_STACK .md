# Tech Stack Document
## Likhasha — AI Poetry & Quote Generator

**Version:** 3.0  
**Date:** May 2026

---

## 1. Complete Stack Overview

```
┌──────────────────────────────────────────────────────────┐
│                      TOOLS LAYER                          │
│   Antigravity (IDE)  │  Stitch (Design)  │  Opal (Auto) │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                         │
│  React.js + Vite + Tailwind CSS                          │
│  Framer Motion + GSAP + Three.js + Lenis                 │
│  Cormorant Garamond + Playfair Display + Inter           │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                    BACKEND LAYER                          │
│              Node.js + Express (Railway)                  │
└──────────────────────────────────────────────────────────┘

┌────────────────────────┐  ┌───────────────────────────┐
│       AI LAYER         │  │      DATABASE LAYER        │
│  Claude API (Anthropic)│  │  Firebase Auth + Firestore │
└────────────────────────┘  └───────────────────────────┘

┌────────────────────────┐  ┌───────────────────────────┐
│    PAYMENTS LAYER      │  │    MONETIZATION LAYER      │
│  Razorpay ₹99/month    │  │    Google AdSense          │
└────────────────────────┘  └───────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                     HOSTING LAYER                         │
│         Vercel (Frontend) + Railway (Backend)             │
└──────────────────────────────────────────────────────────┘
```

---

## 2. Tools Layer

| Tool | Type | Role |
|------|------|------|
| **Antigravity** | Desktop IDE (VS Code + AI agents) | Write all code. Use AI agents to scaffold components, build animations, debug, and generate everything |
| **Stitch** | AI UI/design generator | Design all 6 pages with brand colors and export React + Tailwind code |
| **Opal** | Workflow automation | Orchestrate generation flow, ad timing, email sends, daily resets, payment events |

---

## 3. Frontend Layer — Complete

### Core Framework

| Library | Version | Install | Purpose |
|---------|---------|---------|---------|
| React.js | 18.x | via Vite | UI framework |
| Vite | 5.x | `npm create vite@latest` | Build tool + dev server |
| React Router | 6.x | `npm i react-router-dom` | Page routing |

### Styling

| Library | Version | Install | Purpose |
|---------|---------|---------|---------|
| Tailwind CSS | 3.x | `npm i -D tailwindcss` | Utility-first CSS |
| Google Fonts | — | HTML link tag | Cormorant Garamond + Playfair Display + Inter |

### Animation Libraries

| Library | Version | Install | Purpose |
|---------|---------|---------|---------|
| Framer Motion | 10.x | `npm i framer-motion` | UI animations, page transitions, entrance effects |
| GSAP | 3.x | `npm i gsap` | Scroll animations, parallax, SplitText typography |
| @gsap/react | 3.x | `npm i @gsap/react` | GSAP React hooks |
| Lenis | 1.x | `npm i lenis` | Cinematic smooth scrolling |

### 3D & Particles

| Library | Version | Install | Purpose |
|---------|---------|---------|---------|
| Three.js | r160+ | `npm i three` | Particle systems, background effects |
| @react-three/fiber | 8.x | `npm i @react-three/fiber` | React + Three.js bridge |
| @react-three/drei | 9.x | `npm i @react-three/drei` | Useful Three.js helpers |

### Utilities

| Library | Version | Install | Purpose |
|---------|---------|---------|---------|
| Zustand | 4.x | `npm i zustand` | Global state (chat, mood, user, ads) |
| Axios | 1.x | `npm i axios` | API calls to backend |
| CountUp.js | 2.x | `npm i countup.js` | Animated number counters in stats section |
| Firebase SDK | 10.x | `npm i firebase` | Auth + Firestore client-side |

---

## 4. Backend Layer

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 20.x | Server runtime |
| Express.js | 4.x | REST API framework |
| Firebase Admin SDK | 12.x | Server-side Firebase auth verification |
| Axios | 1.x | Claude API calls |
| Razorpay Node SDK | Latest | Payment processing |
| Resend | Latest | Transactional emails |
| dotenv | Latest | Environment variables |
| cors | Latest | Cross-origin requests |
| express-rate-limit | Latest | API rate limiting |

---

## 5. AI Layer

| Service | Details |
|---------|---------|
| Provider | Anthropic |
| Model | `claude-sonnet-4-20250514` |
| Max tokens | 1000 per request |
| Usage | Poetry, shayari, quotes, sher generation |
| Prompt building | Dynamic — based on detected language + mood + type |
| Cost | Pay per token — estimated ₹2,000-5,000/month at launch |

---

## 6. Database & Auth Layer

| Service | Provider | Purpose |
|---------|---------|---------|
| Authentication | Firebase Auth | Google OAuth + Email/Password login |
| Database | Firebase Firestore | Users, generations, subscriptions |
| Storage | — | Not needed in v1.0 |

**Firebase Free Tier:**
- Auth: 10,000 users/month free
- Firestore: 1GB storage + 50K reads/day free
- Sufficient for launch

---

## 7. Payments Layer

| Service | Details |
|---------|---------|
| Provider | Razorpay |
| Plan | ₹99/month recurring subscription |
| Payment methods | UPI, Cards, Net Banking, Wallets |
| Fee | 2% per transaction (~₹2 per payment) |
| KYC | Required for live mode |
| Webhook | `/api/webhook/razorpay` handles all events |

---

## 8. Monetization Layer

| Service | Details |
|---------|---------|
| Provider | Google AdSense |
| Users | Free users only |
| Ad units | 4 units (2 before generate, 2 before share) |
| Format | 300x250 display ads |
| Revenue | RPM-based, India avg ₹50-150 per 1000 views |
| Approval | Apply early — takes 1-7 days |

---

## 9. Hosting Layer

| Service | Provider | Cost | Notes |
|---------|---------|------|-------|
| Frontend | Vercel | Free (Hobby) | Auto-deploys from GitHub |
| Backend | Railway | ~₹420/month | Node.js hosting |
| Domain | Any registrar | ~₹800/year | likhasha.com |
| SSL | Auto | Free | Vercel + Railway handle it |

---

## 10. Email Layer

| Service | Provider | Purpose |
|---------|---------|---------|
| Email sending | Resend | Welcome, premium confirmation, cancellation emails |
| Free tier | 3,000 emails/month | Free at launch |
| Triggered by | Opal workflows | On signup, payment events |

---

## 11. Typography Stack

| Font | Type | Used For | Load Via |
|------|------|---------|---------|
| Cormorant Garamond | Elegant serif | Hero headlines, logo, 404 | Google Fonts |
| Playfair Display | Premium serif | Section headings, card titles | Google Fonts |
| Inter | Modern sans | Body text, UI, buttons | Google Fonts |
| Noto Nastaliq Urdu | Urdu Nastaliq | Urdu content in chat | Google Fonts |
| Noto Sans Devanagari | Hindi | Hindi content in chat | Google Fonts |

**Loading Strategy:**
- Cormorant Garamond + Playfair + Inter: preload (critical)
- Noto Nastaliq Urdu + Noto Sans Devanagari: lazy load (only when detected)

---

## 12. Color System

| Token | Value | Used For |
|-------|-------|---------|
| `--bg-primary` | `#080810` | Main page background |
| `--bg-secondary` | `#0f0f1a` | Slightly lighter background |
| `--surface` | `rgba(255,255,255,0.05)` | Cards, inputs |
| `--border` | `rgba(212,175,55,0.2)` | Card borders |
| `--border-hover` | `rgba(212,175,55,0.5)` | Card borders on hover |
| `--gold` | `#d4af37` | Accent, buttons, icons |
| `--gold-hover` | `#f0c93a` | Button hover state |
| `--gold-glow` | `rgba(212,175,55,0.2)` | Shadows, glows |
| `--text-primary` | `#f5f0e8` | Main text (warm cream) |
| `--text-secondary` | `#8b80a0` | Muted text |
| `--text-muted` | `#5a5070` | Very muted text |
| `--success` | `#6bffb8` | Success toasts |
| `--error` | `#ff6b6b` | Error toasts |

---

## 13. Monthly Cost Estimate

| Service | Cost |
|---------|------|
| Railway (backend) | ₹420/month |
| Claude API (at launch) | ₹2,000-5,000/month |
| Firebase (free tier) | ₹0 |
| Vercel (free tier) | ₹0 |
| Resend (free tier) | ₹0 |
| Domain renewal | ₹67/month (₹800/year) |
| **Total** | **~₹2,500-5,500/month** |

**Break-even:**
- ~60 premium users covers all costs
- OR ~50,000 daily free users (AdSense only)

---

## 14. Development Workflow

```
STITCH
  Design all 6 pages
  Export React + Tailwind code
         ↓
ANTIGRAVITY
  New Vite + React project
  Paste Stitch exports
  Install all libraries
  Add animations (GSAP + Framer Motion)
  Add Three.js particles
  Add Lenis smooth scroll
  Build Firebase auth
  Build Node.js backend
  Connect Claude API
  Add Razorpay payments
  Add AdSense ads
  Test locally
         ↓
GITHUB
  Push frontend → likhasha-frontend repo
  Push backend → likhasha-backend repo
         ↓
VERCEL + RAILWAY
  Auto-deploy on push
  Add environment variables
         ↓
OPAL
  Configure all 6 workflows
         ↓
LIKHASHA.COM 🚀 LIVE
```

---

## 15. Zustand Global State Shape

```javascript
{
  // User
  user: null,
  plan: 'free',
  dailyCount: 0,

  // Chat
  messages: [],
  isLoading: false,
  activeCategory: 'surprise',

  // Mood & Background
  activeMood: 'default',
  particleColor: '#d4af37',

  // Ads
  showAdOverlay: false,
  adCountdown: 3,

  // UI
  isMenuOpen: false,

  // Actions
  setUser, setPlan, setDailyCount,
  addMessage, setLoading, setCategory,
  setMood, showAd, hideAd,
  toggleMenu, incrementCount
}
```

---

## 16. Project Folder Structure

```
likhasha-frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── ui/
│   │   │   ├── LoadingScreen.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── AdOverlay.jsx
│   │   │   └── PageTransition.jsx
│   │   ├── three/
│   │   │   └── BackgroundParticles.jsx
│   │   ├── chat/
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── ChatBubble.jsx
│   │   │   ├── ChatInput.jsx
│   │   │   ├── CategoryChips.jsx
│   │   │   └── ActionButtons.jsx
│   │   └── home/
│   │       ├── Hero.jsx
│   │       ├── FeatureCards.jsx
│   │       ├── HowItWorks.jsx
│   │       ├── Languages.jsx
│   │       ├── LivePreview.jsx
│   │       ├── Stats.jsx
│   │       └── PricingPreview.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Generate.jsx
│   │   ├── Library.jsx
│   │   ├── Pricing.jsx
│   │   └── NotFound.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useGenerate.js
│   │   ├── useMood.js
│   │   └── useLibrary.js
│   ├── services/
│   │   ├── api.js
│   │   ├── firebase.js
│   │   └── razorpay.js
│   ├── store/
│   │   └── appStore.js
│   ├── styles/
│   │   └── index.css
│   ├── utils/
│   │   ├── detectLanguage.js
│   │   ├── detectMood.js
│   │   └── formatShare.js
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
└── tailwind.config.js

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
│   ├── services/
│   │   ├── claude.js
│   │   ├── firestore.js
│   │   ├── razorpay.js
│   │   ├── detector.js
│   │   └── email.js
│   └── app.js
├── .env
└── package.json
```
