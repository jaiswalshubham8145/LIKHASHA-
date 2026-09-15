import { useState, useRef, useEffect } from "react";
import { X, Download, Sparkles, Check, Palette, Type } from "lucide-react";
import { soundEffects } from "@/hooks/useSoundEffects";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PoetryPosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  verse: string;
  translation?: string | undefined;
  mood?: string | undefined;
  form?: string | undefined;
  authorName?: string | undefined;
}

type PosterTheme = "obsidian" | "crimson" | "sapphire" | "parchment";

const THEMES: Record<
  PosterTheme,
  {
    name: string;
    bg: string;
    text: string;
    accent: string;
    subText: string;
    border: string;
    cornerColor: string;
  }
> = {
  obsidian: {
    name: "Obsidian Gold",
    bg: "#080810",
    text: "#f5f0e8",
    accent: "#d4af37",
    subText: "#9b8fb5",
    border: "#d4af37",
    cornerColor: "#ffe885",
  },
  crimson: {
    name: "Imperial Velvet",
    bg: "#180812",
    text: "#fff0f3",
    accent: "#ff7597",
    subText: "#d8a8b8",
    border: "#ff7597",
    cornerColor: "#ffadc2",
  },
  sapphire: {
    name: "Celestial Night",
    bg: "#070c18",
    text: "#eff6ff",
    accent: "#60a5fa",
    subText: "#93c5fd",
    border: "#60a5fa",
    cornerColor: "#bfdbfe",
  },
  parchment: {
    name: "Antique Parchment",
    bg: "#1c1917",
    text: "#fafaf9",
    accent: "#facc15",
    subText: "#a8a29e",
    border: "#ca8a04",
    cornerColor: "#fde047",
  },
};

export function PoetryPosterModal({
  isOpen,
  onClose,
  verse,
  translation,
  mood = "Poetic",
  form = "Verse",
  authorName = "Likhasha Studio",
}: PoetryPosterModalProps) {
  const [theme, setTheme] = useState<PosterTheme>("obsidian");
  const [includeDedication, setIncludeDedication] = useState(true);
  const [dedicationText, setDedicationText] = useState("Inscribed with soul");
  const [exporting, setExporting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentTheme = THEMES[theme];

  const handleDownload = async () => {
    soundEffects.playChime();
    setExporting(true);

    try {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error("Canvas element not found");

      const width = 1080;
      const height = 1350;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");

      // 1. Background Fill
      ctx.fillStyle = currentTheme.bg;
      ctx.fillRect(0, 0, width, height);

      // Subtle vignette
      const radialGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        100,
        width / 2,
        height / 2,
        width * 0.75,
      );
      radialGrad.addColorStop(0, "transparent");
      radialGrad.addColorStop(1, "rgba(0,0,0,0.6)");
      ctx.fillStyle = radialGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Double Ornate Border
      ctx.strokeStyle = currentTheme.border;
      ctx.lineWidth = 3;
      ctx.strokeRect(60, 60, width - 120, height - 120);

      ctx.strokeStyle = `${currentTheme.border}50`;
      ctx.lineWidth = 1;
      ctx.strokeRect(74, 74, width - 148, height - 148);

      // 3. Ornate Corner Diamonds
      const cornerPoints = [
        [60, 60],
        [width - 60, 60],
        [60, height - 60],
        [width - 60, height - 60],
      ];
      ctx.fillStyle = currentTheme.cornerColor;
      cornerPoints.forEach(([cx, cy]) => {
        if (cx === undefined || cy === undefined) return;
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Header Top
      ctx.textAlign = "center";
      ctx.fillStyle = currentTheme.accent;
      ctx.font = "600 18px sans-serif";
      ctx.letterSpacing = "6px";
      ctx.fillText(
        `LIKHASHA POETRY STUDIO · ${(mood || "Poetic").toUpperCase()} ${(form || "Verse").toUpperCase()}`,
        width / 2,
        140,
      );

      // 5. Verse Text Rendering (Word wrapped)
      ctx.fillStyle = currentTheme.text;
      ctx.font = "italic 44px 'Playfair Display', serif";
      const maxWidth = width - 240;
      const lines: string[] = [];

      const paragraphs = verse.split("\n");
      paragraphs.forEach((p) => {
        const words = p.split(" ");
        let line = "";
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + " ";
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + " ";
          } else {
            line = testLine;
          }
        }
        lines.push(line);
      });

      // Calculate vertical centering
      const lineHeight = 64;
      const totalTextHeight = lines.length * lineHeight;
      let startY = (height - totalTextHeight) / 2 - 20;

      lines.forEach((l) => {
        ctx.fillText(l.trim(), width / 2, startY);
        startY += lineHeight;
      });

      // 6. English Translation Subtitle (if available)
      if (translation && translation.trim()) {
        ctx.fillStyle = currentTheme.subText;
        ctx.font = "300 24px sans-serif";
        ctx.fillText(`"${translation}"`, width / 2, startY + 40);
      }

      // 7. Divider Line with Star
      const divY = height - 200;
      ctx.strokeStyle = `${currentTheme.accent}80`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 120, divY);
      ctx.lineTo(width / 2 - 20, divY);
      ctx.moveTo(width / 2 + 20, divY);
      ctx.lineTo(width / 2 + 120, divY);
      ctx.stroke();

      ctx.fillStyle = currentTheme.accent;
      ctx.font = "20px sans-serif";
      ctx.fillText("✦", width / 2, divY + 7);

      // 8. Bottom Dedication & Brand Seal
      if (includeDedication && dedicationText.trim()) {
        ctx.fillStyle = currentTheme.subText;
        ctx.font = "300 18px sans-serif";
        ctx.fillText(dedicationText, width / 2, height - 150);
      }

      ctx.fillStyle = currentTheme.accent;
      ctx.font = "500 16px sans-serif";
      ctx.letterSpacing = "4px";
      ctx.fillText("LIKHASHA · HAR LAFZ EK NASHA 🌙", width / 2, height - 110);

      // 9. Trigger Download
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `likhasha-${mood.toLowerCase()}-poster.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast.success("High-definition art poster downloaded!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to export poster");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 overflow-y-auto">
      {/* Hidden high-res canvas for rendering */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="relative w-full max-w-4xl rounded-3xl glass-vision border border-gold/40 p-6 sm:p-10 shadow-[0_25px_80px_rgba(0,0,0,0.9)] my-8">
        {/* Close Button */}
        <button
          onClick={() => {
            soundEffects.playClick();
            onClose();
          }}
          className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full glass-pill text-mist hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="font-sans text-[10px] uppercase tracking-[0.4em] text-gold">
              Museum-Grade Art Exporter
            </span>
          </div>
          <h3 className="mt-1 font-display text-2xl sm:text-3xl font-light text-foreground">
            Custom Poetry Poster
          </h3>
          <p className="mt-1 text-xs text-mist font-light">
            Export ready-to-share high-definition visuals for Instagram stories,
            WhatsApp status, or print.
          </p>
        </div>

        {/* Poster Studio Layout */}
        <div className="grid gap-8 lg:grid-cols-12 items-center">
          {/* Live Preview Column (Desktop: 7 cols) */}
          <div className="lg:col-span-7 flex justify-center">
            <div
              className="relative w-full max-w-sm aspect-[4/5] rounded-xl p-8 flex flex-col justify-between border shadow-2xl transition-colors duration-500"
              style={{
                backgroundColor: currentTheme.bg,
                borderColor: currentTheme.border,
                boxShadow: `0 20px 50px -10px ${currentTheme.border}30`,
              }}
            >
              {/* Ornate inner border */}
              <div
                className="absolute inset-2 rounded-lg border pointer-events-none"
                style={{ borderColor: `${currentTheme.border}40` }}
              />

              {/* Corner Ornaments */}
              <div
                className="absolute top-2 left-2 w-2 h-2 rounded-full"
                style={{ backgroundColor: currentTheme.cornerColor }}
              />
              <div
                className="absolute top-2 right-2 w-2 h-2 rounded-full"
                style={{ backgroundColor: currentTheme.cornerColor }}
              />
              <div
                className="absolute bottom-2 left-2 w-2 h-2 rounded-full"
                style={{ backgroundColor: currentTheme.cornerColor }}
              />
              <div
                className="absolute bottom-2 right-2 w-2 h-2 rounded-full"
                style={{ backgroundColor: currentTheme.cornerColor }}
              />

              {/* Top Bar */}
              <div className="text-center z-10">
                <p
                  className="font-sans text-[8px] uppercase tracking-[0.4em] font-semibold"
                  style={{ color: currentTheme.accent }}
                >
                  LIKHASHA POETRY STUDIO · {(mood || "Poetic").toUpperCase()}
                </p>
              </div>

              {/* Middle Verse */}
              <div className="text-center my-auto z-10 px-2">
                <p
                  className="font-display text-xl sm:text-2xl italic leading-relaxed"
                  style={{ color: currentTheme.text }}
                >
                  &ldquo;{verse}&rdquo;
                </p>
                {translation && (
                  <p
                    className="mt-3 font-sans text-xs italic font-light leading-relaxed"
                    style={{ color: currentTheme.subText }}
                  >
                    {translation}
                  </p>
                )}
              </div>

              {/* Bottom Dedication & Logo */}
              <div className="text-center z-10">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span
                    className="h-px w-8"
                    style={{ backgroundColor: `${currentTheme.accent}60` }}
                  />
                  <span
                    className="text-[10px]"
                    style={{ color: currentTheme.accent }}
                  >
                    ✦
                  </span>
                  <span
                    className="h-px w-8"
                    style={{ backgroundColor: `${currentTheme.accent}60` }}
                  />
                </div>
                {includeDedication && dedicationText && (
                  <p
                    className="font-sans text-[10px] tracking-wider mb-1"
                    style={{ color: currentTheme.subText }}
                  >
                    {dedicationText}
                  </p>
                )}
                <p
                  className="font-sans text-[9px] uppercase tracking-[0.3em] font-medium"
                  style={{ color: currentTheme.accent }}
                >
                  Likhasha · Har lafz ek nasha 🌙
                </p>
              </div>
            </div>
          </div>

          {/* Controls Column (Desktop: 5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Theme Selector */}
            <div>
              <label className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.3em] text-mist mb-3">
                <Palette className="w-3.5 h-3.5 text-gold" />
                Color Theme
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(THEMES) as PosterTheme[]).map((tKey) => {
                  const t = THEMES[tKey];
                  const isSelected = theme === tKey;
                  return (
                    <button
                      key={tKey}
                      onClick={() => {
                        soundEffects.playClick();
                        setTheme(tKey);
                      }}
                      className={cn(
                        "rounded-xl p-3 text-left transition-all border flex items-center justify-between",
                        isSelected
                          ? "border-gold bg-gold/15 shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                          : "border-white/10 glass-pill hover:border-white/30",
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20"
                          style={{ backgroundColor: t.bg }}
                        />
                        <span className="text-xs font-sans text-white font-medium">
                          {t.name}
                        </span>
                      </div>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-gold" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dedication Text */}
            <div>
              <label className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.3em] text-mist mb-2">
                <Type className="w-3.5 h-3.5 text-gold" />
                Personal Inscription
              </label>
              <input
                type="text"
                value={dedicationText}
                onChange={(e) => setDedicationText(e.target.value)}
                placeholder="Inscribed with soul..."
                className="w-full rounded-xl glass-pill px-4 py-2.5 text-sm text-white border border-white/15 outline-none focus:border-gold"
              />
            </div>

            {/* Download CTA Button */}
            <div className="pt-2">
              <button
                onClick={handleDownload}
                disabled={exporting}
                className="w-full rounded-full btn-gold py-4 px-6 flex items-center justify-center gap-2.5 font-sans text-[11px] uppercase tracking-[0.25em] font-medium shadow-[var(--shadow-gold)] transition-all duration-300 disabled:opacity-60"
              >
                <Download className="w-4 h-4 text-ink" />
                <span>
                  {exporting
                    ? "Rendering HD Poster..."
                    : "Download HD Poster (PNG)"}
                </span>
              </button>
              <p className="text-[10px] text-center text-mist/70 mt-2 font-sans">
                1080 × 1350 px · High Definition · Ready for Instagram &amp;
                Status
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
