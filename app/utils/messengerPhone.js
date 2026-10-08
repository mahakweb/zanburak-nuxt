/**
 * Iranian mobile normalization for contact sync (mirrors backend MessengerService).
 * Accepts: +98 / 0098 / 98 / 0 / bare 9xxxxxxxxx, Persian/Arabic digits,
 * and ignores spaces, dashes, parentheses.
 */
export function toAsciiDigits(value) {
  const persian = '۰۱۲۳۴۵۶۷۸۹';
  const arabic = '٠١٢٣٤٥٦٧٨٩';
  return String(value || '').replace(/[۰-۹٠-٩]/g, (ch) => {
    const i = persian.indexOf(ch);
    if (i >= 0) return String(i);
    const j = arabic.indexOf(ch);
    return j >= 0 ? String(j) : ch;
  });
}

/** @returns {string|null} Canonical +98XXXXXXXXXX or null */
export function normalizeIranMobile(value) {
  let digits = toAsciiDigits(value).replace(/\D+/g, '');
  if (!digits) return null;

  if (digits.startsWith('0098')) digits = digits.slice(4);
  else if (digits.startsWith('98') && digits.length >= 12) digits = digits.slice(2);
  else if (digits.startsWith('0')) digits = digits.slice(1);

  if (digits.length !== 10 || !/^9\d{9}$/.test(digits)) return null;
  return `+98${digits}`;
}

export function extractPhonesFromVcard(text) {
  const entries = [];
  const cards = String(text || '').split(/BEGIN:VCARD/i).slice(1);
  for (const card of cards) {
    const nameMatch = card.match(/FN[;:]([^\r\n]+)/i);
    const name = nameMatch ? nameMatch[1].replace(/\\,/g, ',').trim() : '';
    const telMatches = [...card.matchAll(/TEL[^:]*:([^\r\n]+)/gi)];
    for (const m of telMatches) {
      const phone = normalizeIranMobile(m[1]);
      if (phone) entries.push({ name: name || phone, phone });
    }
  }
  return entries;
}

export function extractPhonesFromCsv(text) {
  const entries = [];
  const lines = String(text || '').split(/\r?\n/).filter(Boolean);
  for (const line of lines) {
    const parts = line.split(/[,;]/).map((p) => p.trim().replace(/^"|"$/g, ''));
    if (parts.length < 1) continue;
    let name = '';
    let phone = null;
    for (const part of parts) {
      const n = normalizeIranMobile(part);
      if (n) phone = n;
      else if (!name && part && !/^\d+$/.test(part)) name = part;
    }
    if (phone) entries.push({ name: name || phone, phone });
  }
  return entries;
}
