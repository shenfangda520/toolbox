import { useState } from "react";

export default function HexEditor() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const toHex = () => {
    const bytes = new TextEncoder().encode(input);
    const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, "0").toUpperCase()).join(" ");
    const ascii = Array.from(bytes).map((b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : ".")).join("");
    let result = "";
    for (let i = 0; i < hex.length; i += 48) {
      const offset = (i / 3).toString(16).padStart(8, "0");
      result += `${offset}  ${hex.slice(i, i + 48)}  ${ascii.slice(i / 3, i / 3 + 16)}\n`;
    }
    setOutput(result);
  };

  const fromHex = () => {
    try {
      const hex = input.replace(/\s/g, "").replace(/0x/gi, "");
      const bytes = new Uint8Array(hex.match(/.{1,2}/g)!.map((h) => parseInt(h, 16)));
      setOutput(new TextDecoder().decode(bytes));
    } catch { setOutput("无效的十六进制"); }
  };

  return (
    <div className="tool-section">
      <div className="tool-row">
        <div className="tool-col"><label>输入</label><textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="输入文本或十六进制..." /></div>
        <div className="tool-col"><label>输出</label><div className="result-box" style={{ fontFamily: "monospace", whiteSpace: "pre" }}>{output}</div></div>
      </div>
      <div className="btn-group">
        <button className="btn btn-primary" onClick={toHex}>文本 → HEX</button>
        <button className="btn btn-primary" onClick={fromHex}>HEX → 文本</button>
        <button className="btn btn-secondary" onClick={() => navigator.clipboard.writeText(output)}>复制</button>
      </div>
    </div>
  );
}
