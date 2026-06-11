import { useState } from "react";

export default function CssBoxModel() {
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(120);
  const [margin, setMargin] = useState({ top: 20, right: 20, bottom: 20, left: 20 });
  const [padding, setPadding] = useState({ top: 16, right: 16, bottom: 16, left: 16 });
  const [border, setBorder] = useState(2);

  const totalW = width + margin.left + margin.right + padding.left + padding.right + border * 2;
  const totalH = height + margin.top + margin.bottom + padding.top + padding.bottom + border * 2;

  const updateMargin = (side: keyof typeof margin, val: number) => setMargin({ ...margin, [side]: val });
  const updatePadding = (side: keyof typeof padding, val: number) => setPadding({ ...padding, [side]: val });

  return (
    <div className="tool-section">
      <div className="tool-row">
        <div className="tool-col" style={{ flex: "none", width: 300 }}>
          <label>尺寸</label>
          <div style={{ display: "flex", gap: 8 }}>
            <div className="tool-col"><label>W</label><input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} /></div>
            <div className="tool-col"><label>H</label><input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} /></div>
          </div>
          <label>边框 {border}px</label>
          <input type="range" min={0} max={20} value={border} onChange={(e) => setBorder(Number(e.target.value))} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, fontSize: 12, color: "var(--text-secondary)" }}>
            <span>总宽: {totalW}px</span>
            <span>总高: {totalH}px</span>
          </div>
        </div>
        <div className="tool-col" style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ background: "rgba(59,130,246,0.2)", border: "1px dashed #3b82f6", padding: "8px", borderRadius: 4, textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "#3b82f6" }}>margin: {margin.top}/{margin.right}/{margin.bottom}/{margin.left}</div>
              <div style={{ background: "rgba(16,185,129,0.2)", border: "1px dashed #10b981", padding: "8px", borderRadius: 4, textAlign: "center", margin: "4px" }}>
                <div style={{ fontSize: 10, color: "#10b981" }}>padding: {padding.top}/{padding.right}/{padding.bottom}/{padding.left}</div>
                <div style={{ background: "rgba(0,210,255,0.2)", border: `${border}px solid var(--accent)`, padding: "8px", borderRadius: 4, textAlign: "center", minWidth: 60 }}>
                  <div style={{ fontSize: 10, color: "var(--accent)" }}>content</div>
                  <div style={{ fontSize: 10 }}>{width}×{height}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label>Margin</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
            {(["top", "right", "bottom", "left"] as const).map((s) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
                <span style={{ width: 20, color: "var(--text-secondary)" }}>{s[0].toUpperCase()}</span>
                <input type="number" value={margin[s]} onChange={(e) => updateMargin(s, Number(e.target.value))} style={{ padding: "4px 6px", fontSize: 12 }} />
              </div>
            ))}
          </div>
        </div>
        <div>
          <label>Padding</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
            {(["top", "right", "bottom", "left"] as const).map((s) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
                <span style={{ width: 20, color: "var(--text-secondary)" }}>{s[0].toUpperCase()}</span>
                <input type="number" value={padding[s]} onChange={(e) => updatePadding(s, Number(e.target.value))} style={{ padding: "4px 6px", fontSize: 12 }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
