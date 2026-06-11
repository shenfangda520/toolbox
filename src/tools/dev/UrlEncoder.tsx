import { useState } from "react";

export default function UrlEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const encode = () => setOutput(encodeURIComponent(input));
  const decode = () => {
    try {
      setOutput(decodeURIComponent(input));
    } catch {
      setOutput("解码失败");
    }
  };

  return (
    <div className="tool-section">
      <div className="tool-row">
        <div className="tool-col">
          <label>输入</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="https://example.com/path?q=你好" />
        </div>
        <div className="tool-col">
          <label>输出</label>
          <div className="result-box">{output}</div>
        </div>
      </div>
      <div className="btn-group">
        <button className="btn btn-primary" onClick={encode}>编码</button>
        <button className="btn btn-primary" onClick={decode}>解码</button>
        <button className="btn btn-secondary" onClick={() => navigator.clipboard.writeText(output)}>复制结果</button>
      </div>
    </div>
  );
}
