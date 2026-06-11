import { useState } from "react";

const sampleSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" fill="#3b82f6" />
  <path d="M30 50 L45 65 L70 35" stroke="white" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round" />
</svg>`;

export default function SvgViewer() {
  const [svgCode, setSvgCode] = useState(sampleSvg);
  const [bg, setBg] = useState("#1a1a2e");

  return (
    <div className="tool-section">
      <div className="tool-row">
        <div className="tool-col">
          <label>SVG 代码</label>
          <textarea value={svgCode} onChange={(e) => setSvgCode(e.target.value)} />
        </div>
        <div className="tool-col" style={{ alignItems: "center" }}>
          <label>预览</label>
          <div style={{ background: bg, borderRadius: 12, padding: 20, border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 200, width: "100%" }}
            dangerouslySetInnerHTML={{ __html: svgCode }}
          />
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 4 }}>
            <label>背景</label>
            <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} style={{ width: 40, height: 28 }} />
          </div>
        </div>
      </div>
      <div className="btn-group">
        <button className="btn btn-secondary" onClick={() => navigator.clipboard.writeText(svgCode)}>复制 SVG</button>
        <button className="btn btn-secondary" onClick={() => {
          const blob = new Blob([svgCode], { type: "image/svg+xml" });
          const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "icon.svg"; a.click();
        }}>下载 SVG</button>
      </div>
    </div>
  );
}
