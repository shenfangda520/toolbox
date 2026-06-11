import { useState } from "react";

export default function LogParser() {
  const [log, setLog] = useState("");
  const [filter, setFilter] = useState("");
  const [level, setLevel] = useState("all");
  const [result, setResult] = useState("");

  const parse = () => {
    const lines = log.split("\n");
    const filtered = lines.filter((line) => {
      if (level !== "all") {
        const upper = line.toUpperCase();
        if (level === "error" && !upper.includes("ERROR")) return false;
        if (level === "warn" && !upper.includes("WARN")) return false;
        if (level === "info" && !upper.includes("INFO")) return false;
      }
      if (filter && !line.toLowerCase().includes(filter.toLowerCase())) return false;
      return true;
    });

    const stats = { total: lines.length, error: 0, warn: 0, info: 0 };
    lines.forEach((l) => {
      const u = l.toUpperCase();
      if (u.includes("ERROR")) stats.error++;
      else if (u.includes("WARN")) stats.warn++;
      else if (u.includes("INFO")) stats.info++;
    });

    let output = `📊 统计: 总${stats.total}条 | ❌ ERROR ${stats.error} | ⚠️ WARN ${stats.warn} | ℹ️ INFO ${stats.info}\n`;
    output += `🔍 过滤后: ${filtered.length}条\n\n`;
    output += filtered.join("\n");
    setResult(output);
  };

  return (
    <div className="tool-section">
      <div className="tool-row">
        <div className="tool-col"><label>日志内容</label><textarea value={log} onChange={(e) => setLog(e.target.value)} placeholder={"2024-01-01 INFO Server started\n2024-01-01 WARN Low memory\n2024-01-01 ERROR Connection failed"} /></div>
        <div className="tool-col"><label>解析结果</label><div className="result-box" style={{ whiteSpace: "pre-wrap" }}>{result || "点击解析"}</div></div>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "end" }}>
        <div className="tool-col" style={{ flex: "none", width: 120 }}><label>级别</label>
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="all">全部</option><option value="error">ERROR</option><option value="warn">WARN</option><option value="info">INFO</option>
          </select>
        </div>
        <div className="tool-col"><label>关键词过滤</label><input type="text" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="搜索关键词..." /></div>
        <button className="btn btn-primary" onClick={parse}>解析</button>
      </div>
    </div>
  );
}
