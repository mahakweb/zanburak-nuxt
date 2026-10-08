/**
 * Removes stray full-page overlays left by Flowbite drawers or other modals.
 * Flowbite only removes the first [drawer-backdrop] on hide; orphaned backdrops
 * can cover the entire page with a gray semi-transparent layer.
 */
export function cleanupStuckOverlays() {
    if (typeof document === "undefined") return;

    document.querySelectorAll("[drawer-backdrop]").forEach((el) => {
        el.remove();
    });

    document.body.classList.remove("overflow-hidden");

    if (document.body.style.overflow === "hidden") {
        document.body.style.overflow = "";
    }
}
