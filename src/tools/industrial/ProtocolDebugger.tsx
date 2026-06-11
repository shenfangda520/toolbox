import { useState } from "react";

const protocols = ["TCP Client", "UDP Client"];

export default function ProtocolDebugger() {
  const [protocol, setProtocol] = useState("TCP Client");
  const [host, setHost] = useState("127.0.0.1");
  const [port, setPort] = useState("502");
  const [sendData, setSendData] = useState("");
  const [log, setLog] = useState("");
  const [connected, setConnected] = useState(false);

  const simulateConnect = () => {
    setConnected(true);
    setLog((prev) => prev + `[${new Date().toLocaleTimeString()}] 模拟连接到 ${host}:${port}\n`);
  };

  const simulateSend = () => {
    if (!connected) { setLog((p) => p + `[${new Date().toLocaleTimeString()}] 未连接\n`); return; }
    setLog((prev) => prev + `[${new Date().toLocaleTimeString()}] → ${sendData}\n`);
    setTimeout(() => {
      setLog((prev) => prev + `[${new Date().toLocaleTimeString()}] ← 响应数据 (模拟)\n`);
    }, 100);
  };

  return (
    <div className="tool-section">
      <div style={{ display: "flex", gap: 8, alignItems: "end" }}>
        <div className="tool-col" style={{ flex: "none", width: 120 }}><label>协议</label>
          <select value={protocol} onChange={(e) => setProtocol(e.target.value)}>
            {protocols.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div className="tool-col" style={{ flex: "none", width: 160 }}><label>主机</label><input type="text" value={host} onChange={(e) => setHost(e.target.value)} /></div>
        <div className="tool-col" style={{ flex: "none", width: 80 }}><label>端口</label><input type="text" value={port} onChange={(e) => setPort(e.target.value)} /></div>
        <button className={`btn ${connected ? "btn-secondary" : "btn-primary"}`} onClick={simulateConnect}>
          {connected ? "断开" : "连接"}
        </button>
      </div>
      <div className="tool-col">
        <label>发送数据</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input type="text" value={sendData} onChange={(e) => setSendData(e.target.value)} placeholder="输入数据..." style={{ flex: 1 }} />
          <button className="btn btn-primary" onClick={simulateSend} disabled={!connected}>发送</button>
        </div>
      </div>
      <div className="tool-col">
        <label>通信日志 <span style={{ color: connected ? "var(--success)" : "var(--error)" }}>{connected ? "● 已连接" : "○ 未连接"}</span></label>
        <div className="result-box" style={{ fontFamily: "monospace", whiteSpace: "pre", maxHeight: 200 }}>{log || "等待连接..."}</div>
      </div>
    </div>
  );
}
