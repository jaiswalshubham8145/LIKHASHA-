"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateContent = void 0;
const zod_1 = require("zod");
const gemini_service_1 = require("../../services/gemini.service");
const detector_service_1 = require("../../services/detector.service");
const firestore_repository_1 = require("../../database/firestore.repository");
const errors_1 = require("../../../domain/errors");
const ALL_CONTENT_TYPES = [
    'quote', 'poem', 'shayari', 'sher', 'motivational',
    'shlok', 'dohe', 'nazm', 'ghazal', 'marsiya', 'rubaiyat', 'haiku', 'sonnet', 'other', 'surprise',
];
const ALL_LANGUAGES = [
    'en', 'hi', 'ur', 'roman', 'sa', 'ta', 'te', 'bn', 'mr', 'gu', 'kn', 'ml', 'pa',
    'or', 'as', 'mai', 'ks', 'sd', 'kok', 'ne', 'bho', 'mwr', 'sat',
    'ar', 'fa', 'es', 'fr', 'ja', 'ko', 'pt', 'de', 'it', 'zh', 'ru', 'tr',
];
// Free tier: exactly 4 poetic forms (+ raw fallbacks)
const FREE_CONTENT_TYPES = ['poem', 'shayari', 'sher', 'haiku', 'quote', 'other', 'surprise'];
// Free tier: exactly 7 Indian languages (no global languages)
const FREE_LANGUAGES = ['hi', 'ur', 'roman', 'sa', 'pa', 'bn', 'ta'];
// Free tier: exactly 7 moods
const FREE_MOODS = ['romantic', 'sad', 'motivational', 'spiritual', 'happy', 'nostalgic', 'hope'];
const MOODS = [
    'romantic', 'sad', 'motivational', 'spiritual', 'dark', 'happy',
    'nostalgic', 'hope', 'loneliness', 'gratitude', 'philosophical', 'nature',
    'anger', 'mystical', 'devotion', 'wonder', 'triumph', 'compassion',
    'rebellion', 'wanderlust', 'sensual', 'rain', 'destiny', 'irony',
    'ecstasy', 'friendship', 'grief', 'neutral',
];
const generateSchema = zod_1.z.object({
    input: zod_1.z.string().min(3).max(500),
    category: zod_1.z.string().default('other'),
    language: zod_1.z.string().optional(),
    mood: zod_1.z.string().optional(),
    accent: zod_1.z.string().optional(),
});
const sceneMap = {
    sad: 'MoonlitScene',
    romantic: 'RoseGardenScene',
    motivational: 'SunriseScene',
    dark: 'StormyNightScene',
    happy: 'SunnyMeadowScene',
    nostalgic: 'AutumnDuskScene',
    spiritual: 'TempleDawnScene',
    anger: 'ThunderStormScene',
    hope: 'GoldenDawnScene',
    loneliness: 'EmptyHallScene',
    gratitude: 'WarmHearthScene',
    philosophical: 'StarfieldScene',
    nature: 'ForestStreamScene',
    mystical: 'CosmicPortalScene',
    devotion: 'SacredAltarScene',
    wonder: 'CrystalAuroraScene',
    triumph: 'GoldenCrownScene',
    compassion: 'LotusPondScene',
    rebellion: 'CrimsonTorchScene',
    wanderlust: 'DesertDunesScene',
    sensual: 'VelvetChamberScene',
    rain: 'MonsoonBreezeScene',
    destiny: 'HourglassStarsScene',
    irony: 'VenetianMirrorScene',
    ecstasy: 'WhirlingSufiScene',
    friendship: 'CampfireLanternScene',
    grief: 'SilentCenotaphScene',
    neutral: 'AbstractParticlesScene',
};
const generateContent = async (req, res) => {
    const parsed = generateSchema.parse(req.body);
    const uid = req.user.uid;
    // Check user plan for restrictions
    const user = await firestore_repository_1.dbRepository.getUser(uid);
    const isPremium = user?.plan === 'premium';
    // Free tier: restrict content types (only 4 poetic forms)
    if (!isPremium && !FREE_CONTENT_TYPES.includes(parsed.category)) {
        throw new errors_1.AppError(`Content type "${parsed.category}" is premium only. Free tier supports 4 poetic forms (Poem, Shayari, Sher, Haiku). Upgrade to Premium for Ghazal, Nazm, Shlok, Dohe, Rubaiyat, Sonnet, and Marsiya.`, 403, 'PREMIUM_CONTENT_TYPE');
    }
    const detectedLanguage = parsed.language || detector_service_1.DetectorService.detectLanguage(parsed.input);
    const detectedMood = parsed.mood || detector_service_1.DetectorService.detectMood(parsed.input);
    // Free tier: restrict languages (only 7 Indian languages, no global languages)
    if (!isPremium && !FREE_LANGUAGES.includes(detectedLanguage)) {
        throw new errors_1.AppError(`Language "${detectedLanguage}" is premium only. Free tier supports 7 Indian languages (Hindi, Urdu, Romanized Hindi/Urdu, Sanskrit, Punjabi, Bengali, Tamil). Upgrade to unlock all 35 languages and regional accents.`, 403, 'PREMIUM_LANGUAGE');
    }
    // Free tier: restrict moods (only 7 moods)
    if (!isPremium && detectedMood && !FREE_MOODS.includes(detectedMood)) {
        throw new errors_1.AppError(`Mood "${detectedMood}" is premium only. Free tier supports 7 moods (Romantic, Sad, Motivational, Spiritual, Happy, Nostalgic, Hope). Upgrade to unlock all 28 emotional modes.`, 403, 'PREMIUM_MOOD');
    }
    const scene = sceneMap[detectedMood] || 'AbstractParticlesScene';
    const generatedText = await gemini_service_1.GeminiService.generateContent(parsed.input, parsed.category, detectedLanguage, parsed.accent, detectedMood);
    const wordCount = generatedText.split(/\s+/).length;
    const generationDoc = {
        uid,
        content: generatedText,
        type: parsed.category,
        language: detectedLanguage,
        mood: detectedMood,
        accent: parsed.accent || 'standard',
        scene,
        userInput: parsed.input,
        wordCount,
        shared: false,
        shareCount: 0,
        createdAt: new Date(),
    };
    const generationId = await firestore_repository_1.dbRepository.saveGeneration(generationDoc);
    await firestore_repository_1.dbRepository.incrementDailyCount(uid);
    res.status(200).json({
        success: true,
        data: {
            generationId,
            content: generatedText,
            type: parsed.category,
            language: detectedLanguage,
            mood: detectedMood,
            accent: parsed.accent || 'standard',
            scene,
        }
    });
};
exports.generateContent = generateContent;
