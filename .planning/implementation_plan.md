# Likhasha v1.0 — Monetization & Backend Implementation Plan

This plan outlines the technical steps to implement the core monetization and backend features outlined in the PRD, including Razorpay payments, Google AdSense, Firebase Authentication, and Database limits.

---

## User Review Required

> [!IMPORTANT]
> **Firebase Setup & AdSense Account:** 
> - To proceed, we will need a Firebase Project to set up Authentication and Firestore. If you haven't created one, I will provide instructions to create it and get the `serviceAccountKey.json`.
> - For Google AdSense, the domain (`likhasha.com`) needs to be approved. We can implement the frontend overlay logic now with test/dummy ad blocks, so it's ready when the account is approved.
> - **Razorpay Test Keys:** We will initially use Razorpay Test API keys to test the subscription flow safely.

---

## Open Questions

> [!WARNING]
> 1. **User Login Flow:** Currently, is there a preference between forcing users to log in immediately upon visiting the site, or allowing them to explore the UI and only forcing login when they click "Generate"?
> 2. **Library Save Limit:** The PRD says "Last 20 saves" for free users. Should older saves be automatically deleted when they hit 21, or should we block saving until they upgrade?

---

## Proposed Changes

### 1. Database & Authentication Setup (Backend)

*Setting up Firebase Admin and user/library routes in the Express backend.*

#### [NEW] `likhasha-backend/src/config/firebase-admin.ts`
- Initialize Firebase Admin SDK using a service account key.

#### [NEW] `likhasha-backend/src/infrastructure/http/middlewares/auth.middleware.ts`
- Create a middleware that intercepts `Authorization: Bearer <token>` and uses `firebase-admin` to verify the ID token. Attaches `req.user` to the request.

#### [NEW] `likhasha-backend/src/infrastructure/http/middlewares/planCheck.middleware.ts`
- Create a middleware for the `/generate` endpoint. It checks Firestore for the user's `dailyCount`. If the user is on the `free` plan and has reached the limit of 5, it returns a 429 error.

#### [NEW] `likhasha-backend/src/infrastructure/http/routes/user.routes.ts`
#### [NEW] `likhasha-backend/src/infrastructure/http/routes/library.routes.ts`
- **GET `/api/user/me`**: Fetch current plan, `dailyCount`, and `premiumExpiry`.
- **GET `/api/library`**: Fetch user's saved generations from Firestore.
- **POST `/api/library`**: Save a generated text to Firestore.
- **DELETE `/api/library/:id`**: Delete a saved generation.

### 2. Payment Gateway & Webhooks (Backend)

*Implementing Razorpay subscriptions for the ₹99/month Premium plan.*

#### [NEW] `likhasha-backend/src/services/razorpay.service.ts`
- Initialize the Razorpay SDK.
- Add `createSubscription(planId)` to generate a subscription link/ID.

#### [NEW] `likhasha-backend/src/infrastructure/http/routes/payment.routes.ts`
- **POST `/api/subscribe`**: Returns a Razorpay `subscription_id` to the frontend.
- **POST `/api/webhook/razorpay`**: A webhook endpoint that listens for `subscription.activated` and `subscription.cancelled`. It will securely verify the Razorpay signature, then update the Firestore `users` collection to set `plan: 'premium'` or `'free'`.

### 3. Frontend Authentication & State

*Connecting the React frontend to Firebase Auth and storing user state.*

#### [NEW] `likhasha-frontend/src/services/firebase.ts`
- Initialize Firebase client SDK (Auth, Firestore).
- Implement Google OAuth login and Email/Password login.

#### [MODIFY] `likhasha-frontend/src/store/appStore.ts`
- Add Zustand state for `user` (uid, displayName), `plan` (free/premium), and `dailyLimit`.

#### [MODIFY] `likhasha-frontend/src/components/Nav.tsx`
- Add a "Login" button if logged out.
- Show a User Dropdown / Profile icon if logged in, displaying their remaining daily generations.

### 4. Monetization — Ads & Subscription Checkout (Frontend)

*Implementing the Ad overlay for free users and the Razorpay payment window.*

#### [NEW] `likhasha-frontend/src/components/ui/AdOverlay.tsx`
- A full-screen glassmorphic overlay component.
- Shows 2 Google AdSense blocks (or placeholder blocks for now).
- Features a 3-second countdown timer. After 3 seconds, a "Skip Ad & Generate" button appears.

#### [MODIFY] `likhasha-frontend/src/pages/Generate.tsx`
- Before calling the backend API to generate text, check if `plan === 'free'`.
- If free, trigger `AdOverlay` first. Once skipped, call the API.
- If the API returns 429 (Daily limit reached), show an elegant modal asking them to "Upgrade to Premium for ₹99/month".

#### [MODIFY] `likhasha-frontend/src/pages/Pricing.tsx`
- Hook up the "Upgrade" buttons. When clicked, call `/api/subscribe`, then use the Razorpay Checkout script (`window.Razorpay`) to open the payment modal.
- On success, redirect to `/generate` and show a "Premium Activated" success toast.

---

## Verification Plan

### Automated Tests
- Run `npm run typecheck` and `npm run lint` in both frontend and backend directories.

### Manual Verification
1. **Authentication Flow:** Click "Login with Google", verify the user is logged in, and their profile is created in Firestore.
2. **Free Plan Limits:** Generate 5 poems as a free user. Verify the 6th attempt is blocked.
3. **Ad Experience:** Ensure the Ad Overlay appears for exactly 3 seconds before generation for free users.
4. **Razorpay Checkout:** Test the upgrade flow using Razorpay test mode. Pay ₹99 using test cards, wait for the webhook, and verify the user's plan instantly changes to `premium` and ads disappear.
