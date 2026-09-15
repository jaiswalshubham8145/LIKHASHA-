import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { VideoBackdrop } from "@/components/site/VideoBackdrop";

import { VIDEOS } from "@/lib/media";
import { cn } from "@/lib/utils";
import { GlassSpotlightCard } from "@/components/site/GlassSpotlightCard";
import { soundEffects } from "@/hooks/useSoundEffects";
import { Sparkles, ArrowUpRight, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const MOOD_ORBS = [
  { id: "love", label: "Love", color: "#ff7597", desc: "Warm devotion" },
  { id: "sad", label: "Heartbreak", color: "#60a5fa", desc: "Ache & longing" },
  {
    id: "fire",
    label: "Fire & Grit",
    color: "#f97316",
    desc: "Rising stronger",
  },
  {
    id: "peace",
    label: "Inner Peace",
    color: "#c084fc",
    desc: "Stillness & soul",
  },
  { id: "dark", label: "Midnight", color: "#94a3b8", desc: "Solitude & rain" },
  { id: "joy", label: "Joy", color: "#facc15", desc: "Laughter & light" },
  { id: "wisdom", label: "Wisdom", color: "#eab308", desc: "Time & destiny" },
  { id: "hope", label: "Hope", color: "#34d399", desc: "New beginnings" },
] as const;

type ScriptKey = "en" | "roman" | "hi" | "ur";

interface VerseContent {
  en: string;
  roman: string;
  hi: string;
  ur: string;
  poet: string;
  meter: string;
}

const MULTILINGUAL_VERSES: Record<string, VerseContent> = {
  love: {
    en: "You are the quiet thought that lingers softly after every prayer.",
    roman: "Tum wo khamosh dua ho jo har ibadat ke baad thehar jaati hai.",
    hi: "तुम वो ख़ामोश दुआ हो जो हर इबादत के बाद ठहर जाती है।",
    ur: "تم وہ خاموش دعا ہو جو ہر عبادت کے بعد ٹھہر جاتی ہے۔",
    poet: "Romantic Ghazal",
    meter: "Bahr-e-Khafif · Flowing",
  },
  sad: {
    en: "Even the night questions the moon about the tears we hide in silence.",
    roman:
      "Raat bhi poochti hai chaand se un aansuon ka sabab jo chhupa liye gaye.",
    hi: "रात भी पूछती है चाँद से उन आँसुओं का सबब जो छुपा लिए गए।",
    ur: "رات بھی پوچھتی ہے چاند سے ان آنسوؤں کا سبب جو چھپا لیے گئے۔",
    poet: "Melancholic Sher",
    meter: "Dard-e-Dil · Slow",
  },
  fire: {
    en: "I did not walk through the inferno merely to settle as ashes.",
    roman:
      "Raakh hone ke liye aag se nahi guzra tha main, uthna meri fitrat hai.",
    hi: "राख होने के लिए आग से नहीं गुज़रा था मैं, उठना मेरी फ़ितरत है।",
    ur: "راکھ ہونے کے لیے آگ سے نہیں گزرا تھا میں، اٹھنا میری فطرت ہے۔",
    poet: "Motivational Nazm",
    meter: "Josh & Vīrya · Resonant",
  },
  peace: {
    en: "Beyond all worldly clamor, the soul dissolves into unshakeable stillness.",
    roman: "Shor se pare jab rooh khud se milti hai, tab sukoon paati hai.",
    hi: "शोर से परे जब रूह ख़ुद से मिलती है, तब सुकून पाती है।",
    ur: "شور سے پرے جب روح خود سے ملتی ہے، تب سکون پاتی ہے۔",
    poet: "Sufi Verse",
    meter: "Ruhani · Meditative",
  },
  dark: {
    en: "Midnight knows all the truths that daylight never dared to confront.",
    roman: "Aadhi raat wo sab jaanti hai jo roshni ne kabhi poocha hi nahi.",
    hi: "आधी रात वो सब जानती है जो रोशनी ने कभी पूछा ही नहीं।",
    ur: "آدھی رات وہ سب جانتی ہے جو روشنی نے کبھی پوچھا ہی نہیں۔",
    poet: "Dark Poetics",
    meter: "Tanhaayi · Introspective",
  },
  joy: {
    en: "Your laughter fills the empty corners of this world with golden warmth.",
    roman: "Tumhari hansi is jahaan ke veerane ko bahaaron se bhar deti hai.",
    hi: "तुम्हारी हँसी इस जहाँ के वीराने को बहारों से भर देती है।",
    ur: "تمہاری ہنسی اس جہاں کے ویرانے کو بہاروں سے بھر دیتی ہے۔",
    poet: "Celebration Poem",
    meter: "Khushnuma · Lively",
  },
  wisdom: {
    en: "Time does not heal by erasing; it simply teaches the heart how to bear.",
    roman:
      "Waqt bhulata nahi zakhm, bas seene mein dard sehne ka hunar deta hai.",
    hi: "वक़्त भुलाता नहीं ज़ख़्म, बस सीने में दर्द सहने का हुनर देता है।",
    ur: "وقت بھلاتا نہیں زخم، بس سینے میں درد سہنے کا ہنر دیتا ہے۔",
    poet: "Philosophical Quote",
    meter: "Hikmat · Timeless",
  },
  hope: {
    en: "No matter how dense the darkness, morning has never broken its promise.",
    roman: "Andheri se andheri raat bhi subah ki pehli kiran rok nahi sakti.",
    hi: "अंधेरी से अंधेरी रात भी सुबह की पहली किरण रोक नहीं सकती।",
    ur: "اندھیری سے اندھیری رات بھی صبح کی پہلی کرن روک نہیں سکتی۔",
    poet: "Resilience Line",
    meter: "Umeed · Uplifting",
  },
};

const SCRIPTS: { key: ScriptKey; label: string }[] = [
  { key: "en", label: "English" },
  { key: "roman", label: "Roman Urdu/Hindi" },
  { key: "hi", label: "Hindi (हिंदी)" },
  { key: "ur", label: "Urdu (اردو)" },
];

export function Playground() {
  const [selectedMood, setSelectedMood] = useState<string>("love");
  const [activeScript, setActiveScript] = useState<ScriptKey>("en");
  const [copied, setCopied] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const zone = useRef<HTMLDivElement>(null);

  // Auto-change active mood every 3 seconds to the adjacent orb
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setSelectedMood((prev) => {
        const currentIndex = MOOD_ORBS.findIndex((m) => m.id === prev);
        const nextIndex = (currentIndex + 1) % MOOD_ORBS.length;
        // Cinematic audio tone progression on mood cycle
        try {
          soundEffects.playMoodTone(360 + nextIndex * 40);
        } catch {
          // ignore audio context restrictions
        }
        return MOOD_ORBS[nextIndex]!.id;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, []);

  const onDrag = (e: React.PointerEvent<HTMLButtonElement>) => {
    setIsPaused(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);

    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    const start = { x: e.clientX, y: e.clientY };
    const base = {
      x: parseFloat(el.dataset["x"] ?? "0"),
      y: parseFloat(el.dataset["y"] ?? "0"),
    };

    const move = (ev: PointerEvent) => {
      const x = base.x + (ev.clientX - start.x);
      const y = base.y + (ev.clientY - start.y);
      el.dataset["x"] = String(x);
      el.dataset["y"] = String(y);
      el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.1)`;
    };

    const up = () => {
      el.style.transition = "transform 0.9s var(--ease-spring)";
      el.dataset["x"] = "0";
      el.dataset["y"] = "0";
      el.style.transform = "translate3d(0,0,0) scale(1)";
      window.setTimeout(() => (el.style.transition = ""), 900);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      // Resume auto-cycling after 8 seconds of idle
      pauseTimerRef.current = setTimeout(() => setIsPaused(false), 8000);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const handleMoodClick = (id: string) => {
    soundEffects.playClick();
    setSelectedMood(id);
    // Pause auto-rotation for 8 seconds upon manual user click
    setIsPaused(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => setIsPaused(false), 8000);
  };

  const currentVerse =
    MULTILINGUAL_VERSES[selectedMood] ?? MULTILINGUAL_VERSES["love"]!;
  const currentOrb =
    MOOD_ORBS.find((m) => m.id === selectedMood) ?? MOOD_ORBS[0]!;

  const handleCopy = () => {
    soundEffects.playChime();
    const textToCopy = currentVerse[activeScript] || currentVerse.en;
    navigator.clipboard?.writeText(textToCopy);
    setCopied(true);
    toast.success("Verse copied to clipboard.");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative z-10 overflow-hidden py-32 border-b border-border/60">
      <VideoBackdrop src={VIDEOS.playground} intensity={0.4} blur={2} />

      <div ref={zone} className="relative mx-auto max-w-7xl px-6">
        <div data-reveal-right className="mb-12 max-w-2xl">
          <p className="mb-4 font-sans text-[10px] uppercase tracking-[0.5em] text-gold">
            Interactive Touch Constellation
          </p>
          <h2 className="font-display text-[clamp(32px,5vw,66px)] font-light leading-[0.95] tracking-[-0.03em] text-foreground">
            Drag any mood.{" "}
            <span className="italic text-gold">Feel the language bend.</span>
          </h2>
          <p className="mt-4 font-sans text-sm sm:text-base leading-relaxed text-mist font-light">
            Toss or tap the mood orbs below. Every emotion renders live poetic
            symmetry across English, Hindi, Urdu, and Roman scripts.
          </p>
        </div>

        {/* 8 Draggable Mood Orbs Constellation */}
        <div className="mb-14 flex flex-wrap gap-4 select-none">
          {MOOD_ORBS.map((m, idx) => {
            const isSelected = selectedMood === m.id;
            return (
              <button
                key={m.id}
                data-reveal-zoom
                style={{ ["--reveal-delay" as string]: `${idx * 60}ms` }}
                onPointerDown={onDrag}
                onClick={() => handleMoodClick(m.id)}
                className={cn(
                  "glass-vision relative h-24 w-24 sm:h-28 sm:w-28 rounded-full font-sans transition-all duration-500 flex flex-col items-center justify-center p-3 text-center cursor-grab active:cursor-grabbing",
                  isSelected
                    ? "bg-white/20 text-white shadow-[0_0_50px_rgba(212,175,55,0.65)] border-gold scale-110 shockwave-active-orb z-20"
                    : "text-white/60 hover:text-white border-white/10 hover:border-white/25 hover:bg-white/5 hover:scale-105",
                )}
              >
                {isSelected && (
                  <>
                    {/* Multi-layered cinematic shockwave ping */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -inset-2 rounded-full border border-gold/60 animate-ping opacity-40"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -inset-1 rounded-full border border-gold/40 animate-pulse"
                    />
                  </>
                )}
                <span
                  className="h-2.5 w-2.5 rounded-full mb-1.5 transition-all duration-300"
                  style={{
                    backgroundColor: m.color,
                    boxShadow: isSelected
                      ? `0 0 16px ${m.color}, 0 0 32px ${m.color}`
                      : "none",
                  }}
                />
                <span className="font-semibold text-xs tracking-wider uppercase text-white">
                  {m.label}
                </span>
                <span className="text-[9px] text-mist/90 mt-0.5 tracking-tight hidden sm:block">
                  {m.desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* Interactive Live Verse Card with Dynamic Cosmic Nebula (without glare sheen) */}
        <div data-reveal-rotate className="relative">
          {/* Breathing Nebula Aura tuned to active orb */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl opacity-35 blur-3xl transition-colors duration-1000 nebula-pulse"
            style={{
              background: `radial-gradient(ellipse 65% 50% at 50% 50%, ${currentOrb.color} 0%, transparent 70%)`,
            }}
          />

          <GlassSpotlightCard className="relative overflow-hidden grid gap-8 rounded-3xl p-8 md:grid-cols-3 md:p-12 border border-white/20 shadow-[0_20px_70px_rgba(0,0,0,0.85)]">
            <div className="md:col-span-2 flex flex-col justify-between">
              {/* Script Selector Tabs */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-mist mr-2">
                    Script:
                  </span>
                  {SCRIPTS.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => {
                        soundEffects.playClick();
                        setActiveScript(s.key);
                      }}
                      className={cn(
                        "rounded-full px-3.5 py-1 text-[11px] font-sans transition-all duration-200",
                        activeScript === s.key
                          ? "bg-gold text-ink font-semibold shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                          : "glass-pill text-white/60 hover:text-white",
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {/* Dynamic Verse Output */}
                <div className="min-h-32 flex items-center">
                  <p
                    className={cn(
                      "text-[clamp(24px,3.5vw,46px)] leading-relaxed text-foreground transition-all duration-400",
                      activeScript === "ur"
                        ? "font-display text-right text-gold"
                        : activeScript === "hi"
                          ? "font-display italic text-foreground"
                          : "font-display italic text-foreground",
                    )}
                  >
                    &ldquo;{currentVerse[activeScript]}&rdquo;
                  </p>
                </div>

                {/* English Sub-translation if not in English */}
                {activeScript !== "en" && (
                  <p className="mt-4 font-sans text-sm text-mist/80 italic leading-relaxed">
                    Meaning: {currentVerse.en}
                  </p>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-4">
                <button
                  onClick={handleCopy}
                  className="glass-pill flex items-center gap-2 rounded-full px-5 py-2 font-sans text-[11px] uppercase tracking-[0.24em] text-white/90 hover:text-white hover:border-gold"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-gold" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copied ? "Copied" : "Copy Verse"}</span>
                </button>

                <Link
                  to="/generate"
                  className="flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.24em] text-gold hover:text-gold-bright transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Compose with this mood in Studio</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Column: Meter & Resonance Metadata */}
            <div className="flex flex-col justify-between gap-6 border-t border-white/10 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-gold">
                  Active Emotion
                </p>
                <p className="mt-1 font-display text-2xl text-white font-light">
                  {currentOrb.label}
                </p>
                <p className="text-xs text-mist mt-1">{currentOrb.desc}</p>
              </div>

              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-faint">
                  Poetic Genre
                </p>
                <p className="mt-1 font-display text-lg text-white/90">
                  {currentVerse.poet}
                </p>
              </div>

              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-faint">
                  Classical Meter
                </p>
                <p className="mt-1 font-sans text-sm text-mist">
                  {currentVerse.meter}
                </p>
              </div>

              <div className="glass-pill rounded-xl p-4 bg-white/[0.02]">
                <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-faint">
                  Emotional Resonance
                </span>
                <div className="flex items-center justify-between mt-2">
                  <div className="h-1.5 flex-1 bg-white/10 rounded-full mr-3 overflow-hidden">
                    <div className="h-full bg-gold rounded-full w-[98%]" />
                  </div>
                  <span className="font-sans text-xs text-gold font-semibold">
                    99.4%
                  </span>
                </div>
              </div>
            </div>
          </GlassSpotlightCard>
        </div>
      </div>
    </section>
  );
}
