function toolbarIcon(paths) {
    return `<svg class="zan-toolbar-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}

export const EDITOR_TOOLBAR_ICONS = [
    {
        type: 'bold',
        svg: toolbarIcon('<path d="M6 4h7a4 4 0 0 1 0 8H6z"/><path d="M6 12h8a4 4 0 0 1 0 8H6z"/>'),
    },
    {
        type: 'italic',
        svg: toolbarIcon('<path d="M19 4h-9"/><path d="M14 20H5"/><path d="M15 4 9 20"/>'),
    },
    {
        type: 'inline-code',
        svg: toolbarIcon('<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>'),
    },
    {
        type: 'emoji',
        svg: toolbarIcon('<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01"/><path d="M15 9h.01"/>'),
    },
    {
        type: 'link',
        svg: toolbarIcon('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>'),
    },
    {
        type: 'quote',
        svg: toolbarIcon('<path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z"/>'),
    },
    {
        type: 'code',
        svg: toolbarIcon('<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>'),
    },
    {
        type: 'draw-table',
        svg: toolbarIcon('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/>'),
    },
    {
        type: 'align-right',
        svg: toolbarIcon('<path d="M21 6H9"/><path d="M21 12H5"/><path d="M21 18H11"/>'),
    },
    {
        type: 'align-left',
        svg: toolbarIcon('<path d="M3 6h12"/><path d="M3 12h16"/><path d="M3 18h10"/>'),
    },
    {
        type: 'text-color',
        svg: toolbarIcon('<path d="M4 20h16"/><path d="m6 16 6-12 6 12"/><path d="M8 12h8"/>'),
    },
    {
        type: 'bg-color',
        svg: toolbarIcon('<path d="m9 11-6 6v3h9l-3-9"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/>'),
    },
    {
        type: 'font-size',
        svg: toolbarIcon('<polyline points="4 7 4 4 14 4 14 7"/><line x1="9" y1="4" x2="9" y2="20"/><line x1="6" y1="20" x2="12" y2="20"/><polyline points="15 11 15 9 21 9 21 11"/><line x1="18" y1="9" x2="18" y2="20"/><line x1="16" y1="20" x2="20" y2="20"/>'),
    },
    {
        type: 'uploadImage',
        svg: toolbarIcon('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>'),
    },
    {
        type: 'uploadVideo',
        svg: toolbarIcon('<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>'),
    },
    {
        type: 'image',
        svg: toolbarIcon('<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>'),
    },
    {
        type: 'ordered-list',
        svg: toolbarIcon('<path d="M10 6h11"/><path d="M10 12h11"/><path d="M10 18h11"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>'),
    },
    {
        type: 'unordered-list',
        svg: toolbarIcon('<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><circle cx="4" cy="6" r="1.25"/><circle cx="4" cy="12" r="1.25"/><circle cx="4" cy="18" r="1.25"/>'),
    },
    {
        type: 'heading',
        svg: toolbarIcon('<path d="M4 12h16"/><path d="M4 18V6"/><path d="M20 18V6"/>'),
    },
    {
        type: 'line-height',
        svg: toolbarIcon('<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h10"/><path d="M19 16v4"/><path d="M21 18h-4"/>'),
    },
    {
        type: 'horizontal-rule',
        svg: toolbarIcon('<path d="M4 8h16"/><path d="M4 16h16"/>'),
    },
    {
        type: 'preview',
        svg: toolbarIcon('<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>'),
    },
    {
        type: 'redo',
        svg: toolbarIcon('<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>'),
    },
    {
        type: 'undo',
        svg: toolbarIcon('<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>'),
    },
    {
        type: 'guide',
        svg: `<svg class="zan-toolbar-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
            <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="currentColor"/>
            <path d="M5.47875 19.5818L9.75149 15.309C9.3348 15.0254 8.97447 14.6651 8.69079 14.2484L4.41807 18.5211C4.74471 18.9005 5.09934 19.2551 5.47875 19.5818Z" fill="currentColor"/>
            <path d="M4.41797 5.47912L8.6907 9.75185C8.97436 9.33516 9.33468 8.97485 9.75136 8.69119L5.47863 4.41846C5.09922 4.74509 4.7446 5.09971 4.41797 5.47912Z" fill="currentColor"/>
            <path d="M14.2479 8.69128L18.5206 4.41856C18.9 4.7452 19.2547 5.09982 19.5813 5.47924L15.3085 9.75198C15.0249 9.33529 14.6646 8.97496 14.2479 8.69128Z" fill="currentColor"/>
            <path d="M19.5812 18.521L15.3084 14.2483C15.0248 14.665 14.6645 15.0253 14.2478 15.3089L18.5205 19.5817C18.8999 19.255 19.2545 18.9004 19.5812 18.521Z" fill="currentColor"/>
        </svg>`,
    },
];
