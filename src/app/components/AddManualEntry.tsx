import { useState, useEffect, useRef } from "react";
import { X, Check, Plus } from "lucide-react";
import { motion, AnimatePresence, useSpring, useMotionValue } from "motion/react";
import { useApp, Interaction, getEmotionColors, getEmotionColorsDark, getEmotionLabel } from "../context/AppContext";

interface InsightData {
  name: string;
  setAtmosphere: number;
  setBattery: number;
  adjustAtmosphere: number;
  adjustBattery: number;
}

const INSIGHTS_DATA: InsightData[] = [
  // Calm/Positive insights
  { name: "Open posture", setAtmosphere: 34, setBattery: 8, adjustAtmosphere: -5, adjustBattery: 3 },
  { name: "Smiling", setAtmosphere: 30, setBattery: 10, adjustAtmosphere: -6, adjustBattery: 4 },
  { name: "Engaged conversation", setAtmosphere: 28, setBattery: 12, adjustAtmosphere: -7, adjustBattery: 5 },
  { name: "Mirroring body language", setAtmosphere: 32, setBattery: 9, adjustAtmosphere: -5, adjustBattery: 3 },
  { name: "Positive rapport", setAtmosphere: 26, setBattery: 14, adjustAtmosphere: -8, adjustBattery: 6 },
  { name: "High engagement", setAtmosphere: 29, setBattery: 11, adjustAtmosphere: -6, adjustBattery: 4 },
  { name: "Mutual interest detected", setAtmosphere: 25, setBattery: 15, adjustAtmosphere: -9, adjustBattery: 7 },
  
  // Neutral insights
  { name: "Task-focused atmosphere", setAtmosphere: 48, setBattery: 0, adjustAtmosphere: 0, adjustBattery: 0 },
  { name: "Professional demeanor", setAtmosphere: 45, setBattery: 2, adjustAtmosphere: 0, adjustBattery: 1 },
  { name: "Steady conversation flow", setAtmosphere: 42, setBattery: 3, adjustAtmosphere: -2, adjustBattery: 2 },
  
  // Tense/Negative insights
  { name: "Defensive body language", setAtmosphere: 65, setBattery: -12, adjustAtmosphere: 15, adjustBattery: -8 },
  { name: "Avoiding eye contact", setAtmosphere: 61, setBattery: -8, adjustAtmosphere: 11, adjustBattery: -6 },
  { name: "Nervous laughter", setAtmosphere: 58, setBattery: -6, adjustAtmosphere: 8, adjustBattery: -4 },
  { name: "Short responses", setAtmosphere: 62, setBattery: -10, adjustAtmosphere: 13, adjustBattery: -6 },
  { name: "Mild tension detected", setAtmosphere: 55, setBattery: -7, adjustAtmosphere: 8, adjustBattery: -6 },
  { name: "Disengaged", setAtmosphere: 68, setBattery: -14, adjustAtmosphere: 10, adjustBattery: -10 },
  { name: "Crossed arms", setAtmosphere: 63, setBattery: -9, adjustAtmosphere: 15, adjustBattery: -6 },
  { name: "Looking away frequently", setAtmosphere: 60, setBattery: -11, adjustAtmosphere: 10, adjustBattery: -8 },
];

// Animated Number Display Component
function AnimatedNumber({ value }: { value: number }) {
  const motionValue = useMotionValue(value);
  const springValue = useSpring(motionValue, {
    stiffness: 300,
    damping: 30,
    duration: 0.4,
  });
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    motionValue.set(value);
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return () => unsubscribe();
  }, [value, motionValue, springValue]);

  return <>{displayValue}</>;
}

export function AddManualEntry() {
  const { darkMode, addInteraction, colorMappings } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  
  // Form state
  const [name, setName] = useState("");
  const [atmosphereScore, setAtmosphereScore] = useState(0);
  const [selectedInsights, setSelectedInsights] = useState<string[]>([]);
  const [batteryImpact, setBatteryImpact] = useState(0);
  
  // Track manual edits
  const [atmosphereManuallyEdited, setAtmosphereManuallyEdited] = useState(false);
  const [batteryManuallyEdited, setBatteryManuallyEdited] = useState(false);

  const colors = darkMode
    ? getEmotionColorsDark(atmosphereScore, colorMappings)
    : getEmotionColors(atmosphereScore, colorMappings);

  const cardBg = darkMode ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.75)";
  const cardBorder = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const textPrimary = darkMode ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.85)";
  const textSecondary = darkMode ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)";
  const inputBg = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
  const inputBorder = darkMode ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)";

  const resetForm = () => {
    setName("");
    setAtmosphereScore(0);
    setSelectedInsights([]);
    setBatteryImpact(0);
    setAtmosphereManuallyEdited(false);
    setBatteryManuallyEdited(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  const handleSave = () => {
    if (!name.trim()) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    
    const newInteraction: Interaction = {
      id: `manual-${Date.now()}`,
      name: name.trim(),
      timestamp: `Today, ${timeString}`,
      // duration: "Manual Entry",
      atmosphereScore: Math.max(0, Math.min(100, atmosphereScore)),
      batteryImpact: Math.max(-100, Math.min(100, batteryImpact)),
      keyInsights: selectedInsights,
      attractionProbability: 0, // Not available for manual entries
      lieDetectionScore: 0, // Not available for manual entries
    };

    addInteraction(newInteraction);
    handleClose();
  };

  const toggleInsight = (insight: string) => {
    if (selectedInsights.includes(insight)) {
      setSelectedInsights(selectedInsights.filter(i => i !== insight));
    } else {
      setSelectedInsights([...selectedInsights, insight]);
    }
  };
  
  const handleAtmosphereChange = (value: number) => {
    setAtmosphereScore(value);
    setAtmosphereManuallyEdited(true);
  };
  
  const handleBatteryChange = (value: number) => {
    setBatteryImpact(value);
    setBatteryManuallyEdited(true);
  };

  // Auto-calculate atmosphere and battery based on selected insights
  useEffect(() => {
    if (selectedInsights.length === 0) {
      // Reset to defaults if no insights selected
      if (!atmosphereManuallyEdited) setAtmosphereScore(0);
      if (!batteryManuallyEdited) setBatteryImpact(0);
      return;
    }

    // Calculate values from selected insights
    let newAtmosphere = 50;
    let newBattery = 0;

    selectedInsights.forEach((insightName, index) => {
      const insightData = INSIGHTS_DATA.find(i => i.name === insightName);
      if (!insightData) return;

      if (index === 0) {
        // First insight: use SET values
        newAtmosphere = insightData.setAtmosphere;
        newBattery = insightData.setBattery;
      } else {
        // Subsequent insights: apply ADJUST values
        // For atmosphere: if adjustment is negative (calm), subtract it (lower score = calmer)
        // For battery: if adjustment is positive, add it (positive = energizing)
        newAtmosphere = newAtmosphere + insightData.adjustAtmosphere;
        newBattery = newBattery + insightData.adjustBattery;
      }
    });

    // Apply calculated values only if not manually edited
    if (!atmosphereManuallyEdited) {
      setAtmosphereScore(Math.max(0, Math.min(100, newAtmosphere)));
    }
    if (!batteryManuallyEdited) {
      setBatteryImpact(Math.max(-100, Math.min(100, newBattery)));
    }
  }, [selectedInsights, atmosphereManuallyEdited, batteryManuallyEdited]);

  return (
    <>
      {/* Add Entry Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full rounded-2xl p-4 flex items-center justify-center gap-2 transition-all active:scale-95 mb-4"
        style={{
          background: `linear-gradient(135deg, ${colors.from}18, ${colors.via}10)`,
          border: `1px solid ${colors.from}30`,
        }}
      >
        <Plus size={18} style={{ color: colors.from }} />
        <span className="text-sm font-semibold" style={{ color: textPrimary }}>
          Add Entry
        </span>
      </button>

      {/* Full-screen Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col"
            style={{
              background: darkMode
                ? "linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 50%, #0a0a14 100%)"
                : "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0fdf4 100%)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <h2 className="text-lg font-semibold" style={{ color: textPrimary }}>
                Add Manual Entry
              </h2>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
                style={{
                  background: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                }}
              >
                <X size={18} style={{ color: textPrimary }} />
              </button>
            </div>

            {/* Form Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {/* Interaction Name */}
              <div className="mb-5">
                <label className="text-xs mb-2 block font-medium" style={{ color: textSecondary }}>
                  Interaction Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Lunch with Alex"
                  className="w-full rounded-2xl px-4 py-3 text-sm outline-none"
                  style={{
                    background: inputBg,
                    border: `1.5px solid ${name ? colors.from + "60" : inputBorder}`,
                    color: textPrimary,
                  }}
                />
              </div>

              {/* Atmosphere Score */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium" style={{ color: textSecondary }}>
                    Atmosphere Score
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold" style={{ color: colors.from }}>
                      <AnimatedNumber value={atmosphereScore} />
                    </span>
                    <span className="text-xs" style={{ color: textSecondary }}>
                      {getEmotionLabel(atmosphereScore)}
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={atmosphereScore}
                  onChange={(e) => handleAtmosphereChange(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${colors.from} ${atmosphereScore}%, ${
                      darkMode ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)"
                    } ${atmosphereScore}%)`,
                    accentColor: colors.from,
                  }}
                />
                {/* Atmosphere labels */}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px]" style={{ color: textSecondary }}>Calm</span>
                  <span className="text-[10px]" style={{ color: textSecondary }}>Neutral</span>
                  <span className="text-[10px]" style={{ color: textSecondary }}>Energetic</span>
                  <span className="text-[10px]" style={{ color: textSecondary }}>Tense</span>
                  <span className="text-[10px]" style={{ color: textSecondary }}>Stressful</span>
                </div>
                {/* Helper text */}
                {selectedInsights.length > 0 && (
                  <p className="text-[10px] mt-1.5 italic" style={{ color: colors.from }}>
                    {atmosphereManuallyEdited ? "Manually adjusted" : "Estimated from selected insights"}
                  </p>
                )}
              </div>

              {/* Key Insights */}
              <div className="mb-5">
                <label className="text-xs mb-2 block font-medium" style={{ color: textSecondary }}>
                  Key Insights (Select multiple)
                </label>
                <div
                  className="rounded-2xl p-3 max-h-48 overflow-y-auto"
                  style={{
                    background: inputBg,
                    border: `1px solid ${inputBorder}`,
                  }}
                >
                  <div className="flex flex-wrap gap-2">
                    {INSIGHTS_DATA.map((insight) => {
                      const isSelected = selectedInsights.includes(insight.name);
                      return (
                        <button
                          key={insight.name}
                          onClick={() => toggleInsight(insight.name)}
                          className="px-3 py-1.5 rounded-xl text-xs transition-all active:scale-95"
                          style={{
                            background: isSelected ? `${colors.from}25` : "transparent",
                            border: `1px solid ${isSelected ? colors.from : cardBorder}`,
                            color: isSelected ? colors.from : textSecondary,
                            fontWeight: isSelected ? 600 : 400,
                          }}
                        >
                          {insight.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {selectedInsights.length > 0 && (
                  <p className="text-[10px] mt-1.5" style={{ color: textSecondary }}>
                    {selectedInsights.length} insight{selectedInsights.length !== 1 ? "s" : ""} selected
                  </p>
                )}
              </div>

              {/* Battery Impact */}
              <div className="mb-5">
                <label className="text-xs mb-2 block font-medium" style={{ color: textSecondary }}>
                  Battery Change (%)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={-100}
                    max={100}
                    value={batteryImpact}
                    onChange={(e) => handleBatteryChange(Number(e.target.value))}
                    className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background:
                        batteryImpact > 0
                          ? `linear-gradient(to right, #22c55e ${50 + batteryImpact / 2}%, ${
                              darkMode ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)"
                            } ${50 + batteryImpact / 2}%)`
                          : batteryImpact < 0
                          ? `linear-gradient(to right, ${
                              darkMode ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)"
                            } ${50 + batteryImpact / 2}%, #ef4444 ${50 + batteryImpact / 2}%)`
                          : darkMode
                          ? "rgba(255,255,255,0.10)"
                          : "rgba(0,0,0,0.08)",
                      accentColor: batteryImpact > 0 ? "#22c55e" : "#ef4444",
                    }}
                  />
                  <span
                    className="text-sm font-semibold w-16 text-right"
                    style={{
                      color: batteryImpact > 0 ? "#22c55e" : batteryImpact < 0 ? "#ef4444" : textPrimary,
                    }}
                  >
                    {batteryImpact > 0 ? "+" : ""}
                    <AnimatedNumber value={batteryImpact} />%
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px]" style={{ color: "#ef4444" }}>Draining (-100%)</span>
                  <span className="text-[10px]" style={{ color: textSecondary }}>Neutral</span>
                  <span className="text-[10px]" style={{ color: "#22c55e" }}>Energizing (+100%)</span>
                </div>
                {/* Helper text */}
                {selectedInsights.length > 0 && (
                  <p className="text-[10px] mt-1.5 italic" style={{ 
                    color: batteryImpact > 0 ? "#22c55e" : batteryImpact < 0 ? "#ef4444" : colors.from 
                  }}>
                    {batteryManuallyEdited ? "Manually adjusted" : "Estimated from selected insights"}
                  </p>
                )}
              </div>

              {/* Disabled Fields Notice */}
              {/* <div
                className="rounded-2xl p-4 mb-5"
                style={{
                  background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                  border: `1px solid ${cardBorder}`,
                }}
              >
                <p className="text-xs mb-3 font-medium" style={{ color: textSecondary }}>
                  Not Available for Manual Entries
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl p-3 flex flex-col items-center opacity-40">
                    <span className="text-sm" style={{ color: textSecondary }}>—</span>
                    <span className="text-[10px]" style={{ color: textSecondary }}>Attraction</span>
                  </div>
                  <div className="rounded-xl p-3 flex flex-col items-center opacity-40">
                    <span className="text-sm" style={{ color: textSecondary }}>—</span>
                    <span className="text-[10px]" style={{ color: textSecondary }}>Lie Detection</span>
                  </div>
                </div>
              </div> */}
            </div>

            {/* Footer - Save Button */}
            <div className="px-6 pb-6 pt-4" style={{ borderTop: `1px solid ${cardBorder}` }}>
              <button
                onClick={handleSave}
                disabled={!name.trim()}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                style={{
                  background: !name.trim()
                    ? darkMode
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.08)"
                    : `linear-gradient(135deg, ${colors.from}, ${colors.via})`,
                  color: "white",
                  boxShadow: name.trim() ? `0 8px 24px ${colors.from}40` : "none",
                }}
              >
                <Check size={18} />
                Save Entry
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}