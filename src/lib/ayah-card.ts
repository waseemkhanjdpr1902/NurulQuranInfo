export function downloadAyahCard({ arabic, translation, reference, filename }: { arabic: string; translation: string; reference: string; filename: string }) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080; canvas.height = 1350;
  const context = canvas.getContext("2d"); if (!context) return;
  context.fillStyle = "#f6f7f1"; context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#167c6b"; context.fillRect(0, 0, canvas.width, 20);
  context.textAlign = "center"; context.direction = "rtl"; context.fillStyle = "#163b36"; context.font = "52px serif";
  drawWrapped(context, arabic, 900, 280, 78, 7);
  context.direction = "ltr"; context.font = "30px sans-serif";
  drawWrapped(context, translation, 860, 740, 46, 8);
  context.fillStyle = "#167c6b"; context.font = "bold 27px sans-serif"; context.fillText(reference, 540, 1185);
  context.font = "24px sans-serif"; context.fillText("NurulQuran.info", 540, 1250);
  canvas.toBlob(blob => {
    if (!blob) return;
    const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = filename; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, "image/png");
}

function drawWrapped(context: CanvasRenderingContext2D, text: string, maxWidth: number, startY: number, lineHeight: number, maxLines: number) {
  const words = text.split(/\s+/); const lines: string[] = []; let line = "";
  for (const word of words) {
    const next = `${line} ${word}`.trim();
    if (line && context.measureText(next).width > maxWidth) { lines.push(line); line = word; } else line = next;
  }
  if (line) lines.push(line);
  lines.slice(0, maxLines).forEach((value, index) => context.fillText(value, 540, startY + index * lineHeight));
}

