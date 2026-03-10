import { useState, useEffect, useMemo } from "react";
import { Bell, ChevronRight, Zap, Users, Wind } from "lucide-react";
import { useApp, getEmotionColors, getEmotionColorsDark, getEmotionLabel } from "../context/AppContext";
import { useNavigate } from "react-router";
import { BreathingExercise } from "./BreathingExercise";

function CircularProgress({ score, colors, darkMode }: { score: number; colors: any; darkMode: boolean }) {
  const radius = 72;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={radius * 2} height={radius * 2} viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke={darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}
          strokeWidth={stroke}
        />
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke={`url(#scoreGradient)`}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${radius} ${radius})`}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }}
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.from} />
            <stop offset="100%" stopColor={colors.via} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-light" style={{ color: colors.from }}>{score}</span>
        <span className="text-[11px] mt-0.5" style={{ color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)" }}>/100</span>
      </div>
    </div>
  );
}

function BatteryMeter({ value, colors, darkMode }: { value: number; colors: any; darkMode: boolean }) {
  const segments = 20;
  const filled = Math.round((value / 100) * segments);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: segments }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded-sm transition-all duration-500"
          style={{
            width: "100%",
            flex: 1,
            background:
              i < filled
                ? i < filled * 0.33
                  ? "#ef4444"
                  : i < filled * 0.66
                  ? "#f97316"
                  : colors.from
                : darkMode
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.06)",
            opacity: i < filled ? 1 : 0.5,
          }}
        />
      ))}
    </div>
  );
}

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 18) return "Good afternoon";
  return "Good evening";
}

export function HomeDashboard() {
  const { atmosphereScore, setAtmosphereScore, socialBattery, colorMappings, darkMode, userName, interactions } = useApp();
  const navigate = useNavigate();
  const colors = darkMode
    ? getEmotionColorsDark(atmosphereScore, colorMappings)
    : getEmotionColors(atmosphereScore, colorMappings);

  const [animScore, setAnimScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimScore(atmosphereScore), 300);
    return () => clearTimeout(timer);
  }, [atmosphereScore]);

  const greeting = useMemo(() => getTimeGreeting(), []);

  // First name only for a friendly greeting
  const firstName = userName.split(" ")[0];

  // Pull the 3 most recent from context (live)
  const recentInteractions = interactions.slice(0, 3);

  // Insight count (new sessions = ones added this session, approximated by "Today" timestamp)
  const newInsights = interactions.filter((i) => i.timestamp.startsWith("Today")).length;

  const cardBg = darkMode ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.75)";
  const cardBorder = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const textPrimary = darkMode ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.85)";
  const textSecondary = darkMode ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)";

  return (
    <div className="px-5 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-2 pb-4">
        <div>
          <p className="text-xs" style={{ color: textSecondary }}>{greeting}</p>
          <h1 className="text-xl" style={{ color: textPrimary, fontWeight: 600 }}>{userName}</h1>
        </div>
        {/* <button
          className="w-9 h-9 rounded-full flex items-center justify-center relative"
          style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
        >
          <Bell size={16} style={{ color: textSecondary }} />
          <div
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: colors.from }}
          />
        </button> */}
      </div>

      {/* Main atmosphere card */}
      <div
        className="rounded-3xl p-5 mb-4 relative overflow-hidden"
        style={{
          background: darkMode
            ? `linear-gradient(135deg, ${colors.from}30, ${colors.via}20)`
            : `linear-gradient(135deg, ${colors.from}18, ${colors.via}10)`,
          border: `1px solid ${colors.from}30`,
          backdropFilter: "blur(20px)",
        }}
      >
        <div
          className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20 blur-2xl"
          style={{ background: colors.from }}
        />
        <div
          className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full opacity-15 blur-2xl"
          style={{ background: colors.via }}
        />

        <div className="relative flex items-center gap-5">
          <CircularProgress score={animScore} colors={colors} darkMode={darkMode} />
          <div className="flex-1">
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-2"
              style={{ background: `${colors.from}20`, border: `1px solid ${colors.from}30` }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: colors.from }}
              />
              <span className="text-[11px] font-medium" style={{ color: colors.from }}>
                Live
              </span>
            </div>
            <h2 className="text-lg mb-0.5" style={{ color: textPrimary, fontWeight: 600 }}>
              {getEmotionLabel(atmosphereScore)}
            </h2>
            <p className="text-xs leading-relaxed" style={{ color: textSecondary }}>
              {atmosphereScore <= 20
                ? 'Emotional atmosphere is calming. Ideal time for deep conversations, reflection, and intimacy'
                : atmosphereScore <= 40
                ? `Emotional atmosphere is low-stress. A great time for productive conversations and social activities with little battery consumption.`
                :atmosphereScore <= 60
                ? 'Stimulating and lively. Conversations are exciting, engaging, but may feel fast-paced.'
                : atmosphereScore <= 70
                ? 'Elevated stress signals. Be mindful of your words and give space when needed.'
                : `High-stress environment detected. Consider pausing, breathing, and de-escalating.`}
            </p>
          </div>
        </div>

        {/* Score slider for demo */}
        <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${colors.from}20` }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs" style={{ color: textSecondary }}>Adjust Score (Demo)</span>
            <span className="text-xs font-medium" style={{ color: colors.from }}>{atmosphereScore}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={atmosphereScore}
            onChange={(e) => setAtmosphereScore(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${colors.from} ${atmosphereScore}%, ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"} ${atmosphereScore}%)`,
              accentColor: colors.from,
            }}
          />
        </div>
      </div>

      {/* Social Battery — computed live from history */}
      <div
        className="rounded-2xl p-4 mb-4"
        style={{
          background: cardBg,
          border: `1px solid ${cardBorder}`,
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: `${colors.from}15` }}
            >
              <Zap size={15} style={{ color: colors.from }} />
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: textPrimary }}>Social Battery</p>
              <p className="text-[10px]" style={{ color: textSecondary }}>Based on your interaction history</p>
            </div>
          </div>
          <span
            className="text-sm transition-all duration-700"
            style={{ color: colors.from, fontWeight: 600 }}
          >
            {socialBattery}%
          </span>
        </div>
        <BatteryMeter value={socialBattery} colors={colors} darkMode={darkMode} />
        <p className="text-[10px] mt-2" style={{ color: textSecondary }}>
          {socialBattery > 70
            ? "Charged and ready for social interactions"
            : socialBattery > 40
            ? "Moderate energy — take breaks when needed"
            : "Low energy — consider some quiet time to recharge"}
        </p>
      </div>

      {/* Quick summary cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Breathing Exercise card */}
        <BreathingExercise />

        {/* Active insights card */}
        <div
          className="rounded-2xl p-3.5 flex flex-col gap-2"
          style={{ background: cardBg, border: `1px solid ${cardBorder}`, backdropFilter: "blur(20px)" }}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: `${colors.from}15` }}
          >
            <Users size={15} style={{ color: colors.from }} />
          </div>
          <div>
            <p className="text-[10px]" style={{ color: textSecondary }}>Recent Sessions</p>
            <p className="text-sm font-semibold" style={{ color: textPrimary }}>
              {newInsights} {newInsights === 1 ? "Session" : "Sessions"}
            </p>
          </div>
          <div className="flex gap-1">
            {recentInteractions.slice(0, 3).map((interaction, i) => {
              const ic = darkMode
                ? getEmotionColorsDark(interaction.atmosphereScore, colorMappings)
                : getEmotionColors(interaction.atmosphereScore, colorMappings);
              return <div key={i} className="w-3 h-1.5 rounded-full" style={{ background: ic.from }} />;
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity — live from context */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: cardBg, border: `1px solid ${cardBorder}`, backdropFilter: "blur(20px)" }}
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h3 className="text-sm font-semibold" style={{ color: textPrimary }}>Recent Interactions</h3>
          <button
            className="flex items-center gap-0.5 text-[11px]"
            style={{ color: colors.from }}
            onClick={() => navigate("/history")}
          >
            See all <ChevronRight size={12} />
          </button>
        </div>

        {recentInteractions.length === 0 && (
          <div className="px-4 pb-4">
            <p className="text-xs" style={{ color: textSecondary }}>No interactions recorded yet.</p>
          </div>
        )}

        {recentInteractions.map((item, i) => {
          const itemColors = darkMode
            ? getEmotionColorsDark(item.atmosphereScore, colorMappings)
            : getEmotionColors(item.atmosphereScore, colorMappings);
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderTop: i > 0 ? `1px solid ${cardBorder}` : "none" }}
            >
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: itemColors.from }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate" style={{ color: textPrimary }}>{item.name}</p>
                <p className="text-[10px]" style={{ color: textSecondary }}>{item.timestamp}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[10px] font-medium" style={{ color: itemColors.from }}>
                  Score {item.atmosphereScore}
                </p>
                <p
                  className="text-[10px]"
                  style={{ color: item.batteryImpact > 0 ? "#22c55e" : "#ef4444" }}
                >
                  {item.batteryImpact > 0 ? "+" : ""}{item.batteryImpact}%
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}