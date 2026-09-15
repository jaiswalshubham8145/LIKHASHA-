import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { VideoBackdrop } from "@/components/site/VideoBackdrop";
import { TiltCard } from "@/components/site/TiltCard";
import { VIDEOS } from "@/lib/media";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { createSubscription } from "@/services/api";
import { toast } from "sonner";
import { ShieldCheck, Zap, Sparkles, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Likhasha Memberships" },
      {
        name: "description",
        content:
          "Free, Poet and Ustad memberships for the Likhasha poetry studio — monthly or yearly.",
      },
      { property: "og:title", content: "Pricing — Likhasha" },
      {
        property: "og:description",
        content: "Choose a Likhasha membership: Free, Poet or Ustad.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Pricing,
});

const PLANS = [
  {
    id: "free",
    name: "Free",
    monthly: 0,
    yearly: 0,
    tag: "Essential Poetry",
    perks: [
      "5 verses / day",
      "7 Indian languages (no global)",
      "4 poetic forms & 7 emotional moods",
      "Last 7 saves in library",
      "Standard AI speed (Ad-supported)",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    monthly: 99,
    yearly: 799,
    tag: "Most chosen · Unlimited",
    featured: true,
    perks: [
      "Unlimited verses / day",
      "All 35 languages (22 Indian + 13 Global)",
      "All 11 poetic forms & 28 emotional modes",
      "Unlimited private library storage",
      "100% Ad-Free writing experience",
      "Priority AI engine & 4K poster export",
      "Early access to new features",
    ],
  },
];

const FAQS = [
  {
    q: "Can I cancel or change my plan anytime?",
    a: "Yes. You can upgrade, downgrade, or cancel directly from your profile settings with zero lock-in or cancellation penalties.",
  },
  {
    q: "What payment methods are supported?",
    a: "We support UPI (GPay, PhonePe, Paytm), credit/debit cards (Visa, Mastercard, RuPay, Amex), netbanking, and international cards via Razorpay.",
  },
  {
    q: "How does the 4K Ultra-HD Poster export work?",
    a: "Members can export any composed verse into high-resolution cinematic typography posters formatted for Instagram stories, wallpapers, or physical prints.",
  },
  {
    q: "Can I use Likhasha verses commercially?",
    a: "Poet and Ustad members receive full commercial rights to publish generated lines in books, songs, advertisements, and social media branding.",
  },
];

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function Pricing() {
  const [yearly, setYearly] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);

  // Event-driven scroll parallax on pricing header
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y > 800) {
          el.style.opacity = "0";
          ticking = false;
          return;
        }
        const progress = Math.min(y / 700, 1);
        el.style.transform = `translate3d(0, ${y * 0.14}px, 0)`;
        el.style.opacity = String(Math.max(0.15, 1 - progress * 0.95));
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSelectPlan = async (plan: (typeof PLANS)[0]) => {
    if (plan.id === "free") {
      navigate({ to: "/generate" });
      return;
    }

    if (!user) {
      toast.info("Please sign in to choose a membership plan.", {
        action: {
          label: "Sign in",
          onClick: () => navigate({ to: "/login" }),
        },
      });
      return;
    }

    setLoadingPlan(plan.id);
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error(
          "Failed to load Razorpay payment SDK. Check your internet connection.",
        );
        return;
      }

      const subData = await createSubscription();

      const options = {
        key: subData.razorpayKeyId || import.meta.env["VITE_RAZORPAY_KEY_ID"],
        subscription_id: subData.subscriptionId,
        name: "Likhasha",
        description: `${plan.name} Membership`,
        handler: async function () {
          toast.success(`Welcome to ${plan.name} tier! Payment successful.`);
          await refreshProfile();
          navigate({ to: "/generate" });
        },
        prefill: {
          name: user.displayName || "",
          email: user.email || "",
        },
        theme: {
          color: "#C9A44C",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to initialize checkout.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <SiteShell>
      <section className="relative min-h-screen overflow-hidden px-6 pb-28 pt-40">
        <VideoBackdrop src={VIDEOS.hero} intensity={0.25} blur={5} fixed />

        <div className="relative mx-auto max-w-6xl">
          <div ref={headerRef} className="will-change-transform">
            <p
              data-reveal-skew
              className="mb-6 text-center font-sans text-[10px] uppercase tracking-[0.5em] text-gold"
            >
              Membership Tiers
            </p>
            <h1 className="text-center font-display text-[clamp(40px,7vw,92px)] font-light leading-[0.9] tracking-[-0.04em] text-white">
              Poetry,{" "}
              <span className="italic text-gold drop-shadow-[0_0_40px_rgba(212,175,55,0.45)]">
                unlimited
              </span>
            </h1>

            <p
              data-reveal
              className="mx-auto mt-6 max-w-lg text-center font-sans text-sm sm:text-base leading-relaxed text-mist font-light"
            >
              Elevate your lyrical craft with limitless emotional dimensions,
              priority rendering, and museum-grade 4K poster outputs.
            </p>

            <div
              data-reveal-zoom
              style={{ ["--reveal-delay" as string]: "150ms" }}
              className="mt-12 flex justify-center"
            >
              <div className="glass-vision inline-flex rounded-full p-1.5 border-white/15 backdrop-blur-2xl">
                {[
                  { k: false, l: "Monthly" },
                  { k: true, l: "Yearly · save 33%" },
                ].map((o) => (
                  <button
                    key={o.l}
                    onClick={() => setYearly(o.k)}
                    className={cn(
                      "rounded-full px-7 py-2.5 font-sans text-[10px] uppercase tracking-[0.24em] transition-all duration-400",
                      yearly === o.k
                        ? "bg-white/20 text-white shadow-[0_0_25px_rgba(255,255,255,0.25)] font-medium"
                        : "text-white/60 hover:text-white",
                    )}
                  >
                    {o.l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Plan Cards with Aggressive Scroll Reveals */}
          <div className="mt-16 grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {PLANS.map((p, i) => {
              const isCurrent =
                profile?.plan === (p.id === "free" ? "free" : "premium");
              const revealAttr =
                i === 0 ? "data-reveal-left" : "data-reveal-right";

              return (
                <div
                  key={p.name}
                  {...{ [revealAttr]: "" }}
                  style={{ ["--reveal-delay" as string]: `${i * 120}ms` }}
                >
                  <TiltCard
                    max={7}
                    className={cn(
                      "h-full rounded-2xl p-8 sm:p-10 flex flex-col justify-between transition-all duration-500",
                      p.featured
                        ? "glass-gold border-gold/40 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(212,175,55,0.25)] scale-[1.02]"
                        : "glass border-white/10 hover:border-gold/30 hover:shadow-[0_15px_40px_rgba(0,0,0,0.7)]",
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-sans text-[9px] uppercase tracking-[0.32em] text-gold">
                          {p.tag}
                        </span>
                        {isCurrent && (
                          <span className="rounded-full bg-gold/20 px-3 py-0.5 font-sans text-[9px] uppercase tracking-[0.2em] text-gold">
                            Current Plan
                          </span>
                        )}
                      </div>

                      <h2 className="mt-6 font-display text-4xl font-light">
                        {p.name}
                      </h2>
                      <p className="mt-6 font-display text-6xl font-light text-gold">
                        ₹{yearly ? p.yearly : p.monthly}
                        <span className="ml-2 font-sans text-[10px] uppercase tracking-[0.24em] text-faint">
                          /{yearly ? "yr" : "mo"}
                        </span>
                      </p>
                      <ul className="mt-8 space-y-3">
                        {p.perks.map((perk) => (
                          <li
                            key={perk}
                            className="flex gap-3 font-sans text-sm text-mist"
                          >
                            <span className="text-gold">✦</span>
                            {perk}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-10">
                      <button
                        onClick={() => handleSelectPlan(p)}
                        disabled={loadingPlan === p.id}
                        className={cn(
                          "w-full rounded-full px-8 py-3.5 font-sans text-[10px] uppercase tracking-[0.28em] font-medium transition-all duration-500 disabled:opacity-50",
                          p.featured
                            ? "btn-gold text-ink shadow-[var(--shadow-gold)] hover:scale-[1.02]"
                            : "border border-[var(--border-gold)] text-gold hover:bg-gold hover:text-ink",
                        )}
                      >
                        {loadingPlan === p.id
                          ? "Connecting..."
                          : isCurrent
                            ? "Current Active"
                            : `Choose ${p.name}`}
                      </button>
                    </div>
                  </TiltCard>
                </div>
              );
            })}
          </div>

          {/* Guarantees Strip */}
          <div
            data-reveal-zoom
            style={{ ["--reveal-delay" as string]: "200ms" }}
            className="mt-20 grid gap-6 sm:grid-cols-3 border-y border-white/10 py-10"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold/10 border border-gold/30 text-gold">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-display text-lg font-light text-foreground">
                  Cancel Anytime
                </h4>
                <p className="font-sans text-xs text-mist mt-0.5">
                  Zero long-term contracts or fees
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold/10 border border-gold/30 text-gold">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-display text-lg font-light text-foreground">
                  Instant Activation
                </h4>
                <p className="font-sans text-xs text-mist mt-0.5">
                  Immediate access to all studio engines
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold/10 border border-gold/30 text-gold">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-display text-lg font-light text-foreground">
                  4K UHD Exports
                </h4>
                <p className="font-sans text-xs text-mist mt-0.5">
                  Crystal typography rendering for prints
                </p>
              </div>
            </div>
          </div>

          {/* Frequently Asked Questions with Alternating Scroll Reveals */}
          <div className="mt-24">
            <div data-reveal-rotate className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 mb-3">
                <HelpCircle className="w-4 h-4 text-gold" />
                <span className="font-sans text-[10px] uppercase tracking-[0.45em] text-gold">
                  Questions &amp; Answers
                </span>
              </div>
              <h3 className="font-display text-[clamp(28px,4.5vw,56px)] font-light text-foreground">
                Everything you need to know
              </h3>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {FAQS.map((faq, idx) => (
                <div
                  key={faq.q}
                  {...{
                    [idx % 2 === 0 ? "data-reveal-left" : "data-reveal-right"]:
                      "",
                  }}
                  style={{ ["--reveal-delay" as string]: `${idx * 100}ms` }}
                  className="glass-vision rounded-2xl p-7 border border-white/10 hover:border-gold/40 transition-all duration-500"
                >
                  <h4 className="font-display text-xl font-light text-foreground flex items-center gap-3">
                    <span className="text-gold text-sm">0{idx + 1}.</span>
                    {faq.q}
                  </h4>
                  <p className="mt-4 font-sans text-sm leading-relaxed text-mist font-light">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
