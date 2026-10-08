<template>
    <div class="relative overflow-hidden h-96 lg:h-[29rem] bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
        <SeoImage
            v-if="poster"
            :src="poster"
            :alt="posterAlt || ''"
            :width="1280"
            :height="720"
            sizes-preset="hero"
            :priority="true"
            img-class="absolute inset-0 w-full h-full object-cover opacity-20"
            picture-class="absolute inset-0 block w-full h-full"
        />
        <div class="absolute inset-0 flex items-center justify-center p-4 md:p-6">
            <div
                class="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/85 backdrop-blur-md px-6 py-8 text-center text-white shadow-2xl space-y-5">
                <div v-if="$slots.icon" class="flex justify-center">
                    <slot name="icon" />
                </div>
                <p class="text-sm md:text-base font-medium leading-relaxed text-gray-100">{{ message }}</p>
                <div class="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
                    <slot name="actions" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SeoImage from "@/views/components/seo/SeoImage.vue";

export default {
    components: { SeoImage },
    props: {
        poster: { type: String, default: null },
        posterAlt: { type: String, default: '' },
        message: { type: String, required: true },
    },
};
</script>
