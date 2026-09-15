import { db } from '../../config/firebase.config';
import { AppError } from '../../domain/errors';
import * as admin from 'firebase-admin';

export interface UserDoc {
  displayName: string;
  email: string;
  photoURL?: string;
  plan: 'free' | 'premium';
  premiumExpiry: Date | null;
  dailyCount: number;
  dailyReset: Date;
  totalGenerations: number;
  preferredLang: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GenerationDoc {
  id?: string;
  uid: string;
  content: string;
  type: string;
  language: string;
  mood: string;
  scene: string;
  userInput: string;
  wordCount: number;
  shared: boolean;
  shareCount: number;
  createdAt: Date;
}

export class FirestoreRepository {
  private usersCollection = db.collection('users');
  private generationsCollection = db.collection('generations');

  async getUser(uid: string): Promise<UserDoc | null> {
    const doc = await this.usersCollection.doc(uid).get();
    if (!doc.exists) return null;

    const data = doc.data() as Omit<UserDoc, 'premiumExpiry' | 'dailyReset' | 'createdAt' | 'updatedAt'> & {
      premiumExpiry: admin.firestore.Timestamp | null;
      dailyReset: admin.firestore.Timestamp;
      createdAt: admin.firestore.Timestamp;
      updatedAt: admin.firestore.Timestamp;
    };

    return {
      ...data,
      premiumExpiry: data.premiumExpiry?.toDate() || null,
      dailyReset: data.dailyReset.toDate(),
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    };
  }

  async createUser(uid: string, data: Partial<UserDoc>): Promise<void> {
    const now = admin.firestore.FieldValue.serverTimestamp();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const defaultUser = {
      plan: 'free',
      premiumExpiry: null,
      dailyCount: 0,
      dailyReset: admin.firestore.Timestamp.fromDate(tomorrow),
      totalGenerations: 0,
      preferredLang: 'en',
      createdAt: now,
      updatedAt: now,
      ...data,
    };

    await this.usersCollection.doc(uid).set(defaultUser, { merge: true });
  }

  async incrementDailyCount(uid: string): Promise<void> {
    const userRef = this.usersCollection.doc(uid);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }

      const userData = userDoc.data();
      const currentReset = userData?.dailyReset?.toDate();
      const now = new Date();

      let resetData = {};
      if (currentReset && currentReset <= now) {
        resetData = {
          dailyCount: 1,
          dailyReset: admin.firestore.Timestamp.fromDate(tomorrow),
        };
      } else {
        resetData = {
          dailyCount: admin.firestore.FieldValue.increment(1),
        };
      }

      transaction.update(userRef, {
        ...resetData,
        totalGenerations: admin.firestore.FieldValue.increment(1),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });
  }

  async isPremiumExpired(uid: string): Promise<boolean> {
    const user = await this.getUser(uid);
    if (!user || user.plan !== 'premium') return false;
    if (!user.premiumExpiry) return false;
    return user.premiumExpiry < new Date();
  }

  async saveGeneration(data: GenerationDoc): Promise<string> {
    const docRef = this.generationsCollection.doc();
    const generationData = {
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await docRef.set(generationData);
    return docRef.id;
  }

  async getGenerations(uid: string, filters: { type?: string; language?: string }, limit: number, cursor?: string) {
    let query: admin.firestore.Query = this.generationsCollection
      .where('uid', '==', uid)
      .limit(limit);

    if (filters.type) {
      query = query.where('type', '==', filters.type);
    }
    if (filters.language) {
      query = query.where('language', '==', filters.language);
    }

    if (cursor) {
      const cursorDoc = await this.generationsCollection.doc(cursor).get();
      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc);
      }
    }

    const snapshot = await query.get();
    const generations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as admin.firestore.Timestamp).toDate()
    }));

    generations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const nextCursor = snapshot.docs.length === limit ? generations[generations.length - 1].id : null;

    return { generations, nextCursor };
  }

  async deleteGeneration(id: string, uid: string): Promise<void> {
    const doc = await this.generationsCollection.doc(id).get();
    if (!doc.exists) {
      throw new AppError('Generation not found', 404, 'NOT_FOUND');
    }
    if (doc.data()?.uid !== uid) {
      throw new AppError('Forbidden', 403, 'FORBIDDEN');
    }
    await this.generationsCollection.doc(id).delete();
  }
}

export const dbRepository = new FirestoreRepository();
