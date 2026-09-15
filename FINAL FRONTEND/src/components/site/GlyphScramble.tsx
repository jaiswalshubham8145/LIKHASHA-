import { useEffect, useRef, useState } from "react";

const GLYPHS = "ĀĪŪṚṜḶḸṂḤŚṢṬḌṆÑṄāīūṛṝḷḹṃḥśṣṭḍṇñṅAEIOU✦✧◇0123456789";

/** Romanized Sanskrit glyph scrambler that settles into the target text. */
export function GlyphScramble({
  text,
  duration = 1100,
  delay = 0,
  className,
  as: Tag = "span",
}: {
  text: string;
  duration?: number;
  delay?: number;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p" | "div";
}) {
  const [out, setOut] = useState(text);
  const started = useRef(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const run = () => {
      if (started.current) return;
      started.current = true;
      const frames = (duration / 1000) * 60;
      let i = 0;
      const id = window.setInterval(() => {
        const progress = (i / frames) * text.length;
        setOut(
          text
            .split("")
            .map((c, idx) =>
              c === " "
                ? " "
                : idx < progress
                  ? c
                  : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
            )
            .join(""),
        );
        i++;
        if (i >= frames) {
          window.clearInterval(id);
          setOut(text);
        }
      }, 1000 / 60);
    };

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && window.setTimeout(run, delay),
        ),
      { threshold: 0.4 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [text, duration, delay]);

  return (
    <Tag ref={ref as never} className={className}>
      {out}
    </Tag>
  );
}
