import { useState } from "react";

export default function WatermarkTool() {
  const [imageUrl, setImageUrl] = useState("");
  const [text, setText] = useState("Watermark");
  const [position, setPosition] = useState<"bottom-right" | "center" | "bottom-left">("bottom-right");
  const [opacity, setOpacity] = useState(30);

  const addWatermark = async () => {
    if (!imageUrl) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);

      ctx.globalAlpha = opacity / 100;
      ctx.fillStyle = "white";
      ctx.font = `bold ${Math.max(24, img.width / 20)}px sans-serif`;
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 4;

      let x = 0, y = 0;
      if (position === "center") { x = img.width / 2; y = img.height / 2; ctx.textAlign = "center"; ctx.textBaseline = "middle"; }
      else if (position === "bottom-right") { x = img.width - 20; y = img.height - 20; ctx.textAlign = "right"; ctx.textBaseline = "bottom"; }
      else { x = 20; y = img.height - 20; ctx.textAlign = "left"; ctx.textBaseline = "bottom"; }

      ctx.fillText(text, x, y);

      const link = document.createElement("a");
      link.download = `watermarked-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = imageUrl;
  };

  return (
    <div className="tool-section">
      <div className="tool-col" style={{ flex: "none" }}>
        <label>图片 URL</label>
        <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.png" />
      </div>
      <div className="tool-row" style={{ flex: "none" }}>
        <div className="tool-col"><label>水印文字</label><input type="text" value={text} onChange={(e) => setText(e.target.value)} /></div>
        <div className="tool-col"><label>位置</label>
          <select value={position} onChange={(e) => setPosition(e.target.value as any)}>
            <option value="bottom-right">右下角</option>
            <option value="center">居中</option>
            <option value="bottom-left">左下角</option>
          </select>
        </div>
        <div className="tool-col"><label>透明度 {opacity}%</label>
          <input type="range" min={5} max={100} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} />
        </div>
      </div>
      <div className="btn-group tool-actions">
        <button className="btn btn-primary" onClick={addWatermark} disabled={!imageUrl}>添加水印并下载</button>
      </div>
    </div>
  );
}
