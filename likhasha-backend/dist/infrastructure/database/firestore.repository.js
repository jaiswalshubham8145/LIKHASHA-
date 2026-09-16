"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbRepository = exports.FirestoreRepository = void 0;
const firebase_config_1 = require("../../config/firebase.config");
const errors_1 = require("../../domain/errors");
const admin = __importStar(require("firebase-admin"));
class FirestoreRepository {
    get usersCollection() {
        return firebase_config_1.db.collection('users');
    }
    get generationsCollection() {
        return firebase_config_1.db.collection('generations');
    }
    async getUser(uid) {
        const doc = await this.usersCollection.doc(uid).get();
        if (!doc.exists)
            return null;
        const data = doc.data();
        return {
            ...data,
            premiumExpiry: data.premiumExpiry?.toDate() || null,
            dailyReset: data.dailyReset.toDate(),
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
        };
    }
    async createUser(uid, data) {
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
    async incrementDailyCount(uid) {
        const userRef = this.usersCollection.doc(uid);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        await firebase_config_1.db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists) {
                throw new errors_1.AppError('User not found', 404, 'USER_NOT_FOUND');
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
            }
            else {
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
    async isPremiumExpired(uid) {
        const user = await this.getUser(uid);
        if (!user || user.plan !== 'premium')
            return false;
        if (!user.premiumExpiry)
            return false;
        return user.premiumExpiry < new Date();
    }
    async saveGeneration(data) {
        const docRef = this.generationsCollection.doc();
        const generationData = {
            ...data,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        await docRef.set(generationData);
        return docRef.id;
    }
    async getGenerations(uid, filters, limit, cursor) {
        let query = this.generationsCollection
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
            createdAt: doc.data().createdAt.toDate()
        }));
        generations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        const nextCursor = snapshot.docs.length === limit ? generations[generations.length - 1].id : null;
        return { generations, nextCursor };
    }
    async deleteGeneration(id, uid) {
        const doc = await this.generationsCollection.doc(id).get();
        if (!doc.exists) {
            throw new errors_1.AppError('Generation not found', 404, 'NOT_FOUND');
        }
        if (doc.data()?.uid !== uid) {
            throw new errors_1.AppError('Forbidden', 403, 'FORBIDDEN');
        }
        await this.generationsCollection.doc(id).delete();
    }
}
exports.FirestoreRepository = FirestoreRepository;
exports.dbRepository = new FirestoreRepository();
