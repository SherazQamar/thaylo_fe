/**
 * LiveAvatar client-side green-screen keying (official docs pattern).
 * https://docs.liveavatar.com/docs/guides/change-background
 */

export type ChromaKeyOptions = {
  minHue?: number;
  maxHue?: number;
  minSaturation?: number;
  threshold?: number;
  /** Cap processing width for CPU (docs: 640–854 for mobile/low-end). */
  maxWidth?: number;
};

const DEFAULTS: Required<ChromaKeyOptions> = {
  minHue: 70,
  maxHue: 170,
  minSaturation: 0.18,
  threshold: 1.05,
  maxWidth: 640,
};

export function applyChromaKey(
  sourceVideo: HTMLVideoElement,
  targetCanvas: HTMLCanvasElement,
  options: ChromaKeyOptions = {},
): void {
  const opts = { ...DEFAULTS, ...options };
  const ctx = targetCanvas.getContext("2d", {
    willReadFrequently: true,
    alpha: true,
  });

  if (!ctx || sourceVideo.readyState < 2) return;

  const vw = sourceVideo.videoWidth;
  const vh = sourceVideo.videoHeight;
  if (!vw || !vh) return;

  const scale = Math.min(1, opts.maxWidth / vw);
  const tw = Math.max(1, Math.round(vw * scale));
  const th = Math.max(1, Math.round(vh * scale));

  if (targetCanvas.width !== tw || targetCanvas.height !== th) {
    targetCanvas.width = tw;
    targetCanvas.height = th;
  }

  ctx.clearRect(0, 0, tw, th);
  ctx.drawImage(sourceVideo, 0, 0, tw, th);

  const imageData = ctx.getImageData(0, 0, tw, th);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]!;
    const g = data[i + 1]!;
    const b = data[i + 2]!;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    if (delta === 0) {
      h = 0;
    } else if (max === r) {
      h = ((g - b) / delta) % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;

    const s = max === 0 ? 0 : delta / max;
    const v = max / 255;

    const isGreen =
      h >= opts.minHue &&
      h <= opts.maxHue &&
      s > opts.minSaturation &&
      v > 0.15 &&
      g > r * opts.threshold &&
      g > b * opts.threshold;

    if (isGreen) {
      const greenness = (g - Math.max(r, b)) / (g || 1);
      const alphaValue = Math.max(0, 1 - greenness * 4);
      data[i + 3] = alphaValue < 0.2 ? 0 : Math.round(alphaValue * 255);
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Continuous chroma loop. Call cleanup when stream ends.
 */
export function setupChromaKey(
  sourceVideo: HTMLVideoElement,
  targetCanvas: HTMLCanvasElement,
  options: ChromaKeyOptions = {},
): () => void {
  let animationFrameId: number | null = null;
  let stopped = false;

  const render = () => {
    if (stopped) return;
    applyChromaKey(sourceVideo, targetCanvas, options);
    animationFrameId = requestAnimationFrame(render);
  };

  render();

  return () => {
    stopped = true;
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  };
}
