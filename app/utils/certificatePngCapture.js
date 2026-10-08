import { toPng } from 'html-to-image';
import config from '@/store/config';

/** A4 at 96 DPI (CSS px). */
export const A4_LANDSCAPE = { width: 1123, height: 794 };
export const A4_PORTRAIT = { width: 794, height: 1123 };

export function getCanvasSize(orientationOrRender) {
  if (orientationOrRender && typeof orientationOrRender === 'object') {
    const render = orientationOrRender;
    if (render.canvas_width && render.canvas_height) {
      return { width: render.canvas_width, height: render.canvas_height };
    }
    return getCanvasSize(render.orientation);
  }
  return orientationOrRender === 'portrait' ? A4_PORTRAIT : A4_LANDSCAPE;
}

/** Pass through CDN/API URLs; convert legacy /storage/ paths to the asset proxy. */
export function normalizeCertificateAssetUrl(url) {
  if (!url) return null;
  if (url.startsWith('data:')) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;

  const storageMatch = url.match(/\/storage\/([^?]+)/);
  if (storageMatch) {
    const path = decodeURIComponent(storageMatch[1]);
    return `${config.apiBaseUrl}/certificate/asset?path=${encodeURIComponent(path)}`;
  }

  return url;
}

async function fetchImageAsDataUrl(url) {
  if (!url || url.startsWith('data:')) return url;

  const normalized = normalizeCertificateAssetUrl(url);
  const isStaticCdn = normalized.includes('static.zanburak.ir');
  const response = await fetch(normalized, {
    mode: 'cors',
    credentials: isStaticCdn ? 'omit' : 'include',
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`Failed to load image: ${normalized}`);
  }
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/** Embed remote assets as data URIs so html-to-image never reuses the wrong cached image. */
export async function embedRenderImagesAsDataUrls(render) {
  if (!render) return render;

  const [background, logo, signature] = await Promise.all([
    render.background_url ? fetchImageAsDataUrl(render.background_url).catch(() => null) : null,
    render.logo_url ? fetchImageAsDataUrl(render.logo_url).catch(() => null) : null,
    render.signature_url ? fetchImageAsDataUrl(render.signature_url).catch(() => null) : null,
  ]);

  return {
    ...render,
    ...(background ? { background_url: background } : {}),
    ...(logo ? { logo_url: logo } : {}),
    ...(signature ? { signature_url: signature } : {}),
  };
}

export function normalizeRenderAssets(render) {
  if (!render) return render;
  return {
    ...render,
    background_url: normalizeCertificateAssetUrl(render.background_url),
    logo_url: normalizeCertificateAssetUrl(render.logo_url),
    signature_url: normalizeCertificateAssetUrl(render.signature_url),
  };
}

export function waitForImages(root) {
  const imgs = root.querySelectorAll('img');
  return Promise.all([...imgs].map((img) => {
    if (img.complete && img.naturalWidth > 0) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      const done = () => resolve();
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
      setTimeout(done, 8000);
    });
  }));
}

export async function waitForFonts(timeoutMs = 4000) {
  if (!document.fonts?.ready) return;
  await Promise.race([
    document.fonts.ready,
    new Promise((resolve) => setTimeout(resolve, timeoutMs)),
  ]);
}

export async function captureCertificateToPng(el, orientationOrRender) {
  const { width, height } = getCanvasSize(orientationOrRender);
  await waitForImages(el);
  await waitForFonts();
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  return toPng(el, {
    width,
    height,
    pixelRatio: 2,
    cacheBust: true,
    includeQueryParams: true,
    skipAutoScale: true,
    fetchRequestInit: { cache: 'no-store' },
    style: {
      margin: '0',
      padding: '0',
      outline: 'none',
      border: 'none',
    },
  });
}

export function downloadDataUrl(dataUrl, filename) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function revokeObjectUrl(url) {
  if (url && url.startsWith('blob:')) {
    window.URL.revokeObjectURL(url);
  }
}
