import * as admin from 'firebase-admin';
import { env } from './env.config';
import { logger } from './logger.config';

if (!admin.apps.length) {
  try {
    let privateKey = env.FIREBASE_PRIVATE_KEY || '';
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }
    privateKey = privateKey.replace(/\\n/g, '\n');

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    });
    logger.info('Firebase Admin initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize Firebase Admin', { error });
  }
} else {
  logger.info('Firebase Admin already initialized, reusing existing instance');
}

export const db = admin.firestore();
export const auth = admin.auth();
