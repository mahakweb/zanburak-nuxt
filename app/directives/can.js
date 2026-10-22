import { watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { hasAnyPermission, hasAllPermissions } from '@/utils/acl';

function resolveRequired(binding) {
    const { value, modifiers } = binding;
    if (value == null || value === '') return { required: null, mode: 'any' };
    const mode = modifiers.all ? 'all' : 'any';
    return { required: value, mode };
}

function isAllowed(user, required, mode) {
    if (!required || (Array.isArray(required) && required.length === 0)) return true;
    return mode === 'all'
        ? hasAllPermissions(user, required)
        : hasAnyPermission(user, required);
}

function apply(el, binding, auth) {
    const user = auth.status.userInfo;
    const { required, mode } = resolveRequired(binding);
    const allowed = isAllowed(user, required, mode);

    if (!allowed) {
        if (el._vCanDisplay === undefined) {
            el._vCanDisplay = el.style.display || '';
        }
        el.style.display = 'none';
    } else if (el._vCanDisplay !== undefined) {
        el.style.display = el._vCanDisplay;
    } else {
        el.style.display = '';
    }
}

/**
 * مخفی کردن المنت اگر کاربر پرمیشن نداشته باشد
 */
export default {
    getSSRProps(binding) {
        // Keep elements visible during SSR; client mount applies real ACL hide.
        return {}
    },
    mounted(el, binding) {
        const auth = useAuthStore();
        apply(el, binding, auth);
        el._vCanStop = watch(
            () => auth.status.userInfo,
            () => apply(el, binding, auth),
            { deep: true },
        );
    },
    updated(el, binding) {
        apply(el, binding, useAuthStore());
    },
    unmounted(el) {
        el._vCanStop?.();
    },
};
