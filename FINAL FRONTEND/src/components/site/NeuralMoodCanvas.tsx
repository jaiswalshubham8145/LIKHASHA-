import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  phase: number;
}

interface NeuralMoodCanvasProps {
  moodColor?: string;
  isGenerating?: boolean;
  className?: string;
}

/**
 * Neural Mood-Network Visualizer (Inspired by oryzo.ai & labs.lusion.co).
 * Simulates connected glowing sentiment nodes that pulse and morph colors in real time.
 */
export function NeuralMoodCanvas({
  moodColor = "#d4af37",
  isGenerating = false,
  className = "w-full h-full",
}: NeuralMoodCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const onResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", onResize);

    const nodeCount = Math.min(38, Math.floor(width / 24));
    const nodes: Node[] = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2.2 + 1.2,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    const onPointerLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);

    let raf = 0;
    let vortexAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      if (isGenerating) {
        vortexAngle += 0.08;
      }

      // Update & Draw Nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]!;

        if (isGenerating) {
          // Lusion-style implosion vortex towards center
          const dx = centerX - n.x;
          const dy = centerY - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          n.vx += (dx / (dist + 10)) * 0.45 - Math.sin(vortexAngle) * 0.3;
          n.vy += (dy / (dist + 10)) * 0.45 + Math.cos(vortexAngle) * 0.3;
          n.x += n.vx * 0.8;
          n.y += n.vy * 0.8;
        } else {
          n.x += n.vx;
          n.y += n.vy;

          // Boundary bouncing
          if (n.x < 0 || n.x > width) n.vx *= -1;
          if (n.y < 0 || n.y > height) n.vy *= -1;

          // Mouse repulsion
          const mdx = n.x - mouseX;
          const mdy = n.y - mouseY;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 100) {
            const force = (100 - mdist) * 0.02;
            n.x += (mdx / mdist) * force;
            n.y += (mdy / mdist) * force;
          }
        }

        n.phase += 0.03;
        const pulseRadius = n.radius + Math.sin(n.phase) * 0.8;

        // Draw node
        ctx.save();
        ctx.fillStyle = moodColor;
        ctx.shadowBlur = 10;
        ctx.shadowColor = moodColor;
        ctx.beginPath();
        ctx.arc(n.x, n.y, Math.max(1, pulseRadius), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Connect proximity edges
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j]!;
          const dx = n.x - n2.x;
          const dy = n.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const maxDist = isGenerating ? 220 : 120;
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * (isGenerating ? 0.65 : 0.32);
            ctx.save();
            ctx.strokeStyle = moodColor;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      raf = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      cancelAnimationFrame(raf);
    };
  }, [moodColor, isGenerating]);

  return <canvas ref={canvasRef} className={className} />;
}
