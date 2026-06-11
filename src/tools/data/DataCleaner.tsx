import { useState } from "react";

export default function DataCleaner() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [stats, setStats] = useState({ before: 0, after: 0, removed: 0 });

  const clean = (action: string) => {
    const lines = input.split("\n");
    let result: string[] = [];

    switch (action) {
      case "trim":
        result = lines.map((l) => l.trim());
        break;
      case "dedup":
        result = [...new Set(lines)];
        break;
      case "empty":
        result = lines.filter((l) => l.trim());
        break;
      case "sort":
        result = [...lines].sort();
        break;
      case "lower":
        result = lines.map((l) => l.toLowerCase());
        break;
      case "upper":
        result = lines.map((l) => l.toUpperCase());
        break;
      case "numOnly":
        result = lines.filter((l) => !isNaN(Number(l)) && l.trim());
        break;
    }
    setOutput(result.join("\n"));
    setStats({ before: lines.length, after: result.length, removed: lines.length - result.length });
  };

  return (
    <div className="tool-section">
      <div className="tool-row">
        <div className="tool-col"><label>输入数据</label><textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={"hello\nworld\nhello\ntest\n  spaces  \n\n"} /></div>
        <div className="tool-col"><label>清理结果</label><div className="result-box" style={{ whiteSpace: "pre-wrap" }}>{output}</div></div>
      </div>
      <div className="btn-group">
        <button className="btn btn-secondary" onClick={() => clean("trim")}>去除空格</button>
        <button className="btn btn-secondary" onClick={() => clean("dedup")}>去重</button>
        <button className="btn btn-secondary" onClick={() => clean("empty")}>删除空行</button>
        <button className="btn btn-secondary" onClick={() => clean("sort")}>排序</button>
        <button className="btn btn-secondary" onClick={() => clean("lower")}>转小写</button>
        <button className="btn btn-secondary" onClick={() => clean("upper")}>转大写</button>
        <button className="btn btn-secondary" onClick={() => clean("numOnly")}>只保留数字行</button>
      </div>
      {stats.before > 0 && <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>原始 {stats.before} 行 → 清理后 {stats.after} 行 (删除 {stats.removed} 行)</div>}
      <button className="btn btn-secondary" onClick={() => navigator.clipboard.writeText(output)}>复制结果</button>
    </div>
  );
}
