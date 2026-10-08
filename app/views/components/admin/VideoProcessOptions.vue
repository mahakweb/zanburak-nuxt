<template>
    <div class="space-y-4">
        <!-- Storage -->
        <section class="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900/70 p-4 shadow-sm">
            <div class="flex items-center justify-between gap-3 mb-3">
                <div>
                    <h4 class="text-sm font-bold text-gray-900 dark:text-white">مقصد ذخیره</h4>
                    <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">خام و خروجی‌ها روی همین مقصد می‌روند</p>
                </div>
                <span
                    v-if="sourceHeight"
                    class="shrink-0 rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-1 text-[10px] font-semibold text-gray-600 dark:text-gray-300">
                    منبع ≈ {{ sourceLabel }}
                </span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                    v-for="t in storageTargets"
                    :key="t.id"
                    type="button"
                    class="group relative rounded-xl border px-3 py-2.5 text-start transition duration-200"
                    :class="storageDisk === t.id
                        ? 'border-yellow-400 bg-yellow-400/10 shadow-sm ring-1 ring-yellow-400/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-yellow-400/50 hover:bg-gray-50 dark:hover:bg-gray-800/60'"
                    @click="storageDisk = t.id; emitChange()">
                    <span class="block text-xs font-bold text-gray-900 dark:text-white">{{ shortStorageLabel(t.id) }}</span>
                    <span class="mt-0.5 block text-[10px] text-gray-500 dark:text-gray-400 leading-snug">{{ t.label }}</span>
                </button>
            </div>
        </section>

        <!-- Stream + Download cards -->
        <div class="grid grid-cols-1 gap-3" :class="isTrailer ? '' : 'lg:grid-cols-2'">
            <section
                class="rounded-2xl border bg-white dark:bg-gray-900/70 p-4 shadow-sm transition duration-300"
                :class="(wantStream || isTrailer)
                    ? 'border-yellow-400/60 ring-1 ring-yellow-400/20'
                    : 'border-gray-200/80 dark:border-gray-700/80 opacity-90'">
                <div class="flex items-start justify-between gap-3 mb-3">
                    <div class="min-w-0">
                        <h4 class="text-sm font-bold text-gray-900 dark:text-white">{{ isTrailer ? 'تریلر' : 'استریم' }}</h4>
                        <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{{ isTrailer ? 'پخش آنلاین HLS تریلر' : 'پخش آنلاین HLS' }}</p>
                    </div>
                    <AdminToggleSwitch v-if="!isTrailer" v-model="wantStream" size="sm" @update:model-value="onOutputChange" />
                </div>

                <Transition name="vpo-fade">
                    <div v-if="wantStream || isTrailer" class="space-y-3">
                        <div class="flex items-center justify-between gap-2">
                            <span class="text-[11px] font-medium text-gray-500 dark:text-gray-400">کیفیت‌ها</span>
                            <button
                                type="button"
                                class="text-[11px] font-semibold text-yellow-600 dark:text-yellow-400 hover:underline"
                                @click="toggleAllQualities('stream')">
                                {{ isAllSelected('stream') ? 'حذف همه' : 'انتخاب همه' }}
                            </button>
                        </div>
                        <div class="flex flex-wrap gap-1.5">
                            <button
                                v-for="q in available"
                                :key="`stream-${q}`"
                                type="button"
                                class="rounded-full px-3 py-1.5 text-xs font-semibold transition duration-200 border"
                                :class="streamSelected.includes(q)
                                    ? 'border-yellow-400 bg-yellow-400 text-gray-900 shadow-sm'
                                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-yellow-400/50'"
                                @click="toggleQualityIn('stream', q)">
                                {{ q }}p
                                <span v-if="q === available[0]" class="opacity-70"> · منبع</span>
                            </button>
                        </div>
                        <p v-if="(wantStream || isTrailer) && !streamSelected.length" class="text-[11px] text-rose-500">حداقل یک کیفیت انتخاب کنید.</p>
                    </div>
                    <p v-else class="text-[11px] text-gray-400 py-1">برای ساخت نسخه آنلاین فعال کنید.</p>
                </Transition>
            </section>

            <section
                v-if="!isTrailer"
                class="rounded-2xl border bg-white dark:bg-gray-900/70 p-4 shadow-sm transition duration-300"
                :class="wantDownload
                    ? 'border-yellow-400/60 ring-1 ring-yellow-400/20'
                    : 'border-gray-200/80 dark:border-gray-700/80 opacity-90'">
                <div class="flex items-start justify-between gap-3 mb-3">
                    <div class="min-w-0">
                        <h4 class="text-sm font-bold text-gray-900 dark:text-white">دانلود</h4>
                        <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">فایل MP4</p>
                    </div>
                    <AdminToggleSwitch v-model="wantDownload" size="sm" @update:model-value="onOutputChange" />
                </div>

                <Transition name="vpo-fade">
                    <div v-if="wantDownload" class="space-y-3">
                        <div class="flex items-center justify-between gap-2">
                            <span class="text-[11px] font-medium text-gray-500 dark:text-gray-400">کیفیت‌ها</span>
                            <button
                                type="button"
                                class="text-[11px] font-semibold text-yellow-600 dark:text-yellow-400 hover:underline"
                                @click="toggleAllQualities('download')">
                                {{ isAllSelected('download') ? 'حذف همه' : 'انتخاب همه' }}
                            </button>
                        </div>
                        <div class="flex flex-wrap gap-1.5">
                            <button
                                v-for="q in available"
                                :key="`download-${q}`"
                                type="button"
                                class="rounded-full px-3 py-1.5 text-xs font-semibold transition duration-200 border"
                                :class="downloadSelected.includes(q)
                                    ? 'border-yellow-400 bg-yellow-400 text-gray-900 shadow-sm'
                                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-yellow-400/50'"
                                @click="toggleQualityIn('download', q)">
                                {{ q }}p
                                <span v-if="q === available[0]" class="opacity-70"> · منبع</span>
                            </button>
                        </div>
                        <p v-if="wantDownload && !downloadSelected.length" class="text-[11px] text-rose-500">حداقل یک کیفیت انتخاب کنید.</p>
                    </div>
                    <p v-else class="text-[11px] text-gray-400 py-1">برای ساخت فایل دانلودی فعال کنید.</p>
                </Transition>
            </section>
        </div>

        <p v-if="!isTrailer && !wantStream && !wantDownload" class="text-[11px] text-rose-500 -mt-1">حداقل یکی از خروجی‌ها را فعال کنید.</p>

        <!-- Watermark -->
        <section
            class="rounded-2xl border bg-white dark:bg-gray-900/70 p-4 shadow-sm transition duration-300"
            :class="wm.enabled
                ? 'border-yellow-400/60 ring-1 ring-yellow-400/20'
                : 'border-gray-200/80 dark:border-gray-700/80'">
            <div class="flex items-start justify-between gap-3">
                <div>
                    <h4 class="text-sm font-bold text-gray-900 dark:text-white">واترمارک</h4>
                    <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">متن یا تصویر روی خروجی‌ها</p>
                </div>
                <AdminToggleSwitch
                    :model-value="!!wm.enabled"
                    size="sm"
                    @update:model-value="onWatermarkToggle" />
            </div>

            <!-- Keep video element always mounted so preview works when enabling after file select -->
            <video ref="previewVideo" class="hidden" muted playsinline preload="metadata"></video>

            <Transition name="vpo-fade">
                <div v-if="wm.enabled" class="mt-4 space-y-4">
                    <div class="flex gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800/80">
                        <button
                            type="button"
                            class="flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition duration-200"
                            :class="wm.type === 'text'
                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'"
                            @click="wm.type = 'text'; onWmVisualChange()">
                            متن
                        </button>
                        <button
                            type="button"
                            class="flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition duration-200"
                            :class="wm.type === 'image'
                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'"
                            @click="wm.type = 'image'; onWmVisualChange()">
                            تصویر
                        </button>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                        <div class="lg:max-h-[26.5rem] overflow-y-auto custom-scrollbar space-y-2 pe-1.5">
                            <template v-if="wm.type === 'text'">
                                <div class="vpo-acc rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <button type="button" class="vpo-acc-head" @click="toggleWmPanel('text')">
                                        <span>متن و استایل</span>
                                        <svg class="w-4 h-4 transition-transform" :class="wmPanels.text ? 'rotate-180' : ''" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>
                                    </button>
                                    <div v-show="wmPanels.text" class="vpo-acc-body space-y-3">
                                        <div>
                                            <label class="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1.5">متن</label>
                                            <input
                                                v-model="wm.text"
                                                type="text"
                                                maxlength="80"
                                                placeholder="مثلاً zanburak.ir"
                                                class="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent px-3 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-400/60 focus:border-yellow-400 transition"
                                                @input="onWmVisualChange">
                                        </div>
                                        <div>
                                            <label class="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1.5">استایل آماده</label>
                                            <div class="flex flex-wrap gap-1.5">
                                                <button
                                                    v-for="preset in stylePresets"
                                                    :key="preset.id"
                                                    type="button"
                                                    class="rounded-full px-2.5 py-1 text-[10px] font-semibold border transition"
                                                    :class="activeStylePreset === preset.id
                                                        ? 'border-yellow-400 bg-yellow-400 text-gray-900'
                                                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-yellow-400/50'"
                                                    @click="applyStylePreset(preset)">
                                                    {{ preset.label }}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="vpo-acc rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <button type="button" class="vpo-acc-head" @click="toggleWmPanel('font')">
                                        <span>فونت و اندازه</span>
                                        <svg class="w-4 h-4 transition-transform" :class="wmPanels.font ? 'rotate-180' : ''" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>
                                    </button>
                                    <div v-show="wmPanels.font" class="vpo-acc-body space-y-3">
                                        <div class="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                                            <button
                                                v-for="font in watermarkFonts"
                                                :key="font.id"
                                                type="button"
                                                class="rounded-xl border px-2 py-2 text-start transition"
                                                :class="wm.font === font.id
                                                    ? 'border-yellow-400 bg-yellow-400/10 ring-1 ring-yellow-400/30'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-yellow-400/40'"
                                                @click="wm.font = font.id; onWmVisualChange()">
                                                <span class="block text-[11px] font-semibold text-gray-800 dark:text-gray-100 truncate" :style="{ fontFamily: font.css, fontWeight: font.weight }">
                                                    Aa متن
                                                </span>
                                                <span class="block text-[9px] text-gray-400 mt-0.5 truncate">{{ font.label }}</span>
                                            </button>
                                        </div>
                                        <div>
                                            <div class="flex items-center justify-between mb-1.5">
                                                <label class="text-[11px] font-medium text-gray-500 dark:text-gray-400">اندازه فونت</label>
                                                <span class="text-[11px] font-bold text-gray-700 dark:text-gray-200">{{ wm.font_size }}</span>
                                            </div>
                                            <input v-model.number="wm.font_size" type="range" min="12" max="72" step="1" class="vpo-range w-full" @input="onWmVisualChange">
                                        </div>
                                    </div>
                                </div>

                                <div class="vpo-acc rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <button type="button" class="vpo-acc-head" @click="toggleWmPanel('look')">
                                        <span>رنگ، پس‌زمینه و حاشیه</span>
                                        <svg class="w-4 h-4 transition-transform" :class="wmPanels.look ? 'rotate-180' : ''" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>
                                    </button>
                                    <div v-show="wmPanels.look" class="vpo-acc-body space-y-4">
                                        <div>
                                            <label class="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1.5">رنگ متن</label>
                                            <div class="flex items-center gap-2">
                                                <input v-model="wm.font_color" type="color" class="h-9 w-11 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent cursor-pointer p-0.5" @input="onWmVisualChange">
                                                <input v-model="wm.font_color" type="text" maxlength="7" class="flex-1 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent px-2.5 py-2 text-xs font-mono text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-yellow-400/50" @input="onWmVisualChange">
                                            </div>
                                            <div class="mt-1.5 flex flex-wrap gap-1">
                                                <button
                                                    v-for="c in colorSwatches"
                                                    :key="'fc-' + c"
                                                    type="button"
                                                    class="w-5 h-5 rounded-md border border-black/10 dark:border-white/10 shadow-sm"
                                                    :style="{ background: c }"
                                                    @click="wm.font_color = c; onWmVisualChange()"
                                                />
                                            </div>
                                        </div>

                                        <div class="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3 space-y-2.5">
                                            <div class="flex items-center justify-between">
                                                <label class="text-[11px] font-medium text-gray-600 dark:text-gray-300">پس‌زمینه متن</label>
                                                <AdminToggleSwitch
                                                    :model-value="!!wm.bg_enabled"
                                                    size="sm"
                                                    @update:model-value="(v) => { wm.bg_enabled = !!v; onWmVisualChange(); }"
                                                />
                                            </div>
                                            <div class="space-y-2.5" :class="{ 'opacity-40 pointer-events-none': !wm.bg_enabled }">
                                                <div class="flex items-center gap-2">
                                                    <input v-model="wm.bg_color" type="color" class="h-9 w-11 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent cursor-pointer p-0.5" @input="onWmVisualChange">
                                                    <input v-model="wm.bg_color" type="text" maxlength="7" class="flex-1 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent px-2.5 py-2 text-xs font-mono outline-none focus:ring-2 focus:ring-yellow-400/50" @input="onWmVisualChange">
                                                </div>
                                                <div>
                                                    <div class="flex items-center justify-between mb-1">
                                                        <span class="text-[10px] text-gray-500">شفافیت پس‌زمینه</span>
                                                        <span class="text-[10px] font-bold">{{ Math.round((wm.bg_opacity || 0) * 100) }}٪</span>
                                                    </div>
                                                    <input v-model.number="wm.bg_opacity" type="range" min="0.1" max="1" step="0.05" class="vpo-range w-full" @input="onWmVisualChange">
                                                </div>
                                                <div>
                                                    <div class="flex items-center justify-between mb-1">
                                                        <span class="text-[10px] text-gray-500">پدینگ</span>
                                                        <span class="text-[10px] font-bold">{{ wm.bg_padding }}</span>
                                                    </div>
                                                    <input v-model.number="wm.bg_padding" type="range" min="0" max="48" step="1" class="vpo-range w-full" @input="onWmVisualChange">
                                                </div>
                                                <div>
                                                    <div class="flex items-center justify-between mb-1">
                                                        <span class="text-[10px] text-gray-500">گردی گوشه</span>
                                                        <span class="text-[10px] font-bold">{{ wm.bg_radius }}</span>
                                                    </div>
                                                    <input v-model.number="wm.bg_radius" type="range" min="0" max="40" step="1" class="vpo-range w-full" @input="onWmVisualChange">
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <div class="flex items-center justify-between mb-1.5">
                                                <label class="text-[11px] font-medium text-gray-500 dark:text-gray-400">حاشیه / سایه متن</label>
                                                <AdminToggleSwitch
                                                    :model-value="!!wm.border_enabled"
                                                    size="sm"
                                                    @update:model-value="(v) => { wm.border_enabled = !!v; onWmVisualChange(); }"
                                                />
                                            </div>
                                            <div class="grid grid-cols-2 gap-2" :class="{ 'opacity-40 pointer-events-none': !wm.border_enabled }">
                                                <div class="flex items-center gap-2">
                                                    <input v-model="wm.border_color" type="color" class="h-9 w-11 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent cursor-pointer p-0.5" @input="onWmVisualChange">
                                                    <span class="text-[10px] text-gray-500">رنگ حاشیه</span>
                                                </div>
                                                <div>
                                                    <div class="flex items-center justify-between mb-1">
                                                        <span class="text-[10px] text-gray-500">ضخامت</span>
                                                        <span class="text-[10px] font-bold">{{ wm.border_width }}</span>
                                                    </div>
                                                    <input v-model.number="wm.border_width" type="range" min="1" max="6" step="1" class="vpo-range w-full" @input="onWmVisualChange">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <div class="vpo-acc rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <button type="button" class="vpo-acc-head" @click="toggleWmPanel('image')">
                                        <span>تصویر واترمارک</span>
                                        <svg class="w-4 h-4 transition-transform" :class="wmPanels.image ? 'rotate-180' : ''" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>
                                    </button>
                                    <div v-show="wmPanels.image" class="vpo-acc-body space-y-3">
                                        <label class="flex items-center justify-center gap-2 w-full rounded-xl border border-dashed border-gray-300 dark:border-gray-600 px-3 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 cursor-pointer hover:border-yellow-400 hover:bg-yellow-400/5 transition">
                                            <span>{{ watermarkFileName || 'انتخاب تصویر واترمارک' }}</span>
                                            <input type="file" accept="image/png,image/jpeg,image/webp" class="hidden" @change="onWatermarkFile">
                                        </label>
                                        <div>
                                            <div class="flex items-center justify-between mb-1.5">
                                                <label class="text-[11px] font-medium text-gray-500 dark:text-gray-400">اندازه نسبت به عرض</label>
                                                <span class="text-[11px] font-bold text-gray-700 dark:text-gray-200">{{ Math.round(wm.image_scale * 100) }}٪</span>
                                            </div>
                                            <input v-model.number="wm.image_scale" type="range" min="0.05" max="0.45" step="0.01" class="vpo-range w-full" @input="onWmVisualChange">
                                        </div>
                                        <div>
                                            <div class="flex items-center justify-between mb-1.5">
                                                <label class="text-[11px] font-medium text-gray-500 dark:text-gray-400">گردی گوشه‌ها</label>
                                                <span class="text-[11px] font-bold text-gray-700 dark:text-gray-200">{{ wm.image_radius }}</span>
                                            </div>
                                            <input v-model.number="wm.image_radius" type="range" min="0" max="48" step="1" class="vpo-range w-full" @input="onWmVisualChange">
                                        </div>
                                    </div>
                                </div>
                            </template>

                            <div class="vpo-acc rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <button type="button" class="vpo-acc-head" @click="toggleWmPanel('place')">
                                    <span>محل و شفافیت</span>
                                    <svg class="w-4 h-4 transition-transform" :class="wmPanels.place ? 'rotate-180' : ''" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>
                                </button>
                                <div v-show="wmPanels.place" class="vpo-acc-body space-y-3">
                                    <div>
                                        <label class="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-2">محل قرارگیری</label>
                                        <div class="grid grid-cols-3 gap-1.5" dir="ltr">
                                            <button
                                                v-for="cell in positionCells"
                                                :key="cell.id || cell.spacer"
                                                type="button"
                                                class="rounded-xl border px-2 py-2.5 text-[11px] font-semibold transition duration-200"
                                                :class="cell.spacer
                                                    ? 'border-transparent pointer-events-none'
                                                    : (wm.position === cell.id
                                                        ? 'border-yellow-400 bg-yellow-400/15 text-gray-900 dark:text-white shadow-sm'
                                                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-yellow-400/50')"
                                                :disabled="!!cell.spacer"
                                                @click="!cell.spacer && (wm.position = cell.id, onWmVisualChange())">
                                                {{ cell.label || '' }}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="flex items-center justify-between mb-1.5">
                                            <label class="text-[11px] font-medium text-gray-500 dark:text-gray-400">شفافیت</label>
                                            <span class="text-[11px] font-bold text-gray-700 dark:text-gray-200">{{ Math.round(wm.opacity * 100) }}٪</span>
                                        </div>
                                        <input v-model.number="wm.opacity" type="range" min="0.15" max="1" step="0.05" class="vpo-range w-full" @input="onWmVisualChange">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-black shadow-inner self-start w-full" dir="ltr">
                            <div class="flex items-center justify-between gap-2 px-3 py-2 border-b border-white/10" dir="rtl">
                                <span class="text-[11px] font-semibold text-gray-200">پیش‌نمایش</span>
                                <div class="flex gap-1.5">
                                    <button
                                        type="button"
                                        class="rounded-lg px-2 py-1 text-[10px] font-bold bg-white/10 text-white hover:bg-white/20 disabled:opacity-40 transition"
                                        :disabled="!previewFile"
                                        @click="capturePreviewFrame">
                                        فریم
                                    </button>
                                    <button
                                        type="button"
                                        class="rounded-lg px-2 py-1 text-[10px] font-bold bg-white/10 text-white hover:bg-white/20 disabled:opacity-40 transition"
                                        :disabled="!frameReady"
                                        @click="paintPreview">
                                        بروزرسانی
                                    </button>
                                </div>
                            </div>
                            <div class="relative aspect-video bg-black flex items-center justify-center">
                                <canvas ref="previewCanvas" class="w-full h-full object-contain block"></canvas>
                                <p
                                    v-if="!previewFile"
                                    class="absolute inset-0 flex items-center justify-center text-[11px] text-gray-400 px-4 text-center"
                                    dir="rtl">
                                    ابتدا ویدیو را انتخاب کنید تا پیش‌نمایش ساخته شود
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </section>
    </div>
</template>

<script>
import AdminToggleSwitch from '@/views/components/admin/AdminToggleSwitch.vue';
import {
    availableQualitiesForHeight,
    defaultSelectedQualities,
    defaultWatermarkOptions,
    VIDEO_STORAGE_TARGETS,
    WATERMARK_FONTS,
    WATERMARK_COLOR_SWATCHES,
    WATERMARK_STYLE_PRESETS,
    watermarkFontMeta,
} from '@/utils/videoProcessOptions.js';

export default {
    name: 'VideoProcessOptions',
    components: { AdminToggleSwitch },
    props: {
        sourceHeight: { type: Number, default: 720 },
        modelValue: {
            type: Object,
            default: () => ({
                outputs: ['stream'],
                stream_qualities: [],
                download_qualities: [],
                qualities: [],
                storage_disk: 'dl',
                watermark: defaultWatermarkOptions(),
            }),
        },
        watermarkFile: { type: [Object, File], default: null },
        previewFile: { type: [Object, File], default: null },
        variant: { type: String, default: 'episode' },
    },
    emits: ['update:modelValue', 'update:watermarkFile'],
    data() {
        return {
            wantStream: true,
            wantDownload: false,
            streamSelected: [],
            downloadSelected: [],
            syncedHeight: null,
            storageDisk: 'dl',
            storageTargets: VIDEO_STORAGE_TARGETS,
            wm: defaultWatermarkOptions(),
            watermarkFileName: '',
            frameReady: false,
            previewObjectUrl: null,
            watermarkImageEl: null,
            watermarkFonts: WATERMARK_FONTS,
            colorSwatches: WATERMARK_COLOR_SWATCHES,
            stylePresets: WATERMARK_STYLE_PRESETS,
            wmPanels: {
                text: true,
                font: false,
                look: true,
                image: true,
                place: true,
            },
            positionCells: [
                { id: 'top-left', label: 'بالا چپ' },
                { id: 'center', label: 'وسط' },
                { id: 'top-right', label: 'بالا راست' },
                { id: 'bottom-left', label: 'پایین چپ' },
                { spacer: true },
                { id: 'bottom-right', label: 'پایین راست' },
            ],
        };
    },
    computed: {
        isTrailer() {
            return this.variant === 'trailer';
        },
        available() {
            return availableQualitiesForHeight(this.sourceHeight);
        },
        sourceLabel() {
            const top = this.available[0];
            return top ? `${top}p` : `${this.sourceHeight}p`;
        },
        activeStylePreset() {
            return this.stylePresets.find((p) => {
                return Object.entries(p.values).every(([k, v]) => String(this.wm[k]) === String(v));
            })?.id || null;
        },
        payload() {
            const outputs = [];
            if (this.isTrailer) {
                outputs.push('trailer');
            } else {
                if (this.wantStream) outputs.push('stream');
                if (this.wantDownload) outputs.push('download');
            }
            const streamQs = [...this.streamSelected];
            const downloadQs = [...this.downloadSelected];
            const qualities = streamQs.length ? streamQs : downloadQs;
            return {
                outputs: outputs.length ? outputs : ['stream'],
                stream_qualities: streamQs,
                download_qualities: downloadQs,
                qualities,
                storage_disk: this.storageDisk || 'dl',
                watermark: {
                    enabled: !!this.wm.enabled,
                    type: this.wm.type === 'image' ? 'image' : 'text',
                    text: String(this.wm.text || '').slice(0, 80),
                    position: this.wm.position || 'bottom-right',
                    opacity: Math.min(1, Math.max(0.05, Number(this.wm.opacity) || 0.7)),
                    font_size: Math.min(96, Math.max(12, Number(this.wm.font_size) || 36)),
                    image_scale: Math.min(0.5, Math.max(0.05, Number(this.wm.image_scale) || 0.16)),
                    font: this.wm.font || 'tahoma',
                    font_color: this.normalizeHex(this.wm.font_color, '#FFFFFF'),
                    bg_enabled: !!this.wm.bg_enabled,
                    bg_color: this.normalizeHex(this.wm.bg_color, '#000000'),
                    bg_opacity: Math.min(1, Math.max(0.05, Number(this.wm.bg_opacity) || 0.45)),
                    bg_padding: Math.min(48, Math.max(0, Number(this.wm.bg_padding) || 10)),
                    bg_radius: Math.min(40, Math.max(0, Number(this.wm.bg_radius) || 0)),
                    image_radius: Math.min(48, Math.max(0, Number(this.wm.image_radius) || 0)),
                    border_enabled: this.wm.border_enabled !== false,
                    border_color: this.normalizeHex(this.wm.border_color, '#000000'),
                    border_width: Math.min(8, Math.max(0, Number(this.wm.border_width) || 0)),
                },
            };
        },
    },
    watch: {
        sourceHeight: {
            immediate: true,
            handler(h) {
                if (h === this.syncedHeight) return;
                this.syncedHeight = h;
                this.hydrateFromModel(true);
            },
        },
        previewFile: {
            immediate: true,
            handler(file) {
                this.bindPreviewFile(file);
            },
        },
        watermarkFile(file) {
            this.loadWatermarkImage(file);
        },
    },
    beforeUnmount() {
        this.revokePreviewUrl();
    },
    methods: {
        shortStorageLabel(id) {
            if (id === 'dl') return 'دانلود';
            if (id === 'static') return 'استاتیک';
            return 'محلی';
        },
        normalizeHex(value, fallback = '#FFFFFF') {
            const raw = String(value || '').trim();
            if (/^#[0-9a-fA-F]{6}$/.test(raw)) return raw.toUpperCase();
            if (/^[0-9a-fA-F]{6}$/.test(raw)) return `#${raw.toUpperCase()}`;
            return fallback;
        },
        hexToRgba(hex, alpha = 1) {
            const h = this.normalizeHex(hex, '#FFFFFF').slice(1);
            const r = parseInt(h.slice(0, 2), 16);
            const g = parseInt(h.slice(2, 4), 16);
            const b = parseInt(h.slice(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, ${Math.min(1, Math.max(0, alpha))})`;
        },
        applyStylePreset(preset) {
            Object.assign(this.wm, preset.values || {});
            this.onWmVisualChange();
        },
        toggleWmPanel(key) {
            this.wmPanels[key] = !this.wmPanels[key];
        },
        onWatermarkToggle(val) {
            this.wm.enabled = !!val;
            this.emitChange();
            this.$nextTick(() => {
                if (!this.wm.enabled) return;
                const video = this.$refs.previewVideo;
                // Video stays mounted even when WM is off; canvas appears with this panel.
                if (video?.videoWidth) {
                    this.capturePreviewFrame();
                } else if (this.previewFile) {
                    this.bindPreviewFile(this.previewFile);
                }
            });
        },
        onWmVisualChange() {
            this.emitChange();
            this.$nextTick(() => this.paintPreview());
        },
        bindPreviewFile(file) {
            this.revokePreviewUrl();
            this.frameReady = false;
            if (!file) {
                this.clearCanvas();
                return;
            }
            this.previewObjectUrl = URL.createObjectURL(file);
            this.$nextTick(() => {
                const video = this.$refs.previewVideo;
                if (!video) return;
                video.onloadeddata = null;
                video.onseeked = null;
                video.src = this.previewObjectUrl;
                video.onloadeddata = () => {
                    try {
                        const t = Math.min(1, (video.duration || 2) * 0.15);
                        video.currentTime = Number.isFinite(t) ? t : 0.1;
                    } catch (e) {
                        this.capturePreviewFrame();
                    }
                };
                video.onseeked = () => this.capturePreviewFrame();
                video.load();
            });
        },
        revokePreviewUrl() {
            if (this.previewObjectUrl) {
                URL.revokeObjectURL(this.previewObjectUrl);
                this.previewObjectUrl = null;
            }
        },
        clearCanvas() {
            const canvas = this.$refs.previewCanvas;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width || 1, canvas.height || 1);
        },
        capturePreviewFrame() {
            const video = this.$refs.previewVideo;
            const canvas = this.$refs.previewCanvas;
            if (!video || !canvas || !video.videoWidth) return;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            this.frameReady = true;
            this.paintPreview();
        },
        loadWatermarkImage(file) {
            this.watermarkImageEl = null;
            if (!file) {
                this.paintPreview();
                return;
            }
            const url = URL.createObjectURL(file);
            const img = new Image();
            img.onload = () => {
                this.watermarkImageEl = img;
                URL.revokeObjectURL(url);
                this.paintPreview();
            };
            img.onerror = () => {
                URL.revokeObjectURL(url);
                this.paintPreview();
            };
            img.src = url;
        },
        paintPreview() {
            const canvas = this.$refs.previewCanvas;
            const video = this.$refs.previewVideo;
            if (!canvas || !this.frameReady || !video?.videoWidth) return;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            if (!this.wm.enabled) return;

            const pad = Math.round(Math.min(canvas.width, canvas.height) * 0.03);
            const opacity = Math.min(1, Math.max(0.05, Number(this.wm.opacity) || 0.7));
            ctx.save();

            if (this.wm.type === 'image' && this.watermarkImageEl) {
                ctx.globalAlpha = opacity;
                const scale = Math.min(0.5, Math.max(0.05, Number(this.wm.image_scale) || 0.16));
                const w = canvas.width * scale;
                const h = w * (this.watermarkImageEl.height / Math.max(1, this.watermarkImageEl.width));
                const { x, y } = this.previewXY(w, h, pad);
                const radius = Math.max(0, Number(this.wm.image_radius) || 0) * (canvas.width / 1280);
                if (radius > 0) {
                    ctx.save();
                    this.roundRect(ctx, x, y, w, h, radius);
                    ctx.clip();
                    ctx.drawImage(this.watermarkImageEl, x, y, w, h);
                    ctx.restore();
                } else {
                    ctx.drawImage(this.watermarkImageEl, x, y, w, h);
                }
            } else if (this.wm.type === 'text' && String(this.wm.text || '').trim()) {
                ctx.globalAlpha = 1;
                const fontSize = Math.min(96, Math.max(12, Number(this.wm.font_size) || 36));
                const scaled = Math.max(14, Math.round(fontSize * (canvas.width / 1280)));
                const fontMeta = watermarkFontMeta(this.wm.font);
                ctx.font = `${fontMeta.weight || 600} ${scaled}px ${fontMeta.css}`;
                ctx.textBaseline = 'top';
                const text = String(this.wm.text).slice(0, 80);
                const metrics = ctx.measureText(text);
                const tw = metrics.width;
                const th = scaled * 1.15;
                const boxPad = this.wm.bg_enabled ? Math.max(0, Number(this.wm.bg_padding) || 10) * (canvas.width / 1280) : 0;
                const { x, y } = this.previewXY(tw + boxPad * 2, th + boxPad * 2, pad);
                const tx = x + boxPad;
                const ty = y + boxPad;

                if (this.wm.bg_enabled) {
                    const radius = Math.max(0, Number(this.wm.bg_radius) || 0) * (canvas.width / 1280);
                    ctx.fillStyle = this.hexToRgba(
                        this.wm.bg_color,
                        (Number(this.wm.bg_opacity) || 0.45) * opacity
                    );
                    this.roundRect(ctx, x, y, tw + boxPad * 2, th + boxPad * 2, radius);
                    ctx.fill();
                }

                if (this.wm.border_enabled && Number(this.wm.border_width) > 0) {
                    ctx.lineWidth = Math.max(1, Number(this.wm.border_width) || 2) * (canvas.width / 1280);
                    ctx.strokeStyle = this.hexToRgba(this.wm.border_color, Math.min(1, opacity + 0.1));
                    ctx.strokeText(text, tx, ty);
                }

                ctx.fillStyle = this.hexToRgba(this.wm.font_color, opacity);
                ctx.fillText(text, tx, ty);
            }
            ctx.restore();
        },
        roundRect(ctx, x, y, w, h, r) {
            const radius = Math.min(r, w / 2, h / 2);
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.arcTo(x + w, y, x + w, y + h, radius);
            ctx.arcTo(x + w, y + h, x, y + h, radius);
            ctx.arcTo(x, y + h, x, y, radius);
            ctx.arcTo(x, y, x + w, y, radius);
            ctx.closePath();
        },
        previewXY(w, h, pad) {
            const W = this.$refs.previewCanvas.width;
            const H = this.$refs.previewCanvas.height;
            switch (this.wm.position) {
                case 'top-left': return { x: pad, y: pad };
                case 'top-right': return { x: W - w - pad, y: pad };
                case 'center': return { x: (W - w) / 2, y: (H - h) / 2 };
                case 'bottom-left': return { x: pad, y: H - h - pad };
                default: return { x: W - w - pad, y: H - h - pad };
            }
        },
        hydrateFromModel(resetQualities) {
            const outs = this.modelValue?.outputs || (this.isTrailer ? ['trailer'] : ['stream']);
            this.wantStream = this.isTrailer || outs.includes('stream') || outs.includes('trailer') || outs.length === 0;
            this.wantDownload = this.isTrailer ? false : outs.includes('download');
            this.storageDisk = this.modelValue?.storage_disk || 'dl';
            this.wm = {
                ...defaultWatermarkOptions(),
                ...(this.modelValue?.watermark || {}),
            };

            const defaults = defaultSelectedQualities(this.sourceHeight);
            const pick = (list) => {
                const arr = Array.isArray(list) ? list.map(Number).filter((q) => this.available.includes(q)) : [];
                return arr.length ? arr.sort((a, b) => b - a) : [...defaults];
            };

            if (resetQualities || !this.streamSelected.length) {
                this.streamSelected = pick(
                    this.modelValue?.stream_qualities?.length
                        ? this.modelValue.stream_qualities
                        : this.modelValue?.qualities
                );
            }
            if (resetQualities || !this.downloadSelected.length) {
                this.downloadSelected = pick(
                    this.modelValue?.download_qualities?.length
                        ? this.modelValue.download_qualities
                        : this.modelValue?.qualities
                );
            }

            this.emitChange();
        },
        onOutputChange() {
            if (this.wantStream && !this.streamSelected.length) {
                this.streamSelected = defaultSelectedQualities(this.sourceHeight);
            }
            if (this.wantDownload && !this.downloadSelected.length) {
                this.downloadSelected = defaultSelectedQualities(this.sourceHeight);
            }
            this.emitChange();
        },
        isAllSelected(kind) {
            const list = kind === 'download' ? this.downloadSelected : this.streamSelected;
            return this.available.length > 0 && this.available.every((q) => list.includes(q));
        },
        toggleAllQualities(kind) {
            if (this.isAllSelected(kind)) {
                if (kind === 'download') this.downloadSelected = [];
                else this.streamSelected = [];
            } else {
                const all = [...this.available].sort((a, b) => b - a);
                if (kind === 'download') this.downloadSelected = all;
                else this.streamSelected = all;
            }
            this.emitChange();
        },
        toggleQualityIn(kind, q) {
            const key = kind === 'download' ? 'downloadSelected' : 'streamSelected';
            const list = [...this[key]];
            const idx = list.indexOf(q);
            if (idx >= 0) list.splice(idx, 1);
            else list.push(q);
            list.sort((a, b) => b - a);
            this[key] = list;
            this.emitChange();
        },
        onWatermarkFile(e) {
            const file = e.target?.files?.[0] || null;
            this.watermarkFileName = file ? file.name : '';
            this.$emit('update:watermarkFile', file);
            if (file) {
                this.wm.type = 'image';
                this.wm.enabled = true;
            }
            this.loadWatermarkImage(file);
            this.emitChange();
        },
        emitChange() {
            this.$emit('update:modelValue', this.payload);
        },
    },
};
</script>

<style scoped>
.vpo-range {
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    border-radius: 999px;
    background: linear-gradient(90deg, rgba(250, 204, 21, 0.35), rgba(250, 204, 21, 0.9));
    outline: none;
}
.vpo-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 999px;
    background: #facc15;
    border: 2px solid #111827;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
    cursor: pointer;
}
.dark .vpo-range::-webkit-slider-thumb {
    border-color: #f9fafb;
}
.vpo-range::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 999px;
    background: #facc15;
    border: 2px solid #111827;
    cursor: pointer;
}
.vpo-acc-head {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.625rem 0.75rem;
    font-size: 11px;
    font-weight: 700;
    color: #1f2937;
    background: rgba(249, 250, 251, 0.85);
    transition: background 0.15s ease;
}
.dark .vpo-acc-head {
    color: #f3f4f6;
    background: rgba(31, 41, 55, 0.6);
}
.vpo-acc-head:hover {
    background: #f3f4f6;
}
.dark .vpo-acc-head:hover {
    background: #1f2937;
}
.vpo-acc-body {
    padding: 0.25rem 0.75rem 0.75rem;
    border-top: 1px solid #f3f4f6;
}
.dark .vpo-acc-body {
    border-top-color: rgba(55, 65, 81, 0.8);
}
.vpo-fade-enter-active,
.vpo-fade-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}
.vpo-fade-enter-from,
.vpo-fade-leave-to {
    opacity: 0;
    transform: translateY(4px);
}
</style>
