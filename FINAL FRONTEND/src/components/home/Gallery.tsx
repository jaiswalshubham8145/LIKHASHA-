import { useState } from "react";
import { TiltCard } from "@/components/site/TiltCard";
import { soundEffects } from "@/hooks/useSoundEffects";
import { Copy, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

const CARDS = [
  {
    verse: "Tere aane se mukammal hui zindagi",
    en: "With your arrival life found its missing melody; before you, I was merely counting breaths.",
    tag: "Love & Romance",
    author: "Romantic Ghazal",
  },
  {
    verse: "Raat ka aakhri pehar aur teri yaad",
    en: "The last watch of the night and your quiet memory; even the solitary stars look down and sigh.",
    tag: "Midnight Solitude",
    author: "Melancholic Couplet",
  },
  {
    verse: "Girkar sambhalna hi to zindagani hai",
    en: "To fall and rise again with head held high is what life is made of — courage needs no applause.",
    tag: "Fire & Resilience",
    author: "Motivational Quote",
  },
  {
    verse: "Shor se pare rooh jab sukoon paati hai",
    en: "Beyond the clamor of the world, when the soul rests in silence, it discovers its eternal home.",
    tag: "Inner Peace & Sufi",
    author: "Spiritual Verse",
  },
  {
    verse: "Tumhari hansi jaise subah ki pehli dhoop",
    en: "Your laughter warms the cold world like the very first ray of golden morning sunshine.",
    tag: "Joy & Tenderness",
    author: "Heartfelt Nazm",
  },
  {
    verse: "Waqt sabkuch sikha deta hai khamoshi se",
    en: "Time teaches every lesson without raising its voice — patience turns every scar into gold.",
    tag: "Timeless Wisdom",
    author: "Philosophical Sher",
  },
];

export function Gallery() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (index: number, text: string) => {
    soundEffects.playChime();
    navigator.clipboard?.writeText(text);
    setCopiedIndex(index);
    toast.success("Verse copied to clipboard.");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section className="relative z-10 px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <div
          data-reveal-skew
          className="mb-16 flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <p className="mb-3 font-sans text-[10px] uppercase tracking-[0.45em] text-gold">
              Featured Anthology
            </p>
            <h2 className="font-display text-[length:var(--text-section-title)] font-light tracking-[-0.03em] text-foreground">
              The Sovereign Vault
            </h2>
          </div>
          <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-faint">
            Hover to tilt in 3D · 1-click to copy and share
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((c, i) => (
            <div
              key={c.verse}
              data-reveal-zoom
              style={{ ["--reveal-delay" as string]: `${i * 120}ms` }}
            >
              <TiltCard className="glass-vision h-full rounded-2xl p-8 flex flex-col justify-between border border-white/10 hover:border-gold/50 transition-all duration-500">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-gold font-medium">
                      {c.tag}
                    </span>
                    <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-faint">
                      {c.author}
                    </span>
                  </div>

                  <p className="mt-8 font-display text-2xl sm:text-3xl italic leading-[1.3] text-foreground">
                    &ldquo;{c.verse}&rdquo;
                  </p>

                  <p className="mt-5 font-sans text-xs sm:text-sm leading-relaxed text-mist font-light">
                    {c.en}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                  <button
                    onClick={() =>
                      handleCopy(i, `${c.verse}\n\n"${c.en}"\n— Likhasha`)
                    }
                    className="glass-pill flex items-center gap-2 rounded-full px-4 py-1.5 font-sans text-[10px] uppercase tracking-[0.2em] text-white/80 hover:text-white hover:border-gold transition-colors"
                  >
                    {copiedIndex === i ? (
                      <Check className="w-3 h-3 text-gold" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedIndex === i ? "Copied" : "Copy"}</span>
                  </button>

                  <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-faint flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-gold/70" />
                    Bilingual
                  </span>
                </div>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
