import { useState } from "react";

export default function RegexReplacer() {
  const [input, setInput] = useState("Hello World 123\nfoo bar 456\nhello world 789");
  const [pattern, setPattern] = useState("\\d+");
  const [replacement, setReplacement] = useState("***");
  const [flags, setFlags] = useState("g");
  const [result, setResult] = useState("");
  const [count, setCount] = useState(0);

  const replace = () => {
    try {
      const regex = new RegExp(pattern, flags);
      const matches = input.match(regex);
      setCount(matches?.length || 0);
      setResult(input.replace(regex, replacement));
    } catch {
      setResult("正则表达式语法错误");
    }
  };

  return (
    <div className="tool-section">
      <div className="tool-row">
        <div className="tool-col"><label>输入文本</label><textarea value={input} onChange={(e) => setInput(e.target.value)} /></div>
        <div className="tool-col"><label>替换结果</label><div className="result-box" style={{ whiteSpace: "pre-wrap" }}>{result || "点击替换"}</div></div>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "end" }}>
        <div className="tool-col" style={{ flex: "none", width: 200 }}><label>正则模式</label><input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} /></div>
        <div className="tool-col" style={{ flex: "none", width: 200 }}><label>替换为</label><input type="text" value={replacement} onChange={(e) => setReplacement(e.target.value)} /></div>
        <div className="tool-col" style={{ flex: "none", width: 60 }}><label>标志</label><input type="text" value={flags} onChange={(e) => setFlags(e.target.value)} /></div>
        <button className="btn btn-primary" onClick={replace}>替换</button>
      </div>
      {count > 0 && <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>替换 {count} 处</div>}
      <button className="btn btn-secondary" onClick={() => navigator.clipboard.writeText(result)}>复制结果</button>
    </div>
  );
}
