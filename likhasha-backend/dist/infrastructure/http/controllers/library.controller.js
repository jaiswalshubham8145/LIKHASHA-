"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGeneration = exports.saveGeneration = exports.getLibrary = void 0;
const zod_1 = require("zod");
const firestore_repository_1 = require("../../database/firestore.repository");
const errors_1 = require("../../../domain/errors");
// ─── Fetch library ────────────────────────────────────────────────────────────
const getLibrary = async (req, res) => {
    const uid = req.user.uid;
    const querySchema = zod_1.z.object({
        type: zod_1.z.string().optional(),
        language: zod_1.z.string().optional(),
        limit: zod_1.z.coerce.number().min(1).max(100).default(20),
        cursor: zod_1.z.string().optional(),
    });
    const query = querySchema.parse(req.query);
    const user = await firestore_repository_1.dbRepository.getUser(uid);
    const maxLimit = user?.plan === 'premium' ? 50 : 7;
    const limit = Math.min(query.limit, maxLimit);
    const { generations, nextCursor } = await firestore_repository_1.dbRepository.getGenerations(uid, { type: query.type, language: query.language }, limit, query.cursor);
    res.status(200).json({
        success: true,
        data: {
            generations,
            nextCursor,
            total: user?.totalGenerations || 0,
        },
    });
};
exports.getLibrary = getLibrary;
// ─── Save a generation (explicit "Save" button) ───────────────────────────────
const saveSchema = zod_1.z.object({
    content: zod_1.z.string().min(1).max(5000),
    type: zod_1.z.string().min(1),
    language: zod_1.z.string().min(1),
    mood: zod_1.z.string().default('neutral'),
    userInput: zod_1.z.string().max(500).default(''),
});
const saveGeneration = async (req, res) => {
    const uid = req.user.uid;
    const parsed = saveSchema.parse(req.body);
    const user = await firestore_repository_1.dbRepository.getUser(uid);
    if (!user) {
        throw new errors_1.AppError('User not found', 404, 'USER_NOT_FOUND');
    }
    // Free users limited to 7 saved verses
    if (user.plan === 'free') {
        const { generations } = await firestore_repository_1.dbRepository.getGenerations(uid, {}, 8);
        if (generations.length >= 7) {
            throw new errors_1.AppError('Free plan allows up to 7 saved verses. Upgrade to Premium for unlimited storage.', 403, 'SAVE_LIMIT_REACHED');
        }
    }
    const generationId = await firestore_repository_1.dbRepository.saveGeneration({
        uid,
        content: parsed.content,
        type: parsed.type,
        language: parsed.language,
        mood: parsed.mood,
        scene: 'AbstractParticlesScene',
        userInput: parsed.userInput,
        wordCount: parsed.content.split(/\s+/).length,
        shared: false,
        shareCount: 0,
        createdAt: new Date(),
    });
    res.status(201).json({
        success: true,
        data: { generationId },
    });
};
exports.saveGeneration = saveGeneration;
// ─── Delete a generation ─────────────────────────────────────────────────────
const deleteGeneration = async (req, res) => {
    const uid = req.user.uid;
    const { id } = req.params;
    await firestore_repository_1.dbRepository.deleteGeneration(id, uid);
    res.status(200).json({
        success: true,
        message: 'Generation deleted.',
    });
};
exports.deleteGeneration = deleteGeneration;
