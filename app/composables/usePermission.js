import { computed } from 'vue';
import { useStore } from '@/composables/useStore';
import { useRouter } from 'vue-router';
import { hasAnyPermission, hasAllPermissions, hasAnyRole, isSuperUser, extractPermissionNames, extractRoleNames, canAccessAdminArea, getContentScope, hasContentScopeAny, hasContentScopeOwn, hasContentScope } from '@/utils/acl';
import { canAccessRoute, getAdminAreaPermissions } from '@/utils/routePermissions';

/**
 * Composable برای بررسی دسترسی‌ها و نقش‌های کاربر
 * 
 * @example
 * // در یک کامپوننت:
 * import { usePermission } from '@/composables/usePermission';
 * 
 * const { can, hasRole, checkPermission, redirectIfNoPermission } = usePermission();
 * 
 * // بررسی دسترسی
 * if (can('users.create')) {
 *   // نمایش دکمه ایجاد کاربر
 * }
 * 
 * // بررسی نقش
 * if (hasRole('admin')) {
 *   // نمایش بخش ادمین
 * }
 * 
 * // بررسی و ریدایرکت در صورت نداشتن دسترسی
 * checkPermission('users.view', () => {
 *   // کد در صورت داشتن دسترسی
 * }, () => {
 *   // کد در صورت نداشتن دسترسی
 * });
 * 
 * // ریدایرکت خودکار به 403 در صورت نداشتن دسترسی
 * redirectIfNoPermission('users.create');
 */
export function usePermission() {
    const store = useStore();
    const router = useRouter();

    // دریافت اطلاعات کاربر از store
    const user = computed(() => store.state.auth.status.userInfo);
    const isLoggedIn = computed(() => store.state.auth.status.loggedIn);

    /**
     * بررسی دسترسی کاربر به یک یا چند permission
     * @param {string|string[]} required - نام permission یا آرایه‌ای از permission ها
     * @returns {boolean}
     */
    const can = (required) => {
        if (!isLoggedIn.value || !user.value) return false;
        return hasAnyPermission(user.value, required);
    };

    /** همه پرمیشن‌ها لازم است (AND) */
    const canAll = (required) => {
        if (!isLoggedIn.value || !user.value) return false;
        return hasAllPermissions(user.value, required);
    };

    /** دسترسی به route بر اساس meta.can در router */
    const canRoute = (routeName) => {
        if (!isLoggedIn.value || !user.value) return false;
        return canAccessRoute(user.value, routeName);
    };

    /** آیا کاربر اصلاً حق ورود به ناحیه /admin را دارد؟ */
    const canAccessAdmin = () => {
        if (!isLoggedIn.value || !user.value) return false;
        return canAccessAdminArea(user.value, getAdminAreaPermissions());
    };

    /**
     * بررسی نقش کاربر
     * @param {string|string[]} requiredRoles - نام نقش یا آرایه‌ای از نقش‌ها
     * @returns {boolean}
     */
    const hasRole = (requiredRoles) => {
        if (!isLoggedIn.value || !user.value) return false;
        return hasAnyRole(user.value, requiredRoles);
    };

    /**
     * بررسی اینکه آیا کاربر superuser است
     * @returns {boolean}
     */
    const isSuper = () => {
        if (!isLoggedIn.value || !user.value) return false;
        return isSuperUser(user.value);
    };

    /**
     * دریافت لیست تمام permission های کاربر
     * @returns {string[]}
     */
    const permissions = computed(() => {
        if (!user.value) return [];
        return extractPermissionNames(user.value);
    });

    /**
     * دریافت لیست تمام role های کاربر
     * @returns {string[]}
     */
    const roles = computed(() => {
        if (!user.value) return [];
        return extractRoleNames(user.value);
    });

    /**
     * بررسی دسترسی و اجرای callback مناسب
     * @param {string|string[]} required - permission مورد نیاز
     * @param {Function} onAllowed - callback در صورت داشتن دسترسی
     * @param {Function} onDenied - callback در صورت نداشتن دسترسی
     */
    const checkPermission = (required, onAllowed = null, onDenied = null) => {
        if (can(required)) {
            if (onAllowed && typeof onAllowed === 'function') {
                onAllowed();
            }
            return true;
        } else {
            if (onDenied && typeof onDenied === 'function') {
                onDenied();
            }
            return false;
        }
    };

    /**
     * بررسی دسترسی و ریدایرکت به صفحه 403 در صورت نداشتن دسترسی
     * @param {string|string[]} required - permission مورد نیاز
     * @param {boolean} redirectTo403 - آیا به صفحه 403 ریدایرکت شود (پیش‌فرض: true)
     * @returns {boolean} - true اگر دسترسی دارد، false در غیر این صورت
     */
    const redirectIfNoPermission = (required, redirectTo403 = true) => {
        if (can(required)) {
            return true;
        }

        if (redirectTo403 && isLoggedIn.value) {
            if (router.currentRoute.value.path.startsWith('/admin') && canAccessAdmin()) {
                router.push({
                    name: 'admin-forbidden',
                    query: { from: router.currentRoute.value.fullPath },
                });
            } else {
                router.push({ name: 'NotFound' });
            }
        }

        return false;
    };

    /**
     * بررسی نقش و ریدایرکت در صورت نداشتن نقش
     * @param {string|string[]} requiredRoles - نقش مورد نیاز
     * @param {boolean} redirectTo403 - آیا به صفحه 403 ریدایرکت شود (پیش‌فرض: true)
     * @returns {boolean} - true اگر نقش دارد، false در غیر این صورت
     */
    const redirectIfNoRole = (requiredRoles, redirectTo403 = true) => {
        if (hasRole(requiredRoles)) {
            return true;
        }

        if (redirectTo403 && isLoggedIn.value) {
            if (router.currentRoute.value.path.startsWith('/admin') && canAccessAdmin()) {
                router.push({
                    name: 'admin-forbidden',
                    query: { from: router.currentRoute.value.fullPath },
                });
            } else {
                router.push({ name: 'NotFound' });
            }
        }

        return false;
    };

    const contentScopes = computed(() => user.value?.scopes || {});

    const scope = (domain) => getContentScope(user.value, domain);
    const scopeAny = (domain) => hasContentScopeAny(user.value, domain);
    const scopeOwn = (domain) => hasContentScopeOwn(user.value, domain);
    const hasScope = (domain) => hasContentScope(user.value, domain);

    return {
        // Computed properties
        user,
        isLoggedIn,
        permissions,
        roles,
        contentScopes,

        // Methods
        can,
        canAll,
        canRoute,
        canAccessAdmin,
        hasRole,
        isSuper,
        scope,
        scopeAny,
        scopeOwn,
        hasScope,
        checkPermission,
        redirectIfNoPermission,
        redirectIfNoRole,
    };
}

