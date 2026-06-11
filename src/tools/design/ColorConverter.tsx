import { useState } from "react";

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null;
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function ColorConverter() {
  const [hex, setHex] = useState("#00d2ff");

  const rgb = hexToRgb(hex);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;

  const handleRgbChange = (r: number, g: number, b: number) => {
    setHex(rgbToHex(Math.min(255, Math.max(0, r)), Math.min(255, Math.max(0, g)), Math.min(255, Math.max(0, b))));
  };

  return (
    <div className="tool-section">
      <div className="tool-row">
        <div className="tool-col" style={{ flex: "none", width: 200 }}>
          <label>HEX</label>
          <input type="text" value={hex} onChange={(e) => setHex(e.target.value)} />
          <div className="color-preview" style={{ background: hex }} />
        </div>
        <div className="tool-col">
          <label>RGB</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input type="number" value={rgb?.r ?? 0} onChange={(e) => handleRgbChange(Number(e.target.value), rgb?.g ?? 0, rgb?.b ?? 0)} min={0} max={255} />
            <input type="number" value={rgb?.g ?? 0} onChange={(e) => handleRgbChange(rgb?.r ?? 0, Number(e.target.value), rgb?.b ?? 0)} min={0} max={255} />
            <input type="number" value={rgb?.b ?? 0} onChange={(e) => handleRgbChange(rgb?.r ?? 0, rgb?.g ?? 0, Number(e.target.value))} min={0} max={255} />
          </div>
          <label>HSL</label>
          <div className="result-box">
            {hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : "无效颜色"}
          </div>
        </div>
      </div>
    </div>
  );
}
