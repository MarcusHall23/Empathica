import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "../context/AppContext";

interface Particle {
  id: number;
  angle: number;
  distance: number;
  baseDistance: number;
  opacity: number;
  driftSpeed: number;
  noiseOffset: number;
}

export function BreathingExercise() {
  const [isOpen, setIsOpen] = useState(false);
  const { darkMode } = useApp();
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [scale, setScale] = useState(0.5);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [completionMessage, setCompletionMessage] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();
  const rotationRef = useRef(0);

  const cardBg = darkMode ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.75)";
  const cardBorder = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const textPrimary = darkMode ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.85)";
  const textSecondary = darkMode ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)";
  const completionMessages = [
  "Nice work. Your nervous system appreciates that.",
  "You took a moment to reset. That matters.",
  "Breathing session complete. Notice how you feel.",
  "A minute of calm can change the rest of your day.",
  "Great job slowing things down.",
];

  useEffect(() => {
    const preventScroll = (e: TouchEvent) => e.preventDefault();
  
    if (!isOpen) return;
  
    // Find the nearest scrollable ancestor
    let scrollable: HTMLElement | null = document.activeElement as HTMLElement | null;
    if (!scrollable) scrollable = document.body;
  
    let el: HTMLElement | null = scrollable;
    while (el && el !== document.body) {
      const overflowY = getComputedStyle(el).overflowY;
      if (overflowY === "auto" || overflowY === "scroll") {
        scrollable = el;
        break;
      }
      el = el.parentElement;
    }
  
    // Lock scrolling
    scrollable.style.overflow = "hidden";
    scrollable.addEventListener("touchmove", preventScroll, { passive: false });
    scrollable.scrollTo(0, 0); // scroll to top
  
    return () => {
      scrollable.style.overflow = "";
      scrollable.removeEventListener("touchmove", preventScroll);
    };
  }, [isOpen]);
    
  // Initialize particles
  useEffect(() => {
  if (!isOpen) return;

  const particles: Particle[] = [];
  const particleCount = 220;

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;

    // Radial distribution (dense center, sparse edges)
    const radius = Math.pow(Math.random(), 1.8) * 90;
    

    particles.push({
      id: i,
      angle,
      distance: radius,
      baseDistance: radius,
      opacity: 0.3 + Math.random() * 0.7,
      driftSpeed: 0.0002 + Math.random() * 0.0005,
      noiseOffset: Math.random() * Math.PI * 2,
    });
  }

  particlesRef.current = particles;
}, [isOpen]);
  // Breathing cycle animation
  useEffect(() => {
    if (!isOpen) return;

    const startTime = Date.now();
    let currentPhase: "inhale" | "hold" | "exhale" = "inhale";
    let phaseStartTime = startTime;

    const animate = () => {
      const now = Date.now();
      const totalElapsed = (now - startTime) / 1000;
      const phaseElapsed = (now - phaseStartTime) / 1000;

      setElapsedTime(totalElapsed);

      // Stop after 60 seconds
     if (totalElapsed >= 60) {
        const randomMessage =
          completionMessages[Math.floor(Math.random() * completionMessages.length)];
      
        setCompletionMessage(randomMessage);
        setSessionComplete(true);
        return;
      }

      // 4-7-8 breathing pattern
      if (currentPhase === "inhale" && phaseElapsed >= 4) {
        currentPhase = "hold";
        phaseStartTime = now;
        setPhase("hold");
      } else if (currentPhase === "hold" && phaseElapsed >= 7) {
        currentPhase = "exhale";
        phaseStartTime = now;
        setPhase("exhale");
      } else if (currentPhase === "exhale" && phaseElapsed >= 8) {
        currentPhase = "inhale";
        phaseStartTime = now;
        setPhase("inhale");
      }

      // Calculate target scale based on phase
      let targetScale = 0.5;
      let progress = phaseElapsed;

      if (currentPhase === "inhale") {
        // Expand from 0.5 to 1.0 over 4 seconds
        const t = Math.min(progress / 4, 1);
        // Ease out for smooth expansion
        const eased = 1 - Math.pow(1 - t, 3);
        targetScale = 0.5 + eased * 0.5;
      } else if (currentPhase === "hold") {
        // Stay at 1.0
        targetScale = 1.0;
      } else if (currentPhase === "exhale") {
        // Contract from 1.0 to 0.5 over 8 seconds
        const t = Math.min(progress / 8, 1);
        // Ease in for smooth contraction
        const eased = 1 - Math.pow(1 - t, 2);
        targetScale = 1.0 - eased * 0.5;
      }

      setScale(targetScale);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isOpen]);

  // Canvas rendering
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, rect.width, rect.height);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Add subtle ripples during inhale
      const rippleIntensity = phase === "inhale" ? Math.sin(elapsedTime * 8) * 0.05 : 0;

      if (phase === "hold") {
          rotationRef.current += 0.0001; // slow spin
        }
      
      particlesRef.current.forEach((particle) => {
          
        const driftAngle = particle.angle + rotationRef.current;
        
      const organicNoise =
        Math.sin(elapsedTime * 1.5 + particle.noiseOffset) * 2;
      
      const currentDistance =
        particle.baseDistance * scale * (1 + rippleIntensity) + organicNoise;


        
        const x = centerX + Math.cos(driftAngle) * currentDistance;
        const y = centerY + Math.sin(driftAngle) * currentDistance;


        // Blue color gradient
        const colors = [
          `rgba(59, 130, 246, ${particle.opacity})`, // #3b82f6
          `rgba(96, 165, 250, ${particle.opacity})`, // lighter blue
          `rgba(147, 197, 253, ${particle.opacity})`, // even lighter
        ];

        const layerIndex = Math.floor(particle.id / 30) % 3;
        ctx.fillStyle = colors[layerIndex];
        
        // Particle size varies with distance from center
        const size = 0.8 + (particle.baseDistance / 100) * 2;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isOpen, scale, phase, elapsedTime]);

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setPhase("inhale");
      setScale(0.5);
      setElapsedTime(0);
      setSessionComplete(false);
    }
  }, [isOpen]);

  const getPhaseText = () => {
    switch (phase) {
      case "inhale":
        return "Breathe In";
      case "hold":
        return "Hold";
      case "exhale":
        return "Breathe Out";
    }
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case "inhale":
        return "Slowly inhale through your nose (4 seconds)";
      case "hold":
        return "Hold your breath gently (7 seconds)";
      case "exhale":
        return "Exhale slowly through your mouth (8 seconds)";
    }
  };

  return (
    <>
      {/* Breathing Exercise Card */}
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-2xl p-3.5 flex flex-col gap-2 transition-all active:scale-95"
        style={{ 
          background: cardBg, 
          border: `1px solid ${cardBorder}`, 
          backdropFilter: "blur(20px)",
          width: "100%",
          textAlign: "left"
        }}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(59, 130, 246, 0.15)" }}
        >
          {/* Animated breathing circle icon */}
          <motion.div
            className="w-4 h-4 rounded-full"
            style={{ background: "#3b82f6" }}
            animate={{
              scale: [1, 1.55, 1.55, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 19,
              times: [0, 0.15, 0.4, .7],
              repeat: Infinity,
              
            }}
          />
        </div>
        <div>
          <p className="text-[10px]" style={{ color: textSecondary }}>Breathing</p>
          <p className="text-sm font-semibold" style={{ color: textPrimary }}>Exercise</p>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(to right, #3b82f6, #60a5fa)" }}
            animate={{ width: ["0%", "100%", "100%", "0%"] }}
            transition={{ duration: 19, times: [0, 0.15, .4, .7], repeat: Infinity }}
          />
        </div>
      </button>

      {/* Full-screen Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex flex-col"
            style={{
              width: "100%",
              height: "100%",
              background: darkMode 
                ? "linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 50%, #0a0a14 100%)"
                : "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0fdf4 100%)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <h2 className="text-lg font-semibold" style={{ color: textPrimary }}>
                Breathing Exercise
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
                style={{ 
                  background: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" 
                }}
              >
                <X size={18} style={{ color: textPrimary }} />
              </button>
            </div>

            {/* Breathing visualization */}
            <div className="flex-1 flex flex-col items-center justify-center px-6">
              {!sessionComplete ? (
                  <>
                    <canvas
                      ref={canvasRef}
                      className="w-full max-w-[280px] aspect-square"
                      style={{ maxHeight: "280px" }}
                    />
              
                    {/* Phase indicator */}
                    <motion.div
                      key={phase}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 text-center"
                    >
                      <p className="text-2xl mb-2" style={{ color: "#3b82f6", fontWeight: 600 }}>
                        {getPhaseText()}
                      </p>
                      <p className="text-sm" style={{ color: textSecondary }}>
                        {getPhaseInstruction()}
                      </p>
                    </motion.div>
              
                    {/* Timer */}
                    <div className="mt-6 text-center">
                      <p className="text-xs" style={{ color: textSecondary }}>
                        {Math.floor(60 - elapsedTime)}s remaining
                      </p>
                    </div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative text-center max-w-xs"
                  >
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        className="rounded-full"
                        style={{
                          width: 160,
                          height: 160,
                          background: "radial-gradient(circle, rgba(59,130,246,0.35) 0%, rgba(59,130,246,0.58) 50%, transparent 70%)",
                          filter: "blur(20px)",
                        }}
                        animate={{
                          scale: [1, 2, 1],
                          opacity: [0.8, 1, 0.8],
                        }}
                        transition={{
                          duration: 19,
                          repeat: Infinity,
                          times: [0, 0.15, 0.4, .7],
                        }}
                      />
                    </motion.div>
                    <p
                      className="text-2xl font-semibold mb-4"
                      style={{ color: "#3b82f6" }}
                    >
                      Great job.
                    </p>
              
                    <p className="text-sm mb-6" style={{ color: textSecondary }}>
                      {completionMessage}
                    </p>
              
                    {/* <button
                      onClick={() => setIsOpen(false)}
                      className="px-5 py-2 rounded-full text-sm font-medium"
                      style={{
                        background: "#3b82f6",
                        color: "white",
                      }}
                    >
                      Close
                    </button> */}
                  </motion.div>
                )}
            </div>
              {/* <canvas
                ref={canvasRef}
                className="w-full max-w-[280px] aspect-square"
                style={{ maxHeight: "280px" }}
              /> */}

              {/* Phase indicator */}
              {/* <motion.div
                key={phase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 text-center"
              >
                <p className="text-2xl mb-2" style={{ color: "#3b82f6", fontWeight: 600 }}>
                  {getPhaseText()}
                </p>
                <p className="text-sm" style={{ color: textSecondary }}>
                  {getPhaseInstruction()}
                </p>
              </motion.div> */}

              {/* Timer */}
              {/* <div className="mt-6 text-center">
                <p className="text-xs" style={{ color: textSecondary }}>
                  {Math.floor(60 - elapsedTime)}s remaining
                </p>
              </div>
            </div> */}

            {/* Footer hint */}
            <div className="px-6 pb-8 text-center">
              <p className="text-xs" style={{ color: textSecondary }}>
                This exercise will end automatically after 60 seconds
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
