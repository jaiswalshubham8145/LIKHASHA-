import * as admin from 'firebase-admin';
import { env } from './env.config';
import { logger } from './logger.config';

let isFirebaseInitialized = false;

function initFirebase(): boolean {
  if (admin.apps.length > 0) {
    isFirebaseInitialized = true;
    return true;
  }

  try {
    let privateKey = env.FIREBASE_PRIVATE_KEY || '';
    const projectId = env.FIREBASE_PROJECT_ID;
    const clientEmail = env.FIREBASE_CLIENT_EMAIL;

    if (!privateKey || !projectId || !clientEmail) {
      logger.warn('⚠️ Firebase credentials missing or incomplete. Firestore & Auth operations will be offline.');
      return false;
    }

    // Strip leading/trailing double or single quotes added by some .env copy-pastes
    if ((privateKey.startsWith('"') && privateKey.endsWith('"')) || (privateKey.startsWith("'") && privateKey.endsWith("'"))) {
      privateKey = privateKey.slice(1, -1);
    }
    // Replace escaped \n with true newlines
    privateKey = privateKey.replace(/\\n/g, '\n');

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    isFirebaseInitialized = true;
    logger.info('Firebase Admin initialized successfully');
    return true;
  } catch (error) {
    logger.error('Failed to initialize Firebase Admin', { error });
    return false;
  }
}

// Attempt initial boot
initFirebase();

// Lazy accessor helpers
export const getDb = (): admin.firestore.Firestore => {
  if (!isFirebaseInitialized && admin.apps.length === 0) {
    initFirebase();
  }
  if (admin.apps.length === 0) {
    throw new Error('Firebase Admin is not configured. Please check FIREBASE_* environment variables on Vercel.');
  }
  return admin.firestore();
};

export const getAuth = (): admin.auth.Auth => {
  if (!isFirebaseInitialized && admin.apps.length === 0) {
    initFirebase();
  }
  if (admin.apps.length === 0) {
    throw new Error('Firebase Admin is not configured. Please check FIREBASE_* environment variables on Vercel.');
  }
  return admin.auth();
};

// Proxies allow existing db.collection(...) and auth.verifyIdToken(...) to work without crashes during import
export const db: admin.firestore.Firestore = new Proxy({} as admin.firestore.Firestore, {
  get(_target, prop) {
    const firestore = getDb();
    const val = (firestore as any)[prop];
    return typeof val === 'function' ? val.bind(firestore) : val;
  }
});

export const auth: admin.auth.Auth = new Proxy({} as admin.auth.Auth, {
  get(_target, prop) {
    const authInstance = getAuth();
    const val = (authInstance as any)[prop];
    return typeof val === 'function' ? val.bind(authInstance) : val;
  }
});

