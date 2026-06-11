import { useState } from "react";

function formatXml(xml: string): string {
  let formatted = "";
  let indent = 0;
  const lines = xml.replace(/>\s*</g, ">\n<").split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("</")) indent--;
    formatted += "  ".repeat(Math.max(0, indent)) + trimmed + "\n";
    if (trimmed.startsWith("<") && !trimmed.startsWith("</") && !trimmed.endsWith("/>") && !trimmed.includes("</")) {
      indent++;
    }
  }
  return formatted.trim();
}

export default function XmlFormatter() {
  const [input, setInput] = useState('<root><item id="1"><name>Test</name><value>100</value></item></root>');
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const format = () => {
    try {
      setOutput(formatXml(input));
      setError("");
    } catch (e: any) {
      setError("XML 解析错误: " + e.message);
    }
  };

  const minify = () => {
    setOutput(input.replace(/>\s+</g, "><").trim());
    setError("");
  };

  return (
    <div className="tool-section">
      <div className="tool-row">
        <div className="tool-col">
          <label>XML 输入</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} />
        </div>
        <div className="tool-col">
          <label>XML 输出</label>
          <div className="result-box">{error ? <span className="error">{error}</span> : output}</div>
        </div>
      </div>
      <div className="btn-group">
        <button className="btn btn-primary" onClick={format}>格式化</button>
        <button className="btn btn-secondary" onClick={minify}>压缩</button>
        <button className="btn btn-secondary" onClick={() => navigator.clipboard.writeText(output)}>复制结果</button>
      </div>
    </div>
  );
}
