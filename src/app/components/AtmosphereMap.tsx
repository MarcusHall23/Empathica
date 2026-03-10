// import { useState } from "react";
// import { useApp, getEmotionColors, getEmotionColorsDark, getEmotionLabel } from "../context/AppContext";
// import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";

// const EMOTION_ZONES = [
//   { range: "0–20", label: "Calm", description: "Peaceful and relaxed. Ideal for deep conversations, reflection, and intimacy.", color: "#3b82f6", emoji: "😌" },
//   { range: "21–40", label: "Neutral", description: "Balanced energy. Great for productive discussions and social activities.", color: "#22c55e", emoji: "🙂" },
//   { range: "41–60", label: "Energetic", description: "Stimulating and lively. Conversations are exciting but may feel fast-paced.", color: "#f97316", emoji: "⚡" },
//   { range: "61–80", label: "Tense", description: "Elevated stress signals. Be mindful of your words and give space when needed.", color: "#ef4444", emoji: "😬" },
//   { range: "81–100", label: "Highly Stressful", description: "High friction environment. Consider pausing, breathing, and de-escalating.", color: "#991b1b", emoji: "🔥" },
// ];

// function GradientScale({ score, darkMode }: { score: number; darkMode: boolean }) {
//   return (
//     <div className="relative">
//       {/* Gradient bar */}
//       <div
//         className="w-full h-5 rounded-full overflow-hidden"
//         style={{
//           background: "linear-gradient(to right, #3b82f6, #22c55e, #f97316, #ef4444, #991b1b)",
//         }}
//       />
//       {/* Score indicator */}
//       <div
//         className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-700"
//         style={{ left: `${score}%`, transform: `translate(-50%, -50%)` }}
//       >
//         <div
//           className="w-5 h-5 rounded-full border-2 border-white shadow-lg"
//           style={{ background: getScoreColor(score) }}
//         />
//       </div>
//       {/* Labels */}
//       <div className="flex justify-between mt-1.5">
//         {["Calm", "Neutral", "Energetic", "Tense", "Critical"].map((l) => (
//           <span key={l} className="text-[9px]" style={{ color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)" }}>
//             {l}
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// }

// function getScoreColor(score: number): string {
//   if (score <= 20) return "#3b82f6";
//   if (score <= 40) return "#22c55e";
//   if (score <= 60) return "#f97316";
//   if (score <= 80) return "#ef4444";
//   return "#991b1b";
// }

// export function AtmosphereMap() {
//   const { atmosphereScore, setAtmosphereScore, colorMappings, darkMode } = useApp();
//   const colors = darkMode
//     ? getEmotionColorsDark(atmosphereScore, colorMappings)
//     : getEmotionColors(atmosphereScore, colorMappings);

//   const [activeZone, setActiveZone] = useState<number | null>(null);

//   const cardBg = darkMode ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.75)";
//   const cardBorder = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
//   const textPrimary = darkMode ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.85)";
//   const textSecondary = darkMode ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)";

//   const radialData = [{ name: "score", value: atmosphereScore, fill: colors.from }];

//   const currentZoneIndex = Math.min(Math.floor(atmosphereScore / 20), 4);
//   const currentZone = EMOTION_ZONES[currentZoneIndex];

//   const reflectionPrompts = [
//     "What physical sensations are you noticing right now?",
//     "How is this atmosphere affecting your communication style?",
//     "What would help you feel more grounded in this moment?",
//     "Notice your breathing. Is it shallow or deep?",
//   ];

//   return (
//     <div className="px-5 pb-6">
//       {/* Header */}
//       <div className="pt-2 pb-4">
//         <h1 className="text-xl" style={{ color: textPrimary, fontWeight: 600 }}>Atmosphere Map</h1>
//         <p className="text-xs" style={{ color: textSecondary }}>Emotional environment overview</p>
//       </div>

//       {/* Main score card */}
//       <div
//         className="rounded-3xl p-5 mb-4 relative overflow-hidden"
//         style={{
//           background: darkMode
//             ? `linear-gradient(135deg, ${colors.from}28, ${colors.via}18)`
//             : `linear-gradient(135deg, ${colors.from}16, ${colors.via}09)`,
//           border: `1px solid ${colors.from}25`,
//         }}
//       >
//         <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20 blur-2xl" style={{ background: colors.from }} />

//         <div className="relative flex items-center gap-4">
//           {/* Radial chart */}
//           <div className="w-24 h-24 flex-shrink-0 relative">
//             <ResponsiveContainer width="100%" height="100%">
//               <RadialBarChart
//                 cx="50%"
//                 cy="50%"
//                 innerRadius="60%"
//                 outerRadius="90%"
//                 barSize={8}
//                 data={radialData}
//                 startAngle={90}
//                 endAngle={-270}
//               >
//                 <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
//                 <RadialBar
//                   background={{ fill: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }}
//                   dataKey="value"
//                   cornerRadius={4}
//                   fill={colors.from}
//                 />
//               </RadialBarChart>
//             </ResponsiveContainer>
//             <div
//               className="absolute inset-0 flex items-center justify-center pointer-events-none"
//             >
//               <span className="text-2xl" style={{ color: colors.from, fontWeight: 300 }}>
//                 {atmosphereScore}
//               </span>
//             </div>
//           </div>

//           <div className="flex-1">
//             <div className="flex items-center gap-2 mb-2">
//               <span className="text-2xl">{currentZone.emoji}</span>
//               <div>
//                 <h2 className="text-base font-semibold" style={{ color: textPrimary }}>
//                   {getEmotionLabel(atmosphereScore)}
//                 </h2>
//                 <p className="text-[10px]" style={{ color: textSecondary }}>
//                   Zone {currentZone.range}
//                 </p>
//               </div>
//             </div>
//             <p className="text-[11px] leading-relaxed" style={{ color: textSecondary }}>
//               {currentZone.description}
//             </p>
//           </div>
//         </div>

//         {/* Gradient scale */}
//         <div className="relative mt-4 pt-4" style={{ borderTop: `1px solid ${colors.from}20` }}>
//           <GradientScale score={atmosphereScore} darkMode={darkMode} />
//           <div className="mt-3">
//             <div className="flex items-center justify-between mb-1">
//               <span className="text-[10px]" style={{ color: textSecondary }}>Adjust (Demo)</span>
//               <span className="text-[10px] font-medium" style={{ color: colors.from }}>{atmosphereScore}</span>
//             </div>
//             <input
//               type="range"
//               min={0}
//               max={100}
//               value={atmosphereScore}
//               onChange={(e) => setAtmosphereScore(Number(e.target.value))}
//               className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
//               style={{
//                 background: `linear-gradient(to right, ${colors.from} ${atmosphereScore}%, ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"} ${atmosphereScore}%)`,
//                 accentColor: colors.from,
//               }}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Zone cards */}
//       <div
//         className="rounded-2xl overflow-hidden mb-4"
//         style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
//       >
//         <div className="px-4 pt-4 pb-2">
//           <h3 className="text-sm font-semibold" style={{ color: textPrimary }}>Emotional Zones</h3>
//           <p className="text-[10px]" style={{ color: textSecondary }}>Tap a zone to learn more</p>
//         </div>
//         {EMOTION_ZONES.map((zone, i) => {
//           const isActive = activeZone === i;
//           const isCurrent = currentZoneIndex === i;
//           return (
//             <button
//               key={i}
//               className="w-full text-left"
//               onClick={() => setActiveZone(isActive ? null : i)}
//             >
//               <div
//                 className="flex items-center gap-3 px-4 py-3 transition-all duration-200"
//                 style={{
//                   borderTop: `1px solid ${cardBorder}`,
//                   background: isCurrent ? `${zone.color}0f` : isActive ? `${zone.color}07` : "transparent",
//                 }}
//               >
//                 <div
//                   className="w-3 h-3 rounded-full flex-shrink-0"
//                   style={{ background: zone.color, boxShadow: isCurrent ? `0 0 8px ${zone.color}80` : "none" }}
//                 />
//                 <div className="flex-1">
//                   <div className="flex items-center justify-between">
//                     <span className="text-xs font-medium" style={{ color: textPrimary }}>
//                       {zone.emoji} {zone.label}
//                     </span>
//                     <span className="text-[10px]" style={{ color: textSecondary }}>{zone.range}</span>
//                   </div>
//                   {(isActive || isCurrent) && (
//                     <p className="text-[11px] mt-1 leading-relaxed" style={{ color: textSecondary }}>
//                       {zone.description}
//                     </p>
//                   )}
//                 </div>
//                 {isCurrent && (
//                   <div
//                     className="px-2 py-0.5 rounded-full text-[9px] font-semibold flex-shrink-0"
//                     style={{ background: `${zone.color}20`, color: zone.color }}
//                   >
//                     Now
//                   </div>
//                 )}
//               </div>
//             </button>
//           );
//         })}
//       </div>

//       {/* Reflection prompts */}
//       <div
//         className="rounded-2xl p-4"
//         style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
//       >
//         <h3 className="text-sm font-semibold mb-1" style={{ color: textPrimary }}>Reflection Prompts</h3>
//         <p className="text-[10px] mb-3" style={{ color: textSecondary }}>Mindful questions for emotional awareness</p>
//         <div className="flex flex-col gap-2.5">
//           {reflectionPrompts.map((prompt, i) => (
//             <div
//               key={i}
//               className="flex items-start gap-2.5 rounded-xl px-3 py-2.5"
//               style={{
//                 background: `${colors.from}0c`,
//                 border: `1px solid ${colors.from}18`,
//               }}
//             >
//               <span className="text-[11px] font-semibold flex-shrink-0" style={{ color: colors.from }}>
//                 {i + 1}.
//               </span>
//               <p className="text-[11px] leading-relaxed" style={{ color: textPrimary }}>{prompt}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }