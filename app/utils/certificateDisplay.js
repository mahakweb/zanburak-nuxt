/** Format certificate duration from seconds or legacy "2m" / "12h 30m" strings. */
export function formatCertificateDuration(value, locale = 'fa') {
  if (value == null || value === '' || value === '—' || value === '-') {
    return locale === 'en' ? '—' : '—';
  }

  let hours = 0;
  let minutes = 0;

  if (typeof value === 'number' || /^\d+$/.test(String(value).trim())) {
    const seconds = parseInt(String(value), 10);
    if (seconds <= 0) return locale === 'en' ? '—' : '—';
    hours = Math.floor(seconds / 3600);
    minutes = Math.floor((seconds % 3600) / 60);
  } else {
    const str = String(value).trim();
    const hourMatch = str.match(/(\d+)\s*h/i);
    const minMatch = str.match(/(\d+)\s*m/i);
    if (hourMatch) hours = parseInt(hourMatch[1], 10);
    if (minMatch) minutes = parseInt(minMatch[1], 10);
    if (!hourMatch && !minMatch) return str;
  }

  if (locale === 'en') {
    const parts = [];
    if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
    return parts.length ? parts.join(' ') : '—';
  }

  const parts = [];
  if (hours > 0) parts.push(`${hours} ساعت`);
  if (minutes > 0) parts.push(`${minutes} دقیقه`);
  if (hours > 0 && minutes > 0) return `${hours} ساعت و ${minutes} دقیقه`;
  return parts.length ? parts.join(' ') : '—';
}

export async function copyTextToClipboard(text) {
  if (!text) return false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(String(text));
      return true;
    }
    const ta = document.createElement('textarea');
    ta.value = String(text);
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export function formatCertificateDateTime(value, locale = 'fa') {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  if (locale === 'en') {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  return date.toLocaleString('fa-IR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
