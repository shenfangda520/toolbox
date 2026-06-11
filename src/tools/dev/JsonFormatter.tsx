import { useState } from "react";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const format = (indent: boolean) => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent ? 2 : undefined));
      setError("");
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  const minify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  return (
    <div className="tool-section">
      <div className="tool-row">
        <div className="tool-col">
          <label>输入 JSON</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value"}'
          />
        </div>
        <div className="tool-col">
          <label>输出</label>
          <div className="result-box">{error ? <span className="error">{error}</span> : output}</div>
        </div>
      </div>
      <div className="btn-group">
        <button className="btn btn-primary" onClick={() => format(true)}>格式化</button>
        <button className="btn btn-secondary" onClick={minify}>压缩</button>
        <button className="btn btn-secondary" onClick={() => { navigator.clipboard.writeText(output); }}>复制结果</button>
      </div>
    </div>
  );
}
