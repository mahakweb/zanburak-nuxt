import adminBreadcrumbsConfig from "@/config/adminBreadcrumbs.json";

const FALLBACK_HOME = { label: "پنل مدیریت", route: "admin-index" };

/**
 * @param {string} routeName
 * @returns {{ title: string, subtitle?: string, breadcrumbs: Array }|null}
 */
export function getAdminBreadcrumbMeta(routeName) {
  if (!routeName) return null;
  return adminBreadcrumbsConfig[routeName] ?? null;
}

/**
 * @param {import('vue-router').RouteLocationNormalizedLoaded} route
 * @param {{ lastBreadcrumbLabel?: string }} [overrides]
 */
export function resolveAdminBreadcrumbItems(route, overrides = {}) {
  const meta = getAdminBreadcrumbMeta(route.name);
  const crumbs = meta?.breadcrumbs?.length
    ? [...meta.breadcrumbs]
    : [FALLBACK_HOME, { label: route.meta?.title || route.name || "صفحه" }];

  return crumbs.map((crumb, index) => {
    const isLast = index === crumbs.length - 1;
    let label = crumb.label;

    if (isLast && overrides.lastBreadcrumbLabel) {
      label = overrides.lastBreadcrumbLabel;
    }

    let href = null;
    if (!isLast && crumb.route) {
      href = { name: crumb.route };
      if (crumb.useRouteParams && route.params) {
        href.params = { ...route.params };
      }
      if (crumb.query && route.query) {
        href.query = { ...route.query, ...crumb.query };
      }
    }

    return { label, href };
  });
}

/**
 * @param {string} routeName
 * @param {{ titleOverride?: string, subtitleOverride?: string }} [overrides]
 */
export function resolveAdminPageHeader(routeName, overrides = {}) {
  const meta = getAdminBreadcrumbMeta(routeName);
  return {
    title: overrides.titleOverride ?? meta?.title ?? "پنل مدیریت",
    subtitle: overrides.subtitleOverride ?? meta?.subtitle ?? "",
  };
}
