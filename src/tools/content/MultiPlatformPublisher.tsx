import { useMemo, useRef, useState } from "react";
import Markdown from "react-markdown";
import { toPng } from "html-to-image";
import { loadAiSettings, runAiCompletion } from "../../lib/ai";
import { loadWatermark, saveWatermark, WatermarkFooter } from "../../lib/watermark";

type Platform = "wechat" | "x" | "weibo" | "xhs";

const platformMeta: Record<Platform, { name: string; hint: string }> = {
  wechat: { name: "公众号", hint: "长文排版，可复制富文本直接粘贴进编辑器" },
  x: { name: "X / Twitter", hint: "推文串，每条 ≤280 字符，用 --- 分隔" },
  weibo: { name: "微博", hint: "长微博文案，带话题标签" },
  xhs: { name: "小红书", hint: "emoji 排版 + 标签，适合配卡片图" },
};

const MARKERS: Record<Platform, string> = {
  wechat: "===WECHAT===",
  x: "===X===",
  weibo: "===WEIBO===",
  xhs: "===XHS===",
};

const systemPrompt = `你是资深新媒体编辑。用户给你一篇 Markdown 草稿，你要把它丰富、润色并改写成 4 个平台的可直接发布版本。

要求：
1. 公众号：完整长文，Markdown 格式。结构清晰（引言、小标题、总结），保留原文所有关键信息并适当丰富，结尾加免责/引导关注。
2. X/Twitter：推文串，每条不超过 280 字符，条与条之间用单独一行 "---" 分隔，第一条要有钩子，最后一条总结+引导转发。
3. 微博：一条长微博纯文本，适当用 emoji 分点，结尾带 3-5 个 #话题# 标签。
4. 小红书：口语化、emoji 丰富的正文 + 结尾 8-10 个 #标签，开头要有吸引人的钩子。

输出格式（严格遵守，不要输出其他内容）：
${MARKERS.wechat}
（公众号内容）
${MARKERS.x}
（推文串）
${MARKERS.weibo}
（微博内容）
${MARKERS.xhs}
（小红书内容）`;

function parseAiOutput(raw: string): Record<Platform, string> | null {
  const order: Platform[] = ["wechat", "x", "weibo", "xhs"];
  const result = {} as Record<Platform, string>;
  for (let i = 0; i < order.length; i++) {
    const start = raw.indexOf(MARKERS[order[i]]);
    if (start === -1) return null;
    const from = start + MARKERS[order[i]].length;
    const end = i + 1 < order.length ? raw.indexOf(MARKERS[order[i + 1]]) : raw.length;
    result[order[i]] = raw.slice(from, end === -1 ? raw.length : end).trim();
  }
  return result;
}

function stripMd(md: string) {
  return md
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/^>\s?/gm, "")
    .replace(/^[-*]\s+/gm, "• ")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// 无 AI Key 时的本地降级转换：不丰富内容，只做格式适配
function localConvert(md: string): Record<Platform, string> {
  const plain = stripMd(md);
  const paras = plain.split(/\n\n+/).filter((p) => p.trim());
  const tweets: string[] = [];
  let buf = "";
  for (const p of paras) {
    if ((buf + "\n\n" + p).length > 260) {
      if (buf) tweets.push(buf.trim());
      buf = p.length > 260 ? p.slice(0, 257) + "…" : p;
    } else {
      buf = buf ? buf + "\n\n" + p : p;
    }
  }
  if (buf) tweets.push(buf.trim());
  return {
    wechat: md,
    x: tweets.map((t, i) => `${i + 1}/\n${t}`).join("\n---\n"),
    weibo: plain.length > 1900 ? plain.slice(0, 1900) + "…" : plain,
    xhs: plain.length > 950 ? plain.slice(0, 950) + "…" : plain,
  };
}

export default function MultiPlatformPublisher() {
  const [input, setInput] = useState("");
  const [outputs, setOutputs] = useState<Record<Platform, string> | null>(null);
  const [active, setActive] = useState<Platform>("wechat");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [exporting, setExporting] = useState(false);
  const [watermark, setWatermark] = useState(loadWatermark);
  const previewRef = useRef<HTMLDivElement>(null);

  const updateWatermark = (v: string) => {
    setWatermark(v);
    saveWatermark(v);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 1800);
  };

  const handleGenerate = async () => {
    if (!input.trim()) {
      setError("请先粘贴 Markdown 内容。");
      return;
    }
    setError("");
    const settings = loadAiSettings();
    if (!settings.apiKey.trim()) {
      setOutputs(localConvert(input));
      showToast("未设置 AI Key，已用本地格式转换（未丰富内容）");
      return;
    }
    setLoading(true);
    try {
      const raw = await runAiCompletion(settings, [
        { role: "system", content: systemPrompt },
        { role: "user", content: input },
      ]);
      const parsed = parseAiOutput(raw);
      if (!parsed) throw new Error("AI 输出格式异常，请重试。");
      setOutputs(parsed);
      showToast("已生成 4 个平台版本 ✓");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
    setLoading(false);
  };

  const xTweets = useMemo(() => {
    if (!outputs) return [];
    return outputs.x
      .split(/\n-{3,}\n/)
      .map((t) => t.trim())
      .filter(Boolean);
  }, [outputs]);

  const handleCopyText = async () => {
    if (!outputs) return;
    await navigator.clipboard.writeText(outputs[active]);
    showToast("文案已复制 ✓");
  };

  const handleCopyRich = async () => {
    if (!previewRef.current) return;
    const range = document.createRange();
    range.selectNodeContents(previewRef.current);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    document.execCommand("copy");
    sel?.removeAllRanges();
    showToast("富文本已复制，可直接粘贴进编辑器 ✓");
  };

  const handleExport = async () => {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(previewRef.current, { pixelRatio: 2, backgroundColor: "#ffffff" });
      const link = document.createElement("a");
      link.download = `${platformMeta[active].name}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      showToast("图片已导出 ✓");
    } catch (e) {
      setError("导出失败：" + (e instanceof Error ? e.message : String(e)));
    }
    setExporting(false);
  };

  const handleCopyImage = async () => {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(previewRef.current, { pixelRatio: 2, backgroundColor: "#ffffff" });
      const blob = await (await fetch(dataUrl)).blob();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      showToast("图片已复制到剪贴板 ✓");
    } catch (e) {
      setError("复制图片失败：" + (e instanceof Error ? e.message : String(e)));
    }
    setExporting(false);
  };

  return (
    <div className="tool-section tool-fill" style={{ gap: 12 }}>
      <div style={{ display: "flex", gap: 12, flex: 1, minHeight: 0 }}>
        <div className="tool-col" style={{ flex: 1, minWidth: 0 }}>
          <label>Markdown 草稿（粘贴后点「生成」）</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="# 粘贴你的 Markdown 文章…"
            style={{ flex: 1, fontSize: 13 }}
          />
          <div className="btn-group" style={{ marginTop: 8 }}>
            <button className="btn btn-primary" onClick={handleGenerate} disabled={loading}>
              {loading ? "AI 生成中…" : "✨ AI 丰富并生成 4 平台版本"}
            </button>
          </div>
          <div style={{ marginTop: 8 }}>
            <label>导出图片底部水印（留空不显示）</label>
            <input
              type="text"
              value={watermark}
              onChange={(e) => updateWatermark(e.target.value)}
              placeholder="@你的名字 / 公众号：xxx"
            />
          </div>
          {error && <div style={{ color: "#ff6b6b", fontSize: 12, marginTop: 6, whiteSpace: "pre-wrap" }}>{error}</div>}
        </div>

        <div className="tool-col" style={{ flex: 1.2, minWidth: 0 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
            {(Object.keys(platformMeta) as Platform[]).map((p) => (
              <button
                key={p}
                className={active === p ? "btn btn-primary" : "btn btn-secondary"}
                style={{ padding: "4px 12px", fontSize: 12 }}
                onClick={() => setActive(p)}
              >
                {platformMeta[p].name}
              </button>
            ))}
          </div>
          <label>{platformMeta[active].hint}</label>
          <div style={{ flex: 1, overflow: "auto", background: "#222", borderRadius: 8, padding: 12 }}>
            {!outputs ? (
              <div style={{ color: "#888", fontSize: 13, padding: 20, textAlign: "center" }}>
                生成后在这里预览各平台版本
              </div>
            ) : active === "x" ? (
              <div ref={previewRef} style={{ display: "flex", flexDirection: "column", gap: 10, background: "#fff", borderRadius: 12, padding: 16 }}>
                {xTweets.map((t, i) => (
                  <div key={i} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: "12px 14px", background: "#fff" }}>
                    <div style={{ fontSize: 11, color: t.length > 280 ? "#dc2626" : "#9ca3af", fontWeight: 700, marginBottom: 4 }}>
                      {i + 1}/{xTweets.length} · {t.length} 字符{t.length > 280 ? "（超限！）" : ""}
                    </div>
                    <div style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.6, color: "#1a1a1a" }}>{t}</div>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: "2px 10px", fontSize: 11, marginTop: 8 }}
                      onClick={async () => {
                        await navigator.clipboard.writeText(t);
                        showToast(`第 ${i + 1} 条已复制 ✓`);
                      }}
                    >
                      复制这条
                    </button>
                  </div>
                ))}
                <WatermarkFooter text={watermark} color="#1a1a1a" />
              </div>
            ) : active === "wechat" ? (
              <div
                ref={previewRef}
                className="mpp-wechat"
                style={{ background: "#fff", color: "#1a1a1a", borderRadius: 12, padding: 28, fontSize: 15, lineHeight: 1.8, maxWidth: 680, margin: "0 auto" }}
              >
                <Markdown>{outputs.wechat}</Markdown>
                <WatermarkFooter text={watermark} />
              </div>
            ) : (
              <div
                ref={previewRef}
                style={{ background: "#fff", color: "#1a1a1a", borderRadius: 12, padding: 24, fontSize: 14.5, lineHeight: 1.8, whiteSpace: "pre-wrap", maxWidth: 640, margin: "0 auto" }}
              >
                {outputs[active]}
                <WatermarkFooter text={watermark} />
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .mpp-wechat h1 { font-size: 1.4em; font-weight: 700; margin: 0.6em 0; line-height: 1.5; }
        .mpp-wechat h2 { font-size: 1.15em; font-weight: 600; margin: 1.2em 0 0.5em; padding-left: 10px; border-left: 4px solid #2563eb; }
        .mpp-wechat h3 { font-size: 1.05em; font-weight: 600; margin: 1em 0 0.4em; color: #2563eb; }
        .mpp-wechat p { margin: 0.6em 0; }
        .mpp-wechat blockquote { background: #f3f4f6; border-left: 3px solid #9ca3af; padding: 8px 12px; margin: 0.8em 0; font-size: 0.92em; color: #4b5563; border-radius: 0 8px 8px 0; }
        .mpp-wechat ul, .mpp-wechat ol { padding-left: 1.5em; margin: 0.5em 0; }
        .mpp-wechat li { margin: 0.3em 0; }
        .mpp-wechat table { border-collapse: collapse; width: 100%; margin: 0.8em 0; font-size: 0.9em; }
        .mpp-wechat th, .mpp-wechat td { border: 1px solid #e5e7eb; padding: 6px 10px; text-align: left; }
        .mpp-wechat th { background: #f9fafb; }
        .mpp-wechat hr { border: none; border-top: 1px solid #e5e7eb; margin: 1.2em 0; }
        .mpp-wechat strong { font-weight: 700; }
      `}</style>

      <div className="btn-group tool-actions" style={{ alignItems: "center" }}>
        <button className="btn btn-primary" onClick={handleCopyText} disabled={!outputs}>
          📋 复制文案
        </button>
        {active === "wechat" && (
          <button className="btn btn-secondary" onClick={handleCopyRich} disabled={!outputs}>
            📄 复制富文本
          </button>
        )}
        <button className="btn btn-secondary" onClick={handleExport} disabled={!outputs || exporting}>
          {exporting ? "处理中…" : "🖼 导出 PNG"}
        </button>
        <button className="btn btn-secondary" onClick={handleCopyImage} disabled={!outputs || exporting}>
          复制图片
        </button>
        {toast && <span style={{ fontSize: 12, color: "#7CFFB2" }}>{toast}</span>}
      </div>
    </div>
  );
}
