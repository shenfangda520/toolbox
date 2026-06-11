import { useState } from "react";

export default function CsvViewer() {
  const [csv, setCsv] = useState("");
  const [parsed, setParsed] = useState<string[][]>([]);
  const [error, setError] = useState("");

  const parse = () => {
    try {
      const lines = csv.trim().split("\n").map((l) => l.split(",").map((c) => c.trim()));
      setParsed(lines);
      setError("");
    } catch {
      setError("CSV 解析失败");
    }
  };

  return (
    <div className="tool-section">
      <div className="tool-col">
        <label>CSV 数据</label>
        <textarea value={csv} onChange={(e) => setCsv(e.target.value)} placeholder={"name,age,city\n张三,25,北京\n李四,30,上海"} />
      </div>
      <div className="btn-group">
        <button className="btn btn-primary" onClick={parse}>解析</button>
        <button className="btn btn-secondary" onClick={() => { const blob = new Blob([csv], { type: "text/csv" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "data.csv"; a.click(); }}>导出 CSV</button>
      </div>
      {error && <div className="error">{error}</div>}
      {parsed.length > 0 && (
        <div style={{ overflow: "auto", border: "1px solid var(--border)", borderRadius: 8 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>{parsed[0]?.map((h, i) => <th key={i} style={{ background: "var(--bg-card)", padding: "8px 12px", textAlign: "left", borderBottom: "1px solid var(--border)", position: "sticky", top: 0 }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {parsed.slice(1).map((row, ri) => (
                <tr key={ri}>{row.map((cell, ci) => <td key={ci} style={{ padding: "6px 12px", borderBottom: "1px solid var(--border)" }}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
