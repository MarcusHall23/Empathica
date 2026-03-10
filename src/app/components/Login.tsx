import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import logo from "figma:asset/ceb3dbb3d26f6818c38f5cc324f0c50c7d6666d5.png";

export function Login() {
  const { login, darkMode } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    const success = login(email, password);
    if (success){
      navigate("/");
    }
    else{
      setError("Invalid email or password");
    }
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
          background: darkMode ? "#0d0d14" : "#0f172a",
        }}
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Base gradient layer */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: darkMode
                ? "radial-gradient(circle at 50% 50%, #1d4ed8 0%, #0d0d14 70%)"
                : "radial-gradient(circle at 50% 50%, #3b82f6 0%, #f8f9fb 70%)",
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.9, 0.8, 0.9],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Blue swirl - rotating clockwise */}
          <motion.div
            className="absolute w-[600px] h-[600px]"
            style={{
              background: darkMode
                ? "radial-gradient(circle, rgba(29, 78, 216, 0.8) 0%, rgba(29, 78, 216, 0.15) 50%, transparent 75%)"
                : "radial-gradient(circle, rgba(59, 130, 246, 0.9) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 75%)",
              filter: "blur(20px)",
              top: "-20%",
              left: "-20%",
            }}
            animate={{
              x: [0, 150, 0],
              y: [0, 100, 0],
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Green swirl - rotating counter-clockwise */}
          <motion.div
            className="absolute w-[500px] h-[500px]"
            style={{
              background: darkMode
                ? "radial-gradient(circle, rgba(34, 197, 94, 0.65) 0%, rgba(34, 197, 94, 0.12) 50%, transparent 75%)"
                : "radial-gradient(circle, rgba(34, 197, 94, 0.75) 0%, rgba(34, 197, 94, 0.18) 50%, transparent 75%)",
              filter: "blur(20px)",
              bottom: "-15%",
              right: "-15%",
            }}
            animate={{
              x: [0, -100, 0],
              y: [0, -120, 0],
              scale: [1, 1.3, 1],
              rotate: [0, -180, -360],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Teal accent - figure-8 motion */}
          <motion.div
            className="absolute w-[400px] h-[400px]"
            style={{
              background: darkMode
                ? "radial-gradient(circle, rgba(20, 184, 166, 0.8) 0%, rgba(20, 184, 166, 0.1) 50%, transparent 75%)"
                : "radial-gradient(circle, rgba(20, 184, 166, 0.7) 0%, rgba(20, 184, 166, 0.15) 50%, transparent 75%)",
              filter: "blur(25px)",
              top: "30%",
              right: "10%",
            }}
            animate={{
              x: [0, -80, 0, 80, 0],
              y: [0, 60, 120, 60, 0],
              scale: [1, 1.15, 1, 1.15, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Light blue accent - circular motion */}
          <motion.div
            className="absolute w-[450px] h-[450px]"
            style={{
              background: darkMode
                ? "radial-gradient(circle, rgba(96, 165, 250, 0.55) 0%, rgba(96, 165, 250, 0.08) 50%, transparent 75%)"
                : "radial-gradient(circle, rgba(96, 165, 250, 0.65) 0%, rgba(96, 165, 250, 0.12) 50%, transparent 75%)",
              filter: "blur(25px)",
              bottom: "25%",
              left: "5%",
            }}
            animate={{
              x: [0, 100, 0, -50, 0],
              y: [0, -80, -120, -60, 0],
              scale: [1, 1.2, 1.1, 1.15, 1],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Emerald accent - slow drift */}
          <motion.div
            className="absolute w-[380px] h-[380px]"
            style={{
              background: darkMode
                ? "radial-gradient(circle, rgba(16, 185, 129, 0.58) 0%, rgba(16, 185, 129, 0.09) 50%, transparent 75%)"
                : "radial-gradient(circle, rgba(16, 185, 129, 0.68) 0%, rgba(16, 185, 129, 0.13) 50%, transparent 75%)",
              filter: "blur(28px)",
              top: "10%",
              left: "20%",
            }}
            animate={{
              x: [0, 60, 120, 60, 0],
              y: [0, 80, 0, -40, 0],
              scale: [1, 1.25, 1.1, 1.2, 1],
              rotate: [0, 120, 240, 360],
            }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          {/* Color Boost Layer */}
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 30% 40%, rgba(59,130,246,0.25), transparent 60%), radial-gradient(circle at 70% 60%, rgba(34,197,94,0.25), transparent 60%)",
              mixBlendMode: "overlay",
            }}
          />

          {/* Overlay for subtle color blending */}
          <div
            className="absolute inset-0"
            style={{
              background: darkMode
                ? "linear-gradient(180deg, rgba(13, 13, 20, 0.5) 0%, rgba(13, 13, 20, 0.1) 50%, rgba(13, 13, 20, 0.8) 100%)"
                : "linear-gradient(180deg, rgba(248, 249, 251, 0.6) 0%, rgba(248, 249, 251, 0.05) 50%, rgba(248, 249, 251, 0.8) 100%)",
              mixBlendMode: "overlay",
            }}
          />
        </div>

        {/* Status bar */}
        <div
          className={`relative z-10 flex items-center justify-between px-6 pt-4 pb-2 ${
            darkMode ? "text-white/70" : "text-gray-500"
          }`}
        >
          <span className="text-xs font-medium">{currentTime}</span>
          <div className="flex items-center gap-1.5">
            <div className="flex gap-[2px] items-end h-3">
              <div
                className={`w-[3px] h-1.5 rounded-sm ${
                  darkMode ? "bg-white/70" : "bg-gray-500"
                }`}
              />
              <div
                className={`w-[3px] h-2 rounded-sm ${
                  darkMode ? "bg-white/70" : "bg-gray-500"
                }`}
              />
              <div
                className={`w-[3px] h-2.5 rounded-sm ${
                  darkMode ? "bg-white/70" : "bg-gray-500"
                }`}
              />
              <div
                className={`w-[3px] h-3 rounded-sm ${
                  darkMode ? "bg-white/70" : "bg-gray-500"
                }`}
              />
            </div>
            <svg viewBox="0 0 24 12" className="w-5 h-3" fill="none">
              <rect
                x="0.5"
                y="0.5"
                width="21"
                height="11"
                rx="3.5"
                stroke={darkMode ? "rgba(255,255,255,0.7)" : "#6b7280"}
              />
              <rect
                x="22"
                y="3.5"
                width="2"
                height="5"
                rx="1"
                fill={darkMode ? "rgba(255,255,255,0.7)" : "#6b7280"}
              />
              <rect
                x="1.5"
                y="1.5"
                width="17"
                height="9"
                rx="2.5"
                fill={darkMode ? "rgba(255,255,255,0.7)" : "#6b7280"}
              />
            </svg>
          </div>
        </div>

        {/* Login content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 pb-16">
          {/* Logo and title */}
          <div className="flex flex-col items-center mb-12">
            <div className="w-100 h-35 rounded-3xl mb-0 flex items-center justify-center">
              {/* style={{ background: "transparent" }} */}
            {/* > */}
              <img src={logo} alt="Empathica Logo" className="w- h-auto mb-0 object-contain" />
            </div>
            <h1
              className={`text-3xl mb-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Empathica
            </h1>
            <p
              className={`text-sm ${
                darkMode ? "text-white/50" : "text-gray-500"
              }`}
            >
              Emotional Intelligence Insights
            </p>
          </div>
          
          {/* Login form */}
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div>
              <label
                htmlFor="email"
                className={`block text-sm mb-2 ${
                  darkMode ? "text-white/70" : "text-gray-700"
                }`}
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className={`w-full rounded-2xl px-4 py-3 ${
                  darkMode
                    ? "bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                } focus:ring-2 focus:ring-blue-500/50 transition-all`}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className={`block text-sm mb-2 ${
                  darkMode ? "text-white/70" : "text-gray-700"
                }`}
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full rounded-2xl px-4 py-3 pr-12 ${
                    darkMode
                      ? "bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                  } focus:ring-2 focus:ring-blue-500/50 transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                    darkMode ? "text-white/40" : "text-gray-400"
                  } hover:${darkMode ? "text-white/70" : "text-gray-600"} transition-colors`}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-500/10 rounded-xl px-4 py-2">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full rounded-2xl py-6 mt-6 text-white shadow-lg transition-all hover:shadow-xl"
              style={{
                background: darkMode
                  ? "linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%)"
                  : "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
              }}
            >
              Sign In
            </Button>
          </form>

          {/* Demo credentials hint */}
          <div
            className={`mt-8 text-center text-xs ${
              darkMode ? "text-white/30" : "text-gray-400"
            }`}
          >
            <p>Demo: user@empathica.app / password</p>
          </div>
        </div>
      </div>
    </div>
  );
}