import { canAccessRoute } from '@/utils/routePermissions';

/** مسیرهای میانبر پروفایل — فقط موارد پرکاربرد، به ترتیب اولویت */
export const ADMIN_PROFILE_QUICK_ROUTES = [
    'admin-index',
    'admin-courses-list',
    'admin-sales-report',
    'admin-comments',
    'admin-users-list',
    'admin-payments-list',
];

export function canSeeAdminRoute(user, routeName) {
    if (!routeName) return false;
    return canAccessRoute(user, routeName);
}

function findMenuLinkEntry(items, routeName) {
    for (const item of items) {
        if (item.link === routeName) {
            return { key: item.key, title: item.title, link: item.link, icon: item.icon };
        }
        if (item.submenu?.length) {
            const sub = item.submenu.find((s) => s.link === routeName);
            if (sub) {
                return { key: sub.key, title: sub.title, link: sub.link, icon: sub.icon || item.icon };
            }
        }
    }
    return null;
}

export function getAccessibleAdminQuickLinks(user, items, routes = ADMIN_PROFILE_QUICK_ROUTES) {
    return routes
        .map((routeName) => {
            if (!canSeeAdminRoute(user, routeName)) return null;
            const entry = findMenuLinkEntry(items, routeName);
            if (!entry?.link) return null;
            return entry;
        })
        .filter(Boolean);
}

export function filterAdminMenuByPermission(user, items) {
    return items
        .map((item) => {
            if (item.submenu?.length) {
                const submenu = item.submenu.filter((sub) => canSeeAdminRoute(user, sub.link));
                if (submenu.length === 0) return null;
                return { ...item, submenu };
            }
            if (item.link && !canSeeAdminRoute(user, item.link)) return null;
            return item;
        })
        .filter(Boolean);
}
