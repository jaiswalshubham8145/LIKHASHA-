import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { VideoBackdrop } from "@/components/site/VideoBackdrop";
import { TiltCard } from "@/components/site/TiltCard";
import { VIDEOS } from "@/lib/media";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import {
  generateContent,
  saveGeneration,
  type GenerateResult,
} from "@/services/api";
import { toast } from "sonner";
import {
  Sparkles,
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  Lock,
  Image as ImageIcon,
  Flame,
  Heart,
  CloudRain,
  Sun,
  Compass,
  Moon,
  Feather,
  Globe,
  Zap,
} from "lucide-react";
import { GlassSpotlightCard } from "@/components/site/GlassSpotlightCard";
import { PoetryPosterModal } from "@/components/site/PoetryPosterModal";
import { NeuralMoodCanvas } from "@/components/site/NeuralMoodCanvas";
import { soundEffects } from "@/hooks/useSoundEffects";

export const Route = createFileRoute("/generate")({
  head: () => ({
    meta: [
      { title: "Generate Studio — Likhasha AI Poetry" },
      {
        name: "description",
        content:
          "Compose mood-reactive poetry, shayari, sher, and ghazals across 35 Indian & Global languages with authentic regional accents and 28 emotional modes.",
      },
      { property: "og:title", content: "Generate Studio — Likhasha" },
      {
        property: "og:description",
        content:
          "AI-powered creative poetry studio across 35 languages and 28 emotional dimensions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Generate,
});

/** Free Tier Allow-lists matching MONETIZATION.md */
const FREE_LANG_CODES = new Set(["hi", "ur", "roman", "sa", "pa", "bn", "ta"]);
const FREE_FORM_VALUES = new Set(["poem", "sher", "shayari", "haiku"]);
const FREE_MOOD_VALUES = new Set([
  "romantic",
  "sad",
  "motivational",
  "spiritual",
  "happy",
  "nostalgic",
  "hope",
]);

/** 28 Emotional Dimensions */
const MOODS = [
  {
    label: "Love & Romance",
    value: "romantic",
    category: "love",
    color: "#ff7597",
    icon: Heart,
  },
  {
    label: "Heartbreak & Pain",
    value: "sad",
    category: "sorrow",
    color: "#60a5fa",
    icon: CloudRain,
  },
  {
    label: "Fire & Valor",
    value: "motivational",
    category: "energy",
    color: "#f97316",
    icon: Flame,
  },
  {
    label: "Sufi & Transcendence",
    value: "spiritual",
    category: "spirit",
    color: "#c084fc",
    icon: Feather,
  },
  {
    label: "Midnight Melancholy",
    value: "dark",
    category: "sorrow",
    color: "#94a3b8",
    icon: Moon,
  },
  {
    label: "Joy & Celebration",
    value: "happy",
    category: "energy",
    color: "#facc15",
    icon: Sun,
  },
  {
    label: "Nostalgia & Yaad",
    value: "nostalgic",
    category: "sorrow",
    color: "#d97706",
    icon: Compass,
  },
  {
    label: "Hope & Healing",
    value: "hope",
    category: "spirit",
    color: "#34d399",
    icon: Sparkles,
  },
  {
    label: "Solitude & Silence",
    value: "loneliness",
    category: "sorrow",
    color: "#818cf8",
    icon: Moon,
  },
  {
    label: "Gratitude & Grace",
    value: "gratitude",
    category: "love",
    color: "#fb923c",
    icon: Heart,
  },
  {
    label: "Philosophy & Wisdom",
    value: "philosophical",
    category: "spirit",
    color: "#eab308",
    icon: Compass,
  },
  {
    label: "Nature & Elements",
    value: "nature",
    category: "spirit",
    color: "#4ade80",
    icon: Feather,
  },
  {
    label: "Passion & Intensity",
    value: "anger",
    category: "energy",
    color: "#ef4444",
    icon: Flame,
  },
  {
    label: "Mystical & Esoteric",
    value: "mystical",
    category: "spirit",
    color: "#a855f7",
    icon: Sparkles,
  },
  {
    label: "Devotion & Bhakti",
    value: "devotional",
    category: "spirit",
    color: "#f59e0b",
    icon: Heart,
  },
  {
    label: "Wonder & Awe",
    value: "wonder",
    category: "spirit",
    color: "#38bdf8",
    icon: Sparkles,
  },
  {
    label: "Triumph & Victory",
    value: "triumph",
    category: "energy",
    color: "#e11d48",
    icon: Zap,
  },
  {
    label: "Compassion & Mercy",
    value: "compassion",
    category: "love",
    color: "#ec4899",
    icon: Heart,
  },
  {
    label: "Rebellion & Inquilab",
    value: "rebellion",
    category: "energy",
    color: "#dc2626",
    icon: Flame,
  },
  {
    label: "Wanderlust & Odyssey",
    value: "wanderlust",
    category: "energy",
    color: "#06b6d4",
    icon: Compass,
  },
  {
    label: "Sensual & Ethereal",
    value: "sensual",
    category: "love",
    color: "#f43f5e",
    icon: Heart,
  },
  {
    label: "Rain & Petrichor",
    value: "rain",
    category: "sorrow",
    color: "#0ea5e9",
    icon: CloudRain,
  },
  {
    label: "Destiny & Kismet",
    value: "destiny",
    category: "spirit",
    color: "#8b5cf6",
    icon: Moon,
  },
  {
    label: "Irony & Wit",
    value: "irony",
    category: "energy",
    color: "#10b981",
    icon: Sparkles,
  },
  {
    label: "Ecstasy & Masti",
    value: "ecstasy",
    category: "energy",
    color: "#fbbf24",
    icon: Sun,
  },
  {
    label: "Friendship & Yaari",
    value: "friendship",
    category: "love",
    color: "#14b8a6",
    categoryLabel: "Love",
    icon: Heart,
  },
  {
    label: "Grief & Elegy",
    value: "grief",
    category: "sorrow",
    color: "#64748b",
    icon: CloudRain,
  },
  {
    label: "Reflective Poetics",
    value: "neutral",
    category: "spirit",
    color: "#d4af37",
    icon: Sparkles,
  },
] as const;

const MOOD_CATEGORIES = [
  { id: "all", label: "All Dimensions (28)" },
  { id: "love", label: "Love & Affinity" },
  { id: "sorrow", label: "Sorrow & Rain" },
  { id: "energy", label: "Fire & Triumph" },
  { id: "spirit", label: "Mystic & Sufi" },
] as const;

/** 11 Poetic Forms & Meters */
const FORMS = [
  {
    label: "Poem (Free Verse)",
    value: "poem",
    desc: "Contemporary lyrical verse",
  },
  { label: "Two-Line Sher", value: "sher", desc: "Two profound rhyming lines" },
  {
    label: "Shayari",
    value: "shayari",
    desc: "Expressive couplets of emotion",
  },
  {
    label: "Classical Ghazal",
    value: "ghazal",
    desc: "Matla, maqta, radif & qafiya",
  },
  {
    label: "Narrative Nazm",
    value: "nazm",
    desc: "Free-flowing themed storytelling",
  },
  {
    label: "Sanskrit Shloka",
    value: "shlok",
    desc: "Chhanda rhythm & ancient wisdom",
  },
  {
    label: "Sant Dohe",
    value: "dohe",
    desc: "Couplets in the vein of Kabir & Rahim",
  },
  {
    label: "Quatrain Rubaiyat",
    value: "rubaiyat",
    desc: "Four-line AABA philosophical verse",
  },
  {
    label: "Zen Haiku",
    value: "haiku",
    desc: "5-7-5 syllabic moment of nature",
  },
  {
    label: "Classical Sonnet",
    value: "sonnet",
    desc: "14-line structured lyrical meditation",
  },
  {
    label: "Elegy Marsiya",
    value: "marsiya",
    desc: "Solemn remembrance and deep lament",
  },
] as const;

interface LanguageDef {
  code: string;
  name: string;
  native: string;
  flag: string;
  accents: string[];
}

/** 22 Indian Scheduled & Classical Languages with Accents */
const INDIAN_LANGUAGES: LanguageDef[] = [
  {
    code: "hi",
    name: "Hindi",
    native: "हिंदी",
    flag: "🇮🇳",
    accents: [
      "Khari Boli (Standard Standard)",
      "Lucknowi Nazakat",
      "Awadhi / Braj Bhasha Classical",
      "Banarasi Hindustani",
      "Delhi / Urban Spoken",
    ],
  },
  {
    code: "ur",
    name: "Urdu",
    native: "اردو",
    flag: "🇮🇳",
    accents: [
      "Lucknowi Dabistan (High Courtly)",
      "Dehlvi Dabistan (Ghalib / Mir)",
      "Dakhni / Hyderabadi Cadence",
      "Panjab / Lahore Dabistan (Iqbal)",
    ],
  },
  {
    code: "roman",
    name: "Hinglish / Roman Urdu",
    native: "Roman",
    flag: "🇮🇳",
    accents: [
      "Urban Indie Lyrical",
      "Poetic Roman Ghazal",
      "Gen-Z Metro Slang",
      "Bollywood Song Cadence",
    ],
  },
  {
    code: "sa",
    name: "Sanskrit",
    native: "संस्कृतम्",
    flag: "🇮🇳",
    accents: [
      "Classical Kalidasa Kavya",
      "Vedic Chhandas (Anushtubh)",
      "Stotra & Mantra Resonance",
      "Vedantic Darshana Rhythm",
    ],
  },
  {
    code: "pa",
    name: "Punjabi",
    native: "ਪੰਜਾਬੀ",
    flag: "🇮🇳",
    accents: [
      "Majhi Central (Amritsar)",
      "Sufi Waris Shah / Bulleh Shah",
      "Doabi Lyrical Folk",
      "Malwai Heroic Cadence",
    ],
  },
  {
    code: "bn",
    name: "Bengali",
    native: "বাংলা",
    flag: "🇮🇳",
    accents: [
      "Rabindrik (Tagore Classical)",
      "Kolkata Shuddho Bhadralok",
      "Kazi Nazrul Rebel Fire",
      "Dhakaiya Melodic Lilt",
    ],
  },
  {
    code: "ta",
    name: "Tamil",
    native: "தமிழ்",
    flag: "🇮🇳",
    accents: [
      "Sangam Classical (Kuruntokai)",
      "Madurai Pandiya Heritage",
      "Chennai Modern Lyrical",
      "Thanjavur Temple Cadence",
    ],
  },
  {
    code: "te",
    name: "Telugu",
    native: "తెలుగు",
    flag: "🇮🇳",
    accents: [
      "Classical Prabandha (Sri Krishna Devaraya)",
      "Krishna-Godavari Andhra Standard",
      "Telangana Yaasa Poetics",
      "Rayalaseema Dramatic Lilt",
    ],
  },
  {
    code: "mr",
    name: "Marathi",
    native: "मराठी",
    flag: "🇮🇳",
    accents: [
      "Sant Sahitya Abhang (Tukaram)",
      "Puneri Shuddha Standard",
      "Konkani / Malvani Coastal Lilt",
      "Varhadi Lyrical Warmth",
    ],
  },
  {
    code: "gu",
    name: "Gujarati",
    native: "ગુજરાતી",
    flag: "🇮🇳",
    accents: [
      "Standard Amdavadi Lyrical",
      "Kathiawadi / Saurashtra Folk",
      "Garba & Sugam Sangeet Cadence",
      "Surati Expressive Lilt",
    ],
  },
  {
    code: "kn",
    name: "Kannada",
    native: "ಕನ್ನಡ",
    flag: "🇮🇳",
    accents: [
      "Halegannada Classical (Pampa/Ranna)",
      "Mysuru Shishta Standard",
      "Mangaluru Coastal Lyrical",
      "Dharwad / North Karnataka Folk",
    ],
  },
  {
    code: "ml",
    name: "Malayalam",
    native: "മലയാളം",
    flag: "🇮🇳",
    accents: [
      "Valluvanadan Classical (Ezhuthachan)",
      "Travancore / Southern Elegance",
      "Malabar Mappila Song Cadence",
      "Cochin Urban Contemporary",
    ],
  },
  {
    code: "or",
    name: "Odia",
    native: "ଓଡ଼ିଆ",
    flag: "🇮🇳",
    accents: [
      "Puri Jagannath Classical (Sarala Das)",
      "Coastal Cuttack Standard",
      "Sambalpuri / Kosali Folk Lilt",
    ],
  },
  {
    code: "as",
    name: "Assamese",
    native: "অসমীয়া",
    flag: "🇮🇳",
    accents: [
      "Borgeet Classical (Sankardev)",
      "Guwahati / Central Lyrical",
      "Goalpariya Folk Cadence",
    ],
  },
  {
    code: "mai",
    name: "Maithili",
    native: "मैथिली",
    flag: "🇮🇳",
    accents: [
      "Vidyapati Geetikavya",
      "Madhubani Folk Tradition",
      "Darbhanga Courtly Cadence",
    ],
  },
  {
    code: "ks",
    name: "Kashmiri",
    native: "کٲشُر / कश्मीरी",
    flag: "🇮🇳",
    accents: [
      "Lal Ded Vakhs / Sufiana Kalam",
      "Srinagar Central Valley",
      "Habba Khatoon Romance Cadence",
    ],
  },
  {
    code: "sd",
    name: "Sindhi",
    native: "سنڌي / सिंधी",
    flag: "🇮🇳",
    accents: [
      "Shah Abdul Latif Bhittai Classical",
      "Vicholo Central Standard",
      "Siraiki Sindhi Melodic Lilt",
    ],
  },
  {
    code: "kok",
    name: "Konkani",
    native: "कोंकणी",
    flag: "🇮🇳",
    accents: [
      "Goan Bardez / Tiswadi Cadence",
      "Mangalorean Coastal Konkani",
      "Saraswat Classical Tone",
    ],
  },
  {
    code: "ne",
    name: "Nepali",
    native: "नेपाली",
    flag: "🇮🇳",
    accents: [
      "Kathmandu Classical Lyrical",
      "Darjeeling / Gorkhali Folk",
      "Bhanubhakta Ramayana Meter",
    ],
  },
  {
    code: "bho",
    name: "Bhojpuri",
    native: "भोजपुरी",
    flag: "🇮🇳",
    accents: [
      "Bhikari Thakur Folk Tradition",
      "Purvanchali Classical",
      "Chapra / Arrah Lyrical Lilt",
    ],
  },
  {
    code: "mwr",
    name: "Rajasthani / Marwari",
    native: "मारवाड़ी",
    flag: "🇮🇳",
    accents: [
      "Mewari Royal Court Poetry",
      "Thar Desert Folk (Mand / Maand)",
      "Shekhawati Heritage Cadence",
    ],
  },
  {
    code: "sat",
    name: "Santhali",
    native: "ᱥᱟᱱᱛᱟᱲᱤ",
    flag: "🇮🇳",
    accents: ["Ol Chiki Classical Tradition", "Mayurbhanj Forest Folk Rhythm"],
  },
];

/** 13 Major Global Languages with Accents */
const GLOBAL_LANGUAGES: LanguageDef[] = [
  {
    code: "en",
    name: "English",
    native: "English",
    flag: "🌐",
    accents: [
      "British Romanticism (Keats / Shelley)",
      "American Spoken Word & Slam",
      "Irish Celtic Lyricism (Yeats)",
      "Victorian Gothic Romance",
      "New York Beat Poetics",
    ],
  },
  {
    code: "ar",
    name: "Arabic",
    native: "العربية",
    flag: "🇸🇦",
    accents: [
      "Classical Fusha (Al-Mutanabbi / Imru' al-Qais)",
      "Andalusian Muwashshah Cadence",
      "Levantine Melodic Lyricism",
      "Gulf Nabati Bedouin Poetry",
    ],
  },
  {
    code: "fa",
    name: "Persian / Farsi",
    native: "فارسی",
    flag: "🇮🇷",
    accents: [
      "Shirazi Ghazal (Hafez & Saadi)",
      "Rumi Sufi Mysticism (Masnavi)",
      "Khorasani Epic (Ferdowsi)",
      "Modern Tehrani Lyrical (Forugh Farrokhzad)",
    ],
  },
  {
    code: "es",
    name: "Spanish",
    native: "Español",
    flag: "🇪🇸",
    accents: [
      "Castilian Golden Age (Cervantes / Quevedo)",
      "Andalusian Flamenco (Federico García Lorca)",
      "Latin American Magical Realism (Pablo Neruda)",
      "Argentine Tango Poetics (Borges)",
    ],
  },
  {
    code: "fr",
    name: "French",
    native: "Français",
    flag: "🇫🇷",
    accents: [
      "Parisian Symbolist (Baudelaire / Rimbaud)",
      "Romantic Grandeur (Victor Hugo)",
      "Provençal Troubadour Song",
      "Existentialist Free Verse",
    ],
  },
  {
    code: "de",
    name: "German",
    native: "Deutsch",
    flag: "🇩🇪",
    accents: [
      "Weimar Classicism (Goethe & Schiller)",
      "Rilkean Existential Lyric",
      "Austrian Fin-de-Siècle (Celan / Trakl)",
      "Romantic Sturm und Drang",
    ],
  },
  {
    code: "it",
    name: "Italian",
    native: "Italiano",
    flag: "🇮🇹",
    accents: [
      "Dantean Dolce Stil Novo (Tuscan)",
      "Petrarchan Romantic Canzoniere",
      "Neapolitan Song Cadence",
      "Venetian Serenata Rhythm",
    ],
  },
  {
    code: "pt",
    name: "Portuguese",
    native: "Português",
    flag: "🇵🇹",
    accents: [
      "Lisbon Fado & Saudade (Fernando Pessoa)",
      "Brazilian Tropicalist (Vinicius de Moraes)",
      "Camões Classical Renaissance",
    ],
  },
  {
    code: "ru",
    name: "Russian",
    native: "Русский",
    flag: "🇷🇺",
    accents: [
      "Silver Age St. Petersburg (Anna Akhmatova / Blok)",
      "Pushkin Golden Cadence",
      "Slavic Melancholy & Deep Solitude",
      "Mayakovsky Revolutionary Rhythm",
    ],
  },
  {
    code: "ja",
    name: "Japanese",
    native: "日本語",
    flag: "🇯🇵",
    accents: [
      "Kyoto Heian Court (Waka & Miyabi)",
      "Edo Haikai Cadence (Matsuo Bashō)",
      "Tokyo Modern Noir Lyric",
    ],
  },
  {
    code: "ko",
    name: "Korean",
    native: "한국어",
    flag: "🇰🇷",
    accents: [
      "Sijo Classical Joseon Court",
      "Seoul Contemporary Melodic Lyric",
      "Han & Deep Poetic Longing",
    ],
  },
  {
    code: "zh",
    name: "Chinese",
    native: "中文",
    flag: "🇨🇳",
    accents: [
      "Tang Dynasty Regulated Verse (Li Bai & Du Fu)",
      "Song Dynasty Ci Lyricism (Su Shi)",
      "Classical Mandarin Poetic Vernacular",
    ],
  },
  {
    code: "tr",
    name: "Turkish",
    native: "Türkçe",
    flag: "🇹🇷",
    accents: [
      "Ottoman Divan Court Verse (Fuzuli)",
      "Anatolian Ashik & Ozan Folk (Yunus Emre)",
      "Modern Istanbul Free Verse (Nazim Hikmet)",
    ],
  },
];

/** Fast one-click prompt ideas */
const PROMPT_CHIPS = [
  "A late night memory of someone special across miles",
  "Courage to rise stronger after heartbreak and grief",
  "Quiet midnight rain tapping on the glass window",
  "Gratitude for peace after a tempestuous storm",
  "The unspoken bond and sacrifice between true companions",
  "Walking alone beneath amber city streetlights",
  "A Sufi prayer for transcendence and quiet liberation",
  "The longing of unreturned letters across seasons",
];

interface VerseItem {
  id: string;
  verse: string;
  en?: string;
  form: string;
  mood: string;
  language?: string;
  accent?: string;
  saved?: boolean;
}

function Generate() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState(
    "A quiet late night thought about distance and longing...",
  );
  const [moodCategory, setMoodCategory] = useState<string>("all");
  const [mood, setMood] = useState<string>("romantic");
  const [form, setForm] = useState<string>("poem");
  const [langTab, setLangTab] = useState<"indian" | "global">("indian");
  const [lang, setLang] = useState<string>("hi");
  const [accent, setAccent] = useState<string>(
    "Khari Boli (Standard Standard)",
  );
  const [busy, setBusy] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [results, setResults] = useState<VerseItem[]>([
    {
      id: "initial-demo",
      verse:
        "तेरे ख़याल की खुशबू हवा में घुलती है,\nये रात तेरे तसव्वुर से ही मुकम्मल है।",
      en: "The fragrance of your memory diffuses into the night breeze;\nthis quiet hour finds its completion only in the thought of you.",
      form: "Shayari",
      mood: "romantic",
      language: "Hindi",
      accent: "Khari Boli (Standard Standard)",
    },
  ]);

  // Poster Modal State
  const [posterVerse, setPosterVerse] = useState<VerseItem | null>(null);

  const activeMoodObj = MOODS.find((m) => m.value === mood) ?? MOODS[0]!;
  const headerRef = useRef<HTMLDivElement>(null);

  // Find active language definition across Indian and Global lists
  const currentLangList =
    langTab === "indian" ? INDIAN_LANGUAGES : GLOBAL_LANGUAGES;
  const currentLangDef =
    INDIAN_LANGUAGES.find((l) => l.code === lang) ??
    GLOBAL_LANGUAGES.find((l) => l.code === lang) ??
    INDIAN_LANGUAGES[0]!;

  // Filtered moods by category
  const filteredMoods =
    moodCategory === "all"
      ? MOODS
      : MOODS.filter((m) => (m as any).category === moodCategory);

  // Event-driven scroll parallax on Generate header
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y > 700) {
          el.style.opacity = "0.15";
          ticking = false;
          return;
        }
        const progress = Math.min(y / 600, 1);
        el.style.transform = `translate3d(0, ${y * 0.12}px, 0)`;
        el.style.opacity = String(Math.max(0.15, 1 - progress * 0.85));
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isPremium = profile?.plan === "premium";

  const handleSelectLanguage = (l: LanguageDef) => {
    soundEffects.playClick();
    if (!isPremium && !FREE_LANG_CODES.has(l.code)) {
      toast.info(
        `${l.name} is a Premium language. Free tier includes 7 Indian languages (Hindi, Urdu, Roman, Sanskrit, Punjabi, Bengali, Tamil).`,
        {
          action: {
            label: "Upgrade (₹99)",
            onClick: () => navigate({ to: "/pricing" }),
          },
        },
      );
      return;
    }
    setLang(l.code);
    if (l.accents && l.accents.length > 0) {
      setAccent(l.accents[0]!);
    }
  };

  const handleSelectForm = (fVal: string) => {
    soundEffects.playClick();
    if (!isPremium && !FREE_FORM_VALUES.has(fVal)) {
      const fObj = FORMS.find((f) => f.value === fVal);
      toast.info(
        `${fObj?.label || "This meter"} is a Premium poetic form. Free tier includes Poem, Sher, Shayari & Haiku.`,
        {
          action: {
            label: "Upgrade (₹99)",
            onClick: () => navigate({ to: "/pricing" }),
          },
        },
      );
      return;
    }
    setForm(fVal);
  };

  const handleSelectMood = (mVal: string) => {
    soundEffects.playClick();
    if (!isPremium && !FREE_MOOD_VALUES.has(mVal)) {
      const mObj = MOODS.find((m) => m.value === mVal);
      toast.info(
        `${mObj?.label || "This mood"} is a Premium emotional mode. Free tier includes 7 essential moods.`,
        {
          action: {
            label: "Upgrade (₹99)",
            onClick: () => navigate({ to: "/pricing" }),
          },
        },
      );
      return;
    }
    setMood(mVal);
  };

  const handleOpenPoster = (item: VerseItem) => {
    soundEffects.playClick();
    if (!isPremium) {
      toast.info(
        "4K Ultra-HD Poster exports are exclusive to Likhasha Premium (₹99/mo).",
        {
          action: {
            label: "Upgrade (₹99)",
            onClick: () => navigate({ to: "/pricing" }),
          },
        },
      );
      return;
    }
    setPosterVerse(item);
  };

  const handleCompose = async () => {
    if (!prompt.trim() || prompt.trim().length < 3) {
      toast.error("Please enter at least a few words describing your emotion.");
      return;
    }

    if (!user) {
      soundEffects.playClick();
      toast.info("Please sign in to compose with the AI poetry engine.", {
        action: {
          label: "Sign in",
          onClick: () => navigate({ to: "/login" }),
        },
      });
      return;
    }

    if (!isPremium) {
      if (profile && profile.dailyCount >= (profile.dailyLimit || 5)) {
        toast.error(
          "You have reached your free daily quota of 5 verses. Upgrade to Premium for unlimited writing.",
          {
            action: {
              label: "Upgrade (₹99)",
              onClick: () => navigate({ to: "/pricing" }),
            },
          },
        );
        return;
      }
      if (!FREE_LANG_CODES.has(lang)) {
        toast.error(
          "Free plan supports 7 Indian languages. Upgrade to Premium for all 35 languages and regional accents.",
          {
            action: {
              label: "Go Premium (₹99)",
              onClick: () => navigate({ to: "/pricing" }),
            },
          },
        );
        return;
      }
      if (!FREE_FORM_VALUES.has(form)) {
        toast.error(
          "Selected poetic form is a Premium tier feature. Upgrade to Premium to compose in this meter.",
          {
            action: {
              label: "Go Premium (₹99)",
              onClick: () => navigate({ to: "/pricing" }),
            },
          },
        );
        return;
      }
      if (!FREE_MOOD_VALUES.has(mood)) {
        toast.error(
          "Selected emotional mood is a Premium tier feature. Upgrade to unlock all 28 emotional dimensions.",
          {
            action: {
              label: "Go Premium (₹99)",
              onClick: () => navigate({ to: "/pricing" }),
            },
          },
        );
        return;
      }
    }

    soundEffects.playClick();
    setBusy(true);
    try {
      const data: GenerateResult = await generateContent({
        input: prompt,
        category: form,
        language: lang,
        mood: mood,
        accent: accent,
      });

      const newItem: VerseItem = {
        id: data.generationId || Date.now().toString(),
        verse: data.content,
        form: data.type || form,
        mood: data.mood || mood,
        language: currentLangDef.name,
        accent: data.accent || accent,
      };

      setResults((prev) => [newItem, ...prev]);
      soundEffects.playChime();
      toast.success("Verse composed by the ink engine.");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to generate verse. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleSave = async (item: VerseItem) => {
    if (!user) {
      toast.error("Please sign in to save verses.");
      return;
    }

    try {
      soundEffects.playChime();
      await saveGeneration({
        content: item.verse,
        type: item.form,
        language: item.language || lang,
        mood: item.mood,
        userInput: prompt,
      });
      setSavedIds((prev) => [...prev, item.id]);
      toast.success("Verse safely inscribed in your library vault.");
    } catch (err: any) {
      toast.error(err.message || "Could not save verse.");
    }
  };

  const handleCopy = (id: string, text: string) => {
    soundEffects.playChime();
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    toast.success("Verse copied to clipboard.");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePromptChip = (chipText: string) => {
    soundEffects.playClick();
    setPrompt(chipText);
  };

  return (
    <SiteShell>
      {/* Poster Generator Modal */}
      {posterVerse && (
        <PoetryPosterModal
          isOpen={!!posterVerse}
          onClose={() => setPosterVerse(null)}
          verse={posterVerse.verse}
          translation={posterVerse.en}
          mood={posterVerse.mood}
          form={posterVerse.form}
        />
      )}

      <section className="relative min-h-screen overflow-hidden px-6 pb-32 pt-36">
        <VideoBackdrop src={VIDEOS.playground} intensity={0.3} blur={3} fixed />

        {/* Dynamic Mood Background Aura & Neural Network */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 transition-all duration-1000"
          style={{
            background: `radial-gradient(ellipse 65% 55% at 50% 30%, ${activeMoodObj.color}18 0%, transparent 70%)`,
          }}
        />
        <NeuralMoodCanvas
          moodColor={activeMoodObj.color}
          isGenerating={busy}
          className="pointer-events-none fixed inset-0 -z-10 opacity-30"
        />

        <div className="relative mx-auto max-w-6xl">
          {/* Header Bar with Parallax */}
          <div ref={headerRef} className="will-change-transform">
            <div
              data-reveal-skew
              className="flex flex-wrap items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: activeMoodObj.color }}
                />
                <p className="font-sans text-[10px] uppercase tracking-[0.45em] text-gold font-medium">
                  AI Studio · {activeMoodObj.label} · {currentLangDef.name} (
                  {accent})
                </p>
              </div>

              {user && profile && (
                <div className="glass-pill flex items-center gap-3 rounded-full px-4 py-1.5 font-sans text-[10px] uppercase tracking-[0.2em] text-white/80">
                  <span>
                    Plan:{" "}
                    <strong className="text-gold">
                      {(profile?.plan || "free").toUpperCase()}
                    </strong>
                  </span>
                  <span>•</span>
                  <span>
                    Daily:{" "}
                    <strong className="text-white">
                      {profile?.dailyCount ?? 0}/{isPremium ? "∞" : 5}
                    </strong>
                  </span>
                </div>
              )}
            </div>

            <h1 className="mt-4 font-display text-[clamp(40px,7vw,92px)] font-light leading-[0.92] tracking-[-0.04em] text-foreground">
              Whisper your thought.{" "}
              <span className="italic text-gold drop-shadow-[0_0_40px_rgba(212,175,55,0.45)]">
                We&apos;ll write it.
              </span>
            </h1>

            <p
              data-reveal
              className="mt-4 max-w-2xl font-sans text-sm sm:text-base leading-relaxed text-mist font-light"
            >
              Craft profound verses across 22 Indian classical languages and 13
              major global traditions. Choose from 28 emotional dimensions, 11
              poetic meters, and distinct regional cadences.
            </p>

            {/* Quick Inspiration Chips */}
            <div
              data-reveal-zoom
              style={{ ["--reveal-delay" as string]: "150ms" }}
              className="mt-8 flex flex-wrap items-center gap-2"
            >
              <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-faint mr-1">
                Ideas:
              </span>
              {PROMPT_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handlePromptChip(chip)}
                  className="glass-pill rounded-full px-3.5 py-1 text-xs text-white/70 hover:text-white hover:border-gold/50 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Creation Card with Aggressive 3D Rotate Reveal */}
          <div
            data-reveal-rotate
            style={{ ["--reveal-delay" as string]: "200ms" }}
          >
            <GlassSpotlightCard className="mt-6 rounded-3xl p-6 md:p-10 border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
              <div className="flex items-center justify-between">
                <label
                  className="font-sans text-[10px] uppercase tracking-[0.3em] text-white/60"
                  htmlFor="prompt"
                >
                  Your Emotion, Theme, or Narrative
                </label>
                <span className="font-sans text-[10px] text-faint">
                  {prompt.length} / 500 characters
                </span>
              </div>

              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                maxLength={500}
                rows={3}
                className="mt-3 w-full resize-none rounded-2xl border border-white/12 bg-white/[0.03] backdrop-blur-2xl p-5 font-display text-xl sm:text-2xl text-white outline-none transition-all duration-300 placeholder:text-white/25 focus:border-gold focus:bg-white/[0.06] focus:shadow-[0_0_30px_rgba(212,175,55,0.15)]"
                placeholder="Write what you feel — a quiet memory, heartbreak, victory, spiritual longing, or midnight rain..."
              />

              {/* Controls Grid */}
              <div className="mt-8 space-y-8">
                {/* 1. 28 Moods Selector with Category Filter */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-white/50">
                      1. Emotional Dimension ({MOODS.length} Modes)
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className="font-sans text-[10px] uppercase tracking-wider font-medium px-2.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${activeMoodObj.color}25`,
                          color: activeMoodObj.color,
                        }}
                      >
                        Active: {activeMoodObj.label}
                      </span>
                    </div>
                  </div>

                  {/* Category Filter Chips */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {MOOD_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          soundEffects.playClick();
                          setMoodCategory(cat.id);
                        }}
                        className={cn(
                          "px-2.5 py-1 rounded-full text-[11px] font-sans transition-all duration-200",
                          moodCategory === cat.id
                            ? "bg-white/15 text-gold font-medium border border-gold/40"
                            : "text-white/40 hover:text-white/70",
                        )}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                    {filteredMoods.map((m, idx) => {
                      const isSelected = mood === m.value;
                      const isLocked =
                        !isPremium && !FREE_MOOD_VALUES.has(m.value);
                      const Icon = m.icon;
                      return (
                        <button
                          key={m.value}
                          data-reveal-zoom
                          style={{
                            ["--reveal-delay" as string]: `${idx * 15}ms`,
                          }}
                          onClick={() => handleSelectMood(m.value)}
                          className={cn(
                            "rounded-full px-3.5 py-1.5 font-sans text-xs tracking-wide transition-all duration-200 flex items-center gap-1.5",
                            isSelected
                              ? "bg-gold text-ink font-semibold shadow-[0_0_16px_rgba(212,175,55,0.4)] scale-105"
                              : "glass-pill text-white/60 hover:text-white hover:border-white/30",
                            isLocked &&
                              "opacity-80 border-dashed border-gold/30",
                          )}
                        >
                          <Icon
                            className="w-3 h-3"
                            style={{ color: isSelected ? "#080810" : m.color }}
                          />
                          <span>{m.label}</span>
                          {isLocked && (
                            <Lock className="w-2.5 h-2.5 text-gold/80 ml-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Poetic Form & Meter (11 Forms) */}
                <div className="pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-white/50">
                      2. Poetic Form &amp; Meter ({FORMS.length} Forms)
                    </p>
                    <span className="font-sans text-[10px] text-mist/70">
                      Selected:{" "}
                      <strong className="text-gold font-medium">
                        {FORMS.find((f) => f.value === form)?.label}
                      </strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {FORMS.map((f) => {
                      const isSelected = form === f.value;
                      const isLocked =
                        !isPremium && !FREE_FORM_VALUES.has(f.value);
                      return (
                        <button
                          key={f.value}
                          onClick={() => handleSelectForm(f.value)}
                          className={cn(
                            "rounded-xl px-3 py-2 font-sans text-xs text-left transition-all duration-200 flex flex-col justify-between min-h-[58px]",
                            isSelected
                              ? "bg-gold text-ink font-medium shadow-[0_0_14px_rgba(212,175,55,0.4)] scale-[1.02]"
                              : "glass-pill text-white/70 hover:text-white hover:border-white/30",
                            isLocked &&
                              "opacity-85 border-dashed border-gold/30",
                          )}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span
                              className={cn(
                                "font-medium text-xs truncate",
                                isSelected ? "text-ink" : "text-white",
                              )}
                            >
                              {f.label}
                            </span>
                            {isLocked && (
                              <Lock className="w-2.5 h-2.5 text-gold/90 shrink-0 ml-1" />
                            )}
                          </div>
                          <span
                            className={cn(
                              "text-[9px] truncate",
                              isSelected ? "text-ink/80" : "text-mist/70",
                            )}
                          >
                            {f.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Language & Regional Accent Section */}
                <div className="pt-6 border-t border-white/10 space-y-6">
                  {/* Language Region Tabs */}
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-white/50">
                        3. Language &amp; Script Selection
                      </p>

                      <div className="flex items-center gap-1 glass-pill p-1 rounded-full">
                        <button
                          onClick={() => {
                            soundEffects.playClick();
                            setLangTab("indian");
                            if (
                              !INDIAN_LANGUAGES.some((l) => l.code === lang)
                            ) {
                              handleSelectLanguage(INDIAN_LANGUAGES[0]!);
                            }
                          }}
                          className={cn(
                            "px-3.5 py-1 rounded-full text-xs font-sans transition-all duration-200 flex items-center gap-1.5",
                            langTab === "indian"
                              ? "bg-gold text-ink font-semibold shadow-[0_0_10px_rgba(212,175,55,0.3)]"
                              : "text-white/60 hover:text-white",
                          )}
                        >
                          <span>🇮🇳</span>
                          <span>
                            Indian Languages ({INDIAN_LANGUAGES.length})
                          </span>
                        </button>

                        <button
                          onClick={() => {
                            soundEffects.playClick();
                            setLangTab("global");
                            if (
                              !GLOBAL_LANGUAGES.some((l) => l.code === lang)
                            ) {
                              handleSelectLanguage(GLOBAL_LANGUAGES[0]!);
                            }
                          }}
                          className={cn(
                            "px-3.5 py-1 rounded-full text-xs font-sans transition-all duration-200 flex items-center gap-1.5",
                            langTab === "global"
                              ? "bg-gold text-ink font-semibold shadow-[0_0_10px_rgba(212,175,55,0.3)]"
                              : "text-white/60 hover:text-white",
                          )}
                        >
                          <Globe className="w-3 h-3" />
                          <span>
                            Global Languages ({GLOBAL_LANGUAGES.length})
                          </span>
                          {!isPremium && (
                            <Lock className="w-2.5 h-2.5 text-gold/80" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Languages Grid */}
                    <div className="flex flex-wrap gap-2 max-h-44 overflow-y-auto pr-1">
                      {currentLangList.map((l) => {
                        const isSelected = lang === l.code;
                        const isLocked =
                          !isPremium &&
                          (langTab === "global" ||
                            !FREE_LANG_CODES.has(l.code));
                        return (
                          <button
                            key={l.code}
                            onClick={() => handleSelectLanguage(l)}
                            className={cn(
                              "rounded-full px-3.5 py-1.5 font-sans text-xs transition-all duration-200 flex items-center gap-1.5",
                              isSelected
                                ? "bg-gold text-ink font-semibold shadow-[0_0_12px_rgba(212,175,55,0.4)] scale-105"
                                : "glass-pill text-white/70 hover:text-white hover:border-white/30",
                              isLocked &&
                                "opacity-80 border-dashed border-gold/30",
                            )}
                          >
                            <span>{l.flag}</span>
                            <span>{l.name}</span>
                            <span
                              className={cn(
                                "text-[10px]",
                                isSelected ? "text-ink/80" : "text-gold/70",
                              )}
                            >
                              ({l.native})
                            </span>
                            {isLocked && (
                              <Lock className="w-2.5 h-2.5 text-gold/80 ml-0.5" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4. Regional Dialect & Accent Selection */}
                  <div className="rounded-2xl border border-gold/20 bg-white/[0.02] p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-gold font-medium">
                        4. Regional Accent &amp; Poetic Cadence for{" "}
                        {currentLangDef.name} ({currentLangDef.native})
                      </p>
                      <span className="font-sans text-[10px] text-mist/80">
                        Active:{" "}
                        <strong className="text-white font-medium">
                          {accent}
                        </strong>
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {currentLangDef.accents.map((acc) => {
                        const isSelected = accent === acc;
                        return (
                          <button
                            key={acc}
                            onClick={() => {
                              soundEffects.playClick();
                              setAccent(acc);
                            }}
                            className={cn(
                              "rounded-full px-3.5 py-1.5 font-sans text-xs transition-all duration-200 flex items-center gap-1.5",
                              isSelected
                                ? "bg-white/20 text-gold border border-gold/60 font-semibold shadow-[0_0_12px_rgba(212,175,55,0.25)]"
                                : "glass-pill text-white/60 hover:text-white hover:border-white/30",
                            )}
                          >
                            <Sparkles className="w-2.5 h-2.5 text-gold" />
                            <span>{acc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-white/10 pt-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleCompose}
                    disabled={busy}
                    className="flex items-center gap-2.5 rounded-full btn-gold px-10 py-4 font-sans text-[11px] uppercase tracking-[0.28em] font-medium transition-all duration-500 disabled:opacity-60 shadow-[var(--shadow-gold)] hover:scale-105"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {busy ? "Condensing gold ink..." : "Compose Poetry"}
                    </span>
                  </button>

                  <span className="font-sans text-[11px] text-mist hidden sm:inline">
                    {activeMoodObj.label} ·{" "}
                    {FORMS.find((f) => f.value === form)?.label} ·{" "}
                    {currentLangDef.name} ({accent})
                  </span>
                </div>

                {!user && (
                  <div className="flex items-center gap-2 text-xs text-mist font-sans">
                    <Lock className="w-3.5 h-3.5 text-gold" />
                    <span>
                      <Link
                        to="/login"
                        className="text-gold underline hover:text-gold-bright"
                      >
                        Sign in
                      </Link>{" "}
                      to unlock AI generation &amp; vault saves.
                    </span>
                  </div>
                )}
              </div>
            </GlassSpotlightCard>
          </div>

          {/* Generated Results Stream Title */}
          <div
            data-reveal-skew
            className="mt-16 mb-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold" />
              <h3 className="font-sans text-[11px] uppercase tracking-[0.35em] text-gold font-medium">
                Live Creations &amp; Saved Verses
              </h3>
            </div>
            <span className="font-sans text-[10px] tracking-[0.25em] text-faint">
              {results.length} Verse{results.length === 1 ? "" : "s"}{" "}
              Materialized
            </span>
          </div>

          {/* Generated Results Stream with Dynamic Reveal Variants */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {busy && (
              <div
                data-reveal-zoom
                className="glass-vision h-64 animate-pulse rounded-2xl p-8 flex flex-col justify-center items-center border border-gold/40"
              >
                <div className="w-9 h-9 rounded-full border-2 border-gold border-t-transparent animate-spin mb-4" />
                <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-gold font-medium">
                  Sculpting your verse...
                </p>
                <p className="text-xs text-mist mt-2 text-center">
                  Infusing {currentLangDef.name} ({accent}) cadence into{" "}
                  {FORMS.find((f) => f.value === form)?.label}
                </p>
              </div>
            )}

            {results.map((r, i) => {
              const revealAttr =
                i % 3 === 0
                  ? "data-reveal-left"
                  : i % 3 === 1
                    ? "data-reveal-zoom"
                    : "data-reveal-right";
              return (
                <div
                  key={r.id || i}
                  {...{ [revealAttr]: "" }}
                  style={{ ["--reveal-delay" as string]: `${(i % 3) * 120}ms` }}
                >
                  <TiltCard className="glass-vision h-full rounded-2xl p-8 flex flex-col justify-between border border-white/12 hover:border-gold/40 transition-all duration-500 hover:shadow-[0_15px_40px_rgba(0,0,0,0.7)]">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-gold font-medium">
                            {r.form} · {r.mood}
                          </span>
                          {r.accent && (
                            <span className="glass-pill rounded-full px-2 py-0.5 font-sans text-[9px] text-white/70">
                              {r.accent}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSave(r)}
                            disabled={savedIds.includes(r.id)}
                            className={cn(
                              "transition-colors p-1 rounded-full",
                              savedIds.includes(r.id)
                                ? "text-gold"
                                : "text-faint hover:text-gold",
                            )}
                            title={
                              savedIds.includes(r.id)
                                ? "Saved to vault"
                                : "Save to library"
                            }
                          >
                            {savedIds.includes(r.id) ? (
                              <BookmarkCheck className="w-4 h-4" />
                            ) : (
                              <Bookmark className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <p className="mt-6 font-display text-2xl sm:text-3xl italic leading-[1.3] text-foreground whitespace-pre-line">
                        &ldquo;{r.verse}&rdquo;
                      </p>

                      {r.en && (
                        <p className="mt-3 font-sans text-xs text-mist/80 leading-relaxed font-light">
                          {r.en}
                        </p>
                      )}
                    </div>

                    <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                      <button
                        onClick={() => handleCopy(r.id, r.verse)}
                        className="flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-[0.24em] text-gold hover:text-gold-bright transition-colors"
                      >
                        {copiedId === r.id ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedId === r.id ? "Copied" : "Copy"}</span>
                      </button>

                      <button
                        onClick={() => handleOpenPoster(r)}
                        className="glass-pill flex items-center gap-1.5 rounded-full px-3 py-1 font-sans text-[10px] uppercase tracking-[0.2em] text-white/80 hover:text-white hover:border-gold transition-colors"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-gold" />
                        <span>Create Poster</span>
                        {!isPremium && (
                          <Lock className="w-2.5 h-2.5 text-gold/80" />
                        )}
                      </button>
                    </div>
                  </TiltCard>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
