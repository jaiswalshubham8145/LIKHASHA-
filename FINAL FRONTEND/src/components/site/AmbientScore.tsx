import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ScoreNodes = {
  context: AudioContext;
  master: GainNode;
  oscillators: OscillatorNode[];
  timer: number;
};

/** An original, low-volume flute/violin-inspired ambient layer built with Web Audio. */
export function AmbientScore() {
  const [playing, setPlaying] = useState(false);
  const nodes = useRef<ScoreNodes | null>(null);

  useEffect(() => {
    return () => {
      const active = nodes.current;
      if (!active) return;
      window.clearInterval(active.timer);
      active.master.gain.linearRampToValueAtTime(
        0,
        active.context.currentTime + 0.3,
      );
      active.oscillators.forEach((oscillator) =>
        oscillator.stop(active.context.currentTime + 0.35),
      );
      void active.context.close();
      nodes.current = null;
    };
  }, []);

  const toggle = () => {
    if (nodes.current) {
      const active = nodes.current;
      window.clearInterval(active.timer);
      active.master.gain.linearRampToValueAtTime(
        0,
        active.context.currentTime + 0.45,
      );
      active.oscillators.forEach((oscillator) =>
        oscillator.stop(active.context.currentTime + 0.5),
      );
      window.setTimeout(() => void active.context.close(), 520);
      nodes.current = null;
      setPlaying(false);
      return;
    }

    const context = new window.AudioContext();
    const master = context.createGain();
    master.gain.setValueAtTime(0, context.currentTime);
    master.gain.linearRampToValueAtTime(0.026, context.currentTime + 2.8);

    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1350, context.currentTime);
    filter.Q.setValueAtTime(0.45, context.currentTime);
    filter.connect(master);
    master.connect(context.destination);

    const voices = [
      { type: "sine" as OscillatorType, frequency: 146.83, detune: -5 },
      { type: "triangle" as OscillatorType, frequency: 220, detune: 4 },
      { type: "sine" as OscillatorType, frequency: 293.66, detune: -3 },
      { type: "sine" as OscillatorType, frequency: 440, detune: 2 },
    ];
    const oscillators = voices.map((voice, index) => {
      const oscillator = context.createOscillator();
      const voiceGain = context.createGain();
      oscillator.type = voice.type;
      oscillator.frequency.setValueAtTime(voice.frequency, context.currentTime);
      oscillator.detune.setValueAtTime(voice.detune, context.currentTime);
      voiceGain.gain.setValueAtTime(
        index === 1 ? 0.16 : index === 3 ? 0.035 : 0.09,
        context.currentTime,
      );
      const vibrato = context.createOscillator();
      const vibratoDepth = context.createGain();
      vibrato.frequency.value = 0.08 + index * 0.025;
      vibratoDepth.gain.value = index === 3 ? 1.8 : 0.7;
      vibrato.connect(vibratoDepth);
      vibratoDepth.connect(oscillator.detune);
      vibrato.start();
      oscillator.connect(voiceGain);
      voiceGain.connect(filter);
      oscillator.start();
      return [oscillator, vibrato];
    });

    const allOscillators = oscillators.flat();
    const notes = [220, 246.94, 293.66, 329.63, 293.66, 246.94];
    let note = 0;
    const timer = window.setInterval(() => {
      const lead = allOscillators[6];
      if (!lead) return;
      note = (note + 1) % notes.length;
      lead.frequency.exponentialRampToValueAtTime(
        notes[note] ?? 220,
        context.currentTime + 2.4,
      );
    }, 3200);

    nodes.current = { context, master, oscillators: allOscillators, timer };
    setPlaying(true);
  };

  return (
    <button
      type="button"
      aria-label={playing ? "Mute ambient score" : "Play ambient score"}
      title={playing ? "Mute ambient score" : "Play meditative ambient score"}
      aria-pressed={playing}
      onClick={toggle}
      className={`fixed bottom-5 right-5 z-[70] flex h-11 w-11 items-center justify-center rounded-full glass-vision border transition-all duration-500 ${
        playing
          ? "border-gold text-gold shadow-[0_0_25px_rgba(212,175,55,0.4)] bg-gold/15 scale-105"
          : "border-white/15 text-white/70 hover:text-gold hover:border-gold/50"
      }`}
    >
      {playing ? (
        <Volume2 size={16} strokeWidth={1.8} />
      ) : (
        <VolumeX size={16} strokeWidth={1.5} />
      )}
      <span className="sr-only">
        {playing ? "Mute ambient score" : "Play ambient score"}
      </span>
    </button>
  );
}
