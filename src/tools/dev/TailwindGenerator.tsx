import { useState } from "react";

const tailwindClasses: Record<string, string[]> = {
  display: ["block", "inline-block", "inline", "flex", "inline-flex", "grid", "hidden"],
  flexDir: ["flex-row", "flex-col", "flex-row-reverse", "flex-col-reverse"],
  justify: ["justify-start", "justify-end", "justify-center", "justify-between", "justify-around", "justify-evenly"],
  items: ["items-start", "items-end", "items-center", "items-baseline", "items-stretch"],
  gap: ["gap-0", "gap-1", "gap-2", "gap-3", "gap-4", "gap-6", "gap-8"],
  p: ["p-0", "p-1", "p-2", "p-3", "p-4", "p-5", "p-6", "p-8"],
  m: ["m-0", "m-1", "m-2", "m-3", "m-4", "m-auto"],
  rounded: ["rounded", "rounded-sm", "rounded-md", "rounded-lg", "rounded-xl", "rounded-full"],
  bg: ["bg-white", "bg-black", "bg-gray-100", "bg-gray-900", "bg-blue-500", "bg-red-500", "bg-green-500"],
  text: ["text-xs", "text-sm", "text-base", "text-lg", "text-xl", "text-2xl", "text-3xl"],
  font: ["font-thin", "font-light", "font-normal", "font-medium", "font-semibold", "font-bold"],
  w: ["w-full", "w-1/2", "w-1/3", "w-2/3", "w-auto", "w-screen"],
  h: ["h-full", "h-screen", "h-auto", "h-64", "h-96"],
  shadow: ["shadow", "shadow-sm", "shadow-md", "shadow-lg", "shadow-xl"],
  border: ["border", "border-2", "border-4", "border-dashed", "border-dotted"],
};

export default function TailwindGenerator() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [htmlOutput, setHtmlOutput] = useState("");

  const toggle = (cls: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(cls)) next.delete(cls);
      else next.add(cls);
      return next;
    });
  };

  const classes = Array.from(selected).join(" ");

  const generateHtml = () => {
    setHtmlOutput(`<div class="${classes}">\n  content\n</div>`);
  };

  return (
    <div className="tool-section tool-fill">
      <div className="tool-scroll">
        {Object.entries(tailwindClasses).map(([group, clsList]) => (
          <div key={group}>
            <label>{group}</label>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {clsList.map((cls) => (
                <button
                  key={cls}
                  className={`btn ${selected.has(cls) ? "btn-primary" : "btn-secondary"}`}
                  style={{ fontSize: 11, padding: "4px 8px" }}
                  onClick={() => toggle(cls)}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>
        ))}
        <div className="tool-col">
          <label>生成的类名</label>
          <div className="result-box">{classes || "点击上方类名选择"}</div>
        </div>
      </div>
      <div className="btn-group tool-actions">
        <button className="btn btn-primary" onClick={generateHtml}>生成 HTML</button>
        <button className="btn btn-secondary" onClick={() => navigator.clipboard.writeText(classes)}>复制类名</button>
        {htmlOutput && <button className="btn btn-secondary" onClick={() => navigator.clipboard.writeText(htmlOutput)}>复制 HTML</button>}
      </div>
    </div>
  );
}
