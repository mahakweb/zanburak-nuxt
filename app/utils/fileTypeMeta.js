const FILE_TYPE_MAP = {
    pdf: { color: '#ef4444', abbr: 'PDF', label: 'PDF' },
    doc: { color: '#2563eb', abbr: 'DOC', label: 'Word' },
    docx: { color: '#2563eb', abbr: 'DOC', label: 'Word' },
    xls: { color: '#16a34a', abbr: 'XLS', label: 'Excel' },
    xlsx: { color: '#16a34a', abbr: 'XLS', label: 'Excel' },
    ppt: { color: '#ea580c', abbr: 'PPT', label: 'PowerPoint' },
    pptx: { color: '#ea580c', abbr: 'PPT', label: 'PowerPoint' },
    pptm: { color: '#ea580c', abbr: 'PPT', label: 'PowerPoint' },
    docm: { color: '#2563eb', abbr: 'DOC', label: 'Word' },
    xlsm: { color: '#16a34a', abbr: 'XLS', label: 'Excel' },
    png: { color: '#e11d48', abbr: 'PNG', label: 'Image' },
    jpg: { color: '#e11d48', abbr: 'JPG', label: 'Image' },
    jpeg: { color: '#e11d48', abbr: 'JPG', label: 'Image' },
    gif: { color: '#e11d48', abbr: 'GIF', label: 'Image' },
    webp: { color: '#e11d48', abbr: 'WEBP', label: 'Image' },
    txt: { color: '#6b7280', abbr: 'TXT', label: 'Text' },
    csv: { color: '#0891b2', abbr: 'CSV', label: 'CSV' },
    zip: { color: '#ca8a04', abbr: 'ZIP', label: 'Archive' },
    rar: { color: '#ca8a04', abbr: 'RAR', label: 'Archive' },
    '7z': { color: '#ca8a04', abbr: '7Z', label: 'Archive' },
    tar: { color: '#ca8a04', abbr: 'TAR', label: 'Archive' },
    gz: { color: '#ca8a04', abbr: 'GZ', label: 'Archive' },
    json: { color: '#7c3aed', abbr: 'JSON', label: 'JSON' },
    xml: { color: '#7c3aed', abbr: 'XML', label: 'XML' },
    md: { color: '#374151', abbr: 'MD', label: 'Markdown' },
    rtf: { color: '#6b7280', abbr: 'RTF', label: 'Rich Text' },
    odt: { color: '#2563eb', abbr: 'ODT', label: 'Document' },
    ods: { color: '#16a34a', abbr: 'ODS', label: 'Spreadsheet' },
    odp: { color: '#ea580c', abbr: 'ODP', label: 'Presentation' },
    mp4: { color: '#db2777', abbr: 'MP4', label: 'Video' },
    webm: { color: '#db2777', abbr: 'WEB', label: 'Video' },
    mov: { color: '#db2777', abbr: 'MOV', label: 'Video' },
    avi: { color: '#db2777', abbr: 'AVI', label: 'Video' },
    mkv: { color: '#db2777', abbr: 'MKV', label: 'Video' },
    ogv: { color: '#db2777', abbr: 'OGV', label: 'Video' },
};

const DEFAULT_META = { color: '#6366f1', abbr: 'FILE', label: 'File' };

export function getFileExtension(filename) {
    if (!filename || typeof filename !== 'string') return '';
    const base = filename.split('?')[0].split('#')[0].replace(/\\/g, '/').split('/').pop() || '';
    const parts = base.split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : '';
}

export function getFileTypeMeta(filenameOrExt) {
    const ext = filenameOrExt?.includes?.('.')
        ? getFileExtension(filenameOrExt)
        : (filenameOrExt || '').toLowerCase();
    return FILE_TYPE_MAP[ext] || DEFAULT_META;
}

export function isImageFile(file) {
    if (!file) return false;
    if (file.type?.startsWith('image/')) return true;
    const ext = getFileExtension(file.name);
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
}

export function isVideoFile(file) {
    if (!file) return false;
    if (file.type?.startsWith('video/')) return true;
    const ext = getFileExtension(file.name);
    return ['mp4', 'webm', 'mov', 'avi', 'mkv', 'ogv'].includes(ext);
}

export const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
export const FILE_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'zip', 'rar', '7z', 'tar', 'gz', 'json', 'xml', 'md', 'rtf', 'odt', 'ods', 'odp'];
export const VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov', 'avi', 'mkv', 'ogv'];
