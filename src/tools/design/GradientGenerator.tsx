import { useState } from "react";

export default function GradientGenerator() {
  const [color1, setColor1] = useState("#3b82f6");
  const [color2, setColor2] = useState("#8b5cf6");
  const [angle, setAngle] = useState(135);
  const [type, setType] = useState<"linear" | "radial">("linear");

  const gradient = type === "linear"
    ? `linear-gradient(${angle}deg, ${color1}, ${color2})`
    : `radial-gradient(circle, ${color1}, ${color2})`;

  const cssCode = `background: ${gradient};`;
  const tailwindCode = `bg-gradient-to-br from-[${color1}] to-[${color2}]`;

  return (
    <div className="tool-section" style={{ alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: 500, height: 200, borderRadius: 12, background: gradient, border: "1px solid var(--border)" }} />
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "end" }}>
        <div className="tool-col" style={{ flex: "none", width: 80 }}><label>颜色 1</label><input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} style={{ width: "100%", height: 32 }} /></div>
        <div className="tool-col" style={{ flex: "none", width: 80 }}><label>颜色 2</label><input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} style={{ width: "100%", height: 32 }} /></div>
        <div className="tool-col" style={{ flex: "none", width: 100 }}><label>类型</label>
          <select value={type} onChange={(e) => setType(e.target.value as any)}>
            <option value="linear">线性</option><option value="radial">径向</option>
          </select>
        </div>
        {type === "linear" && <div className="tool-col" style={{ flex: "none", width: 100 }}><label>角度 {angle}°</label><input type="range" min={0} max={360} value={angle} onChange={(e) => setAngle(Number(e.target.value))} /></div>}
      </div>
      <div className="tool-col" style={{ width: "100%", maxWidth: 500 }}>
        <label>CSS</label>
        <div className="result-box" style={{ fontFamily: "monospace" }}>{cssCode}</div>
      </div>
      <div className="btn-group">
        <button className="btn btn-secondary" onClick={() => navigator.clipboard.writeText(cssCode)}>复制 CSS</button>
      </div>
    </div>
  );
}
