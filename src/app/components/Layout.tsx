import { Outlet, useNavigate, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { Home, Radio, BarChart2, Clock, Map, Settings } from "lucide-react";
import { useApp, getEmotionColors, getEmotionColorsDark } from "../context/AppContext";
import { SaveSessionModal } from "./SaveSessionModal";


const NAV_ITEMS = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/realtime", icon: Radio, label: "Live" },
  { path: "/analysis", icon: BarChart2, label: "Analysis" },
  { path: "/history", icon: Clock, label: "History" },
  // { path: "/map", icon: Map, label: "Map" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { atmosphereScore, colorMappings, darkMode, pendingSessionData, isSessionActive, sessionTime } = useApp();

  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      );
    };

    updateTime(); // set immediately
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  const colors = darkMode
    ? getEmotionColorsDark(atmosphereScore, colorMappings)
    : getEmotionColors(atmosphereScore, colorMappings);

  const gradientStyle = {
    background: `linear-gradient(135deg, ${colors.from}22 0%, ${colors.via}11 50%, ${colors.to}08 100%)`,
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: darkMode
          ? `linear-gradient(135deg, #0f0f13 0%, #1a1a2e 50%, #16213e 100%)`
          : `linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0fdf4 100%)`,
      }}
    >
      {/* Phone frame */}
      <div
        className="relative w-[390px] h-[844px] rounded-[44px] overflow-hidden flex flex-col shadow-2xl"
        style={{
          boxShadow: darkMode
            ? "0 40px 80px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.08)"
            : "0 40px 80px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.6)",
          background: darkMode ? "#0d0d14" : "#f8f9fb",
        }}
      >
        {/* Dynamic atmosphere background */}
        <div
          className="absolute inset-0 transition-all duration-1000"
          style={gradientStyle}
        />

        {/* Status bar */}
        <div className={`relative z-10 flex items-center justify-between px-6 pt-4 pb-2 ${darkMode ? "text-white/70" : "text-gray-500"}`}>
          <span className="text-xs font-medium">{currentTime}</span>
          <div className="flex items-center gap-1.5">
            <div className="flex gap-[2px] items-end h-3">
              <div className={`w-[3px] h-1.5 rounded-sm ${darkMode ? "bg-white/70" : "bg-gray-500"}`} />
              <div className={`w-[3px] h-2 rounded-sm ${darkMode ? "bg-white/70" : "bg-gray-500"}`} />
              <div className={`w-[3px] h-2.5 rounded-sm ${darkMode ? "bg-white/70" : "bg-gray-500"}`} />
              <div className={`w-[3px] h-3 rounded-sm ${darkMode ? "bg-white/70" : "bg-gray-500"}`} />
            </div>
            <svg viewBox="0 0 24 12" className="w-5 h-3" fill="none">
              <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke={darkMode ? "rgba(255,255,255,0.7)" : "#6b7280"} />
              <rect x="22" y="3.5" width="2" height="5" rx="1" fill={darkMode ? "rgba(255,255,255,0.7)" : "#6b7280"} />
              <rect x="1.5" y="1.5" width="17" height="9" rx="2.5" fill={darkMode ? "rgba(255,255,255,0.7)" : "#6b7280"} />
            </svg>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="relative z-10 flex-1 overflow-y-auto scrollbar-hide">
          <Outlet />
        </div>

        {/* Active Session Indicator - Floating badge shown on all pages when session is active */}
        {isSessionActive && location.pathname !== "/realtime" && (
          <div
            className="absolute top-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: darkMode
                ? `linear-gradient(135deg, ${colors.from}35, ${colors.via}25)`
                : `linear-gradient(135deg, ${colors.from}25, ${colors.via}15)`,
              border: `1px solid ${colors.from}40`,
              backdropFilter: "blur(12px)",
            }}
            onClick={() => navigate("/realtime")}
          >
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: colors.from }} />
            <span className="text-xs font-semibold" style={{ color: darkMode ? "white" : colors.text }}>
              Live Session: {formatTime(sessionTime)}
            </span>
          </div>
        )}

        {/* Bottom nav */}
        <div
          className="relative z-10 px-2 pb-4 pt-2"
          style={{
            background: darkMode
              ? "rgba(13,13,20,0.92)"
              : "rgba(255,255,255,0.88)",
            backdropFilter: "blur(20px)",
            borderTop: darkMode
              ? "1px solid rgba(255,255,255,0.06)"
              : "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex items-center justify-around">
            {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
              const isActive = location.pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200"
                  style={{
                    color: isActive
                      ? colors.from
                      : darkMode
                      ? "rgba(255,255,255,0.4)"
                      : "rgba(0,0,0,0.35)",
                    background: isActive
                      ? `${colors.from}15`
                      : "transparent",
                  }}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  <span
                    className="text-[10px]"
                    style={{ fontWeight: isActive ? 600 : 400 }}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Save session modal — rendered inside phone frame so it's clipped correctly */}
        {pendingSessionData && (
          <SaveSessionModal data={pendingSessionData} />
        )}
      </div>
    </div>
  );
}