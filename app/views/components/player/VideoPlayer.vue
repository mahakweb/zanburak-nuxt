<template>
    <div class="relative group/player">
        <vue-plyr ref="playerRef" :options="playerOptions">
            <video id="video" controls playsinline controlsList="nodownload" :data-poster="poster"></video>
        </vue-plyr>
        <Teleport v-if="props.title && showTitleOverlay && playerContainerEl" :to="playerContainerEl">
            <PlayerTitleBadge :title="props.title" />
        </Teleport>
        <PlayerMenuOverlay
            :open="menuOpen"
            :view="menuView"
            :is-mobile="isMobile"
            :teleport-target="playerContainerEl"
            :anchor-rect="menuAnchorRect"
            :segments-only="menuSegmentsOnly"
            :qualities="availableQualities"
            :speeds="availableSpeeds"
            :segments="segments"
            :current-quality="currentQuality"
            :current-speed="currentSpeed"
            :current-segment-index="currentSegmentIndex"
            :current-quality-label="getCurrentQualityLabel()"
            :current-speed-label="getCurrentSpeedLabel()"
            :quality-disabled="availableQualities.length <= 1"
            :show-segments-entry="segments.length > 0"
            @close="closeMenu"
            @update:view="menuView = $event"
            @select-quality="onSelectQuality"
            @select-speed="onSelectSpeed"
            @select-segment="onSelectSegment"
        />

        <teleport v-if="props.isEpisode && showEndPopup && playerContainerEl && props.nextEpisode" :to="playerContainerEl">
            <div class="zb-player-next-popup-wrap">
                <div class="zb-player-next-popup zb-player-glass-panel">
                    <div class="flex items-center gap-2.5 min-w-0">
                        <img
                            v-if="showNextPoster"
                            :src="props.nextEpisode.poster"
                            alt=""
                            class="zb-player-next-popup__poster"
                            @error="nextPosterFailed = true"
                        />
                        <div v-else class="zb-player-next-popup__poster-fallback" aria-hidden="true" />
                        <div class="flex flex-col gap-0.5 min-w-0">
                            <span class="font-medium text-[11px] line-clamp-1 text-white/60">{{ $t('player.nextEpisode', { order: props.nextEpisode.order }) }}</span>
                            <span class="font-bold text-xs line-clamp-2 text-white">{{ props.nextEpisode.title }}</span>
                        </div>
                    </div>
                    <button type="button" @click="goToNextEpisode" class="zb-player-next-popup__action">
                        {{ $t('player.watchAndPlay') }}
                    </button>
                </div>
                <button
                    type="button"
                    class="zb-player-next-popup__close zb-player-glass-panel"
                    :aria-label="$t('player.closeNextEpisode')"
                    @click="dismissEndPopup"
                >
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        </teleport>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed, defineAsyncComponent, defineComponent } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
// plyr touches document.createElement at module load — never import on server.
const VuePlyr = import.meta.server
    ? defineComponent({ name: "VuePlyrSSRStub", setup: () => () => null })
    : defineAsyncComponent(async () => {
        await import("vue-plyr/dist/vue-plyr.css");
        return (await import("vue-plyr")).default;
    });
import Hls from "hls.js";
import axiosInstance from "@/store/axiosInstance";
import config from "@/store/config";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import PlayerMenuOverlay from "@/views/components/player/PlayerMenuOverlay.vue";
import PlayerTitleBadge from "@/views/components/player/PlayerTitleBadge.vue";
import { extractVideoSegments } from "@/utils/videoSegments";

const props = defineProps({
    source: { type: String, required: true },
    title: { type: String, default: "" },
    poster: { type: String, default: "" },
    isLoggedIn: { type: Boolean, default: false },
    streamVideoId: { type: [Number, String], default: null },
    storageKey: { type: String, default: "zanburak-c-plyr" },
    autoplay: { type: Boolean, default: false },
    initialWatchedTimes: { type: Array, default: () => [] },
    initialFullWatched: { type: Boolean, default: false },
    // Optional: next episode info { title, poster, slug, link?, routeName? }
    nextEpisode: { type: Object, default: null },
    // Only show episode-specific UI (next popup, success toast) when true
    isEpisode: { type: Boolean, default: false },
    // Controls configurator: set false to hide an item
    // Keys: title, restart, play, rewind, fastForward, times, mute, volume, settings, fullscreen, overlaidPlay
    // Episode description with timestamp lines e.g. "05:30 Section title"
    description: { type: String, default: null },
    controlsConfig: { type: Object, default: () => ({}) },
});

const { t, locale } = useI18n();

const queryPlayerEl = (selector) => {
    const root = playerContainerEl.value
        || playerRef.value?.player?.elements?.container
        || playerRef.value?.$el;
    return root?.querySelector?.(selector) || null;
};

const MOBILE_BREAKPOINT = 1024;
const isMobile = ref(typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false);
const menuOpen = ref(false);
const menuView = ref('main');
const menuSegmentsOnly = ref(false);
const menuAnchorRect = ref(null);

const updateIsMobile = () => {
    isMobile.value = window.innerWidth < MOBILE_BREAKPOINT;
};

const openMenu = (mode = 'settings', view = 'main', event = null) => {
    menuSegmentsOnly.value = mode === 'segments';
    menuView.value = view;
    const btn = event?.currentTarget || queryPlayerEl(mode === 'segments' ? '.zb-segments-btn' : '.zb-settings-btn');
    menuAnchorRect.value = btn?.getBoundingClientRect?.() ?? null;
    menuOpen.value = true;
};

const closeMenu = () => {
    menuOpen.value = false;
    menuView.value = 'main';
    menuSegmentsOnly.value = false;
};

const onSelectQuality = (quality) => {
    selectQuality(String(quality.value));
    if (isMobile.value) menuView.value = 'main';
};

const onSelectSpeed = (speedValue) => {
    selectSpeed(speedValue);
    if (isMobile.value) menuView.value = 'main';
};

const onSelectSegment = (seg) => {
    if (seg && playerRef.value?.player) {
        playerRef.value.player.currentTime = seg.time;
    }
    closeMenu();
};

// Custom controls layout
const controls = computed(() => `
<div class="plyr__controls">
    <div class="flex flex-col w-full">
        <div>
            <div class="plyr__progress">
                <input class="" data-plyr="seek" type="range" min="0" max="100" step="0.01" value="0" aria-label="${t('player.seek')}">
                <progress class="plyr__progress__buffer" min="0" max="100" value="0">${t('player.buffered')}</progress>
                <span role="tooltip" class="plyr__tooltip">00:00</span>
            </div>
        </div>
        <div class="flex justify-between">
          <div class="flex items-center zb-player-controls-group">
            <button type="button" class="hidden md:flex plyr__control zb-player-btn" data-plyr="restart">
                 <svg class="w-6" viewBox="0 1 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill="none"
                      d="M18.364 8.05026L17.6569 7.34315C14.5327 4.21896 9.46734 4.21896 6.34315 7.34315C3.21895 10.4673 3.21895 15.5327 6.34315 18.6569C9.46734 21.7811 14.5327 21.7811 17.6569 18.6569C19.4737 16.84 20.234 14.3668 19.9377 12.0005M18.364 8.05026H14.1213M18.364 8.05026V3.80762"
                      stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
            </button>

            <button type="button" class="plyr__control zb-player-btn" aria-label="${t('player.play')}" data-plyr="play">
                <!--<svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-pause"></use></svg>
                <svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-play"></use></svg>-->
                <svg class="icon--pressed w-6" viewBox="-3 -3 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill="none"
                    d="M10.65 19.11V4.89C10.65 3.54 10.08 3 8.64 3H5.01C3.57 3 3 3.54 3 4.89V19.11C3 20.46 3.57 21 5.01 21H8.64C10.08 21 10.65 20.46 10.65 19.11Z"
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                  <path fill="none"
                    d="M21 19.11V4.89C21 3.54 20.43 3 18.99 3H15.36C13.93 3 13.35 3.54 13.35 4.89V19.11C13.35 20.46 13.92 21 15.36 21H18.99C20.43 21 21 20.46 21 19.11Z"
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                <svg class="icon--not-pressed w-6" viewBox="-4 -3 28 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill="none"
                    d="M20.4086 9.35258C22.5305 10.5065 22.5305 13.4935 20.4086 14.6474L7.59662 21.6145C5.53435 22.736 5.53435 22.736 3 18.9671L3 5.0329C3 2.72368 5.53435 1.26402 7.59661 2.38548L20.4086 9.35258Z"
                    stroke="currentColor" stroke-width="2"></path>
                </svg>
            </button>

            <button type="button" class="hidden sm:flex plyr__control zb-player-btn" data-plyr="rewind">
                 <svg class="w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M13.91 10.8301H10.85L10.09 13.1201H12.38C13.22 13.1201 13.91 13.8001 13.91 14.6501C13.91 15.4901 13.23 16.1801 12.38 16.1801H10.09"
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10.02 4.46997L12 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      </path>
                      <path fill="none"
                        d="M4.91 7.79999C3.8 9.27999 3.10999 11.11 3.10999 13.11C3.10999 18.02 7.09 22 12 22C16.91 22 20.89 18.02 20.89 13.11C20.89 8.19999 16.91 4.21997 12 4.21997C11.32 4.21997 10.66 4.31002 10.02 4.46002"
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
            </button>
            
            <button type="button" class="hidden sm:flex plyr__control zb-player-btn" data-plyr="fast-forward">
                 <svg class="w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.98 4.46997L12 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      </path>
                      <path fill="none"
                        d="M19.0899 7.79999C20.1999 9.27999 20.8899 11.11 20.8899 13.11C20.8899 18.02 16.9099 22 11.9999 22C7.08988 22 3.10986 18.02 3.10986 13.11C3.10986 8.19999 7.08988 4.21997 11.9999 4.21997C12.6799 4.21997 13.3399 4.31002 13.9799 4.46002"
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M13.91 10.8301H10.85L10.0901 13.1201H12.3801C13.2201 13.1201 13.91 13.8001 13.91 14.6501C13.91 15.4901 13.2301 16.1801 12.3801 16.1801H10.0901"
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>

            </button>
            <div class="flex items-center pt-1">
              <div class="flex plyr__time plyr__time--current" aria-label="${t('player.currentTime')}">00:00</div>
              <div class="plyr__time plyr__time--duration" aria-label="${t('player.duration')}">00:00</div>  
            </div>
            <div class="hidden md:flex group/controls items-center">
              <button type="button" class="plyr__control zb-player-btn" aria-label="${t('player.mute')}" data-plyr="mute">
                <!--<svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-muted"></use></svg>
                <svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-volume"></use></svg>-->
                <svg class="icon--pressed w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M16.25 11.9998C16.25 11.5856 15.9142 11.2498 15.5 11.2498C15.0858 11.2498 14.75 11.5856 14.75 11.9998H16.25ZM7.0162 6.95791L7.14108 7.69744L7.0162 6.95791ZM8.59932 6.22002L8.18647 5.59387L8.18647 5.59387L8.59932 6.22002ZM7.72795 6.74438L8.03077 7.43053L7.72795 6.74438ZM3.33988 16.7225L3.02496 17.4032L3.33988 16.7225ZM1.53479 13.0282L0.786179 13.0738L1.53479 13.0282ZM1.95854 15.4228L2.6188 15.067L1.95854 15.4228ZM13.7001 20.0747L13.4578 19.3649L13.7001 20.0747ZM15.4127 14.6052L16.1619 14.64L15.4127 14.6052ZM14.2797 19.7797L14.7109 20.3934L14.2797 19.7797ZM8.81825 6.07566L9.2311 6.70181L9.2311 6.70181L8.81825 6.07566ZM13.7001 3.92487L13.4578 4.63468L13.7001 3.92487ZM14.2797 4.21984L14.7109 3.60621L14.2797 4.21984ZM3.33988 7.27707L3.02496 6.5964L3.33988 7.27707ZM1.53479 10.9714L0.786179 10.9258L1.53479 10.9714ZM1.95854 8.57679L2.6188 8.93254L1.95854 8.57679ZM9.91107 17.7452C9.56462 17.5182 9.09972 17.615 8.87269 17.9615C8.64566 18.3079 8.74247 18.7728 9.08893 18.9998L9.91107 17.7452ZM9.01216 6.84616L9.2311 6.70181L8.40541 5.44952L8.18647 5.59387L9.01216 6.84616ZM2.2834 12.9826C2.26225 12.6356 2.25 12.303 2.25 11.9998H0.75C0.75 12.3414 0.763733 12.7056 0.786179 13.0738L2.2834 12.9826ZM2.25 11.9998C2.25 11.6966 2.26225 11.364 2.2834 11.017L0.786179 10.9258C0.763733 11.294 0.75 11.6582 0.75 11.9998H2.25ZM14.75 11.9998C14.75 12.5116 14.7156 13.4508 14.6635 14.5704L16.1619 14.64C16.2137 13.525 16.25 12.5518 16.25 11.9998H14.75ZM6.00008 7.74979C6.48771 7.74979 6.81682 7.7522 7.14108 7.69744L6.89132 6.21838C6.71956 6.24738 6.5366 6.24979 6.00008 6.24979V7.74979ZM8.18647 5.59387C7.73856 5.8892 7.58448 5.98791 7.42513 6.05823L8.03077 7.43053C8.33163 7.29775 8.60506 7.11458 9.01216 6.84616L8.18647 5.59387ZM7.14108 7.69744C7.44756 7.64568 7.74641 7.55603 8.03077 7.43053L7.42513 6.05823C7.25452 6.13353 7.0752 6.18732 6.89132 6.21838L7.14108 7.69744ZM6.00008 17.7498C6.5366 17.7498 6.71956 17.7522 6.89132 17.7812L7.14108 16.3021C6.81682 16.2474 6.48771 16.2498 6.00008 16.2498V17.7498ZM6.00008 16.2498C4.55641 16.2498 4.06911 16.2335 3.6548 16.0418L3.02496 17.4032C3.80931 17.7661 4.69593 17.7498 6.00008 17.7498V16.2498ZM0.786179 13.0738C0.856484 14.2273 0.890091 15.021 1.29828 15.7785L2.6188 15.067C2.40052 14.6619 2.36045 14.2467 2.2834 12.9826L0.786179 13.0738ZM3.6548 16.0418C3.25445 15.8566 2.82804 15.4554 2.6188 15.067L1.29828 15.7785C1.66141 16.4525 2.33016 17.0817 3.02496 17.4032L3.6548 16.0418ZM14.6635 14.5704C14.5924 16.1011 14.541 17.1731 14.4015 17.9479C14.2626 18.7193 14.0651 19.0139 13.8485 19.1661L14.7109 20.3934C15.417 19.8972 15.7159 19.1131 15.8778 18.2137C16.0391 17.3178 16.0928 16.1266 16.1619 14.64L14.6635 14.5704ZM13.9423 20.7845C14.2142 20.6917 14.4759 20.5585 14.7109 20.3934L13.8485 19.1661C13.7297 19.2496 13.5952 19.318 13.4578 19.3649L13.9423 20.7845ZM9.2311 6.70181C10.5209 5.85139 11.426 5.2565 12.1402 4.90954C12.8525 4.56352 13.2087 4.54965 13.4578 4.63468L13.9423 3.21506C13.1241 2.93586 12.3108 3.15904 11.4848 3.56031C10.6607 3.96063 9.65858 4.62325 8.40541 5.44952L9.2311 6.70181ZM13.4578 4.63468C13.5952 4.68157 13.7297 4.74998 13.8485 4.83346L14.7109 3.60621C14.4759 3.44103 14.2142 3.30784 13.9423 3.21506L13.4578 4.63468ZM6.00008 6.24979C4.69593 6.24979 3.80931 6.23351 3.02496 6.5964L3.6548 7.95775C4.06911 7.76607 4.55641 7.74979 6.00008 7.74979V6.24979ZM2.2834 11.017C2.36045 9.75285 2.40052 9.33765 2.6188 8.93254L1.29828 8.22104C0.890091 8.97862 0.856484 9.77226 0.786179 10.9258L2.2834 11.017ZM3.02496 6.5964C2.33016 6.91785 1.66141 7.54708 1.29828 8.22104L2.6188 8.93254C2.82804 8.54419 3.25445 8.14298 3.6548 7.95775L3.02496 6.5964ZM9.08893 18.9998C10.1277 19.6806 10.9875 20.2245 11.7204 20.5488C12.4627 20.8771 13.2003 21.0377 13.9423 20.7845L13.4578 19.3649C13.2324 19.4418 12.9187 19.4386 12.3272 19.177C11.7264 18.9112 10.9698 18.439 9.91107 17.7452L9.08893 18.9998ZM16.1231 8.53978C16.0624 7.31263 15.9963 6.30685 15.827 5.52953C15.6552 4.7411 15.3503 4.05557 14.7109 3.60621L13.8485 4.83346C14.0443 4.97111 14.2254 5.22507 14.3614 5.84888C14.4997 6.48379 14.5631 7.36297 14.6249 8.61379L16.1231 8.53978Z"
                    stroke="currentColor" stroke-width="0.1" stroke-linecap="round" stroke-linejoin="round"></path>
                  <path 
                    d="M20 18C20 18 21.5 16.2 21.5 12C21.5 9.56658 20.9965 7.93882 20.5729 7"
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                  <path 
                    d="M18 15C18 15 18.5 14.1 18.5 12C18.5 11.1381 18.4158 10.4784 18.3165 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                  <path 
                    d="M22 2L2 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                <svg class="icon--not-pressed w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill="none"
                    d="M1.53479 10.9714C1.60847 9.76255 1.64531 9.15814 1.95854 8.57679C2.24473 8.04563 2.7923 7.53042 3.33988 7.27707C3.93921 6.99979 4.62617 6.99979 6.00008 6.99979C6.51215 6.99979 6.76819 6.99979 7.0162 6.95791C7.26138 6.9165 7.50046 6.84478 7.72795 6.74438C7.95806 6.64283 8.17181 6.50189 8.59932 6.22002L8.81825 6.07566C11.3612 4.39898 12.6327 3.56063 13.7001 3.92487C13.9047 3.9947 14.1028 4.09551 14.2797 4.21984C15.2024 4.86829 15.2725 6.37699 15.4127 9.3944C15.4646 10.5117 15.5 11.4679 15.5 11.9998C15.5 12.5317 15.4646 13.4879 15.4127 14.6052C15.2725 17.6226 15.2024 19.1313 14.2797 19.7797C14.1028 19.9041 13.9047 20.0049 13.7001 20.0747C12.6327 20.4389 11.3612 19.6006 8.81825 17.9239L8.59932 17.7796C8.17181 17.4977 7.95806 17.3567 7.72795 17.2552C7.50046 17.1548 7.26138 17.0831 7.0162 17.0417C6.76819 16.9998 6.51215 16.9998 6.00008 16.9998C4.62617 16.9998 3.93921 16.9998 3.33988 16.7225C2.7923 16.4692 2.24473 15.9539 1.95854 15.4228C1.64531 14.8414 1.60847 14.237 1.53479 13.0282C1.51299 12.6706 1.5 12.3222 1.5 11.9998C1.5 11.6774 1.51299 11.329 1.53479 10.9714Z"
                    stroke="currentColor" stroke-width="1.5"></path>
                  <path fill="none" d="M20 6C20 6 21.5 7.8 21.5 12C21.5 16.2 20 18 20 18" stroke="currentColor" stroke-width="1.5"
                    stroke-linecap="round"></path>
                  <path fill="none" d="M18 9C18 9 18.5 9.9 18.5 12C18.5 14.1 18 15 18 15" stroke="currentColor" stroke-width="1.5"
                    stroke-linecap="round"></path>
                </svg>
            </button>
            <div class="hidden group-hover/controls:flex plyr__volume">
                <input data-plyr="volume" type="range" min="0" max="1" step="0.05" value="1" autocomplete="off" aria-label="${t('player.volume')}">
            </div>
            <span class="zb-current-segment-label hidden md:inline-flex ms-2 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/10 text-white/90 line-clamp-1 max-w-[8rem]" style="display:none"></span>
            </div>
          </div>
          <div class="flex items-center zb-player-controls-group">
            <button type="button" class="plyr__control zb-player-btn zb-segments-btn segments-btn" aria-label="${t('player.segments')}">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  <path d="M4 12H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  <path d="M4 18H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
            </button>
            <button type="button" class="plyr__control zb-player-btn zb-watch-heatmap-btn watch-heatmap-btn" aria-label="${t('player.watchHeatmap')}" aria-pressed="false" style="display:none">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 18V14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                  <path d="M9 18V10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                  <path d="M14 18V6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                  <path d="M19 18V12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
            </button>
            <button type="button" class="plyr__control zb-player-btn zb-settings-btn" aria-label="${t('player.settings')}">
                <svg class="w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9.11011V14.8801C3 17.0001 3 17.0001 5 18.3501L10.5 21.5301C11.33 22.0101 12.68 22.0101 13.5 21.5301L19 18.3501C21 17.0001 21 17.0001 21 14.8901V9.11011C21 7.00011 21 7.00011 19 5.65011L13.5 2.47011C12.68 1.99011 11.33 1.99011 10.5 2.47011L5 5.65011C3 7.00011 3 7.00011 3 9.11011Z" fill="none"/>
                  <circle cx="12" cy="12" r="3" fill="none"/>
                </svg>
            </button>
            <button type="button" class="plyr__control zb-player-btn" data-plyr="fullscreen">
                <!--<svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-exit-fullscreen"></use></svg>
                <svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-enter-fullscreen"></use></svg>-->
                <svg class="icon--pressed w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7 16L2 16C1.44772 16 1 15.5523 1 15C1 14.4477 1.44772 14 2 14L7 14C8.65685 14 10 15.3431 10 17V22C10 22.5523 9.55228 23 9 23C8.44772 23 8 22.5523 8 22V17C8 16.4477 7.55228 16 7 16Z"
                    fill="currentColor"></path>
                  <path
                    d="M10 2C10 1.44772 9.55229 1 9 1C8.44772 1 8 1.44772 8 2L8 7C8 7.55228 7.55228 8 7 8L2 8C1.44772 8 1 8.44771 1 9C1 9.55228 1.44772 10 2 10L7 10C8.65685 10 10 8.65685 10 7L10 2Z"
                    fill="currentColor"></path>
                  <path
                    d="M14 22C14 22.5523 14.4477 23 15 23C15.5523 23 16 22.5523 16 22V17C16 16.4477 16.4477 16 17 16H22C22.5523 16 23 15.5523 23 15C23 14.4477 22.5523 14 22 14H17C15.3431 14 14 15.3431 14 17V22Z"
                    fill="currentColor"></path>
                  <path
                    d="M14 7C14 8.65686 15.3431 10 17 10L22 10C22.5523 10 23 9.55228 23 9C23 8.44772 22.5523 8 22 8L17 8C16.4477 8 16 7.55229 16 7L16 2C16 1.44772 15.5523 1 15 1C14.4477 1 14 1.44772 14 2L14 7Z"
                    fill="currentColor"></path>
                </svg>
                <svg class="icon--not-pressed w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill="none" d="M22 14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22" stroke="currentColor"
                    stroke-width="1.5" stroke-linecap="round"></path>
                  <path fill="none" d="M10 22C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14" stroke="currentColor" stroke-width="1.5"
                    stroke-linecap="round"></path>
                  <path fill="none" d="M10 2C6.22876 2 4.34315 2 3.17157 3.17157C2 4.34315 2 6.22876 2 10" stroke="currentColor" stroke-width="1.5"
                    stroke-linecap="round"></path>
                  <path fill="none" d="M14 2C17.7712 2 19.6569 2 20.8284 3.17157C22 4.34315 22 6.22876 22 10" stroke="currentColor" stroke-width="1.5"
                    stroke-linecap="round"></path>
                </svg>
            </button>
            </div>
        </div>
    </div>
</div>
<button type="button" class="plyr__control plyr__control--overlaid zb-player-overlaid" data-plyr="play" aria-label="${t('player.play')}"><svg aria-hidden="true" focusable="false"><use xlink:href="#plyr-play"></use></svg><span class="plyr__sr-only">${t('player.play')}</span></button>
`);

// Plyr options with exact same configuration as EpisodeShow
const playerOptions = computed(() => ({
    title: props.title,
    controls: controls.value,
    settings: ["quality", "speed", "loop"],
    autoplay: props.autoplay,
    invertTime: true,
    toggleInvert: false,
    disableContextMenu: false,
    seekTime: 5,
    speed: {
        selected: 1,
        options: [0.5, 0.75, 1, 1.25, 1.5, 2],
    },
    keyboard: {
        focused: true,
        global: false,
    },
    storage: {
        enabled: true,
        key: props.storageKey,
    },
    i18n: {
        restart: t("player.restart"),
        rewind: t("player.rewind"),
        play: t("player.play"),
        pause: t("player.pause"),
        fastForward: t("player.fastForward"),
        seek: t("player.seek"),
        seekLabel: t("player.seekLabel"),
        played: t("player.played"),
        buffered: t("player.buffered"),
        currentTime: t("player.currentTime"),
        duration: t("player.duration"),
        volume: t("player.volume"),
        mute: t("player.mute"),
        unmute: t("player.unmute"),
        enableCaptions: t("player.enableCaptions"),
        disableCaptions: t("player.disableCaptions"),
        download: t("player.download"),
        enterFullscreen: t("player.enterFullscreen"),
        exitFullscreen: t("player.exitFullscreen"),
        frameTitle: "{title}",
        captions: t("player.captions"),
        settings: t("player.settings"),
        pip: t("player.pip"),
        menuBack: t("player.menuBack"),
        speed: t("player.speed"),
        normal: t("player.normal"),
        quality: t("player.quality"),
        loop: t("player.loop"),
        start: t("player.start"),
        end: t("player.end"),
        all: t("player.all"),
        reset: t("player.reset"),
        disabled: t("player.disabled"),
        enabled: t("player.enabled"),
        advertisement: t("player.advertisement"),
        qualityBadge: {
            2160: "4K",
            1440: "HD",
            1080: "HD",
            720: "HD",
            576: "SD",
            480: "SD",
        },
    },
    ratio: "16:9",
}));

// Show/hide controls based on controlsConfig
const showTitleOverlay = computed(() => {
    const cfg = props.controlsConfig || {};
    return cfg.title === undefined ? true : Boolean(cfg.title);
});

const applyControlVisibility = () => {
    try {
        const cfg = props.controlsConfig || {};
        const player = playerRef.value?.player;
        const container = player?.elements?.container || playerRef.value?.$el;
        const controlsEl = player?.elements?.controls || container?.querySelector?.('.plyr__controls');
        if (!controlsEl) return;
        const qs = (sel) => controlsEl.querySelector(sel);
        const hide = (el) => { if (el) el.style.display = 'none'; };

        if (cfg.restart === false) hide(qs('[data-plyr="restart"]'));
        if (cfg.play === false) hide(qs('[data-plyr="play"]'));
        if (cfg.rewind === false) hide(qs('[data-plyr="rewind"]'));
        if (cfg.fastForward === false) hide(qs('[data-plyr="fast-forward"]'));
        if (cfg.times === false) controlsEl.querySelectorAll('.plyr__time').forEach(hide);
        if (cfg.mute === false) hide(qs('[data-plyr="mute"]'));
        if (cfg.volume === false) hide(controlsEl.querySelector('.plyr__volume'));
        if (cfg.settings === false) hide(qs('.zb-settings-btn'));
        if (cfg.segments === false) hide(qs('.zb-segments-btn'));
        if (cfg.fullscreen === false) hide(qs('[data-plyr="fullscreen"]'));
        if (cfg.overlaidPlay === false) hide(container?.querySelector?.('.plyr__control--overlaid'));
    } catch (_) { /* noop */ }
};

onMounted(() => {
    setTimeout(applyControlVisibility, 0);
    const player = playerRef.value?.player;
    if (player && typeof player.on === 'function') {
        try { player.on('ready', applyControlVisibility); } catch (_) { /* noop */ }
    }

    updateIsMobile();
    window.addEventListener('resize', updateIsMobile);

    setTimeout(() => {
        try {
            const container = playerRef.value?.player?.elements?.container || playerRef.value?.$el?.querySelector?.('.plyr') || null;
            playerContainerEl.value = container;
            if (container) container.style.position = 'relative';
        } catch (e) {
            playerContainerEl.value = playerRef.value?.$el?.querySelector?.('.plyr') || null;
        }
        attachMenuButtonListeners();
        updateSegmentsButtonVisibility();
        updateWatchHeatmapButtonVisibility();
        renderSegmentMarkers();
    }, 200);

    window.addEventListener('zan:video-seek', onExternalSeekEvent);
    window.addEventListener('zan:video-segments', onExternalSegmentsEvent);
    window.addEventListener('beforeunload', flushProgressOnLeave);
    window.addEventListener('pagehide', flushProgressOnLeave);
    document.addEventListener('visibilitychange', onVisibilityChange);
});

watch(menuOpen, (open) => {
    const el = playerContainerEl.value;
    if (el) el.classList.toggle('zb-player-menu-open', open);
});

watch(locale, () => {
    menuButtonsBound = false;
    setTimeout(() => {
        attachMenuButtonListeners();
        updateSegmentsButtonVisibility();
        updateWatchHeatmapButtonVisibility();
    }, 300);
});

watch(() => props.controlsConfig, () => {
    setTimeout(applyControlVisibility, 0);
}, { deep: true });

// Reactive variables
const playerRef = ref(null);
const router = useRouter();
const playerContainerEl = ref(null);

const PLAYER_HEADER = 'X-Zanburak-Player';
const PLAYER_HEADER_VALUE = '1';

let hlsInstance = null;
let masterBlobUrl = null;
let loadToken = 0;

const getPlayerRequestHeaders = () => {
    const headers = { [PLAYER_HEADER]: PLAYER_HEADER_VALUE };
    try {
        const raw = localStorage.getItem('token');
        if (raw) {
            const token = JSON.parse(raw);
            const value = typeof token === 'string' ? token : token?.token;
            if (value) {
                headers.Authorization = `Bearer ${value}`;
            }
        }
    } catch (_) { /* ignore */ }
    return headers;
};

const createHlsInstance = () => new Hls({
    // Fast start: small initial buffer, prefetch first fragment, prefer lower rung first.
    enableWorker: true,
    lowLatencyMode: false,
    backBufferLength: 30,
    maxBufferLength: 12,
    maxMaxBufferLength: 30,
    maxBufferSize: 20 * 1000 * 1000,
    maxBufferHole: 0.5,
    startFragPrefetch: true,
    testBandwidth: false,
    abrEwmaDefaultEstimate: 500000,
    abrBandWidthFactor: 0.8,
    abrBandWidthUpFactor: 0.6,
    xhrSetup: (xhr) => {
        const headers = getPlayerRequestHeaders();
        Object.entries(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
        });
    },
});

const destroyHls = () => {
    if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
    }
    if (masterBlobUrl) {
        URL.revokeObjectURL(masterBlobUrl);
        masterBlobUrl = null;
    }
};

const waitForPlayerMedia = () => new Promise((resolve) => {
    const check = () => {
        if (playerRef.value?.player?.media) {
            resolve(playerRef.value.player.media);
            return;
        }
        setTimeout(check, 30);
    };
    check();
});

const bindPlayerEvents = () => {
    const player = playerRef.value?.player;
    if (!player) return;

    player.off('timeupdate', handleTimeUpdate);
    player.off('pause', onPlayerPause);
    player.off('ended', onPlayerEnded);
    player.off('loadedmetadata', onPlayerLoadedMetadata);
    player.on('timeupdate', handleTimeUpdate);
    player.on('pause', onPlayerPause);
    player.on('ended', onPlayerEnded);
    player.on('loadedmetadata', onPlayerLoadedMetadata);
};

const onPlayerLoadedMetadata = () => {
    renderSegmentMarkers();
    if (watchHeatmapEnabled.value) renderWatchHeatmap();
};
const availableQualities = ref([]);
const currentQuality = ref('auto');
const currentSpeed = ref(1);
const availableSpeeds = computed(() => [
    { value: 0.5, label: '0.5x' },
    { value: 0.75, label: '0.75x' },
    { value: 1, label: t('player.normal') },
    { value: 1.25, label: '1.25x' },
    { value: 1.5, label: '1.5x' },
    { value: 2, label: '2x' },
]);
const segments = ref([]);
const currentSegmentIndex = ref(-1);
const watchedTimes = ref(new Set((props.initialWatchedTimes || []).map((n) => Math.floor(Number(n))).filter((n) => n >= 0)));
const watchedTimesTemp = ref(new Set());
const fullWatched = ref(props.initialFullWatched);
const lastProgressFlushAt = ref(0);
const progressFlushInFlight = ref(false);
/** Safety-only while playing; primary flushes are pause / seek / leave / end. */
const PROGRESS_SAFETY_FLUSH_MS = 90_000;
const MIN_WATCH_SECONDS_FOR_HEATMAP = 5;
const watchHeatmapEnabled = ref(false);
let lastHeatmapSecond = -1;
const watchedSetsTick = ref(0);
const bumpWatchedSets = () => { watchedSetsTick.value += 1; };
const last5AlertShown = ref(false);
const showEndPopup = ref(false);
const nextPosterFailed = ref(false);

const showNextPoster = computed(() => {
    const poster = props.nextEpisode?.poster;
    return Boolean(poster) && !nextPosterFailed.value;
});

watch(() => props.nextEpisode?.poster, () => {
    nextPosterFailed.value = false;
});

const getMergedWatchedSet = () => new Set([...watchedTimes.value, ...watchedTimesTemp.value]);

const mergedWatchedCount = computed(() => {
    watchedSetsTick.value;
    return getMergedWatchedSet().size;
});

/** دکمه فقط وقتی: لاگین + حداقل ۵ ثانیه (ذخیره‌شده یا همین session) */
const canShowWatchHeatmap = computed(() => (
    props.isLoggedIn && mergedWatchedCount.value >= MIN_WATCH_SECONDS_FOR_HEATMAP
));

watch(canShowWatchHeatmap, (ok) => {
    if (!ok && watchHeatmapEnabled.value) {
        watchHeatmapEnabled.value = false;
        clearWatchHeatmap();
    }
    updateWatchHeatmapButtonVisibility();
});

watch(watchHeatmapEnabled, () => {
    updateWatchHeatmapButtonVisibility();
});

watch(() => props.initialWatchedTimes, (val) => {
    watchedTimes.value = new Set((val || []).map((n) => Math.floor(Number(n))).filter((n) => n >= 0));
    bumpWatchedSets();
    updateWatchHeatmapButtonVisibility();
    if (watchHeatmapEnabled.value) renderWatchHeatmap();
}, { deep: true });

watch(() => props.isLoggedIn, () => {
    updateWatchHeatmapButtonVisibility();
});

watch(() => props.streamVideoId, () => {
    watchHeatmapEnabled.value = false;
    watchedTimesTemp.value.clear();
    lastHeatmapSecond = -1;
    bumpWatchedSets();
    clearWatchHeatmap();
    updateWatchHeatmapButtonVisibility();
});
const fullWatchedShownKey = computed(() => {
    const id = props.streamVideoId ?? props.source ?? 'unknown';
    return `zan:fullwatched-shown:${id}`;
});
const hasShownFullWatched = () => {
    try { return localStorage.getItem(fullWatchedShownKey.value) === '1'; } catch (e) { return false; }
};
const markShownFullWatched = () => {
    try {
        localStorage.setItem(fullWatchedShownKey.value, '1');
    } catch (e) {
        // ignore persistence failures (private mode, quota, etc.)
    }
};

// Initialize HLS - now done in loadVideoSource

// Setup quality options
const setupQualityOptions = (levels) => {
    // Add auto quality option
    availableQualities.value = [];
    availableQualities.value.push({
        height: 'auto',
        label: t('player.auto'),
        value: 'auto'
    });

    // Add available quality levels
    if (levels && levels.length > 0) {
        levels.forEach((level, index) => {
            const qualityLabel = getQualityLabel(level.height);
            availableQualities.value.push({
                height: level.height,
                label: qualityLabel,
                value: index
            });
        });
    } else {
        // For direct video files, add a single quality option
        availableQualities.value.push({
            height: 'auto',
            label: t('player.original'),
            value: 'auto'
        });
    }

    // Refresh settings menu when qualities change
};

// Get quality label
const getQualityLabel = (height) => {
    if (height >= 2160) return '4K';
    if (height >= 1440) return '2K';
    if (height >= 1080) return '1080p';
    if (height >= 720) return '720p';
    if (height >= 480) return '480p';
    if (height >= 360) return '360p';
    return `${height}p`;
};

// Get current quality label
const getCurrentQualityLabel = () => {
    if (currentQuality.value === 'auto') return t('player.auto');
    const quality = availableQualities.value.find(q => q.value === currentQuality.value);
    return quality ? quality.label : t('player.auto');
};

// Get current speed label
const getCurrentSpeedLabel = () => {
    const speed = availableSpeeds.value.find(s => s.value === currentSpeed.value);
    return speed ? speed.label : t('player.normal');
};

// Select quality
const selectQuality = (qualityValue) => {
    // Convert string to number for non-auto qualities to match availableQualities structure
    currentQuality.value = qualityValue === 'auto' ? 'auto' : parseInt(qualityValue);

    if (qualityValue === 'auto') {
        if (!hlsInstance) return;
        hlsInstance.currentLevel = -1;
    } else {
        if (!hlsInstance) return;
        hlsInstance.currentLevel = parseInt(qualityValue);
    }
};

// Select speed
const selectSpeed = (speedValue) => {
    currentSpeed.value = speedValue;

    if (playerRef.value?.player) {
        playerRef.value.player.speed = speedValue;
    }
};

// Track video progress — batches by second count and time interval to reduce server load
const buildProgressPayload = (currentTime, tempArray) => ({
    watchedTimes: JSON.stringify(Array.from(watchedTimes.value)),
    tempWatchedTimes: JSON.stringify(tempArray),
    lastPosition: currentTime,
    fullWatched: fullWatched.value,
});

const postProgress = async (payload, { keepalive = false } = {}) => {
    if (!props.streamVideoId || !props.isLoggedIn) return;

    const url = `${config.apiBaseUrl}/video-views/${props.streamVideoId}/setWatched`;
    const token = JSON.parse(localStorage.getItem("token") || "null");

    if (keepalive && token && typeof fetch !== "undefined") {
        try {
            await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                body: JSON.stringify(payload),
                keepalive: true,
            });
            return;
        } catch (_) {
            // fall through to axios
        }
    }

    await axiosInstance.post(`/video-views/${props.streamVideoId}/setWatched`, payload);
};

const flushVideoProgress = async (currentTime, duration, { force = false } = {}) => {
    if (!props.isLoggedIn || !props.streamVideoId || duration <= 0) return;

    watchedTimesTemp.value.add(Math.floor(currentTime));
    bumpWatchedSets();
    const mergedSet = new Set([...watchedTimesTemp.value, ...watchedTimes.value]);
    const newSeconds = mergedSet.size - watchedTimes.value.size;
    const now = Date.now();
    let becameFull = false;

    if (mergedSet.size >= Math.floor(duration) && !fullWatched.value) {
        fullWatched.value = true;
        becameFull = true;
    }

    // Only send to server on explicit events (force), completion, or rare safety while playing.
    const safetyDue = newSeconds > 0 && (now - lastProgressFlushAt.value >= PROGRESS_SAFETY_FLUSH_MS);
    const shouldFlush = force || becameFull || safetyDue;
    if (!shouldFlush) return;
    if (newSeconds <= 0 && !becameFull && !force) return;

    const tempArray = Array.from(watchedTimesTemp.value);
    for (const item of watchedTimesTemp.value) {
        watchedTimes.value.add(item);
    }
    watchedTimesTemp.value.clear();
    bumpWatchedSets();
    lastProgressFlushAt.value = now;

    if (becameFull && !hasShownFullWatched() && props.isEpisode) {
        markShownFullWatched();
        toast.success(t("player.videoCompleted"), {
            theme: "colored",
            position: toast.POSITION.BOTTOM_RIGHT,
            rtl: localStorage.getItem("direction") == "rtl" ? true : false,
            bodyClassName: "font-YekanBakh text-gray-800",
            toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
        });
    }

    if (progressFlushInFlight.value && !force && !becameFull) return;

    progressFlushInFlight.value = true;
    try {
        await postProgress(buildProgressPayload(currentTime, tempArray), { keepalive: force });
        if (props.isEpisode && fullWatched.value && !hasShownFullWatched()) {
            markShownFullWatched();
            toast.success(t("player.videoCompleted"), {
                theme: "colored",
                position: toast.POSITION.BOTTOM_RIGHT,
                rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                bodyClassName: "font-YekanBakh text-gray-800",
                toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
            });
        }
    } catch (error) {
        for (const item of tempArray) {
            watchedTimesTemp.value.add(item);
        }
        console.error("Error tracking video progress:", error);
    } finally {
        progressFlushInFlight.value = false;
    }

    updateWatchHeatmapButtonVisibility();
    if (watchHeatmapEnabled.value) {
        const sec = Math.floor(currentTime);
        if (sec !== lastHeatmapSecond) {
            lastHeatmapSecond = sec;
            renderWatchHeatmap();
        }
    }
};

const trackVideoProgress = (currentTime, duration) => {
    // Accumulate locally only — no network from timeupdate.
    if (!props.isLoggedIn || duration <= 0) return;
    watchedTimesTemp.value.add(Math.floor(currentTime));
    bumpWatchedSets();

    const mergedSet = new Set([...watchedTimes.value, ...watchedTimesTemp.value]);
    if (mergedSet.size >= Math.floor(duration) && !fullWatched.value) {
        flushVideoProgress(currentTime, duration, { force: true });
        return;
    }

    // Rare safety flush if the user never pauses (crash protection).
    if (
        !fullWatched.value
        && mergedSet.size > watchedTimes.value.size
        && Date.now() - lastProgressFlushAt.value >= PROGRESS_SAFETY_FLUSH_MS
    ) {
        flushVideoProgress(currentTime, duration, { force: false });
    }
};

const flushProgressOnLeave = () => {
    const player = playerRef.value?.player;
    if (!player || !props.isLoggedIn) return;
    const currentTime = player.currentTime;
    const duration = player.duration;
    if (watchedTimesTemp.value.size > 0 || (!fullWatched.value && duration > 0)) {
        flushVideoProgress(currentTime, duration, { force: true });
    }
};

const onVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
        flushProgressOnLeave();
    }
};

const onPlayerPause = () => {
    const player = playerRef.value?.player;
    if (!player) return;
    flushVideoProgress(player.currentTime, player.duration, { force: true });
};

const onPlayerEnded = () => {
    const player = playerRef.value?.player;
    if (!player) return;
    flushVideoProgress(player.currentTime, player.duration, { force: true });
    checkLastFiveSeconds(player.duration, player.duration);
};

// Popup when entering last 5 seconds (only once per load; watch progress irrelevant)
const checkLastFiveSeconds = (currentTime, duration) => {
    if (last5AlertShown.value || !props.isEpisode || !props.nextEpisode || !duration) return;
    if (duration >= 5 && currentTime >= duration - 5) {
        last5AlertShown.value = true;
        showEndPopup.value = true;
    }
};

// Unified timeupdate handler
const handleTimeUpdate = () => {
    const player = playerRef.value?.player;
    if (!player) return;
    const currentTime = player.currentTime;
    const duration = player.duration;
    const sec = Math.floor(currentTime);

    if (props.isLoggedIn) {
        trackVideoProgress(currentTime, duration);
    }

    checkLastFiveSeconds(currentTime, duration);
    updateActiveSegmentUI(currentTime);

    if (props.isLoggedIn && !fullWatched.value) {
        updateWatchHeatmapButtonVisibility();
    }

    if (watchHeatmapEnabled.value && sec !== lastHeatmapSecond) {
        lastHeatmapSecond = sec;
        renderWatchHeatmap();
    }
};

// Close popup permanently for this video
const dismissEndPopup = () => {
    showEndPopup.value = false;
    last5AlertShown.value = true;
};



// Navigate to next episode using router location from parent
const goToNextEpisode = () => {
    if (!props.nextEpisode?.link) return;
    router.push(props.nextEpisode.link);
};

// Load video source
const loadVideoSource = async () => {
    if (!props.source) return;

    const token = ++loadToken;
    destroyHls();

    last5AlertShown.value = false;
    showEndPopup.value = false;

    const isHLS = props.source.includes('playlist')
        || props.source.includes('.m3u8')
        || props.source.includes('/hls/manifest');

    await waitForPlayerMedia();
    if (token !== loadToken) return;

    const media = playerRef.value?.player?.media;
    if (!media) return;

    if (isHLS) {
        try {
            if (Hls.isSupported()) {
                hlsInstance = createHlsInstance();

                hlsInstance.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
                    setupQualityOptions(data.levels);
                    // Start on the lowest rung for quick first paint, then ABR can climb.
                    if (hlsInstance && Array.isArray(data.levels) && data.levels.length > 1) {
                        hlsInstance.startLevel = data.levels.length - 1;
                        hlsInstance.loadLevel = data.levels.length - 1;
                    }
                });

                hlsInstance.on(Hls.Events.ERROR, (event, data) => {
                    if (!data.fatal || !hlsInstance) return;

                    if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                        hlsInstance.startLoad();
                    } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                        hlsInstance.recoverMediaError();
                    } else {
                        destroyHls();
                    }
                });

                hlsInstance.attachMedia(media);
                // Load API URL directly (with player headers via xhrSetup) — skips extra
                // blob round-trip so first segment starts sooner.
                hlsInstance.loadSource(props.source);
            } else if (media.canPlayType('application/vnd.apple.mpegurl')) {
                // Safari native HLS: fetch once then assign (needs player header).
                const response = await fetch(props.source, {
                    method: 'GET',
                    credentials: 'include',
                    headers: getPlayerRequestHeaders(),
                });
                if (!response.ok) throw new Error(`Failed to load playlist (${response.status})`);
                const text = await response.text();
                masterBlobUrl = URL.createObjectURL(new Blob([text], { type: 'application/vnd.apple.mpegurl' }));
                media.src = masterBlobUrl;
                setupQualityOptions([]);
            } else {
                throw new Error('HLS is not supported in this browser');
            }

            bindPlayerEvents();
            media.addEventListener('loadedmetadata', () => {
                renderSegmentMarkers();
            }, { once: true });
        } catch (error) {
            console.error('Failed to load HLS source', error);
            destroyHls();
        }
        return;
    }

    media.src = props.source;
    setupQualityOptions([]);
    bindPlayerEvents();
    media.addEventListener('loadedmetadata', () => {
        renderSegmentMarkers();
    }, { once: true });
};

// Watch for source changes
watch(() => props.source, (newSource) => {
    if (newSource) {
        loadVideoSource();
    }
}, { immediate: true });

onBeforeUnmount(() => {
    closeMenu();
    window.removeEventListener('resize', updateIsMobile);
    flushProgressOnLeave();
    loadToken += 1;
    destroyHls();
    window.removeEventListener('zan:video-seek', onExternalSeekEvent);
    window.removeEventListener('zan:video-segments', onExternalSegmentsEvent);
    window.removeEventListener('beforeunload', flushProgressOnLeave);
    window.removeEventListener('pagehide', flushProgressOnLeave);
    document.removeEventListener('visibilitychange', onVisibilityChange);
});

// --- Segments integration ---
const onExternalSeekEvent = (e) => {
    try {
        const t = e?.detail?.time;
        if (typeof t === 'number' && playerRef.value?.player) {
            playerRef.value.player.currentTime = t;
        }
    } catch (_) { void 0; }
};

const normalizeSegments = (segs) => {
    if (!Array.isArray(segs)) return [];
    return segs
        .filter((s) => typeof s?.time === 'number' && s.time >= 0 && typeof s?.label === 'string')
        .sort((a, b) => a.time - b.time);
};

const updateSegmentsButtonVisibility = () => {
    const btn = queryPlayerEl('.zb-segments-btn');
    const container = playerContainerEl.value
        || playerRef.value?.player?.elements?.container
        || playerRef.value?.$el?.querySelector?.('.plyr')
        || null;
    const hasSegments = Array.isArray(segments.value) && segments.value.length > 0;

    if (btn) {
        btn.classList.toggle('zb-segments-visible', hasSegments);
        btn.style.display = 'none';
        if (hasSegments && !isMobile.value) {
            btn.style.display = 'inline-flex';
        }
    }

    if (container) {
        container.classList.toggle('plyr--segments', hasSegments);
    }

    if (!hasSegments) {
        const labelEl = queryPlayerEl('.zb-current-segment-label');
        if (labelEl) {
            labelEl.style.display = 'none';
            labelEl.textContent = '';
        }
    }
};

const renderSegmentMarkers = () => {
    const player = playerRef.value?.player;
    if (!player) return;
    const duration = player.duration;
    if (!duration || !isFinite(duration) || duration <= 0) return;
    const progress = player.elements?.progress || queryPlayerEl('.plyr__progress');
    if (!progress) return;

    const existing = progress.querySelector('#segments-markers');
    if (existing) existing.remove();

    if (!Array.isArray(segments.value) || segments.value.length === 0) {
        return;
    }

    const style = window.getComputedStyle(progress);
    if (style.position === 'static') {
        progress.style.position = 'relative';
    }

    const boundaries = [0];
    for (const seg of segments.value) {
        if (seg.time > 0 && seg.time < duration) {
            boundaries.push(seg.time);
        }
    }
    boundaries.push(duration);
    const uniqueBoundaries = [...new Set(boundaries.map((t) => Math.round(t * 1000) / 1000))].sort((a, b) => a - b);

    const overlay = document.createElement('div');
    overlay.id = 'segments-markers';
    overlay.className = 'zb-segments-track';
    overlay.setAttribute('aria-hidden', 'true');

    const gapPx = 3;
    for (let i = 0; i < uniqueBoundaries.length - 1; i++) {
        const start = uniqueBoundaries[i];
        const end = uniqueBoundaries[i + 1];
        if (end <= start) continue;

        const leftPct = (start / duration) * 100;
        const widthPct = ((end - start) / duration) * 100;

        const chunk = document.createElement('div');
        chunk.className = 'zb-segment-chunk';
        chunk.style.left = `${leftPct}%`;
        chunk.style.width = `calc(${widthPct}% - ${i === 0 ? gapPx / 2 : gapPx}px)`;
        if (i > 0) {
            chunk.style.marginLeft = `${gapPx / 2}px`;
        }
        overlay.appendChild(chunk);
    }

    progress.insertBefore(overlay, progress.firstChild);
};

const buildWatchRanges = (durationSec, watchedSet) => {
    const total = Math.max(1, Math.ceil(durationSec));
    const ranges = [];
    let i = 0;
    while (i < total) {
        const watched = watchedSet.has(i);
        let j = i + 1;
        while (j < total && watchedSet.has(j) === watched) j++;
        ranges.push({ start: i, end: j, watched });
        i = j;
    }
    return ranges;
};

const clearWatchHeatmapOverlay = () => {
    const player = playerRef.value?.player;
    const progress = player?.elements?.progress || queryPlayerEl('.plyr__progress');
    const existing = progress?.querySelector('#watch-heatmap-markers');
    if (existing) existing.remove();
};

const clearWatchHeatmap = () => {
    clearWatchHeatmapOverlay();
    const container = playerContainerEl.value
        || playerRef.value?.player?.elements?.container
        || playerRef.value?.$el?.querySelector?.('.plyr')
        || null;
    if (container) container.classList.remove('plyr--watch-heatmap-active');
};

const renderWatchHeatmap = () => {
    if (!watchHeatmapEnabled.value) return;
    const player = playerRef.value?.player;
    if (!player) return;
    const duration = player.duration;
    if (!duration || !isFinite(duration) || duration <= 0) return;
    const progress = player.elements?.progress || queryPlayerEl('.plyr__progress');
    if (!progress) return;

    clearWatchHeatmapOverlay();

    const style = window.getComputedStyle(progress);
    if (style.position === 'static') {
        progress.style.position = 'relative';
    }

    const watchedSet = getMergedWatchedSet();
    const ranges = buildWatchRanges(duration, watchedSet);
    const container = playerContainerEl.value
        || playerRef.value?.player?.elements?.container
        || playerRef.value?.$el?.querySelector?.('.plyr')
        || null;
    if (container) container.classList.add('plyr--watch-heatmap-active');

    const overlay = document.createElement('div');
    overlay.id = 'watch-heatmap-markers';
    overlay.className = 'zb-watch-heatmap-track';
    overlay.setAttribute('aria-hidden', 'true');

    for (const range of ranges) {
        const leftPct = (range.start / duration) * 100;
        const widthPct = ((range.end - range.start) / duration) * 100;
        if (widthPct <= 0) continue;
        const chunk = document.createElement('div');
        chunk.className = range.watched
            ? 'zb-watch-chunk zb-watch-chunk--watched'
            : 'zb-watch-chunk zb-watch-chunk--unwatched';
        chunk.style.left = `${leftPct}%`;
        chunk.style.width = `${widthPct}%`;
        overlay.appendChild(chunk);
    }

    const segmentMarkers = progress.querySelector('#segments-markers');
    if (segmentMarkers) {
        progress.insertBefore(overlay, segmentMarkers);
    } else {
        progress.insertBefore(overlay, progress.firstChild);
    }
};

const toggleWatchHeatmap = () => {
    if (!canShowWatchHeatmap.value) return;
    watchHeatmapEnabled.value = !watchHeatmapEnabled.value;
    if (watchHeatmapEnabled.value) {
        lastHeatmapSecond = -1;
        renderWatchHeatmap();
    } else {
        lastHeatmapSecond = -1;
        clearWatchHeatmap();
    }
    updateWatchHeatmapButtonVisibility();
};

const updateWatchHeatmapButtonVisibility = () => {
    const btn = queryPlayerEl('.zb-watch-heatmap-btn');
    const show = canShowWatchHeatmap.value;
    if (btn) {
        btn.style.display = show ? 'inline-flex' : 'none';
        btn.classList.toggle('zb-player-btn--active', watchHeatmapEnabled.value);
        btn.setAttribute('aria-pressed', watchHeatmapEnabled.value ? 'true' : 'false');
    }
};

const setSegments = (segs) => {
    segments.value = normalizeSegments(segs);
    updateSegmentsButtonVisibility();
    renderSegmentMarkers();
    if (!segments.value.length && menuSegmentsOnly.value) {
        closeMenu();
    }
};

watch(() => props.description, (desc) => {
    if (desc == null) return;
    setSegments(extractVideoSegments(desc));
}, { immediate: true });

watch(isMobile, () => {
    updateSegmentsButtonVisibility();
    if (isMobile.value) {
        menuAnchorRect.value = null;
    }
});

const onExternalSegmentsEvent = (e) => {
    try {
        if (props.description != null) return;
        const segs = Array.isArray(e?.detail?.segments) ? e.detail.segments : [];
        setSegments(segs);
    } catch { /* noop */ }
};

const formatSeconds = (sec) => {
    const s = Math.max(0, Math.floor(sec || 0));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const r = s % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return h > 0 ? `${pad(h)}:${pad(m)}:${pad(r)}` : `${pad(m)}:${pad(r)}`;
};

const updateActiveSegmentUI = (currentTime) => {
    if (!Array.isArray(segments.value) || segments.value.length === 0) return;
    let idx = -1;
    for (let i = 0; i < segments.value.length; i++) {
        if (segments.value[i].time <= currentTime) idx = i; else break;
    }
    if (idx !== currentSegmentIndex.value) {
        currentSegmentIndex.value = idx;
        const labelEl = queryPlayerEl('.zb-current-segment-label');
        if (labelEl) {
            const seg = segments.value[idx];
            labelEl.textContent = seg ? `${formatSeconds(seg.time)} – ${seg.label}` : '';
            labelEl.style.display = seg ? 'inline-flex' : 'none';
        }
    }
};

let menuButtonsBound = false;

const attachMenuButtonListeners = () => {
    if (menuButtonsBound) return;

    const settingsBtn = queryPlayerEl('.zb-settings-btn');
    const segmentsBtn = queryPlayerEl('.zb-segments-btn');
    const heatmapBtn = queryPlayerEl('.zb-watch-heatmap-btn');

    if (settingsBtn) {
        settingsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (menuOpen.value && !menuSegmentsOnly.value) {
                closeMenu();
            } else {
                openMenu('settings', 'main', e);
            }
        });
    }

    if (segmentsBtn) {
        segmentsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (menuOpen.value && menuSegmentsOnly.value) {
                closeMenu();
            } else {
                openMenu('segments', 'segments', e);
            }
        });
    }

    if (heatmapBtn) {
        heatmapBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWatchHeatmap();
        });
    }

    if (settingsBtn || segmentsBtn || heatmapBtn) {
        menuButtonsBound = true;
    }
};
</script>

<style>
:root {
    --plyr-color-main: #facc15;
    --plyr-badge-border-radius: 6px;
    --plyr-control-icon-size: 18px;
    --plyr-control-spacing: 8px;
    --plyr-control-radius: 0.5rem;
    --plyr-menu-color: #ffffff;
    --plyr-menu-radius: 12px;
    --plyr-progress-loading-background: rgba(255, 255, 255, 0.15);
    --plyr-video-progress-buffered-background: rgba(255, 255, 255, 0.2);
    --plyr-range-thumb-height: 12px;
    --plyr-range-thumb-background: #facc15;
    --plyr-range-thumb-shadow: 0 0 0 2px rgba(0, 0, 0, 0.35);
    --plyr-range-thumb-active-shadow-width: 8px;
    --plyr-range-track-height: 3px;
    --plyr-video-range-thumb-active-shadow-color: rgba(250, 204, 21, 0.45);
    --plyr-tooltip-background: rgba(17, 17, 17, 0.92);
    --plyr-tooltip-color: #ffffff;
    --plyr-tooltip-radius: 0.5rem;
    --zb-progress-gap-color: rgba(0, 0, 0, 0.95);
}

.plyr {
    border-radius: 0.75rem;
    overflow: hidden;
}

.plyr__time--duration::before {
    content: "/" !important;
    margin-inline: 6px !important;
    opacity: 0.45;
}

.plyr__time {
    font-size: 11px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
}

.plyr__controls {
    padding: 8px 10px 10px !important;
}

.zb-player-btn {
    display: inline-flex !important;
    align-items: center;
    justify-content: center;
    width: 2.125rem;
    height: 2.125rem;
    padding: 0.3rem !important;
    margin: 0 !important;
    border-radius: 0.5rem !important;
    color: rgba(255, 255, 255, 0.92) !important;
    background: transparent !important;
    flex-shrink: 0;
    transition: background-color 0.15s ease, color 0.15s ease, transform 0.1s ease !important;
}

.zb-player-btn:hover {
    background: rgba(255, 255, 255, 0.12) !important;
    color: #ffffff !important;
}

.zb-player-btn:active {
    transform: scale(0.96);
    background: rgba(255, 255, 255, 0.18) !important;
}

.zb-player-btn svg {
    width: 1.0625rem;
    height: 1.0625rem;
}

.zb-player-controls-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

@media (max-width: 767px) {
    .zb-player-controls-group {
        gap: 0.15rem;
    }

    .zb-player-btn {
        width: 2rem;
        height: 2rem;
        padding: 0.2rem !important;
    }

    .zb-player-controls-group .plyr__time {
        margin-inline-start: 0;
        padding-inline: 0.125rem;
    }
}

.zb-player-controls-group .plyr__time {
    margin-inline-start: 0.125rem;
    padding-inline: 0.25rem;
}

.plyr .zb-segments-btn {
    display: none !important;
}

@media (min-width: 768px) {
    .plyr .zb-segments-btn.zb-segments-visible {
        display: inline-flex !important;
    }
}

.zb-segments-track {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 4px;
    pointer-events: none;
    z-index: 0;
}

.zb-segment-chunk {
    position: absolute;
    top: 0;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
}

.plyr--segments .plyr__progress input[type="range"] {
    position: relative;
    z-index: 2;
}

.plyr--segments .plyr__progress__buffer {
    position: relative;
    z-index: 1;
}

.zb-watch-heatmap-track {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    height: var(--plyr-range-track-height, 3px);
    pointer-events: none;
    z-index: 0;
    border-radius: calc(var(--plyr-range-track-height, 3px) / 2);
    overflow: hidden;
}

.zb-watch-chunk {
    position: absolute;
    top: 0;
    height: 100%;
    border-radius: inherit;
}

.zb-watch-chunk--watched {
    background: rgba(34, 197, 94, 0.95);
}

.zb-watch-chunk--unwatched {
    background: rgba(239, 68, 68, 0.88);
}

.plyr--watch-heatmap-active .plyr__progress input[type="range"] {
    position: relative;
    z-index: 2;
    background: transparent !important;
    color: var(--plyr-color-main, #facc15);
}

.plyr--watch-heatmap-active .plyr__progress input[type="range"]::-webkit-slider-runnable-track {
    height: var(--plyr-range-track-height, 3px);
    background: transparent !important;
}

.plyr--watch-heatmap-active .plyr__progress input[type="range"]::-moz-range-track {
    height: var(--plyr-range-track-height, 3px);
    background: transparent !important;
}

.plyr--watch-heatmap-active .plyr__progress input[type="range"]::-webkit-slider-thumb {
    width: var(--plyr-range-thumb-height, 12px);
    height: var(--plyr-range-thumb-height, 12px);
    margin-top: calc((var(--plyr-range-track-height, 3px) - var(--plyr-range-thumb-height, 12px)) / 2);
}

.plyr--watch-heatmap-active .plyr__progress input[type="range"]::-moz-range-thumb {
    width: var(--plyr-range-thumb-height, 12px);
    height: var(--plyr-range-thumb-height, 12px);
}

.plyr--watch-heatmap-active .plyr__progress__buffer {
    opacity: 0;
    z-index: 0;
}

.zb-watch-heatmap-btn {
    position: relative;
    z-index: 2;
}

.zb-player-btn--active {
    background: rgba(34, 197, 94, 0.22) !important;
    color: #86efac !important;
}

.zb-player-overlaid {
    background: rgba(0, 0, 0, 0.55) !important;
    backdrop-filter: blur(4px);
    border: 1px solid rgba(255, 255, 255, 0.15) !important;
    transition: background-color 0.15s ease, opacity 0.15s ease !important;
}

.plyr__control--overlaid.zb-player-overlaid:hover {
    background: rgba(0, 0, 0, 0.7) !important;
    opacity: 1 !important;
}

.plyr__progress input[type="range"] {
    cursor: pointer;
}

.plyr__progress__buffer {
    color: rgba(255, 255, 255, 0.25);
}

.plyr__control:focus-visible {
    outline: 2px solid rgba(250, 204, 21, 0.8);
    outline-offset: 2px;
}

.plyr__tooltip {
    display: none !important;
}

.plyr__controls {
    background-image: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.55) 35%, rgba(0, 0, 0, 0.92) 100%) !important;
}

@media only screen and (min-width: 768px) {
    :root {
        --scrollbar-primary: #f1f1f1;
        --scrollbar-secondary: #c1c1c1;
        --scrollbar-secondary-hover: #b7b5b5;
        --scrollbar-secondary-active: #d2d1d1;
    }

    .dark {
        --scrollbar-primary: #424242;
        --scrollbar-secondary: #686868;
        --scrollbar-secondary-hover: #777676;
        --scrollbar-secondary-active: #868585;
    }
}
</style>

<style>
/* Frosted glass — slightly opaque for readable text over bright posters */
.zb-player-glass-panel,
.zb-player-settings-sheet {
    background: rgba(12, 12, 14, 0.34) !important;
    backdrop-filter: blur(24px) saturate(140%);
    -webkit-backdrop-filter: blur(24px) saturate(140%);
    border: 1px solid rgba(255, 255, 255, 0.14);
    box-shadow:
        0 8px 28px rgba(0, 0, 0, 0.18),
        inset 0 1px 0 rgba(255, 255, 255, 0.07);
}

.zb-player-glass-panel {
    border-radius: 0.875rem;
    padding: 0.5rem 0.375rem;
}

.zb-player-settings-sheet {
    border-top: 1px solid rgba(255, 255, 255, 0.12) !important;
    border-radius: 1rem 1rem 0 0 !important;
}

.zb-player-settings-backdrop {
    background: rgba(0, 0, 0, 0.22) !important;
    backdrop-filter: blur(2px) !important;
    -webkit-backdrop-filter: blur(2px) !important;
}

/* Helps backdrop-filter sample the video layer in Chromium/WebKit */
.plyr.zb-player-menu-open .plyr__video-wrapper,
.plyr.zb-player-menu-open video {
    transform: translateZ(0);
}

.zb-player-title-badge__inner.zb-player-glass-panel {
    padding: 0;
}

.zb-player-next-popup-wrap {
    position: absolute;
    bottom: 4rem;
    inset-inline-end: 0.75rem;
    z-index: 50;
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    flex-shrink: 0;
    pointer-events: auto;
}

@media (min-width: 768px) {
    .zb-player-next-popup-wrap {
        bottom: 5rem;
    }
}

.zb-player-next-popup.zb-player-glass-panel {
    width: 15rem;
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    text-align: start;
}

.zb-player-next-popup__poster,
.zb-player-next-popup__poster-fallback {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 0.5rem;
    flex-shrink: 0;
}

.zb-player-next-popup__poster {
    object-fit: cover;
}

.zb-player-next-popup__poster-fallback {
    background: rgba(120, 120, 128, 0.55);
}

.zb-player-next-popup__action {
    width: 100%;
    padding: 0.3rem 0.625rem;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.5rem!important;
    font-weight: 400!important;
    line-height: 1.25;
    color: #000;
    cursor: pointer;
    background: linear-gradient(135deg, #ff9ec5 0%, #ff6bab 52%, #ff4d97 100%)!important;
    transition: filter 0.15s ease, transform 0.1s ease;
}

.zb-player-next-popup__action:hover {
    filter: brightness(1.06);
}

.zb-player-next-popup__action:active {
    transform: scale(0.99);
}

.zb-player-next-popup__close.zb-player-glass-panel {
    flex: 0 0 2rem;
    width: 2rem;
    height: 2rem;
    min-width: 2rem;
    min-height: 2rem;
    padding: 0;
    border-radius: 9999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.92);
    font-size: 1.125rem;
    line-height: 1;
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;
}

.zb-player-next-popup__close.zb-player-glass-panel:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.12) !important;
}
</style>