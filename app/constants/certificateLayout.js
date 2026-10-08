/** Shared certificate layout defaults (mirrors backend CertificateConstants). */

export const CERTIFICATE_CANVAS = {
  landscape: { width: 1123, height: 794 },
  portrait: { width: 794, height: 1123 },
};

const layoutText = (overrides = {}) => ({
  x: 50,
  y: 50,
  font_size: 14,
  align: 'center',
  color: '#374151',
  font_family: 'yekanbakh',
  font_weight: 'normal',
  line_height: 1.5,
  visible: true,
  ...overrides,
});

const layoutTextBox = (overrides = {}) => layoutText({
  width: 200,
  height: 48,
  ...overrides,
});

const layoutImage = (overrides = {}) => ({
  x: 50,
  y: 50,
  width: 100,
  height: 60,
  visible: true,
  ...overrides,
});

export const DEFAULT_SETTINGS = {
  primary_color: '#facc15',
  title: 'گواهینامه تکمیل دوره',
  subtitle: 'با موفقیت دوره آموزشی زیر را به پایان رسانده است:',
  custom_text_1: '',
  custom_text_2: '',
  custom_text_3: '',
  custom_text_4: '',
  custom_text_5: '',
  frame_enabled: true,
  frame_color: '',
  frame_width: 3,
  frame_inset: 24,
  frame_style: 'solid',
};

export const DEFAULT_LAYOUT = {
  title: layoutText({ x: 50, y: 18, font_size: 14, color: '#6b7280' }),
  subtitle: layoutText({ x: 50, y: 48, font_size: 13, color: '#64748b' }),
  student_name: layoutText({ x: 50, y: 42, font_size: 36, color: '#1a1a2e', font_family: 'irannastaliq' }),
  course_name: layoutText({ x: 50, y: 55, font_size: 22, font_family: 'bzar' }),
  completion_date: layoutText({ x: 25, y: 78, font_family: 'bnazanin' }),
  certificate_serial: layoutText({ x: 8, y: 92, font_size: 11, align: 'left', color: '#9ca3af' }),
  certificate_id: layoutText({ x: 92, y: 92, font_size: 10, align: 'right', color: '#9ca3af' }),
  instructor_name: layoutText({ x: 75, y: 78, font_size: 16, font_family: 'bzar' }),
  duration: layoutText({ x: 50, y: 65, font_family: 'bnazanin' }),
  grade: layoutText({ x: 50, y: 70, color: '#059669', font_family: 'bnazanin' }),
  custom_text_1: layoutTextBox({ x: 15, y: 30, font_size: 12, visible: false }),
  custom_text_2: layoutTextBox({ x: 85, y: 30, font_size: 12, visible: false }),
  custom_text_3: layoutTextBox({ x: 15, y: 85, font_size: 12, visible: false }),
  custom_text_4: layoutTextBox({ x: 85, y: 85, font_size: 12, visible: false }),
  custom_text_5: layoutTextBox({ x: 50, y: 90, font_size: 12, visible: false }),
  qr_code: layoutImage({ x: 88, y: 12, width: 120, height: 120 }),
  logo: layoutImage({ x: 12, y: 8, width: 100, height: 60 }),
  signature: layoutImage({ x: 75, y: 72, width: 140, height: 50 }),
};

export const LAYOUT_FIELD_GROUPS = [
  { key: 'title', label: 'عنوان گواهینامه', type: 'text' },
  { key: 'subtitle', label: 'زیرعنوان', type: 'text' },
  { key: 'student_name', label: 'نام دانشجو', type: 'text' },
  { key: 'course_name', label: 'نام دوره', type: 'text' },
  { key: 'completion_date', label: 'تاریخ اتمام', type: 'text' },
  { key: 'certificate_serial', label: 'سریال', type: 'text' },
  { key: 'certificate_id', label: 'شناسه', type: 'text' },
  { key: 'instructor_name', label: 'نام مدرس', type: 'text' },
  { key: 'duration', label: 'مدت زمان', type: 'text' },
  { key: 'grade', label: 'نمره', type: 'text' },
  { key: 'custom_text_1', label: 'متن دلخواه ۱', type: 'text', custom: true, settingsKey: 'custom_text_1' },
  { key: 'custom_text_2', label: 'متن دلخواه ۲', type: 'text', custom: true, settingsKey: 'custom_text_2' },
  { key: 'custom_text_3', label: 'متن دلخواه ۳', type: 'text', custom: true, settingsKey: 'custom_text_3' },
  { key: 'custom_text_4', label: 'متن دلخواه ۴', type: 'text', custom: true, settingsKey: 'custom_text_4' },
  { key: 'custom_text_5', label: 'متن دلخواه ۵', type: 'text', custom: true, settingsKey: 'custom_text_5' },
  { key: 'qr_code', label: 'QR Code', type: 'image' },
  { key: 'logo', label: 'لوگو', type: 'image' },
  { key: 'signature', label: 'امضا', type: 'image' },
];

export const CUSTOM_TEXT_KEYS = [
  'custom_text_1',
  'custom_text_2',
  'custom_text_3',
  'custom_text_4',
  'custom_text_5',
];

export function isFieldVisible(layoutItem) {
  return layoutItem?.visible !== false;
}

export function mergeLayout(source = {}) {
  const merged = {};
  for (const [key, defaults] of Object.entries(DEFAULT_LAYOUT)) {
    merged[key] = { ...defaults, ...(source?.[key] || {}) };
    if (merged[key].visible === undefined) {
      merged[key].visible = true;
    }
    if (key === 'qr_code' && merged[key].size && !merged[key].width) {
      merged[key].width = merged[key].size;
      merged[key].height = merged[key].size;
    }
  }
  return merged;
}

export function mergeSettings(source = {}) {
  return { ...DEFAULT_SETTINGS, ...source };
}

export function canvasForOrientation(orientation) {
  return orientation === 'portrait' ? CERTIFICATE_CANVAS.portrait : CERTIFICATE_CANVAS.landscape;
}

export function textFieldHasBox(pos = {}) {
  return !!(pos.width || pos.height);
}

export function approximateTextBox(sampleText, fontSize = 14, canvasWidth = 1123) {
  const text = String(sampleText || '');
  const width = Math.min(canvasWidth * 0.85, Math.max(48, text.length * fontSize * 0.55));
  const height = Math.max(24, fontSize * 1.6);
  return { width: Math.round(width), height: Math.round(height) };
}

/** Vue inline style for absolutely-positioned certificate text fields. */
export function textFieldStyle(pos = {}, fontsMap = {}) {
  const x = pos.x ?? 50;
  const y = pos.y ?? 50;
  const align = pos.align ?? 'center';

  const style = {
    position: 'absolute',
    zIndex: 3,
    top: `${y}%`,
  };

  if (align === 'left') {
    style.left = `${x}%`;
    style.transform = 'translateY(-50%)';
    style.textAlign = 'left';
  } else if (align === 'right') {
    style.right = `${100 - x}%`;
    style.transform = 'translateY(-50%)';
    style.textAlign = 'right';
  } else {
    style.left = `${x}%`;
    style.transform = 'translate(-50%, -50%)';
    style.textAlign = 'center';
  }

  if (pos.font_size) style.fontSize = `${pos.font_size}px`;
  if (pos.color) style.color = pos.color;
  if (pos.font_weight && pos.font_weight !== 'normal') style.fontWeight = pos.font_weight;
  if (pos.line_height) style.lineHeight = String(pos.line_height);

  const slug = pos.font_family;
  if (slug && fontsMap[slug]?.css_family) {
    style.fontFamily = `'${fontsMap[slug].css_family}', Tahoma, sans-serif`;
  }

  if (textFieldHasBox(pos)) {
    if (pos.width) style.width = `${pos.width}px`;
    if (pos.height) {
      style.height = `${pos.height}px`;
      style.display = 'flex';
      style.alignItems = 'center';
      style.justifyContent = align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center';
    }
    style.whiteSpace = 'normal';
    style.overflowWrap = 'break-word';
    style.wordBreak = 'break-word';
    style.boxSizing = 'border-box';
  }

  return style;
}
