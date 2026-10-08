import { watch } from 'vue';
import { useStore } from '@/composables/useStore';
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

function apply(el, binding, store) {
    const user = store.state.auth.status.userInfo;
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
        const store = useStore();
        apply(el, binding, store);
        el._vCanStop = watch(
            () => store.state.auth.status.userInfo,
            () => apply(el, binding, store),
            { deep: true },
        );
    },
    updated(el, binding) {
        apply(el, binding, useStore());
    },
    unmounted(el) {
        el._vCanStop?.();
    },
};
