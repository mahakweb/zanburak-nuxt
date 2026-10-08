export function extractPermissionNames(user) {
    if (!user) return [];
    const perms = Array.isArray(user.permissions) ? user.permissions : [];
    return perms.map(p => (typeof p === 'string' ? p : p?.name)).filter(Boolean);
}

export function extractRoleNames(user) {
    if (!user) return [];
    const roles = Array.isArray(user.roles) ? user.roles : [];
    return roles.map(r => (typeof r === 'string' ? r : r?.name)).filter(Boolean);
}

export function isSuperUser(user) {
    // return !!(user?.is_superuser || user?.is_staff || extractRoleNames(user).includes('administrator'));
    return !!(user?.is_superuser);
}

export function hasAnyPermission(user, required) {
    if (!required || (Array.isArray(required) && required.length === 0)) return true;
    if (isSuperUser(user)) return true;
    const need = Array.isArray(required) ? required : [required];
    const userPerms = extractPermissionNames(user);
    return need.some(p => userPerms.includes(p));
}

/** همه پرمیشن‌ها لازم است (AND) */
export function hasAllPermissions(user, required) {
    if (!required || (Array.isArray(required) && required.length === 0)) return true;
    if (isSuperUser(user)) return true;
    const need = Array.isArray(required) ? required : [required];
    const userPerms = extractPermissionNames(user);
    return need.every(p => userPerms.includes(p));
}


export function hasAnyRole(user, requiredRoles) {
    if (!requiredRoles || (Array.isArray(requiredRoles) && requiredRoles.length === 0)) return true;
    if (isSuperUser(user)) return true;
    const need = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    const userRoles = extractRoleNames(user).map(r => (typeof r === 'string' ? r.toLowerCase() : r));
    const required = need.map(r => (typeof r === 'string' ? r.toLowerCase() : r));
    return required.some(r => userRoles.includes(r));
}

/**
 * بررسی اینکه آیا کاربر دسترسی به یک permission خاص دارد
 * این تابع برای استفاده مستقیم در کد (بدون composable) مناسب است
 * 
 * @param {Object} user - شیء کاربر
 * @param {string} permission - نام permission
 * @returns {boolean}
 * 
 * @example
 * const user = store.state.auth.status.userInfo;
 * if (hasPermission(user, 'users.create')) {
 *   // کاربر دسترسی دارد
 * }
 */
export function hasPermission(user, permission) {
    if (!permission) return true;
    if (isSuperUser(user)) return true;
    const userPerms = extractPermissionNames(user);
    return userPerms.includes(permission);
}

/**
 * بررسی اینکه آیا کاربر یک نقش خاص دارد
 * این تابع برای استفاده مستقیم در کد (بدون composable) مناسب است
 * 
 * @param {Object} user - شیء کاربر
 * @param {string} role - نام نقش
 * @returns {boolean}
 * 
 * @example
 * const user = store.state.auth.status.userInfo;
 * if (hasRole(user, 'admin')) {
 *   // کاربر نقش admin دارد
 * }
 */
export function hasRole(user, role) {
    if (!role) return true;
    if (isSuperUser(user)) return true;
    const userRoles = extractRoleNames(user).map(r => (typeof r === 'string' ? r.toLowerCase() : r));
    return userRoles.includes(role.toLowerCase());
}

/**
 * جمع‌آوری اتحاد همه meta.can مسیرهای /admin (به‌جز admin-forbidden)
 * @param {import('vue-router').RouteRecordRaw[]|import('vue-router').RouteRecordNormalized[]} routeConfigs
 * @returns {string[]}
 */
export function collectAdminPermissions(routeConfigs) {
    const perms = new Set();
    for (const route of routeConfigs) {
        if (typeof route.path !== 'string' || !route.path.startsWith('/admin')) continue;
        if (route.name === 'admin-forbidden') continue;
        const can = route.meta?.can;
        if (!can) continue;
        const list = Array.isArray(can) ? can : [can];
        list.forEach((p) => perms.add(p));
    }
    return [...perms];
}

/**
 * آیا کاربر اصلاً حق ورود به ناحیه ادمین را دارد؟
 * (superuser یا حداقل یکی از پرمیشن‌های تعریف‌شده روی routeهای admin)
 */
export function canAccessAdminArea(user, allAdminPermissions) {
    if (!user) return false;
    if (isSuperUser(user)) return true;
    if (extractPermissionNames(user).length === 0) return false;
    if (!allAdminPermissions?.length) return false;
    return hasAnyPermission(user, allAdminPermissions);
}

/** دامنه‌های محتوایی که از API در user.scopes می‌آیند */
export const CONTENT_SCOPE_DOMAINS = [
    'courses',
    'comments',
    'articles',
    'payments',
    'certificates',
    'quizzes',
    'analytics',
];

export function extractContentScopes(user) {
    if (!user?.scopes || typeof user.scopes !== 'object') return {};
    return user.scopes;
}

export function getContentScope(user, domain) {
    if (isSuperUser(user)) return 'any';
    return extractContentScopes(user)[domain] || 'none';
}

export function hasContentScopeAny(user, domain) {
    return getContentScope(user, domain) === 'any';
}

export function hasContentScopeOwn(user, domain) {
    return getContentScope(user, domain) === 'own';
}

export function hasContentScope(user, domain) {
    const scope = getContentScope(user, domain);
    return scope === 'any' || scope === 'own';
}

