import { Link } from "@tanstack/react-router";
import { VideoBackdrop } from "@/components/site/VideoBackdrop";
import { InkParticles } from "@/components/site/InkParticles";
import { VIDEOS } from "@/lib/media";
import { Sparkles, ArrowRight } from "lucide-react";

export function FinalCta() {
  return (
    <section className="relative z-10 flex min-h-[92svh] items-center overflow-hidden">
      <VideoBackdrop src={VIDEOS.cosmos} intensity={0.55} />
      <InkParticles
        className="absolute inset-0 h-full w-full opacity-60"
        count={70}
      />

      <div
        data-reveal-zoom
        className="relative mx-auto max-w-4xl px-6 text-center"
      >
        {/* Breathing Cosmic Nebula Aura */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-20 -z-10 rounded-full opacity-30 blur-[100px] nebula-pulse"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.25) 0%, rgba(147, 51, 234, 0.15) 45%, transparent 75%)",
          }}
        />

        <p className="mb-6 font-sans text-[10px] uppercase tracking-[0.5em] text-gold">
          The Infinite Horizon
        </p>

        <h2 className="font-display text-[clamp(44px,7.5vw,110px)] font-light leading-[0.92] tracking-[-0.04em] text-foreground">
          Start writing.{" "}
          <span className="italic text-gold-gradient">
            Your words are waiting.
          </span>
        </h2>

        <p className="mx-auto mt-8 max-w-lg font-sans text-base leading-relaxed text-mist font-light">
          A single whisper of thought is enough. Likhasha shapes it into
          timeless poetry, couplets, and viral quotes across English, Hindi, and
          Urdu.
        </p>

        <div className="mt-12 flex justify-center">
          <Link
            to="/generate"
            className="group relative inline-flex items-center gap-3 rounded-full btn-gold px-12 py-5 font-sans text-[12px] uppercase tracking-[0.28em] text-ink shadow-[var(--shadow-gold)] transition-all duration-700 hover:scale-105 overflow-hidden"
          >
            <Sparkles className="w-4 h-4 text-ink animate-pulse" />
            <span>Write my first verse — it&apos;s free</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
