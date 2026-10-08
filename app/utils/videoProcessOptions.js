/** Canonical ladder from highest to lowest. */
export const VIDEO_QUALITY_LADDER = [1080, 720, 480, 360, 240, 144];

export const VIDEO_STORAGE_TARGETS = [
    { id: 'dl', label: 'هاست دانلود (dl.zanburak.ir)' },
    { id: 'static', label: 'هاست استاتیک (static.zanburak.ir)' },
    { id: 'media', label: 'دیسک محلی ورکر (media)' },
];

export const WATERMARK_POSITIONS = [
    { id: 'top-left', label: 'بالا چپ' },
    { id: 'top-right', label: 'بالا راست' },
    { id: 'center', label: 'وسط' },
    { id: 'bottom-left', label: 'پایین چپ' },
    { id: 'bottom-right', label: 'پایین راست' },
];

/** Fonts available on typical Windows worker + CSS preview stack. */
export const WATERMARK_FONTS = [
    { id: 'tahoma', label: 'Tahoma', css: 'Tahoma, sans-serif', weight: 400 },
    { id: 'tahoma-bold', label: 'Tahoma Bold', css: 'Tahoma, sans-serif', weight: 700 },
    { id: 'arial', label: 'Arial', css: 'Arial, sans-serif', weight: 400 },
    { id: 'arial-bold', label: 'Arial Bold', css: 'Arial, sans-serif', weight: 700 },
    { id: 'segoe', label: 'Segoe UI', css: '"Segoe UI", sans-serif', weight: 400 },
    { id: 'segoe-bold', label: 'Segoe UI Bold', css: '"Segoe UI", sans-serif', weight: 700 },
    { id: 'verdana', label: 'Verdana', css: 'Verdana, sans-serif', weight: 400 },
    { id: 'georgia', label: 'Georgia', css: 'Georgia, serif', weight: 400 },
    { id: 'times', label: 'Times', css: '"Times New Roman", Times, serif', weight: 400 },
    { id: 'impact', label: 'Impact', css: 'Impact, sans-serif', weight: 400 },
    { id: 'courier', label: 'Courier', css: '"Courier New", monospace', weight: 400 },
    { id: 'comic', label: 'Comic Sans', css: '"Comic Sans MS", cursive', weight: 400 },
];

export const WATERMARK_COLOR_SWATCHES = [
    '#FFFFFF', '#FACC15', '#FDE68A', '#111827', '#000000',
    '#EF4444', '#22C55E', '#3B82F6', '#A855F7', '#F97316',
];

/** One-click style packs for text watermark. */
export const WATERMARK_STYLE_PRESETS = [
    {
        id: 'clean-white',
        label: 'سفید ساده',
        values: {
            font_color: '#FFFFFF',
            bg_enabled: false,
            border_enabled: true,
            border_color: '#000000',
            border_width: 2,
            bg_padding: 8,
            bg_radius: 0,
        },
    },
    {
        id: 'glass-dark',
        label: 'شیشه‌ای تیره',
        values: {
            font_color: '#FFFFFF',
            bg_enabled: true,
            bg_color: '#000000',
            bg_opacity: 0.5,
            border_enabled: false,
            border_width: 0,
            bg_padding: 12,
            bg_radius: 10,
        },
    },
    {
        id: 'brand-yellow',
        label: 'زرد برند',
        values: {
            font_color: '#111827',
            bg_enabled: true,
            bg_color: '#FACC15',
            bg_opacity: 0.95,
            border_enabled: false,
            border_width: 0,
            bg_padding: 10,
            bg_radius: 12,
            font: 'segoe-bold',
        },
    },
    {
        id: 'outline-yellow',
        label: 'زرد خط‌دار',
        values: {
            font_color: '#FACC15',
            bg_enabled: false,
            border_enabled: true,
            border_color: '#111827',
            border_width: 3,
            bg_padding: 8,
            bg_radius: 0,
            font: 'impact',
        },
    },
    {
        id: 'soft-pill',
        label: 'کپسول نرم',
        values: {
            font_color: '#F9FAFB',
            bg_enabled: true,
            bg_color: '#1F2937',
            bg_opacity: 0.72,
            border_enabled: true,
            border_color: '#FACC15',
            border_width: 1,
            bg_padding: 14,
            bg_radius: 18,
            font: 'segoe',
        },
    },
];

export function defaultWatermarkOptions() {
    return {
        enabled: false,
        type: 'text',
        text: '',
        position: 'bottom-right',
        opacity: 0.85,
        font_size: 36,
        image_scale: 0.16,
        image_radius: 0,
        font: 'tahoma',
        font_color: '#FFFFFF',
        bg_enabled: false,
        bg_color: '#000000',
        bg_opacity: 0.45,
        bg_padding: 10,
        bg_radius: 8,
        border_enabled: true,
        border_color: '#000000',
        border_width: 2,
    };
}

export function watermarkFontMeta(fontId) {
    return WATERMARK_FONTS.find((f) => f.id === fontId) || WATERMARK_FONTS[0];
}

export function defaultProcessOptions(sourceHeight = 720) {
    const qs = defaultSelectedQualities(sourceHeight);
    return {
        outputs: ['stream'],
        stream_qualities: [...qs],
        download_qualities: [...qs],
        qualities: [...qs],
        storage_disk: 'dl',
        watermark: defaultWatermarkOptions(),
    };
}

/**
 * Qualities available for a source height (never above source).
 */
export function availableQualitiesForHeight(sourceHeight) {
    const h = Number(sourceHeight) || 720;
    const list = VIDEO_QUALITY_LADDER.filter((q) => q <= h);
    if (list.length) return list;
    const nearest = VIDEO_QUALITY_LADDER.find((q) => q <= h) || Math.min(h, 720);
    return [nearest];
}

/**
 * Default selection: source rung + up to two lower rungs.
 */
export function defaultSelectedQualities(sourceHeight) {
    const available = availableQualitiesForHeight(sourceHeight);
    return available.slice(0, Math.min(3, available.length));
}

/**
 * Probe height from a File via HTMLVideoElement.
 */
export function probeVideoHeightFromFile(file) {
    return new Promise((resolve) => {
        if (!file) {
            resolve(720);
            return;
        }
        const url = URL.createObjectURL(file);
        const el = document.createElement('video');
        el.preload = 'metadata';
        el.muted = true;
        const done = (height) => {
            URL.revokeObjectURL(url);
            resolve(height > 0 ? height : 720);
        };
        el.onloadedmetadata = () => done(el.videoHeight || 720);
        el.onerror = () => done(720);
        el.src = url;
    });
}

function normalizeWatermarkPayload(watermark) {
    const wm = {
        ...defaultWatermarkOptions(),
        ...(watermark || {}),
    };
    return {
        enabled: !!wm.enabled,
        type: wm.type === 'image' ? 'image' : 'text',
        text: String(wm.text || '').slice(0, 80),
        position: wm.position || 'bottom-right',
        opacity: Number(wm.opacity ?? 0.85),
        font_size: Number(wm.font_size ?? 36),
        image_scale: Number(wm.image_scale ?? 0.16),
        font: wm.font || 'tahoma',
        font_color: wm.font_color || '#FFFFFF',
        bg_enabled: !!wm.bg_enabled,
        bg_color: wm.bg_color || '#000000',
        bg_opacity: Number(wm.bg_opacity ?? 0.45),
        bg_padding: Number(wm.bg_padding ?? 10),
        bg_radius: Number(wm.bg_radius ?? 8),
        image_radius: Number(wm.image_radius ?? 0),
        border_enabled: wm.border_enabled !== false,
        border_color: wm.border_color || '#000000',
        border_width: Number(wm.border_width ?? 2),
    };
}

/**
 * Build axios body for admin/video/process — FormData when watermark image is set.
 */
export function buildProcessRequestBody(processOptions, watermarkFile = null) {
    const opts = processOptions || {};
    const watermark = normalizeWatermarkPayload(opts.watermark);
    const fields = {
        qualities: opts.qualities || opts.stream_qualities || [],
        stream_qualities: opts.stream_qualities || [],
        download_qualities: opts.download_qualities || [],
        outputs: opts.outputs || ['stream'],
        storage_disk: opts.storage_disk || 'dl',
        watermark_enabled: watermark.enabled ? 1 : 0,
        watermark_type: watermark.type || 'text',
        watermark_text: watermark.text || '',
        watermark_position: watermark.position || 'bottom-right',
        watermark_opacity: watermark.opacity ?? 0.85,
        watermark_font_size: watermark.font_size ?? 36,
        watermark_image_scale: watermark.image_scale ?? 0.18,
        watermark_font: watermark.font,
        watermark_font_color: watermark.font_color,
        watermark_bg_enabled: watermark.bg_enabled ? 1 : 0,
        watermark_bg_color: watermark.bg_color,
        watermark_bg_opacity: watermark.bg_opacity,
        watermark_bg_padding: watermark.bg_padding,
        watermark_bg_radius: watermark.bg_radius,
        watermark_image_radius: watermark.image_radius,
        watermark_border_enabled: watermark.border_enabled ? 1 : 0,
        watermark_border_color: watermark.border_color,
        watermark_border_width: watermark.border_width,
    };

    if (watermark.enabled && watermark.type === 'image' && watermarkFile) {
        const fd = new FormData();
        Object.entries(fields).forEach(([k, v]) => {
            if (Array.isArray(v)) {
                v.forEach((item) => fd.append(`${k}[]`, String(item)));
            } else {
                fd.append(k, String(v));
            }
        });
        fd.append('watermark_image', watermarkFile);
        return fd;
    }

    return {
        ...fields,
        watermark,
    };
}
