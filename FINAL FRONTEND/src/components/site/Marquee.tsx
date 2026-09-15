import { cn } from "@/lib/utils";

export function Marquee({
  items,
  reverse = false,
  className,
  fontClass = "font-display",
}: {
  items: string[];
  reverse?: boolean;
  className?: string;
  fontClass?: string;
}) {
  const row = [...items, ...items];
  return (
    <div
      className={cn(
        "group/marquee edge-fade relative flex overflow-hidden py-3",
        className,
      )}
    >
      <div
        className={cn(
          "flex w-max shrink-0 gap-10 whitespace-nowrap group-hover/marquee:[animation-play-state:paused]",
          reverse ? "animate-marquee-right" : "animate-marquee-left",
        )}
      >
        {row.map((item, i) => (
          <span
            key={i}
            className={cn(
              fontClass,
              "cursor-default text-[clamp(20px,3vw,44px)] font-light text-mist transition-all duration-500 hover:scale-110 hover:text-gold hover:[text-shadow:0_0_40px_var(--gold)]",
            )}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
