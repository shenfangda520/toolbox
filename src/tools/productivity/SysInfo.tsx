import { useState, useEffect } from "react";

export default function SysInfo() {
  const [info, setInfo] = useState<Record<string, string>>({});

  useEffect(() => {
    setInfo({
      "平台": navigator.platform,
      "语言": navigator.language,
      "屏幕分辨率": `${screen.width} × ${screen.height}`,
      "窗口大小": `${window.innerWidth} × ${window.innerHeight}`,
      "像素比": `${window.devicePixelRatio}x`,
      "Cookie": `${navigator.cookieEnabled ? "启用" : "禁用"}`,
      "在线状态": navigator.onLine ? "在线" : "离线",
      "用户代理": navigator.userAgent,
      "时区": Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  }, []);

  return (
    <div className="tool-section">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
        {Object.entries(info).map(([key, val]) => (
          <div key={key} style={{ background: "var(--bg-card)", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 2 }}>{key}</div>
            <div style={{ fontSize: 13, wordBreak: "break-all" }}>{val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
