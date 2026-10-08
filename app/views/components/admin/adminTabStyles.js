export const ADMIN_TAB_LIST =
    'inline-flex gap-0.5 p-1 rounded-xl bg-gray-100/90 dark:bg-gray-800/70 border border-gray-200/60 dark:border-gray-700/50';

export const ADMIN_TAB_BUTTON =
    'shrink-0 relative text-xs md:text-sm font-semibold px-3.5 py-2 rounded-lg whitespace-nowrap inline-flex items-center gap-1.5 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-amber-400/40';

export const adminTabButtonClass = (selected) => [
    ADMIN_TAB_BUTTON,
    selected
        ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-200/80 dark:ring-gray-600/70'
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/60 dark:hover:bg-gray-700/40',
];

export const ADMIN_TAB_BADGE =
    'bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center font-anjoman';
