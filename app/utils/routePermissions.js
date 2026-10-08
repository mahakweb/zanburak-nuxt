import { hasAnyPermission, canAccessAdminArea, collectAdminPermissions, isSuperUser } from '@/utils/acl';
import { ROUTE_META } from '@/utils/routeMeta';

let adminAreaPermissionsCache = null;

function legacyMetaRoutes() {
  return Object.entries(ROUTE_META).map(([name, meta]) => ({
    name,
    path: name.startsWith('admin') || name === 'admin-forbidden' ? `/admin/${name}` : '/',
    meta,
  }));
}

export function getAdminAreaPermissions() {
  if (!adminAreaPermissionsCache) {
    adminAreaPermissionsCache = collectAdminPermissions(legacyMetaRoutes());
  }
  return adminAreaPermissionsCache;
}

/**
 * پرمیشن‌های لازم برای یک route (از meta.can در router)
 * @param {string} routeName
 * @returns {string[]|null}
 */
export function getRoutePermissions(routeName) {
  if (!routeName) return null;
  const can = ROUTE_META[routeName]?.can;
  if (!can) return null;
  return Array.isArray(can) ? can : [can];
}

export function isRouteSuperuserOnly(routeName) {
  if (!routeName) return false;
  return !!ROUTE_META[routeName]?.superuserOnly;
}

/**
 * آیا کاربر به route دسترسی دارد؟
 * اگر route پرمیشن نداشته باشد، true برمی‌گرداند.
 */
export function canAccessRoute(user, routeName) {
  if (isRouteSuperuserOnly(routeName)) {
    return isSuperUser(user);
  }
  const required = getRoutePermissions(routeName);
  if (!required || required.length === 0) return true;
  return hasAnyPermission(user, required);
}

/**
 * اگر کاربر به مسیر دسترسی نداشته باشد، مقصد ریدایرکت را برمی‌گرداند.
 * @returns {import('vue-router').RouteLocationRaw|null}
 */
export function getRouteAccessRedirect(user, to) {
  const matchedMeta = to.matched?.length
    ? to.matched.map((r) => ({ ...(ROUTE_META[r.name] || {}), ...r.meta }))
    : [ROUTE_META[to.name] || {}];

  if (!matchedMeta.some((meta) => meta?.requiresAuth)) return null;

  if (to.path.startsWith('/admin') && !canAccessAdminArea(user, getAdminAreaPermissions())) {
    return { name: 'NotFound' };
  }

  if (matchedMeta.some((meta) => meta?.superuserOnly) && !isSuperUser(user)) {
    return { name: 'admin-forbidden', query: { from: to.fullPath } };
  }

  const required = matchedMeta.map((meta) => meta?.can).filter(Boolean).flat();
  if (required.length > 0 && !hasAnyPermission(user, required)) {
    if (to.path.startsWith('/admin')) {
      return { name: 'admin-forbidden', query: { from: to.fullPath } };
    }
    return { name: 'NotFound' };
  }

  return null;
}
