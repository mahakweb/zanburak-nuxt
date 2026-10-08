<template>
    <div :class="wrapClass" aria-hidden="true">
        <svg :class="svgClass" viewBox="0 0 40 48" fill="none">
            <path
                fill="#E5E7EB"
                d="M8 5.2C8 3.7 9.2 2.5 10.7 2.5H24.2L34.5 12.8V42.3c0 1.5-1.2 2.7-2.7 2.7H10.7C9.2 45 8 43.8 8 42.3V5.2Z"
            />
            <path fill="#D1D5DB" d="M24.2 2.5V11.2c0 .9.7 1.6 1.6 1.6h8.7L24.2 2.5Z" />
            <path fill="#C4C9D1" d="M24.2 2.5 34.5 12.8h-1.2L24.8 4.3 24.2 2.5Z" />
        </svg>
        <span
            dir="ltr"
            lang="en"
            :class="badgeClass"
        >{{ label }}</span>
    </div>
</template>
<script>
import { getFileTypeMeta } from "@/utils/fileTypeMeta";
import { attachmentExtension } from "@/utils/attachmentDisplay";

export default {
    name: "FileExtBadgeIcon",
    props: {
        ext: {
            type: String,
            default: "",
        },
        file: {
            type: Object,
            default: null,
        },
        size: {
            type: String,
            default: "md",
        },
    },
    computed: {
        isLarge() {
            return this.size === "lg";
        },
        wrapClass() {
            return this.isLarge
                ? "file-ext-badge-icon relative w-16 h-[4.7rem] shrink-0"
                : "file-ext-badge-icon relative w-8 h-[2.35rem] shrink-0";
        },
        svgClass() {
            return this.isLarge ? "w-16 h-[4.7rem]" : "w-8 h-[2.35rem]";
        },
        badgeClass() {
            return this.isLarge
                ? "absolute bottom-3 -start-0.5 min-w-[2.1rem] h-[18px] px-1.5 rounded-[4px] text-[10px] font-sans font-extrabold text-gray-900 uppercase tracking-wide flex items-center justify-center bg-yellow-400 shadow-sm"
                : "absolute bottom-[7px] -start-0.5 min-w-[1.55rem] h-[13px] px-1 rounded-[3px] text-[8px] font-sans font-extrabold text-gray-900 uppercase tracking-wide flex items-center justify-center bg-yellow-400 shadow-sm";
        },
        cleanExt() {
            if (this.file) {
                return attachmentExtension(this.file);
            }
            return String(this.ext || "").replace(/^\./, "").toLowerCase();
        },
        label() {
            const meta = getFileTypeMeta(this.cleanExt);
            if (this.cleanExt && meta?.abbr && meta.abbr !== "FILE") {
                return meta.abbr;
            }
            const value = (this.cleanExt || "FILE").toUpperCase();
            return value.length > 4 ? value.slice(0, 4) : value;
        },
    },
};
</script>
