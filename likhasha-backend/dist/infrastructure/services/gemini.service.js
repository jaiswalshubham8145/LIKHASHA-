"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
const generative_ai_1 = require("@google/generative-ai");
const env_config_1 = require("../../config/env.config");
const logger_config_1 = require("../../config/logger.config");
const errors_1 = require("../../domain/errors");
let genAIInstance = null;
function getGenAI() {
    if (!genAIInstance) {
        genAIInstance = new generative_ai_1.GoogleGenerativeAI(env_config_1.env.GOOGLE_API_KEY || 'missing_key');
    }
    return genAIInstance;
}
// ─── Language metadata ───
const LANG_NAMES = {
    en: 'English', hi: 'Hindi', ur: 'Urdu', roman: 'Hinglish / Roman Urdu',
    sa: 'Sanskrit', ta: 'Tamil', te: 'Telugu', bn: 'Bengali', mr: 'Marathi',
    gu: 'Gujarati', kn: 'Kannada', ml: 'Malayalam', pa: 'Punjabi',
    or: 'Odia', as: 'Assamese', mai: 'Maithili', ks: 'Kashmiri', sd: 'Sindhi',
    kok: 'Konkani', ne: 'Nepali', bho: 'Bhojpuri', mwr: 'Marwari / Rajasthani', sat: 'Santhali',
    ar: 'Arabic', fa: 'Persian (Farsi)', es: 'Spanish', fr: 'French', ja: 'Japanese',
    ko: 'Korean', pt: 'Portuguese', de: 'German', it: 'Italian', zh: 'Chinese',
    ru: 'Russian', tr: 'Turkish',
};
const SCRIPT_NAMES = {
    hi: 'Devanagari', sa: 'Devanagari Sanskrit', ta: 'Tamil script', te: 'Telugu script', bn: 'Bengali script',
    gu: 'Gujarati script', kn: 'Kannada script', ml: 'Malayalam script',
    pa: 'Gurmukhi script', or: 'Odia script', as: 'Assamese script', mai: 'Devanagari (Maithili)',
    ks: 'Nastaliq / Devanagari Kashmiri', sd: 'Sindhi Arabic / Devanagari script', kok: 'Devanagari Konkani',
    ne: 'Devanagari Nepali', bho: 'Devanagari Bhojpuri', mwr: 'Devanagari Rajasthani', sat: 'Ol Chiki script',
    ur: 'Nastaliq Urdu script (right-to-left)', ar: 'Arabic script (right-to-left)',
    fa: 'Perso-Arabic script (right-to-left)', ja: 'Japanese (mix of Kanji, Hiragana, Katakana)',
    ko: 'Korean Hangul', zh: 'Chinese characters (Hanzi)', ru: 'Cyrillic script', tr: 'Turkish Latin script',
    es: 'Latin script', fr: 'Latin script', pt: 'Latin script',
    de: 'Latin script', it: 'Latin script', en: 'Latin script', roman: 'Latin/Roman script',
};
// ─── System prompts per content type × language family ───
function getSystemPrompt(type, language, accent, mood) {
    const langName = LANG_NAMES[language] || language;
    const script = SCRIPT_NAMES[language] || 'native script';
    const isRTL = language === 'ur' || language === 'ar' || language === 'fa' || language === 'ks' || language === 'sd';
    const isIndianLang = ['hi', 'sa', 'ta', 'te', 'bn', 'mr', 'gu', 'kn', 'ml', 'pa', 'or', 'as', 'mai', 'bho', 'mwr', 'kok', 'ne'].includes(language);
    const isEastAsian = ['ja', 'ko', 'zh'].includes(language);
    const prompts = {
        shayari: isRTL
            ? `You are a master ${langName} shayar. Write deeply emotional shayari in ${script}. Format: 4-6 lines. No English. No explanation. Just the shayari itself.`
            : isIndianLang
                ? `You are a master ${langName} shayar. Write deeply emotional shayari in ${script}. Format: 4-6 lines. No English transliteration. No explanation. Just the shayari.`
                : `You are a master shayar writing in ${langName}. Write deeply emotional shayari. Format: 4-6 lines. No explanation. Just the shayari.`,
        poem: isIndianLang || isEastAsian
            ? `You are a ${langName} poet. Write a beautiful poem in ${script}. Format: 6-12 lines. Emotional, lyrical, with rhythm. No explanation. Just the poem.`
            : `You are a poet writing in ${langName}. Write a beautiful poem. Format: 6-12 lines. Emotional, lyrical, with rhythm. No explanation. Just the poem.`,
        sher: isRTL
            ? `You are a master of ${langName} sher. Write exactly one sher (2-line couplet) in ${script}. Perfect meter and rhyme. No explanation. Just the sher.`
            : `You are a master of ${langName} sher. Write exactly one sher (2-line couplet) in ${script}. Perfect meter and rhyme. No explanation. Just the sher.`,
        quote: language === 'en'
            ? `You are a master quote writer. Write one powerful, original quote in English. One to three sentences maximum. No attribution. No explanation. Just the quote.`
            : `You are a master quote writer in ${langName}. Write one powerful, original quote in ${script}. One to three sentences maximum. No attribution. No explanation. Just the quote.`,
        motivational: `You are a motivational writer in ${langName}. Write an inspiring, powerful motivational verse or quote in ${script}. 2-4 lines. No explanation. Just the content.`,
        shlok: `You are a Sanskrit scholar and ${langName} poet. Write an authentic shlok (sacred verse) in Devanagari script. Include the original Sanskrit shlok on the first line, then a beautiful ${langName} translation/explanation on the next lines. Format clearly. No extra commentary.`,
        dohe: `You are a master of Hindi dohas (couplets in the style of Kabir, Tulsidas, Surdas). Write a meaningful doha in Devanagari script. Format: 2 lines of the doha, then a brief explanation in simple language. No extra commentary.`,
        nazm: isRTL
            ? `You are a master nazm poet in ${langName}. Write a beautiful nazm (structured Urdu poem) in ${script}. 8-12 lines with consistent theme and imagery. No explanation. Just the nazm.`
            : `You are a master nazm poet in ${langName}. Write a beautiful nazm (structured poem) in ${script}. 8-12 lines with consistent theme and imagery. No explanation. Just the nazm.`,
        ghazal: isRTL
            ? `You are a master ghazal poet in ${langName}. Write a beautiful ghazal in ${script}. Follow strict ghazal rules: 5-7 sher, consistent radif and qafia, thematic unity. No explanation. Just the ghazal.`
            : `You are a master ghazal poet in ${langName}. Write a beautiful ghazal in ${script}. Follow strict ghazal rules: 5-7 sher, consistent radif and qafia, thematic unity. No explanation. Just the ghazal.`,
        marsiya: isRTL
            ? `You are a master marsiya writer in ${langName}. Write a deeply emotional marsiya (elegy) in ${script}. 6-10 lines with vivid imagery and emotional depth. No explanation. Just the marsiya.`
            : `You are a master marsiya writer in ${langName}. Write a deeply emotional marsiya (elegy) in ${script}. 6-10 lines with vivid imagery and emotional depth. No explanation. Just the marsiya.`,
        rubaiyat: `You are a master of Rubaiyat (classical quatrains like Omar Khayyam and Sarmad). Write a profound 4-line quatrain following the AABA rhyme scheme in ${langName} (${script}). No explanation. Just the four lines.`,
        haiku: `You are a master of Haiku. Write an authentic 3-line Haiku (traditional 5-7-5 syllable rhythm) in ${langName} (${script}). Capture a striking moment of emotion, nature or epiphany. No explanation. Just the 3 lines.`,
        sonnet: `You are a master sonneteer. Write an exquisite 14-line sonnet with elegant meter, rich metaphorical depth, and volta (turn of thought) in ${langName} (${script}). No explanation. Just the sonnet.`,
        other: `You are a creative writer fluent in ${langName}. Write a highly engaging piece of creative writing in ${script}. No explanation. Just the content.`,
    };
    let prompt = prompts[type] || prompts.other;
    if (accent && accent !== 'standard') {
        prompt += ` Lyrical Accent & Cadence: Infuse the specific poetic dialect, idioms, and regional musicality of the "${accent}" tradition.`;
    }
    if (mood) {
        prompt += ` Emotional Tone: The piece must deeply embody the mood of "${mood}".`;
    }
    return prompt;
}
// ─── Local Creative Fallback Database ───
// Structure: category -> language -> mood -> content[]
const LOCAL_FALLBACKS = {
    quote: {
        en: {
            romantic: [
                "Love is not a silent harbor; it is a wild, beautiful storm where two souls dare to navigate the tempest hand in hand.",
                "To love is to see ourselves in another, and to cherish the mirror that shows us not who we are, but who we can become.",
            ],
            sad: [
                "Pain is the silent architecture of the soul, carving deep chambers where joy will one day learn to echo.",
                "Some nights are just rooms of shadows, where the quietest whisper of memory sounds like thunder.",
            ],
            motivational: [
                "Stars do not combat the darkness; they simply define themselves within it, burning with elegant brilliance.",
                "Your capacity to rise is proportional to your willingness to let go of the gravity of your past.",
            ],
            happy: [
                "Joy is the simplest form of gratitude; a light that dances in the eyes and turns ordinary moments golden.",
                "Let your laughter be a rebellion against the heavy silences of the world.",
            ],
            dark: [
                "In the quiet theatre of the night, shadows do not hide secrets — they perform the plays we are too distracted to see.",
                "We are all a little broken, and in that brokenness lies the beauty of the light that slips through.",
            ],
            neutral: [
                "We are all stories in the making, written in the ink of our choices. Live a chapter worth whispering.",
                "The beauty of silence is that it requires no translation; it is the language of the soul.",
            ],
            nostalgic: [
                "Memory is a painter who softens every harsh line of the past into a watercolor of longing.",
                "The past is a foreign country — we visit it only in dreams, and the visa is a single tear.",
            ],
            spiritual: [
                "The soul does not need glasses to see the divine — it sees best when the eyes of the world are closed.",
                "Every prayer is a seed; the harvest may not come in your season, but it will bloom for someone who needs it.",
            ],
            anger: [
                "Anger is a hot coal you hold in your hand while waiting for the other person to burn.",
                "The fire of rage consumes the one who carries it, not the one who sparked it.",
            ],
            hope: [
                "Hope is the sunrise of the soul — it arrives before you see it, painting the sky in colors you haven't named yet.",
                "Even the darkest night will end, and the sun will rise — not because it must, but because it remembers.",
            ],
            loneliness: [
                "Loneliness is not the absence of people; it is the absence of being understood.",
                "An empty room echoes loudest when you are full of words no one will hear.",
            ],
            gratitude: [
                "Gratitude turns what we have into enough, and ordinary days into thanksgivings.",
                "The richest person is not the one with the most, but the one who needs the least and thanks the most.",
            ],
            philosophical: [
                "We are the universe observing itself — brief, curious, and utterly magnificent in our confusion.",
                "The meaning of life is not an answer to be found, but a question to be lived.",
            ],
            nature: [
                "In every walk with nature, one receives far more than one seeks — the earth teaches in silence.",
                "The trees are poems that the earth writes upon the sky, and we read them when the wind turns the pages.",
            ],
        },
        hi: {
            neutral: [
                "शब्दों की अपनी एक खुशबू होती है, जो कभी फीकी नहीं पड़ती; वे मौन की गहराइयों से निकलकर आत्मा को छू लेते हैं।",
                "ज़िंदगी एक ख़ामोश राग है, जिसे हर कोई सुनता है, पर थोड़े ही समझ पाते हैं।",
            ],
            romantic: [
                "प्यार वो नदी है जो बिना किनारे के बहती है, और दिल वो कश्ती है जो बिना पतवार के चलती है।",
            ],
            sad: [
                "दर्द एक ऐसा शब्द है जिसे सुनकर हर कोई समझ जाता है, पर जीने वाला कोई नहीं समझ पाता।",
            ],
            motivational: [
                "हर सुबह एक नया अवसर है, बस आँखें खोलने की देर है; किस्मत तो उनकी साथ देती है जो हिम्मत से काम लेते हैं।",
            ],
        },
        ta: {
            neutral: [
                "வார்த்தைகளுக்கு தனி மணம் உண்டு, அது எப்போதும் மங்காது; அவை அமைதியின் ஆழத்திலிருந்து ஆன்மாவைத் தொடுகின்றன.",
            ],
            romantic: [
                "காதல் என்பது இரு ஆன்மாக்கள் ஒரே இசையில் நடனமாடும் அழகான கனவு.",
            ],
        },
        te: {
            neutral: [
                "మాటలకు వాసన ఉంటుంది, అది ఎప్పటికీ తగ్గదు; అవి నిశ్శబ్దం యొక్క లోతుల నుండి ఆత్మను తాకుతాయి.",
            ],
            romantic: [
                "ప్రేమ అంటే ఇద్దరు ఆత్మలు ఒకే సంగీతంలో నాట్యం చేసే అందమైన కల.",
            ],
        },
        bn: {
            neutral: [
                "শব্দের নিজের একটি গন্ধ আছে, যা কখনই ম্লান হয় না; তারা নীরবতার গভীরতা থেকে আত্মাক স্পর্শ করে।",
            ],
            romantic: [
                "ভালোবাসা মানে দুই আত্মা একই সুরে নাচে — এটি সবচেয়ে সুন্দর স্বপ্ন।",
            ],
        },
    },
    shayari: {
        roman: {
            romantic: [
                "Tere khayal se mehakti hai har subah meri,\nTu door rehkar bhi mere paas lagti hai.\nYeh jo ishq ka nasha hai Likhasha ban kar,\nAb har lafz mein teri hi tasveer dikhti hai.",
                "Tumhari har ek baat par hum fida hone lage hain,\nTumhari chahat mein hum khud ko khone lage hain.",
            ],
            sad: [
                "Khamosh fizayein hain aur dard ka mausam hai,\nDil ke akelepan mein har saans ik aah lagti hai.",
                "Gham ke saaye mein bhi hum muskurana seekh gaye,\nDil ke zakhmon ko sabse chhupana seekh gaye.",
            ],
            motivational: [
                "Manzil unhi ko milti hai jinke sapno mein jaan hoti hai,\nPankh se kuch nahi hota, haunslo se udaan hoti hai.",
                "Thak kar mat baith ae musafir, apno ki raahon mein,\nWaqt badlega aur tere khwab haqeeqat banenge.",
            ],
            happy: [
                "Khushi ki baatein ho aur tumhara saath ho,\nIsse behtar zindagi mein kya aur baat ho.",
            ],
            dark: [
                "Raat ki gehrai mein chhupa hai ek dard ka samandar,\nKhamosh saaye chalte hain dil ke andar.",
            ],
            neutral: [
                "Zindagi ek aisi kitaab hai jise humne likha nahi,\nHar panna ek naya afsana, ek naya rasta hai.",
            ],
        },
        ur: {
            romantic: [
                "تیرے خیال سے خوشبوئے یار آتی ہے\nدل کے ویرانے میں بہار آتی ہے",
                "ہمارے دل میں تمہاری دھڑکن اب بھی جوان ہے\nتمہاری محبت ہی تو ہمارے جینے کا نشان ہے",
            ],
            sad: [
                "محفل بھی روئے گی، ویرانہ بھی روئے گا\nاس دنیا میں میرا کوئی نہ اب ہوگا",
                "درد کی حد سے گزر گئے ہیں ہم کب کے\nاب تو آنسو بھی آنکھوں میں خشک ہو چکے ہیں",
            ],
            motivational: [
                "ہمت نہ ہار اے مسافر اپنی جستجو میں\nستارے بھی ملیں گے تجھے تیری آرزو میں",
            ],
            happy: [
                "خوشی کا ہر لمحہ مبارک ہو آپ کو\nزندگی کا ہر سفر آسان ہو آپ کو",
            ],
            dark: [
                "تاریکی کے سائے میں چلتی ہے سانس میری\nجیسے کوئی گہرا راز چھپا ہو دل کے ویرانے میں",
            ],
            neutral: [
                "یہ زندگی ایک خوابِ حسیں سہی لیکن\nاس خواب کی تعبیر بہت ہی مشکل ہے",
            ],
        },
        hi: {
            romantic: [
                "तुम्हारी यादों का एक अलग ही नशा है,\nहर सांस में तुम्हारा नाम बसा है।\nदिल की धड़कन में तुम हो, जान में तुम हो,\nतुम ही मेरी इबादत हो, तुम ही मेरा ईमान है।",
            ],
            sad: [
                "खामोशियों में भी एक दर्द छुपा होता है,\nहर मुस्कुराहट के पीछे एक ज़ख्म होता है।",
            ],
        },
        ta: {
            romantic: [
                "உன் நினைவுகள் வாசனை தெரிகின்றன ஒவ்வொரு காலையிலும்,\nநீ தொலைவில் இருந்தாலும் என் அருகில் இருப்பதாக உணர்கிறேன்.",
            ],
        },
        te: {
            romantic: [
                "నీ ఆలోచనలతో నా ప్రతి ఉదయం సువాసన చెందుతుంది,\nనువ్వు దూరంగా ఉన్నా నా దగ్గర ఉన్నట్లు అనిపిస్తావు.",
            ],
        },
        bn: {
            romantic: [
                "তোমার চিন্তা দিয়ে আমার প্রতিটি সকাল সুগন্ধি হয়ে ওঠে,\nতুমি দূরে থেকেও আমার কাছে মনে হও।",
            ],
        },
    },
    poem: {
        hi: {
            romantic: [
                "तुम प्रेम हो, तुम ही मेरा संगीत हो,\nइस वीरान हृदय का अमर तुम गीत हो।\nजब सांसें थमती हैं सन्नाटों के साए में,\nतब तुम मेरे मौन का मीठा मीठा मीत हो।",
                "तेरी आँखों के नीले समंदर में डूब जाऊँ,\nतेरी साँसों की महक में खुद को भूल जाऊँ।",
            ],
            sad: [
                "शाम ढलते ही यादों का कारवां चलता है,\nतेरी खामोशी में मेरा हर लम्हा जलता है।",
                "आँखों में आँसू नहीं, पर दिल भारी है,\nतेरी यादों की यह रात हम पर भारी है।",
            ],
            motivational: [
                "जीवन की पगडंडी पर चलते जाना ही नियति है,\nकभी धूप की तपन, कभी शीतल छांव की गति है।",
                "लहरों से डरकर नौका पार नहीं होती,\nकोशिश करने वालों की कभी हार नहीं होती।",
            ],
            happy: [
                "आज मन मयूर बन नाच रहा है खुशियों के वन में,\nएक नई उमंग सी जागी है इस सूने जीवन में।",
            ],
            dark: [
                "सन्नाटे की इस चादर में लिपटा सारा संसार है,\nअंधेरे की गहराइयों में छुपा मेरा प्यार है।",
            ],
            neutral: [
                "रिमझिम फुहारों में भीगी सी रात आई है,\nमिट्टी की सोंधी महक संग तेरी याद लाई है।",
            ],
        },
        ta: {
            romantic: [
                "உன் கண்களின் கடலில் மூழ்க வேண்டும்,\nஉன் மூச்சுக் காற்றின் மணத்தில் என்னை மறக்க வேண்டும்.",
            ],
        },
        te: {
            romantic: [
                "నీ కళ్ళ సముద్రంలో మునిగిపోతాను,\nనీ శ్వాసల సువాసనలో నన్ను మరచిపోతాను.",
            ],
        },
        bn: {
            romantic: [
                "তোমার চোখের নীল সাগরে ডুবে যাই,\nতোমার শ্বাসের গন্ধে নিজেকে ভুলে যাই।",
            ],
        },
    },
    sher: {
        roman: {
            romantic: [
                "Mohabbat mein dilon ka tootna toh ek aam baat hai,\nMagar kisi ke intezar mein zindagi guzaarna kamaal hai.",
                "Tumhari ek muskurahat hi meri har thakan ka ilaaj hai,\nTumhare paas hone se hi mera aaj aur kal aabad hai.",
            ],
            sad: [
                "Khamoshiyon se guzar kar humne yeh jaana hai,\nHar muskurahat ke peechhe dard ka ek zamaana hai.",
                "Hum toh bas unki khışı chahte the har haal mein,\nBhale hi humara naam na ho unke pyaar ke sawaal mein.",
            ],
            motivational: [
                "Zindagi ki raahon mein dhoop toh har kadam par hai,\nMagar jo chal sake humsafar bankar, wahi mukaddar hai.",
                "Thak kar na baithna ae mere dost abhi raaste baaki hain,\nHaunsle zinda hain toh har manzil milna aasan lagti hai.",
            ],
            happy: [
                "Khushi ka har ek lamha behad hasseen ban jaata hai,\nJab humsafar dil se dosti nibhaane chala aata hai.",
            ],
            dark: [
                "Raat ki siyahi mein jo kho gaye hain saaye mere,\nUnhe dhoondne nikla hoon main apne hi andhere mein.",
            ],
            neutral: [
                "Zindagi toh bas ek behraha samandar hai,\nJo tair sake wahi iske raaz ka maalik hai.",
            ],
        },
        ur: {
            romantic: [
                "ہزاروں خواب ٹوٹیں گے تو اک سچی محبت ملے گی\nدلِ بے تاب کو آخر اسی نادانی سے راحت ملے گی",
                "تیرے پیار میں ہم تو خود کو مٹا بیٹھے ہیں اے جاں\nاب تو ہماری ہر دھڑکن میں بس تیرا ہی نشان ہے",
            ],
            sad: [
                "ہم نے ہنس ہنس کے گزاری ہے جدائی کی ہر اک گھڑی\nتاکہ زمانے کو ہمارے آنسوؤں کی خبر نہ ہو سکے",
                "درد جب حد سے گزرتا ہے تو دوا بن جاتا ہے\nانسان خاموش رہ کر بھی سب کچھ کہہ جاتا ہے",
            ],
            motivational: [
                "زندگی کی دھوپ میں جلتے رہے عمر بھر ہم\nتب جا کے ہمیں سایہِ دیوار کی قیمت معلوم ہوئی",
                "عزمِ صمیم ہو تو ہر مشکل آسان ہو جاتی ہے\nطوفان بھی راستہ بدل لیتے ہیں جب ہمت جوان ہوتی ہے",
            ],
            happy: [
                "آج خوش ہیں ہم تماشا دیکھ کر تقدیر کا\nہر لکیر میں لکھا ہے پیار کا سفر دلیر کا",
            ],
            dark: [
                "تاریکی کے سائے میں چھپا ہے اک درد کا نشاں\nنہ کوئی ہمدم ہے یہاں نہ کوئی مہرباں",
            ],
            neutral: [
                "یہ بزمِ تمنا ہے یہاں ہر خواب ادھورا رہتا ہے\nجو دل سے جڑے وہ رشتہ کبھی دور نہیں رہتا ہے",
            ],
        },
    },
    shlok: {
        hi: {
            neutral: [
                "वागर्थाविव संपृक्तौ वागर्थप्रतिपत्तये।\nजगतः पितरौ वन्दे पार्वतीपरमेश्वरौ॥\n\nअर्थ: वाणी और अर्थ जैसे एक-दूसरे से जुड़े हैं, वैसे ही पार्वती और शिव संसार के नियंता हैं।",
                "सत्यं शिवं सुन्दरम् — सत्य ही शिव है, शिव ही सुंदर है।\nजो सत्य के मार्ग पर चलता है, वही सच्चा जीवन जीता है।",
            ],
            spiritual: [
                "वसुधैव कुटुम्बकम् — संपूर्ण पृथ्वी एक परिवार है।\nजो यह समझता है, वह सभी प्राणियों से प्रेम करता है।",
            ],
        },
    },
    dohe: {
        hi: {
            neutral: [
                "कबीरा खड़ा बाज़ार में, माँगे सबकी खैर।\nना काहू से दोस्ती, ना काहू से बैर॥\n\nअर्थ: कबीर सबका भला चाहते हैं, न किसी से दुश्मनी रखते हैं, न दोस्ती।",
                "धीरे-धीरे रे मना, धीरे सब कुछ होय।\nमाली सींचे बूँड़ बूँड़, सो बेल फल होय॥\n\nअर्थ: धैर्य से काम लो, थोड़ा-थोड़ा करके प्रयास करो, सफलता अवश्य मिलेगी।",
            ],
            motivational: [
                "कबीर प्रेम भया तो प्रीति जगाई।\nएक राता उजियारा भया, ज्यों चंदन पवन लगाई॥\n\nअर्थ: प्रेम सबकुछ बदल देता है, जैसे रात में चंदन की सुगंध फैल जाती है।",
            ],
        },
    },
    nazm: {
        ur: {
            romantic: [
                "दिल की बातें लफ़्ज़ों में कैसे कहूँ,\nजो जुबाँ पर आए वो कम हो जाती हैं।\nहर ख़ामोशी में एक नज़्म छुपी है,\nजो तेरे नाम से ही सुनाई देती है।",
            ],
        },
        hi: {
            romantic: [
                "दिल की बातें शब्दों में कैसे कहूँ,\nजो ज़ुबान पर आए वो कम हो जाती हैं।\nहर ख़ामोशी में एक नज़्म छुपी है,\nजो तेरे नाम से ही सुनाई देती है।",
            ],
        },
    },
    ghazal: {
        ur: {
            romantic: [
                "हम जो मिले तो ज़माने ने कहा, दो दीवाने मिले।\nहम जो बिछड़े तो ज़माने ने कहा, दो जहान बिखरे।\n\nतेरी याद का दीया जलता रहा रात भर,\nअंधेरे ने भी मान लिया, अब उजाला आ गया।\n\nहमारी ख़ामोशी भी ग़ज़ल बन गई,\nजो सुने उसे दिल से गुज़र जाती है।",
            ],
        },
        hi: {
            romantic: [
                "हम जो मिले तो दुनिया ने कहा, दो दीवाने मिले।\nहम जो बिछड़े तो दुनिया ने कहा, दो दुनिया बिखरे।",
            ],
        },
    },
    marsiya: {
        ur: {
            sad: [
                "या अली مدد کر — ऐ अली मदद कर,\nतेरे दीन पर चलने वालों की हिफ़ाज़त कर।\n\nकर्बला की धरती पर जो हुआ वो याद है,\nहर साल यह दर्द हमारे दिल में ताज़ा है।",
            ],
        },
    },
};
const DEFAULT_FALLBACKS = {
    quote: [
        "The beauty of silence is that it requires no translation; it is the language of the soul when the world becomes too loud.",
    ],
    shayari: [
        "Har lafz mein chhupi hai kisi dil ki dastaan,\nKoyi padh ke ro deta hai, toh koyi muskura deta hai.",
    ],
    poem: [
        "शब्दों की माला पिरोकर हम लाए हैं,\nहृदय के अंतस से कुछ गहरे भाव सजाए हैं।",
    ],
    sher: [
        "Alfaaz badal jaate hain magar dard wahi rehta hai,\nDil mein jo bas jaaye woh shaks kabhi door nahi rehta hai.",
    ],
    shlok: [
        "वागर्थाविव संपृक्तौ वागर्थप्रतिपत्तये।\nजगतः पितरौ वन्दे पार्वतीपरमेश्वरौ॥",
    ],
    dohe: [
        "कबीरा खड़ा बाज़ार में, माँगे सबकी खैर।\nना काहू से दोस्ती, ना काहू से बैर॥",
    ],
    nazm: [
        "दिल की बातें लफ़्ज़ों में कैसे कहूँ,\nजो जुबाँ पर आए वो कम हो जाती हैं।",
    ],
    ghazal: [
        "हम जो मिले तो ज़माने ने कहा, दो दीवाने मिले।",
    ],
    marsiya: [
        "या अली مدد کر — ऐ अली मदद कर,\nतेरे दीन पर चलने वालों की हिफ़ाज़त कर।",
    ],
};
class GeminiService {
    static getLocalFallback(input, type, language) {
        const normType = type?.toLowerCase() || 'quote';
        const normLang = language?.toLowerCase() || 'en';
        const { DetectorService } = require('./detector.service');
        const detectedMood = DetectorService.detectMood(input);
        logger_config_1.logger.info(`✨ Premium Local Creative Fallback Engine [Type: ${normType}, Lang: ${normLang}, Mood: ${detectedMood}]`);
        const categoryPool = LOCAL_FALLBACKS[normType] || LOCAL_FALLBACKS['quote'];
        let langPool = categoryPool[normLang];
        if (!langPool) {
            // Try fallback chain: same script family -> roman -> en
            if (normLang === 'mr' || normLang === 'as')
                langPool = categoryPool['hi'];
            else if (normLang === 'ta' || normLang === 'te' || normLang === 'bn' || normLang === 'gu' || normLang === 'kn' || normLang === 'ml' || normLang === 'pa' || normLang === 'or')
                langPool = categoryPool[normLang] || categoryPool['roman'];
            else if (['es', 'fr', 'pt', 'de', 'it'].includes(normLang))
                langPool = categoryPool['en'];
            else if (['ar'].includes(normLang))
                langPool = categoryPool['ur'];
            else
                langPool = categoryPool['roman'] || categoryPool['en'];
        }
        const moodPool = langPool[detectedMood] || langPool['neutral'] || langPool['romantic'] || Object.values(langPool)[0];
        if (moodPool && moodPool.length > 0) {
            const randIdx = Math.floor(Math.random() * moodPool.length);
            return moodPool[randIdx];
        }
        const defaultPool = DEFAULT_FALLBACKS[normType] || DEFAULT_FALLBACKS['quote'];
        const randIdx = Math.floor(Math.random() * defaultPool.length);
        return defaultPool[randIdx];
    }
    static async generateContent(input, type, language, accent, mood) {
        const systemPrompt = getSystemPrompt(type, language, accent, mood);
        const modelsToTry = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];
        for (const modelName of modelsToTry) {
            try {
                logger_config_1.logger.info(`🤖 Generating with model: ${modelName} [Type: ${type}, Lang: ${language}]`);
                const model = getGenAI().getGenerativeModel({
                    model: modelName,
                    generationConfig: {
                        maxOutputTokens: type === 'ghazal' || type === 'marsiya' ? 500 : 300,
                        temperature: 0.8,
                    },
                    systemInstruction: systemPrompt,
                });
                const result = await model.generateContent(input);
                const response = await result.response;
                const generatedText = response.text();
                if (generatedText && generatedText.trim().length > 0) {
                    logger_config_1.logger.info(`✅ Generated content using ${modelName}`);
                    return generatedText.trim();
                }
            }
            catch (error) {
                logger_config_1.logger.warn(`⚠️ Model ${modelName} failed: ${error?.message || error}`);
            }
        }
        // Fallback to local creative engine
        try {
            const fallbackContent = this.getLocalFallback(input, type, language);
            return fallbackContent;
        }
        catch (fallbackError) {
            logger_config_1.logger.error('CRITICAL: Local fallback engine failed!', fallbackError);
            throw new errors_1.AppError('Creative writing service temporarily unavailable.', 502, 'AI_SERVICE_ERROR');
        }
    }
}
exports.GeminiService = GeminiService;
