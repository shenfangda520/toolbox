import { useState, useEffect, useRef } from "react";

export default function PlcSimulator() {
  const [db, setDb] = useState([
    { address: "DB1.DBD0", name: "温度", value: 25.5, unit: "°C", type: "float" },
    { address: "DB1.DBD4", name: "压力", value: 1.2, unit: "bar", type: "float" },
    { address: "DB1.DBD8", name: "流量", value: 120.0, unit: "m³/h", type: "float" },
    { address: "DB1.DBX0.0", name: "泵运行", value: 1, unit: "", type: "bool" },
    { address: "DB1.DBX0.1", name: "阀门状态", value: 0, unit: "", type: "bool" },
  ]);
  const [log, setLog] = useState("");
  const intervalRef = useRef<number | null>(null);

  const simulate = () => {
    setDb((prev) =>
      prev.map((item) => {
        if (item.type === "float") {
          const delta = (Math.random() - 0.5) * (item.name === "温度" ? 2 : 0.1);
          return { ...item, value: Math.round((item.value + delta) * 100) / 100 };
        }
        return item;
      })
    );
    setLog((p) => `[${new Date().toLocaleTimeString()}] 数据更新\n`);
  };

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const toggleSim = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setLog((p) => p + `[${new Date().toLocaleTimeString()}] 模拟停止\n`);
    } else {
      intervalRef.current = window.setInterval(simulate, 1000);
      setLog((p) => p + `[${new Date().toLocaleTimeString()}] 模拟启动 (1Hz)\n`);
    }
  };

  return (
    <div className="tool-section">
      <div className="btn-group" style={{ flex: "none" }}>
        <button className={`btn ${intervalRef.current ? "btn-secondary" : "btn-primary"}`} onClick={toggleSim}>
          {intervalRef.current ? "⏹ 停止模拟" : "▶ 启动模拟"}
        </button>
        <button className="btn btn-secondary" onClick={simulate} disabled={!!intervalRef.current}>单次刷新</button>
      </div>
      <div style={{ overflow: "auto", border: "1px solid var(--border)", borderRadius: 8 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr>{["地址", "名称", "值", "单位", "类型"].map((h) => <th key={h} style={{ background: "var(--bg-card)", padding: "8px 12px", textAlign: "left" }}>{h}</th>)}</tr></thead>
          <tbody>
            {db.map((item, i) => (
              <tr key={i}>
                <td style={{ padding: "6px 12px", fontFamily: "monospace" }}>{item.address}</td>
                <td style={{ padding: "6px 12px" }}>{item.name}</td>
                <td style={{ padding: "6px 12px", color: "var(--accent)", fontWeight: 600 }}>
                  {item.type === "bool" ? (item.value ? "TRUE" : "FALSE") : item.value}
                </td>
                <td style={{ padding: "6px 12px" }}>{item.unit}</td>
                <td style={{ padding: "6px 12px", color: "var(--text-secondary)" }}>{item.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="tool-col">
        <label>模拟日志</label>
        <div className="result-box" style={{ fontFamily: "monospace", whiteSpace: "pre", maxHeight: 100 }}>{log}</div>
      </div>
    </div>
  );
}
