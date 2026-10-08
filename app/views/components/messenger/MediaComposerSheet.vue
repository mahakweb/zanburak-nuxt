<template>
  <!-- Voice / audio: compact bottom sheet -->
  <BottomSheetDrawer
    v-if="isSheetType"
    :model-value="open"
    :draggable="true"
    :fit-content="true"
    :initial-height="0.42"
    :min-height="0.28"
    :max-height="0.72"
    :auto-close-on-min="true"
    :close-on-backdrop="true"
    :lock-scroll="true"
    backdrop-z-class="z-[2000000030]"
    panel-z-class="z-[2000000040]"
    :panel-class="sheetPanelClass"
    content-class="px-4 pb-5 pt-1 overflow-auto custom-scrollbar"
    :backdrop-class="sheetBackdropClass"
    @update:modelValue="(v) => { if (!v) onClose(); }"
    @close="onClose"
  >
    <!-- Multi file list -->
    <div v-if="isFileSheetMulti" class="mb-3 space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
      <div
        v-for="(it, idx) in draftItems"
        :key="it.id"
        class="flex items-center gap-2.5 px-2 py-2 rounded-xl"
        :class="it.selected ? 'bg-black/[0.04] dark:bg-white/[0.06]' : 'opacity-45'"
      >
        <span class="w-10 h-10 rounded-lg flex items-center justify-center text-white text-[10px] font-extrabold flex-shrink-0" :style="{ background: fileTileColor(it) }">
          {{ fileTileExt(it) }}
        </span>
        <div class="min-w-0 flex-1">
          <div class="text-[13px] font-semibold truncate text-gray-800 dark:text-gray-100">{{ it.fileName }}</div>
          <div class="text-[11px] text-gray-500 dark:text-gray-400 truncate">{{ formatBytes(it.size || 0) }}</div>
        </div>
        <button type="button" class="w-8 h-8 rounded-full flex items-center justify-center text-[#3390ec]" @click="toggleSelected(idx)">
          <span class="w-5 h-5 rounded-full border-2 flex items-center justify-center" :class="it.selected ? 'bg-[#3390ec] border-[#3390ec]' : 'border-gray-300 dark:border-white/30'">
            <svg v-if="it.selected" class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
          </span>
        </button>
      </div>
    </div>

    <div v-else class="flex items-center gap-3 mb-4">
      <div
        class="w-11 h-11 flex items-center justify-center flex-shrink-0 overflow-hidden"
        :class="type === 'audio'
          ? 'rounded-full border border-gray-200 dark:border-white/10 bg-gray-900'
          : (type === 'file' || activeType === 'file')
            ? 'rounded-xl text-white text-[10px] font-extrabold'
            : 'rounded-xl bg-[#3390ec]/12 text-[#3390ec]'"
        :style="(type === 'file' || activeType === 'file') ? { background: fileTileColor(activeItem || { fileName, type: 'file' }) } : undefined"
      >
        <img v-if="type === 'audio' && coverUrl" :src="coverUrl" alt="" class="w-full h-full object-cover" />
        <template v-else-if="type === 'file' || activeType === 'file'">{{ fileTileExt(activeItem || { fileName }) }}</template>
        <svg v-else-if="type === 'voice'" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="9.1" y="3.5" width="5.8" height="10.2" rx="2.9" />
          <path stroke-linecap="round" d="M6.2 11.2a5.8 5.8 0 0011.6 0M12 17v3.5M9.2 20.5h5.6" />
        </svg>
        <svg v-else class="w-5 h-5 text-amber-200" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 17.5V6.2l10-1.7v11.4" />
          <circle cx="7.5" cy="17.5" r="2.5" />
          <circle cx="17.5" cy="15.9" r="2.5" />
        </svg>
      </div>
      <div class="min-w-0 flex-1">
        <div class="text-[13px] font-semibold truncate text-gray-800 dark:text-gray-100">{{ fileName || title }}</div>
        <div v-if="fileMetaLine" class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">{{ fileMetaLine }}</div>
      </div>
    </div>

    <audio
      v-if="previewUrl && (type === 'audio' || type === 'voice')"
      :src="previewUrl"
      controls
      class="w-full mb-3 h-9 rounded-xl"
    />

    <div class="flex items-end gap-2">
      <textarea
        ref="captionInput"
        v-model="caption"
        v-no-autofill="'strong'"
        name="messenger-caption"
        rows="1"
        :dir="captionDir"
        :placeholder="$t('messenger.captionPlaceholder')"
        class="flex-1 min-w-0 resize-none rounded-2xl px-3 py-2.5 text-[14px] leading-5 bg-[#f1f1f1] dark:bg-white/5 border-0 focus:outline-none text-gray-800 dark:text-gray-100 max-h-24"
        enterkeyhint="send"
        @focus="onCaptionFocus"
        @blur="onCaptionBlur"
      />
      <button
        type="button"
        class="flex-shrink-0 w-10 h-10 mb-0.5 flex items-center justify-center rounded-full bg-[#3390ec] hover:bg-[#4ea4f5] text-white active:scale-95 transition shadow-sm"
        :title="$t('messenger.send')"
        :aria-label="$t('messenger.send')"
        @click="onSendSimple"
      >
        <svg class="w-[18px] h-[18px] rtl:-scale-x-100" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3.4 20.4l17.45-7.48a1 1 0 000-1.84L3.4 3.6a.993.993 0 00-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z" />
        </svg>
      </button>
    </div>
  </BottomSheetDrawer>

  <!-- Photo / video: minimal fullscreen editor -->
  <teleport to="body">
    <transition name="mc-fade">
      <div
        v-if="open && isFullscreenType"
        class="mc-fs fixed inset-0 z-[2000000050] flex flex-col bg-black text-white"
        :class="{ 'is-kb': keyboardOpen }"
        :style="fsViewportStyle"
        role="dialog"
        aria-modal="true"
      >
        <header class="mc-header flex items-center gap-1.5 px-3 pt-[max(0.65rem,env(safe-area-inset-top))] pb-1.5 flex-shrink-0">
          <button
            type="button"
            class="mc-icon-btn flex-shrink-0"
            :disabled="busy"
            :aria-label="$t('messenger.cancel')"
            :title="$t('messenger.cancel')"
            @click="onClose"
          >
            <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <div v-if="isMulti" class="mc-strip flex-1 min-w-0" dir="ltr">
            <button
              v-for="(it, idx) in draftItems"
              :key="it.id"
              type="button"
              class="mc-thumb"
              :class="{ active: idx === activeIndex, unchecked: !it.selected, dragging: dragIndex === idx }"
              :aria-label="it.fileName"
              draggable="true"
              @click="onSelectItem(idx)"
              @dragstart="onThumbDragStart(idx, $event)"
              @dragover.prevent="onThumbDragOver(idx)"
              @drop.prevent="onThumbDrop(idx)"
              @dragend="onThumbDragEnd"
            >
              <img v-if="it.type === 'photo'" :src="it.previewUrl" alt="" class="mc-thumb-img" />
              <video v-else-if="it.type === 'video'" :src="it.previewUrl" muted playsinline preload="metadata" class="mc-thumb-img" />
              <span v-else class="mc-thumb-file" :style="{ background: fileTileColor(it) }">{{ fileTileExt(it) }}</span>
              <span
                class="mc-check"
                :class="{ on: it.selected }"
                @click.stop="toggleSelected(idx)"
              >
                <svg v-if="it.selected" class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span v-if="it.type === 'video'" class="mc-thumb-dur" aria-hidden="true">
                {{ formatDuration(it.duration || it.draft?.videoDuration || 0) }}
              </span>
              <span v-if="paintHasEdits(it.draft?.paint)" class="mc-thumb-edit" aria-hidden="true">✎</span>
            </button>
          </div>

          <div v-else class="min-w-0 flex-1" />

          <button
            v-if="activeType === 'photo' || activeType === 'video'"
            type="button"
            class="mc-quality-chip flex-shrink-0"
            :disabled="busy"
            :title="$t('messenger.mediaQualityTitle')"
            @click="qualityOpen = true"
          >
            <span class="mc-quality-chip-main">{{ qualityChipLabel }}</span>
            <span class="mc-quality-chip-dot" aria-hidden="true" />
            <span class="mc-quality-chip-size">{{ formatBytes(estimatedOutput.size) }}</span>
          </button>

          <div v-if="showComposeMenu" class="relative flex-shrink-0">
            <button
              type="button"
              class="mc-icon-btn"
              :disabled="busy"
              :aria-label="$t('messenger.more')"
              :title="$t('messenger.more')"
              @click="menuOpen = !menuOpen"
            >
              <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <circle cx="12" cy="5" r="1.6" />
                <circle cx="12" cy="12" r="1.6" />
                <circle cx="12" cy="19" r="1.6" />
              </svg>
            </button>
            <transition name="mc-menu">
              <div v-if="menuOpen" class="mc-menu" role="menu">
                <button v-if="canAlbum" type="button" class="mc-menu-item" role="menuitem" @click="setGroupMode('album')">
                  <span class="mc-menu-check" :class="{ on: groupMode === 'album' }">
                    <svg v-if="groupMode === 'album'" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </span>
                  {{ $t('messenger.mediaSendAsAlbum') }}
                </button>
                <button v-if="canAlbum" type="button" class="mc-menu-item" role="menuitem" @click="setGroupMode('separate')">
                  <span class="mc-menu-check" :class="{ on: groupMode === 'separate' }">
                    <svg v-if="groupMode === 'separate'" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </span>
                  {{ $t('messenger.mediaSendSeparately') }}
                </button>
                <button
                  v-if="activeType === 'photo' || activeType === 'video'"
                  type="button"
                  class="mc-menu-item"
                  role="menuitem"
                  @click="sendActiveAsFile"
                >
                  {{ $t('messenger.sendAsFile') }}
                </button>
              </div>
            </transition>
          </div>

          <button
            type="button"
            class="mc-send-btn flex-shrink-0"
            :disabled="busy || !canSend"
            :aria-label="$t('messenger.send')"
            :title="$t('messenger.send')"
            @click="onSendEdited"
          >
            <span v-if="busy" class="text-[10px] font-semibold tabular-nums tracking-tight">{{ exportPct > 0 ? `${exportPct}%` : '…' }}</span>
            <svg v-else class="w-4 h-4 rtl:-scale-x-100" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3.4 20.4l17.45-7.48a1 1 0 000-1.84L3.4 3.6a.993.993 0 00-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z" />
            </svg>
          </button>
        </header>

        <div
          class="mc-stage-wrap relative flex-1 min-h-0 flex items-center justify-center bg-black overflow-hidden"
          :style="stageKeyboardStyle"
          @click="menuOpen = false; qualityOpen = false"
        >
          <div v-if="activeType === 'file'" class="mc-file-stage flex flex-col items-center justify-center gap-3 px-6 text-center">
            <span class="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-lg font-extrabold shadow-lg" :style="{ background: fileTileColor(activeItem || { fileName: activeFileName }) }">
              {{ fileTileExt(activeItem || { fileName: activeFileName }) }}
            </span>
            <div class="min-w-0 max-w-sm">
              <div class="text-[15px] font-semibold text-white truncate">{{ activeFileName }}</div>
              <div class="text-[12px] text-white/55 mt-1">{{ formatBytes(activeSize || 0) }}</div>
            </div>
          </div>
          <div v-else-if="activeType === 'photo' && activePreviewUrl" class="mc-stage w-full h-full relative overflow-hidden">
            <vue-cropper
              v-show="!paintMode && !filterMode"
              ref="cropper"
              :key="`photo-${activeItemId}-${cropperKey}`"
              :src="activePreviewUrl"
              :aspect-ratio="aspectRatioValue"
              :view-mode="1"
              :drag-mode="'move'"
              :auto-crop-area="1"
              :background="false"
              :responsive="true"
              :guides="true"
              :center="true"
              :highlight="false"
              :crop-box-movable="true"
              :crop-box-resizable="true"
              :toggle-drag-mode-on-dblclick="false"
              :zoomable="true"
              :zoom-on-touch="true"
              :zoom-on-wheel="true"
              :ready="onCropperReady"
              :container-style="{ width: '100%', height: '100%', touchAction: 'none' }"
              :img-style="{ display: 'block', maxWidth: '100%' }"
            />
            <!-- Filter preview (full image, no crop chrome) -->
            <div
              v-if="filterMode"
              class="mc-filter-stage absolute inset-0 flex items-center justify-center bg-black"
            >
              <img
                :src="activePreviewUrl"
                alt=""
                class="mc-filter-preview"
                :style="{ filter: activeFilterCss }"
                draggable="false"
              />
            </div>
            <!-- Paint stage: image + overlay share the exact contain-fit box -->
            <div
              v-if="paintMode"
              ref="paintStage"
              class="mc-paint-stage absolute inset-0 bg-black"
            >
              <div class="mc-paint-fit" :style="paintFitStyle">
                <img
                  ref="paintBase"
                  :src="activePreviewUrl"
                  alt=""
                  class="mc-paint-base"
                  :style="{ filter: activeFilterCss }"
                  draggable="false"
                  @load="onPaintBaseLoad"
                />
                <MediaPaintOverlay
                  v-model="paintState"
                  :tool="paintTool"
                  :color="paintColor"
                  :thickness="paintThickness"
                  :emoji="paintEmoji"
                  :enabled="true"
                  @drawing-change="onPaintChange"
                />
              </div>
            </div>
          </div>

          <div v-else-if="activeType === 'video' && activePreviewUrl" class="mc-stage w-full h-full flex flex-col">
            <div class="flex-1 min-h-0 flex items-center justify-center relative">
              <video
                ref="videoEl"
                :key="`video-${activeItemId}`"
                :src="activePreviewUrl"
                class="max-w-full max-h-full object-contain"
                :muted="muteAudio"
                playsinline
                :loop="muteAudio"
                @loadedmetadata="onVideoMeta"
                @timeupdate="onVideoTime"
              />
              <button
                type="button"
                class="absolute inset-0 flex items-center justify-center"
                :aria-label="videoPlaying ? 'pause' : 'play'"
                @click="toggleVideoPlay"
              >
                <span v-if="!videoPlaying" class="mc-play-fab">
                  <svg class="w-6 h-6 ms-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.14v13.72L19 12 8 5.14z" /></svg>
                </span>
              </button>
              <span v-if="muteAudio" class="mc-gif-tag pointer-events-none">GIF</span>
            </div>
          </div>

          <div v-if="busy" class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/50 backdrop-blur-[3px]">
            <div class="mc-busy-ring" :style="{ '--p': `${Math.max(8, exportPct || 12)}%` }" />
            <span v-if="busyLabel" class="text-[11px] text-white/55 tracking-wide">{{ busyLabel }}</span>
          </div>
        </div>

        <div
          class="mc-dock flex-shrink-0 px-3.5 pt-3"
          :style="dockPaddingStyle"
        >
          <template v-if="activeType === 'photo'">
            <!-- Paint tools -->
            <div v-if="paintMode" class="mb-3 space-y-2.5">
              <div class="flex items-center justify-center gap-1 flex-wrap">
                <button type="button" class="mc-tool" :class="{ active: paintTool === 'pen' }" :title="$t('messenger.mediaPaintPen')" @click="paintTool = 'pen'">
                  <svg class="w-[17px] h-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" d="M4 20l4.5-1L20 7.5 16.5 4 5 15.5 4 20z" /></svg>
                </button>
                <button type="button" class="mc-tool" :class="{ active: paintTool === 'eraser' }" :title="$t('messenger.mediaPaintEraser')" @click="paintTool = 'eraser'">
                  <svg class="w-[17px] h-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M3 17l7-7 7 7H3zm7-7l4-4 4 4-4 4-4-4z" /></svg>
                </button>
                <button type="button" class="mc-tool" :class="{ active: paintTool === 'text' }" :title="$t('messenger.mediaPaintText')" @click="paintTool = 'text'">
                  <span class="text-[13px] font-extrabold leading-none">T</span>
                </button>
                <button type="button" class="mc-tool" :class="{ active: paintTool === 'emoji' }" :title="$t('messenger.mediaPaintEmoji')" @click="paintTool = 'emoji'">
                  <span class="text-[15px] leading-none">☺</span>
                </button>
                <span class="mc-tool-sep" aria-hidden="true" />
                <button type="button" class="mc-tool" :disabled="!canUndoPaint" :title="$t('messenger.mediaPaintUndo')" @click="onPaintUndo">
                  <svg class="w-[17px] h-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M9 14l-4-4 4-4M5 10h9a5 5 0 110 10h-1" /></svg>
                </button>
                <button type="button" class="mc-tool" :disabled="!canRedoPaint" :title="$t('messenger.mediaPaintRedo')" @click="onPaintRedo">
                  <svg class="w-[17px] h-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M15 14l4-4-4-4M19 10H10a5 5 0 100 10h1" /></svg>
                </button>
                <button type="button" class="mc-tool" :title="$t('messenger.mediaPaintDone')" @click="exitPaintMode">
                  <svg class="w-[17px] h-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                </button>
              </div>
              <div v-if="paintTool === 'pen' || paintTool === 'text'" class="flex items-center justify-center gap-2">
                <button
                  v-for="c in paintColors"
                  :key="c"
                  type="button"
                  class="mc-color"
                  :class="{ on: paintColor === c }"
                  :style="{ background: c }"
                  @click="paintColor = c"
                />
              </div>
              <div v-if="paintTool === 'pen' || paintTool === 'eraser'" class="flex items-center justify-center gap-2" dir="ltr">
                <button
                  v-for="t in paintThicknesses"
                  :key="t"
                  type="button"
                  class="mc-thick"
                  :class="{ on: paintThickness === t }"
                  @click="paintThickness = t"
                >
                  <span class="mc-thick-dot" :style="{ width: `${6 + t}px`, height: `${6 + t}px` }" />
                </button>
              </div>
              <div v-if="paintTool === 'emoji'" class="mc-emoji-row" dir="ltr">
                <button
                  v-for="em in quickEmojis"
                  :key="em"
                  type="button"
                  class="mc-emoji"
                  :class="{ on: paintEmoji === em }"
                  @click="paintEmoji = em"
                >{{ em }}</button>
              </div>
            </div>

            <!-- Filter tools (under its own button, like paint) -->
            <div v-else-if="filterMode" class="mb-3 space-y-2">
              <div class="flex items-center justify-center gap-1 mb-1">
                <button type="button" class="mc-tool active" :title="$t('messenger.mediaFilters')" aria-hidden="true">
                  <svg class="w-[17px] h-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
                    <circle cx="7.5" cy="8.5" r="2.5" />
                    <circle cx="16" cy="7" r="2" />
                    <circle cx="14.5" cy="15.5" r="3" />
                    <circle cx="6.5" cy="16" r="1.8" />
                  </svg>
                </button>
                <span class="mc-tool-sep" aria-hidden="true" />
                <button type="button" class="mc-tool" :title="$t('messenger.mediaPaintDone')" @click="exitFilterMode">
                  <svg class="w-[17px] h-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                </button>
              </div>
              <div class="mc-filters" dir="ltr">
                <button
                  v-for="f in filters"
                  :key="f.id"
                  type="button"
                  class="mc-filter"
                  :class="{ active: filterId === f.id }"
                  :title="$t(f.labelKey)"
                  :aria-label="$t(f.labelKey)"
                  @click="setFilter(f.id)"
                >
                  <span
                    class="mc-filter-thumb"
                    :style="{ filter: f.css === 'none' ? 'none' : f.css, backgroundImage: activePreviewUrl ? `url(${activePreviewUrl})` : 'none' }"
                  />
                  <span class="mc-filter-label">{{ $t(f.labelKey) }}</span>
                </button>
              </div>
            </div>

            <div v-else class="flex items-center justify-center gap-1 mb-3">
              <button
                v-for="a in aspectOptions"
                :key="a.id"
                type="button"
                class="mc-tool"
                :class="{ active: aspectMode === a.id }"
                :title="a.label"
                :aria-label="a.label"
                @click="setAspect(a.id)"
              >
                <span class="mc-aspect" :data-ratio="a.id" aria-hidden="true" />
              </button>
              <span class="mc-tool-sep" aria-hidden="true" />
              <button
                type="button"
                class="mc-tool"
                :title="$t('messenger.mediaRotate')"
                :aria-label="$t('messenger.mediaRotate')"
                @click="rotate90"
              >
                <svg class="w-[17px] h-[17px]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="M19.5 12a7.5 7.5 0 11-2.1-5.15" />
                  <path stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="M17.2 3.8v3.9h3.9" />
                </svg>
              </button>
              <button
                type="button"
                class="mc-tool"
                :class="{ active: filterId !== 'original' }"
                :title="$t('messenger.mediaFilters')"
                :aria-label="$t('messenger.mediaFilters')"
                @click="enterFilterMode"
              >
                <svg class="w-[17px] h-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
                  <circle cx="7.5" cy="8.5" r="2.5" />
                  <circle cx="16" cy="7" r="2" />
                  <circle cx="14.5" cy="15.5" r="3" />
                  <circle cx="6.5" cy="16" r="1.8" />
                </svg>
              </button>
              <button
                type="button"
                class="mc-tool"
                :class="{ active: paintHasEdits(paintState) }"
                :title="$t('messenger.mediaPaint')"
                :aria-label="$t('messenger.mediaPaint')"
                @click="enterPaintMode"
              >
                <svg class="w-[17px] h-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 20l4.5-1L20 7.5 16.5 4 5 15.5 4 20z" />
                </svg>
              </button>
            </div>
          </template>

          <template v-else-if="activeType === 'video'">
            <div class="mc-trim-wrap mb-3" dir="ltr">
              <div class="mc-trim-meta">
                <span>{{ formatDuration(trimStart) }}</span>
                <span class="mc-trim-len">{{ formatDuration(Math.max(0, trimEnd - trimStart)) }}</span>
                <span>{{ formatDuration(trimEnd) }}</span>
              </div>
              <div class="mc-trim" @pointerdown="onTrimPointerDown">
                <div class="mc-trim-track" />
                <div class="mc-trim-range" :style="trimRangeStyle" />
                <div class="mc-trim-handle start" :style="{ left: `${trimStartPct}%` }" data-handle="start" />
                <div class="mc-trim-handle end" :style="{ left: `${trimEndPct}%` }" data-handle="end" />
                <div class="mc-trim-playhead" :style="{ left: `${playheadPct}%` }" />
              </div>
            </div>
            <div class="flex items-center justify-center gap-1 mb-3">
              <button
                type="button"
                class="mc-tool"
                :class="{ active: muteAudio }"
                :title="muteAudio ? $t('messenger.mediaAsGif') : $t('messenger.mediaWithSound')"
                :aria-label="muteAudio ? $t('messenger.mediaAsGif') : $t('messenger.mediaWithSound')"
                @click="muteAudio = !muteAudio"
              >
                <svg v-if="muteAudio" class="w-[17px] h-[17px]" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11 5L6 9H3v6h3l5 4V5zM22 9l-6 6M16 9l6 6" />
                </svg>
                <svg v-else class="w-[17px] h-[17px]" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11 5L6 9H3v6h3l5 4V5zM15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" />
                </svg>
              </button>
              <button
                type="button"
                class="mc-tool"
                :title="$t('messenger.mediaSendFromHere')"
                :aria-label="$t('messenger.mediaSendFromHere')"
                @click="setSendFromHere"
              >
                <svg class="w-[17px] h-[17px]" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h11M12 6l6 6-6 6M4 18V6" />
                </svg>
              </button>
            </div>
          </template>

          <textarea
            ref="captionInputFs"
            v-model="caption"
            v-no-autofill="'strong'"
            name="messenger-caption"
            rows="1"
            :dir="captionDir"
            :placeholder="$t('messenger.captionPlaceholder')"
            class="mc-caption w-full min-w-0 resize-none border-0 focus:outline-none max-h-24"
            enterkeyhint="send"
            @focus="onCaptionFocus"
            @blur="onCaptionBlur"
            @input="autoGrowCaption"
          />
        </div>
      </div>
    </transition>

    <transition name="mc-fade">
      <div
        v-if="qualityOpen"
        class="fixed inset-0 z-[2000000060] flex items-end sm:items-center justify-center bg-black/55 px-4 pb-[max(0.9rem,env(safe-area-inset-bottom))]"
        @click.self="qualityOpen = false"
      >
        <div class="mc-quality-sheet w-full max-w-[22rem] text-white overflow-hidden">
          <div class="mc-quality-grab" aria-hidden="true" />
          <p class="mc-quality-title">{{ $t('messenger.mediaQualityTitle') }}</p>

          <button
            type="button"
            class="mc-quality-row"
            :class="{ on: compress }"
            @click="pickQuality(true)"
          >
            <span class="mc-quality-radio" :class="{ on: compress }" />
            <span class="min-w-0 flex-1 text-start">
              <span class="mc-quality-name">{{ $t('messenger.mediaQualityCompress') }}</span>
              <span class="mc-quality-meta">{{ qualityOptionLine(true) }}</span>
            </span>
            <span class="mc-quality-size">{{ formatBytes(estimateFor(true).size) }}</span>
          </button>

          <button
            type="button"
            class="mc-quality-row"
            :class="{ on: !compress }"
            @click="pickQuality(false)"
          >
            <span class="mc-quality-radio" :class="{ on: !compress }" />
            <span class="min-w-0 flex-1 text-start">
              <span class="mc-quality-name">{{ $t('messenger.mediaQualityOriginal') }}</span>
              <span class="mc-quality-meta">{{ qualityOptionLine(false) }}</span>
            </span>
            <span class="mc-quality-size">{{ formatBytes(estimateFor(false).size) }}</span>
          </button>

          <div v-if="activeSize && sizeDeltaLabel" class="mc-quality-delta" dir="ltr">
            <span>{{ formatBytes(activeSize) }}</span>
            <span class="mc-quality-delta-arrow" aria-hidden="true">→</span>
            <span class="mc-quality-delta-after">{{ formatBytes(estimatedOutput.size) }}</span>
            <span class="mc-quality-delta-pct">{{ sizeDeltaLabel }}</span>
          </div>
        </div>
      </div>
    </transition>

    <!-- Ask album vs individual when sending multiple -->
    <transition name="mc-fade">
      <div
        v-if="askGroupOpen"
        class="fixed inset-0 z-[2000000060] flex items-end sm:items-center justify-center bg-black/55 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
        @click.self="onAskGroupClose"
      >
        <div class="w-full max-w-sm rounded-2xl bg-[#1c1c1e] text-white shadow-2xl p-4 ring-1 ring-white/10">
          <h3 class="text-[15px] font-bold text-center">{{ $t('messenger.mediaSendModeTitle') }}</h3>
          <p class="mt-1.5 text-[13px] text-white/55 text-center leading-relaxed">
            {{ $t('messenger.mediaSendModeHint', { count: selectedCount }) }}
          </p>
          <div class="mt-4 space-y-2">
            <button
              type="button"
              class="w-full h-11 rounded-xl text-[14px] font-semibold bg-[#3390ec] hover:bg-[#4ea4f5] transition"
              @click="onGroupModePicked('album')"
            >
              {{ $t('messenger.mediaSendAsAlbum') }}
            </button>
            <button
              type="button"
              class="w-full h-11 rounded-xl text-[14px] font-semibold bg-white/10 hover:bg-white/14 transition"
              @click="onGroupModePicked('separate')"
            >
              {{ $t('messenger.mediaSendSeparately') }}
            </button>
            <button
              type="button"
              class="w-full h-10 rounded-xl text-[13px] font-medium text-white/45 hover:text-white/70 transition"
              @click="onAskGroupClose"
            >
              {{ $t('messenger.cancel') }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { defineAsyncComponent } from 'vue';
// vue-cropperjs touches window at import — load only on the client.
const VueCropper = import.meta.client
  ? defineAsyncComponent(async () => {
      await import('cropperjs/dist/cropper.css')
      return (await import('vue-cropperjs')).default
    })
  : { name: 'VueCropperStub', render() { return null } }
import BottomSheetDrawer from '@/views/components/common/BottomSheetDrawer.vue';
import { fileExtColor, fileExtension, formatBytes, formatDuration, mediaTypeLabelKey } from './mediaHelpers';
import { MESSENGER_SHEET_PANEL, MESSENGER_SHEET_BACKDROP } from './sheetStyles';
import {
  PHOTO_FILTERS,
  PHOTO_QUALITY_COMPRESSED,
  PHOTO_QUALITY_ORIGINAL,
  VIDEO_COMPRESS,
  VIDEO_ORIGINAL,
  exportFilteredImage,
  estimateMediaOutput,
  getPhotoFilter,
  remuxVideoSegment,
  videoNeedsProcessing,
} from './mediaEdit';
import MediaPaintOverlay from './MediaPaintOverlay.vue';
import {
  PAINT_COLORS,
  PAINT_THICKNESSES,
  QUICK_EMOJIS,
  emptyPaintState,
  clonePaintState,
  paintHasEdits,
  canUndoPaint,
  canRedoPaint,
  undoPaint,
  redoPaint,
  applyPaintToCanvas,
} from './mediaPaint';

function emptyDraft() {
  return {
    filterId: 'original',
    aspectMode: 'free',
    rotation: 0,
    trimStart: 0,
    trimEnd: 0,
    muteAudio: false,
    trimSet: false,
    cropData: null,
    canvasData: null,
    cropBoxData: null,
    paint: emptyPaintState(),
  };
}

export default {
  name: 'MediaComposerSheet',
  components: { BottomSheetDrawer, VueCropper, MediaPaintOverlay },
  props: {
    open: { type: Boolean, default: false },
    type: { type: String, default: 'photo' },
    file: { type: [File, Blob], default: null },
    fileName: { type: String, default: '' },
    previewUrl: { type: String, default: '' },
    coverUrl: { type: String, default: '' },
    size: { type: Number, default: 0 },
    duration: { type: Number, default: null },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
    /** Multi gallery items: { id, type, file, fileName, previewUrl, size, duration, width, height } */
    items: { type: Array, default: () => [] },
  },
  emits: ['close', 'send', 'send-batch'],
  data() {
    return {
      caption: '',
      filterId: 'original',
      aspectMode: 'free',
      cropperKey: 0,
      rotation: 0,
      busy: false,
      exportPct: 0,
      busyLabel: '',
      videoDuration: 0,
      trimStart: 0,
      trimEnd: 0,
      videoCurrent: 0,
      videoPlaying: false,
      muteAudio: false,
      trimming: null,
      draftItems: [],
      activeIndex: 0,
      compress: true,
      groupMode: null, // null | 'album' | 'separate'
      menuOpen: false,
      qualityOpen: false,
      askGroupOpen: false,
      pendingSend: false,
      // Paint / draw (non-destructive until send)
      paintMode: false,
      filterMode: false,
      paintState: emptyPaintState(),
      paintTool: 'pen',
      paintColor: PAINT_COLORS[0],
      paintThickness: 4,
      paintEmoji: QUICK_EMOJIS[0],
      paintColors: PAINT_COLORS,
      paintThicknesses: PAINT_THICKNESSES,
      quickEmojis: QUICK_EMOJIS,
      paintFitStyle: { width: '100%', height: '100%', left: '0', top: '0' },
      paintNatural: { w: 0, h: 0 },
      dragIndex: null,
      dragOverIndex: null,
      bodyLock: null,
      // Visual Viewport — keep composer above the soft keyboard (Telegram-like).
      vvHeight: null,
      vvOffsetTop: 0,
      keyboardInset: 0,
      captionFocused: false,
    };
  },
  computed: {
    sheetPanelClass() { return MESSENGER_SHEET_PANEL; },
    sheetBackdropClass() { return MESSENGER_SHEET_BACKDROP; },
    keyboardOpen() {
      return this.keyboardInset > 80 || this.captionFocused;
    },
    fsViewportStyle() {
      if (typeof window !== 'undefined' && window.innerWidth >= 1024) return {};
      if (this.vvHeight == null) return {};
      return {
        height: `${this.vvHeight}px`,
        top: `${this.vvOffsetTop}px`,
        bottom: 'auto',
        maxHeight: `${this.vvHeight}px`,
      };
    },
    stageKeyboardStyle() {
      const kb = this.keyboardInset;
      if (kb < 80) {
        return {
          transform: 'scale(1)',
          transition: 'transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
        };
      }
      // Telegram: shrink the preview as the caption keyboard claims the bottom.
      const scale = Math.max(0.62, Math.min(1, 1 - (kb - 80) / 1400));
      return {
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        transition: 'transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
      };
    },
    dockPaddingStyle() {
      const base = 'max(0.85rem, env(safe-area-inset-bottom))';
      // When VV pins the shell, safe-area alone is enough; keep send reachable.
      return { paddingBottom: base };
    },
    canUndoPaint() { return canUndoPaint(this.paintState); },
    canRedoPaint() { return canRedoPaint(this.paintState); },
    isMulti() {
      return Array.isArray(this.draftItems) && this.draftItems.length > 1;
    },
    isFullscreenType() {
      if (this.draftItems.length) {
        return this.draftItems.some((i) => i.type === 'photo' || i.type === 'video');
      }
      return this.type === 'photo' || this.type === 'video';
    },
    isSheetType() {
      if (this.isFullscreenType) return false;
      if (this.draftItems.length) {
        return this.draftItems.every((i) => i.type === 'file' || i.type === 'audio' || i.type === 'voice');
      }
      return this.type === 'voice' || this.type === 'audio' || this.type === 'file';
    },
    captionDir() {
      const t = String(this.caption || '');
      for (let i = 0; i < t.length; i += 1) {
        const code = t.codePointAt(i);
        if (code > 0xffff) i += 1;
        if (
          (code >= 0x0590 && code <= 0x05FF)
          || (code >= 0x0600 && code <= 0x06FF)
          || (code >= 0x0750 && code <= 0x077F)
          || (code >= 0x08A0 && code <= 0x08FF)
          || (code >= 0xFB50 && code <= 0xFDFF)
          || (code >= 0xFE70 && code <= 0xFEFF)
        ) return 'rtl';
        if (
          (code >= 0x0041 && code <= 0x005A)
          || (code >= 0x0061 && code <= 0x007A)
          || (code >= 0x00C0 && code <= 0x024F)
          || (code >= 0x0400 && code <= 0x04FF)
        ) return 'ltr';
      }
      const loc = String(this.$i18n?.locale || 'fa').toLowerCase();
      if (loc.startsWith('fa') || loc.startsWith('ar') || loc.startsWith('he') || loc.startsWith('ur')) {
        return 'rtl';
      }
      return 'ltr';
    },
    isFileSheetMulti() {
      return this.isSheetType && this.draftItems.length > 1;
    },
    visualSelectedCount() {
      return this.draftItems.filter((i) => i.selected && (i.type === 'photo' || i.type === 'video')).length;
    },
    canAlbum() {
      return this.isMulti && this.visualSelectedCount > 1;
    },
    showComposeMenu() {
      if (this.busy) return false;
      return this.canAlbum || this.activeType === 'photo' || this.activeType === 'video';
    },
    activeItem() {
      return this.draftItems[this.activeIndex] || null;
    },
    activeItemId() {
      return this.activeItem?.id || 'single';
    },
    activeType() {
      return this.activeItem?.type || this.type;
    },
    activePreviewUrl() {
      return this.activeItem?.previewUrl || this.previewUrl;
    },
    activeFile() {
      return this.activeItem?.file || this.file;
    },
    activeFileName() {
      return this.activeItem?.fileName || this.fileName;
    },
    activeSize() {
      return this.activeItem?.size ?? this.size;
    },
    activeDuration() {
      return this.activeItem?.duration ?? this.duration;
    },
    activeWidth() {
      return this.activeItem?.width ?? this.width;
    },
    activeHeight() {
      return this.activeItem?.height ?? this.height;
    },
    selectedCount() {
      return this.draftItems.filter((i) => i.selected).length;
    },
    canSend() {
      if (this.isMulti) return this.selectedCount > 0;
      if (this.activeType === 'file') return !!this.activeFile;
      return !!this.activePreviewUrl || !!this.activeFile;
    },
    title() {
      return this.$t(mediaTypeLabelKey(this.type));
    },
    fileMetaLine() {
      const parts = [];
      if (this.activeSize) parts.push(formatBytes(this.activeSize));
      if (this.activeDuration != null) parts.push(formatDuration(this.activeDuration));
      if (this.activeWidth && this.activeHeight) parts.push(`${this.activeWidth}×${this.activeHeight}`);
      const ext = (this.activeFileName || '').split('.').pop();
      if (ext && ext !== this.activeFileName) parts.push(String(ext).toUpperCase());
      return parts.join(' · ');
    },
    estimatedOutput() {
      return this.estimateFor(this.compress);
    },
    qualityChipLabel() {
      const out = this.estimatedOutput;
      if (this.activeType === 'video') {
        return out.label || (this.compress ? '720' : 'HD');
      }
      return this.compress ? (out.label || 'HD') : this.$t('messenger.mediaQualityOriginal');
    },
    sizeDeltaLabel() {
      const before = Number(this.activeSize) || 0;
      const after = Number(this.estimatedOutput?.size) || 0;
      if (!before || !after || after >= before * 0.98) return '';
      const pct = Math.round((1 - after / before) * 100);
      if (pct < 1) return '';
      return `−${pct}%`;
    },
    filters() {
      return PHOTO_FILTERS;
    },
    activeFilterCss() {
      return getPhotoFilter(this.filterId).css;
    },
    aspectOptions() {
      return [
        { id: 'free', label: this.$t('messenger.mediaAspectFree') },
        { id: '1:1', label: '1:1' },
        { id: '4:5', label: '4:5' },
        { id: '16:9', label: '16:9' },
      ];
    },
    aspectRatioValue() {
      if (this.aspectMode === '1:1') return 1;
      if (this.aspectMode === '4:5') return 4 / 5;
      if (this.aspectMode === '16:9') return 16 / 9;
      return NaN;
    },
    trimStartPct() {
      const d = this.videoDuration || 1;
      return Math.max(0, Math.min(100, (this.trimStart / d) * 100));
    },
    trimEndPct() {
      const d = this.videoDuration || 1;
      return Math.max(0, Math.min(100, (this.trimEnd / d) * 100));
    },
    playheadPct() {
      const d = this.videoDuration || 1;
      return Math.max(0, Math.min(100, (this.videoCurrent / d) * 100));
    },
    trimRangeStyle() {
      return {
        left: `${this.trimStartPct}%`,
        width: `${Math.max(0, this.trimEndPct - this.trimStartPct)}%`,
      };
    },
  },
  watch: {
    open(v) {
      if (v) {
        this.resetEditor();
        this.lockBodyScroll();
        // Do NOT auto-focus the caption — keep the soft keyboard closed until
        // the user explicitly taps the field (Telegram mobile behavior).
        this.bindVisualViewport();
        this.captionFocused = false;
      } else {
        this.pauseVideo();
        this.unlockBodyScroll();
        this.unbindVisualViewport();
        this.captionFocused = false;
        this.menuOpen = false;
        this.qualityOpen = false;
        this.askGroupOpen = false;
        this.paintMode = false;
        this.filterMode = false;
      }
    },
    filterId() {
      this.$nextTick(() => this.applyCropperFilter());
    },
    paintMode(v) {
      if (v) {
        this.$nextTick(() => {
          this.onPaintBaseLoad();
          if (typeof ResizeObserver !== 'undefined' && this.$refs.paintStage && !this._paintRo) {
            this._paintRo = new ResizeObserver(() => this.updatePaintFit());
            this._paintRo.observe(this.$refs.paintStage);
          }
        });
      } else if (this._paintRo) {
        try { this._paintRo.disconnect(); } catch (e) { /* noop */ }
        this._paintRo = null;
      }
    },
    muteAudio(v) {
      const el = this.$refs.videoEl;
      if (el) {
        el.muted = !!v;
        el.loop = !!v;
      }
      if (this.activeItem?.type === 'video') this.syncVideoDraft();
    },
  },
  beforeUnmount() {
    this.unbindTrim();
    this.pauseVideo();
    this.unlockBodyScroll();
    this.unbindVisualViewport();
    if (this._paintRo) {
      try { this._paintRo.disconnect(); } catch (e) { /* noop */ }
      this._paintRo = null;
    }
  },
  methods: {
    bindVisualViewport() {
      if (typeof window === 'undefined') return;
      this.unbindVisualViewport();
      this._onVv = () => this.syncVisualViewport();
      const vv = window.visualViewport;
      if (vv) {
        vv.addEventListener('resize', this._onVv);
        vv.addEventListener('scroll', this._onVv);
      }
      window.addEventListener('resize', this._onVv);
      this.syncVisualViewport();
    },
    unbindVisualViewport() {
      if (typeof window === 'undefined') return;
      if (this._onVv) {
        const vv = window.visualViewport;
        if (vv) {
          vv.removeEventListener('resize', this._onVv);
          vv.removeEventListener('scroll', this._onVv);
        }
        window.removeEventListener('resize', this._onVv);
        this._onVv = null;
      }
      this.vvHeight = null;
      this.vvOffsetTop = 0;
      this.keyboardInset = 0;
    },
    syncVisualViewport() {
      if (typeof window === 'undefined') return;
      const vv = window.visualViewport;
      if (!vv) {
        this.vvHeight = Math.round(window.innerHeight);
        this.vvOffsetTop = 0;
        this.keyboardInset = 0;
        return;
      }
      this.vvHeight = Math.max(1, Math.round(vv.height));
      this.vvOffsetTop = Math.max(0, Math.round(vv.offsetTop || 0));
      // Layout viewport minus visible band ≈ soft keyboard + browser chrome.
      this.keyboardInset = Math.max(
        0,
        Math.round(window.innerHeight - vv.height - (vv.offsetTop || 0)),
      );
    },
    onCaptionFocus() {
      this.captionFocused = true;
      this.$nextTick(() => this.syncVisualViewport());
    },
    onCaptionBlur() {
      this.captionFocused = false;
      this.$nextTick(() => this.syncVisualViewport());
    },
    formatDuration,
    formatBytes,
    paintHasEdits,
    fileTileExt(it) {
      const ext = (it?.ext || fileExtension(it?.fileName || '') || 'FILE').toUpperCase();
      return ext.length > 4 ? ext.slice(0, 4) : ext;
    },
    fileTileColor(it) {
      return fileExtColor(it?.ext || fileExtension(it?.fileName || ''));
    },
    sendActiveAsFile() {
      this.menuOpen = false;
      if (!this.activeFile) return;
      const caption = this.caption.trim();
      this.$emit('send', {
        type: 'file',
        file: this.activeFile,
        fileName: this.activeFileName,
        size: this.activeSize,
        duration: null,
        width: null,
        height: null,
        previewUrl: '',
        caption,
        silent: false,
        animation: false,
      });
    },
    estimateFor(compress) {
      const dur = this.activeType === 'video'
        ? (this.videoDuration || this.activeDuration || 0)
        : null;
      return estimateMediaOutput({
        type: this.activeType || this.type,
        originalSize: this.activeSize || 0,
        width: this.activeWidth,
        height: this.activeHeight,
        duration: dur,
        trimStart: this.activeType === 'video' ? this.trimStart : 0,
        trimEnd: this.activeType === 'video' ? this.trimEnd : null,
        compress: !!compress,
      });
    },
    qualityOptionLine(compress) {
      const out = this.estimateFor(compress);
      const parts = [];
      if (out.width && out.height) parts.push(`${out.width}×${out.height}`);
      else if (out.label) parts.push(out.label);
      if (out.duration != null && this.activeType === 'video') {
        parts.push(formatDuration(out.duration));
      }
      return parts.join(' · ');
    },
    pickQuality(compress) {
      this.compress = !!compress;
      this.qualityOpen = false;
    },
    resetEditor() {
      this.caption = '';
      this.busy = false;
      this.exportPct = 0;
      this.busyLabel = '';
      this.menuOpen = false;
      this.qualityOpen = false;
      this.askGroupOpen = false;
      this.pendingSend = false;
      this.compress = true;
      this.groupMode = null;
      this.paintMode = false;
      this.filterMode = false;
      this.paintState = emptyPaintState();
      this.paintTool = 'pen';
      this.dragIndex = null;
      this.paintNatural = { w: 0, h: 0 };
      this.draftItems = this.buildDraftItems();
      this.activeIndex = 0;
      this.loadActiveDraft();
    },
    buildDraftItems() {
      if (Array.isArray(this.items) && this.items.length) {
        return this.items.map((it) => ({
          id: it.id,
          type: it.type,
          file: it.file,
          fileName: it.fileName || it.file?.name || 'media',
          previewUrl: it.previewUrl || '',
          size: it.size || it.file?.size || 0,
          duration: it.duration ?? null,
          width: it.width ?? null,
          height: it.height ?? null,
          selected: it.selected !== false,
          ext: it.ext || fileExtension(it.fileName || it.file?.name || ''),
          draft: {
            ...emptyDraft(),
            trimEnd: Number(it.duration) || 0,
          },
        }));
      }
      if (this.type === 'photo' || this.type === 'video' || this.type === 'file') {
        return [{
          id: 'single',
          type: this.type,
          file: this.file,
          fileName: this.fileName || this.file?.name || (this.type === 'file' ? 'file' : 'media'),
          previewUrl: this.previewUrl || '',
          size: this.size || this.file?.size || 0,
          duration: this.duration,
          width: this.width,
          height: this.height,
          selected: true,
          ext: fileExtension(this.fileName || this.file?.name || ''),
          draft: {
            ...emptyDraft(),
            trimEnd: Number(this.duration) || 0,
          },
        }];
      }
      return [];
    },
    saveActiveDraft() {
      const item = this.draftItems[this.activeIndex];
      if (!item) return;
      const prev = item.draft || emptyDraft();
      const draft = {
        ...prev,
        filterId: this.filterId,
        aspectMode: this.aspectMode,
        rotation: this.rotation,
        muteAudio: this.muteAudio,
        paint: clonePaintState(this.paintState),
      };

      if (item.type === 'photo') {
        // Keep prior crop data if cropper isn't mounted (e.g. mid-switch).
        draft.cropData = prev.cropData || null;
        draft.canvasData = prev.canvasData || null;
        draft.cropBoxData = prev.cropBoxData || null;
        const c = this.getCropper();
        if (c) {
          try {
            draft.cropData = c.getData(true);
            draft.canvasData = c.getCanvasData();
            draft.cropBoxData = c.getCropBoxData();
            // Snapshot for exporting this item later while another item is active.
            const snap = c.getCroppedCanvas({
              maxWidth: 2560,
              maxHeight: 2560,
              imageSmoothingEnabled: true,
              imageSmoothingQuality: 'high',
            });
            if (snap) item.croppedCanvas = snap;
          } catch (e) { /* noop */ }
        }
        // Photo drafts shouldn't clobber video trim fields with zeros.
        draft.trimStart = prev.trimStart || 0;
        draft.trimEnd = prev.trimEnd || 0;
        draft.trimSet = !!prev.trimSet;
      } else if (item.type === 'video') {
        draft.trimStart = this.trimStart;
        draft.trimEnd = this.trimEnd;
        draft.videoDuration = this.videoDuration || prev.videoDuration || Number(item.duration) || 0;
        // Once the user has opened this video, keep trim across switches.
        draft.trimSet = true;
        draft.cropData = null;
        draft.canvasData = null;
        draft.cropBoxData = null;
      }

      item.draft = draft;
    },
    loadActiveDraft() {
      const item = this.draftItems[this.activeIndex];
      const d = { ...emptyDraft(), ...(item?.draft || {}) };
      this.filterId = d.filterId || 'original';
      this.aspectMode = d.aspectMode || 'free';
      this.rotation = Number(d.rotation) || 0;
      this.muteAudio = !!d.muteAudio;
      this.paintState = clonePaintState(d.paint);
      this.paintMode = false;
      this.filterMode = false;
      this.videoPlaying = false;
      this.videoCurrent = 0;

      if (item?.type === 'video') {
        const dur = Number(d.videoDuration) || Number(item.duration) || 0;
        this.videoDuration = dur;
        if (d.trimSet) {
          this.trimStart = Math.max(0, Number(d.trimStart) || 0);
          this.trimEnd = Math.max(this.trimStart + 0.1, Number(d.trimEnd) || dur || 0);
        } else {
          this.trimStart = 0;
          this.trimEnd = dur;
        }
      } else {
        // Don't carry video trim UI state onto photos.
        this.videoDuration = 0;
        this.trimStart = 0;
        this.trimEnd = 0;
      }

      this.cropperKey += 1;
      this.$nextTick(() => {
        const el = this.$refs.videoEl;
        if (el) {
          el.muted = this.muteAudio;
          el.loop = this.muteAudio;
          if (item?.type === 'video' && this.trimStart > 0.05) {
            try { el.currentTime = this.trimStart; } catch (e) { /* noop */ }
          }
        }
      });
    },
    onSelectItem(idx) {
      if (idx === this.activeIndex || this.busy) return;
      this.saveActiveDraft();
      this.pauseVideo();
      this.activeIndex = idx;
      this.loadActiveDraft();
      this.menuOpen = false;
    },
    onThumbDragStart(idx, e) {
      if (this.busy || this.paintMode) {
        e.preventDefault();
        return;
      }
      this.dragIndex = idx;
      try {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(idx));
      } catch (err) { /* noop */ }
    },
    onThumbDragOver(idx) {
      if (this.dragIndex == null || this.dragIndex === idx) return;
      this.dragOverIndex = idx;
      const from = this.dragIndex;
      if (from === idx) return;
      const items = this.draftItems.slice();
      const [moved] = items.splice(from, 1);
      items.splice(idx, 0, moved);
      this.draftItems = items;
      if (this.activeIndex === from) this.activeIndex = idx;
      else if (from < this.activeIndex && idx >= this.activeIndex) this.activeIndex -= 1;
      else if (from > this.activeIndex && idx <= this.activeIndex) this.activeIndex += 1;
      this.dragIndex = idx;
    },
    onThumbDrop(idx) {
      this.onThumbDragOver(idx);
      this.onThumbDragEnd();
    },
    onThumbDragEnd() {
      this.dragIndex = null;
      this.dragOverIndex = null;
    },
    enterPaintMode() {
      if (this.activeType !== 'photo') return;
      this.saveActiveDraft();
      this.filterMode = false;
      this.paintMode = true;
      this.paintTool = 'pen';
      this.menuOpen = false;
      this.qualityOpen = false;
      this.$nextTick(() => this.onPaintBaseLoad());
    },
    onPaintBaseLoad() {
      const img = this.$refs.paintBase;
      if (img && (img.naturalWidth || img.width)) {
        this.paintNatural = {
          w: img.naturalWidth || img.width,
          h: img.naturalHeight || img.height,
        };
      }
      this.updatePaintFit();
      this.$nextTick(() => {
        window.dispatchEvent(new Event('resize'));
      });
    },
    updatePaintFit() {
      const stage = this.$refs.paintStage;
      const nw = this.paintNatural.w || this.activeWidth || 1;
      const nh = this.paintNatural.h || this.activeHeight || 1;
      if (!stage) {
        this.paintFitStyle = { width: '100%', height: '100%', left: '0', top: '0' };
        return;
      }
      const rect = stage.getBoundingClientRect();
      const cw = Math.max(1, rect.width);
      const ch = Math.max(1, rect.height);
      const scale = Math.min(cw / nw, ch / nh);
      const w = Math.max(1, nw * scale);
      const h = Math.max(1, nh * scale);
      this.paintFitStyle = {
        position: 'absolute',
        width: `${w}px`,
        height: `${h}px`,
        left: `${(cw - w) / 2}px`,
        top: `${(ch - h) / 2}px`,
      };
    },
    exitPaintMode() {
      this.paintMode = false;
      if (this.activeItem?.draft) {
        this.activeItem.draft.paint = clonePaintState(this.paintState);
      }
      this.$nextTick(() => this.applyCropperFilter());
    },
    lockBodyScroll() {
      if (typeof document === 'undefined' || this.bodyLock) return;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      this.bodyLock = {
        scrollY,
        htmlOverflow: document.documentElement.style.overflow,
        bodyOverflow: document.body.style.overflow,
        bodyPosition: document.body.style.position,
        bodyTop: document.body.style.top,
        bodyWidth: document.body.style.width,
        bodyTouch: document.body.style.touchAction,
      };
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.touchAction = 'none';
    },
    unlockBodyScroll() {
      if (typeof document === 'undefined' || !this.bodyLock) return;
      const lock = this.bodyLock;
      this.bodyLock = null;
      document.documentElement.style.overflow = lock.htmlOverflow || '';
      document.body.style.overflow = lock.bodyOverflow || '';
      document.body.style.position = lock.bodyPosition || '';
      document.body.style.top = lock.bodyTop || '';
      document.body.style.width = lock.bodyWidth || '';
      document.body.style.touchAction = lock.bodyTouch || '';
      window.scrollTo(0, lock.scrollY || 0);
    },
    onPaintChange(next) {
      this.paintState = next;
      if (this.activeItem?.draft) {
        this.activeItem.draft.paint = clonePaintState(next);
      }
    },
    onPaintUndo() {
      this.paintState = undoPaint(this.paintState);
      this.onPaintChange(this.paintState);
    },
    onPaintRedo() {
      this.paintState = redoPaint(this.paintState);
      this.onPaintChange(this.paintState);
    },
    toggleSelected(idx) {
      const item = this.draftItems[idx];
      if (!item) return;
      const next = !item.selected;
      if (!next && this.selectedCount <= 1) return;
      item.selected = next;
    },
    setCompress(v) {
      this.compress = !!v;
      this.menuOpen = false;
      this.qualityOpen = false;
    },
    setGroupMode(mode) {
      this.groupMode = mode;
      this.menuOpen = false;
    },
    onClose() {
      if (this.busy) return;
      this.pauseVideo();
      this.$emit('close');
    },
    onSendSimple() {
      if (this.draftItems.length > 1) {
        const selected = this.draftItems.filter((i) => i.selected);
        if (!selected.length) return;
        const caption = this.caption.trim();
        this.$emit('send-batch', {
          items: selected.map((it) => ({
            caption,
            type: it.type,
            file: it.file,
            fileName: it.fileName,
            size: it.size,
            duration: it.duration,
            width: it.width,
            height: it.height,
            previewUrl: it.previewUrl || '',
            silent: false,
            animation: false,
          })),
          asAlbum: false,
          caption,
        });
        return;
      }
      const item = this.draftItems[0];
      this.$emit('send', {
        caption: this.caption.trim(),
        type: item?.type || this.type,
        file: item?.file || this.file,
        fileName: item?.fileName || this.fileName,
        size: item?.size ?? this.size,
        duration: item?.duration ?? this.duration,
        width: item?.width ?? this.width,
        height: item?.height ?? this.height,
        previewUrl: item?.previewUrl || this.previewUrl || '',
      });
    },
    restoreCropperState(cropper) {
      const d = this.activeItem?.draft;
      if (!cropper || !d) return;
      const apply = () => {
        try {
          if (d.rotation) cropper.rotateTo(d.rotation);
          if (d.canvasData) cropper.setCanvasData(d.canvasData);
          if (d.cropBoxData) cropper.setCropBoxData(d.cropBoxData);
          else if (d.cropData) cropper.setData(d.cropData);
        } catch (e) { /* noop */ }
      };
      // Cropper layout isn't always final on the first ready tick.
      requestAnimationFrame(() => {
        apply();
        requestAnimationFrame(apply);
      });
    },
    getCropper() {
      const vue = this.$refs.cropper;
      return vue?.cropper || null;
    },
    onCropperReady() {
      const c = this.getCropper();
      if (!c) return;
      const d = this.activeItem?.draft;
      if (d?.cropData || d?.cropBoxData || d?.canvasData) {
        this.restoreCropperState(c);
        this.$nextTick(() => this.applyCropperFilter());
        return;
      }
      if (this.rotation) {
        try { c.rotateTo(this.rotation); } catch (e) { /* noop */ }
      }
      // Initial crop must cover the full image (not the default inset box).
      const applyFull = () => {
        try {
          const canvas = c.getCanvasData();
          if (!canvas || !canvas.width || !canvas.height) return;
          c.setCropBoxData({
            left: canvas.left,
            top: canvas.top,
            width: canvas.width,
            height: canvas.height,
          });
        } catch (e) { /* noop */ }
      };
      requestAnimationFrame(() => {
        applyFull();
        requestAnimationFrame(() => {
          applyFull();
          this.applyCropperFilter();
        });
      });
    },
    /** Cropperjs does not reactively update img-style — push filter onto live imgs. */
    applyCropperFilter() {
      const vue = this.$refs.cropper;
      const root = vue?.$el || vue;
      if (!root || typeof root.querySelectorAll !== 'function') return;
      const css = this.activeFilterCss && this.activeFilterCss !== 'none'
        ? this.activeFilterCss
        : 'none';
      root.querySelectorAll('.cropper-canvas img, .cropper-view-box img, img').forEach((img) => {
        img.style.filter = css;
      });
    },
    setFilter(id) {
      this.filterId = id || 'original';
      if (this.activeItem?.draft) this.activeItem.draft.filterId = this.filterId;
      this.$nextTick(() => this.applyCropperFilter());
    },
    enterFilterMode() {
      if (this.activeType !== 'photo') return;
      this.saveActiveDraft();
      this.paintMode = false;
      this.filterMode = true;
      this.menuOpen = false;
      this.qualityOpen = false;
    },
    exitFilterMode() {
      this.filterMode = false;
      this.$nextTick(() => this.applyCropperFilter());
    },
    setAspect(id) {
      // Aspect change invalidates previous crop box — clear saved crop for this item.
      this.saveActiveDraft();
      const item = this.activeItem;
      if (item?.draft) {
        item.draft.cropData = null;
        item.draft.canvasData = null;
        item.draft.cropBoxData = null;
        item.draft.aspectMode = id;
      }
      this.aspectMode = id;
      this.cropperKey += 1;
    },
    rotate90() {
      this.rotation = (this.rotation + 90) % 360;
      const c = this.getCropper();
      if (c) {
        try { c.rotate(90); } catch (e) { /* noop */ }
      }
      // Keep draft rotation in sync immediately so a quick switch doesn't lose it.
      if (this.activeItem?.draft) this.activeItem.draft.rotation = this.rotation;
    },
    onVideoMeta() {
      const el = this.$refs.videoEl;
      if (!el) return;
      const d = Number(el.duration) || Number(this.activeDuration) || 0;
      if (!Number.isFinite(d) || d <= 0) return;
      this.videoDuration = d;

      const draft = this.activeItem?.draft;
      if (draft?.trimSet) {
        const start = Math.max(0, Math.min(d - 0.2, Number(draft.trimStart) || 0));
        let end = Number(draft.trimEnd);
        if (!Number.isFinite(end) || end <= start) end = d;
        end = Math.min(d, Math.max(start + 0.2, end));
        this.trimStart = start;
        this.trimEnd = end;
        draft.videoDuration = d;
        draft.trimStart = start;
        draft.trimEnd = end;
      } else {
        this.trimStart = 0;
        this.trimEnd = d;
      }

      el.muted = this.muteAudio;
      el.loop = this.muteAudio;
      if (this.trimStart > 0.05) {
        try { el.currentTime = this.trimStart; } catch (e) { /* noop */ }
      }
    },
    onVideoTime() {
      const el = this.$refs.videoEl;
      if (!el) return;
      this.videoCurrent = el.currentTime || 0;
      this.videoPlaying = !el.paused;
      if (!this.muteAudio && el.currentTime >= this.trimEnd - 0.05) {
        el.pause();
        el.currentTime = this.trimStart;
        this.videoPlaying = false;
      }
    },
    toggleVideoPlay() {
      const el = this.$refs.videoEl;
      if (!el) return;
      if (el.paused) {
        if (el.currentTime < this.trimStart || el.currentTime >= this.trimEnd - 0.05) {
          el.currentTime = this.trimStart;
        }
        el.play().catch(() => {});
        this.videoPlaying = true;
      } else {
        el.pause();
        this.videoPlaying = false;
      }
    },
    pauseVideo() {
      const el = this.$refs.videoEl;
      if (el) {
        try { el.pause(); } catch (e) { /* noop */ }
      }
      this.videoPlaying = false;
    },
    setSendFromHere() {
      const el = this.$refs.videoEl;
      const t = el ? el.currentTime : this.videoCurrent;
      this.trimStart = Math.max(0, Math.min((this.trimEnd || this.videoDuration) - 0.2, t));
      this.syncVideoDraft();
    },
    syncVideoDraft() {
      const item = this.activeItem;
      if (!item || item.type !== 'video') return;
      const draft = item.draft || emptyDraft();
      draft.trimStart = this.trimStart;
      draft.trimEnd = this.trimEnd;
      draft.videoDuration = this.videoDuration || Number(item.duration) || 0;
      draft.trimSet = true;
      draft.muteAudio = this.muteAudio;
      item.draft = draft;
    },
    onTrimPointerDown(e) {
      const handle = e.target?.dataset?.handle;
      const track = e.currentTarget;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const pctFromX = (clientX) => {
        const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
        return x / rect.width;
      };
      let mode = handle || 'playhead';
      if (!handle) {
        const p = pctFromX(e.clientX);
        const d = this.videoDuration || 1;
        const t = p * d;
        const mid = (this.trimStart + this.trimEnd) / 2;
        mode = t < mid ? 'start' : 'end';
      }
      const move = (ev) => {
        const d = this.videoDuration || 1;
        const t = pctFromX(ev.clientX) * d;
        if (mode === 'start') {
          this.trimStart = Math.max(0, Math.min(this.trimEnd - 0.2, t));
        } else if (mode === 'end') {
          this.trimEnd = Math.min(d, Math.max(this.trimStart + 0.2, t));
        }
        const el = this.$refs.videoEl;
        if (el && mode !== 'playhead') {
          el.currentTime = mode === 'start' ? this.trimStart : this.trimEnd;
        }
        this.syncVideoDraft();
      };
      const up = () => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        this.trimming = null;
        this.syncVideoDraft();
      };
      this.trimming = mode;
      move(e);
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    },
    unbindTrim() {
      this.trimming = null;
    },
    autoGrowCaption(e) {
      const el = e?.target;
      if (!el) return;
      el.style.height = 'auto';
      el.style.height = `${Math.min(96, el.scrollHeight)}px`;
    },
    photoOpts() {
      return this.compress ? PHOTO_QUALITY_COMPRESSED : PHOTO_QUALITY_ORIGINAL;
    },
    videoOpts() {
      return this.compress ? VIDEO_COMPRESS : VIDEO_ORIGINAL;
    },
    async onSendEdited() {
      if (this.busy || !this.canSend) return;
      this.menuOpen = false;
      if (this.paintMode) this.exitPaintMode();
      if (this.filterMode) this.exitFilterMode();
      this.saveActiveDraft();

      // Album prompt only when multiple photo/video are selected.
      if (this.canAlbum && !this.groupMode) {
        this.askGroupOpen = true;
        this.pendingSend = true;
        return;
      }
      await this.finishSend();
    },
    onGroupModePicked(value) {
      this.askGroupOpen = false;
      if (!value || (value !== 'album' && value !== 'separate')) {
        this.pendingSend = false;
        return;
      }
      this.groupMode = value;
      if (this.pendingSend) {
        this.pendingSend = false;
        this.finishSend();
      }
    },
    onAskGroupClose() {
      this.askGroupOpen = false;
      this.pendingSend = false;
    },
    async finishSend() {
      if (this.busy) return;
      this.busy = true;
      this.exportPct = 0;
      this.pauseVideo();
      try {
        const selected = this.draftItems.filter((i) => i.selected);
        const results = [];
        for (let i = 0; i < selected.length; i += 1) {
          const item = selected[i];
          this.busyLabel = selected.length > 1
            ? this.$t('messenger.mediaProcessingItem', { current: i + 1, total: selected.length })
            : this.$t('messenger.mediaProcessing');
          const isActive = item.id === this.activeItem?.id;
          // Ensure active editor state is on the active item
          if (isActive) this.saveActiveDraft();
          const exported = await this.exportItem(item, isActive);
          results.push(exported);
        }

        const caption = this.caption.trim();
        const visualCount = results.filter((r) => r.type === 'photo' || r.type === 'video').length;
        const asAlbum = visualCount > 1 && this.groupMode !== 'separate';

        if (results.length === 1 && !this.isMulti) {
          this.$emit('send', { ...results[0], caption });
        } else {
          let visualIdx = 0;
          this.$emit('send-batch', {
            items: results.map((r) => {
              const isVisual = r.type === 'photo' || r.type === 'video';
              const cap = isVisual && asAlbum
                ? (visualIdx === 0 ? caption : '')
                : caption;
              if (isVisual) visualIdx += 1;
              return { ...r, caption: cap };
            }),
            asAlbum,
            caption,
          });
        }
      } catch (e) {
        // Fallback: send originals for selected
        const selected = this.draftItems.filter((i) => i.selected);
        const caption = this.caption.trim();
        const visualCount = selected.filter((i) => i.type === 'photo' || i.type === 'video').length;
        const asAlbum = visualCount > 1 && this.groupMode !== 'separate';
        let visualIdx = 0;
        const items = selected.map((it) => {
          const isVisual = it.type === 'photo' || it.type === 'video';
          const cap = isVisual && asAlbum
            ? (visualIdx === 0 ? caption : '')
            : caption;
          if (isVisual) visualIdx += 1;
          return {
            caption: cap,
            type: it.type,
            file: it.file,
            fileName: it.fileName,
            size: it.size,
            duration: it.duration,
            width: it.width,
            height: it.height,
            previewUrl: it.previewUrl,
            silent: !!(it.draft?.muteAudio),
            animation: !!(it.draft?.muteAudio),
          };
        });
        if (items.length === 1 && !this.isMulti) {
          this.$emit('send', items[0]);
        } else {
          this.$emit('send-batch', { items, asAlbum, caption });
        }
      } finally {
        this.busy = false;
        this.exportPct = 0;
        this.busyLabel = '';
      }
    },
    async exportItem(item, isActive) {
      if (item.type === 'file' || item.type === 'audio' || item.type === 'voice') {
        return {
          type: item.type,
          file: item.file,
          fileName: item.fileName,
          size: item.size,
          duration: item.duration,
          width: item.width,
          height: item.height,
          previewUrl: item.previewUrl || '',
          silent: false,
          animation: false,
        };
      }
      const draft = item.draft || emptyDraft();
      if (item.type === 'photo') {
        return this.exportPhotoItem(item, draft, isActive);
      }
      return this.exportVideoItem(item, draft);
    },
    async exportPhotoItem(item, draft, isActive) {
      const opts = this.photoOpts();
      let canvas = null;
      if (isActive && !this.paintMode) {
        const vue = this.$refs.cropper;
        const inst = this.getCropper();
        const getCanvas = vue?.getCroppedCanvas?.bind(vue) || inst?.getCroppedCanvas?.bind(inst);
        if (getCanvas) {
          canvas = getCanvas({
            maxWidth: opts.maxEdge,
            maxHeight: opts.maxEdge,
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high',
          });
        }
      } else if (item.croppedCanvas) {
        canvas = item.croppedCanvas;
      }
      // Crop + filter first (non-destructive paint stays as layers until here).
      let exported = await exportFilteredImage(canvas || item.previewUrl, {
        filterId: draft.filterId || 'original',
        fileName: item.fileName || 'photo.jpg',
        quality: opts.quality,
        maxEdge: opts.maxEdge,
      });
      if (paintHasEdits(draft.paint) && exported?.previewUrl) {
        try {
          const img = await new Promise((resolve, reject) => {
            const el = new Image();
            el.onload = () => resolve(el);
            el.onerror = reject;
            el.src = exported.previewUrl;
          });
          const c = document.createElement('canvas');
          c.width = img.naturalWidth || img.width;
          c.height = img.naturalHeight || img.height;
          c.getContext('2d').drawImage(img, 0, 0);
          const withPaint = applyPaintToCanvas(c, draft.paint) || c;
          exported = await exportFilteredImage(withPaint, {
            filterId: 'original',
            fileName: item.fileName || 'photo.jpg',
            quality: opts.quality,
            maxEdge: opts.maxEdge,
          });
        } catch (e) { /* keep unpainted export */ }
      }
      return {
        type: 'photo',
        file: exported.file,
        fileName: exported.file.name,
        size: exported.file.size,
        duration: null,
        width: exported.width,
        height: exported.height,
        previewUrl: exported.previewUrl,
      };
    },
    async exportVideoItem(item, draft) {
      const silent = !!draft.muteAudio;
      const vOpts = this.videoOpts();
      const needs = videoNeedsProcessing({
        start: draft.trimStart,
        end: draft.trimEnd,
        duration: item.duration || this.videoDuration,
        compress: this.compress,
      });
      let outFile = item.file;
      let outPreview = item.previewUrl;
      let outDuration = Math.max(1, Math.round((draft.trimEnd || item.duration || 1) - (draft.trimStart || 0)));
      let outW = item.width;
      let outH = item.height;

      if (needs && item.previewUrl) {
        const remuxed = await remuxVideoSegment(item.previewUrl, {
          start: draft.trimStart || 0,
          end: draft.trimEnd || item.duration,
          mute: silent,
          fileName: item.fileName || 'video.webm',
          videoBitsPerSecond: vOpts.videoBitsPerSecond,
          maxEdge: vOpts.maxEdge,
          onProgress: (p) => { this.exportPct = p; },
        });
        outFile = remuxed.file;
        outPreview = remuxed.previewUrl;
        outDuration = remuxed.duration;
        outW = remuxed.width;
        outH = remuxed.height;
      }

      return {
        type: 'video',
        file: outFile,
        fileName: outFile?.name || item.fileName,
        size: outFile?.size || item.size,
        duration: outDuration,
        width: outW,
        height: outH,
        previewUrl: outPreview,
        silent,
        animation: silent,
      };
    },
  },
};
</script>

<style scoped>
.mc-fs {
  height: 100%;
  height: 100dvh;
  max-height: 100dvh;
  overflow: hidden;
  overscroll-behavior: none;
  /* Keep page from rubber-banding under the editor on mobile */
  touch-action: manipulation;
  transition: height 0.2s cubic-bezier(0.22, 1, 0.36, 1), top 0.2s cubic-bezier(0.22, 1, 0.36, 1);
}
.mc-fs.is-kb .mc-dock {
  /* Keep caption + send firmly in the visible VV band */
  box-shadow: 0 -12px 28px rgba(0, 0, 0, 0.35);
}
.mc-stage-wrap {
  will-change: transform;
}
.mc-fs > .mc-stage-wrap,
.mc-fs .mc-stage {
  overscroll-behavior: none;
  touch-action: none;
}
.mc-fade-enter-active,
.mc-fade-leave-active {
  transition: opacity 0.2s ease;
}
.mc-fade-enter-from,
.mc-fade-leave-to {
  opacity: 0;
}
.mc-header {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0) 100%);
}
.mc-icon-btn {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #fff;
  transition: background 0.15s ease, transform 0.12s ease;
}
.mc-icon-btn:active {
  transform: scale(0.94);
  background: rgba(255, 255, 255, 0.14);
}
.mc-icon-btn:disabled {
  opacity: 0.4;
}
.mc-send-btn {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3390ec;
  color: #fff;
  transition: background 0.15s ease, transform 0.12s ease, opacity 0.15s ease;
}
.mc-send-btn:hover {
  background: #4ea4f5;
}
.mc-send-btn:active {
  transform: scale(0.94);
}
.mc-send-btn:disabled {
  opacity: 0.4;
}
.mc-quality-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 11px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.01em;
  transition: background 0.15s ease, transform 0.12s ease;
}
.mc-quality-chip:active {
  transform: scale(0.97);
  background: rgba(255, 255, 255, 0.16);
}
.mc-quality-chip:disabled {
  opacity: 0.45;
}
.mc-quality-chip-main {
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.mc-quality-chip-dot {
  width: 2.5px;
  height: 2.5px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.35);
  flex-shrink: 0;
}
.mc-quality-chip-size {
  color: rgba(255, 255, 255, 0.5);
  font-variant-numeric: tabular-nums;
  font-weight: 500;
  white-space: nowrap;
}
.mc-play-fab {
  width: 52px;
  height: 52px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.42);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.14);
  animation: mc-fab-in 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes mc-fab-in {
  from { opacity: 0; transform: scale(0.88); }
  to { opacity: 1; transform: none; }
}
.mc-gif-tag {
  position: absolute;
  top: 14px;
  inset-inline-end: 14px;
  min-height: 20px;
  padding: 0 7px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: rgba(255, 255, 255, 0.9);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
}
.mc-busy-ring {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  background:
    conic-gradient(#3390ec var(--p), rgba(255, 255, 255, 0.12) 0);
  mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2.5px));
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2.5px));
}
.mc-dock {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.72) 28%, #000 100%);
  flex-shrink: 0;
  overflow: hidden;
}
.mc-caption {
  border-radius: 18px;
  padding: 10px 14px;
  font-size: 14px;
  line-height: 1.35;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  caret-color: #6ab2f2;
}
.mc-caption::placeholder {
  color: rgba(255, 255, 255, 0.32);
}
.mc-quality-sheet {
  border-radius: 18px;
  background: rgba(28, 28, 30, 0.94);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.45), inset 0 0 0 1px rgba(255, 255, 255, 0.08);
  animation: mc-sheet-up 0.24s cubic-bezier(0.22, 1, 0.36, 1);
  padding-bottom: 8px;
}
@keyframes mc-sheet-up {
  from { opacity: 0; transform: translateY(14px) scale(0.98); }
  to { opacity: 1; transform: none; }
}
.mc-quality-grab {
  width: 36px;
  height: 4px;
  margin: 10px auto 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
}
.mc-quality-title {
  margin: 0 0 6px;
  padding: 0 16px 4px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.4);
}
.mc-quality-row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: calc(100% - 16px);
  margin: 0 8px;
  padding: 12px 12px;
  border-radius: 14px;
  text-align: start;
  transition: background 0.14s ease;
}
.mc-quality-row:active,
.mc-quality-row.on {
  background: rgba(51, 144, 236, 0.12);
}
.mc-quality-radio {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 1.8px solid rgba(255, 255, 255, 0.28);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color 0.14s ease, background 0.14s ease;
}
.mc-quality-radio.on {
  border-color: #3390ec;
  background: #3390ec;
  box-shadow: inset 0 0 0 3.5px rgba(28, 28, 30, 0.95);
}
.mc-quality-name {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
}
.mc-quality-meta {
  display: block;
  margin-top: 2px;
  font-size: 11.5px;
  color: rgba(255, 255, 255, 0.4);
  font-variant-numeric: tabular-nums;
}
.mc-quality-size {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.62);
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}
.mc-quality-delta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 4px 16px 8px;
  padding: 8px 10px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  font-size: 11px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.4);
  font-variant-numeric: tabular-nums;
}
.mc-quality-delta-arrow {
  color: rgba(255, 255, 255, 0.28);
  font-size: 11px;
  line-height: 1;
  flex-shrink: 0;
}
.mc-quality-delta-after {
  color: #6ab2f2;
  font-weight: 600;
}
.mc-quality-delta-pct {
  margin-inline-start: 2px;
  padding: 2px 6px;
  border-radius: 999px;
  background: rgba(51, 144, 236, 0.16);
  color: #6ab2f2;
  font-size: 10px;
  font-weight: 700;
}
.mc-strip {
  display: flex;
  gap: 7px;
  overflow-x: auto;
  padding: 2px 4px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.mc-strip::-webkit-scrollbar {
  display: none;
}
.mc-thumb {
  position: relative;
  flex: 0 0 auto;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.14);
  transition: box-shadow 0.15s ease, opacity 0.15s ease, transform 0.12s ease;
}
.mc-thumb.active {
  box-shadow: inset 0 0 0 2px #3390ec;
}
.mc-thumb.unchecked {
  opacity: 0.4;
}
.mc-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  background: #1a1a1a;
}
.mc-thumb-file {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.02em;
}
.mc-check {
  position: absolute;
  top: 3px;
  inset-inline-end: 3px;
  width: 14px;
  height: 14px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  border: 1.4px solid rgba(255, 255, 255, 0.8);
  color: #fff;
}
.mc-check.on {
  background: #3390ec;
  border-color: #3390ec;
}
.mc-thumb.dragging {
  opacity: 0.55;
  transform: scale(0.92);
}
.mc-thumb-dur {
  position: absolute;
  bottom: 2px;
  inset-inline-start: 2px;
  padding: 0 3px;
  min-height: 12px;
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 8px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 12px;
  letter-spacing: 0.01em;
}
.mc-thumb-edit {
  position: absolute;
  bottom: 2px;
  inset-inline-end: 2px;
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background: rgba(51, 144, 236, 0.9);
  color: #fff;
  font-size: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mc-thumb-vid {
  position: absolute;
  bottom: 3px;
  inset-inline-start: 3px;
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.mc-paint-stage {
  overflow: hidden;
  overscroll-behavior: none;
  touch-action: none;
}
.mc-paint-fit {
  position: absolute;
  overflow: hidden;
}
.mc-paint-base {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: fill;
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
}
.mc-filter-stage {
  overflow: hidden;
  overscroll-behavior: none;
  touch-action: none;
}
.mc-filter-preview {
  display: block;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
}
.mc-color {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  border: 2px solid transparent;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.25);
  transition: transform 0.12s ease, border-color 0.12s ease;
}
.mc-color.on {
  border-color: #fff;
  transform: scale(1.12);
}
.mc-thick {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.mc-thick.on {
  background: rgba(255, 255, 255, 0.14);
}
.mc-thick-dot {
  border-radius: 999px;
  background: currentColor;
  display: block;
}
.mc-emoji-row {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  padding: 2px 4px;
  scrollbar-width: none;
  max-width: 100%;
}
.mc-emoji-row::-webkit-scrollbar { display: none; }
.mc-emoji {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  font-size: 18px;
  flex-shrink: 0;
  line-height: 1;
}
.mc-emoji.on {
  background: rgba(255, 255, 255, 0.14);
}
.mc-menu {
  position: absolute;
  top: calc(100% + 6px);
  inset-inline-end: 0;
  min-width: 13rem;
  padding: 5px;
  border-radius: 14px;
  background: rgba(28, 28, 30, 0.94);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.45), inset 0 0 0 1px rgba(255, 255, 255, 0.08);
  z-index: 30;
}
.mc-menu-enter-active,
.mc-menu-leave-active {
  transition: opacity 0.14s ease, transform 0.14s ease;
}
.mc-menu-enter-from,
.mc-menu-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
.mc-menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  text-align: start;
  transition: background 0.12s ease;
}
.mc-menu-item:hover,
.mc-menu-item:active {
  background: rgba(255, 255, 255, 0.08);
}
.mc-menu-check {
  width: 16px;
  height: 16px;
  border-radius: 999px;
  border: 1.4px solid rgba(255, 255, 255, 0.32);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.mc-menu-check.on {
  background: #3390ec;
  border-color: #3390ec;
  color: #fff;
}
.mc-stage :deep(.cropper-container),
.mc-stage :deep(.cropper-wrap-box),
.mc-stage :deep(.cropper-canvas),
.mc-stage :deep(.cropper-drag-box) {
  background: #000 !important;
}
.mc-stage :deep(.cropper-view-box),
.mc-stage :deep(.cropper-face) {
  border-radius: 2px;
}
.mc-tool {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: rgba(255, 255, 255, 0.72);
  transition: background 0.15s ease, color 0.15s ease, transform 0.12s ease;
}
.mc-tool:active {
  transform: scale(0.94);
}
.mc-tool.active {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}
.mc-tool-sep {
  width: 1px;
  height: 14px;
  margin: 0 4px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 999px;
}
.mc-aspect {
  display: block;
  border: 1.5px solid currentColor;
  border-radius: 2px;
  opacity: 0.95;
}
.mc-aspect[data-ratio='free'] {
  width: 13px;
  height: 13px;
  border-style: dashed;
}
.mc-aspect[data-ratio='1:1'] {
  width: 12px;
  height: 12px;
}
.mc-aspect[data-ratio='4:5'] {
  width: 10px;
  height: 13px;
}
.mc-aspect[data-ratio='16:9'] {
  width: 15px;
  height: 9px;
}
.mc-filters {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 1px 2px 2px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.mc-filters::-webkit-scrollbar {
  display: none;
}
.mc-filter {
  flex: 0 0 auto;
  padding: 0;
  background: transparent;
}
.mc-filter-thumb {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 11px;
  background-size: cover;
  background-position: center;
  background-color: #1a1a1a;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}
.mc-filter:active .mc-filter-thumb {
  transform: scale(0.94);
}
.mc-filter.active .mc-filter-thumb {
  box-shadow: inset 0 0 0 2px #3390ec;
}
.mc-filter-label {
  display: block;
  margin-top: 4px;
  max-width: 44px;
  text-align: center;
  font-size: 9px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.45);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mc-filter.active .mc-filter-label {
  color: #fff;
}
.mc-trim-wrap {
  padding: 0 2px;
}
.mc-trim-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.38);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
}
.mc-trim-len {
  color: rgba(255, 255, 255, 0.55);
  font-weight: 600;
}
.mc-trim {
  position: relative;
  height: 26px;
  touch-action: none;
  user-select: none;
  padding-inline: 6px;
}
.mc-trim-track {
  position: absolute;
  inset-inline: 6px;
  top: 50%;
  height: 2.5px;
  margin-top: -1.25px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
}
.mc-trim-range {
  position: absolute;
  top: 50%;
  height: 2.5px;
  margin-top: -1.25px;
  margin-inline-start: 6px;
  border-radius: 999px;
  background: #3390ec;
}
.mc-trim-handle {
  position: absolute;
  top: 50%;
  width: 2.5px;
  height: 16px;
  transform: translate(-50%, -50%);
  border-radius: 2px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
  cursor: ew-resize;
  z-index: 3;
}
.mc-trim-handle::before {
  content: '';
  position: absolute;
  inset: -10px -12px;
}
.mc-trim-playhead {
  position: absolute;
  top: 50%;
  width: 1.5px;
  height: 14px;
  transform: translate(-50%, -50%);
  border-radius: 1px;
  background: rgba(251, 191, 36, 0.9);
  pointer-events: none;
  z-index: 2;
}
</style>
