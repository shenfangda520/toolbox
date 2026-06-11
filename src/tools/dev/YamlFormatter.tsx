import { useState } from "react";

function yamlToJson(yaml: string): string {
  const lines = yaml.split("\n");
  const result: any = {};
  let currentKey = "";
  let currentObj = result;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const indent = line.length - line.trimStart().length;
    const colonIdx = trimmed.indexOf(":");
    if (colonIdx === -1) continue;

    const key = trimmed.slice(0, colonIdx).trim();
    const value = trimmed.slice(colonIdx + 1).trim();

    if (value === "" || value === "|") {
      currentKey = key;
      currentObj[key] = {};
      currentObj = currentObj[key];
    } else if (value.startsWith('"') || value.startsWith("'")) {
      currentObj[key] = value.slice(1, -1);
    } else if (!isNaN(Number(value))) {
      currentObj[key] = Number(value);
    } else if (value === "true") {
      currentObj[key] = true;
    } else if (value === "false") {
      currentObj[key] = false;
    } else if (value === "null") {
      currentObj[key] = null;
    } else {
      currentObj[key] = value;
    }
  }
  return JSON.stringify(result, null, 2);
}

function jsonToYaml(json: string, indent = 0): string {
  const obj = JSON.parse(json);
  const prefix = "  ".repeat(indent);
  let yaml = "";

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      yaml += `${prefix}${key}:\n${jsonToYaml(JSON.stringify(value), indent + 1)}`;
    } else if (Array.isArray(value)) {
      yaml += `${prefix}${key}:\n`;
      for (const item of value) {
        yaml += `${prefix}  - ${typeof item === "object" ? JSON.stringify(item) : item}\n`;
      }
    } else {
      yaml += `${prefix}${key}: ${value}\n`;
    }
  }
  return yaml;
}

export default function YamlFormatter() {
  const [input, setInput] = useState("name: toolbox\nversion: 1.0.0\ntools:\n  - json\n  - base64");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"yaml2json" | "json2yaml">("yaml2json");

  const convert = () => {
    try {
      if (mode === "yaml2json") {
        setOutput(yamlToJson(input));
      } else {
        setOutput(jsonToYaml(input));
      }
      setError("");
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  return (
    <div className="tool-section">
      <div className="btn-group" style={{ flex: "none" }}>
        <button className={`btn ${mode === "yaml2json" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("yaml2json")}>YAML → JSON</button>
        <button className={`btn ${mode === "json2yaml" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("json2yaml")}>JSON → YAML</button>
      </div>
      <div className="tool-row">
        <div className="tool-col">
          <label>{mode === "yaml2json" ? "YAML 输入" : "JSON 输入"}</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} />
        </div>
        <div className="tool-col">
          <label>{mode === "yaml2json" ? "JSON 输出" : "YAML 输出"}</label>
          <div className="result-box">{error ? <span className="error">{error}</span> : output}</div>
        </div>
      </div>
      <div className="btn-group">
        <button className="btn btn-primary" onClick={convert}>转换</button>
        <button className="btn btn-secondary" onClick={() => navigator.clipboard.writeText(output)}>复制结果</button>
      </div>
    </div>
  );
}
