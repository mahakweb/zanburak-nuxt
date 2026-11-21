<template>
    <div class="zan-editor-root custom-scrollbar">
        <div class="mt-8 flex justify-end items-end">
            <span class="mb-1 text-xs font-bold text-gray-700 dark:text-gray-200 relative">{{ charCount }} {{ $t('editor.characters') }} &nbsp; |
                &nbsp;</span>
            <span class="mb-1 text-xs font-bold text-gray-700 dark:text-gray-200 relative">{{ wordCount }} {{ $t('editor.words') }}</span>
        </div>
        <VueEasymde class="zan-easymde" :configs="configs" :sanitize="true"
            :highlight="true" @blur="onContentUpdate" @keyup="onContentUpdate" v-model="content" ref="markdownEditor">
        </VueEasymde>
        <div v-if="props.errors" class="mt-2 text-red-500 text-xs font-semibold">{{ props.errors }}</div>
        <div class="flex items-center justify-between mt-2">
            <div
                class="p-2 flex bg-gray-200 dark:bg-gray-800 bg-opacity-50 rounded-lg shadow-md shadow-gray-400/50 dark:shadow-gray-600">
                <label class="relative inline-flex items-center me-2 cursor-pointer">
                    <input type="checkbox" v-model="isPreviewMode" @change="onPreviewChange" class="sr-only peer" />
                    <div
                        class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-2 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-400">
                    </div>
                    <span class="ms-3 text-sm font-semibold text-gray-700 dark:text-gray-200">{{ $t('editor.preview') }}</span>
                </label>
            </div>
            <div class="inline-flex items-center">
                <button v-if="props.cancelButton" type="button" @click="props.cancelCallback"
                    class="shadow-md shadow-gray-300 dark:shadow-gray-500 text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-2 focus:outline-none focus:ring-gray-100 font-semibold rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2">{{ $t('editor.cancel') }}</button>
                <button v-if="props.submitButton" type="submit"
                    class="shadow-md shadow-rose-400 flex items-center p-2.5 text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-semibold rounded-lg text-sm text-center">
                    {{ $t('editor.save') }}
                    <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                </button>
            </div>
        </div>
        <!-- <hr class="my-5 border-gray-100 border-dashed dark:border-opacity-10 mx-4" /> -->
    </div>
    <BottomSheetDrawer
        v-model="isOpenUploadImageModal"
        :initialHeight="0.6"
        :maxHeight="0.8"
        :minHeight="0.06"
        :autoCloseOnMin="true"
        :closeOnBackdrop="true"
        :lockScroll="true"
        :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[35rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
        :contentClass="'px-2 pb-4 overflow-auto custom-scrollbar'"
        :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-md'"
    >
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ uploadModalTitle }}</h3>
            <button type="button" class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800" @click="closeUploadImageModal">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
        <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">{{ uploadAllowedExtensionsText }}</p>
        <div
            class="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 transition hover:border-yellow-400 hover:bg-yellow-50/50 dark:border-gray-600 dark:bg-gray-800/50 dark:hover:border-yellow-500"
            :class="{ 'border-yellow-400 bg-yellow-50/30 dark:border-yellow-500': isDragOver }"
            @click="triggerImagePicker"
            @dragover.prevent="isDragOver = true"
            @dragleave.prevent="isDragOver = false"
            @drop.prevent="onImageDrop"
        >
            <template v-if="selectedFile">
                <template v-if="isSelectedImage">
                    <img :src="selectedFilePreview" alt="" class="mb-2 max-h-36 w-auto rounded-lg object-contain shadow-sm" />
                    <span class="max-w-full truncate text-sm font-semibold text-gray-700 dark:text-gray-200">{{ selectedFileName }}</span>
                    <span class="mt-1 text-xs text-gray-500">{{ selectedFileSizeFormatted }}</span>
                </template>
                <template v-else>
                    <div class="flex w-full max-w-sm items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-3 shadow-sm dark:border-gray-600 dark:bg-gray-900">
                        <span
                            class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold tracking-wide text-white"
                            :style="{ backgroundColor: selectedFileMeta.color }"
                        >{{ selectedFileMeta.abbr }}</span>
                        <div class="min-w-0 flex-1 text-start">
                            <span class="block truncate text-sm font-semibold text-gray-800 dark:text-gray-100">{{ selectedFileName }}</span>
                            <span class="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">{{ selectedFileMeta.label }} · {{ selectedFileSizeFormatted }}</span>
                        </div>
                    </div>
                </template>
            </template>
            <template v-else>
                <svg class="mb-2 h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span class="text-sm font-semibold text-gray-600 dark:text-gray-300">{{ $t('dropzone.clickToUpload') }}</span>
                <span class="mt-1 text-xs text-gray-400">{{ $t('dropzone.dragDrop') }}</span>
            </template>
        </div>
        <div v-if="selectedFile && !isSelectedImage" class="mt-4">
            <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">{{ $t('editor.fileDisplayName') }}</label>
            <input
                v-model="fileDisplayName"
                type="text"
                class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                :placeholder="$t('editor.fileDisplayNamePlaceholder')"
            />
        </div>
        <input type="file" ref="imageInput" :accept="imageUploadAccept" class="hidden" @change="onImageFileChange" />
        <p v-if="uploadErrors?.image || uploadErrors?.file" class="mt-2 text-xs font-semibold text-red-500">{{ (uploadErrors.image || uploadErrors.file)?.[0] }}</p>
        <div v-if="uploadPercentage > 0" class="mt-4" dir="ltr">
            <div class="mb-1 flex justify-between text-xs text-gray-600 dark:text-gray-300">
                <span>{{ $t('editor.uploadPercentage') }}</span>
                <span>{{ uploadPercentage }}%</span>
            </div>
            <div class="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div class="h-1.5 rounded-full transition-all" :class="uploadPercentage === 100 ? 'bg-green-500' : 'bg-yellow-400'" :style="{ width: uploadPercentage + '%' }" />
            </div>
        </div>
        <div class="mt-5 flex justify-end gap-2">
            <button type="button" class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200" @click="closeUploadImageModal">{{ $t('editor.dismiss') }}</button>
            <button type="button" class="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-gray-900 disabled:opacity-60" :disabled="uploadImageLoading" @click="uploadSelectedMedia()">{{ uploadButtonLabel }}</button>
        </div>
    </BottomSheetDrawer>

    <BottomSheetDrawer
        v-model="isOpenUploadVideoModal"
        :initialHeight="0.6"
        :maxHeight="0.8"
        :minHeight="0.06"
        :autoCloseOnMin="true"
        :closeOnBackdrop="true"
        :lockScroll="true"
        :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[35rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
        :contentClass="'px-2 pb-4 overflow-auto custom-scrollbar'"
        :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-md'"
    >
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ $t('editor.uploadVideo') }}</h3>
            <button type="button" class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800" @click="closeUploadVideoModal">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
        <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">{{ $t('editor.allowedVideoExtensions') }}</p>
        <div
            class="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 transition hover:border-yellow-400 hover:bg-yellow-50/50 dark:border-gray-600 dark:bg-gray-800/50 dark:hover:border-yellow-500"
            :class="{ 'border-yellow-400 bg-yellow-50/30 dark:border-yellow-500': isVideoDragOver }"
            @click="triggerVideoPicker"
            @dragover.prevent="isVideoDragOver = true"
            @dragleave.prevent="isVideoDragOver = false"
            @drop.prevent="onVideoDrop"
        >
            <template v-if="selectedVideoPreview">
                <video :src="selectedVideoPreview" class="mb-2 max-h-36 w-full rounded-lg object-contain shadow-sm" controls preload="metadata" />
                <span class="max-w-full truncate text-sm font-semibold text-gray-700 dark:text-gray-200">{{ selectedVideoName }}</span>
                <span class="mt-1 text-xs text-gray-500">{{ selectedVideoSizeFormatted }}</span>
            </template>
            <template v-else>
                <svg class="mb-2 h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                <span class="text-sm font-semibold text-gray-600 dark:text-gray-300">{{ $t('dropzone.clickToUpload') }}</span>
                <span class="mt-1 text-xs text-gray-400">{{ $t('dropzone.dragDrop') }}</span>
            </template>
        </div>
        <input type="file" ref="videoInput" accept=".mp4,.webm,.mov,.avi,.mkv,.ogv" class="hidden" @change="onVideoFileChange" />
        <p v-if="uploadErrors?.video" class="mt-2 text-xs font-semibold text-red-500">{{ uploadErrors.video[0] }}</p>
        <div v-if="videoUploadPercentage > 0" class="mt-4" dir="ltr">
            <div class="mb-1 flex justify-between text-xs text-gray-600 dark:text-gray-300">
                <span>{{ $t('editor.uploadPercentage') }}</span>
                <span>{{ videoUploadPercentage }}%</span>
            </div>
            <div class="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div class="h-1.5 rounded-full transition-all" :class="videoUploadPercentage === 100 ? 'bg-green-500' : 'bg-yellow-400'" :style="{ width: videoUploadPercentage + '%' }" />
            </div>
        </div>
        <div class="mt-5 flex justify-end gap-2">
            <button type="button" class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200" @click="closeUploadVideoModal">{{ $t('editor.dismiss') }}</button>
            <button type="button" class="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-gray-900 disabled:opacity-60" :disabled="uploadVideoLoading" @click="uploadVideo()">{{ $t('editor.uploadVideo') }}</button>
        </div>
    </BottomSheetDrawer>

    <Teleport :to="popoverTeleportTarget" :disabled="!popoverTeleportTarget">
        <div
            v-show="isEmojiPopupOpen"
            ref="emojiPopupRef"
            class="zan-editor-popover absolute z-[1200] w-52 overflow-y-auto custom-scrollbar rounded-xl border-2 border-gray-200 bg-gray-50 px-3 py-2 shadow-xl dark:border-gray-600 dark:bg-gray-900 dark:shadow-gray-800"
            :style="emojiPopoverStyle"
        >
            <EmojiPicker @emoji_click="emojiClick" />
        </div>

        <div
            v-if="activeColorPopover"
            ref="colorPopoverRef"
            class="zan-editor-popover absolute z-[1200] w-56 rounded-xl border border-gray-200 bg-white p-3 shadow-xl custom-scrollbar dark:border-gray-700 dark:bg-gray-900"
            :style="colorPopoverStyle"
        >
            <p class="mb-2 text-xs font-bold text-gray-600 dark:text-gray-300">
                {{ activeColorPopover === 'text' ? $t('editor.textColor') : $t('editor.bgColor') }}
            </p>
            <div class="grid grid-cols-5 gap-2">
                <button
                    v-for="color in (activeColorPopover === 'text' ? TEXT_COLORS : BG_COLORS)"
                    :key="activeColorPopover + '-' + color"
                    type="button"
                    class="aspect-square rounded-md border border-gray-200 transition hover:scale-110 dark:border-gray-600"
                    :style="{ backgroundColor: color }"
                    @click="applyPopoverColor(color)"
                />
            </div>
            <div class="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3 dark:border-gray-700">
                <input
                    v-model="customPickerColor"
                    type="color"
                    class="h-8 w-10 cursor-pointer rounded border-0 bg-transparent p-0"
                />
                <button
                    type="button"
                    class="flex-1 rounded-lg bg-yellow-400 px-2 py-1.5 text-xs font-semibold text-gray-900"
                    @click="applyPopoverColor(customPickerColor)"
                >
                    {{ $t('editor.applyColor') }}
                </button>
            </div>
        </div>

        <div
            v-if="isTablePopoverOpen"
            ref="tablePopoverRef"
            class="zan-editor-popover absolute z-[1200] w-56 max-w-[calc(100vw-1rem)] rounded-xl border border-gray-200 bg-white p-3 shadow-xl custom-scrollbar dark:border-gray-700 dark:bg-gray-900"
            :style="tablePopoverStyle"
        >
            <p class="mb-2 text-xs font-bold text-gray-600 dark:text-gray-300">{{ $t('editor.table') }}</p>
            <p class="mb-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400" dir="ltr">
                {{ tableSizeLabel }}
            </p>
            <div
                class="mx-auto w-fit select-none rounded-md border border-gray-200 p-1 dark:border-gray-600"
                dir="ltr"
                @mouseleave="resetTableHover"
            >
                <div v-for="row in TABLE_GRID_SIZE" :key="'tr-' + row" class="flex gap-0.5">
                    <button
                        v-for="col in TABLE_GRID_SIZE"
                        :key="'tc-' + row + '-' + col"
                        type="button"
                        class="h-4 w-4 rounded-sm border border-gray-300 transition-colors dark:border-gray-600"
                        :class="row <= tableHoverRows && col <= tableHoverCols
                            ? 'border-yellow-500 bg-yellow-400 dark:bg-yellow-500'
                            : 'bg-gray-100 dark:bg-gray-800'"
                        @mouseenter="setTableHover(row, col)"
                        @click="insertTableFromPicker(row, col)"
                    />
                </div>
            </div>
            <div class="mt-3 border-t border-gray-100 pt-3 dark:border-gray-700">
                <p class="mb-2 text-xs text-gray-500 dark:text-gray-400">{{ $t('editor.tableManual') }}</p>
                <div class="flex items-center gap-2" dir="ltr">
                    <label class="flex flex-1 flex-col gap-0.5 text-[10px] text-gray-500">
                        <span>{{ $t('editor.tableRows') }}</span>
                        <input
                            v-model.number="manualTableRows"
                            type="number"
                            min="1"
                            max="20"
                            class="w-full rounded-md border border-gray-200 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800"
                        />
                    </label>
                    <label class="flex flex-1 flex-col gap-0.5 text-[10px] text-gray-500">
                        <span>{{ $t('editor.tableCols') }}</span>
                        <input
                            v-model.number="manualTableCols"
                            type="number"
                            min="1"
                            max="12"
                            class="w-full rounded-md border border-gray-200 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800"
                        />
                    </label>
                </div>
                <button
                    type="button"
                    class="mt-2 w-full rounded-lg bg-yellow-400 py-1.5 text-xs font-semibold text-gray-900"
                    @click="insertTableFromManual"
                >
                    {{ $t('editor.insertTable') }}
                </button>
            </div>
        </div>

        <div
            v-if="isHeadingPopoverOpen"
            ref="headingPopoverRef"
            class="zan-editor-popover absolute z-[1200] w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-xl custom-scrollbar dark:border-gray-700 dark:bg-gray-900"
            :style="headingPopoverStyle"
        >
            <p class="mb-2 px-1 text-xs font-bold text-gray-600 dark:text-gray-300">{{ $t('editor.headingPicker') }}</p>
            <div class="space-y-1">
                <button
                    v-for="option in headingOptions"
                    :key="'heading-' + option.level"
                    type="button"
                    class="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-start transition hover:bg-yellow-50 dark:hover:bg-yellow-500/10"
                    @click="insertHeadingLevel(option.level)"
                >
                    <span class="inline-flex h-6 min-w-[2rem] items-center justify-center rounded-md bg-gray-100 px-1.5 text-[10px] font-bold text-gray-700 dark:bg-gray-800 dark:text-gray-200" dir="ltr">
                        H{{ option.level }}
                    </span>
                    <span class="text-xs font-semibold text-gray-700 dark:text-gray-200">{{ $t(option.labelKey) }}</span>
                </button>
            </div>
        </div>

        <div
            v-if="isLineHeightPopoverOpen"
            ref="lineHeightPopoverRef"
            class="zan-editor-popover absolute z-[1200] w-52 rounded-xl border border-gray-200 bg-white p-3 shadow-xl custom-scrollbar dark:border-gray-700 dark:bg-gray-900"
            :style="lineHeightPopoverStyle"
        >
            <p class="mb-2 text-xs font-bold text-gray-600 dark:text-gray-300">{{ $t('editor.lineHeightPicker') }}</p>
            <p class="mb-2 text-[10px] leading-5 text-gray-500 dark:text-gray-400">{{ $t('editor.lineHeightHint') }}</p>
            <div class="grid grid-cols-3 gap-1.5">
                <button
                    v-for="value in LINE_HEIGHT_OPTIONS"
                    :key="'lh-' + value"
                    type="button"
                    class="rounded-lg border border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 transition hover:border-slate-300 hover:bg-slate-100 dark:border-gray-600 dark:text-gray-200 dark:hover:border-slate-500 dark:hover:bg-slate-800"
                    dir="ltr"
                    @click="applyLineHeight(value)"
                >
                    {{ value }}
                </button>
            </div>
        </div>

        <div
            v-if="isFontSizePopoverOpen"
            ref="fontSizePopoverRef"
            class="zan-editor-popover absolute z-[1200] w-64 rounded-xl border border-gray-200 bg-white p-3 shadow-xl custom-scrollbar dark:border-gray-700 dark:bg-gray-900"
            :style="fontSizePopoverStyle"
        >
            <p class="mb-2 text-xs font-bold text-gray-600 dark:text-gray-300">{{ $t('editor.fontSize') }}</p>
            <div class="grid grid-cols-4 gap-1.5">
                <button
                    v-for="size in FONT_SIZE_OPTIONS"
                    :key="'fs-' + size"
                    type="button"
                    class="rounded-lg border border-gray-200 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-yellow-400 hover:bg-yellow-50 dark:border-gray-600 dark:text-gray-200 dark:hover:border-yellow-500 dark:hover:bg-yellow-500/10"
                    dir="ltr"
                    @click="applyFontSize(size)"
                >
                    {{ size }}px
                </button>
            </div>
            <div class="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3 dark:border-gray-700">
                <input
                    v-model.number="customFontSize"
                    type="number"
                    min="9"
                    max="72"
                    class="w-20 rounded-md border border-gray-200 px-2 py-1.5 text-center text-xs dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                    dir="ltr"
                    placeholder="18"
                    @keydown.enter.prevent="applyFontSize(customFontSize)"
                />
                <button
                    type="button"
                    class="flex-1 rounded-lg bg-yellow-400 px-2 py-1.5 text-xs font-semibold text-gray-900 transition hover:bg-yellow-300"
                    @click="applyFontSize(customFontSize)"
                >
                    {{ $t('editor.applyFontSize') }}
                </button>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import axiosInstance from "@/store/axiosInstance";
import { onMounted, onUnmounted, ref, shallowRef, computed, watch, createApp, markRaw, nextTick, defineAsyncComponent, defineComponent, h } from "vue";
import { useI18n } from "vue-i18n";
import { initTabs } from "flowbite";
import EmojiPicker from "@/views/components/emoji/EmojiPicker.vue";
import MarkdownRenderer from "@/views/components/home/MarkdownRenderer.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import { preprocessGfmTables } from "@/utils/markdownGfmTable";
import { preprocessColorSyntax } from "@/utils/markdownColorSyntax";
import { preprocessFontSizeSyntax } from "@/utils/markdownFontSizeSyntax";
import { EDITOR_TOOLBAR_ICONS } from "@/utils/editorToolbarIcons";
import { preprocessLineHeightSyntax } from "@/utils/markdownLineHeightSyntax";
import { extractLineHeight, stripContentMeta } from "@/utils/articleContentMeta";
import MarkdownIt from "markdown-it";
// EasyMDE/CodeMirror touch navigator at import time — never load on the server.
const VueEasymde = import.meta.server
    ? defineComponent({ name: 'VueEasymdeSSRStub', setup: () => () => h('div', { class: 'zan-easymde-ssr-stub min-h-[8rem]' }) })
    : defineAsyncComponent(async () => {
        await import('easymde/dist/easymde.min.css')
        return (await import('vue-easymde')).default
    })
import {
    getCodeMirror,
    insertWithSelection,
    insertLink,
    insertImage,
    insertVideo,
    insertFileLink,
    insertCodeBlock,
    insertQuote,
    insertTableSized,
    insertAlignBlock,
    insertStyledSpan,
    insertFontSize,
    insertHeading,
    insertLineHeightBlock,
} from "@/utils/editorInsert";
import { formatFileSize } from "@/utils/formatFileSize";
import {
    getFileExtension,
    getFileTypeMeta,
    isImageFile,
    isVideoFile,
    IMAGE_EXTENSIONS,
    FILE_EXTENSIONS,
    VIDEO_EXTENSIONS,
} from "@/utils/fileTypeMeta";
import { enhanceMarkdownAttachments } from "@/utils/markdownEnhancements";
import { sanitizeHtml } from "@/utils/sanitizeHtml";

const LINE_HEIGHT_OPTIONS = [0.75, 1, 1.15, 1.25, 1.5, 1.75, 2];
const HEADING_OPTION_DEFS = [
    { level: 1, labelKey: "editor.headingH1" },
    { level: 2, labelKey: "editor.headingH2" },
    { level: 3, labelKey: "editor.headingH3" },
    { level: 4, labelKey: "editor.headingH4" },
    { level: 5, labelKey: "editor.headingH5" },
    { level: 6, labelKey: "editor.headingH6" },
];

const previewMarkdown = new MarkdownIt({ html: true, linkify: true, breaks: true });

function renderEditorPreviewHtml(src) {
    const lineHeight = extractLineHeight(src);
    const processed = preprocessLineHeightSyntax(preprocessFontSizeSyntax(preprocessColorSyntax(preprocessGfmTables(stripContentMeta(src || '')))));
    const style = lineHeight ? ` style="line-height:${lineHeight}"` : '';
    const html = `<div class="zan-md-content"${style}>${sanitizeHtml(previewMarkdown.render(processed))}</div>`;
    if (typeof document !== 'undefined') {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        enhanceMarkdownAttachments(tmp, locale.value === 'fa' ? 'fa' : 'en');
        return tmp.innerHTML;
    }
    return html;
}
// const props = defineProps(['submitButton', 'cancelButton', 'cancelCallback', 'errors'])
const props = defineProps({
    submitButton: Boolean,
    cancelButton: Boolean,
    cancelCallback: Function,
    helpButton: {
        type: Boolean,
        default: true,
    },
    errors: String,
    modelValue: String,
    placeholder: {
        type: String,
        default: () => "",
    },
    focusedBorder: {
        type: String,
        default: () => "2px #fed700 solid",
    },
    errorBorder: {
        type: String,
        default: () => "2px #f43f5e solid",
    },
    previewClass: {
        type: Array,
        default: () => ["p-3", "bg-gray-50", "text-gray-900", "dark:bg-gray-950", "dark:text-gray-50", "rtl:text-right"]
    },
    bodyClass: {
        type: Array,
        default: () => ["rounded-xl", "dark:bg-gray-900", "dark:text-gray-100"]
    },
    toolbarClass: {
        type: Array,
        default: () => ["bg-slate-50/80", "dark:bg-slate-900/70", "px-2", "rounded-2xl", "my-2"]
    },
    enableFileUpload: {
        type: Boolean,
        default: false,
    },
    enableVideoUpload: {
        type: Boolean,
        default: false,
    },
});
const { t, locale } = useI18n();
const editor = shallowRef(null);
const isFocused = ref(false);
const isPreviewMode = ref(false);
let editorCmEl = null;
let suppressOutsideClose = false;
let emojiAnchorEl = null;
let colorAnchorEl = null;
let tableAnchorEl = null;
let headingAnchorEl = null;
let lineHeightAnchorEl = null;
let fontSizeAnchorEl = null;
const FONT_SIZE_OPTIONS = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48];
const isFontSizePopoverOpen = ref(false);
const fontSizePopoverStyle = ref({ top: '0px', left: '0px' });
const fontSizePopoverRef = ref(null);
const customFontSize = ref(18);

const TEXT_COLORS = ['#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#0891b2', '#2563eb', '#7c3aed', '#db2777', '#111827', '#ffffff'];
const BG_COLORS = ['#fef08a', '#bbf7d0', '#bfdbfe', '#fbcfe8', '#fecaca', '#e9d5ff', '#fed7aa', '#f3f4f6', '#374151', '#000000'];
const activeColorPopover = ref(null);
const colorPopoverStyle = ref({ top: '0px', left: '0px' });
const customPickerColor = ref('#2563eb');
const colorPopoverRef = ref(null);
const emojiPopupRef = ref(null);
const emojiPopoverStyle = ref({ top: '0px', left: '0px', height: '12rem' });
const isEmojiPopupOpen = ref(false);
const isDragOver = ref(false);
const isVideoDragOver = ref(false);
const selectedFile = ref(null);
const selectedFilePreview = ref(null);
const fileDisplayName = ref('');
const selectedVideoFile = ref(null);
const selectedVideoPreview = ref(null);
const TABLE_GRID_SIZE = 7;
const isTablePopoverOpen = ref(false);
const tablePopoverStyle = ref({ top: '0px', left: '0px' });
const tablePopoverRef = ref(null);
const tableHoverRows = ref(0);
const tableHoverCols = ref(0);
const manualTableRows = ref(3);
const manualTableCols = ref(3);
const isHeadingPopoverOpen = ref(false);
const headingPopoverStyle = ref({ top: '0px', left: '0px' });
const headingPopoverRef = ref(null);
const isLineHeightPopoverOpen = ref(false);
const lineHeightPopoverStyle = ref({ top: '0px', left: '0px' });
const lineHeightPopoverRef = ref(null);
const popoverTeleportTarget = ref(null);

const showCmRing = computed(() => (isFocused.value || !!props.errors) && !isPreviewMode.value);
const headingOptions = computed(() => HEADING_OPTION_DEFS);
const tableSizeLabel = computed(() => {
    if (tableHoverRows.value < 1 || tableHoverCols.value < 1) {
        return t('editor.tableSizeHint');
    }
    return t('editor.tableSize', { rows: tableHoverRows.value, cols: tableHoverCols.value });
});

function setTableHover(rows, cols) {
    tableHoverRows.value = rows;
    tableHoverCols.value = cols;
}

function setEditor(mde) {
    editor.value = mde ? markRaw(mde) : null;
}

function ensurePopoverHost(toolbarWrap) {
    if (!toolbarWrap) return;
    let host = toolbarWrap.querySelector('.zan-editor-popover-host');
    if (!host) {
        host = document.createElement('div');
        host.className = 'zan-editor-popover-host';
        toolbarWrap.appendChild(host);
    }
    popoverTeleportTarget.value = host;
}

function positionPopoverToAnchor(anchorEl, styleRef, options = {}) {
    const host = popoverTeleportTarget.value;
    if (!anchorEl || !host) return;

    const margin = options.margin ?? 8;
    const popoverEl = options.popoverEl ?? null;
    const popoverWidth = popoverEl?.offsetWidth || options.fallbackWidth || 224;
    const btnRect = anchorEl.getBoundingClientRect();
    const hostRect = host.getBoundingClientRect();
    const vw = window.innerWidth;

    let leftViewport;
    if (options.align === 'start') {
        leftViewport = btnRect.left + (options.offsetLeft ?? 0);
    } else {
        leftViewport = btnRect.left + btnRect.width / 2 - popoverWidth / 2;
    }

    leftViewport = Math.max(margin, Math.min(leftViewport, vw - margin - popoverWidth));

    styleRef.value = {
        ...styleRef.value,
        top: `${btnRect.bottom - hostRect.top + 6}px`,
        left: `${leftViewport - hostRect.left}px`,
    };
}

const isTouchDevice = typeof window !== 'undefined'
    && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

function openEmojiPopover(mde) {
    setEditor(mde);
    ensurePopoverHost(markdownEditor.value?.$el?.querySelector('.zan-editor-toolbar-wrap'));
    closeTablePopover();
    closeColorPopover();
    closeHeadingPopover();
    closeLineHeightPopover();
    closeFontSizePopover();
    emojiAnchorEl = mde.toolbarElements?.emoji || null;
    suppressOutsideClose = true;
    isEmojiPopupOpen.value = true;
    nextTick(() => {
        if (emojiAnchorEl) {
            positionPopoverToAnchor(emojiAnchorEl, emojiPopoverStyle, {
                popoverEl: emojiPopupRef.value,
                fallbackWidth: 208,
            });
        }
    });
    setTimeout(() => { suppressOutsideClose = false; }, 0);
}

function closeEmojiPopover() {
    isEmojiPopupOpen.value = false;
    emojiAnchorEl = null;
}

function resetTableHover() {
    tableHoverRows.value = 0;
    tableHoverCols.value = 0;
}

function openTablePopover(mde) {
    setEditor(mde);
    ensurePopoverHost(markdownEditor.value?.$el?.querySelector('.zan-editor-toolbar-wrap'));
    closeColorPopover();
    closeEmojiPopover();
    closeHeadingPopover();
    closeLineHeightPopover();
    closeFontSizePopover();
    suppressOutsideClose = true;
    tableAnchorEl = mde.toolbarElements?.['draw-table'] || null;
    resetTableHover();
    manualTableRows.value = 3;
    manualTableCols.value = 3;
    isTablePopoverOpen.value = true;
    nextTick(() => {
        if (tableAnchorEl) {
            positionPopoverToAnchor(tableAnchorEl, tablePopoverStyle, {
                popoverEl: tablePopoverRef.value,
                fallbackWidth: 224,
            });
        }
    });
    setTimeout(() => { suppressOutsideClose = false; }, 0);
}

function closeTablePopover() {
    isTablePopoverOpen.value = false;
    tableAnchorEl = null;
    resetTableHover();
}

function closeHeadingPopover() {
    isHeadingPopoverOpen.value = false;
    headingAnchorEl = null;
}

function openHeadingPopover(mde) {
    setEditor(mde);
    ensurePopoverHost(markdownEditor.value?.$el?.querySelector('.zan-editor-toolbar-wrap'));
    closeColorPopover();
    closeEmojiPopover();
    closeTablePopover();
    closeLineHeightPopover();
    closeFontSizePopover();
    headingAnchorEl = mde.toolbarElements?.heading || null;
    suppressOutsideClose = true;
    isHeadingPopoverOpen.value = true;
    nextTick(() => {
        if (headingAnchorEl) {
            positionPopoverToAnchor(headingAnchorEl, headingPopoverStyle, {
                popoverEl: headingPopoverRef.value,
                fallbackWidth: 224,
            });
        }
    });
    setTimeout(() => { suppressOutsideClose = false; }, 0);
}

function insertHeadingLevel(level) {
    if (!editor.value) return;
    insertHeading(getCodeMirror(editor.value), ph().text, level);
    closeHeadingPopover();
}

function closeLineHeightPopover() {
    isLineHeightPopoverOpen.value = false;
    lineHeightAnchorEl = null;
}

function openLineHeightPopover(mde) {
    setEditor(mde);
    ensurePopoverHost(markdownEditor.value?.$el?.querySelector('.zan-editor-toolbar-wrap'));
    closeColorPopover();
    closeEmojiPopover();
    closeTablePopover();
    closeHeadingPopover();
    closeFontSizePopover();
    lineHeightAnchorEl = mde.toolbarElements?.['line-height'] || null;
    suppressOutsideClose = true;
    isLineHeightPopoverOpen.value = true;
    nextTick(() => {
        if (lineHeightAnchorEl) {
            positionPopoverToAnchor(lineHeightAnchorEl, lineHeightPopoverStyle, {
                popoverEl: lineHeightPopoverRef.value,
                fallbackWidth: 208,
            });
        }
    });
    setTimeout(() => { suppressOutsideClose = false; }, 0);
}

function applyLineHeight(value) {
    if (!editor.value || value == null) return;
    const cm = getCodeMirror(editor.value);
    insertLineHeightBlock(cm, value, cm.getSelection() || '');
    closeLineHeightPopover();
    onContentUpdate();
}

function insertTableFromPicker(rows, cols) {
    if (!editor.value || rows < 1 || cols < 1) return;
    insertTableSized(getCodeMirror(editor.value), rows, cols, ph());
    closeTablePopover();
}

function insertTableFromManual() {
    insertTableFromPicker(manualTableRows.value, manualTableCols.value);
}

function syncCmFocusClass() {
    const cm = editorCmEl || markdownEditor.value?.$el?.querySelector('.CodeMirror');
    if (!cm) return;
    const active = showCmRing.value;
    cm.classList.toggle('zan-cm-focused', active && !props.errors);
    cm.classList.toggle('zan-cm-error', active && !!props.errors);
}

function setupEditorCmFocus() {
    const root = markdownEditor.value?.$el;
    const legacyWrap = root?.querySelector('.zan-editor-cm-wrap');
    if (legacyWrap?.querySelector('.CodeMirror')) {
        const cm = legacyWrap.querySelector('.CodeMirror');
        legacyWrap.parentNode.insertBefore(cm, legacyWrap);
        legacyWrap.remove();
    }
    editorCmEl = root?.querySelector('.CodeMirror') || null;
    syncCmFocusClass();
}

watch(isFocused, () => { syncCmFocusClass(); });
watch(() => props.errors, () => { syncCmFocusClass(); });
watch(showCmRing, () => { syncCmFocusClass(); });
watch(isPreviewMode, () => { syncCmFocusClass(); });
const selectedFileName = computed(() => selectedFile.value?.name || '');
const selectedFileSizeFormatted = computed(() => {
    if (!selectedFile.value) return '';
    return formatFileSize(selectedFile.value.size, 1, locale.value === 'fa' ? 'fa' : 'en');
});
const isSelectedImage = computed(() => isImageFile(selectedFile.value));
const selectedFileMeta = computed(() => getFileTypeMeta(getFileExtension(selectedFileName.value)));
const imageUploadAccept = computed(() => {
    const imagePart = IMAGE_EXTENSIONS.map((ext) => `.${ext}`).join(',');
    if (!props.enableFileUpload) return imagePart;
    const filePart = FILE_EXTENSIONS.map((ext) => `.${ext}`).join(',');
    return `${imagePart},${filePart}`;
});
const uploadModalTitle = computed(() => (
    props.enableFileUpload ? t('editor.uploadMedia') : t('editor.uploadImage')
));
const uploadAllowedExtensionsText = computed(() => (
    props.enableFileUpload ? t('editor.allowedMediaExtensions') : t('editor.allowedExtensions')
));
const uploadButtonLabel = computed(() => {
    if (!selectedFile.value) return t('editor.uploadImage');
    return isSelectedImage.value ? t('editor.uploadImage') : t('editor.uploadFile');
});
const selectedVideoName = computed(() => selectedVideoFile.value?.name || '');
const selectedVideoSizeFormatted = computed(() => {
    if (!selectedVideoFile.value) return '';
    return formatFileSize(selectedVideoFile.value.size, 1, locale.value === 'fa' ? 'fa' : 'en');
});

function closeFontSizePopover() {
    isFontSizePopoverOpen.value = false;
    fontSizeAnchorEl = null;
}

function openFontSizePopover(mde) {
    setEditor(mde);
    ensurePopoverHost(markdownEditor.value?.$el?.querySelector('.zan-editor-toolbar-wrap'));
    closeColorPopover();
    closeEmojiPopover();
    closeTablePopover();
    closeHeadingPopover();
    closeLineHeightPopover();
    fontSizeAnchorEl = mde.toolbarElements?.['font-size'] || null;
    suppressOutsideClose = true;
    isFontSizePopoverOpen.value = true;
    nextTick(() => {
        if (fontSizeAnchorEl) {
            positionPopoverToAnchor(fontSizeAnchorEl, fontSizePopoverStyle, {
                popoverEl: fontSizePopoverRef.value,
                fallbackWidth: 256,
            });
        }
    });
    setTimeout(() => { suppressOutsideClose = false; }, 0);
}

function applyFontSize(size) {
    if (!editor.value || !size) return;
    const num = parseInt(size, 10);
    if (Number.isNaN(num) || num <= 0) return;
    const cm = getCodeMirror(editor.value);
    insertFontSize(cm, num, ph().text);
    closeFontSizePopover();
    onContentUpdate();
}

function openColorPopover(type, mde) {
    setEditor(mde);
    ensurePopoverHost(markdownEditor.value?.$el?.querySelector('.zan-editor-toolbar-wrap'));
    closeTablePopover();
    closeEmojiPopover();
    closeHeadingPopover();
    closeLineHeightPopover();
    suppressOutsideClose = true;
    const btnKey = type === 'text' ? 'text-color' : 'bg-color';
    colorAnchorEl = mde.toolbarElements?.[btnKey] || null;
    customPickerColor.value = type === 'text' ? '#2563eb' : '#fef08a';
    activeColorPopover.value = type;
    nextTick(() => {
        if (colorAnchorEl) {
            positionPopoverToAnchor(colorAnchorEl, colorPopoverStyle, {
                popoverEl: colorPopoverRef.value,
                fallbackWidth: 224,
            });
        }
    });
    setTimeout(() => { suppressOutsideClose = false; }, 0);
}

function closeColorPopover() {
    activeColorPopover.value = null;
    colorAnchorEl = null;
}

function applyPopoverColor(color) {
    if (!editor.value || !color) return;
    const cm = getCodeMirror(editor.value);
    if (activeColorPopover.value === 'text') {
        insertStyledSpan(cm, `color: ${color}`, ph().text);
    } else {
        insertStyledSpan(cm, `background-color: ${color}`, ph().text);
    }
    closeColorPopover();
}

function ph() {
    return {
        text: t('editor.sampleText'),
        link: t('editor.sampleLink'),
        url: t('editor.sampleUrl'),
        inlineCode: t('editor.sampleInlineCode'),
        code: t('editor.sampleCode'),
        quote: t('editor.sampleQuote'),
        colLabel: (n) => t('editor.sampleColN', { n }),
        cell: t('editor.sampleCell'),
    };
}

function withCm(fn) {
    return function (mde) {
        setEditor(mde);
        fn(getCodeMirror(mde));
    };
}


const isGuideOpen = ref(false);
const guideUid = `eg-${Math.random().toString(36).slice(2, 8)}`;

function getGuideRoot() {
    return markdownEditor.value?.$el?.querySelector('.editor-guide')
        || markdownEditor.value?.$el?.parentElement?.querySelector('.editor-guide');
}

function syncGuideButtonState() {
    const btn = markdownEditor.value?.$el?.querySelector('.editor-toolbar button.guide');
    if (!btn) return;
    btn.classList.toggle('active', isGuideOpen.value);
    btn.setAttribute('aria-pressed', isGuideOpen.value ? 'true' : 'false');
}

function toggleGuide() {
    const guide = getGuideRoot();
    if (!guide) return;
    isGuideOpen.value = !isGuideOpen.value;
    guide.classList.toggle('hidden', !isGuideOpen.value);
    syncGuideButtonState();
}

// const content = ref('');
const content = ref(props.modelValue || "");
const markdownEditor = ref(null);
const emit = defineEmits(["update"]);

watch(
    () => props.modelValue,
    (newContent) => {
        const next = newContent ?? "";
        if (content.value !== next) {
            content.value = next;
        }
        const mde = markdownEditor.value?.easymde;
        if (mde && mde.value() !== next) {
            mde.value(next);
        }
    }
);

function onContentUpdate() {
    emit("update:modelValue", content.value);
}

function reset() {
    if (isPreviewMode.value) {
        isPreviewMode.value = false;
        onPreviewChange();
    }
    content.value = "";
    onContentUpdate();
    const mde = markdownEditor.value?.easymde;
    if (mde) {
        mde.value("");
    }
}

defineExpose({ markdownEditor, reset });

const wordCount = computed(() => {
    if (typeof content.value === "string") {
        return content.value
            .trim()
            .split(/\s+/)
            .filter((word) => word.length > 0).length;
    }
    return 0;
});

const charCount = computed(() => {
    if (typeof content.value === "string") {
        // return content.value.replace(/\s/g, '').length; // for delete space
        return content.value.length;
    }
    return 0;
});

const configs = {
    previewClass: props.previewClass,
    direction: "rtl",
    hljs: typeof window !== "undefined" ? window.hljs : undefined,
    blockStyles: {
        bold: "__",
        italic: "_",
    },
    indentWithTabs: true,
    insertTexts: {
        horizontalRule: ["", "\n---\n"],
    },
    lineWrapping: true,
    maxHeight: "300px",

    placeholder: props.placeholder || t("editor.placeholder"),

    promptURLs: false,
    renderingConfig: {
        singleLineBreaks: true,
        codeSyntaxHighlighting: true,
    },
    previewRender: (plainText) => renderEditorPreviewHtml(plainText),
    shortcuts: {
        drawTable: "Cmd-Alt-T",
        toggleCodeBlock: "Cmd-Alt-C",
    },
    spellChecker: false,
    status: false,
    styleSelectedText: !isTouchDevice,
    inputStyle: isTouchDevice ? 'contenteditable' : 'textarea',
    tabSize: 4,
    toolbar: [
        {
            name: "bold",
            action: withCm((cm) => insertWithSelection(cm, '__', '__', ph().text)),
            className: "bold",
            title: t("editor.bold"),
        },
        {
            name: "italic",
            action: withCm((cm) => insertWithSelection(cm, '_', '_', ph().text)),
            className: "italic",
            title: t("editor.italic"),
        },
        {
            name: "inline-code",
            action: withCm((cm) => insertWithSelection(cm, '`', '`', ph().inlineCode)),
            className: "inline-code",
            title: t("editor.inlineCode"),
        },
        "|",
        {
            name: "link",
            action: withCm((cm) => insertLink(cm, ph().link, ph().url)),
            className: "link",
            title: t("editor.insertLink"),
        },
        {
            name: "image",
            action: withCm((cm) => insertImage(cm, ph().link, ph().url)),
            className: "image",
            title: t("editor.insertImage"),
        },
        {
            name: "uploadImage",
            action: function (mde) { openUploadImageModal(mde); },
            className: "uploadImage",
            title: props.enableFileUpload ? t("editor.uploadMedia") : t("editor.uploadImage"),
        },
        ...(props.enableVideoUpload ? [{
            name: "uploadVideo",
            action: function (mde) { openUploadVideoModal(mde); },
            className: "uploadVideo",
            title: t("editor.uploadVideo"),
        }] : []),
        "|",
        {
            name: "quote",
            action: withCm((cm) => insertQuote(cm, ph().quote)),
            className: "quote",
            title: t("editor.quote"),
        },
        {
            name: "code",
            action: withCm((cm) => insertCodeBlock(cm, ph().code)),
            className: "code",
            title: t("editor.codeBlock"),
        },
        {
            name: "draw-table",
            action: function (mde) {
                if (isTablePopoverOpen.value) {
                    closeTablePopover();
                    return;
                }
                openTablePopover(mde);
            },
            className: "draw-table",
            title: t("editor.table"),
        },
        "|",
        {
            name: "align-right",
            action: withCm((cm) => insertAlignBlock(cm, 'rtl', 'right', ph().text)),
            className: "align-right",
            title: t("editor.alignRight"),
        },
        {
            name: "align-left",
            action: withCm((cm) => insertAlignBlock(cm, 'ltr', 'left', ph().text)),
            className: "align-left",
            title: t("editor.alignLeft"),
        },
        {
            name: "text-color",
            action: function (mde) {
                if (activeColorPopover.value === 'text') {
                    closeColorPopover();
                    return;
                }
                openColorPopover('text', mde);
            },
            className: "text-color",
            title: t("editor.textColor"),
        },
        {
            name: "bg-color",
            action: function (mde) {
                if (activeColorPopover.value === 'bg') {
                    closeColorPopover();
                    return;
                }
                openColorPopover('bg', mde);
            },
            className: "bg-color",
            title: t("editor.bgColor"),
        },
        {
            name: "font-size",
            action: function (mde) {
                if (isFontSizePopoverOpen.value) {
                    closeFontSizePopover();
                    return;
                }
                openFontSizePopover(mde);
            },
            className: "font-size",
            title: t("editor.fontSize"),
        },
        "|",
        {
            name: "emoji",
            action: function (event) {
                if (isEmojiPopupOpen.value) {
                    closeEmojiPopover();
                    return;
                }
                openEmojiPopover(event);
            },
            className: "emoji",
            title: t("editor.insertEmoji"),
        },
        "|",
        "ordered-list",
        "unordered-list",
        "|",
        {
            name: "heading",
            action: function (mde) {
                if (isHeadingPopoverOpen.value) {
                    closeHeadingPopover();
                    return;
                }
                openHeadingPopover(mde);
            },
            className: "heading",
            title: t("editor.heading"),
        },
        {
            name: "line-height",
            action: function (mde) {
                if (isLineHeightPopoverOpen.value) {
                    closeLineHeightPopover();
                    return;
                }
                openLineHeightPopover(mde);
            },
            className: "line-height",
            title: t("editor.lineHeight"),
        },
        "horizontal-rule",
        "|",
        {
            name: "redo",
            action: function (mde) { mde.redo(); },
            className: "redo",
            title: t("editor.redo"),
        },
        {
            name: "undo",
            action: function (mde) { mde.undo(); },
            className: "undo",
            title: t("editor.undo"),
        },
        ...(props.helpButton ? [
            "|",
            {
                name: "guide",
                action: function () { toggleGuide(); },
                className: "guide",
                title: t("editor.guide"),
            },
        ] : []),
    ],
};

function onPreviewChange() {
    const mde = markdownEditor.value?.easymde;
    if (!mde) return;
    try {
        if (safeIsPreviewActive(mde) !== isPreviewMode.value) {
            mde.togglePreview();
        }
    } catch (err) {
        console.error(err);
        isPreviewMode.value = false;
        return;
    }
    updatePreviewToolbarState();
    if (isPreviewMode.value) {
        mountEditorPreview();
    }
}

function safeIsPreviewActive(mde) {
    try {
        return mde.isPreviewActive();
    } catch {
        return false;
    }
}

function mountEditorPreview() {
    setTimeout(() => {
        const el = markdownEditor.value?.$el?.querySelector('.editor-preview-active')
            || document.querySelector('.editor-preview-active');
        if (!el) return;
        el.classList.add('custom-scrollbar');
        createApp(MarkdownRenderer, {
            source: content.value,
            startClass: 'editor-preview-active zan-md-content',
            lang: locale.value,
        }).mount(el);
    }, 1);
}

function updatePreviewToolbarState() {
    const mde = markdownEditor.value?.easymde;
    const active = isPreviewMode.value || safeIsPreviewActive(mde);
    const root = markdownEditor.value?.$el;
    root?.querySelectorAll('.editor-toolbar').forEach((el) => {
        el.classList.toggle('zan-editor-preview-dim', active);
    });
}

function handleOutsideClick(e) {
    if (suppressOutsideClose) return;
    if (isEmojiPopupOpen.value) {
        const popup = emojiPopupRef.value;
        const emojiBtn = document.querySelector('.editor-toolbar button.emoji');
        if (!popup?.contains(e.target) && !emojiBtn?.contains(e.target)) {
            closeEmojiPopover();
        }
    }
    if (activeColorPopover.value) {
        const popover = colorPopoverRef.value;
        const textBtn = document.querySelector('.editor-toolbar button.text-color');
        const bgBtn = document.querySelector('.editor-toolbar button.bg-color');
        const onBtn = textBtn?.contains(e.target) || bgBtn?.contains(e.target);
        if (!popover?.contains(e.target) && !onBtn) {
            closeColorPopover();
        }
    }
    if (isTablePopoverOpen.value) {
        const popover = tablePopoverRef.value;
        const tableBtn = markdownEditor.value?.$el?.querySelector('.editor-toolbar button.draw-table');
        if (!popover?.contains(e.target) && !tableBtn?.contains(e.target)) {
            closeTablePopover();
        }
    }
    if (isHeadingPopoverOpen.value) {
        const popover = headingPopoverRef.value;
        const headingBtn = markdownEditor.value?.$el?.querySelector('.editor-toolbar button.heading');
        if (!popover?.contains(e.target) && !headingBtn?.contains(e.target)) {
            closeHeadingPopover();
        }
    }
    if (isLineHeightPopoverOpen.value) {
        const popover = lineHeightPopoverRef.value;
        const lineHeightBtn = markdownEditor.value?.$el?.querySelector('.editor-toolbar button.line-height');
        if (!popover?.contains(e.target) && !lineHeightBtn?.contains(e.target)) {
            closeLineHeightPopover();
        }
    }
    if (isFontSizePopoverOpen.value) {
        const popover = fontSizePopoverRef.value;
        const fontSizeBtn = markdownEditor.value?.$el?.querySelector('.editor-toolbar button.font-size');
        if (!popover?.contains(e.target) && !fontSizeBtn?.contains(e.target)) {
            closeFontSizePopover();
        }
    }
}

function setupMobileSelectionSupport(cm) {
    const apply = (el) => {
        if (!el) return;
        el.style.webkitUserSelect = 'text';
        el.style.userSelect = 'text';
        el.style.webkitTouchCallout = 'default';
    };
    apply(cm.getInputField());
    apply(cm.getWrapperElement());
    apply(cm.getScrollerElement());
    cm.getWrapperElement()?.querySelectorAll('.CodeMirror-line').forEach(apply);
}

async function waitForCodeMirror(maxAttempts = 40, delayMs = 50) {
    for (let i = 0; i < maxAttempts; i++) {
        const cm = markdownEditor.value?.easymde?.codemirror;
        if (cm) return cm;
        await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
    return null;
}

onMounted(() => {
    document.addEventListener('click', handleOutsideClick);

    // VueEasymde is async — easymde/codemirror may not exist on first tick.
    void (async () => {
        const codeMirror = await waitForCodeMirror();
        if (!codeMirror) return;

        retreeToolbar();
        setButtonIcons();
        syncGuideButtonState();
        initTabs();
        applyEditorScrollbars();
        setupEditorCmFocus();

        codeMirror.setOption('rtlMoveVisually', true);
        setupMobileSelectionSupport(codeMirror);
        codeMirror.on('focus', () => {
            isFocused.value = true;
            if (!editorCmEl) {
                editorCmEl = markdownEditor.value?.$el?.querySelector('.CodeMirror') || null;
            }
            syncCmFocusClass();
        });
        codeMirror.on('blur', () => {
            isFocused.value = false;
            syncCmFocusClass();
        });
    })();
});

function applyEditorScrollbars() {
    const root = markdownEditor.value?.$el;
    root?.classList.add('custom-scrollbar');
    root?.querySelector('.CodeMirror-scroll')?.classList.add('custom-scrollbar');
    root?.querySelector('.CodeMirror-hscrollbar')?.classList.add('custom-scrollbar');
    root?.querySelectorAll('.editor-preview-active, .editor-preview-full').forEach((el) => {
        el.classList.add('custom-scrollbar');
    });
}

onUnmounted(() => {
    document.removeEventListener('click', handleOutsideClick);
    clearSelectedFilePreview();
    clearSelectedVideoPreview();
});

function applyToolbarResponsiveLayout(root) {
    const wrap = root?.querySelector('.zan-editor-toolbar-wrap');
    const toolbar = wrap?.querySelector('.editor-toolbar');
    if (!wrap || !toolbar) return;

    wrap.className = 'zan-editor-toolbar-wrap relative w-full';
    toolbar.classList.add(
        'w-full',
        'flex',
        'flex-wrap',
        'items-center',
        'gap-0.5',
        'content-start',
    );
}

function ensureToolbarOverlay(toolbar) {
    if (!toolbar || toolbar.querySelector('.zan-toolbar-preview-overlay')) return;
    const overlay = document.createElement('div');
    overlay.className = 'zan-toolbar-preview-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    toolbar.classList.add('relative');
    toolbar.insertBefore(overlay, toolbar.firstChild);
}

function retreeToolbar() {
    const root = markdownEditor.value?.$el;
    if (!root) return;

    const toolbar = root.querySelector('.editor-toolbar');
    if (!toolbar) return;

    ensureToolbarOverlay(toolbar);

    if (root.querySelector('.zan-editor-toolbar-wrap')) {
        ensurePopoverHost(root.querySelector('.zan-editor-toolbar-wrap'));
        applyToolbarResponsiveLayout(root);
        return;
    }

    const toolbar_parent = toolbar.parentElement;
    const toolbar_container = document.createElement('div');
    toolbar_container.className = 'zan-editor-toolbar-wrap relative w-full';
    toolbar_container.setAttribute('dir', 'ltr');
    toolbar.classList.add(
        'w-full',
        'flex',
        'flex-wrap',
        'items-center',
        'gap-0.5',
        'content-start',
    );
    toolbar_container.appendChild(toolbar);
    ensurePopoverHost(toolbar_container);

    if (props.helpButton) {
        const tabCode = `${guideUid}-code`;
        const tabLink = `${guideUid}-link`;
        const tabMention = `${guideUid}-mention`;
        const guide_container = document.createElement('div');
        guide_container.innerHTML = `<div class="editor-guide mb-2 hidden">
            <div class="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 overflow-hidden">
                <div class="flex flex-wrap items-center gap-1 border-b border-gray-100 px-2 pt-1.5 dark:border-gray-800" id="${guideUid}-tabs" data-tabs-toggle="#${guideUid}-content" role="tablist">
                    <button class="editor-guide-tab" id="${tabCode}-btn" data-tabs-target="#${tabCode}" type="button" role="tab" aria-controls="${tabCode}" aria-selected="true">${t("editor.guideCodeError")}</button>
                    <button class="editor-guide-tab" id="${tabLink}-btn" data-tabs-target="#${tabLink}" type="button" role="tab" aria-controls="${tabLink}" aria-selected="false">${t("editor.guideLink")}</button>
                    <button class="editor-guide-tab" id="${tabMention}-btn" data-tabs-target="#${tabMention}" type="button" role="tab" aria-controls="${tabMention}" aria-selected="false">${t("editor.guideMention")}</button>
                    <a href="/" target="_blank" class="ms-auto mb-1 px-2 py-1 text-[10px] font-medium text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400">${t("editor.guideFull")}</a>
                </div>
                <div id="${guideUid}-content">
                    <div class="editor-guide-panel" id="${tabCode}" role="tabpanel" aria-labelledby="${tabCode}-btn">
                        <p>${t("editor.guideCodeDesc")}</p>
                        <p class="my-2.5 text-center">
                            <img onerror="this.style.display='none'" class="mx-auto max-h-36 rounded-lg" src="https://static.zanburak.ir/images/other/backtick.jpg" alt="${t("editor.guideImageAlt")}">
                        </p>
                        <p class="mb-1.5 font-medium text-gray-500 dark:text-gray-400">${t("editor.guideExample")}</p>
                        <pre class="overflow-x-auto rounded-lg bg-gray-100 px-2.5 py-2 dark:bg-gray-800" dir="ltr"><code class="font-mono text-[11px] text-gray-700 dark:text-gray-200">\`\`\`css
.my-link { text-decoration: underline; }
\`\`\`</code></pre>
                    </div>
                    <div class="editor-guide-panel hidden" id="${tabLink}" role="tabpanel" aria-labelledby="${tabLink}-btn">
                        <p>${t("editor.guideLinkDesc1")}</p>
                        <p class="mt-1.5">${t("editor.guideLinkDesc2")}</p>
                    </div>
                    <div class="editor-guide-panel hidden" id="${tabMention}" role="tabpanel" aria-labelledby="${tabMention}-btn">
                        <p>${t("editor.guideMentionDesc")}</p>
                    </div>
                </div>
            </div>
        </div>`;
        toolbar_parent.insertBefore(guide_container, toolbar_parent.firstChild);
    }

    toolbar_parent.insertBefore(toolbar_container, toolbar_parent.firstChild);
    applyToolbarResponsiveLayout(root);
}

function setButtonIcons() {
    const buttonData = EDITOR_TOOLBAR_ICONS;
    const editorRoot = markdownEditor.value?.$el;
    const toolbarEl = editorRoot?.querySelector('.editor-toolbar');
    const codeMirrorEl = editorRoot?.querySelector('.CodeMirror');
    toolbarEl?.classList.add(...props.toolbarClass, 'flex', 'flex-wrap', 'items-center', 'gap-0.5', 'content-start');
    codeMirrorEl?.classList.add(...props.bodyClass);
    const buttons = editorRoot?.querySelectorAll('.editor-toolbar button') || [];

    buttons.forEach((button) => {
        const classes = (button.getAttribute('class') || '').split(/\s+/).filter(Boolean);
        const buttonInfo = buttonData.find((item) => classes.includes(item.type));

        if (buttonInfo) {
            button.innerHTML = buttonInfo.svg;
        }
    });

    editorRoot?.querySelectorAll('.editor-toolbar i.separator').forEach((el) => {
        el.textContent = '';
    });
}
const imageInput = ref(null);
const videoInput = ref(null);
const uploadErrors = ref(null);

const isOpenUploadImageModal = ref(false);
const isOpenUploadVideoModal = ref(false);
const uploadPercentage = ref(0);
const videoUploadPercentage = ref(0);
const uploadImageLoading = ref(false);
const uploadVideoLoading = ref(false);

function defaultFileDisplayName(filename) {
    if (!filename) return '';
    const lastDot = filename.lastIndexOf('.');
    return lastDot > 0 ? filename.slice(0, lastDot) : filename;
}

function clearSelectedFilePreview() {
    if (selectedFilePreview.value) {
        URL.revokeObjectURL(selectedFilePreview.value);
    }
    selectedFile.value = null;
    selectedFilePreview.value = null;
    fileDisplayName.value = '';
}

function clearSelectedVideoPreview() {
    if (selectedVideoPreview.value) {
        URL.revokeObjectURL(selectedVideoPreview.value);
    }
    selectedVideoFile.value = null;
    selectedVideoPreview.value = null;
}

function setSelectedMediaFile(file) {
    clearSelectedFilePreview();
    if (!file) return;
    selectedFile.value = file;
    fileDisplayName.value = defaultFileDisplayName(file.name);
    if (isImageFile(file)) {
        selectedFilePreview.value = URL.createObjectURL(file);
    }
}

function setSelectedVideoFile(file) {
    clearSelectedVideoPreview();
    if (!file) return;
    selectedVideoFile.value = file;
    selectedVideoPreview.value = URL.createObjectURL(file);
}

function closeUploadImageModal() {
    setEditor(null);
    uploadErrors.value = null;
    clearSelectedFilePreview();
    isDragOver.value = false;
    if (imageInput.value) imageInput.value.value = '';
    uploadPercentage.value = 0;
    isOpenUploadImageModal.value = false;
}

function closeUploadVideoModal() {
    setEditor(null);
    uploadErrors.value = null;
    clearSelectedVideoPreview();
    isVideoDragOver.value = false;
    if (videoInput.value) videoInput.value.value = '';
    videoUploadPercentage.value = 0;
    isOpenUploadVideoModal.value = false;
}

function openUploadImageModal(editorTarget) {
    setEditor(editorTarget);
    uploadErrors.value = null;
    uploadPercentage.value = 0;
    isOpenUploadImageModal.value = true;
}

function openUploadVideoModal(editorTarget) {
    setEditor(editorTarget);
    uploadErrors.value = null;
    videoUploadPercentage.value = 0;
    isOpenUploadVideoModal.value = true;
}

function onImageFileChange(e) {
    uploadErrors.value = null;
    const file = e.target.files?.[0];
    setSelectedMediaFile(file || null);
}

function onVideoFileChange(e) {
    uploadErrors.value = null;
    const file = e.target.files?.[0];
    setSelectedVideoFile(file || null);
}

function onImageDrop(e) {
    isDragOver.value = false;
    uploadErrors.value = null;
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    if (props.enableFileUpload && isVideoFile(file)) {
        uploadErrors.value = { file: [t('editor.useVideoUpload')] };
        return;
    }
    if (!props.enableFileUpload && !isImageFile(file)) {
        uploadErrors.value = { image: [t('editor.imageFormatError', { formats: IMAGE_EXTENSIONS })] };
        return;
    }
    if (imageInput.value) {
        const dt = new DataTransfer();
        dt.items.add(file);
        imageInput.value.files = dt.files;
    }
    setSelectedMediaFile(file);
}

function onVideoDrop(e) {
    isVideoDragOver.value = false;
    uploadErrors.value = null;
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    if (videoInput.value) {
        const dt = new DataTransfer();
        dt.items.add(file);
        videoInput.value.files = dt.files;
    }
    setSelectedVideoFile(file);
}

function triggerImagePicker() {
    imageInput.value?.click();
}

function triggerVideoPicker() {
    videoInput.value?.click();
}

async function uploadSelectedMedia() {
    const file = selectedFile.value || imageInput.value?.files?.[0];
    if (!file) {
        uploadErrors.value = { image: [t('editor.noImageSelected')] };
        return;
    }

    if (isImageFile(file)) {
        await uploadImage(file);
        return;
    }

    if (!props.enableFileUpload) {
        uploadErrors.value = { image: [t('editor.imageFormatError', { formats: IMAGE_EXTENSIONS })] };
        return;
    }

    await uploadAttachmentFile(file);
}

async function uploadImage(file) {
    uploadImageLoading.value = true;
    uploadErrors.value = null;
    const fileErrors = validateFile(file, 5, IMAGE_EXTENSIONS, 'image');
    if (fileErrors.length > 0) {
        uploadErrors.value = { image: fileErrors };
        uploadImageLoading.value = false;
        return;
    }

    const formData = new FormData();
    formData.append("image", file);
    await axiosInstance
        .post("editor/uploadImage", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
                uploadPercentage.value = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            },
        })
        .then((response) => {
            const cm = getCodeMirror(editor.value);
            insertImage(cm, t("editor.imageAlt"), response.data.path);
            uploadErrors.value = null;
            if (imageInput.value) imageInput.value.value = '';
            closeUploadImageModal();
        })
        .catch((error) => {
            uploadErrors.value = error.response?.data?.errors || { image: [t('editor.uploadFailed')] };
            console.error(error.response?.data?.errors);
        })
        .finally(() => {
            uploadImageLoading.value = false;
        });
}

async function uploadAttachmentFile(file) {
    uploadImageLoading.value = true;
    uploadErrors.value = null;
    const fileErrors = validateFile(file, 20, FILE_EXTENSIONS, 'file');
    if (fileErrors.length > 0) {
        uploadErrors.value = { file: fileErrors };
        uploadImageLoading.value = false;
        return;
    }

    const label = (fileDisplayName.value || defaultFileDisplayName(file.name)).trim() || file.name;
    const ext = getFileExtension(file.name);
    const formData = new FormData();
    formData.append("file", file);
    await axiosInstance
        .post("editor/uploadFile", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
                uploadPercentage.value = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            },
        })
        .then((response) => {
            const cm = getCodeMirror(editor.value);
            insertFileLink(cm, label, response.data.path, file.size, ext);
            uploadErrors.value = null;
            if (imageInput.value) imageInput.value.value = '';
            closeUploadImageModal();
        })
        .catch((error) => {
            uploadErrors.value = error.response?.data?.errors || { file: [t('editor.uploadFailed')] };
            console.error(error.response?.data?.errors);
        })
        .finally(() => {
            uploadImageLoading.value = false;
        });
}

async function uploadVideo() {
    const file = selectedVideoFile.value || videoInput.value?.files?.[0];
    if (!file) {
        uploadErrors.value = { video: [t('editor.noVideoSelected')] };
        return;
    }

    uploadVideoLoading.value = true;
    uploadErrors.value = null;
    const fileErrors = validateFile(file, 100, VIDEO_EXTENSIONS, 'video');
    if (fileErrors.length > 0) {
        uploadErrors.value = { video: fileErrors };
        uploadVideoLoading.value = false;
        return;
    }

    const formData = new FormData();
    formData.append("video", file);
    await axiosInstance
        .post("editor/uploadVideo", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
                videoUploadPercentage.value = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            },
        })
        .then((response) => {
            const cm = getCodeMirror(editor.value);
            insertVideo(cm, t("editor.videoAlt"), response.data.path);
            uploadErrors.value = null;
            if (videoInput.value) videoInput.value.value = '';
            closeUploadVideoModal();
        })
        .catch((error) => {
            uploadErrors.value = error.response?.data?.errors || { video: [t('editor.uploadFailed')] };
            console.error(error.response?.data?.errors);
        })
        .finally(() => {
            uploadVideoLoading.value = false;
        });
}

function validateFile(file, maxSize = 5, allowedExtensions = ["jpg", "jpeg", "png", "gif"], kind = 'image') {
    const errors = [];
    const maxFileSize = maxSize * 1024 * 1024;

    if (file.size > maxFileSize) {
        if (kind === 'video') {
            errors.push(t("editor.videoSizeError", { size: maxSize }));
        } else if (kind === 'file') {
            errors.push(t("editor.fileSizeError", { size: maxSize }));
        } else {
            errors.push(t("editor.imageSizeError", { size: maxSize }));
        }
    }

    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
        if (kind === 'video') {
            errors.push(t("editor.videoFormatError", { formats: allowedExtensions.join(', ') }));
        } else if (kind === 'file') {
            errors.push(t("editor.fileFormatError", { formats: allowedExtensions.join(', ') }));
        } else {
            errors.push(t("editor.imageFormatError", { formats: allowedExtensions.join(', ') }));
        }
    }

    return errors;
}

function emojiClick(emoji) {
    const cm = getCodeMirror(editor.value);
    if (cm) {
        cm.replaceSelection(emoji);
        cm.focus();
    }
    closeEmojiPopover();
}
</script>
<style>
@import "easymde/dist/easymde.min.css";
@import "@/assets/css/markdown-content.css";

:root {
    --CodeMirror-border: #e7e5e5;
}

.dark {
    --CodeMirror-border: #404040;
}

.editor-toolbar,
.EasyMDEContainer .editor-toolbar,
.zan-easymde .editor-toolbar {
    position: relative;
    opacity: 1 !important;
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    border-radius: 1rem !important;
    padding: 6px 8px !important;
}

.editor-toolbar:hover,
.EasyMDEContainer .editor-toolbar:hover {
    opacity: 1 !important;
}

.editor-toolbar:before,
.editor-toolbar:after {
    display: none !important;
    content: none !important;
}

.zan-editor-toolbar-wrap {
    position: relative;
}

.zan-editor-toolbar-wrap > .editor-toolbar {
    width: 100%;
    display: flex !important;
    flex-wrap: wrap !important;
    align-items: center;
    align-content: flex-start;
    gap: 4px 6px;
    row-gap: 6px;
    max-width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
}

@media (min-width: 768px) {
    .zan-editor-toolbar-wrap > .editor-toolbar {
        width: 100% !important;
        max-width: 100%;
        flex: 1 1 auto !important;
    }
}

.zan-editor-popover-host {
    position: absolute;
    inset: 0;
    z-index: 60;
    overflow: visible;
    pointer-events: none;
}

.zan-editor-popover-host .zan-editor-popover {
    pointer-events: auto;
}

.editor-toolbar.zan-editor-preview-dim {
    pointer-events: none;
}

.editor-toolbar .zan-toolbar-preview-overlay {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 30;
    border-radius: 0.5rem;
    background: rgba(255, 255, 255, 0.55);
    pointer-events: none;
}

.editor-toolbar.zan-editor-preview-dim .zan-toolbar-preview-overlay {
    display: block;
}

.dark .editor-toolbar .zan-toolbar-preview-overlay {
    background: rgba(15, 23, 42, 0.45);
}

.editor-toolbar button {
    width: 32px !important;
    height: 32px !important;
    min-width: 32px !important;
    padding: 6px !important;
    border-radius: 10px !important;
    border: none !important;
    background: transparent !important;
    box-shadow: none !important;
    display: inline-flex !important;
    align-items: center;
    justify-content: center;
    color: rgb(71 85 105);
    transition: background-color 0.15s ease, color 0.15s ease;
}

.dark .editor-toolbar button {
    color: rgb(226 232 240);
}

.editor-toolbar button svg,
.editor-toolbar button svg.zan-toolbar-icon {
    display: block;
    width: 18px !important;
    height: 18px !important;
    flex-shrink: 0;
    stroke-width: 2.2;
}

.editor-toolbar button.guide svg {
    stroke-width: 0;
}

.editor-guide {
    font-size: 11px;
    line-height: 1.65;
}

.editor-guide-tab {
    margin-bottom: -1px;
    border: none;
    border-bottom: 2px solid transparent;
    background: transparent;
    padding: 0.4rem 0.65rem;
    font-size: 11px;
    font-weight: 600;
    color: rgb(100 116 139);
    transition: color 0.15s ease, border-color 0.15s ease;
}

.editor-guide-tab:hover,
.editor-guide-tab[aria-selected="true"] {
    color: rgb(202 138 4);
    border-bottom-color: rgb(250 204 21);
}

.dark .editor-guide-tab {
    color: rgb(148 163 184);
}

.dark .editor-guide-tab:hover,
.dark .editor-guide-tab[aria-selected="true"] {
    color: rgb(250 204 21);
}

.editor-guide-panel {
    padding: 0.75rem 0.9rem 0.9rem;
    color: rgb(71 85 105);
}

.dark .editor-guide-panel {
    color: rgb(203 213 225);
}

.editor-toolbar button.draw-table {
    width: auto !important;
    min-width: 32px !important;
    display: inline-flex !important;
    position: static !important;
}

.editor-toolbar button:hover {
    background-color: rgb(241 245 249) !important;
    border: none !important;
}

.dark .editor-toolbar button:hover {
    background-color: rgb(51 65 85 / 0.55) !important;
    border: none !important;
}

.editor-toolbar .active {
    background-color: rgb(226 232 240) !important;
    border: none !important;
    border-radius: 10px !important;
}

.dark .editor-toolbar .active {
    background-color: rgb(51 65 85 / 0.75) !important;
    border: none !important;
}

.CodeMirror {
    position: relative !important;
    border: 1px solid #e5e7eb !important;
    border-radius: 8px !important;
    outline: none !important;
    background-color: #f9fafb !important;
    color: #1f2937 !important;
    font-size: 0.875rem !important;
    line-height: 1.625 !important;
    transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}

.CodeMirror pre.CodeMirror-line,
.CodeMirror pre.CodeMirror-line-like {
    font-size: 0.875rem !important;
    line-height: 1.625 !important;
}

.dark .CodeMirror {
    border-color: #374151 !important;
    background-color: rgba(31, 41, 55, 0.6) !important;
    color: #f3f4f6 !important;
}

.dark .CodeMirror pre.CodeMirror-line,
.dark .CodeMirror pre.CodeMirror-line-like,
.dark .CodeMirror-line,
.dark .CodeMirror-lines,
.dark .CodeMirror-line > span {
    color: #f3f4f6 !important;
}

.dark .CodeMirror .CodeMirror-placeholder {
    color: #64748b !important;
}

.dark .cm-s-easymde .cm-header,
.dark .cm-s-easymde .cm-header-1,
.dark .cm-s-easymde .cm-header-2,
.dark .cm-s-easymde .cm-header-3,
.dark .cm-s-easymde .cm-header-4,
.dark .cm-s-easymde .cm-header-5,
.dark .cm-s-easymde .cm-header-6 {
    color: #ffffff !important;
}

.dark .cm-s-easymde .cm-quote {
    color: #94a3b8 !important;
}

.dark .cm-s-easymde .cm-link {
    color: #60a5fa !important;
}

.dark .cm-s-easymde .cm-url {
    color: #93c5fd !important;
}

.dark .cm-s-easymde .cm-string {
    color: #93c5fd !important;
}

.dark .cm-s-easymde .cm-comment {
    color: #94a3b8 !important;
}

.CodeMirror.zan-cm-focused {
    position: relative !important;
    z-index: 1;
    border-color: #fed700 !important;
    background-color: #ffffff !important;
    box-shadow: inset 0 0 0 2px #fed700 !important;
}

.dark .CodeMirror.zan-cm-focused {
    border-color: #fed700 !important;
    background-color: rgb(31, 41, 55) !important;
    color: #f3f4f6 !important;
}

.CodeMirror.zan-cm-error {
    position: relative !important;
    z-index: 1;
    border-color: #f43f5e !important;
    box-shadow: inset 0 0 0 2px #f43f5e !important;
}

.dark .CodeMirror.zan-cm-error {
    border-color: #f43f5e !important;
}

.dark .CodeMirror .CodeMirror-cursor {
    border-left: 1px solid white !important;
    /* color and width of cursor */
}

.CodeMirror-scroll {
    text-align: right;
    -webkit-user-select: text;
    user-select: text;
    -webkit-touch-callout: default;
}

.zan-easymde .CodeMirror,
.zan-easymde .CodeMirror-code,
.zan-easymde .CodeMirror-lines,
.zan-easymde .CodeMirror-line,
.zan-easymde .CodeMirror-line > span,
.zan-easymde .CodeMirror [contenteditable="true"],
.zan-easymde .CodeMirror textarea {
    -webkit-user-select: text !important;
    user-select: text !important;
    -webkit-touch-callout: default !important;
}

.CodeMirror-selected,
.CodeMirror-focused .CodeMirror-selected,
span.CodeMirror-selectedtext {
    background: #b3d4fc !important;
}

@supports (background: Highlight) {
    .CodeMirror-selected,
    .CodeMirror-focused .CodeMirror-selected,
    span.CodeMirror-selectedtext {
        background: Highlight !important;
        color: HighlightText !important;
    }
}

.CodeMirror-line::selection,
.CodeMirror-line > span::selection,
.CodeMirror-line > span > span::selection,
.CodeMirror textarea::selection {
    background: #b3d4fc;
    color: inherit;
}

@supports (background: Highlight) {
    .CodeMirror-line::selection,
    .CodeMirror-line > span::selection,
    .CodeMirror-line > span > span::selection,
    .CodeMirror textarea::selection {
        background: Highlight;
        color: HighlightText;
    }
}

.CodeMirror-line::-moz-selection,
.CodeMirror-line > span::-moz-selection,
.CodeMirror textarea::-moz-selection {
    background: #b3d4fc;
    color: inherit;
}

.editor-preview {
    display: none;
}

.editor-preview-active {
    direction: rtl;
    text-align: right;
    font-size: 0.875rem;
}

.dark .editor-preview,
.dark .editor-preview-active {
    background-color: rgb(17, 24, 39) !important;
    color: rgb(243, 244, 246) !important;
}

.editor-preview-active.custom-scrollbar,
.CodeMirror-scroll.custom-scrollbar {
    scrollbar-width: thin;
}

.editor-toolbar i.separator {
    display: none !important;
}

@media (min-width: 768px) {
    .editor-toolbar i.separator {
        display: inline-block !important;
        width: 1px !important;
        min-width: 1px !important;
        max-width: 1px !important;
        height: 16px !important;
        margin: 0 6px !important;
        padding: 0 !important;
        border: none !important;
        border-left: none !important;
        border-right: none !important;
        background: rgb(148 163 184) !important;
        opacity: 0.45;
        color: transparent !important;
        font-size: 0 !important;
        line-height: 0 !important;
        overflow: hidden !important;
        text-indent: 0 !important;
    }
    .editor-toolbar i.separator::before,
    .editor-toolbar i.separator::after {
        content: none !important;
        display: none !important;
    }
}
</style>
