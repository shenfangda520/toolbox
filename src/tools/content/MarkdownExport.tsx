import { useState, useRef } from "react";
import Markdown from "react-markdown";
import { toPng } from "html-to-image";
import { loadWatermark, saveWatermark, WatermarkFooter } from "../../lib/watermark";

const sampleMd = `# 标题示例

## 二级标题

这是一段 **加粗文本** 和 *斜体文本*，还有 \`行内代码\`。

### 列表

- 项目一
- 项目二
- 项目三

### 有序列表

1. 第一步
2. 第二步
3. 第三步

### 代码块

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### 引用

> 这是一段引用文本，可以用来强调重点内容。

### 表格

| 名称 | 类型 | 说明 |
|------|------|------|
| name | string | 名称 |
| age | number | 年龄 |

---

以上是 Markdown 格式化预览效果。
`;

const themes = {
  default: {
    name: "默认",
    bg: "#ffffff",
    color: "#1a1a2e",
    accent: "#00d2ff",
  },
  dark: {
    name: "暗色",
    bg: "#1a1a2e",
    color: "#e6e6e6",
    accent: "#00d2ff",
  },
  green: {
    name: "绿色",
    bg: "#f0fdf4",
    color: "#14532d",
    accent: "#16a34a",
  },
  purple: {
    name: "紫色",
    bg: "#faf5ff",
    color: "#3b0764",
    accent: "#9333ea",
  },
  warm: {
    name: "暖色",
    bg: "#fffbeb",
    color: "#451a03",
    accent: "#d97706",
  },
};

type ThemeKey = keyof typeof themes;

export default function MarkdownExport() {
  const [input, setInput] = useState(sampleMd);
  const [theme, setTheme] = useState<ThemeKey>("default");
  const [bgStyle, setBgStyle] = useState<"solid" | "gradient">("solid");
  const [padding, setPadding] = useState(40);
  const [fontSize, setFontSize] = useState(16);
  const [exporting, setExporting] = useState(false);
  const [watermark, setWatermark] = useState(loadWatermark);
  const previewRef = useRef<HTMLDivElement>(null);

  const updateWatermark = (v: string) => {
    setWatermark(v);
    saveWatermark(v);
  };

  const t = themes[theme];

  const handleExport = async () => {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(previewRef.current, {
        pixelRatio: 2,
        backgroundColor: t.bg,
      });
      const link = document.createElement("a");
      link.download = `markdown-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    }
    setExporting(false);
  };

  const handleCopyImage = async () => {
    if (!previewRef.current) return;
    try {
      const dataUrl = await toPng(previewRef.current, { pixelRatio: 2, backgroundColor: t.bg });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const bgValue = bgStyle === "gradient"
    ? `linear-gradient(135deg, ${t.bg}, ${t.accent}22)`
    : t.bg;

  return (
    <div className="tool-section tool-fill" style={{ gap: 16 }}>
      <div className="tool-row" style={{ flex: "none", gap: 12 }}>
        <div className="tool-col" style={{ flex: "none", width: 100 }}>
          <label>主题</label>
          <select value={theme} onChange={(e) => setTheme(e.target.value as ThemeKey)}>
            {Object.entries(themes).map(([k, v]) => (
              <option key={k} value={k}>{v.name}</option>
            ))}
          </select>
        </div>
        <div className="tool-col" style={{ flex: "none", width: 100 }}>
          <label>背景</label>
          <select value={bgStyle} onChange={(e) => setBgStyle(e.target.value as "solid" | "gradient")}>
            <option value="solid">纯色</option>
            <option value="gradient">渐变</option>
          </select>
        </div>
        <div className="tool-col" style={{ flex: "none", width: 100 }}>
          <label>内距 {padding}px</label>
          <input type="range" min={16} max={80} value={padding} onChange={(e) => setPadding(Number(e.target.value))} />
        </div>
        <div className="tool-col" style={{ flex: "none", width: 100 }}>
          <label>字号 {fontSize}px</label>
          <input type="range" min={12} max={24} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} />
        </div>
        <div className="tool-col" style={{ flex: 1, minWidth: 140 }}>
          <label>底部水印（留空不显示）</label>
          <input
            type="text"
            value={watermark}
            onChange={(e) => updateWatermark(e.target.value)}
            placeholder="@你的名字 / 公众号：xxx"
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, flex: 1, minHeight: 0 }}>
        <div className="tool-col" style={{ flex: 1 }}>
          <label>Markdown 输入</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ flex: 1, fontSize: 13 }}
          />
        </div>
        <div className="tool-col" style={{ flex: 1 }}>
          <label>预览（导出此区域）</label>
          <div style={{ flex: 1, overflow: "auto", background: "#222", borderRadius: 8, padding: 12 }}>
            <div
              ref={previewRef}
              style={{
                background: bgValue,
                color: t.color,
                padding,
                borderRadius: 12,
                fontSize,
                lineHeight: 1.7,
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                maxWidth: 680,
                margin: "0 auto",
              }}
            >
              <div className="md-preview" style={{
                ["--md-accent" as string]: t.accent,
                ["--md-color" as string]: t.color,
              }}>
                <Markdown>{input}</Markdown>
              </div>
              <WatermarkFooter text={watermark} color={t.color} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .md-preview h1 { font-size: 2em; font-weight: 700; margin: 0.5em 0; border-bottom: 2px solid var(--md-accent); padding-bottom: 0.3em; }
        .md-preview h2 { font-size: 1.5em; font-weight: 600; margin: 0.5em 0; color: var(--md-accent); }
        .md-preview h3 { font-size: 1.25em; font-weight: 600; margin: 0.5em 0; }
        .md-preview p { margin: 0.6em 0; }
        .md-preview strong { font-weight: 700; }
        .md-preview em { font-style: italic; }
        .md-preview code { background: rgba(128,128,128,0.15); padding: 2px 6px; border-radius: 4px; font-family: 'SF Mono', 'Fira Code', monospace; font-size: 0.9em; }
        .md-preview pre { background: rgba(0,0,0,0.06); padding: 16px; border-radius: 8px; overflow-x: auto; margin: 0.8em 0; }
        .md-preview pre code { background: none; padding: 0; }
        .md-preview blockquote { border-left: 4px solid var(--md-accent); padding-left: 16px; margin: 0.8em 0; opacity: 0.85; font-style: italic; }
        .md-preview ul, .md-preview ol { padding-left: 1.5em; margin: 0.5em 0; }
        .md-preview li { margin: 0.25em 0; }
        .md-preview table { border-collapse: collapse; width: 100%; margin: 0.8em 0; }
        .md-preview th, .md-preview td { border: 1px solid rgba(128,128,128,0.3); padding: 8px 12px; text-align: left; }
        .md-preview th { background: rgba(128,128,128,0.1); font-weight: 600; }
        .md-preview hr { border: none; border-top: 1px solid rgba(128,128,128,0.3); margin: 1.5em 0; }
        .md-preview a { color: var(--md-accent); text-decoration: none; }
        .md-preview img { max-width: 100%; border-radius: 8px; }
      `}</style>

      <div className="btn-group tool-actions">
        <button className="btn btn-primary" onClick={handleExport} disabled={exporting}>
          {exporting ? "导出中..." : "导出 PNG"}
        </button>
        <button className="btn btn-secondary" onClick={handleCopyImage}>
          复制图片
        </button>
      </div>
    </div>
  );
}
