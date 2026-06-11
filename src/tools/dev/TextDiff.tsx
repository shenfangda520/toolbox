import { useState } from "react";

export default function TextDiff() {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [diffResult, setDiffResult] = useState<React.ReactNode>(null);

  const compare = () => {
    const linesA = textA.split("\n");
    const linesB = textB.split("\n");
    const maxLen = Math.max(linesA.length, linesB.length);
    const result: React.ReactNode[] = [];

    for (let i = 0; i < maxLen; i++) {
      const a = linesA[i];
      const b = linesB[i];
      if (a === undefined) {
        result.push(<div key={i} className="diff-line diff-add">+ {b}</div>);
      } else if (b === undefined) {
        result.push(<div key={i} className="diff-line diff-remove">- {a}</div>);
      } else if (a !== b) {
        result.push(<div key={i} className="diff-line diff-remove">- {a}</div>);
        result.push(<div key={i + "b"} className="diff-line diff-add">+ {b}</div>);
      } else {
        result.push(<div key={i} className="diff-line diff-same">  {a}</div>);
      }
    }
    setDiffResult(result);
  };

  return (
    <div className="tool-section">
      <div className="tool-row">
        <div className="tool-col">
          <label>文本 A</label>
          <textarea value={textA} onChange={(e) => setTextA(e.target.value)} placeholder="原始文本..." />
        </div>
        <div className="tool-col">
          <label>文本 B</label>
          <textarea value={textB} onChange={(e) => setTextB(e.target.value)} placeholder="对比文本..." />
        </div>
      </div>
      <div className="btn-group">
        <button className="btn btn-primary" onClick={compare}>对比</button>
      </div>
      {diffResult && (
        <div className="tool-col">
          <label>差异结果</label>
          <div className="result-box">{diffResult}</div>
        </div>
      )}
    </div>
  );
}
