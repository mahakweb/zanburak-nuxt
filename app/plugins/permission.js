import { hasAnyPermission, hasAllPermissions, getContentScope, hasContentScopeAny, hasContentScopeOwn, hasContentScope } from '@/utils/acl';
import { canAccessRoute } from '@/utils/routePermissions';
import { useAuthStore } from '@/stores/auth';

export default defineNuxtPlugin((nuxtApp) => {
    const auth = useAuthStore();
    const getUser = () => auth.status.userInfo;

    nuxtApp.vueApp.config.globalProperties.$can = (required) => hasAnyPermission(getUser(), required);
    nuxtApp.vueApp.config.globalProperties.$canAll = (required) => hasAllPermissions(getUser(), required);
    nuxtApp.vueApp.config.globalProperties.$canRoute = (routeName) => canAccessRoute(getUser(), routeName);
    nuxtApp.vueApp.config.globalProperties.$scope = (domain) => getContentScope(getUser(), domain);
    nuxtApp.vueApp.config.globalProperties.$scopeAny = (domain) => hasContentScopeAny(getUser(), domain);
    nuxtApp.vueApp.config.globalProperties.$scopeOwn = (domain) => hasContentScopeOwn(getUser(), domain);
    nuxtApp.vueApp.config.globalProperties.$hasScope = (domain) => hasContentScope(getUser(), domain);

    nuxtApp.provide('can', (required) => hasAnyPermission(getUser(), required));
    nuxtApp.provide('canAll', (required) => hasAllPermissions(getUser(), required));
    nuxtApp.provide('canRoute', (routeName) => canAccessRoute(getUser(), routeName));
    nuxtApp.provide('scope', (domain) => getContentScope(getUser(), domain));
    nuxtApp.provide('scopeAny', (domain) => hasContentScopeAny(getUser(), domain));
    nuxtApp.provide('scopeOwn', (domain) => hasContentScopeOwn(getUser(), domain));
    nuxtApp.provide('hasScope', (domain) => hasContentScope(getUser(), domain));
});
