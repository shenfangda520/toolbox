const STORAGE_KEY = "fangda-toolbox-export-watermark";

export function loadWatermark(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveWatermark(text: string) {
  try {
    localStorage.setItem(STORAGE_KEY, text);
  } catch {
    /* ignore */
  }
}

export function WatermarkFooter({ text, color }: { text: string; color?: string }) {
  if (!text.trim()) return null;
  return (
    <div
      style={{
        marginTop: 20,
        paddingTop: 12,
        borderTop: "1px solid rgba(128, 128, 128, 0.25)",
        textAlign: "center",
        fontSize: 12,
        letterSpacing: 1,
        opacity: 0.55,
        color: color || "inherit",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {text}
    </div>
  );
}
