import { useState } from "react";

export default function BatchRenamer() {
  const [files, setFiles] = useState("");
  const [pattern, setPattern] = useState("{name}");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [result, setResult] = useState("");

  const preview = () => {
    const lines = files.split("\n").filter((l) => l.trim());
    const renamed = lines.map((file, i) => {
      const ext = file.includes(".") ? "." + file.split(".").pop() : "";
      const name = ext ? file.slice(0, -ext.length) : file;
      let newName = name;
      if (find) newName = newName.split(find).join(replace);
      newName = prefix + newName + suffix;
      newName = newName.replace(/\{name\}/g, name).replace(/\{index\}/g, String(i + 1).padStart(3, "0")).replace(/\{ext\}/g, ext);
      return `${file}  →  ${newName}${ext}`;
    });
    setResult(renamed.join("\n"));
  };

  return (
    <div className="tool-section">
      <div className="tool-row">
        <div className="tool-col">
          <label>文件名列表（每行一个）</label>
          <textarea value={files} onChange={(e) => setFiles(e.target.value)} placeholder={"photo1.jpg\nphoto2.jpg\nphoto3.png"} />
        </div>
        <div className="tool-col">
          <label>预览结果</label>
          <div className="result-box" style={{ whiteSpace: "pre-wrap" }}>{result || "输入文件名后点击预览"}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <div className="tool-col" style={{ flex: "none", width: 120 }}><label>前缀</label><input type="text" value={prefix} onChange={(e) => setPrefix(e.target.value)} /></div>
        <div className="tool-col" style={{ flex: "none", width: 120 }}><label>后缀</label><input type="text" value={suffix} onChange={(e) => setSuffix(e.target.value)} /></div>
        <div className="tool-col" style={{ flex: "none", width: 120 }}><label>查找</label><input type="text" value={find} onChange={(e) => setFind(e.target.value)} /></div>
        <div className="tool-col" style={{ flex: "none", width: 120 }}><label>替换</label><input type="text" value={replace} onChange={(e) => setReplace(e.target.value)} /></div>
      </div>
      <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>支持变量: {"{name}"} 原名, {"{index}"} 序号, {"{ext}"} 扩展名</div>
      <div className="btn-group">
        <button className="btn btn-primary" onClick={preview}>预览</button>
        <button className="btn btn-secondary" onClick={() => navigator.clipboard.writeText(result)}>复制结果</button>
      </div>
    </div>
  );
}
