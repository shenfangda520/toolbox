import { useState } from "react";

const conversions = [
  { from: "°C", to: "°F", fn: (v: number) => v * 9 / 5 + 32, label: "摄氏 → 华氏" },
  { from: "°F", to: "°C", fn: (v: number) => (v - 32) * 5 / 9, label: "华氏 → 摄氏" },
  { from: "°C", to: "K", fn: (v: number) => v + 273.15, label: "摄氏 → 开尔文" },
  { from: "m", to: "ft", fn: (v: number) => v * 3.28084, label: "米 → 英尺" },
  { from: "ft", to: "m", fn: (v: number) => v / 3.28084, label: "英尺 → 米" },
  { from: "kg", to: "lb", fn: (v: number) => v * 2.20462, label: "千克 → 磅" },
  { from: "lb", to: "kg", fn: (v: number) => v / 2.20462, label: "磅 → 千克" },
  { from: "L", to: "gal", fn: (v: number) => v * 0.264172, label: "升 → 加仑" },
  { from: "bar", to: "psi", fn: (v: number) => v * 14.5038, label: "bar → PSI" },
  { from: "psi", to: "bar", fn: (v: number) => v / 14.5038, label: "PSI → bar" },
  { from: "MPa", to: "psi", fn: (v: number) => v * 145.038, label: "MPa → PSI" },
  { from: "m³/h", to: "L/min", fn: (v: number) => v * 1000 / 60, label: "m³/h → L/min" },
];

export default function UnitConverter() {
  const [selected, setSelected] = useState(0);
  const [value, setValue] = useState("100");
  const result = conversions[selected].fn(Number(value));

  return (
    <div className="tool-section">
      <div className="tool-col">
        <label>选择转换</label>
        <select value={selected} onChange={(e) => setSelected(Number(e.target.value))}>
          {conversions.map((c, i) => <option key={i} value={i}>{c.label}</option>)}
        </select>
      </div>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <div className="tool-col" style={{ flex: "none", width: 160 }}>
          <label>{conversions[selected].from}</label>
          <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
        </div>
        <span style={{ fontSize: 24, color: "var(--accent)" }}>=</span>
        <div className="tool-col" style={{ flex: "none", width: 160 }}>
          <label>{conversions[selected].to}</label>
          <div className="result-box" style={{ minHeight: 40, fontSize: 18, textAlign: "center" }}>{Number(result.toFixed(4))}</div>
        </div>
      </div>
    </div>
  );
}
