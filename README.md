# Likhasha (लिखाशा) — AI Creative Poetry & Verse Studio

> **"Whisper your thought. We'll write it."**  
> An AI-powered cinematic poetry and shayari generator crafting profound verses across 22 Indian scheduled languages, 13 major global languages, 28 emotional modes, and 11 classical poetic meters.

---

## ✨ Features

- 📜 **11 Classical Poetic Forms & Meters**: Free Verse Poems, Two-Line Shers, Shayari, Ghazals, Nazms, Sanskrit Shloks, Kabir Dohes, Rubaiyats, Haikus, Shakespearean Sonnets, and Marsiyas.
- 🌐 **35 Languages with Regional Accents**:
  - **22 Indian Scheduled Languages**: Hindi, Urdu, Sanskrit, Punjabi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Odia, Assamese, Maithili, Kashmiri, Sindhi, Konkani, Nepali, Bhojpuri, Marwari, Santali, and Romanized Hindi/Urdu.
  - **13 Major Global Languages**: English, Arabic, Persian (Farsi), Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, Chinese (Mandarin), and Turkish.
  - **Authentic Regional Accents & Dialects** (e.g., Awadhi, Braj Bhasha, Dakhni, Lucknowi, Lahori, Classical Sanskrit Chandas, etc.).
- 🎭 **28 Emotional Dimensions**: Ranging from Romance and Melancholy to Sufi Transcendence, Fire, Solitude, and Sacred Devotion.
- 🖼️ **4K Ultra-HD Framing & Poster Studio**: Export any verse as high-resolution typography posters formatted for wallpapers, Instagram stories, and print art.
- ⚡ **Personal Vault**: Synchronized private library to search, filter, and curate your poetic catalog.
- 💳 **Monetization & Subscriptions**: Integrated Razorpay checkout supporting UPI, cards, and netbanking for ₹99/month Likhasha Premium.

---

## 🏛️ Architecture & Tech Stack

```
Likhasha/
├── FINAL FRONTEND/         # Modern TanStack Start + React 19 + TailwindCSS + Lenis Smooth Scroll
├── likhasha-backend/       # Express + TypeScript + Firebase Firestore + Google Gemini 2.5 + Razorpay
├── .planning/              # Monetization models, roadmaps, and architectural documentation
└── README.md
```

### Frontend (`FINAL FRONTEND`)
- **Framework**: TanStack Start / React 19 / Vite
- **Styling**: Tailwind CSS + Custom Obsidian/Gold Glassmorphic Design System
- **Animation & Canvas**: Matter.js 2D Physics, Lenis Smooth Touch Scroll, HTML5 Neural Canvas
- **Authentication**: Firebase Client SDK (Email & Google Auth)

### Backend (`likhasha-backend`)
- **Server**: Express.js / TypeScript
- **AI Core**: Google Gemini API (`@google/genai`)
- **Database**: Firebase Admin / Cloud Firestore
- **Payments**: Razorpay Node SDK (Subscription API + Webhook signature verification)
- **Live Production API**: [https://likhasha-backend.vercel.app](https://likhasha-backend.vercel.app)


---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or v20+)
- npm or pnpm

### 2. Backend Setup
```bash
cd likhasha-backend
cp .env.example .env
# Fill in your GEMINI API key, Firebase service credentials, and Razorpay keys
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd "FINAL FRONTEND"
cp .env.example .env
# Fill in your Firebase public credentials and Razorpay test key ID
npm install
npm run dev
```

Visit `http://localhost:5000` to launch the studio.

---

## 📄 License
Private repository © Likhasha. All rights reserved.
