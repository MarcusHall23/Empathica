import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useApp, getEmotionColors, getEmotionColorsDark } from "../context/AppContext";
import { Eye, Volume2, Zap, ChevronDown } from "lucide-react";

const fallbackEmotionData = [
  { time: "0:00", score: 22, label: "Greeting" },
  { time: "0:05", score: 18, label: "Opening" },
  { time: "0:10", score: 25, label: "Topic intro" },
  { time: "0:15", score: 31, label: "Light tension" },
  { time: "0:20", score: 28, label: "Easing" },
  { time: "0:25", score: 22, label: "Comfortable" },
  { time: "0:30", score: 35, label: "Excitement" },
  { time: "0:35", score: 42, label: "Debate" },
  { time: "0:40", score: 38, label: "Resolution" },
  { time: "0:42", score: 28, label: "Closing" },
];

function CueCard({ icon: Icon, label, value, color, darkMode }: {
  icon: any;
  label: string;
  value: number;
  color: string;
  darkMode: boolean;
}) {
  const textPrimary = darkMode ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.8)";
  const textSecondary = darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";
  const trackBg = darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";

  return (
    <div className="flex items-center gap-3 py-2.5">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18` }}
      >
        <Icon size={17} style={{ color }} />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium" style={{ color: textPrimary }}>{label}</span>
          <span className="text-xs font-semibold" style={{ color }}>
            {value}%
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: trackBg }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${value}%`, background: `linear-gradient(to right, ${color}, ${color}cc)` }}
          />
        </div>
      </div>
    </div>
  );
}

export function InteractionAnalysis() {
  const { atmosphereScore, colorMappings, darkMode, interactions } = useApp();
  const colors = darkMode
    ? getEmotionColorsDark(atmosphereScore, colorMappings)
    : getEmotionColors(atmosphereScore, colorMappings);

  const [selectedInteraction, setSelectedInteraction] = useState(interactions[0]);
  const [showPicker, setShowPicker] = useState(false);

  // Keep selectedInteraction in sync if new entries are added and it was the first one
  const currentInteraction = interactions.find((i) => i.id === selectedInteraction?.id) ?? interactions[0];

  const cardBg = darkMode ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.75)";
  const cardBorder = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const textPrimary = darkMode ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.85)";
  const textSecondary = darkMode ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)";

  const interactionColors = darkMode
    ? getEmotionColorsDark(currentInteraction.atmosphereScore, colorMappings)
    : getEmotionColors(currentInteraction.atmosphereScore, colorMappings);

  const emotionData = currentInteraction.timeline && currentInteraction.timeline.length >= 2
    ? currentInteraction.timeline
    : fallbackEmotionData;

  return (
    <div className="px-5 pb-6">
      {/* Header */}
      <div className="pt-2 pb-4">
        <h1 className="text-xl" style={{ color: textPrimary, fontWeight: 600 }}>Analysis</h1>
        <p className="text-xs" style={{ color: textSecondary }}>Post-interaction breakdown</p>
      </div>

      {/* Interaction picker */}
      <div className="relative mb-4">
        <button
          onClick={() => setShowPicker((s) => !s)}
          className="w-full flex items-center gap-3 rounded-2xl px-4 py-3"
          style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
        >
          <div
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ background: interactionColors.from }}
          />
          <div className="flex-1 text-left">
            <p className="text-xs font-semibold" style={{ color: textPrimary }}>
              {currentInteraction.name}
            </p>
            <p className="text-[10px]" style={{ color: textSecondary }}>
              {currentInteraction.timestamp} · {currentInteraction.duration}
            </p>
          </div>
          <ChevronDown
            size={16}
            style={{
              color: textSecondary,
              transform: showPicker ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          />
        </button>
        {showPicker && (
          <div
            className="absolute top-full left-0 right-0 z-20 mt-1 rounded-2xl overflow-hidden"
            style={{
              background: darkMode ? "#1a1a2e" : "white",
              border: `1px solid ${cardBorder}`,
              boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
            }}
          >
            {interactions.map((inter) => {
              const ic = darkMode
                ? getEmotionColorsDark(inter.atmosphereScore, colorMappings)
                : getEmotionColors(inter.atmosphereScore, colorMappings);
              return (
                <button
                  key={inter.id}
                  onClick={() => {
                    setSelectedInteraction(inter);
                    setShowPicker(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:opacity-80 transition-opacity"
                  style={{
                    borderBottom: `1px solid ${cardBorder}`,
                    background: inter.id === currentInteraction.id ? `${ic.from}12` : "transparent",
                  }}
                >
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: ic.from }} />
                  <div className="flex-1 text-left">
                    <p className="text-xs font-medium" style={{ color: textPrimary }}>{inter.name}</p>
                    <p className="text-[10px]" style={{ color: textSecondary }}>{inter.timestamp}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        {[
          { label: "Atmosphere", value: currentInteraction.atmosphereScore, suffix: "/100", color: interactionColors.from },
          { label: "Attraction", value: currentInteraction.attractionProbability, suffix: "%", color: "#ec4899" },
          { label: "Lie Score", value: currentInteraction.lieDetectionScore, suffix: "%", color: currentInteraction.lieDetectionScore > 40 ? "#ef4444" : "#22c55e" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl p-3 flex flex-col items-center gap-1"
            style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <span className="text-lg font-light" style={{ color: stat.color }}>
              {stat.value}
              <span className="text-[10px]">{stat.suffix}</span>
            </span>
            <span className="text-[10px] text-center" style={{ color: textSecondary }}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Emotion timeline chart */}
      <div
        className="rounded-2xl p-4 mb-4"
        style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
      >
        <h3 className="text-sm font-semibold mb-3" style={{ color: textPrimary }}>Emotional Timeline</h3>
        <p className="text-[10px] mb-3" style={{ color: textSecondary }}>
          Atmosphere score fluctuation over the interaction
        </p>
        <ResponsiveContainer width="100%" height={130}>
          <AreaChart data={emotionData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={interactionColors.from} stopOpacity={0.4} />
                <stop offset="100%" stopColor={interactionColors.from} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"}
              vertical={false}
            />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 9, fill: darkMode ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 9, fill: darkMode ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                background: darkMode ? "#1a1a2e" : "white",
                border: `1px solid ${cardBorder}`,
                borderRadius: 12,
                fontSize: 11,
                color: textPrimary,
              }}
              labelStyle={{ color: textSecondary, marginBottom: 2 }}
              itemStyle={{ color: interactionColors.from }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke={interactionColors.from}
              strokeWidth={2}
              fill="url(#areaGrad)"
              dot={{ fill: interactionColors.from, strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, fill: interactionColors.from }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Key insights */}
      <div
        className="rounded-2xl p-4 mb-4"
        style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
      >
        <h3 className="text-sm font-semibold mb-3" style={{ color: textPrimary }}>Key Insights</h3>
        <div className="flex flex-col gap-2">
          {currentInteraction.keyInsights.map((insight, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 rounded-xl px-3 py-2.5"
              style={{ background: `${interactionColors.from}0d` }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0"
                style={{ background: interactionColors.from }}
              />
              <p className="text-xs" style={{ color: textPrimary }}>{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Social cue breakdown */}
      <div
        className="rounded-2xl p-4"
        style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
      >
        <h3 className="text-sm font-semibold mb-1" style={{ color: textPrimary }}>Social Cue Breakdown</h3>
        <p className="text-[10px] mb-3" style={{ color: textSecondary }}>Detected behavioral signals</p>
        <div className="divide-y" style={{ borderColor: cardBorder }}>
          <CueCard icon={Eye} label="Eye Contact" value={72} color="#3b82f6" darkMode={darkMode} />
          <CueCard icon={Volume2} label="Tone Shifts" value={currentInteraction.atmosphereScore < 40 ? 28 : 61} color="#8b5cf6" darkMode={darkMode} />
          <CueCard icon={Zap} label="Emotional Tension" value={currentInteraction.atmosphereScore} color={interactionColors.from} darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
}