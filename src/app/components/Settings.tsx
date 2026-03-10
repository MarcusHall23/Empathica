import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Moon,
  Sun,
  Shield,
  Glasses,
  Bell,
  ChevronRight,
  Palette,
  Info,
  LogOut,
  Pencil,
  Check,
} from "lucide-react";
import { useApp, getEmotionColors, getEmotionColorsDark, ColorMapping } from "../context/AppContext";

const EMOTION_PRESETS: { label: string; mapping: ColorMapping }[] = [
  {
    label: "Default",
    mapping: {
      calm: "#3b82f6",
      neutral: "#22c55e",
      energetic: "#f97316",
      tense: "#ef4444",
      stressful: "#991b1b",
    },
  },
  {
    label: "Ocean",
    mapping: {
      calm: "#0ea5e9",
      neutral: "#06b6d4",
      energetic: "#6366f1",
      tense: "#8b5cf6",
      stressful: "#4f46e5",
    },
  },
  {
    label: "Earth",
    mapping: {
      calm: "#84cc16",
      neutral: "#a3e635",
      energetic: "#d97706",
      tense: "#b45309",
      stressful: "#92400e",
    },
  },
  {
    label: "Sunset",
    mapping: {
      calm: "#f472b6",
      neutral: "#c084fc",
      energetic: "#fb923c",
      tense: "#f43f5e",
      stressful: "#be123c",
    },
  },
];

function ToggleRow({
  icon: Icon,
  iconColor,
  label,
  sublabel,
  value,
  onChange,
  darkMode,
  cardBorder,
  textPrimary,
  textSecondary,
  colors,
}: {
  icon: any;
  iconColor: string;
  label: string;
  sublabel?: string;
  value: boolean;
  onChange: (v: boolean) => void;
  darkMode: boolean;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  colors: any;
}) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3.5"
      style={{ borderBottom: `1px solid ${cardBorder}` }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${iconColor}18` }}
      >
        <Icon size={17} style={{ color: iconColor }} />
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium" style={{ color: textPrimary }}>{label}</p>
        {sublabel && (
          <p className="text-[10px]" style={{ color: textSecondary }}>{sublabel}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!value)}
        className="relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0"
        style={{
          background: value ? colors.from : darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)",
        }}
      >
        <div
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300"
          style={{ left: value ? "calc(100% - 22px)" : "2px" }}
        />
      </button>
    </div>
  );
}

function LinkRow({
  icon: Icon,
  iconColor,
  label,
  sublabel,
  darkMode,
  cardBorder,
  textPrimary,
  textSecondary,
}: {
  icon: any;
  iconColor: string;
  label: string;
  sublabel?: string;
  darkMode: boolean;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
}) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3.5"
      style={{ borderBottom: `1px solid ${cardBorder}` }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${iconColor}18` }}
      >
        <Icon size={17} style={{ color: iconColor }} />
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium" style={{ color: textPrimary }}>{label}</p>
        {sublabel && (
          <p className="text-[10px]" style={{ color: textSecondary }}>{sublabel}</p>
        )}
      </div>
      <ChevronRight size={15} style={{ color: textSecondary }} />
    </div>
  );
}

export function Settings() {
  const navigate = useNavigate();
  const {
    darkMode,
    toggleDarkMode,
    atmosphereScore,
    colorMappings,
    setColorMappings,
    smartGlasses,
    setSmartGlasses,
    notifications,
    setNotifications,
    privateMode,
    setPrivateMode,
    userName,
    setUserName,
    logout,
  } = useApp();

  const colors = darkMode
    ? getEmotionColorsDark(atmosphereScore, colorMappings)
    : getEmotionColors(atmosphereScore, colorMappings);

  const [selectedPreset, setSelectedPreset] = useState(0);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userName);
  const [nameSaved, setNameSaved] = useState(false);

  const cardBg = darkMode ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.75)";
  const cardBorder = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const textPrimary = darkMode ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.85)";
  const textSecondary = darkMode ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)";

  const commonProps = { darkMode, cardBorder, textPrimary, textSecondary, colors };

  const handleSaveName = () => {
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    setUserName(trimmed);
    setEditingName(false);
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2000);
  };

  const EMOTION_KEYS: Array<{ key: keyof ColorMapping; label: string; range: string }> = [
    { key: "calm", label: "😌 Calm", range: "0–20" },
    { key: "neutral", label: "🙂 Neutral", range: "21–40" },
    { key: "energetic", label: "⚡ Energetic", range: "41–60" },
    { key: "tense", label: "😬 Tense", range: "61–80" },
    { key: "stressful", label: "🔥 Highly Stressful", range: "81–100" },
  ];

  const inputBg = darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.04)";
  const inputBorder = darkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.10)";

  return (
    <div className="px-5 pb-6">
      {/* Header */}
      <div className="pt-2 pb-4">
        <h1 className="text-xl" style={{ color: textPrimary, fontWeight: 600 }}>Settings</h1>
        <p className="text-xs" style={{ color: textSecondary }}>Personalize your experience</p>
      </div>

      {/* Profile */}
      <div
        className="rounded-2xl p-4 mb-4"
        style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${colors.from}30, ${colors.via}20)`,
            }}
          >
            🧠
          </div>
          <div className="flex-1 min-w-0">
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSaveName(); if (e.key === "Escape") setEditingName(false); }}
                  className="flex-1 rounded-xl px-3 py-1.5 text-sm outline-none min-w-0"
                  style={{
                    background: inputBg,
                    border: `1.5px solid ${colors.from}60`,
                    color: textPrimary,
                  }}
                />
                <button
                  onClick={handleSaveName}
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
                  style={{ background: colors.from, color: "white" }}
                >
                  <Check size={13} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold truncate" style={{ color: textPrimary }}>
                  {userName}
                </p>
                <button
                  onClick={() => { setNameInput(userName); setEditingName(true); }}
                  className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
                  style={{
                    background: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                    color: textSecondary,
                  }}
                >
                  <Pencil size={11} />
                </button>
              </div>
            )}
            <p className="text-[11px]" style={{ color: textSecondary }}>
              {nameSaved ? "✓ Name updated" : "user@empathica.app"}
            </p>
            <div
              className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full"
              style={{ background: `${colors.from}18` }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: colors.from }} />
              <span className="text-[9px] font-medium" style={{ color: colors.from }}>Pro Member</span>
            </div>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div
        className="rounded-2xl overflow-hidden mb-4"
        style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
      >
        <div className="px-4 pt-4 pb-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: textSecondary }}>Appearance</p>
        </div>
        <ToggleRow
          icon={darkMode ? Moon : Sun}
          iconColor={darkMode ? "#818cf8" : "#f59e0b"}
          label="Dark Mode"
          sublabel="Switch between light and dark theme"
          value={darkMode}
          onChange={toggleDarkMode}
          {...commonProps}
        />
      </div>

      {/* Emotion Color Mappings */}
      <div
        className="rounded-2xl overflow-hidden mb-4"
        style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
      >
        <div className="px-4 pt-4 pb-2 flex items-center gap-2">
          <Palette size={14} style={{ color: textSecondary }} />
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: textSecondary }}>
            Emotion Color Themes
          </p>
        </div>

        {/* Presets */}
        <div className="px-4 pb-3">
          <p className="text-[10px] mb-2" style={{ color: textSecondary }}>Quick presets</p>
          <div className="flex gap-2">
            {EMOTION_PRESETS.map((preset, i) => (
              <button
                key={i}
                onClick={() => {
                  setSelectedPreset(i);
                  setColorMappings(preset.mapping);
                }}
                className="flex-1 py-2 rounded-xl text-[10px] font-medium transition-all duration-200"
                style={{
                  background:
                    selectedPreset === i ? `${colors.from}20` : darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                  border: `1px solid ${selectedPreset === i ? colors.from + "50" : cardBorder}`,
                  color: selectedPreset === i ? colors.from : textSecondary,
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom colors */}
        <div className="px-4 pb-4" style={{ borderTop: `1px solid ${cardBorder}` }}>
          <p className="text-[10px] font-medium mt-3 mb-2" style={{ color: textSecondary }}>Custom colors</p>
          <div className="flex flex-col gap-2">
            {EMOTION_KEYS.map(({ key, label, range }) => (
              <div key={key} className="flex items-center gap-3 py-1">
                <div
                  className="w-5 h-5 rounded-md flex-shrink-0"
                  style={{ background: colorMappings[key] }}
                />
                <span className="text-[11px] flex-1" style={{ color: textPrimary }}>{label}</span>
                <span className="text-[10px]" style={{ color: textSecondary }}>{range}</span>
                <input
                  type="color"
                  value={colorMappings[key]}
                  onChange={(e) =>
                    setColorMappings({ ...colorMappings, [key]: e.target.value })
                  }
                  className="w-7 h-7 rounded-lg cursor-pointer border-0 p-0"
                  style={{ background: "transparent" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Privacy & Features */}
      <div
        className="rounded-2xl overflow-hidden mb-4"
        style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
      >
        <div className="px-4 pt-4 pb-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: textSecondary }}>Features</p>
        </div>
        <ToggleRow
          icon={Bell}
          iconColor="#f97316"
          label="Notifications"
          sublabel="Interaction alerts and insights"
          value={notifications}
          onChange={setNotifications}
          {...commonProps}
        />
        <ToggleRow
          icon={Shield}
          iconColor="#22c55e"
          label="Private Mode"
          sublabel="Disable data logging"
          value={privateMode}
          onChange={setPrivateMode}
          {...commonProps}
        />
        <ToggleRow
          icon={Glasses}
          iconColor="#8b5cf6"
          label="Smart Glasses"
          sublabel="Enable real-time body language detection"
          value={smartGlasses}
          onChange={setSmartGlasses}
          {...commonProps}
        />
        {smartGlasses && (
          <div
            className="flex items-start gap-2 mx-4 mb-3 mt-1 px-3 py-2.5 rounded-xl"
            style={{ background: "#8b5cf618", border: "1px solid #8b5cf630" }}
          >
            <Info size={13} className="mt-0.5 flex-shrink-0" style={{ color: "#8b5cf6" }} />
            <p className="text-[10px] leading-relaxed" style={{ color: textSecondary }}>
              Smart glasses integration is in beta. Connect your AR device in the next screen to enable body language and micro-expression detection.
            </p>
          </div>
        )}
      </div>

      {/* Support */}
      <div
        className="rounded-2xl overflow-hidden mb-4"
        style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
      >
        <div className="px-4 pt-4 pb-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: textSecondary }}>Support</p>
        </div>
        <LinkRow icon={Info} iconColor="#3b82f6" label="About Empathica" sublabel="Version 1.0.0 (Beta)" {...commonProps} />
        <LinkRow icon={Shield} iconColor="#22c55e" label="Privacy Policy" {...commonProps} />
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="flex items-center gap-3 px-4 py-3.5 w-full transition-all active:opacity-70"
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#ef444418" }}
          >
            <LogOut size={17} style={{ color: "#ef4444" }} />
          </div>
          <p className="text-xs font-medium" style={{ color: "#ef4444" }}>Sign Out</p>
        </button>
      </div>

      {/* Footer */}
      <p className="text-center text-[10px]" style={{ color: textSecondary }}>
        Empathica · Built with empathy in mind ✨
      </p>
    </div>
  );
}