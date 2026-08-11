import { toJpeg } from "html-to-image";
import { jsPDF } from "jspdf";

const STYLE_PROPS = [
  "color",
  "background-color",
  "background-image",
  "border",
  "border-top",
  "border-right",
  "border-bottom",
  "border-left",
  "border-radius",
  "box-shadow",
  "text-shadow",
  "fill",
  "stroke",
  "opacity",
  "font-family",
  "font-size",
  "font-weight",
  "font-style",
  "line-height",
  "letter-spacing",
  "text-align",
  "text-decoration",
  "text-transform",
  "white-space",
  "display",
  "flex-direction",
  "flex-wrap",
  "align-items",
  "justify-content",
  "align-self",
  "gap",
  "row-gap",
  "column-gap",
  "grid-template-columns",
  "grid-template-rows",
  "padding",
  "margin",
  "width",
  "height",
  "min-width",
  "min-height",
  "max-width",
  "max-height",
  "overflow",
  "overflow-x",
  "overflow-y",
  "position",
  "top",
  "right",
  "bottom",
  "left",
  "inset",
  "z-index",
  "object-fit",
  "object-position",
  "transform",
] as const;

const TRANSPARENT_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

/**
 * Capture a live DOM section (exact on-screen colors/layout) into a PDF download.
 * Flattens computed styles first so Tailwind v4 / oklch colors don't break html-to-image.
 */
export async function downloadDomSnapshotPdf(
  element: HTMLElement,
  filename: string,
  options?: { backgroundColor?: string },
): Promise<void> {
  const backgroundColor = options?.backgroundColor ?? "#111023";

  if (document.fonts?.ready) {
    await document.fonts.ready.catch(() => undefined);
  }

  const ignored = Array.from(
    element.querySelectorAll<HTMLElement>('[data-snapshot-ignore="true"]'),
  );
  const prevDisplay = ignored.map((node) => node.style.display);
  ignored.forEach((node) => {
    node.style.display = "none";
  });

  const host = document.createElement("div");
  host.setAttribute("aria-hidden", "true");
  host.style.cssText = [
    "position:fixed",
    "left:-12000px",
    "top:0",
    "width:auto",
    "z-index:-1",
    "pointer-events:none",
    `background:${backgroundColor}`,
  ].join(";");

  const clone = element.cloneNode(true) as HTMLElement;
  host.appendChild(clone);
  document.body.appendChild(host);

  try {
    await inlineImagesAsDataUrls(clone);
    prepareCloneImages(clone);
    flattenComputedStyles(element, clone);

    const width = Math.max(element.scrollWidth, element.offsetWidth, 1);
    const height = Math.max(element.scrollHeight, element.offsetHeight, 1);

    const dataUrl = await toJpeg(clone, {
      quality: 0.95,
      pixelRatio: Math.min(2, window.devicePixelRatio || 1),
      backgroundColor,
      cacheBust: true,
      skipFonts: true,
      width,
      height,
      style: {
        width: `${width}px`,
        height: `${height}px`,
        transform: "none",
      },
      imagePlaceholder: TRANSPARENT_PIXEL,
      onImageErrorHandler: () => undefined,
    });

    if (!dataUrl || dataUrl === "data:,") {
      throw new Error("Snapshot capture returned an empty image");
    }

    await writeJpegPdf(dataUrl, filename, backgroundColor);
  } finally {
    host.remove();
    ignored.forEach((node, index) => {
      node.style.display = prevDisplay[index] ?? "";
    });
  }
}

async function inlineImagesAsDataUrls(root: HTMLElement) {
  const images = Array.from(root.querySelectorAll("img"));
  await Promise.all(
    images.map(async (img) => {
      const src = img.currentSrc || img.src;
      if (!src || src.startsWith("data:")) return;
      try {
        const dataUrl = await fetchImageAsDataUrl(src);
        img.src = dataUrl;
        img.removeAttribute("srcset");
        img.removeAttribute("sizes");
      } catch {
        img.src = TRANSPARENT_PIXEL;
        img.removeAttribute("srcset");
      }
    }),
  );
}

async function fetchImageAsDataUrl(url: string): Promise<string> {
  const response = await fetch(url, { mode: "cors", credentials: "omit" });
  if (!response.ok) {
    throw new Error(`Image fetch failed: ${response.status}`);
  }
  const blob = await response.blob();
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read image"));
    reader.readAsDataURL(blob);
  });
}

function prepareCloneImages(root: HTMLElement) {
  root.querySelectorAll("img").forEach((img) => {
    img.removeAttribute("srcset");
    img.removeAttribute("sizes");
    img.loading = "eager";
    img.decoding = "sync";
    try {
      img.crossOrigin = "anonymous";
    } catch {
      // ignore
    }
  });
}

function flattenComputedStyles(sourceRoot: HTMLElement, cloneRoot: HTMLElement) {
  const sources = [sourceRoot, ...Array.from(sourceRoot.querySelectorAll("*"))];
  const clones = [cloneRoot, ...Array.from(cloneRoot.querySelectorAll("*"))];

  for (let i = 0; i < sources.length; i += 1) {
    const source = sources[i];
    const target = clones[i];
    if (!(source instanceof HTMLElement) || !(target instanceof HTMLElement)) {
      continue;
    }

    const computed = window.getComputedStyle(source);
    for (const prop of STYLE_PROPS) {
      const value = computed.getPropertyValue(prop);
      if (value) {
        target.style.setProperty(prop, value);
      }
    }

    // Drop utility classes so cloned SVG/foreignObject won't re-apply oklch theme CSS.
    target.removeAttribute("class");
  }
}

async function writeJpegPdf(
  dataUrl: string,
  filename: string,
  backgroundColor: string,
) {
  const img = await loadImage(dataUrl);
  const imgW = img.naturalWidth || img.width;
  const imgH = img.naturalHeight || img.height;
  if (!imgW || !imgH) {
    throw new Error("Could not capture student details");
  }

  const pdf = new jsPDF({
    orientation: imgW / imgH > 1.2 ? "landscape" : "portrait",
    unit: "pt",
    format: "letter",
  });

  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 16;
  const maxW = pageW - margin * 2;
  const maxH = pageH - margin * 2;
  const scale = maxW / imgW;
  const drawW = maxW;
  const pageSourceH = maxH / scale;

  const bg = hexToRgb(backgroundColor) ?? { r: 17, g: 16, b: 35 };
  let srcY = 0;
  let pageIndex = 0;

  while (srcY < imgH - 0.5) {
    if (pageIndex > 0) pdf.addPage();
    pdf.setFillColor(bg.r, bg.g, bg.b);
    pdf.rect(0, 0, pageW, pageH, "F");

    const sliceH = Math.min(pageSourceH, imgH - srcY);
    const sliceCanvas = document.createElement("canvas");
    sliceCanvas.width = imgW;
    sliceCanvas.height = Math.max(1, Math.ceil(sliceH));
    const ctx = sliceCanvas.getContext("2d");
    if (!ctx) throw new Error("Could not create snapshot canvas");

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
    ctx.drawImage(
      img,
      0,
      srcY,
      imgW,
      sliceH,
      0,
      0,
      imgW,
      sliceH,
    );

    const sliceData = sliceCanvas.toDataURL("image/jpeg", 0.95);
    const drawH = sliceH * scale;
    pdf.addImage(sliceData, "JPEG", margin, margin, drawW, drawH, undefined, "FAST");

    srcY += sliceH;
    pageIndex += 1;
    if (pageIndex > 30) break;
  }

  const safeName = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
  // jsPDF save is the most reliable browser download path.
  pdf.save(safeName);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.trim().replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null;
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not render snapshot image"));
    img.src = src;
  });
}
