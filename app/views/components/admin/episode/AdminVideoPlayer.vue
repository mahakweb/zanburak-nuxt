<template>
    <div
        ref="playerContainer"
        class="relative w-full max-w-3xl mx-auto rounded-2xl overflow-hidden bg-[#050811] border border-slate-700/60 shadow-xl group select-none transition-all"
        :class="[containerClass, isFullscreen ? 'fixed inset-0 z-50 max-w-none rounded-none border-none' : '']"
        @mousemove="onMouseMove"
        @mouseleave="onMouseLeave"
    >
        <!-- Video wrapper: strict 16:9 -->
        <div class="relative w-full aspect-video flex items-center justify-center bg-black overflow-hidden">
            <video
                ref="videoRef"
                :src="activeVideoUrl"
                :poster="poster"
                playsinline
                preload="metadata"
                class="w-full h-full object-contain bg-black cursor-pointer"
                @click="togglePlay"
                @dblclick="toggleFullscreen"
                @loadedmetadata="onLoadedMetadata"
                @timeupdate="onTimeUpdate"
                @progress="onProgress"
                @waiting="isBuffering = true"
                @playing="isBuffering = false; isPlaying = true"
                @pause="isPlaying = false"
                @ended="onEnded"
                @error="onError"
            />

            <!-- Hidden canvas for thumbnail generation -->
            <canvas ref="thumbCanvas" class="hidden" width="160" height="90" />
            <!-- Hidden video element for thumbnail generation (separate from main video to avoid seek conflicts) -->
            <video ref="thumbVideoRef" class="hidden" :src="activeVideoUrl" preload="metadata" muted playsinline />

            <!-- Buffering Spinner -->
            <div v-if="isBuffering" class="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
                <div class="w-10 h-10 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
            </div>

            <!-- Center Play Button (small, clean, optically centered) -->
            <transition name="fade">
                <div
                    v-if="!isPlaying && !isBuffering"
                    class="absolute inset-0 flex items-center justify-center pointer-events-none pb-7 sm:pb-8"
                >
                    <button
                        type="button"
                        class="pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 border border-white/25"
                        @click.stop="togglePlay"
                    >
                        <!-- Play icon from main VideoPlayer -->
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 ms-0.5" viewBox="-4 -3 28 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill="none" d="M20.4086 9.35258C22.5305 10.5065 22.5305 13.4935 20.4086 14.6474L7.59662 21.6145C5.53435 22.736 5.53435 22.736 3 18.9671L3 5.0329C3 2.72368 5.53435 1.26402 7.59661 2.38548L20.4086 9.35258Z" stroke="currentColor" stroke-width="2"/>
                        </svg>
                    </button>
                </div>
            </transition>

            <!-- Top-Right Corner: Change & Remove buttons only -->
            <transition name="fade">
                <div
                    v-if="isControlsVisible || !isPlaying"
                    class="absolute top-2 end-2 flex items-center gap-1.5 z-20 pointer-events-auto"
                >
                    <button
                        v-if="allowChange"
                        type="button"
                        class="h-6.5 sm:h-7 px-2 sm:px-2.5 rounded-lg bg-black/50 hover:bg-black/70 text-white text-[11px] sm:text-xs font-medium backdrop-blur-md transition flex items-center gap-1 border border-white/15"
                        title="انتخاب ویدیوی دیگر"
                        @click.stop="$emit('change')"
                    >
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>تغییر</span>
                    </button>
                    <button
                        v-if="allowRemove"
                        type="button"
                        class="h-6.5 sm:h-7 px-2 sm:px-2.5 rounded-lg bg-rose-500/80 hover:bg-rose-600 text-white text-[11px] sm:text-xs font-medium backdrop-blur-md transition flex items-center gap-1 border border-rose-400/30"
                        title="حذف ویدیو"
                        @click.stop="$emit('remove')"
                    >
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>حذف</span>
                    </button>
                </div>
            </transition>

            <!-- Bottom Glass Controls Bar -->
            <transition name="fade">
                <div
                    v-if="isControlsVisible || !isPlaying"
                    dir="ltr"
                    class="absolute bottom-0 inset-x-0 rounded-b-2xl w-full backdrop-blur-md bg-gradient-to-t from-black/70 via-black/55 to-black/30 border-t border-white/10 px-2 sm:px-3 pt-0.5 pb-1 sm:pb-1.5 flex flex-col text-white z-20 pointer-events-auto shadow-2xl"
                    @click.stop
                >
                    <!-- Scrubber Full-Width Row -->
                    <div
                        ref="scrubberRef"
                        class="relative w-full h-3.5 flex items-center cursor-pointer group/scrub"
                        @mousedown.prevent="onScrubberMouseDown"
                        @mousemove="onScrubberMouseMove"
                        @mouseleave="onScrubberMouseLeave"
                        @touchstart.prevent="onScrubberTouchStart"
                    >
                        <!-- Track -->
                        <div class="w-full h-1 group-hover/scrub:h-1.5 rounded-full bg-white/20 transition-all overflow-hidden relative">
                            <!-- Buffered -->
                            <div class="absolute top-0 bottom-0 left-0 bg-white/30 transition-all duration-200" :style="{ width: `${bufferedPercent}%` }" />
                            <!-- Played -->
                            <div class="absolute top-0 bottom-0 left-0 bg-blue-500 transition-all" :style="{ width: `${progressPercent}%` }" />
                        </div>
                        <!-- Thumb knob -->
                        <div
                            class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white shadow-md border border-blue-400 pointer-events-none transition-transform group-hover/scrub:scale-125"
                            :style="{ left: `${progressPercent}%` }"
                        />
                        <!-- Thumbnail preview popup -->
                        <div
                            v-if="thumbVisible && thumbDataUrl"
                            class="absolute bottom-full mb-2 pointer-events-none z-30"
                            :style="{ left: `${thumbPositionPercent}%`, transform: 'translateX(-50%)' }"
                        >
                            <div class="rounded-lg overflow-hidden shadow-2xl border border-white/20 bg-black">
                                <img :src="thumbDataUrl" class="w-24 h-14 object-contain block" alt="" />
                                <div class="text-[10px] font-mono text-center text-white/80 py-0.5 bg-black/70">
                                    {{ formatTime(thumbTime) }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Buttons & Controls Row -->
                    <div class="flex items-center gap-0.5 sm:gap-1.5 w-full pt-0.5">
                        <!-- Play / Pause -->
                        <button
                            type="button"
                            class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-white/15 flex items-center justify-center transition text-white active:scale-95 shrink-0"
                            :title="isPlaying ? 'توقف (فاصله)' : 'پخش (فاصله)'"
                            @click="togglePlay"
                        >
                            <!-- Pause icon -->
                            <svg v-if="isPlaying" class="w-4 h-4 sm:w-5 sm:h-5" viewBox="-3 -3 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.65 19.11V4.89C10.65 3.54 10.08 3 8.64 3H5.01C3.57 3 3 3.54 3 4.89V19.11C3 20.46 3.57 21 5.01 21H8.64C10.08 21 10.65 20.46 10.65 19.11Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M21 19.11V4.89C21 3.54 20.43 3 18.99 3H15.36C13.93 3 13.35 3.54 13.35 4.89V19.11C13.35 20.46 13.92 21 15.36 21H18.99C20.43 21 21 20.46 21 19.11Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <!-- Play icon -->
                            <svg v-else class="w-4 h-4 sm:w-5 sm:h-5" viewBox="-4 -3 28 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.4086 9.35258C22.5305 10.5065 22.5305 13.4935 20.4086 14.6474L7.59662 21.6145C5.53435 22.736 5.53435 22.736 3 18.9671L3 5.0329C3 2.72368 5.53435 1.26402 7.59661 2.38548L20.4086 9.35258Z" stroke="currentColor" stroke-width="2"/>
                            </svg>
                        </button>

                        <!-- Seek -5s -->
                        <button
                            type="button"
                            class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-white/15 flex items-center justify-center transition text-white active:scale-95 shrink-0"
                            title="۵ ثانیه عقب (←)"
                            @click="seekBy(-5)"
                        >
                            <!-- Rewind 5s icon from VideoPlayer -->
                            <svg class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.91 10.8301H10.85L10.09 13.1201H12.38C13.22 13.1201 13.91 13.8001 13.91 14.6501C13.91 15.4901 13.23 16.1801 12.38 16.1801H10.09" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M10.02 4.46997L12 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M4.91 7.79999C3.8 9.27999 3.10999 11.11 3.10999 13.11C3.10999 18.02 7.09 22 12 22C16.91 22 20.89 18.02 20.89 13.11C20.89 8.19999 16.91 4.21997 12 4.21997C11.32 4.21997 10.66 4.31002 10.02 4.46002" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>

                        <!-- Seek +5s -->
                        <button
                            type="button"
                            class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-white/15 flex items-center justify-center transition text-white active:scale-95 shrink-0"
                            title="۵ ثانیه جلو (→)"
                            @click="seekBy(5)"
                        >
                            <!-- Fast-forward 5s icon from VideoPlayer -->
                            <svg class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.98 4.46997L12 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M19.0899 7.79999C20.1999 9.27999 20.8899 11.11 20.8899 13.11C20.8899 18.02 16.9099 22 11.9999 22C7.08988 22 3.10986 18.02 3.10986 13.11C3.10986 8.19999 7.08988 4.21997 11.9999 4.21997C12.6799 4.21997 13.3399 4.31002 13.9799 4.46002" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M13.91 10.8301H10.85L10.0901 13.1201H12.3801C13.2201 13.1201 13.91 13.8001 13.91 14.6501C13.91 15.4901 13.2301 16.1801 12.3801 16.1801H10.0901" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>

                        <!-- Combined Time Display (Current / Duration) -->
                        <div class="text-[10px] sm:text-[11px] font-mono font-medium text-slate-200 tracking-tight shrink-0 select-none ms-1 flex items-center gap-1">
                            <span>{{ formatTime(currentTime) }}</span>
                            <span class="text-white/40">/</span>
                            <span class="text-white/70">{{ formatTime(duration) }}</span>
                        </div>

                        <!-- Spacer -->
                        <div class="flex-1" />

                        <!-- Volume Control (vertical popup) -->
                        <div class="relative shrink-0" ref="volumeContainer">
                            <!-- Volume Popup (vertical, opens upward) -->
                            <transition name="popup">
                                <div
                                    v-if="showVolumePopup"
                                    class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex flex-col items-center gap-2 bg-black/80 backdrop-blur-md rounded-xl p-3 border border-white/10 shadow-2xl z-30"
                                    style="min-height: 100px;"
                                >
                                    <!-- Volume level text -->
                                    <span class="text-[10px] font-mono text-white/70">{{ Math.round((isMuted ? 0 : volume) * 100) }}</span>
                                    <!-- Vertical slider -->
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.05"
                                        :value="isMuted ? 0 : volume"
                                        class="vertical-slider accent-blue-500"
                                        @input="onVolumeChange"
                                    />
                                </div>
                            </transition>
                            <button
                                type="button"
                                class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-white/15 flex items-center justify-center transition text-white active:scale-95"
                                :title="isMuted ? 'صدادار' : 'بی‌صدا'"
                                @click="toggleVolumePopup"
                            >
                                <!-- Muted icon -->
                                <svg v-if="isMuted || volume === 0" class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.25 11.9998C16.25 11.5856 15.9142 11.2498 15.5 11.2498C15.0858 11.2498 14.75 11.5856 14.75 11.9998H16.25ZM7.0162 6.95791L7.14108 7.69744L7.0162 6.95791ZM8.59932 6.22002L8.18647 5.59387L8.18647 5.59387L8.59932 6.22002ZM7.72795 6.74438L8.03077 7.43053L7.72795 6.74438ZM3.33988 16.7225L3.02496 17.4032L3.33988 16.7225ZM1.53479 13.0282L0.786179 13.0738L1.53479 13.0282ZM1.95854 15.4228L2.6188 15.067L1.95854 15.4228ZM13.7001 20.0747L13.4578 19.3649L13.7001 20.0747ZM15.4127 14.6052L16.1619 14.64L15.4127 14.6052ZM14.2797 19.7797L14.7109 20.3934L14.2797 19.7797ZM8.81825 6.07566L9.2311 6.70181L9.2311 6.70181L8.81825 6.07566ZM13.7001 3.92487L13.4578 4.63468L13.7001 3.92487ZM14.2797 4.21984L14.7109 3.60621L14.2797 4.21984ZM3.33988 7.27707L3.02496 6.5964L3.33988 7.27707ZM1.53479 10.9714L0.786179 10.9258L1.53479 10.9714ZM1.95854 8.57679L2.6188 8.93254L1.95854 8.57679ZM9.91107 17.7452C9.56462 17.5182 9.09972 17.615 8.87269 17.9615C8.64566 18.3079 8.74247 18.7728 9.08893 18.9998L9.91107 17.7452ZM9.01216 6.84616L9.2311 6.70181L8.40541 5.44952L8.18647 5.59387L9.01216 6.84616ZM2.2834 12.9826C2.26225 12.6356 2.25 12.303 2.25 11.9998H0.75C0.75 12.3414 0.763733 12.7056 0.786179 13.0738L2.2834 12.9826ZM2.25 11.9998C2.25 11.6966 2.26225 11.364 2.2834 11.017L0.786179 10.9258C0.763733 11.294 0.75 11.6582 0.75 11.9998H2.25ZM14.75 11.9998C14.75 12.5116 14.7156 13.4508 14.6635 14.5704L16.1619 14.64C16.2137 13.525 16.25 12.5518 16.25 11.9998H14.75ZM6.00008 7.74979C6.48771 7.74979 6.81682 7.7522 7.14108 7.69744L6.89132 6.21838C6.71956 6.24738 6.5366 6.24979 6.00008 6.24979V7.74979ZM8.18647 5.59387C7.73856 5.8892 7.58448 5.98791 7.42513 6.05823L8.03077 7.43053C8.33163 7.29775 8.60506 7.11458 9.01216 6.84616L8.18647 5.59387ZM7.14108 7.69744C7.44756 7.64568 7.74641 7.55603 8.03077 7.43053L7.42513 6.05823C7.25452 6.13353 7.0752 6.18732 6.89132 6.21838L7.14108 7.69744ZM6.00008 17.7498C6.5366 17.7498 6.71956 17.7522 6.89132 17.7812L7.14108 16.3021C6.81682 16.2474 6.48771 16.2498 6.00008 16.2498V17.7498ZM6.00008 16.2498C4.55641 16.2498 4.06911 16.2335 3.6548 16.0418L3.02496 17.4032C3.80931 17.7661 4.69593 17.7498 6.00008 17.7498V16.2498ZM0.786179 13.0738C0.856484 14.2273 0.890091 15.021 1.29828 15.7785L2.6188 15.067C2.40052 14.6619 2.36045 14.2467 2.2834 12.9826L0.786179 13.0738ZM3.6548 16.0418C3.25445 15.8566 2.82804 15.4554 2.6188 15.067L1.29828 15.7785C1.66141 16.4525 2.33016 17.0817 3.02496 17.4032L3.6548 16.0418ZM14.6635 14.5704C14.5924 16.1011 14.541 17.1731 14.4015 17.9479C14.2626 18.7193 14.0651 19.0139 13.8485 19.1661L14.7109 20.3934C15.417 19.8972 15.7159 19.1131 15.8778 18.2137C16.0391 17.3178 16.0928 16.1266 16.1619 14.64L14.6635 14.5704ZM13.9423 20.7845C14.2142 20.6917 14.4759 20.5585 14.7109 20.3934L13.8485 19.1661C13.7297 19.2496 13.5952 19.318 13.4578 19.3649L13.9423 20.7845ZM9.2311 6.70181C10.5209 5.85139 11.426 5.2565 12.1402 4.90954C12.8525 4.56352 13.2087 4.54965 13.4578 4.63468L13.9423 3.21506C13.1241 2.93586 12.3108 3.15904 11.4848 3.56031C10.6607 3.96063 9.65858 4.62325 8.40541 5.44952L9.2311 6.70181ZM13.4578 4.63468C13.5952 4.68157 13.7297 4.74998 13.8485 4.83346L14.7109 3.60621C14.4759 3.44103 14.2142 3.30784 13.9423 3.21506L13.4578 4.63468ZM6.00008 6.24979C4.69593 6.24979 3.80931 6.23351 3.02496 6.5964L3.6548 7.95775C4.06911 7.76607 4.55641 7.74979 6.00008 7.74979V6.24979ZM2.2834 11.017C2.36045 9.75285 2.40052 9.33765 2.6188 8.93254L1.29828 8.22104C0.890091 8.97862 0.856484 9.77226 0.786179 10.9258L2.2834 11.017ZM3.02496 6.5964C2.33016 6.91785 1.66141 7.54708 1.29828 8.22104L2.6188 8.93254C2.82804 8.54419 3.25445 8.14298 3.6548 7.95775L3.02496 6.5964ZM9.08893 18.9998C10.1277 19.6806 10.9875 20.2245 11.7204 20.5488C12.4627 20.8771 13.2003 21.0377 13.9423 20.7845L13.4578 19.3649C13.2324 19.4418 12.9187 19.4386 12.3272 19.177C11.7264 18.9112 10.9698 18.439 9.91107 17.7452L9.08893 18.9998ZM16.1231 8.53978C16.0624 7.31263 15.9963 6.30685 15.827 5.52953C15.6552 4.7411 15.3503 4.05557 14.7109 3.60621L13.8485 4.83346C14.0443 4.97111 14.2254 5.22507 14.3614 5.84888C14.4997 6.48379 14.5631 7.36297 14.6249 8.61379L16.1231 8.53978Z" stroke="currentColor" stroke-width="0.1" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M20 18C20 18 21.5 16.2 21.5 12C21.5 9.56658 20.9965 7.93882 20.5729 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M18 15C18 15 18.5 14.1 18.5 12C18.5 11.1381 18.4158 10.4784 18.3165 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M22 2L2 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <!-- Low volume icon -->
                                <svg v-else-if="volume < 0.5" class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.53479 10.9714C1.60847 9.76255 1.64531 9.15814 1.95854 8.57679C2.24473 8.04563 2.7923 7.53042 3.33988 7.27707C3.93921 6.99979 4.62617 6.99979 6.00008 6.99979C6.51215 6.99979 6.76819 6.99979 7.0162 6.95791C7.26138 6.9165 7.50046 6.84478 7.72795 6.74438C7.95806 6.64283 8.17181 6.50189 8.59932 6.22002L8.81825 6.07566C11.3612 4.39898 12.6327 3.56063 13.7001 3.92487C13.9047 3.9947 14.1028 4.09551 14.2797 4.21984C15.2024 4.86829 15.2725 6.37699 15.4127 9.3944C15.4646 10.5117 15.5 11.4679 15.5 11.9998C15.5 12.5317 15.4646 13.4879 15.4127 14.6052C15.2725 17.6226 15.2024 19.1313 14.2797 19.7797C14.1028 19.9041 13.9047 20.0049 13.7001 20.0747C12.6327 20.4389 11.3612 19.6006 8.81825 17.9239L8.59932 17.7796C8.17181 17.4977 7.95806 17.3567 7.72795 17.2552C7.50046 17.1548 7.26138 17.0831 7.0162 17.0417C6.76819 16.9998 6.51215 16.9998 6.00008 16.9998C4.62617 16.9998 3.93921 16.9998 3.33988 16.7225C2.7923 16.4692 2.24473 15.9539 1.95854 15.4228C1.64531 14.8414 1.60847 14.237 1.53479 13.0282C1.51299 12.6706 1.5 12.3222 1.5 11.9998C1.5 11.6774 1.51299 11.329 1.53479 10.9714Z" stroke="currentColor" stroke-width="1.5"/>
                                    <path d="M18 9C18 9 18.5 9.9 18.5 12C18.5 14.1 18 15 18 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                </svg>
                                <!-- Full volume icon -->
                                <svg v-else class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.53479 10.9714C1.60847 9.76255 1.64531 9.15814 1.95854 8.57679C2.24473 8.04563 2.7923 7.53042 3.33988 7.27707C3.93921 6.99979 4.62617 6.99979 6.00008 6.99979C6.51215 6.99979 6.76819 6.99979 7.0162 6.95791C7.26138 6.9165 7.50046 6.84478 7.72795 6.74438C7.95806 6.64283 8.17181 6.50189 8.59932 6.22002L8.81825 6.07566C11.3612 4.39898 12.6327 3.56063 13.7001 3.92487C13.9047 3.9947 14.1028 4.09551 14.2797 4.21984C15.2024 4.86829 15.2725 6.37699 15.4127 9.3944C15.4646 10.5117 15.5 11.4679 15.5 11.9998C15.5 12.5317 15.4646 13.4879 15.4127 14.6052C15.2725 17.6226 15.2024 19.1313 14.2797 19.7797C14.1028 19.9041 13.9047 20.0049 13.7001 20.0747C12.6327 20.4389 11.3612 19.6006 8.81825 17.9239L8.59932 17.7796C8.17181 17.4977 7.95806 17.3567 7.72795 17.2552C7.50046 17.1548 7.26138 17.0831 7.0162 17.0417C6.76819 16.9998 6.51215 16.9998 6.00008 16.9998C4.62617 16.9998 3.93921 16.9998 3.33988 16.7225C2.7923 16.4692 2.24473 15.9539 1.95854 15.4228C1.64531 14.8414 1.60847 14.237 1.53479 13.0282C1.51299 12.6706 1.5 12.3222 1.5 11.9998C1.5 11.6774 1.51299 11.329 1.53479 10.9714Z" stroke="currentColor" stroke-width="1.5"/>
                                    <path d="M20 6C20 6 21.5 7.8 21.5 12C21.5 16.2 20 18 20 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                    <path d="M18 9C18 9 18.5 9.9 18.5 12C18.5 14.1 18 15 18 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                </svg>
                            </button>
                        </div>

                        <!-- Speed Control (vertical popup) -->
                        <div class="relative shrink-0" ref="speedContainer">
                            <!-- Speed Popup (vertical list, opens upward) -->
                            <transition name="popup">
                                <div
                                    v-if="showSpeedPopup"
                                    class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex flex-col-reverse items-stretch bg-black/80 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 shadow-2xl z-30 min-w-[70px]"
                                >
                                    <button
                                        v-for="rate in speedOptions"
                                        :key="rate"
                                        type="button"
                                        class="px-3 py-1.5 text-[11px] font-bold text-center transition hover:bg-white/15"
                                        :class="playbackRate === rate ? 'text-blue-400 bg-blue-500/15' : 'text-slate-300'"
                                        @click="setPlaybackRate(rate)"
                                    >
                                        {{ rate }}x
                                    </button>
                                </div>
                            </transition>
                            <button
                                type="button"
                                class="px-2 py-0.5 h-7 sm:h-8 rounded-lg text-[10px] sm:text-[11px] font-bold text-slate-300 hover:text-white hover:bg-white/15 transition shrink-0 flex items-center justify-center"
                                title="سرعت پخش"
                                @click="toggleSpeedPopup"
                            >
                                {{ playbackRate }}x
                            </button>
                        </div>

                        <!-- Fullscreen Button -->
                        <button
                            type="button"
                            class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-white/15 flex items-center justify-center transition text-white active:scale-95 shrink-0"
                            :title="isFullscreen ? 'خروج از تمام‌صفحه (F)' : 'تمام‌صفحه (F)'"
                            @click="toggleFullscreen"
                        >
                            <!-- Exit fullscreen -->
                            <svg v-if="isFullscreen" class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 16L2 16C1.44772 16 1 15.5523 1 15C1 14.4477 1.44772 14 2 14L7 14C8.65685 14 10 15.3431 10 17V22C10 22.5523 9.55228 23 9 23C8.44772 23 8 22.5523 8 22V17C8 16.4477 7.55228 16 7 16Z" fill="currentColor"/>
                                <path d="M10 2C10 1.44772 9.55229 1 9 1C8.44772 1 8 1.44772 8 2L8 7C8 7.55228 7.55228 8 7 8L2 8C1.44772 8 1 8.44771 1 9C1 9.55228 1.44772 10 2 10L7 10C8.65685 10 10 8.65685 10 7L10 2Z" fill="currentColor"/>
                                <path d="M14 22C14 22.5523 14.4477 23 15 23C15.5523 23 16 22.5523 16 22V17C16 16.4477 16.4477 16 17 16H22C22.5523 16 23 15.5523 23 15C23 14.4477 22.5523 14 22 14H17C15.3431 14 14 15.3431 14 17V22Z" fill="currentColor"/>
                                <path d="M14 7C14 8.65686 15.3431 10 17 10L22 10C22.5523 10 23 9.55228 23 9C23 8.44772 22.5523 8 22 8L17 8C16.4477 8 16 7.55229 16 7L16 2C16 1.44772 15.5523 1 15 1C14.4477 1 14 1.44772 14 2L14 7Z" fill="currentColor"/>
                            </svg>
                            <!-- Enter fullscreen -->
                            <svg v-else class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                <path d="M10 22C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                <path d="M10 2C6.22876 2 4.34315 2 3.17157 3.17157C2 4.34315 2 6.22876 2 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                <path d="M14 2C17.7712 2 19.6569 2 20.8284 3.17157C22 4.34315 22 6.22876 22 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
export default {
    name: "AdminVideoPlayer",
    props: {
        src: {
            type: [String, Object],
            default: null,
        },
        poster: {
            type: String,
            default: "",
        },
        title: {
            type: String,
            default: "",
        },
        size: {
            type: Number,
            default: 0,
        },
        allowChange: {
            type: Boolean,
            default: true,
        },
        allowRemove: {
            type: Boolean,
            default: true,
        },
        badgeText: {
            type: String,
            default: "",
        },
        containerClass: {
            type: String,
            default: "",
        },
    },
    emits: ["change", "remove", "duration"],
    data() {
        return {
            internalBlobUrl: null,
            isPlaying: false,
            isBuffering: false,
            currentTime: 0,
            duration: 0,
            bufferedPercent: 0,
            volume: 1,
            isMuted: false,
            playbackRate: 1,
            speedOptions: [0.5, 0.75, 1, 1.25, 1.5, 2],
            isFullscreen: false,
            isControlsVisible: true,
            controlsTimeout: null,
            videoWidth: 0,
            videoHeight: 0,
            isDraggingScrubber: false,
            // Volume popup
            showVolumePopup: false,
            // Speed popup
            showSpeedPopup: false,
            // Thumbnail
            thumbVisible: false,
            thumbDataUrl: null,
            thumbTime: 0,
            thumbPositionPercent: 0,
            thumbFrames: {},   // { second: dataUrl }
            thumbGenerating: false,
        };
    },
    computed: {
        activeVideoUrl() {
            if (!this.src) return "";
            if (typeof this.src === "string") return this.src;
            if (this.src instanceof Blob || (typeof File !== "undefined" && this.src instanceof File)) {
                return this.internalBlobUrl;
            }
            return "";
        },
        progressPercent() {
            if (!this.duration || this.duration === 0) return 0;
            return Math.min(100, Math.max(0, (this.currentTime / this.duration) * 100));
        },
    },
    watch: {
        src: {
            immediate: true,
            handler(newVal) {
                this.updateSource(newVal);
            },
        },
    },
    mounted() {
        document.addEventListener("keydown", this.onKeydown);
        document.addEventListener("fullscreenchange", this.onFullscreenChange);
        document.addEventListener("click", this.onDocumentClick, true);
    },
    beforeUnmount() {
        document.removeEventListener("keydown", this.onKeydown);
        document.removeEventListener("fullscreenchange", this.onFullscreenChange);
        document.removeEventListener("click", this.onDocumentClick, true);
        if (this.internalBlobUrl) {
            URL.revokeObjectURL(this.internalBlobUrl);
            this.internalBlobUrl = null;
        }
        if (this.controlsTimeout) clearTimeout(this.controlsTimeout);
    },
    methods: {
        // ---- Source ----
        updateSource(source) {
            if (this.internalBlobUrl) {
                URL.revokeObjectURL(this.internalBlobUrl);
                this.internalBlobUrl = null;
            }
            if (source && (source instanceof Blob || (typeof File !== "undefined" && source instanceof File))) {
                this.internalBlobUrl = URL.createObjectURL(source);
            }
            this.currentTime = 0;
            this.isPlaying = false;
            this.thumbFrames = {};
        },

        // ---- Playback ----
        togglePlay() {
            const video = this.$refs.videoRef;
            if (!video) return;
            if (video.paused || video.ended) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        },
        seekBy(seconds) {
            const video = this.$refs.videoRef;
            if (!video || !this.duration) return;
            video.currentTime = Math.min(this.duration, Math.max(0, video.currentTime + seconds));
        },

        // ---- Metadata & Events ----
        onLoadedMetadata(e) {
            const video = e.target;
            this.duration = video.duration || 0;
            this.videoWidth = video.videoWidth || 0;
            this.videoHeight = video.videoHeight || 0;
            this.$emit("duration", this.duration);
            // Start generating thumbnail frames after a brief delay
            this.$nextTick(() => this.generateThumbnailFrames());
        },
        onTimeUpdate(e) {
            if (!this.isDraggingScrubber) {
                this.currentTime = e.target.currentTime;
            }
        },
        onProgress(e) {
            const video = e.target;
            if (video.buffered.length > 0 && video.duration) {
                const bufferedEnd = video.buffered.end(video.buffered.length - 1);
                this.bufferedPercent = Math.min(100, (bufferedEnd / video.duration) * 100);
            }
        },
        onEnded() {
            this.isPlaying = false;
            this.isControlsVisible = true;
        },
        onError() {
            this.isBuffering = false;
            this.isPlaying = false;
        },

        // ---- Formatting ----
        formatTime(seconds) {
            if (!seconds || isNaN(seconds) || seconds < 0) return "00:00";
            const totalSec = Math.floor(seconds);
            const h = Math.floor(totalSec / 3600);
            const m = Math.floor((totalSec % 3600) / 60);
            const s = totalSec % 60;
            if (h > 0) {
                return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
            }
            return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
        },

        // ---- Scrubber ----
        onScrubberMouseDown(e) {
            e.preventDefault();
            // Stop thumbnail generation so it doesn't interfere with seeking
            this.thumbGenerating = false;
            this.isDraggingScrubber = true;
            this.seekFromScrubberEvent(e);
            const onMouseMove = (moveEvent) => {
                moveEvent.preventDefault();
                if (this.isDraggingScrubber) this.seekFromScrubberEvent(moveEvent);
            };
            const onMouseUp = () => {
                this.isDraggingScrubber = false;
                window.removeEventListener("mousemove", onMouseMove);
                window.removeEventListener("mouseup", onMouseUp);
            };
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);
        },
        onScrubberMouseMove(e) {
            if (!this.duration) return;
            const scrubber = this.$refs.scrubberRef;
            if (!scrubber) return;
            const rect = scrubber.getBoundingClientRect();
            const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
            const hoverTime = ratio * this.duration;
            this.thumbTime = hoverTime;
            this.thumbPositionPercent = ratio * 100;
            this.thumbVisible = true;
            // Only use pre-cached frames — never seek the video on hover (would break click/drag)
            const sec = Math.floor(hoverTime);
            const cached = this.thumbFrames[sec] || this.thumbFrames[sec - 1] || this.thumbFrames[sec + 1];
            if (cached) {
                this.thumbDataUrl = cached;
            } else {
                this.thumbDataUrl = null;
            }
        },
        onScrubberMouseLeave() {
            this.thumbVisible = false;
        },
        onScrubberTouchStart(e) {
            this.isDraggingScrubber = true;
            if (e.touches && e.touches[0]) this.seekFromScrubberEvent(e.touches[0]);
            const onTouchMove = (moveEvent) => {
                if (this.isDraggingScrubber && moveEvent.touches && moveEvent.touches[0]) {
                    this.seekFromScrubberEvent(moveEvent.touches[0]);
                }
            };
            const onTouchEnd = () => {
                this.isDraggingScrubber = false;
                window.removeEventListener("touchmove", onTouchMove);
                window.removeEventListener("touchend", onTouchEnd);
            };
            window.addEventListener("touchmove", onTouchMove, { passive: true });
            window.addEventListener("touchend", onTouchEnd);
        },
        seekFromScrubberEvent(e) {
            const scrubber = this.$refs.scrubberRef;
            const video = this.$refs.videoRef;
            if (!scrubber || !video || !this.duration) return;
            const rect = scrubber.getBoundingClientRect();
            const clientX = e.clientX || 0;
            const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
            const newTime = ratio * this.duration;
            this.currentTime = newTime;
            video.currentTime = newTime;
        },

        // ---- Thumbnail Generation ----
        async generateThumbnailFrames() {
            if (this.thumbGenerating || !this.duration || !this.activeVideoUrl) return;
            this.thumbGenerating = true;

            // Sample every N seconds (up to 60 frames max)
            const totalSecs = Math.floor(this.duration);
            const step = Math.max(2, Math.ceil(totalSecs / 60));

            for (let sec = 0; sec <= totalSecs; sec += step) {
                // Abort if user interacted or component unmounted
                if (!this.thumbGenerating || !this.$refs.thumbVideoRef) break;
                // Wait while user is dragging to avoid any conflicts
                while (this.isDraggingScrubber) {
                    await new Promise(r => setTimeout(r, 100));
                }
                if (!this.thumbGenerating) break;
                await this.captureFrameAt(sec, true);
                await new Promise(r => setTimeout(r, 30));
            }
            this.thumbGenerating = false;
        },

        captureFrameAt(time, storeInFrames = false) {
            return new Promise((resolve) => {
                // Use separate hidden thumb video — never seek the main player video
                const video = this.$refs.thumbVideoRef || this.$refs.videoRef;
                const canvas = this.$refs.thumbCanvas;
                if (!video || !canvas) return resolve(null);
                const ctx = canvas.getContext("2d");
                if (!ctx) return resolve(null);

                const capture = () => {
                    try {
                        canvas.width = 160;
                        canvas.height = 90;
                        ctx.drawImage(video, 0, 0, 160, 90);
                        const url = canvas.toDataURL("image/jpeg", 0.6);
                        if (storeInFrames) {
                            this.thumbFrames[Math.floor(time)] = url;
                        }
                        resolve(url);
                    } catch {
                        resolve(null);
                    }
                };

                if (Math.abs(video.currentTime - time) < 0.5) {
                    capture();
                } else {
                    const onSeeked = () => {
                        video.removeEventListener("seeked", onSeeked);
                        capture();
                    };
                    video.addEventListener("seeked", onSeeked, { once: true });
                    try { video.currentTime = time; } catch { resolve(null); }
                }
            });
        },

        // ---- Volume ----
        toggleVolumePopup() {
            this.showSpeedPopup = false;
            this.showVolumePopup = !this.showVolumePopup;
        },
        toggleMute() {
            const video = this.$refs.videoRef;
            if (!video) return;
            this.isMuted = !this.isMuted;
            video.muted = this.isMuted;
        },
        onVolumeChange(e) {
            const val = parseFloat(e.target.value);
            this.volume = val;
            const video = this.$refs.videoRef;
            if (video) {
                video.volume = val;
                this.isMuted = val === 0;
                video.muted = this.isMuted;
            }
        },

        // ---- Speed ----
        toggleSpeedPopup() {
            this.showVolumePopup = false;
            this.showSpeedPopup = !this.showSpeedPopup;
        },
        setPlaybackRate(rate) {
            this.playbackRate = rate;
            const video = this.$refs.videoRef;
            if (video) video.playbackRate = rate;
            this.showSpeedPopup = false;
        },

        // ---- Fullscreen ----
        toggleFullscreen() {
            const container = this.$refs.playerContainer;
            if (!container) return;
            if (!document.fullscreenElement) {
                if (container.requestFullscreen) container.requestFullscreen().catch(() => {});
            } else {
                if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
            }
        },
        onFullscreenChange() {
            this.isFullscreen = !!document.fullscreenElement;
        },

        // ---- Controls visibility ----
        onMouseMove() {
            this.isControlsVisible = true;
            if (this.controlsTimeout) clearTimeout(this.controlsTimeout);
            if (this.isPlaying) {
                this.controlsTimeout = setTimeout(() => {
                    this.isControlsVisible = false;
                }, 3000);
            }
        },
        onMouseLeave() {
            if (this.isPlaying) this.isControlsVisible = false;
        },

        // ---- Click outside popups ----
        onDocumentClick(e) {
            if (this.showVolumePopup) {
                const container = this.$refs.volumeContainer;
                if (container && !container.contains(e.target)) this.showVolumePopup = false;
            }
            if (this.showSpeedPopup) {
                const container = this.$refs.speedContainer;
                if (container && !container.contains(e.target)) this.showSpeedPopup = false;
            }
        },

        // ---- Keyboard ----
        onKeydown(e) {
            if (!this.$refs.playerContainer) return;
            const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
            if (activeTag === "input" || activeTag === "textarea") return;
            const isMouseOver = this.$refs.playerContainer.matches(":hover") || this.isFullscreen;
            if (!isMouseOver) return;

            if (e.code === "Space") {
                e.preventDefault();
                this.togglePlay();
            } else if (e.code === "KeyF") {
                e.preventDefault();
                this.toggleFullscreen();
            } else if (e.code === "KeyM") {
                e.preventDefault();
                this.toggleMute();
            } else if (e.code === "ArrowRight") {
                e.preventDefault();
                this.seekBy(5);
            } else if (e.code === "ArrowLeft") {
                e.preventDefault();
                this.seekBy(-5);
            }
        },
    },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.popup-enter-active,
.popup-leave-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
}
.popup-enter-from,
.popup-leave-to {
    opacity: 0;
    transform: translateY(6px) translateX(-50%);
}
.popup-enter-to,
.popup-leave-from {
    transform: translateY(0) translateX(-50%);
}

/* Vertical range slider */
.vertical-slider {
    -webkit-appearance: slider-vertical;
    appearance: slider-vertical;
    writing-mode: vertical-lr;
    direction: rtl;
    width: 6px;
    height: 80px;
    cursor: pointer;
    accent-color: #3b82f6;
}

/* Custom range thumb for webkit */
.vertical-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    box-shadow: 0 0 4px rgba(59,130,246,0.6);
}
</style>
