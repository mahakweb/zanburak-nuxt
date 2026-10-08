/** Reset horizontal scroll to line start (fixes RTL pages showing line end first). */
export function resetCodeBlockScroll(pre) {
    if (!pre) return;
    const reset = () => {
        pre.scrollLeft = 0;
    };
    reset();
    requestAnimationFrame(reset);
}

export function prepareCodeBlocks(root) {
    if (!root) return;
    root.querySelectorAll('pre').forEach((pre) => {
        pre.classList.add('zan-code-block', 'custom-scrollbar');
        resetCodeBlockScroll(pre);
    });
}
