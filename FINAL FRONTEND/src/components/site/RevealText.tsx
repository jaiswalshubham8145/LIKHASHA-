import {
  useRef,
  useEffect,
  useState,
  type ElementType,
  type ComponentPropsWithoutRef,
} from "react";
import { cn } from "@/lib/utils";

export type RevealEffect =
  | "flow-cinema"
  | "mask"
  | "blur-sharp"
  | "spacing-collapse"
  | "perspective-3d"
  | "ink-bleed"
  | "light-sweep"
  | "z-axis";

interface RevealTextProps<T extends ElementType = "span"> {
  as?: T;
  text: string;
  effect?: RevealEffect;
  splitBy?: "words" | "chars" | "lines" | "none";
  delay?: number;
  stagger?: number;
  className?: string;
  children?: never;
}

/**
 * High-performance kinetic typography primitive supporting elite cinematic reveal styles:
 * flow-cinema (Mask Reveal + Blur-to-Sharp + Letter-Spacing Collapse + Word Stagger + Perspective 3D + Slow Dissolve),
 * Mask reveal, Blur-to-Sharp, Letter-spacing collapse, Perspective 3D, Ink bleed.
 */
export function RevealText<T extends ElementType = "span">({
  as,
  text,
  effect = "flow-cinema",
  splitBy = "words",
  delay = 0,
  stagger = 200,
  className,
  ...props
}: RevealTextProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof RevealTextProps<T>>) {
  const Component = (as || "span") as ElementType;
  const elementRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (effect === "spacing-collapse") {
    return (
      <Component
        ref={elementRef}
        className={cn(
          "inline-block transition-all duration-1000",
          inView ? "text-spacing-collapse" : "opacity-0",
          className,
        )}
        style={{ animationDelay: `${delay}ms` }}
        {...props}
      >
        {text}
      </Component>
    );
  }

  if (effect === "ink-bleed") {
    return (
      <Component
        ref={elementRef}
        className={cn(
          "inline-block",
          inView ? "text-ink-bloom" : "opacity-0",
          className,
        )}
        style={{ animationDelay: `${delay}ms` }}
        {...props}
      >
        {text}
      </Component>
    );
  }

  if (effect === "light-sweep") {
    return (
      <Component
        ref={elementRef}
        className={cn("text-gold-gradient inline-block", className)}
        {...props}
      >
        {text}
      </Component>
    );
  }

  // Word-based or Char-based split
  const tokens =
    splitBy === "chars"
      ? text.split("")
      : splitBy === "words"
        ? text.split(" ")
        : [text];

  return (
    <Component
      ref={elementRef}
      className={cn("inline-block", inView && "reveal-active", className)}
      {...props}
    >
      {tokens.map((token, i) => {
        const tokenDelay = delay + i * stagger;
        if (effect === "flow-cinema") {
          return (
            <span
              key={i}
              className="kinetic-mask-container mr-[0.25em] last:mr-0"
            >
              <span
                className={cn(
                  "kinetic-word-token",
                  inView ? "kinetic-visible" : "kinetic-hidden",
                )}
                style={{
                  transitionDelay: `${tokenDelay}ms`,
                }}
              >
                {token}
              </span>
            </span>
          );
        }

        if (effect === "mask") {
          return (
            <span key={i} className="text-reveal-mask mr-[0.25em] last:mr-0">
              <span
                style={{
                  transitionDelay: `${tokenDelay}ms`,
                  transform: inView ? "translateY(0)" : "translateY(115%)",
                }}
              >
                {token}
              </span>
            </span>
          );
        }

        if (effect === "blur-sharp") {
          return (
            <span
              key={i}
              className={cn(
                "text-blur-sharp inline-block mr-[0.28em] last:mr-0",
              )}
              style={{
                transitionDelay: `${tokenDelay}ms`,
                filter: inView ? "blur(0)" : "blur(14px)",
                opacity: inView ? 1 : 0,
                transform: inView ? "none" : "translate3d(0, 16px, 0)",
              }}
            >
              {token}
            </span>
          );
        }

        if (effect === "perspective-3d") {
          return (
            <span
              key={i}
              className={cn(
                "text-perspective-3d inline-block mr-[0.28em] last:mr-0",
              )}
              style={{
                transitionDelay: `${tokenDelay}ms`,
                transform: inView
                  ? "perspective(800px) rotateX(0deg) translate3d(0, 0, 0)"
                  : "perspective(800px) rotateX(-55deg) translate3d(0, 24px, 0)",
                opacity: inView ? 1 : 0,
                filter: inView ? "blur(0)" : "blur(8px)",
              }}
            >
              {token}
            </span>
          );
        }

        return <span key={i}>{token} </span>;
      })}
    </Component>
  );
}
