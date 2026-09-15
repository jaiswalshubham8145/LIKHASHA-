# App Flow Document
## Likhasha — AI Quote & Poetry Generator

**Version:** 2.0  
**Date:** May 2026

---

## 1. High-Level User Journey

```
Open Likhasha
      │
      ▼
Landing Page (4 cycling 3D environments)
      │
      ▼
Login / Signup
      │
      ▼
Chat Interface ──────────────────────────────────────┐
      │                                               │
      ▼                                               │
User types input                                      │
      │                                               │
      ▼                                               │
Free user?                                            │
  ├── Yes → Check daily limit (5/day)                 │
  │         Limit hit? → Show upgrade prompt          │
  │         Limit OK? → Continue                      │
  └── Premium → Skip limit check → Continue           │
      │                                               │
      ▼                                               │
Free user → AD #1 + AD #2 (3 sec)                    │
Premium user → No ads                                 │
      │                                               │
      ▼                                               │
Opal calls Claude API                                 │
      │                                               │
      ▼                                               │
3D scene switches to detected mood                    │
      │                                               │
      ▼                                               │
Content appears in chat bubble                        │
      │                                               │
      ▼                                               │
Auto-saved to Library                                 │
      │                                               │
   ┌──┴──────────────┬──────────────┐                │
   ▼                 ▼              ▼                 │
 Copy             Share         Regenerate ───────────┘
                   │
          AD #3+AD#4 (free users)
                   │
           Platform selected
                   │
            Content shared
```

---

## 2. Screen-by-Screen Flow

### 2.1 Landing Page (`/`)

**3D Environment:** Cycles through all 4 scenes every 8 seconds

```
Scene 1: Dark Space (stars + nebula)
    ↓ dissolve (1 sec)
Scene 2: Deep Ocean (bioluminescent waves)
    ↓ dissolve (1 sec)
Scene 3: Abstract Geometric (neon shapes + grid)
    ↓ dissolve (1 sec)
Scene 4: Night Sky (moonlit clouds + aurora)
    ↓ dissolve (1 sec)
    → loops back to Scene 1
```

**UI Elements:**
- Likhasha logo (gold, floating)
- Tagline: *"Har lafz ek nasha"* (fade-in animation)
- CTA: "Start Writing" button (gold glow pulse)
- Language selector: EN / HI / UR
- Brief feature highlights (animated cards)
- "Already have an account? Login" link

---

### 2.2 Login / Signup Page (`/login`)

```
Arrive at /login
    │
    ├── Already logged in? ──► Redirect to /chat
    │
    ├── "Continue with Google" ──► Firebase Google OAuth
    │         │
    │         ▼
    │    New user? ──► Create Firestore doc (free plan) ──► /chat
    │    Existing? ─────────────────────────────────────► /chat
    │
    └── Email + Password ──► Firebase Email Auth
              │
         New user? ──► Create Firestore doc ──► /chat
         Existing? ──────────────────────────► /chat
```

**Design:** Glassmorphism card, deep purple bg, gold accents, 3D DefaultScene in background

---

### 2.3 Chat Page (`/chat`) — Core Experience

**Layout:**
- Full-screen 3D background (mood-reactive, switches per response)
- Frosted glass chat area (center, max 720px wide)
- Category selector bar (scrollable horizontal chips)
- Input bar pinned to bottom (gold border on focus)
- Header: Likhasha logo + Library icon + Profile avatar

**Flow:**

```
Page loads
    │
    ▼
DefaultScene (CosmosScene) active — purple nebula + gold orbs
    │
    ▼
Welcome bubble: "Kya likhna chahte ho aaj? ✨"
    │
    ▼
User selects category (optional chips):
[ Quote ] [ Poem ] [ Shayari ] [ Sher ] [ Motivational ] [ Surprise ]
    │
    ▼
User types: e.g. "ek romantic shayari likho"
    │
    ▼
User hits Send
    │
    ├── Free user daily limit check
    │       Limit hit → upgrade modal shown
    │       Limit OK → continue
    │
    ▼
FREE USER:
┌─────────────────────────────────────────┐
│  AD #1 + AD #2 overlay                  │
│  Gold countdown timer: 3... 2... 1...   │
│  [Skip Ad] appears after 3 sec          │
└─────────────────────────────────────────┘
PREMIUM USER: No ad overlay, instant

    │
    ▼
Loading: Typing dots in gold color in chat bubble
    │
    ▼
AI response arrives:
  Detected → language: Urdu, type: shayari, mood: romantic
    │
    ▼
3D scene switches → PetalScene
  (rose petals + pink bokeh, 600ms dissolve)
    │
    ▼
Shayari appears in chat bubble (Nastaliq Urdu font)
Framer Motion: slide up + fade in
    │
    ▼
FREE USER: AdBanner shown below bubble
PREMIUM USER: Clean result, no banner
    │
    ▼
Action buttons appear:
[ 📋 Copy ] [ 🔗 Share ] [ 🔁 Regenerate ] [ 💾 Saved ✓ ]
    │
    ▼
User types next input → full cycle repeats
```

---

### 2.4 Social Share Flow

```
User clicks [ Share ]
    │
    ▼
Platform picker appears (bottom sheet on mobile):
[ WhatsApp ] [ Instagram ] [ Twitter/X ] [ Copy Link ]
    │
    ▼
FREE USER:
┌─────────────────────────────────────────┐
│  AD #3 + AD #4 overlay                  │
│  Gold countdown: 3... 2... 1...         │
└─────────────────────────────────────────┘
PREMIUM USER: Direct to share, no ads

    │
    ▼
Content formatted per platform:
  WhatsApp  → plain text + emoji + "via Likhasha"
  Instagram → text + hashtags (copy to clipboard)
  Twitter/X → 280 char trim + hashtags
    │
    ▼
Native share sheet opens / deep link fires
    │
    ▼
Success toast: "Shared successfully! ✨"
```

---

### 2.5 Library Page (`/library`)

```
/library loads
    │
    ▼
Firestore fetch: all user generations (newest first)
    │
    ▼
Filter tabs:
[ All ] [ Quotes ] [ Poems ] [ Shayari ] [ Sher ] [ Motivational ]
    │
    ▼
FREE USER: Shows last 20 saves + upgrade prompt banner
PREMIUM USER: All saves, unlimited scroll
    │
    ▼
Each card shows:
  ┌──────────────────────────────────────────┐
  │  [Type badge]  [Language badge]  [Date]  │
  │                                          │
  │  Content preview (2-3 lines)             │
  │                                          │
  │  [ Copy ]  [ Share ]  [ Delete ]         │
  └──────────────────────────────────────────┘
    │
    ▼
Share → triggers Share Flow (AD#3+AD#4 for free users)
Delete → Firestore delete + remove from UI
```

---

### 2.6 Premium Upgrade Page (`/premium`)

```
/premium loads
    │
    ▼
Animated page (gold particles background)
    │
    ▼
Plan comparison:
  Free vs Likhasha Premium ₹99/month
    │
    ▼
User clicks "Upgrade to Premium"
    │
    ▼
Razorpay checkout opens (₹99/month subscription)
    │
    ├── Payment success
    │       → Opal webhook triggers
    │       → Firestore updated: plan = "premium"
    │       → Confirmation email sent
    │       → Redirect to /chat with success toast
    │
    └── Payment failed
            → Error toast
            → Stay on /premium
```

---

### 2.7 Profile Page (`/profile`)

- Display name + email
- Current plan badge (Free / Premium)
- Manage subscription (cancel)
- Total generations count
- Preferred language setting
- Logout button

---

## 3. Ad Trigger Summary

| User | Event | Ads |
|------|-------|-----|
| Free | Generate | AD #1 + AD #2 (3 sec overlay) |
| Free | Share | AD #3 + AD #4 (3 sec overlay) |
| Premium | Generate | None |
| Premium | Share | None |

---

## 4. Error States

| Scenario | Handling |
|----------|----------|
| Daily limit hit (free) | Modal: "You've used all 5 today — upgrade for unlimited" |
| Claude API timeout | Retry once → error bubble in chat |
| Not logged in (direct URL) | Redirect to `/login` |
| Network offline | Toast: "Check your connection" |
| Payment failed | Error toast + stay on /premium |
| Empty input | Input shake animation + hint text |
| Firestore save fail | Silent retry × 2, then toast |
