import { cn } from "@/lib/utils";

interface CinematicBlackoutProps {
  className?: string;
}

/**
 * Cinematic film cut blackout transition divider placed between primary acts.
 * Evokes a film projector cut with a seamless deep blackout band.
 */
export function CinematicBlackout({ className }: CinematicBlackoutProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "cinematic-blackout-divider relative my-6 flex items-center justify-center",
        className,
      )}
    >
      <div className="h-px w-32 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </div>
  );
}
