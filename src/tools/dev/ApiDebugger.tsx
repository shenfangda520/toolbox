import { useState, useCallback } from "react";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
type BodyType = "none" | "json" | "form" | "raw" | "urlencoded";
type ResponseTab = "body" | "headers" | "cookies";
type BodyView = "pretty" | "raw" | "preview";
type ReqTab = "params" | "headers" | "body" | "auth";

type KV = { key: string; value: string; enabled: boolean };

function emptyKV(): KV { return { key: "", value: "", enabled: true }; }

const methodColors: Record<string, string> = {
  GET: "#4ade80", POST: "#3b82f6", PUT: "#f59e0b", DELETE: "#f87171",
  PATCH: "#a78bfa", HEAD: "#38bdf8", OPTIONS: "#94a3b8",
};

function parseHeaders(raw: string): Record<string, string> {
  try { return JSON.parse(raw); } catch {
    const obj: Record<string, string> = {};
    raw.split("\n").forEach((line) => {
      const idx = line.indexOf(":");
      if (idx > 0) obj[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
    });
    return obj;
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function parseCookies(headers: Headers): { name: string; value: string }[] {
  const setCookie = headers.get("set-cookie");
  if (!setCookie) return [];
  return setCookie.split(",").map((c) => {
    const [pair] = c.split(";");
    const [name, ...rest] = pair.split("=");
    return { name: name.trim(), value: rest.join("=").trim() };
  });
}

export default function ApiDebugger() {
  const [method, setMethod] = useState<Method>("GET");
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/todos/1");
  const [params, setParams] = useState<KV[]>([emptyKV()]);
  const [headers, setHeaders] = useState<KV[]>([
    { key: "Content-Type", value: "application/json", enabled: true },
  ]);
  const [bodyType, setBodyType] = useState<BodyType>("none");
  const [body, setBody] = useState('{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}');
  const [authType, setAuthType] = useState<"none" | "bearer" | "basic">("none");
  const [authToken, setAuthToken] = useState("");
  const [authUser, setAuthUser] = useState("");
  const [authPass, setAuthPass] = useState("");

  const [reqTab, setReqTab] = useState<ReqTab>("params");
  const [resTab, setResTab] = useState<ResponseTab>("body");
  const [bodyView, setBodyView] = useState<BodyView>("pretty");

  const [response, setResponse] = useState("");
  const [resHeaders, setResHeaders] = useState<Record<string, string>>({});
  const [resCookies, setResCookies] = useState<{ name: string; value: string }[]>([]);
  const [status, setStatus] = useState("");
  const [statusCode, setStatusCode] = useState(0);
  const [time, setTime] = useState("");
  const [size, setSize] = useState("");
  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState<{ method: string; url: string; status: string; time: string }[]>([]);

  const updateKV = (list: KV[], setList: (v: KV[]) => void, idx: number, field: "key" | "value", val: string) => {
    const next = [...list];
    next[idx] = { ...next[idx], [field]: val };
    if (idx === next.length - 1 && (next[idx].key || next[idx].value)) next.push(emptyKV());
    setList(next);
  };

  const toggleKV = (list: KV[], setList: (v: KV[]) => void, idx: number) => {
    const next = [...list];
    next[idx] = { ...next[idx], enabled: !next[idx].enabled };
    setList(next);
  };

  const removeKV = (list: KV[], setList: (v: KV[]) => void, idx: number) => {
    setList(list.filter((_, i) => i !== idx));
  };

  const buildUrl = useCallback(() => {
    let full = url;
    const enabledParams = params.filter((p) => p.enabled && p.key);
    if (enabledParams.length) {
      const qs = enabledParams.map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`).join("&");
      full += (full.includes("?") ? "&" : "?") + qs;
    }
    return full;
  }, [url, params]);

  const buildHeaders = useCallback(() => {
    const obj: Record<string, string> = {};
    headers.filter((h) => h.enabled && h.key).forEach((h) => { obj[h.key] = h.value; });
    if (authType === "bearer" && authToken) obj["Authorization"] = `Bearer ${authToken}`;
    if (authType === "basic") obj["Authorization"] = `Basic ${btoa(`${authUser}:${authPass}`)}`;
    return obj;
  }, [headers, authType, authToken, authUser, authPass]);

  const send = async () => {
    setLoading(true);
    setResponse(""); setResHeaders({}); setResCookies([]);
    setStatus(""); setStatusCode(0); setTime(""); setSize("");
    const start = performance.now();
    try {
      const opts: RequestInit = { method, headers: buildHeaders() };
      if (!["GET", "HEAD"].includes(method) && bodyType !== "none") {
        opts.body = bodyType === "json" || bodyType === "raw" ? body : "";
      }
      const res = await fetch(buildUrl(), opts);
      const elapsed = ((performance.now() - start) / 1000).toFixed(2);
      setStatusCode(res.status);
      setStatus(`${res.status} ${res.statusText}`);
      setTime(`${elapsed}s`);

      const rh: Record<string, string> = {};
      res.headers.forEach((v, k) => { rh[k] = v; });
      setResHeaders(rh);
      setResCookies(parseCookies(res.headers));

      const text = await res.text();
      setSize(formatSize(new TextEncoder().encode(text).byteLength));
      try { setResponse(JSON.stringify(JSON.parse(text), null, 2)); } catch { setResponse(text); }

      setHistory((prev) => [{ method, url: buildUrl(), status: `${res.status}`, time: `${elapsed}s` }, ...prev].slice(0, 20));
    } catch (e: any) {
      setStatus("Error");
      setResponse(e.message || "请求失败");
    }
    setLoading(false);
  };

  const TabBtn = ({ active, onClick, children, badge }: { active: boolean; onClick: () => void; children: React.ReactNode; badge?: number }) => (
    <button
      onClick={onClick}
      style={{
        padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: active ? 600 : 400,
        background: active ? "rgba(55,245,197,0.12)" : "transparent",
        color: active ? "var(--accent)" : "var(--text-secondary)",
        transition: "all 0.12s",
      }}
    >
      {children}{badge ? <span style={{ marginLeft: 4, fontSize: 10, background: "var(--accent)", color: "#000", borderRadius: 8, padding: "1px 5px" }}>{badge}</span> : null}
    </button>
  );

  const KVEditor = ({ list, setList, keyPlaceholder, valuePlaceholder }: { list: KV[]; setList: (v: KV[]) => void; keyPlaceholder?: string; valuePlaceholder?: string }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "grid", gridTemplateColumns: "28px 1fr 1fr 32px", gap: 6, fontSize: 11, color: "var(--text-secondary)", padding: "0 4px" }}>
        <span></span><span>Key</span><span>Value</span><span></span>
      </div>
      {list.map((item, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "28px 1fr 1fr 32px", gap: 6, alignItems: "center" }}>
          <input
            type="checkbox" checked={item.enabled}
            onChange={() => toggleKV(list, setList, i)}
            style={{ accentColor: "var(--accent)", margin: 0 }}
          />
          <input
            type="text" value={item.key} placeholder={keyPlaceholder || "Key"}
            onChange={(e) => updateKV(list, setList, i, "key", e.target.value)}
            style={{ opacity: item.enabled ? 1 : 0.4, height: 32, fontSize: 12, padding: "0 8px" }}
          />
          <input
            type="text" value={item.value} placeholder={valuePlaceholder || "Value"}
            onChange={(e) => updateKV(list, setList, i, "value", e.target.value)}
            style={{ opacity: item.enabled ? 1 : 0.4, height: 32, fontSize: 12, padding: "0 8px" }}
          />
          <button
            onClick={() => {
              if (list.length <= 1) setList([emptyKV()]);
              else removeKV(list, setList, i);
            }}
            title="删除此行"
            style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: 14, padding: 4, borderRadius: 4 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--error)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
          >✕</button>
        </div>
      ))}
      <button
        onClick={() => setList([...list, emptyKV()])}
        style={{
          alignSelf: "flex-start", padding: "4px 12px", borderRadius: 6, border: "1px dashed var(--border)",
          background: "transparent", color: "var(--text-secondary)", cursor: "pointer", fontSize: 12,
          transition: "all 0.12s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
      >+ 添加</button>
    </div>
  );

  const enabledParamCount = params.filter((p) => p.enabled && p.key).length;
  const enabledHeaderCount = headers.filter((h) => h.enabled && h.key).length;

  return (
    <div style={{ display: "flex", height: "100%", gap: 0, overflow: "hidden" }}>
      {/* History sidebar */}
      <div style={{ width: 200, borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "8px 12px", fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", borderBottom: "1px solid var(--border)", textTransform: "uppercase", letterSpacing: 0.5 }}>
          History
        </div>
        <div style={{ flex: 1, overflow: "auto" }}>
          {history.length === 0 && <div style={{ padding: 12, fontSize: 12, color: "var(--text-secondary)" }}>暂无记录</div>}
          {history.map((h, i) => (
            <button
              key={i}
              onClick={() => { setMethod(h.method as Method); setUrl(h.url); }}
              style={{
                display: "block", width: "100%", padding: "6px 10px", border: "none", background: "transparent",
                textAlign: "left", cursor: "pointer", fontSize: 11, color: "var(--text-primary)",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <span style={{ color: methodColors[h.method], fontWeight: 700, marginRight: 4 }}>{h.method}</span>
              <span style={{ color: h.status.startsWith("2") ? "var(--success)" : "var(--error)" }}>{h.status}</span>
              <span style={{ color: "var(--text-secondary)", marginLeft: 4 }}>{h.time}</span>
              <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text-secondary)", marginTop: 2 }}>{h.url}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* URL bar */}
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", gap: 8, alignItems: "center" }}>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as Method)}
            style={{
              width: 100, height: 38, fontWeight: 700, fontSize: 13, borderRadius: 8,
              color: methodColors[method], borderColor: methodColors[method] + "44",
            }}
          >
            {(["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"] as const).map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <input
            type="text" value={url} onChange={(e) => setUrl(e.target.value)}
            placeholder="输入请求 URL..."
            style={{ flex: 1, height: 38, fontSize: 13, fontFamily: "monospace" }}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button
            className="btn btn-primary" onClick={send} disabled={loading}
            style={{ padding: "0 24px", height: 38, fontWeight: 600, fontSize: 13 }}
          >
            {loading ? "⏳" : "发送"}
          </button>
        </div>

        {/* Request / Response split */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Request section */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, borderBottom: "1px solid var(--border)" }}>
            {/* Request tabs */}
            <div style={{ display: "flex", gap: 0, padding: "0 12px", borderBottom: "1px solid var(--border)" }}>
              <TabBtn active={reqTab === "params"} onClick={() => setReqTab("params")}>Params{enabledParamCount ? ` (${enabledParamCount})` : ""}</TabBtn>
              <TabBtn active={reqTab === "headers"} onClick={() => setReqTab("headers")}>Headers{enabledHeaderCount ? ` (${enabledHeaderCount})` : ""}</TabBtn>
              <TabBtn active={reqTab === "body"} onClick={() => setReqTab("body")}>Body</TabBtn>
              <TabBtn active={reqTab === "auth"} onClick={() => setReqTab("auth")}>Auth</TabBtn>
            </div>

            {/* Request content */}
            <div style={{ flex: 1, overflow: "auto", padding: 12 }}>
              {reqTab === "params" && <KVEditor list={params} setList={setParams} keyPlaceholder="parameter" valuePlaceholder="value" />}

              {reqTab === "headers" && <KVEditor list={headers} setList={setHeaders} keyPlaceholder="Header-Name" valuePlaceholder="value" />}

              {reqTab === "body" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {(["none", "json", "form", "raw", "urlencoded"] as BodyType[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setBodyType(t)}
                        style={{
                          padding: "4px 10px", borderRadius: 4, border: "1px solid",
                          borderColor: bodyType === t ? "var(--accent)" : "var(--border)",
                          background: bodyType === t ? "rgba(55,245,197,0.1)" : "transparent",
                          color: bodyType === t ? "var(--accent)" : "var(--text-secondary)",
                          cursor: "pointer", fontSize: 11, textTransform: "uppercase",
                        }}
                      >{t}</button>
                    ))}
                  </div>
                  {bodyType !== "none" && (
                    <textarea
                      value={body} onChange={(e) => setBody(e.target.value)}
                      placeholder={bodyType === "json" ? '{\n  "key": "value"\n}' : "请求体内容..."}
                      style={{ flex: 1, minHeight: 140, fontFamily: "monospace", fontSize: 13 }}
                    />
                  )}
                  {bodyType === "none" && (
                    <div style={{ padding: 20, textAlign: "center", color: "var(--text-secondary)", fontSize: 13 }}>
                      该请求没有 body
                    </div>
                  )}
                </div>
              )}

              {reqTab === "auth" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {(["none", "bearer", "basic"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setAuthType(t)}
                        style={{
                          padding: "4px 10px", borderRadius: 4, border: "1px solid",
                          borderColor: authType === t ? "var(--accent)" : "var(--border)",
                          background: authType === t ? "rgba(55,245,197,0.1)" : "transparent",
                          color: authType === t ? "var(--accent)" : "var(--text-secondary)",
                          cursor: "pointer", fontSize: 11, textTransform: "uppercase",
                        }}
                      >{t === "bearer" ? "Bearer Token" : t === "basic" ? "Basic Auth" : "No Auth"}</button>
                    ))}
                  </div>
                  {authType === "bearer" && (
                    <input type="text" value={authToken} onChange={(e) => setAuthToken(e.target.value)} placeholder="Token" style={{ fontFamily: "monospace", fontSize: 12 }} />
                  )}
                  {authType === "basic" && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <input type="text" value={authUser} onChange={(e) => setAuthUser(e.target.value)} placeholder="Username" style={{ flex: 1 }} />
                      <input type="password" value={authPass} onChange={(e) => setAuthPass(e.target.value)} placeholder="Password" style={{ flex: 1 }} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Response section */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
            {/* Response tabs + status bar */}
            <div style={{ display: "flex", alignItems: "center", padding: "0 12px", borderBottom: "1px solid var(--border)" }}>
              <TabBtn active={resTab === "body"} onClick={() => setResTab("body")}>Body</TabBtn>
              <TabBtn active={resTab === "headers"} onClick={() => setResTab("headers")}>Headers{Object.keys(resHeaders).length ? ` (${Object.keys(resHeaders).length})` : ""}</TabBtn>
              <TabBtn active={resTab === "cookies"} onClick={() => setResTab("cookies")}>Cookies{resCookies.length ? ` (${resCookies.length})` : ""}</TabBtn>
              <div style={{ marginLeft: "auto", display: "flex", gap: 12, fontSize: 12, alignItems: "center" }}>
                {statusCode > 0 && (
                  <span style={{
                    fontWeight: 600, padding: "2px 8px", borderRadius: 4,
                    color: statusCode < 300 ? "var(--success)" : statusCode < 400 ? "#f59e0b" : "var(--error)",
                    background: (statusCode < 300 ? "rgba(74,222,128,0.12)" : statusCode < 400 ? "rgba(245,158,11,0.12)" : "rgba(248,113,113,0.12)"),
                  }}>{status}</span>
                )}
                {time && <span style={{ color: "var(--text-secondary)" }}>⏱ {time}</span>}
                {size && <span style={{ color: "var(--text-secondary)" }}>📦 {size}</span>}
              </div>
            </div>

            {/* Response content */}
            <div style={{ flex: 1, overflow: "auto", padding: 12 }}>
              {resTab === "body" && (
                <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                  <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                    {(["pretty", "raw", "preview"] as BodyView[]).map((v) => (
                      <button
                        key={v}
                        onClick={() => setBodyView(v)}
                        style={{
                          padding: "3px 8px", borderRadius: 4, border: "1px solid",
                          borderColor: bodyView === v ? "var(--accent)" : "var(--border)",
                          background: bodyView === v ? "rgba(55,245,197,0.1)" : "transparent",
                          color: bodyView === v ? "var(--accent)" : "var(--text-secondary)",
                          cursor: "pointer", fontSize: 11, textTransform: "uppercase",
                        }}
                      >{v}</button>
                    ))}
                    <button
                      onClick={() => navigator.clipboard.writeText(response)}
                      style={{ marginLeft: "auto", padding: "3px 8px", borderRadius: 4, border: "1px solid var(--border)", background: "transparent", color: "var(--text-secondary)", cursor: "pointer", fontSize: 11 }}
                    >复制</button>
                  </div>
                  <div className="result-box" style={{ flex: 1, whiteSpace: bodyView === "raw" ? "pre" : "pre-wrap", fontFamily: "monospace", fontSize: 12, lineHeight: 1.5 }}>
                    {response || (loading ? "请求中..." : "点击「发送」获取响应")}
                  </div>
                </div>
              )}

              {resTab === "headers" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {Object.keys(resHeaders).length === 0 && <div style={{ color: "var(--text-secondary)", fontSize: 13 }}>暂无响应头</div>}
                  {Object.entries(resHeaders).map(([k, v]) => (
                    <div key={k} style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 8, padding: "4px 8px", borderRadius: 4, fontSize: 12 }}>
                      <span style={{ fontWeight: 600, color: "var(--accent)" }}>{k}</span>
                      <span style={{ fontFamily: "monospace", wordBreak: "break-all" }}>{v}</span>
                    </div>
                  ))}
                </div>
              )}

              {resTab === "cookies" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {resCookies.length === 0 && <div style={{ color: "var(--text-secondary)", fontSize: 13 }}>暂无 Cookies</div>}
                  {resCookies.map((c, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 8, padding: "4px 8px", borderRadius: 4, fontSize: 12 }}>
                      <span style={{ fontWeight: 600, color: "var(--accent)" }}>{c.name}</span>
                      <span style={{ fontFamily: "monospace", wordBreak: "break-all" }}>{c.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
