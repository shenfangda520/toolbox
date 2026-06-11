import { useState } from "react";

export default function JwtParser() {
  const [token, setToken] = useState("");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");

  const parse = () => {
    try {
      const parts = token.split(".");
      if (parts.length < 2) throw new Error("无效的 JWT 格式");
      setHeader(JSON.stringify(JSON.parse(atob(parts[0].replace(/-/g, "+").replace(/_/g, "/"))), null, 2));
      setPayload(JSON.stringify(JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))), null, 2));
    } catch (e: any) {
      setHeader("解析失败: " + e.message);
      setPayload("");
    }
  };

  return (
    <div className="tool-section">
      <div className="tool-col">
        <label>JWT Token</label>
        <textarea value={token} onChange={(e) => setToken(e.target.value)} placeholder="eyJhbGciOiJIUzI1NiIs..." style={{ minHeight: 60 }} />
      </div>
      <div className="btn-group">
        <button className="btn btn-primary" onClick={parse}>解析</button>
      </div>
      <div className="tool-row">
        <div className="tool-col">
          <label>Header</label>
          <div className="result-box">{header}</div>
        </div>
        <div className="tool-col">
          <label>Payload</label>
          <div className="result-box">{payload}</div>
        </div>
      </div>
    </div>
  );
}
