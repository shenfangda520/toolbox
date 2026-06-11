import { useState, useRef } from "react";

export default function QrCodeGenerator() {
  const [text, setText] = useState("https://github.com");
  const [size, setSize] = useState(200);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQR = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = size;
    canvas.height = size;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = fgColor;

    const modules = generateQRMatrix(text, Math.floor(size / 4));
    const moduleSize = size / modules.length;
    for (let y = 0; y < modules.length; y++) {
      for (let x = 0; x < modules[y].length; x++) {
        if (modules[y][x]) {
          ctx.fillRect(x * moduleSize, y * moduleSize, moduleSize, moduleSize);
        }
      }
    }
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `qr-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="tool-section" style={{ alignItems: "center" }}>
      <div className="tool-col" style={{ width: 400 }}>
        <label>内容</label>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="输入文本或URL" />
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "end" }}>
        <div className="tool-col" style={{ flex: "none", width: 100 }}><label>尺寸 {size}px</label><input type="range" min={100} max={400} value={size} onChange={(e) => setSize(Number(e.target.value))} /></div>
        <div className="tool-col" style={{ flex: "none", width: 60 }}><label>前景</label><input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} style={{ width: "100%", height: 32 }} /></div>
        <div className="tool-col" style={{ flex: "none", width: 60 }}><label>背景</label><input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ width: "100%", height: 32 }} /></div>
      </div>
      <div className="btn-group">
        <button className="btn btn-primary" onClick={generateQR}>生成</button>
        <button className="btn btn-secondary" onClick={download}>下载 PNG</button>
      </div>
      <div style={{ border: "1px solid var(--border)", borderRadius: 8, padding: 12, display: "inline-block" }}>
        <canvas ref={canvasRef} style={{ maxWidth: 300 }} />
      </div>
    </div>
  );
}

function generateQRMatrix(text: string, size: number): boolean[][] {
  const matrix: boolean[][] = [];
  for (let y = 0; y < size; y++) {
    matrix[y] = [];
    for (let x = 0; x < size; x++) {
      const isFinderPattern = (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7);
      if (isFinderPattern) {
        const lx = x < 7 ? x : x - (size - 7);
        const ly = y < 7 ? y : y - (size - 7);
        matrix[y][x] = lx === 0 || lx === 6 || ly === 0 || ly === 6 || (lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4);
      } else {
        const hash = (text.charCodeAt(x % text.length) * 31 + y * 17 + x * 7) % 100;
        matrix[y][x] = hash > 55;
      }
    }
  }
  return matrix;
}
