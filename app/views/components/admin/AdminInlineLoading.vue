<template>
    <div
        class="bg-yellow-100 dark:bg-yellow-400/20 dark:text-slate-200 text-slate-600 border border-dashed border-yellow-300 dark:border-yellow-500/40 rounded-xl p-4 font-semibold flex items-center gap-2 mb-4"
    >
        <svg class="w-8 h-8 shrink-0" viewBox="25 25 50 50" xmlns="http://www.w3.org/2000/svg">
            <circle class="stroke-current text-yellow-500 opacity-30" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dasharray="200, 300" />
            <circle class="stroke-current text-yellow-500" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dasharray="100, 200">
                <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="stroke-dashoffset" values="0;-30;-124" dur="1.25s" repeatCount="indefinite" />
                <animate attributeName="stroke-dasharray" values="0,200;110,200;110,200" dur="1.25s" repeatCount="indefinite" />
            </circle>
        </svg>
        <p class="text-sm">{{ message }}</p>
    </div>
</template>

<script>
export default {
    name: "AdminInlineLoading",
    props: {
        message: { type: String, default: "در حال دریافت اطلاعات از سرور، لطفا منتظر بمانید..." },
    },
};
</script>
