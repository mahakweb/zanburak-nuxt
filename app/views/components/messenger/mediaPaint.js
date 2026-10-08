/**
 * Non-destructive photo paint / text / emoji overlays for messenger compose.
 * Layers stay as JSON until export rasters them onto the cropped canvas.
 */

export const PAINT_COLORS = [
  '#ffffff',
  '#000000',
  '#3390ec',
  '#ef4444',
  '#f59e0b',
  '#22c55e',
  '#a855f7',
  '#ec4899',
];

export const PAINT_THICKNESSES = [2, 4, 8, 14, 22];

export const QUICK_EMOJIS = [
  '😀', '😂', '😍', '🔥', '❤️', '👍', '👏', '🎉',
  '😎', '🤔', '😢', '🙏', '⭐', '💯', '✨', '🌹',
];

export function emptyPaintState() {
  return {
    layers: [],
    redo: [],
  };
}

export function clonePaintState(state) {
  const src = state || emptyPaintState();
  return {
    layers: Array.isArray(src.layers) ? src.layers.map((l) => ({ ...l, points: l.points ? l.points.map((p) => ({ ...p })) : undefined })) : [],
    redo: Array.isArray(src.redo) ? src.redo.map((l) => ({ ...l, points: l.points ? l.points.map((p) => ({ ...p })) : undefined })) : [],
  };
}

export function paintHasEdits(state) {
  return Array.isArray(state?.layers) && state.layers.length > 0;
}

export function canUndoPaint(state) {
  return paintHasEdits(state);
}

export function canRedoPaint(state) {
  return Array.isArray(state?.redo) && state.redo.length > 0;
}

export function pushPaintLayer(state, layer) {
  const next = clonePaintState(state);
  next.layers.push(layer);
  next.redo = [];
  return next;
}

export function undoPaint(state) {
  const next = clonePaintState(state);
  if (!next.layers.length) return next;
  next.redo.push(next.layers.pop());
  return next;
}

export function redoPaint(state) {
  const next = clonePaintState(state);
  if (!next.redo.length) return next;
  next.layers.push(next.redo.pop());
  return next;
}

export function clearPaint() {
  return emptyPaintState();
}

/**
 * Draw paint layers onto a canvas (pixel space).
 * Layer coordinates are normalized 0..1 relative to the destination canvas.
 */
export function rasterizePaintLayers(ctx, layers, width, height) {
  if (!ctx || !width || !height || !Array.isArray(layers) || !layers.length) return;
  for (const layer of layers) {
    if (!layer) continue;
    if (layer.type === 'stroke') {
      drawStroke(ctx, layer, width, height);
    } else if (layer.type === 'text') {
      drawText(ctx, layer, width, height);
    } else if (layer.type === 'emoji') {
      drawEmoji(ctx, layer, width, height);
    }
  }
}

function drawStroke(ctx, layer, width, height) {
  const pts = Array.isArray(layer.points) ? layer.points : [];
  if (pts.length < 1) return;
  const isEraser = layer.tool === 'eraser';
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const thickness = Math.max(1, Number(layer.width) || 4);
  // Stroke width is authored against a ~360px reference stage.
  ctx.lineWidth = Math.max(1, (thickness / 360) * Math.min(width, height));
  if (isEraser) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.strokeStyle = 'rgba(0,0,0,1)';
  } else {
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = layer.color || '#ffffff';
  }
  ctx.beginPath();
  ctx.moveTo(pts[0].x * width, pts[0].y * height);
  for (let i = 1; i < pts.length; i += 1) {
    ctx.lineTo(pts[i].x * width, pts[i].y * height);
  }
  if (pts.length === 1) {
    ctx.lineTo(pts[0].x * width + 0.01, pts[0].y * height);
  }
  ctx.stroke();
  ctx.restore();
}

function drawText(ctx, layer, width, height) {
  const text = String(layer.text || '').trim();
  if (!text) return;
  const size = Math.max(12, ((Number(layer.size) || 28) / 360) * Math.min(width, height));
  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = layer.color || '#ffffff';
  ctx.font = `700 ${size}px system-ui, -apple-system, "Segoe UI", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.45)';
  ctx.shadowBlur = size * 0.12;
  ctx.shadowOffsetY = size * 0.04;
  ctx.fillText(text, (Number(layer.x) || 0.5) * width, (Number(layer.y) || 0.5) * height);
  ctx.restore();
}

function drawEmoji(ctx, layer, width, height) {
  const emoji = String(layer.emoji || '');
  if (!emoji) return;
  const size = Math.max(16, ((Number(layer.size) || 48) / 360) * Math.min(width, height));
  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  ctx.font = `${size}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, (Number(layer.x) || 0.5) * width, (Number(layer.y) || 0.5) * height);
  ctx.restore();
}

/**
 * Apply paint on top of an existing canvas; returns a new canvas.
 * Non-destructive source: original canvas is not mutated.
 */
export function applyPaintToCanvas(sourceCanvas, paintState) {
  if (!sourceCanvas) return null;
  const layers = paintState?.layers;
  if (!Array.isArray(layers) || !layers.length) return sourceCanvas;
  const out = document.createElement('canvas');
  out.width = sourceCanvas.width;
  out.height = sourceCanvas.height;
  const ctx = out.getContext('2d');
  ctx.drawImage(sourceCanvas, 0, 0);
  rasterizePaintLayers(ctx, layers, out.width, out.height);
  return out;
}
