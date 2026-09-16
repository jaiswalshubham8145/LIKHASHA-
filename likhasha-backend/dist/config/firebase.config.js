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
exports.auth = exports.db = exports.getAuth = exports.getDb = void 0;
const admin = __importStar(require("firebase-admin"));
const env_config_1 = require("./env.config");
const logger_config_1 = require("./logger.config");
let isFirebaseInitialized = false;
function initFirebase() {
    if (admin.apps.length > 0) {
        isFirebaseInitialized = true;
        return true;
    }
    try {
        let privateKey = env_config_1.env.FIREBASE_PRIVATE_KEY || '';
        const projectId = env_config_1.env.FIREBASE_PROJECT_ID;
        const clientEmail = env_config_1.env.FIREBASE_CLIENT_EMAIL;
        if (!privateKey || !projectId || !clientEmail) {
            logger_config_1.logger.warn('⚠️ Firebase credentials missing or incomplete. Firestore & Auth operations will be offline.');
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
        logger_config_1.logger.info('Firebase Admin initialized successfully');
        return true;
    }
    catch (error) {
        logger_config_1.logger.error('Failed to initialize Firebase Admin', { error });
        return false;
    }
}
// Attempt initial boot
initFirebase();
// Lazy accessor helpers
const getDb = () => {
    if (!isFirebaseInitialized && admin.apps.length === 0) {
        initFirebase();
    }
    if (admin.apps.length === 0) {
        throw new Error('Firebase Admin is not configured. Please check FIREBASE_* environment variables on Vercel.');
    }
    return admin.firestore();
};
exports.getDb = getDb;
const getAuth = () => {
    if (!isFirebaseInitialized && admin.apps.length === 0) {
        initFirebase();
    }
    if (admin.apps.length === 0) {
        throw new Error('Firebase Admin is not configured. Please check FIREBASE_* environment variables on Vercel.');
    }
    return admin.auth();
};
exports.getAuth = getAuth;
// Proxies allow existing db.collection(...) and auth.verifyIdToken(...) to work without crashes during import
exports.db = new Proxy({}, {
    get(_target, prop) {
        const firestore = (0, exports.getDb)();
        const val = firestore[prop];
        return typeof val === 'function' ? val.bind(firestore) : val;
    }
});
exports.auth = new Proxy({}, {
    get(_target, prop) {
        const authInstance = (0, exports.getAuth)();
        const val = authInstance[prop];
        return typeof val === 'function' ? val.bind(authInstance) : val;
    }
});
