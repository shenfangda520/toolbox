import { useState, useEffect, useRef } from "react";

export default function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"work" | "break">("work");
  const [completed, setCompleted] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const totalSeconds = minutes * 60 + seconds;

  useEffect(() => {
    if (isRunning && totalSeconds > 0) {
      intervalRef.current = window.setInterval(() => {
        setSeconds((s) => {
          if (s === 0) {
            setMinutes((m) => {
              if (m === 0) {
                clearInterval(intervalRef.current!);
                setIsRunning(false);
                setCompleted((c) => c + 1);
                return mode === "work" ? 5 : 25;
              }
              return m - 1;
            });
            return 59;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, mode]);

  const reset = () => {
    setIsRunning(false);
    setMinutes(mode === "work" ? 25 : 5);
    setSeconds(0);
  };

  const switchMode = (m: "work" | "break") => {
    setMode(m);
    setIsRunning(false);
    setMinutes(m === "work" ? 25 : 5);
    setSeconds(0);
  };

  const progress = mode === "work" ? totalSeconds / (25 * 60) : totalSeconds / (5 * 60);
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="tool-section" style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button className={`btn ${mode === "work" ? "btn-primary" : "btn-secondary"}`} onClick={() => switchMode("work")}>🍅 工作 25min</button>
        <button className={`btn ${mode === "break" ? "btn-primary" : "btn-secondary"}`} onClick={() => switchMode("break")}>☕ 休息 5min</button>
      </div>
      <div style={{ position: "relative", width: 200, height: 200 }}>
        <svg width="200" height="200" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="100" cy="100" r="90" fill="none" stroke="var(--border)" strokeWidth="6" />
          <circle cx="100" cy="100" r="90" fill="none" stroke={mode === "work" ? "var(--accent)" : "#10b981"} strokeWidth="6" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.5s" }} />
        </svg>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
          <div style={{ fontSize: 36, fontWeight: 700, fontFamily: "monospace" }}>{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{mode === "work" ? "专注中" : "休息中"}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <button className="btn btn-primary" onClick={() => setIsRunning(!isRunning)} style={{ padding: "10px 32px" }}>
          {isRunning ? "暂停" : "开始"}
        </button>
        <button className="btn btn-secondary" onClick={reset}>重置</button>
      </div>
      <div style={{ marginTop: 12, color: "var(--text-secondary)", fontSize: 13 }}>已完成 {completed} 个番茄</div>
    </div>
  );
}
