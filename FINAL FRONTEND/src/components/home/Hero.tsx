import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { VideoBackdrop } from "@/components/site/VideoBackdrop";
import { InkParticles } from "@/components/site/InkParticles";
import { VIDEOS } from "@/lib/media";
import { soundEffects } from "@/hooks/useSoundEffects";
import { Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const QUICK_MOODS = [
  {
    id: "love",
    label: "Love",
    preview: "You are the quiet thought that lingers after every prayer.",
    hi: "तुम वो ख़ामोश दुआ हो जो हर इबादत के बाद ठहर जाती है।",
    color: "#ff7597",
  },
  {
    id: "heartbreak",
    label: "Heartbreak",
    preview: "Even silence speaks in volumes when two souls begin to part.",
    hi: "ख़ामोशी भी चीख़ उठती है जब दो रूहें जुदा होने लगती हैं।",
    color: "#60a5fa",
  },
  {
    id: "motivation",
    label: "Fire",
    preview: "I did not survive the fire merely to become cold ash.",
    hi: "राख होने के लिए आग से नहीं गुज़रा था मैं, उठना मेरी फ़ितरत है।",
    color: "#f97316",
  },
  {
    id: "peace",
    label: "Peace",
    preview:
      "Beyond all worldly noise, the soul rests in unshakeable stillness.",
    hi: "शोर से परे, रूह जब ख़ुद से मिलती है तो ख़ुदा मिल जाता है।",
    color: "#c084fc",
  },
  {
    id: "midnight",
    label: "Midnight",
    preview: "The night knows all the secrets that daylight dares not ask.",
    hi: "रात वो सब जानती है जो उजाले कभी पूछने की हिम्मत नहीं करते।",
    color: "#94a3b8",
  },
  {
    id: "hope",
    label: "Hope",
    preview: "The darkest hour holds the first golden promise of dawn.",
    hi: "अंधेरी से अंधेरी रात भी सुबह की पहली किरण रोक नहीं सकती।",
    color: "#34d399",
  },
];

export function Hero() {
  const wrap = useRef<HTMLDivElement>(null);
  const [activeMood, setActiveMood] = useState(QUICK_MOODS[0]!);
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-change active mood every 3 seconds with subtle sound
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveMood((prev) => {
        const currentIndex = QUICK_MOODS.findIndex((m) => m.id === prev.id);
        const nextIndex = (currentIndex + 1) % QUICK_MOODS.length;
        const nextMood = QUICK_MOODS[nextIndex]!;
        try {
          soundEffects.playMoodTone(440 + nextIndex * 30);
        } catch {
          // ignore
        }
        return nextMood;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Event-driven scroll parallax — high performance, 0 idle CPU usage
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y > 1000) {
          el.style.opacity = "0";
          ticking = false;
          return;
        }
        const progress = Math.min(y / 900, 1);
        el.style.transform = `translate3d(0, ${y * 0.18}px, 0) scale(${1 - progress * 0.08})`;
        el.style.opacity = String(Math.max(0, 1 - progress * 1.2));
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMoodSelect = (mood: (typeof QUICK_MOODS)[0]) => {
    soundEffects.playClick();
    setActiveMood(mood);
    // Pause auto-rotation for 8 seconds upon manual user selection
    setIsPaused(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => setIsPaused(false), 8000);
  };

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-20 pb-16">
      <VideoBackdrop src={VIDEOS.hero} intensity={0.5} blur={1} />
      <InkParticles
        className="absolute inset-0 h-full w-full opacity-80"
        count={120}
      />

      {/* Dynamic Cinematic Ambient Nebula */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/4 h-[500px] w-[500px] rounded-full nebula-pulse -z-10"
        style={{
          background: `radial-gradient(circle, ${activeMood.color}30 0%, transparent 70%)`,
        }}
      />

      <div
        ref={wrap}
        className="relative z-10 mx-auto w-full max-w-7xl px-6 will-change-transform"
      >
        {/* Top Tagline */}
        <div
          className="mb-6 flex flex-wrap items-center gap-3"
          style={{ animation: "rise-in 1.1s var(--ease-out-expo) 0.15s both" }}
        >
          <span className="glass-pill inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-sans text-[10px] uppercase tracking-[0.32em] text-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
            AI Poetry &amp; Quote Studio
          </span>
          <span className="font-sans text-[11px] tracking-[0.25em] text-mist hidden sm:inline">
            · Har lafz ek nasha 🌙
          </span>
        </div>

        <div className="relative">
          <h1 className="font-display font-light leading-[1.08] sm:leading-[1.14] tracking-[-0.035em] overflow-visible">
            <span className="block text-[length:var(--text-hero-giant)] text-foreground drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              Write what
            </span>
            <div className="text-right overflow-visible py-2">
              <span className="mt-4 sm:mt-8 inline-block text-[length:var(--text-hero-giant)] italic text-gold-gradient drop-shadow-[0_0_80px_rgba(212,175,55,0.45)] pb-6 sm:pb-10 pr-6 overflow-visible">
                you feel.
              </span>
            </div>
          </h1>
        </div>

        {/* Subtitle with Flow Mask & Slow Dissolve */}
        <p
          className="mt-8 max-w-2xl font-sans text-base sm:text-lg font-light leading-relaxed text-mist"
          style={{ animation: "rise-in 1.2s var(--ease-out-expo) 0.7s both" }}
        >
          Every emotion deserves its verse. Likhasha crafts stunning poetry,
          heartfelt shayari, and timeless quotes in English, Hindi, and Urdu
          from a single thought.
        </p>

        {/* Interactive Live Mood Preview Bar (clean glass without harsh glare) */}
        <div
          className="mt-10 rounded-2xl glass-vision p-6 sm:p-7 max-w-3xl border border-white/12 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(212,175,55,0.15)]"
          style={{ animation: "rise-in 1.2s var(--ease-out-expo) 0.85s both" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <span className="font-sans text-[10px] uppercase tracking-[0.32em] text-mist/80">
              Tap a feeling to feel the verse
            </span>
            <span
              className="font-sans text-[10px] uppercase tracking-[0.25em] px-2.5 py-0.5 rounded-full font-medium transition-all duration-500 shadow-md"
              style={{
                backgroundColor: `${activeMood.color}35`,
                color: activeMood.color,
              }}
            >
              {activeMood.label}
            </span>
          </div>

          {/* Quick Mood Chips */}
          <div className="flex flex-wrap gap-2 mb-5">
            {QUICK_MOODS.map((m) => {
              const active = activeMood.id === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleMoodSelect(m)}
                  className={cn(
                    "rounded-full px-4 py-1.5 font-sans text-[11px] tracking-[0.18em] uppercase transition-all duration-300 flex items-center gap-1.5",
                    active
                      ? "bg-gold text-ink font-semibold shadow-[0_0_20px_rgba(212,175,55,0.45)] scale-105"
                      : "glass-pill text-white/70 hover:text-white hover:border-gold/40",
                  )}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: active ? "#080810" : m.color }}
                  />
                  {m.label}
                </button>
              );
            })}
          </div>

          {/* Live Verse Preview */}
          <div className="pt-2 border-t border-white/10">
            <p className="font-display text-xl sm:text-2xl italic leading-snug text-foreground transition-all duration-500">
              &ldquo;{activeMood.preview}&rdquo;
            </p>
            <p className="mt-2 font-sans text-xs text-mist/90 leading-relaxed font-light">
              {activeMood.hi}
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div
          className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
          style={{ animation: "rise-in 1.2s var(--ease-out-expo) 1s both" }}
        >
          <Link
            to="/generate"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full btn-gold px-9 py-4 font-sans text-[11px] uppercase tracking-[0.28em] text-ink shadow-[var(--shadow-gold)] transition-all duration-500"
          >
            <Sparkles className="w-4 h-4 text-ink" />
            <span>Start writing — it&apos;s free</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            to="/library"
            className="inline-flex rounded-full border border-[var(--border-gold)] px-9 py-4 font-sans text-[11px] uppercase tracking-[0.28em] text-gold backdrop-blur-md transition-all duration-500 hover:bg-gold hover:text-ink"
          >
            Explore library
          </Link>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
        <span className="font-sans text-[9px] uppercase tracking-[0.4em] text-faint">
          Scroll
        </span>
        <span
          className="h-14 w-px origin-top bg-gold-sheet"
          style={{ animation: "pulse-line 2.2s ease-in-out infinite" }}
        />
      </div>
    </section>
  );
}
