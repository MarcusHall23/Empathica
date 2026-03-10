import { useState, useEffect, useRef } from "react";
import { useApp, getEmotionColors, getEmotionColorsDark, getEmotionLevel } from "../context/AppContext";
import { Activity, Heart, AlertTriangle, Users, Play, Square, Mic } from "lucide-react";

function Waveform({ isActive, colors, darkMode }: { isActive: boolean; colors: any; darkMode: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const mid = h / 2;

      if (!isActive) {
        ctx.beginPath();
        ctx.moveTo(0, mid);
        ctx.lineTo(w, mid);
        ctx.strokeStyle = darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        return;
      }

      timeRef.current += 0.04;
      const t = timeRef.current;

      const gradient = ctx.createLinearGradient(0, 0, w, 0);
      gradient.addColorStop(0, `${colors.from}00`);
      gradient.addColorStop(0.2, colors.from);
      gradient.addColorStop(0.8, colors.via);
      gradient.addColorStop(1, `${colors.via}00`);

      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const xNorm = x / w;
        const y =
          mid +
          Math.sin(xNorm * 12 + t) * 18 +
          Math.sin(xNorm * 8 - t * 1.3) * 10 +
          Math.sin(xNorm * 5 + t * 0.7) * 6;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const xNorm = x / w;
        const y =
          mid +
          Math.sin(xNorm * 12 + t) * 18 +
          Math.sin(xNorm * 8 - t * 1.3) * 10 +
          Math.sin(xNorm * 5 + t * 0.7) * 6;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `${colors.from}40`;
      ctx.lineWidth = 6;
      ctx.stroke();

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [isActive, colors, darkMode]);

  return (
    <canvas
      ref={canvasRef}
      width={340}
      height={80}
      className="w-full"
      style={{ height: 80 }}
    />
  );
}

function GaugeChart({ value, label, sublabel, colors, darkMode }: {
  value: number;
  label: string;
  sublabel: string;
  colors: any;
  darkMode: boolean;
}) {
  const radius = 52;
  const stroke = 7;
  const nr = radius - stroke / 2;
  const halfCircumference = Math.PI * nr;
  const offset = halfCircumference - (value / 100) * halfCircumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: radius * 2, height: radius + 12 }}>
        <svg width={radius * 2} height={radius + 12} viewBox={`0 0 ${radius * 2} ${radius + 12}`}>
          <path
            d={`M ${stroke / 2} ${radius} A ${nr} ${nr} 0 0 1 ${radius * 2 - stroke / 2} ${radius}`}
            fill="none"
            stroke={darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <path
            d={`M ${stroke / 2} ${radius} A ${nr} ${nr} 0 0 1 ${radius * 2 - stroke / 2} ${radius}`}
            fill="none"
            stroke={`url(#gaugeGrad-${label})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={halfCircumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }}
          />
          <defs>
            <linearGradient id={`gaugeGrad-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors.from} />
              <stop offset="100%" stopColor={colors.via} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center">
          <span className="text-xl font-light" style={{ color: colors.from }}>{value}%</span>
        </div>
      </div>
      <p className="text-xs font-semibold mt-1 text-center" style={{ color: darkMode ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.8)" }}>
        {label}
      </p>
      <p className="text-[10px] text-center" style={{ color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
        {sublabel}
      </p>
    </div>
  );
}

function MetricBar({ label, value, icon: Icon, color, darkMode }: {
  label: string;
  value: number;
  icon: any;
  color: string;
  darkMode: boolean;
}) {
  const textPrimary = darkMode ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.8)";
  const textSecondary = darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";
  const trackBg = darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";

  return (
    <div className="flex items-center gap-3">
      <div
        className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center"
        style={{ background: `${color}15` }}
      >
        <Icon size={15} style={{ color }} />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium" style={{ color: textPrimary }}>{label}</span>
          <span className="text-xs" style={{ color: textSecondary }}>{value}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: trackBg }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${value}%`, background: color }}
          />
        </div>
      </div>
    </div>
  );
}

export function RealTimeInteraction() {
  const {
    atmosphereScore,
    colorMappings,
    darkMode,
    isSessionActive,
    sessionTime,
    attractionProb,
    lieScore,
    engagementScore,
    startSession,
    stopSession,
  } = useApp();

  const colors = darkMode
    ? getEmotionColorsDark(atmosphereScore, colorMappings)
    : getEmotionColors(atmosphereScore, colorMappings);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const cardBg = darkMode ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.75)";
  const cardBorder = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const textPrimary = darkMode ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.85)";
  const textSecondary = darkMode ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)";

  return (
    <div className="px-5 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-2 pb-4">
        <div>
          <h1 className="text-xl" style={{ color: textPrimary, fontWeight: 600 }}>Live Analysis</h1>
          <p className="text-xs" style={{ color: textSecondary }}>Real-time interaction signals</p>
        </div>
        {isSessionActive && (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: `${colors.from}20`, border: `1px solid ${colors.from}30` }}
          >
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: colors.from }} />
            <span className="text-[11px] font-medium" style={{ color: colors.from }}>
              {formatTime(sessionTime)}
            </span>
          </div>
        )}
      </div>

      {/* Session toggle */}
      <div
        className="rounded-3xl p-5 mb-4 relative overflow-hidden"
        style={{
          background: darkMode
            ? `linear-gradient(135deg, ${colors.from}25, ${colors.via}15)`
            : `linear-gradient(135deg, ${colors.from}14, ${colors.via}08)`,
          border: `1px solid ${colors.from}25`,
        }}
      >
        <div
          className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-20 blur-2xl"
          style={{ background: colors.from }}
        />
        <Waveform isActive={isSessionActive} colors={colors} darkMode={darkMode} />

        <div className="flex flex-col items-center gap-3 mt-3">
          <button
            onClick={isSessionActive ? stopSession : startSession}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl transition-all duration-200 active:scale-95"
            style={{
              background: isSessionActive ? "#ef4444" : `linear-gradient(135deg, ${colors.from}, ${colors.via})`,
              color: "white",
              boxShadow: isSessionActive
                ? "0 8px 24px rgba(239,68,68,0.35)"
                : `0 8px 24px ${colors.from}40`,
            }}
          >
            {isSessionActive ? (
              <>
                <Square size={16} fill="white" />
                <span className="text-sm font-semibold">Stop Session</span>
              </>
            ) : (
              <>
                <Play size={16} fill="white" />
                <span className="text-sm font-semibold">Start Session</span>
              </>
            )}
          </button>

          {!isSessionActive && (
            <p className="text-[11px] text-center" style={{ color: textSecondary }}>
              Tap to begin analyzing your current interaction
            </p>
          )}
        </div>
      </div>

      {/* Mic indicator */}
      {isSessionActive && (
        <div
          className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-4"
          style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: `${colors.from}15` }}
          >
            <Mic size={15} style={{ color: colors.from }} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium" style={{ color: textPrimary }}>Microphone Active</p>
            <p className="text-[10px]" style={{ color: textSecondary }}>Analyzing tone, pace & emotional cues</p>
          </div>
          <div className="flex items-center gap-0.5">
            {[3, 5, 7, 4, 6, 3, 8].map((h, i) => (
              <div
                key={i}
                className="w-1 rounded-full"
                style={{
                  height: `${h * 2}px`,
                  background: colors.from,
                  animation: `pulse ${0.4 + i * 0.1}s ease-in-out infinite alternate`,
                  opacity: 0.7 + (i % 2) * 0.3,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Gauge charts */}
      <div
        className="rounded-2xl p-4 mb-4"
        style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
      >
        <h3 className="text-sm font-semibold mb-4" style={{ color: textPrimary }}>Key Metrics</h3>
        <div className="grid grid-cols-2 gap-4">
          <GaugeChart
            value={Math.round(attractionProb)}
            label="Mutual Interest"
            sublabel="Do they like me back?"
            colors={colors}
            darkMode={darkMode}
          />
          <GaugeChart
            value={Math.round(lieScore)}
            label="Truthfulness"
            sublabel="Deception probability"
            colors={{ from: lieScore > 60 ? "#ef4444" : lieScore > 30 ? "#f97316" : "#22c55e", via: "#10b981" }}
            darkMode={darkMode}
          />
        </div>
      </div>

      {/* Signal bars */}
      <div
        className="rounded-2xl p-4"
        style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
      >
        <h3 className="text-sm font-semibold mb-4" style={{ color: textPrimary }}>Signal Analysis</h3>
        <div className="flex flex-col gap-3">
          <MetricBar
            label="Social Engagement"
            value={Math.round(engagementScore)}
            icon={Users}
            color={colors.from}
            darkMode={darkMode}
          />
          <MetricBar
            label="Emotional Resonance"
            value={Math.round(attractionProb * 0.85)}
            icon={Heart}
            color="#ec4899"
            darkMode={darkMode}
          />
          <MetricBar
            label="Stress Indicators"
            value={Math.round(lieScore * 0.9)}
            icon={AlertTriangle}
            color={lieScore > 50 ? "#ef4444" : "#f97316"}
            darkMode={darkMode}
          />
          <MetricBar
            label="Active Listening"
            value={Math.round((100 - lieScore) * 0.8)}
            icon={Activity}
            color="#8b5cf6"
            darkMode={darkMode}
          />
        </div>
      </div>
    </div>
  );
}