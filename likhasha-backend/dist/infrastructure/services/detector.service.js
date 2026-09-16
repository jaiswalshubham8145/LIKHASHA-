"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetectorService = void 0;
class DetectorService {
    // Unicode ranges for Indian scripts
    static urduRange = /[\u0600-\u06FF]/;
    static hindiRange = /[\u0900-\u097F]/;
    static bengaliRange = /[\u0980-\u09FF]/;
    static tamilRange = /[\u0B80-\u0BFF]/;
    static teluguRange = /[\u0C00-\u0C7F]/;
    static kannadaRange = /[\u0C80-\u0CFF]/;
    static malayalamRange = /[\u0D00-\u0D7F]/;
    static odiaRange = /[\u0B00-\u0B7F]/;
    static punjabiRange = /[\u0A00-\u0A7F]/;
    static gujaratiRange = /[\u0A80-\u0AFF]/;
    // Unicode ranges for international scripts
    static cjkRange = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF]/;
    static cyrillicRange = /[\u0400-\u04FF]/;
    // Keyword-based detection for transliterated / mixed scripts
    static romanKeywords = [
        'shayari', 'likho', 'chahiye', 'dost', 'yaar', 'ishq', 'mohabbat', 'zindagi', 'dard', 'dil', 'humsafar',
        'pyar', 'prema', 'priya', 'sath', 'sapna', 'duniya', 'khwab', 'raat', 'din', 'jeevan',
    ];
    static hindiKeywords = [
        'kavita', 'kahaani', 'geet', 'bhajan', 'shlok', 'doha', 'sher', 'ghazal', 'nazm',
        'हिंदी', 'कविता', 'शेर', 'श्लोक', 'दोहा', 'ग़ज़ल', 'नज़्म',
    ];
    static tamilKeywords = [
        'kavithai', 'paadal', 'ithu', 'naan', 'un', 'en', 'oru', 'indha',
        'கவிதை', 'பாடல்', 'ஷேர்', 'ஷ்லோக்',
    ];
    static teluguKeywords = [
        'kavitha', 'pata', 'meeru', 'nenu', 'miku', 'oka', 'ee',
        'కవిత', 'పాట', 'షేర్', 'శ్లోక్',
    ];
    static bengaliKeywords = [
        'kobita', 'gaan', 'ami', 'tumi', 'ekhon', 'shobar',
        'কবিতা', 'গান', 'শের', 'শ্লোক',
    ];
    static marathiKeywords = [
        'kavita', 'gaani', 'me', 'tu', 'tya', 'hya', 'marathi',
        'कविता', 'गाणी', 'शेर', 'श्लोक',
    ];
    static gujaratiKeywords = [
        'kavita', 'geet', 'hu', 'tame', 'aa', 'e',
        'કવિતા', 'ગીત', 'શેર', 'શ્લોક',
    ];
    static kannadaKeywords = [
        'kavya', 'haadu', 'naanu', 'neevu', 'ondu',
        'ಕವ್ಯ', 'ಹಾಡು', 'ಶೇರ್', 'ಶ್ಲೋಕ್',
    ];
    static malayalamKeywords = [
        'kavitha', 'paattu', 'njan', 'ningal', 'oru',
        'കവിത', 'പാട്ട്', 'ഷേർ', 'ശ്ലോകം',
    ];
    static punjabiKeywords = [
        'kavita', 'geet', 'main', 'tusi', 'eh', 'oh',
        'ਕਵਿਤਾ', 'ਗੀਤ', 'ਸ਼ੇਰ', 'ਸ਼ਲੋਕ',
    ];
    static odiaKeywords = [
        'kavita', 'gita', 'mun', 'tumi', 'eta',
        'କବିତା', 'ଗୀତ', 'ଶେର', 'ଶ୍ଲୋକ',
    ];
    static assameseKeywords = [
        'kavita', 'geet', 'moi', 'tumi', 'ek',
        'কবিতা', 'গীত', 'শেৰ', 'শ্লোক',
    ];
    // Japanese detection
    static japaneseRange = /[\u3040-\u309F\u30A0-\u30FF]/;
    // Korean detection
    static koreanRange = /[\uAC00-\uD7AF]/;
    // Chinese detection (CJK Unified Ideographs, excluding Japanese/Korean specific)
    static chineseRange = /[\u4E00-\u9FFF]/;
    // Arabic detection (differentiate from Urdu via keywords)
    static arabicRange = /[\u0600-\u06FF]/;
    static arabicKeywords = ['شعر', 'قصيدة', 'حكمة', 'حب', 'حياة', 'أ poem', 'qasida', 'hikmah'];
    // Mood keywords — multilingual
    static moodKeywords = {
        sad: [
            'sad', 'dukh', 'dard', 'tanha', 'akela', 'cry', 'lonely', 'missing', 'low', 'depressed',
            'hurt', 'pain', 'tear', 'alone', 'broken', 'grief', 'rona', 'gham', 'tanhayi', 'udaasi',
            'காயம்', 'சோகம்', 'ఎదురు', 'দুঃখ', 'दुःख', 'ઉದાસી', 'ದುಃಖ', 'വിഷമം', 'ਦੁਖ', 'ଦୁଃଖ',
        ],
        romantic: [
            'love', 'pyaar', 'mohabbat', 'ishq', 'romantic', 'dil', 'heart', 'lust', 'passion',
            'feelings', 'beloved', 'yaar', 'humsafar', 'sensual', 'hug', 'kiss', 'prema', 'priya',
            'pyar', 'chaahat', 'jazbaat', 'dhadkan', 'intezaar',
            'காதல்', 'ప్రేమ', 'ভালোবাসা', 'प्रेम', 'પ્રેમ', 'ಪ್ರೀತಿ', 'സ്നേഹം', 'ਪਿਆਰ', 'ପ୍ରେମ',
        ],
        motivational: [
            'motivat', 'inspire', 'strong', 'himmat', 'success', 'work', 'hustle', 'grow', 'focus',
            'fight', 'win', 'dream', 'rise', 'power', 'sangharsh', 'jeet', ' lakshya', 'sankalp',
            'ఉత్సాహம்', 'பிரேரணை', 'উদ্যম', 'प्रेरणा', 'હિંમત', 'ಪ್ರೇರಣ', 'പ്രേരണ', 'ਹਿੰਮਤ', 'ପ୍ରେରଣା',
        ],
        dark: [
            'dark', 'andhera', 'death', 'maut', 'khatam', 'end', 'shadow', 'fear', 'ghost',
            'nightmare', 'bhoot', 'aatma', 'raaz', 'rahat', 'tamas',
            'இருண்ட', 'చీకటి', 'অন্ধকার', 'अंधेरा', 'અંધારું', 'ಕತ್ತಲೆ', 'ഇരുട്ട്', 'ਹਨੇਰਾ', 'ଅନ୍ଧାର',
        ],
        happy: [
            'happy', 'khush', 'mast', 'funny', 'joke', 'celebrate', 'mazaa', 'joy', 'smile',
            'laugh', 'excited', 'party', 'fun', 'anand', 'utsav', 'mahotsav',
            'மகிழ்ச்சி', 'సంతోషం', 'আনন্দ', 'आनंद', 'ખુશી', 'ಸಂತೋಷ', 'സന്തോഷം', 'ਖੁਸ਼ੀ', 'ଆନନ୍ଦ',
        ],
        nostalgic: [
            'nostalgic', 'yaad', 'purani', '记忆', 'memories', 'childhood', 'bachpan', 'gujar',
            'phir', 'kabhi', 'woh din', 'purane',
            'நினைவு', 'గుర్తు', 'স্মৃতি', 'याद', 'યાદ', 'ನೆನಪು', 'ଓଳିହେଇ',
        ],
        spiritual: [
            'spiritual', 'aatma', 'rooh', 'bhakti', 'om', 'mantra', 'dhyan', 'yoga', 'moksha',
            'prayer', 'worship', 'temple', 'god', 'divine', 'shlok', 'stotra',
            'ஆன்மீக', 'ఆధ్యాత్మిక', 'আধ্যাত্মিক', 'आध्यात्मिक', 'આધ્યાત્મિક', 'ਆਧਿਆਤਮਿਕ',
        ],
        anger: [
            'anger', 'angry', 'gussa', 'krodh', 'ghussa', 'irritated', 'frustrated', 'rage',
            'violence', 'hinsa', 'prachand',
            'கோபம்', 'కోపం', 'রাগ', 'क्रोध', 'गुस्सा', 'ગુસ્સો', 'ಕೋಪ', 'കോപം', 'ਗੁੱਸਾ', 'ରାଗ',
        ],
        hope: [
            'hope', 'umeed', 'aasha', 'vishwas', 'bharosa', 'expect', 'wish', 'pray',
            'futur', 'tomorrow', 'kal', 'savera',
            'நம்பிக்கை', 'ఆశ', 'আশা', 'आशा', 'આશા', 'ಆಶೆ', 'പ്രതീക്ഷ', 'ਉਮੀ', 'ଆଶା',
        ],
        loneliness: [
            'lonely', 'akela', 'tanha', 'vela', 'sunn', 'khamoshi', 'silence', 'alone',
            'no one', 'nobody', 'bheed', 'bhula',
            'தனிமை', 'ఒంటరి', 'একাকী', 'एकांत', 'એકલતં', 'ಏಕಾಂತ', 'ഒറ്റയ്ക്ക', 'ਇਕੱਲਾ', 'ଏକା',
        ],
        gratitude: [
            'gratitude', 'shukriya', 'dhanyavaad', 'thank', 'kritgya', 'abhari',
            'ధన్యవాద', 'நன்றி', 'ধন্যবાদ', 'ಕೃತಜ್ಞತा', 'നന്ദി', 'ਧੰਨਵਾਦ', 'ଧନ୍ୟବାଦ',
        ],
        philosophical: [
            'philosophy', 'darshan', 'tattva', 'gyaan', 'wisdom', 'soch', 'vichar', 'kya hai',
            'kyun', 'jeevan', 'sach', 'satya', 'meaning of life',
            'தத்துவம்', 'తత్వశాస్త్రం', 'দর্শন', 'दर्शन', 'દર્શન', 'ದರ್ಶನ', 'ദർശനം', 'ਦਰਸ਼ਨ', 'ଦର୍ଶନ',
        ],
        nature: [
            'nature', 'prakriti', 'ped', 'phool', 'pahaad', 'nadi', 'samundar', 'aasmaan',
            'moon', 'sun', 'star', 'rain', 'hawa', 'badal', 'chand', 'suraj',
            'இயற்கை', 'ప్రకృతి', 'প্রকৃতি', 'प्रकृतિ', 'પ્રકૃતિ', 'ಪ್ರಕೃತಿ', 'പ്രകൃതി', 'ਪ੍ਰਕ੍ਰਿਤੀ', 'ପ୍ରକୃତି',
        ],
    };
    static detectLanguage(input) {
        // Script-based detection (most reliable)
        if (this.japaneseRange.test(input))
            return 'ja';
        if (this.koreanRange.test(input))
            return 'ko';
        if (this.chineseRange.test(input) && !this.japaneseRange.test(input))
            return 'zh';
        if (this.urduRange.test(input)) {
            // Differentiate Urdu from Arabic via keywords
            if (this.arabicKeywords.some(k => input.includes(k)))
                return 'ar';
            return 'ur';
        }
        if (this.arabicRange.test(input) && this.arabicKeywords.some(k => input.includes(k)))
            return 'ar';
        if (this.cyrillicRange.test(input))
            return 'ru';
        if (this.bengaliRange.test(input))
            return 'bn';
        if (this.tamilRange.test(input))
            return 'ta';
        if (this.teluguRange.test(input))
            return 'te';
        if (this.kannadaRange.test(input))
            return 'kn';
        if (this.malayalamRange.test(input))
            return 'ml';
        if (this.odiaRange.test(input))
            return 'or';
        if (this.punjabiRange.test(input))
            return 'pa';
        if (this.gujaratiRange.test(input))
            return 'gu';
        if (this.hindiRange.test(input))
            return 'hi';
        // Keyword-based detection for transliterated content
        const lowerInput = input.toLowerCase();
        if (this.hindiKeywords.some(k => lowerInput.includes(k)))
            return 'hi';
        if (this.tamilKeywords.some(k => lowerInput.includes(k)))
            return 'ta';
        if (this.teluguKeywords.some(k => lowerInput.includes(k)))
            return 'te';
        if (this.bengaliKeywords.some(k => lowerInput.includes(k)))
            return 'bn';
        if (this.marathiKeywords.some(k => lowerInput.includes(k)))
            return 'mr';
        if (this.gujaratiKeywords.some(k => lowerInput.includes(k)))
            return 'gu';
        if (this.kannadaKeywords.some(k => lowerInput.includes(k)))
            return 'kn';
        if (this.malayalamKeywords.some(k => lowerInput.includes(k)))
            return 'ml';
        if (this.punjabiKeywords.some(k => lowerInput.includes(k)))
            return 'pa';
        if (this.odiaKeywords.some(k => lowerInput.includes(k)))
            return 'or';
        if (this.assameseKeywords.some(k => lowerInput.includes(k)))
            return 'as';
        if (this.romanKeywords.some(k => lowerInput.includes(k)))
            return 'roman';
        return 'en';
    }
    static detectMood(input) {
        const lower = input.toLowerCase();
        for (const [mood, keywords] of Object.entries(this.moodKeywords)) {
            if (keywords.some(k => lower.includes(k)))
                return mood;
        }
        return 'neutral';
    }
}
exports.DetectorService = DetectorService;
