import { useState } from "react";

export default function ShadowGenerator() {
  const [offsetX, setOffsetX] = useState(4);
  const [offsetY, setOffsetY] = useState(4);
  const [blur, setBlur] = useState(8);
  const [spread, setSpread] = useState(0);
  const [opacity, setOpacity] = useState(30);

  const shadow = `${offsetX}px ${offsetY}px ${blur}px ${spread}px rgba(0,0,0,${opacity / 100})`;
  const cssCode = `box-shadow: ${shadow};`;

  const Slider = ({ label, value, onChange, min, max, unit = "px" }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; unit?: string }) => (
    <div><label>{label} {value}{unit}</label><input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} /></div>
  );

  return (
    <div className="tool-section" style={{ alignItems: "center" }}>
      <div style={{ width: 160, height: 120, background: "var(--bg-card)", borderRadius: 12, boxShadow: shadow, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border)" }}>
        预览
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, width: "100%", maxWidth: 400 }}>
        <Slider label="X" value={offsetX} onChange={setOffsetX} min={-50} max={50} />
        <Slider label="Y" value={offsetY} onChange={setOffsetY} min={-50} max={50} />
        <Slider label="模糊" value={blur} onChange={setBlur} min={0} max={50} />
        <Slider label="扩展" value={spread} onChange={setSpread} min={-20} max={20} />
        <Slider label="透明度" value={opacity} onChange={setOpacity} min={0} max={100} unit="%" />
      </div>
      <div className="tool-col" style={{ width: "100%", maxWidth: 400 }}>
        <label>CSS</label>
        <div className="result-box" style={{ fontFamily: "monospace" }}>{cssCode}</div>
      </div>
      <button className="btn btn-secondary" onClick={() => navigator.clipboard.writeText(cssCode)}>复制 CSS</button>
    </div>
  );
}
