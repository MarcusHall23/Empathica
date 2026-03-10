import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from "react";

export type EmotionLevel = "calm" | "neutral" | "energetic" | "tense" | "stressful";

export interface ColorMapping {
  calm: string;
  neutral: string;
  energetic: string;
  tense: string;
  stressful: string;
}

export interface Interaction {
  id: string;
  name: string;
  timestamp: string;
  duration: string;
  atmosphereScore: number;
  batteryImpact: number;
  keyInsights: string[];
  attractionProbability: number;
  lieDetectionScore: number;
  timeline?: { time: string; score: number; label: string }[];
}

export interface PendingSessionData {
  sessionTime: number;
  atmosphereScore: number;
  attractionProb: number;
  lieScore: number;
  engagementScore: number;
  timeline: { time: string; score: number; label: string }[];
}

interface AppContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  atmosphereScore: number;
  setAtmosphereScore: (score: number) => void;
  socialBattery: number;
  colorMappings: ColorMapping;
  setColorMappings: (m: ColorMapping) => void;
  smartGlasses: boolean;
  setSmartGlasses: (v: boolean) => void;
  notifications: boolean;
  setNotifications: (v: boolean) => void;
  privateMode: boolean;
  setPrivateMode: (v: boolean) => void;
  userName: string;
  setUserName: (name: string) => void;
  interactions: Interaction[];
  addInteraction: (interaction: Interaction) => void;
  updateInteraction: (id: string, updates: Partial<Pick<Interaction, "name" | "atmosphereScore" | "batteryImpact">>) => void;
  removeInteraction: (id: string) => void;
  isSessionActive: boolean;
  setIsSessionActive: (v: boolean) => void;
  pendingSessionData: PendingSessionData | null;
  setPendingSessionData: (data: PendingSessionData | null) => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  // Session state
  sessionTime: number;
  attractionProb: number;
  lieScore: number;
  engagementScore: number;
  sessionTimeline: { time: string; score: number; label: string }[];
  startSession: () => void;
  stopSession: () => void;
}

const defaultColorMappings: ColorMapping = {
  calm: "#3b82f6",
  neutral: "#22c55e",
  energetic: "#f97316",
  tense: "#ef4444",
  stressful: "#991b1b",
};

export const mockInteractions: Interaction[] = [
  {
    id: "1",
    name: "Coffee Chat with Jordan",
    timestamp: "Today, 10:30 AM",
    duration: "42 min",
    atmosphereScore: 28,
    batteryImpact: -12,
    keyInsights: ["Positive rapport", "High engagement", "Mutual interest detected"],
    attractionProbability: 78,
    lieDetectionScore: 8,
  },
  {
    id: "2",
    name: "Team Standup",
    timestamp: "Today, 9:00 AM",
    duration: "15 min",
    atmosphereScore: 45,
    batteryImpact: -8,
    keyInsights: ["Mild tension detected", "Two participants disengaged", "Task-focused atmosphere"],
    attractionProbability: 32,
    lieDetectionScore: 22,
  },
  {
    id: "3",
    name: "Dinner with Sam",
    timestamp: "Yesterday, 7:45 PM",
    duration: "1h 28 min",
    atmosphereScore: 18,
    batteryImpact: +24,
    keyInsights: ["Very calm energy", "Deep emotional connection", "Highly aligned values"],
    attractionProbability: 91,
    lieDetectionScore: 4,
  },
  {
    id: "4",
    name: "Work Review Meeting",
    timestamp: "Yesterday, 2:00 PM",
    duration: "55 min",
    atmosphereScore: 72,
    batteryImpact: -31,
    keyInsights: ["High stress environment", "Defensive body language noted", "Confrontational undertones"],
    attractionProbability: 15,
    lieDetectionScore: 61,
  },
  {
    id: "5",
    name: "Phone Call with Mom",
    timestamp: "Mar 4, 8:00 PM",
    duration: "23 min",
    atmosphereScore: 12,
    batteryImpact: +18,
    keyInsights: ["Warm and nurturing", "Supportive tone", "Emotional recharge"],
    attractionProbability: 20,
    lieDetectionScore: 2,
  },
];

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [atmosphereScore, setAtmosphereScore] = useState(34);
  const [colorMappings, setColorMappings] = useState<ColorMapping>(defaultColorMappings);
  const [smartGlasses, setSmartGlasses] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [privateMode, setPrivateMode] = useState(false);
  const [userName, setUserName] = useState("Alex Rivera");
  const [interactions, setInteractions] = useState<Interaction[]>(mockInteractions);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [pendingSessionData, setPendingSessionData] = useState<PendingSessionData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Global session state
  const [sessionTime, setSessionTime] = useState(0);
  const [attractionProb, setAttractionProb] = useState(72);
  const [lieScore, setLieScore] = useState(12);
  const [engagementScore, setEngagementScore] = useState(84);
  const [sessionTimeline, setSessionTimeline] = useState<{ time: string; score: number; label: string }[]>([]);

  // Refs for capturing live values inside intervals
  const attractionRef = useRef(attractionProb);
  const lieRef = useRef(lieScore);
  const engagementRef = useRef(engagementScore);
  const sessionTimeRef = useRef(sessionTime);
  const atmosphereRef = useRef(atmosphereScore);
  const sampleTickRef = useRef(0);

  // Keep refs synced
  useEffect(() => { attractionRef.current = attractionProb; }, [attractionProb]);
  useEffect(() => { lieRef.current = lieScore; }, [lieScore]);
  useEffect(() => { engagementRef.current = engagementScore; }, [engagementScore]);
  useEffect(() => { sessionTimeRef.current = sessionTime; }, [sessionTime]);
  useEffect(() => { atmosphereRef.current = atmosphereScore; }, [atmosphereScore]);

  const toggleDarkMode = () => setDarkMode((d) => !d);

  // Social battery is computed live from all interactions (base 100, clamped 0–100)
  const socialBattery = useMemo(() => {
    let battery = 100;
  
    // Convert timestamps to Date objects for sorting
    const parseTimestamp = (ts: string) => {
      const now = new Date();
      if (ts.startsWith("Today")) {
        const timePart = ts.replace("Today, ", "");
        const [hours, minutesPart] = timePart.split(":");
        const minutes = parseInt(minutesPart);
        const ampm = minutesPart.slice(-2);
        let h = parseInt(hours);
        if (ampm.toLowerCase() === "pm" && h !== 12) h += 12;
        if (ampm.toLowerCase() === "am" && h === 12) h = 0;
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, minutes);
      } else if (ts.startsWith("Yesterday")) {
        const timePart = ts.replace("Yesterday, ", "");
        const [hours, minutesPart] = timePart.split(":");
        const minutes = parseInt(minutesPart);
        const ampm = minutesPart.slice(-2);
        let h = parseInt(hours);
        if (ampm.toLowerCase() === "pm" && h !== 12) h += 12;
        if (ampm.toLowerCase() === "am" && h === 12) h = 0;
        const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, h, minutes);
        return date;
      } else {
        // Fallback: parse absolute dates like "Mar 4, 8:00 PM"
        return new Date(ts);
      }
    };
  
    const sorted = [...interactions].sort((a, b) => parseTimestamp(a.timestamp).getTime() - parseTimestamp(b.timestamp).getTime());
  
    for (const i of sorted) {
      battery += i.batteryImpact;
      battery = Math.max(0, Math.min(100, battery)); // cap each step
    }
  
    return battery;
  }, [interactions]);

  const addInteraction = (interaction: Interaction) => {
    setInteractions((prev) => [interaction, ...prev]);
  };

  const updateInteraction = (
    id: string,
    updates: Partial<Pick<Interaction, "name" | "atmosphereScore" | "batteryImpact">>
  ) => {
    setInteractions((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...updates } : i))
    );
  };

  const removeInteraction = (id: string) => {
    setInteractions((prev) => prev.filter((i) => i.id !== id));
  };

  // Global session management: update metrics every second when active
  useEffect(() => {
    if (!isSessionActive) return;
    
    const interval = setInterval(() => {
      setAttractionProb((v) => Math.min(100, Math.max(0, v + (Math.random() - 0.48) * 3)));
      setLieScore((v) => Math.min(100, Math.max(0, v + (Math.random() - 0.5) * 2)));
      setEngagementScore((v) => Math.min(100, Math.max(0, v + (Math.random() - 0.46) * 3)));
      setSessionTime((t) => {
        const next = t + 1;
        sampleTickRef.current += 1;
        // Sample atmosphere score every 5 seconds
        if (sampleTickRef.current % 5 === 0) {
          const mins = Math.floor(next / 60);
          const secs = next % 60;
          const timeLabel = `${mins}:${secs.toString().padStart(2, "0")}`;
          setSessionTimeline((prev) => [
            ...prev,
            {
              time: timeLabel,
              score: atmosphereRef.current,
              label: getEmotionLevel(atmosphereRef.current),
            },
          ]);
        }
        return next;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isSessionActive]);

  const startSession = () => {
    setSessionTimeline([]);
    sampleTickRef.current = 0;
    setSessionTime(0);
    setAttractionProb(72);
    setLieScore(12);
    setEngagementScore(84);
    setIsSessionActive(true);
  };

  const stopSession = () => {
    setIsSessionActive(false);
    // Capture snapshot of current live values via refs
    setPendingSessionData({
      sessionTime: sessionTimeRef.current,
      atmosphereScore: atmosphereRef.current,
      attractionProb: attractionRef.current,
      lieScore: lieRef.current,
      engagementScore: engagementRef.current,
      timeline: [...sessionTimeline],
    });
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const login = (email: string, password: string) => {
    // Simple authentication logic for demonstration purposes
    if (email === "user@empathica.app" && password === "password") {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AppContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        atmosphereScore,
        setAtmosphereScore,
        socialBattery,
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
        interactions,
        addInteraction,
        updateInteraction,
        removeInteraction,
        isSessionActive,
        setIsSessionActive,
        pendingSessionData,
        setPendingSessionData,
        isAuthenticated,
        login,
        logout,
        sessionTime,
        attractionProb,
        lieScore,
        engagementScore,
        sessionTimeline,
        startSession,
        stopSession,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export function getEmotionLevel(score: number): EmotionLevel {
  if (score <= 20) return "calm";
  if (score <= 40) return "neutral";
  if (score <= 60) return "energetic";
  if (score <= 80) return "tense";
  return "stressful";
}

export function getEmotionLabel(score: number): string {
  const level = getEmotionLevel(score);
  return {
    calm: "Calm",
    neutral: "Neutral",
    energetic: "Energetic",
    tense: "Tense",
    stressful: "Highly Stressful",
  }[level];
}

export function getEmotionColors(score: number, mappings: ColorMapping) {
  const level = getEmotionLevel(score);
  const baseColors: Record<EmotionLevel, { from: string; via: string; to: string; text: string; bg: string; light: string }> = {
    calm: {
      from: "#3b82f6",
      via: "#6366f1",
      to: "#818cf8",
      text: "#1e40af",
      bg: "#eff6ff",
      light: "#dbeafe",
    },
    neutral: {
      from: "#22c55e",
      via: "#10b981",
      to: "#34d399",
      text: "#166534",
      bg: "#f0fdf4",
      light: "#dcfce7",
    },
    energetic: {
      from: "#f97316",
      via: "#f59e0b",
      to: "#fbbf24",
      text: "#9a3412",
      bg: "#fff7ed",
      light: "#fed7aa",
    },
    tense: {
      from: "#ef4444",
      via: "#f97316",
      to: "#fb923c",
      text: "#991b1b",
      bg: "#fef2f2",
      light: "#fecaca",
    },
    stressful: {
      from: "#dc2626",
      via: "#991b1b",
      to: "#7f1d1d",
      text: "#7f1d1d",
      bg: "#fef2f2",
      light: "#fca5a5",
    },
  };

  const custom = mappings[level];
  const base = baseColors[level];

  return {
    ...base,
    from: custom || base.from,
    level,
  };
}

export function getEmotionColorsDark(score: number, mappings: ColorMapping) {
  const level = getEmotionLevel(score);
  const baseColors: Record<EmotionLevel, { from: string; via: string; to: string; text: string; bg: string; light: string }> = {
    calm: {
      from: "#1d4ed8",
      via: "#4338ca",
      to: "#4f46e5",
      text: "#93c5fd",
      bg: "#1e1b4b",
      light: "#312e81",
    },
    neutral: {
      from: "#15803d",
      via: "#047857",
      to: "#065f46",
      text: "#86efac",
      bg: "#052e16",
      light: "#14532d",
    },
    energetic: {
      from: "#c2410c",
      via: "#b45309",
      to: "#92400e",
      text: "#fdba74",
      bg: "#431407",
      light: "#7c2d12",
    },
    tense: {
      from: "#b91c1c",
      via: "#c2410c",
      to: "#c2410c",
      text: "#fca5a5",
      bg: "#450a0a",
      light: "#7f1d1d",
    },
    stressful: {
      from: "#7f1d1d",
      via: "#450a0a",
      to: "#3b0202",
      text: "#fca5a5",
      bg: "#3b0202",
      light: "#7f1d1d",
    },
  };

  const custom = mappings[level];
  const base = baseColors[level];

  return {
    ...base,
    from: custom || base.from,
    level,
  };
}