import { useState } from "react";

const scopes = ["feat", "fix", "docs", "style", "refactor", "perf", "test", "build", "ci", "chore", "revert"];

export default function GitCommitGenerator() {
  const [type, setType] = useState("feat");
  const [scope, setScope] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [breaking, setBreaking] = useState("");
  const [result, setResult] = useState("");

  const generate = () => {
    const scopeStr = scope ? `(${scope})` : "";
    const breakingStr = breaking ? `\n\nBREAKING CHANGE: ${breaking}` : "";
    const msg = `${type}${scopeStr}: ${subject}${body ? `\n\n${body}` : ""}${breakingStr}`;
    setResult(msg);
  };

  return (
    <div className="tool-section">
      <div className="tool-row" style={{ flex: "none" }}>
        <div className="tool-col" style={{ flex: "none", width: 140 }}>
          <label>类型</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {scopes.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="tool-col" style={{ flex: "none", width: 140 }}>
          <label>作用域（可选）</label>
          <input type="text" value={scope} onChange={(e) => setScope(e.target.value)} placeholder="e.g. auth" />
        </div>
      </div>
      <div className="tool-col">
        <label>提交描述</label>
        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="add user authentication" />
      </div>
      <div className="tool-col">
        <label>详细说明（可选）</label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="详细描述变更内容..." style={{ minHeight: 80 }} />
      </div>
      <div className="tool-col">
        <label>BREAKING CHANGE（可选）</label>
        <input type="text" value={breaking} onChange={(e) => setBreaking(e.target.value)} placeholder="破坏性变更说明" />
      </div>
      <div className="btn-group">
        <button className="btn btn-primary" onClick={generate}>生成 Commit</button>
        <button className="btn btn-secondary" onClick={() => navigator.clipboard.writeText(result)}>复制</button>
      </div>
      {result && <div className="result-box" style={{ whiteSpace: "pre-wrap" }}>{result}</div>}
    </div>
  );
}
