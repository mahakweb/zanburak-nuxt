<template>
  <div
    class="messenger-emoji-picker relative flex flex-col h-full min-h-0 bg-white dark:bg-[#17212b]"
    :class="{
      'messenger-emoji-picker--mobile': mobile,
      'messenger-emoji-picker--sidebar': isSidebar,
      'messenger-emoji-picker--has-tabs': mode === 'emoji' || (mode === 'stickers' && !packViewId),
    }"
    dir="ltr"
  >
    <!-- ===== EMOJI (kept mounted after first visit — mode switch stays instant) ===== -->
    <div v-if="mountedModes.emoji" v-show="mode === 'emoji'" class="messenger-emoji-picker__mode-pane flex flex-col flex-1 min-h-0">
      <!-- Glass category tabs (Telegram-style floating bar) -->
      <div class="messenger-emoji-picker__tabs-shell">
        <div
          ref="tabs"
          class="messenger-emoji-picker__tabs flex items-stretch"
          :class="{ 'messenger-emoji-picker__tabs--mobile': mobile }"
          role="tablist"
          @pointerdown="onTabsPointerDown"
          @pointermove="onTabsPointerMove"
          @pointerup="onTabsPointerUp"
          @pointercancel="onTabsPointerUp"
        >
          <button
            v-for="cat in categories"
            :key="cat"
            type="button"
            role="tab"
            :aria-selected="activeCategory === cat"
            class="messenger-emoji-picker__tab flex-none flex items-center justify-center relative transition-colors"
            :class="activeCategory === cat
              ? 'is-active text-[#3390ec] dark:text-[#6ab2f2]'
              : 'text-[#707579] dark:text-[#8b98a5] hover:text-[#3390ec]/80 dark:hover:text-[#6ab2f2]/80'"
            :title="categoryLabel(cat)"
            @pointerdown.prevent
            @mouseenter="onCatHover(cat, $event)"
            @mouseleave="onCatHoverLeave"
            @click.stop.prevent="selectCategory(cat)"
          >
            <span class="messenger-emoji-picker__tab-icon select-none" aria-hidden="true">{{ iconFor(cat) }}</span>
            <span
              v-if="activeCategory === cat"
              class="messenger-emoji-picker__tab-indicator"
            />
            <transition name="cat-tip">
              <span
                v-if="!mobile && hoverCat === cat"
                class="messenger-emoji-picker__cat-tip"
                aria-hidden="true"
              >{{ categoryLabel(cat) }}</span>
            </transition>
          </button>
        </div>
      </div>

      <div
        ref="grid"
        class="messenger-emoji-picker__grid flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain"
        @scroll.passive="onEmojiScroll"
      >
        <!-- Progressive category mount: first paint is light; rest reveal on scroll / tab. -->
        <section
          v-for="cat in renderedCategories"
          :key="`sec-${cat}`"
          :data-emoji-cat="cat"
          class="messenger-emoji-picker__section"
        >
          <h4 class="messenger-emoji-picker__section-title">{{ categoryLabel(cat) }}</h4>
          <div class="messenger-emoji-picker__cells">
            <button
              v-for="(emoji, index) in emojisForCategory(cat)"
              :key="index"
              type="button"
              class="messenger-emoji-picker__cell"
              :aria-label="emoji"
              @pointerdown.prevent
              @click.stop.prevent="pick(emoji)"
            >
              {{ emoji }}
            </button>
          </div>
        </section>
        <div
          v-if="emojiRevealCount < categories.length"
          ref="emojiRevealSentinel"
          class="messenger-emoji-picker__reveal-sentinel"
          aria-hidden="true"
        />
      </div>
    </div>

    <!-- ===== GIF ===== -->
    <div v-if="mountedModes.gif" v-show="mode === 'gif'" class="messenger-emoji-picker__mode-pane flex flex-col flex-1 min-h-0">
      <div class="messenger-emoji-picker__gif-toolbar flex-shrink-0 flex items-center gap-2 px-2 py-1.5">
        <div class="messenger-emoji-picker__search flex-1 min-w-0 flex items-center gap-1.5 rounded-xl bg-[#f1f3f5] dark:bg-[#0e1621] px-2.5 h-9">
          <svg class="w-4 h-4 text-[#707579] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path stroke-linecap="round" d="M20 20l-3-3" />
          </svg>
          <input
            v-model="gifQuery"
            type="search"
            class="flex-1 min-w-0 bg-transparent text-[13px] text-gray-800 dark:text-gray-100 outline-none placeholder:text-[#8b98a5]"
            :placeholder="gifSearchPlaceholder"
            autocomplete="off"
            @pointerdown.stop
          >
        </div>
        <button
          type="button"
          class="messenger-emoji-picker__gif-add flex-shrink-0 h-9 px-2.5 rounded-xl text-[12px] font-semibold text-[#3390ec] dark:text-[#6ab2f2] bg-[#3390ec]/10 hover:bg-[#3390ec]/15"
          @pointerdown.prevent
          @click.stop.prevent="openGifFilePicker"
        >
          {{ gifAddLabel }}
        </button>
        <input
          ref="gifFileInput"
          type="file"
          accept="image/gif,image/webp,video/mp4,video/webm,.gif,.webp,.mp4,.webm"
          class="hidden"
          multiple
          @change="onGifFilePicked"
        >
      </div>

      <div
        ref="gifGrid"
        class="messenger-emoji-picker__grid flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain px-1.5"
        @scroll.passive="onGifScroll"
      >
        <div v-if="gifBooting && !visibleGifs.length" class="messenger-emoji-picker__gif-grid">
          <div v-for="n in 9" :key="'sk'+n" class="messenger-emoji-picker__gif-cell is-skel" />
        </div>
        <div v-else-if="!filteredGifMeta.length" class="messenger-emoji-picker__empty">
          <p class="text-[13px] font-medium text-gray-700 dark:text-gray-200">{{ gifEmptyTitle }}</p>
          <p class="text-[12px] text-[#8b98a5] mt-1 leading-relaxed">{{ gifEmptyHint }}</p>
        </div>
        <div v-else class="messenger-emoji-picker__gif-grid">
          <div
            v-for="g in visibleGifs"
            :key="g.id"
            class="messenger-emoji-picker__gif-cell"
            :class="{ 'is-skel': !g.previewUrl }"
            role="button"
            tabindex="0"
            :aria-label="g.name || 'GIF'"
            @pointerdown.prevent="onGifPointerDown(g, $event)"
            @pointerup="onGifPointerUp"
            @pointercancel="onGifPointerUp"
            @pointerleave="onGifPointerUp"
            @click="onGifClick(g)"
            @keydown.enter.prevent="onGifClick(g)"
            @keydown.space.prevent="onGifClick(g)"
          >
            <video
              v-if="g.previewUrl && g.isVideo"
              :src="g.previewUrl"
              class="messenger-emoji-picker__gif-img"
              muted
              loop
              playsinline
              autoplay
            />
            <img
              v-else-if="g.previewUrl"
              :src="g.previewUrl"
              alt=""
              class="messenger-emoji-picker__gif-img"
              loading="lazy"
            >
            <span class="messenger-emoji-picker__gif-badge">GIF</span>
            <button
              type="button"
              class="messenger-emoji-picker__gif-remove"
              :title="gifRemoveLabel"
              :aria-label="gifRemoveLabel"
              @pointerdown.stop.prevent
              @click.stop.prevent="removeGif(g)"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true">
                <path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <div v-if="gifLoadingMore" class="messenger-emoji-picker__gif-cell is-skel" />
          <div v-if="gifLoadingMore" class="messenger-emoji-picker__gif-cell is-skel" />
          <div v-if="gifLoadingMore" class="messenger-emoji-picker__gif-cell is-skel" />
        </div>
      </div>
    </div>

    <!-- ===== STICKERS (kept mounted after first visit) ===== -->
    <div v-if="mountedModes.stickers" v-show="mode === 'stickers'" class="messenger-emoji-picker__mode-pane flex flex-col flex-1 min-h-0">
      <template v-if="packViewId">
        <div class="messenger-emoji-picker__pack-bar flex-shrink-0 flex items-center gap-1.5 px-2 py-1 border-b border-black/5 dark:border-white/10">
          <span class="text-[18px] leading-none flex-shrink-0" aria-hidden="true">{{ packViewIcon }}</span>
          <span class="text-[13px] font-semibold text-gray-800 dark:text-gray-100 truncate flex-1 min-w-0">{{ packViewTitle }}</span>
          <button
            v-if="packViewCanEditIcon"
            type="button"
            class="text-[11px] font-semibold text-[#3390ec] px-1.5 py-1 rounded-lg hover:bg-[#3390ec]/10 flex-shrink-0"
            @pointerdown.prevent
            @click.stop.prevent="pickPackIcon"
          >
            {{ setIconLabel }}
          </button>
          <button
            v-if="packViewCanDelete"
            type="button"
            class="text-[11px] font-semibold text-red-500 px-1.5 py-1 rounded-lg hover:bg-red-500/10 flex-shrink-0"
            @pointerdown.prevent
            @click.stop.prevent="deleteCurrentPack"
          >
            {{ deletePackLabel }}
          </button>
          <button
            type="button"
            class="messenger-emoji-picker__pack-back flex-shrink-0"
            :aria-label="$t('messenger.back') !== 'messenger.back' ? $t('messenger.back') : 'Back'"
            @pointerdown.prevent
            @click.stop.prevent="closePackView"
          >
            <svg
              class="messenger-emoji-picker__pack-back-icon"
              :class="isRtl ? 'is-rtl' : 'is-ltr'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.4"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        <div class="messenger-emoji-picker__grid flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain">
          <div class="messenger-emoji-picker__sticker-cells">
            <button
              v-if="packViewCanAdd"
              type="button"
              class="messenger-emoji-picker__sticker-cell messenger-emoji-picker__sticker-add"
              :aria-label="addStickerLabel"
              @pointerdown.prevent
              @click.stop.prevent="addStickerToCurrentPack"
            >
              <span class="messenger-emoji-picker__sticker-add-ring" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path stroke-linecap="round" d="M12 7v10M7 12h10" />
                </svg>
              </span>
            </button>
            <button
              v-for="st in packViewStickers"
              :key="st.id"
              type="button"
              class="messenger-emoji-picker__sticker-cell"
              @pointerdown.prevent="onStickerPointerDown(st, $event)"
              @pointerup="onStickerPointerUp"
              @pointerleave="onStickerPointerUp"
              @pointercancel="onStickerPointerUp"
              @click="onStickerClick(st)"
            >
              <img v-if="st.kind === 'image' && st.src" :src="st.src" alt="" class="messenger-emoji-picker__sticker-img">
              <span v-else class="messenger-emoji-picker__sticker-emoji">{{ st.emoji }}</span>
              <span v-if="st.emoji" class="messenger-emoji-picker__sticker-assoc" aria-hidden="true">{{ st.emoji }}</span>
            </button>
          </div>
        </div>
      </template>

      <template v-else>
        <!-- Glass pack tabs -->
        <div class="messenger-emoji-picker__tabs-shell">
          <div
            ref="stickerTabs"
            class="messenger-emoji-picker__tabs messenger-emoji-picker__sticker-tabs flex items-stretch"
            :class="{ 'messenger-emoji-picker__tabs--mobile': mobile }"
            role="tablist"
            @pointerdown="onStickerTabsPointerDown"
            @pointermove="onStickerTabsPointerMove"
            @pointerup="onStickerTabsPointerUp"
            @pointercancel="onStickerTabsPointerUp"
          >
            <button
              type="button"
              role="tab"
              :aria-selected="activePackId === 'recent'"
              class="messenger-emoji-picker__tab messenger-emoji-picker__sticker-tab flex-none flex items-center justify-center relative"
              :class="activePackId === 'recent' ? 'is-active' : ''"
              :title="recentStickersLabel"
              @pointerdown.prevent
              @click.stop.prevent="selectPack('recent')"
            >
              <img
                v-if="recentTabThumb?.kind === 'image'"
                :src="recentTabThumb.value"
                alt=""
                class="messenger-emoji-picker__sticker-tab-thumb"
                draggable="false"
              >
              <span
                v-else
                class="messenger-emoji-picker__sticker-tab-emoji"
                aria-hidden="true"
              >{{ recentTabThumb?.value || '🕒' }}</span>
              <span
                v-if="activePackId === 'recent'"
                class="messenger-emoji-picker__tab-indicator"
              />
            </button>
            <button
              v-for="pack in stickerPacks"
              :key="pack.id"
              type="button"
              role="tab"
              :aria-selected="activePackId === pack.id"
              class="messenger-emoji-picker__tab messenger-emoji-picker__sticker-tab flex-none flex items-center justify-center relative"
              :class="activePackId === pack.id ? 'is-active' : ''"
              :title="packTitle(pack)"
              @pointerdown.prevent
              @click.stop.prevent="selectPack(pack.id)"
            >
              <img
                v-if="stickerTabThumbMap[pack.id]?.kind === 'image'"
                :src="stickerTabThumbMap[pack.id].value"
                alt=""
                class="messenger-emoji-picker__sticker-tab-thumb"
                draggable="false"
              >
              <span
                v-else
                class="messenger-emoji-picker__sticker-tab-emoji"
                aria-hidden="true"
              >{{ stickerTabThumbMap[pack.id]?.value || '⭐' }}</span>
              <span
                v-if="activePackId === pack.id"
                class="messenger-emoji-picker__tab-indicator"
              />
            </button>
            <button
              type="button"
              class="messenger-emoji-picker__tab messenger-emoji-picker__sticker-tab flex-none flex items-center justify-center text-[#707579] dark:text-[#8b98a5]"
              :title="addStickerLabel"
              @pointerdown.prevent
              @click.stop.prevent="$emit('compose-stickers')"
            >
              <svg class="messenger-emoji-picker__sticker-tab-add" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>
        </div>

        <div
          ref="stickerGrid"
          class="messenger-emoji-picker__grid flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain"
        >
          <section
            v-for="sec in stickerSections"
            :key="`stk-${sec.id}`"
            :data-sticker-pack="sec.id"
            class="messenger-emoji-picker__section"
          >
            <h4 class="messenger-emoji-picker__section-title">{{ sec.title }}</h4>
            <div v-if="!sec.stickers.length && sec.id === 'recent'" class="messenger-emoji-picker__empty px-3 pb-3">
              <p class="text-[13px] font-medium text-gray-700 dark:text-gray-200">{{ stickerEmptyTitle }}</p>
              <p class="text-[12px] text-[#8b98a5] mt-1">{{ stickerEmptyHint }}</p>
            </div>
            <div v-else-if="sec.stickers.length" class="messenger-emoji-picker__sticker-cells">
              <button
                v-for="st in sec.stickers"
                :key="st.id"
                type="button"
                class="messenger-emoji-picker__sticker-cell"
                :aria-label="st.emoji || 'sticker'"
                @pointerdown.prevent="onStickerPointerDown(st, $event)"
                @pointerup="onStickerPointerUp"
                @pointerleave="onStickerPointerUp"
                @pointercancel="onStickerPointerUp"
                @click="onStickerClick(st)"
              >
                <img v-if="st.kind === 'image' && st.src" :src="st.src" alt="" class="messenger-emoji-picker__sticker-img">
                <span v-else class="messenger-emoji-picker__sticker-emoji">{{ st.emoji }}</span>
              </button>
            </div>
          </section>
        </div>
      </template>
    </div>

    <!-- Hold preview is shared by GIF + stickers; keep outside mode panes. -->
    <teleport to="body">
      <transition name="stk-hold">
        <div
          v-if="holdOverlay"
          class="stk-hold-root fixed inset-0 z-[2000000500] flex flex-col items-center justify-center"
          data-sticker-hold-overlay
          @click.self="closeHoldOverlay"
          @pointerdown.self="closeHoldOverlay"
        >
          <div class="stk-hold-preview" @click.stop @pointerdown.stop>
            <video
              v-if="holdOverlay.type === 'gif' && holdOverlay.previewUrl && holdOverlay.isVideo"
              :src="holdOverlay.previewUrl"
              class="stk-hold-gif"
              muted
              loop
              playsinline
              autoplay
            />
            <img
              v-else-if="holdOverlay.type === 'gif' && holdOverlay.previewUrl"
              :src="holdOverlay.previewUrl"
              alt=""
              class="stk-hold-gif"
            >
            <img v-else-if="holdOverlay.kind === 'image' && holdOverlay.src" :src="holdOverlay.src" alt="" class="stk-hold-img">
            <span v-else class="stk-hold-emoji">{{ holdOverlay.emoji }}</span>
          </div>
          <div class="stk-hold-actions" @click.stop @pointerdown.stop>
            <button
              type="button"
              class="stk-hold-btn"
              :title="sendLabel"
              :aria-label="sendLabel"
              @pointerdown.stop
              @click.stop="holdSend"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
            <button
              v-if="holdOverlay.type !== 'gif'"
              type="button"
              class="stk-hold-btn"
              :title="showPackLabel"
              :aria-label="showPackLabel"
              @pointerdown.stop
              @click.stop="holdShowPack"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </button>
            <button
              v-if="holdOverlay.type !== 'gif' && (holdOverlay.packCustom || holdOverlay.kind === 'image')"
              type="button"
              class="stk-hold-btn"
              :title="editLabel"
              :aria-label="editLabel"
              @pointerdown.stop
              @click.stop="holdEdit"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
            </button>
            <button
              v-if="holdOverlay.type === 'gif' || holdOverlay.packCustom"
              type="button"
              class="stk-hold-btn is-danger"
              :title="holdOverlay.type === 'gif' ? gifRemoveLabel : deleteStickerLabel"
              :aria-label="holdOverlay.type === 'gif' ? gifRemoveLabel : deleteStickerLabel"
              @pointerdown.stop
              @click.stop="holdDelete"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
              </svg>
            </button>
            <button
              v-if="holdOverlay.type !== 'gif' && holdOverlay.packCustom"
              type="button"
              class="stk-hold-btn"
              :title="setEmojiLabel"
              :aria-label="setEmojiLabel"
              @pointerdown.stop
              @click.stop="holdSetEmoji"
            >
              <span class="text-lg leading-none">😊</span>
            </button>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- Sidebar bottom bar (Telegram Web) -->
    <div v-if="isSidebar" class="messenger-emoji-picker__bottom-bar">
      <button
        v-if="mode === 'stickers'"
        type="button"
        class="messenger-emoji-picker__settings-btn"
        :title="settingsLabel"
        :aria-label="settingsLabel"
        @pointerdown.prevent
        @click.stop.prevent="openStickerSettings"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>
      <span v-else class="messenger-emoji-picker__bottom-spacer" aria-hidden="true" />
      <div class="messenger-emoji-picker__bottom-tabs" role="tablist">
        <button
          v-for="m in modes"
          :key="m.id"
          type="button"
          role="tab"
          class="messenger-emoji-picker__bottom-tab"
          :class="{ 'is-active': mode === m.id }"
          :aria-selected="mode === m.id"
          @pointerdown.prevent
          @click.stop.prevent="setMode(m.id)"
        >
          {{ m.label }}
        </button>
      </div>
      <span class="messenger-emoji-picker__bottom-spacer" aria-hidden="true" />
    </div>

    <!-- Bottom glass dock: floats over content (Telegram) — width hug, centered -->
    <div v-else class="messenger-emoji-picker__dock">
      <button
        v-if="mode === 'stickers'"
        type="button"
        class="messenger-emoji-picker__settings-pill"
        :title="settingsLabel"
        :aria-label="settingsLabel"
        @pointerdown.prevent
        @click.stop.prevent="openStickerSettings"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>
      <div class="messenger-emoji-picker__mode-pill" role="tablist">
        <button
          v-for="m in modes"
          :key="m.id"
          type="button"
          role="tab"
          class="messenger-emoji-picker__mode-chip"
          :class="{ 'is-active': mode === m.id }"
          :aria-selected="mode === m.id"
          @pointerdown.prevent
          @click.stop.prevent="setMode(m.id)"
        >
          {{ m.label }}
        </button>
      </div>
    </div>

    <StickerSettingsSheet
      :open="stickerSettingsOpen"
      @close="stickerSettingsOpen = false"
      @changed="onStickerSettingsChanged"
    />
  </div>
</template>

<script>
import emojiData from '@/views/components/emoji/emojis-data.json';
import {
  hydrateGifPreviews,
  listSavedGifMeta,
  listRecentStickers,
  pushRecentSticker,
  addGifToLibrary,
  removeGifFromLibrary,
  GIF_PAGE_SIZE,
} from './stickerGifLibrary';
import {
  getAllStickerPacks,
  findStickerById,
  findPackById,
  deleteCustomPack,
  removeCustomSticker,
  setPackIcon,
  setStickerEmoji,
  mergeServerPacks,
  packTitleLocalized,
  isBuiltinEmojiSticker,
} from './stickerPacks';
import { listStickerPacks, deleteStickerApi, updateStickerPackApi, updateStickerApi } from '@/services/messenger';
import StickerSettingsSheet from './StickerSettingsSheet.vue';

const CATEGORY_ORDER = [
  'Frequently used', 'Smileys', 'People', 'Nature', 'Foods', 'Activity',
  'Places', 'Objects', 'Symbols', 'Flags',
];

const CATEGORY_ICONS = {
  'Frequently used': '🕒',
  Smileys: '😀',
  People: '👋',
  Nature: '🐶',
  Foods: '🍔',
  Activity: '⚽',
  Places: '✈️',
  Objects: '💡',
  Symbols: '❤️',
  Flags: '🏳️',
};

const RECENT_KEY = 'messenger-recent-emojis';
const MAX_RECENT = 32;
const HOLD_MS = 420;
const SKIN_TONE_RE = /\uD83C[\uDFFB-\uDFFF]/;
const SKIN_TONE_KEY_RE = /_1f3f[b-f]$/i;
const ZWJ = '\u200D';

/** Base emoji only — skip skin-tone clones and multi-person ZWJ (old Android draws 3 glyphs as 1 cell). */
function isGridEmoji(key, value) {
  if (SKIN_TONE_KEY_RE.test(String(key))) return false;
  const s = String(value || '');
  if (!s) return false;
  if (SKIN_TONE_RE.test(s)) return false;
  let zwj = 0;
  for (let i = 0; i < s.length; i += 1) {
    if (s[i] === ZWJ) zwj += 1;
  }
  if (zwj >= 2) return false;
  return true;
}

function buildGridEmojis(raw) {
  const out = Object.create(null);
  Object.keys(raw || {}).forEach((cat) => {
    const src = raw[cat] || {};
    const next = {};
    Object.keys(src).forEach((key) => {
      const val = src[key];
      if (isGridEmoji(key, val)) next[key] = val;
    });
    out[cat] = next;
  });
  return out;
}

const GRID_EMOJI = buildGridEmojis(emojiData);

/** Stable per-category arrays — avoid Object.values() on every render. */
const EMPTY_EMOJI_LIST = Object.freeze([]);
const GRID_EMOJI_LISTS = Object.create(null);
Object.keys(GRID_EMOJI).forEach((cat) => {
  GRID_EMOJI_LISTS[cat] = Object.freeze(Object.values(GRID_EMOJI[cat] || {}));
});
const FREQUENT_BASE = GRID_EMOJI_LISTS['Frequently used'] || EMPTY_EMOJI_LIST;
/** First paint: tabs + Smileys (+ frequent). Rest reveal progressively. */
const EMOJI_REVEAL_INITIAL = 2;
const EMOJI_REVEAL_STEP = 2;

export default {
  name: 'MessengerEmojiPicker',
  components: { StickerSettingsSheet },
  props: {
    mobile: { type: Boolean, default: false },
    /** popover | sidebar | mobile */
    variant: { type: String, default: 'popover' },
    /** Alias for variant === 'sidebar' */
    sidebar: { type: Boolean, default: false },
    /** When true, settings open is delegated to parent (hover popover must not unmount sheet). */
    externalSettings: { type: Boolean, default: false },
    initialMode: { type: String, default: 'emoji' },
  },
  emits: ['select', 'backspace', 'send-gif', 'send-sticker', 'compose-stickers', 'edit-sticker', 'mode-change', 'open-sticker-settings', 'sticker-packs-changed'],
  data() {
    const mode = ['emoji', 'gif', 'stickers'].includes(this.initialMode) ? this.initialMode : 'emoji';
    return {
      mode,
      /** Keep visited mode panes mounted so Emoji↔Sticker↔GIF does not rebuild ~1.8k nodes. */
      mountedModes: {
        emoji: mode === 'emoji',
        gif: mode === 'gif',
        stickers: mode === 'stickers',
      },
      activeCategory: 'Smileys',
      recentEmojis: [],
      /** How many emoji categories are currently in the DOM. */
      emojiRevealCount: EMOJI_REVEAL_INITIAL,
      emojiRevealObserver: null,
      emojiRevealRaf: 0,
      tabDrag: null,
      suppressTabClick: false,
      stickerTabDrag: null,
      suppressStickerTabClick: false,
      gifQuery: '',
      gifMetaAll: [],
      gifHydrated: {},
      gifPage: 0,
      gifBooting: false,
      gifLoadingMore: false,
      gifPreviewUrls: [],
      activePackId: null,
      stickerPacks: [],
      recentStickers: [],
      backspaceTimer: null,
      backspaceHoldTimer: null,
      packViewId: null,
      holdOverlay: null,
      holdTimer: null,
      holdSuppressClick: false,
      hoverCat: null,
      stickerSettingsOpen: false,
      scrollPosByMode: { emoji: 0, gif: 0, stickers: 0 },
      catObserver: null,
      catScrollLock: false,
      packObserver: null,
      packScrollLock: false,
    };
  },
  computed: {
    isSidebar() {
      return this.sidebar || this.variant === 'sidebar';
    },
    modes() {
      return [
        { id: 'emoji', label: this.tOr('messenger.panelEmoji', 'Emoji') },
        { id: 'gif', label: this.tOr('messenger.panelGif', 'GIF') },
        { id: 'stickers', label: this.tOr('messenger.panelStickers', 'Stickers') },
      ];
    },
    categories() {
      return CATEGORY_ORDER.filter((c) => emojiData[c]);
    },
    renderedCategories() {
      return this.categories.slice(0, this.emojiRevealCount);
    },
    /** Recent + static frequent list; recomputed only when recents change. */
    frequentEmojis() {
      const seen = new Set();
      const out = [];
      for (const e of this.recentEmojis) {
        if (!e || seen.has(e)) continue;
        if (!isGridEmoji('recent', e) && !FREQUENT_BASE.includes(e)) continue;
        seen.add(e);
        out.push(e);
      }
      for (const e of FREQUENT_BASE) {
        if (!e || seen.has(e)) continue;
        seen.add(e);
        out.push(e);
      }
      return out;
    },
    activeEmojis() {
      return this.emojisForCategory(this.activeCategory);
    },
    /** Continuous sticker sections (recent + packs) for smooth scroll + tab sync. */
    stickerSections() {
      const recent = this.recentStickers.map((r) => {
        const found = findStickerById(r.id);
        if (found) return found;
        return {
          id: r.id,
          emoji: r.emoji,
          kind: r.kind || (r.src ? 'image' : 'emoji'),
          src: r.src || null,
          packId: r.packId,
          mediaId: r.mediaId || null,
          width: r.width || null,
          height: r.height || null,
        };
      }).filter((s) => (s.emoji || s.src) && !isBuiltinEmojiSticker(s.id, s.packId));
      const sections = [{
        id: 'recent',
        title: this.recentStickersLabel,
        stickers: recent,
      }];
      for (const pack of this.stickerPacks) {
        sections.push({
          id: pack.id,
          title: this.packTitle(pack),
          stickers: (pack.stickers || []).map((s) => ({
            ...s,
            packId: pack.id,
            packCustom: !!pack.custom,
            kind: s.kind || (s.src ? 'image' : 'emoji'),
            emoji: s.emoji || pack.icon || '⭐',
          })),
        });
      }
      return sections;
    },
    /** Recent tab: first recent sticker thumb, else clock. */
    recentTabThumb() {
      const r = this.recentStickers?.[0];
      if (!r) return { kind: 'emoji', value: '🕒' };
      const found = findStickerById(r.id);
      const st = found || r;
      if ((st.kind === 'image' || st.src) && st.src) {
        return { kind: 'image', value: st.src };
      }
      return { kind: 'emoji', value: st.emoji || '🕒' };
    },
    stickerTabThumbMap() {
      const map = Object.create(null);
      for (const pack of this.stickerPacks || []) {
        map[pack.id] = this.packTabThumb(pack);
      }
      return map;
    },
    filteredGifMeta() {
      const q = String(this.gifQuery || '').trim().toLowerCase();
      if (!q) return this.gifMetaAll;
      return this.gifMetaAll.filter((g) => String(g.name || '').toLowerCase().includes(q)
        || String(g.id || '').toLowerCase().includes(q));
    },
    visibleGifs() {
      const slice = this.filteredGifMeta.slice(0, Math.max(GIF_PAGE_SIZE, this.gifPage * GIF_PAGE_SIZE));
      return slice.map((m) => this.gifHydrated[m.id] || { ...m, previewUrl: null, loaded: false });
    },
    activeStickers() {
      if (this.activePackId === 'recent') {
        return this.recentStickers.map((r) => {
          const found = findStickerById(r.id);
          if (found) return found;
          return {
            id: r.id,
            emoji: r.emoji,
            kind: r.kind || (r.src ? 'image' : 'emoji'),
            src: r.src || null,
            packId: r.packId,
            mediaId: r.mediaId || null,
            width: r.width || null,
            height: r.height || null,
          };
        }).filter((s) => (s.emoji || s.src) && !isBuiltinEmojiSticker(s.id, s.packId));
      }
      const pack = this.stickerPacks.find((p) => p.id === this.activePackId);
      return (pack?.stickers || []).map((s) => ({
        ...s,
        packId: pack.id,
        packCustom: !!pack.custom,
        kind: s.kind || (s.src ? 'image' : 'emoji'),
        emoji: s.emoji || pack.icon || '⭐',
      }));
    },
    packViewStickers() {
      // Depend on stickerPacks so refresh after create/add re-renders immediately.
      const packs = this.stickerPacks || [];
      const pack = packs.find((p) => p.id === this.packViewId) || findPackById(this.packViewId);
      return (pack?.stickers || []).map((s) => ({
        ...s,
        packId: pack.id,
        packCustom: !!pack.custom,
        kind: s.kind || (s.src ? 'image' : 'emoji'),
        emoji: s.emoji || pack.icon || '⭐',
      }));
    },
    packViewTitle() {
      return packTitleLocalized(findPackById(this.packViewId), this.$i18n?.locale);
    },
    packViewIcon() {
      return findPackById(this.packViewId)?.icon || '⭐';
    },
    packViewCanDelete() {
      const pack = findPackById(this.packViewId);
      return !!(pack?.custom);
    },
    packViewCanEditIcon() {
      return this.packViewCanDelete;
    },
    packViewCanAdd() {
      const pack = findPackById(this.packViewId);
      return !!(pack?.custom || pack?.remote);
    },
    addStickerLabel() {
      return this.tOr('messenger.stickerAddToPack', 'افزودن استیکر');
    },
    isRtl() {
      const loc = String(this.$i18n?.locale || document.documentElement?.dir || 'fa').toLowerCase();
      if (document.documentElement?.dir === 'rtl') return true;
      return loc.startsWith('fa') || loc.startsWith('ar');
    },
    setIconLabel() {
      return this.tOr('messenger.stickerSetPackIcon', 'Icon');
    },
    deleteStickerLabel() {
      return this.tOr('messenger.stickerDeleteOne', 'Delete sticker');
    },
    setEmojiLabel() {
      return this.tOr('messenger.stickerSetEmoji', 'Set emoji');
    },
    backspaceLabel() {
      return this.tOr('messenger.emojiBackspace', 'Backspace');
    },
    settingsLabel() {
      return this.tOr('messenger.stickerSettings', 'Stickers and Emoji');
    },
    gifSearchPlaceholder() {
      return this.tOr('messenger.gifSearch', 'Search GIFs');
    },
    gifAddLabel() {
      return this.tOr('messenger.gifAdd', 'Add');
    },
    gifEmptyTitle() {
      return this.tOr('messenger.gifEmptyTitle', 'No saved GIFs yet');
    },
    gifEmptyHint() {
      return this.tOr('messenger.gifEmptyHint', 'Save a GIF from a chat, or add one from your device.');
    },
    gifRemoveLabel() {
      return this.tOr('messenger.gifRemove', 'Remove GIF');
    },
    stickerEmptyTitle() {
      return this.tOr('messenger.stickerEmptyTitle', 'No recent stickers');
    },
    stickerEmptyHint() {
      return this.tOr('messenger.stickerEmptyHint', 'Pick a sticker from a pack below.');
    },
    recentStickersLabel() {
      return this.tOr('messenger.stickerRecent', 'Recent');
    },
    deletePackLabel() {
      return this.tOr('messenger.stickerRemovePack', 'Delete pack');
    },
    sendLabel() {
      return this.tOr('messenger.send', 'Send');
    },
    showPackLabel() {
      return this.tOr('messenger.stickerShowPack', 'Show pack');
    },
    editLabel() {
      return this.tOr('messenger.edit', 'Edit');
    },
    loadingLabel() {
      return this.tOr('messenger.loading', 'Loading…');
    },
  },
  watch: {
    gifQuery() {
      this.gifPage = 1;
      this.ensureGifPageHydrated();
    },
    initialMode(v) {
      if (['emoji', 'gif', 'stickers'].includes(v) && v !== this.mode) {
        this.setMode(v);
      }
    },
    mode(v) {
      this.teardownCategoryObserver();
      this.teardownPackObserver();
      if (v === 'emoji') {
        this.$nextTick(() => {
          this.setupEmojiRevealObserver();
          this.scheduleEmojiCategoryReveal();
          if (this.emojiRevealCount >= this.categories.length) {
            this.setupCategoryObserver();
          }
        });
      } else if (v === 'stickers' && !this.packViewId) {
        this.$nextTick(() => this.setupPackObserver());
      }
    },
    activeCategory(cat) {
      this.$nextTick(() => this.scrollActiveTabIntoView('tabs', cat));
    },
    activePackId(id) {
      this.$nextTick(() => this.scrollActiveTabIntoView('stickerTabs', id));
    },
  },
  mounted() {
    this.loadRecent();
    this.refreshStickerPacks();
    if (['emoji', 'gif', 'stickers'].includes(this.initialMode)) {
      this.mode = this.initialMode;
      this.mountedModes[this.mode] = true;
      if (this.mode === 'gif') this.loadGifs();
      if (this.mode === 'stickers') this.refreshStickerPacks();
      this.$emit('mode-change', this.mode);
    }
    if (this.categories.length && !this.categories.includes(this.activeCategory)) {
      this.activeCategory = this.categories[0];
    }
    if (!this.activePackId) {
      this.activePackId = this.stickerPacks[0]?.id || 'recent';
    }
    this.$nextTick(() => {
      if (this.mode === 'emoji') {
        this.setupEmojiRevealObserver();
        this.scheduleEmojiCategoryReveal();
        if (this.emojiRevealCount >= this.categories.length) {
          this.setupCategoryObserver();
        }
      } else if (this.mode === 'stickers' && !this.packViewId) {
        this.setupPackObserver();
      }
    });
  },
  beforeUnmount() {
    this.onBackspaceCancel();
    this.onStickerPointerUp();
    this.revokeGifPreviews();
    this.teardownCategoryObserver();
    this.teardownPackObserver();
    this.teardownEmojiRevealObserver();
    if (this.emojiRevealRaf) {
      cancelAnimationFrame(this.emojiRevealRaf);
      this.emojiRevealRaf = 0;
    }
  },
  methods: {
    tOr(key, fallback) {
      const t = this.$t(key);
      return t !== key ? t : fallback;
    },
    emojisForCategory(cat) {
      if (cat === 'Frequently used') return this.frequentEmojis;
      return GRID_EMOJI_LISTS[cat] || EMPTY_EMOJI_LIST;
    },
    ensureEmojiCategoriesThrough(index) {
      const need = Math.min(this.categories.length, Math.max(this.emojiRevealCount, index + 1));
      if (need <= this.emojiRevealCount) return;
      this.emojiRevealCount = need;
      this.$nextTick(() => {
        this.setupCategoryObserver();
        if (this.emojiRevealCount >= this.categories.length) {
          this.teardownEmojiRevealObserver();
        } else {
          this.setupEmojiRevealObserver();
        }
      });
    },
    revealMoreEmojiCategories(step = EMOJI_REVEAL_STEP) {
      if (this.emojiRevealCount >= this.categories.length) return false;
      this.emojiRevealCount = Math.min(
        this.categories.length,
        this.emojiRevealCount + Math.max(1, step),
      );
      const more = this.emojiRevealCount < this.categories.length;
      this.$nextTick(() => {
        // Re-bind observers to newly mounted sections / sentinel.
        this.setupCategoryObserver();
        if (more) this.setupEmojiRevealObserver();
        else this.teardownEmojiRevealObserver();
      });
      return more;
    },
    scheduleEmojiCategoryReveal() {
      // Do not eagerly mount every category (People alone is huge). After the
      // first paint, wire the scroll sentinel; further categories load on
      // scroll or when the user taps a category tab.
      if (this.mode !== 'emoji') return;
      this.$nextTick(() => this.setupEmojiRevealObserver());
    },
    setupEmojiRevealObserver() {
      this.teardownEmojiRevealObserver();
      if (this.mode !== 'emoji' || this.emojiRevealCount >= this.categories.length) return;
      const root = this.$refs.grid;
      const sentinel = this.$refs.emojiRevealSentinel;
      if (!root || !sentinel || typeof IntersectionObserver === 'undefined') return;
      this.emojiRevealObserver = new IntersectionObserver((entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        this.revealMoreEmojiCategories(EMOJI_REVEAL_STEP);
      }, { root, rootMargin: '160px 0px', threshold: 0 });
      this.emojiRevealObserver.observe(sentinel);
    },
    teardownEmojiRevealObserver() {
      if (this.emojiRevealObserver) {
        this.emojiRevealObserver.disconnect();
        this.emojiRevealObserver = null;
      }
    },
    modeScrollEl() {
      if (this.mode === 'emoji') return this.$refs.grid;
      if (this.mode === 'gif') return this.$refs.gifGrid;
      if (this.mode === 'stickers') return this.$refs.stickerGrid;
      return null;
    },
    saveModeScroll() {
      const el = this.modeScrollEl();
      if (el && this.scrollPosByMode) {
        this.scrollPosByMode[this.mode] = el.scrollTop || 0;
      }
    },
    restoreModeScroll(id) {
      const el = this.modeScrollEl();
      if (!el) return;
      const top = this.scrollPosByMode?.[id] || 0;
      el.scrollTop = top;
    },
    setMode(id) {
      if (!['emoji', 'gif', 'stickers'].includes(id)) return;
      if (this.mode === id) {
        this.$emit('mode-change', id);
        return;
      }
      this.saveModeScroll();
      this.mountedModes[id] = true;
      this.mode = id;
      this.packViewId = null;
      this.closeHoldOverlay();
      if (id === 'gif') this.loadGifs();
      if (id === 'stickers') this.refreshStickerPacks();
      if (id === 'emoji') {
        this.$nextTick(() => {
          this.setupEmojiRevealObserver();
          this.scheduleEmojiCategoryReveal();
        });
      }
      this.$emit('mode-change', id);
      this.$nextTick(() => this.restoreModeScroll(id));
    },
    openStickerSettings() {
      this.$emit('open-sticker-settings');
      if (!this.externalSettings) {
        this.stickerSettingsOpen = true;
      }
    },
    onStickerSettingsChanged() {
      this.refreshStickerPacks({ sync: false });
      this.$emit('sticker-packs-changed');
    },
    onCatHover(cat) {
      if (this.mobile || this.tabDrag?.moved) return;
      this.hoverCat = cat;
    },
    onCatHoverLeave() {
      this.hoverCat = null;
    },
    setupCategoryObserver() {
      this.teardownCategoryObserver();
      if (this.mode !== 'emoji') return;
      const root = this.$refs.grid;
      if (!root || typeof IntersectionObserver === 'undefined') return;
      const sections = root.querySelectorAll('[data-emoji-cat]');
      if (!sections.length) return;
      this.catObserver = new IntersectionObserver((entries) => {
        if (this.catScrollLock) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const top = visible[0];
        const cat = top?.target?.getAttribute?.('data-emoji-cat');
        if (cat && cat !== this.activeCategory) this.activeCategory = cat;
      }, { root, rootMargin: '-8% 0px -70% 0px', threshold: [0, 0.2, 0.5] });
      sections.forEach((el) => this.catObserver.observe(el));
    },
    teardownCategoryObserver() {
      if (this.catObserver) {
        this.catObserver.disconnect();
        this.catObserver = null;
      }
    },
    setupPackObserver() {
      this.teardownPackObserver();
      if (this.mode !== 'stickers' || this.packViewId) return;
      const root = this.$refs.stickerGrid;
      if (!root || typeof IntersectionObserver === 'undefined') return;
      const sections = root.querySelectorAll('[data-sticker-pack]');
      if (!sections.length) return;
      this.packObserver = new IntersectionObserver((entries) => {
        if (this.packScrollLock) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const top = visible[0];
        const id = top?.target?.getAttribute?.('data-sticker-pack');
        if (id && id !== this.activePackId) this.activePackId = id;
      }, { root, rootMargin: '-8% 0px -70% 0px', threshold: [0, 0.2, 0.5] });
      sections.forEach((el) => this.packObserver.observe(el));
    },
    teardownPackObserver() {
      if (this.packObserver) {
        this.packObserver.disconnect();
        this.packObserver = null;
      }
    },
    scrollActiveTabIntoView(refName, key) {
      const bar = this.$refs[refName];
      if (!bar || key == null) return;
      const btn = Array.from(bar.querySelectorAll('[role="tab"]'))
        .find((el) => el.getAttribute('aria-selected') === 'true');
      if (!btn || typeof btn.scrollIntoView !== 'function') return;
      try {
        btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      } catch {
        /* noop */
      }
    },
    onEmojiScroll() {
      /* IntersectionObserver handles active category */
    },
    loadRecent() {
      try {
        const raw = localStorage.getItem(RECENT_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) this.recentEmojis = parsed;
        }
      } catch {
        /* noop */
      }
    },
    saveRecent(emoji) {
      const list = [emoji, ...this.recentEmojis.filter((e) => e !== emoji)].slice(0, MAX_RECENT);
      this.recentEmojis = list;
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(list));
      } catch {
        /* noop */
      }
    },
    pick(emoji) {
      if (this.tabDrag?.moved || this.suppressTabClick) return;
      this.saveRecent(emoji);
      this.$emit('select', emoji);
    },
    emitBackspace() {
      this.$emit('backspace');
    },
    clearBackspaceTimers() {
      if (this.backspaceHoldTimer) {
        clearTimeout(this.backspaceHoldTimer);
        this.backspaceHoldTimer = null;
      }
      if (this.backspaceTimer) {
        clearInterval(this.backspaceTimer);
        this.backspaceTimer = null;
      }
    },
    onBackspaceDown(event) {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      // Ignore duplicate downs for the same press.
      if (this._bsActive) return;
      this._bsActive = true;
      this._bsHeld = false;
      this._bsPointerId = event.pointerId;
      this.clearBackspaceTimers();
      try {
        event.currentTarget?.setPointerCapture?.(event.pointerId);
      } catch (e) { /* noop */ }
      // Hold → repeat delete; short tap handled once on pointerup only.
      this.backspaceHoldTimer = window.setTimeout(() => {
        if (!this._bsActive) return;
        this._bsHeld = true;
        this.emitBackspace();
        this.backspaceTimer = window.setInterval(() => this.emitBackspace(), 50);
      }, 400);
    },
    onBackspaceUp(event) {
      if (!this._bsActive) return;
      if (event && this._bsPointerId != null && event.pointerId !== this._bsPointerId) return;
      const wasHold = !!this._bsHeld;
      this.clearBackspaceTimers();
      this._bsActive = false;
      this._bsPointerId = null;
      // Single tap: delete exactly once on release (not also on leave/click).
      if (!wasHold) this.emitBackspace();
      this._bsHeld = false;
    },
    onBackspaceLeave() {
      // Stop hold-repeat if finger/cursor leaves, but do not count as a tap
      // (pointerup still finishes the gesture once via capture).
      if (!this._bsActive || !this._bsHeld) return;
      this.clearBackspaceTimers();
    },
    onBackspaceCancel(event) {
      if (!this._bsActive) return;
      if (event && this._bsPointerId != null && event.pointerId !== this._bsPointerId) return;
      this.clearBackspaceTimers();
      this._bsActive = false;
      this._bsPointerId = null;
      this._bsHeld = false;
    },
    selectCategory(cat) {
      if (this.suppressTabClick || this.tabDrag?.moved) return;
      if (this.activeCategory === cat) return;
      this.activeCategory = cat;
      const idx = this.categories.indexOf(cat);
      if (idx >= 0) this.ensureEmojiCategoriesThrough(idx);
      this.$nextTick(() => {
        const grid = this.$refs.grid;
        if (!grid) return;
        const sec = grid.querySelector(`[data-emoji-cat="${cat}"]`);
        if (!sec) return;
        this.catScrollLock = true;
        sec.scrollIntoView({ behavior: 'auto', block: 'start' });
        window.setTimeout(() => { this.catScrollLock = false; }, 80);
      });
    },
    onTabsPointerDown(event) {
      if (typeof event.preventDefault === 'function') event.preventDefault();
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      const el = this.$refs.tabs;
      if (!el) return;
      this.tabDrag = {
        pointerId: event.pointerId,
        startX: event.clientX,
        scrollLeft: el.scrollLeft,
        moved: false,
        capturing: false,
      };
    },
    onTabsPointerMove(event) {
      const drag = this.tabDrag;
      const el = this.$refs.tabs;
      if (!drag || drag.pointerId !== event.pointerId || !el) return;
      const delta = event.clientX - drag.startX;
      if (!drag.moved && Math.abs(delta) > 8) {
        drag.moved = true;
        this.suppressTabClick = true;
        this.hoverCat = null;
        if (!drag.capturing) {
          drag.capturing = true;
          try { el.setPointerCapture(event.pointerId); } catch (e) { /* noop */ }
        }
      }
      if (!drag.moved) return;
      el.scrollLeft = drag.scrollLeft - delta;
      event.preventDefault();
    },
    onTabsPointerUp(event) {
      if (this.tabDrag?.pointerId !== event.pointerId) return;
      const el = this.$refs.tabs;
      const drag = this.tabDrag;
      if (el && drag?.capturing) {
        try { el.releasePointerCapture(event.pointerId); } catch (e) { /* noop */ }
      }
      const moved = !!drag?.moved;
      this.tabDrag = null;
      if (moved) {
        this.suppressTabClick = true;
        window.setTimeout(() => { this.suppressTabClick = false; }, 120);
      } else {
        this.suppressTabClick = false;
      }
    },
    iconFor(cat) {
      return CATEGORY_ICONS[cat] || '😀';
    },
    categoryLabel(cat) {
      const key = `messenger.emojiCategory.${cat.replace(/\s+/g, '')}`;
      const t = this.$t(key);
      return t !== key ? t : cat;
    },
    revokeGifPreviews() {
      for (const u of this.gifPreviewUrls) {
        try { URL.revokeObjectURL(u); } catch (e) { /* noop */ }
      }
      this.gifPreviewUrls = [];
    },
    async loadGifs() {
      this.gifBooting = true;
      this.gifPage = 1;
      this.gifMetaAll = listSavedGifMeta();
      this.gifHydrated = {};
      this.revokeGifPreviews();
      try {
        await this.ensureGifPageHydrated();
      } finally {
        this.gifBooting = false;
      }
    },
    refreshGifs() {
      this.loadGifs();
    },
    async ensureGifPageHydrated() {
      const need = this.filteredGifMeta.slice(0, Math.max(GIF_PAGE_SIZE, this.gifPage * GIF_PAGE_SIZE));
      const missing = need.filter((m) => !this.gifHydrated[m.id]?.loaded);
      if (!missing.length) return;
      this.gifLoadingMore = true;
      try {
        const items = await hydrateGifPreviews(missing);
        const next = { ...this.gifHydrated };
        for (const it of items) {
          if (it.previewUrl && String(it.previewUrl).startsWith('blob:')) {
            this.gifPreviewUrls.push(it.previewUrl);
          }
          next[it.id] = it;
        }
        this.gifHydrated = next;
      } finally {
        this.gifLoadingMore = false;
      }
    },
    onGifScroll(e) {
      const el = e?.target;
      if (!el || this.gifLoadingMore || this.gifBooting) return;
      if (el.scrollTop + el.clientHeight < el.scrollHeight - 80) return;
      const maxPage = Math.ceil(this.filteredGifMeta.length / GIF_PAGE_SIZE) || 1;
      if (this.gifPage >= maxPage) return;
      this.gifPage += 1;
      this.ensureGifPageHydrated();
    },
    pickGif(g) {
      if (!g) return;
      const full = this.gifHydrated[g.id] || g;
      this.$emit('send-gif', {
        id: full.id,
        blob: full._blob || null,
        mime: full.mime,
        width: full.width,
        height: full.height,
        name: full.name,
        isVideo: !!full.isVideo,
      });
    },
    onGifPointerDown(g, event) {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      this.holdSuppressClick = false;
      this.onGifPointerUp();
      this.holdTimer = window.setTimeout(() => {
        this.holdSuppressClick = true;
        const full = this.gifHydrated[g.id] || g;
        this.holdOverlay = {
          type: 'gif',
          id: full.id,
          name: full.name || 'GIF',
          previewUrl: full.previewUrl || null,
          isVideo: !!full.isVideo,
        };
      }, HOLD_MS);
    },
    onGifPointerUp() {
      if (this.holdTimer) {
        clearTimeout(this.holdTimer);
        this.holdTimer = null;
      }
    },
    onGifClick(g) {
      if (this.holdSuppressClick) {
        this.holdSuppressClick = false;
        return;
      }
      this.pickGif(g);
    },
    async removeGif(g) {
      if (!g?.id) return;
      const id = String(g.id);
      const preview = this.gifHydrated[id]?.previewUrl;
      if (preview && this.gifPreviewUrls.includes(preview)) {
        try { URL.revokeObjectURL(preview); } catch { /* noop */ }
        this.gifPreviewUrls = this.gifPreviewUrls.filter((u) => u !== preview);
      }
      await removeGifFromLibrary(id);
      this.gifMetaAll = listSavedGifMeta();
      const next = { ...this.gifHydrated };
      delete next[id];
      this.gifHydrated = next;
      if (this.holdOverlay?.type === 'gif' && String(this.holdOverlay.id) === id) {
        this.closeHoldOverlay();
      }
    },
    openGifFilePicker() {
      this.$refs.gifFileInput?.click();
    },
    async onGifFilePicked(event) {
      const files = Array.from(event?.target?.files || []);
      if (event?.target) event.target.value = '';
      if (!files.length) return;
      for (const file of files) {
        try {
          // eslint-disable-next-line no-await-in-loop
          await addGifToLibrary({
            blob: file,
            mime: file.type,
            name: file.name,
            sourceKey: `file:${file.name}:${file.size}:${file.lastModified}`,
          });
        } catch (e) { /* noop */ }
      }
      await this.loadGifs();
    },
    refreshStickerPacks({ sync = true } = {}) {
      this.stickerPacks = getAllStickerPacks();
      this.recentStickers = listRecentStickers().filter((s) => !isBuiltinEmojiSticker(s.id, s.packId));
      if (!this.activePackId || (this.activePackId !== 'recent' && !this.stickerPacks.some((p) => p.id === this.activePackId))) {
        this.activePackId = this.stickerPacks[0]?.id || 'recent';
      }
      if (sync) this.syncRemotePacks();
    },
    async syncRemotePacks() {
      try {
        const data = await listStickerPacks();
        if (data?.packs?.length) {
          mergeServerPacks(data.packs, {
            installIds: Array.isArray(data.installed) ? data.installed : [],
          });
          this.stickerPacks = getAllStickerPacks();
        }
      } catch (e) {
        /* offline / no API yet */
      }
    },
    pickPackIcon() {
      const pack = findPackById(this.packViewId);
      if (!pack?.custom) return;
      const next = window.prompt(this.setIconLabel, pack.icon || '⭐');
      if (!next) return;
      const icon = String(next).trim().slice(0, 8) || '⭐';
      setPackIcon(pack.id, icon);
      updateStickerPackApi(pack.id, { icon }).catch(() => {});
      this.refreshStickerPacks();
    },
    holdDelete() {
      const st = this.holdOverlay;
      this.closeHoldOverlay();
      if (st?.type === 'gif') {
        this.removeGif(st);
        return;
      }
      if (!st?.packCustom || !st?.id || !st?.packId) return;
      removeCustomSticker(st.packId, st.id);
      deleteStickerApi(st.id).catch(() => {});
      this.refreshStickerPacks();
    },
    holdSetEmoji() {
      const st = this.holdOverlay;
      if (!st?.packCustom || !st?.id || !st?.packId) return;
      const next = window.prompt(this.setEmojiLabel, st.emoji || '⭐');
      if (next == null) return;
      const emoji = String(next).trim().slice(0, 8) || '⭐';
      setStickerEmoji(st.packId, st.id, emoji);
      updateStickerApi(st.id, { emoji }).catch(() => {});
      this.holdOverlay = { ...st, emoji };
      this.refreshStickerPacks();
    },
    packTitle(pack) {
      return packTitleLocalized(pack, this.$i18n?.locale);
    },
    /** Telegram-style pack tab: first sticker of the pack (image or emoji). */
    packTabThumb(pack) {
      const st = (pack?.stickers || [])[0];
      if (!st) return { kind: 'emoji', value: pack?.icon || '⭐' };
      if ((st.kind === 'image' || st.src) && st.src) {
        return { kind: 'image', value: st.src };
      }
      return { kind: 'emoji', value: st.emoji || pack?.icon || '⭐' };
    },
    selectPack(id) {
      if (this.suppressStickerTabClick || this.stickerTabDrag?.moved) return;
      this.activePackId = id;
      this.packViewId = null;
      this.$nextTick(() => {
        const grid = this.$refs.stickerGrid;
        if (!grid) return;
        const sec = Array.from(grid.querySelectorAll('[data-sticker-pack]'))
          .find((el) => el.getAttribute('data-sticker-pack') === id);
        if (!sec) {
          grid.scrollTop = 0;
          return;
        }
        this.packScrollLock = true;
        sec.scrollIntoView({ behavior: 'auto', block: 'start' });
        window.setTimeout(() => { this.packScrollLock = false; }, 80);
        this.setupPackObserver();
      });
    },
    onStickerPointerDown(st, event) {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      this.holdSuppressClick = false;
      this.onStickerPointerUp();
      this.holdTimer = window.setTimeout(() => {
        this.holdSuppressClick = true;
        this.holdOverlay = { ...st };
      }, HOLD_MS);
    },
    onStickerPointerUp() {
      if (this.holdTimer) {
        clearTimeout(this.holdTimer);
        this.holdTimer = null;
      }
    },
    onStickerClick(st) {
      if (this.holdSuppressClick) {
        this.holdSuppressClick = false;
        return;
      }
      this.pickSticker(st);
    },
    pickSticker(st) {
      if (!st) return;
      pushRecentSticker(st);
      this.recentStickers = listRecentStickers().filter((s) => !isBuiltinEmojiSticker(s.id, s.packId));
      this.$emit('send-sticker', {
        id: st.id,
        packId: st.packId || this.packViewId || this.activePackId,
        emoji: st.emoji || null,
        kind: st.kind || (st.src ? 'image' : 'emoji'),
        src: st.src || null,
        mediaId: st.mediaId || st.media_id || null,
        width: st.width || null,
        height: st.height || null,
      });
    },
    closeHoldOverlay() {
      this.holdOverlay = null;
    },
    holdSend() {
      const st = this.holdOverlay;
      this.closeHoldOverlay();
      if (!st) return;
      if (st.type === 'gif') {
        this.pickGif(st);
        return;
      }
      this.pickSticker(st);
    },
    holdShowPack() {
      const st = this.holdOverlay;
      this.closeHoldOverlay();
      if (st?.packId) this.openPackView(st.packId);
      else if (this.activePackId && this.activePackId !== 'recent') this.openPackView(this.activePackId);
    },
    holdEdit() {
      const st = this.holdOverlay;
      this.closeHoldOverlay();
      if (st) this.$emit('edit-sticker', st);
      else this.$emit('compose-stickers');
    },
    openPackView(packId) {
      this.teardownPackObserver();
      this.packViewId = packId;
    },
    closePackView() {
      this.packViewId = null;
      this.$nextTick(() => this.setupPackObserver());
    },
    addStickerToCurrentPack() {
      if (!this.packViewId) return;
      this.$emit('compose-stickers', { packId: this.packViewId, mode: 'add' });
    },
    deleteCurrentPack() {
      if (!this.packViewId) return;
      deleteCustomPack(this.packViewId);
      this.packViewId = null;
      this.refreshStickerPacks();
    },
    onStickerTabsPointerDown(event) {
      if (typeof event.preventDefault === 'function') event.preventDefault();
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      const el = this.$refs.stickerTabs;
      if (!el) return;
      this.stickerTabDrag = {
        pointerId: event.pointerId,
        startX: event.clientX,
        scrollLeft: el.scrollLeft,
        moved: false,
        capturing: false,
      };
    },
    onStickerTabsPointerMove(event) {
      const drag = this.stickerTabDrag;
      const el = this.$refs.stickerTabs;
      if (!drag || drag.pointerId !== event.pointerId || !el) return;
      const delta = event.clientX - drag.startX;
      if (!drag.moved && Math.abs(delta) > 8) {
        drag.moved = true;
        this.suppressStickerTabClick = true;
        if (!drag.capturing) {
          drag.capturing = true;
          try { el.setPointerCapture(event.pointerId); } catch (e) { /* noop */ }
        }
      }
      if (!drag.moved) return;
      el.scrollLeft = drag.scrollLeft - delta;
      event.preventDefault();
    },
    onStickerTabsPointerUp(event) {
      if (this.stickerTabDrag?.pointerId !== event.pointerId) return;
      const el = this.$refs.stickerTabs;
      const drag = this.stickerTabDrag;
      if (el && drag?.capturing) {
        try { el.releasePointerCapture(event.pointerId); } catch (e) { /* noop */ }
      }
      const moved = !!drag?.moved;
      this.stickerTabDrag = null;
      if (moved) {
        this.suppressStickerTabClick = true;
        window.setTimeout(() => { this.suppressStickerTabClick = false; }, 120);
      } else {
        this.suppressStickerTabClick = false;
      }
    },
  },
};
</script>


<style scoped>
.messenger-emoji-picker__cells {
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  gap: 0;
  padding: 0;
}

.messenger-emoji-picker__cell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 42px;
  min-width: 0;
  min-height: 42px;
  max-height: 42px;
  aspect-ratio: auto;
  padding: 0;
  margin: 0;
  overflow: hidden;
  contain: layout paint;
  isolation: isolate;
  font-size: 22px;
  line-height: 1;
  font-family: "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", "Twemoji Mozilla", sans-serif;
  font-variant-emoji: emoji;
  unicode-bidi: isolate;
  text-overflow: clip;
  white-space: nowrap;
  border-radius: 10px;
  transition: transform 0.08s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.08s ease;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.messenger-emoji-picker__cell:hover {
  background-color: rgba(51, 144, 236, 0.08);
}

.messenger-emoji-picker__cell:active {
  transform: scale(1.18);
  background-color: rgba(51, 144, 236, 0.14);
}

.messenger-emoji-picker__tab {
  height: 40px;
  min-width: 44px;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  border-radius: 10px;
}
.messenger-emoji-picker__tab.is-active {
  background: rgba(51, 144, 236, 0.12);
}
.messenger-emoji-picker__tab-indicator {
  position: absolute;
  inset-inline: 10px;
  bottom: 3px;
  height: 2px;
  border-radius: 999px;
  background: #3390ec;
}
.dark .messenger-emoji-picker__tab-indicator {
  background: #6ab2f2;
}

/* Floating glass category / pack tabs — rounded, inset from panel edges */
.messenger-emoji-picker__tabs-shell {
  flex-shrink: 0;
  padding: 6px 8px 4px;
  background: transparent;
  z-index: 5;
}
.messenger-emoji-picker__tabs {
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-x;
  cursor: grab;
  border-radius: 14px;
  border: 1px solid rgba(15, 23, 42, 0.06);
  background: rgba(247, 248, 249, 0.72);
  backdrop-filter: blur(18px) saturate(1.45);
  -webkit-backdrop-filter: blur(18px) saturate(1.45);
  box-shadow:
    0 4px 16px rgba(15, 23, 42, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.65);
  gap: 1px;
  padding: 2px;
}
.dark .messenger-emoji-picker__tabs,
:global(.dark) .messenger-emoji-picker__tabs {
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(14, 22, 33, 0.62);
  box-shadow:
    0 6px 18px rgba(0, 0, 0, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}
.dark .messenger-emoji-picker__tab.is-active,
:global(.dark) .messenger-emoji-picker__tab.is-active {
  background: rgba(51, 144, 236, 0.18);
}

.messenger-emoji-picker__tabs::-webkit-scrollbar {
  display: none;
}

.messenger-emoji-picker__tabs:active {
  cursor: grabbing;
}

.messenger-emoji-picker__tab-icon {
  font-size: 22px;
  line-height: 1;
  pointer-events: none;
}

/* Sticker pack tabs — equal thumbs from first sticker (Telegram) */
.messenger-emoji-picker__sticker-tabs {
  gap: 1px;
  padding: 3px;
}
.messenger-emoji-picker__sticker-tab {
  width: 36px;
  height: 36px;
  min-width: 36px;
  padding: 0;
  border-radius: 9px;
  color: inherit;
}
.messenger-emoji-picker__sticker-tab.is-active {
  background: rgba(51, 144, 236, 0.14);
}
.dark .messenger-emoji-picker__sticker-tab.is-active,
:global(.dark) .messenger-emoji-picker__sticker-tab.is-active {
  background: rgba(51, 144, 236, 0.2);
}
.messenger-emoji-picker__sticker-tab-thumb {
  width: 26px;
  height: 26px;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
}
.messenger-emoji-picker__sticker-tab-emoji {
  font-size: 20px;
  line-height: 1;
  pointer-events: none;
  user-select: none;
}
.messenger-emoji-picker__sticker-tab-add {
  width: 18px;
  height: 18px;
  display: block;
  opacity: 0.75;
}
.messenger-emoji-picker__sticker-tab .messenger-emoji-picker__tab-indicator {
  inset-inline: 8px;
  bottom: 2px;
}

.messenger-emoji-picker--mobile .messenger-emoji-picker__sticker-tab {
  width: 34px;
  height: 34px;
  min-width: 34px;
}
.messenger-emoji-picker--mobile .messenger-emoji-picker__sticker-tab-thumb {
  width: 24px;
  height: 24px;
}
.messenger-emoji-picker--mobile .messenger-emoji-picker__sticker-tab-emoji {
  font-size: 18px;
}

.messenger-emoji-picker__grid {
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  position: relative;
  /* Clearance for floating glass dock so last row can scroll above it. */
  padding-bottom: var(--dock-clearance, 62px);
}

.messenger-emoji-picker__grid::-webkit-scrollbar {
  display: none;
}

.messenger-emoji-picker__mode-pane {
  min-height: 0;
}

.messenger-emoji-picker__reveal-sentinel {
  width: 100%;
  height: 1px;
  pointer-events: none;
}

.messenger-emoji-picker__backspace {
  display: none;
}

/* Floating glass dock — does not consume layout height; content scrolls underneath. */
.messenger-emoji-picker__dock {
  position: absolute;
  left: 50%;
  bottom: max(10px, env(safe-area-inset-bottom, 0px));
  transform: translateX(-50%);
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: max-content;
  max-width: calc(100% - 20px);
  padding: 0;
  margin: 0;
  pointer-events: none;
  background: transparent;
}
.messenger-emoji-picker__mode-pill,
.messenger-emoji-picker__backspace-pill,
.messenger-emoji-picker__settings-pill {
  pointer-events: auto;
  border: 1px solid rgba(255, 255, 255, 0.42);
  background: rgba(255, 255, 255, 0.38);
  backdrop-filter: blur(22px) saturate(1.55);
  -webkit-backdrop-filter: blur(22px) saturate(1.55);
  box-shadow:
    0 8px 24px rgba(15, 23, 42, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.55);
}
:global(.dark) .messenger-emoji-picker__mode-pill,
:global(.dark) .messenger-emoji-picker__backspace-pill,
:global(.dark) .messenger-emoji-picker__settings-pill,
.dark .messenger-emoji-picker__mode-pill,
.dark .messenger-emoji-picker__backspace-pill,
.dark .messenger-emoji-picker__settings-pill {
  background: rgba(28, 38, 50, 0.42);
  border-color: rgba(255, 255, 255, 0.16);
  box-shadow:
    0 10px 28px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
.messenger-emoji-picker__mode-pill {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 3px;
  border-radius: 999px;
  flex: 0 0 auto;
}
.messenger-emoji-picker__mode-chip {
  flex: 0 0 auto;
  height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 650;
  color: #707579;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
}
.dark .messenger-emoji-picker__mode-chip {
  color: #8b98a5;
}
.messenger-emoji-picker__mode-chip.is-active {
  background: rgba(51, 144, 236, 0.22);
  color: #3390ec;
}
.dark .messenger-emoji-picker__mode-chip.is-active {
  background: rgba(106, 178, 242, 0.22);
  color: #6ab2f2;
}
.messenger-emoji-picker__backspace-pill {
  width: 40px;
  height: 36px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  color: #707579;
  flex-shrink: 0;
}
.dark .messenger-emoji-picker__backspace-pill {
  color: #8b98a5;
}
.messenger-emoji-picker__backspace-pill:active {
  background: rgba(51, 144, 236, 0.2);
  color: #3390ec;
}
.messenger-emoji-picker__backspace-pill svg {
  width: 20px;
  height: 20px;
  display: block;
}
.messenger-emoji-picker__settings-pill {
  width: 40px;
  height: 36px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  color: #707579;
  flex-shrink: 0;
}
.dark .messenger-emoji-picker__settings-pill {
  color: #8b98a5;
}
.messenger-emoji-picker__settings-pill:hover,
.messenger-emoji-picker__settings-pill:active {
  color: #3390ec;
  background: rgba(51, 144, 236, 0.18);
}
.messenger-emoji-picker__settings-pill svg {
  width: 18px;
  height: 18px;
  display: block;
}

.messenger-emoji-picker {
  --dock-clearance: 62px;
}

.messenger-emoji-picker--mobile {
  position: relative;
  --dock-clearance: calc(62px + env(safe-area-inset-bottom, 0px));
}

.messenger-emoji-picker--mobile .messenger-emoji-picker__cells {
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  gap: 0;
  padding: 2px 0 2px;
}

.messenger-emoji-picker--mobile .messenger-emoji-picker__cell {
  height: 40px;
  min-height: 40px;
  max-height: 40px;
  font-size: 22px;
  border-radius: 8px;
  overflow: hidden;
}

.messenger-emoji-picker__tabs--mobile {
  height: 40px;
  min-height: 40px;
  flex-shrink: 0;
}

.messenger-emoji-picker--mobile .messenger-emoji-picker__tabs-shell {
  padding: 4px 6px 2px;
}

.messenger-emoji-picker--mobile .messenger-emoji-picker__tab {
  height: 36px;
  min-width: 40px;
}

.messenger-emoji-picker--mobile .messenger-emoji-picker__tab-icon {
  font-size: 18px;
}

.messenger-emoji-picker__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2.5rem 1.5rem;
  min-height: 140px;
}

.messenger-emoji-picker__gif-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  padding: 0;
}

.messenger-emoji-picker__gif-cell {
  position: relative;
  aspect-ratio: 1;
  border-radius: 0;
  overflow: hidden;
  background: #e8ebef;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.dark .messenger-emoji-picker__gif-cell {
  background: #0e1621;
}

.messenger-emoji-picker__gif-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 0;
}

.messenger-emoji-picker__gif-badge {
  position: absolute;
  left: 4px;
  bottom: 4px;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 2px;
  padding: 1px 4px;
  line-height: 1.35;
  pointer-events: none;
}

.messenger-emoji-picker__gif-remove {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #fff;
  background: rgba(0, 0, 0, 0.55);
  opacity: 0;
  transform: scale(0.92);
  transition: opacity 0.12s ease, transform 0.12s ease, background-color 0.12s ease;
  -webkit-tap-highlight-color: transparent;
  z-index: 2;
}
.messenger-emoji-picker__gif-remove svg {
  width: 12px;
  height: 12px;
}
.messenger-emoji-picker__gif-cell:hover .messenger-emoji-picker__gif-remove,
.messenger-emoji-picker__gif-cell:focus-within .messenger-emoji-picker__gif-remove,
.messenger-emoji-picker--mobile .messenger-emoji-picker__gif-remove {
  opacity: 1;
  transform: scale(1);
}
.messenger-emoji-picker__gif-remove:hover,
.messenger-emoji-picker__gif-remove:active {
  background: rgba(223, 63, 64, 0.92);
}

.messenger-emoji-picker__sticker-cells {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2px;
  padding: 0;
}

.messenger-emoji-picker__sticker-cell {
  position: relative;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  padding: 2px;
}

.messenger-emoji-picker__sticker-cell:active {
  background: rgba(51, 144, 236, 0.1);
  transform: scale(1.04);
}

.messenger-emoji-picker__sticker-emoji {
  font-size: 2.85rem;
  line-height: 1;
}

.messenger-emoji-picker__sticker-img {
  width: 92%;
  height: 92%;
  object-fit: contain;
}

.messenger-emoji-picker__sticker-assoc {
  position: absolute;
  right: 3px;
  bottom: 2px;
  font-size: 10px;
  line-height: 1;
  opacity: 0.85;
  pointer-events: none;
  filter: drop-shadow(0 1px 1px rgba(0,0,0,0.35));
}

.messenger-emoji-picker__pack-back {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  color: #707579;
  -webkit-tap-highlight-color: transparent;
}
.messenger-emoji-picker__pack-back:active {
  background: rgba(51, 144, 236, 0.12);
}
.messenger-emoji-picker__pack-back-icon {
  width: 16px;
  height: 16px;
}
/* End-side back: flip for RTL so chevron points outward correctly. */
.messenger-emoji-picker__pack-back-icon.is-rtl {
  transform: scaleX(-1);
}
.messenger-emoji-picker__pack-back-icon.is-ltr {
  transform: none;
}
.messenger-emoji-picker__sticker-add-ring {
  width: 46%;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 1.8px dashed rgba(51, 144, 236, 0.85);
  color: #3390ec;
  display: grid;
  place-items: center;
  background: rgba(51, 144, 236, 0.08);
}
.messenger-emoji-picker__sticker-add-ring svg {
  width: 54%;
  height: 54%;
}
.messenger-emoji-picker__sticker-add:active .messenger-emoji-picker__sticker-add-ring {
  background: rgba(51, 144, 236, 0.18);
  transform: scale(0.96);
}

.messenger-emoji-picker--mobile .messenger-emoji-picker__sticker-cells {
  grid-template-columns: repeat(5, 1fr);
  gap: 1px;
  padding: 4px 2px 6px;
}

.messenger-emoji-picker--mobile .messenger-emoji-picker__sticker-emoji {
  font-size: 2.35rem;
}

.messenger-emoji-picker__tab-icon {
  font-size: 1.35rem;
  line-height: 1;
}

.messenger-emoji-picker--mobile .messenger-emoji-picker__gif-grid {
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
}

.stk-hold-gif {
  max-width: min(72vw, 280px);
  max-height: min(42vh, 240px);
  object-fit: contain;
  border-radius: 0;
  background: #000;
}

@media (min-width: 1024px) {
  .messenger-emoji-picker__cells {
    padding: 6px 4px 8px;
  }

  .messenger-emoji-picker__cell:hover {
    background-color: rgba(51, 144, 236, 0.08);
  }
}

.messenger-emoji-picker__gif-cell.is-skel {
  background: linear-gradient(110deg, rgba(120,140,160,0.18) 25%, rgba(120,140,160,0.32) 37%, rgba(120,140,160,0.18) 63%);
  background-size: 200% 100%;
  animation: gif-skel 1.15s ease-in-out infinite;
}

@keyframes gif-skel {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.stk-hold-root {
  background: rgba(0, 0, 0, 0.42);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 24px;
  gap: 22px;
}
.stk-hold-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
}
.stk-hold-emoji {
  font-size: 6.5rem;
  line-height: 1;
  filter: drop-shadow(0 12px 28px rgba(0, 0, 0, 0.35));
}
.stk-hold-img {
  max-width: min(200px, 70vw);
  max-height: min(200px, 45vh);
  object-fit: contain;
  filter: drop-shadow(0 12px 28px rgba(0, 0, 0, 0.35));
}
.stk-hold-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 14px;
}
.stk-hold-btn {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(16px) saturate(1.3);
  -webkit-backdrop-filter: blur(16px) saturate(1.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16);
  -webkit-tap-highlight-color: transparent;
}
.stk-hold-btn svg {
  width: 22px;
  height: 22px;
}
.stk-hold-btn.is-danger {
  color: #ff8a80;
}
.stk-hold-enter-active, .stk-hold-leave-active { transition: opacity .18s ease; }
.stk-hold-enter-from, .stk-hold-leave-to { opacity: 0; }

/* ===== Sidebar (Telegram Web right rail) ===== */
.messenger-emoji-picker--sidebar {
  --dock-clearance: 0px;
  background: var(--tg-bg-panel, #ffffff);
}
.dark .messenger-emoji-picker--sidebar,
:global(.dark) .messenger-emoji-picker--sidebar {
  background: #17212b;
}
.messenger-emoji-picker--sidebar .messenger-emoji-picker__grid {
  padding-bottom: 8px;
}
.messenger-emoji-picker--sidebar .messenger-emoji-picker__cells {
  grid-template-columns: repeat(8, minmax(0, 1fr));
  gap: 0;
  padding: 0;
}
.messenger-emoji-picker--sidebar .messenger-emoji-picker__cell {
  height: 38px;
  min-height: 38px;
  max-height: 38px;
  font-size: 22px;
  border-radius: 6px;
  overflow: hidden;
}
.messenger-emoji-picker--sidebar .messenger-emoji-picker__sticker-cells {
  grid-template-columns: repeat(5, 1fr);
  gap: 2px;
  padding: 0;
}
.messenger-emoji-picker__section-title {
  position: sticky;
  top: 0;
  z-index: 2;
  margin: 0;
  padding: 8px 10px 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--tg-text-secondary, #707579);
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.96) 60%,
    rgba(255, 255, 255, 0)
  );
}
.dark .messenger-emoji-picker__section-title,
:global(.dark) .messenger-emoji-picker__section-title {
  color: #8b98a5;
  background: linear-gradient(
    to bottom,
    rgba(23, 33, 43, 0.96) 60%,
    rgba(23, 33, 43, 0)
  );
}
.messenger-emoji-picker__cat-tip {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 6px);
  transform: translateX(-50%) scale(0.94);
  padding: 5px 9px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  color: #fff;
  background: rgba(28, 39, 51, 0.92);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  pointer-events: none;
  z-index: 30;
}
.cat-tip-enter-active,
.cat-tip-leave-active {
  transition: opacity 0.14s ease, transform 0.14s cubic-bezier(0.22, 1, 0.36, 1);
}
.cat-tip-enter-from,
.cat-tip-leave-to {
  opacity: 0;
  transform: translateX(-50%) scale(0.88);
}
.cat-tip-enter-to,
.cat-tip-leave-from {
  opacity: 1;
  transform: translateX(-50%) scale(1);
}

.messenger-emoji-picker__bottom-bar {
  flex-shrink: 0;
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
  gap: 4px;
  min-height: 48px;
  padding: 4px 8px calc(4px + env(safe-area-inset-bottom, 0px));
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  background: #f7f8f9;
}
.dark .messenger-emoji-picker__bottom-bar,
:global(.dark) .messenger-emoji-picker__bottom-bar {
  border-top-color: rgba(255, 255, 255, 0.08);
  background: #0e1621;
}
.messenger-emoji-picker__settings-btn,
.messenger-emoji-picker__bottom-backspace,
.messenger-emoji-picker__bottom-spacer {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  color: #707579;
  border-radius: 10px;
  justify-self: center;
}
.dark .messenger-emoji-picker__settings-btn,
.dark .messenger-emoji-picker__bottom-backspace {
  color: #8b98a5;
}
.messenger-emoji-picker__settings-btn:hover,
.messenger-emoji-picker__bottom-backspace:hover {
  color: var(--tg-blue, #3390ec);
  background: rgba(51, 144, 236, 0.1);
}
.messenger-emoji-picker__settings-btn svg,
.messenger-emoji-picker__bottom-backspace svg {
  width: 20px;
  height: 20px;
}
.messenger-emoji-picker__bottom-tabs {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 2px;
  min-width: 0;
}
.messenger-emoji-picker__bottom-tab {
  position: relative;
  flex: 0 0 auto;
  height: 40px;
  padding: 0 12px;
  font-size: 13px;
  font-weight: 650;
  color: #707579;
  white-space: nowrap;
}
.dark .messenger-emoji-picker__bottom-tab {
  color: #8b98a5;
}
.messenger-emoji-picker__bottom-tab.is-active {
  color: var(--tg-blue, #3390ec);
}
.dark .messenger-emoji-picker__bottom-tab.is-active {
  color: #6ab2f2;
}
.messenger-emoji-picker__bottom-tab.is-active::after {
  content: '';
  position: absolute;
  left: 8px;
  right: 8px;
  bottom: 0;
  height: 2px;
  border-radius: 2px 2px 0 0;
  background: var(--tg-blue, #3390ec);
}
.dark .messenger-emoji-picker__bottom-tab.is-active::after {
  background: #6ab2f2;
}

</style>
