import * as admin from 'firebase-admin';
import { env } from './env.config';
import { logger } from './logger.config';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    logger.info('Firebase Admin initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize Firebase Admin', { error });
    process.exit(1);
  }
} else {
  logger.info('Firebase Admin already initialized, reusing existing instance');
}

export const db = admin.firestore();
export const auth = admin.auth();
