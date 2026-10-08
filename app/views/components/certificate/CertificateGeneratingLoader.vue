<template>
    <div class="cert-loader flex flex-col items-center justify-center gap-5 py-8 px-6">
        <div class="relative">
            <div class="cert-loader-ring"></div>
            <div class="cert-loader-icon">
                <svg class="w-8 h-8 text-yellow-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M10 6H14C16.8284 6 18.2426 6 19.1213 6.87868C20 7.75736 20 9.17157 20 12V13.0557C20 15.4614 20 16.6642 19.4026 17.6308C18.8052 18.5974 17.7294 19.1353 15.5777 20.2111C13.8221 21.089 12.9443 21.5279 12 21.5279C11.0557 21.5279 10.1779 21.089 8.42229 20.2111C6.27063 19.1353 5.19479 18.5974 4.5974 17.6308C4 16.6642 4 15.4614 4 13.0557V12C4 9.17157 4 7.75736 4.87868 6.87868C5.75736 6 7.17157 6 10 6Z"
                        fill="currentColor" />
                </svg>
            </div>
        </div>
        <div class="text-center space-y-1.5">
            <p class="text-sm font-bold text-gray-800 dark:text-gray-100">{{ title }}</p>
            <p v-if="subtitle" class="text-xs text-gray-500 dark:text-gray-400">{{ subtitle }}</p>
        </div>
        <div class="flex gap-1">
            <span v-for="i in 3" :key="i" class="cert-loader-dot" :style="{ animationDelay: `${(i - 1) * 0.15}s` }"></span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: { type: String, default: '' },
        subtitle: { type: String, default: '' },
    },
};
</script> 

<style scoped>
.cert-loader-ring {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    border: 3px solid rgba(250, 204, 21, 0.2);
    border-top-color: #facc15;
    animation: cert-spin 0.9s linear infinite;
}
.cert-loader-icon {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}
.cert-loader-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #facc15;
    animation: cert-bounce 1s ease-in-out infinite;
}
@keyframes cert-spin {
    to { transform: rotate(360deg); }
}
@keyframes cert-bounce {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
    40% { transform: scale(1); opacity: 1; }
}
</style>
