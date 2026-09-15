# Monetization Strategy Document
## Likhasha — AI Quote & Poetry Generator

**Version:** 2.0  
**Date:** May 2026

---

## 1. Revenue Streams

| Stream | Model | Users | Timeline |
|--------|-------|-------|---------|
| Google AdSense | RPM-based display ads | Free users | Month 1+ |
| Likhasha Premium | ₹99/month subscription | Power users | Month 1+ |
| Sponsored content | Brand-paid quote packs | All users | Month 4+ |
| Likhasha API | Usage-based API access | Developers | Month 6+ |

---

## 2. Free vs Premium Plan

| Feature | Free | Premium ₹99/month |
|---------|------|-------------------|
| Generations per day | 3 | Unlimited |
| Languages & Dialects | Only 7 Indian languages (no global) | All 35 languages (22 Indian + 13 Global + Accents) |
| Content types | Only 7 moods and 4 poetic forms | All 28 moods + All 11 poetic forms & meters |
| Library saves | Last 7 | Unlimited |
| Ads | Yes (4 total) | None (100% Ad-Free) |
| 3D scenes | Standard | Standard + exclusive premium scenes |
| Priority AI | No | Yes (faster response) |
| Download as image | No | Yes |
| Early access features | No | Yes |

---

## 3. Ad Strategy — Google AdSense

### 3.1 Ad Trigger Points

**Trigger 1 — Content Generation (Free users only)**

```
User clicks Generate
    ↓
AD #1 + AD #2 shown as overlay
Gold countdown: 3... 2... 1...
[Skip Ad] button appears after 3 seconds
    ↓
AI generation begins
```

**Trigger 2 — Social Share (Free users only)**

```
User clicks Share
    ↓
AD #3 + AD #4 shown as overlay
Gold countdown: 3... 2... 1...
    ↓
Share executes
```

### 3.2 Ad Formats

| Slot | Format | Placement |
|------|--------|-----------|
| AD #1 | 300x250 display | Left half of overlay |
| AD #2 | 300x250 display | Right half of overlay |
| AD #3 | 300x250 display | Left half of share overlay |
| AD #4 | 300x250 display | Right half of share overlay |
| AD Banner | Responsive banner | Below generated content bubble |

### 3.3 India AdSense RPM Estimates

| Daily Users | Daily Page Views | Est. Daily Revenue | Est. Monthly |
|------------|-----------------|-------------------|-------------|
| 500 | 1,500 | ₹75 — ₹225 | ₹2,250 — ₹6,750 |
| 2,000 | 6,000 | ₹300 — ₹900 | ₹9,000 — ₹27,000 |
| 10,000 | 30,000 | ₹1,500 — ₹4,500 | ₹45,000 — ₹1,35,000 |
| 50,000 | 1,50,000 | ₹7,500 — ₹22,500 | ₹2,25,000 — ₹6,75,000 |

*RPM estimate: ₹50 — ₹150 per 1,000 views (India average)*

---

## 4. Premium Subscription — ₹99/month

### 4.1 Payment Flow

```
User hits daily limit OR visits /premium
    ↓
Upgrade modal shown (feature comparison)
    ↓
User clicks "Upgrade to Premium"
    ↓
Razorpay checkout opens
  → UPI / Cards / Net Banking / Wallets
    ↓
Payment success
    ↓
Razorpay webhook  → Firebase update
  user.plan = "premium"
  user.premiumExpiry = +30 days
    ↓
Confirmation email sent
    ↓
Ads removed immediately
Unlimited generations unlocked
```

### 4.2 Subscription Revenue Projections

| Premium Users | Monthly Revenue | Annual Revenue |
|--------------|----------------|---------------|
| 100 | ₹9,900 | ₹1,18,800 |
| 500 | ₹49,500 | ₹5,94,000 |
| 1,000 | ₹99,000 | ₹11,88,000 |
| 5,000 | ₹4,95,000 | ₹59,40,000 |
| 10,000 | ₹9,90,000 | ₹1,18,80,000 |

### 4.3 Conversion Strategy

| Trigger | Action |
|---------|--------|
| Daily limit hit | Upgrade modal with "Only ₹99/month" |
| After 3rd generation | Subtle banner: "Go Premium — No ads, unlimited writing" |
| Library full ( 7saves) | Prompt: "Upgrade to save unlimited generations" |
| Share action | "Premium users share without ads" message |

---

## 5. Combined Revenue Model

### Month-by-Month Realistic Target

| Month | DAU | Free Users | Premium Users | Ad Revenue | Sub Revenue | Total |
|-------|-----|-----------|--------------|-----------|------------|-------|
| 1 | 500 | 490 | 10 | ₹3,000 | ₹990 | ₹3,990 |
| 2 | 1,500 | 1,450 | 50 | ₹9,000 | ₹4,950 | ₹13,950 |
| 3 | 3,000 | 2,800 | 200 | ₹18,000 | ₹19,800 | ₹37,800 |
| 4 | 6,000 | 5,500 | 500 | ₹36,000 | ₹49,500 | ₹85,500 |
| 6 | 15,000 | 13,500 | 1,500 | ₹90,000 | ₹1,48,500 | ₹2,38,500 |
| 12 | 50,000 | 45,000 | 5,000 | ₹3,00,000 | ₹4,95,000 | ₹7,95,000 |

---

## 6. Monthly Cost vs Revenue

| Item | Monthly Cost |
|------|-------------|
| 
| vercel function (backend) |  |
| Razorpay fees (2%) | ~₹2/transaction |
| Resend email | Free at launch |
| Vercel | Free at launch |
| **Total costs** | **~₹4,000 — ₹9,000/month** |

**Break-even:** ~100 premium users OR ~20,000 daily free users (ads only)

---

## 7. Growth Strategy

| Channel | Tactic |
|---------|--------|
| Instagram / Reels | Post generated shayari with Likhasha watermark |
| WhatsApp | Every share includes "via Likhasha" + link |
| SEO | Target: "shayari generator", "quote generator hindi", "urdu poem AI" |
| Product Hunt | Launch on Product Hunt for global visibility |
| Influencers | Poetry/shayari creators on Instagram + YouTube |
| Word of mouth | Beautiful output cards naturally shared = organic growth |
