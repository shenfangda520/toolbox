import { useState } from "react";

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function md5(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("MD5", msgBuffer).catch(() => null);
  if (!hashBuffer) return "浏览器不支持 MD5";
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [sha256Hash, setSha256] = useState("");
  const [md5Hash, setMd5] = useState("");

  const generate = async () => {
    setSha256(await sha256(input));
    setMd5(await md5(input));
  };

  return (
    <div className="tool-section">
      <div className="tool-col">
        <label>输入文本</label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="输入要哈希的文本..." />
      </div>
      <div className="btn-group">
        <button className="btn btn-primary" onClick={generate}>生成哈希</button>
      </div>
      <div className="tool-col">
        <label>SHA-256</label>
        <div className="result-box" onClick={() => navigator.clipboard.writeText(sha256Hash)} style={{ cursor: "pointer" }}>
          {sha256Hash || "点击生成按钮"}
        </div>
      </div>
      <div className="tool-col">
        <label>MD5</label>
        <div className="result-box" onClick={() => navigator.clipboard.writeText(md5Hash)} style={{ cursor: "pointer" }}>
          {md5Hash || "点击生成按钮"}
        </div>
      </div>
    </div>
  );
}
