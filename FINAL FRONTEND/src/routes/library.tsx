import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { VideoBackdrop } from "@/components/site/VideoBackdrop";
import { TiltCard } from "@/components/site/TiltCard";
import { GlyphScramble } from "@/components/site/GlyphScramble";
import { VIDEOS } from "@/lib/media";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import {
  getLibrary,
  deleteGeneration,
  type GenerationDoc,
} from "@/services/api";
import { toast } from "sonner";
import {
  Trash2,
  Copy,
  Check,
  Lock,
  Search,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import { PoetryPosterModal } from "@/components/site/PoetryPosterModal";
import { soundEffects } from "@/hooks/useSoundEffects";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Personal Vault — Poetry & Quotes | Likhasha" },
      {
        name: "description",
        content:
          "A 3D cinematic vault of your saved poetry, couplets, and inspirational quotes.",
      },
      { property: "og:title", content: "Personal Vault — Likhasha" },
      {
        property: "og:description",
        content: "Browse your personal vault of timeless poetry and verse.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Library,
});

const DEFAULT_ITEMS = [
  {
    id: "d1",
    content: "Tere aane se mukammal hui zindagi",
    meaning:
      "With your arrival life found its missing melody; before you, I was merely counting breaths.",
    type: "Ghazal",
    mood: "romantic",
  },
  {
    id: "d2",
    content: "Raat ka aakhri pehar aur teri yaad",
    meaning:
      "The solitary midnight hour and your quiet memory; even the distant moon sighs.",
    type: "Sher",
    mood: "sad",
  },
  {
    id: "d3",
    content: "Girkar sambhalna hi to zindagani hai",
    meaning:
      "To fall and rise with fierce dignity is what life is made of — courage needs no applause.",
    type: "Quote",
    mood: "motivational",
  },
  {
    id: "d4",
    content: "Shor se pare jab rooh khud se milti hai",
    meaning:
      "Beyond all worldly clamor, the soul dissolves into unshakeable stillness and grace.",
    type: "Sufi",
    mood: "spiritual",
  },
  {
    id: "d5",
    content: "Tumhari hansi jaise subah ki pehli dhoop",
    meaning:
      "Your laughter warms the cold world like the very first ray of golden morning sunshine.",
    type: "Poem",
    mood: "happy",
  },
  {
    id: "d6",
    content: "Aadhi raat wo sab jaanti hai jo roshni ne kabhi poocha nahi",
    meaning:
      "Midnight knows all the deep truths that daylight never had the courage to confront.",
    type: "Nazm",
    mood: "dark",
  },
];

const FILTERS = [
  { label: "All Verses", value: "All" },
  { label: "Love & Romance", value: "romantic" },
  { label: "Heartbreak", value: "sad" },
  { label: "Motivation", value: "motivational" },
  { label: "Inner Peace", value: "spiritual" },
  { label: "Midnight Melancholy", value: "dark" },
  { label: "Joy & Life", value: "happy" },
] as const;

function Library() {
  const { user, profile } = useAuth();
  const [filter, setFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<any[]>(DEFAULT_ITEMS);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [posterItem, setPosterItem] = useState<any | null>(null);

  const fetchUserLibrary = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await getLibrary();
      if (res && res.generations && res.generations.length > 0) {
        setItems(res.generations);
      } else {
        setItems([]);
      }
    } catch (err: any) {
      console.warn("Could not load user library, using demo vault:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserLibrary();
    } else {
      setItems(DEFAULT_ITEMS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleDelete = async (id: string) => {
    soundEffects.playClick();
    if (!user) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Verse removed from view.");
      return;
    }
    try {
      await deleteGeneration(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Verse erased from your library vault.");
    } catch (err: any) {
      toast.error(err.message || "Failed to remove verse.");
    }
  };

  const handleCopy = (id: string, text: string) => {
    soundEffects.playChime();
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    toast.success("Verse copied to clipboard.");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredItems = items.filter((i) => {
    const matchesFilter =
      filter === "All" || (i.mood || "").toLowerCase() === filter.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      (i.content || "").toLowerCase().includes(query) ||
      (i.meaning || "").toLowerCase().includes(query) ||
      (i.type || "").toLowerCase().includes(query);
    return matchesFilter && matchesQuery;
  });

  return (
    <SiteShell>
      {/* Poetry Poster Modal */}
      {posterItem && (
        <PoetryPosterModal
          isOpen={!!posterItem}
          onClose={() => setPosterItem(null)}
          verse={posterItem.content}
          translation={posterItem.meaning}
          mood={posterItem.mood}
          form={posterItem.type}
        />
      )}

      <section className="relative min-h-screen overflow-hidden px-6 pb-32 pt-40">
        <VideoBackdrop src={VIDEOS.cosmos} intensity={0.28} blur={4} fixed />

        <div className="relative mx-auto max-w-7xl">
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-sans text-[10px] uppercase tracking-[0.5em] text-gold font-medium">
              Personal Vault
            </p>
            {!user ? (
              <Link
                to="/login"
                className="glass-pill flex items-center gap-2 rounded-full px-4 py-1.5 font-sans text-[10px] uppercase tracking-[0.2em] text-gold hover:bg-gold hover:text-ink transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                Sign in to sync your personal vault
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-mist">
                  Storage:{" "}
                  <strong className="text-gold font-medium">
                    {items.length} /{" "}
                    {profile?.plan === "premium" ? "∞ Unlimited" : "7 max"}
                  </strong>
                </span>
                {profile?.plan !== "premium" && (
                  <Link
                    to="/pricing"
                    className="glass-pill rounded-full px-3 py-1 text-[10px] uppercase tracking-wider text-gold hover:bg-gold hover:text-ink transition-colors font-medium border border-gold/40"
                  >
                    Upgrade for Unlimited
                  </Link>
                )}
              </div>
            )}
          </div>

          <GlyphScramble
            as="h1"
            text="The Sovereign Vault"
            className="mt-4 font-display text-[clamp(40px,7vw,96px)] font-light leading-[0.9] tracking-[-0.04em] text-foreground"
          />

          <p className="mt-4 max-w-xl font-sans text-sm sm:text-base leading-relaxed text-mist font-light">
            Every verse inscribed into your private sanctuary. Search, copy,
            filter by emotion, or export as luxury framed art posters.
          </p>

          {/* Search & Filter Bar */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mist" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by words, feeling, or style..."
                className="w-full rounded-full glass-pill pl-11 pr-5 py-2.5 text-sm text-white placeholder:text-mist/60 border border-white/15 outline-none focus:border-gold"
              />
            </div>

            {/* Quick Generator link */}
            <Link
              to="/generate"
              className="glass-pill rounded-full px-5 py-2.5 font-sans text-[10px] uppercase tracking-[0.22em] text-gold hover:border-gold flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Compose New Verse</span>
            </Link>
          </div>

          {/* Filter Pills */}
          <div className="mt-6 flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const isSelected = filter === f.value;
              return (
                <button
                  key={f.value}
                  onClick={() => {
                    soundEffects.playClick();
                    setFilter(f.value);
                  }}
                  className={cn(
                    "rounded-full px-4 py-1.5 font-sans text-xs transition-all duration-200",
                    isSelected
                      ? "bg-gold text-ink font-semibold shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                      : "glass-pill text-white/60 hover:text-white hover:border-white/30",
                  )}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Results Grid */}
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div className="col-span-full py-24 text-center">
                <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin mx-auto mb-4" />
                <p className="font-sans text-xs uppercase tracking-[0.3em] text-gold">
                  Opening vault doors...
                </p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="col-span-full py-24 text-center glass-vision rounded-2xl p-12 border border-white/10">
                <p className="font-display text-2xl italic text-foreground">
                  No verses match your search.
                </p>
                <p className="mt-2 text-sm text-mist">
                  Try another search query or compose your next line in Studio.
                </p>
                <Link
                  to="/generate"
                  className="mt-6 inline-flex rounded-full btn-gold px-8 py-3 font-sans text-[11px] uppercase tracking-[0.25em] text-ink"
                >
                  Open Studio
                </Link>
              </div>
            ) : (
              filteredItems.map((item, index) => (
                <TiltCard
                  key={item.id || index}
                  className="glass-vision rounded-2xl p-8 flex flex-col justify-between border border-white/12 hover:border-gold/40 transition-all duration-500"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-gold font-medium">
                        {item.type || "Poetry"} · {item.mood || "Rasa"}
                      </span>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-faint hover:text-red-400 transition-colors p-1"
                        title="Remove verse"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="mt-7 font-display text-2xl sm:text-3xl italic leading-[1.3] text-foreground whitespace-pre-line">
                      &ldquo;{item.content}&rdquo;
                    </p>

                    {item.meaning && (
                      <p className="mt-4 font-sans text-xs sm:text-sm leading-relaxed text-mist font-light">
                        {item.meaning}
                      </p>
                    )}
                  </div>

                  <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between">
                    <button
                      onClick={() => handleCopy(item.id, item.content)}
                      className="flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-[0.24em] text-gold hover:text-gold-bright transition-colors"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedId === item.id ? "Copied" : "Copy"}</span>
                    </button>

                    <button
                      onClick={() => {
                        soundEffects.playClick();
                        setPosterItem(item);
                      }}
                      className="glass-pill flex items-center gap-1.5 rounded-full px-3 py-1 font-sans text-[10px] uppercase tracking-[0.2em] text-white/80 hover:text-white hover:border-gold transition-colors"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-gold" />
                      <span>Poster</span>
                    </button>
                  </div>
                </TiltCard>
              ))
            )}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
