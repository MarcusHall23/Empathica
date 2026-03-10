import { useState, useEffect, useRef } from "react";
import { CheckCircle, X } from "lucide-react";
import {
  useApp,
  getEmotionColors,
  getEmotionColorsDark,
  getEmotionLevel,
  type Interaction,
  type PendingSessionData,
} from "../context/AppContext";

function generateInsights(
  atmosphereScore: number,
  attractionProb: number,
  lieScore: number,
  engagementScore: number
): string[] {
  const insights: string[] = [];
  const level = getEmotionLevel(atmosphereScore);

  if (level === "calm") insights.push("Very calm and relaxed atmosphere");
  else if (level === "neutral") insights.push("Balanced emotional energy");
  else if (level === "energetic") insights.push("Energetic and engaged interaction");
  else if (level === "tense") insights.push("Noticeable tension detected");
  else insights.push("High stress environment");

  if (engagementScore > 70) insights.push("High social engagement observed");
  else if (engagementScore > 40) insights.push("Moderate engagement levels");
  else insights.push("Low engagement signals");

  if (attractionProb > 70) insights.push("Strong mutual interest detected");
  else if (attractionProb > 40) insights.push("Moderate rapport established");
  else insights.push("Limited emotional connection");

  if (lieScore < 20) insights.push("High truthfulness — open communication");
  else if (lieScore > 55) insights.push("Possible deceptive cues observed");

  return insights.slice(0, 3);
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds} sec`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m < 60) return s > 0 ? `${m} min ${s} sec` : `${m} min`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return `${h}h ${rm} min`;
}

function formatTimestamp(): string {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const h = (hours % 12 || 12).toString();
  return `Today, ${h}:${minutes} ${ampm}`;
}

interface SaveSessionModalProps {
  data: PendingSessionData;
}

export function SaveSessionModal({ data }: SaveSessionModalProps) {
  const { darkMode, colorMappings, addInteraction, setPendingSessionData } = useApp();

  const colors = darkMode
    ? getEmotionColorsDark(data.atmosphereScore, colorMappings)
    : getEmotionColors(data.atmosphereScore, colorMappings);

  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(timer);
  }, []);

  const cardBg = darkMode ? "rgba(16,16,26,0.98)" : "rgba(255,255,255,0.99)";
  const textPrimary = darkMode ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.85)";
  const textSecondary = darkMode ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)";
  const inputBg = darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.04)";
  const inputBorder = darkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)";

  const level = getEmotionLevel(data.atmosphereScore);
  const levelLabel: Record<string, string> = {
    calm: "Calm", neutral: "Neutral", energetic: "Energetic", tense: "Tense", stressful: "Stressful",
  };

  const handleSave = () => {
    if (!name.trim()) return;

    const atmScore = data.atmosphereScore;
    const batteryImpact =
      level === "calm" ? Math.round(data.engagementScore * 0.3) :
      level === "neutral" ? Math.round(data.engagementScore * 0.1) :
      level === "energetic" ? -Math.round(data.engagementScore * 0.15) :
      level === "tense" ? -Math.round(data.engagementScore * 0.35) :
      -Math.round(data.engagementScore * 0.5);

    const newInteraction: Interaction = {
      id: Date.now().toString(),
      name: name.trim(),
      timestamp: formatTimestamp(),
      duration: formatDuration(data.sessionTime),
      atmosphereScore: atmScore,
      batteryImpact,
      keyInsights: generateInsights(atmScore, data.attractionProb, data.lieScore, data.engagementScore),
      attractionProbability: Math.round(data.attractionProb),
      lieDetectionScore: Math.round(data.lieScore),
      timeline: data.timeline.length >= 2 ? data.timeline : undefined,
    };

    addInteraction(newInteraction);
    setSaved(true);

    setTimeout(() => {
      setPendingSessionData(null);
    }, 1200);
  };

  const handleDiscard = () => {
    setPendingSessionData(null);
  };

  return (
    /* Overlay */
    <div
      className="absolute inset-0 z-50 flex flex-col justify-end"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
    >
      {/* Bottom sheet */}
      <div
        className="w-full rounded-t-[28px] px-5 pt-5 pb-10"
        style={{
          background: cardBg,
          boxShadow: "0 -24px 80px rgba(0,0,0,0.3)",
          animation: "slideUp 0.3s cubic-bezier(0.32,0.72,0,1)",
        }}
      >
        {/* Handle */}
        <div className="flex justify-center mb-5">
          <div
            className="w-10 h-1 rounded-full"
            style={{ background: darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)" }}
          />
        </div>

        {saved ? (
          /* Success state */
          <div className="flex flex-col items-center py-4 gap-3">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: `${colors.from}18` }}
            >
              <CheckCircle size={30} style={{ color: colors.from }} />
            </div>
            <p className="text-base" style={{ color: textPrimary, fontWeight: 600 }}>Session Saved!</p>
            <p className="text-xs text-center" style={{ color: textSecondary }}>
              "{name}" added to History & Analysis
            </p>
          </div>
        ) : (
          <>
            {/* Icon + title */}
            <div className="flex items-center gap-4 mb-5">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${colors.from}20, ${colors.via}12)`,
                  border: `1px solid ${colors.from}28`,
                }}
              >
                <CheckCircle size={22} style={{ color: colors.from }} />
              </div>
              <div>
                <p className="text-base" style={{ color: textPrimary, fontWeight: 600 }}>Save Session</p>
                <p className="text-[12px]" style={{ color: textSecondary }}>
                  Name this interaction to save it
                </p>
              </div>
            </div>

            {/* Session summary chips */}
            <div className="flex gap-2 flex-wrap mb-5">
              {[
                { label: formatDuration(data.sessionTime), emoji: "⏱" },
                { label: levelLabel[level] ?? "Unknown", emoji: "🌡" },
                { label: `${Math.round(data.attractionProb)}% interest`, emoji: "💫" },
                { label: `Score ${data.atmosphereScore}`, emoji: "📊" },
              ].map((chip) => (
                <div
                  key={chip.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px]"
                  style={{
                    background: `${colors.from}12`,
                    color: colors.from,
                    border: `1px solid ${colors.from}22`,
                  }}
                >
                  <span>{chip.emoji}</span>
                  <span style={{ fontWeight: 500 }}>{chip.label}</span>
                </div>
              ))}
            </div>

            {/* Name input */}
            <div className="mb-5">
              <label
                className="block text-[11px] font-semibold mb-2"
                style={{ color: textSecondary, letterSpacing: "0.06em" }}
              >
                INTERACTION NAME
              </label>
              <input
                ref={inputRef}
                type="text"
                placeholder="e.g. Coffee with Alex, Team Meeting…"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
                className="w-full rounded-2xl px-4 py-3 text-sm outline-none"
                style={{
                  background: inputBg,
                  border: `1.5px solid ${name.trim() ? colors.from + "55" : inputBorder}`,
                  color: textPrimary,
                  transition: "border-color 0.2s",
                }}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleDiscard}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm flex-shrink-0 transition-all active:scale-95"
                style={{
                  background: inputBg,
                  border: `1px solid ${inputBorder}`,
                  color: textSecondary,
                }}
              >
                <X size={15} />
                <span style={{ fontWeight: 500 }}>Discard</span>
              </button>

              <button
                onClick={handleSave}
                disabled={!name.trim()}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm transition-all active:scale-95"
                style={{
                  background: name.trim()
                    ? `linear-gradient(135deg, ${colors.from}, ${colors.via})`
                    : darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
                  color: name.trim() ? "white" : textSecondary,
                  boxShadow: name.trim() ? `0 8px 28px ${colors.from}45` : "none",
                  cursor: name.trim() ? "pointer" : "not-allowed",
                }}
              >
                <CheckCircle size={15} />
                <span style={{ fontWeight: 600 }}>Save to History</span>
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
