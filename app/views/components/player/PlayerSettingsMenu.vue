<template>
    <div class="zb-player-menu" :class="{ 'zb-player-glass-panel': !isMobile }" :dir="isRtl ? 'rtl' : 'ltr'">
        <!-- Submenu header with back -->
        <div v-if="view !== 'main'" class="flex items-center gap-2 mb-2.5 pb-2 border-b border-white/10">
            <button
                type="button"
                class="zb-player-menu__icon-btn"
                :aria-label="t('player.menuBack')"
                @click="handleBack"
            >
                <svg
                    class="w-4 h-4 zb-player-menu__back-icon"
                    :class="backIconClass"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            </button>
            <span class="text-xs font-semibold text-white">{{ viewTitle }}</span>
        </div>

        <div v-if="isMobile && view === 'main'" class="mb-2.5 pb-2 border-b border-white/10">
            <span class="text-xs font-bold text-white">{{ t('player.settings') }}</span>
        </div>

        <!-- Main menu -->
        <div v-if="view === 'main'" class="flex flex-col gap-1.5">
            <button
                v-if="showSegmentsEntry"
                type="button"
                class="zb-player-menu__row"
                @click="$emit('update:view', 'segments')"
            >
                <span class="zb-player-menu__label">{{ t('player.segments') }}</span>
                <span class="flex items-center gap-2">
                    <span v-if="currentSegmentLabel" class="zb-player-menu__badge zb-player-menu__badge--muted truncate max-w-[7rem]">{{ currentSegmentLabel }}</span>
                    <svg class="w-4 h-4 text-white/50 shrink-0 zb-player-menu__forward-icon" :class="forwardIconClass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6" /></svg>
                </span>
            </button>

            <button
                type="button"
                class="zb-player-menu__row"
                :class="{ 'opacity-50 cursor-not-allowed': qualityDisabled }"
                :disabled="qualityDisabled"
                @click="!qualityDisabled && $emit('update:view', 'quality')"
            >
                <span class="zb-player-menu__label">{{ t('player.quality') }}</span>
                <span class="flex items-center gap-2">
                    <span class="zb-player-menu__badge">{{ currentQualityLabel }}</span>
                    <svg class="w-4 h-4 text-white/50 shrink-0 zb-player-menu__forward-icon" :class="forwardIconClass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6" /></svg>
                </span>
            </button>

            <button type="button" class="zb-player-menu__row" @click="$emit('update:view', 'speed')">
                <span class="zb-player-menu__label">{{ t('player.speed') }}</span>
                <span class="flex items-center gap-2">
                    <span class="zb-player-menu__badge">{{ currentSpeedLabel }}</span>
                    <svg class="w-4 h-4 text-white/50 shrink-0 zb-player-menu__forward-icon" :class="forwardIconClass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6" /></svg>
                </span>
            </button>
        </div>

        <!-- Quality list -->
        <div v-else-if="view === 'quality'" class="flex flex-col gap-1 max-h-[14rem] overflow-y-auto custom-scrollbar">
            <button
                v-for="quality in qualities"
                :key="String(quality.value)"
                type="button"
                class="zb-player-menu__option"
                :class="{ 'zb-player-menu__option--active': currentQuality === quality.value }"
                @click="$emit('select-quality', quality)"
            >
                <span class="flex items-center gap-2.5 min-w-0">
                    <span class="zb-player-menu__radio" :class="{ 'zb-player-menu__radio--active': currentQuality === quality.value }">
                        <span v-if="currentQuality === quality.value" class="zb-player-menu__radio-dot" />
                    </span>
                    <span class="text-xs font-medium truncate">{{ quality.label }}</span>
                </span>
                <span v-if="qualityBadge(quality.height)" class="zb-player-menu__tag">{{ qualityBadge(quality.height) }}</span>
            </button>
        </div>

        <!-- Speed list -->
        <div v-else-if="view === 'speed'" class="flex flex-col gap-1">
            <button
                v-for="speed in speeds"
                :key="speed.value"
                type="button"
                class="zb-player-menu__option"
                :class="{ 'zb-player-menu__option--active': currentSpeed === speed.value }"
                @click="$emit('select-speed', speed.value)"
            >
                <span class="flex items-center gap-2.5">
                    <span class="zb-player-menu__radio" :class="{ 'zb-player-menu__radio--active': currentSpeed === speed.value }">
                        <span v-if="currentSpeed === speed.value" class="zb-player-menu__radio-dot" />
                    </span>
                    <span class="text-xs font-medium">{{ speed.label }}</span>
                </span>
            </button>
        </div>

        <!-- Segments list -->
        <div v-else-if="view === 'segments'" class="flex flex-col gap-1 max-h-[14rem] overflow-y-auto custom-scrollbar">
            <button
                v-for="(seg, idx) in segments"
                :key="idx"
                type="button"
                class="zb-player-menu__option zb-player-menu__option--segment"
                :class="{ 'zb-player-menu__option--active': currentSegmentIndex === idx }"
                @click="$emit('select-segment', seg, idx)"
            >
                <span class="zb-player-menu__time">{{ formatTime(seg.time) }}</span>
                <span class="text-xs font-medium truncate">{{ seg.label }}</span>
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
    view: { type: String, default: 'main' },
    isMobile: { type: Boolean, default: false },
    segmentsOnly: { type: Boolean, default: false },
    qualities: { type: Array, default: () => [] },
    speeds: { type: Array, default: () => [] },
    segments: { type: Array, default: () => [] },
    currentQuality: { type: [String, Number], default: 'auto' },
    currentSpeed: { type: Number, default: 1 },
    currentSegmentIndex: { type: Number, default: -1 },
    currentQualityLabel: { type: String, default: '' },
    currentSpeedLabel: { type: String, default: '' },
    qualityDisabled: { type: Boolean, default: false },
    showSegmentsEntry: { type: Boolean, default: true },
});

const emit = defineEmits(['update:view', 'select-quality', 'select-speed', 'select-segment', 'back']);

const { t } = useI18n();

const isRtl = computed(() => {
    try {
        return localStorage.getItem('direction') === 'rtl';
    } catch {
        return true;
    }
});

/** Back chevron: points toward start of reading direction */
const backIconClass = computed(() => (isRtl.value ? 'zb-player-menu__back-icon--rtl' : 'zb-player-menu__back-icon--ltr'));

/** Forward chevron: points toward end of reading direction */
const forwardIconClass = computed(() => (isRtl.value ? 'zb-player-menu__forward-icon--rtl' : 'zb-player-menu__forward-icon--ltr'));

const viewTitle = computed(() => {
    if (props.view === 'quality') return t('player.quality');
    if (props.view === 'speed') return t('player.speed');
    if (props.view === 'segments') return t('player.segments');
    return t('player.settings');
});

const currentSegmentLabel = computed(() => {
    if (props.currentSegmentIndex < 0 || !props.segments[props.currentSegmentIndex]) return '';
    return props.segments[props.currentSegmentIndex].label;
});

const handleBack = () => {
    if (props.segmentsOnly) {
        emit('back');
        return;
    }
    emit('update:view', 'main');
};

const qualityBadge = (height) => {
    if (height === 'auto') return 'AUTO';
    if (height >= 2160) return '4K';
    if (height >= 1440) return '2K';
    if (height >= 1080) return 'FHD';
    if (height >= 720) return 'HD';
    if (height >= 480) return 'SD';
    return null;
};

const formatTime = (sec) => {
    const s = Math.max(0, Math.floor(sec || 0));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const r = s % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return h > 0 ? `${pad(h)}:${pad(m)}:${pad(r)}` : `${pad(m)}:${pad(r)}`;
};
</script>

<style scoped>
.zb-player-menu__back-icon--ltr {
    transform: rotate(0deg);
}

.zb-player-menu__back-icon--rtl {
    transform: rotate(180deg);
}

.zb-player-menu__forward-icon--ltr {
    transform: rotate(180deg);
}

.zb-player-menu__forward-icon--rtl {
    transform: rotate(0deg);
}

.zb-player-menu {
    overflow: hidden;
}

.zb-player-menu__row {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.5rem 0.625rem;
    border-radius: 0.75rem;
    color: #fff;
    background: transparent;
    border: 1px solid transparent;
    transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.zb-player-menu__row:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.08);
}

.zb-player-menu__row:active {
    background: rgba(255, 255, 255, 0.14);
}

.zb-player-menu__label {
    font-size: 0.75rem;
    font-weight: 600;
}

.zb-player-menu__badge {
    font-size: 0.625rem;
    font-weight: 700;
    padding: 0 0.28rem;
    line-height: 1.35;
    border-radius: 0.25rem;
    background: #facc15;
    color: #111827;
}

.zb-player-menu__badge--muted {
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
    font-weight: 500;
    padding: 0 0.28rem;
}

.zb-player-menu__option {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.375rem;
    padding: 0.4rem 0.625rem;
    border-radius: 0.75rem;
    color: rgba(255, 255, 255, 0.94);
    background: transparent;
    border: 1px solid transparent;
    transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.zb-player-menu__option:hover {
    background: rgba(255, 255, 255, 0.1);
}

.zb-player-menu__option--active {
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
}

.zb-player-menu__option--segment {
    justify-content: flex-start;
    text-align: start;
}

.zb-player-menu__radio {
    width: 0.875rem;
    height: 0.875rem;
    border-radius: 9999px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.zb-player-menu__radio--active {
    border-color: #facc15;
    background: #facc15;
}

.zb-player-menu__radio-dot {
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 9999px;
    background: #111827;
}

.zb-player-menu__tag {
    font-size: 9px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 0.25rem;
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
}

.zb-player-menu__time {
    font-size: 10px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-weight: 600;
    padding: 0.125rem 0.375rem;
    border-radius: 0.375rem;
    background: rgba(0, 0, 0, 0.4);
    color: #facc15;
    flex-shrink: 0;
}

.zb-player-menu__icon-btn {
    padding: 0.375rem;
    border-radius: 0.5rem;
    color: rgba(255, 255, 255, 0.9);
    background: transparent;
    border: none;
    transition: background-color 0.15s ease, color 0.15s ease;
}

.zb-player-menu__icon-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
}
</style>
