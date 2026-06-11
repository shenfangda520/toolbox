import { useState } from "react";

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000).toString());
  const [dateStr, setDateStr] = useState(new Date().toISOString().slice(0, 19));
  const [result, setResult] = useState("");

  const tsToDate = () => {
    const ts = Number(timestamp);
    const ms = ts > 1e12 ? ts : ts * 1000;
    const d = new Date(ms);
    setResult(d.toLocaleString("zh-CN") + "\n" + d.toISOString());
  };

  const dateToTs = () => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      setResult("无效日期");
      return;
    }
    setResult(`秒: ${Math.floor(d.getTime() / 1000)}\n毫秒: ${d.getTime()}`);
  };

  const now = () => {
    const n = Math.floor(Date.now() / 1000);
    setTimestamp(n.toString());
    setResult(`当前时间戳: ${n}\n${new Date().toLocaleString("zh-CN")}`);
  };

  return (
    <div className="tool-section">
      <div className="tool-row">
        <div className="tool-col">
          <label>时间戳 → 日期</label>
          <input type="text" value={timestamp} onChange={(e) => setTimestamp(e.target.value)} placeholder="1700000000" />
          <button className="btn btn-primary" onClick={tsToDate}>转换</button>
        </div>
        <div className="tool-col">
          <label>日期 → 时间戳</label>
          <input type="text" value={dateStr} onChange={(e) => setDateStr(e.target.value)} placeholder="2024-01-01T00:00:00" />
          <button className="btn btn-primary" onClick={dateToTs}>转换</button>
        </div>
      </div>
      <button className="btn btn-secondary" onClick={now}>获取当前时间戳</button>
      <div className="tool-col">
        <label>结果</label>
        <div className="result-box">{result}</div>
      </div>
    </div>
  );
}
