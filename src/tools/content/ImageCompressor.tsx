import { useState } from "react";

export default function ImageCompressor() {
  const [images, setImages] = useState<{ name: string; size: number; compressed: string }[]>([]);
  const [quality, setQuality] = useState(80);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const results: { name: string; size: number; compressed: string }[] = [];

    for (const file of Array.from(files)) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0);
          const blob = await new Promise<Blob>((resolve) =>
            canvas.toBlob((b) => resolve(b!), "image/jpeg", quality / 100)
          );
          const ratio = ((1 - blob.size / file.size) * 100).toFixed(1);
          results.push({
            name: file.name,
            size: file.size,
            compressed: `${(blob.size / 1024).toFixed(1)}KB (-${ratio}%)`,
          });
          setImages([...results]);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="tool-section">
      <div className="tool-col" style={{ flex: "none" }}>
        <label>压缩质量: {quality}%</label>
        <input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} />
      </div>
      <div className="tool-col" style={{ flex: "none" }}>
        <label>选择图片（支持批量）</label>
        <input type="file" accept="image/*" multiple onChange={handleFiles} style={{ padding: "10px", background: "var(--bg-card)", borderRadius: 8, border: "1px solid var(--border)" }} />
      </div>
      {images.length > 0 && (
        <div className="tool-col">
          <label>压缩结果</label>
          <div className="result-box">
            {images.map((img, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid var(--border)" }}>
                <span>{img.name}</span>
                <span className="success">{img.compressed}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
