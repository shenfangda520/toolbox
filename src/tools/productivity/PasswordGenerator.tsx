import { useState } from "react";

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");

  const generate = () => {
    let chars = "";
    if (uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (numbers) chars += "0123456789";
    if (symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    if (!chars) { setPassword("请至少选择一种字符类型"); return; }

    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    setPassword(Array.from(arr, (x) => chars[x % chars.length]).join(""));
  };

  return (
    <div className="tool-section">
      <div style={{ display: "flex", gap: 12, alignItems: "end" }}>
        <div className="tool-col" style={{ flex: "none", width: 120 }}>
          <label>长度</label>
          <input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} min={4} max={128} />
        </div>
        <div className="check-row" style={{ paddingBottom: 4 }}>
          <label className="check-item"><input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} /> 大写</label>
          <label className="check-item"><input type="checkbox" checked={lowercase} onChange={(e) => setLowercase(e.target.checked)} /> 小写</label>
          <label className="check-item"><input type="checkbox" checked={numbers} onChange={(e) => setNumbers(e.target.checked)} /> 数字</label>
          <label className="check-item"><input type="checkbox" checked={symbols} onChange={(e) => setSymbols(e.target.checked)} /> 符号</label>
        </div>
        <button className="btn btn-primary" onClick={generate}>生成</button>
      </div>
      <div className="result-box password-output" onClick={() => navigator.clipboard.writeText(password)}>
        {password || "点击生成按钮"}
      </div>
      <button className="btn btn-secondary" onClick={() => navigator.clipboard.writeText(password)}>复制密码</button>
    </div>
  );
}
