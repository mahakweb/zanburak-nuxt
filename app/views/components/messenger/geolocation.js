/**
 * Browser Geolocation helpers for messenger location sharing.
 *
 * - Open/share links use Neshan (نشان).
 * - Map previews use OpenStreetMap embed/static tiles so the pin always
 *   renders at the real GPS coordinates (Neshan Static Map requires a valid
 *   service key and often fails from the browser).
 */

export const GEO_ERROR = {
  UNSUPPORTED: 'unsupported',
  DENIED: 'denied',
  UNAVAILABLE: 'unavailable',
  TIMEOUT: 'timeout',
  UNKNOWN: 'unknown',
};

/** Open / share URL — Neshan app or web. */
export function mapsUrl(lat, lng) {
  return `https://nshn.ir/?lat=${lat}&lng=${lng}`;
}

export function googleMapsUrl(lat, lng) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

/**
 * Open coordinates in a maps app.
 * Mobile: `geo:` triggers the OS "Open with…" sheet when possible.
 * Fallback: Neshan, then Google Maps.
 */
export function openLocationInMaps(lat, lng) {
  const a = Number(lat);
  const b = Number(lng);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return;

  const neshan = mapsUrl(a, b);
  const google = googleMapsUrl(a, b);
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);

  if (isAndroid) {
    window.location.href = `geo:${a},${b}?q=${a},${b}`;
    return;
  }
  if (isIOS) {
    window.location.href = `maps://?ll=${a},${b}&q=${a},${b}`;
    setTimeout(() => {
      window.location.href = neshan;
    }, 700);
    return;
  }

  const win = window.open(neshan, '_blank', 'noopener,noreferrer');
  if (!win) {
    window.open(google, '_blank', 'noopener,noreferrer');
  }
}

/** Interactive OSM embed centered on the point (no API key). */
export function osmEmbedUrl(lat, lng, delta = 0.012) {
  const a = Number(lat);
  const b = Number(lng);
  const d = Number(delta) || 0.012;
  const south = a - d;
  const north = a + d;
  const west = b - d;
  const east = b + d;
  const bbox = `${west},${south},${east},${north}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${encodeURIComponent(`${a},${b}`)}`;
}

/** Static OSM image fallback (no API key). */
export function osmStaticMapUrl(lat, lng, { width = 400, height = 200, zoom = 15 } = {}) {
  const w = Math.min(Math.max(Number(width) || 400, 64), 1200);
  const h = Math.min(Math.max(Number(height) || 200, 64), 1200);
  const z = Math.min(Math.max(Number(zoom) || 15, 1), 18);
  return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=${z}&size=${w}x${h}&markers=${lat},${lng},red-pushpin`;
}

/** @deprecated kept for callers — prefer LocationMapPreview / osm* helpers */
export function staticMapUrl(lat, lng, opts = {}) {
  return osmStaticMapUrl(lat, lng, opts);
}

/**
 * Build a small OSM tile mosaic around a point (display via <img>, no CORS needed).
 * Pin at lat/lng maps to the visual center after applying offsetX/offsetY.
 */
export function osmTileGrid(lat, lng, { zoom = 15 } = {}) {
  const z = Math.min(Math.max(Number(zoom) || 15, 1), 18);
  const a = Number(lat);
  const b = Number(lng);
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    return { tiles: [], width: 0, height: 0, offsetX: 0, offsetY: 0 };
  }

  const n = 2 ** z;
  const xFloat = ((b + 180) / 360) * n;
  const latRad = (a * Math.PI) / 180;
  const yFloat = (
    (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2
  ) * n;

  const centerTileX = Math.floor(xFloat);
  const centerTileY = Math.floor(yFloat);
  const fracX = xFloat - centerTileX;
  const fracY = yFloat - centerTileY;

  // 3x3 is enough for ~420×200 bubbles with margin.
  const half = 1;
  const tiles = [];
  for (let dy = -half; dy <= half; dy += 1) {
    for (let dx = -half; dx <= half; dx += 1) {
      let tx = centerTileX + dx;
      const ty = centerTileY + dy;
      if (ty < 0 || ty >= n) continue;
      tx = ((tx % n) + n) % n;
      tiles.push({
        key: `${z}/${tx}/${ty}`,
        src: `https://a.basemaps.cartocdn.com/rastertiles/voyager/${z}/${tx}/${ty}.png`,
        left: (dx + half) * 256,
        top: (dy + half) * 256,
      });
    }
  }

  const layerW = (half * 2 + 1) * 256;
  const layerH = (half * 2 + 1) * 256;
  // Fractional position of the pin inside the layer.
  const pinX = (half + fracX) * 256;
  const pinY = (half + fracY) * 256;
  // When layer is centered with translate(-50%,-50%), nudge so pin hits center.
  const offsetX = layerW / 2 - pinX;
  const offsetY = layerH / 2 - pinY;

  return {
    tiles,
    width: layerW,
    height: layerH,
    offsetX,
    offsetY,
  };
}

export function formatCoords(lat, lng) {
  const a = Number(lat);
  const b = Number(lng);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return '';
  return `${a.toFixed(5)}, ${b.toFixed(5)}`;
}

export function locationBody(lat, lng) {
  return `📍 ${formatCoords(lat, lng)}`;
}

/**
 * @returns {Promise<{ lat: number, lng: number, accuracy: number|null }>}
 */
export function requestCurrentPosition(options = {}) {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(Object.assign(new Error('Geolocation unsupported'), { code: GEO_ERROR.UNSUPPORTED }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
          reject(Object.assign(new Error('Invalid coordinates'), { code: GEO_ERROR.UNAVAILABLE }));
          return;
        }
        resolve({
          lat,
          lng,
          accuracy: Number.isFinite(pos.coords.accuracy) ? pos.coords.accuracy : null,
        });
      },
      (err) => {
        let code = GEO_ERROR.UNKNOWN;
        if (err?.code === 1) code = GEO_ERROR.DENIED;
        else if (err?.code === 2) code = GEO_ERROR.UNAVAILABLE;
        else if (err?.code === 3) code = GEO_ERROR.TIMEOUT;
        reject(Object.assign(new Error(err?.message || 'Geolocation failed'), { code, original: err }));
      },
      {
        enableHighAccuracy: true,
        timeout: options.timeout ?? 20000,
        maximumAge: options.maximumAge ?? 0,
      },
    );
  });
}
