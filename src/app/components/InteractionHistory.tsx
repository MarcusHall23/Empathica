import { useState, useRef, useEffect } from "react";
import { useApp, getEmotionColors, getEmotionColorsDark, getEmotionLabel, Interaction } from "../context/AppContext";
import {
  ChevronRight,
  Search,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Check,
  Tag,
} from "lucide-react";
import { AddManualEntry } from "./AddManualEntry";

// ── Three-dot dropdown menu ────────────────────────────────────────────────────
function EntryMenu({
  onEdit,
  onDelete,
  accentColor,
  darkMode,
  cardBorder,
  textPrimary,
  open,
  onClose,
}: {
  onEdit: () => void;
  onDelete: () => void;
  accentColor: string;
  darkMode: boolean;
  cardBorder: string;
  textPrimary: string;
  open: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="absolute right-0 top-10 z-30 rounded-2xl overflow-hidden"
      style={{
        background: darkMode ? "#1e1e2e" : "white",
        border: `1px solid ${cardBorder}`,
        minWidth: 148,
        boxShadow: "0 12px 32px rgba(0,0,0,0.22)",
      }}
    >
      <button
        onClick={() => { onEdit(); onClose(); }}
        className="w-full flex items-center gap-2.5 px-4 py-3 text-left transition-opacity hover:opacity-70"
        style={{ borderBottom: `1px solid ${cardBorder}` }}
      >
        <Pencil size={14} style={{ color: accentColor }} />
        <span className="text-xs font-medium" style={{ color: textPrimary }}>Edit Details</span>
      </button>
      <button
        onClick={() => { onDelete(); onClose(); }}
        className="w-full flex items-center gap-2.5 px-4 py-3 text-left transition-opacity hover:opacity-70"
      >
        <Trash2 size={14} style={{ color: "#ef4444" }} />
        <span className="text-xs font-medium" style={{ color: "#ef4444" }}>Delete</span>
      </button>
    </div>
  );
}

// ── Inline edit form ───────────────────────────────────────────────────────────
function EditForm({
  interaction,
  onSave,
  onCancel,
  accentColor,
  darkMode,
  cardBorder,
  textPrimary,
  textSecondary,
}: {
  interaction: Interaction;
  onSave: (updates: Partial<Pick<Interaction, "name" | "atmosphereScore" | "batteryImpact">>) => void;
  onCancel: () => void;
  accentColor: string;
  darkMode: boolean;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
}) {
  const [name, setName] = useState(interaction.name);
  const [score, setScore] = useState(interaction.atmosphereScore);
  const [battery, setBattery] = useState(interaction.batteryImpact);

  const inputBg = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
  const inputBorder = darkMode ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)";

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave({
      name: trimmed,
      atmosphereScore: Math.max(0, Math.min(100, score)),
      batteryImpact: Math.max(-100, Math.min(100, battery)),
    });
  };

  return (
    <div className="px-4 pb-4 pt-3" style={{ borderTop: `1px solid ${cardBorder}` }}>
      <p
        className="text-[10px] font-semibold mb-3"
        style={{ color: textSecondary, letterSpacing: "0.06em" }}
      >
        EDIT INTERACTION
      </p>

      {/* Name */}
      <div className="mb-3">
        <label className="text-[10px] mb-1 block" style={{ color: textSecondary }}>Interaction Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl px-3 py-2.5 text-xs outline-none"
          style={{
            background: inputBg,
            border: `1.5px solid ${name !== interaction.name ? accentColor + "60" : inputBorder}`,
            color: textPrimary,
          }}
        />
      </div>

      {/* Atmosphere score */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <label className="text-[10px]" style={{ color: textSecondary }}>Atmosphere Score</label>
          <span className="text-[10px] font-semibold" style={{ color: accentColor }}>{score}</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${accentColor} ${score}%, ${darkMode ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)"} ${score}%)`,
            accentColor,
          }}
        />
      </div>

      {/* Battery impact */}
      <div className="mb-4">
        <label className="text-[10px] mb-1 block" style={{ color: textSecondary }}>
          Battery Impact (negative = draining)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={-100}
            max={100}
            value={battery}
            onChange={(e) => setBattery(Number(e.target.value))}
            className="w-full rounded-xl px-3 py-2.5 text-xs outline-none"
            style={{
              background: inputBg,
              border: `1.5px solid ${battery !== interaction.batteryImpact ? accentColor + "60" : inputBorder}`,
              color: battery > 0 ? "#22c55e" : battery < 0 ? "#ef4444" : textPrimary,
            }}
          />
          <span className="text-xs flex-shrink-0" style={{ color: textSecondary }}>%</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs transition-all active:scale-95"
          style={{
            background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
            border: `1px solid ${cardBorder}`,
            color: textSecondary,
          }}
        >
          <X size={13} />
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all active:scale-95"
          style={{
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
            border: `1px solid ${accentColor}40`,
            color: "white",
            boxShadow: `0 4px 14px ${accentColor}30`,
          }}
        >
          <Check size={13} />
          Save Changes
        </button>
      </div>
    </div>
  );
}

// ── Delete confirm panel ───────────────────────────────────────────────────────
function DeleteConfirm({
  onConfirm,
  onCancel,
  cardBorder,
  textSecondary,
  darkMode,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  cardBorder: string;
  textSecondary: string;
  darkMode: boolean;
}) {
  return (
    <div
      className="px-4 pb-4 pt-3"
      style={{ borderTop: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.04)" }}
    >
      <p className="text-xs mb-3" style={{ color: "#ef4444" }}>
        Remove this interaction? This will also update Analysis and Social Battery.
      </p>
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl text-xs transition-all active:scale-95"
          style={{
            background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
            border: `1px solid ${cardBorder}`,
            color: textSecondary,
          }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all active:scale-95"
          style={{ background: "#ef4444", color: "white", boxShadow: "0 4px 14px rgba(239,68,68,0.3)" }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export function InteractionHistory() {
  const {
    atmosphereScore,
    colorMappings,
    darkMode,
    interactions,
    updateInteraction,
    removeInteraction,
    socialBattery,
  } = useApp();

  const colors = darkMode
    ? getEmotionColorsDark(atmosphereScore, colorMappings)
    : getEmotionColors(atmosphereScore, colorMappings);

  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = interactions.filter((i) =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cardBg = darkMode ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.75)";
  const cardBorder = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const textPrimary = darkMode ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.85)";
  const textSecondary = darkMode ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)";

  const totalInteractions = interactions.length;
  const avgScore =
    interactions.length > 0
      ? Math.round(interactions.reduce((s, i) => s + i.atmosphereScore, 0) / interactions.length)
      : 0;
  
  // Net Battery Loss = Current Battery - 100
  // socialBattery is already capped at 0-100 in AppContext
  const netBatteryLoss = socialBattery - 100;

  const handleEdit = (id: string) => {
    setEditingId(id);
    setDeletingId(null);
    setExpandedId(null);
  };

  const handleDeleteRequest = (id: string) => {
    setDeletingId(id);
    setEditingId(null);
    setExpandedId(null);
  };

  return (
    <div className="px-5 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-2 pb-4">
        <div>
          <h1 className="text-xl" style={{ color: textPrimary, fontWeight: 600 }}>History</h1>
          <p className="text-xs" style={{ color: textSecondary }}>Past interactions</p>
        </div>
      </div>

      {/* Add Entry Button */}
      <AddManualEntry />

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        {[
          { label: "Total", value: totalInteractions, suffix: "" },
          { label: "Avg Score", value: avgScore, suffix: "" },
          { label: "Net Battery Loss", value: netBatteryLoss > 0 ? `+${netBatteryLoss}` : netBatteryLoss, suffix: "%" },
        ].map((s, i) => (
          <div
            key={i}
            className="rounded-2xl p-3 flex flex-col items-center gap-1"
            style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <span
              className="text-lg font-light transition-all duration-500"
              style={{ color: colors.from }}
            >
              {s.value}{s.suffix}
            </span>
            <span className="text-[10px]" style={{ color: textSecondary }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Search */}
      <div
        className="flex items-center gap-2.5 rounded-2xl px-4 py-2.5 mb-4"
        style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
      >
        <Search size={15} style={{ color: textSecondary }} />
        <input
          type="text"
          placeholder="Search interactions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent outline-none text-xs"
          style={{ color: textPrimary }}
        />
      </div>

      {/* Interactions list */}
      <div className="flex flex-col gap-3">
        {filtered.map((interaction) => {
          const ic = darkMode
            ? getEmotionColorsDark(interaction.atmosphereScore, colorMappings)
            : getEmotionColors(interaction.atmosphereScore, colorMappings);

          const isExpanded = expandedId === interaction.id;
          const isEditing = editingId === interaction.id;
          const isDeleting = deletingId === interaction.id;
          const menuOpen = menuOpenId === interaction.id;

          return (
            <div
              key={interaction.id}
              className="relative"
              style={{
                background: isDeleting
                  ? darkMode ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.04)"
                  : cardBg,
                border: `1px solid ${
                  isDeleting
                    ? "rgba(239,68,68,0.30)"
                    : isEditing
                    ? ic.from + "40"
                    : cardBorder
                }`,
                borderRadius: 20,
                transition: "border-color 0.25s, background 0.25s",
                overflow: "visible",
              }}
            >
              {/* Main row */}
              <div className="flex items-center w-full">
                {/* Tap to expand (only when not editing/deleting) */}
                <button
                  className="flex items-center gap-3 px-4 py-4 text-left flex-1 min-w-0"
                  onClick={() => {
                    if (isEditing || isDeleting) return;
                    setExpandedId(isExpanded ? null : interaction.id);
                    setMenuOpenId(null);
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${ic.from}18` }}
                  >
                    <div className="w-3 h-3 rounded-full" style={{ background: ic.from }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: textPrimary }}>
                      {interaction.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-[10px]" style={{ color: textSecondary }}>
                        {interaction.timestamp} · {interaction.duration}
                      </p>
                      {interaction.id.startsWith("manual-") && (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium"
                          style={{
                            background: `${ic.from}15`,
                            color: ic.from,
                            border: `1px solid ${ic.from}30`,
                          }}
                        >
                          <Tag size={9} />
                          Manual
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div
                        className="h-1 rounded-full flex-1 overflow-hidden"
                        style={{ background: darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)" }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${interaction.atmosphereScore}%`, background: ic.from }}
                        />
                      </div>
                      <span className="text-[10px] font-medium flex-shrink-0" style={{ color: ic.from }}>
                        {getEmotionLabel(interaction.atmosphereScore)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-xs font-semibold" style={{ color: ic.from }}>
                      {interaction.atmosphereScore}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {interaction.batteryImpact > 0 ? (
                        <TrendingUp size={10} style={{ color: "#22c55e" }} />
                      ) : (
                        <TrendingDown size={10} style={{ color: "#ef4444" }} />
                      )}
                      <span
                        className="text-[10px]"
                        style={{ color: interaction.batteryImpact > 0 ? "#22c55e" : "#ef4444" }}
                      >
                        {interaction.batteryImpact > 0 ? "+" : ""}
                        {interaction.batteryImpact}%
                      </span>
                    </div>
                    {!isEditing && !isDeleting && (
                      <ChevronRight
                        size={14}
                        style={{
                          color: textSecondary,
                          transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                          transition: "transform 0.2s",
                        }}
                      />
                    )}
                  </div>
                </button>

                {/* Three-dot menu trigger */}
                <div className="relative flex-shrink-0 pr-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpenId(menuOpen ? null : interaction.id);
                      setExpandedId(null);
                    }}
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90"
                    style={{
                      background: menuOpen ? `${ic.from}18` : "transparent",
                      color: menuOpen ? ic.from : textSecondary,
                    }}
                  >
                    <MoreHorizontal size={16} />
                  </button>

                  <EntryMenu
                    open={menuOpen}
                    onClose={() => setMenuOpenId(null)}
                    onEdit={() => handleEdit(interaction.id)}
                    onDelete={() => handleDeleteRequest(interaction.id)}
                    accentColor={ic.from}
                    darkMode={darkMode}
                    cardBorder={cardBorder}
                    textPrimary={textPrimary}
                  />
                </div>
              </div>

              {/* Expanded key insights */}
              {isExpanded && !isEditing && !isDeleting && (
                <div
                  className="px-4 pb-4"
                  style={{ borderTop: `1px solid ${cardBorder}` }}
                >
                  <p className="text-[10px] font-semibold mt-3 mb-2" style={{ color: textSecondary }}>
                    KEY INSIGHTS
                  </p>
                  <div className="flex flex-col gap-2">
                    {interaction.keyInsights.map((insight, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 rounded-xl px-3 py-2"
                        style={{ background: `${ic.from}0d` }}
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full mt-0.5 flex-shrink-0"
                          style={{ background: ic.from }}
                        />
                        <p className="text-[11px]" style={{ color: textPrimary }}>{insight}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-3">
                    <div
                      className="flex-1 rounded-xl p-2.5 flex flex-col items-center"
                      style={{ background: `${ic.from}0d` }}
                    >
                      <span className="text-sm font-light" style={{ color: "#ec4899" }}>
                        {interaction.attractionProbability}%
                      </span>
                      <span className="text-[9px]" style={{ color: textSecondary }}>Attraction</span>
                    </div>
                    <div
                      className="flex-1 rounded-xl p-2.5 flex flex-col items-center"
                      style={{ background: `${ic.from}0d` }}
                    >
                      <span
                        className="text-sm font-light"
                        style={{ color: interaction.lieDetectionScore > 40 ? "#ef4444" : "#22c55e" }}
                      >
                        {interaction.lieDetectionScore}%
                      </span>
                      <span className="text-[9px]" style={{ color: textSecondary }}>Lie Risk</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Inline edit form */}
              {isEditing && (
                <EditForm
                  interaction={interaction}
                  accentColor={ic.from}
                  darkMode={darkMode}
                  cardBorder={cardBorder}
                  textPrimary={textPrimary}
                  textSecondary={textSecondary}
                  onSave={(updates) => {
                    updateInteraction(interaction.id, updates);
                    setEditingId(null);
                  }}
                  onCancel={() => setEditingId(null)}
                />
              )}

              {/* Delete confirmation */}
              {isDeleting && (
                <DeleteConfirm
                  onConfirm={() => {
                    removeInteraction(interaction.id);
                    setDeletingId(null);
                  }}
                  onCancel={() => setDeletingId(null)}
                  cardBorder={cardBorder}
                  textSecondary={textSecondary}
                  darkMode={darkMode}
                />
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-12">
          <Search size={32} style={{ color: textSecondary }} />
          <p className="text-sm" style={{ color: textSecondary }}>No interactions found</p>
        </div>
      )}
    </div>
  );
}