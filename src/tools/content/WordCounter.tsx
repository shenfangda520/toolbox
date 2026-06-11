import { useState } from "react";

export default function WordCounter() {
  const [text, setText] = useState("");

  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, "").length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const cnChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const enWords = (text.match(/[a-zA-Z]+/g) || []).length;
  const lines = text ? text.split("\n").length : 0;
  const paragraphs = text.trim() ? text.trim().split(/\n\s*\n/).length : 0;
  const readTimeCn = Math.max(1, Math.ceil(cnChars / 400));
  const readTimeEn = Math.max(1, Math.ceil(enWords / 200));

  return (
    <div className="tool-section">
      <div className="tool-col">
        <label>输入文本</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="粘贴或输入文本..." />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {[
          ["总字符", chars],
          ["字符(不含空格)", charsNoSpace],
          ["单词", words],
          ["中文字符", cnChars],
          ["英文单词", enWords],
          ["行数", lines],
          ["段落", paragraphs],
          ["预计阅读(中文)", `${readTimeCn} 分钟`],
          ["预计阅读(英文)", `${readTimeEn} 分钟`],
        ].map(([label, val]) => (
          <div key={label as string} style={{ background: "var(--bg-card)", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{label}</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "var(--accent)" }}>{val}</div>
          </div>
        ))}
      </div>
      <div className="btn-group tool-actions">
        <button
          className="btn btn-primary"
          disabled={!text}
          onClick={() =>
            navigator.clipboard.writeText(
              `总字符 ${chars} | 不含空格 ${charsNoSpace} | 单词 ${words} | 中文 ${cnChars} | 英文单词 ${enWords} | 行数 ${lines} | 段落 ${paragraphs} | 预计阅读 中文${readTimeCn}分钟/英文${readTimeEn}分钟`
            )
          }
        >
          复制统计结果
        </button>
        <button className="btn btn-secondary" disabled={!text} onClick={() => setText("")}>
          清空
        </button>
      </div>
    </div>
  );
}
