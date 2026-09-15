import { useEffect, type ReactNode } from "react";
import { Cursor } from "./Cursor";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { Preloader } from "./Preloader";
import { AmbientScore } from "./AmbientScore";

/**
 * Global experience shell: Lenis smooth scroll, scroll-velocity skew variable,
 * reveal-on-scroll observer, custom cursor, grain atmosphere, nav + footer.
 */
export function SiteShell({
  children,
  intro = false,
  footer = true,
}: {
  children: ReactNode;
  intro?: boolean;
  footer?: boolean;
}) {
  useEffect(() => {
    let destroyed = false;
    let cleanupLenis: (() => void) | undefined;

    void (async () => {
      const { default: Lenis } = await import("lenis");
      if (destroyed) return;
      const lenis = new Lenis({
        duration: 1.15,
        smoothWheel: true,
        lerp: 0.09,
      });
      let raf = 0;
      const loop = (t: number) => {
        lenis.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);

      const onScroll = (e: {
        velocity: number;
        scroll: number;
        limit: number;
      }) => {
        const skew = Math.max(-9, Math.min(9, e.velocity * 0.16));
        document.documentElement.style.setProperty(
          "--scroll-skew",
          `${skew.toFixed(2)}deg`,
        );
        document.documentElement.style.setProperty(
          "--scroll-progress",
          `${e.limit ? (e.scroll / e.limit) * 100 : 0}%`,
        );
      };
      lenis.on("scroll", onScroll as never);

      cleanupLenis = () => {
        cancelAnimationFrame(raf);
        lenis.destroy();
      };
    })();

    return () => {
      destroyed = true;
      cleanupLenis?.();
    };
  }, []);

  useEffect(() => {
    const REVEAL_ATTRS = [
      "data-reveal",
      "data-reveal-zoom",
      "data-reveal-left",
      "data-reveal-right",
      "data-reveal-skew",
      "data-reveal-rotate",
    ];

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            for (const attr of REVEAL_ATTRS) {
              if (e.target.hasAttribute(attr)) {
                e.target.setAttribute(attr, "in");
              }
            }
            if (e.target.hasAttribute("data-cinematic"))
              e.target.setAttribute("data-cinematic", "in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );

    const selector = REVEAL_ATTRS.map((a) => `[${a}]`).join(", ");
    document
      .querySelectorAll(`${selector}, h1, h2, h3, .reveal-copy`)
      .forEach((el) => {
        const hasReveal = REVEAL_ATTRS.some((a) => el.hasAttribute(a));
        if (!hasReveal) el.setAttribute("data-cinematic", "");
        io.observe(el);
      });
    return () => io.disconnect();
  }, []);

  return (
    <div className="atmosphere relative min-h-screen bg-ink text-foreground">
      {intro && <Preloader />}
      <Cursor />
      <div
        aria-hidden
        className="fixed left-0 top-0 z-[65] h-px w-[var(--scroll-progress,0%)] bg-gold-sheet"
      />
      <Nav />
      <AmbientScore />
      <main>{children}</main>
      {footer && <Footer />}
    </div>
  );
}
