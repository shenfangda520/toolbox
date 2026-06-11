import { useState } from "react";

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testStr, setTestStr] = useState("");
  const [matches, setMatches] = useState<string[]>([]);

  const test = () => {
    try {
      const regex = new RegExp(pattern, flags);
      const found: string[] = [];
      let match;
      if (flags.includes("g")) {
        while ((match = regex.exec(testStr)) !== null) {
          found.push(match[0]);
          if (!match.index && match.index !== 0) break;
        }
      } else {
        match = regex.exec(testStr);
        if (match) found.push(match[0]);
      }
      setMatches(found);
    } catch {
      setMatches(["正则表达式语法错误"]);
    }
  };

  return (
    <div className="tool-section">
      <div className="tool-row" style={{ flex: "none" }}>
        <div className="tool-col">
          <label>正则表达式</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="/pattern/" style={{ flex: 1 }} />
            <input type="text" value={flags} onChange={(e) => setFlags(e.target.value)} style={{ width: 60 }} placeholder="flags" />
          </div>
        </div>
      </div>
      <div className="tool-col">
        <label>测试文本</label>
        <textarea value={testStr} onChange={(e) => setTestStr(e.target.value)} placeholder="输入要测试的文本..." />
      </div>
      <div className="btn-group">
        <button className="btn btn-primary" onClick={test}>测试匹配</button>
      </div>
      <div className="tool-col">
        <label>匹配结果 ({matches.length} 个)</label>
        <div className="result-box">
          {matches.length === 0 ? "无匹配" : matches.map((m, i) => (
            <div key={i} className="diff-add" style={{ marginBottom: 4 }}>{m}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
