# Backend Schema Document
## Likhasha — AI Quote & Poetry Generator

**Version:** 2.0  
**Date:** May 2026

---

## 1. Backend Overview

```
likhasha-backend/
├── src/
│   ├── routes/
│   │   ├── generate.js          # POST /api/generate
│   │   ├── library.js           # GET, DELETE /api/library
│   │   ├── save.js              # POST /api/save
│   │   ├── share.js             # POST /api/share
│   │   ├── user.js              # GET /api/user/:uid
│   │   ├── subscribe.js         # POST /api/subscribe
│   │   └── webhook.js           # POST /api/webhook/razorpay
│   ├── middleware/
│   │   ├── auth.js              # Firebase token verification
│   │   ├── rateLimit.js         # Free vs premium rate limits
│   │   └── planCheck.js         # Daily generation limit check
│   ├── services/
│   │   ├── claude.js            # Claude API wrapper
│   │   ├── firestore.js         # Firestore helpers
│   │   ├── razorpay.js          # Razorpay helpers
│   │   ├── detector.js          # Language + mood detector
│   │   └── email.js             # Resend email service
│   ├── config/
│   │   └── firebase-admin.js    # Firebase Admin SDK init
│   └── app.js                   # Express app setup
├── .env
└── package.json
```

---

## 2. Firestore Database Schema

### 2.1 `users` Collection

```
users/
  {uid}/                           ← Firebase Auth UID as document ID
    displayName:     string        "Aryan Sharma"
    email:           string        "aryan@gmail.com"
    photoURL:        string        "https://..."
    plan:            string        "free" | "premium"
    premiumExpiry:   timestamp     null (free) | Date (premium)
    dailyCount:      number        0-5 (free) | 0+ (premium, informational)
    dailyReset:      timestamp     Next midnight reset time
    totalGenerations: number       Lifetime total count
    preferredLang:   string        "en" | "hi" | "ur" | "roman"
    createdAt:       timestamp
    updatedAt:       timestamp
```

---

### 2.2 `generations` Collection

```
generations/
  {generationId}/                  ← Auto-generated Firestore ID
    uid:             string        Firebase Auth UID of creator
    content:         string        Full generated text
    type:            string        "quote" | "poem" | "shayari" | "sher" | "motivational" | "other"
    language:        string        "en" | "hi" | "ur" | "roman"
    mood:            string        "happy" | "sad" | "romantic" | "dark" | "motivational" | "neutral"
    scene:           string        Three.js scene ID used
    userInput:       string        Original user prompt
    wordCount:       number        Word count of generated content
    shared:          boolean       false (default) | true (after share)
    shareCount:      number        How many times shared
    createdAt:       timestamp
```

**Indexes:**
- `uid` + `createdAt desc` — for library fetch (user's generations, newest first)
- `uid` + `type` — for library filter by type
- `uid` + `language` — for library filter by language

---

### 2.3 `subscriptions` Collection

```
subscriptions/
  {subscriptionId}/                ← Razorpay subscription ID as document ID
    uid:               string      Firebase Auth UID
    razorpaySubId:     string      "sub_xxxxxxxxxxxx"
    razorpayOrderId:   string      "order_xxxxxxxxxxxx"
    plan:              string      "premium"
    amount:            number      99
    currency:          string      "INR"
    status:            string      "created" | "active" | "paused" | "cancelled" | "expired"
    billingCycle:      string      "monthly"
    startDate:         timestamp
    nextBilling:       timestamp
    cancelledAt:       timestamp   null (active) | Date (cancelled)
    createdAt:         timestamp
    updatedAt:         timestamp
```

---

### 2.4 `ad_events` Collection (Analytics)

```
ad_events/
  {eventId}/
    uid:          string      Firebase Auth UID
    trigger:      string      "generate" | "share"
    adSlot:       string      "ad1" | "ad2" | "ad3" | "ad4"
    skipped:      boolean     Was skip button used?
    watchedSec:   number      Seconds watched before skip
    createdAt:    timestamp
```

---

## 3. API Endpoint Schemas

### 3.1 POST `/api/generate`

**Headers:**
```
Authorization: Bearer {Firebase ID Token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "input": "ek sad shayari likho dost ki yaad mein",
  "category": "shayari",
  "language": "ur"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "generationId": "abc123xyz",
    "content": "Teri yaad aai toh...",
    "type": "shayari",
    "language": "ur",
    "mood": "sad",
    "scene": "MoonlitScene"
  }
}
```

**Response (429 — daily limit hit):**
```json
{
  "success": false,
  "error": "DAILY_LIMIT_REACHED",
  "message": "You've used all 5 free generations today.",
  "resetAt": "2026-05-08T00:00:00Z"
}
```

---

### 3.2 GET `/api/library/:uid`

**Headers:** `Authorization: Bearer {token}`

**Query Params:**
```
?type=shayari          (optional filter)
?language=ur           (optional filter)
?limit=20              (default 20 for free, 50 for premium)
?cursor={lastDocId}    (pagination cursor)
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "generations": [
      {
        "id": "abc123",
        "content": "...",
        "type": "shayari",
        "language": "ur",
        "mood": "sad",
        "createdAt": "2026-05-07T14:30:00Z"
      }
    ],
    "nextCursor": "xyz789",
    "total": 47
  }
}
```

---

### 3.3 DELETE `/api/library/:id`

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "message": "Generation deleted."
}
```

---

### 3.4 POST `/api/share`

**Request Body:**
```json
{
  "generationId": "abc123",
  "platform": "whatsapp"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "formattedContent": "Teri yaad aai toh...\n\n✨ via Likhasha",
    "shareUrl": "https://wa.me/?text=...",
    "platform": "whatsapp"
  }
}
```

---

### 3.5 POST `/api/subscribe`

**Request Body:**
```json
{
  "uid": "firebase-uid-here"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "subscriptionId": "sub_xxxxxxxxxxxx",
    "amount": 99,
    "currency": "INR",
    "razorpayKeyId": "rzp_live_xxxx"
  }
}
```

---

### 3.6 POST `/api/webhook/razorpay`

**Headers:** `x-razorpay-signature: {hmac-sha256}`

**Payload (payment success):**
```json
{
  "event": "subscription.activated",
  "payload": {
    "subscription": {
      "entity": {
        "id": "sub_xxxx",
        "notes": { "uid": "firebase-uid" },
        "current_end": 1748000000
      }
    }
  }
}
```

**Actions on events:**

| Event | Action |
|-------|--------|
| `subscription.activated` | Set `plan=premium`, set `premiumExpiry`, send confirmation email |
| `subscription.charged` | Update `nextBilling` timestamp |
| `subscription.cancelled` | Set `plan=free`, clear `premiumExpiry`, send cancellation email |
| `subscription.expired` | Set `plan=free`, send renewal reminder email |

---

### 3.7 GET `/api/user/:uid`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "uid": "abc123",
    "displayName": "Aryan",
    "plan": "free",
    "dailyCount": 3,
    "dailyLimit": 5,
    "premiumExpiry": null,
    "totalGenerations": 47
  }
}
```

---

## 4. Claude API Prompt Templates

### 4.1 Shayari (Urdu)
```
System: You are a master Urdu shayar. Write authentic, deeply emotional shayari
        in Urdu script (Nastaliq). Format: 4-6 lines. No English. No explanation.
        Just the shayari itself.

User:   {userInput}
```

### 4.2 Shayari (Roman Urdu)
```
System: You are a master shayar. Write shayari in Roman Urdu (Hinglish script).
        Format: 4-6 lines. Emotional, authentic. No explanation. Just the shayari.

User:   {userInput}
```

### 4.3 Hindi Poem
```
System: You are a Hindi poet. Write a beautiful poem in Hindi (Devanagari script).
        Format: 6-10 lines. Emotional and lyrical. No explanation. Just the poem.

User:   {userInput}
```

### 4.4 English Quote
```
System: You are a master quote writer. Write one powerful, original quote in English.
        One to three sentences maximum. No attribution. No explanation. Just the quote.

User:   {userInput}
```

### 4.5 Sher (Urdu couplet)
```
System: You are a master of Urdu sher. Write exactly one sher (2-line couplet)
        in Urdu script. Perfect meter and rhyme. No explanation. Just the sher.

User:   {userInput}
```

---

## 5. Language & Mood Detection

### 5.1 Language Detection (detector.js)

```javascript
// Uses character range detection + keyword matching
function detectLanguage(input) {
  const urduRange  = /[\u0600-\u06FF]/
  const hindiRange = /[\u0900-\u097F]/

  if (urduRange.test(input))  return 'ur'
  if (hindiRange.test(input)) return 'hi'

  const romanKeywords = ['shayari','likho','chahiye','dost','yaar','ishq','mohabbat']
  if (romanKeywords.some(k => input.toLowerCase().includes(k))) return 'roman'

  return 'en'
}
```

### 5.2 Mood Detection (detector.js)

```javascript
const moodKeywords = {
  sad:          ['sad','dukh','dard','tanha','akela','cry','lonely','missing'],
  romantic:     ['love','pyaar','mohabbat','ishq','romantic','dil','heart'],
  motivational: ['motivat','inspire','strong','himmat','strong','success'],
  dark:         ['dark','andhra','death','maut','khatam','end','broken'],
  happy:        ['happy','khush','mast','funny','joke','celebrate','mazaa']
}

function detectMood(input) {
  const lower = input.toLowerCase()
  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    if (keywords.some(k => lower.includes(k))) return mood
  }
  return 'neutral'
}
```

---

## 6. Rate Limiting Rules

```javascript
// rateLimit.js
const limits = {
  free:    { windowMs: 60 * 60 * 1000, max: 20 },   // 20 req/hour
  premium: { windowMs: 60 * 60 * 1000, max: 60 }    // 60 req/hour
}

// planCheck.js — daily generation limit
const dailyLimits = {
  free:    5,
  premium: Infinity
}
```

---

## 7. Email Templates (via Resend + Opal)

| Template | Trigger | Subject |
|----------|---------|---------|
| Welcome | New user signup | "Likhasha mein aapka swagat hai ✨" |
| Premium Activated | Subscription success | "Premium activated — Unlimited likhna shuru karo!" |
| Premium Cancelled | Subscription cancelled | "Aapka premium cancel ho gaya" |
| Renewal Reminder | 3 days before expiry | "Aapka Likhasha Premium expire hone wala hai" |
