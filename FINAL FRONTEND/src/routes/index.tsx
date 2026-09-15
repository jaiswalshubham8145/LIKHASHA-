import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { Marquee } from "@/components/site/Marquee";
import { Hero } from "@/components/home/Hero";
import { Catalog } from "@/components/home/Catalog";
import { Journey } from "@/components/home/Journey";
import { HorizontalChapters } from "@/components/home/HorizontalChapters";
import { Playground } from "@/components/home/Playground";
import { Gallery } from "@/components/home/Gallery";
import { FinalCta } from "@/components/home/FinalCta";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Likhasha — Romanized Sanskrit Poetry" },
      {
        name: "description",
        content:
          "Likhasha turns a single feeling into Sanskrit-led verse, Hindi poetry and English lines — a cinematic, motion-first writing experience.",
      },
      { property: "og:title", content: "Likhasha — Prati śabda, eka anubhava" },
      {
        property: "og:description",
        content:
          "Cinematic Sanskrit-led poetry studio for verse, mood and storytelling across Devanagari and English.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const TRACK_1 = [
  "✦ SHAYARI",
  "· SHER",
  "· GHAZAL",
  "· NAZM",
  "· POEMS",
  "· QUOTES",
  "· SUFI",
  "· DARK POETRY ✦",
];
const TRACK_2 = [
  "✦ URDU SHAYARI",
  "· HINDI POETRY",
  "· ROMAN URDU",
  "· ENGLISH POETICS",
  "· TIMELESS WORDS",
  "· GHALIB & GULZAR",
  "· HAR LAFZ EK NASHA ✦",
];

function Home() {
  return (
    <SiteShell intro>
      <Hero />
      <section className="relative z-10 border-y border-border/60 py-8">
        <Marquee items={TRACK_1} />
        <Marquee items={TRACK_2} reverse fontClass="font-hindi" />
      </section>

      <Catalog />
      <HorizontalChapters />
      <Journey />

      <Playground />
      <Gallery />

      <FinalCta />
    </SiteShell>
  );
}
